// ============================================================================
// VIETNAM TODAY DAILY VIDEO & ESSENTIAL VOCABULARY HUB (VTV4)
// ============================================================================
const VIETNAM_TODAY_VIDEOS = [
  {
    id: "vnt_1",
    title: "Vietnam Today: Preserving Traditional Craft Villages & Living Heritage",
    vnTitle: "Bảo Tồn Làng Nghề Truyền Thống & Di Sản Sống Của Việt Nam",
    category: "Văn Hóa & Di Sản",
    date: "Cập nhật hôm nay",
    duration: "08:45",
    youtubeId: "W7q1Z5A-Gtc",
    description: "Khám phá các làng nghề thủ công trăm năm tuổi như gốm Bát Tràng, lụa Vạn Phúc và những nỗ lực gìn giữ tinh hoa văn hóa truyền thống kết hợp du lịch hiện đại.",
    summary: "Bản tin theo chân các nghệ nhân gìn giữ bí quyết gốm men lam Bát Tràng và làng dệt lụa tơ tằm Vạn Phúc, giới thiệu nét độc đáo của sản phẩm thủ công mỹ nghệ Việt Nam ra thế giới.",
    vocabulary: [
      {
        word: "artisan",
        pos: "Danh từ (Noun)",
        ipa: "/ˈɑːrtɪzn/",
        meaning: "Nghệ nhân, thợ thủ công lành nghề",
        example: "The skilled artisans of Bat Trang have passed down ceramic techniques for over seven centuries.",
        exampleVn: "Các nghệ nhân lành nghề của Bát Tràng đã truyền lại kỹ thuật làm gốm hơn 7 thế kỷ."
      },
      {
        word: "heritage",
        pos: "Danh từ (Noun)",
        ipa: "/ˈherɪtɪdʒ/",
        meaning: "Di sản (văn hóa, lịch sử)",
        example: "Preserving intangible cultural heritage is vital for future generations.",
        exampleVn: "Bảo tồn di sản văn hóa phi vật thể là điều sống còn đối với các thế hệ tương lai."
      },
      {
        word: "preservation",
        pos: "Danh từ (Noun)",
        ipa: "/ˌprezərˈveɪʃn/",
        meaning: "Sự giữ gìn, bảo tồn nguyên vẹn",
        example: "The community launched a campaign for the preservation of antique silk looms.",
        exampleVn: "Cộng đồng đã phát động chiến dịch bảo tồn các khung dệt lụa cổ."
      },
      {
        word: "craftsmanship",
        pos: "Danh từ (Noun)",
        ipa: "/ˈkræftsmənʃɪp/",
        meaning: "Tay nghề thủ công điêu luyện",
        example: "Each porcelain vase displays exceptional Vietnamese craftsmanship.",
        exampleVn: "Mỗi chiếc bình sứ thể hiện tay nghề thủ công xuất sắc của người Việt."
      },
      {
        word: "intricate",
        pos: "Tính từ (Adjective)",
        ipa: "/ˈɪntrɪkət/",
        meaning: "Tinh xảo, phức tạp, tỉ mỉ",
        example: "The silk scarves are woven with intricate floral patterns.",
        exampleVn: "Những chiếc khăn lụa được dệt với các họa tiết hoa văn tinh xảo."
      },
      {
        word: "sustainable",
        pos: "Tính từ (Adjective)",
        ipa: "/səˈsteɪnəbl/",
        meaning: "Bền vững, lâu dài",
        example: "Combining craft workshops with tourism provides a sustainable livelihood.",
        exampleVn: "Kết hợp xưởng thủ công với du lịch mang lại sinh kế bền vững."
      },
      {
        word: "livelihood",
        pos: "Danh từ (Noun)",
        ipa: "/ˈlaɪvlihʊd/",
        meaning: "Kế sinh nhai, nguồn sống",
        example: "Pottery making remains the primary livelihood of villagers here.",
        exampleVn: "Nghề làm gốm vẫn là nguồn sinh kế chính của dân làng nơi đây."
      },
      {
        word: "flourish",
        pos: "Động từ (Verb)",
        ipa: "/ˈflɜːrɪʃ/",
        meaning: "Hưng thịnh, phát triển rực rỡ",
        example: "Traditional arts continue to flourish thanks to international appreciation.",
        exampleVn: "Nghệ thuật truyền thống tiếp tục phát triển rực rỡ nhờ sự đón nhận của quốc tế."
      }
    ],
    script: [
      {
        time: "00:00 - 01:15",
        en: "Welcome to Vietnam Today on VTV4. Across Vietnam, hundreds of traditional craft villages have stood the test of time, weaving history, identity, and artistic soul into everyday items.",
        vi: "Chào mừng quý vị đến với Vietnam Today trên kênh VTV4. Trên khắp đất nước Việt Nam, hàng trăm làng nghề truyền thống đã đứng vững trước thử thách của thời gian, gửi gắm lịch sử, bản sắc và tâm hồn nghệ thuật vào từng vật dụng đời thường."
      },
      {
        time: "01:16 - 02:40",
        en: "Our journey begins along the Red River at Bat Trang Pottery Village, renowned for its exquisite ceramic glazes that date back to the Ly Dynasty. Here, master artisans transform humble clay into world-class porcelain.",
        vi: "Hành trình của chúng ta bắt đầu dọc theo dòng sông Hồng tại làng gốm Bát Tràng, nơi nổi tiếng với những lớp men gốm tinh xảo có từ thời nhà Lý. Tại đây, các bậc thầy nghệ nhân biến đất sét mộc mạc thành những tác phẩm sứ vươn tầm thế giới."
      },
      {
        time: "02:41 - 04:20",
        en: "In modern times, young entrepreneurs are infusing contemporary aesthetics into traditional craftsmanship, opening interactive studios where international travelers can shape their own pottery.",
        vi: "Trong thời hiện đại, các bạn trẻ khởi nghiệp đang thổi luồng gió thẩm mỹ đương đại vào nghề thủ công truyền thống, mở ra những xưởng trải nghiệm nơi du khách quốc tế có thể tự tay nhào nặn chiếc bình gốm của riêng mình."
      },
      {
        time: "04:21 - 06:10",
        en: "Further west in Hanoi lies Van Phuc Silk Village, famous for its smooth, breathable, and vibrant silk weaves. Preservation of this living heritage is not only cultural pride but also an economic pillar.",
        vi: "Đi tiếp về phía tây Hà Nội là làng lụa Vạn Phúc, nức tiếng với những thớ lụa óng ả, thoáng mát và rực rỡ sắc màu. Việc gìn giữ di sản sống này không chỉ là niềm tự hào văn hóa mà còn là trụ cột kinh tế vững chắc."
      },
      {
        time: "06:11 - 08:45",
        en: "Through sustainable tourism and global trade exhibitions, Vietnam's craft villages prove that tradition and modernity can coexist beautifully, ensuring these precious legacies thrive for centuries to come.",
        vi: "Thông qua du lịch bền vững và các hội chợ thương mại toàn cầu, các làng nghề Việt Nam chứng minh rằng truyền thống và hiện đại có thể song hành tuyệt đẹp, bảo đảm những di sản quý báu này sẽ tiếp tục tỏa sáng qua nhiều thế kỷ tới."
      }
    ]
  },
  {
    id: "vnt_2",
    title: "Vietnam Today: Hanoi Street Food - The Symphony of the Old Quarter",
    vnTitle: "Ẩm Thực Đường Phố Hà Nội - Bản Hòa Tấu Hương Vị Phố Cổ",
    category: "Ẩm Thực & Đời Sống",
    date: "Số phát sóng mới nhất",
    duration: "09:12",
    youtubeId: "J8J9sB2V0Lw",
    description: "Khám phá tinh hoa ẩm thực đường phố Hà Nội: Phở bò gia truyền, Bún chả nướng than hoa thơm lừng và Cà phê trứng béo ngậy giữa lòng 36 phố phường.",
    summary: "Bản tin dẫn người xem qua những ngõ nhỏ phố cổ Hà Nội, nơi ẩm thực vỉa hè được vinh danh trong cẩm nang Michelin và là linh hồn trong đời sống thường nhật của người Tràng An.",
    vocabulary: [
      {
        word: "culinary",
        pos: "Tính từ (Adjective)",
        ipa: "/ˈkʌlɪneri/",
        meaning: "Thuộc về nấu nướng, ẩm thực",
        example: "Hanoi is globally acclaimed as a premier culinary destination in Asia.",
        exampleVn: "Hà Nội được thế giới ca ngợi là điểm đến ẩm thực hàng đầu tại châu Á."
      },
      {
        word: "delicacy",
        pos: "Danh từ (Noun)",
        ipa: "/ˈdelɪkəsi/",
        meaning: "Món ăn đặc sản thơm ngon, cao lương mỹ vị",
        example: "Egg coffee is a unique Hanoi delicacy created during milk shortages.",
        exampleVn: "Cà phê trứng là món đặc sản độc đáo của Hà Nội ra đời trong thời kỳ khan hiếm sữa tươi."
      },
      {
        word: "authentic",
        pos: "Tính từ (Adjective)",
        ipa: "/ɔːˈθentɪk/",
        meaning: "Đích thực, chuẩn vị nguyên bản",
        example: "Tourists wander into narrow alleys to taste authentic Pho bo broth.",
        exampleVn: "Du khách len lỏi vào các ngõ nhỏ để nếm thử nước dùng phở bò chuẩn vị nguyên bản."
      },
      {
        word: "aromatic",
        pos: "Tính từ (Adjective)",
        ipa: "/ˌærəˈmætɪk/",
        meaning: "Thơm nức mũi, ngào ngạt hương thơm",
        example: "The aromatic smell of grilled pork over charcoal fills the Old Quarter streets.",
        exampleVn: "Mùi thịt lợn nướng than hoa thơm nức mũi lan tỏa khắp các con phố cổ."
      },
      {
        word: "broth",
        pos: "Danh từ (Noun)",
        ipa: "/brɔːθ/",
        meaning: "Nước dùng, nước lèo xương",
        example: "A great bowl of Pho requires simmering beef bones for over ten hours.",
        exampleVn: "Một bát phở tuyệt hảo đòi hỏi phải ninh xương bò kỹ lưỡng hơn mười tiếng đồng hồ."
      },
      {
        word: "bustling",
        pos: "Tính từ (Adjective)",
        ipa: "/ˈbʌslɪŋ/",
        meaning: "Nhộn nhịp, hối hả, tấp nập",
        example: "Street vendors set up tables on bustling sidewalks every evening.",
        exampleVn: "Các quán ăn vỉa hè bày bàn ghế trên những con phố tấp nập mỗi buổi chiều tối."
      },
      {
        word: "connoisseur",
        pos: "Danh từ (Noun)",
        ipa: "/ˌkɑːnəˈsɜːr/",
        meaning: "Người sành sỏi, chuyên gia thưởng thức",
        example: "Even international food connoisseurs praise the balance of herbs and spices in Vietnamese dishes.",
        exampleVn: "Ngay cả những chuyên gia ẩm thực quốc tế cũng khen ngợi sự cân bằng giữa rau thơm và gia vị trong món ăn Việt."
      },
      {
        word: "reputation",
        pos: "Danh từ (Noun)",
        ipa: "/ˌrepjuˈteɪʃn/",
        meaning: "Danh tiếng, tiếng tăm",
        example: "Hanoi's street food has earned an enviable reputation worldwide.",
        exampleVn: "Ẩm thực đường phố Hà Nội đã tạo dựng được danh tiếng đáng ngưỡng mộ trên toàn thế giới."
      }
    ],
    script: [
      {
        time: "00:00 - 01:30",
        en: "Good evening from Hanoi. Few cities in the world can rival the vibrant street food culture of Vietnam's thousand-year-old capital.",
        vi: "Xin chào buổi tối từ Hà Nội. Hiếm có thành phố nào trên thế giới có thể sánh được với văn hóa ẩm thực đường phố sôi động của thủ đô ngàn năm văn hiến của Việt Nam."
      },
      {
        time: "01:31 - 03:15",
        en: "At dawn, steaming cauldrons of pho broth awaken the neighborhood with cinnamon, star anise, and charred ginger aromas, served with tender beef and fresh cilantro.",
        vi: "Khi bình minh vừa ló rạng, những nồi nước dùng phở bốc khói nghi ngút đánh thức cả góc phố với hương thơm của quế, hồi và gừng nướng, phục vụ cùng thịt bò mềm và rau mùi tươi."
      },
      {
        time: "03:16 - 05:20",
        en: "By midday, Bun Cha takes center stage: caramelized pork patties sizzling over open charcoal grills, served alongside rice noodles and a tangy sweet-sour dipping fish sauce.",
        vi: "Đến giữa trưa, Bún Chả trở thành tâm điểm: những miếng chả thịt thơm ngậy xèo xèo trên vỉ than hồng, ăn kèm bún tươi và bát nước chấm chua ngọt đậm đà."
      },
      {
        time: "05:21 - 07:10",
        en: "No culinary tour of Hanoi is complete without Giang Cafe's legendary egg coffee, where creamy egg yolk foam floats atop rich, robust Vietnamese robusta.",
        vi: "Không chuyến khám phá ẩm thực Hà Nội nào trọn vẹn nếu thiếu món cà phê trứng trứ danh tại cà phê Giảng, nơi lớp kem trứng béo ngậy bồng bềnh trên nền cà phê robusta đậm đà."
      },
      {
        time: "07:11 - 09:12",
        en: "For Hanoians, food is more than sustenance—it is connection, memory, and an art form perfected through generations of culinary mastery.",
        vi: "Đối với người Hà Nội, món ăn không chỉ để no bụng—đó là sự gắn kết, là ký ức và là một nghệ thuật sống được hoàn thiện qua bao thế hệ tài hoa."
      }
    ]
  },
  {
    id: "vnt_3",
    title: "Vietnam Today: Eco-Tourism & The Wonders of Phong Nha Cave System",
    vnTitle: "Du Lịch Sinh Thái & Kỳ Quan Hệ Thống Hang Động Phong Nha",
    category: "Du Lịch & Khám Phá",
    date: "Chuyên mục Môi trường & Du lịch",
    duration: "10:05",
    youtubeId: "n4_T_qM6C9k",
    description: "Chiêm ngưỡng vẻ đẹp kỳ vĩ của Vườn Quốc Gia Phong Nha - Kẻ Bàng, Sơn Đoòng và hành trình xây dựng du lịch sinh thái bền vững bảo vệ rừng nguyên sinh.",
    summary: "Bản tin đưa du khách khám phá những hang động đá vôi tráng lệ nhất hành tinh tại Quảng Bình, nhấn mạnh nguyên tắc du lịch có trách nhiệm nhằm bảo vệ hệ sinh thái rừng nhiệt đới.",
    vocabulary: [
      {
        word: "biodiversity",
        pos: "Danh từ (Noun)",
        ipa: "/ˌbaɪoʊdaɪˈvɜːrsəti/",
        meaning: "Đa dạng sinh học",
        example: "Phong Nha boasts extraordinary biodiversity with rare endemic species.",
        exampleVn: "Phong Nha sở hữu sự đa dạng sinh học phi thường với nhiều loài đặc hữu quý hiếm."
      },
      {
        word: "stalactite",
        pos: "Danh từ (Noun)",
        ipa: "/ˈstæləktaɪt/",
        meaning: "Thạch nhũ (từ trần hang rủ xuống)",
        example: "Colossal stalactites have formed inside the cave over millions of years.",
        exampleVn: "Những khối thạch nhũ khổng lồ đã hình thành bên trong hang qua hàng triệu năm."
      },
      {
        word: "subterranean",
        pos: "Tính từ (Adjective)",
        ipa: "/ˌsʌbtəˈreɪniən/",
        meaning: "Dưới lòng đất, ngầm",
        example: "Explorers navigated a vast subterranean river system inside Son Doong.",
        exampleVn: "Các nhà thám hiểm đã di chuyển trên một hệ thống sông ngầm rộng lớn bên trong hang Sơn Đoòng."
      },
      {
        word: "expedition",
        pos: "Danh từ (Noun)",
        ipa: "/ˌekspəˈdɪʃn/",
        meaning: "Chuyến thám hiểm khoa học",
        example: "The caving expedition strictly limits visitor numbers to protect fragile limestone structures.",
        exampleVn: "Chuyến thám hiểm hang động giới hạn nghiêm ngặt số lượng khách để bảo vệ các cấu trúc đá vôi mong manh."
      },
      {
        word: "breathtaking",
        pos: "Tính từ (Adjective)",
        ipa: "/ˈbreθteɪkɪŋ/",
        meaning: "Ngoạn mục, đẹp nghẹt thở",
        example: "The aerial view of karst mountains emerging from dense jungle was breathtaking.",
        exampleVn: "Góc nhìn từ trên cao của dãy núi đá vôi nhô lên giữa rừng rậm rạp đẹp đến nghẹt thở."
      },
      {
        word: "conservation",
        pos: "Danh từ (Noun)",
        ipa: "/ˌkɑːnsərˈveɪʃn/",
        meaning: "Sự bảo tồn tài nguyên thiên nhiên",
        example: "Park rangers work closely with local porters on forest conservation.",
        exampleVn: "Các kiểm lâm viên hợp tác chặt chẽ với người khuân vác địa phương trong công tác bảo tồn rừng."
      },
      {
        word: "pristine",
        pos: "Tính từ (Adjective)",
        ipa: "/ˈprɪstiːn/",
        meaning: "Nguyên sơ, chưa bị con người làm hỏng",
        example: "Maintaining the pristine condition of caves is the top priority for park authorities.",
        exampleVn: "Duy trì tình trạng nguyên sơ của các hang động là ưu tiên hàng đầu của ban quản lý."
      },
      {
        word: "ecosystem",
        pos: "Danh từ (Noun)",
        ipa: "/ˈiːkoʊsɪstəm/",
        meaning: "Hệ sinh thái",
        example: "Any small contamination could endanger the cave's delicate ecosystem.",
        exampleVn: "Bất kỳ ô nhiễm nhỏ nào cũng có thể gây nguy hiểm cho hệ sinh thái mỏng manh của hang động."
      }
    ],
    script: [
      {
        time: "00:00 - 01:45",
        en: "Deep within central Vietnam lies Quang Binh province, home to Phong Nha-Ke Bang National Park—a UNESCO World Heritage site and the undisputed kingdom of caves.",
        vi: "Sâu bên trong miền Trung Việt Nam là tỉnh Quảng Bình, quê hương của Vườn Quốc Gia Phong Nha - Kẻ Bàng—Di sản Thế giới được UNESCO công nhận và là vương quốc hang động độc nhất vô nhị."
      },
      {
        time: "01:46 - 03:50",
        en: "With caverns large enough to fit an entire Manhattan city block and a 40-story skyscraper, Son Doong cave represents nature's grandeur at its most monumental.",
        vi: "Với những vòm hang rộng lớn đủ để chứa trọn một khu phố Manhattan và tòa nhà chọc trời 40 tầng, hang Sơn Đoòng đại diện cho sự kỳ vĩ tột đỉnh của mẹ thiên nhiên."
      },
      {
        time: "03:51 - 06:15",
        en: "Inside, visitors discover an underground primeval rainforest known as the Garden of Edam, complete with its own localized cloud system and unique adapted wildlife.",
        vi: "Bên trong, du khách khám phá một khu rừng nguyên sinh ngầm dưới lòng đất mang tên Vườn Địa Đàng, sở hữu cả hệ thống mây vi khí hậu riêng và những loài động thực vật thích nghi độc đáo."
      },
      {
        time: "06:16 - 08:30",
        en: "Rather than pursuing mass commercialization, local tourism models engage former loggers as expert guides and porters, turning local communities into protectors of their own wilderness.",
        vi: "Thay vì theo đuổi du lịch đại trà thương mại hóa, mô hình du lịch nơi đây tuyển dụng những người từng khai thác gỗ làm hướng dẫn viên và thợ dẫn đường, biến chính cộng đồng địa phương thành những người bảo vệ rừng xanh."
      },
      {
        time: "08:31 - 10:05",
        en: "This pioneering approach demonstrates that high-value eco-tourism can safeguard pristine nature while providing prosperous, dignified careers for generations to come.",
        vi: "Cách tiếp cận tiên phong này chứng minh rằng du lịch sinh thái chất lượng cao có thể bảo vệ thiên nhiên nguyên sơ đồng thời đem lại sự nghiệp thịnh vượng, đàng hoàng cho các thế hệ tương lai."
      }
    ]
  },
  {
    id: "vnt_4",
    title: "Vietnam Today: The Timeless Charm of Hoi An Ancient Town",
    vnTitle: "Vẻ Đẹp Vượt Thời Gian Của Đô Thị Cổ Hội An",
    category: "Văn Hóa & Điểm Đến",
    date: "Chuyên mục Khám phá Việt Nam",
    duration: "08:30",
    youtubeId: "T7m7B8V1V0s",
    description: "Dạo bước qua phố cổ Hội An với những ngôi nhà sơn vàng cổ kính, giàn hoa giấy rực rỡ, Chùa Cầu và lễ hội thả hoa đăng lung linh trên dòng sông Hoài.",
    summary: "Bản tin tôn vinh thương cảng quốc tế sầm uất thế kỷ 16-17, nơi hội tụ nét kiến trúc độc đáo của văn hóa Việt Nam, Nhật Bản và Trung Hoa được bảo tồn gần như nguyên vẹn.",
    vocabulary: [
      {
        word: "architecture",
        pos: "Danh từ (Noun)",
        ipa: "/ˈɑːrkɪtektʃər/",
        meaning: "Kiến trúc, phong cách xây dựng",
        example: "Hoi An's architecture is an exceptional blend of indigenous and foreign influences.",
        exampleVn: "Kiến trúc Hội An là sự kết hợp đặc sắc giữa ảnh hưởng bản địa và nước ngoài."
      },
      {
        word: "tranquility",
        pos: "Danh từ (Noun)",
        ipa: "/træŋˈkwɪləti/",
        meaning: "Sự thanh bình, tĩnh lặng",
        example: "Early morning in Hoi An offers a rare tranquility before tourists arrive.",
        exampleVn: "Sáng sớm ở Hội An mang lại một sự thanh bình hiếm có trước khi du khách tới."
      },
      {
        word: "picturesque",
        pos: "Tính từ (Adjective)",
        ipa: "/ˌpɪktʃəˈresk/",
        meaning: "Đẹp như tranh vẽ",
        example: "Lantern-lit bridges and yellow alleys create a picturesque setting along the river.",
        exampleVn: "Cầu thắp đèn lồng và những con ngõ vàng tạo nên khung cảnh đẹp như tranh vẽ bên sông."
      },
      {
        word: "prosperous",
        pos: "Tính từ (Adjective)",
        ipa: "/ˈprɑːspərəs/",
        meaning: "Thịnh vượng, phồn vinh",
        example: "During the 17th century, Hoi An flourished as a prosperous Southeast Asian port.",
        exampleVn: "Vào thế kỷ 17, Hội An phát triển rực rỡ như một thương cảng Đông Nam Á phồn vinh."
      },
      {
        word: "harmonious",
        pos: "Tính từ (Adjective)",
        ipa: "/hɑːrˈmoʊniəs/",
        meaning: "Hài hòa, êm dịu",
        example: "Wooden pagodas and merchant houses blend in harmonious balance.",
        exampleVn: "Những ngôi chùa gỗ và nhà buôn hòa quyện trong một sự cân bằng hài hòa."
      },
      {
        word: "lantern",
        pos: "Danh từ (Noun)",
        ipa: "/ˈlæntərn/",
        meaning: "Đèn lồng thủ công",
        example: "On full moon nights, thousands of silk lanterns illuminate the ancient streets.",
        exampleVn: "Vào những đêm rằm, hàng nghìn chiếc đèn lồng lụa thắp sáng các con phố cổ."
      },
      {
        word: "custom",
        pos: "Danh từ (Noun)",
        ipa: "/ˈkʌstəm/",
        meaning: "Phong tục, tập quán",
        example: "Floating paper flower lanterns on the river is a cherished local custom.",
        exampleVn: "Thả hoa đăng trên sông là một phong tục truyền thống được người dân hết sức trân trọng."
      },
      {
        word: "rejuvenate",
        pos: "Động từ (Verb)",
        ipa: "/rɪˈdʒuːvəneɪt/",
        meaning: "Làm hồi sinh, đem lại sức sống mới",
        example: "Sustainable community initiatives have helped rejuvenate traditional festivals.",
        exampleVn: "Các sáng kiến cộng đồng bền vững đã giúp làm hồi sinh các lễ hội truyền thống."
      }
    ],
    script: [
      {
        time: "00:00 - 01:20",
        en: "Nestled along the Thu Bon River, Hoi An was once one of the most bustling trading ports in all of Southeast Asia, welcoming merchants from Japan, China, and Europe.",
        vi: "Tọa lạc ven dòng sông Thu Bồn, Hội An từng là một trong những thương cảng sầm uất nhất Đông Nam Á, đón chào các thương nhân từ Nhật Bản, Trung Quốc và châu Âu."
      },
      {
        time: "01:21 - 03:00",
        en: "Today, its distinctive saffron-yellow merchant houses, wooden shophouses, and the iconic Japanese Covered Bridge stand as a living testament to multicultural harmony.",
        vi: "Ngày nay, những ngôi nhà buôn màu vàng nghệ đặc trưng, các dãy nhà phố gỗ và Chùa Cầu biểu tượng đứng sừng sững như một minh chứng sống cho sự hòa hợp đa văn hóa."
      },
      {
        time: "03:01 - 05:00",
        en: "As twilight descends, electric lights are turned off in favor of countless handcrafted lanterns, transforming the historic town into a magical sea of colors.",
        vi: "Khi hoàng hôn buông xuống, ánh đèn điện nhường chỗ cho vô vàn chiếc đèn lồng thủ công, biến đô thị cổ lịch sử thành một biển màu sắc huyền ảo."
      },
      {
        time: "05:01 - 08:30",
        en: "Hoi An captures the heart of every traveler not simply for its beauty, but for the warmth of its people and the enduring serenity etched into every brick and wooden beam.",
        vi: "Hội An chiếm trọn trái tim của mọi du khách không chỉ bởi vẻ đẹp cảnh sắc, mà còn bởi sự nồng hậu của con người nơi đây và sự an yên bền vững khắc sâu trong từng viên gạch, thanh xà gỗ."
      }
    ]
  }
];
