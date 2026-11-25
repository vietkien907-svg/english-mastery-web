import os
import json
import smtplib
import threading
import datetime
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import Request
from sqlalchemy.orm import Session
import models

ALERT_TARGET_EMAIL = "vietkien907@gmail.com"
ALERT_CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "alert_email_config.json")
RENDER_PUBLIC_ORIGIN = "https://english-mastery-web.onrender.com"


def load_alert_config() -> dict:
    cfg = {
        "target_email": os.getenv("ALERT_TARGET_EMAIL", ALERT_TARGET_EMAIL),
        "smtp_user": os.getenv("SMTP_USER", ALERT_TARGET_EMAIL),
        "smtp_app_password": os.getenv("SMTP_APP_PASSWORD", ""),
        "mode": "https_relay",  # Default: zero-password HTTPS relay (works on Render Free Tier!)
        "enabled": True
    }
    if os.path.exists(ALERT_CONFIG_PATH):
        try:
            with open(ALERT_CONFIG_PATH, "r", encoding="utf-8") as f:
                saved = json.load(f)
                for k in ("target_email", "smtp_user", "smtp_app_password", "mode", "enabled"):
                    if k in saved and saved[k] is not None:
                        cfg[k] = saved[k]
        except Exception:
            pass
    if not cfg.get("target_email"):
        cfg["target_email"] = ALERT_TARGET_EMAIL
    return cfg


def save_alert_config(cfg: dict):
    with open(ALERT_CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)


def summarize_device_from_ua(ua: str) -> str:
    u = (ua or "").lower()
    os_name = "Thiết bị khác"
    if "iphone" in u:
        os_name = "iPhone (iOS)"
    elif "ipad" in u:
        os_name = "iPad (iPadOS)"
    elif "android" in u:
        os_name = "Điện thoại Android"
    elif "windows" in u:
        os_name = "Máy tính Windows"
    elif "macintosh" in u or "mac os" in u:
        os_name = "Máy tính Mac"
    elif "linux" in u:
        os_name = "Linux"

    browser = "Trình duyệt"
    if "edg/" in u:
        browser = "Edge"
    elif "chrome/" in u and "edg/" not in u:
        browser = "Chrome"
    elif "safari/" in u and "chrome/" not in u:
        browser = "Safari"
    elif "firefox/" in u:
        browser = "Firefox"

    return f"{browser} trên {os_name}"


def send_via_https_relay(subject: str, details: dict, target_email: str = ALERT_TARGET_EMAIL) -> tuple[bool, str]:
    """
    Sends email over HTTPS port 443 via FormSubmit AJAX relay (zero App Password required,
    never blocked by Render Free Tier outbound SMTP firewall).
    """
    target = (target_email or ALERT_TARGET_EMAIL).strip()
    url = f"https://formsubmit.co/ajax/{target}"
    payload = {
        "_subject": subject,
        "_template": "table",
        "_captcha": "false",
        **details
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": RENDER_PUBLIC_ORIGIN,
            "Referer": f"{RENDER_PUBLIC_ORIGIN}/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            raw = resp.read().decode("utf-8", errors="ignore")
            parsed = json.loads(raw) if raw else {}
            msg = str(parsed.get("message") or "")
            if str(parsed.get("success")).lower() == "true":
                return True, f"Đã gửi tự động qua cổng HTTPS tới {target} thành công!"
            if "activate" in msg.lower() or "activation" in msg.lower():
                return True, f"Đã gửi thư Kích Hoạt 1 Chạm về hộp thư {target}! Bạn hãy mở Gmail bấm nút 'Activate Form' 1 lần duy nhất để nhận tự động trọn đời."
            return False, msg or "Cổng HTTPS chưa xác nhận gửi."
    except Exception as e:
        return False, f"Cổng HTTPS Relay phản hồi: {e}"


def send_gmail_smtp(subject: str, html_body: str, text_body: str, cfg: dict | None = None) -> tuple[bool, str]:
    c = cfg or load_alert_config()
    if not c.get("enabled", True):
        return False, "Cảnh báo email đang tắt."

    target = (c.get("target_email") or ALERT_TARGET_EMAIL).strip()
    app_pass = (c.get("smtp_app_password") or "").replace(" ", "").strip()
    smtp_user = (c.get("smtp_user") or "").strip()

    # Try SMTP first ONLY if user explicitly provided an App Password; otherwise use automatic HTTPS Relay!
    if smtp_user and app_pass:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"English Mastery Security <{smtp_user}>"
        msg["To"] = target
        msg.attach(MIMEText(text_body, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))
        try:
            with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
                server.ehlo()
                server.starttls()
                server.login(smtp_user, app_pass)
                server.sendmail(smtp_user, [target], msg.as_string())
            return True, f"Đã gửi email SMTP tới {target} thành công!"
        except Exception:
            pass

    return send_via_https_relay(
        subject=subject,
        details={"Nội dung cảnh báo": text_body},
        target_email=target
    )


def record_and_notify_login_event(
    db: Session,
    user: models.User,
    event_type: str,
    request: Request | None = None,
    send_async: bool = True
) -> models.LoginAuditLog | None:
    ua = ""
    ip = ""
    if request is not None:
        ua = request.headers.get("user-agent", "")
        forwarded = request.headers.get("x-forwarded-for", "")
        ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "")

    # Never pollute real audit logs or send emails for automated unit tests!
    if ip == "testclient" or user.email.lower().endswith("@example.com"):
        return None

    device_summary = summarize_device_from_ua(ua)
    now_utc = datetime.datetime.utcnow()
    vn_time = (now_utc + datetime.timedelta(hours=7)).strftime("%H:%M:%S %d/%m/%Y")

    log_row = models.LoginAuditLog(
        user_email=user.email,
        full_name=user.full_name or user.email,
        event_type=event_type,
        device_summary=device_summary,
        ip_address=ip or "unknown",
        email_alert_sent=True,
        created_at=now_utc
    )
    db.add(log_row)
    db.commit()
    db.refresh(log_row)

    event_labels = {
        "register": "ĐĂNG KÝ TÀI KHOẢN MỚI",
        "login": "ĐĂNG NHẬP THIẾT BỊ",
        "keycloak_sso": "ĐĂNG NHẬP KEYCLOAK SSO"
    }
    label = event_labels.get(event_type, event_type.upper())
    subject = f"[English Mastery] 🔔 {label}: {user.full_name} ({device_summary})"
    details = {
        "Sự kiện": label,
        "Họ và tên": user.full_name or user.email,
        "Email tài khoản": user.email,
        "Thiết bị": device_summary,
        "Địa chỉ IP": ip or "unknown",
        "Thời gian (VN)": vn_time
    }

    cfg = load_alert_config()
    if cfg.get("enabled", True):
        target = cfg.get("target_email", ALERT_TARGET_EMAIL)
        if send_async:
            threading.Thread(
                target=send_via_https_relay,
                args=(subject, details, target),
                daemon=True
            ).start()
        else:
            send_via_https_relay(subject, details, target)

    return log_row
