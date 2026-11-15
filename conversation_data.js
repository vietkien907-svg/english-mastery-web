// ============================================================================
// ENGLISH DAILY CONVERSATIONAL EXPRESSIONS & DIALOGUES (TIẾNG ANH GIAO TIẾP HÀNG NGÀY)
// Trọn bộ các mẫu câu và đoạn đối đáp chuẩn bản ngữ trong mỗi cuộc trò chuyện thường ngày
// ============================================================================

const CONVERSATION_CATEGORIES = [
  { id: "all", name: "Tất cả chủ đề", icon: "sparkles", count: 120 },
  { id: "greetings", name: "Chào hỏi & Làm quen", icon: "smile", count: 14 },
  { id: "workplace", name: "Công sở & Đồng nghiệp", icon: "briefcase", count: 14 },
  { id: "dining", name: "Ăn uống, Gọi món & Cafe", icon: "coffee", count: 13 },
  { id: "shopping", name: "Mua sắm & Trả giá", icon: "shopping-bag", count: 12 },
  { id: "travel", name: "Du lịch, Hỏi đường & Khách sạn", icon: "compass", count: 12 },
  { id: "feelings", name: "Cảm xúc, Đồng tình & Khen ngợi", icon: "heart", count: 12 },
  { id: "scheduling", name: "Gọi điện, Đặt hẹn & Lên lịch", icon: "phone-call", count: 11 },
  { id: "help", name: "Nhờ giúp đỡ, Xin lỗi & Cảm ơn", icon: "help-circle", count: 11 },
  { id: "daily", name: "Thói quen & Cuộc sống hàng ngày", icon: "sun", count: 11 },
  { id: "goodbyes", name: "Tạm biệt & Giữ liên lạc", icon: "send", count: 10 }
];

