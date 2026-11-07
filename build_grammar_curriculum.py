import json
import sqlite3
import os

target_dir = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web"
db_path = os.path.join(target_dir, "backend", "app.db")

grammar_21_topics = [
    {
        "week_number": 1,
        "title": "Chuyên đề 1: Thì động từ - Phần 1 (Hiện tại & Quá khứ: Đơn & Tiếp diễn)",
        "summary": "Nắm vững bản chất, công thức và dấu hiệu của 4 thì nền tảng: Hiện tại đơn (Present Simple), Hiện tại tiếp diễn (Present Continuous), Quá khứ đơn (Past Simple) và Quá khứ tiếp diễn (Past Continuous).",
        "sections": [
            {
                "subtitle": "1. Khái niệm & Bảng công thức chuẩn",
                "content": "• **Hiện tại đơn (Present Simple):**\n  - Khẳng định (+): S + V(s/es) / S + am/is/are\n  - Phủ định (-): S + do/does + not + V_inf / S + am/is/are + not\n  - Nghi vấn (?): Do/Does + S + V_inf? / Am/Is/Are + S + ...?\n  *Cách dùng:* Diễn tả sự thật hiển nhiên, thói quen lặp đi lặp lại, hoặc lịch trình cố định (giờ tàu xe, thời khóa biểu).\n\n• **Hiện tại tiếp diễn (Present Continuous):**\n  - Công thức: S + am/is/are + V-ing\n  *Cách dùng:* Diễn tả hành động đang diễn ra tại thời điểm nói hoặc kế hoạch chắc chắn trong tương lai gần.\n\n• **Quá khứ đơn (Past Simple):**\n  - Khẳng định (+): S + V2/ed / S + was/were\n  - Phủ định (-): S + did not + V_inf / S + was/were + not\n  *Cách dùng:* Hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ, có thời gian xác định.\n\n• **Quá khứ tiếp diễn (Past Continuous):**\n  - Công thức: S + was/were + V-ing\n  *Cách dùng:* Hành động đang diễn ra tại một thời điểm cụ thể trong quá khứ, hoặc hành động đang xảy ra thì có hành động khác xen vào (When + QKĐ, QKTD / While + QKTD, QKTD)."
            },
            {
                "subtitle": "2. Dấu hiệu nhận biết & Ví dụ song ngữ",
                "content": "• **Hiện tại đơn:** always, usually, often, sometimes, rarely, every day/week/year.\n  *Ví dụ:* The sun rises in the east. (Mặt trời mọc ở hướng đông.)\n\n• **Hiện tại tiếp diễn:** now, right now, at the moment, currently, Listen!, Look!\n  *Ví dụ:* Listen! Someone is knocking on the door. (Lắng nghe kìa! Có ai đó đang gõ cửa.)\n\n• **Quá khứ đơn:** yesterday, last night/week/month, in 1999, ago, previously.\n  *Ví dụ:* She graduated from university two years ago. (Cô ấy tốt nghiệp đại học cách đây 2 năm.)\n\n• **Quá khứ tiếp diễn:** at 8 PM yesterday, at this time last Sunday, while, as.\n  *Ví dụ:* When I was cooking dinner, the phone rang. (Khi tôi đang nấu bữa tối thì chuông điện thoại reo.)"
            },
            {
                "subtitle": "3. Các bẫy thường gặp & Mẹo làm bài thi",
                "content": "⚠️ **Bẫy Động từ chỉ trạng thái (Stative verbs):** Các động từ chỉ tri giác, cảm xúc (know, understand, believe, love, hate, want, seem, smell) KHÔNG chia ở thì tiếp diễn.\n  - Sai: *I am understanding the lesson.*\n  - Đúng: *I understand the lesson.*\n\n⚠️ **Bẫy hành động xen vào trong quá khứ:**\n  - Hành động kéo dài liên tục -> Dùng Quá khứ tiếp diễn (was/were + V-ing).\n  - Hành động đột ngột cắt ngang -> Dùng Quá khứ đơn (V2/ed)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "While Sarah was studying in the library yesterday, her phone suddenly _______ (ring).",
                "answer": "rang",
                "alternatives": ["rang"],
                "hint": "Hành động xen vào đột ngột trong quá khứ -> Chia thì Quá khứ đơn (V2 của ring).",
                "explain": "Sarah đang học bài (hành động kéo dài - QKTD) thì điện thoại reo (hành động xen vào - QKĐ: rang)."
            },
            {
                "sentence": "Look at those dark clouds! It _______ (rain) right now.",
                "answer": "is raining",
                "alternatives": ["'s raining", "is raining"],
                "hint": "Có dấu hiệu 'Look!' và 'right now' -> Chia thì Hiện tại tiếp diễn.",
                "explain": "Dấu hiệu 'Look!' và 'right now' chỉ hành động đang diễn ra tại thời điểm nói -> is raining."
            },
            {
                "sentence": "Every morning, my father _______ (drink) a cup of warm coffee before going to work.",
                "answer": "drinks",
                "alternatives": ["drinks"],
                "hint": "Thói quen hàng ngày (Every morning), chủ ngữ số ít 'my father' -> Thêm 's/es'.",
                "explain": "Hiện tại đơn diễn tả thói quen lặp đi lặp lại. Chủ ngữ 'my father' ngôi thứ 3 số ít -> drinks."
            }
        ],
        "quiz": [
            {
                "q": "At 7 PM yesterday, when we _______ dinner, the electricity suddenly went out.",
                "options": ["have", "were having", "had had", "are having"],
                "answer": 1,
                "explain": "Thời điểm cụ thể trong quá khứ (At 7 PM yesterday) kết hợp hành động đang diễn ra kéo dài thì có sự cố cúp điện xen vào -> Dùng Quá khứ tiếp diễn (were having)."
            },
            {
                "q": "Water _______ at 100 degrees Celsius under normal atmospheric pressure.",
                "options": ["is boiling", "boil", "boils", "boiled"],
                "answer": 2,
                "explain": "Sự thật hiển nhiên, chân lý khoa học -> Dùng thì Hiện tại đơn. Chủ ngữ 'Water' không đếm được -> động từ thêm 's' (boils)."
            },
            {
                "q": "I _______ this mathematics problem now, so please do not disturb me.",
                "options": ["am solving", "solve", "solved", "was solving"],
                "answer": 0,
                "explain": "Dấu hiệu 'now' và ngữ cảnh yêu cầu đừng làm phiền chứng tỏ hành động đang giải toán đang diễn ra -> am solving."
            }
        ]
    },
    {
        "week_number": 2,
        "title": "Chuyên đề 2: Thì động từ - Phần 2 (Hoàn thành & Tương lai)",
        "summary": "Làm chủ 4 thì nâng cao: Hiện tại hoàn thành (Present Perfect), Quá khứ hoàn thành (Past Perfect), Tương lai đơn (Future Simple) và Tương lai gần (Be going to).",
        "sections": [
            {
                "subtitle": "1. Khái niệm & Bảng công thức chuẩn",
                "content": "• **Hiện tại hoàn thành (Present Perfect):**\n  - Công thức: S + have/has + V3/ed\n  *Cách dùng:* Hành động bắt đầu trong quá khứ, kéo dài đến hiện tại và có thể tiếp diễn trong tương lai; hoặc hành động vừa mới xảy ra để lại kết quả ở hiện tại.\n\n• **Quá khứ hoàn thành (Past Perfect):**\n  - Công thức: S + had + V3/ed\n  *Cách dùng:* Hành động xảy ra và kết thúc TRƯỚC một hành động hoặc mốc thời gian khác trong quá khứ.\n  *Cấu trúc vàng:* Before/By the time + S + V2/ed, S + had + V3/ed. / After + S + had + V3/ed, S + V2/ed.\n\n• **Tương lai đơn (Future Simple):**\n  - Công thức: S + will + V_inf\n  *Cách dùng:* Quyết định tức thì ngay lúc nói, lời hứa, dự đoán không có căn cứ rõ ràng.\n\n• **Tương lai gần (Be going to):**\n  - Công thức: S + am/is/are going to + V_inf\n  *Cách dùng:* Kế hoạch đã được dự định trước, hoặc dự đoán dựa trên bằng chứng cụ thể ở hiện tại."
            },
            {
                "subtitle": "2. Dấu hiệu nhận biết & Phân biệt tinh tế",
                "content": "• **Hiện tại hoàn thành:** since (+ mốc thời gian), for (+ khoảng thời gian), already, yet, just, recently, so far, up to now, ever, never, this is the first time...\n  *Ví dụ:* I have lived in this city for ten years. (Tôi đã sống ở thành phố này được 10 năm.)\n\n• **Quá khứ hoàn thành:** by the time, before, after, by 2010, until then.\n  *Ví dụ:* By the time the doctor arrived, the patient had recovered. (Trước khi bác sĩ đến, bệnh nhân đã hồi phục.)\n\n• **Phân biệt Will vs Be going to:**\n  - Look at the sky! It is going to rain. (Có mây đen làm bằng chứng -> dùng be going to).\n  - The phone is ringing. - I will answer it. (Quyết định tức thì -> dùng will)."
            },
            {
                "subtitle": "3. Các bẫy thường gặp & Lưu ý phòng thi",
                "content": "⚠️ **Bẫy Since + Quá khứ đơn:**\n  - Mệnh đề trước since chia Hiện tại hoàn thành: S + have/has + V3/ed + since + S + V2/ed.\n  - Ví dụ: We haven't seen each other since we left school.\n\n⚠️ **Bẫy By the time:**\n  - By the time + Hiện tại đơn, Tương lai hoàn thành: By the time you arrive, I will have finished.\n  - By the time + Quá khứ đơn, Quá khứ hoàn thành: By the time you arrived, I had finished."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "By the time the fire brigade arrived at the scene, the fire _______ (already / destroy) the old warehouse.",
                "answer": "had already destroyed",
                "alternatives": ["had already destroyed", "had destroyed"],
                "hint": "Hành động đám cháy phá hủy xảy ra TRƯỚC khi cứu hỏa đến -> Dùng Quá khứ hoàn thành (had + V3).",
                "explain": "Cấu trúc: By the time + QKĐ (arrived), mệnh đề chính chia Quá khứ hoàn thành (had already destroyed)."
            },
            {
                "sentence": "Jane has worked as a senior software engineer for this company _______ 2018.",
                "answer": "since",
                "alternatives": ["since"],
                "hint": "Điền giới từ đi với mốc thời gian cụ thể (năm 2018) trong thì Hiện tại hoàn thành.",
                "explain": "Dùng 'since' trước mốc thời gian xác định (năm 2018), dùng 'for' trước khoảng thời gian."
            },
            {
                "sentence": "I haven't completed my quarterly financial report _______ (yet / already).",
                "answer": "yet",
                "alternatives": ["yet"],
                "hint": "Từ dùng cuối câu phủ định của thì Hiện tại hoàn thành để diễn tả việc 'chưa làm'.",
                "explain": "Trong câu phủ định của Hiện tại hoàn thành, dùng 'yet' ở cuối câu để mang nghĩa 'vẫn chưa'."
            }
        ],
        "quiz": [
            {
                "q": "She _______ in Hanoi since she graduated from university five years ago.",
                "options": ["lives", "is living", "has lived", "had lived"],
                "answer": 2,
                "explain": "Cấu trúc chuẩn: S + have/has + V3/ed + since + S + V2/ed. Hành động sống kéo dài từ lúc tốt nghiệp đến nay -> has lived."
            },
            {
                "q": "Look at those dark clouds! It _______ very soon.",
                "options": ["will rain", "is going to rain", "rained", "rains"],
                "answer": 1,
                "explain": "Dự đoán sự việc tương lai dựa trên căn cứ/dấu hiệu thực tế ở hiện tại (mây đen - dark clouds) -> dùng 'is going to rain'."
            },
            {
                "q": "After he _______ all his homework, he went out to play football with his friends.",
                "options": ["finishes", "has finished", "had finished", "finished"],
                "answer": 2,
                "explain": "Hành động hoàn thành bài tập xảy ra trước hành động đi đá bóng (went) -> dùng Quá khứ hoàn thành (had finished)."
            }
        ]
    },
    {
        "week_number": 3,
        "title": "Chuyên đề 3: Sự phối thì (Sequence of Tenses)",
        "summary": "Quy tắc hòa hợp thì giữa mệnh đề chính và mệnh đề phụ chỉ thời gian, nguyên nhân và kết quả. Tránh bẫy sai lệch dòng thời gian trong bài thi.",
        "sections": [
            {
                "subtitle": "1. Khái niệm & Nguyên tắc phối thì bất biến",
                "content": "Sự phối thì là quy tắc chia thì giữa mệnh đề chính (Main Clause) và mệnh đề phụ (Subordinate Clause - thường bắt đầu bằng when, while, as, before, after, by the time, as soon as, until).\n\n• **Nguyên tắc 1 (Mệnh đề chính ở Hiện tại/Tương lai):**\n  - Mệnh đề phụ thường chia ở Hiện tại đơn hoặc Hiện tại hoàn thành. Tuyệt đối KHÔNG chia thì Tương lai sau liên từ chỉ thời gian.\n  - Ví dụ: I will call you as soon as I arrive. (KHÔNG dùng: *as soon as I will arrive*).\n\n• **Nguyên tắc 2 (Mệnh đề chính ở Quá khứ):**\n  - Mệnh đề phụ phải lùi về các thì Quá khứ tương ứng (QK đơn, QK tiếp diễn, QK hoàn thành hoặc would + V_inf).\n  - Ví dụ: He said that he was busy. (KHÔNG dùng: *He said that he is busy*)."
            },
            {
                "subtitle": "2. Bảng tổng hợp công thức phối thì thường gặp",
                "content": "• **When + QKĐ, QKĐ:** Hai hành động xảy ra nối tiếp nhau trong quá khứ.\n  - Ví dụ: When the bell rang, the students ran out of class.\n\n• **When + QKĐ, QKTD:** Một hành động đang xảy ra thì hành động khác chen ngang.\n  - Ví dụ: When I arrived, they were watching a movie.\n\n• **When + QKĐ, QKHT:** Hành động trong mệnh đề chính đã hoàn tất trước khi hành động sau when xảy ra.\n  - Ví dụ: When we reached the cinema, the film had already started.\n\n• **Until / As soon as / Once + S + V(hiện tại đơn), S + will + V_inf:**\n  - Ví dụ: We will wait here until she comes back."
            },
            {
                "subtitle": "3. Bẫy phòng thi cần ghi nhớ",
                "content": "⚠️ **Bẫy mệnh đề thời gian:** Trong các mệnh đề bắt đầu bằng *when, while, as soon as, before, after, until, once*, KHÔNG BAO GIỜ dùng thì tương lai (will/shall).\n  - Sai: *I will tell him when he will come.*\n  - Đúng: *I will tell him when he comes.*"
            }
        ],
        "fill_blanks": [
            {
                "sentence": "I will give you a call as soon as I _______ (finish) my presentation.",
                "answer": "finish",
                "alternatives": ["finish", "have finished"],
                "hint": "Mệnh đề sau liên từ chỉ thời gian 'as soon as' không được dùng 'will', phải chia thì Hiện tại.",
                "explain": "Quy tắc phối thì: Tương lai đơn (will give) + as soon as + Hiện tại đơn (finish)."
            },
            {
                "sentence": "When Mr. Brown walked into the conference room, everyone _______ (stand) up to applaud.",
                "answer": "stood",
                "alternatives": ["stood"],
                "hint": "Hai hành động xảy ra nối tiếp nhau trong quá khứ -> Cả hai đều chia Quá khứ đơn.",
                "explain": "Hành động bước vào và đứng dậy vỗ tay diễn ra liên tiếp -> chia Quá khứ đơn (stood)."
            }
        ],
        "quiz": [
            {
                "q": "We will start the meeting as soon as our director _______.",
                "options": ["will arrive", "arrives", "arrived", "is arriving"],
                "answer": 1,
                "explain": "Trong mệnh đề trạng ngữ chỉ thời gian bắt đầu bằng 'as soon as', ta dùng thì Hiện tại đơn (arrives) để diễn tả tương lai, không dùng 'will'."
            },
            {
                "q": "Yesterday, by the time David reached the station, the train _______.",
                "options": ["left", "has left", "had already left", "was leaving"],
                "answer": 2,
                "explain": "Cấu trúc: By the time + QKĐ (reached), mệnh đề chính chia Quá khứ hoàn thành (had already left) để chỉ hành động xảy ra và kết thúc trước."
            }
        ]
    },
    {
        "week_number": 4,
        "title": "Chuyên đề 4: Sự hòa hợp Chủ ngữ & Động từ (Subject-Verb Agreement)",
        "summary": "Quy tắc quyết định động từ chia số ít hay số nhiều dựa trên các loại chủ ngữ đặc biệt: danh từ tập hợp, đại từ bất định, cấu trúc either...or, neither...nor, as well as.",
        "sections": [
            {
                "subtitle": "1. Các trường hợp luôn chia Động từ SỐ ÍT",
                "content": "• **Chủ ngữ là đại từ bất định:** everyone, someone, anyone, no one, everybody, somebody, anybody, nobody, everything, something, anything, nothing, each, every.\n  - Ví dụ: Everyone is eager to join the trip. / Each of the students has a laptop.\n\n• **Chủ ngữ chỉ thời gian, khoảng cách, tiền bạc, đo lường:**\n  - Ví dụ: Ten miles is a long distance to walk. / Fifty dollars is too expensive for this shirt.\n\n• **Chủ ngữ là tựa đề sách, phim, môn học, căn bệnh:** mathematics, physics, economics, measles, news.\n  - Ví dụ: The news was surprising. / Physics is my favorite subject.\n\n• **Chủ ngữ là V-ing (Danh động từ):**\n  - Ví dụ: Learning foreign languages opens many opportunities."
            },
            {
                "subtitle": "2. Các trường hợp chia Động từ SỐ NHIỀU hoặc theo Chủ ngữ gần nhất",
                "content": "• **Luôn chia số nhiều:** The + Tính từ (chỉ tập hợp người: the rich, the poor, the blind, the homeless), people, cattle, police.\n  - Ví dụ: The police are investigating the robbery. / The poor need our support.\n\n• **Cấu trúc chia theo Chủ ngữ GẦN NHẤT (S2):**\n  - Either S1 or S2 + V(chia theo S2)\n  - Neither S1 nor S2 + V(chia theo S2)\n  - Not only S1 but also S2 + V(chia theo S2)\n  - Ví dụ: Neither the manager nor the employees were informed.\n\n• **Cấu trúc chia theo Chủ ngữ ĐẦU TIÊN (S1):**\n  - S1 + as well as / along with / together with / accompanied by / in addition to + S2 + V(chia theo S1)\n  - Ví dụ: The teacher, together with her students, is visiting the museum."
            },
            {
                "subtitle": "3. Bẫy tinh vi: A number of vs The number of",
                "content": "⚠️ **Phân biệt kinh điển:**\n  - **A number of + N(số nhiều) + V(số nhiều):** Mang nghĩa là 'nhiều' (many).\n    *Ví dụ:* A number of students are waiting outside.\n  - **The number of + N(số nhiều) + V(SỐ ÍT):** Mang nghĩa là 'số lượng của...'.\n    *Ví dụ:* The number of applicants has increased sharply this year."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The number of endangered species _______ (be) increasing at an alarming rate worldwide.",
                "answer": "is",
                "alternatives": ["is"],
                "hint": "Cấu trúc 'The number of + N số nhiều' luôn đi với động từ số ít.",
                "explain": "'The number of' nhấn mạnh vào con số/số lượng cụ thể -> chia động từ số ít (is)."
            },
            {
                "sentence": "Neither John nor his close friends _______ (be) available to attend the party tonight.",
                "answer": "are",
                "alternatives": ["are"],
                "hint": "Cấu trúc 'Neither S1 nor S2' -> động từ hòa hợp theo chủ ngữ gần nhất S2 (his close friends).",
                "explain": "Chủ ngữ gần nhất 'his close friends' là số nhiều -> dùng 'are'."
            }
        ],
        "quiz": [
            {
                "q": "The manager, along with two assistant directors, _______ attending the annual summit.",
                "options": ["is", "are", "were", "have been"],
                "answer": 0,
                "explain": "Cấu trúc: S1 + along with + S2 + V(chia theo S1). Chủ ngữ S1 là 'The manager' số ít -> dùng 'is'."
            },
            {
                "q": "Ten kilometers _______ considered too long for an untrained person to run without resting.",
                "options": ["are", "is", "were", "have been"],
                "answer": 1,
                "explain": "Khoảng cách đo lường (Ten kilometers) được coi là một đơn vị tổng thể duy nhất -> chia động từ số ít (is)."
            }
        ]
    },
    {
        "week_number": 5,
        "title": "Chuyên đề 5: Câu bị động (Passive Voice & Thể truyền khiến)",
        "summary": "Công thức biến đổi bị động cho các thì, động từ khuyết thiếu, cấu trúc bị động đặc biệt (động từ chỉ ý kiến, thể truyền khiến have/get sth done).",
        "sections": [
            {
                "subtitle": "1. Công thức bị động tổng quát & Các thì cơ bản",
                "content": "• **Công thức gốc:** S + be + V3/ed (+ by O)\n  - Hiện tại đơn: am/is/are + V3/ed\n  - Hiện tại tiếp diễn: am/is/are + being + V3/ed\n  - Quá khứ đơn: was/were + V3/ed\n  - Hiện tại hoàn thành: have/has + been + V3/ed\n  - Động từ khuyết thiếu (Modal verbs): modal + be + V3/ed\n\n• **Ví dụ:**\n  - Chủ động: The mechanic is repairing my car.\n  - Bị động: My car is being repaired by the mechanic."
            },
            {
                "subtitle": "2. Cấu trúc bị động đặc biệt & Thể truyền khiến (Causative)",
                "content": "• **Thể truyền khiến (Nhờ ai làm gì / Có cái gì được làm):**\n  - Chủ động: Have sb do sth / Get sb to do sth (Nhờ ai làm việc gì)\n  - Bị động: Have/Get sth done (by sb) (Có cái gì được làm bởi ai)\n  - *Ví dụ:* I had my roof repaired yesterday. (Tôi đã thuê người sửa mái nhà hôm qua.)\n\n• **Bị động với động từ chỉ quan điểm, ý kiến (say, think, believe, report):**\n  - Dạng 1: It is said/believed/thought that + S + V...\n  - Dạng 2: S + is/are said/believed + to V_inf (nếu cùng thì) / to have V3/ed (nếu trước thì)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "I need to go to the garage to have my car _______ (inspect) before the long road trip.",
                "answer": "inspected",
                "alternatives": ["inspected"],
                "hint": "Cấu trúc truyền khiến bị động: have + something + V3/ed.",
                "explain": "Cấu trúc: Have + sth (my car) + V3/ed (inspected) mang nghĩa 'cho xe được kiểm tra/bảo dưỡng'."
            }
        ],
        "quiz": [
            {
                "q": "The new hospital _______ by the prime minister next Monday.",
                "options": ["will inaugurate", "will be inaugurated", "is inaugurated", "inaugurates"],
                "answer": 1,
                "explain": "Chủ ngữ 'The new hospital' chịu tác động của hành động khánh thành trong tương lai -> Bị động tương lai đơn: will be inaugurated."
            }
        ]
    },
    {
        "week_number": 6,
        "title": "Chuyên đề 6: Câu điều kiện & Câu ước (Conditionals & Wish)",
        "summary": "Công thức và ứng dụng của Câu điều kiện loại 1, 2, 3, điều kiện hỗn hợp (Mixed conditionals), đảo ngữ câu điều kiện và cấu trúc Wish/If only.",
        "sections": [
            {
                "subtitle": "1. Bảng 3 loại câu điều kiện chuẩn",
                "content": "• **Loại 1 (Có thật ở hiện tại/tương lai):**\n  - If + S + V(hiện tại đơn), S + will/can/may + V_inf\n  - Ví dụ: If it rains tomorrow, we will stay at home.\n\n• **Loại 2 (Không có thật ở hiện tại):**\n  - If + S + V2/ed (were cho mọi ngôi), S + would/could + V_inf\n  - Ví dụ: If I were you, I would accept that job offer.\n\n• **Loại 3 (Không có thật trong quá khứ):**\n  - If + S + had + V3/ed, S + would/could + have + V3/ed\n  - Ví dụ: If she had studied harder, she would have passed the exam."
            },
            {
                "subtitle": "2. Đảo ngữ câu điều kiện & Câu ước (Wish)",
                "content": "• **Đảo ngữ (Bỏ 'If'):**\n  - Loại 1: Should + S + V_inf, S + will + V_inf\n  - Loại 2: Were + S + to V_inf / Were + S + adj/noun, S + would + V_inf\n  - Loại 3: Had + S + V3/ed, S + would have + V3/ed\n\n• **Cấu trúc Wish / If only (Ước):**\n  - Ước cho hiện tại: S + wish + S + V2/ed (were)\n  - Ước cho quá khứ: S + wish + S + had + V3/ed\n  - Ước cho tương lai: S + wish + S + would/could + V_inf"
            }
        ],
        "fill_blanks": [
            {
                "sentence": "If I _______ (know) his phone number yesterday, I would have invited him to dinner.",
                "answer": "had known",
                "alternatives": ["had known"],
                "hint": "Điều kiện loại 3 (không có thật trong quá khứ: yesterday -> had + V3).",
                "explain": "Vế chính có 'would have invited' -> vế If chia Quá khứ hoàn thành: had known."
            }
        ],
        "quiz": [
            {
                "q": "_______ you need any further assistance, please do not hesitate to contact our support team.",
                "options": ["Should", "Were", "Had", "Unless"],
                "answer": 0,
                "explain": "Đảo ngữ câu điều kiện loại 1: Should + S + V_inf = If you need any further assistance."
            }
        ]
    },
    {
        "week_number": 7,
        "title": "Chuyên đề 7: Mệnh đề quan hệ & Rút gọn mệnh đề quan hệ",
        "summary": "Phân biệt đại từ quan hệ (Who, Whom, Which, That, Whose), mệnh đề xác định & không xác định, và 3 cách rút gọn mệnh đề quan hệ đỉnh cao.",
        "sections": [
            {
                "subtitle": "1. Đại từ & Trạng từ quan hệ cốt lõi",
                "content": "• **Who:** Thay cho danh từ chỉ người, làm chủ ngữ/tân ngữ.\n• **Whom:** Thay cho danh từ chỉ người, làm tân ngữ (đứng sau giới từ: to whom, with whom).\n• **Which:** Thay cho danh từ chỉ vật.\n• **That:** Thay cho cả người và vật trong mệnh đề xác định (không đứng sau dấu phẩy và giới từ).\n• **Whose:** Chỉ sở hữu (N1 + whose + N2).\n• **Where / When / Why:** Chỉ nơi chốn, thời gian, lý do."
            },
            {
                "subtitle": "2. Ba quy tắc rút gọn mệnh đề quan hệ chuẩn",
                "content": "• **Rút gọn dạng chủ động -> Dùng V-ing:**\n  - The man who stands at the gate -> The man standing at the gate.\n\n• **Rút gọn dạng bị động -> Dùng V3/ed:**\n  - The books which were written by him -> The books written by him.\n\n• **Rút gọn sau the first, the second, the last, the only, so sánh nhất -> Dùng To V_inf:**\n  - Neil Armstrong was the first person who walked on the Moon -> the first person to walk on the Moon."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The girl _______ (sit) next to the window is the top student in our class.",
                "answer": "sitting",
                "alternatives": ["sitting"],
                "hint": "Rút gọn mệnh đề quan hệ ở thể chủ động (who is sitting) -> dùng V-ing.",
                "explain": "Dạng chủ động rút gọn thành V-ing: The girl sitting next to the window."
            }
        ],
        "quiz": [
            {
                "q": "He was the first athlete from our country _______ a gold medal at the Olympic Games.",
                "options": ["win", "to win", "winning", "won"],
                "answer": 1,
                "explain": "Sau số thứ tự (the first, the second...) ta rút gọn mệnh đề quan hệ bằng 'To V_inf' -> to win."
            }
        ]
    },
    {
        "week_number": 8,
        "title": "Chuyên đề 8: Câu gián tiếp (Reported Speech)",
        "summary": "Quy tắc lùi thì, biến đổi đại từ, tính từ sở hữu và trạng từ chỉ thời gian - nơi chốn trong câu tường thuật câu kể, câu hỏi và câu mệnh lệnh.",
        "sections": [
            {
                "subtitle": "1. Quy tắc lùi thì bất biến",
                "content": "Khi động từ tường thuật ở quá khứ (said, told, asked), ta lùi thì:\n- Hiện tại đơn -> Quá khứ đơn\n- Hiện tại tiếp diễn -> Quá khứ tiếp diễn\n- Hiện tại hoàn thành / Quá khứ đơn -> Quá khứ hoàn thành\n- Will -> Would, Can -> Could, May -> Might, Must -> Had to."
            },
            {
                "subtitle": "2. Biến đổi trạng từ thời gian & nơi chốn",
                "content": "• now -> then\n• today -> that day\n• yesterday -> the day before / the previous day\n• tomorrow -> the next day / the following day\n• ago -> before\n• this / these -> that / those\n• here -> there"
            }
        ],
        "fill_blanks": [
            {
                "sentence": "\"I am working on a new project today,\" David said. -> David said that he _______ working on a new project that day.",
                "answer": "was",
                "alternatives": ["was"],
                "hint": "Lùi thì Hiện tại tiếp diễn (am working) về Quá khứ tiếp diễn.",
                "explain": "Câu gián tiếp lùi thì từ 'am working' thành 'was working'."
            }
        ],
        "quiz": [
            {
                "q": "She asked me where _______ during my summer vacation.",
                "options": ["I had gone", "had I gone", "did I go", "I have gone"],
                "answer": 0,
                "explain": "Trong câu hỏi gián tiếp, cấu trúc là 'S + V' (không đảo trợ động từ lên trước chủ ngữ) và phải lùi thì -> where I had gone."
            }
        ]
    },
    {
        "week_number": 9,
        "title": "Chuyên đề 9: So sánh tính từ & Trạng từ (Comparisons)",
        "summary": "So sánh bằng (as...as), so sánh hơn (-er/more), so sánh nhất (-est/most), so sánh kép (The more... the more) và so sánh bội số.",
        "sections": [
            {
                "subtitle": "1. Các cấp so sánh chính",
                "content": "• **So sánh bằng:** as + adj/adv + as (phủ định: not as/so + adj/adv + as)\n• **So sánh hơn:**\n  - Ngắn: adj/adv-er + than (tính từ 1 âm tiết, hoặc 2 âm tiết tận cùng -y, -le, -er, -ow)\n  - Dài: more + adj/adv + than\n• **So sánh nhất:** the + adj/adv-est / the most + adj/adv\n• **Bất quy tắc:** good/well -> better -> best; bad/badly -> worse -> worst; far -> farther/further -> farthest/furthest."
            },
            {
                "subtitle": "2. So sánh kép (Càng... càng...)",
                "content": "• **Công thức:** The + so sánh hơn + S1 + V1, the + so sánh hơn + S2 + V2.\n  - Ví dụ: The more you practice, the better you become. (Bạn càng luyện tập nhiều, bạn càng giỏi hơn.)\n  - The harder he works, the more successful he is."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The higher we climbed up the mountain, the _______ (cold) the air became.",
                "answer": "colder",
                "alternatives": ["colder"],
                "hint": "Cấu trúc so sánh kép: The + so sánh hơn, the + so sánh hơn.",
                "explain": "Tính từ ngắn 'cold' thêm '-er' trong so sánh kép: the colder the air became."
            }
        ],
        "quiz": [
            {
                "q": "The earlier you book the flight tickets, _______ the price will be.",
                "options": ["cheaper", "the cheaper", "the more cheap", "cheapest"],
                "answer": 1,
                "explain": "Cấu trúc so sánh kép chuẩn: The earlier..., the cheaper the price will be."
            }
        ]
    },
    {
        "week_number": 10,
        "title": "Chuyên đề 10: Động từ khuyết thiếu (Modal Verbs & Modal Perfect)",
        "summary": "Cách dùng Can, Could, May, Might, Must, Should, Ought to và cấu trúc phỏng đoán trong quá khứ (Must have V3, Can't have V3, Should have V3).",
        "sections": [
            {
                "subtitle": "1. Động từ khuyết thiếu cơ bản",
                "content": "• **Must:** Bắt buộc từ người nói, hoặc phỏng đoán chắc chắn ở hiện tại.\n• **Have to:** Bắt buộc do hoàn cảnh khách quan, luật lệ.\n• **Should / Ought to:** Khuyên bảo (nên làm gì).\n• **Can / Could:** Khả năng, xin phép.\n• **May / Might:** Khả năng có thể xảy ra (độ chắc chắn thấp hơn)."
            },
            {
                "subtitle": "2. Phỏng đoán trong quá khứ (Modal Perfect)",
                "content": "• **Must have + V3/ed:** Chắc hẳn đã xảy ra (có chứng cứ rõ ràng).\n  - The ground is wet. It must have rained last night.\n• **Can't / Couldn't have + V3/ed:** Chắc chắn đã không xảy ra.\n  - He can't have stolen the money; he was with me all evening.\n• **Should have + V3/ed:** Lẽ ra nên làm gì trong quá khứ (nhưng thực tế đã không làm)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "You _______ (should / must) have listened to the doctor's advice, but unfortunately you ignored it.",
                "answer": "should",
                "alternatives": ["should", "ought to"],
                "hint": "Cấu trúc 'lẽ ra nên làm gì trong quá khứ': should have + V3.",
                "explain": "Should have + V3 diễn tả sự hối tiếc hoặc trách móc một việc lẽ ra nên làm nhưng đã không làm."
            }
        ],
        "quiz": [
            {
                "q": "The lights are completely off and nobody answers the door. They _______ gone out for dinner.",
                "options": ["must have", "should have", "can't have", "needn't have"],
                "answer": 0,
                "explain": "Phỏng đoán chắc chắn trong quá khứ có bằng chứng (đèn tắt, không ai mở cửa) -> must have gone out."
            }
        ]
    },
    {
        "week_number": 11,
        "title": "Chuyên đề 11: Danh động từ & Động từ nguyên mẫu (Gerunds & Infinitives)",
        "summary": "Phân biệt các động từ đi với V-ing (enjoy, avoid, suggest), To-V (decide, promise, hope) và các động từ đổi nghĩa (remember, forget, stop, try).",
        "sections": [
            {
                "subtitle": "1. Danh sách động từ đi với V-ing & To-V",
                "content": "• **Đi với V-ing:** admit, avoid, consider, deny, enjoy, finish, postpone, practice, suggest, mind, can't help.\n• **Đi với To-V:** agree, decide, demand, hope, manage, offer, plan, promise, refuse, threaten, afford."
            },
            {
                "subtitle": "2. Các động từ đổi nghĩa tùy theo V-ing hoặc To-V",
                "content": "• **Stop to V:** Dừng lại để làm việc khác.\n  - He stopped to buy a newspaper.\n• **Stop V-ing:** Dừng hẳn việc đang làm.\n  - He stopped smoking three years ago.\n• **Remember / Forget to V:** Nhớ/quên phải làm việc gì (bổn phận).\n• **Remember / Forget V-ing:** Nhớ/quên đã từng làm gì trong quá khứ.\n• **Try to V:** Cố gắng làm gì.\n• **Try V-ing:** Thử làm gì."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "Remember _______ (turn) off all the lights before you leave the office.",
                "answer": "to turn",
                "alternatives": ["to turn"],
                "hint": "Nhớ phải làm một bổn phận/nhiệm vụ -> dùng remember + to V.",
                "explain": "Remember to V là nhắc nhở làm việc gì trong tương lai."
            }
        ],
        "quiz": [
            {
                "q": "He decided _______ the lucrative job offer in London to stay close to his family.",
                "options": ["decline", "to decline", "declining", "declined"],
                "answer": 1,
                "explain": "Động từ 'decide' luôn đi với động từ nguyên mẫu có 'to' (to V) -> to decline."
            }
        ]
    },
    {
        "week_number": 12,
        "title": "Chuyên đề 12: Đảo ngữ (Inversion)",
        "summary": "Cấu trúc đảo trợ động từ lên trước chủ ngữ khi đứng đầu câu bằng từ phủ định (Never, Rarely, Scarcely), Only, Not until và No sooner... than.",
        "sections": [
            {
                "subtitle": "1. Đảo ngữ với trạng từ phủ định / bán phủ định",
                "content": "• **Từ phủ định đứng đầu câu:** Never, Rarely, Seldom, Little, Hardly, Scarcely, Barely.\n  - Công thức: Trạng từ phủ định + Trợ động từ + S + V...\n  - Ví dụ: Rarely have I seen such an inspiring performance."
            },
            {
                "subtitle": "2. Các cấu trúc đảo ngữ kinh điển trong đề thi",
                "content": "• **No sooner... than... (Vừa mới... thì...):**\n  - No sooner + had + S + V3/ed + than + S + V2/ed.\n  - Ví dụ: No sooner had I arrived home than it started to pour.\n• **Hardly / Scarcely... when...:**\n  - Hardly had + S + V3/ed + when + S + V2/ed.\n• **Not until + mốc thời gian / S + V + Trợ động từ + S + V:**\n  - Not until midnight did they finish the meeting."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "Never before _______ (have / has) she witnessed such an extraordinary sunset.",
                "answer": "has",
                "alternatives": ["has"],
                "hint": "Đảo ngữ với Never before, chủ ngữ 'she' ngôi thứ 3 số ít -> trợ động từ 'has'.",
                "explain": "Đảo ngữ: Never before + has + she + witnessed."
            }
        ],
        "quiz": [
            {
                "q": "No sooner _______ the station than the train departed.",
                "options": ["we had reached", "had we reached", "did we reach", "have we reached"],
                "answer": 1,
                "explain": "Cấu trúc đảo ngữ: No sooner + had + S + V3/ed + than... -> had we reached."
            }
        ]
    },
    {
        "week_number": 13,
        "title": "Chuyên đề 13: Thức giả định (Subjunctive Mood)",
        "summary": "Cấu trúc giả định với tính từ (essential, crucial, vital), động từ (suggest, demand, insist) và các cấu trúc would rather, It's high time.",
        "sections": [
            {
                "subtitle": "1. Giả định với Động từ & Tính từ đòi hỏi",
                "content": "• **Động từ:** suggest, recommend, insist, demand, order, request, propose.\n  - Công thức: S1 + V(suggest/demand...) + that + S2 + (should) + V_nguyên thể không chia.\n  - Ví dụ: The doctor suggested that he (should) stop smoking.\n• **Tính từ:** essential, vital, crucial, important, necessary.\n  - Công thức: It is + adj + that + S + (should) + V_nguyên thể.\n  - Ví dụ: It is crucial that every student submit their homework on time."
            },
            {
                "subtitle": "2. Giả định với It is high time & Would rather",
                "content": "• **It is (high / about) time + S + V2/ed:** Đã đến lúc ai đó phải làm gì.\n  - Ví dụ: It is high time we started working.\n• **S1 + would rather + S2 + V2/ed:** Muốn ai đó làm gì ở hiện tại/tương lai.\n  - Ví dụ: I would rather you didn't tell anyone about this."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The manager insisted that the report _______ (submit) by 5 PM today.",
                "answer": "be submitted",
                "alternatives": ["be submitted", "should be submitted"],
                "hint": "Thức giả định bị động: S + insist that + S + (should) + be + V3/ed.",
                "explain": "Động từ 'submit' ở thể bị động trong mệnh đề giả định -> (should) be submitted."
            }
        ],
        "quiz": [
            {
                "q": "It is essential that everyone _______ the safety regulations in the laboratory.",
                "options": ["follows", "follow", "followed", "following"],
                "answer": 1,
                "explain": "Thức giả định sau 'It is essential that': động từ luôn ở dạng nguyên thể không 'to' (bare infinitive) -> follow."
            }
        ]
    },
    {
        "week_number": 14,
        "title": "Chuyên đề 14: Câu chẻ nhấn mạnh (Cleft Sentences)",
        "summary": "Mẫu câu It is / was... that... dùng để nhấn mạnh chủ ngữ, tân ngữ hoặc trạng từ chỉ thời gian, nơi chốn trong câu.",
        "sections": [
            {
                "subtitle": "1. Cấu trúc câu chẻ chuẩn",
                "content": "• **Công thức gốc:** It is / was + Thành phần cần nhấn mạnh + that / who + S + V...\n• **Nhấn mạnh chủ ngữ:**\n  - It was John who broke the antique vase yesterday.\n• **Nhấn mạnh tân ngữ:**\n  - It was this antique vase that John broke yesterday.\n• **Nhấn mạnh trạng ngữ:**\n  - It was yesterday that John broke the antique vase."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "It was in Paris _______ (that / where) they first met twenty years ago.",
                "answer": "that",
                "alternatives": ["that"],
                "hint": "Cấu trúc câu chẻ nhấn mạnh trạng ngữ nơi chốn luôn dùng 'that' (không dùng where).",
                "explain": "Quy tắc câu chẻ: It was + trạng ngữ + that..."
            }
        ],
        "quiz": [
            {
                "q": "It was my chemistry teacher _______ inspired me to pursue a scientific career.",
                "options": ["which", "who", "whom", "whose"],
                "answer": 1,
                "explain": "Nhấn mạnh chủ ngữ chỉ người (my chemistry teacher) trong câu chẻ -> dùng 'who' hoặc 'that'."
            }
        ]
    },
    {
        "week_number": 15,
        "title": "Chuyên đề 15: Mạo từ (Articles: A, An, The & Zero Article)",
        "summary": "Quy tắc dùng mạo từ bất định (A, An), mạo từ xác định (The) và các trường hợp không dùng mạo từ (Zero Article).",
        "sections": [
            {
                "subtitle": "1. Dùng A, An và The",
                "content": "• **A / An:** Danh từ số ít đếm được, nhắc đến lần đầu tiên, chỉ nghề nghiệp.\n  - An dùng trước danh từ phát âm bắt đầu bằng nguyên âm (an hour, an apple, an umbrella).\n• **The:** Đã được xác định, duy nhất (the sun, the moon), so sánh nhất, nhạc cụ (play the piano), sông biển (the Nile, the Pacific)."
            },
            {
                "subtitle": "2. Trường hợp KHÔNG dùng mạo từ (Zero Article)",
                "content": "• Tên bữa ăn (have breakfast), thể thao (play football), môn học, ngôn ngữ (speak English), danh từ số nhiều nói chung (Cats love milk)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "He has been playing _______ (the / a / zero) guitar since he was seven years old.",
                "answer": "the",
                "alternatives": ["the"],
                "hint": "Đi với nhạc cụ (play + ... + instrument) luôn có mạo từ xác định.",
                "explain": "Động từ 'play' đi với nhạc cụ luôn dùng 'the guitar'."
            }
        ],
        "quiz": [
            {
                "q": "Honesty is _______ best policy in all human relationships.",
                "options": ["a", "an", "the", "zero"],
                "answer": 2,
                "explain": "Trước tính từ ở dạng so sánh nhất (best) bắt buộc dùng mạo từ 'the'."
            }
        ]
    },
    {
        "week_number": 16,
        "title": "Chuyên đề 16: Giới từ chỉ Thời gian & Nơi chốn (Prepositions)",
        "summary": "Phân biệt tam giác giới từ IN - ON - AT chỉ thời gian, địa điểm và các cụm giới từ cố định thường gặp trong đề thi.",
        "sections": [
            {
                "subtitle": "1. Tam giác giới từ IN - ON - AT",
                "content": "• **AT (Cụ thể, hẹp nhất):**\n  - Giờ cụ thể: at 7 AM, at noon, at midnight.\n  - Địa điểm cụ thể: at home, at the station.\n• **ON (Bề mặt, ngày cụ thể):**\n  - Ngày: on Monday, on July 4th, on my birthday.\n  - Bề mặt: on the table, on the floor.\n• **IN (Không gian kín, thời gian dài):**\n  - Tháng, năm, mùa, thế kỷ: in July, in 2024, in summer, in the 21st century.\n  - Thành phố, quốc gia: in Hanoi, in Vietnam."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "The international summit will officially kick off _______ (in / on / at) Monday morning.",
                "answer": "on",
                "alternatives": ["on"],
                "hint": "Trước thứ trong tuần (Monday) hoặc buổi của một ngày cụ thể ta dùng giới từ 'on'.",
                "explain": "Dùng 'on' trước ngày cụ thể trong tuần: on Monday morning."
            }
        ],
        "quiz": [
            {
                "q": "She was born _______ 2005 in a peaceful coastal village.",
                "options": ["at", "on", "in", "by"],
                "answer": 2,
                "explain": "Trước năm (2005) dùng giới từ 'in'."
            }
        ]
    },
    {
        "week_number": 17,
        "title": "Chuyên đề 17: Liên từ & Mệnh đề trạng ngữ (Conjunctions & Adverbial Clauses)",
        "summary": "Phân biệt liên từ chỉ nguyên nhân (Because vs Because of), nhượng bộ (Although vs Despite), mục đích (So that) và kết quả (So/Such... that).",
        "sections": [
            {
                "subtitle": "1. Nguyên nhân & Nhượng bộ",
                "content": "• **Nguyên nhân:**\n  - Because / Since / As + Mệnh đề (S + V)\n  - Because of / Due to / Owing to + Cụm danh từ / V-ing\n• **Nhượng bộ:**\n  - Although / Even though / Though + Mệnh đề (S + V)\n  - Despite / In spite of + Cụm danh từ / V-ing"
            },
            {
                "subtitle": "2. Kết quả & Mục đích",
                "content": "• **So... that:** S + be + so + adj + that... / S + V + so + adv + that...\n• **Such... that:** S + V + such + (a/an) + adj + noun + that...\n• **So that / In order that + S + can/could/will + V_inf (Mục đích).**"
            }
        ],
        "fill_blanks": [
            {
                "sentence": "_______ (Despite / Although) the heavy traffic during rush hour, we arrived at the conference on time.",
                "answer": "Despite",
                "alternatives": ["Despite", "In spite of"],
                "hint": "Đứng trước một cụm danh từ 'the heavy traffic' để chỉ sự nhượng bộ.",
                "explain": "Despite + Cụm danh từ (the heavy traffic), Although phải đi với một mệnh đề (S + V)."
            }
        ],
        "quiz": [
            {
                "q": "The weather was _______ bad that all flights were immediately cancelled.",
                "options": ["such", "so", "too", "very"],
                "answer": 1,
                "explain": "Cấu trúc: be + so + adj + that... -> was so bad that."
            }
        ]
    },
    {
        "week_number": 18,
        "title": "Chuyên đề 18: Lượng từ (Quantifiers: Few, Little, Much, Many)",
        "summary": "Quy tắc dùng Few / A few, Little / A little, Many, Much, Some, Any, All, Both, Neither, None.",
        "sections": [
            {
                "subtitle": "1. Phân biệt sắc thái Few & Little",
                "content": "• **Đi với danh từ đếm được số nhiều:**\n  - **Few:** Rất ít, hầu như không có (mang nghĩa tiêu cực).\n  - **A few:** Một vài, một ít (đủ dùng, mang nghĩa tích cực).\n• **Đi với danh từ không đếm được:**\n  - **Little:** Rất ít, hầu như không có.\n  - **A little:** Một chút (đủ dùng)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "I have _______ (a few / a little) free time this afternoon, so we can have coffee together.",
                "answer": "a little",
                "alternatives": ["a little"],
                "hint": "'Time' (thời gian) là danh từ không đếm được và có nghĩa tích cực 'có một chút'.",
                "explain": "'Time' không đếm được -> dùng 'a little' để chỉ có một chút thời gian."
            }
        ],
        "quiz": [
            {
                "q": "Unfortunately, _______ students were able to solve the exceptionally difficult math problem.",
                "options": ["few", "a few", "little", "a little"],
                "answer": 0,
                "explain": "Students là danh từ đếm được số nhiều, và từ 'Unfortunately' (thật không may) chỉ nghĩa tiêu cực (hầu như không có ai làm được) -> dùng 'few'."
            }
        ]
    },
    {
        "week_number": 19,
        "title": "Chuyên đề 19: Cụm động từ thông dụng (Essential Phrasal Verbs)",
        "summary": "Tuyển chọn các cụm động từ thường gặp nhất trong các kỳ thi: look after, give up, put off, run out of, carry out, bring about.",
        "sections": [
            {
                "subtitle": "1. Các Phrasal Verbs điểm 9+",
                "content": "• **Put off:** Trì hoãn (= postpone, delay).\n• **Look forward to + V-ing:** Trông chờ, mong đợi.\n• **Run out of:** Cạn kiệt, hết sạch (run out of money/petrol).\n• **Carry out:** Tiến hành, thực hiện (carry out research/experiment).\n• **Give up:** Từ bỏ (= quit).\n• **Make up for:** Bù đắp cho (= compensate for)."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "Due to bad weather, the organizing committee decided to put _______ (off / up / on) the football match.",
                "answer": "off",
                "alternatives": ["off"],
                "hint": "Cụm 'put off' có nghĩa là hoãn lại (postpone).",
                "explain": "Put off = trì hoãn sự kiện."
            }
        ],
        "quiz": [
            {
                "q": "Scientists are planning to _______ a comprehensive study on the new renewable energy source.",
                "options": ["carry out", "put off", "look after", "give up"],
                "answer": 0,
                "explain": "Carry out = tiến hành, thực thi nghiên cứu/khảo sát."
            }
        ]
    },
    {
        "week_number": 20,
        "title": "Chuyên đề 20: Rút gọn mệnh đề cùng chủ ngữ (Participle Clauses)",
        "summary": "Kỹ thuật rút gọn hai mệnh đề có cùng chủ ngữ bằng Phân từ hiện tại (V-ing), Quá khứ phân từ (V3/ed) và Phân từ hoàn thành (Having + V3/ed).",
        "sections": [
            {
                "subtitle": "1. Ba quy tắc rút gọn mệnh đề cùng chủ ngữ",
                "content": "• **Chủ động -> Dùng V-ing:**\n  - When he saw the police, the thief ran away -> Seeing the police, the thief ran away.\n• **Bị động -> Dùng V3/ed:**\n  - Because he was warned about the danger, he stayed inside -> Warned about the danger, he stayed inside.\n• **Hành động xảy ra trước hành động khác -> Dùng Having + V3/ed:**\n  - After she had finished her homework, she went to bed -> Having finished her homework, she went to bed."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "_______ (Having finished / Finished) all his administrative duties, Mark left the office for the weekend.",
                "answer": "Having finished",
                "alternatives": ["Having finished"],
                "hint": "Hành động hoàn thành nhiệm vụ xảy ra trước hành động rời văn phòng -> Dùng Phân từ hoàn thành.",
                "explain": "Having + V3/ed nhấn mạnh hành động hoàn tất trước một hành động khác trong quá khứ."
            }
        ],
        "quiz": [
            {
                "q": "_______ by the sudden loud noise, the baby started to cry loudly.",
                "options": ["Frightening", "Frightened", "Having frightened", "To frighten"],
                "answer": 1,
                "explain": "Em bé bị giật mình bởi tiếng ồn (thể bị động) -> rút gọn dùng Quá khứ phân từ: Frightened by..."
            }
        ]
    },
    {
        "week_number": 21,
        "title": "Chuyên đề 21: Tổng ôn tập toàn diện & Chiến lược bứt phá đề thi",
        "summary": "Tổng hợp phương pháp giải đề nhanh, nhận diện bẫy ngữ pháp phổ biến trong kỳ thi THPTQG, VSTEP và IELTS.",
        "sections": [
            {
                "subtitle": "1. Chiến thuật 4 bước xử lý câu hỏi Ngữ pháp",
                "content": "1. **Xác định loại từ & vị trí khuyết:** Nhìn trước và sau chỗ trống để biết cần điền danh từ, động từ, tính từ hay liên từ.\n2. **Kiểm tra Chủ ngữ & Động từ chính:** Đảm bảo câu có đủ chủ ngữ và động từ chính, không bị thừa động từ không chia.\n3. **Xác định dòng thời gian (Thì):** Tìm các trạng từ chỉ thời gian hoặc mệnh đề phối thì để chọn đúng thì.\n4. **Kiểm tra Thể chủ động / Bị động:** Đối chiếu chủ ngữ có tự thực hiện hành động hay bị tác động."
            }
        ],
        "fill_blanks": [
            {
                "sentence": "Neither the teacher nor her students _______ (know) the answer to this tricky question.",
                "answer": "know",
                "alternatives": ["know"],
                "hint": "Cấu trúc Neither S1 nor S2 -> hòa hợp theo S2 (students - số nhiều).",
                "explain": "Động từ chia theo chủ ngữ gần nhất 'her students' (số nhiều) -> know (nguyên thể)."
            }
        ],
        "quiz": [
            {
                "q": "By the time the project is completed, the engineering team _______ for over two consecutive years.",
                "options": ["will work", "will have been working", "has worked", "worked"],
                "answer": 1,
                "explain": "By the time + Hiện tại đơn (is completed) kết hợp với khoảng thời gian (for over two consecutive years) -> Dùng thì Tương lai hoàn thành tiếp diễn (will have been working)."
            }
        ]
    }
]

