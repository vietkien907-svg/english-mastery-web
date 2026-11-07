# add_cloze_and_exam_readings.py
"""
Script to insert high-yield exam reading passages:
- TOEIC Part 6 (Text Completion / Cloze test)
- VSTEP B1-B2-C1 Cloze Test & Reading Comprehension (Authentic format: Main idea, Vocab in context, Pronoun reference, Inference)
- IELTS Academic (True/False/Not Given + Summary Cloze completion)
into reading_passages table in backend/app.db.
"""
import sqlite3
import json

DB_PATH = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\backend\app.db"

NEW_PASSAGES = [
    # ==================== TOEIC PART 6 (CLOZE TEST) 1 ====================
    {
        "title": "[TOEIC Part 6 - Đục Lỗ] Corporate Fleet Electrification & Green Logistics",
        "category": "CLOZE",
        "level": "TOEIC 700+",
        "source_reference": "ETS TOEIC Test Preparation - Part 6 Text Completion",
        "content": """MEMORANDUM

TO: All Regional Logistics Managers
FROM: Marcus Vance, Vice President of Operational Infrastructure
DATE: November 12, 2026
SUBJECT: Phase-1 Transition to Zero-Emission Delivery Fleets

In accordance with our corporate pledge to achieve carbon neutrality by 2030, Nexis Logistics will officially initiate the transition of our domestic transport fleet to commercial electric vehicles (EVs) next month. The regional pilot program will commence in Chicago, where forty diesel delivery vans will be decommissioned and replaced by high-capacity electric models.

Preliminary assessments indicate that this transition will significantly [1] ______ operational expenditures over the vehicle lifecycle. Fuel consumption accounts for approximately 38 percent of our regional branch overhead, and internal financial modeling demonstrates that fleet electrification will yield an estimated 42 percent reduction in routine maintenance and charging expenses within the inaugural year.

Branch supervisors are requested to prepare their depot facilities immediately. Charging stations are scheduled for installation between December 1 and December 15. [2] ______. All personnel designated to operate the new electric vans must attend a compulsory 90-minute defensive driving and energy optimization workshop conducted by certified technicians.

Should any depot encounter logistical impediments during the charger deployment phase, please contact the Environmental Facilities Liaison at extension 4482 [3] ______ delay. We are deeply confident that this landmark undertaking will not only bolster our ecological sustainability [4] ______ also reinforce our brand prestige as an ethical industry vanguard.""",
        "target_words": ["carbon neutrality", "operational expenditures", "decommissioned", "fleet electrification", "compulsory workshop", "logistical impediments", "ecological sustainability", "industry vanguard"],
        "questions": [
            {
                "question": "Chọn từ thích hợp điền vào chỗ trống [1]:\n'Preliminary assessments indicate that this transition will significantly [1] ______ operational expenditures over the vehicle lifecycle.'",
                "options": [
                    "A. curtail",
                    "B. escalate",
                    "C. ignore",
                    "D. postpone"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A (curtail = cắt giảm). Ngữ cảnh câu nói về việc tiết kiệm chi phí vận hành (giảm 42% chi phí bảo dưỡng ở câu sau), nên 'curtail' (cắt giảm) là từ chuẩn xác nhất. B (leo thang), C (phớt lờ), D (hoãn lại) đều sai nghĩa."
            },
            {
                "question": "Chọn câu văn thích hợp nhất để điền vào vị trí [2]:",
                "options": [
                    "A. Fortunately, our competitor has decided to abandon electric vehicle manufacturing altogether.",
                    "B. In addition, driver certification protocols must be strictly completed prior to deployment.",
                    "C. Unfortunately, all charging hardware has been permanently recalled due to safety defects.",
                    "D. Because our drivers prefer older diesel models, attendance will be entirely optional."
                ],
                "answer": "B",
                "explain": "ĐÁP ÁN ĐÚNG LÀ B. Câu tiếp theo ngay sau vị trí [2] nói về việc tài xế phải tham gia khóa tập huấn bắt buộc ('compulsory 90-minute workshop'), do đó câu [2] phải bổ sung về quy trình chứng chỉ lái xe ('driver certification protocols must be strictly completed prior to deployment')."
            },
            {
                "question": "Chọn giới từ/cụm từ thích hợp điền vào chỗ trống [3]:\n'...please contact the Environmental Facilities Liaison at extension 4482 [3] ______ delay.'",
                "options": [
                    "A. without",
                    "B. against",
                    "C. along",
                    "D. towards"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. Cụm thành ngữ cố định phổ biến trong TOEIC: 'without delay' = ngay lập tức, không chậm trễ (immediately)."
            },
            {
                "question": "Chọn liên từ thích hợp điền vào chỗ trống [4]:\n'...this landmark undertaking will not only bolster our ecological sustainability [4] ______ also reinforce our brand prestige...'",
                "options": [
                    "A. but",
                    "B. and",
                    "C. nor",
                    "D. or"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. Cấu trúc ngữ pháp song hành kinh điển: 'not only ... BUT also ...' (không những ... mà còn ...)."
            }
        ]
    },

    # ==================== TOEIC PART 6 (CLOZE TEST) 2 ====================
    {
        "title": "[TOEIC Part 6 - Đục Lỗ] Annual Employee Performance Appraisal & Bonus Notification",
        "category": "CLOZE",
        "level": "TOEIC 650+",
        "source_reference": "ETS TOEIC Reading - Text Completion Part 6",
        "content": """HUMAN RESOURCES INTERNAL CIRCULAR

To: Department Supervisors and Senior Team Leads
From: Helena Rostova, Global Director of Human Capital
Subject: FY2026 Annual Performance Review Guidelines

As we approach the culmination of the fiscal year, we want to express our gratitude for your dedication and exceptional stewardship. The annual employee appraisal cycle is scheduled to commence on Monday, December 1st.

Supervisors are mandated to conduct a comprehensive one-on-one evaluation with each subordinate under their jurisdiction. To guarantee institutional transparency, all appraisal metrics must be submitted [1] ______ our centralized HR portal no later than 5:00 PM on Friday, December 19th.

Please remember that merit-based salary increments and annual performance bonuses are directly [2] ______ upon these evaluations. Employees who achieve an 'Exceeds Expectations' rating across core competencies will become eligible for a discretionary equity allocation. [3] ______.

To assist managers in formulating objective and constructive appraisals, Human Capital will host two virtual orientation sessions on Thursday, November 27th. Attendance is strongly recommended for newly promoted supervisors who have not yet administered an evaluation cycle. We anticipate your full [4] ______ in maintaining the integrity and punctuality of this pivotal process.""",
        "target_words": ["stewardship", "subordinate", "merit-based salary", "discretionary equity", "objective appraisals", "punctuality"],
        "questions": [
            {
                "question": "Chọn giới từ thích hợp điền vào chỗ trống [1]:\n'...all appraisal metrics must be submitted [1] ______ our centralized HR portal...'",
                "options": [
                    "A. through",
                    "B. across",
                    "C. during",
                    "D. between"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A (through / via = thông qua, qua cổng điện tử HR). 'Submit through our portal' là cụm dùng chuẩn xác trong môi trường doanh nghiệp."
            },
            {
                "question": "Chọn tính từ/phân từ thích hợp điền vào chỗ trống [2]:\n'...salary increments and annual performance bonuses are directly [2] ______ upon these evaluations.'",
                "options": [
                    "A. dependent",
                    "B. dependable",
                    "C. depend",
                    "D. dependably"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. Cụm tính từ đi với giới từ: 'be dependent upon / on' = phụ thuộc vào, căn cứ vào. Vị trí sau tobe 'are directly' cần một tính từ."
            },
            {
                "question": "Chọn câu văn thích hợp nhất để điền vào vị trí [3]:",
                "options": [
                    "A. Consequently, all employees will receive a mandatory pay deduction regardless of performance.",
                    "B. It is therefore paramount that all written appraisals reflect demonstrable achievements and quantifiable metrics.",
                    "C. Our headquarters will be completely closed throughout the first six months of the upcoming year.",
                    "D. Every team lead should immediately dismiss any subordinate who asks questions about compensation."
                ],
                "answer": "B",
                "explain": "ĐÁP ÁN ĐÚNG LÀ B. Câu trước nói thưởng và cổ phiếu phụ thuộc vào đánh giá năng lực, do đó câu kết nối chuẩn logic là: vì vậy điều tối quan trọng là các đánh giá phải phản ánh đúng thành tích đo lường được ('paramount that written appraisals reflect demonstrable achievements')."
            },
            {
                "question": "Chọn danh từ thích hợp điền vào chỗ trống [4]:\n'We anticipate your full [4] ______ in maintaining the integrity and punctuality of this pivotal process.'",
                "options": [
                    "A. cooperation",
                    "B. dispute",
                    "C. hesitation",
                    "D. negligence"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A (cooperation = sự hợp tác). 'Full cooperation' = sự hợp tác trọn vẹn. B (tranh chấp), C (do dự), D (sự chểnh mảng/cẩu thả) đều sai lệch ngữ nghĩa."
            }
        ]
    },

    # ==================== VSTEP B2 CLOZE TEST (ĐỤC LỖ) ====================
    {
        "title": "[VSTEP B2 - Đục Lỗ] The Rise of Digital Nomadism and Remote Workspaces",
        "category": "CLOZE",
        "level": "VSTEP B2",
        "source_reference": "VSTEP B2-C1 Reading Practice - Cloze Test Part 1",
        "content": """The rapid expansion of high-speed wireless connectivity and cloud collaboration platforms has accelerated the phenomenon known as 'digital nomadism'. Rather than being bound to a conventional brick-and-mortar office, millions of global professionals now elect to work remotely while traveling across international [1] ______. 

Southeast Asian destinations such as Da Nang, Chiang Mai, and Bali have emerged as premier hubs for remote workers, largely owing to their affordable cost of living, culinary richness, and scenic coastal landscapes. In response to this influx, municipal authorities and private enterprises have established hundreds of modern co-working hubs that provide uninterrupted fiber-optic internet, conference pods, and networking spaces. 

However, this untethered lifestyle is not [2] ______ its drawbacks. Frequent relocation often induces feelings of loneliness and chronic fatigue. Furthermore, remote professionals must navigate Byzantine tax regulations and frequently face precarious legal statuses, as standard tourist visas formally prohibit foreign nationals from engaging in [3] ______ employment while residing in the host territory.

To address these ambiguities, progressive governments are increasingly rolling out specialized 'Digital Nomad Visas'. These permits provide international knowledge workers with legal residency for up to two years [4] ______ condition that they demonstrate a stable foreign income threshold. By legalizing their status, host nations can stimulate local hospitality sectors [5] ______ mitigating the risk of unregulated tax evasion.""",
        "target_words": ["digital nomadism", "brick-and-mortar office", "untethered lifestyle", "precarious legal status", "Byzantine tax regulations", "tax evasion", "fiber-optic internet"],
        "questions": [
            {
                "question": "Chọn danh từ thích hợp điền vào chỗ trống [1]:\n'...while traveling across international [1] ______.'",
                "options": [
                    "A. borders",
                    "B. margins",
                    "C. fences",
                    "D. barriers"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. Cụm từ cố định chuẩn xác: 'travel across international borders' = du lịch / di chuyển qua các đường biên giới quốc tế. Margins (lề sách), Fences (hàng rào dân sự), Barriers (chướng ngại vật)."
            },
            {
                "question": "Chọn giới từ thích hợp điền vào chỗ trống [2]:\n'However, this untethered lifestyle is not [2] ______ its drawbacks.'",
                "options": [
                    "A. without",
                    "B. against",
                    "C. under",
                    "D. beyond"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. Cụm diễn đạt học thuật: 'not without its drawbacks' = không phải là không có những mặt hạn chế (có nhược điểm đi kèm)."
            },
            {
                "question": "Chọn tính từ thích hợp điền vào chỗ trống [3]:\n'...prohibit foreign nationals from engaging in [3] ______ employment while residing in the host territory.'",
                "options": [
                    "A. remunerative",
                    "B. honorary",
                    "C. imaginary",
                    "D. voluntary"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. 'Remunerative employment' = công việc được trả lương / sinh lợi nhuận. Visa du lịch nghiêm cấm người nước ngoài làm việc hưởng thù lao tại nước sở tại. B (danh dự), C (ảo), D (tình nguyện)."
            },
            {
                "question": "Chọn giới từ thích hợp điền vào chỗ trống [4]:\n'...legal residency for up to two years [4] ______ condition that they demonstrate a stable foreign income threshold.'",
                "options": [
                    "A. on",
                    "B. in",
                    "C. with",
                    "D. by"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. Cụm liên từ điều kiện cố định: 'on condition that...' = với điều kiện là... (tương đương 'provided that' / 'as long as')."
            },
            {
                "question": "Chọn liên từ/giới từ thích hợp điền vào chỗ trống [5]:\n'...stimulate local hospitality sectors [5] ______ mitigating the risk of unregulated tax evasion.'",
                "options": [
                    "A. while",
                    "B. despite",
                    "C. whereas",
                    "D. unless"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. 'While + V-ing' chỉ hai hành động xảy ra đồng thời mang tính hỗ trợ nhau: vừa kích thích ngành dịch vụ khách sạn địa phương đồng thời vừa giảm thiểu rủi ro trốn thuế."
            }
        ]
    },

    # ==================== IELTS TRUE/FALSE/NOT GIVEN PASSAGE ====================
    {
        "title": "[IELTS Academic - TFNG] The Cognitive Neuroscience of Bilingualism",
        "category": "IELTS",
        "level": "Band 8.0",
        "source_reference": "Cambridge IELTS Academic Practice - Cognitive Science",
        "content": """For the greater part of the twentieth century, pedagogical theorists and child psychologists harbored the suspicion that raising children in a bilingual environment constituted a formidable cognitive impediment. It was widely feared that exposing an infant's pliable brain to competing linguistic codes would inevitably trigger cross-linguistic contamination, precipitate severe speech delays, and diminish intellectual acumen. Early twentieth-century psychometric tests appeared to validate these grim forebodings, repeatedly showing that monolingual children outperformed their bilingual counterparts in vocabulary breadth and standardized problem-solving assessments.

However, subsequent methodological scrutiny revealed that those primitive studies were compromised by egregious systemic flaws. Early researchers routinely failed to match bilingual immigrant children with their monolingual peers in socioeconomic status, nutritional security, or formal parental schooling. When linguist Ellen Bialystok and contemporary neuroscientists re-examined the question with rigorous randomized controls in the late 1980s, the purported 'bilingual handicap' evaporated.

Far from impairing intellect, lifelong bilingualism confers profound structural and executive advantages. Because both languages remain perpetually active within the bilingual brain even when only one is actively vocalized, the prefrontal cortex must continuously engage executive control mechanisms: inhibiting the non-target language, monitoring phonological shifts, and toggling cognitive attention. Over decades, this relentless mental exertion builds robust 'cognitive reserve'.

Astonishingly, epidemiological surveys conducted across multiple international cohorts have demonstrated that lifelong bilingual individuals manifest symptoms of neurodegenerative pathologies—such as Alzheimer's dementia—an average of four to five years later than demographically matched monolinguals. Although bilingualism does not prevent the underlying neuropathological accumulation of amyloid plaques and tau tangles, the enhanced density of white matter tracts enables the bilingual brain to compensate for anatomical damage far more resiliently.""",
        "target_words": ["cognitive impediment", "cross-linguistic contamination", "psychometric tests", "socioeconomic status", "executive control mechanisms", "cognitive reserve", "neurodegenerative pathologies", "amyloid plaques"],
        "questions": [
            {
                "question": "Early 20th-century studies into bilingualism were flawed because researchers failed to control for socioeconomic and educational differences.",
                "options": [
                    "A. TRUE",
                    "B. FALSE",
                    "C. NOT GIVEN"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN LÀ A (TRUE). Đoạn 2 nêu rõ: 'Early researchers routinely failed to match bilingual immigrant children with their monolingual peers in socioeconomic status, nutritional security, or formal parental schooling.'"
            },
            {
                "question": "Bilingualism completely prevents the physical formation of Alzheimer's amyloid plaques in brain tissue.",
                "options": [
                    "A. TRUE",
                    "B. FALSE",
                    "C. NOT GIVEN"
                ],
                "answer": "B",
                "explain": "ĐÁP ÁN LÀ B (FALSE). Đoạn cuối chỉ rõ: 'Although bilingualism does not prevent the underlying neuropathological accumulation of amyloid plaques and tau tangles...' (không ngăn được sự tích tụ của mảng bám thể chất, mà chỉ giúp não bộ bù đắp chức năng tốt hơn)."
            },
            {
                "question": "Most governments now offer financial incentives to parents who teach their children a second language before age five.",
                "options": [
                    "A. TRUE",
                    "B. FALSE",
                    "C. NOT GIVEN"
                ],
                "answer": "C",
                "explain": "ĐÁP ÁN LÀ C (NOT GIVEN). Bài viết hoàn toàn không đề cập đến việc chính phủ có trợ cấp tài chính (financial incentives) cho phụ huynh dạy con song ngữ hay không."
            },
            {
                "question": "Why does the bilingual brain develop superior executive control?",
                "options": [
                    "A. Because bilingual individuals consume more specialized brain nutrients",
                    "B. Because both languages remain active, forcing continuous mental inhibition and attention toggling",
                    "C. Because bilinguals spend more hours sleeping each night",
                    "D. Because they memorize entire grammar textbooks in childhood"
                ],
                "answer": "B",
                "explain": "ĐÁP ÁN LÀ B. Đoạn 3 khẳng định: 'Because both languages remain perpetually active... the prefrontal cortex must continuously engage executive control mechanisms: inhibiting the non-target language... and toggling cognitive attention.'"
            }
        ]
    },

    # ==================== VSTEP C1 AUTHENTIC READING ====================
    {
        "title": "[VSTEP C1] Artificial Intelligence Ethics in Medical Diagnostics",
        "category": "VSTEP",
        "level": "VSTEP C1",
        "source_reference": "VSTEP Level C1 Academic Reading Comprehension",
        "content": """The deployment of deep-learning neural networks in healthcare has yielded diagnostic breakthroughs once considered science fiction. Deep convolutional algorithms trained on millions of annotated radiography scans can now identify malignant pulmonary nodules, diabetic retinopathy, and subtle dermatological melanomas with diagnostic accuracy that matches or occasionally surpasses board-certified radiologists. 

Proponents assert that algorithmic diagnostics democratize high-tier clinical medicine, particularly in geographically isolated or under-resourced rural clinics where specialized radiologists are virtually absent. A cloud-connected ultrasound probe paired with an on-device neural network allows an auxiliary nurse to detect congenital heart defects in newborns within seconds, facilitating prompt triage and life-saving surgical intervention.

Nevertheless, bioethicists and health jurists express mounting apprehension regarding the opaque 'black box' architecture of deep learning models. Unlike classical rule-based software, neural networks calibrate millions of internal weights across hundreds of hidden layers. Consequently, they cannot provide a clear deductive explanation detailing precisely why a particular diagnostic classification was reached. When an algorithm erroneously misdiagnoses an aggressive lymphoma as a benign infection, apportioning liability becomes a convoluted legal quagmire: Does culpability reside with the attending clinician, the software engineering conglomerate, or the hospital administrator who purchased the license?

Furthermore, algorithmic systems inherently reflect the demographic contours of their training datasets. If an automated dermatology model is predominantly trained on clinical imagery from light-skinned patients of European descent, its diagnostic sensitivity deteriorates precipitously when evaluating lesions on individuals with deeply pigmented skin tones. Mitigating these disparities necessitates mandatory multi-center demographic auditing and strict algorithmic transparency standards prior to commercial licensure.""",
        "target_words": ["convolutional algorithms", "diabetic retinopathy", "democratize healthcare", "auxiliary nurse", "black box architecture", "deductive explanation", "apportioning liability", "demographic auditing"],
        "questions": [
            {
                "question": "What is the primary purpose of the passage?",
                "options": [
                    "A. To advocate for the total prohibition of artificial intelligence across all medical fields",
                    "B. To examine both the transformative potential and ethical-legal dilemmas of AI diagnostics",
                    "C. To promote a specific medical software company to rural hospitals",
                    "D. To teach computer programmers how to train convolutional neural networks"
                ],
                "answer": "B",
                "explain": "ĐÁP ÁN ĐÚNG LÀ B (Phân tích cả tiềm năng đột phá lẫn các thách thức đạo đức và pháp lý của AI trong y khoa). Đoạn 1-2 nêu lợi ích, đoạn 3-4 phân tích các rủi ro và giải pháp."
            },
            {
                "question": "The word 'apportioning' in paragraph 3 is closest in meaning to:",
                "options": [
                    "A. assigning or distributing",
                    "B. ignoring or dismissing",
                    "C. celebrating or honoring",
                    "D. hiding or concealing"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. 'Apportioning liability' = phân bổ, quy trách nhiệm pháp lý cho các bên liên quan. Cụm 'assigning or distributing' mang nghĩa chính xác nhất."
            },
            {
                "question": "The pronoun 'they' in paragraph 3 refers to:",
                "options": [
                    "A. neural networks",
                    "B. board-certified radiologists",
                    "C. rural auxiliary nurses",
                    "D. congenital heart defects"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. Trong câu 'Unlike classical rule-based software, neural networks calibrate millions of internal weights... Consequently, they cannot provide a clear deductive explanation...', đại từ 'they' thay thế cho chủ ngữ 'neural networks' ở mệnh đề phía trước."
            },
            {
                "question": "Why might an AI dermatology system fail when examining patients with darker skin tones?",
                "options": [
                    "A. Darker skin tones are invisible to optical cameras",
                    "B. The training dataset lacked sufficient representation of deeply pigmented skin imagery",
                    "C. Neural networks cannot process melanin pigmentation mathematically",
                    "D. Hospital Wi-Fi connections disconnect in tropical regions"
                ],
                "answer": "B",
                "explain": "ĐÁP ÁN ĐÚNG LÀ B. Đoạn 4 chỉ rõ: 'If an automated dermatology model is predominantly trained on clinical imagery from light-skinned patients... its diagnostic sensitivity deteriorates precipitously when evaluating lesions on individuals with deeply pigmented skin tones.'"
            }
        ]
    },

    # ==================== TOEIC PART 7 (MEMORANDUM & SUPPLY CHAIN) ====================
    {
        "title": "[TOEIC Part 7] Cross-Border Supply Chain Logistics & Port Congestion Advisory",
        "category": "TOEIC",
        "level": "TOEIC 750+",
        "source_reference": "ETS TOEIC Reading Part 7 - Multi-paragraph Business Advisory",
        "content": """PACIFIC MARITIME FREIGHT CONSORTIUM
OPERATIONAL NOTICE TO IMPORTERS & EXPORTERS

Issued: October 14, 2026
Distribution: All Verified Freight Forwarding Clients

Due to protracted labor renegotiations and unscheduled dredging operations at the Port of Long Beach, vessel berthing delays have reached an unprecedented average of 8.4 business days. Container dwell times at regional intermodal rail yards have similarly expanded, creating acute bottlenecks for inbound consumer electronics and automotive assemblies arriving from East Asian manufacturing centers.

To mitigate compounding demurrage charges and avoid catastrophic production standstills, Pacific Maritime Freight strongly urges all procurement directors to consider the following mitigation pathways:

1. Inland Port Routing: Where feasible, consignments should be rerouted through our Pacific Northwest gateways (Tacoma or Seattle), which are currently operating at 74 percent container yard capacity with zero anchorage wait times.
2. Expedited Air Freight Contingency: For high-value or time-sensitive components nearing production deadlines, our chartered cargo flights between Taipei, Incheon, and Chicago O'Hare are operating daily with guaranteed 48-hour customs clearance.
3. Extended Warehousing Grace Periods: Effective immediately, Pacific Maritime Freight is waiving storage fees for the initial five business days following cargo unlading at our bonded fulfillment hubs in Ontario, California.

Our 24-hour logistics taskforce remains available to restructure your routing manifests. Direct all schedule adjustment inquiries to our Maritime Operations Center at dispatch@pacificfreight-con.com.""",
        "target_words": ["protracted labor negotiations", "berthing delays", "demurrage charges", "intermodal rail yards", "consignments", "bonded fulfillment hubs"],
        "questions": [
            {
                "question": "What is the primary purpose of this operational notice?",
                "options": [
                    "A. To announce the immediate bankruptcy of the shipping line",
                    "B. To alert clients about port congestion and outline alternate shipping solutions",
                    "C. To recruit new crane operators for the Port of Long Beach",
                    "D. To celebrate a record-breaking financial quarter in maritime transport"
                ],
                "answer": "B",
                "explain": "ĐÁP ÁN ĐÚNG LÀ B. Thông báo thông tin về tình trạng tắc nghẽn cảng biển (Long Beach berthing delays) và đưa ra các phương án vận tải thay thế (alternative solutions: Inland port routing, Air freight, Warehousing grace period)."
            },
            {
                "question": "According to the document, why is routing cargo through Tacoma or Seattle recommended?",
                "options": [
                    "A. Shipping rates there are completely free of charge",
                    "B. Those ports have available capacity and zero wait times for berthing",
                    "C. Long Beach has permanently banned foreign container ships",
                    "D. Ships do not require customs clearance in the Pacific Northwest"
                ],
                "answer": "B",
                "explain": "ĐÁP ÁN ĐÚNG LÀ B. Mục 1 nêu rõ: '...our Pacific Northwest gateways (Tacoma or Seattle), which are currently operating at 74 percent container yard capacity with zero anchorage wait times.'"
            },
            {
                "question": "What concession is Pacific Maritime Freight providing to assist impacted customers?",
                "options": [
                    "A. Waiving warehousing storage fees for the first five business days",
                    "B. Refunding 100 percent of international ocean freight fares",
                    "C. Delivering all cargo by drone directly to consumer homes",
                    "D. Purchasing all stalled products directly from the manufacturers"
                ],
                "answer": "A",
                "explain": "ĐÁP ÁN ĐÚNG LÀ A. Mục 3 nêu rõ: '...waiving storage fees for the initial five business days following cargo unlading at our bonded fulfillment hubs...'"
            }
        ]
    }
]

def insert_passages():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    inserted = 0
    for p in NEW_PASSAGES:
        # Check if already exists by title
        c.execute("SELECT id FROM reading_passages WHERE title = ?", (p["title"],))
        if c.fetchone():
            print(f"Skipping existing: {p['title']}")
            continue
            
        c.execute("""
            INSERT INTO reading_passages 
            (title, category, level, content, source_reference, target_words_json, questions_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            p["title"],
            p["category"],
            p["level"],
            p["content"],
            p["source_reference"],
            json.dumps(p["target_words"], ensure_ascii=False),
            json.dumps(p["questions"], ensure_ascii=False)
        ))
        inserted += 1
        print(f"Inserted: {p['title']}")
        
    conn.commit()
    conn.close()
    print(f"\nSuccessfully inserted {inserted} new exam and cloze passages into database!")

if __name__ == "__main__":
    insert_passages()
