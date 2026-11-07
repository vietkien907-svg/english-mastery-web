import json
import sqlite3
import os

target_dir = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web"
db_path = os.path.join(target_dir, "backend", "app.db")

articles = [
    {
        "id": 1,
        "title": "Unit 1: The Emotional Value of Old Possessions",
        "category": "story",
        "level": "B1+",
        "source_reference": "Cambridge Life Stories Archive",
        "content": "Last week, Alex decided to tidy up his attic because it was full of old items. While sorting through broken wooden chairs that he needed to throw out, he discovered a genuine ancient box. The box belonged to his grandfather, who was a master clockmaker. Inside lay a gold watch and a leather notebook. Alex was not a big fan of keeping clutter, but this piece was very special to him. He realized that it gave him immense pleasure just holding an artifact that has stood the test of time. He decided to hang up a picture of his grandfather right above the shelf where the box now sits.",
        "target_words": ["tidy up", "throw out", "genuine", "belonged to", "special", "give pleasure", "hang up", "leather"],
        "questions": [
            {
                "q": "What did Alex discover in the attic?",
                "options": ["A modern smartphone", "A genuine ancient box belonging to his grandfather", "A broken gate", "Plastic cups"],
                "answer": 1,
                "explain": "Đoạn văn nêu rõ Alex tìm thấy chiếc hộp cổ thực sự của ông mình."
            },
            {
                "q": "How did Alex feel about holding the box?",
                "options": ["He was angry", "It gave him immense pleasure", "He wanted to sell it immediately", "He ignored it"],
                "answer": 1,
                "explain": "Bài đọc ghi: 'it gave him immense pleasure just holding an artifact'."
            }
        ]
    },
    {
        "id": 2,
        "title": "BBC Technology: Artificial Intelligence and Human Career Shifts",
        "category": "technology",
        "level": "B2",
        "source_reference": "BBC Future & Tech Insights",
        "content": "The emergence of modern generative models has transformed industries globally. Professionals who previously struggled to avoid distractions can now automate mundane reporting tasks. However, workers who fall behind schedule or refuse to be flexible face severe job market pressure. Industry leaders emphasize that taking responsibility and cultivating lifelong passions are indispensable for long-term career growth. Rather than putting off digital skills training, individuals are advised to make an effort and weather the storm together in this fast-paced era.",
        "target_words": ["avoid distractions", "fall behind schedule", "flexible", "take responsibility", "lifelong passion", "put off", "make an effort", "weather the storm"],
        "questions": [
            {
                "q": "What is recommended for workers facing digital transformation?",
                "options": ["Delaying training until later", "Making an effort and taking responsibility", "Quitting the job market", "Ignoring technology"],
                "answer": 1,
                "explain": "Bài đọc khuyên mọi người chủ động nỗ lực và nhận trách nhiệm nâng cao kỹ năng."
            },
            {
                "q": "What risk do inflexible workers face?",
                "options": ["Higher salaries", "Severe job market pressure", "Automatic promotions", "No consequences"],
                "answer": 1,
                "explain": "Những nhân sự thiếu linh hoạt đối mặt với áp lực gay gắt từ thị trường việc làm."
            }
        ]
    },
    {
        "id": 3,
        "title": "National Geographic: Coral Reef Ecosystems Under Ocean Warming",
        "category": "environment",
        "level": "B2",
        "source_reference": "National Geographic Environment",
        "content": "Coral reefs represent some of the most biodiverse marine habitats on our planet, sustaining over a quarter of all ocean species. However, rising sea temperatures have triggered widespread coral bleaching across tropical waters. When seawater warms abnormally, corals expel the symbiotic algae living in their tissues, turning completely white and vulnerable to mortality. Marine biologists are pioneering resilient coral nurseries to restore degraded barrier reefs. Preserving these underwater sanctuaries requires international cooperation to curb carbon emissions and curtail plastic contamination before irreparable damage occurs.",
        "target_words": ["biodiverse", "marine habitat", "coral bleaching", "symbiotic algae", "vulnerable", "coral nursery", "curb carbon emissions", "irreparable damage"],
        "questions": [
            {
                "q": "What causes corals to undergo bleaching?",
                "options": ["Extreme cold currents", "Rising sea temperatures", "Overfishing only", "Volcanic eruptions"],
                "answer": 1,
                "explain": "Nhiệt độ nước biển tăng bất thường khiến san hô tẩy trắng (coral bleaching)."
            },
            {
                "q": "How much of ocean species do coral reefs support?",
                "options": ["Less than 5%", "Over a quarter (25%)", "Half the ocean", "All ocean life"],
                "answer": 1,
                "explain": "Rạn san hô nuôi dưỡng hơn 1/4 (25%) các loài sinh vật biển."
            }
        ]
    },
    {
        "id": 4,
        "title": "The Guardian: The Neurological Science of Deep Sleep and Memory",
        "category": "health",
        "level": "B1+",
        "source_reference": "The Guardian Science & Health",
        "content": "Sleep is far from a passive state of physical inactivity. During non-rapid eye movement (NREM) deep sleep, the brain acts as an active filing cabinet, shifting short-term experiences into permanent long-term storage in the neocortex. Neuroscientists have also identified the glymphatic system, a cellular filtration mechanism that flushes out toxic metabolic waste accumulated during waking hours. Chronic sleep deprivation impairs memory consolidation, elevates cortisol levels, and weakens immune resilience. Prioritizing seven to eight hours of regular slumber is essential for optimal cognitive longevity.",
        "target_words": ["passive state", "filing cabinet", "long-term storage", "metabolic waste", "sleep deprivation", "memory consolidation", "immune resilience", "cognitive longevity"],
        "questions": [
            {
                "q": "What does the brain do during deep NREM sleep?",
                "options": ["Completely shuts down", "Transfers short-term memories into permanent long-term storage", "Stops cellular filtration", "Increases toxic waste"],
                "answer": 1,
                "explain": "Trong giấc ngủ sâu, não bộ chuyển giao các trải nghiệm ngắn hạn sang bộ nhớ dài hạn vĩnh viễn."
            },
            {
                "q": "What is the primary role of the glymphatic system?",
                "options": ["Storing sugars", "Flushing out toxic metabolic waste", "Increasing heartbeat", "Creating nightmares"],
                "answer": 1,
                "explain": "Hệ thống glymphatic đào thải các độc tố và chất cặn bã tích tụ trong ngày."
            }
        ]
    },
    {
        "id": 5,
        "title": "Reuters: Global E-Commerce Expansion and Green Supply Chains",
        "category": "economy",
        "level": "B2",
        "source_reference": "Reuters Global Business Review",
        "content": "The worldwide boom in online retail has fundamentally altered urban logistics and consumer expectations. Same-day package deliveries demand sophisticated automated fulfillment hubs and algorithm-driven route planning. Nevertheless, the surge in individual parcels has generated unprecedented packaging waste and carbon footprints from last-mile transportation. Forward-thinking logistics corporations are now investing heavily in electric delivery fleets and biodegradable packaging materials. Consumers are also becoming more eco-conscious, frequently favoring vendors who transparently demonstrate sustainable and ethical business models.",
        "target_words": ["consumer expectation", "fulfillment hub", "route planning", "carbon footprint", "last-mile transportation", "electric delivery fleet", "biodegradable", "sustainable business"],
        "questions": [
            {
                "q": "What environmental challenge has resulted from e-commerce growth?",
                "options": ["Lack of internet cables", "Surge in packaging waste and transportation emissions", "Fewer consumer choices", "Higher paper prices"],
                "answer": 1,
                "explain": "Sự gia tăng đơn hàng thương mại điện tử tạo ra rác thải đóng gói khổng lồ và khí thải giao hàng chặng cuối."
            },
            {
                "q": "How are modern logistics companies tackling this environmental impact?",
                "options": ["Banning online shopping", "Investing in electric delivery fleets and biodegradable packaging", "Slow delivery down", "Moving warehouses abroad"],
                "answer": 1,
                "explain": "Các doanh nghiệp đang đầu tư vào đội xe điện và vật liệu đóng gói tự phân hủy sinh học."
            }
        ]
    },
    {
        "id": 6,
        "title": "CNN Space: The Artemis Mission and Sustainable Lunar Colonization",
        "category": "science",
        "level": "C1",
        "source_reference": "CNN Tech & Space Exploration",
        "content": "Humanity stands on the precipice of a groundbreaking return to the Moon through international partnerships under the Artemis accords. Unlike the brief Apollo touchdowns of the twentieth century, contemporary lunar initiatives aspire to establish permanent infrastructure, including sustainable surface habitats and orbiting space stations. Scientists aim to extract frozen water ice buried in deep shadowed craters at the lunar south pole, converting it into drinkable hydration and hydrogen rocket fuel. This celestial outpost will serve as an indispensable stepping stone for crewed expeditions to Mars in the coming decades.",
        "target_words": ["on the precipice of", "groundbreaking", "permanent infrastructure", "surface habitat", "shadowed crater", "celestial outpost", "stepping stone", "crewed expedition"],
        "questions": [
            {
                "q": "What distinguishes the Artemis program from earlier Apollo missions?",
                "options": ["It aims for permanent infrastructure rather than brief touchdowns", "It only uses robotic rovers", "It avoids landing on the Moon", "It is entirely private"],
                "answer": 0,
                "explain": "Artemis đặt mục tiêu xây dựng hạ tầng định cư lâu dài thay vì các chuyến hạ cánh ngắn hạn như thời Apollo."
            },
            {
                "q": "What will lunar water ice be utilized for?",
                "options": ["Making ice rinks", "Drinkable hydration and hydrogen rocket propellant", "Cooling telescope mirrors", "Shipping back to Earth"],
                "answer": 1,
                "explain": "Băng nước ở cực nam Mặt Trăng sẽ được chiết xuất làm nước uống và nhiên liệu tên lửa hydro."
            }
        ]
    },
    {
        "id": 7,
        "title": "The Economist: Urban Greenery and Psychological Well-being",
        "category": "society",
        "level": "B2",
        "source_reference": "The Economist Urban Studies",
        "content": "Rapid urbanization has transformed pristine landscapes into dense concrete metropolises, often separating city residents from the natural world. Epidemiological studies conclusively demonstrate that living in close proximity to parks and tree-lined avenues significantly reduces clinical anxiety and cardiovascular disorders. Urban planners are adopting the biophilic design paradigm, integrating rooftop gardens, community allotments, and permeable walkways into modern skyscrapers. Reconnecting urban citizens with nature fosters social cohesion and mitigates the urban heat island phenomenon, making cities both physically cooler and emotionally healthier.",
        "target_words": ["rapid urbanization", "concrete metropolis", "epidemiological", "biophilic design", "rooftop garden", "permeable walkway", "social cohesion", "urban heat island"],
        "questions": [
            {
                "q": "What health benefits are linked to living near urban green spaces?",
                "options": ["Reduced clinical anxiety and cardiovascular disorders", "Faster commuting speeds only", "Increased screen time", "Higher noise levels"],
                "answer": 0,
                "explain": "Không gian xanh giúp giảm đáng kể chứng lo âu và bệnh tim mạch ở cư dân đô thị."
            },
            {
                "q": "What does biophilic architecture integrate into buildings?",
                "options": ["More concrete walls", "Rooftop gardens and permeable natural walkways", "Underground parking only", "Taller billboards"],
                "answer": 1,
                "explain": "Kiến trúc ưa sinh học tích hợp vườn trên mái và lối đi thấm nước tự nhiên."
            }
        ]
    },
    {
        "id": 8,
        "title": "BBC Culture: The Nomadic Lifestyle and Cross-Cultural Perspectives",
        "category": "culture",
        "level": "B1+",
        "source_reference": "BBC Travel & Global Culture",
        "content": "Fueled by high-speed internet and flexible remote employment policies, millions of adventurous individuals have embraced the digital nomad lifestyle. By trading monotonous office cubicles for coastal hostels and mountain co-working spaces, these location-independent workers gain profound cultural empathy. Navigating unfamiliar languages and local customs teaches adaptability and resilience. However, this bohemian existence carries hidden challenges, including bureaucratic visa complications and periodic bouts of loneliness. Maintaining authentic friendships and continuous work discipline remains paramount for anyone choosing to call the entire world their home.",
        "target_words": ["remote employment", "digital nomad", "location-independent", "cultural empathy", "local custom", "bureaucratic", "loneliness", "work discipline"],
        "questions": [
            {
                "q": "What is a major benefit of being a digital nomad?",
                "options": ["Never working again", "Gaining cultural empathy and learning adaptability", "Free flights everywhere", "Avoiding paying bills"],
                "answer": 1,
                "explain": "Lối sống du mục số giúp mở rộng thấu cảm văn hóa và rèn luyện tính thích ứng."
            },
            {
                "q": "What hidden challenge is mentioned in the passage?",
                "options": ["Too many computers", "Bureaucratic visa complications and periodic loneliness", "Lack of food in cities", "No access to beaches"],
                "answer": 1,
                "explain": "Các khó khăn tiềm ẩn là thủ tục visa phức tạp và những đợt cô đơn khi xa nhà."
            }
        ]
    },
    {
        "id": 9,
        "title": "Nature: Breakthroughs in Perovskite Photovoltaics and Clean Energy",
        "category": "environment",
        "level": "C1",
        "source_reference": "Nature Energy Journal",
        "content": "Transitioning away from fossil fuels hinges upon enhancing the efficiency and economic affordability of solar energy capture. While traditional silicon solar panels have dominated the clean energy sector for decades, crystalline perovskite materials are heralding a technological revolution. Perovskite solar cells can be synthesized through cost-effective chemical printing and exhibit exceptional light-absorption capacities across diverse spectrum bands. Tandem configurations combining silicon with perovskite layers have shattered prior energy conversion efficiency records, providing viable pathways toward decarbonizing industrial manufacturing and heavy transportation.",
        "target_words": ["fossil fuel", "economic affordability", "solar panel", "crystalline perovskite", "synthesized", "light-absorption", "energy conversion efficiency", "decarbonize"],
        "questions": [
            {
                "q": "Why are perovskite materials considered revolutionary for solar panels?",
                "options": ["They are made of heavy iron", "They can be printed inexpensively and absorb light exceptionally well", "They only work at night", "They replace electricity entirely"],
                "answer": 1,
                "explain": "Vật liệu perovskite có thể in hóa học giá rẻ và sở hữu khả năng hấp thụ ánh sáng vượt trội."
            },
            {
                "q": "What is the ultimate goal of high-efficiency tandem solar cells?",
                "options": ["Decarbonizing industrial manufacturing and heavy transportation", "Heating swimming pools", "Exporting rocks", "Replacing all computers"],
                "answer": 0,
                "explain": "Mục tiêu là cung cấp năng lượng sạch để khử cacbon trong công nghiệp sản xuất và giao thông vận tải."
            }
        ]
    },
    {
        "id": 10,
        "title": "Psychology Today: Neuroplasticity and the Ageless Learning Mind",
        "category": "education",
        "level": "B2",
        "source_reference": "Psychology Today Cognitive Research",
        "content": "For centuries, conventional wisdom presumed that the adult brain was fixed and incapable of substantial architectural growth. Contemporary neurobiology has utterly debunked this myth through the discovery of lifelong neuroplasticity. The human brain continuously forms novel synaptic pathways, strengthens neural circuits, and reorganizes its structure in direct response to learning novel skills. Whether acquiring a second language, playing a musical instrument, or mastering coding, challenging intellectual exertion fortifies cognitive reserve against degenerative diseases. Embracing deliberate practice and viewing errors as informative feedback are hallmarks of an empowered learner.",
        "target_words": ["conventional wisdom", "neuroplasticity", "synaptic pathway", "neural circuit", "cognitive reserve", "degenerative disease", "deliberate practice", "informative feedback"],
        "questions": [
            {
                "q": "What does neuroplasticity demonstrate about the adult brain?",
                "options": ["It stops learning after age 20", "It continuously forms new neural pathways and rewires itself throughout life", "It loses all memory slowly", "It never changes after childhood"],
                "answer": 1,
                "explain": "Tính khả biến thần kinh (neuroplasticity) chứng minh não người trưởng thành liên tục tạo mới các khớp thần kinh khi học tập."
            },
            {
                "q": "How does learning challenging skills help protect the brain?",
                "options": ["By making one tired", "By fortifying cognitive reserve against degenerative diseases", "By reducing brain size", "By stopping dreams"],
                "answer": 1,
                "explain": "Học kỹ năng mới giúp củng cố dự trữ nhận thức chống lại các bệnh thoái hóa thần kinh."
            }
        ]
    }
]

def update_readings_database():
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Clear existing and insert full rich collection of international articles
    c.execute("DELETE FROM reading_passages")
    
    for art in articles:
        c.execute("""
            INSERT INTO reading_passages (id, title, category, level, content, source_reference, target_words_json, questions_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            art["id"],
            art["title"],
            art["category"],
            art["level"],
            art["content"],
            art.get("source_reference", "International News Archive"),
            json.dumps(art["target_words"], ensure_ascii=False),
            json.dumps(art["questions"], ensure_ascii=False)
        ))
    
    conn.commit()
    conn.close()
    print(f"Successfully inserted {len(articles)} international reading articles into database!")

if __name__ == "__main__":
    update_readings_database()
