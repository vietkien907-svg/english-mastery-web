import sqlite3
import re

db_path = r"C:\Users\ngvu2\.gemini\antigravity\scratch\english-mastery-web\backend\app.db"
conn = sqlite3.connect(db_path)
c = conn.cursor()

# 1. Map Unit 0 items into proper thematic units with rich meanings
unit_0_mappings = {
    "classmates": {
        "unit": "Unit 1: Me & Mine (Sở hữu & Đồ vật)",
        "meaning_vi": "bạn cùng lớp, bạn học cùng trường",
        "example": "I met some of my classmates in the café.",
        "pos": "n",
        "pron": "/ˈklɑːsmeɪts/",
        "topic": "Relationships"
    },
    "get on well with": {
        "unit": "Unit 1: Me & Mine (Sở hữu & Đồ vật)",
        "meaning_vi": "hòa thuận, có mối quan hệ tốt đẹp với ai",
        "example": "I get on well with my colleagues at work.",
        "pos": "collocation",
        "pron": "/ˌɡet ɒn ˈwel wɪð/",
        "topic": "Relationships"
    },
    "leather": {
        "unit": "Unit 1: Me & Mine (Sở hữu & Đồ vật)",
        "meaning_vi": "chất liệu da thuộc / làm bằng da",
        "example": "He bought a high-quality leather jacket.",
        "pos": "n",
        "pron": "/ˈleðə/",
        "topic": "Possessions"
    },
    "get into trouble": {
        "unit": "Unit 2: Behaviour (Hành vi & Cảm xúc)",
        "meaning_vi": "gặp rắc rối, lâm vào tình cảnh khó khăn",
        "example": "Be careful or you might get into trouble.",
        "pos": "collocation",
        "pron": "/ɡet ˌɪntə ˈtrʌbəl/",
        "topic": "Behaviour"
    },
    "make a mess": {
        "unit": "Unit 2: Behaviour (Hành vi & Cảm xúc)",
        "meaning_vi": "bày bừa bộn, làm lộn xộn, bẩn thỉu",
        "example": "The children made a mess in the living room.",
        "pos": "collocation",
        "pron": "/ˌmeɪk ə ˈmes/",
        "topic": "Behaviour"
    },
    "make a mistake": {
        "unit": "Unit 2: Behaviour (Hành vi & Cảm xúc)",
        "meaning_vi": "mắc sai lầm, làm sai điều gì",
        "example": "Everyone makes a mistake once in a while.",
        "pos": "collocation",
        "pron": "/ˌmeɪk ə məˈsteɪk/",
        "topic": "Behaviour"
    },
    "make an excuse": {
        "unit": "Unit 2: Behaviour (Hành vi & Cảm xúc)",
        "meaning_vi": "viện cớ, bịa ra lý do bào chữa",
        "example": "Don't make an excuse for being late.",
        "pos": "collocation",
        "pron": "/ˌmeɪk ən ɪkˈskjuːs/",
        "topic": "Behaviour"
    },
    "have trouble": {
        "unit": "Unit 2: Behaviour (Hành vi & Cảm xúc)",
        "meaning_vi": "gặp khó khăn, trục trặc",
        "example": "She had trouble opening the heavy wooden door.",
        "pos": "collocation",
        "pron": "/ˌhəv ˈtrʌbəl/",
        "topic": "Behaviour"
    },
    "get fired": {
        "unit": "Unit 3: Working Life (Công việc & Tính cách)",
        "meaning_vi": "bị sa thải, bị đuổi việc",
        "example": "He got fired because of his poor performance.",
        "pos": "collocation",
        "pron": "/ɡet ˈfaɪəd/",
        "topic": "Work"
    },
    "full-time": {
        "unit": "Unit 3: Working Life (Công việc & Tính cách)",
        "meaning_vi": "toàn thời gian (công việc / khóa học)",
        "example": "My sister works full-time at the museum.",
        "pos": "adj",
        "pron": "/fʊl ˈtaɪm/",
        "topic": "Work"
    },
    "have a break": {
        "unit": "Unit 3: Working Life (Công việc & Tính cách)",
        "meaning_vi": "nghỉ giải lao giữa giờ",
        "example": "Let's have a break and drink some coffee.",
        "pos": "collocation",
        "pron": "/ˌhəv ə ˈbreɪk/",
        "topic": "Work"
    },
    "gave up": {
        "unit": "Unit 3: Working Life (Công việc & Tính cách)",
        "meaning_vi": "đã từ bỏ, đã bỏ cuộc",
        "example": "He gave up football because he didn't have the time to go.",
        "pos": "phr v",
        "pron": "/ɡeɪv ˈʌp/",
        "topic": "Work"
    },
    "current affairs": {
        "unit": "Unit 4: Fact or Fiction (Sự thật & Truyền thông)",
        "meaning_vi": "thời sự, các sự kiện chính trị xã hội đương thời",
        "example": "I watch news and current affairs programmes on television.",
        "pos": "n pl",
        "pron": "/ˌkʌrənt əˈfeəz/",
        "topic": "Media"
    },
    "TV series": {
        "unit": "Unit 4: Fact or Fiction (Sự thật & Truyền thông)",
        "meaning_vi": "phim truyền hình dài tập, chương trình nhiều tập",
        "example": "The new TV series starts today.",
        "pos": "n",
        "pron": "/tiː ˈviː ˌsɪəriːz/",
        "topic": "Media"
    },
    "go viral": {
        "unit": "Unit 4: Fact or Fiction (Sự thật & Truyền thông)",
        "meaning_vi": "lan truyền nhanh chóng mặt (trên mạng xã hội)",
        "example": "Their funny pet video went viral within hours.",
        "pos": "collocation",
        "pron": "/ˌɡəʊ ˈvaɪərəl/",
        "topic": "Media"
    },
    "sticking to": {
        "unit": "Unit 5: Consumer (Tiêu dùng & Mua sắm)",
        "meaning_vi": "kiên định bám sát (kế hoạch, chi tiêu tiêu dùng)",
        "example": "Sticking to your monthly shopping budget is key.",
        "pos": "phr v",
        "pron": "/ˈstɪkɪŋ tə/",
        "topic": "Consumer"
    },
    "get lost": {
        "unit": "Unit 6: Places (Đô thị & Du lịch)",
        "meaning_vi": "bị lạc đường, mất phương hướng",
        "example": "We got lost while exploring the old streets.",
        "pos": "collocation",
        "pron": "/ɡet ˈlɒst/",
        "topic": "Travel"
    },
    "go on holiday": {
        "unit": "Unit 6: Places (Đô thị & Du lịch)",
        "meaning_vi": "đi nghỉ dưỡng, đi du lịch",
        "example": "They decided to go on holiday in Spain.",
        "pos": "collocation",
        "pron": "/ˌɡəʊ ɒn ˈhɒlədi/",
        "topic": "Travel"
    },
    "made a phone call": {
        "unit": "Unit 7: Connect (Giao tiếp & Công nghệ)",
        "meaning_vi": "đã gọi một cuộc điện thoại",
        "example": "The boy made a phone call to his mother.",
        "pos": "collocation",
        "pron": "/ˌmeɪd ə ˈfəʊn kɔːl/",
        "topic": "Communication"
    },
    "downloaded": {
        "unit": "Unit 7: Connect (Giao tiếp & Công nghệ)",
        "meaning_vi": "đã tải xuống từ mạng Internet",
        "example": "The games were downloaded from the internet.",
        "pos": "v",
        "pron": "/daʊnˈləʊdɪd/",
        "topic": "Technology"
    },
    "go live": {
        "unit": "Unit 7: Connect (Giao tiếp & Công nghệ)",
        "meaning_vi": "chính thức phát sóng / trang web chính thức đi vào hoạt động",
        "example": "The streamer will go live at 8 PM tonight.",
        "pos": "collocation",
        "pron": "/ɡəʊ ˈlaɪv/",
        "topic": "Technology"
    },
    "have a good memory": {
        "unit": "Unit 8: Wisdom (Trí tuệ & Lời khuyên)",
        "meaning_vi": "có trí nhớ tốt",
        "example": "An accountant needs to have a good memory for numbers.",
        "pos": "collocation",
        "pron": "/həv ə ˌɡʊd ˈmeməri/",
        "topic": "Wisdom"
    },
    "make a plan": {
        "unit": "Unit 8: Wisdom (Trí tuệ & Lời khuyên)",
        "meaning_vi": "lập kế hoạch, lên phương án thực hiện",
        "example": "Let's make a plan before starting the project.",
        "pos": "collocation",
        "pron": "/ˌmeɪk ə ˈplæn/",
        "topic": "Wisdom"
    },
    "note down": {
        "unit": "Unit 8: Wisdom (Trí tuệ & Lời khuyên)",
        "meaning_vi": "ghi chép lại, ghi chú nhanh để nhớ",
        "example": "Note down the main points for your essay.",
        "pos": "phr v",
        "pron": "/nəʊt ˈdaʊn/",
        "topic": "Wisdom"
    },
    "have lunch": {
        "unit": "Unit 9: Sức khỏe & Chế độ ăn (Health & Diet)",
        "meaning_vi": "dùng bữa trưa",
        "example": "We usually have lunch together around noon.",
        "pos": "collocation",
        "pron": "/həv ˈlʌntʃ/",
        "topic": "Diet"
    },
    "go for dinner": {
        "unit": "Unit 10: Thực phẩm & Lối sống (Food & Lifestyle)",
        "meaning_vi": "đi ăn tối ở ngoài",
        "example": "Would you like to go for dinner this Friday?",
        "pos": "collocation",
        "pron": "/ˌɡəʊ fə ˈdɪnə/",
        "topic": "Food"
    }
}

