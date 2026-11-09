import os
import sys
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, SessionLocal
import models
from routers import auth_router, study_router, reading_router, grammar_router, sync_router, stats_router, telegram_router
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

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(background_daily_reminder_loop())

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router.router)
app.include_router(study_router.router)
app.include_router(reading_router.router)
app.include_router(grammar_router.router)
app.include_router(sync_router.router)
app.include_router(stats_router.router)
app.include_router(telegram_router.router)

# Mount Static frontend assets
FRONTEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(FRONTEND_DIR, "audio")
if os.path.exists(AUDIO_DIR):
    app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")

@app.get("/")
def serve_index():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "English Mastery Hub API is running."}

@app.get("/flashcards.html")
@app.get("/flashcard.html")
@app.get("/index.html")
def serve_flashcards():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

@app.get("/manifest.json")
def serve_manifest():
    return FileResponse(os.path.join(FRONTEND_DIR, "manifest.json"))

@app.get("/sw.js")
def serve_sw():
    return FileResponse(os.path.join(FRONTEND_DIR, "sw.js"), media_type="application/javascript")

@app.get("/style.css")
def serve_css():
    return FileResponse(os.path.join(FRONTEND_DIR, "style.css"), media_type="text/css")

@app.get("/app.js")
def serve_app_js():
    return FileResponse(os.path.join(FRONTEND_DIR, "app.js"), media_type="application/javascript")

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
