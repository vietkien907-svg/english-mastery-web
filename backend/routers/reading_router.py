import json
import urllib.request
import urllib.parse
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import auth

router = APIRouter(prefix="/api/reading", tags=["Reading Passages"])

class SaveWordFromPassageRequest(BaseModel):
    word_or_phrase: str
    context_sentence: str
    passage_id: int = None
    meaning_vi: str = ""
    save_type: str = "learn_now" # learn_now, save_for_later

class ReadingQuizSubmitRequest(BaseModel):
    passage_id: int
    answers: list[int] # List of chosen option indices

@router.get("/lookup-word")
def lookup_word(word: str, db: Session = Depends(get_db)):
    clean_word = word.strip().strip(".,;:!?\"'()[]{}").lower()
    if not clean_word:
        raise HTTPException(status_code=400, detail="Từ cần tra cứu không hợp lệ.")
        
    # 1. Exact match in knowledge_items
    item = db.query(models.KnowledgeItem).filter(
        models.KnowledgeItem.word.ilike(clean_word)
    ).first()
    
    if item:
        return {
            "found": True,
            "word": item.word,
            "pos": item.pos or "word",
            "pron": item.pron or f"/{clean_word}/",
            "meaning_vi": item.meaning_vi or "",
            "meaning_en": item.meaning_en or "",
            "example": item.example or f"Example usage with {item.word}."
        }
        
    # 2. Starts-with or singular/stem match
    stem = clean_word
    for suffix in ["ing", "ed", "es", "s"]:
        if clean_word.endswith(suffix) and len(clean_word) > len(suffix) + 2:
            stem = clean_word[:-len(suffix)]
            break
            
    item_stem = db.query(models.KnowledgeItem).filter(
        models.KnowledgeItem.word.ilike(f"{stem}%")
    ).first()
    
    if item_stem:
        return {
            "found": True,
            "word": clean_word,
            "base_word": item_stem.word,
            "pos": item_stem.pos or "word",
            "pron": item_stem.pron or f"/{clean_word}/",
            "meaning_vi": item_stem.meaning_vi or "",
            "meaning_en": item_stem.meaning_en or "",
            "example": item_stem.example or f"Example usage with {clean_word}."
        }

    # 3. Fallback to instant live translation
    vi_meaning = ""
    try:
        url_vi = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=" + urllib.parse.quote(clean_word)
        req = urllib.request.Request(url_vi, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            vi_meaning = ''.join([p[0] for p in data[0] if p[0]])
    except Exception:
        vi_meaning = clean_word

    return {
        "found": True,
        "word": clean_word,
        "pos": "word",
        "pron": f"/{clean_word}/",
        "meaning_vi": vi_meaning,
        "meaning_en": f"International reading definition of {clean_word}.",
        "example": f"This is an authentic context sentence containing '{clean_word}'."
    }

@router.get("/passages")
def list_passages(db: Session = Depends(get_db)):
    passages = db.query(models.ReadingPassage).order_by(models.ReadingPassage.id.asc()).all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "level": p.level,
            "source_reference": p.source_reference,
            "word_count": len(p.content.split())
        }
        for p in passages
    ]

@router.get("/passages/{passage_id}")
def get_passage_detail(passage_id: int, db: Session = Depends(get_db)):
    p = db.query(models.ReadingPassage).filter(models.ReadingPassage.id == passage_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Bài đọc không tồn tại.")
        
    target_words = json.loads(p.target_words_json) if p.target_words_json else []
    questions = json.loads(p.questions_json) if p.questions_json else []
    
    # Retrieve definition popup info for target words
    matched_definitions = {}
    for tw in target_words:
        item = db.query(models.KnowledgeItem).filter(
            models.KnowledgeItem.word.ilike(tw)
        ).first()
        if item:
            matched_definitions[tw.lower()] = {
                "id": item.id,
                "word": item.word,
                "pos": item.pos,
                "pron": item.pron,
                "meaning_vi": item.meaning_vi,
                "meaning_en": item.meaning_en,
                "example": item.example
            }
            
    return {
        "id": p.id,
        "title": p.title,
        "category": p.category,
        "level": p.level,
        "content": p.content,
        "source_reference": p.source_reference,
        "target_words": target_words,
        "matched_definitions": matched_definitions,
        "questions": [
            {
                "index": idx,
                "q": q["q"],
                "options": q["options"]
            }
            for idx, q in enumerate(questions)
        ]
    }

@router.post("/passages/quiz-submit")
def submit_reading_quiz(req: ReadingQuizSubmitRequest, db: Session = Depends(get_db)):
    p = db.query(models.ReadingPassage).filter(models.ReadingPassage.id == req.passage_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Bài đọc không tồn tại.")
        
    questions = json.loads(p.questions_json) if p.questions_json else []
    score = 0
    feedback = []
    
    for idx, q in enumerate(questions):
        user_choice = req.answers[idx] if idx < len(req.answers) else -1
        is_correct = (user_choice == q["answer"])
        if is_correct:
            score += 1
            
        feedback.append({
            "index": idx,
            "user_choice": user_choice,
            "correct_choice": q["answer"],
            "is_correct": is_correct,
            "explain": q.get("explain", "Đáp án chính xác theo ngữ cảnh bài đọc.")
        })
        
    return {
        "score": score,
        "total": len(questions),
        "percentage": round((score / len(questions)) * 100, 1) if questions else 0,
        "feedback": feedback
    }

@router.post("/save-word")
def save_word_from_passage(req: SaveWordFromPassageRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    clean_word = req.word_or_phrase.strip()
    if not clean_word:
        raise HTTPException(status_code=400, detail="Từ hoặc cụm từ không hợp lệ.")
        
    # Check if this item already exists in knowledge base
    item = db.query(models.KnowledgeItem).filter(models.KnowledgeItem.word.ilike(clean_word)).first()
    if not item:
        item = models.KnowledgeItem(
            id=f"saved_{current_user.id}_{len(clean_word)}_{hash(clean_word) & 0xffffffff}",
            word=clean_word,
            meaning_vi=req.meaning_vi or "Từ lưu từ bài đọc ngữ cảnh",
            example=req.context_sentence,
            item_type="collocation" if len(clean_word.split()) > 1 else "word",
            level="B1+",
            status="approved",
            is_custom=True,
            created_by_user_id=current_user.id
        )
        db.add(item)
        db.flush()
        
    saved_entry = models.UserSavedItem(
        user_id=current_user.id,
        item_id=item.id,
        context_sentence=req.context_sentence,
        passage_id=req.passage_id,
        save_type=req.save_type
    )
    db.add(saved_entry)
    
    # If learn_now, schedule immediately into user progress
    if req.save_type == "learn_now":
        existing_prog = db.query(models.UserItemProgress).filter(
            models.UserItemProgress.user_id == current_user.id,
            models.UserItemProgress.item_id == item.id
        ).first()
        if not existing_prog:
            prog = models.UserItemProgress(
                user_id=current_user.id,
                item_id=item.id,
                ease_factor=2.5,
                interval_days=0,
                repetitions=0,
                lapses=0,
                state="new"
            )
            db.add(prog)
            
    db.commit()
    
    return {
        "success": True,
        "message": f"Đã lưu '{clean_word}' vào kho học tập ({'Học ngay' if req.save_type == 'learn_now' else 'Lưu học sau'})!",
        "item_id": item.id
    }
