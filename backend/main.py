import os
import sys
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import re
from urllib.parse import unquote

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, SessionLocal
import models
from routers import auth_router, keycloak_router, study_router, reading_router, grammar_router, sync_router, stats_router, telegram_router, news_router
import asyncio
from datetime import datetime, timezone, timedelta

# Ensure all database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="English Mastery Hub API",
    description="Backend API phục vụ ứng dụng học tiếng Anh cá nhân đa nền tảng, SRS, đọc hiểu và 21 tuần ngữ pháp.",
    version="2.0.0"
)

# Background scheduler for automatic daily Telegram reminders
VN_TZ = timezone(timedelta(hours=7))

async def background_daily_reminder_loop():
    sent_today = {}
    while True:
        try:
            await asyncio.sleep(45)
            now_vn = datetime.now(VN_TZ)
            today_str = now_vn.strftime("%Y-%m-%d")
            time_str = now_vn.strftime("%H:%M")
            
            # Check morning 08:00
            key_morning = f"{today_str}_morning"
            if time_str == "08:00" and not sent_today.get(key_morning):
                sent_today[key_morning] = True
                with SessionLocal() as db:
                    telegram_router.trigger_daily_reminder(reminder_type="morning", db=db)
                    
            # Check evening 19:30
            key_evening = f"{today_str}_evening"
            if time_str == "19:30" and not sent_today.get(key_evening):
                sent_today[key_evening] = True
                with SessionLocal() as db:
                    telegram_router.trigger_daily_reminder(reminder_type="evening", db=db)
                    
            # Check deadline (30 mins before)
            with SessionLocal() as db:
                setting = db.query(models.UserNotificationSetting).filter(models.UserNotificationSetting.is_active == True).first()
                if setting and setting.deadline_time and setting.remind_deadline:
                    try:
                        dl_h, dl_m = map(int, setting.deadline_time.split(":"))
                        dl_mins = dl_h * 60 + dl_m - 30
                        if dl_mins < 0:
                            dl_mins += 24 * 60
                        remind_str = f"{dl_mins // 60:02d}:{dl_mins % 60:02d}"
                        key_dl = f"{today_str}_deadline"
                        if time_str == remind_str and not sent_today.get(key_dl):
                            sent_today[key_dl] = True
                            telegram_router.trigger_daily_reminder(reminder_type="deadline", db=db)
                    except Exception:
                        pass
        except Exception as e:
            print("Background reminder error:", e)

def bootstrap_host_admin():
    import auth as auth_mod
    import referral_service
    from sqlalchemy import text
    with engine.begin() as conn:
        cols = [row[1] for row in conn.execute(text("PRAGMA table_info(users)")).fetchall()]
        if "learned_words_count" not in cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN learned_words_count INTEGER DEFAULT 0"))
        if "total_started_count" not in cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN total_started_count INTEGER DEFAULT 0"))

    with SessionLocal() as db:
        # Clean legacy unit-test bot accounts, test referral codes & testclient logs
        db.query(models.User).filter(models.User.email.like("%@example.com")).delete(synchronize_session=False)
        db.query(models.ReferralCode).filter(models.ReferralCode.used_by_email.like("%@example.com")).delete(synchronize_session=False)
        db.query(models.LoginAuditLog).filter(
            (models.LoginAuditLog.ip_address == "testclient") | (models.LoginAuditLog.user_email.like("%@example.com"))
        ).delete(synchronize_session=False)

        vu = db.query(models.User).filter(models.User.email == "tonguyenvu@265.com").first()
        default_admin_pass = os.getenv("HOST_ADMIN_PASSWORD", "VuAdmin@265")
        if not vu:
            vu = models.User(
                email="tonguyenvu@265.com",
                password_hash=auth_mod.hash_password(default_admin_pass),
                full_name="Tô Nguyên Vũ",
                target_exam="IELTS 7.5+",
                daily_new_target=20,
                streak_count=15,
                longest_streak=15,
                learned_words_count=280,
                total_started_count=367
            )
            db.add(vu)
        else:
            if (vu.learned_words_count or 0) < 280:
                vu.learned_words_count = 280
            if (vu.total_started_count or 0) < 367:
                vu.total_started_count = 367
            if (vu.streak_count or 0) < 15:
                vu.streak_count = 15
            if (vu.longest_streak or 0) < 15:
                vu.longest_streak = 15
        db.commit()
        referral_service.ensure_active_code(db, "tonguyenvu@265.com")


try:
    bootstrap_host_admin()
except Exception as _boot_err:
    print("Initial bootstrap warning:", _boot_err)


@app.on_event("startup")
async def startup_event():
    try:
        bootstrap_host_admin()
    except Exception as e:
        print("Bootstrap admin error:", e)
    asyncio.create_task(background_daily_reminder_loop())

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Middleware: Block URL-based structure tampering & attach strict Security Headers
DANGEROUS_URL_RX = re.compile(r"(\.\./|%2e%2e|<script|javascript:|__proto__|onerror=|onload=)", re.IGNORECASE)

