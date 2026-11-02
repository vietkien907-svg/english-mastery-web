import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import auth

router = APIRouter(prefix="/api/stats", tags=["Analytics & Streak"])

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
            "total_started": total_started,
            "mature": mature_count,
            "learning": learning_count,
            "due_today": due_today_count
        },
        "retention_rate_pct": retention_rate,
        "total_reviews_30d": total_reviews,
        "forecast_next_7_days": forecast_7d,
        "weak_words": weak_words,
        "recent_activities": activity_map
    }
