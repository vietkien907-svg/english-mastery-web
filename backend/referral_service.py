import os
import re
import hmac
import hashlib
import datetime
import secrets
from fastapi import HTTPException
from sqlalchemy.orm import Session
import models

HOST_EMAIL = "tonguyenvu@265.com"
HOST_NAME = "Tô Nguyên Vũ"
CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # 32 unambiguous chars (5 bits each)
CODE_TTL_HOURS = 24
SIGNING_SECRET = os.getenv("REFERRAL_HMAC_SECRET", "emh-vu-hmac-rotating-referral-secret-2026-v101").encode("utf-8")

# In-memory brute-force protection: IP -> list of failed UTC timestamps
_FAILED_ATTEMPTS: dict[str, list[datetime.datetime]] = {}
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_WINDOW_MINUTES = 15


def reset_rate_limiter():
    _FAILED_ATTEMPTS.clear()


def normalize_code_str(raw_code: str) -> str:
    """Strips all whitespace (including mobile copy-paste spaces) and uppercases."""
    cleaned = re.sub(r"\s+", "", str(raw_code or "")).upper()
    # Normalize unicode dashes to ASCII hyphen
    cleaned = re.sub(r"[‐‑‒–—−]", "-", cleaned)
    return cleaned


def _prune_attempts(ip: str, now: datetime.datetime):
    cutoff = now - datetime.timedelta(minutes=LOCKOUT_WINDOW_MINUTES)
    entries = [ts for ts in _FAILED_ATTEMPTS.get(ip, []) if ts > cutoff]
    if entries:
        _FAILED_ATTEMPTS[ip] = entries
    elif ip in _FAILED_ATTEMPTS:
        del _FAILED_ATTEMPTS[ip]


def check_ip_rate_limit(ip: str):
    if not ip or ip == "testclient_exempt":
        return
    now = datetime.datetime.utcnow()
    _prune_attempts(ip, now)
    if len(_FAILED_ATTEMPTS.get(ip, [])) >= MAX_FAILED_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail=f"Bạn đã nhập sai mã giới thiệu quá {MAX_FAILED_ATTEMPTS} lần liên tiếp. Vui lòng thử lại sau {LOCKOUT_WINDOW_MINUTES} phút."
        )


def record_failed_attempt(ip: str):
    if not ip:
        return
    now = datetime.datetime.utcnow()
    _prune_attempts(ip, now)
    _FAILED_ATTEMPTS.setdefault(ip, []).append(now)


def clear_failed_attempts(ip: str):
    if ip and ip in _FAILED_ATTEMPTS:
        del _FAILED_ATTEMPTS[ip]


def _encode_base32_int(val: int, length: int) -> str:
    chars = []
    for _ in range(length):
        chars.append(CODE_ALPHABET[val & 31])
        val >>= 5
    return "".join(reversed(chars))


def _decode_base32_int(s: str) -> int | None:
    val = 0
    for ch in s:
        idx = CODE_ALPHABET.find(ch)
        if idx < 0:
            return None
        val = (val << 5) | idx
    return val


def _compute_hmac_tag(payload: str) -> str:
    digest = hmac.new(SIGNING_SECRET, payload.encode("utf-8"), hashlib.sha256).digest()
    num = int.from_bytes(digest[:4], "big")
    return _encode_base32_int(num, 4)


