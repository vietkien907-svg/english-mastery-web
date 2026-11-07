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
            
            # Phân loại rõ ràng: 1 là Từ vựng đơn, 2 là Cụm từ & Collocations & Idioms
            words_only = [it for it in items if it.get("type") == "word"]
            collocs_and_idioms = [it for it in items if it.get("type") in ["collocation", "idiom"]]
            
            days = []
            
            # 1. Học Từ Vựng Đơn (Vocabulary)
            if words_only:
                if len(words_only) > 30:
                    part_size = 20
                    num_parts = (len(words_only) + part_size - 1) // part_size
                    for p in range(num_parts):
                        sub_w = words_only[p * part_size : (p + 1) * part_size]
                        days.append({
                            "dayNumber": len(days) + 1,
                            "dayTitle": f"📘 1. Học Từ Vựng Đơn (Phần {p + 1} - {len(sub_w)} từ)",
                            "category": "word",
                            "words": sub_w
                        })
                else:
                    days.append({
                        "dayNumber": len(days) + 1,
                        "dayTitle": f"📘 1. Học Từ Vựng Đơn ({len(words_only)} từ)",
                        "category": "word",
                        "words": words_only
                    })
            
            # 2. Học Cụm Từ & Collocations (Collocations & Idioms)
            if collocs_and_idioms:
                if len(collocs_and_idioms) > 30:
                    part_size = 20
                    num_parts = (len(collocs_and_idioms) + part_size - 1) // part_size
                    for p in range(num_parts):
                        sub_c = collocs_and_idioms[p * part_size : (p + 1) * part_size]
                        days.append({
                            "dayNumber": len(days) + 1,
                            "dayTitle": f"🎯 2. Học Cụm Từ & Collocation (Phần {p + 1} - {len(sub_c)} cụm)",
                            "category": "collocation",
                            "words": sub_c
                        })
                else:
                    days.append({
                        "dayNumber": len(days) + 1,
                        "dayTitle": f"🎯 2. Học Cụm Từ & Collocation ({len(collocs_and_idioms)} cụm)",
                        "category": "collocation",
                        "words": collocs_and_idioms
                    })
            elif not words_only:
                days.append({
                    "dayNumber": 1,
                    "dayTitle": f"📘 1. Học Từ Vựng ({len(items)} từ)",
                    "category": "all",
                    "words": items
                })

            # 3. Tùy chọn Toàn Bộ Cả Từ & Cụm
            days.append({
                "dayNumber": len(days) + 1,
                "dayTitle": f"🌟 3. Toàn Bộ Cả Từ & Cụm ({len(items)} mục)",
                "category": "all",
                "words": items
            })
                
            curriculum_units.append({
                "unitId": u_name.lower().replace(" ", "_").replace(":", "").replace("&", "and"),
                "unitTitle": u_name,
                "totalWords": len(items),
                "wordsCount": len(words_only),
                "collocationsCount": len(collocs_and_idioms),
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
                "quiz": json.loads(g.quiz_json) if g.quiz_json else [],
                "fill_blanks": json.loads(g.fill_blanks_json) if getattr(g, "fill_blanks_json", None) else []
            })
        print(f"Grammar topics: {len(grammar_list)}")

        # Read passages
        readings_list = []
        all_db_readings = db.query(models.ReadingPassage).order_by(models.ReadingPassage.id.asc()).all()
        total_p = len(all_db_readings)

        # Precompute assigned days for each passage across 90 days (3 readings/day)
        passage_assigned_days = {p.id: [] for p in all_db_readings}
        for d in range(1, 91):
            if total_p > 0:
                p1_id = all_db_readings[((d - 1) * 3) % total_p].id
                p2_id = all_db_readings[((d - 1) * 3 + 1) % total_p].id
                p3_id = all_db_readings[((d - 1) * 3 + 2) % total_p].id
                passage_assigned_days[p1_id].append(d)
                passage_assigned_days[p2_id].append(d)
                passage_assigned_days[p3_id].append(d)

        for r in all_db_readings:
            # Month allocation: Month 1 (1-34), Month 2 (35-67), Month 3 (68-100)
            m_num = 1 if r.id <= 34 else (2 if r.id <= 67 else 3)
            q_list = json.loads(r.questions_json) if r.questions_json else []
            readings_list.append({
                "id": r.id,
                "title": r.title,
                "category": r.category,
                "level": r.level,
                "source_reference": r.source_reference or "International News Archive",
                "content": r.content,
                "target_words": json.loads(r.target_words_json) if r.target_words_json else [],
                "questions": q_list,
                "month": m_num,
                "assigned_days": passage_assigned_days.get(r.id, []),
                "type": "cloze_and_comprehension",
                "question_count": len(q_list)
            })
        print(f"Reading passages exported: {len(readings_list)}")

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
