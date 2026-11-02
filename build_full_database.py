import csv, json, os, re

target_dir = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web"

# Load Speakout CSV
speakout_items = []
with open(os.path.join(target_dir, "speakout.csv"), mode="r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        w = row.get("Vocabulary", "").strip()
        if not w or w.lower() == "vocabulary":
            continue
        pos = row.get("Part of speech", "").strip()
        pron = row.get("Pronunciation", "").strip()
        defn = row.get("Definition", "").strip()
        eg = row.get("Example", "").strip()
        unit = row.get("Unit/Lesson", "").strip() or "General"
        topic = row.get("Topic", "").strip()
        
        item_type = "word"
        if "idiom" in pos.lower() or "idiom" in topic.lower():
            item_type = "idiom"
        elif "collocation" in pos.lower() or "collocation" in topic.lower() or "phr" in pos.lower() or len(w.split()) > 1:
            item_type = "collocation"

        speakout_items.append({
            "id": f"spk_{i+1}",
            "word": w,
            "pos": pos,
            "pron": pron,
            "meaning_en": defn,
            "example": eg,
            "unit": unit,
            "topic": topic,
            "level": "B1+",
            "type": item_type
        })

print(f"Loaded {len(speakout_items)} items from Speakout CSV.")

# Load Cô Trang Anh items
kta_items = []
pdf_json_path = os.path.join(target_dir, "extracted_pdf_words.json")
if os.path.exists(pdf_json_path):
    with open(pdf_json_path, "r", encoding="utf-8") as f:
        kta_items = json.load(f)
print(f"Loaded {len(kta_items)} items from Cô Trang Anh PDFs.")

# 11 Grammar Topics with complete theory, formula, examples, and practice quiz
grammar_11_topics = [
    {
        "id": 1,
        "title": "Chuyên đề 1: Hệ thống 12 Thì trong tiếng Anh (Tenses)",
        "summary": "Tổng hợp công thức, dấu hiệu nhận biết và cách phân biệt các thì quan trọng (Hiện tại đơn, Quá khứ đơn, Hiện tại hoàn thành, Tương lai tiếp diễn,...)",
        "sections": [
            {
                "subtitle": "1. Thì Hiện tại đơn & Hiện tại tiếp diễn",
                "content": "• **Hiện tại đơn (Simple Present):** S + V(s/es). Dùng cho sự thật hiển nhiên, thói quen, lịch trình cố định. Dấu hiệu: always, usually, often, every day.\n• **Hiện tại tiếp diễn (Present Continuous):** S + am/is/are + V-ing. Diễn tả hành động đang xảy ra tại thời điểm nói hoặc kế hoạch chắc chắn. Dấu hiệu: now, at the moment, currently."
            },
            {
                "subtitle": "2. Hiện tại hoàn thành (Present Perfect)",
                "content": "• **Công thức:** S + have/has + V3/ed.\n• **Cách dùng:** Hành động bắt đầu trong quá khứ kéo dài đến hiện tại; trải nghiệm (ever, never); hành động vừa mới xảy ra (just, already, yet); hành động xảy ra nhưng không nêu rõ thời gian."
            },
            {
                "subtitle": "3. Quá khứ đơn & Quá khứ tiếp diễn",
                "content": "• **Quá khứ đơn (Past Simple):** S + V2/ed. Diễn tả hành động đã kết thúc trong quá khứ có thời gian xác định (yesterday, last year, ago).\n• **Quá khứ tiếp diễn (Past Continuous):** S + was/were + V-ing. Hành động đang xảy ra tại một thời điểm xác định trong quá khứ hoặc một hành động đang xảy ra thì hành động khác cắt ngang (When + Past Simple, While + Past Continuous)."
            }
        ],
        "quiz": [
            {
                "q": "She ______ to Paris three times so far.",
                "options": ["went", "has gone", "has been", "is going"],
                "answer": 2,
                "explain": "'So far' là dấu hiệu của hiện tại hoàn thành. Đi đến đó và đã về dùng 'has been to'."
            },
            {
                "q": "While I ______ dinner, the phone rang.",
                "options": ["cooked", "was cooking", "am cooking", "have cooked"],
                "answer": 1,
                "explain": "Hành động đang diễn ra trong quá khứ (was cooking) thì hành động khác xen vào (rang)."
            }
        ]
    },
    {
        "id": 2,
        "title": "Chuyên đề 2: Sự hòa hợp giữa Chủ ngữ và Động từ (Subject - Verb Agreement)",
        "summary": "Nguyên tắc chia động từ số ít hoặc số nhiều theo các dạng chủ ngữ đặc biệt: Either...or, Neither...nor, Each/Every, Together with...",
        "sections": [
            {
                "subtitle": "1. Các chủ ngữ luôn chia số ít",
                "content": "• Đại từ bất định: *Everyone, everybody, someone, nobody, everything, nothing* + V(số ít).\n• Tên môn học, bệnh tật, môn thể thao tận cùng 's': *Physics, Mathematics, Measles, News* + V(số ít).\n• Khoảng cách, thời gian, số tiền: *Ten miles is a long way. 100 dollars is too expensive.*"
            },
            {
                "subtitle": "2. Quy tắc đi với liên từ",
                "content": "• *Either...or, Neither...nor, Not only...but also*: Động từ chia theo **chủ ngữ gần nhất** (S2).\n• *S1 + together with / along with / as well as + S2*: Động từ chia theo **S1**."
            }
        ],
        "quiz": [
            {
                "q": "Neither the teacher nor the students ______ present yesterday.",
                "options": ["was", "were", "is", "are"],
                "answer": 1,
                "explain": "Động từ chia theo chủ ngữ gần nhất 'the students' (số nhiều) và thì quá khứ -> were."
            }
        ]
    },
    {
        "id": 3,
        "title": "Chuyên đề 3: Câu bị động (Passive Voice) & Thể sai khiến",
        "summary": "Quy tắc chuyển đổi câu chủ động sang bị động của 12 thì, bị động với động từ khuyết thiếu và cấu trúc Causative (Have/Get something done).",
        "sections": [
            {
                "subtitle": "1. Công thức cốt lõi",
                "content": "**S + be + V3/ed (+ by O)**.\n• Hiện tại đơn: am/is/are + V3/ed\n• Hiện tại hoàn thành: have/has been + V3/ed\n• Động từ khuyết thiếu: modal verb + be + V3/ed"
            },
            {
                "subtitle": "2. Cấu trúc nhờ vả (Causative Form)",
                "content": "• *Have somebody do something* = *Get somebody to do something* (Nhờ ai làm gì).\n• *Have/Get something done (by somebody)*: Có cái gì được làm bởi ai."
            }
        ],
        "quiz": [
            {
                "q": "I must have my car ______ tomorrow.",
                "options": ["repair", "to repair", "repaired", "repairing"],
                "answer": 2,
                "explain": "Cấu trúc 'have something done' mang nghĩa bị động: sửa chiếc xe -> repaired."
            }
        ]
    },
    {
        "id": 4,
        "title": "Chuyên đề 4: Câu điều kiện (Conditionals) & Câu điều ước (Wish)",
        "summary": "Nắm vững Type 0, 1, 2, 3, câu điều kiện hỗn hợp (Mixed conditionals) và đảo ngữ câu điều kiện.",
        "sections": [
            {
                "subtitle": "1. Tóm tắt 3 loại điều kiện chính",
                "content": "• **Loại 1 (Có thật ở hiện tại/tương lai):** If + S + V(hiện tại đơn), S + will + V-inf.\n• **Loại 2 (Không có thật ở hiện tại):** If + S + V2/ed (be: were), S + would/could + V-inf.\n• **Loại 3 (Không có thật trong quá khứ):** If + S + had + V3/ed, S + would/could + have + V3/ed."
            },
            {
                "subtitle": "2. Đảo ngữ câu điều kiện",
                "content": "• Loại 1: *Should + S + V-inf, S + will + V*\n• Loại 2: *Were + S + to V / Were + S + ..., S + would + V*\n• Loại 3: *Had + S + V3/ed, S + would have + V3/ed*"
            }
        ],
        "quiz": [
            {
                "q": "If I had known the answer, I ______ you yesterday.",
                "options": ["would tell", "would have told", "will tell", "had told"],
                "answer": 1,
                "explain": "Điều kiện loại 3 diễn tả sự việc trái ngược với quá khứ (yesterday): would have + V3."
            }
        ]
    },
    {
        "id": 5,
        "title": "Chuyên đề 5: Mệnh đề quan hệ (Relative Clauses) & Rút gọn mệnh đề",
        "summary": "Cách sử dụng Who, Whom, Which, That, Whose và 3 cách rút gọn mệnh đề quan hệ (V-ing, V3/ed, To-inf).",
        "sections": [
            {
                "subtitle": "1. Đại từ quan hệ cơ bản",
                "content": "• *Who*: thay cho danh từ chỉ người làm chủ ngữ/tân ngữ.\n• *Whom*: thay cho người làm tân ngữ (sau giới từ bắt buộc dùng whom).\n• *Which*: thay cho danh từ chỉ vật.\n• *Whose*: chỉ sở hữu (Whose + N).\n• *That*: thay thế cho who, whom, which trong mệnh đề xác định (không dùng sau dấu phẩy và giới từ)."
            },
            {
                "subtitle": "2. Rút gọn mệnh đề quan hệ",
                "content": "• **Chủ động:** Rút về V-ing (*The man who stood there* $\\rightarrow$ *The man standing there*).\n• **Bị động:** Rút về V3/ed (*The book which was written by Jane* $\\rightarrow$ *The book written by Jane*).\n• **Có the first/last/only/so sánh nhất:** Rút về To-inf (*The first man to leave*)."
            }
        ],
        "quiz": [
            {
                "q": "The woman ______ son won the competition is my neighbor.",
                "options": ["who", "whom", "whose", "which"],
                "answer": 2,
                "explain": "'Whose son' biểu thị sự sở hữu: con trai của người phụ nữ."
            }
        ]
    },
    {
        "id": 6,
        "title": "Chuyên đề 6: Cấu trúc So sánh (Comparisons)",
        "summary": "So sánh bằng, hơn, nhất, so sánh kép (The more... the more...), và so sánh bội số.",
        "sections": [
            {
                "subtitle": "1. So sánh hơn & nhất",
                "content": "• Tính từ ngắn: adj + er / the + adj + est.\n• Tính từ dài: more + adj + than / the most + adj.\n• Bất quy tắc: good $\\rightarrow$ better $\\rightarrow$ best; bad $\\rightarrow$ worse $\\rightarrow$ worst; far $\\rightarrow$ farther/further."
            },
            {
                "subtitle": "2. So sánh kép (Càng... thì càng...)",
                "content": "**The + comparative + S + V, the + comparative + S + V.**\n*Ví dụ: The harder you work, the more successful you become.*"
            }
        ],
        "quiz": [
            {
                "q": "The ______ you study, the better your exam results will be.",
                "options": ["more", "most", "harder", "much"],
                "answer": 2,
                "explain": "Cấu trúc so sánh kép: The harder you study, the better..."
            }
        ]
    },
    {
        "id": 7,
        "title": "Chuyên đề 7: Động từ khuyết thiếu (Modal Verbs)",
        "summary": "Must, have to, should, ought to, can, could, may, might và Modal Verbs hoàn thành (Must have done, Should have done...).",
        "sections": [
            {
                "subtitle": "1. Khuyết thiếu chỉ suy đoán trong quá khứ",
                "content": "• **Must have + V3/ed:** Chắc chắn đã xảy ra (có căn cứ rõ ràng).\n• **Can't/Couldn't have + V3/ed:** Chắc chắn đã không xảy ra.\n• **Should have + V3/ed:** Lẽ ra nên làm gì (nhưng thực tế đã không làm)."
            }
        ],
        "quiz": [
            {
                "q": "The streets are all wet. It ______ rained heavily last night.",
                "options": ["must have", "should have", "can have", "might not have"],
                "answer": 0,
                "explain": "Suy đoán có căn cứ ở hiện tại (đường ướt) về quá khứ -> must have rained."
            }
        ]
    },
    {
        "id": 8,
        "title": "Chuyên đề 8: Câu gián tiếp / Tường thuật (Reported Speech)",
        "summary": "Quy tắc lùi thì, đổi đại từ, đổi trạng ngữ chỉ thời gian/nơi chốn và các động từ tường thuật đặc biệt.",
        "sections": [
            {
                "subtitle": "1. Các bước chuyển đổi",
                "content": "1. Lùi một thì (Hiện tại đơn $\\rightarrow$ Quá khứ đơn; Hiện tại hoàn thành $\\rightarrow$ Quá khứ hoàn thành; Will $\\rightarrow$ Would).\n2. Đổi ngôi: I $\\rightarrow$ he/she; we $\\rightarrow$ they; you $\\rightarrow$ I/we/they.\n3. Đổi trạng ngữ: now $\\rightarrow$ then; here $\\rightarrow$ there; today $\\rightarrow$ that day; tomorrow $\\rightarrow$ the following day; yesterday $\\rightarrow$ the previous day."
            }
        ],
        "quiz": [
            {
                "q": "He said: 'I am leaving tomorrow.' -> He said that he was leaving ______.",
                "options": ["tomorrow", "the next day", "yesterday", "then"],
                "answer": 1,
                "explain": "'tomorrow' trong câu gián tiếp đổi thành 'the next day' hoặc 'the following day'."
            }
        ]
    },
    {
        "id": 9,
        "title": "Chuyên đề 9: Danh động từ (Gerunds) & Động từ nguyên mẫu (Infinitives)",
        "summary": "Các động từ đi kèm V-ing (admit, avoid, consider, delay...), To-V (decide, hope, plan...) và nhóm đổi nghĩa (remember, forget, stop, try).",
        "sections": [
            {
                "subtitle": "1. Nhóm động từ đổi nghĩa tùy theo To V hay V-ing",
                "content": "• **Stop to V:** Dừng lại để làm gì. / **Stop V-ing:** Ngừng hẳn việc đang làm.\n• **Remember to V:** Nhớ phải làm gì (tương lai). / **Remember V-ing:** Nhớ đã làm gì (quá khứ).\n• **Try to V:** Cố gắng làm gì. / **Try V-ing:** Thử làm gì."
            }
        ],
        "quiz": [
            {
                "q": "I clearly remember ______ the front door before leaving home.",
                "options": ["to lock", "locking", "locked", "lock"],
                "answer": 1,
                "explain": "Nhớ một việc đã xảy ra trong quá khứ -> remember + V-ing."
            }
        ]
    },
    {
        "id": 10,
        "title": "Chuyên đề 10: Mệnh đề trạng ngữ & Liên từ (Conjunctions)",
        "summary": "Chỉ sự nhượng bộ (Although/Even though vs Despite/In spite of), chỉ lý do (Because vs Because of), chỉ mục đích (So that, In order to).",
        "sections": [
            {
                "subtitle": "1. Nhượng bộ & Nguyên nhân",
                "content": "• *Although / Even though / Though + Clause (S + V)* = *Despite / In spite of + Noun Phrase / V-ing*.\n• *Because / As / Since + Clause (S + V)* = *Because of / Due to + Noun Phrase / V-ing*."
            }
        ],
        "quiz": [
            {
                "q": "______ the heavy rain, they decided to go on a picnic.",
                "options": ["Although", "Despite", "Because", "Because of"],
                "answer": 1,
                "explain": "'the heavy rain' là cụm danh từ mang nghĩa đối lập -> chọn 'Despite'."
            }
        ]
    },
    {
        "id": 11,
        "title": "Chuyên đề 11: Đảo ngữ trong tiếng Anh (Inversion)",
        "summary": "Đảo ngữ với phó từ phủ định (Never, Seldom, Rarely, Hardly), đảo ngữ với Only, Not only... but also và No sooner... than.",
        "sections": [
            {
                "subtitle": "1. Đảo ngữ phủ định & Giới hạn",
                "content": "**Phó từ phủ định + Trợ động từ + S + V-chính.**\n• *Never / Rarely / Seldom + have I seen such a beautiful scene.*\n• *Hardly / Scarcely + had S + V3/ed + WHEN + S + V2/ed* (Vừa mới... thì...)\n• *No sooner + had S + V3/ed + THAN + S + V2/ed*."
            }
        ],
        "quiz": [
            {
                "q": "Hardly ______ into the classroom when the bell rang.",
                "options": ["he stepped", "had he stepped", "did he step", "he had stepped"],
                "answer": 1,
                "explain": "Cấu trúc đảo ngữ: Hardly + had + S + V3... when..."
            }
        ]
    }
]

# Generate curated Reading Passages that include the vocabulary, collocations and idioms
reading_passages = [
    {
        "id": 1,
        "title": "Unit 1: The Stories Behind Old Possessions",
        "unit": "Unit 1",
        "level": "B1+",
        "content": "Last week, Alex decided to tidy up his attic because it was full of old items. While sorting through broken wooden chairs that he needed to throw out, he discovered a genuine ancient box. The box belonged to his grandfather, who was a master clockmaker. Inside lay a gold watch and a leather notebook. Alex was not a big fan of keeping clutter, but this piece was very special to him. He realized that it gave him immense pleasure just holding an artifact that has stood the test of time. He decided to hang up a picture of his grandfather right above the shelf where the box now sits.",
        "target_words": ["tidy up", "throw out", "genuine", "belonged to", "special", "give pleasure", "hang up", "leather"],
        "questions": [
            {
                "q": "What did Alex find in the attic that was special to him?",
                "options": ["A modern smartphone", "A genuine ancient box belonging to his grandfather", "A broken steel gate", "A bag of plastic cups"],
                "answer": 1
            },
            {
                "q": "Why did holding the artifact make Alex happy?",
                "options": ["He could sell it for a huge profit", "It gave him immense pleasure and emotional connection", "It was made of pure diamond", "His friend told him to keep it"],
                "answer": 1
            }
        ]
    },
    {
        "id": 2,
        "title": "Unit 2: Breaking Bad Habits and Sticking to Goals",
        "unit": "Unit 2",
        "level": "B1+",
        "content": "Many people find it tough to achieve goals when they lack daily routines. Sarah used to be in a bad mood whenever she fell behind schedule at work. Instead of making an effort, she often put off important assignments until the last moment. One day, her team lead had to talk the issue over with her to avoid an argument. Sarah finally decided to take up running and quit staying up late. Sticking to a balanced morning routine helped her avoid distractions and stay calm under pressure. Whenever she feels tempted to give up, she reminds herself of the progress she has made.",
        "target_words": ["achieve goals", "be in a bad mood", "make an effort", "put off", "avoid an argument", "take up", "sticking to", "avoid distractions"],
        "questions": [
            {
                "q": "What was Sarah's main difficulty before changing her habits?",
                "options": ["She had no money", "She put off assignments and fell behind schedule", "She didn't know English", "She lost her keys"],
                "answer": 1
            },
            {
                "q": "What helped Sarah stay calm under pressure?",
                "options": ["Sticking to a balanced morning routine", "Quitting her job", "Arguing with her colleagues", "Living out of a suitcase"],
                "answer": 0
            }
        ]
    },
    {
        "id": 3,
        "title": "Unit 3: Navigating Workplace Challenges and Deadlines",
        "unit": "Unit 3",
        "level": "B1+",
        "content": "Working in a fast-paced technology firm requires workers to be flexible and highly responsible. When a client project arrives, developers must meet a deadline while maintaining quality code. Last month, Ken had to deal with the challenge of a system crash. Instead of losing concentration, he remained confident and took responsibility for fixing the server error. He collaborated with teammates who were willing to assist, and together they got a lot done before the official launch. The client praised his professional attitude and solid delivery.",
        "target_words": ["meet a deadline", "deal with the challenge", "lose concentration", "confident", "take responsibility for", "willing", "get a lot done", "professional"],
        "questions": [
            {
                "q": "How did Ken react when the system crashed?",
                "options": ["He blamed his coworkers", "He remained confident and took responsibility for fixing it", "He resigned immediately", "He ignored the emails"],
                "answer": 1
            }
        ]
    },
    {
        "id": 4,
        "title": "Unit 6: Living Out of a Suitcase & City Life",
        "unit": "Unit 6",
        "level": "B1+",
        "content": "For digital nomads, living out of a suitcase is a frequent lifestyle choice. Maria has been traveling through Southeast Asian cities for six months. She loves walking down tree-lined avenues in Hanoi and exploring the busy street market in old quarters. However, traveling across unfamiliar countries is unpredictable. Sometimes train delays force her to think on her feet and weather the storm. She always books in advance and tries to travel light to avoid paying additional baggage charges.",
        "target_words": ["living out of a suitcase", "tree-lined avenues", "busy street market", "think on my feet", "weather the storm", "book in advance", "travel light", "unpredictable"],
        "questions": [
            {
                "q": "What idiom describes Maria's nomadic travel lifestyle?",
                "options": ["Weather the storm", "Living out of a suitcase", "Get into hot water", "Break the journey"],
                "answer": 1
            }
        ]
    }
]

# Now, partition all words into curated Units and Days
# Group Speakout words by Unit
unit_groups = {}
for item in speakout_items:
    u = item.get("unit", "General")
    # Simplify unit name like '1A', '1B', '1C' -> 'Unit 1'
    m = re.match(r"(\d+)", u)
    if m:
        uname = f"Unit {m.group(1)}"
    elif "lead" in u.lower():
        uname = "Unit 0: Starter Collocations"
    else:
        uname = "Unit General"
    unit_groups.setdefault(uname, []).append(item)

# Create Daily Study plan: 7 Days per Unit
# Each day will have ~ 8-12 words/collocations + 1 idiom
curriculum_units = []

for uname, items in sorted(unit_groups.items()):
    days_list = []
    # split items into 5 to 7 days
    chunk_size = max(5, (len(items) + 6) // 7)
    for day_idx in range(7):
        sub_items = items[day_idx * chunk_size : (day_idx + 1) * chunk_size]
        if not sub_items and day_idx > 2:
            break
        days_list.append({
            "dayNumber": day_idx + 1,
            "dayTitle": f"Ngày {day_idx + 1}: Luyện từ & Cụm từ trọng tâm",
            "words": sub_items
        })
    curriculum_units.append({
        "unitId": uname.lower().replace(" ", "_").replace(":", ""),
        "unitTitle": uname,
        "days": days_list,
        "totalWords": len(items)
    })

# Also add Cô Trang Anh Weeks (Tuần 1 to Tuần 5)
for week in range(1, 6):
    w_items = [it for it in kta_items if f"Tuần {week}" in it.get("unit", "")]
    if w_items:
        # group by day
        day_buckets = {}
        for it in w_items:
            d_name = it.get("day", "Ngày 1")
            day_buckets.setdefault(d_name, []).append(it)
        
        days_list = []
        for idx, (d_name, d_words) in enumerate(sorted(day_buckets.items())):
            days_list.append({
                "dayNumber": idx + 1,
                "dayTitle": f"{d_name}: Nền tảng Đọc hiểu & Từ vựng",
                "words": d_words[:15] # 15 words per day max
            })
        
        curriculum_units.append({
            "unitId": f"kta_tuan_{week}",
            "unitTitle": f"Khoá Nền Tảng: Tuần {week} (Cô Trang Anh)",
            "days": days_list,
            "totalWords": sum(len(d["words"]) for d in days_list)
        })

print(f"Total curriculum units structured: {len(curriculum_units)}")

# Bundle into comprehensive database object
full_database = {
    "units": curriculum_units,
    "grammar": grammar_11_topics,
    "readings": reading_passages,
    "meta": {
        "version": "1.0.0",
        "appName": "English Mastery Hub",
        "description": "Nền tảng học Tiếng Anh đa thiết bị với Flashcard, Ôn tập SRS, 11 Chuyên đề Ngữ pháp & Đọc hiểu tương tác.",
        "author": "Antigravity AI Pair Programmer"
    }
}

# Write to JSON and JS
with open(os.path.join(target_dir, "data.json"), "w", encoding="utf-8") as f:
    json.dump(full_database, f, ensure_ascii=False, indent=2)

with open(os.path.join(target_dir, "data.js"), "w", encoding="utf-8") as f:
    f.write("window.APP_DATA = " + json.dumps(full_database, ensure_ascii=False) + ";\n")

print("Successfully generated data.json and data.js!")
