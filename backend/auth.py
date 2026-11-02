import os
import hashlib
import secrets
import datetime
from fastapi import HTTPException, status, Request, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

SESSION_EXPIRATION_DAYS = 30
RESET_TOKEN_EXPIRATION_HOURS = 2

# Password Hashing with PBKDF2-HMAC-SHA256 and 100,000 iterations
def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}:{key.hex()}"

def verify_password(plain_password: str, stored_hash: str) -> bool:
    try:
        salt, key_hex = stored_hash.split(":")
        test_key = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000)
        return secrets.compare_digest(test_key.hex(), key_hex)
    except Exception:
        return False

# Session token generator and hasher
def create_session_token() -> str:
    return secrets.token_urlsafe(32)

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def create_user_session(db: Session, user: models.User, request: Request, device_name: str = "") -> str:
    raw_token = create_session_token()
    token_hash = hash_token(raw_token)
    
    user_agent = request.headers.get("user-agent", "Unknown Device") if request else "Unknown"
    ip = request.client.host if request and request.client else "127.0.0.1"
    
    device_type = "desktop"
    ua_lower = user_agent.lower()
    if "mobile" in ua_lower or "android" in ua_lower or "iphone" in ua_lower:
        device_type = "mobile"
    elif "tablet" in ua_lower or "ipad" in ua_lower:
        device_type = "tablet"

    assigned_device_name = device_name or (
        "iPhone (Safari)" if "iphone" in ua_lower else
        "Android (Chrome)" if "android" in ua_lower else
        "Windows PC (Edge/Chrome)" if "windows" in ua_lower else
        "Mac (Safari/Chrome)" if "mac" in ua_lower else "Personal Device"
    )

    expires = datetime.datetime.utcnow() + datetime.timedelta(days=SESSION_EXPIRATION_DAYS)
    
    sess = models.UserSession(
        id=token_hash,
        user_id=user.id,
        device_name=assigned_device_name,
        device_type=device_type,
        ip_address=ip,
        expires_at=expires,
        revoked=False
    )
    db.add(sess)
    db.commit()
    return raw_token

# Extract and authenticate user from Header (preferred) or Cookie
def get_current_user(request: Request, db: Session = Depends(get_db)) -> models.User:
    token = None
    auth_header = request.headers.get("authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()
        
    if not token:
        token = request.cookies.get("session_token")
            
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục."
        )
        
    token_hash = hash_token(token)
    sess = db.query(models.UserSession).filter(
        models.UserSession.id == token_hash,
        models.UserSession.revoked == False,
        models.UserSession.expires_at > datetime.datetime.utcnow()
    ).first()
    
    if not sess:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Phiên đăng nhập đã hết hạn hoặc bị thu hồi."
        )
        
    # Update last active timestamp
    sess.last_active_at = datetime.datetime.utcnow()
    db.commit()
    
    user = db.query(models.User).filter(models.User.id == sess.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Người dùng không tồn tại.")
        
    return user

# Optional user for endpoints that can work anonymously or logged in
def get_optional_user(request: Request, db: Session = Depends(get_db)):
    try:
        return get_current_user(request, db)
    except HTTPException:
        return None

# Verify ownership check
def verify_ownership(resource_owner_id: int, current_user: models.User):
    if resource_owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập vào tài nguyên của người dùng khác."
        )
