import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/grammar", tags=["Grammar Modules"])

class GrammarQuizSubmitRequest(BaseModel):
    week_number: int
    answers: list[int]

@router.get("/topics")
def list_grammar_topics(db: Session = Depends(get_db)):
    topics = db.query(models.GrammarTopic).order_by(models.GrammarTopic.week_number.asc()).all()
    return [
        {
            "id": t.id,
            "week_number": t.week_number,
            "title": t.title,
            "summary": t.summary,
            "source_verified": t.source_verified,
            "source_reference": t.source_reference
        }
        for t in topics
    ]

@router.get("/topics/{week_number}")
def get_grammar_topic_detail(week_number: int, db: Session = Depends(get_db)):
    topic = db.query(models.GrammarTopic).filter(models.GrammarTopic.week_number == week_number).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Chuyên đề ngữ pháp không tồn tại.")
        
    sections = json.loads(topic.sections_json) if topic.sections_json else []
    quiz = json.loads(topic.quiz_json) if topic.quiz_json else []
    
    return {
        "id": topic.id,
        "week_number": topic.week_number,
        "title": topic.title,
        "summary": topic.summary,
        "source_verified": topic.source_verified,
        "source_reference": topic.source_reference,
        "sections": sections,
        "quiz": [
            {
                "index": idx,
                "q": q["q"],
                "options": q["options"]
            }
            for idx, q in enumerate(quiz)
        ]
    }

@router.post("/quiz-submit")
def submit_grammar_quiz(req: GrammarQuizSubmitRequest, db: Session = Depends(get_db)):
    topic = db.query(models.GrammarTopic).filter(models.GrammarTopic.week_number == req.week_number).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Chuyên đề ngữ pháp không tồn tại.")
        
    quiz = json.loads(topic.quiz_json) if topic.quiz_json else []
    score = 0
    feedback = []
    
    for idx, q in enumerate(quiz):
        user_choice = req.answers[idx] if idx < len(req.answers) else -1
        is_correct = (user_choice == q["answer"])
        if is_correct:
            score += 1
            
        feedback.append({
            "index": idx,
            "user_choice": user_choice,
            "correct_choice": q["answer"],
            "is_correct": is_correct,
            "explain": q.get("explain", "Đáp án chính xác theo quy tắc ngữ pháp.")
        })
        
    return {
        "score": score,
        "total": len(quiz),
        "percentage": round((score / len(quiz)) * 100, 1) if quiz else 0,
        "feedback": feedback
    }