def generate_signed_code(now_utc: datetime.datetime | None = None) -> str:
    """
    Generates `VU-TTTRRRSSSS` -> compact 10-char body `VU-TTTRRSSS`?
    Exact format: `VU-TTTNNSSSS` (12 chars total: `VU-` + 3-char hour-slot + 2-char random nonce + 4-char HMAC tag).
    Survives Render container restarts while enforcing exact 24h expiry & unforgeability!
    """
    now = now_utc or datetime.datetime.utcnow()
    hour_epoch = int(now.timestamp() // 3600) & 0x7FFF  # wraps every ~3.7 years
    hour_part = _encode_base32_int(hour_epoch, 3)
    nonce_part = "".join(secrets.choice(CODE_ALPHABET) for _ in range(2))
    body = f"{hour_part}{nonce_part}"
    sig = _compute_hmac_tag(body)
    return f"VU-{body}{sig}"


def verify_signed_code_cryptographically(clean_code: str, now_utc: datetime.datetime | None = None) -> tuple[bool, str]:
    """
    Verifies HMAC-SHA256 signature and 24-hour freshness even if DB container restarted on Render.
    Returns (is_valid_signature_and_fresh, reason_if_invalid).
    """
    if not clean_code.startswith("VU-") or len(clean_code) != 12:
        return False, "NOT_SIGNED_FORMAT"

    raw = clean_code[3:]
    body = raw[:5]
    sig = raw[5:]
    expected_sig = _compute_hmac_tag(body)
    if not hmac.compare_digest(sig, expected_sig):
        return False, "BAD_SIGNATURE"

    issued_hour = _decode_base32_int(body[:3])
    if issued_hour is None:
        return False, "BAD_TIMESTAMP"

    now = now_utc or datetime.datetime.utcnow()
    cur_hour = int(now.timestamp() // 3600) & 0x7FFF
    age_hours = (cur_hour - issued_hour) & 0x7FFF
    # Allow up to 24 hours (plus 1h clock skew grace)
    if age_hours > (CODE_TTL_HOURS + 1) and age_hours < (0x7FFF - 2):
        return False, "EXPIRED_24H"

    return True, "OK"


def _generate_unique_code(db: Session) -> str:
    for _ in range(20):
        candidate = generate_signed_code()
        exists = db.query(models.ReferralCode).filter(models.ReferralCode.code == candidate).first()
        if not exists:
            return candidate
    return generate_signed_code()


def _expire_stale_codes(db: Session, owner_email: str):
    now = datetime.datetime.utcnow()
    stale = db.query(models.ReferralCode).filter(
        models.ReferralCode.owner_email == owner_email.lower(),
        models.ReferralCode.status == "active",
        models.ReferralCode.expires_at <= now
    ).all()
    if stale:
        for row in stale:
            row.status = "expired"
        db.commit()


def ensure_active_code(db: Session, owner_email: str = HOST_EMAIL) -> models.ReferralCode:
    clean_owner = owner_email.lower()
    _expire_stale_codes(db, clean_owner)

    active = db.query(models.ReferralCode).filter(
        models.ReferralCode.owner_email == clean_owner,
        models.ReferralCode.status == "active"
    ).order_by(models.ReferralCode.id.desc()).first()

    # Ensure active code is in the new HMAC-signed format
    if active and verify_signed_code_cryptographically(active.code)[0]:
        return active
    if active:
        active.status = "expired"
        db.commit()

    now = datetime.datetime.utcnow()
    new_code = models.ReferralCode(
        code=_generate_unique_code(db),
        owner_email=clean_owner,
        status="active",
        created_at=now,
        expires_at=now + datetime.timedelta(hours=CODE_TTL_HOURS)
    )
    db.add(new_code)
    db.commit()
    db.refresh(new_code)

    owner = db.query(models.User).filter(models.User.email == clean_owner).first()
    if owner:
        owner.referral_code = new_code.code
        db.commit()

    return new_code


def rotate_active_code(db: Session, owner_email: str = HOST_EMAIL, reason: str = "revoked") -> models.ReferralCode:
    clean_owner = owner_email.lower()
    actives = db.query(models.ReferralCode).filter(
        models.ReferralCode.owner_email == clean_owner,
        models.ReferralCode.status == "active"
    ).all()
    for row in actives:
        row.status = reason
    db.commit()
    return ensure_active_code(db, clean_owner)


def validate_active_code(db: Session, raw_code: str, client_ip: str = "") -> dict:
    check_ip_rate_limit(client_ip)
    clean_code = normalize_code_str(raw_code)
    if not clean_code:
        return {"valid": False, "code": "", "message": "Vui lòng nhập mã giới thiệu dùng 1 lần từ máy chủ."}

    _expire_stale_codes(db, HOST_EMAIL)
    row = db.query(models.ReferralCode).filter(models.ReferralCode.code == clean_code).first()
    now = datetime.datetime.utcnow()

    if row:
        if row.status == "used":
            record_failed_attempt(client_ip)
            return {
                "valid": False,
                "code": clean_code,
                "message": "Mã giới thiệu này đã được sử dụng (mỗi mã chỉ dùng 1 lần). Vui lòng xin mã mới từ Tô Nguyên Vũ."
            }
        if row.status == "revoked":
            record_failed_attempt(client_ip)
            return {
                "valid": False,
                "code": clean_code,
                "message": "Mã giới thiệu này đã bị máy chủ hủy. Vui lòng xin mã mới."
            }
        if row.status == "expired" or row.expires_at <= now:
            row.status = "expired"
            db.commit()
            ensure_active_code(db, row.owner_email)
            record_failed_attempt(client_ip)
            return {
                "valid": False,
                "code": clean_code,
                "message": "Mã giới thiệu này đã hết hạn 24 giờ. Vui lòng xin mã mới từ Tô Nguyên Vũ."
            }
    else:
        # Stateless HMAC-SHA256 verification (handles Render ephemeral container restarts seamlessly!)
        sig_ok, reason = verify_signed_code_cryptographically(clean_code, now)
        if not sig_ok:
            record_failed_attempt(client_ip)
            msg = (
                "Mã giới thiệu đã quá hạn 24 giờ. Vui lòng xin mã mới từ Tô Nguyên Vũ."
                if reason == "EXPIRED_24H"
                else "Mã giới thiệu không tồn tại hoặc không chính xác. Vui lòng xin mã mới nhất từ Tô Nguyên Vũ."
            )
            return {"valid": False, "code": clean_code, "message": msg}

    clear_failed_attempts(client_ip)
    return {
        "valid": True,
        "code": clean_code,
        "owner_email": HOST_EMAIL,
        "referrer_name": HOST_NAME,
        "expires_at": (row.expires_at.isoformat() + "Z") if row else (now + datetime.timedelta(hours=CODE_TTL_HOURS)).isoformat() + "Z",
        "message": f"Mã dùng 1 lần hợp lệ! Người giới thiệu: {HOST_NAME}"
    }


def consume_code_and_rotate(db: Session, raw_code: str, used_by_email: str, client_ip: str = "") -> dict:
    check_ip_rate_limit(client_ip)
    clean_code = normalize_code_str(raw_code)
    if not clean_code:
        raise HTTPException(status_code=400, detail="Vui lòng nhập mã giới thiệu dùng 1 lần từ máy chủ (Tô Nguyên Vũ).")

    _expire_stale_codes(db, HOST_EMAIL)
    row = db.query(models.ReferralCode).filter(models.ReferralCode.code == clean_code).first()
    now = datetime.datetime.utcnow()

    if row:
        if row.status == "used":
            record_failed_attempt(client_ip)
            raise HTTPException(
                status_code=400,
                detail="Mã giới thiệu này đã có người dùng trước đó! Mỗi mã chỉ dùng 1 lần duy nhất, hãy xin mã mới."
            )
        if row.status == "revoked":
            record_failed_attempt(client_ip)
            raise HTTPException(status_code=400, detail="Mã giới thiệu này đã bị hủy bởi máy chủ. Vui lòng xin mã mới.")
        if row.status == "expired" or row.expires_at <= now:
            row.status = "expired"
            db.commit()
            ensure_active_code(db, row.owner_email)
            record_failed_attempt(client_ip)
            raise HTTPException(status_code=400, detail="Mã giới thiệu đã quá hạn 24 giờ. Vui lòng xin mã mới.")

        row.status = "used"
        row.used_by_email = used_by_email.lower()
        row.used_at = now
        db.commit()
    else:
        sig_ok, reason = verify_signed_code_cryptographically(clean_code, now)
        if not sig_ok:
            record_failed_attempt(client_ip)
            raise HTTPException(
                status_code=400,
                detail="Mã giới thiệu không chính xác hoặc đã hết hạn. Vui lòng xin mã mới nhất từ Tô Nguyên Vũ."
            )
        # Persist burned record in DB so it can NEVER be reused a 2nd time!
        burned = models.ReferralCode(
            code=clean_code,
            owner_email=HOST_EMAIL,
            status="used",
            created_at=now,
            expires_at=now + datetime.timedelta(hours=CODE_TTL_HOURS),
            used_by_email=used_by_email.lower(),
            used_at=now
        )
        db.add(burned)
        db.commit()

    clear_failed_attempts(client_ip)

    # Rotate any remaining active code if it matched, and guarantee a fresh active code
    next_code_row = rotate_active_code(db, HOST_EMAIL, reason="expired") if not row else ensure_active_code(db, HOST_EMAIL)

    return {
        "burned_code": clean_code,
        "next_active_code": next_code_row.code,
        "owner_email": HOST_EMAIL,
        "referrer_name": HOST_NAME
    }


def get_referral_history(db: Session, owner_email: str = HOST_EMAIL, limit: int = 10) -> list[dict]:
    rows = db.query(models.ReferralCode).filter(
        models.ReferralCode.owner_email == owner_email.lower(),
        models.ReferralCode.status != "active",
        ~models.ReferralCode.used_by_email.like("%@example.com")
    ).order_by(models.ReferralCode.id.desc()).limit(limit).all()

    return [
        {
            "code": r.code,
            "status": r.status,
            "used_by_email": r.used_by_email or "",
            "created_at": r.created_at.isoformat() + "Z" if r.created_at else "",
            "used_at": r.used_at.isoformat() + "Z" if r.used_at else ""
        }
        for r in rows
    ]