updated_u0 = 0
for word, info in unit_0_mappings.items():
    c.execute("""
        UPDATE knowledge_items
        SET unit = ?, meaning_vi = ?, example = ?, pos = ?, pron = ?, topic = ?
        WHERE word = ? AND (unit LIKE '%Unit 0%' OR meaning_vi = '')
    """, (info["unit"], info["meaning_vi"], info["example"], info["pos"], info["pron"], info["topic"], word))
    updated_u0 += c.rowcount

print(f"Updated {updated_u0} items from Unit 0 into their thematic units!")

# 2. Update empty Vietnamese meanings for the 6 existing idioms in Unit 6
unit6_idiom_meanings = {
    "break the journey": "nghỉ chân giữa chặng đường đi, tạm dừng hành trình",
    "get into hot water": "gặp rắc rối lớn, lâm vào tình thế dầu sôi lửa bỏng",
    "living out of a suitcase": "sống nay đây mai đó, liên tục di chuyển trong vali hành lý",
    "think on my feet": "phản ứng nhanh nhạy, ứng biến linh hoạt tức thì",
    "travel light": "du lịch gọn nhẹ, chỉ mang ít đồ đạc cần thiết",
    "weather the storm": "vượt qua giai đoạn giông bão khó khăn, kiên cường vượt thử thách"
}