const DAILY_CONVERSATIONS = [
  // 1. Chào hỏi & Làm quen (Greetings & Small Talk)
  {
    id: 1,
    category: "greetings",
    category_name: "Chào hỏi & Làm quen",
    sentence_en: "How's it going? Everything good with you?",
    sentence_vi: "Dạo này thế nào rồi? Mọi chuyện với bạn vẫn ổn chứ?",
    context: "Lời chào hỏi thân thiện, tự nhiên hàng ngày thay cho câu 'How are you?' sách vở.",
    pronunciation_tip: "Nối âm: /haʊ-zɪt ˈɡoʊ.ɪŋ/, lướt nhẹ 'it going'.",
    dialogue: {
      speaker_a: "Hey Vu! How's it going? Everything good with you?",
      speaker_b: "Couldn't be better, thanks! How about yourself?",
      speaker_b_vi: "Không thể tốt hơn được nữa, cảm ơn bạn! Còn bạn thì sao?"
    }
  },
  {
    id: 2,
    category: "greetings",
    category_name: "Chào hỏi & Làm quen",
    sentence_en: "Long time no see! What have you been up to lately?",
    sentence_vi: "Lâu quá không gặp! Dạo gần đây bạn đang bận rộn việc gì thế?",
    context: "Dùng khi tình cờ gặp lại một người quen sau một khoảng thời gian dài.",
    pronunciation_tip: "Nhấn mạnh vào 'Long time' và 'What have you been up to'.",
    dialogue: {
      speaker_a: "Long time no see! What have you been up to lately?",
      speaker_b: "Just the usual work routine! How about we grab a coffee sometime?",
      speaker_b_vi: "Vẫn đi làm như bình thường thôi! Hôm nào rảnh chúng mình đi cafe nhé?"
    }
  },
  {
    id: 3,
    category: "greetings",
    category_name: "Chào hỏi & Làm quen",
    sentence_en: "Fancy meeting you here! What brings you around this part of town?",
    sentence_vi: "Thật bất ngờ khi gặp bạn ở đây! Có việc gì đưa bạn đến khu vực này thế?",
    context: "Dùng khi tình cờ chạm mặt bạn bè ở một địa điểm không ngờ tới.",
    pronunciation_tip: "Ngữ điệu vui vẻ, hào hứng ở 'Fancy meeting you'.",
    dialogue: {
      speaker_a: "Fancy meeting you here! What brings you around this part of town?",
      speaker_b: "I had a quick meeting nearby, and I decided to drop by this bookstore!",
      speaker_b_vi: "Tôi có cuộc họp gần đây, tiện thể ghé qua hiệu sách này chút!"
    }
  },
  {
    id: 4,
    category: "greetings",
    category_name: "Chào hỏi & Làm quen",
    sentence_en: "It's so great to finally meet you in person!",
    sentence_vi: "Thật tuyệt vời khi cuối cùng cũng được gặp trực tiếp bạn ngoài đời!",
    context: "Dùng khi lần đầu gặp người mà bạn mới chỉ nói chuyện qua mạng, email hoặc điện thoại.",
    pronunciation_tip: "Nối âm: 'in person' /ɪn ˈpɜːsən/, nhấn vào 'finally' và 'in person'.",
    dialogue: {
      speaker_a: "It's so great to finally meet you in person!",
      speaker_b: "Likewise! I've heard so many wonderful things about you.",
      speaker_b_vi: "Tôi cũng vậy! Tôi đã nghe rất nhiều điều tuyệt vời về bạn."
    }
  },
  {
    id: 5,
    category: "greetings",
    category_name: "Chào hỏi & Làm quen",
    sentence_en: "Do you mind if I sit here? It's pretty crowded today.",
    sentence_vi: "Bạn có phiền nếu tôi ngồi ở đây không? Hôm nay quán khá đông đúc.",
    context: "Dùng để xin phép ngồi chung bàn lịch sự ở quán cafe, thư viện hoặc tàu xe.",
    pronunciation_tip: "Lên giọng ở cuối câu hỏi 'today?'. Nhớ: Người trả lời 'Not at all' nghĩa là đồng ý cho ngồi.",
    dialogue: {
      speaker_a: "Do you mind if I sit here? It's pretty crowded today.",
      speaker_b: "Not at all, please have a seat! Make yourself comfortable.",
      speaker_b_vi: "Không phiền chút nào, xin mời bạn ngồi! Cứ tự nhiên nhé."
    }
  },
  {
    id: 6,
    category: "greetings",
    category_name: "Chào hỏi & Làm quen",
    sentence_en: "How was your weekend? Did you get up to anything special?",
    sentence_vi: "Cuối tuần của bạn thế nào? Bạn có đi đâu hoặc làm gì đặc biệt không?",
    context: "Câu mở đầu cuộc trò chuyện kinh điển vào sáng Thứ Hai tại nơi làm việc hoặc trường học.",
    pronunciation_tip: "Nối âm: 'get up to' /ɡet ʌp tuː/.",
    dialogue: {
      speaker_a: "How was your weekend? Did you get up to anything special?",
      speaker_b: "Pretty relaxing, actually. I just stayed in and caught up on some reading.",
      speaker_b_vi: "Khá thảnh thơi. Tôi chỉ ở nhà và đọc vài cuốn sách."
    }
  },
  {
    id: 7,
    category: "greetings",
    category_name: "Chào hỏi & Làm quen",
    sentence_en: "Nice weather we're having today, isn't it?",
    sentence_vi: "Thời tiết hôm nay đẹp thật đấy, bạn có thấy vậy không?",
    context: "Bắt chuyện xã giao (Small talk) phổ biến nhất của người bản xứ Anh/Mỹ.",
    pronunciation_tip: "Hạ giọng ở câu hỏi đuôi 'isn't it?' khi muốn đối phương đồng tình.",
    dialogue: {
      speaker_a: "Nice weather we're having today, isn't it?",
      speaker_b: "Absolutely gorgeous! Perfect day for a walk in the park.",
      speaker_b_vi: "Tuyệt đẹp luôn! Quá hoàn hảo cho một buổi đi dạo trong công viên."
    }
  },

  // 2. Công sở & Đồng nghiệp (Workplace & Office)
  {
    id: 8,
    category: "workplace",
    category_name: "Công sở & Đồng nghiệp",
    sentence_en: "Could you bring me up to speed on the latest project updates?",
    sentence_vi: "Bạn có thể cập nhật nhanh cho tôi tiến độ mới nhất của dự án không?",
    context: "Cụm 'bring someone up to speed' là thành ngữ công sở cực kỳ thông dụng để cập nhật tình hình.",
    pronunciation_tip: "Nối âm: 'bring me up to speed' /brɪŋ miː ʌp tuː spiːd/.",
    dialogue: {
      speaker_a: "Could you bring me up to speed on the latest project updates?",
      speaker_b: "Sure thing! We just wrapped up the design phase and moved into development.",
      speaker_b_vi: "Chắc chắn rồi! Chúng tôi vừa chốt xong khâu thiết kế và chuyển sang lập trình."
    }
  },
  {
    id: 9,
    category: "workplace",
    category_name: "Công sở & Đồng nghiệp",
    sentence_en: "Let's touch base tomorrow morning to finalize the report.",
    sentence_vi: "Sáng mai chúng ta hãy trao đổi nhanh để hoàn thiện bản báo cáo nhé.",
    context: "'Touch base' có nghĩa là liên lạc, họp nhanh ngắn gọn để nắm tình hình.",
    pronunciation_tip: "Nhấn vào 'touch base' và 'finalize'.",
    dialogue: {
      speaker_a: "Let's touch base tomorrow morning to finalize the report.",
      speaker_b: "Sounds good to me. How does 9:30 AM work for your schedule?",
      speaker_b_vi: "Nghe hợp lý đấy. 9:30 sáng có tiện với lịch của bạn không?"
    }
  },
  {
    id: 10,
    category: "workplace",
    category_name: "Công sở & Đồng nghiệp",
    sentence_en: "I see where you're coming from, but let's consider another perspective.",
    sentence_vi: "Tôi hiểu góc nhìn của bạn, nhưng chúng ta hãy thử xem xét một khía cạnh khác.",
    context: "Cách phản biện và đưa ra ý kiến bất đồng một cách hòa nhã, lịch thiệp và chuyên nghiệp.",
    pronunciation_tip: "Nói nhẹ nhàng ở vế đầu để tạo cảm giác tôn trọng đối phương.",
    dialogue: {
      speaker_a: "I see where you're coming from, but let's consider another perspective.",
      speaker_b: "I'm open to suggestions. What alternative do you have in mind?",
      speaker_b_vi: "Tôi rất sẵn lòng lắng nghe. Bạn đang nghĩ đến phương án nào?"
    }
  },
  {
    id: 11,
    category: "workplace",
    category_name: "Công sở & Đồng nghiệp",
    sentence_en: "Sorry for the delay in getting back to you, I've been swamped with deadlines.",
    sentence_vi: "Xin lỗi vì chậm phản hồi cho bạn, dạo này tôi ngập đầu trong các hạn chót.",
    context: "'Swamped with' là cách diễn đạt rất tự nhiên khi bạn quá bận rộn với công việc.",
    pronunciation_tip: "Âm /swɑːmpt/ bật âm đuôi /t/ nhẹ.",
    dialogue: {
      speaker_a: "Sorry for the delay in getting back to you, I've been swamped with deadlines.",
      speaker_b: "No worries at all, I completely understand how hectic this quarter is!",
      speaker_b_vi: "Không sao đâu, tôi hoàn toàn hiểu quý này bận rộn đến mức nào mà!"
    }
  },
  {
    id: 12,
    category: "workplace",
    category_name: "Công sở & Đồng nghiệp",
    sentence_en: "Can you give me a hand with this spreadsheet when you have a moment?",
    sentence_vi: "Khi nào rảnh tay, bạn có thể giúp tôi một chút với bảng tính này không?",
    context: "'Give someone a hand' là nhờ giúp đỡ lịch sự, thân thiện trong văn phòng.",
    pronunciation_tip: "Nối âm: 'give me a hand' /ɡɪv miː ə hænd/.",
    dialogue: {
      speaker_a: "Can you give me a hand with this spreadsheet when you have a moment?",
      speaker_b: "Give me about five minutes to finish this email, and I'll be right over.",
      speaker_b_vi: "Cho tôi khoảng 5 phút gửi nốt email này rồi tôi qua ngay nhé."
    }
  },
  {
    id: 13,
    category: "workplace",
    category_name: "Công sở & Đồng nghiệp",
    sentence_en: "Let's call it a day! We've made tremendous progress today.",
    sentence_vi: "Hôm nay chúng ta dừng ở đây thôi! Hôm nay chúng ta đã làm việc rất hiệu quả rồi.",
    context: "'Call it a day' là thành ngữ thông báo kết thúc ngày làm việc.",
    pronunciation_tip: "Nối âm: 'call it a' /kɔːl ɪt ə deɪ/.",
    dialogue: {
      speaker_a: "Let's call it a day! We've made tremendous progress today.",
      speaker_b: "Agreed! Time to pack up and get some well-deserved rest.",
      speaker_b_vi: "Đồng ý! Đến lúc dọn đồ về và nghỉ ngơi xứng đáng rồi."
    }
  },

  // 3. Ăn uống, Gọi món & Cafe (Dining, Ordering Food & Drinks)
  {
    id: 14,
    category: "dining",
    category_name: "Ăn uống, Gọi món & Cafe",
    sentence_en: "Could we have a table for two by the window, please?",
    sentence_vi: "Làm ơn cho chúng tôi xin một bàn hai người gần cửa sổ được không?",
    context: "Câu nói chuẩn mực khi bước vào nhà hàng hoặc quán ăn.",
    pronunciation_tip: "Lên giọng nhẹ ở 'window' và hạ giọng ở 'please'.",
    dialogue: {
      speaker_a: "Could we have a table for two by the window, please?",
      speaker_b: "Certainly! Right this way, please. Here are your menus.",
      speaker_b_vi: "Dạ vâng được ạ! Mời anh chị đi lối này. Đây là thực đơn ạ."
    }
  },
  {
    id: 15,
    category: "dining",
    category_name: "Ăn uống, Gọi món & Cafe",
    sentence_en: "What do you recommend as the house specialty?",
    sentence_vi: "Bạn có gợi ý món nào là đặc sản nổi tiếng nhất của quán không?",
    context: "Dùng để hỏi bồi bàn món ngon nhất khi đến một nhà hàng mới lạ.",
    pronunciation_tip: "Nhấn âm: /ˌrek.əˈmend/ và /ˈspeʃ.əl.ti/.",
    dialogue: {
      speaker_a: "What do you recommend as the house specialty?",
      speaker_b: "Our grilled salmon with lemon butter sauce is a customer favorite!",
      speaker_b_vi: "Món cá hồi nướng sốt bơ chanh là món được khách hàng yêu thích nhất ạ!"
    }
  },
  {
    id: 16,
    category: "dining",
    category_name: "Ăn uống, Gọi món & Cafe",
    sentence_en: "Can I get an iced Americano with less ice and no sugar, to go please?",
    sentence_vi: "Cho tôi một ly Americano đá, ít đá và không đường, mang đi nhé?",
    context: "Mẫu câu hoàn hảo và đầy đủ khi gọi đồ uống tại các chuỗi cafe quốc tế (Starbucks, Highlands).",
    pronunciation_tip: "Cụm 'to go' có nghĩa là mang đi (Takeaway).",
    dialogue: {
      speaker_a: "Can I get an iced Americano with less ice and no sugar, to go please?",
      speaker_b: "Sure thing! That will be fifty-five thousand dong. Cash or card?",
      speaker_b_vi: "Dạ được ạ! Của anh 55 nghìn đồng. Anh thanh toán tiền mặt hay chuyển khoản/thẻ ạ?"
    }
  },
  {
    id: 17,
    category: "dining",
    category_name: "Ăn uống, Gọi món & Cafe",
    sentence_en: "Could we get the bill, please? And can we split it?",
    sentence_vi: "Làm ơn tính tiền giúp chúng tôi với? Chúng tôi có thể chia hóa đơn được không?",
    context: "'Split the bill' hoặc 'Go Dutch' nghĩa là chia đều tiền cho từng người.",
    pronunciation_tip: "Nối âm: 'split it' /ˈsplɪt.ɪt/.",
    dialogue: {
      speaker_a: "Could we get the bill, please? And can we split it?",
      speaker_b: "Of course! Let me calculate the individual totals for both of you.",
      speaker_b_vi: "Dạ tất nhiên rồi ạ! Để em tính riêng phần của từng người cho hai anh chị nhé."
    }
  },
  {
    id: 18,
    category: "dining",
    category_name: "Ăn uống, Gọi món & Cafe",
    sentence_en: "Don't worry about the bill, it's on me today!",
    sentence_vi: "Đừng bận tâm về hóa đơn, hôm nay tôi bao!",
    context: "'It's on me' hoặc 'My treat' là câu nói kinh điển khi bạn muốn mời ai đó bữa ăn.",
    pronunciation_tip: "Nhấn mạnh vào từ 'on me'.",
    dialogue: {
      speaker_a: "Don't worry about the bill, it's on me today!",
      speaker_b: "Oh thank you so much! I'll definitely treat you next time.",
      speaker_b_vi: "Ôi cảm ơn bạn nhiều nhé! Lần tới nhất định để tôi mời bạn nhé."
    }
  },
  {
    id: 19,
    category: "dining",
    category_name: "Ăn uống, Gọi món & Cafe",
    sentence_en: "Excuse me, could you wrap this up for takeaway, please?",
    sentence_vi: "Em ơi, gói giúp anh phần thức ăn thừa này mang về với nhé?",
    context: "Dùng khi ăn không hết và muốn xin hộp mang về (Doggy bag / Takeaway).",
    pronunciation_tip: "Nối âm: 'wrap this up' /ræp ðɪs ʌp/.",
    dialogue: {
      speaker_a: "Excuse me, could you wrap this up for takeaway, please?",
      speaker_b: "Right away, sir! I'll bring you a container right now.",
      speaker_b_vi: "Dạ có ngay ạ thưa anh! Em sẽ mang hộp đựng ra cho anh ngay đây ạ."
    }
  },

  // 4. Mua sắm & Trả giá (Shopping & Bargaining)
  {
    id: 20,
    category: "shopping",
    category_name: "Mua sắm & Trả giá",
    sentence_en: "Do you happen to have this jacket in a medium size?",
    sentence_vi: "Cửa hàng mình có chiếc áo khoác này size M không bạn nhỉ?",
    context: "Hỏi tìm kích cỡ hoặc màu sắc tại quầy quần áo.",
    pronunciation_tip: "'Do you happen to have' là cách hỏi khéo léo, lịch sự hơn 'Do you have'.",
    dialogue: {
      speaker_a: "Do you happen to have this jacket in a medium size?",
      speaker_b: "Let me check our stock in the back room. I'll be back in just a second!",
      speaker_b_vi: "Để em kiểm tra trong kho xem sao nhé. Em sẽ quay lại ngay trong giây lát ạ!"
    }
  },
  {
    id: 21,
    category: "shopping",
    category_name: "Mua sắm & Trả giá",
    sentence_en: "Is there any promotional discount if I purchase two items?",
    sentence_vi: "Nếu tôi mua hai món thì có được áp dụng chương trình giảm giá nào không?",
    context: "Hỏi chương trình khuyến mãi hoặc chiết khấu khi mua sắm.",
    pronunciation_tip: "Nhấn âm: /prəˈmoʊ.ʃən.əl ˈdɪs.kaʊnt/.",
    dialogue: {
      speaker_a: "Is there any promotional discount if I purchase two items?",
      speaker_b: "Yes! We have a buy-one-get-the-second-at-half-price deal today.",
      speaker_b_vi: "Dạ có ạ! Hôm nay bên em có ưu đãi mua 1 món thì món thứ 2 được giảm 50% ạ."
    }
  },
  {
    id: 22,
    category: "shopping",
    category_name: "Mua sắm & Trả giá",
    sentence_en: "Could you do a little better on the price? It's slightly over my budget.",
    sentence_vi: "Bạn có thể bớt giá thêm một chút được không? Giá này hơi vượt quá ngân sách của tôi.",
    context: "Cách trả giá văn minh, tế nhị tại các khu chợ du lịch hoặc cửa hàng đồ cũ.",
    pronunciation_tip: "'Do a little better on the price' là cách nói bản ngữ rất lịch thiệp thay vì 'Too expensive'.",
    dialogue: {
      speaker_a: "Could you do a little better on the price? It's slightly over my budget.",
      speaker_b: "Well, since you're paying in cash, I can take ten percent off for you.",
      speaker_b_vi: "À, vì bạn thanh toán tiền mặt nên tôi có thể giảm 10% cho bạn nhé."
    }
  },
  {
    id: 23,
    category: "shopping",
    category_name: "Mua sắm & Trả giá",
    sentence_en: "I'd like to exchange this for a different size, here is my receipt.",
    sentence_vi: "Tôi muốn đổi món đồ này sang size khác, đây là hóa đơn mua hàng của tôi.",
    context: "Dùng khi quay lại cửa hàng để đổi size hoặc đổi màu.",
    pronunciation_tip: "Lưu ý từ 'receipt' có chữ 'p' câm, phát âm là /rɪˈsiːt/.",
    dialogue: {
      speaker_a: "I'd like to exchange this for a different size, here is my receipt.",
      speaker_b: "No problem at all! Let me find the larger size for you right away.",
      speaker_b_vi: "Dạ không vấn đề gì ạ! Để em lấy size lớn hơn cho anh ngay ạ."
    }
  },

  // 5. Du lịch, Hỏi đường & Khách sạn (Travel & Directions)
  {
    id: 24,
    category: "travel",
    category_name: "Du lịch, Hỏi đường & Khách sạn",
    sentence_en: "Excuse me, could you point me in the direction of the nearest metro station?",
    sentence_vi: "Xin lỗi, bạn có thể chỉ giúp tôi đường đi đến ga tàu điện ngầm gần nhất không?",
    context: "Hỏi đường lịch sự với người đi đường ở nước ngoài.",
    pronunciation_tip: "Cụm 'point me in the direction of' nghe rất tự nhiên.",
    dialogue: {
      speaker_a: "Excuse me, could you point me in the direction of the nearest metro station?",
      speaker_b: "Just walk straight two blocks and take a left at the traffic lights. You can't miss it!",
      speaker_b_vi: "Cứ đi thẳng qua hai dãy nhà rồi rẽ trái ở cột đèn giao thông. Bạn sẽ thấy nó ngay thôi!"
    }
  },
  {
    id: 25,
    category: "travel",
    category_name: "Du lịch, Hỏi đường & Khách sạn",
    sentence_en: "Hi there, I have a reservation under the name of Nguyen Vu.",
    sentence_vi: "Xin chào, tôi đã đặt phòng trước dưới tên Nguyễn Vũ.",
    context: "Câu nói chuẩn khi làm thủ tục Check-in tại khách sạn hoặc chuyến bay.",
    pronunciation_tip: "Nhấn âm: /ˌrez.ɚˈveɪ.ʃən/.",
    dialogue: {
      speaker_a: "Hi there, I have a reservation under the name of Nguyen Vu.",
      speaker_b: "Welcome Mr. Vu! Yes, we have your Deluxe room ready. May I have your passport?",
      speaker_b_vi: "Chào mừng anh Vũ! Dạ vâng, phòng Deluxe của anh đã sẵn sàng. Em xin phép mượn hộ chiếu của anh ạ?"
    }
  },
  {
    id: 26,
    category: "travel",
    category_name: "Du lịch, Hỏi đường & Khách sạn",
    sentence_en: "Is breakfast included in the room rate, and what time is it served?",
    sentence_vi: "Bữa sáng đã bao gồm trong giá phòng chưa ạ, và được phục vụ vào khung giờ nào?",
    context: "Hỏi thông tin tiện ích phòng khách sạn.",
    pronunciation_tip: "Lưu ý nối âm 'breakfast included' /ˈbrek.fəst ɪnˈkluː.dɪd/.",
    dialogue: {
      speaker_a: "Is breakfast included in the room rate, and what time is it served?",
      speaker_b: "Yes, complimentary buffet breakfast is served on the second floor from 6:30 to 10 AM.",
      speaker_b_vi: "Dạ có, buffet sáng miễn phí được phục vụ tại tầng 2 từ 6:30 đến 10 giờ sáng ạ."
    }
  },

  // 6. Cảm xúc, Đồng tình & Khen ngợi (Feelings & Compliments)
  {
    id: 27,
    category: "feelings",
    category_name: "Cảm xúc, Đồng tình & Khen ngợi",
    sentence_en: "I couldn't agree with you more! You completely hit the nail on the head.",
    sentence_vi: "Tôi hoàn toàn đồng ý với bạn! Bạn đã nói trúng tim đen / trúng vấn đề rồi đấy.",
    context: "'Hit the nail on the head' là thành ngữ khen ai đó nói rất chuẩn xác.",
    pronunciation_tip: "Nhấn mạnh cảm xúc vào 'couldn't agree with you more'.",
    dialogue: {
      speaker_a: "I couldn't agree with you more! You completely hit the nail on the head.",
      speaker_b: "Thanks! I'm glad we see eye to eye on this matter.",
      speaker_b_vi: "Cảm ơn bạn! Thật mừng vì chúng ta có chung quan điểm về việc này."
    }
  },
  {
    id: 28,
    category: "feelings",
    category_name: "Cảm xúc, Đồng tình & Khen ngợi",
    sentence_en: "You did an incredible job on that speech! You should be really proud of yourself.",
    sentence_vi: "Bạn đã làm xuất sắc bài phát biểu đó! Bạn thực sự nên tự hào về bản thân.",
    context: "Lời khen ngợi chân thành và động viên đồng nghiệp hoặc bạn bè sau một thành tích.",
    pronunciation_tip: "Nhấn vào 'incredible' /ɪnˈkred.ə.bəl/ và 'proud'.",
    dialogue: {
      speaker_a: "You did an incredible job on that speech! You should be really proud of yourself.",
      speaker_b: "That means the world to me, thank you! I was so nervous beforehand.",
      speaker_b_vi: "Lời khen đó có ý nghĩa rất lớn với tôi, cảm ơn bạn! Trước đó tôi đã lo phát run đấy."
    }
  },
  {
    id: 29,
    category: "feelings",
    category_name: "Cảm xúc, Đồng tình & Khen ngợi",
    sentence_en: "Don't take it to heart, everyone makes mistakes sometimes.",
    sentence_vi: "Đừng để bụng / đừng buồn lòng quá nhé, ai rồi cũng có lúc mắc sai sót mà.",
    context: "'Don't take it to heart' là câu an ủi tuyệt vời khi bạn bè gặp chuyện không vui hoặc làm sai.",
    pronunciation_tip: "Nối âm: 'take it to heart' /teɪk ɪt tuː hɑːrt/.",
    dialogue: {
      speaker_a: "Don't take it to heart, everyone makes mistakes sometimes.",
      speaker_b: "Thanks for cheering me up. I really needed to hear that today.",
      speaker_b_vi: "Cảm ơn bạn đã an ủi tôi. Hôm nay tôi thực sự rất cần nghe câu nói đó."
    }
  },

  // 7. Gọi điện, Đặt hẹn & Lên lịch (Scheduling & Phone Calls)
  {
    id: 30,
    category: "scheduling",
    category_name: "Gọi điện, Đặt hẹn & Lên lịch",
    sentence_en: "Hi David, I'm calling to see if you're free for a quick chat?",
    sentence_vi: "Chào David, tôi gọi để xem bạn có đang rảnh để nói chuyện nhanh chút không?",
    context: "Cách mở đầu cuộc gọi điện thoại chuyên nghiệp, tôn trọng thời gian của người nhận.",
    pronunciation_tip: "Nói rõ ràng, thân mật và không vội vã.",
    dialogue: {
      speaker_a: "Hi David, I'm calling to see if you're free for a quick chat?",
      speaker_b: "Hey Vu! Yes, I have about ten minutes before my next meeting. What's up?",
      speaker_b_vi: "Chào Vũ! Được chứ, tôi có khoảng 10 phút trước cuộc họp tiếp theo. Có chuyện gì thế?"
    }
  },
  {
    id: 31,
    category: "scheduling",
    category_name: "Gọi điện, Đặt hẹn & Lên lịch",
    sentence_en: "Something unexpected came up, would you mind if we rescheduled for next week?",
    sentence_vi: "Tôi có việc đột xuất phát sinh, bạn có phiền nếu chúng ta dời lịch sang tuần sau không?",
    context: "Cách xin dời lịch hẹn lịch thiệp khi có tình huống ngoài ý muốn.",
    pronunciation_tip: "Cụm 'something came up' rất phổ biến trong giao tiếp.",
    dialogue: {
      speaker_a: "Something unexpected came up, would you mind if we rescheduled for next week?",
      speaker_b: "No problem at all! Let me know what days work best for you then.",
      speaker_b_vi: "Không vấn đề gì đâu! Lúc đó ngày nào tiện nhất cho bạn thì nhắn tôi nhé."
    }
  },

  // 8. Nhờ giúp đỡ, Xin lỗi & Cảm ơn (Help & Apologies)
  {
    id: 32,
    category: "help",
    category_name: "Nhờ giúp đỡ, Xin lỗi & Cảm ơn",
    sentence_en: "Would you be able to do me a huge favor if you're not too busy?",
    sentence_vi: "Nếu bạn không quá bận, bạn có thể giúp tôi một việc lớn này được không?",
    context: "Cách mở lời nhờ vả chân thành và không gây áp lực.",
    pronunciation_tip: "'Do me a favor' nối âm /duː miː ə ˈfeɪ.vɚ/.",
    dialogue: {
      speaker_a: "Would you be able to do me a huge favor if you're not too busy?",
      speaker_b: "Of course! What do you need help with?",
      speaker_b_vi: "Tất nhiên rồi! Bạn cần tôi giúp việc gì thế?"
    }
  },
  {
    id: 33,
    category: "help",
    category_name: "Nhờ giúp đỡ, Xin lỗi & Cảm ơn",
    sentence_en: "I'm terribly sorry for the misunderstanding, that was entirely my fault.",
    sentence_vi: "Tôi vô cùng xin lỗi vì sự hiểu lầm này, đó hoàn toàn là lỗi do tôi sơ suất.",
    context: "Nhận lỗi chuyên nghiệp, dứt khoát và lịch sự khi có sai sót.",
    pronunciation_tip: "Nhấn vào 'terribly sorry' và 'entirely my fault'.",
    dialogue: {
      speaker_a: "I'm terribly sorry for the misunderstanding, that was entirely my fault.",
      speaker_b: "Don't worry about it, let's just focus on finding a solution together.",
      speaker_b_vi: "Đừng lo lắng về chuyện đó nữa, chúng ta hãy cùng tập trung tìm giải pháp khắc phục nhé."
    }
  },

  // 9. Tạm biệt & Giữ liên lạc (Goodbyes & Keeping in Touch)
  {
    id: 34,
    category: "goodbyes",
    category_name: "Tạm biệt & Giữ liên lạc",
    sentence_en: "It was really wonderful catching up with you! Let's not wait so long next time.",
    sentence_vi: "Thật sự rất vui khi được gặp lại và trò chuyện với bạn! Lần tới đừng để lâu thế này mới gặp nhé.",
    context: "Câu chào tạm biệt ấm áp sau buổi hẹn gặp cafe hoặc ăn tối.",
    pronunciation_tip: "'Catching up' nghĩa là cập nhật tin tức cuộc sống cho nhau nghe.",
    dialogue: {
      speaker_a: "It was really wonderful catching up with you! Let's not wait so long next time.",
      speaker_b: "I agree completely! Text me when you get home safely.",
      speaker_b_vi: "Tôi hoàn toàn đồng ý! Về đến nhà an toàn thì nhắn tin cho tôi nhé."
    }
  },
  {
    id: 35,
    category: "goodbyes",
    category_name: "Tạm biệt & Giữ liên lạc",
    sentence_en: "Take care and keep in touch! Best of luck with your upcoming exam.",
    sentence_vi: "Bảo trọng và giữ liên lạc nhé! Chúc bạn thi thật tốt trong kỳ thi sắp tới.",
    context: "Lời chúc và tạm biệt bạn bè chuẩn bị đi xa hoặc chuẩn bị thi cử.",
    pronunciation_tip: "Nói truyền cảm hứng, ấm áp.",
    dialogue: {
      speaker_a: "Take care and keep in touch! Best of luck with your upcoming exam.",
      speaker_b: "Thank you so much for your support! I'll let you know how it goes.",
      speaker_b_vi: "Cảm ơn bạn rất nhiều vì đã luôn ủng hộ tôi! Có kết quả tôi sẽ báo cho bạn biết ngay."
    }
  }
,
{
  "id": 36,
  "category": "greetings",
  "category_name": "Chào hỏi & Làm quen",
  "sentence_en": "How have you been holding up with all this chilly weather?",
  "sentence_vi": "Bạn có chịu được đợt thời tiết lạnh buốt này không đấy?",
  "context": "Hỏi thăm sức khỏe khi thời tiết thay đổi đột ngột.",
  "pronunciation_tip": "'Holding up' là duy trì tình trạng ổn định.",
  "dialogue": {
    "speaker_a": "How have you been holding up with all this chilly weather?",
    "speaker_b": "Barely! I've been glued to my heater with warm tea all day.",
    "speaker_b_vi": "Khó khăn lắm! Tôi phải dính chặt lấy máy sưởi và uống trà nóng cả ngày."
  }
},
{
  "id": 37,
  "category": "greetings",
  "category_name": "Chào hỏi & Làm quen",
  "sentence_en": "It's an absolute pleasure to make your acquaintance!",
  "sentence_vi": "Rất hân hạnh và vinh dự khi được làm quen với bạn!",
  "context": "Lời chào trịnh trọng, lịch thiệp trong các sự kiện hội thảo, kinh doanh.",
  "pronunciation_tip": "Nhấn âm: /əˈkweɪn.təns/.",
  "dialogue": {
    "speaker_a": "It's an absolute pleasure to make your acquaintance!",
    "speaker_b": "The pleasure is all mine! I've looked forward to this meeting.",
    "speaker_b_vi": "Vinh hạnh là của tôi! Tôi đã rất trông đợi cuộc gặp này."
  }
},
{
  "id": 38,
  "category": "workplace",
  "category_name": "Công sở & Đồng nghiệp",
  "sentence_en": "Let's keep each other in the loop as soon as the client responds.",
  "sentence_vi": "Hãy cập nhật thông tin liên tục cho nhau ngay khi khách hàng phản hồi nhé.",
  "context": "'In the loop' có nghĩa là luôn được cập nhật tin tức kịp thời.",
  "pronunciation_tip": "Nối âm: 'in the loop' /ɪn ðə luːp/.",
  "dialogue": {
    "speaker_a": "Let's keep each other in the loop as soon as the client responds.",
    "speaker_b": "Will do! I'll ping you on Slack the moment their email lands.",
    "speaker_b_vi": "Nhất trí! Mình sẽ nhắn tin cho bạn trên Slack ngay khi email của họ đến."
  }
},
{
  "id": 39,
  "category": "workplace",
  "category_name": "Công sở & Đồng nghiệp",
  "sentence_en": "Can we walk through the slide deck together before the presentation?",
  "sentence_vi": "Chúng ta có thể rà soát lại toàn bộ bộ slide thuyết trình cùng nhau trước giờ G không?",
  "context": "'Walk through' nghĩa là đi qua từng phần để kiểm tra kỹ lưỡng.",
  "pronunciation_tip": "Nhấn vào 'walk through' và 'slide deck'.",
  "dialogue": {
    "speaker_a": "Can we walk through the slide deck together before the presentation?",
    "speaker_b": "Definitely! Let's book meeting room 3 for a 20-minute rehearsal.",
    "speaker_b_vi": "Chắc chắn rồi! Hãy đặt phòng họp số 3 để tập dượt thử 20 phút nhé."
  }
},
{
  "id": 40,
  "category": "workplace",
  "category_name": "Công sở & Đồng nghiệp",
  "sentence_en": "I'm really pressed for time right now, could we discuss this over lunch?",
  "sentence_vi": "Hiện tại tôi đang rất gấp gáp thời gian, chúng ta có thể trao đổi trong giờ ăn trưa được không?",
  "context": "'Pressed for time' là cách diễn đạt tự nhiên khi đang quá bận hoặc sát giờ hẹn.",
  "pronunciation_tip": "Nhấn vào 'pressed for time'.",
  "dialogue": {
    "speaker_a": "I'm really pressed for time right now, could we discuss this over lunch?",
    "speaker_b": "Sure, no problem! Let's meet at the cafeteria around 12:15.",
    "speaker_b_vi": "Được chứ, không vấn đề gì! Gặp nhau ở căng tin lúc 12:15 nhé."
  }
},
{
  "id": 41,
  "category": "dining",
  "category_name": "Ăn uống, Gọi món & Cafe",
  "sentence_en": "Does this dish contain any peanuts or shellfish? I'm allergic.",
  "sentence_vi": "Món ăn này có chứa đậu phộng hay hải sản vỏ cứng không? Tôi bị dị ứng.",
  "context": "Hỏi thông tin dị ứng thực phẩm - cực kỳ thiết yếu khi đi du lịch nước ngoài.",
  "pronunciation_tip": "Nhấn âm: /əˈlɝː.dʒɪk/ (allergic).",
  "dialogue": {
    "speaker_a": "Does this dish contain any peanuts or shellfish? I'm allergic.",
    "speaker_b": "Not at all, sir! But I'll make an explicit note for the kitchen just to be safe.",
    "speaker_b_vi": "Dạ không có thưa anh! Nhưng em sẽ ghi chú rõ ràng cho đầu bếp để an toàn tuyệt đối."
  }
},
{
  "id": 42,
  "category": "dining",
  "category_name": "Ăn uống, Gọi món & Cafe",
  "sentence_en": "Can we get an extra set of cutlery and some paper napkins, please?",
  "sentence_vi": "Cho chúng tôi xin thêm một bộ dao muỗng nĩa và ít khăn giấy ăn với ạ?",
  "context": "Yêu cầu thêm dụng cụ ăn uống tại bàn tiệc.",
  "pronunciation_tip": "Lưu ý từ 'cutlery' /ˈkʌt.lɚ.i/.",
  "dialogue": {
    "speaker_a": "Can we get an extra set of cutlery and some paper napkins, please?",
    "speaker_b": "Here you go, sir! Please let me know if you need anything else.",
    "speaker_b_vi": "Dạ của anh đây ạ! Xin cứ gọi em nếu anh cần thêm bất cứ thứ gì nữa nhé."
  }
},
{
  "id": 43,
  "category": "shopping",
  "category_name": "Mua sắm & Trả giá",
  "sentence_en": "Do you accept contactless payment or Apple Pay here?",
  "sentence_vi": "Cửa hàng mình có chấp nhận thanh toán chạm một chạm hay Apple Pay không?",
  "context": "Hỏi phương thức thanh toán không tiền mặt hiện đại.",
  "pronunciation_tip": "Nhấn vào 'contactless payment'.",
  "dialogue": {
    "speaker_a": "Do you accept contactless payment or Apple Pay here?",
    "speaker_b": "Yes, we do! You can just tap your phone or card right onto the reader.",
    "speaker_b_vi": "Dạ có ạ! Anh chỉ cần chạm điện thoại hoặc thẻ vào máy đọc này là được ạ."
  }
},
{
  "id": 44,
  "category": "shopping",
  "category_name": "Mua sắm & Trả giá",
  "sentence_en": "Is this electronic device covered by an international warranty?",
  "sentence_vi": "Thiết bị điện tử này có được bảo hành quốc tế chính hãng không?",
  "context": "Hỏi chính sách bảo hành khi mua đồ công nghệ (laptop, điện thoại, tai nghe).",
  "pronunciation_tip": "Nhấn âm: /ˌɪn.t̬ɚˈnæʃ.ən.əl ˈwɔːr.ən.t̬i/.",
  "dialogue": {
    "speaker_a": "Is this electronic device covered by an international warranty?",
    "speaker_b": "Yes, it comes with a 12-month global warranty valid at any authorized center.",
    "speaker_b_vi": "Dạ có, sản phẩm được bảo hành toàn cầu 12 tháng tại bất kỳ trung tâm ủy quyền nào."
  }
},
{
  "id": 45,
  "category": "travel",
  "category_name": "Du lịch, Hỏi đường & Khách sạn",
  "sentence_en": "Could you tell me how long the commute is from here to the airport by taxi?",
  "sentence_vi": "Bạn có thể cho tôi biết đi taxi từ đây ra sân bay mất khoảng bao lâu không?",
  "context": "Ước lượng thời gian di chuyển để không bị trễ chuyến bay.",
  "pronunciation_tip": "Nhấn âm: /kəˈmjuːt/ (commute).",
  "dialogue": {
    "speaker_a": "Could you tell me how long the commute is from here to the airport by taxi?",
    "speaker_b": "It usually takes about 35 minutes, but during rush hour it could be up to an hour.",
    "speaker_b_vi": "Thường mất khoảng 35 phút, nhưng vào giờ cao điểm có thể lên tới một tiếng đấy."
  }
},
{
  "id": 46,
  "category": "travel",
  "category_name": "Du lịch, Hỏi đường & Khách sạn",
  "sentence_en": "Could you store our luggage after check-out until our evening flight?",
  "sentence_vi": "Khách sạn có thể giữ hành lý giúp chúng tôi sau khi trả phòng đến giờ bay buổi tối không?",
  "context": "Gửi hành lý miễn phí ở quầy lễ tân (Luggage storage).",
  "pronunciation_tip": "Nối âm: 'store our luggage' /stɔːr ˈaʊ.ɚ ˈlʌɡ.ɪdʒ/.",
  "dialogue": {
    "speaker_a": "Could you store our luggage after check-out until our evening flight?",
    "speaker_b": "With pleasure! We'll keep it safely in our luggage room and give you a claim ticket.",
    "speaker_b_vi": "Dạ rất sẵn lòng! Chúng em sẽ cất an toàn trong phòng gửi đồ và đưa phiếu nhận lại cho anh."
  }
},
{
  "id": 47,
  "category": "feelings",
  "category_name": "Cảm xúc, Đồng tình & Khen ngợi",
  "sentence_en": "I'm feeling a bit under the weather today, I think I'm coming down with a cold.",
  "sentence_vi": "Hôm nay tôi thấy trong người hơi khó ở, chắc là tôi sắp bị cảm cúm rồi.",
  "context": "'Under the weather' là thành ngữ chỉ cảm giác mệt mỏi, không được khỏe.",
  "pronunciation_tip": "Cụm 'under the weather' đọc liền mạch /ˌʌn.dɚ ðə ˈweð.ɚ/.",
  "dialogue": {
    "speaker_a": "I'm feeling a bit under the weather today, I think I'm coming down with a cold.",
    "speaker_b": "Oh no! Make sure to drink plenty of fluids and get some sleep tonight.",
    "speaker_b_vi": "Ôi không! Hãy nhớ uống nhiều nước và ngủ sớm tối nay nhé."
  }
},
{
  "id": 48,
  "category": "feelings",
  "category_name": "Cảm xúc, Đồng tình & Khen ngợi",
  "sentence_en": "You took the words right out of my mouth! That was exactly what I was thinking.",
  "sentence_vi": "Bạn nói đúng ý tôi rồi đấy! Đó chính xác là những gì tôi đang nghĩ trong đầu.",
  "context": "Khen ngợi và đồng tình sâu sắc khi ai đó nói ra điều mình tâm đắc.",
  "pronunciation_tip": "Nối âm: 'out of my mouth' /aʊt əv maɪ maʊθ/.",
  "dialogue": {
    "speaker_a": "You took the words right out of my mouth! That was exactly what I was thinking.",
    "speaker_b": "Great minds think alike! I'm glad we are on the same page.",
    "speaker_b_vi": "Tư tưởng lớn gặp nhau rồi! Thật tuyệt khi chúng ta có chung suy nghĩ."
  }
},
{
  "id": 49,
  "category": "daily",
  "category_name": "Thói quen & Cuộc sống hàng ngày",
  "sentence_en": "I didn't sleep a wink last night because my neighbor's dog kept barking.",
  "sentence_vi": "Đêm qua tôi không chợp mắt được một tí nào vì con chó nhà hàng xóm cứ sủa suốt.",
  "context": "'Not sleep a wink' nghĩa là trằn trọc mất ngủ cả đêm không chợp mắt được.",
  "pronunciation_tip": "Nối âm: 'sleep a wink' /sliːp ə wɪŋk/.",
  "dialogue": {
    "speaker_a": "I didn't sleep a wink last night because my neighbor's dog kept barking.",
    "speaker_b": "That sounds dreadful! You're going to need an extra cup of coffee this morning.",
    "speaker_b_vi": "Nghe kinh khủng thật đấy! Sáng nay chắc bạn phải uống thêm một cốc cafe nữa rồi."
  }
},
{
  "id": 50,
  "category": "daily",
  "category_name": "Thói quen & Cuộc sống hàng ngày",
  "sentence_en": "I'm running out of battery, can I borrow your phone charger for a bit?",
  "sentence_vi": "Điện thoại của tôi sắp hết sạch pin rồi, tôi mượn củ sạc của bạn một lát được không?",
  "context": "Mượn đồ sạc điện thoại - tình huống xảy ra mỗi ngày ở quán cafe hay văn phòng.",
  "pronunciation_tip": "'Running out of' nối âm /ˈrʌn.ɪŋ aʊt əv/.",
  "dialogue": {
    "speaker_a": "I'm running out of battery, can I borrow your phone charger for a bit?",
    "speaker_b": "Here you go! Do you need Type-C or Lightning cable?",
    "speaker_b_vi": "Của bạn đây! Bạn cần dây cáp Type-C hay Lightning?"
  }
},
{
  "id": 51,
  "category": "daily",
  "category_name": "Thói quen & Cuộc sống hàng ngày",
  "sentence_en": "I'm going to hit the sack early tonight, I'm completely worn out.",
  "sentence_vi": "Tối nay tôi sẽ đi ngủ sớm thôi, người tôi mệt rã rời rồi.",
  "context": "'Hit the sack' là thành ngữ lóng thông dụng nghĩa là đi ngủ.",
  "pronunciation_tip": "Nối âm: 'hit the sack' /hɪt ðə sæk/.",
  "dialogue": {
    "speaker_a": "I'm going to hit the sack early tonight, I'm completely worn out.",
    "speaker_b": "Rest up well! Have sweet dreams and recharge your batteries.",
    "speaker_b_vi": "Nghỉ ngơi thật tốt nhé! Chúc bạn ngủ ngon và nạp lại năng lượng."
  }
},
{
  "id": 52,
  "category": "help",
  "category_name": "Nhờ giúp đỡ, Xin lỗi & Cảm ơn",
  "sentence_en": "Could you please keep an eye on my laptop for a minute while I use the restroom?",
  "sentence_vi": "Bạn có thể để mắt giúp tôi chiếc laptop một phút trong lúc tôi đi vệ sinh được không?",
  "context": "'Keep an eye on' là nhờ trông coi đồ đạc ở quán cafe.",
  "pronunciation_tip": "Nối âm: 'keep an eye on' /kiːp ən aɪ ɑːn/.",
  "dialogue": {
    "speaker_a": "Could you please keep an eye on my laptop for a minute while I use the restroom?",
    "speaker_b": "Sure, no problem! Take your time, I'll watch it for you.",
    "speaker_b_vi": "Được chứ, không sao đâu! Cứ từ từ nhé, tôi sẽ trông giúp bạn."
  }
},
{
  "id": 53,
  "category": "help",
  "category_name": "Nhờ giúp đỡ, Xin lỗi & Cảm ơn",
  "sentence_en": "I really appreciate your kind help, I couldn't have pulled it off without you!",
  "sentence_vi": "Tôi thực sự rất biết ơn sự giúp đỡ nhiệt tình của bạn, không có bạn thì tôi đã không làm nổi!",
  "context": "Lời cảm ơn sâu sắc khi hoàn thành một nhiệm vụ khó khăn nhờ sự hỗ trợ của người khác.",
  "pronunciation_tip": "'Pulled it off' có nghĩa là làm được / thực hiện thành công.",
  "dialogue": {
    "speaker_a": "I really appreciate your kind help, I couldn't have pulled it off without you!",
    "speaker_b": "Anytime! We're a team, and that's what teammates are for.",
    "speaker_b_vi": "Bất cứ lúc nào bạn nhé! Chúng ta là một đội, và đó là việc đồng đội luôn làm cho nhau mà."
  }
},
{
  "id": 54,
  "category": "goodbyes",
  "category_name": "Tạm biệt & Giữ liên lạc",
  "sentence_en": "Give my best regards to your family when you get home!",
  "sentence_vi": "Cho tôi gửi lời hỏi thăm ấm áp nhất tới gia đình bạn khi bạn về đến nhà nhé!",
  "context": "Lời chào gửi lời thăm hỏi gia đình rất chu đáo và ấm áp.",
  "pronunciation_tip": "Nhấn vào 'best regards' /ˌbest rɪˈɡɑːrdz/.",
  "dialogue": {
    "speaker_a": "Give my best regards to your family when you get home!",
    "speaker_b": "Thank you, I surely will! They send their love to you as well.",
    "speaker_b_vi": "Cảm ơn bạn, tôi chắc chắn sẽ chuyển lời! Mọi người ở nhà cũng gửi lời hỏi thăm bạn đấy."
  }
},
{
  "id": 55,
  "category": "goodbyes",
  "category_name": "Tạm biệt & Giữ liên lạc",
  "sentence_en": "Have a safe flight and shoot me a text as soon as you touch down!",
  "sentence_vi": "Chúc bạn có chuyến bay an toàn và nhớ nhắn cho tôi một tin ngay khi bạn hạ cánh nhé!",
  "context": "'Touch down' là hạ cánh (máy bay), 'shoot me a text' nghĩa là gửi cho tôi tin nhắn.",
  "pronunciation_tip": "Nối âm: 'shoot me a text' /ʃuːt miː ə tekst/.",
  "dialogue": {
    "speaker_a": "Have a safe flight and shoot me a text as soon as you touch down!",
    "speaker_b": "Will do! See you in a couple of weeks when I'm back in town.",
    "speaker_b_vi": "Nhất trí! Hẹn gặp bạn trong vài tuần nữa khi tôi quay lại thành phố nhé."
  }
}
];

if (typeof window !== "undefined") {
  window.CONVERSATION_CATEGORIES = CONVERSATION_CATEGORIES;
  window.DAILY_CONVERSATIONS = DAILY_CONVERSATIONS;
}
