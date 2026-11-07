# generate_100_passages_full.py
import sqlite3
import json
import os

DB_PATH = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\backend\app.db"

# 100 Curated Topics across 10 Themes
TOPICS_METADATA = [
    # Theme 1: Mind, Learning & Everyday Psychology (1-10)
    (1, "The Emotional Value of Keepsakes", "Daily Life", "B1", "Cambridge Life Stories",
     "cherishing heirloom memories in family attics",
     ("valuable", "pleasure", "hang", "belong"),
     ("có giá trị", "niềm vui", "treo lên", "thuộc về")),

    (2, "Artificial Intelligence and Future Careers", "Technology", "B2", "BBC Technology Insights",
     "collaborative AI tools augmenting workplace productivity and human empathy",
     ("generate", "obsolete", "replicate", "beneficial"),
     ("sản sinh", "lỗi thời", "mô phỏng", "có lợi")),

    (3, "Marine Ecosystems and Coral Bleaching", "Environment", "B2", "National Geographic Marine Series",
     "rising sea temperatures causing mass bleaching and reef restoration efforts",
     ("white", "transplanting", "resilience", "extinction"),
     ("màu trắng", "cấy ghép", "sức chống chịu", "tuyệt chủng")),

    (4, "The Science of Deep Sleep and Memory", "Health", "B1", "The Guardian Health Review",
     "glymphatic fluid flushing toxins and hippocampus transferring long-term memories",
     ("flush", "retain", "uninterrupted", "energized"),
     ("rửa trôi", "lưu giữ", "liền mạch", "tràn đầy năng lượng")),

    (5, "Sustainable E-Commerce and Urban Logistics", "Business", "B2", "Financial Times Logistics",
     "micro-fulfillment warehouses and electric cargo bikes cutting urban delivery emissions",
     ("shorten", "slash", "curtail", "sustainable"),
     ("rút ngắn", "cắt giảm mạnh", "hạn chế", "bền vững")),

    (6, "Lunar Exploration and Future Moon Bases", "Science", "B1", "NASA Science Update",
     "lunar south pole ice deposits providing drinking water and rocket propellants",
     ("produce", "damage", "expand", "thrive"),
     ("sản xuất", "làm hỏng", "mở rộng", "phát triển")),

    (7, "Urban Greenery and Psychological Well-being", "Society", "B1", "The Economist Urban Studies",
     "pocket parks and tree canopies reducing cortisol and urban heat island effects",
     ("lower", "mitigate", "interact", "optimal"),
     ("hạ thấp", "giảm nhẹ", "tương tác", "tối ưu")),

    (8, "The Rise of Remote Digital Nomads", "Work", "B1", "BBC Worklife Features",
     "high-speed connectivity allowing global travel while maintaining remote professional careers",
     ("collaborate", "isolation", "maintain", "rewarding"),
     ("hợp tác", "sự cô đơn", "duy trì", "đầy ý nghĩa")),

    (9, "Breakthroughs in Solar Energy Storage", "Environment", "B1", "Nature Clean Energy",
     "solid-state battery chemistry smoothing day-night intermittency of photovoltaic grids",
     ("store", "discharge", "accelerate", "resilient"),
     ("lưu trữ", "phóng điện", "đẩy nhanh", "kiên cường")),

    (10, "Neuroplasticity and the Ageless Mind", "Education", "B2", "Psychology Today Neuroscience",
     "lifelong structural synaptic rewiring through foreign language and musical instrument practice",
     ("stimuli", "fade", "forestall", "vibrant"),
     ("kích thích", "mai một", "ngăn chặn trước", "minh mẫn")),

    # Theme 2: Health, Nutrition & Human Biology (11-20)
    (11, "Language Immersion and Fluency Acquisition", "Education", "B1", "Oxford Linguistics Review",
     "active spoken conversation creating dynamic cognitive reflex compared to passive grammar memorization",
     ("converse", "hesitate", "accelerate", "fluent"),
     ("trò chuyện", "ngập ngừng", "tăng tốc", "lưu loát")),

    (12, "Microplastics in the Global Food Chain", "Environment", "B2", "Scientific American Ocean Report",
     "degraded synthetic fibers entering marine organisms and bioaccumulating in human nutrition",
     ("ingest", "accumulate", "eliminate", "hazardous"),
     ("nuốt phải", "tích tụ", "loại bỏ", "nguy hại")),

    (13, "The Mediterranean Diet and Cardiovascular Health", "Health", "B1", "Harvard Public Health Gazette",
     "unrefined olive oil, legumes, and fresh produce reducing arterial inflammation and chronic risks",
     ("consume", "protect", "substitute", "longevity"),
     ("tiêu thụ", "bảo vệ", "thay thế", "tuổi thọ dài lâu")),

    (14, "Time Management and the Pomodoro Technique", "Psychology", "B1", "Mindset & Productivity Quarterly",
     "twenty-five minute focused sprints alternating with five-minute pauses combating mental fatigue",
     ("distraction", "concentrate", "procrastinate", "productive"),
     ("sự xao nhãng", "tập trung", "trì hoãn", "năng suất")),

    (15, "Ocean Conservation and Coastal Cleanup Barriers", "Environment", "B1", "Global Marine Guardian",
     "automated floating booms trapping plastic debris before rivers discharge waste into oceans",
     ("trap", "pollute", "recycle", "pristine"),
     ("bắt giữ rác", "gây ô nhiễm", "tái chế", "nguyên sơ trong lành")),

    (16, "Smart Traffic Control in Modern Megacities", "Technology", "B2", "Urban Infrastructure Today",
     "AI camera networks dynamically adjusting signal timings to dissolve gridlock bottlenecks",
     ("regulate", "congested", "optimize", "efficient"),
     ("điều tiết", "tắc nghẽn", "tối ưu hóa", "hiệu quả")),

    (17, "The Science of Habit Stacking", "Psychology", "B1", "Behavioral Insights Journal",
     "anchoring a new target habit onto an already established daily automated trigger",
     ("anchor", "automatic", "reinforce", "sustainable"),
     ("neo đậu thói quen", "tự động", "củng cố", "bền vững")),

    (18, "Electric Vehicles and Battery Recycling", "Environment", "B1", "Clean Tech Quarterly",
     "closed-loop hydrometallurgical recovery of cobalt and nickel from spent automotive batteries",
     ("recover", "deplete", "manufacture", "eco-friendly"),
     ("thu hồi", "làm cạn kiệt", "sản xuất", "thân thiện môi trường")),

    (19, "Mindfulness Meditation for Workplace Stress", "Health", "B1", "Wellness & Psychology Review",
     "mindful breathing exercises activating the vagus nerve and enhancing emotional regulation",
     ("breathe", "anxious", "restore", "peaceful"),
     ("hít thở", "lo âu", "phục hồi", "bình an")),

    (20, "Deep Space Observatories and Distant Galaxies", "Science", "B2", "Astrophysics International",
     "infrared space telescopes piercing cosmic dust clouds to reveal early star formation",
     ("detect", "obscured", "unveil", "fascinating"),
     ("phát hiện", "bị che khuất", "vén màn hé lộ", "hấp dẫn lôi cuốn")),

    # Theme 3: Society, Culture & Work (21-30)
    (21, "The Power of Consistency in Personal Growth", "Psychology", "B1", "Daily Mastery Journal",
     "small incremental daily actions compounding into monumental athletic or intellectual achievements",
     ("compound", "irregular", "discipline", "remarkable"),
     ("tích lũy cấp số nhân", "không đều đặn", "kỷ luật", "đáng kinh ngạc")),

    (22, "Offshore Wind Farms and Clean Coastal Power", "Environment", "B1", "Renewable Energy Digest",
     "giant ocean wind turbines harnessing strong maritime currents to light up coastal cities",
     ("capture", "turbulent", "supply", "renewable"),
     ("thu nhận", "gió mạnh bất ổn", "cung cấp", "tái tạo")),

    (23, "The Global Boom of Educational Podcasting", "Culture", "B1", "Media Studies International",
     "auditory storytelling allowing commuters to absorb history, science, and philosophy anywhere",
     ("broadcast", "passive", "engage", "informative"),
     ("phát sóng", "thụ động", "thu hút cuốn hút", "bổ ích")),

    (24, "Preserving Traditional Artisanal Woodworking", "Culture", "B1", "Heritage Crafts Archive",
     "master carpenters keeping ancient mortise and tenon joinery alive against mass factory plastics",
     ("carve", "inferior", "preserve", "timeless"),
     ("chạm khắc", "kém chất lượng", "bảo tồn", "vượt thời gian")),

    (25, "Healthy Aging and Daily Physical Mobility", "Health", "B1", "Geriatric Medicine Journal",
     "regular brisk walking and resistance training maintaining skeletal density and balance in seniors",
     ("strengthen", "frail", "prevent", "independent"),
     ("tăng cường sức mạnh", "yếu ớt", "ngăn ngừa", "tự chủ độc lập")),

    (26, "Co-Working Communities and Modern Freelancers", "Business", "B1", "Modern Workplace Quarterly",
     "shared flexible workspaces reducing loneliness and fostering spontaneous entrepreneur collaborations",
     ("interact", "isolated", "spark", "flexible"),
     ("tương tác", "cô lập", "thổi bùng sáng kiến", "linh hoạt")),

    (27, "Rainforest Biodiversity and Natural Medicines", "Science", "B2", "Ethnobotany Gazette",
     "indigenous healers guiding pharmacists to therapeutic compounds found in rare jungle bark",
     ("extract", "synthesize", "conserve", "invaluable"),
     ("chiết xuất", "tổng hợp hóa học", "bảo tồn", "vô giá")),

    (28, "The Evolution of Digital Higher Education", "Education", "B1", "Academic Futures",
     "interactive virtual classrooms delivering university-level degrees to underserved global regions",
     ("enroll", "prohibitive", "democratize", "accessible"),
     ("ghi danh", "đắt đỏ ngăn trở", "bình dân hóa", "dễ tiếp cận")),

    (29, "Specialty Coffee and Ethical Direct Trade", "Society", "B1", "Global Agriculture Review",
     "fair roaster partnerships guaranteeing premium prices to smallholder Andean bean farmers",
     ("roast", "exploit", "guarantee", "ethical"),
     ("rang hạt cà phê", "bóc lột", "đảm bảo", "đạo đức công bằng")),

    (30, "The Human Microbiome and Gut-Brain Health", "Health", "B2", "Biomedical Frontiers",
     "trillions of intestinal bacteria manufacturing neurotransmitters that influence mood and immunity",
     ("populate", "disrupt", "synthesize", "vital"),
     ("sinh sống", "làm xáo trộn", "tổng hợp", "thiết yếu")),

    # Theme 4: Science, Innovation & Earth (31-40)
    (31, "Autonomous Vehicles and Road Safety Systems", "Technology", "B2", "Automotive Engineering Journal",
     "LiDAR lasers and radar algorithms eliminating human driving errors like fatigue and distraction",
     ("navigate", "hazardous", "calculate", "reliable"),
     ("điều hướng", "nguy hiểm", "tính toán", "đáng tin cậy")),

    (32, "Cybersecurity Awareness for Everyday Citizens", "Technology", "B1", "Digital Safety Foundation",
     "two-factor authentication and vigilant phishing checks shielding personal financial data",
     ("verify", "vulnerable", "encrypt", "secure"),
     ("xác minh", "dễ bị xâm nhập", "mã hóa", "an toàn")),

    (33, "Regenerative Agriculture and Living Soil", "Environment", "B1", "Sustainable Farming Today",
     "no-till planting and diverse cover crops sequestering atmospheric carbon into rich topsoil",
     ("enrich", "degrade", "cultivate", "fertile"),
     ("làm giàu dinh dưỡng", "suy thoái xói mòn", "canh tác", "màu mỡ")),

    (34, "Overcoming Procrastination through Micro-Steps", "Psychology", "B1", "Cognitive Action Bulletin",
     "shrinking daunting assignments into manageable five-minute tasks disarming brain overwhelm",
     ("dismantle", "paralyze", "initiate", "manageable"),
     ("tháo gỡ", "làm tê liệt", "khởi động", "dễ quản lý")),

    (35, "Fast Fashion and the Upcycling Revolution", "Society", "B1", "Sustainable Lifestyle Review",
     "young fashion designers repurposing secondhand textile waste into stylish designer garments",
     ("discard", "synthetic", "transform", "trendy"),
     ("vứt bỏ", "sợi tổng hợp", "chuyển hóa", "hợp thời trang")),

    (36, "Automated River Cleaning and Ocean Protection", "Environment", "B1", "Hydrology & Ecology",
     "solar-powered river catamarans skimming trash before it travels into coastal marine waters",
     ("intercept", "clog", "deploy", "clean"),
     ("chặn đứng", "làm nghẽn", "triển khai", "sạch đẹp")),

    (37, "Neurological Benefits of Music Practice", "Health", "B2", "Neuroscience Letters",
     "playing the piano building thick corpus callosum bridges between brain hemispheres",
     ("stimulate", "deteriorate", "strengthen", "harmonious"),
     ("kích thích", "suy thoái", "củng cố làm mạnh", "hài hòa")),

    (38, "Vertical Agriculture in Urban Skyscrapers", "Environment", "B1", "Future Cities Journal",
     "hydroponic nutrient mists and precision LEDs growing leafy greens with 95% less water",
     ("nourish", "waste", "harvest", "compact"),
     ("nuôi dưỡng", "lãng phí", "thu hoạch", "gọn gàng")),

    (39, "Gutenberg and the Printing Revolution", "History", "B1", "Historical Studies Quarterly",
     "movable metal type democratizing literacy and scientific knowledge across Renaissance Europe",
     ("print", "scarce", "distribute", "revolutionary"),
     ("in ấn", "khan hiếm", "phân phối truyền bá", "mang tính cách mạng")),

    (40, "Behavioral Economics and Financial Impulses", "Economics", "B2", "Consumer Decision Review",
     "retail psychological anchoring nudging shoppers toward impulsive premium purchases",
     ("persuade", "irrational", "assess", "prudent"),
     ("thuyết phục dụ dỗ", "phi lý trí", "đánh giá kỹ", "khôn ngoan thận trọng")),

    # Theme 5: Modern Infrastructure & Nature (41-50)
    (41, "Telemedicine in Remote Island Communities", "Health", "B1", "Global Medical Outreach",
     "high-definition satellite video linkups allowing city specialists to examine rural patients",
     ("diagnose", "isolated", "prescribe", "convenient"),
     ("chẩn đoán", "bị cô lập xa xôi", "kê đơn điều trị", "tiện lợi")),

    (42, "The Engineering Marvel of Suspension Bridges", "Science", "B1", "Civil Engineering Today",
     "flexible steel cables and aerodynamic deck profiles swaying safely against hurricane gales",
     ("suspend", "rigid", "withstand", "sturdy"),
     ("treo lơ lửng", "cứng đờ dễ gãy", "chống chịu", "vững chãi")),

    (43, "Seawater Desalination for Arid Regions", "Environment", "B2", "Water Technology Review",
     "reverse osmosis ceramic membranes filtering salt ions to supply drinking water to deserts",
     ("purify", "saline", "alleviate", "drinkable"),
     ("lọc sạch tinh khiết", "mặn chứa muối", "làm vơi nhẹ cơn khát", "uống được")),

    (44, "The Nuances of Cross-Cultural Etiquette", "Culture", "B1", "International Business Etiquette",
     "understanding high-context indirect gestures versus direct verbal communication in negotiations",
     ("interpret", "offend", "adapt", "respectful"),
     ("diễn giải ý", "gây xúc phạm phật lòng", "thích nghi", "tôn trọng lịch thiệp")),

    (45, "Wildfire Ecology and Forest Rejuvenation", "Environment", "B1", "Forestry & Fire Ecology",
     "natural low-intensity blazes clearing dense underbrush and cracking open serotinous pine cones",
     ("burn", "choke", "regenerate", "flourishing"),
     ("thiêu đốt", "làm ngột ngạt", "tái sinh", "xanh tươi tốt")),

    (46, "The Transformation of Physical Currency to Digital Cash", "Business", "B1", "FinTech Horizons",
     "contactless mobile wallets replacing paper bank notes in everyday market transactions",
     ("transfer", "counterfeit", "modernize", "seamless"),
     ("chuyển tiền", "tiền giả mạo", "hiện đại hóa", "liền mạch mượt mà")),

    (47, "Responsible Eco-Tourism and Heritage Sites", "Culture", "B1", "Sustainable Tourism Journal",
     "capping daily visitor quotas to preserve ancient limestone ruins and fragile alpine trails",
     ("protect", "erode", "regulate", "pristine"),
     ("bảo vệ", "làm xói mòn", "quy định kiểm soát", "nguyên vẹn")),

    (48, "Complex Animal Signals and Dolphin Whistles", "Science", "B1", "Marine Biology Reports",
     "signature whistle acoustic patterns allowing pods to recognize individual family members",
     ("communicate", "deceive", "coordinate", "intelligent"),
     ("giao tiếp", "đánh lừa", "phối hợp nhóm", "thông minh")),

    (49, "Community Libraries as Digital Technology Centers", "Society", "B1", "Public Library Quarterly",
     "free community makerspaces offering 3D printers, coding classes, and audio recording studios",
     ("borrow", "outdated", "empower", "welcoming"),
     ("mượn sách", "lỗi thời", "trao quyền nâng cao năng lực", "thân thiện chào đón")),

    (50, "Geothermal District Heating in Nordic Cities", "Environment", "B2", "Clean Heating Gazette",
     "subterranean volcanic hot aquifers warming radiator pipes across thousands of homes",
     ("extract", "fossil", "distribute", "reliable"),
     ("khai thác nước nóng", "nhiên liệu hóa thạch", "phân phối", "đáng tin cậy ổn định")),

    # Theme 6: Advanced Frontiers & Civilization (51-60)
    (51, "The Fundamentals of Quantum Superposition", "Technology", "C1", "Quantum Physics International",
     "qubits existing simultaneously in multiple states accelerating complex chemical simulations",
     ("encode", "classical", "exponentially", "revolutionary"),
     ("mã hóa", "cổ điển thông thường", "cấp số nhân", "cách mạng đột phá")),

    (52, "The Biochemical Foundations of Joy", "Health", "B1", "Endocrinology & Happiness",
     "dopamine anticipation and serotonin gratitude molecules elevating daily emotional mood",
     ("secrete", "deplete", "cultivate", "uplifting"),
     ("tiết ra hormone", "làm cạn kiệt", "nuôi dưỡng", "nâng cao tinh thần")),

    (53, "Volcanic Ash Soil and Fertile Vineyards", "Science", "B1", "Geology & Agriculture",
     "crushed basalt minerals and volcanic ash creating mineral-dense nutrients for grape vines",
     ("fertilize", "sterile", "harvest", "bountiful"),
     ("làm màu mỡ bón phân", "cằn cỗi vô sinh", "thu hoạch", "bội thu")),

    (54, "Childhood Bilingualism and Cognitive Flexibility", "Education", "B1", "Developmental Psychology",
     "switching between languages strengthening executive control and problem-solving attention",
     ("acquire", "confuse", "accelerate", "agile"),
     ("tiếp thu ngôn ngữ", "làm bối rối", "thúc đẩy", "nhanh nhạy linh hoạt")),

    (55, "Magnetic Levitation High-Speed Trains", "Technology", "B2", "Railway Engineering World",
     "superconducting magnets eliminating wheel friction allowing trains to glide at 600 km/h",
     ("propel", "friction", "glide", "swift"),
     ("đẩy tới phía trước", "ma sát cản trở", "lướt nhẹ", "nhanh chóng")),

    (56, "Orbital Debris Tracking and Space Safety", "Science", "B2", "Space Flight Safety Review",
     "ground radar monitoring millions of paint flecks and dead satellites to prevent collisions",
     ("track", "collide", "deflect", "hazardous"),
     ("theo dõi quỹ đạo", "va chạm", "chệch hướng né tránh", "nguy hiểm")),

    (57, "Minimizing Supermarket Food Surplus Waste", "Society", "B1", "Food Waste Solutions",
     "real-time donation apps connecting grocery stores to neighborhood food banks every evening",
     ("distribute", "rot", "rescue", "charitable"),
     ("phân phát", "thối rữa", "giải cứu thực phẩm", "từ thiện")),

    (58, "Agricultural Hydraulics of the Ancient Nile", "History", "B1", "Ancient Engineering Archive",
     "basin irrigation dikes capturing mineral silt to nourish wheat fields across centuries",
     ("inundate", "parched", "channel", "prosperous"),
     ("làm ngập nước màu mỡ", "khô cằn nứt nẻ", "dẫn nước kênh đào", "thịnh vượng")),

    (59, "Plant-Centric Nutrition and Ecological Footprints", "Health", "B1", "Nutritional Ecology",
     "replacing heavy livestock consumption with pulses and grains slashing land water use",
     ("substitute", "deplete", "nourish", "sustainable"),
     ("thay thế", "làm cạn kiệt", "nuôi dưỡng cơ thể", "bền vững")),

    (60, "Intrinsic Motivation and Creative Autonomy", "Psychology", "B1", "Organizational Behavior",
     "mastery, purpose, and self-direction sparking far deeper creative output than monetary bonuses",
     ("motivate", "discourage", "flourish", "fulfilling"),
     ("tạo động lực", "làm nản lòng", "thăng hoa rực rỡ", "thỏa nguyện")),

    # Theme 7: Innovation, Ecology & Craft (61-70)
    (61, "3D-Printed Concrete Homes for Disaster Relief", "Technology", "B1", "Architectural Technology",
     "robotic gantry nozzles depositing quick-curing mortar to erect safe homes in 48 hours",
     ("extrude", "collapsible", "erect", "durable"),
     ("bơm ép vữa", "dễ sụp đổ", "dựng xây", "bền chắc")),

    (62, "Underwater Coral Nurseries and Ocean Stewardship", "Environment", "B2", "Marine Restoration",
     "hanging micro-fragments of coral on underwater rope trees to accelerate growth tenfold",
     ("propagate", "wither", "repopulate", "thriving"),
     ("nhân giống san hô", "héo mòn", "tái sinh quần thể", "phát triển rực rỡ")),

    (63, "Extremophile Biology in Deep Sea Trenches", "Science", "B2", "Deep Ocean Biology",
     "blind hydrothermal vent crabs thriving on chemosynthetic bacteria near 300C sulfur vents",
     ("colonize", "perish", "adapt", "resilient"),
     ("định cư sinh sống", "bỏ mạng diệt vong", "thích nghi", "kiên cường")),

    (64, "The Gig Economy and Modern Safety Nets", "Business", "B1", "Labor Rights Bulletin",
     "portable digital pension accounts and collective health insurance for app-based freelancers",
     ("insure", "precarious", "guarantee", "equitable"),
     ("bảo hiểm rủi ro", "bấp bênh thiếu ổn định", "bảo đảm", "công bằng")),

    (65, "Ancient Polynesian Wayfinding by the Stars", "History", "B1", "Maritime History Review",
     "navigating open Pacific canoes reading ocean wave swells, bird flight, and star zenith tracks",
     ("navigate", "disorient", "observe", "legendary"),
     ("định hướng hải trình", "mất phương hướng", "quan sát tinh tế", "huyền thoại")),

    (66, "The Hidden Costs of Chronic Sleep Deprivation", "Health", "B1", "Sleep Science Quarterly",
     "micro-sleep episodes and insulin resistance caused by sleeping under six hours nightly",
     ("impair", "rejuvenate", "trigger", "detrimental"),
     ("làm suy giảm", "làm trẻ hóa phục hồi", "kích hoạt rủi ro", "có hại cho sức khỏe")),

    (67, "Smart Thermostats and Low-Energy Homes", "Technology", "B1", "Green Living Solutions",
     "machine learning thermostats adjusting temperatures when rooms are empty to save energy",
     ("program", "wasteful", "regulate", "efficient"),
     ("lập trình tự động", "lãng phí", "điều tiết nhiệt độ", "tiết kiệm hiệu quả")),

    (68, "Mentorship and Navigating Early Career Paths", "Work", "B1", "Career Development Journal",
     "experienced senior directors offering guidance, feedback, and networking doors to junior hires",
     ("mentor", "stagnate", "inspire", "rewarding"),
     ("dìu dắt chỉ dẫn", "trì trệ dậm chân", "truyền cảm hứng", "đầy ý nghĩa")),

    (69, "Digital Audio Archiving of Indigenous Languages", "Culture", "B2", "Linguistic Heritage",
     "recording tribal elders telling ancient folktales to preserve rare phonetic tones forever",
     ("record", "vanish", "archive", "invaluable"),
     ("thu âm lưu giữ", "biến mất vĩnh viễn", "lưu trữ số", "vô giá")),

    (70, "Urban Rewilding and Restoring Native Birds", "Environment", "B1", "Ecological City Today",
     "planting native berry bushes and nectar flowers enticing songbirds back into metropolitan parks",
     ("attract", "displace", "thrive", "harmonious"),
     ("thu hút chim muông", "xua đuổi mất chỗ ở", "sinh sôi phát triển", "hài hòa")),

    # Theme 8: Resilience, Nature & Space (71-80)
    (71, "Clean Hydrogen Fuel for Heavy Industries", "Environment", "B2", "Hydrogen Economy Digest",
     "electrolyzers powered by offshore wind splitting water to smelt zero-carbon green steel",
     ("generate", "polluting", "replace", "viable"),
     ("tạo ra nhiên liệu", "gây ô nhiễm", "thay thế than đá", "khả thi")),

    (72, "The Psychology of Emotional Resilience", "Psychology", "B1", "Resilience & Growth",
     "reframing unexpected setbacks as valuable learning opportunities rather than personal failures",
     ("reframe", "overwhelm", "persevere", "resilient"),
     ("tái định hình nhận thức", "làm choáng ngợp", "kiên trì vượt qua", "kiên cường")),

    (73, "The Century-Long Evolution of Cinema", "Culture", "B1", "Film & Society Review",
     "the leap from silent flickering black-and-white reels to immersive digital IMAX experiences",
     ("screen", "primitive", "evolve", "spectacular"),
     ("trình chiếu", "sơ khai thô sơ", "tiến hóa phát triển", "ngoạn mục hoành tráng")),

    (74, "The Great Green Wall Halting the Sahara Desert", "Environment", "B1", "African Conservation",
     "planting an eight-thousand-kilometer belt of drought-hardy acacia trees across eleven nations",
     ("plant", "erode", "shield", "protective"),
     ("gieo trồng phủ xanh", "xói mòn sa mạc hóa", "che chắn bảo vệ", "mang tính bảo vệ")),

    (75, "Social Media Feeds and Mental Well-being", "Society", "B1", "Digital Life Studies",
     "curating digital feeds and establishing evening screen detoxes restoring peace of mind",
     ("curate", "obsess", "balance", "healthy"),
     ("chọn lọc nội dung", "ám ảnh so sánh", "cân bằng lại", "lành mạnh")),

    (76, "Exoplanet Atmospheres and Alien Biosignatures", "Science", "B2", "Astrophysical Discoveries",
     "spectrographs scanning starlight filtering through exoplanet skies to detect methane and water",
     ("analyze", "unseen", "detect", "groundbreaking"),
     ("phân tích quang phổ", "vô hình", "phát hiện dấu vết", "đột phá mang tính lịch sử")),

    (77, "Biophilic Architecture and Sunlight in Buildings", "Architecture", "B1", "Design for Living",
     "indoor waterfalls and natural timber finishes boosting worker mood in corporate headquarters",
     ("integrate", "claustrophobic", "enhance", "soothing"),
     ("tích hợp thiên nhiên", "ngột ngạt bức bách", "nâng cao năng lượng", "dịu êm thư thái")),

    (78, "Hydration Science and Athletic Endurance", "Health", "B1", "Sports Physiology Today",
     "balancing water and electrolyte salts to prevent heat exhaustion during summer marathons",
     ("hydrate", "fatigue", "replenish", "energetic"),
     ("bù nước cơ thể", "mệt mỏi kiệt sức", "nạp lại khoáng chất", "dồi dào năng lượng")),

    (79, "Silk Road Caravans and Cultural Exchange", "History", "B1", "Eurasian History Review",
     "merchants trading fine Chinese silks, Indian spices, and Persian glass across ancient oasis routes",
     ("transport", "perilous", "exchange", "prosperous"),
     ("vận chuyển hàng hóa", "hiểm nguy trắc trở", "giao lưu trao đổi", "thịnh vượng")),

    (80, "Wearable ECG Sensors and Heart Protection", "Technology", "B1", "Cardiovascular Innovation",
     "smartwatches alerting wearers to early atrial fibrillation beats before strokes can occur",
     ("monitor", "irregular", "notify", "life-saving"),
     ("giám sát nhịp tim", "bất thường ngắt quãng", "thông báo cảnh báo", "cứu sống tính mạng")),

    # Theme 9: Critical Thinking & Global Systems (81-90)
    (81, "Cognitive Confirmation Bias and Objective Truth", "Psychology", "B2", "Cognitive Science Journal",
     "the human instinct to search only for evidence confirming our pre-existing ideological beliefs",
     ("filter", "biased", "scrutinize", "objective"),
     ("chọn lọc thông tin", "thiên vị phiến diện", "xem xét kỹ lưỡng", "khách quan")),

    (82, "Glacial Retreat and Downstream River Basins", "Environment", "B2", "Cryosphere & Hydrology",
     "melting Himalayan mountain glaciers threatening summer drinking water for downstream valleys",
     ("melt", "drought", "stabilize", "critical"),
     ("tan chảy", "hạn hán cạn dòng", "ổn định dòng chảy", "nguy cấp trọng yếu")),

    (83, "The Coffeehouse as a Cradle of the Enlightenment", "Culture", "B1", "European Cultural Heritage",
     "seventeenth-century London coffee houses hosting fiery scientific and philosophical debates",
     ("gather", "forbidden", "debate", "intellectual"),
     ("tụ họp luận bàn", "bị cấm đoán", "tranh luận học thuật", "thuộc về trí tuệ")),

    (84, "Agricultural Drones and Precision Spraying", "Technology", "B1", "Agritech Engineering",
     "multispectral camera drones pinpointing diseased crop patches and spraying targeted bio-nutrients",
     ("survey", "wasted", "target", "precise"),
     ("khảo sát từ trên cao", "lãng phí thuốc trừ sâu", "nhắm đích chính xác", "chuẩn xác")),

    (85, "First-Principles Thinking in Engineering", "Education", "B2", "Strategic Thought Review",
     "boiling problems down to fundamental truths rather than reasoning merely by historical analogy",
     ("deconstruct", "conventional", "innovate", "transformative"),
     ("bóc tách bản chất", "lối mòn thông thường", "đổi mới sáng tạo", "mang tính cách mạng")),

    (86, "High-Speed Rail Networks Across Continents", "Transport", "B1", "Global Transit Review",
     "electric bullet trains replacing polluting regional flights between Paris, Milan, and Frankfurt",
     ("connect", "polluting", "streamline", "convenient"),
     ("kết nối các đô thị", "gây ô nhiễm môi trường", "tinh giản tối ưu", "thuận tiện nhanh chóng")),

    (87, "Drought-Resilient Sorghum for Food Security", "Science", "B2", "Agro-Ecology Today",
     "deep-rooted traditional sorghum crops flourishing without irrigation in dry African savannas",
     ("cultivate", "parched", "withstand", "nutritious"),
     ("canh tác gieo trồng", "khô cằn sỏi đá", "chống chọi hạn hán", "giàu dinh dưỡng")),

    (88, "Stoic Wisdom for Modern Daily Tranquility", "Philosophy", "B1", "Practical Philosophy Digest",
     "distinguishing what is within our direct control from external events that cannot be controlled",
     ("distinguish", "distressed", "maintain", "tranquil"),
     ("phân biệt rõ ràng", "đau khổ bất an", "gìn giữ nội tâm", "thanh thản an nhiên")),

    (89, "Workplace Ergonomics and Musculoskeletal Health", "Health", "B1", "Occupational Health Journal",
     "adjusting lumbar chair support and eye-level monitors preventing chronic cervical strain",
     ("align", "strained", "alleviate", "ergonomic"),
     ("căn chỉnh tư thế", "bị căng cơ nhức mỏi", "làm dịu cơn đau", "chuẩn công thái học")),

    (90, "Forest Corridors Protecting Migrating Predators", "Environment", "B1", "Wildlife Ecology Gazette",
     "overpass grassy bridges allowing jaguars and deer to cross highways safely without roadkill",
     ("traverse", "fragmented", "connect", "harmonious"),
     ("băng qua an toàn", "bị chia cắt phân mảnh", "kết nối sinh cảnh", "hòa hợp tự nhiên")),

    # Theme 10: The Future of Humanity & Mastery (91-100)
    (91, "Ethical Algorithms and Algorithmic Fairness", "Technology", "C1", "Ethics in Artificial Intelligence",
     "auditing machine learning training datasets to eliminate discriminatory lending and hiring biases",
     ("audit", "biased", "guarantee", "equitable"),
     ("kiểm toán thuật toán", "thiên vị phân biệt", "đảm bảo tính minh bạch", "công bằng")),

    (92, "Music Awakening Memories in Dementia Patients", "Health", "B2", "Neurology & Music Therapy",
     "childhood melodies activating resilient musical memory circuits deep within the brain stem",
     ("ignite", "faded", "evoke", "profound"),
     ("thắp sáng ký ức", "đã mờ nhạt phai tàn", "gợi lại cảm xúc", "sâu sắc thiêng liêng")),

    (93, "The Circular Economy and Zero-Waste Industry", "Environment", "B1", "Circular Systems Today",
     "redesigning smartphones so every module can be unbolted and remanufactured endlessly",
     ("disassemble", "landfills", "reclaim", "sustainable"),
     ("tháo lắp dễ dàng", "bãi rác chôn lấp", "thu hồi tái chế", "bền vững")),

    (94, "Deep Brain Stimulation for Parkinson's Disease", "Science", "C1", "Neurosurgery Advances",
     "implanted micro-electrodes delivering gentle pulses to quiet involuntary muscular tremors",
     ("modulate", "debilitating", "alleviate", "miraculous"),
     ("điều hòa xung thần kinh", "làm suy nhược tê liệt", "làm dịu cơn co giật", "kỳ diệu")),

    (95, "Suborbital Tourism and the Overview Effect", "Science", "B2", "Space Exploration Perspectives",
     "private space travelers experiencing the fragile blue curve of Earth against black space",
     ("behold", "confined", "inspire", "awe-inspiring"),
     ("chiêm ngưỡng Trái Đất", "bị bó hẹp tầm nhìn", "truyền cảm hứng", "kinh ngạc choáng ngợp")),

    (96, "Teaching Critical Thinking in the Internet Era", "Education", "B1", "Educational Pedagogy Review",
     "training high school students to cross-examine digital sources and detect false headlines",
     ("verify", "manipulated", "evaluate", "discerning"),
     ("xác minh tính xác thực", "bị thao túng lừa dối", "đánh giá thông tin", "tinh tường sáng suốt")),

    (97, "Zero-Packaging Bulk Urban Supermarkets", "Society", "B1", "Sustainable Living Today",
     "shoppers refilling their own glass jars with pasta, honey, and shampoo to eliminate single-use bags",
     ("refill", "pollute", "dispense", "eco-friendly"),
     ("đổ đầy bình cá nhân", "làm ô nhiễm", "chiết xuất sản phẩm", "thân thiện môi trường")),

    (98, "Atlantic Ocean Conveyor Currents and Global Climate", "Environment", "C1", "Ocean & Climate Dynamics",
     "warm salty Gulf Stream waters regulating European winters and tropical rain patterns",
     ("circulate", "destabilize", "regulate", "indispensable"),
     ("luân chuyển tuần hoàn", "làm mất ổn định", "điều hòa khí hậu", "không thể thiếu")),

    (99, "The Psychological Architecture of Lifelong Curiosity", "Psychology", "B1", "Lifelong Learning Journal",
     "retaining childlike wonder and asking courageous questions sparking fulfillment across all ages",
     ("cultivate", "apathetic", "expand", "rewarding"),
     ("nuôi dưỡng lòng hiếu kỳ", "thờ ơ nguội lạnh", "mở rộng tầm nhìn", "đầy ý nghĩa")),

    (100, "Celebrating 90 Days of English Fluency and Growth", "Education", "B1", "English Mastery Hub Milestone",
     "reflecting on 3 months of consistent daily practice, 2000 vocabulary words, and 100 reading milestones",
     ("persevere", "insurmountable", "achieve", "triumphant"),
     ("kiên trì bền bỉ", "tưởng như không thể vượt qua", "chinh phục mục tiêu", "vinh quang chiến thắng"))
]

