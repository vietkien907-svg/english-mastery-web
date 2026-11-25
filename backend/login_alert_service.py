import os
import json
import smtplib
import threading
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import Request
from sqlalchemy.orm import Session
import models

ALERT_TARGET_EMAIL = "vietkien907@gmail.com"
ALERT_CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "alert_email_config.json")


def load_alert_config() -> dict:
    cfg = {
        "target_email": os.getenv("ALERT_TARGET_EMAIL", ALERT_TARGET_EMAIL),
        "smtp_user": os.getenv("SMTP_USER", ALERT_TARGET_EMAIL),
        "smtp_app_password": os.getenv("SMTP_APP_PASSWORD", ""),
        "enabled": True
    }
    if os.path.exists(ALERT_CONFIG_PATH):
        try:
            with open(ALERT_CONFIG_PATH, "r", encoding="utf-8") as f:
                saved = json.load(f)
                for k in ("target_email", "smtp_user", "smtp_app_password", "enabled"):
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


def send_gmail_smtp(subject: str, html_body: str, text_body: str, cfg: dict | None = None) -> tuple[bool, str]:
    c = cfg or load_alert_config()
    if not c.get("enabled", True):
        return False, "Cảnh báo email đang tắt."

    smtp_user = (c.get("smtp_user") or "").strip()
    app_pass = (c.get("smtp_app_password") or "").replace(" ", "").strip()
    target = (c.get("target_email") or ALERT_TARGET_EMAIL).strip()

    if not smtp_user or not app_pass:
        return False, "Chưa cấu hình Mật khẩu ứng dụng Gmail (SMTP App Password 16 ký tự)."

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"English Mastery Security <{smtp_user}>"
    msg["To"] = target
    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=12) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, app_pass)
            server.sendmail(smtp_user, [target], msg.as_string())
        return True, f"Đã gửi email cảnh báo tới {target} thành công!"
    except Exception as e:
        return False, f"Lỗi gửi SMTP Gmail: {e}"


def record_and_notify_login_event(
    db: Session,
    user: models.User,
    event_type: str,
    request: Request | None = None,
    send_async: bool = True
) -> models.LoginAuditLog:
    ua = ""
    ip = ""
    if request is not None:
        ua = request.headers.get("user-agent", "")
        forwarded = request.headers.get("x-forwarded-for", "")
        ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "")

    device_summary = summarize_device_from_ua(ua)
    now_utc = datetime.datetime.utcnow()
    vn_time = (now_utc + datetime.timedelta(hours=7)).strftime("%H:%M:%S %d/%m/%Y")

    log_row = models.LoginAuditLog(
        user_email=user.email,
        full_name=user.full_name or user.email,
        event_type=event_type,
        device_summary=device_summary,
        ip_address=ip or "unknown",
        email_alert_sent=False,
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
    text_body = (
        f"Cảnh báo bảo mật English Mastery Hub\n"
        f"- Sự kiện: {label}\n"
        f"- Họ tên: {user.full_name}\n"
        f"- Email: {user.email}\n"
        f"- Thiết bị: {device_summary}\n"
        f"- Địa chỉ IP: {ip or 'unknown'}\n"
        f"- Thời gian (VN): {vn_time}\n"
    )
    html_body = f"""
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:14px;background:#fcfbf7;color:#1f2937;">
      <h2 style="margin:0 0 12px;color:#1e4d40;">🔔 Cảnh Báo Thiết Bị Truy Cập</h2>
      <p style="margin:0 0 14px;font-size:14px;">Hệ thống <strong>English Mastery Hub</strong> vừa ghi nhận một thiết bị truy cập:</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr><td style="padding:6px 0;color:#6b7280;">Sự kiện:</td><td style="padding:6px 0;font-weight:bold;color:#b45309;">{label}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Họ và tên:</td><td style="padding:6px 0;font-weight:bold;">{user.full_name}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Email tài khoản:</td><td style="padding:6px 0;font-weight:bold;">{user.email}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Thiết bị:</td><td style="padding:6px 0;">{device_summary}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Địa chỉ IP:</td><td style="padding:6px 0;font-family:monospace;">{ip or 'unknown'}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Thời gian (VN):</td><td style="padding:6px 0;">{vn_time}</td></tr>
      </table>
    </div>
    """

    cfg = load_alert_config()
    if cfg.get("smtp_app_password"):
        if send_async:
            threading.Thread(
                target=send_gmail_smtp,
                args=(subject, html_body, text_body, cfg),
                daemon=True
            ).start()
            log_row.email_alert_sent = True
            db.commit()
        else:
            ok, _ = send_gmail_smtp(subject, html_body, text_body, cfg)
            if ok:
                log_row.email_alert_sent = True
                db.commit()

    return log_row
