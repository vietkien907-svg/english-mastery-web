import os
import sys
import re
import json
import pypdf

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine, SessionLocal, Base
import models

def parse_kta_pdf(pdf_path, is_advanced=False):
    """
    Parses Mrs. Trang Anh's vocabulary PDF into structured items.
    """
    if not os.path.exists(pdf_path):
        return []
        
    items = []
    seen = set()
    try:
        reader = pypdf.PdfReader(pdf_path)
        full_text = ""
        for p in reader.pages:
            full_text += "\n" + (p.extract_text() or "")
            
        current_day = "Ngày 1"
        for line in full_text.splitlines():
            line_str = line.strip()
            if not line_str:
                continue
                
            m_day = re.search(r"BẢNG TỪ NGÀY\s+([\d/]+)", line_str, re.IGNORECASE)
            if m_day:
                current_day = f"Ngày {m_day.group(1)}"
                continue
                
            # Regex match: STT TỪ VỰNG PHIÊN ÂM TỪ LOẠI NGHĨA
            m_row = re.match(r"^(\d+)\s+([A-Za-z\s\-\'’\(\)\/\.,]+?)\s+(/[^/]+/)\s+([a-z/]+)\s+(.+)$", line_str)
            if m_row:
                stt, word, pron, pos, meaning = m_row.groups()
                word = word.strip()
                if len(word) > 1 and word.lower() not in seen:
                    seen.add(word.lower())
                    
                    item_type = "word"
                    if len(word.split()) > 1:
                        item_type = "collocation"
                        
                    items.append({
                        "word": word,
                        "pron": pron.strip(),
                        "pos": pos.strip(),
                        "meaning_vi": meaning.strip(),
                        "day": current_day,
                        "item_type": item_type
                    })
    except Exception as e:
        print(f"Error parsing {pdf_path}: {e}")
        
    return items

