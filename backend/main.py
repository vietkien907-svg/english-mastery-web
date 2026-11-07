import os
import sys
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base
import models
from routers import auth_router, study_router, reading_router, grammar_router, sync_router, stats_router

# Ensure all database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="English Mastery Hub API",
    description="Backend API phục vụ ứng dụng học tiếng Anh cá nhân đa nền tảng, SRS, đọc hiểu và 21 tuần ngữ pháp.",
    version="2.0.0"
)

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

# Mount Static frontend assets
FRONTEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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
