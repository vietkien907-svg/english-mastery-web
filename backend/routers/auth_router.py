import datetime
import secrets
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import auth
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

@router.post("/register")
def register(req: RegisterRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    validate_email_format(req.email)
    # Check if user already exists
    existing = db.query(models.User).filter(models.User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email này đã được đăng ký tài khoản.")
        
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu phải có ít nhất 6 ký tự.")
        
    user = models.User(
        email=req.email.lower(),
        password_hash=auth.hash_password(req.password),
        full_name=req.full_name or req.email.split("@")[0],
        target_exam=req.target_exam,
        daily_new_target=req.daily_new_target,
        streak_count=1,
        last_active_date=datetime.date.today().isoformat()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Auto-login: Create session
    raw_token = auth.create_user_session(db, user, request, "Thiết bị khởi tạo")
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
            "streak": user.streak_count
        }
    }

def evaluate_daily_streak(user: models.User, db: Session) -> dict:
    today = datetime.date.today()
    today_str = today.isoformat()
    old_streak = user.streak_count or 0
    updated = False
    
    if not user.last_active_date:
        user.streak_count = 1
        user.last_active_date = today_str
        updated = True
    elif user.last_active_date != today_str:
        try:
            last = datetime.date.fromisoformat(user.last_active_date)
            diff = (today - last).days
            if diff == 1:
                user.streak_count = old_streak + 1
            elif diff > 1:
                user.streak_count = 1
            else:
                pass
        except Exception:
            user.streak_count = 1
        user.last_active_date = today_str
        updated = True
        
    if user.streak_count > (user.longest_streak or 0):
        user.longest_streak = user.streak_count
        
    db.commit()
    db.refresh(user)
    return {
        "streak": user.streak_count,
        "longest_streak": user.longest_streak,
        "last_active_date": user.last_active_date,
        "updated": updated
    }

@router.post("/login")
def login(req: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email.lower()).first()
    if not user or not auth.verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không chính xác.")
        
    raw_token = auth.create_user_session(db, user, request, req.device_name)
    response.set_cookie(
        key="session_token",
        value=raw_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=auth.SESSION_EXPIRATION_DAYS * 86400
    )
    
    streak_info = evaluate_daily_streak(user, db)
    
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
            "longest_streak": streak_info["longest_streak"],
            "last_active_date": streak_info["last_active_date"]
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
            
    response.delete_cookie("session_token")
    return {"success": True, "message": "Đã đăng xuất thành công."}

@router.get("/me")
def get_profile(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    streak_info = evaluate_daily_streak(current_user, db)
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
        "timezone": current_user.timezone
    }

@router.post("/checkin")
def daily_checkin(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    streak_info = evaluate_daily_streak(current_user, db)
    return {
        "success": True,
        "streak": streak_info["streak"],
        "longest_streak": streak_info["longest_streak"],
        "last_active_date": streak_info["last_active_date"],
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