def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    print("=== BẮT ĐẦU NẠP TOÀN BỘ 27 TUẦN BẢNG TỪ NỀN TẢNG & 20 TUẦN BẢNG TỪ NÂNG CAO ===")
    
    total_foundation_added = 0
    total_advanced_added = 0
    
    # ---------------- 1. KHOÁ NỀN TẢNG (TUẦN 1 ĐẾN 27) ----------------
    src_found_id = "src_kta_foundation_27w"
    doc_found = db.query(models.SourceDocument).filter(models.SourceDocument.id == src_found_id).first()
    if not doc_found:
        doc_found = models.SourceDocument(
            id=src_found_id,
            name="Khóa Từ Vựng - Đọc Hiểu Nền Tảng Tuần 1-27 (Cô Trang Anh)",
            source_type="pdf",
            verified=True,
            notes="Toàn bộ 27 tuần học bảng từ nền tảng A2-B1"
        )
        db.add(doc_found)
        db.commit()

    seen_words = set()
    for row in db.query(models.KnowledgeItem.word).all():
        seen_words.add(row[0].lower().strip())

    for w in range(1, 28):
        pdf_file = rf"e:\tiếng anh\BẢNG TỪ TUẦN {w}.pdf"
        parsed = parse_kta_pdf(pdf_file, is_advanced=False)
        added_this_week = 0
        
        for p in parsed:
            w_lower = p["word"].lower().strip()
            if w_lower in seen_words:
                continue
            seen_words.add(w_lower)
            
            k_id = f"kta_f_w{w}_{w_lower.replace(' ', '_').replace('/', '_')[:30]}"
            item = models.KnowledgeItem(
                id=k_id,
                word=p["word"],
                pos=p["pos"],
                pron=p["pron"],
                meaning_vi=p["meaning_vi"],
                level="A2-B1",
                item_type=p["item_type"],
                unit=f"Nền Tảng: Tuần {w}",
                topic=p["day"],
                source_id=src_found_id,
                source_page=p["day"],
                status="approved",
                is_custom=False
            )
            db.add(item)
            added_this_week += 1
            total_foundation_added += 1

        db.commit()
        if parsed:
            print(f"Tuần {w} (Nền tảng): Bóc tách {len(parsed)} mục -> Nạp mới {added_this_week} mục.")

    # ---------------- 2. KHOÁ NÂNG CAO (TUẦN 1 ĐẾN 20) ----------------
    # Keep as distinct source per Section 4
    src_adv_id = "src_kta_advanced_20w"
    doc_adv = db.query(models.SourceDocument).filter(models.SourceDocument.id == src_adv_id).first()
    if not doc_adv:
        doc_adv = models.SourceDocument(
            id=src_adv_id,
            name="Khóa Từ Vựng - Đọc Hiểu Nâng Cao Tuần 1-20 (Cô Trang Anh)",
            source_type="pdf",
            verified=True,
            notes="Toàn bộ 20 tuần học bảng từ nâng cao B2-C1"
        )
        db.add(doc_adv)
        db.commit()

    for w in range(1, 21):
        pdf_file = rf"e:\tiếng anh\Bảng từ phần bài tập nâng cao tuần {w}.pdf"
        parsed = parse_kta_pdf(pdf_file, is_advanced=True)
        added_this_week = 0
        
        for p in parsed:
            w_lower = p["word"].lower().strip()
            if w_lower in seen_words:
                continue
            seen_words.add(w_lower)
            
            k_id = f"kta_adv_w{w}_{w_lower.replace(' ', '_').replace('/', '_')[:30]}"
            item = models.KnowledgeItem(
                id=k_id,
                word=p["word"],
                pos=p["pos"],
                pron=p["pron"],
                meaning_vi=p["meaning_vi"],
                level="B2-C1",
                item_type=p["item_type"],
                unit=f"Nâng Cao: Tuần {w}",
                topic=p["day"],
                source_id=src_adv_id,
                source_page=p["day"],
                status="approved",
                is_custom=False
            )
            db.add(item)
            added_this_week += 1
            total_advanced_added += 1

        db.commit()
        if parsed:
            print(f"Tuần {w} (Nâng cao): Bóc tách {len(parsed)} mục -> Nạp mới {added_this_week} mục.")

    print(f"\n==> TỔNG KẾT NẠP DỮ LIỆU:")
    print(f"• Bảng từ Nền tảng (Tuần 1-27): +{total_foundation_added} từ mới")
    print(f"• Bảng từ Nâng cao (Tuần 1-20): +{total_advanced_added} từ mới")
    
    total_db_items = db.query(models.KnowledgeItem).count()
    print(f"• Tổng số mục từ vựng trong CSDL hiện tại: {total_db_items} mục!")
    
    # Export full database into data.js and data.json
    export_path_json = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\data.json"
    export_path_js = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\data.js"
    
    # Load all items grouped by Unit
    all_items = db.query(models.KnowledgeItem).filter(models.KnowledgeItem.status == "approved").all()
    unit_dict = {}
    for it in all_items:
        u_name = it.unit or "Chung"
        unit_dict.setdefault(u_name, []).append({
            "id": it.id,
            "word": it.word,
            "pos": it.pos,
            "pron": it.pron,
            "meaning_vi": it.meaning_vi,
            "meaning_en": it.meaning_en,
            "example": it.example,
            "level": it.level,
            "type": it.item_type,
            "topic": it.topic
        })
        
    curriculum_units = []
    for u_name, items in sorted(unit_dict.items()):
        # Chunk into days
        chunk_size = max(5, (len(items) + 6) // 7)
        days = []
        for d_idx in range(7):
            sub = items[d_idx * chunk_size : (d_idx + 1) * chunk_size]
            if not sub and d_idx > 1:
                break
            days.append({
                "dayNumber": d_idx + 1,
                "dayTitle": f"Ngày {d_idx + 1}: Luyện từ & Cụm từ",
                "words": sub
            })
        curriculum_units.append({
            "unitId": u_name.lower().replace(" ", "_").replace(":", ""),
            "unitTitle": u_name,
            "totalWords": len(items),
            "days": days
        })

    # Read grammar & readings
    grammar_list = []
    for g in db.query(models.GrammarTopic).order_by(models.GrammarTopic.week_number.asc()).all():
        grammar_list.append({
            "week_number": g.week_number,
            "title": g.title,
            "summary": g.summary,
            "sections": json.loads(g.sections_json) if g.sections_json else [],
            "quiz": json.loads(g.quiz_json) if g.quiz_json else []
        })

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

    full_payload = {
        "units": curriculum_units,
        "grammar": grammar_list,
        "readings": readings_list,
        "totalVocabCount": total_db_items
    }

    with open(export_path_json, "w", encoding="utf-8") as f:
        json.dump(full_payload, f, ensure_ascii=False, indent=2)

    with open(export_path_js, "w", encoding="utf-8") as f:
        f.write("window.APP_DATA = " + json.dumps(full_payload, ensure_ascii=False) + ";\n")

    print(f"Đã cập nhật data.js & data.json với toàn bộ {len(curriculum_units)} units và {total_db_items} từ vựng!")

if __name__ == "__main__":
    main()
