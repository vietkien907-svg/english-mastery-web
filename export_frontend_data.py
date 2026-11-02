import os
import sys
import json
import re

# Add backend directory to sys.path
backend_dir = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\backend"
sys.path.insert(0, backend_dir)

import models
from database import SessionLocal

def export_data():
    db = SessionLocal()
    try:
        # Load all items grouped by Unit
        all_items = db.query(models.KnowledgeItem).filter(models.KnowledgeItem.status == "approved").all()
        print(f"Total approved items in database: {len(all_items)}")
        
        unit_dict = {}
        for it in all_items:
            u_name = it.unit or "Chung"
            unit_dict.setdefault(u_name, []).append({
                "id": it.id,
                "word": it.word,
                "pos": it.pos or "",
                "pron": it.pron or "",
                "meaning_vi": it.meaning_vi or "",
                "meaning_en": it.meaning_en or "",
                "example": it.example or "",
                "level": it.level or "B1",
                "type": it.item_type or "word",
                "topic": it.topic or ""
            })

        def sort_unit_key(name):
            m = re.search(r"Unit\s*(\d+)", name, re.IGNORECASE)
            if m:
                return (0, int(m.group(1)))
            if "custom" in name.lower():
                return (2, 0)
            return (1, name)

        sorted_unit_names = sorted(unit_dict.keys(), key=sort_unit_key)
        
        curriculum_units = []
        for u_name in sorted_unit_names:
            items = unit_dict[u_name]
            # Chunk items into days with at least 20 words per day (minimum 20 words/day)
            target_per_day = 20
            num_days = max(1, round(len(items) / target_per_day))
            chunk_size = max(1, (len(items) + num_days - 1) // num_days)
            
            days = []
            for d_idx in range(num_days):
                sub = items[d_idx * chunk_size : (d_idx + 1) * chunk_size]
                if not sub:
                    break
                days.append({
                    "dayNumber": d_idx + 1,
                    "dayTitle": f"Ngày {d_idx + 1}: Luyện từ & Cụm từ",
                    "words": sub
                })
                
            curriculum_units.append({
                "unitId": u_name.lower().replace(" ", "_").replace(":", "").replace("&", "and"),
                "unitTitle": u_name,
                "totalWords": len(items),
                "days": days
            })

        print(f"Generated {len(curriculum_units)} units:")
        for idx, u in enumerate(curriculum_units):
            print(f"  [{idx}] {u['unitTitle']} ({u['totalWords']} từ, {len(u['days'])} ngày)")

        # Read grammar
        grammar_list = []
        for g in db.query(models.GrammarTopic).order_by(models.GrammarTopic.week_number.asc()).all():
            grammar_list.append({
                "week_number": g.week_number,
                "title": g.title,
                "summary": g.summary,
                "sections": json.loads(g.sections_json) if g.sections_json else [],
                "quiz": json.loads(g.quiz_json) if g.quiz_json else []
            })
        print(f"Grammar topics: {len(grammar_list)}")

        # Read passages
        readings_list = []
        for r in db.query(models.ReadingPassage).all():
            readings_list.append({
                "id": r.id,
                "title": r.title,
                "category": r.category,
                "level": r.level,
                "content": r.content,
                "target_words": json.loads(r.target_words_json) if r.target_words_json else [],
                "questions": json.loads(r.questions_json) if r.questions_json else []
            })
        print(f"Reading passages: {len(readings_list)}")

        full_payload = {
            "units": curriculum_units,
            "grammar": grammar_list,
            "readings": readings_list,
            "totalVocabCount": len(all_items)
        }

        export_path_json = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\data.json"
        export_path_js = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\data.js"

        with open(export_path_json, "w", encoding="utf-8") as f:
            json.dump(full_payload, f, ensure_ascii=False, indent=2)

        with open(export_path_js, "w", encoding="utf-8") as f:
            f.write("window.APP_DATA = " + json.dumps(full_payload, ensure_ascii=False) + ";\n")

        print("Successfully exported data.json and data.js!")
    finally:
        db.close()

if __name__ == "__main__":
    export_data()
