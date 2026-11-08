// ============================================================================
// READING LEXICON DICTIONARY (PHÂN TÍCH TỪ VỰNG KHI CHỌN SAI & FLASHCARD)
// ============================================================================
const READING_WORDS_LEXICON = {
  "invaluable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/invaluable/",
    "meaning_vi": "nghĩa trong bài đọc (invaluable)",
    "example": "Example context: invaluable in reading passage."
  },
  "bountiful": {
    "pos": "Từ vựng (Word)",
    "ipa": "/bountiful/",
    "meaning_vi": "nghĩa trong bài đọc (bountiful)",
    "example": "Example context: bountiful in reading passage."
  },
  "fatigue": {
    "pos": "Danh từ (Noun)",
    "ipa": "/fəˈtiːɡ/",
    "meaning_vi": "sự mệt mỏi",
    "example": "Example context with Fatigue."
  },
  "spark": {
    "pos": "Từ vựng (Word)",
    "ipa": "/spark/",
    "meaning_vi": "nghĩa trong bài đọc (spark)",
    "example": "Example context: spark in reading passage."
  },
  "exhausted": {
    "pos": "a",
    "ipa": "/ɪɡˈzɔːstɪd/",
    "meaning_vi": "kiệt sức",
    "example": "Example context with Exhausted."
  },
  "cultivate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/cultivate/",
    "meaning_vi": "nghĩa trong bài đọc (cultivate)",
    "example": "Example context: cultivate in reading passage."
  },
  "alleviate": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈliːvieɪt/",
    "meaning_vi": "làm giảm bớt, xoa dịu (nỗi đau, áp lực, nghèo đói)",
    "example": "Regular physical exercise alleviates mental stress."
  },
  "selling": {
    "pos": "Từ vựng (Word)",
    "ipa": "/selling/",
    "meaning_vi": "nghĩa trong bài đọc (selling)",
    "example": "Example context: selling in reading passage."
  },
  "do nước biển ấm lên khiến san hô đào thải vi tảo quang hợp": {
    "pos": "Từ vựng (Word)",
    "ipa": "/do nước biển ấm lên khiến san hô đào thải vi tảo quang hợp/",
    "meaning_vi": "nghĩa trong bài đọc (do nước biển ấm lên khiến san hô đào thải vi tảo quang hợp)",
    "example": "Example context: do nước biển ấm lên khiến san hô đào thải vi tảo quang hợp in reading passage."
  },
  "inundate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/inundate/",
    "meaning_vi": "nghĩa trong bài đọc (inundate)",
    "example": "Example context: inundate in reading passage."
  },
  "precarious": {
    "pos": "Từ vựng (Word)",
    "ipa": "/precarious/",
    "meaning_vi": "nghĩa trong bài đọc (precarious)",
    "example": "Example context: precarious in reading passage."
  },
  "insurmountable": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˌɪnsərˈmaʊntəbl/",
    "meaning_vi": "không thể vượt qua, quá lớn không khắc phục được",
    "example": "The financial barriers seemed insurmountable at first."
  },
  "broadcast": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈbrɔːdkæst/",
    "meaning_vi": "phát sóng",
    "example": ""
  },
  "sự quên lãng hoàn toàn": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sự quên lãng hoàn toàn/",
    "meaning_vi": "nghĩa trong bài đọc (sự quên lãng hoàn toàn)",
    "example": "Example context: sự quên lãng hoàn toàn in reading passage."
  },
  "sự xáo trộn": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sự xáo trộn/",
    "meaning_vi": "nghĩa trong bài đọc (sự xáo trộn)",
    "example": "Example context: sự xáo trộn in reading passage."
  },
  "flexible": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈfleksəbəl/",
    "meaning_vi": "linh hoạt (có thể thay đổi hoặc dễ dàng thay đổi để phù hợp với mọi tình huống mới)",
    "example": "We can be flexible about when you start."
  },
  "unveil": {
    "pos": "Từ vựng (Word)",
    "ipa": "/unveil/",
    "meaning_vi": "nghĩa trong bài đọc (unveil)",
    "example": "Example context: unveil in reading passage."
  },
  "evolve": {
    "pos": "Từ vựng (Word)",
    "ipa": "/evolve/",
    "meaning_vi": "nghĩa trong bài đọc (evolve)",
    "example": "Example context: evolve in reading passage."
  },
  "interact": {
    "pos": "Từ vựng (Word)",
    "ipa": "/interact/",
    "meaning_vi": "nghĩa trong bài đọc (interact)",
    "example": "Example context: interact in reading passage."
  },
  "plastic": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈplæstɪk/",
    "meaning_vi": "nhựa (một vật liệu hóa học mạnh nhẹ có thể mềm có thể tạo thành nhiều hình dạng khác nhau)",
    "example": "Pollution from plastic is causing serious problems in the oceans."
  },
  "detrimental": {
    "pos": "Từ vựng (Word)",
    "ipa": "/detrimental/",
    "meaning_vi": "nghĩa trong bài đọc (detrimental)",
    "example": "Example context: detrimental in reading passage."
  },
  "valuable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/valuable/",
    "meaning_vi": "nghĩa trong bài đọc (valuable)",
    "example": "Example context: valuable in reading passage."
  },
  "deceive": {
    "pos": "Động từ (Verb)",
    "ipa": "/dɪˈsiːv/",
    "meaning_vi": "lừa dối (che giấu sự thật về cách bạn sống cuộc sống của mình)",
    "example": "She didn't mean to deceive them, she just didn't want to tell them about her problem."
  },
  "hesitate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hesitate/",
    "meaning_vi": "nghĩa trong bài đọc (hesitate)",
    "example": "Example context: hesitate in reading passage."
  },
  "vanish": {
    "pos": "Từ vựng (Word)",
    "ipa": "/vanish/",
    "meaning_vi": "nghĩa trong bài đọc (vanish)",
    "example": "Example context: vanish in reading passage."
  },
  "chạy bằng xăng sinh học": {
    "pos": "Từ vựng (Word)",
    "ipa": "/chạy bằng xăng sinh học/",
    "meaning_vi": "nghĩa trong bài đọc (chạy bằng xăng sinh học)",
    "example": "Example context: chạy bằng xăng sinh học in reading passage."
  },
  "collaboration / harmonious cooperation (sự cộng hưởng hợp tác)": {
    "pos": "Từ vựng (Word)",
    "ipa": "/collaboration / harmonious cooperation (sự cộng hưởng hợp tác)/",
    "meaning_vi": "nghĩa trong bài đọc (collaboration / harmonious cooperation (sự cộng hưởng hợp tác))",
    "example": "Example context: collaboration / harmonious cooperation (sự cộng hưởng hợp tác) in reading passage."
  },
  "exponentially": {
    "pos": "Từ vựng (Word)",
    "ipa": "/exponentially/",
    "meaning_vi": "nghĩa trong bài đọc (exponentially)",
    "example": "Example context: exponentially in reading passage."
  },
  "perilous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/perilous/",
    "meaning_vi": "nghĩa trong bài đọc (perilous)",
    "example": "Example context: perilous in reading passage."
  },
  "punishments (hình phạt)": {
    "pos": "Từ vựng (Word)",
    "ipa": "/punishments (hình phạt)/",
    "meaning_vi": "nghĩa trong bài đọc (punishments (hình phạt))",
    "example": "Example context: punishments (hình phạt) in reading passage."
  },
  "borrow": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈbɑːroʊ/",
    "meaning_vi": "vay, mượn (đồ vật, tiền bạc)",
    "example": "Can I borrow your reference book for the exam?"
  },
  "hoàn toàn phản đối và lo sợ": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hoàn toàn phản đối và lo sợ/",
    "meaning_vi": "nghĩa trong bài đọc (hoàn toàn phản đối và lo sợ)",
    "example": "Example context: hoàn toàn phản đối và lo sợ in reading passage."
  },
  "obscured": {
    "pos": "Từ vựng (Word)",
    "ipa": "/obscured/",
    "meaning_vi": "nghĩa trong bài đọc (obscured)",
    "example": "Example context: obscured in reading passage."
  },
  "nutritious": {
    "pos": "Từ vựng (Word)",
    "ipa": "/nutritious/",
    "meaning_vi": "nghĩa trong bài đọc (nutritious)",
    "example": "Example context: nutritious in reading passage."
  },
  "kể lại nhật ký một chuyến thám hiểm đại dương": {
    "pos": "Từ vựng (Word)",
    "ipa": "/kể lại nhật ký một chuyến thám hiểm đại dương/",
    "meaning_vi": "nghĩa trong bài đọc (kể lại nhật ký một chuyến thám hiểm đại dương)",
    "example": "Example context: kể lại nhật ký một chuyến thám hiểm đại dương in reading passage."
  },
  "resilience": {
    "pos": "Từ vựng (Word)",
    "ipa": "/resilience/",
    "meaning_vi": "nghĩa trong bài đọc (resilience)",
    "example": "Example context: resilience in reading passage."
  },
  "engage": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪnˈɡeɪdʒ/",
    "meaning_vi": "tham gia (thu hút sự chú ý của ai đó và khiến họ quan tâm)",
    "example": "The subject of the presentation didn't engage me."
  },
  "discharge": {
    "pos": "Từ vựng (Word)",
    "ipa": "/discharge/",
    "meaning_vi": "nghĩa trong bài đọc (discharge)",
    "example": "Example context: discharge in reading passage."
  },
  "curate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/curate/",
    "meaning_vi": "nghĩa trong bài đọc (curate)",
    "example": "Example context: curate in reading passage."
  },
  "disassemble": {
    "pos": "Từ vựng (Word)",
    "ipa": "/disassemble/",
    "meaning_vi": "nghĩa trong bài đọc (disassemble)",
    "example": "Example context: disassemble in reading passage."
  },
  "destroy": {
    "pos": "Động từ (Verb)",
    "ipa": "/dɪˈstrɔɪ/",
    "meaning_vi": "hủy hoại",
    "example": ""
  },
  "stressful": {
    "pos": "Từ vựng (Word)",
    "ipa": "/stressful/",
    "meaning_vi": "nghĩa trong bài đọc (stressful)",
    "example": "Example context: stressful in reading passage."
  },
  "debate": {
    "pos": "Danh từ (Noun)",
    "ipa": "/dɪˈbeɪt/",
    "meaning_vi": "tranh luận",
    "example": ""
  },
  "burn": {
    "pos": "Từ vựng (Word)",
    "ipa": "/burn/",
    "meaning_vi": "nghĩa trong bài đọc (burn)",
    "example": "Example context: burn in reading passage."
  },
  "expansion": {
    "pos": "Từ vựng (Word)",
    "ipa": "/expansion/",
    "meaning_vi": "nghĩa trong bài đọc (expansion)",
    "example": "Example context: expansion in reading passage."
  },
  "charitable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/charitable/",
    "meaning_vi": "nghĩa trong bài đọc (charitable)",
    "example": "Example context: charitable in reading passage."
  },
  "synthesize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/synthesize/",
    "meaning_vi": "nghĩa trong bài đọc (synthesize)",
    "example": "Example context: synthesize in reading passage."
  },
  "screen": {
    "pos": "Từ vựng (Word)",
    "ipa": "/screen/",
    "meaning_vi": "nghĩa trong bài đọc (screen)",
    "example": "Example context: screen in reading passage."
  },
  "infection": {
    "pos": "Từ vựng (Word)",
    "ipa": "/infection/",
    "meaning_vi": "nghĩa trong bài đọc (infection)",
    "example": "Example context: infection in reading passage."
  },
  "enhance": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪnˈhæns/",
    "meaning_vi": "nâng cao, làm tăng thêm, cải thiện",
    "example": "Daily reading significantly enhances vocabulary and comprehension."
  },
  "choke": {
    "pos": "Từ vựng (Word)",
    "ipa": "/choke/",
    "meaning_vi": "nghĩa trong bài đọc (choke)",
    "example": "Example context: choke in reading passage."
  },
  "những thất bại thường gặp trong kinh doanh": {
    "pos": "Từ vựng (Word)",
    "ipa": "/những thất bại thường gặp trong kinh doanh/",
    "meaning_vi": "nghĩa trong bài đọc (những thất bại thường gặp trong kinh doanh)",
    "example": "Example context: những thất bại thường gặp trong kinh doanh in reading passage."
  },
  "stabilize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/stabilize/",
    "meaning_vi": "nghĩa trong bài đọc (stabilize)",
    "example": "Example context: stabilize in reading passage."
  },
  "eliminate": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪˈlɪmɪneɪt/",
    "meaning_vi": "loại bỏ hoàn toàn, bài trừ",
    "example": "Modern filtration systems eliminate harmful bacteria from drinking water."
  },
  "cancel": {
    "pos": "Từ vựng (Word)",
    "ipa": "/cancel/",
    "meaning_vi": "nghĩa trong bài đọc (cancel)",
    "example": "Example context: cancel in reading passage."
  },
  "expand": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪkˈspænd/",
    "meaning_vi": "mở rộng",
    "example": ""
  },
  "wasteful": {
    "pos": "Từ vựng (Word)",
    "ipa": "/wasteful/",
    "meaning_vi": "nghĩa trong bài đọc (wasteful)",
    "example": "Example context: wasteful in reading passage."
  },
  "distressed": {
    "pos": "Từ vựng (Word)",
    "ipa": "/distressed/",
    "meaning_vi": "nghĩa trong bài đọc (distressed)",
    "example": "Example context: distressed in reading passage."
  },
  "clog": {
    "pos": "Từ vựng (Word)",
    "ipa": "/clog/",
    "meaning_vi": "nghĩa trong bài đọc (clog)",
    "example": "Example context: clog in reading passage."
  },
  "agile": {
    "pos": "Từ vựng (Word)",
    "ipa": "/agile/",
    "meaning_vi": "nghĩa trong bài đọc (agile)",
    "example": "Example context: agile in reading passage."
  },
  "một người bạn thân": {
    "pos": "Từ vựng (Word)",
    "ipa": "/một người bạn thân/",
    "meaning_vi": "nghĩa trong bài đọc (một người bạn thân)",
    "example": "Example context: một người bạn thân in reading passage."
  },
  "fade": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fade/",
    "meaning_vi": "nghĩa trong bài đọc (fade)",
    "example": "Example context: fade in reading passage."
  },
  "uninterrupted": {
    "pos": "Từ vựng (Word)",
    "ipa": "/uninterrupted/",
    "meaning_vi": "nghĩa trong bài đọc (uninterrupted)",
    "example": "Example context: uninterrupted in reading passage."
  },
  "unseen": {
    "pos": "Từ vựng (Word)",
    "ipa": "/unseen/",
    "meaning_vi": "nghĩa trong bài đọc (unseen)",
    "example": "Example context: unseen in reading passage."
  },
  "plant": {
    "pos": "Từ vựng (Word)",
    "ipa": "/plant/",
    "meaning_vi": "nghĩa trong bài đọc (plant)",
    "example": "Example context: plant in reading passage."
  },
  "waste": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈweɪst/",
    "meaning_vi": "rác thải, chất thải, sự lãng phí",
    "example": ""
  },
  "timeless": {
    "pos": "Từ vựng (Word)",
    "ipa": "/timeless/",
    "meaning_vi": "nghĩa trong bài đọc (timeless)",
    "example": "Example context: timeless in reading passage."
  },
  "manufacture": {
    "pos": "Từ vựng (Word)",
    "ipa": "/manufacture/",
    "meaning_vi": "nghĩa trong bài đọc (manufacture)",
    "example": "Example context: manufacture in reading passage."
  },
  "forgive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/forgive/",
    "meaning_vi": "nghĩa trong bài đọc (forgive)",
    "example": "Example context: forgive in reading passage."
  },
  "fragile": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈfrædʒl/",
    "meaning_vi": "mong manh, dễ vỡ, yếu ớt",
    "example": "The ancient glassware is extremely fragile and requires delicate handling."
  },
  "confused": {
    "pos": "Từ vựng (Word)",
    "ipa": "/confused/",
    "meaning_vi": "nghĩa trong bài đọc (confused)",
    "example": "Example context: confused in reading passage."
  },
  "isolated": {
    "pos": "Từ vựng (Word)",
    "ipa": "/isolated/",
    "meaning_vi": "nghĩa trong bài đọc (isolated)",
    "example": "Example context: isolated in reading passage."
  },
  "procrastinate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/procrastinate/",
    "meaning_vi": "nghĩa trong bài đọc (procrastinate)",
    "example": "Example context: procrastinate in reading passage."
  },
  "prevent": {
    "pos": "Từ vựng (Word)",
    "ipa": "/prevent/",
    "meaning_vi": "nghĩa trong bài đọc (prevent)",
    "example": "Example context: prevent in reading passage."
  },
  "sự tận tâm kiên trì và phương pháp có cấu trúc (consistent dedication and structured methods)": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sự tận tâm kiên trì và phương pháp có cấu trúc (consistent dedication and structured methods)/",
    "meaning_vi": "nghĩa trong bài đọc (sự tận tâm kiên trì và phương pháp có cấu trúc (consistent dedication and structured methods))",
    "example": "Example context: sự tận tâm kiên trì và phương pháp có cấu trúc (consistent dedication and structured methods) in reading passage."
  },
  "sterile": {
    "pos": "a",
    "ipa": "/ˈsterəl/",
    "meaning_vi": "vô sinh",
    "example": "Example context with Sterile."
  },
  "protective": {
    "pos": "Từ vựng (Word)",
    "ipa": "/protective/",
    "meaning_vi": "nghĩa trong bài đọc (protective)",
    "example": "Example context: protective in reading passage."
  },
  "neocortex": {
    "pos": "Từ vựng (Word)",
    "ipa": "/neocortex/",
    "meaning_vi": "nghĩa trong bài đọc (neocortex)",
    "example": "Example context: neocortex in reading passage."
  },
  "achieve": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈtʃiːv/",
    "meaning_vi": "đạt được, hoàn thành, chinh phục (mục tiêu)",
    "example": "Consistent daily practice helps learners achieve fluency."
  },
  "khi vừa mới chợp mắt": {
    "pos": "Từ vựng (Word)",
    "ipa": "/khi vừa mới chợp mắt/",
    "meaning_vi": "nghĩa trong bài đọc (khi vừa mới chợp mắt)",
    "example": "Example context: khi vừa mới chợp mắt in reading passage."
  },
  "chở được khối lượng hàng chục tấn": {
    "pos": "Từ vựng (Word)",
    "ipa": "/chở được khối lượng hàng chục tấn/",
    "meaning_vi": "nghĩa trong bài đọc (chở được khối lượng hàng chục tấn)",
    "example": "Example context: chở được khối lượng hàng chục tấn in reading passage."
  },
  "sự suy tàn": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sự suy tàn/",
    "meaning_vi": "nghĩa trong bài đọc (sự suy tàn)",
    "example": "Example context: sự suy tàn in reading passage."
  },
  "reliable": {
    "pos": "a",
    "ipa": "/rɪˈlaɪrbl/",
    "meaning_vi": "đáng tin cậy",
    "example": ""
  },
  "critical": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈkrɪt̬.ɪ.kəl/",
    "meaning_vi": "phê phán, chỉ trích",
    "example": "Example context with Critical."
  },
  "awe-inspiring": {
    "pos": "Từ vựng (Word)",
    "ipa": "/awe-inspiring/",
    "meaning_vi": "nghĩa trong bài đọc (awe-inspiring)",
    "example": "Example context: awe-inspiring in reading passage."
  },
  "reclaim": {
    "pos": "Từ vựng (Word)",
    "ipa": "/reclaim/",
    "meaning_vi": "nghĩa trong bài đọc (reclaim)",
    "example": "Example context: reclaim in reading passage."
  },
  "preserve": {
    "pos": "Từ vựng (Word)",
    "ipa": "/preserve/",
    "meaning_vi": "nghĩa trong bài đọc (preserve)",
    "example": "Example context: preserve in reading passage."
  },
  "classical": {
    "pos": "Từ vựng (Word)",
    "ipa": "/classical/",
    "meaning_vi": "nghĩa trong bài đọc (classical)",
    "example": "Example context: classical in reading passage."
  },
  "intelligent": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ɪnˈtelədʒənt/",
    "meaning_vi": "thông minh (điều gì đó đã được nghĩ đến cẩn thận và được hiểu rõ)",
    "example": "The documentary gives an intelligent summary of the issues."
  },
  "remarkable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/remarkable/",
    "meaning_vi": "nghĩa trong bài đọc (remarkable)",
    "example": "Example context: remarkable in reading passage."
  },
  "panic": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈpænɪk/",
    "meaning_vi": "sự hoảng sợ, hoảng loạn",
    "example": ""
  },
  "costly": {
    "pos": "Từ vựng (Word)",
    "ipa": "/costly/",
    "meaning_vi": "nghĩa trong bài đọc (costly)",
    "example": "Example context: costly in reading passage."
  },
  "flourishing": {
    "pos": "Từ vựng (Word)",
    "ipa": "/flourishing/",
    "meaning_vi": "nghĩa trong bài đọc (flourishing)",
    "example": "Example context: flourishing in reading passage."
  },
  "empower": {
    "pos": "Từ vựng (Word)",
    "ipa": "/empower/",
    "meaning_vi": "nghĩa trong bài đọc (empower)",
    "example": "Example context: empower in reading passage."
  },
  "hydrate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hydrate/",
    "meaning_vi": "nghĩa trong bài đọc (hydrate)",
    "example": "Example context: hydrate in reading passage."
  },
  "nourish": {
    "pos": "Từ vựng (Word)",
    "ipa": "/nourish/",
    "meaning_vi": "nghĩa trong bài đọc (nourish)",
    "example": "Example context: nourish in reading passage."
  },
  "reinforce": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˌriːɪnˈfɔːrs/",
    "meaning_vi": "củng cố, tăng cường, gia cố",
    "example": "Flashcard practice reinforces vocabulary retention."
  },
  "wasted": {
    "pos": "Từ vựng (Word)",
    "ipa": "/wasted/",
    "meaning_vi": "nghĩa trong bài đọc (wasted)",
    "example": "Example context: wasted in reading passage."
  },
  "drought": {
    "pos": "Từ vựng (Word)",
    "ipa": "/drought/",
    "meaning_vi": "nghĩa trong bài đọc (drought)",
    "example": "Example context: drought in reading passage."
  },
  "viable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/viable/",
    "meaning_vi": "nghĩa trong bài đọc (viable)",
    "example": "Example context: viable in reading passage."
  },
  "obsolete": {
    "pos": "a",
    "ipa": "/ˌɑːbsəˈliːt/",
    "meaning_vi": "lỗi thời",
    "example": ""
  },
  "khi đang tập thể dục buổi sáng": {
    "pos": "Từ vựng (Word)",
    "ipa": "/khi đang tập thể dục buổi sáng/",
    "meaning_vi": "nghĩa trong bài đọc (khi đang tập thể dục buổi sáng)",
    "example": "Example context: khi đang tập thể dục buổi sáng in reading passage."
  },
  "thờ ơ không quan tâm": {
    "pos": "Từ vựng (Word)",
    "ipa": "/thờ ơ không quan tâm/",
    "meaning_vi": "nghĩa trong bài đọc (thờ ơ không quan tâm)",
    "example": "Example context: thờ ơ không quan tâm in reading passage."
  },
  "do các loài cá ăn hết san hô": {
    "pos": "Từ vựng (Word)",
    "ipa": "/do các loài cá ăn hết san hô/",
    "meaning_vi": "nghĩa trong bài đọc (do các loài cá ăn hết san hô)",
    "example": "Example context: do các loài cá ăn hết san hô in reading passage."
  },
  "notify": {
    "pos": "Từ vựng (Word)",
    "ipa": "/notify/",
    "meaning_vi": "nghĩa trong bài đọc (notify)",
    "example": "Example context: notify in reading passage."
  },
  "prosperous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/prosperous/",
    "meaning_vi": "nghĩa trong bài đọc (prosperous)",
    "example": "Example context: prosperous in reading passage."
  },
  "store": {
    "pos": "Từ vựng (Word)",
    "ipa": "/store/",
    "meaning_vi": "nghĩa trong bài đọc (store)",
    "example": "Example context: store in reading passage."
  },
  "parched": {
    "pos": "Từ vựng (Word)",
    "ipa": "/parched/",
    "meaning_vi": "nghĩa trong bài đọc (parched)",
    "example": "Example context: parched in reading passage."
  },
  "harmonious": {
    "pos": "Từ vựng (Word)",
    "ipa": "/harmonious/",
    "meaning_vi": "nghĩa trong bài đọc (harmonious)",
    "example": "Example context: harmonious in reading passage."
  },
  "interested in": {
    "pos": "Từ vựng (Word)",
    "ipa": "/interested in/",
    "meaning_vi": "nghĩa trong bài đọc (interested in)",
    "example": "Example context: interested in in reading passage."
  },
  "longevity": {
    "pos": "Từ vựng (Word)",
    "ipa": "/longevity/",
    "meaning_vi": "nghĩa trong bài đọc (longevity)",
    "example": "Example context: longevity in reading passage."
  },
  "discourage": {
    "pos": "Từ vựng (Word)",
    "ipa": "/discourage/",
    "meaning_vi": "nghĩa trong bài đọc (discourage)",
    "example": "Example context: discourage in reading passage."
  },
  "triumphant": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/traɪˈʌmfənt/",
    "meaning_vi": "chiến thắng, đắc thắng, khải hoàn",
    "example": "The team made a triumphant return after winning the championship."
  },
  "scarce": {
    "pos": "Từ vựng (Word)",
    "ipa": "/scarce/",
    "meaning_vi": "nghĩa trong bài đọc (scarce)",
    "example": "Example context: scarce in reading passage."
  },
  "objective": {
    "pos": "a",
    "ipa": "/əbˈdʒektɪv/",
    "meaning_vi": "Khách quan",
    "example": ""
  },
  "ignoring": {
    "pos": "Từ vựng (Word)",
    "ipa": "/ignoring/",
    "meaning_vi": "nghĩa trong bài đọc (ignoring)",
    "example": "Example context: ignoring in reading passage."
  },
  "deplete": {
    "pos": "Từ vựng (Word)",
    "ipa": "/deplete/",
    "meaning_vi": "nghĩa trong bài đọc (deplete)",
    "example": "Example context: deplete in reading passage."
  },
  "compact": {
    "pos": "Từ vựng (Word)",
    "ipa": "/compact/",
    "meaning_vi": "nghĩa trong bài đọc (compact)",
    "example": "Example context: compact in reading passage."
  },
  "precise": {
    "pos": "Từ vựng (Word)",
    "ipa": "/precise/",
    "meaning_vi": "nghĩa trong bài đọc (precise)",
    "example": "Example context: precise in reading passage."
  },
  "trí tuệ cảm xúc và tư duy phản biện": {
    "pos": "Từ vựng (Word)",
    "ipa": "/trí tuệ cảm xúc và tư duy phản biện/",
    "meaning_vi": "nghĩa trong bài đọc (trí tuệ cảm xúc và tư duy phản biện)",
    "example": "Example context: trí tuệ cảm xúc và tư duy phản biện in reading passage."
  },
  "phân loại hình ảnh": {
    "pos": "Từ vựng (Word)",
    "ipa": "/phân loại hình ảnh/",
    "meaning_vi": "nghĩa trong bài đọc (phân loại hình ảnh)",
    "example": "Example context: phân loại hình ảnh in reading passage."
  },
  "wither": {
    "pos": "Từ vựng (Word)",
    "ipa": "/wither/",
    "meaning_vi": "nghĩa trong bài đọc (wither)",
    "example": "Example context: wither in reading passage."
  },
  "vibrant": {
    "pos": "a",
    "ipa": "/ˈvaɪbrənt/",
    "meaning_vi": "sống động, rực rỡ",
    "example": ""
  },
  "welcome": {
    "pos": "Từ vựng (Word)",
    "ipa": "/welcome/",
    "meaning_vi": "nghĩa trong bài đọc (welcome)",
    "example": "Example context: welcome in reading passage."
  },
  "manipulated": {
    "pos": "Từ vựng (Word)",
    "ipa": "/manipulated/",
    "meaning_vi": "nghĩa trong bài đọc (manipulated)",
    "example": "Example context: manipulated in reading passage."
  },
  "landfills": {
    "pos": "Từ vựng (Word)",
    "ipa": "/landfills/",
    "meaning_vi": "nghĩa trong bài đọc (landfills)",
    "example": "Example context: landfills in reading passage."
  },
  "transport": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈtræn.spɔːrt/",
    "meaning_vi": "(=transportation) sự chuyên chở, vận",
    "example": ""
  },
  "traverse": {
    "pos": "Từ vựng (Word)",
    "ipa": "/traverse/",
    "meaning_vi": "nghĩa trong bài đọc (traverse)",
    "example": "Example context: traverse in reading passage."
  },
  "rejuvenate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/rejuvenate/",
    "meaning_vi": "nghĩa trong bài đọc (rejuvenate)",
    "example": "Example context: rejuvenate in reading passage."
  },
  "rewarding": {
    "pos": "a",
    "ipa": "/rɪˈwɔːrdɪŋ/",
    "meaning_vi": "bổ ích, đáng",
    "example": ""
  },
  "congested": {
    "pos": "Từ vựng (Word)",
    "ipa": "/congested/",
    "meaning_vi": "nghĩa trong bài đọc (congested)",
    "example": "Example context: congested in reading passage."
  },
  "mitigate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/mitigate/",
    "meaning_vi": "nghĩa trong bài đọc (mitigate)",
    "example": "Example context: mitigate in reading passage."
  },
  "conventional": {
    "pos": "Từ vựng (Word)",
    "ipa": "/conventional/",
    "meaning_vi": "nghĩa trong bài đọc (conventional)",
    "example": "Example context: conventional in reading passage."
  },
  "sturdy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sturdy/",
    "meaning_vi": "nghĩa trong bài đọc (sturdy)",
    "example": "Example context: sturdy in reading passage."
  },
  "communicate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/communicate/",
    "meaning_vi": "nghĩa trong bài đọc (communicate)",
    "example": "Example context: communicate in reading passage."
  },
  "track": {
    "pos": "Từ vựng (Word)",
    "ipa": "/track/",
    "meaning_vi": "nghĩa trong bài đọc (track)",
    "example": "Example context: track in reading passage."
  },
  "frail": {
    "pos": "Từ vựng (Word)",
    "ipa": "/frail/",
    "meaning_vi": "nghĩa trong bài đọc (frail)",
    "example": "Example context: frail in reading passage."
  },
  "accumulate": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈkjuːmjəleɪt/",
    "meaning_vi": "tích lũy, gom góp dần theo thời gian",
    "example": "Small daily habits accumulate into massive life achievements."
  },
  "strengthen": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈstreŋ.θən/",
    "meaning_vi": "củng cố, tăng cường",
    "example": ""
  },
  "dismantle": {
    "pos": "Từ vựng (Word)",
    "ipa": "/dismantle/",
    "meaning_vi": "nghĩa trong bài đọc (dismantle)",
    "example": "Example context: dismantle in reading passage."
  },
  "purify": {
    "pos": "Từ vựng (Word)",
    "ipa": "/purify/",
    "meaning_vi": "nghĩa trong bài đọc (purify)",
    "example": "Example context: purify in reading passage."
  },
  "pleasure": {
    "pos": "Từ vựng (Word)",
    "ipa": "/pleasure/",
    "meaning_vi": "nghĩa trong bài đọc (pleasure)",
    "example": "Example context: pleasure in reading passage."
  },
  "poisoning": {
    "pos": "Từ vựng (Word)",
    "ipa": "/poisoning/",
    "meaning_vi": "nghĩa trong bài đọc (poisoning)",
    "example": "Example context: poisoning in reading passage."
  },
  "protect": {
    "pos": "Từ vựng (Word)",
    "ipa": "/protect/",
    "meaning_vi": "nghĩa trong bài đọc (protect)",
    "example": "Example context: protect in reading passage."
  },
  "intellectual": {
    "pos": "Từ vựng (Word)",
    "ipa": "/intellectual/",
    "meaning_vi": "nghĩa trong bài đọc (intellectual)",
    "example": "Example context: intellectual in reading passage."
  },
  "energetic": {
    "pos": "a",
    "ipa": "/ˌenərˈdʒetɪk/",
    "meaning_vi": "mãnh liệt, tràn đầy năng lượng",
    "example": "Example context with Energetic."
  },
  "drinkable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/drinkable/",
    "meaning_vi": "nghĩa trong bài đọc (drinkable)",
    "example": "Example context: drinkable in reading passage."
  },
  "escape": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪˈskeɪp/",
    "meaning_vi": "trốn thoát (rời khỏi nơi khi ai đó đang cố bắt bạn hoặc dừng lại bạn, hoặc khi có tình huống nguy hiểm)",
    "example": "They caught a monkey which was trying to escape from the zoo."
  },
  "evoke": {
    "pos": "Từ vựng (Word)",
    "ipa": "/evoke/",
    "meaning_vi": "nghĩa trong bài đọc (evoke)",
    "example": "Example context: evoke in reading passage."
  },
  "attract": {
    "pos": "Từ vựng (Word)",
    "ipa": "/attract/",
    "meaning_vi": "nghĩa trong bài đọc (attract)",
    "example": "Example context: attract in reading passage."
  },
  "retain": {
    "pos": "Động từ (Verb)",
    "ipa": "/rɪˈteɪn/",
    "meaning_vi": "giữ lại, duy trì, ghi nhớ lâu dài",
    "example": "Regular revision helps learners retain 80% of new vocabulary."
  },
  "discerning": {
    "pos": "Từ vựng (Word)",
    "ipa": "/discerning/",
    "meaning_vi": "nghĩa trong bài đọc (discerning)",
    "example": "Example context: discerning in reading passage."
  },
  "wealthy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/wealthy/",
    "meaning_vi": "nghĩa trong bài đọc (wealthy)",
    "example": "Example context: wealthy in reading passage."
  },
  "supply": {
    "pos": "Từ vựng (Word)",
    "ipa": "/supply/",
    "meaning_vi": "nghĩa trong bài đọc (supply)",
    "example": "Example context: supply in reading passage."
  },
  "noisy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/noisy/",
    "meaning_vi": "nghĩa trong bài đọc (noisy)",
    "example": "Example context: noisy in reading passage."
  },
  "transfer": {
    "pos": "Từ vựng (Word)",
    "ipa": "/transfer/",
    "meaning_vi": "nghĩa trong bài đọc (transfer)",
    "example": "Example context: transfer in reading passage."
  },
  "ông nội của anh ấy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/ông nội của anh ấy/",
    "meaning_vi": "nghĩa trong bài đọc (ông nội của anh ấy)",
    "example": "Example context: ông nội của anh ấy in reading passage."
  },
  "respectful": {
    "pos": "Từ vựng (Word)",
    "ipa": "/respectful/",
    "meaning_vi": "nghĩa trong bài đọc (respectful)",
    "example": "Example context: respectful in reading passage."
  },
  "outdated": {
    "pos": "a",
    "ipa": "/ˌaʊtˈdeɪtɪd/",
    "meaning_vi": "lỗi thời",
    "example": ""
  },
  "persuade": {
    "pos": "Từ vựng (Word)",
    "ipa": "/persuade/",
    "meaning_vi": "nghĩa trong bài đọc (persuade)",
    "example": "Example context: persuade in reading passage."
  },
  "multiply": {
    "pos": "Từ vựng (Word)",
    "ipa": "/multiply/",
    "meaning_vi": "nghĩa trong bài đọc (multiply)",
    "example": "Example context: multiply in reading passage."
  },
  "celebration": {
    "pos": "Từ vựng (Word)",
    "ipa": "/celebration/",
    "meaning_vi": "nghĩa trong bài đọc (celebration)",
    "example": "Example context: celebration in reading passage."
  },
  "clean": {
    "pos": "Từ vựng (Word)",
    "ipa": "/clean/",
    "meaning_vi": "nghĩa trong bài đọc (clean)",
    "example": "Example context: clean in reading passage."
  },
  "paralyze": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈpærəlaɪz/",
    "meaning_vi": "gây tê liệt",
    "example": ""
  },
  "glide": {
    "pos": "Từ vựng (Word)",
    "ipa": "/glide/",
    "meaning_vi": "nghĩa trong bài đọc (glide)",
    "example": "Example context: glide in reading passage."
  },
  "archive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/archive/",
    "meaning_vi": "nghĩa trong bài đọc (archive)",
    "example": "Example context: archive in reading passage."
  },
  "impossible": {
    "pos": "Từ vựng (Word)",
    "ipa": "/impossible/",
    "meaning_vi": "nghĩa trong bài đọc (impossible)",
    "example": "Example context: impossible in reading passage."
  },
  "lower": {
    "pos": "Từ vựng (Word)",
    "ipa": "/lower/",
    "meaning_vi": "nghĩa trong bài đọc (lower)",
    "example": "Example context: lower in reading passage."
  },
  "accessible": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/əkˈsesəbl/",
    "meaning_vi": "dễ tiếp cận, có thể sử dụng được",
    "example": "Online courses make education accessible to students worldwide."
  },
  "irregular": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ɪˈreɡjələr/",
    "meaning_vi": "không thường xuyên (có hình dạng, bề mặt, hoa văn, v.v. không đều, trơn tru hoặc cân bằng)",
    "example": "The top of the table was a piece of wood with an irregular shape."
  },
  "maintain": {
    "pos": "Động từ (Verb)",
    "ipa": "/meɪnˈteɪn/",
    "meaning_vi": "bảo dưỡng, duy trì",
    "example": "Example context with Maintain."
  },
  "friction": {
    "pos": "Từ vựng (Word)",
    "ipa": "/friction/",
    "meaning_vi": "nghĩa trong bài đọc (friction)",
    "example": "Example context: friction in reading passage."
  },
  "phân tích thành phần hóa học của nước biển sâu": {
    "pos": "Từ vựng (Word)",
    "ipa": "/phân tích thành phần hóa học của nước biển sâu/",
    "meaning_vi": "nghĩa trong bài đọc (phân tích thành phần hóa học của nước biển sâu)",
    "example": "Example context: phân tích thành phần hóa học của nước biển sâu in reading passage."
  },
  "restore": {
    "pos": "Động từ (Verb)",
    "ipa": "/rɪˈstɔːr/",
    "meaning_vi": "khôi phục, phục hồi",
    "example": ""
  },
  "replace": {
    "pos": "Động từ (Verb)",
    "ipa": "/rɪˈpleɪs/",
    "meaning_vi": "thay thế",
    "example": ""
  },
  "balance": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈbӕləns/",
    "meaning_vi": "sự cân bằng/giữ cân bằng",
    "example": ""
  },
  "faded": {
    "pos": "Từ vựng (Word)",
    "ipa": "/faded/",
    "meaning_vi": "nghĩa trong bài đọc (faded)",
    "example": "Example context: faded in reading passage."
  },
  "enrich": {
    "pos": "Từ vựng (Word)",
    "ipa": "/enrich/",
    "meaning_vi": "nghĩa trong bài đọc (enrich)",
    "example": "Example context: enrich in reading passage."
  },
  "eco-friendly": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈek.oʊˌfrend.li/",
    "meaning_vi": "thân thiện với môi trường",
    "example": "Example context with Eco-friendly."
  },
  "align": {
    "pos": "Từ vựng (Word)",
    "ipa": "/align/",
    "meaning_vi": "nghĩa trong bài đọc (align)",
    "example": "Example context: align in reading passage."
  },
  "substitute": {
    "pos": "Từ vựng (Word)",
    "ipa": "/substitute/",
    "meaning_vi": "nghĩa trong bài đọc (substitute)",
    "example": "Example context: substitute in reading passage."
  },
  "calculate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/calculate/",
    "meaning_vi": "nghĩa trong bài đọc (calculate)",
    "example": "Example context: calculate in reading passage."
  },
  "welcoming": {
    "pos": "Từ vựng (Word)",
    "ipa": "/welcoming/",
    "meaning_vi": "nghĩa trong bài đọc (welcoming)",
    "example": "Example context: welcoming in reading passage."
  },
  "propagate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/propagate/",
    "meaning_vi": "nghĩa trong bài đọc (propagate)",
    "example": "Example context: propagate in reading passage."
  },
  "noise": {
    "pos": "Từ vựng (Word)",
    "ipa": "/noise/",
    "meaning_vi": "nghĩa trong bài đọc (noise)",
    "example": "Example context: noise in reading passage."
  },
  "luồn lách êm ái trong ngõ hẹp và không thải khí độc": {
    "pos": "Từ vựng (Word)",
    "ipa": "/luồn lách êm ái trong ngõ hẹp và không thải khí độc/",
    "meaning_vi": "nghĩa trong bài đọc (luồn lách êm ái trong ngõ hẹp và không thải khí độc)",
    "example": "Example context: luồn lách êm ái trong ngõ hẹp và không thải khí độc in reading passage."
  },
  "equitable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/equitable/",
    "meaning_vi": "nghĩa trong bài đọc (equitable)",
    "example": "Example context: equitable in reading passage."
  },
  "filter": {
    "pos": "Từ vựng (Word)",
    "ipa": "/filter/",
    "meaning_vi": "nghĩa trong bài đọc (filter)",
    "example": "Example context: filter in reading passage."
  },
  "scrutinize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/scrutinize/",
    "meaning_vi": "nghĩa trong bài đọc (scrutinize)",
    "example": "Example context: scrutinize in reading passage."
  },
  "detect": {
    "pos": "Từ vựng (Word)",
    "ipa": "/detect/",
    "meaning_vi": "nghĩa trong bài đọc (detect)",
    "example": "Example context: detect in reading passage."
  },
  "manageable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/manageable/",
    "meaning_vi": "nghĩa trong bài đọc (manageable)",
    "example": "Example context: manageable in reading passage."
  },
  "transplanting": {
    "pos": "Từ vựng (Word)",
    "ipa": "/transplanting/",
    "meaning_vi": "nghĩa trong bài đọc (transplanting)",
    "example": "Example context: transplanting in reading passage."
  },
  "debts (nợ nần)": {
    "pos": "Từ vựng (Word)",
    "ipa": "/debts (nợ nần)/",
    "meaning_vi": "nghĩa trong bài đọc (debts (nợ nần))",
    "example": "Example context: debts (nợ nần) in reading passage."
  },
  "passive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/passive/",
    "meaning_vi": "nghĩa trong bài đọc (passive)",
    "example": "Example context: passive in reading passage."
  },
  "suspend": {
    "pos": "Từ vựng (Word)",
    "ipa": "/suspend/",
    "meaning_vi": "nghĩa trong bài đọc (suspend)",
    "example": "Example context: suspend in reading passage."
  },
  "life-saving": {
    "pos": "Từ vựng (Word)",
    "ipa": "/life-saving/",
    "meaning_vi": "nghĩa trong bài đọc (life-saving)",
    "example": "Example context: life-saving in reading passage."
  },
  "assess": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈses/",
    "meaning_vi": "đánh giá, thẩm định (chất lượng, mức độ)",
    "example": "Teachers assess students' progress through weekly mock tests."
  },
  "giá trị cảm xúc thiêng liêng của các kỷ vật gia đình": {
    "pos": "Từ vựng (Word)",
    "ipa": "/giá trị cảm xúc thiêng liêng của các kỷ vật gia đình/",
    "meaning_vi": "nghĩa trong bài đọc (giá trị cảm xúc thiêng liêng của các kỷ vật gia đình)",
    "example": "Example context: giá trị cảm xúc thiêng liêng của các kỷ vật gia đình in reading passage."
  },
  "encode": {
    "pos": "Từ vựng (Word)",
    "ipa": "/encode/",
    "meaning_vi": "nghĩa trong bài đọc (encode)",
    "example": "Example context: encode in reading passage."
  },
  "flush": {
    "pos": "Động từ (Verb)",
    "ipa": "/flʌʃ/",
    "meaning_vi": "rửa trôi, đào thải, xả sạch (độc tố ra khỏi cơ thể/não)",
    "example": "Sleep helps the brain flush out toxic waste products."
  },
  "swift": {
    "pos": "Từ vựng (Word)",
    "ipa": "/swift/",
    "meaning_vi": "nghĩa trong bài đọc (swift)",
    "example": "Example context: swift in reading passage."
  },
  "confuse": {
    "pos": "Động từ (Verb)",
    "ipa": "/kənˈfjuːz/",
    "meaning_vi": "gây bối rối, gây nhầm lẫn",
    "example": ""
  },
  "chứa hàng hải ngoại": {
    "pos": "Từ vựng (Word)",
    "ipa": "/chứa hàng hải ngoại/",
    "meaning_vi": "nghĩa trong bài đọc (chứa hàng hải ngoại)",
    "example": "Example context: chứa hàng hải ngoại in reading passage."
  },
  "healthy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/healthy/",
    "meaning_vi": "nghĩa trong bài đọc (healthy)",
    "example": "Example context: healthy in reading passage."
  },
  "obsess": {
    "pos": "Từ vựng (Word)",
    "ipa": "/obsess/",
    "meaning_vi": "nghĩa trong bài đọc (obsess)",
    "example": "Example context: obsess in reading passage."
  },
  "tốc độ tính toán số liệu": {
    "pos": "Từ vựng (Word)",
    "ipa": "/tốc độ tính toán số liệu/",
    "meaning_vi": "nghĩa trong bài đọc (tốc độ tính toán số liệu)",
    "example": "Example context: tốc độ tính toán số liệu in reading passage."
  },
  "breathe": {
    "pos": "Từ vựng (Word)",
    "ipa": "/breathe/",
    "meaning_vi": "nghĩa trong bài đọc (breathe)",
    "example": "Example context: breathe in reading passage."
  },
  "automatic": {
    "pos": "a",
    "ipa": "/ˌɔːtəˈmætɪk/",
    "meaning_vi": "tự động",
    "example": ""
  },
  "distraction": {
    "pos": "Danh từ (Noun)",
    "ipa": "/dɪˈstrækʃn/",
    "meaning_vi": "sự phân tâm, sự xao lãng",
    "example": ""
  },
  "legendary": {
    "pos": "Từ vựng (Word)",
    "ipa": "/legendary/",
    "meaning_vi": "nghĩa trong bài đọc (legendary)",
    "example": "Example context: legendary in reading passage."
  },
  "praise": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈpreiz/",
    "meaning_vi": "khen ngợi, tán dương",
    "example": "Example context with Praise."
  },
  "program": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈproʊɡræm/",
    "meaning_vi": "lập trình",
    "example": ""
  },
  "initiate": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪˈnɪʃieɪt/",
    "meaning_vi": "khởi xướng",
    "example": ""
  },
  "repopulate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/repopulate/",
    "meaning_vi": "nghĩa trong bài đọc (repopulate)",
    "example": "Example context: repopulate in reading passage."
  },
  "polluting": {
    "pos": "Từ vựng (Word)",
    "ipa": "/polluting/",
    "meaning_vi": "nghĩa trong bài đọc (polluting)",
    "example": "Example context: polluting in reading passage."
  },
  "ignore": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪɡˈnɔːr(r)/",
    "meaning_vi": "phớt lờ, không để ý",
    "example": "Example context with Ignore."
  },
  "optimize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/optimize/",
    "meaning_vi": "nghĩa trong bài đọc (optimize)",
    "example": "Example context: optimize in reading passage."
  },
  "green": {
    "pos": "Từ vựng (Word)",
    "ipa": "/green/",
    "meaning_vi": "nghĩa trong bài đọc (green)",
    "example": "Example context: green in reading passage."
  },
  "erect": {
    "pos": "Từ vựng (Word)",
    "ipa": "/erect/",
    "meaning_vi": "nghĩa trong bài đọc (erect)",
    "example": "Example context: erect in reading passage."
  },
  "confined": {
    "pos": "Từ vựng (Word)",
    "ipa": "/confined/",
    "meaning_vi": "nghĩa trong bài đọc (confined)",
    "example": "Example context: confined in reading passage."
  },
  "roast": {
    "pos": "Từ vựng (Word)",
    "ipa": "/roast/",
    "meaning_vi": "nghĩa trong bài đọc (roast)",
    "example": "Example context: roast in reading passage."
  },
  "flourish": {
    "pos": "Từ vựng (Word)",
    "ipa": "/flourish/",
    "meaning_vi": "nghĩa trong bài đọc (flourish)",
    "example": "Example context: flourish in reading passage."
  },
  "đặt gần khu dân cư để rút ngắn quãng đường giao hàng chặng cuối": {
    "pos": "Từ vựng (Word)",
    "ipa": "/đặt gần khu dân cư để rút ngắn quãng đường giao hàng chặng cuối/",
    "meaning_vi": "nghĩa trong bài đọc (đặt gần khu dân cư để rút ngắn quãng đường giao hàng chặng cuối)",
    "example": "Example context: đặt gần khu dân cư để rút ngắn quãng đường giao hàng chặng cuối in reading passage."
  },
  "informative": {
    "pos": "a",
    "ipa": "/ɪnˈfɔːrmətɪv/",
    "meaning_vi": "nhiều thông tin",
    "example": ""
  },
  "apathetic": {
    "pos": "a",
    "ipa": "/ˌæpəˈθetɪk/",
    "meaning_vi": "thờ ơ, lãnh đạm",
    "example": "Example context with Apathetic."
  },
  "primitive": {
    "pos": "a",
    "ipa": "/ˈprɪmətɪv/",
    "meaning_vi": "nguyên thủy",
    "example": ""
  },
  "converse": {
    "pos": "Từ vựng (Word)",
    "ipa": "/converse/",
    "meaning_vi": "nghĩa trong bài đọc (converse)",
    "example": "Example context: converse in reading passage."
  },
  "carve": {
    "pos": "Từ vựng (Word)",
    "ipa": "/carve/",
    "meaning_vi": "nghĩa trong bài đọc (carve)",
    "example": "Example context: carve in reading passage."
  },
  "independent": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ɪndəˈpendənt/",
    "meaning_vi": "độc lập (tự tin và có thể tự làm mọi việc theo cách riêng của mình mà không cần sự giúp đỡ hay lời khuyên từ người khác)",
    "example": "Mustafa is independent and doesn't often ask for help."
  },
  "efficient": {
    "pos": "Từ vựng (Word)",
    "ipa": "/efficient/",
    "meaning_vi": "nghĩa trong bài đọc (efficient)",
    "example": "Example context: efficient in reading passage."
  },
  "pollute": {
    "pos": "Động từ (Verb)",
    "ipa": "/pəˈluːt/",
    "meaning_vi": "ô nhiễm",
    "example": "Example context with Pollute."
  },
  "record": {
    "pos": "Danh từ (Noun)",
    "ipa": "/rɪˈkɔːrd/",
    "meaning_vi": "thành tích, kỷ lục, sự ghi lại",
    "example": ""
  },
  "replenish": {
    "pos": "Từ vựng (Word)",
    "ipa": "/replenish/",
    "meaning_vi": "nghĩa trong bài đọc (replenish)",
    "example": "Example context: replenish in reading passage."
  },
  "offend": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈfend/",
    "meaning_vi": "xúc phạm",
    "example": ""
  },
  "erode": {
    "pos": "Từ vựng (Word)",
    "ipa": "/erode/",
    "meaning_vi": "nghĩa trong bài đọc (erode)",
    "example": "Example context: erode in reading passage."
  },
  "secure": {
    "pos": "Từ vựng (Word)",
    "ipa": "/secure/",
    "meaning_vi": "nghĩa trong bài đọc (secure)",
    "example": "Example context: secure in reading passage."
  },
  "coordinate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/coordinate/",
    "meaning_vi": "nghĩa trong bài đọc (coordinate)",
    "example": "Example context: coordinate in reading passage."
  },
  "thrive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/thrive/",
    "meaning_vi": "nghĩa trong bài đọc (thrive)",
    "example": "Example context: thrive in reading passage."
  },
  "generate": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈdʒenəreɪt/",
    "meaning_vi": "tạo ra, phát sinh, sinh ra (năng lượng, điện, ý tưởng)",
    "example": "Solar panels generate renewable electricity."
  },
  "deploy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/deploy/",
    "meaning_vi": "nghĩa trong bài đọc (deploy)",
    "example": "Example context: deploy in reading passage."
  },
  "distinguish": {
    "pos": "Động từ (Verb)",
    "ipa": "/dɪˈstɪŋɡwɪʃ/",
    "meaning_vi": "phân biệt",
    "example": ""
  },
  "stimuli": {
    "pos": "Từ vựng (Word)",
    "ipa": "/stimuli/",
    "meaning_vi": "nghĩa trong bài đọc (stimuli)",
    "example": "Example context: stimuli in reading passage."
  },
  "harvest": {
    "pos": "Từ vựng (Word)",
    "ipa": "/harvest/",
    "meaning_vi": "nghĩa trong bài đọc (harvest)",
    "example": "Example context: harvest in reading passage."
  },
  "connect": {
    "pos": "Từ vựng (Word)",
    "ipa": "/connect/",
    "meaning_vi": "nghĩa trong bài đọc (connect)",
    "example": "Example context: connect in reading passage."
  },
  "toxic": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈtɑːksɪk/",
    "meaning_vi": "độc hại, có hại cho sức khỏe hoặc tinh thần",
    "example": "Chemical factories must filter toxic fumes before releasing them."
  },
  "conserve": {
    "pos": "Từ vựng (Word)",
    "ipa": "/conserve/",
    "meaning_vi": "nghĩa trong bài đọc (conserve)",
    "example": "Example context: conserve in reading passage."
  },
  "slash": {
    "pos": "Từ vựng (Word)",
    "ipa": "/slash/",
    "meaning_vi": "nghĩa trong bài đọc (slash)",
    "example": "Example context: slash in reading passage."
  },
  "fertile": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fertile/",
    "meaning_vi": "nghĩa trong bài đọc (fertile)",
    "example": "Example context: fertile in reading passage."
  },
  "discarding": {
    "pos": "Từ vựng (Word)",
    "ipa": "/discarding/",
    "meaning_vi": "nghĩa trong bài đọc (discarding)",
    "example": "Example context: discarding in reading passage."
  },
  "bỏ cuộc ngay khi gặp khó khăn": {
    "pos": "Từ vựng (Word)",
    "ipa": "/bỏ cuộc ngay khi gặp khó khăn/",
    "meaning_vi": "nghĩa trong bài đọc (bỏ cuộc ngay khi gặp khó khăn)",
    "example": "Example context: bỏ cuộc ngay khi gặp khó khăn in reading passage."
  },
  "counterfeit": {
    "pos": "Từ vựng (Word)",
    "ipa": "/counterfeit/",
    "meaning_vi": "nghĩa trong bài đọc (counterfeit)",
    "example": "Example context: counterfeit in reading passage."
  },
  "reframe": {
    "pos": "Từ vựng (Word)",
    "ipa": "/reframe/",
    "meaning_vi": "nghĩa trong bài đọc (reframe)",
    "example": "Example context: reframe in reading passage."
  },
  "khi đang ăn sáng": {
    "pos": "Từ vựng (Word)",
    "ipa": "/khi đang ăn sáng/",
    "meaning_vi": "nghĩa trong bài đọc (khi đang ăn sáng)",
    "example": "Example context: khi đang ăn sáng in reading passage."
  },
  "uplifting": {
    "pos": "Từ vựng (Word)",
    "ipa": "/uplifting/",
    "meaning_vi": "nghĩa trong bài đọc (uplifting)",
    "example": "Example context: uplifting in reading passage."
  },
  "nguy cơ tai nạn giao thông do xe tải giao hàng": {
    "pos": "Từ vựng (Word)",
    "ipa": "/nguy cơ tai nạn giao thông do xe tải giao hàng/",
    "meaning_vi": "nghĩa trong bài đọc (nguy cơ tai nạn giao thông do xe tải giao hàng)",
    "example": "Example context: nguy cơ tai nạn giao thông do xe tải giao hàng in reading passage."
  },
  "deteriorate": {
    "pos": "Động từ (Verb)",
    "ipa": "/dɪˈtɪriəreɪt/",
    "meaning_vi": "xuống cấp, xấu đi, giảm sút chất lượng",
    "example": "Without regular maintenance, historical buildings deteriorate rapidly."
  },
  "bố mẹ anh ấy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/bố mẹ anh ấy/",
    "meaning_vi": "nghĩa trong bài đọc (bố mẹ anh ấy)",
    "example": "Example context: bố mẹ anh ấy in reading passage."
  },
  "weakness": {
    "pos": "Từ vựng (Word)",
    "ipa": "/weakness/",
    "meaning_vi": "nghĩa trong bài đọc (weakness)",
    "example": "Example context: weakness in reading passage."
  },
  "biased": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈbaɪrst/",
    "meaning_vi": "thiên vị (ưu tiên một cách không công bằng một người hoặc một nhóm hơn người khác)",
    "example": "I thought the newspaper report was biased"
  },
  "concentrate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/concentrate/",
    "meaning_vi": "nghĩa trong bài đọc (concentrate)",
    "example": "Example context: concentrate in reading passage."
  },
  "persevere": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˌpɜːrsəˈvɪr/",
    "meaning_vi": "kiên trì, bền bỉ, không nản lòng trước khó khăn",
    "example": "Those who persevere through setbacks eventually achieve success."
  },
  "ignite": {
    "pos": "Từ vựng (Word)",
    "ipa": "/ignite/",
    "meaning_vi": "nghĩa trong bài đọc (ignite)",
    "example": "Example context: ignite in reading passage."
  },
  "applaud": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈplɔːd/",
    "meaning_vi": "vỗ tay",
    "example": "Example context with Applaud."
  },
  "energized": {
    "pos": "Từ vựng (Word)",
    "ipa": "/energized/",
    "meaning_vi": "nghĩa trong bài đọc (energized)",
    "example": "Example context: energized in reading passage."
  },
  "anchor": {
    "pos": "Từ vựng (Word)",
    "ipa": "/anchor/",
    "meaning_vi": "nghĩa trong bài đọc (anchor)",
    "example": "Example context: anchor in reading passage."
  },
  "exploit": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪkˈsplɔɪt/",
    "meaning_vi": "khai thác (đối xử không công bằng với ai đó bằng cách yêu cầu họ làm việc gì đó cho bạn nhưng lại trả lại cho họ rất ít)",
    "example": "The company's workers are exploited and badly paid."
  },
  "vital": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈvaɪtl/",
    "meaning_vi": "tối quan trọng, mang tính sống còn",
    "example": "Good nutrition is vital for physical and mental development."
  },
  "innovate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/innovate/",
    "meaning_vi": "nghĩa trong bài đọc (innovate)",
    "example": "Example context: innovate in reading passage."
  },
  "hostile": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hostile/",
    "meaning_vi": "nghĩa trong bài đọc (hostile)",
    "example": "Example context: hostile in reading passage."
  },
  "transformative": {
    "pos": "Từ vựng (Word)",
    "ipa": "/transformative/",
    "meaning_vi": "nghĩa trong bài đọc (transformative)",
    "example": "Example context: transformative in reading passage."
  },
  "profound": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/prəˈfaʊnd/",
    "meaning_vi": "sâu sắc, thâm thúy, to lớn",
    "example": "Reading classical literature had a profound impact on his thinking."
  },
  "vulnerable": {
    "pos": "a",
    "ipa": "/ˈvʌlnərəbl/",
    "meaning_vi": "dễ bị tổn thương",
    "example": ""
  },
  "transform": {
    "pos": "Động từ (Verb)",
    "ipa": "/trænsˈfɔːrm/",
    "meaning_vi": "biến đổi",
    "example": "Example context with Transform."
  },
  "modernize": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈmɑːdərnaɪz/",
    "meaning_vi": "hiện đại hóa",
    "example": ""
  },
  "insure": {
    "pos": "Từ vựng (Word)",
    "ipa": "/insure/",
    "meaning_vi": "nghĩa trong bài đọc (insure)",
    "example": "Example context: insure in reading passage."
  },
  "productive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/productive/",
    "meaning_vi": "nghĩa trong bài đọc (productive)",
    "example": "Example context: productive in reading passage."
  },
  "regulate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/regulate/",
    "meaning_vi": "nghĩa trong bài đọc (regulate)",
    "example": "Example context: regulate in reading passage."
  },
  "extrude": {
    "pos": "Từ vựng (Word)",
    "ipa": "/extrude/",
    "meaning_vi": "nghĩa trong bài đọc (extrude)",
    "example": "Example context: extrude in reading passage."
  },
  "motivate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/motivate/",
    "meaning_vi": "nghĩa trong bài đọc (motivate)",
    "example": "Example context: motivate in reading passage."
  },
  "revolutionary": {
    "pos": "Từ vựng (Word)",
    "ipa": "/revolutionary/",
    "meaning_vi": "nghĩa trong bài đọc (revolutionary)",
    "example": "Example context: revolutionary in reading passage."
  },
  "irrational": {
    "pos": "Từ vựng (Word)",
    "ipa": "/irrational/",
    "meaning_vi": "nghĩa trong bài đọc (irrational)",
    "example": "Example context: irrational in reading passage."
  },
  "golden": {
    "pos": "Từ vựng (Word)",
    "ipa": "/golden/",
    "meaning_vi": "nghĩa trong bài đọc (golden)",
    "example": "Example context: golden in reading passage."
  },
  "regenerate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/regenerate/",
    "meaning_vi": "nghĩa trong bài đọc (regenerate)",
    "example": "Example context: regenerate in reading passage."
  },
  "tuyển dụng tài xế": {
    "pos": "Từ vựng (Word)",
    "ipa": "/tuyển dụng tài xế/",
    "meaning_vi": "nghĩa trong bài đọc (tuyển dụng tài xế)",
    "example": "Example context: tuyển dụng tài xế in reading passage."
  },
  "refuse": {
    "pos": "Từ vựng (Word)",
    "ipa": "/refuse/",
    "meaning_vi": "nghĩa trong bài đọc (refuse)",
    "example": "Example context: refuse in reading passage."
  },
  "chiến lược logistics xanh nhằm phát triển thương mại điện tử bền vững": {
    "pos": "Từ vựng (Word)",
    "ipa": "/chiến lược logistics xanh nhằm phát triển thương mại điện tử bền vững/",
    "meaning_vi": "nghĩa trong bài đọc (chiến lược logistics xanh nhằm phát triển thương mại điện tử bền vững)",
    "example": "Example context: chiến lược logistics xanh nhằm phát triển thương mại điện tử bền vững in reading passage."
  },
  "conflict": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈkɑːn.flɪkt/",
    "meaning_vi": "sự xung đột, cuộc xung đột",
    "example": "Example context with Conflict."
  },
  "destabilize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/destabilize/",
    "meaning_vi": "nghĩa trong bài đọc (destabilize)",
    "example": "Example context: destabilize in reading passage."
  },
  "invite": {
    "pos": "Từ vựng (Word)",
    "ipa": "/invite/",
    "meaning_vi": "nghĩa trong bài đọc (invite)",
    "example": "Example context: invite in reading passage."
  },
  "tránh né hoàn toàn mọi thử thách": {
    "pos": "Từ vựng (Word)",
    "ipa": "/tránh né hoàn toàn mọi thử thách/",
    "meaning_vi": "nghĩa trong bài đọc (tránh né hoàn toàn mọi thử thách)",
    "example": "Example context: tránh né hoàn toàn mọi thử thách in reading passage."
  },
  "compound": {
    "pos": "Từ vựng (Word)",
    "ipa": "/compound/",
    "meaning_vi": "nghĩa trong bài đọc (compound)",
    "example": "Example context: compound in reading passage."
  },
  "melt": {
    "pos": "Từ vựng (Word)",
    "ipa": "/melt/",
    "meaning_vi": "nghĩa trong bài đọc (melt)",
    "example": "Example context: melt in reading passage."
  },
  "optimal": {
    "pos": "Từ vựng (Word)",
    "ipa": "/optimal/",
    "meaning_vi": "nghĩa trong bài đọc (optimal)",
    "example": "Example context: optimal in reading passage."
  },
  "turbulent": {
    "pos": "a",
    "ipa": "/ˈtɜːrbjələnt/",
    "meaning_vi": "hỗn loạn",
    "example": ""
  },
  "saline": {
    "pos": "Từ vựng (Word)",
    "ipa": "/saline/",
    "meaning_vi": "nghĩa trong bài đọc (saline)",
    "example": "Example context: saline in reading passage."
  },
  "ergonomic": {
    "pos": "Từ vựng (Word)",
    "ipa": "/ergonomic/",
    "meaning_vi": "nghĩa trong bài đọc (ergonomic)",
    "example": "Example context: ergonomic in reading passage."
  },
  "rigid": {
    "pos": "Từ vựng (Word)",
    "ipa": "/rigid/",
    "meaning_vi": "nghĩa trong bài đọc (rigid)",
    "example": "Example context: rigid in reading passage."
  },
  "drop": {
    "pos": "Động từ (Verb)",
    "ipa": "/drɑːp/",
    "meaning_vi": "giảm xuống, rơi xuống, từ bỏ",
    "example": "Prices drop significantly during seasonal promotions."
  },
  "dispense": {
    "pos": "Từ vựng (Word)",
    "ipa": "/dispense/",
    "meaning_vi": "nghĩa trong bài đọc (dispense)",
    "example": "Example context: dispense in reading passage."
  },
  "white": {
    "pos": "Từ vựng (Word)",
    "ipa": "/white/",
    "meaning_vi": "nghĩa trong bài đọc (white)",
    "example": "Example context: white in reading passage."
  },
  "damage": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈdæmɪdʒ/",
    "meaning_vi": "gây hư hại, làm tổn thương, phá hủy",
    "example": "Chronic stress can damage cognitive performance."
  },
  "fulfilling": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fulfilling/",
    "meaning_vi": "nghĩa trong bài đọc (fulfilling)",
    "example": "Example context: fulfilling in reading passage."
  },
  "ethical": {
    "pos": "Từ vựng (Word)",
    "ipa": "/ethical/",
    "meaning_vi": "nghĩa trong bài đọc (ethical)",
    "example": "Example context: ethical in reading passage."
  },
  "cách dọn dẹp căn gác xép bừa bộn": {
    "pos": "Từ vựng (Word)",
    "ipa": "/cách dọn dẹp căn gác xép bừa bộn/",
    "meaning_vi": "nghĩa trong bài đọc (cách dọn dẹp căn gác xép bừa bộn)",
    "example": "Example context: cách dọn dẹp căn gác xép bừa bộn in reading passage."
  },
  "distribute": {
    "pos": "Động từ (Verb)",
    "ipa": "/dɪˈstrɪbjuːt/",
    "meaning_vi": "phân phát, phân bổ đều",
    "example": "Volunteers distribute warm clothes to mountain villagers."
  },
  "deconstruct": {
    "pos": "Từ vựng (Word)",
    "ipa": "/deconstruct/",
    "meaning_vi": "nghĩa trong bài đọc (deconstruct)",
    "example": "Example context: deconstruct in reading passage."
  },
  "circulate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/circulate/",
    "meaning_vi": "nghĩa trong bài đọc (circulate)",
    "example": "Example context: circulate in reading passage."
  },
  "groundbreaking": {
    "pos": "Từ vựng (Word)",
    "ipa": "/groundbreaking/",
    "meaning_vi": "nghĩa trong bài đọc (groundbreaking)",
    "example": "Example context: groundbreaking in reading passage."
  },
  "observe": {
    "pos": "Từ vựng (Word)",
    "ipa": "/observe/",
    "meaning_vi": "nghĩa trong bài đọc (observe)",
    "example": "Example context: observe in reading passage."
  },
  "một người thợ mộc": {
    "pos": "Từ vựng (Word)",
    "ipa": "/một người thợ mộc/",
    "meaning_vi": "nghĩa trong bài đọc (một người thợ mộc)",
    "example": "Example context: một người thợ mộc in reading passage."
  },
  "target": {
    "pos": "Từ vựng (Word)",
    "ipa": "/target/",
    "meaning_vi": "nghĩa trong bài đọc (target)",
    "example": "Example context: target in reading passage."
  },
  "thriving": {
    "pos": "Từ vựng (Word)",
    "ipa": "/thriving/",
    "meaning_vi": "nghĩa trong bài đọc (thriving)",
    "example": "Example context: thriving in reading passage."
  },
  "claustrophobic": {
    "pos": "Từ vựng (Word)",
    "ipa": "/claustrophobic/",
    "meaning_vi": "nghĩa trong bài đọc (claustrophobic)",
    "example": "Example context: claustrophobic in reading passage."
  },
  "trình bày hiện tượng tẩy trắng san hô và các giải pháp bảo vệ hệ sinh thái biển": {
    "pos": "Từ vựng (Word)",
    "ipa": "/trình bày hiện tượng tẩy trắng san hô và các giải pháp bảo vệ hệ sinh thái biển/",
    "meaning_vi": "nghĩa trong bài đọc (trình bày hiện tượng tẩy trắng san hô và các giải pháp bảo vệ hệ sinh thái biển)",
    "example": "Example context: trình bày hiện tượng tẩy trắng san hô và các giải pháp bảo vệ hệ sinh thái biển in reading passage."
  },
  "capture": {
    "pos": "Từ vựng (Word)",
    "ipa": "/capture/",
    "meaning_vi": "nghĩa trong bài đọc (capture)",
    "example": "Example context: capture in reading passage."
  },
  "guarantee": {
    "pos": "Từ vựng (Word)",
    "ipa": "/guarantee/",
    "meaning_vi": "nghĩa trong bài đọc (guarantee)",
    "example": "Example context: guarantee in reading passage."
  },
  "hazardous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hazardous/",
    "meaning_vi": "nghĩa trong bài đọc (hazardous)",
    "example": "Example context: hazardous in reading passage."
  },
  "cách buôn bán đồ cũ sinh lời": {
    "pos": "Từ vựng (Word)",
    "ipa": "/cách buôn bán đồ cũ sinh lời/",
    "meaning_vi": "nghĩa trong bài đọc (cách buôn bán đồ cũ sinh lời)",
    "example": "Example context: cách buôn bán đồ cũ sinh lời in reading passage."
  },
  "produce": {
    "pos": "Từ vựng (Word)",
    "ipa": "/produce/",
    "meaning_vi": "nghĩa trong bài đọc (produce)",
    "example": "Example context: produce in reading passage."
  },
  "sự thất bại của các cửa hàng truyền thống": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sự thất bại của các cửa hàng truyền thống/",
    "meaning_vi": "nghĩa trong bài đọc (sự thất bại của các cửa hàng truyền thống)",
    "example": "Example context: sự thất bại của các cửa hàng truyền thống in reading passage."
  },
  "tủy sống": {
    "pos": "Từ vựng (Word)",
    "ipa": "/tủy sống/",
    "meaning_vi": "nghĩa trong bài đọc (tủy sống)",
    "example": "Example context: tủy sống in reading passage."
  },
  "sustainable": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/səˈsteɪ.nə.bəl/",
    "meaning_vi": "bền vững, lâu dài",
    "example": "Example context with Sustainable."
  },
  "democratize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/democratize/",
    "meaning_vi": "nghĩa trong bài đọc (democratize)",
    "example": "Example context: democratize in reading passage."
  },
  "consume": {
    "pos": "Động từ (Verb)",
    "ipa": "/kənˈsuːm/",
    "meaning_vi": "tiêu thụ",
    "example": ""
  },
  "curtail": {
    "pos": "Từ vựng (Word)",
    "ipa": "/curtail/",
    "meaning_vi": "nghĩa trong bài đọc (curtail)",
    "example": "Example context: curtail in reading passage."
  },
  "acquire": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈkwaɪər/",
    "meaning_vi": "thu nhận, đạt được (kiến thức, kỹ năng)",
    "example": "Immersive reading helps students acquire vocabulary naturally."
  },
  "protected by": {
    "pos": "Từ vựng (Word)",
    "ipa": "/protected by/",
    "meaning_vi": "nghĩa trong bài đọc (protected by)",
    "example": "Example context: protected by in reading passage."
  },
  "fertilize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fertilize/",
    "meaning_vi": "nghĩa trong bài đọc (fertilize)",
    "example": "Example context: fertilize in reading passage."
  },
  "hippocampus (vùng hải mã)": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hippocampus (vùng hải mã)/",
    "meaning_vi": "nghĩa trong bài đọc (hippocampus (vùng hải mã))",
    "example": "Example context: hippocampus (vùng hải mã) in reading passage."
  },
  "prohibitive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/prohibitive/",
    "meaning_vi": "nghĩa trong bài đọc (prohibitive)",
    "example": "Example context: prohibitive in reading passage."
  },
  "stagnate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/stagnate/",
    "meaning_vi": "nghĩa trong bài đọc (stagnate)",
    "example": "Example context: stagnate in reading passage."
  },
  "painful": {
    "pos": "a",
    "ipa": "/ˈpeɪnfl/",
    "meaning_vi": "đau đớn",
    "example": "Example context with Painful."
  },
  "fragmented": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fragmented/",
    "meaning_vi": "nghĩa trong bài đọc (fragmented)",
    "example": "Example context: fragmented in reading passage."
  },
  "forget": {
    "pos": "Từ vựng (Word)",
    "ipa": "/forget/",
    "meaning_vi": "nghĩa trong bài đọc (forget)",
    "example": "Example context: forget in reading passage."
  },
  "bay qua các tòa nhà cao tầng": {
    "pos": "Từ vựng (Word)",
    "ipa": "/bay qua các tòa nhà cao tầng/",
    "meaning_vi": "nghĩa trong bài đọc (bay qua các tòa nhà cao tầng)",
    "example": "Example context: bay qua các tòa nhà cao tầng in reading passage."
  },
  "refill": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˌriːˈfɪl/",
    "meaning_vi": "nạp lại, đổ đầy",
    "example": ""
  },
  "enroll": {
    "pos": "Từ vựng (Word)",
    "ipa": "/enroll/",
    "meaning_vi": "nghĩa trong bài đọc (enroll)",
    "example": "Example context: enroll in reading passage."
  },
  "delays (sự chậm trễ)": {
    "pos": "Từ vựng (Word)",
    "ipa": "/delays (sự chậm trễ)/",
    "meaning_vi": "nghĩa trong bài đọc (delays (sự chậm trễ))",
    "example": "Example context: delays (sự chậm trễ) in reading passage."
  },
  "populate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/populate/",
    "meaning_vi": "nghĩa trong bài đọc (populate)",
    "example": "Example context: populate in reading passage."
  },
  "soothing": {
    "pos": "Từ vựng (Word)",
    "ipa": "/soothing/",
    "meaning_vi": "nghĩa trong bài đọc (soothing)",
    "example": "Example context: soothing in reading passage."
  },
  "colonize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/colonize/",
    "meaning_vi": "nghĩa trong bài đọc (colonize)",
    "example": "Example context: colonize in reading passage."
  },
  "analyze": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈænəlaɪz/",
    "meaning_vi": "phân tích, mổ xẻ chi tiết",
    "example": "Scientists analyze data collected from deep space telescopes."
  },
  "interpret": {
    "pos": "Từ vựng (Word)",
    "ipa": "/interpret/",
    "meaning_vi": "nghĩa trong bài đọc (interpret)",
    "example": "Example context: interpret in reading passage."
  },
  "accelerate": {
    "pos": "Động từ (Verb)",
    "ipa": "/əkˈseləreɪt/",
    "meaning_vi": "đẩy nhanh, gia tốc, làm tăng tốc",
    "example": "Digital technology accelerates language acquisition."
  },
  "evaluate": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪˈvæljueɪt/",
    "meaning_vi": "định giá, đánh giá",
    "example": ""
  },
  "disorient": {
    "pos": "Từ vựng (Word)",
    "ipa": "/disorient/",
    "meaning_vi": "nghĩa trong bài đọc (disorient)",
    "example": "Example context: disorient in reading passage."
  },
  "belong": {
    "pos": "Từ vựng (Word)",
    "ipa": "/belong/",
    "meaning_vi": "nghĩa trong bài đọc (belong)",
    "example": "Example context: belong in reading passage."
  },
  "monitor": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈmɑːnɪtər/",
    "meaning_vi": "giám sát, theo dõi",
    "example": ""
  },
  "degrade": {
    "pos": "Động từ (Verb)",
    "ipa": "/dɪˈɡreɪd/",
    "meaning_vi": "làm suy thoái",
    "example": ""
  },
  "trong giấc ngủ sóng chậm sâu (slow-wave deep sleep)": {
    "pos": "Từ vựng (Word)",
    "ipa": "/trong giấc ngủ sóng chậm sâu (slow-wave deep sleep)/",
    "meaning_vi": "nghĩa trong bài đọc (trong giấc ngủ sóng chậm sâu (slow-wave deep sleep))",
    "example": "Example context: trong giấc ngủ sóng chậm sâu (slow-wave deep sleep) in reading passage."
  },
  "fascinating": {
    "pos": "a",
    "ipa": "/ˈfæsɪneɪtɪŋ/",
    "meaning_vi": "lôi cuốn, hấp dẫn",
    "example": ""
  },
  "conceal": {
    "pos": "Động từ (Verb)",
    "ipa": "/kənˈsiːl/",
    "meaning_vi": "che giấu, giấu kín (cảm xúc, bí mật, sự thật)",
    "example": "He tried to conceal his anxiety with a confident smile."
  },
  "encrypt": {
    "pos": "Từ vựng (Word)",
    "ipa": "/encrypt/",
    "meaning_vi": "nghĩa trong bài đọc (encrypt)",
    "example": "Example context: encrypt in reading passage."
  },
  "deflect": {
    "pos": "Từ vựng (Word)",
    "ipa": "/deflect/",
    "meaning_vi": "nghĩa trong bài đọc (deflect)",
    "example": "Example context: deflect in reading passage."
  },
  "ingest": {
    "pos": "Từ vựng (Word)",
    "ipa": "/ingest/",
    "meaning_vi": "nghĩa trong bài đọc (ingest)",
    "example": "Example context: ingest in reading passage."
  },
  "trendy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/trendy/",
    "meaning_vi": "nghĩa trong bài đọc (trendy)",
    "example": "Example context: trendy in reading passage."
  },
  "rot": {
    "pos": "Từ vựng (Word)",
    "ipa": "/rot/",
    "meaning_vi": "nghĩa trong bài đọc (rot)",
    "example": "Example context: rot in reading passage."
  },
  "streamline": {
    "pos": "Từ vựng (Word)",
    "ipa": "/streamline/",
    "meaning_vi": "nghĩa trong bài đọc (streamline)",
    "example": "Example context: streamline in reading passage."
  },
  "harmful": {
    "pos": "Từ vựng (Word)",
    "ipa": "/harmful/",
    "meaning_vi": "nghĩa trong bài đọc (harmful)",
    "example": "Example context: harmful in reading passage."
  },
  "khẳng định ai sẽ thay thế 100% người lao động": {
    "pos": "Từ vựng (Word)",
    "ipa": "/khẳng định ai sẽ thay thế 100% người lao động/",
    "meaning_vi": "nghĩa trong bài đọc (khẳng định ai sẽ thay thế 100% người lao động)",
    "example": "Example context: khẳng định ai sẽ thay thế 100% người lao động in reading passage."
  },
  "cơ hoành": {
    "pos": "Từ vựng (Word)",
    "ipa": "/cơ hoành/",
    "meaning_vi": "nghĩa trong bài đọc (cơ hoành)",
    "example": "Example context: cơ hoành in reading passage."
  },
  "pristine": {
    "pos": "Từ vựng (Word)",
    "ipa": "/pristine/",
    "meaning_vi": "nghĩa trong bài đọc (pristine)",
    "example": "Example context: pristine in reading passage."
  },
  "behold": {
    "pos": "Từ vựng (Word)",
    "ipa": "/behold/",
    "meaning_vi": "nghĩa trong bài đọc (behold)",
    "example": "Example context: behold in reading passage."
  },
  "treasuring / valuing (trân quý, nâng niu)": {
    "pos": "Từ vựng (Word)",
    "ipa": "/treasuring / valuing (trân quý, nâng niu)/",
    "meaning_vi": "nghĩa trong bài đọc (treasuring / valuing (trân quý, nâng niu))",
    "example": "Example context: treasuring / valuing (trân quý, nâng niu) in reading passage."
  },
  "convenient": {
    "pos": "a",
    "ipa": "/kənˈviːniənt/",
    "meaning_vi": "thuận tiện",
    "example": "Example context with Convenient."
  },
  "renewable": {
    "pos": "a",
    "ipa": "/rɪˈnuː.ə.bəl/",
    "meaning_vi": "có thể tái tạo",
    "example": ""
  },
  "popular": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈpɑːr.pjə.lɚ/",
    "meaning_vi": "nổi tiếng, phổ biến",
    "example": "Example context with Popular."
  },
  "chờ đợi sự may mắn ngẫu nhiên": {
    "pos": "Từ vựng (Word)",
    "ipa": "/chờ đợi sự may mắn ngẫu nhiên/",
    "meaning_vi": "nghĩa trong bài đọc (chờ đợi sự may mắn ngẫu nhiên)",
    "example": "Example context: chờ đợi sự may mắn ngẫu nhiên in reading passage."
  },
  "miraculous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/miraculous/",
    "meaning_vi": "nghĩa trong bài đọc (miraculous)",
    "example": "Example context: miraculous in reading passage."
  },
  "debilitating": {
    "pos": "Từ vựng (Word)",
    "ipa": "/debilitating/",
    "meaning_vi": "nghĩa trong bài đọc (debilitating)",
    "example": "Example context: debilitating in reading passage."
  },
  "mentor": {
    "pos": "Từ vựng (Word)",
    "ipa": "/mentor/",
    "meaning_vi": "nghĩa trong bài đọc (mentor)",
    "example": "Example context: mentor in reading passage."
  },
  "extinction": {
    "pos": "Từ vựng (Word)",
    "ipa": "/extinction/",
    "meaning_vi": "nghĩa trong bài đọc (extinction)",
    "example": "Example context: extinction in reading passage."
  },
  "indispensable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/indispensable/",
    "meaning_vi": "nghĩa trong bài đọc (indispensable)",
    "example": "Example context: indispensable in reading passage."
  },
  "exchange": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ɪksˈtʃeɪndʒ/",
    "meaning_vi": "trao đổi, giao dịch",
    "example": ""
  },
  "spectacular": {
    "pos": "a",
    "ipa": "/spekˈtækjələr/",
    "meaning_vi": "hùng vĩ, ấn tượng",
    "example": ""
  },
  "isolation": {
    "pos": "Từ vựng (Word)",
    "ipa": "/isolation/",
    "meaning_vi": "nghĩa trong bài đọc (isolation)",
    "example": "Example context: isolation in reading passage."
  },
  "impair": {
    "pos": "Từ vựng (Word)",
    "ipa": "/impair/",
    "meaning_vi": "nghĩa trong bài đọc (impair)",
    "example": "Example context: impair in reading passage."
  },
  "famous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/famous/",
    "meaning_vi": "nghĩa trong bài đọc (famous)",
    "example": "Example context: famous in reading passage."
  },
  "stripped of / lacking (bị tước đi, thiếu thốn)": {
    "pos": "Từ vựng (Word)",
    "ipa": "/stripped of / lacking (bị tước đi, thiếu thốn)/",
    "meaning_vi": "nghĩa trong bài đọc (stripped of / lacking (bị tước đi, thiếu thốn))",
    "example": "Example context: stripped of / lacking (bị tước đi, thiếu thốn) in reading passage."
  },
  "chaotic": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/keɪˈɑːtɪk/",
    "meaning_vi": "hỗn loạn, lộn xộn, vô trật tự",
    "example": "The traffic was chaotic during the torrential rainstorm."
  },
  "modulate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/modulate/",
    "meaning_vi": "nghĩa trong bài đọc (modulate)",
    "example": "Example context: modulate in reading passage."
  },
  "intercept": {
    "pos": "Từ vựng (Word)",
    "ipa": "/intercept/",
    "meaning_vi": "nghĩa trong bài đọc (intercept)",
    "example": "Example context: intercept in reading passage."
  },
  "propel": {
    "pos": "Từ vựng (Word)",
    "ipa": "/propel/",
    "meaning_vi": "nghĩa trong bài đọc (propel)",
    "example": "Example context: propel in reading passage."
  },
  "boredom": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈbɔːrdəm/",
    "meaning_vi": "sự nhàm chán",
    "example": ""
  },
  "seamless": {
    "pos": "Từ vựng (Word)",
    "ipa": "/seamless/",
    "meaning_vi": "nghĩa trong bài đọc (seamless)",
    "example": "Example context: seamless in reading passage."
  },
  "lengthen": {
    "pos": "Từ vựng (Word)",
    "ipa": "/lengthen/",
    "meaning_vi": "nghĩa trong bài đọc (lengthen)",
    "example": "Example context: lengthen in reading passage."
  },
  "dangerous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/dangerous/",
    "meaning_vi": "nghĩa trong bài đọc (dangerous)",
    "example": "Example context: dangerous in reading passage."
  },
  "audit": {
    "pos": "Từ vựng (Word)",
    "ipa": "/audit/",
    "meaning_vi": "nghĩa trong bài đọc (audit)",
    "example": "Example context: audit in reading passage."
  },
  "anxious": {
    "pos": "Từ vựng (Word)",
    "ipa": "/anxious/",
    "meaning_vi": "nghĩa trong bài đọc (anxious)",
    "example": "Example context: anxious in reading passage."
  },
  "shorten": {
    "pos": "Từ vựng (Word)",
    "ipa": "/shorten/",
    "meaning_vi": "nghĩa trong bài đọc (shorten)",
    "example": "Example context: shorten in reading passage."
  },
  "trigger": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈtrɪɡər/",
    "meaning_vi": "gây ra, kích hoạt, làm bùng phát",
    "example": "Cold weather can trigger seasonal allergies in sensitive people."
  },
  "peaceful": {
    "pos": "a",
    "ipa": "/ˈpiːsfl/",
    "meaning_vi": "yên bình",
    "example": "Example context with Peaceful."
  },
  "gather": {
    "pos": "Từ vựng (Word)",
    "ipa": "/gather/",
    "meaning_vi": "nghĩa trong bài đọc (gather)",
    "example": "Example context: gather in reading passage."
  },
  "extract": {
    "pos": "Từ vựng (Word)",
    "ipa": "/extract/",
    "meaning_vi": "nghĩa trong bài đọc (extract)",
    "example": "Example context: extract in reading passage."
  },
  "channel": {
    "pos": "Từ vựng (Word)",
    "ipa": "/channel/",
    "meaning_vi": "nghĩa trong bài đọc (channel)",
    "example": "Example context: channel in reading passage."
  },
  "resilient": {
    "pos": "Từ vựng (Word)",
    "ipa": "/resilient/",
    "meaning_vi": "nghĩa trong bài đọc (resilient)",
    "example": "Example context: resilient in reading passage."
  },
  "adapt": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈdæpt/",
    "meaning_vi": "thích nghi, làm quen, biến đổi cho phù hợp",
    "example": "Organisms must adapt to changing climate conditions."
  },
  "disrupt": {
    "pos": "Từ vựng (Word)",
    "ipa": "/disrupt/",
    "meaning_vi": "nghĩa trong bài đọc (disrupt)",
    "example": "Example context: disrupt in reading passage."
  },
  "overwhelm": {
    "pos": "Từ vựng (Word)",
    "ipa": "/overwhelm/",
    "meaning_vi": "nghĩa trong bài đọc (overwhelm)",
    "example": "Example context: overwhelm in reading passage."
  },
  "collapsible": {
    "pos": "Từ vựng (Word)",
    "ipa": "/collapsible/",
    "meaning_vi": "nghĩa trong bài đọc (collapsible)",
    "example": "Example context: collapsible in reading passage."
  },
  "stimulate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/stimulate/",
    "meaning_vi": "nghĩa trong bài đọc (stimulate)",
    "example": "Example context: stimulate in reading passage."
  },
  "perish": {
    "pos": "Từ vựng (Word)",
    "ipa": "/perish/",
    "meaning_vi": "nghĩa trong bài đọc (perish)",
    "example": "Example context: perish in reading passage."
  },
  "survey": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈ'sə:vei/",
    "meaning_vi": "sự khảo sát",
    "example": "Example context with Survey."
  },
  "inferior": {
    "pos": "Từ vựng (Word)",
    "ipa": "/inferior/",
    "meaning_vi": "nghĩa trong bài đọc (inferior)",
    "example": "Example context: inferior in reading passage."
  },
  "thực tế và lạc quan, xem ai là công cụ hỗ trợ con người": {
    "pos": "Từ vựng (Word)",
    "ipa": "/thực tế và lạc quan, xem ai là công cụ hỗ trợ con người/",
    "meaning_vi": "nghĩa trong bài đọc (thực tế và lạc quan, xem ai là công cụ hỗ trợ con người)",
    "example": "Example context: thực tế và lạc quan, xem ai là công cụ hỗ trợ con người in reading passage."
  },
  "recover": {
    "pos": "Từ vựng (Word)",
    "ipa": "/recover/",
    "meaning_vi": "nghĩa trong bài đọc (recover)",
    "example": "Example context: recover in reading passage."
  },
  "forestall": {
    "pos": "Từ vựng (Word)",
    "ipa": "/forestall/",
    "meaning_vi": "nghĩa trong bài đọc (forestall)",
    "example": "Example context: forestall in reading passage."
  },
  "dark": {
    "pos": "Từ vựng (Word)",
    "ipa": "/dark/",
    "meaning_vi": "nghĩa trong bài đọc (dark)",
    "example": "Example context: dark in reading passage."
  },
  "benefits / rewards (lợi ích, thành quả tốt đẹp lâu dài)": {
    "pos": "Từ vựng (Word)",
    "ipa": "/benefits / rewards (lợi ích, thành quả tốt đẹp lâu dài)/",
    "meaning_vi": "nghĩa trong bài đọc (benefits / rewards (lợi ích, thành quả tốt đẹp lâu dài))",
    "example": "Example context: benefits / rewards (lợi ích, thành quả tốt đẹp lâu dài) in reading passage."
  },
  "synthetic": {
    "pos": "Từ vựng (Word)",
    "ipa": "/synthetic/",
    "meaning_vi": "nghĩa trong bài đọc (synthetic)",
    "example": "Example context: synthetic in reading passage."
  },
  "navigate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/navigate/",
    "meaning_vi": "nghĩa trong bài đọc (navigate)",
    "example": "Example context: navigate in reading passage."
  },
  "collide": {
    "pos": "Từ vựng (Word)",
    "ipa": "/collide/",
    "meaning_vi": "nghĩa trong bài đọc (collide)",
    "example": "Example context: collide in reading passage."
  },
  "print": {
    "pos": "Từ vựng (Word)",
    "ipa": "/print/",
    "meaning_vi": "nghĩa trong bài đọc (print)",
    "example": "Example context: print in reading passage."
  },
  "sorrow": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sorrow/",
    "meaning_vi": "nghĩa trong bài đọc (sorrow)",
    "example": "Example context: sorrow in reading passage."
  },
  "provided with": {
    "pos": "Từ vựng (Word)",
    "ipa": "/provided with/",
    "meaning_vi": "nghĩa trong bài đọc (provided with)",
    "example": "Example context: provided with in reading passage."
  },
  "furious": {
    "pos": "a",
    "ipa": "/ˈfjʊriəs/",
    "meaning_vi": "giận dữ",
    "example": ""
  },
  "strained": {
    "pos": "Từ vựng (Word)",
    "ipa": "/strained/",
    "meaning_vi": "nghĩa trong bài đọc (strained)",
    "example": "Example context: strained in reading passage."
  },
  "inspire": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪnˈspaɪr/",
    "meaning_vi": "truyền cảm hứng cho (khuyến khích ai đó bằng cách khiến họ cảm thấy tự tin và háo hức làm điều gì đó)",
    "example": "Marius wants to inspire his students to become successful artists."
  },
  "withstand": {
    "pos": "Từ vựng (Word)",
    "ipa": "/withstand/",
    "meaning_vi": "nghĩa trong bài đọc (withstand)",
    "example": "Example context: withstand in reading passage."
  },
  "fluent": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fluent/",
    "meaning_vi": "nghĩa trong bài đọc (fluent)",
    "example": "Example context: fluent in reading passage."
  },
  "trap": {
    "pos": "Từ vựng (Word)",
    "ipa": "/trap/",
    "meaning_vi": "nghĩa trong bài đọc (trap)",
    "example": "Example context: trap in reading passage."
  },
  "shield": {
    "pos": "Từ vựng (Word)",
    "ipa": "/shield/",
    "meaning_vi": "nghĩa trong bài đọc (shield)",
    "example": "Example context: shield in reading passage."
  },
  "trưng bày hàng hóa bán lẻ trực tiếp": {
    "pos": "Từ vựng (Word)",
    "ipa": "/trưng bày hàng hóa bán lẻ trực tiếp/",
    "meaning_vi": "nghĩa trong bài đọc (trưng bày hàng hóa bán lẻ trực tiếp)",
    "example": "Example context: trưng bày hàng hóa bán lẻ trực tiếp in reading passage."
  },
  "replicate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/replicate/",
    "meaning_vi": "nghĩa trong bài đọc (replicate)",
    "example": "Example context: replicate in reading passage."
  },
  "integrate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/integrate/",
    "meaning_vi": "nghĩa trong bài đọc (integrate)",
    "example": "Example context: integrate in reading passage."
  },
  "verify": {
    "pos": "Từ vựng (Word)",
    "ipa": "/verify/",
    "meaning_vi": "nghĩa trong bài đọc (verify)",
    "example": "Example context: verify in reading passage."
  },
  "diagnose": {
    "pos": "Từ vựng (Word)",
    "ipa": "/diagnose/",
    "meaning_vi": "nghĩa trong bài đọc (diagnose)",
    "example": "Example context: diagnose in reading passage."
  },
  "prescribe": {
    "pos": "Từ vựng (Word)",
    "ipa": "/prescribe/",
    "meaning_vi": "nghĩa trong bài đọc (prescribe)",
    "example": "Example context: prescribe in reading passage."
  },
  "discipline": {
    "pos": "Từ vựng (Word)",
    "ipa": "/discipline/",
    "meaning_vi": "nghĩa trong bài đọc (discipline)",
    "example": "Example context: discipline in reading passage."
  },
  "discard": {
    "pos": "Từ vựng (Word)",
    "ipa": "/discard/",
    "meaning_vi": "nghĩa trong bài đọc (discard)",
    "example": "Example context: discard in reading passage."
  },
  "prudent": {
    "pos": "Từ vựng (Word)",
    "ipa": "/prudent/",
    "meaning_vi": "nghĩa trong bài đọc (prudent)",
    "example": "Example context: prudent in reading passage."
  },
  "durable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/durable/",
    "meaning_vi": "nghĩa trong bài đọc (durable)",
    "example": "Example context: durable in reading passage."
  },
  "forbidden": {
    "pos": "Từ vựng (Word)",
    "ipa": "/forbidden/",
    "meaning_vi": "nghĩa trong bài đọc (forbidden)",
    "example": "Example context: forbidden in reading passage."
  },
  "fossil": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fossil/",
    "meaning_vi": "nghĩa trong bài đọc (fossil)",
    "example": "Example context: fossil in reading passage."
  },
  "collaborate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/collaborate/",
    "meaning_vi": "nghĩa trong bài đọc (collaborate)",
    "example": "Example context: collaborate in reading passage."
  },
  "secrete": {
    "pos": "Từ vựng (Word)",
    "ipa": "/secrete/",
    "meaning_vi": "nghĩa trong bài đọc (secrete)",
    "example": "Example context: secrete in reading passage."
  },
  "do rác thải nhựa phủ kín bề mặt đáy biển": {
    "pos": "Từ vựng (Word)",
    "ipa": "/do rác thải nhựa phủ kín bề mặt đáy biển/",
    "meaning_vi": "nghĩa trong bài đọc (do rác thải nhựa phủ kín bề mặt đáy biển)",
    "example": "Example context: do rác thải nhựa phủ kín bề mặt đáy biển in reading passage."
  },
  "tranquil": {
    "pos": "Từ vựng (Word)",
    "ipa": "/tranquil/",
    "meaning_vi": "nghĩa trong bài đọc (tranquil)",
    "example": "Example context: tranquil in reading passage."
  },
  "sao chép và lưu trữ văn bản": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sao chép và lưu trữ văn bản/",
    "meaning_vi": "nghĩa trong bài đọc (sao chép và lưu trữ văn bản)",
    "example": "Example context: sao chép và lưu trữ văn bản in reading passage."
  },
  "sự củng cố, làm cho bền vững": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sự củng cố, làm cho bền vững/",
    "meaning_vi": "nghĩa trong bài đọc (sự củng cố, làm cho bền vững)",
    "example": "Example context: sự củng cố, làm cho bền vững in reading passage."
  },
  "hang": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hang/",
    "meaning_vi": "nghĩa trong bài đọc (hang)",
    "example": "Example context: hang in reading passage."
  },
  "beneficial": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˌbenɪˈfɪʃl/",
    "meaning_vi": "có lợi, mang lại điều tốt lành",
    "example": "Spaced repetition is highly beneficial for long-term retention."
  },
  "recycle": {
    "pos": "Động từ (Verb)",
    "ipa": "/riːˈsaɪkl/",
    "meaning_vi": "tái chế",
    "example": "Example context with Recycle."
  },
  "displace": {
    "pos": "Từ vựng (Word)",
    "ipa": "/displace/",
    "meaning_vi": "nghĩa trong bài đọc (displace)",
    "example": "Example context: displace in reading passage."
  },
  "do thiếu ánh sáng mặt trời mùa đông": {
    "pos": "Từ vựng (Word)",
    "ipa": "/do thiếu ánh sáng mặt trời mùa đông/",
    "meaning_vi": "nghĩa trong bài đọc (do thiếu ánh sáng mặt trời mùa đông)",
    "example": "Example context: do thiếu ánh sáng mặt trời mùa đông in reading passage."
  },
  "silent": {
    "pos": "Từ vựng (Word)",
    "ipa": "/silent/",
    "meaning_vi": "nghĩa trong bài đọc (silent)",
    "example": "Example context: silent in reading passage."
  },
  "rescue": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈreskjuː/",
    "meaning_vi": "giải cứu (để cứu ai đó hoặc điều gì đó khỏi tình huống nguy hiểm hoặc tổn hại)",
    "example": "The firemen were kind to rescue that cat from the top of the building."
  },
  "hiding": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hiding/",
    "meaning_vi": "nghĩa trong bài đọc (hiding)",
    "example": "Example context: hiding in reading passage."
  }
};