for word, vi in unit6_idiom_meanings.items():
    c.execute("UPDATE knowledge_items SET meaning_vi = ? WHERE word = ? AND item_type = 'idiom'", (vi, word))

print(f"Updated Vietnamese meanings for Unit 6 idioms.")

# 3. Add high-frequency thematic Collocations and Idioms for Units 1 to 8
new_curated_items = [
    # Unit 1: Me & Mine (Family, Relationships, Possessions)
    {
        "id": "ci_u1_flesh_blood",
        "word": "flesh and blood",
        "pos": "idiom",
        "pron": "/ˌfleʃ ən ˈblʌd/",
        "meaning_vi": "người máu mủ ruột thịt trong gia đình",
        "meaning_en": "someone from your family; a relative",
        "example": "I have to help him out because he is my own flesh and blood.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 1: Me & Mine (Sở hữu & Đồ vật)",
        "topic": "Relationships"
    },
    {
        "id": "ci_u1_spitting_image",
        "word": "spitting image",
        "pos": "idiom",
        "pron": "/ˌspɪtɪŋ ˈɪmɪdʒ/",
        "meaning_vi": "bản sao giống hệt ai đó (về ngoại hình)",
        "meaning_en": "looking extremely similar to someone else",
        "example": "He is the spitting image of his grandfather when he was young.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 1: Me & Mine (Sở hữu & Đồ vật)",
        "topic": "Family"
    },
    {
        "id": "ci_u1_close_knit",
        "word": "close-knit family",
        "pos": "collocation",
        "pron": "/ˌkləʊs nɪt ˈfæməli/",
        "meaning_vi": "gia đình gắn kết bền chặt, yêu thương nhau",
        "meaning_en": "a family where members have strong, loving relationships",
        "example": "We grew up in a very close-knit family where everyone helped each other.",
        "level": "B2",
        "item_type": "collocation",
        "unit": "Unit 1: Me & Mine (Sở hữu & Đồ vật)",
        "topic": "Family"
    },

    # Unit 2: Behaviour (Hành vi & Cảm xúc)
    {
        "id": "ci_u2_fly_handle",
        "word": "fly off the handle",
        "pos": "idiom",
        "pron": "/ˌflaɪ ɒf ðə ˈhændəl/",
        "meaning_vi": "nổi trận lôi đình, mất bình tĩnh đột ngột",
        "meaning_en": "to suddenly become very angry",
        "example": "He tends to fly off the handle whenever someone criticizes his ideas.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 2: Behaviour (Hành vi & Cảm xúc)",
        "topic": "Behaviour"
    },
    {
        "id": "ci_u2_see_eye_eye",
        "word": "see eye to eye",
        "pos": "idiom",
        "pron": "/siː ˌaɪ tu ˈaɪ/",
        "meaning_vi": "đồng quan điểm, cùng nhìn nhận một hướng",
        "meaning_en": "to agree with each other fully",
        "example": "My father and I rarely see eye to eye on politics.",
        "level": "B1",
        "item_type": "idiom",
        "unit": "Unit 2: Behaviour (Hành vi & Cảm xúc)",
        "topic": "Behaviour"
    },
    {
        "id": "ci_u2_keep_cool",
        "word": "keep one's cool",
        "pos": "idiom",
        "pron": "/kiːp wʌnz ˈkuːl/",
        "meaning_vi": "giữ được bình tĩnh, kiềm chế cảm xúc",
        "meaning_en": "to stay calm in a difficult or stressful situation",
        "example": "It is essential to keep your cool during the job interview.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 2: Behaviour (Hành vi & Cảm xúc)",
        "topic": "Behaviour"
    },

    # Unit 3: Working Life (Công việc & Tính cách)
    {
        "id": "ci_u3_burn_midnight_oil",
        "word": "burn the midnight oil",
        "pos": "idiom",
        "pron": "/bɜːn ðə ˌmɪdnaɪt ˈɔɪl/",
        "meaning_vi": "thức khuya làm việc hoặc học tập cật lực",
        "meaning_en": "to work or study late into the night",
        "example": "She had to burn the midnight oil to prepare the annual financial report.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 3: Working Life (Công việc & Tính cách)",
        "topic": "Work"
    },
    {
        "id": "ci_u3_learn_ropes",
        "word": "learn the ropes",
        "pos": "idiom",
        "pron": "/ˌlɜːn ðə ˈrəʊps/",
        "meaning_vi": "học hỏi để nắm vững công việc mới",
        "meaning_en": "to learn how to do a particular job correctly",
        "example": "It will take a few weeks for the new assistant to learn the ropes.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 3: Working Life (Công việc & Tính cách)",
        "topic": "Work"
    },
    {
        "id": "ci_u3_call_it_day",
        "word": "call it a day",
        "pos": "idiom",
        "pron": "/ˌkɔːl ɪt ə ˈdeɪ/",
        "meaning_vi": "kết thúc một ngày làm việc, nghỉ tay",
        "meaning_en": "to stop what you are doing because you have done enough",
        "example": "We've made good progress today, so let's call it a day.",
        "level": "B1",
        "item_type": "idiom",
        "unit": "Unit 3: Working Life (Công việc & Tính cách)",
        "topic": "Work"
    },
    {
        "id": "ci_u3_climb_ladder",
        "word": "climb the career ladder",
        "pos": "collocation",
        "pron": "/klaɪm ðə kəˈrɪə ˌlædə/",
        "meaning_vi": "thăng tiến trên nấc thang sự nghiệp",
        "meaning_en": "to make rapid progress in your professional career",
        "example": "Ambition and dedication helped him climb the career ladder quickly.",
        "level": "B2",
        "item_type": "collocation",
        "unit": "Unit 3: Working Life (Công việc & Tính cách)",
        "topic": "Work"
    },

    # Unit 4: Fact or Fiction (Sự thật & Truyền thông)
    {
        "id": "ci_u4_grain_salt",
        "word": "take something with a grain of salt",
        "pos": "idiom",
        "pron": "/teɪk ... wɪð ə ˌɡreɪn əv ˈsɔːlt/",
        "meaning_vi": "tiếp nhận thông tin một cách thận trọng, nửa tin nửa ngờ",
        "meaning_en": "to not completely believe what you are told",
        "example": "You should take online rumors with a grain of salt until verified.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 4: Fact or Fiction (Sự thật & Truyền thông)",
        "topic": "Media"
    },
    {
        "id": "ci_u4_horses_mouth",
        "word": "straight from the horse's mouth",
        "pos": "idiom",
        "pron": "/streɪt frəm ðə ˌhɔːsɪz ˈmaʊθ/",
        "meaning_vi": "nghe trực tiếp từ nguồn đáng tin cậy nhất",
        "meaning_en": "from the person who has direct, authentic knowledge",
        "example": "I know the project is approved because I heard it straight from the horse's mouth.",
        "level": "C1",
        "item_type": "idiom",
        "unit": "Unit 4: Fact or Fiction (Sự thật & Truyền thông)",
        "topic": "Media"
    },
    {
        "id": "ci_u4_spill_beans",
        "word": "spill the beans",
        "pos": "idiom",
        "pron": "/spɪl ðə ˈbiːnz/",
        "meaning_vi": "lỡ miệng để lộ bí mật",
        "meaning_en": "to tell people secret information too soon",
        "example": "We planned a surprise birthday party, but her sister spilled the beans.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 4: Fact or Fiction (Sự thật & Truyền thông)",
        "topic": "Media"
    },

    # Unit 5: Consumer (Tiêu dùng & Mua sắm)
    {
        "id": "ci_u5_cost_arm_leg",
        "word": "cost an arm and a leg",
        "pos": "idiom",
        "pron": "/kɒst ən ˌɑːm ən ə ˈleɡ/",
        "meaning_vi": "cực kỳ đắt đỏ, tốn kém tiền bạc",
        "meaning_en": "to be very expensive",
        "example": "Buying genuine designer clothes can cost an arm and a leg.",
        "level": "B1",
        "item_type": "idiom",
        "unit": "Unit 5: Consumer (Tiêu dùng & Mua sắm)",
        "topic": "Consumer"
    },
    {
        "id": "ci_u5_tighten_belt",
        "word": "tighten one's belt",
        "pos": "idiom",
        "pron": "/ˌtaɪtn wʌnz ˈbelt/",
        "meaning_vi": "thắt lưng buộc bụng, tiết kiệm chi tiêu",
        "meaning_en": "to spend less money because you have less available",
        "example": "During inflation, families have to tighten their belts and cut luxury spending.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 5: Consumer (Tiêu dùng & Mua sắm)",
        "topic": "Consumer"
    },
    {
        "id": "ci_u5_window_shopping",
        "word": "window shopping",
        "pos": "collocation",
        "pron": "/ˈwɪndəʊ ˌʃɒpɪŋ/",
        "meaning_vi": "đi dạo ngắm hàng hóa mà không mua",
        "meaning_en": "the activity of looking at goods in shop windows without intending to buy",
        "example": "We spent Sunday afternoon window shopping around the central mall.",
        "level": "B1",
        "item_type": "collocation",
        "unit": "Unit 5: Consumer (Tiêu dùng & Mua sắm)",
        "topic": "Consumer"
    },

    # Unit 6: Places (Đô thị & Du lịch)
    {
        "id": "ci_u6_hit_road",
        "word": "hit the road",
        "pos": "idiom",
        "pron": "/ˌhɪt ðə ˈrəʊd/",
        "meaning_vi": "khởi hành, lên đường đi du lịch",
        "meaning_en": "to begin a journey or trip",
        "example": "We packed our bags early so we could hit the road at dawn.",
        "level": "B1",
        "item_type": "idiom",
        "unit": "Unit 6: Places (Đô thị & Du lịch)",
        "topic": "Travel"
    },
    {
        "id": "ci_u6_off_beaten_track",
        "word": "off the beaten track",
        "pos": "idiom",
        "pron": "/ˌɒf ðə biːtn ˈtræk/",
        "meaning_vi": "nơi hẻo lánh, xa lạ ít người lui tới",
        "meaning_en": "far away from other people, houses, or tourist destinations",
        "example": "They preferred staying in quiet villages off the beaten track.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 6: Places (Đô thị & Du lịch)",
        "topic": "Travel"
    },

    # Unit 7: Connect (Giao tiếp & Công nghệ)
    {
        "id": "ci_u7_keep_in_touch",
        "word": "keep in touch",
        "pos": "idiom",
        "pron": "/kiːp ɪn ˈtʌtʃ/",
        "meaning_vi": "giữ liên lạc với nhau",
        "meaning_en": "to continue to communicate with someone",
        "example": "We use messaging apps to keep in touch with friends abroad.",
        "level": "B1",
        "item_type": "idiom",
        "unit": "Unit 7: Connect (Giao tiếp & Công nghệ)",
        "topic": "Communication"
    },
    {
        "id": "ci_u7_same_wavelength",
        "word": "be on the same wavelength",
        "pos": "idiom",
        "pron": "/biː ɒn ðə ˌseɪm ˈweɪvleŋθ/",
        "meaning_vi": "cùng tần số, rất thấu hiểu và ăn ý với nhau",
        "meaning_en": "to think in a similar way and understand each other easily",
        "example": "It's wonderful to work with colleagues who are on the same wavelength.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 7: Connect (Giao tiếp & Công nghệ)",
        "topic": "Communication"
    },
    {
        "id": "ci_u7_break_the_ice",
        "word": "break the ice",
        "pos": "idiom",
        "pron": "/ˌbreɪk ði ˈaɪs/",
        "meaning_vi": "phá vỡ bầu không khí ngượng ngùng lúc ban đầu",
        "meaning_en": "to make people feel more relaxed and comfortable in a social setting",
        "example": "Playing a short group game helped break the ice at the workshop.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 7: Connect (Giao tiếp & Công nghệ)",
        "topic": "Communication"
    },

    # Unit 8: Wisdom (Trí tuệ & Lời khuyên)
    {
        "id": "ci_u8_food_for_thought",
        "word": "food for thought",
        "pos": "idiom",
        "pron": "/ˌfuːd fə ˈθɔːt/",
        "meaning_vi": "điều đáng để suy ngẫm sâu sắc",
        "meaning_en": "something that makes you think carefully about something",
        "example": "The professor's lecture provided plenty of food for thought.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 8: Wisdom (Trí tuệ & Lời khuyên)",
        "topic": "Wisdom"
    },
    {
        "id": "ci_u8_rack_brain",
        "word": "rack one's brain",
        "pos": "idiom",
        "pron": "/ræk wʌnz ˈbreɪn/",
        "meaning_vi": "vắt óc suy nghĩ để tìm câu trả lời",
        "meaning_en": "to think very hard about something, often to find an answer or solution",
        "example": "I racked my brain trying to remember where I had left my keys.",
        "level": "B2",
        "item_type": "idiom",
        "unit": "Unit 8: Wisdom (Trí tuệ & Lời khuyên)",
        "topic": "Wisdom"
    },
    {
        "id": "ci_u8_make_wise_decision",
        "word": "make a wise decision",
        "pos": "collocation",
        "pron": "/meɪk ə waɪz dɪˈsɪʒən/",
        "meaning_vi": "đưa ra một quyết định sáng suốt và khôn ngoan",
        "meaning_en": "to choose an option showing good judgment and intelligence",
        "example": "Seeking expert advice will help you make a wise decision for your future.",
        "level": "B2",
        "item_type": "collocation",
        "unit": "Unit 8: Wisdom (Trí tuệ & Lời khuyên)",
        "topic": "Wisdom"
    }
]

