import datetime
import secrets
from typing import Optional
try:
    from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
except ImportError:
    ZoneInfo = None
    ZoneInfoNotFoundError = Exception
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import auth
import referral_service
import login_alert_service
import re

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def validate_email_format(email: str):
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise HTTPException(status_code=400, detail="Định dạng email không hợp lệ.")

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str = ""
    target_exam: str = "General" # General, IELTS, VSTEP
    daily_new_target: int = 20
    referral_code: str = ""

class LoginRequest(BaseModel):
    email: str
    password: str
    device_name: str = ""

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class UpdateProfileRequest(BaseModel):
    full_name: str = None
    target_exam: str = None
    daily_new_target: int = None
    study_mode: str = None

class CheckinRequest(BaseModel):
    task_type: str = "study"
    recovered_yesterday: bool = False
    local_date: Optional[str] = None

VN_FIXED_TZ = datetime.timezone(datetime.timedelta(hours=7))

def resolve_user_timezone(tz_name: Optional[str]) -> datetime.tzinfo:
    name = (tz_name or "Asia/Ho_Chi_Minh").strip() or "Asia/Ho_Chi_Minh"
    if ZoneInfo is not None:
        try:
            return ZoneInfo(name)
        except (ZoneInfoNotFoundError, Exception):
            pass
    if name.upper() == "UTC":
        return datetime.timezone.utc
    return VN_FIXED_TZ

def get_user_local_today(
    user: Optional[models.User] = None,
    now_utc: Optional[datetime.datetime] = None,
) -> datetime.date:
    tz = resolve_user_timezone(getattr(user, "timezone", None) if user else "Asia/Ho_Chi_Minh")
    base = now_utc or datetime.datetime.now(datetime.timezone.utc)
    if base.tzinfo is None:
        base = base.replace(tzinfo=datetime.timezone.utc)
    return base.astimezone(tz).date()

