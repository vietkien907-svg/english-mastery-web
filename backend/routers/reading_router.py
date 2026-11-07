import re
import json
import urllib.request
import urllib.parse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import models
from database import get_db

router = APIRouter(prefix="/api/reading", tags=["Reading"])

def fetch_us_phonetics_and_audio(word_text):
    us_pron = ""
    us_audio = ""
    clean = word_text.strip().lower()
    
    # 1. Oxford Learner's Dictionary US
    try:
        url = f"https://www.oxfordlearnersdictionaries.com/definition/english/{urllib.parse.quote(clean)}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
        with urllib.request.urlopen(req, timeout=3.5) as resp:
            html = resp.read().decode("utf-8")
            phon_matches = re.findall(r'<div class="phons_n_am"[^>]*>[\s\S]*?<span class="phon">([^<]+)</span>', html)
            audio_matches = re.findall(r'<div class="phons_n_am"[^>]*>data-src-mp3="([^"]+)"', html)
            if phon_matches:
                us_pron = phon_matches[0].strip()
            if audio_matches:
                us_audio = audio_matches[0].strip()
    except Exception:
        pass

    # 2. Fallback to FreeDictionary API
    if not us_pron or not us_audio:
        try:
            url_fd = f"https://api.dictionaryapi.dev/api/v2/entries/en/{urllib.parse.quote(clean)}"
            req_fd = urllib.request.Request(url_fd, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req_fd, timeout=2.5) as resp_fd:
                fd_data = json.loads(resp_fd.read().decode("utf-8"))
                for entry in fd_data:
                    for ph in entry.get("phonetics", []):
                        if not us_pron and ph.get("text"):
                            us_pron = ph.get("text")
                        if not us_audio and ph.get("audio") and ("-us.mp3" in ph.get("audio") or "us" in ph.get("audio")):
                            us_audio = ph.get("audio")
        except Exception:
            pass

    return us_pron, us_audio

class AddWordRequest(BaseModel):
    word: str
    pos: str = "word"
    pron: str = ""
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
        
    # Fetch authentic US IPA & US audio
    us_pron, us_audio = fetch_us_phonetics_and_audio(clean_word)
    cambridge_url = f"https://dictionary.cambridge.org/dictionary/english/{urllib.parse.quote(clean_word)}"

    # 1. Exact match in knowledge_items
    item = db.query(models.KnowledgeItem).filter(
        models.KnowledgeItem.word.ilike(clean_word)
    ).first()
    
    if item:
        final_pron = us_pron or item.pron or f"/{clean_word}/"
        return {
            "found": True,
            "word": item.word,
            "pos": item.pos or "word",
            "pron": final_pron,
            "audio_us": us_audio,
            "cambridge_url": cambridge_url,
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
        final_pron = us_pron or item_stem.pron or f"/{clean_word}/"
        return {
            "found": True,
            "word": clean_word,
            "base_word": item_stem.word,
            "pos": item_stem.pos or "word",
            "pron": final_pron,
            "audio_us": us_audio,
            "cambridge_url": cambridge_url,
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
        "pron": us_pron or f"/{clean_word}/",
        "audio_us": us_audio,
        "cambridge_url": cambridge_url,
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
            "content": p.content,
            "target_words": json.loads(p.target_words_json) if p.target_words_json else [],
            "questions": json.loads(p.questions_json) if p.questions_json else []
        }
        for p in passages
    ]

@router.get("/passages/{passage_id}")
def get_passage_detail(passage_id: int, db: Session = Depends(get_db)):
    p = db.query(models.ReadingPassage).filter(models.ReadingPassage.id == passage_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Bài đọc không tồn tại.")
    return {
        "id": p.id,
        "title": p.title,
        "category": p.category,
        "level": p.level,
        "source_reference": p.source_reference,
        "content": p.content,
        "target_words": json.loads(p.target_words_json) if p.target_words_json else [],
        "questions": json.loads(p.questions_json) if p.questions_json else []
    }

@router.post("/add-word")
def add_custom_word_to_day(req: AddWordRequest, db: Session = Depends(get_db)):
    word = req.word.strip().lower()
    if not word:
        raise HTTPException(status_code=400, detail="Từ vựng không được để trống.")
        
    new_item = models.KnowledgeItem(
        word=word,
        pos=req.pos or "word",
        pron=req.pron or f"/{word}/",
        meaning_vi=req.meaning_vi or word,
        meaning_en=f"Saved from context reader",
        example=f"Added from authentic reading context.",
        level="B2",
        item_type="custom_word",
        status="approved",
        unit="Custom Items"
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    return {
        "success": True,
        "message": f"Đã lưu thành công từ '{word}' vào hệ thống ôn tập!",
        "item_id": new_item.id
    }
