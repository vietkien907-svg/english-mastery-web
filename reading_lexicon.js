// ============================================================================
// READING LEXICON DICTIONARY (PHÂN TÍCH TỪ VỰNG KHI CHỌN SAI & FLASHCARD)
// ============================================================================
const READING_WORDS_LEXICON = {
  "invaluable": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ɪnˈvæljuəbl/",
    "meaning_vi": "vô giá, rất quý báu",
    "example": "Authentic reading context: invaluable in practice."
  },
  "bountiful": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈbaʊntɪfl/",
    "meaning_vi": "dồi dào, phong phú, rộng lượng",
    "example": "Authentic reading context: bountiful in practice."
  },
  "fatigue": {
    "pos": "Danh từ (Noun)",
    "ipa": "/fəˈtiːɡ/",
    "meaning_vi": "sự mệt mỏi",
    "example": "Example context with Fatigue."
  },
  "spark": {
    "pos": "Động từ (Verb)",
    "ipa": "/spɑːk/",
    "meaning_vi": "tia lửa; khơi dậy, châm ngòi",
    "example": "Authentic reading context: spark in practice."
  },
  "exhausted": {
    "pos": "a",
    "ipa": "/ɪɡˈzɔːstɪd/",
    "meaning_vi": "kiệt sức",
    "example": "Example context with Exhausted."
  },
  "cultivate": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈkʌltɪveɪt/",
    "meaning_vi": "nuôi dưỡng, trau dồi, vun đắp",
    "example": "Authentic reading context: cultivate in practice."
  },
  "alleviate": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈliːvieɪt/",
    "meaning_vi": "làm giảm bớt, xoa dịu (nỗi đau, áp lực, nghèo đói)",
    "example": "Regular physical exercise alleviates mental stress."
  },
  "selling": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈselɪŋ/",
    "meaning_vi": "việc bán buôn, thương mại",
    "example": "Authentic reading context: selling in practice."
  },
  "do nước biển ấm lên khiến san hô đào thải vi tảo quang hợp": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "do nước biển ấm lên khiến san hô đào thải vi tảo quang hợp",
    "example": "Ngữ cảnh bài đọc: do nước biển ấm lên khiến san hô đào thải vi tảo quang hợp"
  },
  "inundate": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈɪnʌndeɪt/",
    "meaning_vi": "tràn ngập, làm ngập lụt, dồn dập",
    "example": "Authentic reading context: inundate in practice."
  },
  "precarious": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/prɪˈkeəriəs/",
    "meaning_vi": "bấp bênh, hiểm nghèo, không chắc chắn",
    "example": "Authentic reading context: precarious in practice."
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
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "sự quên lãng hoàn toàn",
    "example": "Ngữ cảnh bài đọc: sự quên lãng hoàn toàn"
  },
  "sự xáo trộn": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "sự xáo trộn",
    "example": "Ngữ cảnh bài đọc: sự xáo trộn"
  },
  "flexible": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈfleksəbəl/",
    "meaning_vi": "linh hoạt (có thể thay đổi hoặc dễ dàng thay đổi để phù hợp với mọi tình huống mới)",
    "example": "We can be flexible about when you start."
  },
  "unveil": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˌʌnˈveɪl/",
    "meaning_vi": "tiết lộ, khánh thành, ra mắt",
    "example": "Authentic reading context: unveil in practice."
  },
  "evolve": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪˈvɒlv/",
    "meaning_vi": "tiến hóa, phát triển dần theo thời gian",
    "example": "Authentic reading context: evolve in practice."
  },
  "interact": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˌɪntərˈækt/",
    "meaning_vi": "tương tác, tiếp xúc, giao lưu",
    "example": "Authentic reading context: interact in practice."
  },
  "plastic": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈplæstɪk/",
    "meaning_vi": "nhựa (một vật liệu hóa học mạnh nhẹ có thể mềm có thể tạo thành nhiều hình dạng khác nhau)",
    "example": "Pollution from plastic is causing serious problems in the oceans."
  },
  "detrimental": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˌdetrɪˈmentl/",
    "meaning_vi": "gây hại, bất lợi, thiệt hại",
    "example": "Authentic reading context: detrimental in practice."
  },
  "valuable": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈvæljuəbl/",
    "meaning_vi": "có giá trị, quý giá",
    "example": "Authentic reading context: valuable in practice."
  },
  "deceive": {
    "pos": "Động từ (Verb)",
    "ipa": "/dɪˈsiːv/",
    "meaning_vi": "lừa dối (che giấu sự thật về cách bạn sống cuộc sống của mình)",
    "example": "She didn't mean to deceive them, she just didn't want to tell them about her problem."
  },
  "hesitate": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈhezɪteɪt/",
    "meaning_vi": "ngập ngừng, do dự, phân vân",
    "example": "Authentic reading context: hesitate in practice."
  },
  "vanish": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈvænɪʃ/",
    "meaning_vi": "biến mất, tan biến hoàn toàn",
    "example": "Authentic reading context: vanish in practice."
  },
  "chạy bằng xăng sinh học": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "chạy bằng xăng sinh học",
    "example": "Ngữ cảnh bài đọc: chạy bằng xăng sinh học"
  },
  "collaboration / harmonious cooperation (sự cộng hưởng hợp tác)": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "collaboration / harmonious cooperation (sự cộng hưởng hợp tác)",
    "example": "Ngữ cảnh bài đọc: collaboration / harmonious cooperation (sự cộng hưởng hợp tác)"
  },
  "exponentially": {
    "pos": "Phó từ (Adverb)",
    "ipa": "/ˌekspəˈnenʃəli/",
    "meaning_vi": "theo cấp số nhân, cực kỳ nhanh chóng",
    "example": "Authentic reading context: exponentially in practice."
  },
  "perilous": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈperələs/",
    "meaning_vi": "nguy hiểm, đầy rủi ro",
    "example": "Authentic reading context: perilous in practice."
  },
  "punishments (hình phạt)": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "punishments (hình phạt)",
    "example": "Ngữ cảnh bài đọc: punishments (hình phạt)"
  },
  "borrow": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈbɑːroʊ/",
    "meaning_vi": "vay, mượn (đồ vật, tiền bạc)",
    "example": "Can I borrow your reference book for the exam?"
  },
  "hoàn toàn phản đối và lo sợ": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "hoàn toàn phản đối và lo sợ",
    "example": "Ngữ cảnh bài đọc: hoàn toàn phản đối và lo sợ"
  },
  "obscured": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/əbˈskjʊəd/",
    "meaning_vi": "bị che khuất, bị làm mờ mịt",
    "example": "Authentic reading context: obscured in practice."
  },
  "nutritious": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/njuːˈtrɪʃəs/",
    "meaning_vi": "giàu chất dinh dưỡng, bổ dưỡng",
    "example": "Authentic reading context: nutritious in practice."
  },
  "kể lại nhật ký một chuyến thám hiểm đại dương": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "kể lại nhật ký một chuyến thám hiểm đại dương",
    "example": "Ngữ cảnh bài đọc: kể lại nhật ký một chuyến thám hiểm đại dương"
  },
  "resilience": {
    "pos": "Danh từ (Noun)",
    "ipa": "/rɪˈzɪliəns/",
    "meaning_vi": "khả năng kiên cường phục hồi",
    "example": "Authentic reading context: resilience in practice."
  },
  "engage": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪnˈɡeɪdʒ/",
    "meaning_vi": "tham gia (thu hút sự chú ý của ai đó và khiến họ quan tâm)",
    "example": "The subject of the presentation didn't engage me."
  },
  "discharge": {
    "pos": "Động từ (Verb)",
    "ipa": "/dɪsˈtʃɑːdʒ/",
    "meaning_vi": "thải ra, phóng thích, xuất viện",
    "example": "Authentic reading context: discharge in practice."
  },
  "curate": {
    "pos": "Động từ (Verb)",
    "ipa": "/kjʊəˈreɪt/",
    "meaning_vi": "chọn lọc, tuyển lựa nội dung cẩn thận",
    "example": "Authentic reading context: curate in practice."
  },
  "disassemble": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˌdɪsəˈsembl/",
    "meaning_vi": "tháo rời các bộ phận, rã máy",
    "example": "Authentic reading context: disassemble in practice."
  },
  "destroy": {
    "pos": "Động từ (Verb)",
    "ipa": "/dɪˈstrɔɪ/",
    "meaning_vi": "hủy hoại",
    "example": ""
  },
  "stressful": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈstresfl/",
    "meaning_vi": "căng thẳng, gây áp lực lớn",
    "example": "Authentic reading context: stressful in practice."
  },
  "debate": {
    "pos": "Danh từ (Noun)",
    "ipa": "/dɪˈbeɪt/",
    "meaning_vi": "tranh luận",
    "example": ""
  },
  "burn": {
    "pos": "Động từ (Verb)",
    "ipa": "/bɜːn/",
    "meaning_vi": "đốt cháy, thiêu rụi",
    "example": "Authentic reading context: burn in practice."
  },
  "expansion": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ɪkˈspænʃn/",
    "meaning_vi": "sự mở rộng, sự bành trướng",
    "example": "Authentic reading context: expansion in practice."
  },
  "charitable": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈtʃærətəbl/",
    "meaning_vi": "từ thiện, nhân đức, hào phóng",
    "example": "Authentic reading context: charitable in practice."
  },
  "synthesize": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈsɪnθəsaɪz/",
    "meaning_vi": "tổng hợp lại các yếu tố",
    "example": "Authentic reading context: synthesize in practice."
  },
  "screen": {
    "pos": "Động từ / Danh từ",
    "ipa": "/skriːn/",
    "meaning_vi": "màn hình; sàng lọc, kiểm tra",
    "example": "Authentic reading context: screen in practice."
  },
  "infection": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ɪnˈfekʃn/",
    "meaning_vi": "sự lây nhiễm, nhiễm trùng",
    "example": "Authentic reading context: infection in practice."
  },
  "enhance": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪnˈhæns/",
    "meaning_vi": "nâng cao, làm tăng thêm, cải thiện",
    "example": "Daily reading significantly enhances vocabulary and comprehension."
  },
  "choke": {
    "pos": "Động từ (Verb)",
    "ipa": "/tʃəʊk/",
    "meaning_vi": "làm nghẹt thở, bóp nghẹt, tắc nghẽn",
    "example": "Authentic reading context: choke in practice."
  },
  "những thất bại thường gặp trong kinh doanh": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "những thất bại thường gặp trong kinh doanh",
    "example": "Ngữ cảnh bài đọc: những thất bại thường gặp trong kinh doanh"
  },
  "stabilize": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈsteɪbəlaɪz/",
    "meaning_vi": "ổn định lại, làm cho vững chắc",
    "example": "Authentic reading context: stabilize in practice."
  },
  "eliminate": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪˈlɪmɪneɪt/",
    "meaning_vi": "loại bỏ hoàn toàn, bài trừ",
    "example": "Modern filtration systems eliminate harmful bacteria from drinking water."
  },
  "cancel": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈkænsl/",
    "meaning_vi": "hủy bỏ, đình chỉ",
    "example": "Authentic reading context: cancel in practice."
  },
  "expand": {
    "pos": "Động từ (Verb)",
    "ipa": "/ɪkˈspænd/",
    "meaning_vi": "mở rộng",
    "example": ""
  },
  "wasteful": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈweɪstfl/",
    "meaning_vi": "lãng phí, hoang phí tài nguyên",
    "example": "Authentic reading context: wasteful in practice."
  },
  "distressed": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/dɪˈstrest/",
    "meaning_vi": "đau khổ, hoảng loạn, kiệt quệ",
    "example": "Authentic reading context: distressed in practice."
  },
  "clog": {
    "pos": "Động từ (Verb)",
    "ipa": "/klɒɡ/",
    "meaning_vi": "làm tắc nghẽn, cản trở lưu thông",
    "example": "Authentic reading context: clog in practice."
  },
  "agile": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈædʒaɪl/",
    "meaning_vi": "nhanh nhẹn, linh hoạt",
    "example": "Authentic reading context: agile in practice."
  },
  "một người bạn thân": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "một người bạn thân",
    "example": "Ngữ cảnh bài đọc: một người bạn thân"
  },
  "fade": {
    "pos": "Động từ (Verb)",
    "ipa": "/feɪd/",
    "meaning_vi": "phai nhạt, mờ dần theo thời gian",
    "example": "Authentic reading context: fade in practice."
  },
  "uninterrupted": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˌʌnɪntəˈrʌptɪd/",
    "meaning_vi": "liên tục, không bị gián đoạn",
    "example": "Authentic reading context: uninterrupted in practice."
  },
  "unseen": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˌʌnˈsiːn/",
    "meaning_vi": "vô hình, không nhìn thấy được",
    "example": "Authentic reading context: unseen in practice."
  },
  "plant": {
    "pos": "Danh từ / Động từ",
    "ipa": "/plɑːnt/",
    "meaning_vi": "thực vật; nhà máy xí nghiệp; gieo trồng",
    "example": "Authentic reading context: plant in practice."
  },
  "waste": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˈweɪst/",
    "meaning_vi": "rác thải, chất thải, sự lãng phí",
    "example": ""
  },
  "timeless": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈtaɪmləs/",
    "meaning_vi": "vĩnh cửu, vượt thời gian",
    "example": "Authentic reading context: timeless in practice."
  },
  "manufacture": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˌmænjuˈfæktʃə/",
    "meaning_vi": "sản xuất, chế tạo quy mô lớn",
    "example": "Authentic reading context: manufacture in practice."
  },
  "forgive": {
    "pos": "Động từ (Verb)",
    "ipa": "/fəˈɡɪv/",
    "meaning_vi": "tha thứ, dung thứ lỗi lầm",
    "example": "Authentic reading context: forgive in practice."
  },
  "fragile": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈfrædʒl/",
    "meaning_vi": "mong manh, dễ vỡ, yếu ớt",
    "example": "The ancient glassware is extremely fragile and requires delicate handling."
  },
  "confused": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/kənˈfjuːzd/",
    "meaning_vi": "bối rối, lúng túng, lẫn lộn",
    "example": "Authentic reading context: confused in practice."
  },
  "isolated": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈaɪsəleɪtɪd/",
    "meaning_vi": "bị cô lập, cách biệt",
    "example": "Authentic reading context: isolated in practice."
  },
  "procrastinate": {
    "pos": "Động từ (Verb)",
    "ipa": "/prəʊˈkræstɪneɪt/",
    "meaning_vi": "trì hoãn, chần chừ việc cần làm",
    "example": "Authentic reading context: procrastinate in practice."
  },
  "prevent": {
    "pos": "Động từ (Verb)",
    "ipa": "/prɪˈvent/",
    "meaning_vi": "ngăn ngừa, phòng ngừa",
    "example": "Authentic reading context: prevent in practice."
  },
  "sự tận tâm kiên trì và phương pháp có cấu trúc (consistent dedication and structured methods)": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "sự tận tâm kiên trì và phương pháp có cấu trúc (consistent dedication and structured methods)",
    "example": "Ngữ cảnh bài đọc: sự tận tâm kiên trì và phương pháp có cấu trúc (consistent dedication and structured methods)"
  },
  "sterile": {
    "pos": "a",
    "ipa": "/ˈsterəl/",
    "meaning_vi": "vô sinh",
    "example": "Example context with Sterile."
  },
  "protective": {
    "pos": "Tính từ (Adjective)",
    "ipa": "/prəˈtektɪv/",
    "meaning_vi": "bảo vệ, che chở, bảo bọc",
    "example": "Authentic reading context: protective in practice."
  },
  "neocortex": {
    "pos": "Danh từ (Noun)",
    "ipa": "/ˌniːəʊˈkɔːteks/",
    "meaning_vi": "vỏ não mới (vùng điều khiển tư duy bậc cao)",
    "example": "Authentic reading context: neocortex in practice."
  },
  "achieve": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈtʃiːv/",
    "meaning_vi": "đạt được, hoàn thành, chinh phục (mục tiêu)",
    "example": "Consistent daily practice helps learners achieve fluency."
  },
  "khi vừa mới chợp mắt": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "khi vừa mới chợp mắt",
    "example": "Ngữ cảnh bài đọc: khi vừa mới chợp mắt"
  },
  "chở được khối lượng hàng chục tấn": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "chở được khối lượng hàng chục tấn",
    "example": "Ngữ cảnh bài đọc: chở được khối lượng hàng chục tấn"
  },
  "sự suy tàn": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "sự suy tàn",
    "example": "Ngữ cảnh bài đọc: sự suy tàn"
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
    "pos": "Tính từ (Adjective)",
    "ipa": "/ˈɔː ɪnspaɪərɪŋ/",
    "meaning_vi": "gây kinh ngạc, đáng kính nể sâu sắc",
    "example": "Authentic reading context: awe-inspiring in practice."
  },
  "reclaim": {
    "pos": "Từ vựng (Word)",
    "ipa": "/reclaim/",
    "meaning_vi": "đòi lại",
    "example": "Example sentence with reclaim in context."
  },
  "preserve": {
    "pos": "Từ vựng (Word)",
    "ipa": "/preserve/",
    "meaning_vi": "bảo tồn",
    "example": "Example sentence with preserve in context."
  },
  "classical": {
    "pos": "Từ vựng (Word)",
    "ipa": "/classical/",
    "meaning_vi": "cổ điển",
    "example": "Example sentence with classical in context."
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
    "meaning_vi": "đáng chú ý",
    "example": "Example sentence with remarkable in context."
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
    "meaning_vi": "tốn kém",
    "example": "Example sentence with costly in context."
  },
  "flourishing": {
    "pos": "Từ vựng (Word)",
    "ipa": "/flourishing/",
    "meaning_vi": "hưng thịnh",
    "example": "Example sentence with flourishing in context."
  },
  "empower": {
    "pos": "Từ vựng (Word)",
    "ipa": "/empower/",
    "meaning_vi": "trao quyền",
    "example": "Example sentence with empower in context."
  },
  "hydrate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hydrate/",
    "meaning_vi": "ngậm nước",
    "example": "Example sentence with hydrate in context."
  },
  "nourish": {
    "pos": "Từ vựng (Word)",
    "ipa": "/nourish/",
    "meaning_vi": "nuôi",
    "example": "Example sentence with nourish in context."
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
    "meaning_vi": "lãng phí",
    "example": "Example sentence with wasted in context."
  },
  "drought": {
    "pos": "Từ vựng (Word)",
    "ipa": "/drought/",
    "meaning_vi": "hạn hán",
    "example": "Example sentence with drought in context."
  },
  "viable": {
    "pos": "adjective",
    "ipa": "/ˈvaɪəbl/",
    "meaning_vi": "Khả thi, có thể đứng vững sinh lời",
    "example": "Example context with viable."
  },
  "obsolete": {
    "pos": "a",
    "ipa": "/ˌɑːbsəˈliːt/",
    "meaning_vi": "lỗi thời",
    "example": ""
  },
  "khi đang tập thể dục buổi sáng": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "khi đang tập thể dục buổi sáng",
    "example": "Ngữ cảnh bài đọc: khi đang tập thể dục buổi sáng"
  },
  "thờ ơ không quan tâm": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "thờ ơ không quan tâm",
    "example": "Ngữ cảnh bài đọc: thờ ơ không quan tâm"
  },
  "do các loài cá ăn hết san hô": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "do các loài cá ăn hết san hô",
    "example": "Ngữ cảnh bài đọc: do các loài cá ăn hết san hô"
  },
  "notify": {
    "pos": "Từ vựng (Word)",
    "ipa": "/notify/",
    "meaning_vi": "thông báo",
    "example": "Example sentence with notify in context."
  },
  "prosperous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/prosperous/",
    "meaning_vi": "thịnh vượng",
    "example": "Example sentence with prosperous in context."
  },
  "store": {
    "pos": "Từ vựng (Word)",
    "ipa": "/store/",
    "meaning_vi": "cửa hàng",
    "example": "Example sentence with store in context."
  },
  "parched": {
    "pos": "Từ vựng (Word)",
    "ipa": "/parched/",
    "meaning_vi": "khô",
    "example": "Example sentence with parched in context."
  },
  "harmonious": {
    "pos": "Từ vựng (Word)",
    "ipa": "/harmonious/",
    "meaning_vi": "hài hòa",
    "example": "Example sentence with harmonious in context."
  },
  "interested in": {
    "pos": "Từ vựng (Word)",
    "ipa": "/interested in/",
    "meaning_vi": "quan tâm đến",
    "example": "Example sentence with interested in in context."
  },
  "longevity": {
    "pos": "Từ vựng (Word)",
    "ipa": "/longevity/",
    "meaning_vi": "tuổi thọ",
    "example": "Example sentence with longevity in context."
  },
  "discourage": {
    "pos": "Từ vựng (Word)",
    "ipa": "/discourage/",
    "meaning_vi": "làm nản lòng",
    "example": "Example sentence with discourage in context."
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
    "meaning_vi": "khan hiếm",
    "example": "Example sentence with scarce in context."
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
    "meaning_vi": "phớt lờ",
    "example": "Example sentence with ignoring in context."
  },
  "deplete": {
    "pos": "Từ vựng (Word)",
    "ipa": "/deplete/",
    "meaning_vi": "cạn kiệt",
    "example": "Example sentence with deplete in context."
  },
  "compact": {
    "pos": "Từ vựng (Word)",
    "ipa": "/compact/",
    "meaning_vi": "nhỏ gọn",
    "example": "Example sentence with compact in context."
  },
  "precise": {
    "pos": "Từ vựng (Word)",
    "ipa": "/precise/",
    "meaning_vi": "chính xác",
    "example": "Example sentence with precise in context."
  },
  "trí tuệ cảm xúc và tư duy phản biện": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "trí tuệ cảm xúc và tư duy phản biện",
    "example": "Ngữ cảnh bài đọc: trí tuệ cảm xúc và tư duy phản biện"
  },
  "phân loại hình ảnh": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "phân loại hình ảnh",
    "example": "Ngữ cảnh bài đọc: phân loại hình ảnh"
  },
  "wither": {
    "pos": "Từ vựng (Word)",
    "ipa": "/wither/",
    "meaning_vi": "khô héo",
    "example": "Example sentence with wither in context."
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
    "meaning_vi": "Chào mừng",
    "example": "Example sentence with welcome in context."
  },
  "manipulated": {
    "pos": "Từ vựng (Word)",
    "ipa": "/manipulated/",
    "meaning_vi": "bị thao túng",
    "example": "Example sentence with manipulated in context."
  },
  "landfills": {
    "pos": "Từ vựng (Word)",
    "ipa": "/landfills/",
    "meaning_vi": "bãi chôn lấp",
    "example": "Example sentence with landfills in context."
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
    "meaning_vi": "đi qua",
    "example": "Example sentence with traverse in context."
  },
  "rejuvenate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/rejuvenate/",
    "meaning_vi": "trẻ hóa",
    "example": "Example sentence with rejuvenate in context."
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
    "meaning_vi": "tắc nghẽn",
    "example": "Example sentence with congested in context."
  },
  "mitigate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/mitigate/",
    "meaning_vi": "giảm nhẹ",
    "example": "Example sentence with mitigate in context."
  },
  "conventional": {
    "pos": "Từ vựng (Word)",
    "ipa": "/conventional/",
    "meaning_vi": "truyền thống",
    "example": "Example sentence with conventional in context."
  },
  "sturdy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sturdy/",
    "meaning_vi": "vững chắc",
    "example": "Example sentence with sturdy in context."
  },
  "communicate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/communicate/",
    "meaning_vi": "giao tiếp",
    "example": "Example sentence with communicate in context."
  },
  "track": {
    "pos": "Từ vựng (Word)",
    "ipa": "/track/",
    "meaning_vi": "theo dõi",
    "example": "Example sentence with track in context."
  },
  "frail": {
    "pos": "Từ vựng (Word)",
    "ipa": "/frail/",
    "meaning_vi": "yếu đuối",
    "example": "Example sentence with frail in context."
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
    "meaning_vi": "tháo dỡ",
    "example": "Example sentence with dismantle in context."
  },
  "purify": {
    "pos": "Từ vựng (Word)",
    "ipa": "/purify/",
    "meaning_vi": "thanh lọc",
    "example": "Example sentence with purify in context."
  },
  "pleasure": {
    "pos": "Từ vựng (Word)",
    "ipa": "/pleasure/",
    "meaning_vi": "vinh hạnh",
    "example": "Example sentence with pleasure in context."
  },
  "poisoning": {
    "pos": "Từ vựng (Word)",
    "ipa": "/poisoning/",
    "meaning_vi": "đầu độc",
    "example": "Example sentence with poisoning in context."
  },
  "protect": {
    "pos": "Từ vựng (Word)",
    "ipa": "/protect/",
    "meaning_vi": "bảo vệ",
    "example": "Example sentence with protect in context."
  },
  "intellectual": {
    "pos": "Từ vựng (Word)",
    "ipa": "/intellectual/",
    "meaning_vi": "trí tuệ",
    "example": "Example sentence with intellectual in context."
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
    "meaning_vi": "có thể uống được",
    "example": "Example sentence with drinkable in context."
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
    "meaning_vi": "gợi lên",
    "example": "Example sentence with evoke in context."
  },
  "attract": {
    "pos": "Từ vựng (Word)",
    "ipa": "/attract/",
    "meaning_vi": "thu hút",
    "example": "Example sentence with attract in context."
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
    "meaning_vi": "sáng suốt",
    "example": "Example sentence with discerning in context."
  },
  "wealthy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/wealthy/",
    "meaning_vi": "giàu có",
    "example": "Example sentence with wealthy in context."
  },
  "supply": {
    "pos": "Từ vựng (Word)",
    "ipa": "/supply/",
    "meaning_vi": "cung cấp",
    "example": "Example sentence with supply in context."
  },
  "noisy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/noisy/",
    "meaning_vi": "ồn ào",
    "example": "Example sentence with noisy in context."
  },
  "transfer": {
    "pos": "Từ vựng (Word)",
    "ipa": "/transfer/",
    "meaning_vi": "chuyển khoản",
    "example": "Example sentence with transfer in context."
  },
  "ông nội của anh ấy": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "ông nội của anh ấy",
    "example": "Ngữ cảnh bài đọc: ông nội của anh ấy"
  },
  "respectful": {
    "pos": "Từ vựng (Word)",
    "ipa": "/respectful/",
    "meaning_vi": "kính trọng",
    "example": "Example sentence with respectful in context."
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
    "meaning_vi": "thuyết phục",
    "example": "Example sentence with persuade in context."
  },
  "multiply": {
    "pos": "Từ vựng (Word)",
    "ipa": "/multiply/",
    "meaning_vi": "nhân lên",
    "example": "Example sentence with multiply in context."
  },
  "celebration": {
    "pos": "Từ vựng (Word)",
    "ipa": "/celebration/",
    "meaning_vi": "lễ ăn mừng",
    "example": "Example sentence with celebration in context."
  },
  "clean": {
    "pos": "Từ vựng (Word)",
    "ipa": "/clean/",
    "meaning_vi": "lau dọn",
    "example": "Example sentence with clean in context."
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
    "meaning_vi": "lướt đi",
    "example": "Example sentence with glide in context."
  },
  "archive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/archive/",
    "meaning_vi": "lưu trữ",
    "example": "Example sentence with archive in context."
  },
  "impossible": {
    "pos": "Từ vựng (Word)",
    "ipa": "/impossible/",
    "meaning_vi": "không thể nào",
    "example": "Example sentence with impossible in context."
  },
  "lower": {
    "pos": "Từ vựng (Word)",
    "ipa": "/lower/",
    "meaning_vi": "thấp hơn",
    "example": "Example sentence with lower in context."
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
    "meaning_vi": "ma sát",
    "example": "Example sentence with friction in context."
  },
  "phân tích thành phần hóa học của nước biển sâu": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "phân tích thành phần hóa học của nước biển sâu",
    "example": "Ngữ cảnh bài đọc: phân tích thành phần hóa học của nước biển sâu"
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
    "meaning_vi": "đã nhạt dần",
    "example": "Example sentence with faded in context."
  },
  "enrich": {
    "pos": "Từ vựng (Word)",
    "ipa": "/enrich/",
    "meaning_vi": "làm giàu",
    "example": "Example sentence with enrich in context."
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
    "meaning_vi": "căn chỉnh",
    "example": "Example sentence with align in context."
  },
  "substitute": {
    "pos": "Từ vựng (Word)",
    "ipa": "/substitute/",
    "meaning_vi": "thay thế",
    "example": "Example sentence with substitute in context."
  },
  "calculate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/calculate/",
    "meaning_vi": "tính toán",
    "example": "Example sentence with calculate in context."
  },
  "welcoming": {
    "pos": "Từ vựng (Word)",
    "ipa": "/welcoming/",
    "meaning_vi": "chào đón",
    "example": "Example sentence with welcoming in context."
  },
  "propagate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/propagate/",
    "meaning_vi": "tuyên truyền",
    "example": "Example sentence with propagate in context."
  },
  "noise": {
    "pos": "Từ vựng (Word)",
    "ipa": "/noise/",
    "meaning_vi": "tiếng ồn",
    "example": "Example sentence with noise in context."
  },
  "luồn lách êm ái trong ngõ hẹp và không thải khí độc": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "luồn lách êm ái trong ngõ hẹp và không thải khí độc",
    "example": "Ngữ cảnh bài đọc: luồn lách êm ái trong ngõ hẹp và không thải khí độc"
  },
  "equitable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/equitable/",
    "meaning_vi": "công bằng",
    "example": "Example sentence with equitable in context."
  },
  "filter": {
    "pos": "Từ vựng (Word)",
    "ipa": "/filter/",
    "meaning_vi": "lọc",
    "example": "Example sentence with filter in context."
  },
  "scrutinize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/scrutinize/",
    "meaning_vi": "xem xét kỹ lưỡng",
    "example": "Example sentence with scrutinize in context."
  },
  "detect": {
    "pos": "Từ vựng (Word)",
    "ipa": "/detect/",
    "meaning_vi": "phát hiện",
    "example": "Example sentence with detect in context."
  },
  "manageable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/manageable/",
    "meaning_vi": "có thể quản lý được",
    "example": "Example sentence with manageable in context."
  },
  "transplanting": {
    "pos": "Từ vựng (Word)",
    "ipa": "/transplanting/",
    "meaning_vi": "cấy ghép",
    "example": "Example sentence with transplanting in context."
  },
  "debts (nợ nần)": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "debts (nợ nần)",
    "example": "Ngữ cảnh bài đọc: debts (nợ nần)"
  },
  "passive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/passive/",
    "meaning_vi": "thụ động",
    "example": "Example sentence with passive in context."
  },
  "suspend": {
    "pos": "Từ vựng (Word)",
    "ipa": "/suspend/",
    "meaning_vi": "đình chỉ",
    "example": "Example sentence with suspend in context."
  },
  "life-saving": {
    "pos": "Từ vựng (Word)",
    "ipa": "/life-saving/",
    "meaning_vi": "cứu mạng",
    "example": "Example sentence with life-saving in context."
  },
  "assess": {
    "pos": "Động từ (Verb)",
    "ipa": "/əˈses/",
    "meaning_vi": "đánh giá, thẩm định (chất lượng, mức độ)",
    "example": "Teachers assess students' progress through weekly mock tests."
  },
  "giá trị cảm xúc thiêng liêng của các kỷ vật gia đình": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "giá trị cảm xúc thiêng liêng của các kỷ vật gia đình",
    "example": "Ngữ cảnh bài đọc: giá trị cảm xúc thiêng liêng của các kỷ vật gia đình"
  },
  "encode": {
    "pos": "Từ vựng (Word)",
    "ipa": "/encode/",
    "meaning_vi": "mã hóa",
    "example": "Example sentence with encode in context."
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
    "meaning_vi": "nhanh",
    "example": "Example sentence with swift in context."
  },
  "confuse": {
    "pos": "Động từ (Verb)",
    "ipa": "/kənˈfjuːz/",
    "meaning_vi": "gây bối rối, gây nhầm lẫn",
    "example": ""
  },
  "chứa hàng hải ngoại": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "chứa hàng hải ngoại",
    "example": "Ngữ cảnh bài đọc: chứa hàng hải ngoại"
  },
  "healthy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/healthy/",
    "meaning_vi": "khỏe mạnh",
    "example": "Example sentence with healthy in context."
  },
  "obsess": {
    "pos": "Từ vựng (Word)",
    "ipa": "/obsess/",
    "meaning_vi": "ám ảnh",
    "example": "Example sentence with obsess in context."
  },
  "tốc độ tính toán số liệu": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "tốc độ tính toán số liệu",
    "example": "Ngữ cảnh bài đọc: tốc độ tính toán số liệu"
  },
  "breathe": {
    "pos": "Từ vựng (Word)",
    "ipa": "/breathe/",
    "meaning_vi": "thở",
    "example": "Example sentence with breathe in context."
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
    "meaning_vi": "huyền thoại",
    "example": "Example sentence with legendary in context."
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
    "meaning_vi": "tái sinh",
    "example": "Example sentence with repopulate in context."
  },
  "polluting": {
    "pos": "Từ vựng (Word)",
    "ipa": "/polluting/",
    "meaning_vi": "gây ô nhiễm",
    "example": "Example sentence with polluting in context."
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
    "meaning_vi": "tối ưu hóa",
    "example": "Example sentence with optimize in context."
  },
  "green": {
    "pos": "Từ vựng (Word)",
    "ipa": "/green/",
    "meaning_vi": "màu xanh lá",
    "example": "Example sentence with green in context."
  },
  "erect": {
    "pos": "Từ vựng (Word)",
    "ipa": "/erect/",
    "meaning_vi": "dựng lên",
    "example": "Example sentence with erect in context."
  },
  "confined": {
    "pos": "Từ vựng (Word)",
    "ipa": "/confined/",
    "meaning_vi": "hạn chế",
    "example": "Example sentence with confined in context."
  },
  "roast": {
    "pos": "Từ vựng (Word)",
    "ipa": "/roast/",
    "meaning_vi": "thịt nướng",
    "example": "Example sentence with roast in context."
  },
  "flourish": {
    "pos": "Từ vựng (Word)",
    "ipa": "/flourish/",
    "meaning_vi": "phát triển mạnh mẽ",
    "example": "Example sentence with flourish in context."
  },
  "đặt gần khu dân cư để rút ngắn quãng đường giao hàng chặng cuối": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "đặt gần khu dân cư để rút ngắn quãng đường giao hàng chặng cuối",
    "example": "Ngữ cảnh bài đọc: đặt gần khu dân cư để rút ngắn quãng đường giao hàng chặng cuối"
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
    "meaning_vi": "trò chuyện",
    "example": "Example sentence with converse in context."
  },
  "carve": {
    "pos": "Từ vựng (Word)",
    "ipa": "/carve/",
    "meaning_vi": "khắc",
    "example": "Example sentence with carve in context."
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
    "meaning_vi": "có hiệu quả",
    "example": "Example sentence with efficient in context."
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
    "meaning_vi": "bổ sung",
    "example": "Example sentence with replenish in context."
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
    "meaning_vi": "ăn mòn",
    "example": "Example sentence with erode in context."
  },
  "secure": {
    "pos": "Từ vựng (Word)",
    "ipa": "/secure/",
    "meaning_vi": "chắc chắn",
    "example": "Example sentence with secure in context."
  },
  "coordinate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/coordinate/",
    "meaning_vi": "điều phối",
    "example": "Example sentence with coordinate in context."
  },
  "thrive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/thrive/",
    "meaning_vi": "phát triển mạnh",
    "example": "Example sentence with thrive in context."
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
    "meaning_vi": "triển khai",
    "example": "Example sentence with deploy in context."
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
    "meaning_vi": "kích thích",
    "example": "Example sentence with stimuli in context."
  },
  "harvest": {
    "pos": "Từ vựng (Word)",
    "ipa": "/harvest/",
    "meaning_vi": "mùa gặt",
    "example": "Example sentence with harvest in context."
  },
  "connect": {
    "pos": "Từ vựng (Word)",
    "ipa": "/connect/",
    "meaning_vi": "kết nối",
    "example": "Example sentence with connect in context."
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
    "meaning_vi": "bảo tồn",
    "example": "Example sentence with conserve in context."
  },
  "slash": {
    "pos": "Từ vựng (Word)",
    "ipa": "/slash/",
    "meaning_vi": "gạch chéo",
    "example": "Example sentence with slash in context."
  },
  "fertile": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fertile/",
    "meaning_vi": "màu mỡ",
    "example": "Example sentence with fertile in context."
  },
  "discarding": {
    "pos": "Từ vựng (Word)",
    "ipa": "/discarding/",
    "meaning_vi": "vứt bỏ",
    "example": "Example sentence with discarding in context."
  },
  "bỏ cuộc ngay khi gặp khó khăn": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "bỏ cuộc ngay khi gặp khó khăn",
    "example": "Ngữ cảnh bài đọc: bỏ cuộc ngay khi gặp khó khăn"
  },
  "counterfeit": {
    "pos": "Từ vựng (Word)",
    "ipa": "/counterfeit/",
    "meaning_vi": "giả mạo",
    "example": "Example sentence with counterfeit in context."
  },
  "reframe": {
    "pos": "Từ vựng (Word)",
    "ipa": "/reframe/",
    "meaning_vi": "điều chỉnh lại",
    "example": "Example sentence with reframe in context."
  },
  "khi đang ăn sáng": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "khi đang ăn sáng",
    "example": "Ngữ cảnh bài đọc: khi đang ăn sáng"
  },
  "uplifting": {
    "pos": "Từ vựng (Word)",
    "ipa": "/uplifting/",
    "meaning_vi": "nâng cao tinh thần",
    "example": "Example sentence with uplifting in context."
  },
  "nguy cơ tai nạn giao thông do xe tải giao hàng": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "nguy cơ tai nạn giao thông do xe tải giao hàng",
    "example": "Ngữ cảnh bài đọc: nguy cơ tai nạn giao thông do xe tải giao hàng"
  },
  "deteriorate": {
    "pos": "Động từ (Verb)",
    "ipa": "/dɪˈtɪriəreɪt/",
    "meaning_vi": "xuống cấp, xấu đi, giảm sút chất lượng",
    "example": "Without regular maintenance, historical buildings deteriorate rapidly."
  },
  "bố mẹ anh ấy": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "bố mẹ anh ấy",
    "example": "Ngữ cảnh bài đọc: bố mẹ anh ấy"
  },
  "weakness": {
    "pos": "Từ vựng (Word)",
    "ipa": "/weakness/",
    "meaning_vi": "điểm yếu",
    "example": "Example sentence with weakness in context."
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
    "meaning_vi": "tập trung",
    "example": "Example sentence with concentrate in context."
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
    "meaning_vi": "đốt cháy",
    "example": "Example sentence with ignite in context."
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
    "meaning_vi": "tràn đầy năng lượng",
    "example": "Example sentence with energized in context."
  },
  "anchor": {
    "pos": "Từ vựng (Word)",
    "ipa": "/anchor/",
    "meaning_vi": "neo",
    "example": "Example sentence with anchor in context."
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
    "meaning_vi": "đổi mới",
    "example": "Example sentence with innovate in context."
  },
  "hostile": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hostile/",
    "meaning_vi": "thù địch",
    "example": "Example sentence with hostile in context."
  },
  "transformative": {
    "pos": "Từ vựng (Word)",
    "ipa": "/transformative/",
    "meaning_vi": "biến đổi",
    "example": "Example sentence with transformative in context."
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
    "meaning_vi": "bảo hiểm",
    "example": "Example sentence with insure in context."
  },
  "productive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/productive/",
    "meaning_vi": "năng suất",
    "example": "Example sentence with productive in context."
  },
  "regulate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/regulate/",
    "meaning_vi": "điều tiết",
    "example": "Example sentence with regulate in context."
  },
  "extrude": {
    "pos": "Từ vựng (Word)",
    "ipa": "/extrude/",
    "meaning_vi": "đùn ra",
    "example": "Example sentence with extrude in context."
  },
  "motivate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/motivate/",
    "meaning_vi": "động viên",
    "example": "Example sentence with motivate in context."
  },
  "revolutionary": {
    "pos": "Từ vựng (Word)",
    "ipa": "/revolutionary/",
    "meaning_vi": "mang tính cách mạng",
    "example": "Example sentence with revolutionary in context."
  },
  "irrational": {
    "pos": "Từ vựng (Word)",
    "ipa": "/irrational/",
    "meaning_vi": "phi lý",
    "example": "Example sentence with irrational in context."
  },
  "golden": {
    "pos": "Từ vựng (Word)",
    "ipa": "/golden/",
    "meaning_vi": "vàng",
    "example": "Example sentence with golden in context."
  },
  "regenerate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/regenerate/",
    "meaning_vi": "tái sinh",
    "example": "Example sentence with regenerate in context."
  },
  "tuyển dụng tài xế": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "tuyển dụng tài xế",
    "example": "Ngữ cảnh bài đọc: tuyển dụng tài xế"
  },
  "refuse": {
    "pos": "Từ vựng (Word)",
    "ipa": "/refuse/",
    "meaning_vi": "từ chối",
    "example": "Example sentence with refuse in context."
  },
  "chiến lược logistics xanh nhằm phát triển thương mại điện tử bền vững": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "chiến lược logistics xanh nhằm phát triển thương mại điện tử bền vững",
    "example": "Ngữ cảnh bài đọc: chiến lược logistics xanh nhằm phát triển thương mại điện tử bền vững"
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
    "meaning_vi": "làm mất ổn định",
    "example": "Example sentence with destabilize in context."
  },
  "invite": {
    "pos": "Từ vựng (Word)",
    "ipa": "/invite/",
    "meaning_vi": "mời",
    "example": "Example sentence with invite in context."
  },
  "tránh né hoàn toàn mọi thử thách": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "tránh né hoàn toàn mọi thử thách",
    "example": "Ngữ cảnh bài đọc: tránh né hoàn toàn mọi thử thách"
  },
  "compound": {
    "pos": "Từ vựng (Word)",
    "ipa": "/compound/",
    "meaning_vi": "hợp chất",
    "example": "Example sentence with compound in context."
  },
  "melt": {
    "pos": "Từ vựng (Word)",
    "ipa": "/melt/",
    "meaning_vi": "tan chảy",
    "example": "Example sentence with melt in context."
  },
  "optimal": {
    "pos": "Từ vựng (Word)",
    "ipa": "/optimal/",
    "meaning_vi": "tối ưu",
    "example": "Example sentence with optimal in context."
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
    "meaning_vi": "nước muối",
    "example": "Example sentence with saline in context."
  },
  "ergonomic": {
    "pos": "Từ vựng (Word)",
    "ipa": "/ergonomic/",
    "meaning_vi": "công thái học",
    "example": "Example sentence with ergonomic in context."
  },
  "rigid": {
    "pos": "Từ vựng (Word)",
    "ipa": "/rigid/",
    "meaning_vi": "cứng nhắc",
    "example": "Example sentence with rigid in context."
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
    "meaning_vi": "phân chia",
    "example": "Example sentence with dispense in context."
  },
  "white": {
    "pos": "Từ vựng (Word)",
    "ipa": "/white/",
    "meaning_vi": "trắng",
    "example": "Example sentence with white in context."
  },
  "damage": {
    "pos": "Động từ (Verb)",
    "ipa": "/ˈdæmɪdʒ/",
    "meaning_vi": "gây hư hại, làm tổn thương, phá hủy",
    "example": "Chronic stress can damage cognitive performance."
  },
  "fulfilling": {
    "pos": "adjective",
    "ipa": "/fʊlˈfɪlɪŋ/",
    "meaning_vi": "Đem lại sự mãn nguyện, ý nghĩa",
    "example": "Example context with fulfilling."
  },
  "ethical": {
    "pos": "Từ vựng (Word)",
    "ipa": "/ethical/",
    "meaning_vi": "đạo đức",
    "example": "Example sentence with ethical in context."
  },
  "cách dọn dẹp căn gác xép bừa bộn": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "cách dọn dẹp căn gác xép bừa bộn",
    "example": "Ngữ cảnh bài đọc: cách dọn dẹp căn gác xép bừa bộn"
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
    "meaning_vi": "giải cấu trúc",
    "example": "Example sentence with deconstruct in context."
  },
  "circulate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/circulate/",
    "meaning_vi": "lưu thông",
    "example": "Example sentence with circulate in context."
  },
  "groundbreaking": {
    "pos": "Từ vựng (Word)",
    "ipa": "/groundbreaking/",
    "meaning_vi": "đột phá",
    "example": "Example sentence with groundbreaking in context."
  },
  "observe": {
    "pos": "Từ vựng (Word)",
    "ipa": "/observe/",
    "meaning_vi": "quan sát",
    "example": "Example sentence with observe in context."
  },
  "một người thợ mộc": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "một người thợ mộc",
    "example": "Ngữ cảnh bài đọc: một người thợ mộc"
  },
  "target": {
    "pos": "Từ vựng (Word)",
    "ipa": "/target/",
    "meaning_vi": "mục tiêu",
    "example": "Example sentence with target in context."
  },
  "thriving": {
    "pos": "Từ vựng (Word)",
    "ipa": "/thriving/",
    "meaning_vi": "thịnh vượng",
    "example": "Example sentence with thriving in context."
  },
  "claustrophobic": {
    "pos": "Từ vựng (Word)",
    "ipa": "/claustrophobic/",
    "meaning_vi": "ngột ngạt",
    "example": "Example sentence with claustrophobic in context."
  },
  "trình bày hiện tượng tẩy trắng san hô và các giải pháp bảo vệ hệ sinh thái biển": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "trình bày hiện tượng tẩy trắng san hô và các giải pháp bảo vệ hệ sinh thái biển",
    "example": "Ngữ cảnh bài đọc: trình bày hiện tượng tẩy trắng san hô và các giải pháp bảo vệ hệ sinh thái biển"
  },
  "capture": {
    "pos": "Từ vựng (Word)",
    "ipa": "/capture/",
    "meaning_vi": "chiếm lấy",
    "example": "Example sentence with capture in context."
  },
  "guarantee": {
    "pos": "Từ vựng (Word)",
    "ipa": "/guarantee/",
    "meaning_vi": "bảo đảm",
    "example": "Example sentence with guarantee in context."
  },
  "hazardous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hazardous/",
    "meaning_vi": "nguy hiểm",
    "example": "Example sentence with hazardous in context."
  },
  "cách buôn bán đồ cũ sinh lời": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "cách buôn bán đồ cũ sinh lời",
    "example": "Ngữ cảnh bài đọc: cách buôn bán đồ cũ sinh lời"
  },
  "produce": {
    "pos": "Từ vựng (Word)",
    "ipa": "/produce/",
    "meaning_vi": "sản xuất",
    "example": "Example sentence with produce in context."
  },
  "sự thất bại của các cửa hàng truyền thống": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "sự thất bại của các cửa hàng truyền thống",
    "example": "Ngữ cảnh bài đọc: sự thất bại của các cửa hàng truyền thống"
  },
  "tủy sống": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "tủy sống",
    "example": "Ngữ cảnh bài đọc: tủy sống"
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
    "meaning_vi": "dân chủ hóa",
    "example": "Example sentence with democratize in context."
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
    "meaning_vi": "cắt bớt",
    "example": "Example sentence with curtail in context."
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
    "meaning_vi": "được bảo vệ bởi",
    "example": "Example sentence with protected by in context."
  },
  "fertilize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fertilize/",
    "meaning_vi": "bón phân",
    "example": "Example sentence with fertilize in context."
  },
  "hippocampus (vùng hải mã)": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "hippocampus (vùng hải mã)",
    "example": "Ngữ cảnh bài đọc: hippocampus (vùng hải mã)"
  },
  "prohibitive": {
    "pos": "Từ vựng (Word)",
    "ipa": "/prohibitive/",
    "meaning_vi": "cấm đoán",
    "example": "Example sentence with prohibitive in context."
  },
  "stagnate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/stagnate/",
    "meaning_vi": "trì trệ",
    "example": "Example sentence with stagnate in context."
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
    "meaning_vi": "bị phân mảnh",
    "example": "Example sentence with fragmented in context."
  },
  "forget": {
    "pos": "Từ vựng (Word)",
    "ipa": "/forget/",
    "meaning_vi": "quên",
    "example": "Example sentence with forget in context."
  },
  "bay qua các tòa nhà cao tầng": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "bay qua các tòa nhà cao tầng",
    "example": "Ngữ cảnh bài đọc: bay qua các tòa nhà cao tầng"
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
    "meaning_vi": "tham gia",
    "example": "Example sentence with enroll in context."
  },
  "delays (sự chậm trễ)": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "delays (sự chậm trễ)",
    "example": "Ngữ cảnh bài đọc: delays (sự chậm trễ)"
  },
  "populate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/populate/",
    "meaning_vi": "cư trú",
    "example": "Example sentence with populate in context."
  },
  "soothing": {
    "pos": "Từ vựng (Word)",
    "ipa": "/soothing/",
    "meaning_vi": "êm dịu",
    "example": "Example sentence with soothing in context."
  },
  "colonize": {
    "pos": "Từ vựng (Word)",
    "ipa": "/colonize/",
    "meaning_vi": "thuộc địa hóa",
    "example": "Example sentence with colonize in context."
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
    "meaning_vi": "diễn giải",
    "example": "Example sentence with interpret in context."
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
    "meaning_vi": "mất phương hướng",
    "example": "Example sentence with disorient in context."
  },
  "belong": {
    "pos": "Từ vựng (Word)",
    "ipa": "/belong/",
    "meaning_vi": "thuộc về",
    "example": "Example sentence with belong in context."
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
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "trong giấc ngủ sóng chậm sâu (slow-wave deep sleep)",
    "example": "Ngữ cảnh bài đọc: trong giấc ngủ sóng chậm sâu (slow-wave deep sleep)"
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
    "meaning_vi": "mã hóa",
    "example": "Example sentence with encrypt in context."
  },
  "deflect": {
    "pos": "Từ vựng (Word)",
    "ipa": "/deflect/",
    "meaning_vi": "làm chệch hướng",
    "example": "Example sentence with deflect in context."
  },
  "ingest": {
    "pos": "Từ vựng (Word)",
    "ipa": "/ingest/",
    "meaning_vi": "nuốt vào",
    "example": "Example sentence with ingest in context."
  },
  "trendy": {
    "pos": "Từ vựng (Word)",
    "ipa": "/trendy/",
    "meaning_vi": "hợp thời trang",
    "example": "Example sentence with trendy in context."
  },
  "rot": {
    "pos": "Từ vựng (Word)",
    "ipa": "/rot/",
    "meaning_vi": "thối rữa",
    "example": "Example sentence with rot in context."
  },
  "streamline": {
    "pos": "Từ vựng (Word)",
    "ipa": "/streamline/",
    "meaning_vi": "sắp xếp hợp lý",
    "example": "Example sentence with streamline in context."
  },
  "harmful": {
    "pos": "Từ vựng (Word)",
    "ipa": "/harmful/",
    "meaning_vi": "có hại",
    "example": "Example sentence with harmful in context."
  },
  "khẳng định ai sẽ thay thế 100% người lao động": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "khẳng định ai sẽ thay thế 100% người lao động",
    "example": "Ngữ cảnh bài đọc: khẳng định ai sẽ thay thế 100% người lao động"
  },
  "cơ hoành": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "cơ hoành",
    "example": "Ngữ cảnh bài đọc: cơ hoành"
  },
  "pristine": {
    "pos": "Từ vựng (Word)",
    "ipa": "/pristine/",
    "meaning_vi": "nguyên sơ",
    "example": "Example sentence with pristine in context."
  },
  "behold": {
    "pos": "Từ vựng (Word)",
    "ipa": "/behold/",
    "meaning_vi": "kìa",
    "example": "Example sentence with behold in context."
  },
  "treasuring / valuing (trân quý, nâng niu)": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "treasuring / valuing (trân quý, nâng niu)",
    "example": "Ngữ cảnh bài đọc: treasuring / valuing (trân quý, nâng niu)"
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
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "chờ đợi sự may mắn ngẫu nhiên",
    "example": "Ngữ cảnh bài đọc: chờ đợi sự may mắn ngẫu nhiên"
  },
  "miraculous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/miraculous/",
    "meaning_vi": "kỳ diệu",
    "example": "Example sentence with miraculous in context."
  },
  "debilitating": {
    "pos": "Từ vựng (Word)",
    "ipa": "/debilitating/",
    "meaning_vi": "làm suy nhược",
    "example": "Example sentence with debilitating in context."
  },
  "mentor": {
    "pos": "Từ vựng (Word)",
    "ipa": "/mentor/",
    "meaning_vi": "người hướng dẫn",
    "example": "Example sentence with mentor in context."
  },
  "extinction": {
    "pos": "Từ vựng (Word)",
    "ipa": "/extinction/",
    "meaning_vi": "sự tuyệt chủng",
    "example": "Example sentence with extinction in context."
  },
  "indispensable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/indispensable/",
    "meaning_vi": "không thể thiếu",
    "example": "Example sentence with indispensable in context."
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
    "meaning_vi": "sự cách ly",
    "example": "Example sentence with isolation in context."
  },
  "impair": {
    "pos": "Từ vựng (Word)",
    "ipa": "/impair/",
    "meaning_vi": "làm suy yếu",
    "example": "Example sentence with impair in context."
  },
  "famous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/famous/",
    "meaning_vi": "nổi tiếng",
    "example": "Example sentence with famous in context."
  },
  "stripped of / lacking (bị tước đi, thiếu thốn)": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "stripped of / lacking (bị tước đi, thiếu thốn)",
    "example": "Ngữ cảnh bài đọc: stripped of / lacking (bị tước đi, thiếu thốn)"
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
    "meaning_vi": "ngâm nga",
    "example": "Example sentence with modulate in context."
  },
  "intercept": {
    "pos": "Từ vựng (Word)",
    "ipa": "/intercept/",
    "meaning_vi": "chặn",
    "example": "Example sentence with intercept in context."
  },
  "propel": {
    "pos": "Từ vựng (Word)",
    "ipa": "/propel/",
    "meaning_vi": "đẩy",
    "example": "Example sentence with propel in context."
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
    "meaning_vi": "liền mạch",
    "example": "Example sentence with seamless in context."
  },
  "lengthen": {
    "pos": "Từ vựng (Word)",
    "ipa": "/lengthen/",
    "meaning_vi": "kéo dài ra",
    "example": "Example sentence with lengthen in context."
  },
  "dangerous": {
    "pos": "Từ vựng (Word)",
    "ipa": "/dangerous/",
    "meaning_vi": "nguy hiểm",
    "example": "Example sentence with dangerous in context."
  },
  "audit": {
    "pos": "Từ vựng (Word)",
    "ipa": "/audit/",
    "meaning_vi": "kiểm toán",
    "example": "Example sentence with audit in context."
  },
  "anxious": {
    "pos": "Từ vựng (Word)",
    "ipa": "/anxious/",
    "meaning_vi": "lo lắng",
    "example": "Example sentence with anxious in context."
  },
  "shorten": {
    "pos": "Từ vựng (Word)",
    "ipa": "/shorten/",
    "meaning_vi": "rút ngắn",
    "example": "Example sentence with shorten in context."
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
    "meaning_vi": "tập trung",
    "example": "Example sentence with gather in context."
  },
  "extract": {
    "pos": "Từ vựng (Word)",
    "ipa": "/extract/",
    "meaning_vi": "chiết xuất",
    "example": "Example sentence with extract in context."
  },
  "channel": {
    "pos": "Từ vựng (Word)",
    "ipa": "/channel/",
    "meaning_vi": "kênh",
    "example": "Example sentence with channel in context."
  },
  "resilient": {
    "pos": "Từ vựng (Word)",
    "ipa": "/resilient/",
    "meaning_vi": "đàn hồi",
    "example": "Example sentence with resilient in context."
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
    "meaning_vi": "làm gián đoạn",
    "example": "Example sentence with disrupt in context."
  },
  "overwhelm": {
    "pos": "Từ vựng (Word)",
    "ipa": "/overwhelm/",
    "meaning_vi": "áp đảo",
    "example": "Example sentence with overwhelm in context."
  },
  "collapsible": {
    "pos": "Từ vựng (Word)",
    "ipa": "/collapsible/",
    "meaning_vi": "có thể thu gọn",
    "example": "Example sentence with collapsible in context."
  },
  "stimulate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/stimulate/",
    "meaning_vi": "kích thích",
    "example": "Example sentence with stimulate in context."
  },
  "perish": {
    "pos": "Từ vựng (Word)",
    "ipa": "/perish/",
    "meaning_vi": "diệt vong",
    "example": "Example sentence with perish in context."
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
    "meaning_vi": "kém cỏi",
    "example": "Example sentence with inferior in context."
  },
  "thực tế và lạc quan, xem ai là công cụ hỗ trợ con người": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "thực tế và lạc quan, xem ai là công cụ hỗ trợ con người",
    "example": "Ngữ cảnh bài đọc: thực tế và lạc quan, xem ai là công cụ hỗ trợ con người"
  },
  "recover": {
    "pos": "Từ vựng (Word)",
    "ipa": "/recover/",
    "meaning_vi": "hồi phục",
    "example": "Example sentence with recover in context."
  },
  "forestall": {
    "pos": "Từ vựng (Word)",
    "ipa": "/forestall/",
    "meaning_vi": "chặn trước",
    "example": "Example sentence with forestall in context."
  },
  "dark": {
    "pos": "Từ vựng (Word)",
    "ipa": "/dark/",
    "meaning_vi": "tối tăm",
    "example": "Example sentence with dark in context."
  },
  "benefits / rewards (lợi ích, thành quả tốt đẹp lâu dài)": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "benefits / rewards (lợi ích, thành quả tốt đẹp lâu dài)",
    "example": "Ngữ cảnh bài đọc: benefits / rewards (lợi ích, thành quả tốt đẹp lâu dài)"
  },
  "synthetic": {
    "pos": "Từ vựng (Word)",
    "ipa": "/synthetic/",
    "meaning_vi": "tổng hợp",
    "example": "Example sentence with synthetic in context."
  },
  "navigate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/navigate/",
    "meaning_vi": "điều hướng",
    "example": "Example sentence with navigate in context."
  },
  "collide": {
    "pos": "Từ vựng (Word)",
    "ipa": "/collide/",
    "meaning_vi": "va chạm",
    "example": "Example sentence with collide in context."
  },
  "print": {
    "pos": "Từ vựng (Word)",
    "ipa": "/print/",
    "meaning_vi": "in",
    "example": "Example sentence with print in context."
  },
  "sorrow": {
    "pos": "Từ vựng (Word)",
    "ipa": "/sorrow/",
    "meaning_vi": "nỗi buồn",
    "example": "Example sentence with sorrow in context."
  },
  "provided with": {
    "pos": "Từ vựng (Word)",
    "ipa": "/provided with/",
    "meaning_vi": "được cung cấp với",
    "example": "Example sentence with provided with in context."
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
    "meaning_vi": "căng",
    "example": "Example sentence with strained in context."
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
    "meaning_vi": "chịu đựng được",
    "example": "Example sentence with withstand in context."
  },
  "fluent": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fluent/",
    "meaning_vi": "thông thạo",
    "example": "Example sentence with fluent in context."
  },
  "trap": {
    "pos": "Từ vựng (Word)",
    "ipa": "/trap/",
    "meaning_vi": "cạm bẫy",
    "example": "Example sentence with trap in context."
  },
  "shield": {
    "pos": "Từ vựng (Word)",
    "ipa": "/shield/",
    "meaning_vi": "cái khiên",
    "example": "Example sentence with shield in context."
  },
  "trưng bày hàng hóa bán lẻ trực tiếp": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "trưng bày hàng hóa bán lẻ trực tiếp",
    "example": "Ngữ cảnh bài đọc: trưng bày hàng hóa bán lẻ trực tiếp"
  },
  "replicate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/replicate/",
    "meaning_vi": "nhân rộng",
    "example": "Example sentence with replicate in context."
  },
  "integrate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/integrate/",
    "meaning_vi": "tích hợp",
    "example": "Example sentence with integrate in context."
  },
  "verify": {
    "pos": "verb",
    "ipa": "/ˈverɪfaɪ/",
    "meaning_vi": "Xác minh, kiểm chứng nguồn tin",
    "example": "Example context with verify."
  },
  "diagnose": {
    "pos": "Từ vựng (Word)",
    "ipa": "/diagnose/",
    "meaning_vi": "chẩn đoán",
    "example": "Example sentence with diagnose in context."
  },
  "prescribe": {
    "pos": "Từ vựng (Word)",
    "ipa": "/prescribe/",
    "meaning_vi": "quy định",
    "example": "Example sentence with prescribe in context."
  },
  "discipline": {
    "pos": "Từ vựng (Word)",
    "ipa": "/discipline/",
    "meaning_vi": "kỷ luật",
    "example": "Example sentence with discipline in context."
  },
  "discard": {
    "pos": "Từ vựng (Word)",
    "ipa": "/discard/",
    "meaning_vi": "vứt bỏ",
    "example": "Example sentence with discard in context."
  },
  "prudent": {
    "pos": "Từ vựng (Word)",
    "ipa": "/prudent/",
    "meaning_vi": "khôn ngoan",
    "example": "Example sentence with prudent in context."
  },
  "durable": {
    "pos": "Từ vựng (Word)",
    "ipa": "/durable/",
    "meaning_vi": "bền bỉ",
    "example": "Example sentence with durable in context."
  },
  "forbidden": {
    "pos": "Từ vựng (Word)",
    "ipa": "/forbidden/",
    "meaning_vi": "cấm",
    "example": "Example sentence with forbidden in context."
  },
  "fossil": {
    "pos": "Từ vựng (Word)",
    "ipa": "/fossil/",
    "meaning_vi": "hóa thạch",
    "example": "Example sentence with fossil in context."
  },
  "collaborate": {
    "pos": "Từ vựng (Word)",
    "ipa": "/collaborate/",
    "meaning_vi": "cộng tác",
    "example": "Example sentence with collaborate in context."
  },
  "secrete": {
    "pos": "Từ vựng (Word)",
    "ipa": "/secrete/",
    "meaning_vi": "tiết ra",
    "example": "Example sentence with secrete in context."
  },
  "do rác thải nhựa phủ kín bề mặt đáy biển": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "do rác thải nhựa phủ kín bề mặt đáy biển",
    "example": "Ngữ cảnh bài đọc: do rác thải nhựa phủ kín bề mặt đáy biển"
  },
  "tranquil": {
    "pos": "Từ vựng (Word)",
    "ipa": "/tranquil/",
    "meaning_vi": "yên tĩnh",
    "example": "Example sentence with tranquil in context."
  },
  "sao chép và lưu trữ văn bản": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "sao chép và lưu trữ văn bản",
    "example": "Ngữ cảnh bài đọc: sao chép và lưu trữ văn bản"
  },
  "sự củng cố, làm cho bền vững": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "sự củng cố, làm cho bền vững",
    "example": "Ngữ cảnh bài đọc: sự củng cố, làm cho bền vững"
  },
  "hang": {
    "pos": "Từ vựng (Word)",
    "ipa": "/hang/",
    "meaning_vi": "treo",
    "example": "Example sentence with hang in context."
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
    "meaning_vi": "thay thế",
    "example": "Example sentence with displace in context."
  },
  "do thiếu ánh sáng mặt trời mùa đông": {
    "pos": "Lựa chọn đọc hiểu (Reading Option)",
    "ipa": "/reading option/",
    "meaning_vi": "do thiếu ánh sáng mặt trời mùa đông",
    "example": "Ngữ cảnh bài đọc: do thiếu ánh sáng mặt trời mùa đông"
  },
  "silent": {
    "pos": "Từ vựng (Word)",
    "ipa": "/silent/",
    "meaning_vi": "im lặng",
    "example": "Example sentence with silent in context."
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
    "meaning_vi": "trốn",
    "example": "Example sentence with hiding in context."
  }
};