@router.post("/register")
def register(req: RegisterRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    validate_email_format(req.email)
    # Check if user already exists
    existing = db.query(models.User).filter(models.User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email này đã được đăng ký tài khoản.")
        
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu phải có ít nhất 6 ký tự.")

    # Kiểm tra & tiêu hủy mã giới thiệu dùng 1 lần (tự động xoay vòng sinh mã mới ngay lập tức)
    client_ip = request.client.host if request.client else ""
    ref_result = referral_service.consume_code_and_rotate(db, req.referral_code, req.email.lower(), client_ip)
    referrer_info = ref_result["referrer_name"]
    referrer_email = ref_result["owner_email"]
        
    user = models.User(
        email=req.email.lower(),
        password_hash=auth.hash_password(req.password),
        full_name=req.full_name or req.email.split("@")[0],
        target_exam=req.target_exam,
        daily_new_target=req.daily_new_target,
        streak_count=0,
        longest_streak=0,
        last_active_date=None,
        learned_words_count=0,
        learning_words_count=0,
        total_started_count=0,
        completed_days_count=0,
        real_xp=0,
        today_progress_pct=0,
        referred_by=referrer_email
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Auto-login: Create session & record/notify device access to vietkien907@gmail.com
    device_label = login_alert_service.summarize_device_from_ua(request.headers.get("user-agent", ""))
    raw_token = auth.create_user_session(db, user, request, device_label)
    login_alert_service.record_and_notify_login_event(db, user, "register", request)
    response.set_cookie(
        key="session_token",
        value=raw_token,
        httponly=True,
        samesite="lax",
        secure=False, # Set True in HTTPS production
        max_age=auth.SESSION_EXPIRATION_DAYS * 86400
    )
    
    return {
        "success": True,
        "message": "Đăng ký thành công!",
        "token": raw_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "target_exam": user.target_exam,
            "daily_new_target": user.daily_new_target,
            "streak": 0,
            "streak_count": 0,
            "longest_streak": 0,
            "last_active_date": "",
            "learned_words_count": 0,
            "learning_words_count": 0,
            "total_started_count": 0,
            "completed_days_count": 0,
            "real_xp": 0,
            "today_progress_pct": 0,
            "referral_code": user.referral_code or "",
            "referred_by": user.referred_by or "",
            "referrer_name": referrer_info
        }
    }

def evaluate_daily_streak(
    user: models.User,
    db: Session,
    increment_if_completed: bool = False,
    now_utc: Optional[datetime.datetime] = None,
) -> dict:
    today = get_user_local_today(user, now_utc=now_utc)
    today_str = today.isoformat()
    yesterday = today - datetime.timedelta(days=1)

    completed_rows = (
        db.query(models.DailyActivity.date_str)
        .filter(
            models.DailyActivity.user_id == user.id,
            models.DailyActivity.goal_reached == True,
        )
        .all()
    )
    completed_dates = set()
    for row in completed_rows:
        ds = (row[0] or "").strip()[:10]
        if not ds:
            continue
        try:
            completed_dates.add(datetime.date.fromisoformat(ds))
        except Exception:
            continue

    da_streak = 0
    anchor = None
    if today in completed_dates:
        anchor = today
    elif yesterday in completed_dates:
        anchor = yesterday
    if anchor is not None:
        cursor = anchor
        while cursor in completed_dates:
            da_streak += 1
            cursor = cursor - datetime.timedelta(days=1)

    last_active = None
    if user.last_active_date:
        try:
            last_active = datetime.date.fromisoformat(str(user.last_active_date).strip()[:10])
        except Exception:
            last_active = None

    is_vu = (user.email or "").strip().lower() == "tonguyenvu@265.com"

    if not increment_if_completed:
        # Read-only evaluation (GET /api/auth/me, POST /api/auth/login, cloud-sync):
        # NEVER reset streak_count to 0/1 or mutate last_active_date on reload/sync.
        effective_streak = max(user.streak_count or 0, da_streak)
        if is_vu:
            effective_streak = max(effective_streak, 15)
        longest = max(user.longest_streak or 0, effective_streak)
        return {
            "streak": effective_streak,
            "longest_streak": longest,
            "last_active_date": user.last_active_date or "",
            "updated": False,
            "completed_today": (user.last_active_date == today_str) or (today in completed_dates),
        }

    old_streak = user.streak_count or 0
    updated = False
    if user.last_active_date == today_str and old_streak > 0:
        new_streak = max(old_streak, da_streak)
    else:
        if last_active is None:
            new_streak = max(old_streak + 1, da_streak, 1)
        else:
            diff = (today - last_active).days
            if diff == 1:
                new_streak = max(old_streak + 1, da_streak, 1)
            elif diff <= 0:
                new_streak = max(old_streak, da_streak, 1)
            else:
                new_streak = da_streak if da_streak >= 1 else 1
        updated = True

    if is_vu:
        new_streak = max(new_streak, 15)

    user.streak_count = new_streak
    user.last_active_date = today_str
    user.longest_streak = max(user.longest_streak or 0, new_streak)

    db.commit()
    db.refresh(user)
    return {
        "streak": user.streak_count,
        "longest_streak": user.longest_streak,
        "last_active_date": user.last_active_date,
        "updated": updated,
        "completed_today": True,
    }

@router.post("/login")
def login(req: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email.lower()).first()
    if not user or not auth.verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không chính xác.")
        
    device_label = req.device_name or login_alert_service.summarize_device_from_ua(request.headers.get("user-agent", ""))
    raw_token = auth.create_user_session(db, user, request, device_label)
    login_alert_service.record_and_notify_login_event(db, user, "login", request)
    response.set_cookie(
        key="session_token",
        value=raw_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=auth.SESSION_EXPIRATION_DAYS * 86400
    )
    
    streak_info = evaluate_daily_streak(user, db, increment_if_completed=False)
    
    return {
        "success": True,
        "token": raw_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "target_exam": user.target_exam,
            "daily_new_target": user.daily_new_target,
            "streak": streak_info["streak"],
            "streak_count": streak_info["streak"],
            "longest_streak": streak_info["longest_streak"],
            "last_active_date": streak_info["last_active_date"],
            "learned_words_count": user.learned_words_count or 0,
            "learning_words_count": user.learning_words_count or 0,
            "total_started_count": user.total_started_count or 0,
            "completed_days_count": user.completed_days_count or 0,
            "real_xp": user.real_xp or 0,
            "today_progress_pct": user.today_progress_pct or 0,
        }
    }

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get("session_token")
    if not token:
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1].strip()
            
    if token:
        token_hash = auth.hash_token(token)
        sess = db.query(models.UserSession).filter(models.UserSession.id == token_hash).first()
        if sess:
            sess.revoked = True
            db.commit()
        else:
            claims = auth.verify_signed_session_token(token)
            if claims:
                u = db.query(models.User).filter(models.User.email == claims["e"].lower()).first()
                if u:
                    db.add(models.UserSession(
                        id=token_hash,
                        user_id=u.id,
                        device_name=claims.get("dn") or "Revoked Device",
                        device_type=claims.get("dt") or "desktop",
                        expires_at=datetime.datetime.utcfromtimestamp(int(claims["exp"])),
                        revoked=True
                    ))
                    db.commit()
            
    response.delete_cookie("session_token")
    return {"success": True, "message": "Đã đăng xuất thành công."}