def update_grammar_database():
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Check if fill_blanks_json column exists, if not add it
    c.execute("PRAGMA table_info(grammar_topics)")
    columns = [col[1] for col in c.fetchall()]
    if "fill_blanks_json" not in columns:
        c.execute("ALTER TABLE grammar_topics ADD COLUMN fill_blanks_json TEXT DEFAULT '[]'")
        print("Added column fill_blanks_json to grammar_topics")

    for topic in grammar_21_topics:
        w_num = topic["week_number"]
        title = topic["title"]
        summary = topic["summary"]
        sections_json = json.dumps(topic["sections"], ensure_ascii=False)
        quiz_json = json.dumps(topic["quiz"], ensure_ascii=False)
        fill_blanks_json = json.dumps(topic.get("fill_blanks", []), ensure_ascii=False)
        
        c.execute("SELECT id FROM grammar_topics WHERE week_number = ?", (w_num,))
        row = c.fetchone()
        if row:
            c.execute("""
                UPDATE grammar_topics 
                SET title = ?, summary = ?, sections_json = ?, quiz_json = ?, fill_blanks_json = ?, source_verified = 1
                WHERE week_number = ?
            """, (title, summary, sections_json, quiz_json, fill_blanks_json, w_num))
        else:
            c.execute("""
                INSERT INTO grammar_topics (week_number, title, summary, sections_json, quiz_json, fill_blanks_json, source_verified)
                VALUES (?, ?, ?, ?, ?, ?, 1)
            """, (w_num, title, summary, sections_json, quiz_json, fill_blanks_json))

    conn.commit()
    conn.close()
    print("Database grammar_topics updated with 21 rich in-depth topics!")

if __name__ == "__main__":
    update_grammar_database()