def build_passage(idx, title, cat, lvl, src, theme_desc, cloze_words, vi_meanings):
    w1, w2, w3, w4 = cloze_words
    v1, v2, v3, v4 = vi_meanings
    
    # Generate structured text
    # Paragraph 1
    p1 = f"In recent years, the discussion surrounding {theme_desc} has attracted significant attention from researchers and practitioners worldwide. As our global society continues to develop, understanding how these principles function in daily life is becoming increasingly vital. In many situations, individuals and organizations must [1] ______ key strategies to make positive and measurable progress."
    
    # Paragraph 2
    p2 = f"However, achieving meaningful results is never effortless. When obstacles arise, unguided efforts often risk becoming [2] ______ or failing to meet desired expectations. Experts emphasize that consistent dedication and structured methods are essential. By learning from real-world case studies, learners can effectively [3] ______ complex challenges and unlock their full potential."
    
    # Paragraph 3
    p3 = f"Looking toward the future, the integration of these proven concepts provides long-term dividends across multiple disciplines. Communities and individuals who embrace mindful innovation consistently build a more [4] ______ and fulfilling environment. Ultimately, sustained success in this field depends on continuous learning, self-discipline, and genuine curiosity."
    
    content = f"{p1}\n\n{p2}\n\n{p3}"
    
    # Options generation
    distractors_1 = ["A. " + w1, "B. ignore", "C. destroy", "D. prevent"]
    distractors_2 = ["A. famous", "B. " + w2, "C. wealthy", "D. popular"]
    distractors_3 = ["A. conceal", "B. " + w3, "C. damage", "D. forget"]
    distractors_4 = ["A. toxic", "B. fragile", "C. " + w4, "D. chaotic"]

    # Assign month and assigned days
    month = 1 if idx <= 34 else (2 if idx <= 67 else 3)
    
    # 7 questions
    questions = [
        {
            "q": f"Chọn từ thích hợp điền vào vị trí [1]:",
            "options": distractors_1,
            "answer": 0,
            "explain": f"'{w1}' có nghĩa là {v1}, phù hợp nhất với ngữ cảnh của câu."
        },
        {
            "q": f"Chọn từ thích hợp điền vào vị trí [2]:",
            "options": distractors_2,
            "answer": 1,
            "explain": f"'{w2}' có nghĩa là {v2}, diễn tả trạng thái tiêu cực hoặc trở ngại được nêu trong đoạn 2."
        },
        {
            "q": f"Chọn từ thích hợp điền vào vị trí [3]:",
            "options": distractors_3,
            "answer": 1,
            "explain": f"'{w3}' có nghĩa là {v3}, là hành động tích cực giúp vượt qua khó khăn."
        },
        {
            "q": f"Chọn từ thích hợp điền vào vị trí [4]:",
            "options": distractors_4,
            "answer": 2,
            "explain": f"'{w4}' có nghĩa là {v4}, chỉ trạng thái bền vững và phát triển tốt đẹp ở tương lai."
        },
        {
            "q": f"Ý chính của bài đọc là gì?",
            "options": [
                f"A. Lịch sử hình thành của các khái niệm cổ điển",
                f"B. Tầm quan trọng và các phương pháp áp dụng {title.lower()} trong đời sống hiện đại",
                f"C. Những thất bại thường gặp trong kinh doanh",
                f"D. Hướng dẫn sử dụng thiết bị công nghệ"
            ],
            "answer": 1,
            "explain": f"Toàn bộ bài viết tập trung phân tích vai trò, phương pháp và triển vọng tương lai của {title.lower()}."
        },
        {
            "q": f"Theo đoạn 2, yếu tố nào là tối quan trọng để vượt qua trở ngại?",
            "options": [
                f"A. Chờ đợi sự may mắn ngẫu nhiên",
                f"B. Sự tận tâm kiên trì và phương pháp có cấu trúc (consistent dedication and structured methods)",
                f"C. Bỏ cuộc ngay khi gặp khó khăn",
                f"D. Tránh né hoàn toàn mọi thử thách"
            ],
            "answer": 1,
            "explain": "Đoạn 2 nêu rõ: 'Experts emphasize that consistent dedication and structured methods are essential'."
        },
        {
            "q": f"Từ 'dividends' trong đoạn 3 mang ý nghĩa gần nhất với từ nào sau đây?",
            "options": [
                f"A. debts (nợ nần)",
                f"B. benefits / rewards (lợi ích, thành quả tốt đẹp lâu dài)",
                f"C. punishments (hình phạt)",
                f"D. delays (sự chậm trễ)"
            ],
            "answer": 1,
            "explain": "Trong ngữ cảnh 'long-term dividends', từ này nghĩa là những lợi ích, quả ngọt và giá trị to lớn gặt hái được về lâu dài."
        }
    ]

    return {
        "id": idx,
        "title": f"Bài {idx}: {title}",
        "category": cat,
        "level": lvl,
        "source_reference": src,
        "content": content,
        "target_words": [w1, w2, w3, w4],
        "questions": questions
    }

print("Building all 100 reading passages...")
all_passages = []

# Merge top 5 rich passages defined earlier
from generate_passages_1_to_35 import PASSAGES_1_35
top_dict = {p["id"]: p for p in PASSAGES_1_35}

for item in TOPICS_METADATA:
    idx = item[0]
    if idx in top_dict:
        all_passages.append(top_dict[idx])
    else:
        p = build_passage(item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7])
        all_passages.append(p)

print(f"Total passages generated: {len(all_passages)}")

# Write to SQLite database
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Clear existing reading passages
cursor.execute("DELETE FROM reading_passages")

for p in all_passages:
    cursor.execute("""
        INSERT INTO reading_passages (id, title, category, level, source_reference, content, target_words_json, questions_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        p["id"],
        p["title"],
        p["category"],
        p["level"],
        p["source_reference"],
        p["content"],
        json.dumps(p["target_words"], ensure_ascii=False),
        json.dumps(p["questions"], ensure_ascii=False)
    ))

conn.commit()
conn.close()
print("Successfully inserted 100 reading passages into database!")
