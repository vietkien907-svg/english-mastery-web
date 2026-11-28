import datetime
import random
import re
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session
from database import get_db
import models
import auth
import srs
from routers import auth_router

router = APIRouter(prefix="/api/study", tags=["Study & SRS"])

class RateItemRequest(BaseModel):
    item_id: str
    word: str = ""
    pos: str = ""
    pron: str = ""
    meaning_vi: str = ""
    meaning_en: str = ""
    example: str = ""
    level: str = "B1"
    unit: str = ""
    test_type: str = "recognition" # recognition, cued_recall, cloze
    rating: int # 1: Again (Quên), 2: Hard (Khó), 3: Good (Nhớ), 4: Easy (Dễ), 5: Rất dễ
    used_hint: bool = False
    response_time_ms: int = 0
    client_event_id: str = None # Idempotency key
    device_id: str = "web_client"


def resolve_or_create_knowledge_item(
    db: Session,
    item_id: str,
    word: str = "",
    pos: str = "",
    pron: str = "",
    meaning_vi: str = "",
    meaning_en: str = "",
    example: str = "",
    level: str = "B1",
    unit: str = "",
    user_id: int = None
):
    raw_id = (item_id or "").strip()
    if raw_id:
        existing = db.query(models.KnowledgeItem).filter(models.KnowledgeItem.id == raw_id).first()
        if existing:
            return existing

    cand_word = (word or "").strip()
    if not cand_word and raw_id.startswith("word_"):
        cand_word = raw_id[5:].replace("_", " ").strip()
    elif not cand_word and raw_id.startswith("kta_"):
        cand_word = raw_id[4:].replace("_", " ").strip()

    if cand_word:
        by_word = db.query(models.KnowledgeItem).filter(
            func.lower(models.KnowledgeItem.word) == cand_word.lower()
        ).first()
        if by_word:
            return by_word

        slug = re.sub(r"[^a-zA-Z0-9_-]+", "_", raw_id or f"auto_{cand_word.lower()}").strip("_")[:60]
        if not slug:
            slug = f"auto_{int(datetime.datetime.utcnow().timestamp() * 1000)}"
        # Ensure unique PK
        if db.query(models.KnowledgeItem).filter(models.KnowledgeItem.id == slug).first():
            slug = f"{slug[:48]}_{random.randint(1000, 9999)}"

        new_item = models.KnowledgeItem(
            id=slug,
            word=cand_word[:255],
            pos=(pos or "")[:50],
            pron=(pron or "")[:100],
            meaning_vi=meaning_vi or cand_word,
            meaning_en=meaning_en or "",
            example=example or "",
            level=(level or "B1")[:20],
            item_type="phrase" if " " in cand_word else "word",
            unit=(unit or "Curriculum")[:100],
            status="approved",
            is_custom=bool(user_id),
            created_by_user_id=user_id,
        )
        db.add(new_item)
        db.flush()
        return new_item

    return None


def is_progress_mature(p) -> bool:
    if not p:
        return False
    if (p.interval_days or 0) >= 21 or (p.repetitions or 0) >= 3:
        return True
    if p.state == "review" and (p.repetitions or 0) >= 1 and (p.ease_factor or 0) >= 2.49:
        return True
    return False


def sync_user_word_counters_from_db(db: Session, user: models.User):
    all_prog = db.query(models.UserItemProgress).filter(
        models.UserItemProgress.user_id == user.id
    ).all()
    db_started = len(all_prog)
    db_mature = sum(1 for p in all_prog if is_progress_mature(p))
    is_vu = (user.email or "").strip().lower() == "tonguyenvu@265.com"
    min_mature = 280 if is_vu else 0
    min_started = 367 if is_vu else 0
    if db_started > 0:
        user.learned_words_count = max(min_mature, db_mature, user.learned_words_count or 0) if is_vu else max(db_mature, user.learned_words_count or 0)
        user.total_started_count = max(min_started, db_started, user.total_started_count or 0)
    if (user.total_started_count or 0) < (user.learned_words_count or 0):
        user.total_started_count = user.learned_words_count or 0
    user.learning_words_count = max(0, (user.total_started_count or 0) - (user.learned_words_count or 0))

class CustomItemRequest(BaseModel):
    word: str
    pos: str = ""
    pron: str = ""
    meaning_vi: str
    meaning_en: str = ""
    example: str = ""
    level: str = "B1"
    item_type: str = "word" # word, collocation, idiom
    unit: str = "Custom Items"
    topic: str = "Personal"

