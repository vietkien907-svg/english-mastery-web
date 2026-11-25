import datetime
import secrets
from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
import models

HOST_EMAIL = "tonguyenvu@265.com"
HOST_NAME = "Tô Nguyên Vũ"
CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # Unambiguous chars (no 0/O/1/I)
CODE_TTL_HOURS = 24

# In-memory brute-force protection: IP -> list of failed UTC timestamps
_FAILED_ATTEMPTS: dict[str, list[datetime.datetime]] = {}
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_WINDOW_MINUTES = 15


def reset_rate_limiter():
    """Helper for automated tests."""
    _FAILED_ATTEMPTS.clear()


def _prune_attempts(ip: str, now: datetime.datetime):
    cutoff = now - datetime.timedelta(minutes=LOCKOUT_WINDOW_MINUTES)
    entries = _FAILED_ATTEMPTS.get(ip, [])
    entries = [ts for ts in entries if ts > cutoff]
    if entries:
        _FAILED_ATTEMPTS[ip] = entries
    elif ip in _FAILED_ATTEMPTS:
        del _FAILED_ATTEMPTS[ip]


def check_ip_rate_limit(ip: str):
    if not ip:
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


def _generate_unique_code(db: Session) -> str:
    for _ in range(20):
        suffix = "".join(secrets.choice(CODE_ALPHABET) for _ in range(6))
        candidate = f"VU-{suffix}"
        exists = db.query(models.ReferralCode).filter(models.ReferralCode.code == candidate).first()
        if not exists:
            return candidate
    return f"VU-{secrets.token_hex(4).upper()}"


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
    """Returns the single live active code for owner_email, auto-generating a fresh 24h code if none exists or expired."""
    clean_owner = owner_email.lower()
    _expire_stale_codes(db, clean_owner)

    active = db.query(models.ReferralCode).filter(
        models.ReferralCode.owner_email == clean_owner,
        models.ReferralCode.status == "active"
    ).order_by(models.ReferralCode.id.desc()).first()

    if active:
        return active

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

    # Keep User.referral_code synced for quick display
    owner = db.query(models.User).filter(models.User.email == clean_owner).first()
    if owner:
        owner.referral_code = new_code.code
        db.commit()

    return new_code


def rotate_active_code(db: Session, owner_email: str = HOST_EMAIL, reason: str = "revoked") -> models.ReferralCode:
    """Revokes any currently active code(s) for owner_email and immediately issues a fresh one-time 24h code."""
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
    """Checks if raw_code is currently active & unexpired (does NOT consume it)."""
    check_ip_rate_limit(client_ip)
    clean_code = (raw_code or "").strip().upper()
    if not clean_code:
        return {"valid": False, "code": "", "message": "Vui lòng nhập mã giới thiệu dùng 1 lần từ máy chủ."}

    _expire_stale_codes(db, HOST_EMAIL)
    ensure_active_code(db, HOST_EMAIL)

    row = db.query(models.ReferralCode).filter(models.ReferralCode.code == clean_code).first()
    if not row:
        record_failed_attempt(client_ip)
        return {
            "valid": False,
            "code": clean_code,
            "message": "Mã giới thiệu không tồn tại hoặc đã bị hủy. Vui lòng xin mã mới nhất từ Tô Nguyên Vũ."
        }

    now = datetime.datetime.utcnow()
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
            "message": "Mã giới thiệu này đã bị máy chủ thu hồi. Vui lòng xin mã mới."
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

    owner = db.query(models.User).filter(models.User.email == row.owner_email).first()
    referrer_name = owner.full_name if owner else HOST_NAME
    clear_failed_attempts(client_ip)
    return {
        "valid": True,
        "code": row.code,
        "owner_email": row.owner_email,
        "referrer_name": referrer_name,
        "expires_at": row.expires_at.isoformat() + "Z",
        "message": f"Mã dùng 1 lần hợp lệ! Người giới thiệu: {referrer_name}"
    }


def consume_code_and_rotate(db: Session, raw_code: str, used_by_email: str, client_ip: str = "") -> dict:
    """
    Atomically validates, burns (`status='used'`) the one-time referral code,
    and immediately rotates to a brand-new active code for the owner.
    Raises HTTPException(400/429) if invalid, reused, expired, or rate-limited.
    """
    check_ip_rate_limit(client_ip)
    clean_code = (raw_code or "").strip().upper()
    if not clean_code:
        raise HTTPException(status_code=400, detail="Vui lòng nhập mã giới thiệu dùng 1 lần từ máy chủ (Tô Nguyên Vũ).")

    _expire_stale_codes(db, HOST_EMAIL)
    ensure_active_code(db, HOST_EMAIL)

    row = db.query(models.ReferralCode).filter(models.ReferralCode.code == clean_code).first()
    now = datetime.datetime.utcnow()

    if not row:
        record_failed_attempt(client_ip)
        raise HTTPException(
            status_code=400,
            detail="Mã giới thiệu không chính xác hoặc không tồn tại. Vui lòng xin mã mới nhất từ Tô Nguyên Vũ."
        )

    if row.status == "used":
        record_failed_attempt(client_ip)
        raise HTTPException(
            status_code=400,
            detail="Mã giới thiệu này đã có người dùng trước đó! Mỗi mã chỉ dùng 1 lần duy nhất, hãy xin mã mới."
        )

    if row.status == "revoked":
        record_failed_attempt(client_ip)
        raise HTTPException(
            status_code=400,
            detail="Mã giới thiệu này đã bị hủy bởi máy chủ. Vui lòng xin mã mới."
        )

    if row.status == "expired" or row.expires_at <= now:
        row.status = "expired"
        db.commit()
        ensure_active_code(db, row.owner_email)
        record_failed_attempt(client_ip)
        raise HTTPException(
            status_code=400,
            detail="Mã giới thiệu này đã quá hạn 24 giờ. Máy chủ đã tự sinh mã mới, vui lòng liên hệ Tô Nguyên Vũ."
        )

    # Burn this code permanently
    row.status = "used"
    row.used_by_email = used_by_email.lower()
    row.used_at = now
    db.commit()
    clear_failed_attempts(client_ip)

    # Immediately auto-generate the next fresh one-time code for the host
    next_code_row = ensure_active_code(db, row.owner_email)
    owner = db.query(models.User).filter(models.User.email == row.owner_email).first()
    referrer_name = owner.full_name if owner else HOST_NAME

    return {
        "burned_code": row.code,
        "next_active_code": next_code_row.code,
        "owner_email": row.owner_email,
        "referrer_name": referrer_name
    }


def get_referral_history(db: Session, owner_email: str = HOST_EMAIL, limit: int = 10) -> list[dict]:
    rows = db.query(models.ReferralCode).filter(
        models.ReferralCode.owner_email == owner_email.lower(),
        models.ReferralCode.status != "active"
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
