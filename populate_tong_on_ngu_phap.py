# populate_tong_on_ngu_phap.py
"""
Script to rebuild and enrich all 25 Grammar Topics based on Cô Trang Anh's
"Tổng ôn Ngữ pháp Tiếng Anh" (NXB Đại học Quốc gia Hà Nội).
Provides comprehensive theory, fill-in-the-blank exercises, and multiple choice questions.
"""
import sqlite3
import json

DB_PATH = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\backend\app.db"

TOPICS = [
    # ---------------- 1. Thì động từ - Hiện tại & Quá khứ ----------------
    {
        "week_number": 1,
        "title": "Chuyên đề 1: Thì Động Từ (Hiện Tại Đơn, HT Tiếp Diễn, Quá Khứ Đơn, QK Tiếp Diễn)",
        "summary": "Nắm vững công thức, cách dùng và dấu hiệu nhận biết của 4 thì cơ bản nhất trong tiếng Anh theo sách Tổng ôn Ngữ pháp Cô Trang Anh.",
        "sections": [
            {
                "subtitle": "1. Thì Hiện tại đơn (Present Simple)",
                "content": "• Công thức: S + V(s/es) | S + do/does not + V_bare | Do/Does + S + V_bare?\n• Cách dùng: Diễn tả chân lý, sự thật hiển nhiên, thói quen lặp đi lặp lại hoặc lịch trình cố định.\n• Dấu hiệu: always, usually, often, sometimes, seldom, every day/week/month, once/twice a year."
            },
            {
                "subtitle": "2. Thì Hiện tại tiếp diễn (Present Continuous)",
                "content": "• Công thức: S + am/is/are + V-ing | S + am/is/are not + V-ing | Am/Is/Are + S + V-ing?\n• Cách dùng: Diễn tả hành động đang xảy ra tại thời điểm nói hoặc xung quanh thời điểm nói; phàn nàn thói quen xấu với 'always'.\n• Dấu hiệu: now, at the moment, at present, Look!, Listen!, Keep silent!..."
            },
            {
                "subtitle": "3. Thì Quá khứ đơn (Past Simple)",
                "content": "• Công thức: S + V2/ed | S + did not + V_bare | Did + S + V_bare?\n• Cách dùng: Diễn tả hành động đã xảy ra và chấm dứt hoàn toàn trong quá khứ, biết rõ thời gian.\n• Dấu hiệu: yesterday, ago, last week/month/year, in 1999, when I was young..."
            },
            {
                "subtitle": "4. Thì Quá khứ tiếp diễn (Past Continuous)",
                "content": "• Công thức: S + was/were + V-ing\n• Cách dùng: Diễn tả hành động đang xảy ra tại một thời điểm xác định trong quá khứ; hoặc hành động đang xảy ra thì có hành động khác xen vào (When + QKĐ, QKTD / While + QKTD, QKTD).\n• Dấu hiệu: at 8 PM yesterday, at this time last week, between 2 and 4 PM yesterday..."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "Water (boil) ______ at 100 degrees Celsius under standard atmospheric pressure.",
                "answer": "boils",
                "alternatives": ["boil"],
                "hint": "Chân lý khoa học hiển nhiên -> Hiện tại đơn ngôi thứ 3 số ít",
                "explain": "Quy tắc: Chân lý/sự thật khoa học dùng thì Hiện tại đơn. Chủ ngữ 'Water' là danh từ không đếm được nên động từ thêm -s: boils."
            },
            {
                "sentence": "Listen! The baby (cry) ______ in the next bedroom.",
                "answer": "is crying",
                "alternatives": ["'s crying"],
                "hint": "Dấu hiệu 'Listen!' báo hiệu hành động đang diễn ra",
                "explain": "Quy tắc: Các câu mệnh lệnh như Listen!, Look! báo hiệu hành động đang xảy ra ngay lúc nói -> Hiện tại tiếp diễn: is crying."
            },
            {
                "sentence": "Yesterday while Mary was cooking dinner, the phone suddenly (ring) ______.",
                "answer": "rang",
                "alternatives": [],
                "hint": "Hành động đang xảy ra (QKTD) thì hành động khác xen vào (QKĐ)",
                "explain": "Quy tắc phối thì: Một hành động đang xảy ra trong quá khứ (was cooking) thì hành động ngắn bất chợt xen vào chia Quá khứ đơn: ring -> rang."
            },
            {
                "sentence": "At 8 PM yesterday, we (watch) ______ an exciting documentary on television.",
                "answer": "were watching",
                "alternatives": ["watched"],
                "hint": "Thời điểm xác định trong quá khứ 'at 8 PM yesterday'",
                "explain": "Quy tắc: Hành động đang xảy ra tại một mốc thời gian cụ thể trong quá khứ dùng Quá khứ tiếp diễn: were watching."
            },
            {
                "sentence": "He usually (go) ______ to school by bicycle, but today he is taking the bus.",
                "answer": "goes",
                "alternatives": [],
                "hint": "Thói quen hàng ngày với 'usually'",
                "explain": "Quy tắc: 'Usually' diễn tả thói quen định kỳ, chủ ngữ 'He' số ít -> goes."
            }
        ],
        "quiz": [
            {
                "q": "Look at those dark clouds! I think it ______ to rain soon.",
                "options": ["A. is going", "B. goes", "C. is raining", "D. was raining"],
                "answer": "A",
                "explain": "Dấu hiệu có căn cứ hiện tại (dark clouds) báo trước một sự việc sắp xảy ra -> be going to V: is going to rain."
            },
            {
                "q": "I ______ my keys while I ______ through the central park yesterday.",
                "options": [
                    "A. lost / was jogging",
                    "B. was losing / jogged",
                    "C. lost / jogged",
                    "D. was losing / was jogging"
                ],
                "answer": "A",
                "explain": "Hành động chạy bộ đang diễn ra (was jogging) thì hành động đánh rơi chìa khóa bất chợt xen vào (lost)."
            },
            {
                "q": "Mr. Brown ______ as a senior financial analyst for this bank for 10 years before he retired.",
                "options": ["A. works", "B. worked", "C. is working", "D. has worked"],
                "answer": "B",
                "explain": "Vì ông Brown đã về hưu (retired - chấm dứt trong quá khứ) nên khoảng thời gian 10 năm đó không còn kéo dài tới hiện tại -> Quá khứ đơn: worked."
            },
            {
                "q": "Why ______ you always ______ your dirty clothes on the floor? It really annoys me!",
                "options": ["A. do / leave", "B. are / leaving", "C. have / left", "D. did / leave"],
                "answer": "B",
                "explain": "Thì Hiện tại tiếp diễn kết hợp với 'always' dùng để phàn nàn về một thói quen xấu gây bực mình: are you always leaving."
            }
        ]
    },

    # ---------------- 2. Thì Hoàn Thành & Tương Lai ----------------
    {
        "week_number": 2,
        "title": "Chuyên đề 2: Thì Hoàn Thành & Tương Lai (HTHT, QKHT, Tương Lai Hoàn Thành)",
        "summary": "Công thức và sự phân biệt tinh tế giữa Hiện tại hoàn thành, Hiện tại HTTD, Quá khứ hoàn thành và Tương lai hoàn thành.",
        "sections": [
            {
                "subtitle": "1. Thì Hiện tại hoàn thành (Present Perfect)",
                "content": "• Công thức: S + have/has + Vp2\n• Cách dùng: Hành động bắt đầu trong quá khứ kéo dài đến hiện tại; hành động vừa mới xảy ra; trải nghiệm tính đến nay.\n• Dấu hiệu: already, just, yet, recently, so far, since + mốc, for + khoảng, ever, never."
            },
            {
                "subtitle": "2. Hiện tại hoàn thành tiếp diễn (Present Perfect Continuous)",
                "content": "• Công thức: S + have/has been + V-ing\n• Cách dùng: Nhấn mạnh tính liên tục của hành động kéo dài từ quá khứ đến hiện tại hoặc để lại kết quả rõ rệt ở hiện tại."
            },
            {
                "subtitle": "3. Quá khứ hoàn thành (Past Perfect)",
                "content": "• Công thức: S + had + Vp2\n• Cách dùng: Hành động xảy ra và hoàn tất TRƯỚC một hành động khác trong quá khứ hoặc trước một mốc thời gian trong quá khứ (By the time / Before / After)."
            },
            {
                "subtitle": "4. Tương lai hoàn thành (Future Perfect)",
                "content": "• Công thức: S + will have + Vp2\n• Cách dùng: Hành động sẽ hoàn thành TRƯỚC một thời điểm hoặc một hành động khác trong tương lai.\n• Dấu hiệu: By the end of this month, By next year, By the time + Hiện tại đơn..."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "By the time the police arrived at the bank, the robbers (escape) ______.",
                "answer": "had escaped",
                "alternatives": [],
                "hint": "Hành động xảy ra trước hành động đến (arrived) trong quá khứ",
                "explain": "Quy tắc phối thì với 'By the time + S + V(quá khứ đơn), S + had + Vp2'. Tên cướp tẩu thoát trước khi cảnh sát tới -> had escaped."
            },
            {
                "sentence": "I (live) ______ in this city for 5 years now, and I really love the friendly people here.",
                "answer": "have lived",
                "alternatives": ["have been living", "'ve lived"],
                "hint": "Hành động bắt đầu trong quá khứ kéo dài đến nay với 'for 5 years now'",
                "explain": "Thì Hiện tại hoàn thành (have lived) hoặc HTHT tiếp diễn diễn tả hành động kéo dài từ quá khứ đến hiện tại."
            },
            {
                "sentence": "By the end of next month, our construction team (finish) ______ the suspension bridge.",
                "answer": "will have finished",
                "alternatives": ["will finish"],
                "hint": "Mốc thời gian 'By the end of next month' -> Tương lai hoàn thành",
                "explain": "Dấu hiệu 'By + mốc tương lai' chia thì Tương lai hoàn thành: will have finished."
            },
            {
                "sentence": "His hands are covered in grease because he (repair) ______ his car all afternoon.",
                "answer": "has been repairing",
                "alternatives": ["has repaired"],
                "hint": "Nhấn mạnh quá trình liên tục để lại dấu vết ở hiện tại",
                "explain": "Hiện tại hoàn thành tiếp diễn (has been repairing) nhấn mạnh hành động diễn ra liên tục để lại hậu quả hiện tại."
            }
        ],
        "quiz": [
            {
                "q": "She ______ three international conferences so far this semester.",
                "options": ["A. attended", "B. has attended", "C. had attended", "D. is attending"],
                "answer": "B",
                "explain": "Dấu hiệu 'so far' (cho đến nay) là dấu hiệu điển hình của thì Hiện tại hoàn thành: has attended."
            },
            {
                "q": "When we reached the stadium, the football match ______ already.",
                "options": ["A. started", "B. has started", "C. had started", "D. was starting"],
                "answer": "C",
                "explain": "Trận bóng đá bắt đầu trước thời điểm chúng tôi đến sân (reached) -> Quá khứ hoàn thành: had started."
            },
            {
                "q": "By this time tomorrow, John ______ in London for his new job interview.",
                "options": ["A. arrives", "B. will arrive", "C. will have arrived", "D. had arrived"],
                "answer": "C",
                "explain": "Dấu hiệu 'By this time tomorrow' (trước thời điểm này ngày mai) -> Tương lai hoàn thành: will have arrived."
            }
        ]
    },

    # ---------------- 3. Sự Phối Thì ----------------
    {
        "week_number": 3,
        "title": "Chuyên đề 3: Sự Phối Thì (Sequence of Tenses)",
        "summary": "Quy tắc phối thì chuẩn mực giữa mệnh đề chính và mệnh đề trạng ngữ chỉ thời gian (When, As soon as, Until, By the time, Since).",
        "sections": [
            {
                "subtitle": "1. Phối thì Hiện tại - Tương lai",
                "content": "• Mệnh đề trạng ngữ chỉ thời gian (sau When, As soon as, Once, Until) KHÔNG dùng thì tương lai (will), mà phải dùng Hiện tại đơn hoặc Hiện tại hoàn thành.\n• Công thức: S + will + V_bare + as soon as / when / until + S + V(hiện tại đơn)."
            },
            {
                "subtitle": "2. Phối thì Quá khứ",
                "content": "• When + QKĐ, QKĐ (hai hành động nối tiếp nhau trong quá khứ).\n• When + QKĐ, QKTD (hành động đang xảy ra thì hành động khác chen vào).\n• When + QKĐ, QKHT (hành động đã hoàn thành trước khi hành động khác tới).\n• S + had + Vp2 + before / by the time + S + V2/ed."
            },
            {
                "subtitle": "3. Phối thì với Since",
                "content": "• Công thức bất biến: S + have/has + Vp2 + SINCE + S + V2/ed (hoặc mốc thời gian trong quá khứ)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "I will give him your message as soon as he (arrive) ______ at the airport.",
                "answer": "arrives",
                "alternatives": ["has arrived"],
                "hint": "Sau liên từ chỉ thời gian 'as soon as' dùng thì Hiện tại đơn, không dùng will",
                "explain": "Quy tắc vàng: Mệnh đề chỉ thời gian đi với as soon as, when chia hiện tại đơn (arrives) khi mệnh đề chính ở tương lai."
            },
            {
                "sentence": "We haven't seen each other since we (graduate) ______ from university in 2020.",
                "answer": "graduated",
                "alternatives": [],
                "hint": "Sau 'since' mệnh đề chia ở Quá khứ đơn",
                "explain": "Cấu trúc kinh điển: Hiện tại hoàn thành (haven't seen) + since + Quá khứ đơn (graduated)."
            },
            {
                "sentence": "He had turned off all the lights before he (leave) ______ the office.",
                "answer": "left",
                "alternatives": [],
                "hint": "Mệnh đề sau 'before' chia Quá khứ đơn",
                "explain": "Hành động tắt điện (had turned off) xảy ra trước hành động rời đi (left) -> sau before chia Quá khứ đơn."
            }
        ],
        "quiz": [
            {
                "q": "I will wait here until you ______ your assignment.",
                "options": ["A. will finish", "B. finish", "C. finished", "D. had finished"],
                "answer": "B",
                "explain": "Sau liên từ 'until' trong mệnh đề thời gian tương lai, tuyệt đối không dùng 'will', phải dùng Hiện tại đơn: finish."
            },
            {
                "q": "No sooner ______ the house than it started pouring with rain.",
                "options": ["A. had I left", "B. I had left", "C. did I leave", "D. have I left"],
                "answer": "A",
                "explain": "Cấu trúc đảo ngữ phối thì: No sooner + had + S + Vp2 + than + S + V2/ed (Vừa mới... thì...)."
            }
        ]
    },

    # ---------------- 4. Sự Hòa Hợp Chủ Ngữ & Động Từ ----------------
    {
        "week_number": 4,
        "title": "Chuyên đề 4: Sự Hòa Hợp Giữa Chủ Ngữ & Động Từ (Subject-Verb Agreement)",
        "summary": "Nắm trọn các quy tắc chia động từ theo chủ ngữ đơn, chủ ngữ ghép, đại từ bất định, danh từ tập hợp và các bẫy đề thi kinh điển.",
        "sections": [
            {
                "subtitle": "1. Các trường hợp chia động từ số ít",
                "content": "• Mỗi, từng (Each, Every), đại từ bất định (Everyone, Someone, Anybody, Nothing...).\n• Khoảng cách, thời gian, tiền bạc, đo lường (Ten miles, Two hours, 100 dollars).\n• Tên môn học, bệnh tật, quốc gia tận cùng là -s (Physics, Mathematics, Measles, The United States).\n• Cụm V-ing hoặc Mệnh đề danh ngữ làm chủ ngữ (Learning English is fun)."
            },
            {
                "subtitle": "2. Chia theo chủ ngữ thứ nhất hoặc thứ hai",
                "content": "• Chia theo S1: S1 + together with / along with / as well as / accompanied by + S2 -> V chia theo S1.\n• Chia theo S2 (gần động từ nhất): Either S1 or S2 / Neither S1 nor S2 / Not only S1 but also S2 -> V chia theo S2."
            },
            {
                "subtitle": "3. The number of vs A number of",
                "content": "• The number of + N(số nhiều) + V(số ít) [Ý nghĩa: Số lượng của...].\n• A number of + N(số nhiều) + V(số nhiều) [Ý nghĩa: Rất nhiều...]."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The teacher, along with his twenty students, (be) ______ visiting the history museum today.",
                "answer": "is",
                "alternatives": ["'s"],
                "hint": "Cụm 'along with' -> động từ chia theo chủ ngữ thứ nhất (The teacher)",
                "explain": "Khi hai chủ ngữ nối với nhau bằng 'along with', động từ chia theo S1 (The teacher - số ít) -> is."
            },
            {
                "sentence": "Neither the manager nor his assistants (agree) ______ with the proposed policy.",
                "answer": "agree",
                "alternatives": [],
                "hint": "Neither... nor... -> chia theo chủ ngữ gần nhất (his assistants)",
                "explain": "Quy tắc: Với Neither S1 nor S2, động từ hòa hợp theo S2 gần nó nhất. 'his assistants' là số nhiều -> agree."
            },
            {
                "sentence": "Ten thousand dollars (be) ______ an enormous sum of money for a high school student.",
                "answer": "is",
                "alternatives": ["was"],
                "hint": "Số tiền bạc được coi là một thể thống nhất -> số ít",
                "explain": "Số tiền, khoảng cách, thời gian được xem là một khối duy nhất nên luôn chia động từ số ít -> is."
            }
        ],
        "quiz": [
            {
                "q": "A number of applicants ______ already submitted their resumes online.",
                "options": ["A. has", "B. have", "C. is", "D. was"],
                "answer": "B",
                "explain": "'A number of + N số nhiều' mang nghĩa 'nhiều' nên động từ chia số nhiều -> have submitted."
            },
            {
                "q": "The number of endangered species in this national reserve ______ steadily over the past five years.",
                "options": ["A. have increased", "B. has increased", "C. are increasing", "D. were increasing"],
                "answer": "B",
                "explain": "'The number of...' biểu thị số lượng (số ít) nên động từ chia số ít -> has increased."
            }
        ]
    },

    # ---------------- 5. Câu Bị Động ----------------
    {
        "week_number": 5,
        "title": "Chuyên đề 5: Câu Bị Động (Passive Voice & Cấu Trúc Truyền Khiến)",
        "summary": "Công thức chuyển đổi câu chủ động sang bị động của tất cả các thì, bị động đặc biệt, và thể truyền khiến (have/get something done).",
        "sections": [
            {
                "subtitle": "1. Nguyên tắc cốt lõi của câu bị động",
                "content": "• Công thức chung: S + Be + Vp2 (+ by O).\n• Động từ 'Be' được chia theo đúng thì của câu chủ động và hòa hợp với chủ ngữ mới."
            },
            {
                "subtitle": "2. Cấu trúc nhờ vả / truyền khiến (Causative Form)",
                "content": "• Have: S + have + someone + V_bare = S + have + something + Vp2 (nhờ ai làm gì).\n• Get: S + get + someone + TO V = S + get + something + Vp2."
            },
            {
                "subtitle": "3. Bị động với động từ chỉ quan điểm (Say, Think, Believe)",
                "content": "• It is said/thought/believed that S + V...\n• S + is/are said to + V_bare (cùng thì) hoặc to have + Vp2 (khác thì/xảy ra trước)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The new modern hospital (build) ______ in this neighborhood next year.",
                "answer": "will be built",
                "alternatives": ["is going to be built"],
                "hint": "Bị động thì Tương lai đơn (will + be + Vp2)",
                "explain": "Chủ ngữ 'The new hospital' là vật chịu tác động, thời gian 'next year' -> will be built."
            },
            {
                "sentence": "I need to have my car (repair) ______ by a certified mechanic this weekend.",
                "answer": "repaired",
                "alternatives": [],
                "hint": "Cấu trúc truyền khiến: Have + something + Vp2",
                "explain": "Cấu trúc: Have + sth + Vp2 (nhờ sửa cái gì). 'my car' là vật được sửa -> repaired."
            }
        ],
        "quiz": [
            {
                "q": "The suspect is believed ______ the country two days before the arrest warrant was issued.",
                "options": ["A. to leave", "B. to be leaving", "C. to have left", "D. having left"],
                "answer": "C",
                "explain": "Hành động rời khỏi đất nước xảy ra trước thời điểm hiện tại 'is believed' -> dùng 'to have + Vp2' (to have left)."
            },
            {
                "q": "She got her brother ______ her heavy luggage up to the fifth floor.",
                "options": ["A. carry", "B. to carry", "C. carried", "D. carrying"],
                "answer": "B",
                "explain": "Cấu trúc truyền khiến với Get: Get + somebody + TO V -> to carry."
            }
        ]
    },

    # ---------------- 6. Câu Điều Kiện & Điều Ước ----------------
    {
        "week_number": 6,
        "title": "Chuyên đề 6: Câu Điều Kiện & Câu Điều Ước (Conditionals & Wish)",
        "summary": "Công thức loại 1, 2, 3, điều kiện hỗn hợp (Mixed conditionals), đảo ngữ câu điều kiện, cấu trúc Wish và If only.",
        "sections": [
            {
                "subtitle": "1. Ba loại câu điều kiện cơ bản",
                "content": "• Loại 1 (Có thật ở hiện tại/tương lai): If + S + V(hiện tại đơn), S + will/can + V_bare.\n• Loại 2 (Không có thật ở hiện tại): If + S + V2/were, S + would/could + V_bare.\n• Loại 3 (Không có thật ở quá khứ): If + S + had + Vp2, S + would/could have + Vp2."
            },
            {
                "subtitle": "2. Câu điều kiện hỗn hợp (Mixed Conditionals)",
                "content": "• Giả thiết trái ngược quá khứ, kết quả ở hiện tại: If + S + had + Vp2, S + would + V_bare (dấu hiệu: now, today ở vế chính)."
            },
            {
                "subtitle": "3. Đảo ngữ câu điều kiện (Bỏ IF)",
                "content": "• Loại 1: Should + S + V_bare, S + will + V_bare.\n• Loại 2: Were + S + to V (hoặc Were + S + ...), S + would + V_bare.\n• Loại 3: Had + S + Vp2, S + would have + Vp2."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "If I (know) ______ your phone number yesterday, I would have called you immediately.",
                "answer": "had known",
                "alternatives": [],
                "hint": "Điều kiện loại 3 trái ngược quá khứ: If + had + Vp2",
                "explain": "Vế chính có 'would have called' và có 'yesterday' -> Điều kiện loại 3: had known."
            },
            {
                "sentence": "If he studied harder in high school, he (not be) ______ struggling at university right now.",
                "answer": "would not be",
                "alternatives": ["wouldn't be"],
                "hint": "Điều kiện hỗn hợp: Điều kiện quá khứ, kết quả hiện tại 'right now'",
                "explain": "Vế chính có dấu hiệu 'right now' ở hiện tại -> câu điều kiện hỗn hợp: would not be."
            }
        ],
        "quiz": [
            {
                "q": "______ you require any further assistance, please do not hesitate to contact our customer support desk.",
                "options": ["A. Should", "B. Were", "C. Had", "D. If should"],
                "answer": "A",
                "explain": "Đảo ngữ câu điều kiện loại 1: Should + S + V_bare = If + S + V."
            },
            {
                "q": "I wish I ______ enough money right now to purchase that electric car.",
                "options": ["A. have", "B. had", "C. had had", "D. will have"],
                "answer": "B",
                "explain": "Ước một điều trái với thực tế ở hiện tại (right now) lùi về Quá khứ đơn: had."
            }
        ]
    },

    # ---------------- 7. Câu Gián Tiếp ----------------
    {
        "week_number": 7,
        "title": "Chuyên đề 7: Câu Gián Tiếp / Tường Thuật (Reported Speech)",
        "summary": "Quy tắc lùi thì, biến đổi đại từ, trạng từ chỉ thời gian nơi chốn và các động từ tường thuật đặc biệt (accuse of, apologize for, deny, insist on).",
        "sections": [
            {
                "subtitle": "1. Quy tắc lùi thì khi động từ tường thuật ở quá khứ (said, told)",
                "content": "• Hiện tại đơn -> Quá khứ đơn\n• Hiện tại tiếp diễn -> Quá khứ tiếp diễn\n• Hiện tại hoàn thành / Quá khứ đơn -> Quá khứ hoàn thành\n• Will -> Would | Can -> Could | Must -> Had to."
            },
            {
                "subtitle": "2. Biến đổi trạng từ chỉ thời gian & nơi chốn",
                "content": "• Now -> then | Here -> there | Today -> that day | Yesterday -> the day before / previous day | Tomorrow -> the following day."
            },
            {
                "subtitle": "3. Động từ tường thuật với V-ing và To V",
                "content": "• S + accuse + O + of + V-ing (buộc tội ai)\n• S + apologize to O + for + V-ing (xin lỗi)\n• S + advise / encourage / invite / warn + O + to V."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The police officer ordered the driver (show) ______ his driving license.",
                "answer": "to show",
                "alternatives": [],
                "hint": "Cấu trúc tường thuật câu mệnh lệnh: Order someone + TO V",
                "explain": "Cấu trúc: S + order + O + to V -> to show."
            },
            {
                "sentence": "He apologized to his teacher for (be) ______ late for class this morning.",
                "answer": "being",
                "alternatives": ["having been"],
                "hint": "Cấu trúc: Apologize to someone for + V-ing",
                "explain": "Sau giới từ 'for' động từ thêm -ing -> being / having been."
            }
        ],
        "quiz": [
            {
                "q": "The young man denied ______ the expensive diamond necklace from the store.",
                "options": ["A. steal", "B. to steal", "C. stealing", "D. to have stolen"],
                "answer": "C",
                "explain": "Động từ 'deny' đi với V-ing (phủ nhận đã làm gì): denying + stealing."
            },
            {
                "q": "Mary asked me ______ I had ever visited Singapore before.",
                "options": ["A. weather", "B. if", "C. that", "D. what"],
                "answer": "B",
                "explain": "Tường thuật câu hỏi Yes/No dùng liên từ 'if' hoặc 'whether'."
            }
        ]
    },

    # ---------------- 8. Cấp So Sánh ----------------
    {
        "week_number": 8,
        "title": "Chuyên đề 8: Cấp So Sánh (Comparisons: Bằng, Hơn, Nhất, Kép)",
        "summary": "Công thức so sánh ngang bằng, so sánh hơn/nhất của tính từ và trạng từ ngắn/dài, cùng cấu trúc so sánh kép (The more... the more...).",
        "sections": [
            {
                "subtitle": "1. So sánh bằng & không bằng",
                "content": "• Khẳng định: S + V + as + adj/adv + as + N/Pronoun.\n• Phủ định: S + V not + as/so + adj/adv + as + N/Pronoun."
            },
            {
                "subtitle": "2. So sánh hơn & So sánh nhất",
                "content": "• Ngắn: adj/adv-er + than | the + adj/adv-est.\n• Dài: more + adj/adv + than | the most + adj/adv.\n• Ngoại lệ: good/well -> better -> best | bad/badly -> worse -> worst | far -> farther/further -> farthest/furthest."
            },
            {
                "subtitle": "3. So sánh kép (The + so sánh hơn, the + so sánh hơn)",
                "content": "• Càng... thì càng...: The + comparative + S + V, the + comparative + S + V.\n• Ví dụ: The harder you study, the higher scores you will achieve."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The more you practice speaking English, the (confident) ______ you will become.",
                "answer": "more confident",
                "alternatives": [],
                "hint": "Cấu trúc so sánh kép: The more + S + V, the more + adj + S + V",
                "explain": "Confident là tính từ dài nên trong cấu trúc so sánh kép dùng: the more confident."
            },
            {
                "sentence": "This luxury sports car is by far the (expensive) ______ vehicle in our showroom.",
                "answer": "most expensive",
                "alternatives": [],
                "hint": "Cụm 'by far the...' dùng trong so sánh nhất",
                "explain": "So sánh nhất với tính từ dài: the most expensive."
            }
        ],
        "quiz": [
            {
                "q": "The higher the altitude of a mountain is, ______ the atmospheric temperature becomes.",
                "options": ["A. colder", "B. the coldest", "C. the colder", "D. more cold"],
                "answer": "C",
                "explain": "Cấu trúc so sánh kép sóng đôi: The higher..., the colder..."
            },
            {
                "q": "His performance today was ______ than his rehearsal yesterday.",
                "options": ["A. far good", "B. much better", "C. very better", "D. more well"],
                "answer": "B",
                "explain": "Để nhấn mạnh so sánh hơn dùng 'much' hoặc 'far' trước tính từ so sánh hơn (better): much better."
            }
        ]
    },

    # ---------------- 9. Mệnh Đề Quan Hệ ----------------
    {
        "week_number": 9,
        "title": "Chuyên đề 9: Mệnh Đề Quan Hệ & Rút Gọn Mệnh Đề (Relative Clauses)",
        "summary": "Cách sử dụng Who, Whom, Which, That, Whose, Where, When, Why, phân biệt mệnh đề quan hệ xác định/không xác định và 3 cách rút gọn mệnh đề quan hệ.",
        "sections": [
            {
                "subtitle": "1. Đại từ và trạng từ quan hệ",
                "content": "• Who (người, làm chủ ngữ/tân ngữ) | Whom (người, làm tân ngữ) | Which (vật).\n• That: Thay cho who/whom/which trong mệnh đề xác định (không dùng sau dấu phẩy và giới từ).\n• Whose: Sở hữu cách (Whose + N)."
            },
            {
                "subtitle": "2. Ba cách rút gọn mệnh đề quan hệ",
                "content": "• Rút thành V-ing: Khi mệnh đề mang nghĩa chủ động (The boy who is playing -> The boy playing).\n• Rút thành Vp2: Khi mệnh đề mang nghĩa bị động (The book which was written -> The book written).\n• Rút thành To-V: Khi danh từ đi trước có the first, the second, the last, the only hoặc so sánh nhất."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The scientific report (publish) ______ by Harvard researchers yesterday has attracted global attention.",
                "answer": "published",
                "alternatives": [],
                "hint": "Rút gọn mệnh đề quan hệ bị động (which was published -> published)",
                "explain": "Bản báo cáo được xuất bản (mang nghĩa bị động) nên rút gọn thành quá khứ phân từ Vp2: published."
            },
            {
                "sentence": "Neil Armstrong was the first human (walk) ______ on the surface of the Moon.",
                "answer": "to walk",
                "alternatives": [],
                "hint": "Có 'the first' nên rút gọn mệnh đề quan hệ thành To-V",
                "explain": "Quy tắc: Sau the first / second / last / only rút gọn mệnh đề quan hệ bằng To-V: to walk."
            }
        ],
        "quiz": [
            {
                "q": "The professor ______ lecture we attended yesterday is a world-renowned astrophysicist.",
                "options": ["A. who", "B. whom", "C. whose", "D. which"],
                "answer": "C",
                "explain": "Chỉ quan hệ sở hữu đối với bài giảng (lecture của vị giáo sư) -> đại từ sở hữu 'whose lecture'."
            },
            {
                "q": "Candidates ______ in this international recruitment drive must possess fluent English skills.",
                "options": ["A. participating", "B. participated", "C. participate", "D. are participating"],
                "answer": "A",
                "explain": "Rút gọn mệnh đề quan hệ chủ động (Candidates who participate -> Candidates participating)."
            }
        ]
    },

    # ---------------- 10. Động Từ Khuyết Thiếu ----------------
    {
        "week_number": 10,
        "title": "Chuyên đề 10: Động Từ Khuyết Thiếu & Dự Đoán Trong Quá Khứ (Modal Verbs)",
        "summary": "Cách dùng Can, May, Must, Should, Need, và đặc biệt là Modal Perfect diễn tả dự đoán quá khứ: Must have Vp2, Can't have Vp2, Should have Vp2.",
        "sections": [
            {
                "subtitle": "1. Khuyết thiếu cơ bản",
                "content": "• Must: Bắt buộc từ người nói / Can't: Không thể.\n• Should / Ought to / Had better: Lời khuyên nên làm gì.\n• May / Might: Có thể xảy ra (độ chắc chắn thấp)."
            },
            {
                "subtitle": "2. Dự đoán hành động trong quá khứ (Modal + Have + Vp2)",
                "content": "• Must have + Vp2: Chắc hẳn đã (suy đoán chắc chắn 99% trong quá khứ dựa trên chứng cứ rõ ràng).\n• Can't have + Vp2: Chắc hẳn không thể đã xảy ra.\n• Should have + Vp2: Lẽ ra nên làm gì trong quá khứ nhưng đã không làm."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The pavement is soaking wet. It must (rain) ______ heavily last night.",
                "answer": "have rained",
                "alternatives": [],
                "hint": "Dự đoán chắc chắn trong quá khứ có chứng cứ (soaking wet): must have + Vp2",
                "explain": "Vỉa hè ướt sũng là chứng cứ rõ ràng -> chắc hẳn tối qua trời đã mưa: must have rained."
            },
            {
                "sentence": "You should (consult) ______ your doctor before starting this extreme fitness diet.",
                "answer": "have consulted",
                "alternatives": ["consult"],
                "hint": "Lẽ ra nên tham khảo ý kiến bác sĩ (nhưng đã không làm trong quá khứ)",
                "explain": "Cấu trúc: Should have Vp2 diễn tả một việc lẽ ra nên làm trong quá khứ: should have consulted."
            }
        ],
        "quiz": [
            {
                "q": "Tom ______ the bank robbery yesterday because he was attending a meeting in London with me.",
                "options": ["A. must have committed", "B. can't have committed", "C. should have committed", "D. needn't have committed"],
                "answer": "B",
                "explain": "Có chứng cứ ngoại phạm chắc chắn (đang họp ở London) -> Tom chắc chắn không thể là thủ phạm: can't have committed."
            }
        ]
    },

    # ---------------- 11. Danh Động Từ & Động Từ Nguyên Mẫu ----------------
    {
        "week_number": 11,
        "title": "Chuyên đề 11: Danh Động Từ & Động Từ Nguyên Mẫu (Gerunds & Infinitives)",
        "summary": "Phân loại động từ đi với V-ing, To-V, và nhóm động từ đổi nghĩa: Remember, Forget, Regret, Stop, Try, Mean.",
        "sections": [
            {
                "subtitle": "1. Động từ luôn theo sau bởi V-ing",
                "content": "• Avoid, admit, consider, deny, enjoy, finish, postpone, practice, suggest, mind, can't help, look forward to, be used to + V-ing."
            },
            {
                "subtitle": "2. Động từ luôn theo sau bởi To V",
                "content": "• Agree, decide, demand, hope, intend, manage, offer, plan, promise, refuse, afford + To-V."
            },
            {
                "subtitle": "3. Nhóm động từ thay đổi nghĩa",
                "content": "• Stop to V (dừng lại để làm gì) vs Stop V-ing (dừng hẳn việc đang làm).\n• Remember to V (nhớ phải làm gì) vs Remember V-ing (nhớ đã làm gì).\n• Try to V (cố gắng làm gì) vs Try V-ing (thử nghiệm làm gì)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "He stopped (smoke) ______ three years ago because of severe respiratory health issues.",
                "answer": "smoking",
                "alternatives": [],
                "hint": "Dừng hẳn một thói quen dùng Stop + V-ing",
                "explain": "Quy tắc: Stop + V-ing là từ bỏ hoàn toàn một thói quen (bỏ thuốc lá) -> smoking."
            },
            {
                "sentence": "Don't forget (lock) ______ the front gate before you go to sleep tonight.",
                "answer": "to lock",
                "alternatives": [],
                "hint": "Nhớ phải làm một nhiệm vụ trong tương lai dùng Remember/Forget + To V",
                "explain": "Nhắc nhở làm bổn phận ở tương lai -> to lock."
            }
        ],
        "quiz": [
            {
                "q": "I really look forward to ______ you at the international technology expo next week.",
                "options": ["A. meet", "B. meeting", "C. to meet", "D. met"],
                "answer": "B",
                "explain": "Cụm cố định: Look forward to + V-ing (rất mong chờ được làm gì) -> meeting."
            }
        ]
    },

    # ---------------- 12. Câu Hỏi Đuôi ----------------
    {
        "week_number": 12,
        "title": "Chuyên đề 12: Câu Hỏi Đuôi (Tag Questions & Các Trường Hợp Đặc Biệt)",
        "summary": "Nguyên tắc đối lập khẳng định/phủ định và 10 trường hợp câu hỏi đuôi đặc biệt dễ mất điểm trong các kỳ thi.",
        "sections": [
            {
                "subtitle": "1. Quy tắc cơ bản",
                "content": "• Mệnh đề khẳng định, đuôi phủ định (You are ready, aren't you?).\n• Mệnh đề phủ định, đuôi khẳng định (She didn't come, did she?)."
            },
            {
                "subtitle": "2. Các trường hợp đặc biệt quan trọng",
                "content": "• I am... -> aren't I?\n• Let's... -> shall we?\n• Câu mệnh lệnh (Open the window) -> will you?\n• Chủ ngữ là Everyone, Nobody, Somebody -> đại từ ở đuôi là 'they'.\n• Chủ ngữ là Nothing, Everything -> đại từ ở đuôi là 'it'.\n• Có từ bán phủ định (seldom, rarely, hardly, never, barely) -> đuôi khẳng định."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "She rarely drinks coffee in the late afternoon, (do) ______ she?",
                "answer": "does",
                "alternatives": [],
                "hint": "Từ bán phủ định 'rarely' khiến câu mang nghĩa phủ định, nên phần đuôi phải ở dạng khẳng định",
                "explain": "Có 'rarely' là từ bán phủ định, thì hiện tại đơn ngôi she -> đuôi khẳng định: does she."
            },
            {
                "sentence": "Let's organize a beach cleanup campaign this weekend, ______ we?",
                "answer": "shall",
                "alternatives": [],
                "hint": "Cấu trúc rủ rê 'Let's...' đi với câu hỏi đuôi 'shall we?'",
                "explain": "Quy tắc: Bắt đầu bằng Let's -> câu hỏi đuôi luôn là: shall we."
            }
        ],
        "quiz": [
            {
                "q": "Nobody phoned me while I was out at the supermarket, ______?",
                "options": ["A. didn't they", "B. did they", "C. did it", "D. didn't it"],
                "answer": "B",
                "explain": "'Nobody' mang nghĩa phủ định và thay bằng đại từ 'they' ở đuôi -> đuôi khẳng định: did they."
            }
        ]
    },

    # ---------------- 13. Đảo Ngữ ----------------
    {
        "week_number": 13,
        "title": "Chuyên đề 13: Đảo Ngữ (Inversion)",
        "summary": "Toàn bộ các cấu trúc đảo ngữ nâng cao: Đảo ngữ với trạng từ phủ định, Only, Not only... but also, No sooner, So/Such.",
        "sections": [
            {
                "subtitle": "1. Đảo ngữ với trạng từ phủ định đứng đầu câu",
                "content": "• Never, Rarely, Seldom, Little, Hardly, Scarcely + Trợ động từ + S + V.\n• Ví dụ: Seldom have I witnessed such profound resilience."
            },
            {
                "subtitle": "2. Cấu trúc Vừa mới... thì...",
                "content": "• No sooner + had + S + Vp2 + THAN + S + V2/ed.\n• Hardly/Scarcely + had + S + Vp2 + WHEN + S + V2/ed."
            },
            {
                "subtitle": "3. Đảo ngữ với ONLY và NOT UNTIL",
                "content": "• Not until + mốc/mệnh đề + Trợ động từ + S + V (Mãi cho đến khi... mới...).\n• Only after / Only when / Only by + Trợ động từ + S + V."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "Hardly had the keynote speaker stepped onto the stage (when) ______ the audience erupted into applause.",
                "answer": "when",
                "alternatives": [],
                "hint": "Cặp liên từ: Hardly/Scarcely had... WHEN...",
                "explain": "Quy tắc: No sooner đi với than; Hardly/Scarcely đi với when."
            },
            {
                "sentence": "Never before (have) ______ humanity faced such interconnected ecological crises.",
                "answer": "has",
                "alternatives": ["have"],
                "hint": "Đảo ngữ với Never before: Trợ động từ + S (humanity - số ít)",
                "explain": "Chủ ngữ 'humanity' (nhân loại) là danh từ số ít -> đảo trợ động từ has lên trước."
            }
        ],
        "quiz": [
            {
                "q": "Not until late in the evening ______ the final election results.",
                "options": ["A. did the committee announce", "B. the committee announced", "C. announced the committee", "D. has the committee announced"],
                "answer": "A",
                "explain": "Cấu trúc đảo ngữ: Not until + thời gian + Trợ động từ + S + V -> did the committee announce."
            }
        ]
    },

    # ---------------- 14. Thức Giả Định ----------------
    {
        "week_number": 14,
        "title": "Chuyên đề 14: Thức Giả Định (Subjunctive Mood)",
        "summary": "Giả định thức hiện tại với động từ và tính từ khuyên bảo, yêu cầu (essential, vital, recommend, demand, suggest) và giả định với It's time / Would rather.",
        "sections": [
            {
                "subtitle": "1. Thức giả định với tính từ & động từ yêu cầu",
                "content": "• Động từ: suggest, demand, insist, recommend, require, request, order + THAT + S + (should) + V_BARE.\n• Tính từ: It is important / essential / vital / imperative / necessary + THAT + S + (should) + V_BARE."
            },
            {
                "subtitle": "2. Cấu trúc It is (high/about) time",
                "content": "• It is high time + S + V2/ed (Đã đến lúc ai đó phải làm gì ở hiện tại)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The doctor strongly advised that the patient (stop) ______ consuming excessive sugar immediately.",
                "answer": "stop",
                "alternatives": ["should stop"],
                "hint": "Thức giả định: S + advise that + S + (should) + V_bare (động từ nguyên thể không chia)",
                "explain": "Sau 'advised that', động từ của mệnh đề sau luôn ở dạng nguyên thể không chia: stop."
            },
            {
                "sentence": "It is high time you (take) ______ responsibility for your own financial budget.",
                "answer": "took",
                "alternatives": [],
                "hint": "Cấu trúc: It is high time + S + V(quá khứ đơn)",
                "explain": "Sau 'It is high time', động từ lùi về thì quá khứ đơn: take -> took."
            }
        ],
        "quiz": [
            {
                "q": "It is imperative that every flight passenger ______ their seatbelt fastened during turbulence.",
                "options": ["A. keeps", "B. keep", "C. kept", "D. is keeping"],
                "answer": "B",
                "explain": "Cấu trúc giả định thức: It is imperative that + S + (should) + V_bare -> keep."
            }
        ]
    },

    # ---------------- 15. Mạo Từ ----------------
    {
        "week_number": 15,
        "title": "Chuyên đề 15: Mạo Từ (Articles: A, An, The & Zero Article)",
        "summary": "Cách phân biệt mạo từ bất định (A/An), xác định (The) và các trường hợp không dùng mạo từ (Zero Article) trong tiếng Anh chuẩn.",
        "sections": [
            {
                "subtitle": "1. Mạo từ bất định A / An",
                "content": "• Dùng trước danh từ đếm được số ít, nhắc đến lần đầu tiên.\n• An dùng trước danh từ phát âm bắt đầu bằng nguyên âm (/i/, /e/, /æ/, /ʌ/, /ɒ/ - an honest man, an hour, an umbrella)."
            },
            {
                "subtitle": "2. Mạo từ xác định THE",
                "content": "• Nhắc đến lần thứ hai; vật thể duy nhất (the Sun, the Moon, the Earth).\n• Dãy núi (the Himalayas), đại dương (the Pacific), sông (the Nile), quần đảo (the Philippines).\n• The + adj -> chỉ một nhóm người (the poor, the elderly)."
            },
            {
                "subtitle": "3. Không dùng mạo từ (Zero Article)",
                "content": "• Danh từ số nhiều / không đếm được nói chung (Love, Gold, Books are essential).\n• Tên ngọn núi đơn lẻ (Mount Everest), hồ đơn lẻ (Lake Geneva), lục địa (Asia, Europe), bữa ăn thông thường (have breakfast)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "He has been working as (a/an/the) ______ university lecturer for over fifteen years.",
                "answer": "a",
                "alternatives": [],
                "hint": "Từ 'university' bắt đầu bằng phụ âm /j/ nên đi với 'a', không đi với 'an'",
                "explain": "Mặc dù viết bằng chữ cái 'u', nhưng 'university' phát âm là /ˌjuːnɪˈvɜːsəti/ (phụ âm /j/) -> dùng mạo từ 'a'."
            },
            {
                "sentence": "(The/A/An) ______ Pacific Ocean is the largest and deepest oceanic division on Earth.",
                "answer": "The",
                "alternatives": ["the"],
                "hint": "Tên các đại dương luôn có mạo từ 'The'",
                "explain": "Đại dương, biển, sông ngòi luôn đi cùng 'The': The Pacific Ocean."
            }
        ],
        "quiz": [
            {
                "q": "My uncle is ______ honest businessman who always contributes to charitable causes.",
                "options": ["A. a", "B. an", "C. the", "D. zero article"],
                "answer": "B",
                "explain": "'Honest' có âm 'h' câm, phát âm bắt đầu bằng nguyên âm /ˈɒnɪst/ -> dùng 'an'."
            }
        ]
    },

    # ---------------- 16. Giới Từ ----------------
    {
        "week_number": 16,
        "title": "Chuyên đề 16: Giới Từ (Prepositions of Time, Place & Dependent Prepositions)",
        "summary": "Giới từ chỉ thời gian (In, On, At), giới từ chỉ nơi chốn, và các cụm tính từ/danh từ đi kèm giới từ cố định bắt buộc phải thuộc lòng.",
        "sections": [
            {
                "subtitle": "1. Giới từ chỉ thời gian & nơi chốn cơ bản",
                "content": "• IN: Năm, tháng, mùa, thế kỷ, buổi (in the morning), không gian lớn (in Vietnam, in the room).\n• ON: Ngày trong tuần (on Monday), ngày tháng cụ thể (on October 15th), bề mặt (on the table).\n• AT: Giờ chính xác (at 7 AM), dịp lễ (at Christmas), địa điểm cụ thể (at school, at home)."
            },
            {
                "subtitle": "2. Tính từ đi kèm giới từ cố định",
                "content": "• Fond of, proud of, capable of, guilty of.\n• Interested in, succeed in, engage in.\n• Dependent on, keen on, rely on.\n• Surprised at, good/bad at, furious at."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "She is extraordinarily proud (of) ______ her daughter's academic achievements.",
                "answer": "of",
                "alternatives": [],
                "hint": "Cụm tính từ cố định: Proud + OF",
                "explain": "Quy tắc: To be proud of sth/sb (tự hào về điều gì)."
            },
            {
                "sentence": "The international financial summit will take place (on) ______ October 24th, 2026.",
                "answer": "on",
                "alternatives": [],
                "hint": "Ngày tháng cụ thể đi với giới từ 'on'",
                "explain": "Quy tắc: Ngày cụ thể trong lịch luôn dùng giới từ 'on'."
            }
        ],
        "quiz": [
            {
                "q": "He has been fully responsible ______ managing customer accounts for three years.",
                "options": ["A. of", "B. with", "C. for", "D. about"],
                "answer": "C",
                "explain": "Cụm tính từ: To be responsible for sth/doing sth (chịu trách nhiệm cho việc gì)."
            }
        ]
    },

    # ---------------- 17. Liên Từ ----------------
    {
        "week_number": 17,
        "title": "Chuyên đề 17: Liên Từ & Mệnh Đề Trạng Ngữ (Conjunctions & Clauses)",
        "summary": "Phân biệt liên từ kết hợp (FANBOYS), tương quan, và cặp biến đổi kinh điển: Although/Even though vs In spite of/Despite, Because vs Because of.",
        "sections": [
            {
                "subtitle": "1. Nhượng bộ: Mặc dù... nhưng...",
                "content": "• Although / Even though / Though + MỆNH ĐỀ (S + V).\n• In spite of / Despite + CỤM DANH TỪ / V-ING.\n• Ví dụ: Despite the heavy rain, they arrived on time."
            },
            {
                "subtitle": "2. Nguyên nhân: Bởi vì...",
                "content": "• Because / Since / As + MỆNH ĐỀ (S + V).\n• Because of / Due to / Owing to + CỤM DANH TỪ / V-ING."
            },
            {
                "subtitle": "3. Mục đích: Để mà...",
                "content": "• So that / In order that + S + can/could/will/would + V_bare.\n• In order to / So as to + V_bare."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "(Despite/Although) ______ experiencing extreme fatigue, she managed to finish the marathon.",
                "answer": "Despite",
                "alternatives": ["In spite of"],
                "hint": "Đi với cụm V-ing (experiencing...) mang nghĩa nhượng bộ",
                "explain": "Sau vị trí trống là cụm V-ing 'experiencing extreme fatigue' -> dùng Despite hoặc In spite of."
            },
            {
                "sentence": "He wore a thick waterproof jacket in order (protect) ______ himself from the biting frost.",
                "answer": "to protect",
                "alternatives": [],
                "hint": "Cấu trúc mục đích: In order + TO V",
                "explain": "Cấu trúc: In order to + V_bare (để làm gì) -> to protect."
            }
        ],
        "quiz": [
            {
                "q": "______ severe supply chain bottlenecks, factory production remained on schedule.",
                "options": ["A. Although", "B. In spite", "C. Despite", "D. Because"],
                "answer": "C",
                "explain": "'severe supply chain bottlenecks' là một cụm danh từ mang ý nghĩa tương phản -> dùng 'Despite'."
            }
        ]
    },

    # ---------------- 18. Cụm Động Từ ----------------
    {
        "week_number": 18,
        "title": "Chuyên đề 18: Cụm Động Từ Thông Dụng (Essential Phrasal Verbs)",
        "summary": "Bộ tuyển tập hơn 50 cụm động từ thường gặp nhất trong đề thi THPT, VSTEP, IELTS: Look up, Turn down, Give up, Carry out, Put off...",
        "sections": [
            {
                "subtitle": "1. Phrasal verbs với Look & Turn",
                "content": "• Look after (chăm sóc) | Look for (tìm kiếm) | Look up (tra cứu) | Look down on (khinh thường).\n• Turn down (từ chối / vặn nhỏ) | Turn off (tắt) | Turn on (bật) | Turn up (xuất hiện / vặn to)."
            },
            {
                "subtitle": "2. Phrasal verbs với Put & Give & Carry",
                "content": "• Put off (trì hoãn = postpone/delay) | Put up with (chịu đựng = tolerate).\n• Give up (từ bỏ) | Give in (nhượng bộ / đầu hàng).\n• Carry out (tiến hành, thực hiện nghiên cứu) | Carry on (tiếp tục = continue)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The scientific team decided to carry (out) ______ clinical trials on the new vaccine.",
                "answer": "out",
                "alternatives": [],
                "hint": "Cụm 'Carry out' có nghĩa là tiến hành hoặc thực hiện",
                "explain": "Carry out research/trials: tiến hành thử nghiệm, nghiên cứu."
            },
            {
                "sentence": "Due to the torrential thunderstorm, the outdoor concert was put (off) ______ until next Sunday.",
                "answer": "off",
                "alternatives": [],
                "hint": "Cụm 'Put off' có nghĩa là trì hoãn (postpone)",
                "explain": "Put off = hoãn lại -> put off."
            }
        ],
        "quiz": [
            {
                "q": "She ______ the lucrative job offer in Singapore because she wanted to remain close to her family.",
                "options": ["A. turned down", "B. took after", "C. looked up", "D. put out"],
                "answer": "A",
                "explain": "'Turn down' có nghĩa là từ chối (refuse/reject) một lời đề nghị công việc."
            }
        ]
    },

    # ---------------- 19. Trật Tự Tính Từ OSASCOMP ----------------
    {
        "week_number": 19,
        "title": "Chuyên đề 19: Trật Tự Của Tính Từ (Order of Adjectives: OSASCOMP)",
        "summary": "Công thức thần chú OSASCOMP giúp giải quyết mọi câu hỏi trật tự tính từ đứng trước danh từ chỉ trong 5 giây.",
        "sections": [
            {
                "subtitle": "1. Thần chú OSASCOMP",
                "content": "• O - Opinion (Ý kiến, quan điểm: beautiful, lovely, terrible, nice).\n• S - Size (Kích thước: big, small, huge, tiny, long, short).\n• A - Age (Độ tuổi: young, old, new, ancient, antique).\n• S - Shape (Hình dáng: round, square, oval, flat).\n• C - Color (Màu sắc: red, blue, dark, black, white).\n• O - Origin (Nguồn gốc, xuất xứ: Vietnamese, Japanese, British, American).\n• M - Material (Chất liệu: silk, wooden, leather, metal, plastic).\n• P - Purpose (Mục đích: sleeping (bag), running (shoes), wedding (dress))."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "She was wearing a (beautiful / Italian / black) ______ silk evening dress to the gala.",
                "answer": "beautiful black Italian",
                "alternatives": [],
                "hint": "OSASCOMP: Opinion (beautiful) -> Color (black) -> Origin (Italian)",
                "explain": "Theo trật tự OSASCOMP: Opinion (beautiful) đứng trước Color (black), rồi đến Origin (Italian)."
            }
        ],
        "quiz": [
            {
                "q": "My father bought a ______ dining table for our newly renovated apartment.",
                "options": [
                    "A. wooden luxurious round",
                    "B. luxurious round wooden",
                    "C. round luxurious wooden",
                    "D. wooden round luxurious"
                ],
                "answer": "B",
                "explain": "Theo OSASCOMP: Opinion (luxurious) -> Shape (round) -> Material (wooden) -> luxurious round wooden."
            }
        ]
    },

    # ---------------- 20. Câu Chẻ Nhấn Mạnh ----------------
    {
        "week_number": 20,
        "title": "Chuyên đề 20: Câu Chẻ Nhấn Mạnh (Cleft Sentences: It is/was... that...)",
        "summary": "Cấu trúc nhấn mạnh chủ ngữ, tân ngữ, trạng ngữ và các biến thể nhấn mạnh trong văn viết học thuật.",
        "sections": [
            {
                "subtitle": "1. Cấu trúc câu chẻ cơ bản",
                "content": "• Công thức: IT IS / WAS + Thành phần nhấn mạnh + THAT + Mệnh đề còn lại.\n• Nhấn mạnh chủ ngữ: It was John that/who broke the window yesterday.\n• Nhấn mạnh tân ngữ: It is the environment that we must protect.\n• Nhấn mạnh trạng ngữ: It was in Paris that they first fell in love."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "It was in 1969 (that) ______ Apollo 11 successfully landed astronauts on the Moon.",
                "answer": "that",
                "alternatives": [],
                "hint": "Cấu trúc câu chẻ nhấn mạnh trạng ngữ thời gian: It was [time] THAT...",
                "explain": "Trong câu chẻ 'It was... that', từ nối chuẩn luôn là 'that'."
            }
        ],
        "quiz": [
            {
                "q": "It was my dedicated high school teacher ______ inspired me to pursue astrophysics.",
                "options": ["A. which", "B. who", "C. whose", "D. whom"],
                "answer": "B",
                "explain": "Nhấn mạnh chủ ngữ chỉ người trong câu chẻ có thể dùng 'who' hoặc 'that'."
            }
        ]
    },

    # ---------------- 21. Cấu Tạo Từ ----------------
    {
        "week_number": 21,
        "title": "Chuyên đề 21: Cấu Tạo Từ & Từ Loại (Word Formation)",
        "summary": "Nhận biết vị trí của Danh từ, Động từ, Tính từ, Trạng từ trong câu và các hậu tố/tiền tố tạo từ vựng quan trọng.",
        "sections": [
            {
                "subtitle": "1. Vị trí các từ loại",
                "content": "• Danh từ (Noun): Đứng đầu câu làm chủ ngữ; sau mạo từ (a/an/the); sau tính từ; sau giới từ.\n• Tính từ (Adjective): Đứng trước danh từ; đứng sau to be và linking verbs (seem, look, feel, become).\n• Trạng từ (Adverb): Bổ nghĩa cho động từ thường, tính từ, hoặc toàn bộ câu (Adv + Adj, V + Adv)."
            },
            {
                "subtitle": "2. Hậu tố nhận biết",
                "content": "• Noun: -tion, -sion, -ment, -ness, -ity, -ance, -ence, -er, -or.\n• Adj: -ful, -less, -able, -ive, -ous, -ic, -al.\n• Adv: -ly."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "Solar energy is an environmentally (friend) ______ alternative to burning fossil fuels.",
                "answer": "friendly",
                "alternatives": [],
                "hint": "Environmentally là trạng từ, đứng trước bổ nghĩa cho tính từ: friendly",
                "explain": "Cụm 'environmentally friendly' là cụm từ chuẩn (thân thiện với môi trường). Friend (danh từ) -> friendly (tính từ)."
            },
            {
                "sentence": "His outstanding (dedicate) ______ to clinical cancer research earned him international accolades.",
                "answer": "dedication",
                "alternatives": [],
                "hint": "Sau tính từ 'outstanding' cần một danh từ",
                "explain": "Sau tính từ cần danh từ: dedicate (v) -> dedication (n)."
            }
        ],
        "quiz": [
            {
                "q": "The committee commended the architect for her ______ contribution to urban renewal.",
                "options": ["A. significance", "B. significantly", "C. significant", "D. signify"],
                "answer": "C",
                "explain": "Đứng trước danh từ 'contribution' cần một tính từ bổ nghĩa: significant contribution."
            }
        ]
    },

    # ---------------- 22. Rút Gọn Mệnh Đề Cùng Chủ Ngữ ----------------
    {
        "week_number": 22,
        "title": "Chuyên đề 22: Rút Gọn Mệnh Đề Cùng Chủ Ngữ (Participle Clauses)",
        "summary": "Cách rút gọn hai mệnh đề có chung chủ ngữ bằng Hiện tại phân từ (V-ing), Quá khứ phân từ (Vp2) và Phân từ hoàn thành (Having + Vp2).",
        "sections": [
            {
                "subtitle": "1. Nguyên tắc rút gọn cùng chủ ngữ",
                "content": "• Hai mệnh đề phải có CÙNG CHỦ NGỮ.\n• Chủ động: Lược bỏ liên từ & chủ ngữ vế phụ, đưa động từ về V-ing.\n• Bị động: Đưa động từ về Vp2 (hoặc Being + Vp2).\n• Xảy ra trước: Dùng Having + Vp2 (chủ động) hoặc Having been + Vp2 (bị động)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "(Finish) ______ all her university entrance exams, she embarked on a relaxing trip to Da Lat.",
                "answer": "Having finished",
                "alternatives": ["Finishing"],
                "hint": "Hành động thi xong xảy ra trước hành động đi du lịch -> Having + Vp2",
                "explain": "Dùng Phân từ hoàn thành (Having finished) để nhấn mạnh một hành động đã hoàn tất trước khi hành động chính bắt đầu."
            }
        ],
        "quiz": [
            {
                "q": "______ from recycled plastic bottles, these eco-friendly jackets are lightweight yet durable.",
                "options": ["A. Making", "B. Having made", "C. Made", "D. To make"],
                "answer": "C",
                "explain": "Áo khoác được làm từ nhựa tái chế (mang nghĩa bị động) -> dùng quá khứ phân từ Vp2 đứng đầu câu: Made."
            }
        ]
    },

    # ---------------- 23. Lượng Từ ----------------
    {
        "week_number": 23,
        "title": "Chuyên đề 23: Lượng Từ & Từ Chỉ Số Lượng (Quantifiers)",
        "summary": "Phân biệt Many vs Much, A few vs Few, A little vs Little, Some vs Any, và Each vs Every.",
        "sections": [
            {
                "subtitle": "1. Few vs Little (Có rất ít, gần như không có - mang nghĩa tiêu cực)",
                "content": "• Few + Danh từ đếm được số nhiều (Few people came to the meeting).\n• Little + Danh từ không đếm được (I have little time left)."
            },
            {
                "subtitle": "2. A few vs A little (Có một chút, đủ dùng - mang nghĩa tích cực)",
                "content": "• A few + Danh từ đếm được số nhiều (I have a few close friends).\n• A little + Danh từ không đếm được (Add a little salt to the soup)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "Unfortunately, there is very (little/few) ______ hope of recovering the lost submarine.",
                "answer": "little",
                "alternatives": [],
                "hint": "'Hope' (hy vọng) là danh từ không đếm được",
                "explain": "Danh từ không đếm được 'hope' đi với 'little' (rất ít hy vọng)."
            }
        ],
        "quiz": [
            {
                "q": "She was disappointed because ______ students registered for the advanced robotics course.",
                "options": ["A. few", "B. a few", "C. little", "D. a little"],
                "answer": "A",
                "explain": "'Students' là danh từ đếm được số nhiều, và ngữ cảnh thất vọng (tiêu cực, hầu như không có ai) -> dùng 'few'."
            }
        ]
    },

    # ---------------- 24. Cụm Từ Cố Định ----------------
    {
        "week_number": 24,
        "title": "Chuyên đề 24: Cụm Từ Cố Định & Cụm Giới Từ (Collocations)",
        "summary": "Các kết hợp từ tự nhiên quan trọng trong đề thi: Make vs Do, Pay attention to, Catch/Lose sight of, In charge of...",
        "sections": [
            {
                "subtitle": "1. Phân biệt Make và Do",
                "content": "• Make: make a decision, make an effort, make a mistake, make progress, make room for, make fun of.\n• Do: do homework, do research, do business, do a favor, do harm/good, do one's best."
            },
            {
                "subtitle": "2. Cụm từ cố định ăn điểm",
                "content": "• Take advantage of (tận dụng) | Pay attention to (chú ý) | Keep pace with (bắt kịp) | Lose track of (mất dấu)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "Scientists are actively doing (research) ______ into renewable perovskite solar cells.",
                "answer": "research",
                "alternatives": [],
                "hint": "Cụm từ đi với DO: do research (làm nghiên cứu)",
                "explain": "Collocation chuẩn: Do research (không dùng make research)."
            }
        ],
        "quiz": [
            {
                "q": "Students are encouraged to ______ an active part in community greening initiatives.",
                "options": ["A. make", "B. take", "C. do", "D. have"],
                "answer": "B",
                "explain": "Collocation chuẩn: Take part in = participate in (tham gia vào)."
            }
        ]
    },

    # ---------------- 25. Tổng Ôn Đề Thi & Bẫy Ngữ Pháp ----------------
    {
        "week_number": 25,
        "title": "Chuyên đề 25: Tổng Ôn Toàn Diện & Giải Mã Bẫy Đề Thi Quốc Gia / VSTEP / IELTS",
        "summary": "Chiến lược nhận diện bẫy ngữ pháp: hòa hợp chủ vị phức hợp, đảo ngữ điều kiện kép, rút gọn khác chủ ngữ và câu hỏi phân hóa 9+.",
        "sections": [
            {
                "subtitle": "1. Nhận diện các bẫy thường gặp",
                "content": "• Bẫy mệnh đề quan hệ chen giữa chủ ngữ và động từ chính.\n• Bẫy đại từ phản thân và đảo ngữ phủ định.\n• Bẫy thì hoàn thành với mốc thời gian đã chấm dứt trong quá khứ."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "Neither of the proposed solutions (be) ______ deemed feasible by the executive board.",
                "answer": "was",
                "alternatives": ["is"],
                "hint": "'Neither of + N số nhiều' theo ngữ pháp chuẩn mực đi với động từ số ít",
                "explain": "'Neither of' đi với động từ số ít trong văn phong học thuật chuẩn mực -> was."
            }
        ],
        "quiz": [
            {
                "q": "The newly discovered manuscript, along with several ceremonial artifacts, ______ currently on display.",
                "options": ["A. are", "B. is", "C. were", "D. have been"],
                "answer": "B",
                "explain": "Chủ ngữ chính là 'The newly discovered manuscript' (số ít), cụm 'along with...' không làm thay đổi số của chủ ngữ -> is."
            }
        ]
    }
]

def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Clear existing grammar topics to cleanly replace with complete 25 topics
    cursor.execute("DELETE FROM grammar_topics")
    print("Cleared old grammar topics table.")
    
    inserted = 0
    for t in TOPICS:
        cursor.execute("""
            INSERT INTO grammar_topics (
                week_number, title, summary, sections_json, quiz_json, fill_blanks_json, source_verified, source_reference
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            t["week_number"],
            t["title"],
            t["summary"],
            json.dumps(t["sections"], ensure_ascii=False),
            json.dumps(t["quiz"], ensure_ascii=False),
            json.dumps(t["fill_blanks"], ensure_ascii=False),
            True,
            "Tổng ôn Ngữ pháp Tiếng Anh - Cô Trang Anh (NXB ĐHQG Hà Nội)"
        ))
        inserted += 1
        print(f"Inserted Chuyên đề {t['week_number']}: {t['title']}")
        
    conn.commit()
    conn.close()
    print(f"\nSuccessfully populated all {inserted} Grammar Topics from Cô Trang Anh's book!")

if __name__ == "__main__":
    main()