@app.middleware("http")
async def security_and_integrity_middleware(request: Request, call_next):
    raw_path = unquote(request.url.path or "")
    raw_query = unquote(request.url.query or "")

    # 1. Block path traversal & script injection in URL (both raw and URL-encoded)
    if DANGEROUS_URL_RX.search(raw_path) or DANGEROUS_URL_RX.search(raw_query):
        return JSONResponse(
            status_code=403,
            content={"detail": "Truy cập bị từ chối: Phát hiện đường dẫn hoặc tham số cố can thiệp cấu trúc website."}
        )

    # 2. Website structure/files are strictly read-only outside /api/*
    if not raw_path.startswith("/api/") and request.method.upper() not in ("GET", "HEAD", "OPTIONS"):
        return JSONResponse(
            status_code=405,
            content={"detail": "Không cho phép chỉnh sửa cấu trúc website qua đường dẫn."}
        )

    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), geolocation=()"
    return response

# Include API Routers
app.include_router(auth_router.router)
app.include_router(keycloak_router.router)
app.include_router(study_router.router)
app.include_router(reading_router.router)
app.include_router(grammar_router.router)
app.include_router(sync_router.router)
app.include_router(stats_router.router)
app.include_router(telegram_router.router)
app.include_router(news_router.router)

# Mount Static frontend assets
FRONTEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(FRONTEND_DIR, "audio")
if os.path.exists(AUDIO_DIR):
    app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")

NO_CACHE_HEADERS = {"Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache", "Expires": "0"}

@app.get("/")
def serve_index():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, headers=NO_CACHE_HEADERS)
    return {"message": "English Mastery Hub API is running."}

@app.get("/flashcards.html")
@app.get("/flashcard.html")
@app.get("/index.html")
def serve_flashcards():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"), headers=NO_CACHE_HEADERS)

@app.get("/manifest.json")
def serve_manifest():
    return FileResponse(os.path.join(FRONTEND_DIR, "manifest.json"), headers=NO_CACHE_HEADERS)

@app.get("/sw.js")
def serve_sw():
    return FileResponse(os.path.join(FRONTEND_DIR, "sw.js"), media_type="application/javascript", headers=NO_CACHE_HEADERS)

@app.get("/style.css")
def serve_css():
    return FileResponse(os.path.join(FRONTEND_DIR, "style.css"), media_type="text/css", headers=NO_CACHE_HEADERS)

@app.get("/app.js")
def serve_app_js():
    return FileResponse(os.path.join(FRONTEND_DIR, "app.js"), media_type="application/javascript", headers=NO_CACHE_HEADERS)

@app.get("/data.js")
def serve_data_js():
    return FileResponse(os.path.join(FRONTEND_DIR, "data.js"), media_type="application/javascript")

@app.get("/listening_data.js")
def serve_listening_data():
    return FileResponse(os.path.join(FRONTEND_DIR, "listening_data.js"), media_type="application/javascript")

@app.get("/vietnam_today_data.js")
def serve_vietnam_today_data():
    return FileResponse(os.path.join(FRONTEND_DIR, "vietnam_today_data.js"), media_type="application/javascript")

@app.get("/international_news_videos.js")
def serve_international_news_videos():
    return FileResponse(os.path.join(FRONTEND_DIR, "international_news_videos.js"), media_type="application/javascript")

@app.get("/bilingual_cinema_data.js")
def serve_bilingual_cinema_data():
    return FileResponse(os.path.join(FRONTEND_DIR, "bilingual_cinema_data.js"), media_type="application/javascript")

@app.get("/bilingual_news_data.js")
def serve_bilingual_news_data():
    return FileResponse(os.path.join(FRONTEND_DIR, "bilingual_news_data.js"), media_type="application/javascript")

@app.get("/reading_lexicon.js")
def serve_reading_lexicon():
    return FileResponse(os.path.join(FRONTEND_DIR, "reading_lexicon.js"), media_type="application/javascript")

@app.get("/speaking.html")
def serve_speaking_html():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"), headers=NO_CACHE_HEADERS)

@app.get("/speaking-forecast.js")
def serve_speaking_forecast():
    return FileResponse(os.path.join(FRONTEND_DIR, "speaking-forecast.js"), media_type="application/javascript")

@app.get("/speaking-knowledge-bank.js")
def serve_speaking_knowledge_bank():
    return FileResponse(os.path.join(FRONTEND_DIR, "speaking-knowledge-bank.js"), media_type="application/javascript")

@app.get("/speakout-speaking-data.js")
def serve_speakout_speaking_data():
    return FileResponse(os.path.join(FRONTEND_DIR, "speakout-speaking-data.js"), media_type="application/javascript")

@app.get("/speaking-engine.js")
def serve_speaking_engine():
    return FileResponse(os.path.join(FRONTEND_DIR, "speaking-engine.js"), media_type="application/javascript")

@app.get("/ocr-vocab-engine.js")
def serve_ocr_vocab_engine():
    return FileResponse(os.path.join(FRONTEND_DIR, "ocr-vocab-engine.js"), media_type="application/javascript")

