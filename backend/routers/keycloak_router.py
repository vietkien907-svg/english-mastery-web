import os
import json
import datetime
import secrets
import urllib.request
import urllib.parse
import urllib.error
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import auth
import referral_service
import login_alert_service

router = APIRouter(prefix="/api/auth/keycloak", tags=["Keycloak OIDC SSO"])

CONFIG_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "keycloak_config.json")


def load_keycloak_config() -> dict:
    default_cfg = {
        "enabled": os.getenv("KEYCLOAK_ENABLED", "false").lower() == "true",
        "server_url": os.getenv("KEYCLOAK_URL", "http://localhost:8080").rstrip("/"),
        "realm": os.getenv("KEYCLOAK_REALM", "english-mastery"),
        "client_id": os.getenv("KEYCLOAK_CLIENT_ID", "english-mastery-web"),
        "require_referral": True
    }
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                saved = json.load(f)
                default_cfg.update({k: v for k, v in saved.items() if v is not None})
        except Exception:
            pass
    default_cfg["server_url"] = str(default_cfg.get("server_url", "")).rstrip("/")
    return default_cfg


def save_keycloak_config(cfg: dict):
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)


class KeycloakConfigUpdate(BaseModel):
    enabled: bool = True
    server_url: str
    realm: str
    client_id: str
    require_referral: bool = True


class KeycloakCallbackRequest(BaseModel):
    code: str
    code_verifier: str
    redirect_uri: str


class KeycloakReferralActivationRequest(BaseModel):
    referral_code: str


@router.get("/config")
def get_keycloak_config():
    cfg = load_keycloak_config()
    server_url = cfg["server_url"]
    realm = cfg["realm"]
    auth_endpoint = f"{server_url}/realms/{realm}/protocol/openid-connect/auth" if (server_url and realm) else ""
    return {
        "enabled": bool(cfg.get("enabled")),
        "server_url": server_url,
        "realm": realm,
        "client_id": cfg["client_id"],
        "require_referral": bool(cfg.get("require_referral", True)),
        "auth_endpoint": auth_endpoint
    }


@router.put("/config")
def update_keycloak_config(
    req: KeycloakConfigUpdate,
    current_user: models.User = Depends(auth.get_current_user)
):
    # Only primary host (Tô Nguyên Vũ) is allowed to modify server Keycloak SSO config
    if current_user.email.lower() != "tonguyenvu@265.com":
        raise HTTPException(status_code=403, detail="Chỉ quản trị viên máy chủ (Tô Nguyên Vũ) mới được phép cấu hình Keycloak SSO.")

    clean_url = req.server_url.strip().rstrip("/")
    if req.enabled and not (clean_url.startswith("http://") or clean_url.startswith("https://")):
        raise HTTPException(status_code=400, detail="Keycloak Server URL phải bắt đầu bằng http:// hoặc https://")

    cfg = {
        "enabled": bool(req.enabled),
        "server_url": clean_url,
        "realm": req.realm.strip(),
        "client_id": req.client_id.strip(),
        "require_referral": bool(req.require_referral)
    }
    save_keycloak_config(cfg)
    return {"success": True, "message": "Đã lưu cấu hình Keycloak OIDC thành công!", "config": cfg}


def exchange_keycloak_code(cfg: dict, code: str, code_verifier: str, redirect_uri: str) -> dict:
    token_url = f"{cfg['server_url']}/realms/{cfg['realm']}/protocol/openid-connect/token"
    payload = urllib.parse.urlencode({
        "grant_type": "authorization_code",
        "client_id": cfg["client_id"],
        "code": code,
        "code_verifier": code_verifier,
        "redirect_uri": redirect_uri
    }).encode("utf-8")

    req = urllib.request.Request(
        token_url,
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        raise HTTPException(status_code=401, detail=f"Keycloak từ chối mã xác thực: {err_body[:160]}")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Không thể kết nối tới máy chủ Keycloak ({cfg['server_url']}): {e}")


def fetch_keycloak_userinfo(cfg: dict, access_token: str) -> dict:
    userinfo_url = f"{cfg['server_url']}/realms/{cfg['realm']}/protocol/openid-connect/userinfo"
    req = urllib.request.Request(
        userinfo_url,
        headers={"Authorization": f"Bearer {access_token}"},
        method="GET"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Không thể xác minh thông tin người dùng từ Keycloak: {e}")


@router.post("/callback")
def keycloak_oidc_callback(
    req: KeycloakCallbackRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    cfg = load_keycloak_config()
    if not cfg.get("enabled"):
        raise HTTPException(status_code=400, detail="Đăng nhập Keycloak SSO chưa được kích hoạt trên máy chủ.")

    token_data = exchange_keycloak_code(cfg, req.code, req.code_verifier, req.redirect_uri)
    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Keycloak không trả về access_token hợp lệ.")

    userinfo = fetch_keycloak_userinfo(cfg, access_token)
    email = (userinfo.get("email") or "").strip().lower()
    if not email:
        preferred = (userinfo.get("preferred_username") or userinfo.get("sub") or "").strip().lower()
        if not preferred:
            raise HTTPException(status_code=400, detail="Tài khoản Keycloak không có email hoặc username hợp lệ.")
        email = f"{preferred}@keycloak.local"

    full_name = (userinfo.get("name") or userinfo.get("preferred_username") or email.split("@")[0]).strip()

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(
            email=email,
            password_hash=auth.hash_password(secrets.token_urlsafe(24)),
            full_name=full_name,
            target_exam="IELTS 7.5+",
            daily_new_target=20,
            streak_count=0,
            longest_streak=0,
            last_active_date="",
            referred_by=""
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    device_label = login_alert_service.summarize_device_from_ua(request.headers.get("user-agent", ""))
    raw_token = auth.create_user_session(db, user, request, f"Keycloak · {device_label}")
    login_alert_service.record_and_notify_login_event(db, user, "keycloak_sso", request)
    response.set_cookie(
        key="session_token",
        value=raw_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=auth.SESSION_EXPIRATION_DAYS * 86400
    )

    is_host = (user.email.lower() == "tonguyenvu@265.com")
    needs_referral = bool(cfg.get("require_referral", True)) and (not is_host) and (not (user.referred_by or "").strip())

    return {
        "success": True,
        "token": raw_token,
        "needs_referral_activation": needs_referral,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "target_exam": user.target_exam,
            "streak_count": user.streak_count,
            "referred_by": user.referred_by or "",
            "auth_provider": "keycloak"
        }
    }


@router.post("/activate-referral")
def activate_keycloak_referral(
    req: KeycloakReferralActivationRequest,
    request: Request,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    client_ip = request.client.host if request.client else ""
    ref_result = referral_service.consume_code_and_rotate(db, req.referral_code, current_user.email.lower(), client_ip)
    referrer_email = ref_result["owner_email"]
    referrer_name = ref_result["referrer_name"]

    current_user.referred_by = referrer_email
    if (current_user.streak_count or 0) == 0:
        current_user.streak_count = 1
        current_user.longest_streak = max(1, current_user.longest_streak or 0)
        current_user.last_active_date = datetime.date.today().isoformat()
    db.commit()

    return {
        "success": True,
        "activated": True,
        "referred_by": referrer_email,
        "referrer_name": referrer_name,
        "message": f"Kích hoạt tài khoản Keycloak thành công qua mã dùng 1 lần của {referrer_name}!"
    }