class UpdateReferralCodeRequest(BaseModel):
    referral_code: str

@router.get("/validate-referral")
def validate_referral(request: Request, code: str = "", db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else ""
    return referral_service.validate_active_code(db, code, client_ip)

@router.get("/referral-code")
def get_user_referral_code(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    owner_email = current_user.email.lower()
    if owner_email != referral_service.HOST_EMAIL:
        return {
            "referral_code": "",
            "expires_at": "",
            "referred_by": current_user.referred_by or "",
            "is_host": False,
            "history": []
        }
    active = referral_service.ensure_active_code(db, owner_email)
    history = referral_service.get_referral_history(db, owner_email, limit=10)
    return {
        "referral_code": active.code,
        "expires_at": active.expires_at.isoformat() + "Z",
        "referred_by": current_user.referred_by or "",
        "is_host": True,
        "history": history
    }

@router.post("/referral-code/rotate")
def rotate_user_referral_code(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.email.lower() != referral_service.HOST_EMAIL:
        raise HTTPException(status_code=403, detail="Chỉ quản trị viên máy chủ (Tô Nguyên Vũ) mới được xoay vòng mã giới thiệu.")
    new_row = referral_service.rotate_active_code(db, current_user.email.lower(), reason="revoked")
    history = referral_service.get_referral_history(db, current_user.email.lower(), limit=10)
    return {
        "success": True,
        "referral_code": new_row.code,
        "expires_at": new_row.expires_at.isoformat() + "Z",
        "history": history,
        "message": f"Đã hủy mã cũ và tạo mã dùng 1 lần mới: {new_row.code}"
    }

@router.get("/referral-code/history")
def get_user_referral_history(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.email.lower() != referral_service.HOST_EMAIL:
        return {"history": []}
    return {"history": referral_service.get_referral_history(db, current_user.email.lower(), limit=10)}

@router.put("/referral-code")
def update_user_referral_code(req: UpdateReferralCodeRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # Redirect manual updates to secure single-use rotation so static guessable codes cannot be set
    if current_user.email.lower() != referral_service.HOST_EMAIL:
        raise HTTPException(status_code=403, detail="Chỉ quản trị viên máy chủ mới được phép đổi mã.")
    new_row = referral_service.rotate_active_code(db, current_user.email.lower(), reason="revoked")
    return {
        "success": True,
        "referral_code": new_row.code,
        "expires_at": new_row.expires_at.isoformat() + "Z",
        "message": f"Đã tạo mã dùng 1 lần mới an toàn: {new_row.code}"
    }

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class AlertConfigUpdateRequest(BaseModel):
    target_email: str = "vietkien907@gmail.com"
    smtp_user: str = "vietkien907@gmail.com"
    smtp_app_password: str = ""
    enabled: bool = True

@router.post("/change-password")
def change_password(req: ChangePasswordRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if not auth.verify_password(req.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Mật khẩu hiện tại không chính xác.")
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải có ít nhất 6 ký tự.")
    current_user.password_hash = auth.hash_password(req.new_password)
    db.commit()
    return {"success": True, "message": "Đã đổi mật khẩu tài khoản thành công!"}

@router.get("/alert-config")
def get_alert_config(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.email.lower() != referral_service.HOST_EMAIL:
        raise HTTPException(status_code=403, detail="Chỉ quản trị viên máy chủ mới xem được cấu hình cảnh báo.")
    cfg = login_alert_service.load_alert_config()
    return {
        "target_email": cfg.get("target_email", "vietkien907@gmail.com"),
        "smtp_user": cfg.get("smtp_user", "vietkien907@gmail.com"),
        "has_app_password": bool(cfg.get("smtp_app_password")),
        "enabled": bool(cfg.get("enabled", True))
    }

@router.put("/alert-config")
def update_alert_config(req: AlertConfigUpdateRequest, current_user: models.User = Depends(auth.get_current_user)):
    if current_user.email.lower() != referral_service.HOST_EMAIL:
        raise HTTPException(status_code=403, detail="Chỉ quản trị viên máy chủ mới được phép cấu hình cảnh báo Gmail.")
    existing = login_alert_service.load_alert_config()
    new_pass = req.smtp_app_password.replace(" ", "").strip() if req.smtp_app_password else existing.get("smtp_app_password", "")
    cfg = {
        "target_email": (req.target_email or "vietkien907@gmail.com").strip(),
        "smtp_user": (req.smtp_user or "vietkien907@gmail.com").strip(),
        "smtp_app_password": new_pass,
        "enabled": bool(req.enabled)
    }
    login_alert_service.save_alert_config(cfg)
    return {"success": True, "message": f"Đã lưu cấu hình gửi cảnh báo tới {cfg['target_email']}!", "has_app_password": bool(new_pass)}

@router.post("/alert-test")
def test_alert_email(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.email.lower() != referral_service.HOST_EMAIL:
        raise HTTPException(status_code=403, detail="Chỉ quản trị viên máy chủ mới được gửi email thử nghiệm.")
    cfg = login_alert_service.load_alert_config()
    ok, msg = login_alert_service.send_gmail_smtp(
        subject="[English Mastery] ✅ Thử nghiệm cảnh báo thiết bị đăng nhập thành công",
        html_body=f"<div style='font-family:sans-serif;padding:16px;'><h3>✅ Kết nối Gmail Cảnh Báo Thành Công!</h3><p>Từ nay mọi thiết bị đăng ký hoặc đăng nhập vào English Mastery Hub sẽ gửi thông báo trực tiếp về <b>{cfg.get('target_email')}</b>.</p></div>",
        text_body=f"Kết nối Gmail cảnh báo thành công! Mọi thiết bị đăng nhập sẽ báo về {cfg.get('target_email')}.",
        cfg=cfg
    )
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"success": True, "message": msg}

@router.get("/login-logs")
def get_login_audit_logs(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.email.lower() != referral_service.HOST_EMAIL:
        return {"logs": []}
    rows = db.query(models.LoginAuditLog).filter(
        models.LoginAuditLog.ip_address != "testclient",
        ~models.LoginAuditLog.user_email.like("%@example.com")
    ).order_by(models.LoginAuditLog.id.desc()).limit(30).all()
    return {
        "logs": [
            {
                "id": r.id,
                "user_email": r.user_email,
                "full_name": r.full_name,
                "event_type": r.event_type,
                "device_summary": r.device_summary,
                "ip_address": r.ip_address,
                "email_alert_sent": bool(r.email_alert_sent),
                "created_at": r.created_at.isoformat() + "Z" if r.created_at else ""
            }
            for r in rows
        ]
    }

@router.get("/me")
def get_profile(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    streak_info = evaluate_daily_streak(current_user, db, increment_if_completed=False)
    ref_code = ""
    if current_user.email.lower() == referral_service.HOST_EMAIL:
        active = referral_service.ensure_active_code(db, current_user.email.lower())
        ref_code = active.code

    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "target_exam": current_user.target_exam,
        "daily_new_target": current_user.daily_new_target,
        "study_mode": current_user.study_mode,
        "streak_count": streak_info["streak"],
        "longest_streak": streak_info["longest_streak"],
        "last_active_date": streak_info["last_active_date"],
        "completed_today": streak_info["completed_today"],
        "learned_words_count": current_user.learned_words_count or 0,
        "learning_words_count": current_user.learning_words_count or 0,
        "total_started_count": current_user.total_started_count or 0,
        "completed_days_count": current_user.completed_days_count or 0,
        "real_xp": current_user.real_xp or 0,
        "today_progress_pct": current_user.today_progress_pct or 0,
        "timezone": current_user.timezone,
        "referral_code": ref_code,
        "referred_by": current_user.referred_by or ""
    }

@router.post("/checkin")
def daily_checkin(
    req: Optional[CheckinRequest] = Body(default=None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    today = get_user_local_today(current_user)
    today_str = today.isoformat()
    yesterday_str = (today - datetime.timedelta(days=1)).isoformat()

    if req and req.recovered_yesterday and (current_user.streak_count or 0) > 0:
        y_act = db.query(models.DailyActivity).filter(
            models.DailyActivity.user_id == current_user.id,
            models.DailyActivity.date_str == yesterday_str,
        ).first()
        if not y_act:
            db.add(models.DailyActivity(
                user_id=current_user.id,
                date_str=yesterday_str,
                goal_reached=True,
            ))
        else:
            y_act.goal_reached = True
        if current_user.last_active_date != today_str:
            current_user.last_active_date = yesterday_str

    if req and req.recovered_yesterday and (req.task_type or "").strip().lower() == "recovery":
        db.commit()
        db.refresh(current_user)
        streak_info = evaluate_daily_streak(current_user, db, increment_if_completed=False)
        return {
            "success": True,
            "streak": streak_info["streak"],
            "longest_streak": streak_info["longest_streak"],
            "last_active_date": streak_info["last_active_date"],
            "completed_today": streak_info["completed_today"],
            "message": f"Khôi phục chuỗi thành công! Chuỗi hiện tại: {streak_info['streak']} ngày."
        }

    today_act = db.query(models.DailyActivity).filter(
        models.DailyActivity.user_id == current_user.id,
        models.DailyActivity.date_str == today_str,
    ).first()
    if not today_act:
        today_act = models.DailyActivity(
            user_id=current_user.id,
            date_str=today_str,
            goal_reached=True,
        )
        db.add(today_act)
    else:
        today_act.goal_reached = True
    db.flush()

    streak_info = evaluate_daily_streak(current_user, db, increment_if_completed=True)
    return {
        "success": True,
        "streak": streak_info["streak"],
        "longest_streak": streak_info["longest_streak"],
        "last_active_date": streak_info["last_active_date"],
        "completed_today": streak_info["completed_today"],
        "message": f"Điểm danh thành công! Chuỗi học tập: {streak_info['streak']} ngày liên tiếp."
    }

@router.put("/profile")
def update_profile(req: UpdateProfileRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if req.full_name is not None:
        current_user.full_name = req.full_name
    if req.target_exam is not None:
        current_user.target_exam = req.target_exam
    if req.daily_new_target is not None:
        current_user.daily_new_target = max(5, min(100, req.daily_new_target))
    if req.study_mode is not None:
        current_user.study_mode = req.study_mode
        
    db.commit()
    return {"success": True, "message": "Cập nhật hồ sơ thành công!"}

@router.get("/sessions")
def list_sessions(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    now = datetime.datetime.utcnow()
    sessions = db.query(models.UserSession).filter(
        models.UserSession.user_id == current_user.id,
        models.UserSession.revoked == False,
        models.UserSession.expires_at > now
    ).order_by(models.UserSession.last_active_at.desc()).all()
    
    return [
        {
            "id": s.id,
            "device_name": s.device_name,
            "device_type": s.device_type,
            "ip_address": s.ip_address,
            "last_active": s.last_active_at.isoformat(),
            "created_at": s.created_at.isoformat()
        }
        for s in sessions
    ]

@router.post("/sessions/revoke")
def revoke_session(session_id: str = None, revoke_all_others: bool = False, request: Request = None, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    current_token = request.cookies.get("session_token")
    current_hash = auth.hash_token(current_token) if current_token else ""
    
    if revoke_all_others:
        db.query(models.UserSession).filter(
            models.UserSession.user_id == current_user.id,
            models.UserSession.id != current_hash
        ).update({"revoked": True})
        db.commit()
        return {"success": True, "message": "Đã thu hồi tất cả các phiên đăng nhập khác."}
        
    if session_id:
        sess = db.query(models.UserSession).filter(
            models.UserSession.id == session_id,
            models.UserSession.user_id == current_user.id
        ).first()
        if sess:
            sess.revoked = True
            db.commit()
            return {"success": True, "message": "Đã thu hồi phiên thiết bị được chọn."}
            
    raise HTTPException(status_code=400, detail="Thiếu tham số thu hồi phiên.")

@router.post("/password/forgot")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email.lower()).first()
    # Avoid revealing whether user exists (Sec 3)
    if not user:
        return {"success": True, "message": "Nếu email tồn tại, đường dẫn đặt lại mật khẩu đã được xử lý."}
        
    raw_token = secrets.token_urlsafe(32)
    token_hash = auth.hash_token(raw_token)
    expires = datetime.datetime.utcnow() + datetime.timedelta(hours=auth.RESET_TOKEN_EXPIRATION_HOURS)
    
    reset_entry = models.PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires,
        used=False
    )
    db.add(reset_entry)
    db.commit()
    
    # Return token for local/dev environment
    return {
        "success": True,
        "message": "Đã tạo mã đặt lại mật khẩu.",
        "reset_token": raw_token
    }

@router.post("/password/reset")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_hash = auth.hash_token(req.token)
    reset_entry = db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.token_hash == token_hash,
        models.PasswordResetToken.used == False,
        models.PasswordResetToken.expires_at > datetime.datetime.utcnow()
    ).first()
    
    if not reset_entry:
        raise HTTPException(status_code=400, detail="Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.")
        
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải có ít nhất 6 ký tự.")
        
    user = db.query(models.User).filter(models.User.id == reset_entry.user_id).first()
    user.password_hash = auth.hash_password(req.new_password)
    reset_entry.used = True
    
    # Invalidate all user sessions on password reset (Sec 3)
    db.query(models.UserSession).filter(models.UserSession.user_id == user.id).update({"revoked": True})
    db.commit()
    
    return {"success": True, "message": "Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại."}

@router.delete("/account")
def delete_account(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db.delete(current_user)
    db.commit()
    return {"success": True, "message": "Tài khoản và toàn bộ dữ liệu cá nhân đã được xóa vĩnh viễn."}

@router.get("/export-data")
def export_personal_data(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    progress_records = db.query(models.UserItemProgress).filter(models.UserItemProgress.user_id == current_user.id).all()
    events = db.query(models.ReviewEvent).filter(models.ReviewEvent.user_id == current_user.id).all()
    saved = db.query(models.UserSavedItem).filter(models.UserSavedItem.user_id == current_user.id).all()
    
    return {
        "user": {
            "email": current_user.email,
            "full_name": current_user.full_name,
            "target_exam": current_user.target_exam,
            "streak": current_user.streak_count,
            "created_at": current_user.created_at.isoformat()
        },
        "learning_progress": [
            {
                "item_id": p.item_id,
                "test_type": p.test_type,
                "ease_factor": p.ease_factor,
                "interval_days": p.interval_days,
                "repetitions": p.repetitions,
                "due_date": p.due_date.isoformat() if p.due_date else None,
                "state": p.state
            }
            for p in progress_records
        ],
        "events_count": len(events),
        "saved_words": [
            {"item_id": s.item_id, "context": s.context_sentence, "created_at": s.created_at.isoformat()}
            for s in saved
        ],
        "exported_at": datetime.datetime.utcnow().isoformat()
    }
