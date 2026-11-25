import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import auth

router = APIRouter(prefix="/api/stats", tags=["Analytics & Streak"])


class ClientSummarySyncRequest(BaseModel):
    learned_words_count: int = 0
    total_started_count: int = 0
    streak_count: int = 0
    completed_today: bool = False


@router.post("/sync-client-summary")
def sync_client_summary(
    req: ClientSummarySyncRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Preserves monotonic high-water marks of user's learned words; streak only updates on real study."""
    if req.learned_words_count > (current_user.learned_words_count or 0):
        current_user.learned_words_count = req.learned_words_count
    if req.total_started_count > (current_user.total_started_count or 0):
        current_user.total_started_count = req.total_started_count
    if req.completed_today and req.streak_count > (current_user.streak_count or 0):
        current_user.streak_count = req.streak_count
        if req.streak_count > (current_user.longest_streak or 0):
            current_user.longest_streak = req.streak_count
    db.commit()
    return {
        "success": True,
        "learned_words_count": current_user.learned_words_count or 0,
        "total_started_count": current_user.total_started_count or 0,
        "streak_count": current_user.streak_count or 0
    }

def classify_competition_tier(xp: int, streak: int) -> dict:
    if xp >= 2000 or streak >= 21:
        return {"code": "diamond", "label": "Hạng Kim Cương"}
    if xp >= 1200 or streak >= 10:
        return {"code": "gold", "label": "Hạng Vàng"}
    if xp >= 500 or streak >= 4:
        return {"code": "silver", "label": "Hạng Bạc"}
    return {"code": "bronze", "label": "Hạng Đồng"}


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    """
    Live server-wide leaderboard of ALL real learners and their active learning devices.
    Excludes automated @example.com unit-test accounts.
    """
    now = datetime.datetime.utcnow()
    users = db.query(models.User).filter(
        ~models.User.email.like("%@example.com")
    ).all()

    entries = []
    for u in users:
        db_mature = db.query(models.UserItemProgress).filter(
            models.UserItemProgress.user_id == u.id,
            models.UserItemProgress.repetitions >= 2
        ).count()
        mature_count = max(db_mature, u.learned_words_count or 0)

        total_reviews = db.query(models.ReviewEvent).filter(
            models.ReviewEvent.user_id == u.id
        ).count()

        streak_val = max(0, u.streak_count or 0)
        xp = (streak_val * 120) + (mature_count * 20) + (total_reviews * 5) + 150
        tier = classify_competition_tier(xp, streak_val)

        # Fetch active devices for this learner
        active_sessions = db.query(models.UserSession).filter(
            models.UserSession.user_id == u.id,
            models.UserSession.revoked == False
        ).order_by(models.UserSession.last_active_at.desc()).limit(5).all()

        device_names = []
        for s in active_sessions:
            dname = (s.device_name or "").strip()
            if dname and dname not in device_names:
                device_names.append(dname)
        if not device_names:
            last_log = db.query(models.LoginAuditLog).filter(
                models.LoginAuditLog.user_email == u.email
            ).order_by(models.LoginAuditLog.id.desc()).first()
            if last_log and last_log.device_summary:
                device_names.append(last_log.device_summary)

        display_name = (u.full_name or u.email.split("@")[0]).strip()
        entries.append({
            "user_id": u.id,
            "name": display_name,
            "full_name": display_name,
            "email": u.email,
            "target_exam": u.target_exam or "IELTS",
            "streak": streak_val,
            "longest_streak": max(streak_val, u.longest_streak or 0),
            "mature_words": mature_count,
            "xp": xp,
            "tier_code": tier["code"],
            "tier_label": tier["label"],
            "devices": device_names,
            "active_devices_count": max(1, len(active_sessions)),
            "referred_by": u.referred_by or "",
            "is_host": u.email.lower() == "tonguyenvu@265.com",
            "today_done_pct": 100 if u.last_active_date == now.strftime("%Y-%m-%d") else 40,
            "last_active": u.last_active_date or now.strftime("%Y-%m-%d")
        })

    entries.sort(key=lambda x: (x["xp"], x["streak"], x["mature_words"]), reverse=True)
    for idx, item in enumerate(entries, start=1):
        item["rank"] = idx

    return entries

@router.get("/summary")
def get_user_analytics(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    now = datetime.datetime.utcnow()
    
    # Total progress records
    progress_all = db.query(models.UserItemProgress).filter(
        models.UserItemProgress.user_id == current_user.id
    ).all()
    
    total_started = len(progress_all)
    mature_count = sum(1 for p in progress_all if p.interval_days >= 21)
    learning_count = sum(1 for p in progress_all if p.interval_days < 21 and p.repetitions > 0)
    due_today_count = sum(1 for p in progress_all if p.due_date and p.due_date <= now)
    
    # Events in last 30 days for retention calculation
    month_ago = now - datetime.timedelta(days=30)
    recent_events = db.query(models.ReviewEvent).filter(
        models.ReviewEvent.user_id == current_user.id,
        models.ReviewEvent.created_at_client >= month_ago
    ).all()
    
    total_reviews = len(recent_events)
    successful_reviews = sum(1 for e in recent_events if e.rating >= 3)
    retention_rate = round((successful_reviews / total_reviews) * 100, 1) if total_reviews > 0 else 100.0
    
    # 7-day forecast
    forecast_7d = [0] * 7
    for p in progress_all:
        if p.due_date and p.due_date > now:
            delta_days = (p.due_date.date() - now.date()).days
            if 0 <= delta_days < 7:
                forecast_7d[delta_days] += 1
                
    # Weak words (lapses >= 2 or EF < 1.8)
    weak_progress = db.query(models.UserItemProgress).filter(
        models.UserItemProgress.user_id == current_user.id,
        (models.UserItemProgress.lapses >= 2) | (models.UserItemProgress.ease_factor < 1.8)
    ).limit(10).all()
    
    weak_words = []
    for wp in weak_progress:
        item = db.query(models.KnowledgeItem).filter(models.KnowledgeItem.id == wp.item_id).first()
        if item:
            weak_words.append({
                "word": item.word,
                "meaning": item.meaning_vi or item.meaning_en,
                "lapses": wp.lapses,
                "ease_factor": wp.ease_factor
            })
            
    # Recent daily activities for streak heatmap
    activities = db.query(models.DailyActivity).filter(
        models.DailyActivity.user_id == current_user.id
    ).order_by(models.DailyActivity.date_str.desc()).limit(14).all()
    
    activity_map = {a.date_str: a.reviews_count for a in activities}

    return {
        "streak": {
            "current": current_user.streak_count,
            "longest": current_user.longest_streak,
            "last_active": current_user.last_active_date
        },
        "cards": {
            "total_started": max(total_started, current_user.total_started_count or 0, current_user.learned_words_count or 0),
            "mature": max(mature_count, current_user.learned_words_count or 0),
            "learning": learning_count,
            "due_today": due_today_count
        },
        "retention_rate_pct": retention_rate,
        "total_reviews_30d": total_reviews,
        "forecast_next_7_days": forecast_7d,
        "weak_words": weak_words,
        "recent_activities": activity_map
    }
