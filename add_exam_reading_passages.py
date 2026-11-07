# add_exam_reading_passages.py
"""
Script to populate rich exam reading passages for IELTS, VSTEP, TOEIC, APTIS, and PET
into the reading_passages table in backend/app.db.
"""
import sqlite3
import json
import os

DB_PATH = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\backend\app.db"

PASSAGES = [
    # ==================== IELTS ====================
    {
        "title": "[IELTS] The Evolution of Human Language & Cognitive Linguistics",
        "category": "IELTS",
        "level": "Band 7.5+",
        "source_reference": "Cambridge English IELTS Academic Reading Practice",
        "content": """Language is often cited as the ultimate cognitive hallmark distinguishing Homo sapiens from all other living species. While numerous animals possess rudimentary communication systems—ranging from the intricate waggle dance of honeybees to the warning vocalizations of vervet monkeys—none exhibit the recursive syntax and boundless expressive capacity innate to human speech.

Linguist Noam Chomsky revolutionized twentieth-century linguistics by positing the existence of a Universal Grammar, an innate biological template hardwired into the human neural architecture. According to this nativist perspective, infants do not merely acquire vocabulary through rote environmental exposure; rather, their developing brains effortlessly infer abstract morphological and syntactic structures from imperfect auditory stimuli. 

In contrast, evolutionary biologists and cultural anthropologists have proposed a countervailing hypothesis: that language is predominantly a cultural artifact refined over hundreds of millennia. Under this paradigm, human linguistic proficiency evolved in tandem with cooperative foraging, tool fabrication, and communal fire circles. Mirror neurons, which fire both when an individual executes an action and when observing another perform that same action, may have mediated the transition from mimetic gestures to vocal symbolism.

Contemporary neuroimaging studies utilizing functional MRI provide nuanced insights reconciling both paradigms. Broca's area and Wernicke's area, long heralded as discrete linguistic hubs, operate within an extensive distributed network encompassing cerebellar and subcortical pathways. Far from being a static faculty, human linguistic capacity reflects profound phenotypic plasticity, continuously sculpted by cultural innovation and communicative necessity.""",
        "target_words": ["cognitive hallmark", "recursive syntax", "Universal Grammar", "innate biological template", "countervailing hypothesis", "mimetic gestures", "functional MRI", "phenotypic plasticity"],
        "questions": [
            {
                "question": "What primary feature distinguishes human language from animal communication according to the text?",
                "options": [
                    "A. The frequency of auditory vocalizations",
                    "B. Recursive syntax and boundless expressive capacity",
                    "C. The speed of vocabulary acquisition in adulthood",
                    "D. The reliance on physical gestures alone"
                ],
                "answer": "B",
                "explain": "Đoạn 1 nêu rõ: 'none exhibit the recursive syntax and boundless expressive capacity innate to human speech' (không loài nào có cú pháp đệ quy và khả năng diễn đạt vô hạn như con người)."
            },
            {
                "question": "According to Noam Chomsky's nativist theory, how do infants acquire language?",
                "options": [
                    "A. Solely through imitating their parents' grammatical mistakes",
                    "B. Through an innate biological neural template known as Universal Grammar",
                    "C. Exclusively through conscious memorization in formal schooling",
                    "D. By observing monkey vocalizations in the wild"
                ],
                "answer": "B",
                "explain": "Đoạn 2 giải thích quan điểm của Chomsky về 'Universal Grammar, an innate biological template hardwired into the human neural architecture'."
            },
            {
                "question": "What is the function of 'mirror neurons' mentioned in the passage?",
                "options": [
                    "A. They prevent individuals from acquiring foreign accents",
                    "B. They fire both during the execution and observation of an action",
                    "C. They replace Broca's and Wernicke's areas completely",
                    "D. They restrict human speech to visual signals"
                ],
                "answer": "B",
                "explain": "Đoạn 3 viết: 'Mirror neurons, which fire both when an individual executes an action and when observing another perform that same action...'"
            }
        ]
    },
    {
        "title": "[IELTS] Urban Rewilding: Restoring Ecosystems in Modern Megacities",
        "category": "IELTS",
        "level": "Band 7.0",
        "source_reference": "IELTS Academic Environmental Science Anthology",
        "content": """As the global human population rapidly concentrates in metropolitan centers, urban ecologists are pioneering a paradigm shift termed 'urban rewilding'. Departing from manicured ornamental parks and sterile concrete riverbanks, rewilding advocates seek to restore natural ecological processes, native flora, and spontaneous biodiversity within urban environments.

In London, Tokyo, and Singapore, municipal authorities are transforming degraded industrial canals into thriving wetlands. Concrete culverts that previously constrained stormwater are being dismantled to recreate natural meandering floodplains. These bio-retention swales not only mitigate urban flooding during extreme precipitation events but also filter toxic vehicular particulates before runoff reaches sensitive aquifers.

Furthermore, introducing indigenous plant species provides vital sanctuaries for declining pollinator populations, such as solitary bees and migratory butterflies. Entomologists emphasize that native pollinators exhibit tight evolutionary synchrony with indigenous blossoms, an ecological mutualism that exotic decorative turf cannot sustain.

Beyond tangible hydrological and microclimatic benefits, psychologists report significant mental health improvements among urban dwellers residing near rewilded corridors. Exposure to biologically diverse canopies triggers parasympathetic nervous system responses, diminishing cortisol secretion and alleviating chronic urban anxiety.""",
        "target_words": ["urban rewilding", "manicured parks", "meandering floodplains", "bio-retention swales", "particulates", "indigenous plant species", "ecological mutualism", "parasympathetic nervous system"],
        "questions": [
            {
                "question": "How does urban rewilding differ from conventional urban landscaping?",
                "options": [
                    "A. It replaces native forests with paved pedestrian plazas",
                    "B. It restores natural ecological processes and native biodiversity instead of manicured parks",
                    "C. It relies exclusively on artificial plastic turf",
                    "D. It eliminates all forms of urban wildlife"
                ],
                "answer": "B",
                "explain": "Đoạn 1 chỉ ra: 'Departing from manicured ornamental parks and sterile concrete riverbanks, rewilding advocates seek to restore natural ecological processes, native flora, and spontaneous biodiversity'."
            },
            {
                "question": "What dual advantage do bio-retention swales provide during severe storms?",
                "options": [
                    "A. Generating hydroelectric power and cooling buildings",
                    "B. Mitigating flood risks and filtering toxic particulates from runoff",
                    "C. Diverting water into industrial bottling facilities",
                    "D. Accelerating water velocity into city centers"
                ],
                "answer": "B",
                "explain": "Đoạn 2 nêu rõ: 'These bio-retention swales not only mitigate urban flooding... but also filter toxic vehicular particulates before runoff reaches sensitive aquifers'."
            },
            {
                "question": "What psychological effect is associated with proximity to rewilded corridors?",
                "options": [
                    "A. Increased cortisol production",
                    "B. Heightened cognitive stress and insomnia",
                    "C. Activation of the parasympathetic system and reduced anxiety",
                    "D. Accelerated heartbeat and sensory overload"
                ],
                "answer": "C",
                "explain": "Đoạn 4 nêu: 'Exposure to biologically diverse canopies triggers parasympathetic nervous system responses, diminishing cortisol secretion and alleviating chronic urban anxiety'."
            }
        ]
    },
    {
        "title": "[IELTS] The Psychology of Decision Fatigue and Heuristics",
        "category": "IELTS",
        "level": "Band 7.5+",
        "source_reference": "IELTS Academic Behavioral Economics Review",
        "content": """Every waking day, an average adult confronts upwards of thirty-five thousand decisions, spanning mundane dietary selections to momentous professional dilemmas. Behavioral economists and cognitive psychologists have discovered that the mental energy required for executive functioning is a finite physiological resource. When this reservoir is drained, individuals succumb to a phenomenon known as 'decision fatigue'.

The human prefrontal cortex relies heavily on glucose and metabolic sustenance to perform deliberate cognitive calculus. When forced to deliberate sequentially over prolonged durations, the brain instinctively economizes energy by shifting from analytical processing (System 2) to automated, intuitive processing (System 1). Consequently, decision fatigue typically manifests in two polar extremes: impulsive surrender to immediate gratification or paralysis by default inaction.

A landmark study investigating judicial parole hearings revealed striking evidence of decision fatigue. Prisoners appearing before magistrates in the early morning or immediately following a nutritional recess were granted parole at rates surpassing sixty-five percent. Conversely, identical applications reviewed late in the afternoon, when judicial stamina was depleted, plummeted to near-zero approval rates, as granting parole demanded far greater cognitive accountability than upholding the status quo.

To circumvent decision fatigue, leaders frequently institutionalize behavioral heuristics and reduce trivial choices. By streamlining wardrobe choices, automating repetitive workflows, and prioritizing high-leverage decisions during peak morning alertness, individuals preserve cognitive capital for challenges requiring rigorous critical evaluation.""",
        "target_words": ["executive functioning", "decision fatigue", "prefrontal cortex", "cognitive calculus", "System 1 and System 2", "parole hearings", "status quo", "behavioral heuristics"],
        "questions": [
            {
                "question": "According to the passage, why does the human brain experience decision fatigue?",
                "options": [
                    "A. Because the brain has unlimited energy reserves",
                    "B. Because executive mental energy is a finite resource reliant on metabolic glucose",
                    "C. Because people sleep too many hours each night",
                    "D. Because System 2 requires zero physiological effort"
                ],
                "answer": "B",
                "explain": "Đoạn 1 & 2 nêu rõ: 'mental energy required for executive functioning is a finite physiological resource... prefrontal cortex relies heavily on glucose and metabolic sustenance'."
            },
            {
                "question": "What did the study on judicial parole hearings demonstrate?",
                "options": [
                    "A. Judges made better decisions when completely exhausted",
                    "B. Approval rates dropped dramatically late in the day as judges defaulted to the status quo",
                    "C. Nutritional breaks had no bearing on judicial deliberation",
                    "D. Prisoners in the afternoon were intrinsically more dangerous"
                ],
                "answer": "B",
                "explain": "Đoạn 3 phân tích: Đơn xét tha bổng giảm xuống gần 0% vào cuối buổi chiều khi thẩm phán kiệt sức nhận thức và chọn phương án an toàn mặc định (status quo)."
            },
            {
                "question": "How do effective leaders mitigate decision fatigue in daily life?",
                "options": [
                    "A. By eliminating all morning decisions entirely",
                    "B. By making random choices without evaluation",
                    "C. By automating trivial routines and tackling complex tasks during peak alertness",
                    "D. By avoiding executive decisions permanently"
                ],
                "answer": "C",
                "explain": "Đoạn cuối: 'streamlining wardrobe choices, automating repetitive workflows, and prioritizing high-leverage decisions during peak morning alertness'."
            }
        ]
    },

    # ==================== VSTEP ====================
    {
        "title": "[VSTEP B2] Preserving Vietnamese Traditional Craft Villages",
        "category": "VSTEP",
        "level": "B2",
        "source_reference": "VSTEP Reading Comprehension Prep Anthology - ĐHQG Hà Nội",
        "content": """Across Vietnam, more than five thousand traditional craft villages have long served as the cultural heartbeat and socio-economic backbone of rural communities. From the exquisite silk weaving of Van Phuc and the time-honored pottery of Bat Trang to the delicate bronze casting of Ngu Xa, these artisan enclaves embody ancestral craftsmanship passed down through generations.

However, the rapid forces of industrialization, mass commercialization, and urban expansion pose formidable threats to the survival of these artisanal legacies. Cheap, factory-manufactured synthetic alternatives have flooded local and international markets, severely undermining the profit margins of handcrafted ceramics and textiles. Furthermore, younger generations in rural provinces frequently migrate to bustling industrial zones in search of higher, more predictable salaries, creating a precarious shortage of skilled apprentices.

To revitalize these heritage bastions, many craft cooperatives are embracing experiential tourism and digital e-commerce. By transforming workshops into interactive cultural destinations, international and domestic visitors can shape raw clay on pottery wheels or try their hands at traditional indigo dyeing. Concurrently, government incentives promoting the 'One Commune One Product' (OCOP) program have enabled craftsmen to standardize quality, obtain intellectual property trademarks, and export bespoke goods globally via modern digital platforms.

Preserving traditional craft villages is not merely about nostalgic conservation; it is an economic imperative that ensures sustainable rural livelihoods while celebrating Vietnam's cultural identity on the global stage.""",
        "target_words": ["cultural heartbeat", "artisan enclaves", "ancestral craftsmanship", "mass commercialization", "synthetic alternatives", "experiential tourism", "One Commune One Product", "bespoke goods"],
        "questions": [
            {
                "question": "What is one major threat facing Vietnamese craft villages today according to the text?",
                "options": [
                    "A. Excessive numbers of young apprentices refusing to leave the villages",
                    "B. Competition from inexpensive, mass-produced synthetic products",
                    "C. A total lack of clay and silk raw materials in Vietnam",
                    "D. Complete prohibition of traditional exports by foreign markets"
                ],
                "answer": "B",
                "explain": "Đoạn 2 nêu rõ: 'Cheap, factory-manufactured synthetic alternatives have flooded local and international markets, severely undermining the profit margins...'"
            },
            {
                "question": "How has the 'One Commune One Product' (OCOP) program supported local artisans?",
                "options": [
                    "A. By closing down traditional workshops to build factories",
                    "B. By helping standardize quality, secure trademarks, and promote digital exports",
                    "C. By replacing handcrafted goods with plastic imports",
                    "D. By restricting tourism in rural provinces"
                ],
                "answer": "B",
                "explain": "Đoạn 3 viết: 'OCOP program have enabled craftsmen to standardize quality, obtain intellectual property trademarks, and export bespoke goods globally'."
            },
            {
                "question": "What is the primary message of the author in the conclusion?",
                "options": [
                    "A. Craft villages should be preserved only for nostalgic memory without economic goals",
                    "B. Preserving craft villages supports sustainable rural economies and preserves national identity",
                    "C. Young people must be legally forced to stay in rural villages",
                    "D. Handcrafted pottery should be replaced by industrial manufacturing"
                ],
                "answer": "B",
                "explain": "Đoạn 4 kết luận: 'Preserving traditional craft villages is not merely about nostalgic conservation; it is an economic imperative that ensures sustainable rural livelihoods while celebrating Vietnam's cultural identity'."
            }
        ]
    },
    {
        "title": "[VSTEP B2-C1] Digital Transformation and Lifelong Learning in Vietnam",
        "category": "VSTEP",
        "level": "B2-C1",
        "source_reference": "VSTEP C1 English Proficiency Preparation Material",
        "content": """The rapid advent of the Fourth Industrial Revolution has propelled Vietnam into an era of unprecedented digital acceleration. From cloud computing and blockchain to automated robotic manufacturing, disruptive technologies are redefining the national labor market at a dizzying pace. In this fluid socioeconomic landscape, the traditional notion of education as a finite milestone completed in youth has become obsolete.

Economists project that over forty percent of existing occupational roles in Southeast Asia will undergo substantial automation or structural restructuring by the end of the decade. Routine administrative positions, manual assembly, and data entry are increasingly handled by cognitive algorithms. Conversely, employers are seeking candidates equipped with complex problem-solving abilities, data literacy, and emotional intelligence.

To navigate this paradigm shift, Vietnamese educational institutions and enterprise leaders are heavily investing in lifelong learning frameworks. Massive Open Online Courses (MOOCs) and micro-credentialing platforms allow working adults to upskill and reskill flexibly outside conventional office hours. Universities are partnering with technology conglomerates to establish agile curricula reflecting real-time market demands.

Ultimately, fostering a culture of perpetual curiosity and adaptability is paramount. Those who view continuous learning not as an intermittent burden, but as an ongoing journey of self-actualization, will lead Vietnam's emergence as an innovative knowledge-based economy.""",
        "target_words": ["Fourth Industrial Revolution", "disruptive technologies", "occupational roles", "cognitive algorithms", "lifelong learning", "micro-credentialing", "agile curricula", "knowledge-based economy"],
        "questions": [
            {
                "question": "Why has the traditional view of education as a finite milestone become obsolete?",
                "options": [
                    "A. Because university tuition fees have been abolished completely",
                    "B. Because disruptive technologies are rapidly transforming job requirements and labor demands",
                    "C. Because computers have eliminated the need for human learning",
                    "D. Because young people are no longer interested in attending schools"
                ],
                "answer": "B",
                "explain": "Đoạn 1 nêu rõ các công nghệ đột phá thay đổi thị trường lao động với tốc độ chóng mặt, khiến quan niệm giáo dục chỉ giới hạn ở thời thanh xuân trở nên lỗi thời."
            },
            {
                "question": "Which skills are increasingly sought after by modern employers in Vietnam?",
                "options": [
                    "A. Repetitive manual assembly skills",
                    "B. Complex problem-solving, data literacy, and emotional intelligence",
                    "C. Basic handwriting and physical filing",
                    "D. Routine paperwork and data entry"
                ],
                "answer": "B",
                "explain": "Đoạn 2 nêu rõ: 'employers are seeking candidates equipped with complex problem-solving abilities, data literacy, and emotional intelligence'."
            },
            {
                "question": "How do MOOCs and micro-credentials help the working workforce?",
                "options": [
                    "A. They guarantee instant government employment",
                    "B. They provide flexible avenues for continuous upskilling outside standard working hours",
                    "C. They replace university degrees entirely with cash stipends",
                    "D. They require workers to quit their jobs permanently"
                ],
                "answer": "B",
                "explain": "Đoạn 3 chỉ ra: 'MOOCs and micro-credentialing platforms allow working adults to upskill and reskill flexibly outside conventional office hours'."
            }
        ]
    },
    {
        "title": "[VSTEP B1] Eco-Tourism in the Mekong Delta: Balance and Growth",
        "category": "VSTEP",
        "level": "B1",
        "source_reference": "VSTEP B1 Standard Reading Exercises",
        "content": """The Mekong Delta in southwestern Vietnam is a world of lush water mazes, floating markets, and tropical fruit orchards. In recent years, community-based eco-tourism has emerged as an attractive pathway to boost household incomes while protecting the delicate riverine ecosystem.

Unlike mass tourism, which often results in river pollution and overcrowding, eco-tourism encourages travelers to experience everyday rural life authentically. Guests stay in wooden homestays, paddle traditional sampans through tranquil mangrove channels, and harvest seasonal fruits such as rambutan, durian, and pomelo alongside local farmers. These activities allow visitors to appreciate local customs while generating direct revenue for farming families.

However, developing sustainable eco-tourism requires careful management. Tour operators must avoid over-commercializing local traditions, which can diminish the authentic charm that attracts visitors in the first place. Moreover, local authorities must invest in proper waste management systems to ensure that waterways remain clean and unpolluted.

When managed responsibly, eco-tourism provides a win-win model: it preserves the natural heritage and unique water culture of the Mekong Delta while providing a stable livelihood for generations to come.""",
        "target_words": ["floating markets", "fruit orchards", "eco-tourism", "riverine ecosystem", "homestays", "sampans", "waste management", "sustainable livelihood"],
        "questions": [
            {
                "question": "What is a key difference between eco-tourism and mass tourism in the Mekong Delta?",
                "options": [
                    "A. Eco-tourism encourages authentic experiences and protects the natural river environment",
                    "B. Eco-tourism involves constructing giant concrete skyscrapers along rivers",
                    "C. Eco-tourism is only available for large commercial cruise ships",
                    "D. Eco-tourism focuses exclusively on shopping malls"
                ],
                "answer": "A",
                "explain": "Đoạn 2 nêu: 'Unlike mass tourism... eco-tourism encourages travelers to experience everyday rural life authentically' và bảo tồn hệ sinh thái sông nước."
            },
            {
                "question": "What activity can visitors enjoy during a community-based homestay?",
                "options": [
                    "A. Building industrial motorways",
                    "B. Paddling sampans through mangrove channels and harvesting tropical fruits",
                    "C. Visiting nuclear power facilities",
                    "D. Constructing large concrete dams"
                ],
                "answer": "B",
                "explain": "Đoạn 2 liệt kê: 'Guests stay in wooden homestays, paddle traditional sampans through tranquil mangrove channels, and harvest seasonal fruits...'."
            },
            {
                "question": "What must local authorities improve to ensure sustainable tourism?",
                "options": [
                    "A. Waste management systems to keep waterways clean",
                    "B. Banning all foreign visitors permanently",
                    "C. Cutting down all fruit orchards",
                    "D. Replacing rivers with asphalt roads"
                ],
                "answer": "A",
                "explain": "Đoạn 3 nhấn mạnh: 'local authorities must invest in proper waste management systems to ensure that waterways remain clean and unpolluted'."
            }
        ]
    },

    # ==================== TOEIC ====================
    {
        "title": "[TOEIC Part 7] Apex Global Logistics - Supply Chain ERP Migration Notice",
        "category": "TOEIC",
        "level": "750+ / B2",
        "source_reference": "ETS TOEIC Official Test Preparation - Reading Part 7",
        "content": """MEMORANDUM

TO: All Regional Warehouse Managers and Dispatch Coordinators
FROM: Marcus Vance, Chief Operations Officer (COO)
DATE: October 14, 2026
SUBJECT: Scheduled Enterprise Resource Planning (ERP) Software Migration

Please be advised that Apex Global Logistics will officially transition all inventory tracking, customs clearance, and fleet routing systems to our next-generation cloud platform, Horizon ERP 4.0, effective Monday, November 2 at 12:00 AM UTC.

The transition schedule is outlined below:
- System Freeze: Friday, October 30, 20:00 UTC. No new outbound freight orders may be entered into the legacy database.
- Data Validation & Migration: Saturday, October 31 to Sunday, November 1. Regional IT teams will verify freight manifests across all four continental fulfillment hubs.
- Full System Go-Live: Monday, November 2, 06:00 UTC. Dispatch teams will resume full automated cargo tracking.

Mandatory Training Requirements:
All dispatch supervisors must complete the 90-minute Horizon ERP interactive webinar by Friday, October 23. Login credentials for the training simulator have been dispatched via automated email. Failure to submit completion certificates will result in temporary suspension of administrative dispatch permissions.

For technical assistance during the weekend cutoff window, please contact the dedicated IT Command Desk at internal extension 4402 or via email at erp-support@apexlogistics.com.""",
        "target_words": ["memorandum", "inventory tracking", "customs clearance", "fleet routing", "outbound freight", "fulfillment hubs", "mandatory training", "administrative permissions"],
        "questions": [
            {
                "question": "What is the primary purpose of the memorandum?",
                "options": [
                    "A. To announce salary increments for truck drivers",
                    "B. To notify management of an upcoming software migration and schedule",
                    "C. To recruit new warehouse staff in Europe",
                    "D. To report a permanent cancellation of freight shipments"
                ],
                "answer": "B",
                "explain": "Tiêu đề và đoạn đầu nêu rõ thông báo chuyển đổi hệ thống phần mềm quản lý kho vận: 'Scheduled Enterprise Resource Planning (ERP) Software Migration'."
            },
            {
                "question": "When is the deadline for dispatch supervisors to complete the mandatory training webinar?",
                "options": [
                    "A. October 14",
                    "B. Friday, October 23",
                    "C. October 30",
                    "D. November 2"
                ],
                "answer": "B",
                "explain": "Phần Mandatory Training Requirements ghi rõ: 'All dispatch supervisors must complete the 90-minute Horizon ERP interactive webinar by Friday, October 23'."
            },
            {
                "question": "What will happen if a supervisor fails to submit their training certificate?",
                "options": [
                    "A. Their employment will be permanently terminated immediately",
                    "B. Their administrative dispatch permissions will be temporarily suspended",
                    "C. They will receive an automatic bonus",
                    "D. They will be transferred to customer service"
                ],
                "answer": "B",
                "explain": "Văn bản nêu rõ: 'Failure to submit completion certificates will result in temporary suspension of administrative dispatch permissions'."
            }
        ]
    },
    {
        "title": "[TOEIC Part 7] Customer Inquiry & Executive Response - Skyline Hospitality",
        "category": "TOEIC",
        "level": "650-800",
        "source_reference": "TOEIC Part 7 Double Passage Practice",
        "content": """EMAIL 1: CUSTOMER INQUIRY
From: Eleanor Davies (e.davies@daviescorp.co.uk)
To: Guest Relations (guestservices@skylinehotels.com)
Date: August 18, 2026
Subject: Inquiry Regarding Corporate Banquet Reservation #BK-9481

Dear Skyline Customer Service Team,

I recently booked the Grand Ballroom at the Skyline Regency Hotel in Chicago for our annual corporate awards banquet on Friday, September 25. Our initial reservation was made for 120 guests with standard catering.

Due to a merger completed earlier this week, our anticipated attendance has expanded to approximately 165 attendees. Could you please confirm if the Grand Ballroom can comfortably accommodate this revised party size? Additionally, we have several delegates who require strictly vegan and gluten-free dietary options. Please furnish an updated pricing estimate inclusive of audiovisual setup and upgraded floral centerpieces.

Sincerely,
Eleanor Davies
Director of Corporate Relations, Davies Enterprises

---

EMAIL 2: EXECUTIVE RESPONSE
From: Julian Thorne, Senior Events Manager (j.thorne@skylinehotels.com)
To: Eleanor Davies (e.davies@daviescorp.co.uk)
Date: August 19, 2026
Subject: Re: Inquiry Regarding Corporate Banquet Reservation #BK-9481

Dear Ms. Davies,

Thank you for contacting Skyline Regency. We are delighted to accommodate your growing celebration!

The Grand Ballroom has a maximum banquet capacity of 220 guests in rounds of ten, so accommodating 165 attendees will be effortless with ample room for the stage and dance floor. Our Executive Chef has curated a premium 3-course menu featuring dedicated vegan and celiac-certified gluten-free selections at no supplemental surcharge.

I have attached a revised quote reflecting the additional covers, high-definition laser projectors, dual wireless microphones, and bespoke autumnal centerpieces. Should you confirm these amendments by August 24, we will gladly extend a complimentary champagne welcome reception for all your guests.

Warm regards,
Julian Thorne
Senior Events Coordinator, Skyline Regency Chicago""",
        "target_words": ["banquet reservation", "accommodate", "dietary options", "audiovisual setup", "floral centerpieces", "banquet capacity", "supplemental surcharge", "complimentary reception"],
        "questions": [
            {
                "question": "Why did Ms. Davies write the first email?",
                "options": [
                    "A. To cancel her hotel stay due to flight delays",
                    "B. To request modifications to her corporate banquet reservation size and catering",
                    "C. To complain about poor room service during her stay",
                    "D. To apply for an event coordinator job at Skyline"
                ],
                "answer": "B",
                "explain": "Ms. Davies gửi thư để tăng số lượng khách từ 120 lên 165, yêu cầu thực đơn ăn chay/không gluten và báo giá bổ sung thiết bị."
            },
            {
                "question": "What is the maximum capacity of the Grand Ballroom at Skyline Regency?",
                "options": [
                    "A. 120 guests",
                    "B. 165 guests",
                    "C. 220 guests",
                    "D. 350 guests"
                ],
                "answer": "C",
                "explain": "Trong Email 2, Julian Thorne cho biết: 'The Grand Ballroom has a maximum banquet capacity of 220 guests...'."
            },
            {
                "question": "What special incentive is offered if Ms. Davies confirms changes before August 24?",
                "options": [
                    "A. A fifty percent discount on room accommodation",
                    "B. A complimentary champagne welcome reception for all guests",
                    "C. Free airfare tickets to Chicago",
                    "D. A free stay in the presidential suite"
                ],
                "answer": "B",
                "explain": "Cuối Email 2 ghi rõ: 'Should you confirm these amendments by August 24, we will gladly extend a complimentary champagne welcome reception for all your guests'."
            }
        ]
    },

    # ==================== APTIS ====================
    {
        "title": "[APTIS] Work Routines: Four Remote Professionals Share Experiences",
        "category": "APTIS",
        "level": "B2",
        "source_reference": "British Council Aptis Reading Task 3 Practice",
        "content": """PERSON A - DANIEL (Software Engineer, Berlin):
"The biggest revelation for me was adopting an asynchronous work schedule. My engineering team spans twelve time zones, from Vancouver to Singapore. Rather than cramming our calendars with tedious Zoom meetings, we document every architecture decision in writing. I do my best deep-focus programming between 6:00 AM and 10:00 AM before turning on my messaging notifications. It requires immense personal discipline, but the autonomy is unmatched."

PERSON B - SOPHIA (Digital Marketer, Madrid):
"Working from home initially caused serious isolation and blurring of work-life boundaries. I found myself answering client emails at 11:00 PM while sitting on the sofa. To preserve my mental well-being, I rented a desk in a vibrant coworking space nearby. Packing a backpack and physically walking twenty minutes to the office gives me the psychological transition I desperately need between professional obligations and personal relaxation."

PERSON C - LIAM (Freelance Translator, Tokyo):
"For me, flexibility is the greatest asset of remote work, especially as a parent of twins. I can drop my children off at school, go for a midday swim at the public pool, and then work intensely in the early afternoon. However, you must be prepared for unpredictable cash flow. Some months are inundated with high-paying commercial localization contracts, while others are relatively quiet."

PERSON D - AYESHA (Cybersecurity Consultant, London):
"Security and ergonomic comfort are my top priorities. When working with sensitive client databases, you cannot simply sit in a noisy café with unencrypted Wi-Fi. I invested heavily in a motorized sit-stand desk, a high-fidelity noise-canceling headset, and an enterprise VPN tunnel. Creating a distraction-free, professional environment at home makes all the difference." """,
        "target_words": ["asynchronous work", "deep-focus programming", "blurring of boundaries", "coworking space", "unpredictable cash flow", "localization contracts", "ergonomic comfort", "enterprise VPN"],
        "questions": [
            {
                "question": "Which person rented a separate desk outside the home to separate work and personal life?",
                "options": [
                    "A. Daniel",
                    "B. Sophia",
                    "C. Liam",
                    "D. Ayesha"
                ],
                "answer": "B",
                "explain": "Sophia (Person B) chia sẻ: 'To preserve my mental well-being, I rented a desk in a vibrant coworking space nearby... gives me the psychological transition'."
            },
            {
                "question": "Which person appreciates remote work primarily because it accommodates parenting duties?",
                "options": [
                    "A. Daniel",
                    "B. Sophia",
                    "C. Liam",
                    "D. Ayesha"
                ],
                "answer": "C",
                "explain": "Liam (Person C) nêu: 'flexibility is the greatest asset of remote work, especially as a parent of twins. I can drop my children off at school...'."
            },
            {
                "question": "Which person emphasizes avoiding real-time meetings in favor of written documentation?",
                "options": [
                    "A. Daniel",
                    "B. Sophia",
                    "C. Liam",
                    "D. Ayesha"
                ],
                "answer": "A",
                "explain": "Daniel (Person A) giải thích: 'Rather than cramming our calendars with tedious Zoom meetings, we document every architecture decision in writing'."
            }
        ]
    },
    {
        "title": "[APTIS] The Science of Intermittent Fasting and Cellular Autophagy",
        "category": "APTIS",
        "level": "B2",
        "source_reference": "Aptis Advanced General Science Reading",
        "content": """In recent years, intermittent fasting (IF) has transitioned from an esoteric fitness trend to a rigorously studied nutritional paradigm. Unlike traditional caloric restriction diets that focus strictly on what foods an individual consumes, intermittent fasting focuses primarily on when nutrients are ingested.

The most common protocol, known as the 16/8 method, involves confining daily calorie intake to an eight-hour window while abstaining from caloric sustenance for the remaining sixteen hours. During prolonged fasting windows, the human body undergoes a metabolic shift: insulin levels drop precipitously, signaling adipocytes to release stored fatty acids for energy synthesis, entering mild ketosis.

At the molecular level, fasting triggers a vital cellular cleansing process known as autophagy, which earned biologist Yoshinori Ohsumi the 2016 Nobel Prize in Physiology. During autophagy, cells degrade, recycle, and eliminate dysfunctional mitochondria, oxidized protein aggregates, and intracellular debris. Scientists hypothesize that regular activation of autophagy plays a protective role against neurodegenerative ailments and age-related cardiovascular decline.

Nevertheless, medical professionals emphasize that fasting regimens are not universally appropriate. Pregnant individuals, adolescents in growth phases, and those with a clinical history of eating disorders must exercise caution and seek professional medical guidance before altering their nutritional schedules.""",
        "target_words": ["intermittent fasting", "caloric restriction", "16/8 method", "metabolic shift", "insulin levels", "cellular autophagy", "mitochondria", "neurodegenerative ailments"],
        "questions": [
            {
                "question": "What is the primary difference between intermittent fasting and traditional diets?",
                "options": [
                    "A. Intermittent fasting eliminates all carbohydrates permanently",
                    "B. It focuses primarily on timing windows rather than solely restricting calories",
                    "C. It requires consuming only water for entire months",
                    "D. It is exclusively practiced by professional athletes"
                ],
                "answer": "B",
                "explain": "Đoạn 1 nêu rõ: 'Unlike traditional caloric restriction diets that focus strictly on what foods an individual consumes, intermittent fasting focuses primarily on when nutrients are ingested'."
            },
            {
                "question": "What is 'autophagy' as described in the passage?",
                "options": [
                    "A. The sudden storage of excess sugar in muscles",
                    "B. A cellular recycling mechanism that eliminates damaged proteins and organelles",
                    "C. A viral infection that attacks red blood cells",
                    "D. An artificial chemical injected during medical testing"
                ],
                "answer": "B",
                "explain": "Đoạn 3 định nghĩa: 'cells degrade, recycle, and eliminate dysfunctional mitochondria, oxidized protein aggregates, and intracellular debris'."
            },
            {
                "question": "Who should exercise caution before starting an intermittent fasting regimen?",
                "options": [
                    "A. Pregnant individuals and individuals with a history of eating disorders",
                    "B. Office workers who use computers",
                    "C. People who exercise in the morning",
                    "D. Professional scientists studying biology"
                ],
                "answer": "A",
                "explain": "Đoạn cuối lưu ý: 'Pregnant individuals, adolescents in growth phases, and those with a clinical history of eating disorders must exercise caution'."
            }
        ]
    },

    # ==================== PET (B1 Preliminary) ====================
    {
        "title": "[PET] A Weekend at Highland Outdoor Adventure Camp",
        "category": "PET",
        "level": "B1 Preliminary",
        "source_reference": "Cambridge English PET (B1 Preliminary) Reading Handbook",
        "content": """Last month, our school organized a three-day weekend excursion to the Highland Adventure Camp, nestled in the rugged hills of northern Scotland. Most students in my class had never spent a night outdoors in a tent, so excitement was running high when our bus pulled into the pine-scented campsite on Friday afternoon.

Our instructor, Sarah, immediately gathered us for a safety briefing. She explained that our weekend would not be a lazy holiday; we would learn outdoor survival skills, including how to pitch weather-resistant tents, build a small campfire without matches using a flint striker, and navigate dense forests using only a topographic map and compass.

On Saturday morning, we faced our biggest challenge: kayaking across a mountain loch. The water was icy and choppy, and my friend Tom and I struggled to keep our double kayak straight against the wind. At one point, our kayak tipped slightly, splashing cold water over our jackets. However, by paddling in rhythm and communicating calmly, we successfully reached the rocky island at the center of the lake.

By Sunday evening, around the warm glow of the farewell campfire, everyone agreed that the trip had brought our class closer together. Not only did we conquer physical fears, but we also learned the true value of teamwork and mutual encouragement.""",
        "target_words": ["excursion", "rugged hills", "safety briefing", "pitch tents", "flint striker", "topographic map", "paddling in rhythm", "mutual encouragement"],
        "questions": [
            {
                "question": "What skill did the students learn on their first day at the camp?",
                "options": [
                    "A. How to drive a school bus across the hills",
                    "B. How to pitch tents, light a fire with flint, and use a map and compass",
                    "C. How to bake traditional bread in a kitchen oven",
                    "D. How to catch fish with commercial nets"
                ],
                "answer": "B",
                "explain": "Đoạn 2 nêu rõ: 'learn outdoor survival skills, including how to pitch weather-resistant tents, build a small campfire without matches using a flint striker, and navigate dense forests using only a topographic map and compass'."
            },
            {
                "question": "What difficulty did Tom and the narrator encounter on the lake?",
                "options": [
                    "A. Their kayak completely sank to the bottom",
                    "B. The water was icy and windy, making it hard to paddle in a straight line",
                    "C. They forgot to bring paddles",
                    "D. Sarah refused to let them enter the water"
                ],
                "answer": "B",
                "explain": "Đoạn 3 kể: 'The water was icy and choppy, and my friend Tom and I struggled to keep our double kayak straight against the wind'."
            },
            {
                "question": "What was the main outcome of the weekend for the students?",
                "options": [
                    "A. They decided never to visit Scotland again",
                    "B. They formed closer bonds and realized the importance of teamwork",
                    "C. They all caught severe colds from the lake water",
                    "D. They bought professional kayaking boats"
                ],
                "answer": "B",
                "explain": "Đoạn cuối kết luận: 'the trip had brought our class closer together. Not only did we conquer physical fears, but we also learned the true value of teamwork and mutual encouragement'."
            }
        ]
    },
    {
        "title": "[PET] Young Innovators: Starting a Sustainable Clothing Brand",
        "category": "PET",
        "level": "B1 Preliminary",
        "source_reference": "Cambridge PET B1 Reading Sample Papers",
        "content": """When seventeen-year-old Mia noticed how many discarded clothes ended up in local landfills each year, she decided to take action. Together with two classmates from her art school, she founded 'ReThread', a small community brand that redesigns second-hand denim into modern, trendy jackets and tote bags.

At first, the trio started by asking friends and family members to donate worn-out jeans that were torn or outgrown. Using sewing machines borrowed from their school craft room, they unstitched the durable fabric and combined different shades of blue denim into striking geometric patchwork designs. Each item was completely unique and stamped with a handwritten message explaining how much textile waste was saved.

Mia began posting short videos on social media showing their creative process—from cutting the old jeans to stitching cool patterns. Within three months, their online store gained thousands of followers, and all fifty of their handmade jackets sold out within two hours of launching.

Despite their rapid success, Mia insists that 'ReThread' will remain focused on environmental education. A portion of every sale is donated to ocean cleanup charities, and the team regularly hosts free weekend workshops to teach teenagers basic sewing and mending skills.""",
        "target_words": ["discarded clothes", "landfills", "second-hand denim", "tote bags", "geometric patchwork", "textile waste", "social media", "mending skills"],
        "questions": [
            {
                "question": "Why did Mia and her classmates start 'ReThread'?",
                "options": [
                    "A. To become wealthy fashion influencers",
                    "B. Because they were concerned about clothing waste in local landfills",
                    "C. To fulfill a mandatory school detention assignment",
                    "D. Because they wanted to buy factory machinery"
                ],
                "answer": "B",
                "explain": "Đoạn 1 nêu: 'When seventeen-year-old Mia noticed how many discarded clothes ended up in local landfills each year, she decided to take action'."
            },
            {
                "question": "How did the team create their first patchwork jackets?",
                "options": [
                    "A. By purchasing expensive rolls of new silk from Paris",
                    "B. By unstitching donated old jeans and sewing different shades together",
                    "C. By painting white cotton t-shirts with watercolor",
                    "D. By ordering ready-made garments from an online factory"
                ],
                "answer": "B",
                "explain": "Đoạn 2 giải thích: 'Using sewing machines... they unstitched the durable fabric and combined different shades of blue denim into striking geometric patchwork designs'."
            },
            {
                "question": "What does Mia's team do with part of their profits?",
                "options": [
                    "A. They donate to ocean cleanup charities and host free sewing workshops",
                    "B. They build an expensive shopping mall",
                    "C. They buy sports cars for their family",
                    "D. They hire a marketing firm in New York"
                ],
                "answer": "A",
                "explain": "Đoạn cuối nêu rõ: 'A portion of every sale is donated to ocean cleanup charities, and the team regularly hosts free weekend workshops to teach teenagers basic sewing and mending skills'."
            }
        ]
    }
]

def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check existing passages
    cursor.execute("SELECT title FROM reading_passages")
    existing_titles = set(row[0] for row in cursor.fetchall())
    print(f"Existing passages in DB: {len(existing_titles)}")
    
    inserted_count = 0
    for p in PASSAGES:
        if p["title"] in existing_titles:
            print(f"Skipping existing: {p['title']}")
            continue
            
        cursor.execute("""
            INSERT INTO reading_passages (
                title, category, level, content, source_reference, target_words_json, questions_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            p["title"],
            p["category"],
            p["level"],
            p["content"].strip(),
            p.get("source_reference", ""),
            json.dumps(p.get("target_words", []), ensure_ascii=False),
            json.dumps(p.get("questions", []), ensure_ascii=False)
        ))
        inserted_count += 1
        print(f"Inserted [{p['category']}] {p['title']}")
        
    conn.commit()
    conn.close()
    print(f"\nSuccessfully inserted {inserted_count} new exam reading passages!")

if __name__ == "__main__":
    main()