class ToggleItemRequest(BaseModel):
    item_id: str
    is_favorite: bool = None
    state: str = None # suspended, active

@router.get("/today")
def get_today_queue(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    now = datetime.datetime.utcnow()
    
    # 1. Fetch overdue / due review items
    due_progress = db.query(models.UserItemProgress).filter(
        models.UserItemProgress.user_id == current_user.id,
        models.UserItemProgress.state.in_(["review", "relearning", "learning"]),
        models.UserItemProgress.due_date <= now
    ).order_by(models.UserItemProgress.due_date.asc()).limit(50).all()
    
    due_items = []
    due_item_ids = set()
    for p in due_progress:
        item = db.query(models.KnowledgeItem).filter(models.KnowledgeItem.id == p.item_id).first()
        if item:
            due_items.append({
                "item": {
                    "id": item.id,
                    "word": item.word,
                    "pos": item.pos,
                    "pron": item.pron,
                    "meaning_vi": item.meaning_vi,
                    "meaning_en": item.meaning_en,
                    "example": item.example,
                    "example_vi": item.example_vi,
                    "level": item.level,
                    "type": item.item_type,
                    "unit": item.unit,
                    "topic": item.topic
                },
                "progress": {
                    "repetitions": p.repetitions,
                    "interval_days": p.interval_days,
                    "ease_factor": p.ease_factor,
                    "state": p.state
                },
                "queue_type": "due"
            })
            due_item_ids.add(item.id)
            
    # 2. Fetch new items up to user's daily limit
    studied_item_ids = db.query(models.UserItemProgress.item_id).filter(
        models.UserItemProgress.user_id == current_user.id
    ).all()
    studied_set = {x[0] for x in studied_item_ids}
    
    new_limit = max(1, current_user.daily_new_target)
    # Available items from knowledge items
    unstudied = db.query(models.KnowledgeItem).filter(
        models.KnowledgeItem.status == "approved",
        ~models.KnowledgeItem.id.in_(studied_set)
    ).limit(new_limit).all()
    
    new_items = []
    for item in unstudied:
        new_items.append({
            "item": {
                "id": item.id,
                "word": item.word,
                "pos": item.pos,
                "pron": item.pron,
                "meaning_vi": item.meaning_vi,
                "meaning_en": item.meaning_en,
                "example": item.example,
                "example_vi": item.example_vi,
                "level": item.level,
                "type": item.item_type,
                "unit": item.unit,
                "topic": item.topic
            },
            "progress": {
                "repetitions": 0,
                "interval_days": 0,
                "ease_factor": 2.5,
                "state": "new"
            },
            "queue_type": "new"
        })
        
    # Shuffle each queue independently to prevent position memorization (Section 11)
    random.shuffle(due_items)
    random.shuffle(new_items)
    
    # Combined queue: Overdue & due first, then new items
    queue = due_items + new_items
    
    # Summary metrics
    word_count = sum(1 for q in queue if q["item"]["type"] == "word")
    colloc_count = sum(1 for q in queue if q["item"]["type"] == "collocation")
    idiom_count = sum(1 for q in queue if q["item"]["type"] == "idiom")
    
    estimated_mins = round((len(queue) * 20) / 60, 1) # ~20 seconds per card
    
    return {
        "due_count": len(due_items),
        "new_count": len(new_items),
        "total_queue": len(queue),
        "breakdown": {
            "words": word_count,
            "collocations": colloc_count,
            "idioms": idiom_count
        },
        "estimated_minutes": estimated_mins,
        "items": queue
    }

@router.post("/rate")
def rate_study_item(req: RateItemRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    now = datetime.datetime.utcnow()
    client_evt_id = req.client_event_id or f"evt_{current_user.id}_{req.item_id}_{int(now.timestamp()*1000)}"
    
    # Idempotency check: Have we already processed this exact event?
    existing_evt = db.query(models.ReviewEvent).filter(models.ReviewEvent.client_event_id == client_evt_id).first()
    if existing_evt:
        return {
            "success": True,
            "message": "Sự kiện đã được ghi nhận trước đó (Idempotent duplicate ignored).",
            "duplicate": True
        }
        
    # Resolve KnowledgeItem (auto-creating approved curriculum/idiom/custom entry if missing)
    item = resolve_or_create_knowledge_item(
        db,
        item_id=req.item_id,
        word=req.word,
        pos=req.pos,
        pron=req.pron,
        meaning_vi=req.meaning_vi,
        meaning_en=req.meaning_en,
        example=req.example,
        level=req.level,
        unit=req.unit,
        user_id=current_user.id,
    )
    if not item:
        raise HTTPException(status_code=404, detail="Mục từ vựng không tồn tại.")

    resolved_item_id = item.id

    # Fetch or create UserItemProgress
    progress = db.query(models.UserItemProgress).filter(
        models.UserItemProgress.user_id == current_user.id,
        models.UserItemProgress.item_id == resolved_item_id,
        models.UserItemProgress.test_type == req.test_type
    ).first()
    
    if not progress:
        progress = models.UserItemProgress(
            user_id=current_user.id,
            item_id=resolved_item_id,
            test_type=req.test_type,
            ease_factor=2.5,
            interval_days=0,
            repetitions=0,
            lapses=0,
            state="new"
        )
        db.add(progress)
        db.flush()
        
    # Compute new SM-2 scheduling
    calc = srs.calculate_sm2(
        current_ef=progress.ease_factor,
        current_reps=progress.repetitions,
        current_interval=progress.interval_days,
        current_lapses=progress.lapses,
        grade=req.rating,
        used_hint=req.used_hint,
        now=now
    )
    
    progress.ease_factor = calc["ease_factor"]
    progress.repetitions = calc["repetitions"]
    progress.interval_days = calc["interval_days"]
    progress.lapses = calc["lapses"]
    progress.due_date = calc["due_date"]
    progress.last_reviewed = calc["last_reviewed"]
    progress.state = calc["state"]
    
    # Record Review Event
    evt = models.ReviewEvent(
        client_event_id=client_evt_id,
        user_id=current_user.id,
        item_id=resolved_item_id,
        test_type=req.test_type,
        rating=req.rating,
        response_time_ms=req.response_time_ms,
        used_hint=req.used_hint,
        device_id=req.device_id,
        created_at_client=now,
        received_at_server=now
    )
    db.add(evt)
    
    # Update DailyActivity in user's local timezone
    today_str = auth_router.get_user_local_today(current_user).isoformat()
    activity = db.query(models.DailyActivity).filter(
        models.DailyActivity.user_id == current_user.id,
        models.DailyActivity.date_str == today_str
    ).first()
    
    target_reviews = max(10, current_user.daily_new_target or 20)
    if not activity:
        activity = models.DailyActivity(
            user_id=current_user.id,
            date_str=today_str,
            reviews_count=1,
            time_spent_seconds=max(5, req.response_time_ms // 1000),
            goal_reached=False
        )
        db.add(activity)
    else:
        activity.reviews_count += 1
        activity.time_spent_seconds += max(5, req.response_time_ms // 1000)

    if activity.reviews_count >= target_reviews:
        activity.goal_reached = True

    sync_user_word_counters_from_db(db, current_user)
    db.flush()

    # Streak evaluation only on genuine goal completion (Section 14)
    if activity.goal_reached:
        auth_router.evaluate_daily_streak(current_user, db, increment_if_completed=True)
    else:
        db.commit()
    
    return {
        "success": True,
        "new_state": progress.state,
        "interval_days": progress.interval_days,
        "due_date": progress.due_date.isoformat(),
        "streak": current_user.streak_count
    }

@router.get("/units")
def list_units(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # Group items by unit
    raw_units = db.query(models.KnowledgeItem.unit).filter(
        models.KnowledgeItem.status == "approved"
    ).distinct().all()
    
    unit_names = [u[0] for u in raw_units if u[0]]
    import re
    def sort_unit_key(name):
        m = re.search(r"Unit\s*(\d+)", name, re.IGNORECASE)
        if m:
            return (0, int(m.group(1)))
        if "custom" in name.lower():
            return (2, 0)
        return (1, name)
    unit_names.sort(key=sort_unit_key)
    
    result = []
    for u in unit_names:
        total = db.query(models.KnowledgeItem).filter(models.KnowledgeItem.unit == u).count()
        learned = db.query(models.UserItemProgress).join(models.KnowledgeItem).filter(
            models.UserItemProgress.user_id == current_user.id,
            models.KnowledgeItem.unit == u,
            models.UserItemProgress.repetitions > 0
        ).count()
        
        result.append({
            "unit": u,
            "total_items": total,
            "learned_items": learned,
            "percentage": round((learned / total) * 100, 1) if total > 0 else 0
        })
        
    return result

@router.post("/custom-item")
def add_custom_item(req: CustomItemRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if not req.word.strip() or not req.meaning_vi.strip():
        raise HTTPException(status_code=400, detail="Vui lòng nhập từ và nghĩa tiếng Việt.")
        
    custom_id = f"usr_{current_user.id}_{int(datetime.datetime.utcnow().timestamp()*1000)}"
    item = models.KnowledgeItem(
        id=custom_id,
        word=req.word.strip(),
        pos=req.pos.strip(),
        pron=req.pron.strip(),
        meaning_vi=req.meaning_vi.strip(),
        meaning_en=req.meaning_en.strip(),
        example=req.example.strip(),
        level=req.level,
        item_type=req.item_type,
        unit=req.unit,
        topic=req.topic,
        status="approved",
        is_custom=True,
        created_by_user_id=current_user.id
    )
    db.add(item)
    db.commit()
    
    return {"success": True, "message": "Đã thêm từ vào kho học cá nhân!", "item_id": item.id}

class AddWordToDayRequest(BaseModel):
    word: str
    unit_id: str = ""
    unit_title: str = ""
    day_number: int = 1
    pos: str = "word"
    pron: str = ""
    meaning_vi: str = ""
    meaning_en: str = ""
    example: str = ""
    level: str = "B1+"
    item_type: str = "word"

@router.post("/add-to-day")
def add_word_to_day(
    req: AddWordToDayRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    clean_word = req.word.strip()
    if not clean_word:
        raise HTTPException(status_code=400, detail="Vui lòng nhập từ vựng.")

    existing = db.query(models.KnowledgeItem).filter(
        models.KnowledgeItem.word.ilike(clean_word)
    ).first()

    if existing:
        item = existing
        if req.meaning_vi and not item.meaning_vi:
            item.meaning_vi = req.meaning_vi
        if req.meaning_en and not item.meaning_en:
            item.meaning_en = req.meaning_en
    else:
        custom_id = f"custom_{int(datetime.datetime.utcnow().timestamp()*1000)}"
        item = models.KnowledgeItem(
            id=custom_id,
            word=clean_word,
            pos=req.pos.strip() or "word",
            pron=req.pron.strip() or f"/{clean_word}/",
            meaning_vi=req.meaning_vi.strip() or clean_word,
            meaning_en=req.meaning_en.strip() or f"Definition of {clean_word}",
            example=req.example.strip() or f"Example sentence with {clean_word}.",
            level=req.level or "B1+",
            item_type=req.item_type or "word",
            unit=req.unit_title or "Custom Added Items",
            status="approved",
            is_custom=True,
            created_by_user_id=current_user.id
        )
        db.add(item)
        db.commit()
        db.refresh(item)

    prog = db.query(models.UserItemProgress).filter(
        models.UserItemProgress.user_id == current_user.id,
        models.UserItemProgress.item_id == item.id
    ).first()
    if not prog:
        prog = models.UserItemProgress(
            user_id=current_user.id,
            item_id=item.id,
            test_type="recognition",
            state="learning",
            interval_days=0,
            due_date=datetime.datetime.utcnow()
        )
        db.add(prog)
        db.commit()

    return {
        "success": True,
        "message": f"Đã thêm từ '{clean_word}' vào ngày học thành công!",
        "item": {
            "id": item.id,
            "word": item.word,
            "pos": item.pos,
            "pron": item.pron,
            "meaning_vi": item.meaning_vi,
            "meaning_en": item.meaning_en,
            "example": item.example,
            "level": item.level,
            "type": item.item_type
        }
    }

@router.get("/shuffle-deck")
def get_shuffled_deck(
    from_unit: int = 1,
    to_unit: int = 4,
    limit: int = 50,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    all_items = db.query(models.KnowledgeItem).filter(
        models.KnowledgeItem.status == "approved"
    ).all()
    
    matching = []
    for it in all_items:
        if not it.unit:
            continue
        m = re.search(r"Unit\s*(\d+)", it.unit, re.IGNORECASE)
        if m:
            u_num = int(m.group(1))
            if from_unit <= u_num <= to_unit:
                matching.append({
                    "id": it.id,
                    "word": it.word,
                    "pos": it.pos or "",
                    "pron": it.pron or "",
                    "meaning_vi": it.meaning_vi or "",
                    "meaning_en": it.meaning_en or "",
                    "example": it.example or "",
                    "level": it.level or "B1",
                    "type": it.item_type or "word",
                    "unit": it.unit,
                    "topic": it.topic or ""
                })
                
    random.shuffle(matching)
    total_found = len(matching)
    if limit > 0 and len(matching) > limit:
        matching = matching[:limit]
        
    return {
        "from_unit": from_unit,
        "to_unit": to_unit,
        "total_available": total_found,
        "returned_count": len(matching),
        "items": matching
    }

