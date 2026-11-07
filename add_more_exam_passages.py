# add_more_exam_passages.py
import sqlite3
import json

DB_PATH = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\backend\app.db"

MORE_PASSAGES = [
    {
        "title": "[IELTS] Ocean Acidification & Marine Calcification Under Climate Stress",
        "category": "IELTS",
        "level": "Band 7.5+",
        "source_reference": "IELTS Academic Marine Biology & Climate Anthology",
        "content": """The world's oceans have historically functioned as Earth's paramount carbon buffer, absorbing roughly thirty percent of anthropogenic carbon dioxide emissions generated since the dawn of the Industrial Revolution. While this oceanic uptake has substantially attenuated atmospheric warming, it has wrought profound chemical repercussions termed 'ocean acidification'.

When carbon dioxide dissolves in seawater, it forms carbonic acid, which dissociates into hydrogen ions and bicarbonate. The surge in hydrogen ions reacts with ambient carbonate ions, drastically reducing the concentration of carbonate available for marine calcifiers. Organisms such as stony corals, pteropods (pelagic sea snails), and bivalves rely on carbonate ions combined with calcium to precipitate calcium carbonate shells and skeletal matrices.

Marine biologists caution that pteropods, colloquially termed 'sea butterflies', represent keystone bio-indicators. Experimental exposure of pteropod shells to seawater mimicking projected 2100 carbonate chemistry revealed substantial structural dissolution within forty-eight hours. Because pteropods constitute the nutritional cornerstone for salmon, herring, and baleen whales, their potential population collapse threatens catastrophic trophic cascades across pelagic food webs.

Addressing ocean acidification demands aggressive global decarbonization coupled with targeted localized interventions, such as cultivating kelp forests and eelgrass meadows, which actively sequester dissolved carbon and create localized chemical refugia for vulnerable shell-building fauna.""",
        "target_words": ["carbon buffer", "anthropogenic emissions", "ocean acidification", "carbonic acid", "marine calcifiers", "calcium carbonate", "trophic cascades", "chemical refugia"],
        "questions": [
            {
                "question": "What primary chemical mechanism leads to ocean acidification?",
                "options": [
                    "A. Plastic debris floating on the surface of the sea",
                    "B. Dissolved anthropogenic carbon dioxide reacting to form carbonic acid and hydrogen ions",
                    "C. Excessive salt extraction by coastal factories",
                    "D. Radioactive runoff from submarine vessels"
                ],
                "answer": "B",
                "explain": "Đoạn 2 chỉ ra: 'When carbon dioxide dissolves in seawater, it forms carbonic acid, which dissociates into hydrogen ions and bicarbonate...'"
            },
            {
                "question": "Why are pteropods considered critical keystone organisms?",
                "options": [
                    "A. They are the primary food source for large marine species like salmon and whales",
                    "B. They build the largest coral reefs in the Pacific",
                    "C. They generate electricity on the seafloor",
                    "D. They filter commercial fishing nets"
                ],
                "answer": "A",
                "explain": "Đoạn 3 giải thích: 'Because pteropods constitute the nutritional cornerstone for salmon, herring, and baleen whales...'"
            },
            {
                "question": "How can kelp forests and eelgrass help combat localized acidification?",
                "options": [
                    "A. By warming the sea temperature",
                    "B. By actively sequestering dissolved carbon and creating chemical refugia",
                    "C. By blocking sunlight from reaching the seabed",
                    "D. By poisoning marine predators"
                ],
                "answer": "B",
                "explain": "Đoạn cuối nêu rõ: 'cultivating kelp forests and eelgrass meadows, which actively sequester dissolved carbon and create localized chemical refugia'."
            }
        ]
    },
    {
        "title": "[VSTEP C1] Energy Transition and Offshore Wind Potential in Coastal Vietnam",
        "category": "VSTEP",
        "level": "C1",
        "source_reference": "VSTEP C1 Advanced Policy & Technology Reading",
        "content": """Boasting a dramatic coastline stretching over 3,260 kilometers, Vietnam is exceptionally endowed with some of the most robust offshore wind energy resources in Southeast Asia. With average wind speeds exceeding nine meters per second in the southern coastal provinces of Ninh Thuan and Binh Thuan, the nation possesses technical wind potential estimated at hundreds of gigawatts.

Under the National Power Development Plan VIII (PDP8), the Vietnamese government has committed to phasing out unabated coal generation and quadrupling renewable energy capacity by 2045, aiming for net-zero carbon emissions by 2050. Offshore wind turbines offer superior capacity factors compared to onshore alternatives, generating clean electricity continuously without competing for precious arable land.

Nonetheless, transitioning from fossil fuel dependency to an offshore wind power requires overcoming formidable engineering and institutional hurdles. Subsea geological conditions in typhoon-prone zones necessitate resilient foundation designs capable of withstanding turbulent monsoons. Furthermore, Vietnam's domestic electrical transmission grid requires substantial high-voltage direct current (HVDC) upgrades to transmit bulk offshore generation from southern coastal waters to northern industrial demand centers.

By creating transparent regulatory frameworks for Power Purchase Agreements (PPAs) and fostering domestic engineering supply chains, Vietnam can establish itself as a vanguard of clean energy manufacturing and sustainable decarbonization in the Asia-Pacific region.""",
        "target_words": ["offshore wind energy", "robust wind resources", "Power Development Plan", "net-zero carbon emissions", "capacity factors", "subsea geological conditions", "transmission grid", "Power Purchase Agreements"],
        "questions": [
            {
                "question": "What makes Vietnam particularly well-suited for offshore wind development?",
                "options": [
                    "A. Abundant flat desert lands with no rainfall",
                    "B. Over 3,260 km of coastline with high average wind speeds exceeding 9 m/s",
                    "C. Total absence of seasonal storms and typhoons",
                    "D. Existing nuclear power plants on every island"
                ],
                "answer": "B",
                "explain": "Đoạn 1 nêu: 'Boasting a dramatic coastline stretching over 3,260 kilometers... wind speeds exceeding nine meters per second'."
            },
            {
                "question": "What is one major technological challenge mentioned regarding offshore wind turbines?",
                "options": [
                    "A. Lack of wind in southern coastal provinces",
                    "B. Engineering foundation designs to withstand severe typhoons and monsoons",
                    "C. Solar panels overheating on the sea",
                    "D. Complete lack of ocean water"
                ],
                "answer": "B",
                "explain": "Đoạn 3 phân tích: 'Subsea geological conditions in typhoon-prone zones necessitate resilient foundation designs capable of withstanding turbulent monsoons'."
            },
            {
                "question": "Why is grid infrastructure modernization essential for Vietnam's energy transition?",
                "options": [
                    "A. To transport electricity generated in southern waters to northern manufacturing hubs",
                    "B. To export all electricity exclusively to Europe",
                    "C. To prevent consumers from turning on household appliances",
                    "D. To replace high-voltage lines with wooden poles"
                ],
                "answer": "A",
                "explain": "Đoạn 3 chỉ ra: 'requires substantial high-voltage direct current (HVDC) upgrades to transmit bulk offshore generation from southern coastal waters to northern industrial demand centers'."
            }
        ]
    },
    {
        "title": "[TOEIC Part 7] Nexis Consumer Electronics - Global Product Recall Bulletin",
        "category": "TOEIC",
        "level": "700+",
        "source_reference": "TOEIC Part 7 Product Safety & Customer Assurance Announcement",
        "content": """PRODUCT SAFETY RECALL & REMEDY BULLETIN
Issued: November 4, 2026
Product Line: Nexis PowerMax 65W GaN Travel Chargers (Model #NX-6500-G)
Distribution Dates: March 15, 2026 – October 20, 2026

Dear Valued Customers and Retail Partners,

In voluntary cooperation with international consumer product safety commissions, Nexis Electronics Corporation is executing an immediate worldwide safety recall of the Nexis PowerMax 65W GaN Travel Fast Charger.

Reason for Recall:
Internal quality assurance testing identified that an isolated batch of internal thermal cut-off capacitors manufactured between March and July 2026 may experience electrical overheating when operating under prolonged maximum load in high ambient humidity. Although zero property damage or injury incidents have been reported, Nexis has proactively halted production of the affected batch.

Remedy & Replacement Options:
Consumers owning an affected unit should immediately unplug the charger from wall outlets and verify the 10-digit serial number on the underside prongs against our online recall portal at www.nexis-safety.com/verify. 

Affected customers are eligible for one of the following complimentary remedies:
1. Free Replacement: A complimentary upgraded Nexis PowerMax 70W Pro charger shipped via priority air courier (estimated delivery: 2-3 business days).
2. Full Cash Refund: A digital prepaid Mastercard refund for the full retail purchase amount of $59.99 upon barcode submission.
3. In addition, all participating consumers will receive a $15 discount voucher valid on any accessory at Nexis Authorized Retailers through December 31, 2026.

We deeply apologize for this inconvenience and remain steadfast in our dedication to product safety and engineering excellence.""",
        "target_words": ["product safety recall", "thermal cut-off capacitors", "electrical overheating", "proactively halted", "complimentary remedies", "prepaid Mastercard", "discount voucher", "retail purchase"],
        "questions": [
            {
                "question": "What is the reason behind Nexis Corporation's voluntary product recall?",
                "options": [
                    "A. The charger does not fit into standard wall sockets",
                    "B. An internal capacitor batch may overheat under sustained heavy load in humid conditions",
                    "C. The color of the plastic case fades over time",
                    "D. The company went bankrupt and is stopping all operations"
                ],
                "answer": "B",
                "explain": "Mục Reason for Recall nêu rõ: 'internal thermal cut-off capacitors... may experience electrical overheating when operating under prolonged maximum load in high ambient humidity'."
            },
            {
                "question": "How can consumers determine if their charger is part of the recall?",
                "options": [
                    "A. By mailing the entire device to corporate headquarters in New York",
                    "B. By checking the 10-digit serial number on the prongs via the online recall portal",
                    "C. By bringing the device to an electronics repair shop",
                    "D. By attempting to submerge the charger in water"
                ],
                "answer": "B",
                "explain": "Đoạn Remedy nêu rõ: 'verify the 10-digit serial number on the underside prongs against our online recall portal at www.nexis-safety.com/verify'."
            },
            {
                "question": "What additional perk is given to all customers participating in the recall?",
                "options": [
                    "A. A new laptop computer",
                    "B. A $15 store discount voucher valid until the end of 2026",
                    "C. Free round-trip airline tickets",
                    "D. Lifetime free electricity"
                ],
                "answer": "B",
                "explain": "Mục 3 ghi: 'In addition, all participating consumers will receive a $15 discount voucher valid on any accessory at Nexis Authorized Retailers through December 31, 2026'."
            }
        ]
    },
    {
        "title": "[APTIS] Urban Micro-Mobility: Solving the First-Mile Transit Dilemma",
        "category": "APTIS",
        "level": "B2",
        "source_reference": "Aptis Advanced Urban Planning Reading",
        "content": """In modern urban planning, the 'first-mile, last-mile' dilemma refers to the critical gap between a commuter's doorstep and the nearest mass transit station. When metro stations are situated beyond comfortable walking distance—typically greater than eight hundred meters—urban residents frequently revert to private automobiles or ride-hailing services, exacerbating gridlock and tailpipe emissions.

To bridge this gap, shared electric scooters and dockless bicycles have swept across hundreds of global metropolitan centers over the past decade. Proponents point out that lightweight micro-mobility vehicles consume less than three percent of the energy required by a single-passenger automobile to traverse the identical distance. Furthermore, smartphone app integration and geofenced speed controls enable swift, frictionless point-to-point transit.

However, micro-mobility has also ignited contentious municipal debates. Indiscriminately discarded scooters clutter pedestrian walkways, creating hazardous physical barriers for elderly citizens and visually impaired pedestrians. In response, cities such as Paris, Amsterdam, and Singapore have enacted stringent regulatory frameworks: mandating designated geo-fenced parking corrals, capping fleet sizes, and enforcing computerized fines for sidewalk riding.

When effectively integrated with dedicated bike lane infrastructure and synchronized transit ticketing, micro-mobility transforms congested urban streets into vibrant, human-scale corridors.""",
        "target_words": ["last-mile dilemma", "mass transit station", "tailpipe emissions", "micro-mobility", "dockless bicycles", "geofenced speed controls", "designated parking corrals", "human-scale corridors"],
        "questions": [
            {
                "question": "What is the 'first-mile, last-mile' dilemma in urban transportation?",
                "options": [
                    "A. The cost of manufacturing electric vehicle batteries",
                    "B. The distance gap between a commuter's home and the closest mass transit hub",
                    "C. The speed limit enforced on national highways",
                    "D. The schedule of international airline flights"
                ],
                "answer": "B",
                "explain": "Đoạn 1 định nghĩa: 'the critical gap between a commuter's doorstep and the nearest mass transit station'."
            },
            {
                "question": "Why do environmentalists champion electric micro-mobility?",
                "options": [
                    "A. Because electric scooters consume less than 3% of the energy of an automobile over the same distance",
                    "B. Because scooters can fly over heavy traffic jams",
                    "C. Because they do not require any batteries or charging",
                    "D. Because they travel faster than high-speed trains"
                ],
                "answer": "A",
                "explain": "Đoạn 2 nêu rõ: 'lightweight micro-mobility vehicles consume less than three percent of the energy required by a single-passenger automobile to traverse the identical distance'."
            },
            {
                "question": "What measure have cities like Paris and Singapore taken to resolve scooter sidewalk clutter?",
                "options": [
                    "A. Banning all pedestrians from walking outside",
                    "B. Implementing designated geofenced parking bays and enforcing fines",
                    "C. Building elevated highways exclusively for scooters",
                    "D. Removing all sidewalks from cities"
                ],
                "answer": "B",
                "explain": "Đoạn 3 giải thích: 'mandating designated geo-fenced parking corrals, capping fleet sizes, and enforcing computerized fines for sidewalk riding'."
            }
        ]
    }
]

def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT title FROM reading_passages")
    existing = set(row[0] for row in cursor.fetchall())
    
    added = 0
    for p in MORE_PASSAGES:
        if p["title"] in existing:
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
        added += 1
        print(f"Added [{p['category']}] {p['title']}")
        
    conn.commit()
    conn.close()
    print(f"Added {added} more passages successfully!")

if __name__ == "__main__":
    main()
