import csv, json, re, os

target_dir = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web"
os.makedirs(target_dir, exist_ok=True)

# We will read from Cô Trang Anh's BẢNG TỪ TUẦN 1.pdf to 5.pdf as well as the Speakout list
import pypdf

extracted_items = []
seen = set()

# 1. First, parse PDF from e:\tiếng anh\BẢNG TỪ TUẦN 1.pdf, 2, 3...
for week in range(1, 6):
    pdf_path = rf"e:\tiếng anh\BẢNG TỪ TUẦN {week}.pdf"
    if not os.path.exists(pdf_path):
        continue
    try:
        reader = pypdf.PdfReader(pdf_path)
        full_text = ""
        for p in reader.pages:
            full_text += "\n" + (p.extract_text() or "")
            
        # Let's parse entries
        current_day = "Ngày 1"
        for line in full_text.splitlines():
            line_str = line.strip()
            if not line_str:
                continue
            m_day = re.search(r"BẢNG TỪ NGÀY\s+([\d/]+)", line_str, re.IGNORECASE)
            if m_day:
                current_day = f"Ngày {m_day.group(1)}"
                continue
            
            # Match table rows: STT TỪ VỰNG PHIÊN ÂM TỪ LOẠI NGHĨA
            # Example: 1 Health /helθ/ n sức khoẻ
            m_row = re.match(r"^(\d+)\s+([A-Za-z\s\-\'’\(\)\/]+?)\s+(/[^/]+/)\s+([a-z/]+)\s+(.+)$", line_str)
            if m_row:
                stt, word, pron, pos, meaning = m_row.groups()
                word = word.strip()
                if (word.lower(), meaning[:20]) not in seen and len(word) > 1:
                    seen.add((word.lower(), meaning[:20]))
                    item_type = "word"
                    if len(word.split()) > 1:
                        item_type = "collocation"
                    extracted_items.append({
                        "id": f"kta_w{week}_{len(extracted_items)+1}",
                        "word": word,
                        "pron": pron.strip(),
                        "pos": pos.strip(),
                        "meaning_vi": meaning.strip(),
                        "meaning_en": "",
                        "example": f"Example context with {word}.",
                        "unit": f"Tuần {week} (Nền tảng)",
                        "day": current_day,
                        "level": "A2-B1",
                        "type": item_type
                    })
    except Exception as e:
        print(f"Error parsing {pdf_path}: {e}")

print(f"Extracted from Cô Trang Anh PDFs: {len(extracted_items)} items")

with open(os.path.join(target_dir, "extracted_pdf_words.json"), "w", encoding="utf-8") as f:
    json.dump(extracted_items, f, ensure_ascii=False, indent=2)