added_count = 0
for item in new_curated_items:
    # Check if exists
    c.execute("SELECT id FROM knowledge_items WHERE word = ?", (item["word"],))
    row = c.fetchone()
    if not row:
        c.execute("""
            INSERT INTO knowledge_items (id, word, pos, pron, meaning_vi, meaning_en, example, level, item_type, unit, topic, status, is_custom)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', 0)
        """, (
            item["id"],
            item["word"],
            item["pos"],
            item["pron"],
            item["meaning_vi"],
            item["meaning_en"],
            item["example"],
            item["level"],
            item["item_type"],
            item["unit"],
            item["topic"]
        ))
        added_count += 1
    else:
        # Update existing
        c.execute("""
            UPDATE knowledge_items
            SET unit = ?, meaning_vi = ?, meaning_en = ?, example = ?, pos = ?, pron = ?, item_type = ?, level = ?
            WHERE word = ?
        """, (
            item["unit"], item["meaning_vi"], item["meaning_en"], item["example"], item["pos"], item["pron"], item["item_type"], item["level"], item["word"]
        ))

conn.commit()
print(f"Added {added_count} brand new idioms & collocations directly into Units 1 to 8!")

# Check if Unit 0 still has any items
c.execute("SELECT count(*) FROM knowledge_items WHERE unit LIKE '%Unit 0%'")
remaining_u0 = c.fetchone()[0]
print(f"Remaining items in Unit 0: {remaining_u0}")

conn.close()