@app.get("/unit-review-engine.js")
def serve_unit_review_engine():
    return FileResponse(os.path.join(FRONTEND_DIR, "unit-review-engine.js"), media_type="application/javascript")

@app.get("/focus-session-engine.js")
def serve_focus_session_engine():
    return FileResponse(os.path.join(FRONTEND_DIR, "focus-session-engine.js"), media_type="application/javascript")

@app.get("/auth-gate-engine.js")
def serve_auth_gate_engine():
    return FileResponse(os.path.join(FRONTEND_DIR, "auth-gate-engine.js"), media_type="application/javascript")

@app.get("/streak-deadline-engine.js")
def serve_streak_deadline_engine():
    return FileResponse(os.path.join(FRONTEND_DIR, "streak-deadline-engine.js"), media_type="application/javascript")

@app.get("/security-guard-engine.js")
def serve_security_guard_engine():
    return FileResponse(os.path.join(FRONTEND_DIR, "security-guard-engine.js"), media_type="application/javascript")

@app.get("/conversation_data.js")
def serve_conversation_data():
    return FileResponse(os.path.join(FRONTEND_DIR, "conversation_data.js"), media_type="application/javascript")

@app.get("/educational_channels_data.js")
def serve_educational_channels_data():
    return FileResponse(os.path.join(FRONTEND_DIR, "educational_channels_data.js"), media_type="application/javascript")

@app.get("/translation_bank_units.js")
def serve_translation_bank_units():
    return FileResponse(os.path.join(FRONTEND_DIR, "translation_bank_units.js"), media_type="application/javascript")

@app.get("/translation_bank_media.js")
def serve_translation_bank_media():
    return FileResponse(os.path.join(FRONTEND_DIR, "translation_bank_media.js"), media_type="application/javascript")

@app.get("/translation_bank_ielts.js")
def serve_translation_bank_ielts():
    return FileResponse(os.path.join(FRONTEND_DIR, "translation_bank_ielts.js"), media_type="application/javascript")

@app.get("/translation_bank_trends.js")
def serve_translation_bank_trends():
    return FileResponse(os.path.join(FRONTEND_DIR, "translation_bank_trends.js"), media_type="application/javascript")

@app.get("/translation-practice-engine.js")
def serve_translation_practice_engine():
    return FileResponse(os.path.join(FRONTEND_DIR, "translation-practice-engine.js"), media_type="application/javascript", headers=NO_CACHE_HEADERS)

@app.get("/read-aloud-engine.js")
def serve_read_aloud_engine():
    return FileResponse(os.path.join(FRONTEND_DIR, "read-aloud-engine.js"), media_type="application/javascript", headers=NO_CACHE_HEADERS)

@app.get("/vi-en-games-engine.js")
def serve_vi_en_games_engine():
    return FileResponse(os.path.join(FRONTEND_DIR, "vi-en-games-engine.js"), media_type="application/javascript", headers=NO_CACHE_HEADERS)

@app.get("/mobile_qr.png")
def serve_qr():
    qr_path = os.path.join(FRONTEND_DIR, "mobile_qr.png")
    if os.path.exists(qr_path):
        return FileResponse(qr_path, media_type="image/png")
    return {"error": "QR not found"}

@app.get("/icon-192.png")
def serve_icon_192():
    p = os.path.join(FRONTEND_DIR, "icon-192.png")
    if os.path.exists(p):
        return FileResponse(p, media_type="image/png")
    return {"error": "Icon not found"}

@app.get("/icon-512.png")
def serve_icon_512():
    p = os.path.join(FRONTEND_DIR, "icon-512.png")
    if os.path.exists(p):
        return FileResponse(p, media_type="image/png")
    return {"error": "Icon not found"}

@app.get("/map_test1_zoo.png")
def serve_map_test1_zoo():
    p = os.path.join(FRONTEND_DIR, "map_test1_zoo.png")
    if os.path.exists(p):
        return FileResponse(p, media_type="image/png")
    return {"error": "Map image not found"}

# Healthcheck
@app.get("/api/health")
def healthcheck():
    return {
        "status": "healthy",
        "timestamp": os.path.getmtime(__file__),
        "service": "English Mastery Hub"
    }

# Fallback static file and SPA route handler
@app.get("/{file_name:path}")
def serve_frontend_static(file_name: str):
    file_path = os.path.join(FRONTEND_DIR, file_name)
    if os.path.isfile(file_path):
        media_type = "text/html"
        if file_name.endswith(".js"): media_type = "application/javascript"
        elif file_name.endswith(".css"): media_type = "text/css"
        elif file_name.endswith(".json"): media_type = "application/json"
        elif file_name.endswith(".png"): media_type = "image/png"
        elif file_name.endswith(".jpg") or file_name.endswith(".jpeg"): media_type = "image/jpeg"
        elif file_name.endswith(".ico"): media_type = "image/x-icon"
        use_no_cache = file_name.endswith((".html", ".js", ".css", ".json"))
        return FileResponse(file_path, media_type=media_type, headers=NO_CACHE_HEADERS if use_no_cache else None)
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"), headers=NO_CACHE_HEADERS)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
