// ============================================================================
// ENGLISH LISTENING PRACTICE MODULE (FORM CHUẨN ĐỀ THI HP3 - BỘ CÔNG AN)
// Cấu trúc 3 Parts - 20 Câu: Part 1 (Q1-5), Part 2 (Q6-10), Part 3 (Q11-15 & Map Q16-20)
// ============================================================================
const LISTENING_TESTS = [
  {
    id: "test_1",
    title: "ĐỀ SỐ 1: Listening HP3 (Đề Thi Gốc - Học Viện Kỹ Thuật & Công Nghệ An Ninh)",
    subtitle: "20 Câu hỏi • Thời lượng: 15 Phút • Audio Player tua ±5s • Bản đồ Map Labeling & Lời thoại song ngữ",
    parts: [
      {
        partNumber: 1,
        title: "Part 1: Phỏng Vấn Andrea (U16 Ice Hockey)",
        instruction: "Questions 1-5. Choose the correct letter, A, B or C. (2.5 points)\nYou will hear an interview with a 15-year-old girl called Andrea, who plays ice hockey for her National Under-16s Team.",
        audioSrc: "/audio/part1_andrea_ice_hockey.mp3",
        questions: [
          {
            id: 1,
            text: "1. Which sport does Andrea say she started playing first?",
            options: [
              { key: "A", text: "football" },
              { key: "B", text: "ice hockey" },
              { key: "C", text: "basketball" }
            ],
            correct: "C",
            explanation: "Andrea nói: 'I've always loved sport though, and have played basketball since I was five or six. I gave that up for a while when I got into football about five years ago... ice hockey not until about three years ago'. Môn đầu tiên cô ấy chơi là bóng rổ (basketball lúc 5-6 tuổi)."
          },
          {
            id: 2,
            text: "2. Andrea says that she first started playing ice hockey after",
            options: [
              { key: "A", text: "watching a family member play." },
              { key: "B", text: "seeing a game on television." },
              { key: "C", text: "talking about it with her friends." }
            ],
            correct: "B",
            explanation: "Andrea chia sẻ: 'My brother's into it, and I used to go to his games. His team wasn't very good though, so I didn't think of it as something I actually wanted to do. That moment came when there was a professional match on a sports program I was watching. I knew then I wanted to try it'."
          },
          {
            id: 3,
            text: "3. Why does Andrea think that playing against boys is important?",
            options: [
              { key: "A", text: "It improves her own playing skills." },
              { key: "B", text: "It proves there are many girls playing the sport." },
              { key: "C", text: "It increases respect for female players." }
            ],
            correct: "A",
            explanation: "Andrea khẳng định: 'I want to do better against boys somehow, I'm not sure why, which really helps to develop my talents' (giúp tôi phát triển tài năng và kỹ năng chơi của mình)."
          },
          {
            id: 4,
            text: "4. How did Andrea feel when she was chosen for the national under-16s team?",
            options: [
              { key: "A", text: "surprised to be asked" },
              { key: "B", text: "sorry to leave her club" },
              { key: "C", text: "confident in her abilities" }
            ],
            correct: "C",
            explanation: "Andrea nói: 'I'd been really happy with how I'd been playing for my club, and felt I could do just as well at a higher level. There'd been a lot of talk about me being picked, so I kind of knew it was coming' (tự tin mình sẽ chơi tốt tương tự ở cấp độ cao hơn)."
          },
          {
            id: 5,
            text: "5. Andrea’s favourite games are those which are",
            options: [
              { key: "A", text: "easy to win." },
              { key: "B", text: "shown on TV." },
              { key: "C", text: "exciting to watch." }
            ],
            correct: "C",
            explanation: "Andrea giải thích: 'If a game's close because both teams are good, then it's fantastic for the crowd to see, and better to play in because of that. It's far more interesting than scoring loads of goals...' (trận đấu giằng co sát nút thì khán giả xem vô cùng mãn nhãn, hấp dẫn hơn nhiều)."
          }
        ],
        transcript: [
          { speaker: "Interviewer", en: "Welcome Andrea. You're an expert ice hockey player now, but when did you start playing?", vi: "Chào mừng Andrea. Hiện bạn đã là một vận động viên khúc côn cầu trên băng cừ khôi, nhưng bạn bắt đầu chơi từ khi nào?" },
          { speaker: "Andrea", en: "Not until about three years ago, actually, so quite recently. I've come a long way quite quickly. I've always loved sport though, and have played basketball since I was five or six. I gave that up for a while when I got into football about five years ago, but started playing again once I'd lost interest in football.", vi: "Thực ra mới khoảng 3 năm trước thôi, khá là gần đây. Tôi đã tiến bộ rất nhanh. Dù vậy tôi luôn yêu thể thao và đã chơi bóng rổ từ khi mới 5, 6 tuổi. Tôi tạm nghỉ chơi một thời gian khi chuyển sang đá bóng khoảng 5 năm trước, nhưng đã bắt đầu chơi lại sau khi mất hứng thú với bóng đá." },
          { speaker: "Interviewer", en: "How did you first become interested in playing ice hockey?", vi: "Làm thế nào mà lần đầu tiên bạn thấy hứng thú với việc chơi khúc côn cầu trên băng?" },
          { speaker: "Andrea", en: "My brother's into it, and I used to go to his games. His team wasn't very good though, so I didn't think of it as something I actually wanted to do. That moment came when there was a professional match on a sports program I was watching. I knew then I wanted to try it, and fortunately, a couple of friends did too, so we all started playing together.", vi: "Anh trai tôi rất mê môn này và tôi thường đến xem các trận đấu của anh ấy. Nhưng đội của anh ấy không giỏi lắm, nên lúc đó tôi chưa nghĩ đây là môn mình thực sự muốn chơi. Khoảnh khắc quyết định đến khi có một trận đấu chuyên nghiệp trên chương trình thể thao tôi đang xem. Lúc đó tôi biết mình muốn thử sức, và may mắn thay một vài người bạn cũng vậy, thế là chúng tôi bắt đầu chơi cùng nhau." },
          { speaker: "Interviewer", en: "You sometimes play against boys' teams. How important is that?", vi: "Bạn thỉnh thoảng có thi đấu với các đội nam. Điều đó quan trọng như thế nào?" },
          { speaker: "Andrea", en: "Very. There are as many girls playing ice hockey now as there are boys, which is great. Attitudes towards us have always been positive in my experience. I want to do better against boys somehow, I'm not sure why, which really helps to develop my talents.", vi: "Rất quan trọng. Hiện nay số lượng bạn nữ chơi khúc côn cầu trên băng cũng nhiều như các bạn nam, điều đó thật tuyệt. Theo trải nghiệm của tôi thì thái độ đối với chúng tôi luôn rất tích cực. Tôi luôn muốn thể hiện tốt hơn khi đối đầu với các bạn nam, tôi cũng không rõ tại sao, nhưng điều này thực sự giúp phát triển tài năng của tôi." },
          { speaker: "Interviewer", en: "How did you feel when you were chosen for the national under-16s team?", vi: "Bạn cảm thấy thế nào khi được chọn vào đội tuyển U16 quốc gia?" },
          { speaker: "Andrea", en: "I'd been really happy with how I'd been playing for my club, and felt I could do just as well at a higher level. There'd been a lot of talk about me being picked, so I kind of knew it was coming. It was great for my parents, too. They felt great having a daughter in the national team.", vi: "Tôi đã rất hài lòng với phong độ của mình ở câu lạc bộ, và cảm thấy mình có thể thi đấu tốt tương tự ở một cấp độ cao hơn. Đã có rất nhiều người bàn tán về việc tôi được chọn, nên tôi cũng phần nào đoán trước được. Điều này cũng thật tuyệt vời đối với bố mẹ tôi. Họ rất tự hào khi có con gái góp mặt trong đội tuyển quốc gia." },
          { speaker: "Interviewer", en: "Are the national team matches your favourite games?", vi: "Các trận đấu ở đội tuyển quốc gia có phải là những trận đấu yêu thích nhất của bạn không?" },
          { speaker: "Andrea", en: "Not always, even though some of them are big games, and appear on national television. If a game's close because both teams are good, then it's fantastic for the crowd to see, and better to play in because of that. It's far more interesting than scoring loads of goals because we're so much better than the other team.", vi: "Không hẳn lúc nào cũng vậy, mặc dù một số trận là trận cầu lớn và được phát sóng trên truyền hình quốc gia. Nếu một trận đấu giằng co sát sao vì cả hai đội đều giỏi, thì khán giả xem sẽ vô cùng mãn nhãn, và được thi đấu trong bầu không khí đó cũng thích hơn nhiều. Nó thú vị hơn việc ghi hàng loạt bàn thắng chỉ vì chúng tôi vượt trội hơn hẳn đội kia." },
          { speaker: "Interviewer", en: "Any advice for people wanting to start playing ice hockey?", vi: "Bạn có lời khuyên nào cho những ai muốn bắt đầu chơi khúc côn cầu trên băng không?" },
          { speaker: "Andrea", en: "You can spend hours reading books about what you can and can't do, but there's no better way of becoming good than playing. So borrow some skates and a stick if you need to. You can buy your own later, and join a team so you can start playing straight away.", vi: "Bạn có thể dành hàng giờ đọc sách về những điều được và không được làm, nhưng không có cách nào giỏi hơn là hãy thực sự chơi. Vì vậy hãy mượn giày trượt và một cây gậy nếu cần. Bạn có thể tự mua sau, và hãy gia nhập một đội để có thể bắt đầu thi đấu ngay lập tức." },
          { speaker: "Interviewer", en: "Thank you Andrea.", vi: "Cảm ơn bạn Andrea." }
        ]
      },
      {
        partNumber: 2,
        title: "Part 2: Phỏng Vấn John Benton (25km Race)",
        instruction: "Questions 6-10. Choose the correct letter, A, B or C. (2.5 points)\nYou will hear an interview with a student called John Benton, who’s just completed a 25-kilometre running race.",
        audioSrc: "/audio/part2_john_benton_race.mp3",
        questions: [
          {
            id: 6,
            text: "6. Why did John decide to enter the race?",
            options: [
              { key: "A", text: "He was encouraged by his father to take part." },
              { key: "B", text: "He wanted to prove his friends wrong." },
              { key: "C", text: "He was inspired by a celebrity’s achievements." }
            ],
            correct: "B",
            explanation: "John chia sẻ: 'what finally made me get my running shoes out was my mates' attitude. They reckoned I was far too lazy to complete any race at all, so I was determined to show them I could do it' (đám bạn nghĩ anh quá lười, anh muốn chứng minh họ đã sai)."
          },
          {
            id: 7,
            text: "7. One feature of John’s training before the event was to",
            options: [
              { key: "A", text: "get some rest between training sessions." },
              { key: "B", text: "leave himself enough time to build up his fitness." },
              { key: "C", text: "set targets that he felt were realistic." }
            ],
            correct: "C",
            explanation: "John nói: 'First of all, I drew up a 12-week training plan, and built in goals I thought would be manageable' (manageable = realistic, các mục tiêu thực tế vừa sức)."
          },
          {
            id: 8,
            text: "8. John says that once he started training, he had difficulties",
            options: [
              { key: "A", text: "fitting it in around his usual school schedule." },
              { key: "B", text: "finding time for leisure activities after school." },
              { key: "C", text: "making himself run in cold weather before school." }
            ],
            correct: "A",
            explanation: "John nói: 'Getting back home again in time for the school bus caused problems though, and when I got home from school after 4pm, it was really too dark to run' (sắp xếp lịch chạy khớp với giờ xe buýt và lịch học trường)."
          },
          {
            id: 9,
            text: "9. What does John say about his diet before the race?",
            options: [
              { key: "A", text: "decided not to follow a very strict diet." },
              { key: "B", text: "left it almost too late to adopt a suitable diet." },
              { key: "C", text: "was unwilling to give up his favourite foods." }
            ],
            correct: "A",
            explanation: "John nói: 'Some runners do things like eat high-protein, high-carbohydrate diets, but I just tried to eat what I usually do, pretty healthily, apart from chocolate and chips...' (không theo chế độ ăn quá nghiêm ngặt, chỉ ăn lành mạnh bình thường)."
          },
          {
            id: 10,
            text: "10. What particularly encouraged John on the day of the race?",
            options: [
              { key: "A", text: "The atmosphere was much more positive than he’d expected." },
              { key: "B", text: "People he’d never met before were wishing him well." },
              { key: "C", text: "Some people in the crowd were there to support him personally." }
            ],
            correct: "C",
            explanation: "John kể: 'I actually spotted my mates holding up a sign with my name on. That really made me determined to finish the race' (bạn bè đứng trong đám đông cầm bảng cổ vũ tên riêng của anh ấy)."
          }
        ],
        transcript: [
          { speaker: "Interviewer", en: "Today I'm with John Benton, who's just taken part in a 25-kilometre running race. John, you'd never run that distance before. What made you decide to enter the race?", vi: "Hôm nay tôi có mặt cùng John Benton, người vừa tham gia cuộc chạy đua cự ly 25 km. John, bạn chưa từng chạy cự ly đó bao giờ. Điều gì khiến bạn quyết định tham gia cuộc đua?" },
          { speaker: "John", en: "Well, a few famous people had recently taken up running. One in particular ran twice the distance I did. That really impressed me. But what finally made me get my running shoes out was my mates' attitude. They reckoned I was far too lazy to complete any race at all, so I was determined to show them I could do it. Anyway, my dad's a keen runner, and once I decided to enter, he came along during my training runs as my running buddy, which was great.", vi: "Vâng, gần đây có một vài người nổi tiếng bắt đầu tập chạy. Đặc biệt có một người chạy gấp đôi cự ly của tôi. Điều đó thực sự gây ấn tượng với tôi. Nhưng điều cuối cùng thúc đẩy tôi xỏ giày chạy chính là thái độ của đám bạn. Họ cho rằng tôi quá lười để hoàn thành bất kỳ cuộc đua nào, vì vậy tôi quyết tâm chứng minh cho họ thấy tôi có thể làm được. Dù sao thì bố tôi cũng là người say mê chạy bộ, và khi tôi quyết định tham gia, ông đã chạy cùng tôi trong các buổi tập như một người bạn đồng hành, điều đó thật tuyệt." },
          { speaker: "Interviewer", en: "So how much training did you do beforehand?", vi: "Vậy bạn đã tập luyện bao nhiêu trước đó?" },
          { speaker: "John", en: "Well, I was pretty organised. First of all, I drew up a 12-week training plan, and built in goals I thought would be manageable. Dad wondered if I was being over-ambitious time-wise, because I hadn't run for a while, but then I do play football, so I knew I was in reasonable shape. I was told I shouldn't push myself too hard without resting and recovering between training sessions, but I admit I didn't really listen to that advice.", vi: "Tôi khá ngăn nắp và có kế hoạch. Trước hết, tôi lập một kế hoạch tập luyện 12 tuần và đặt ra các mục tiêu mà tôi nghĩ là vừa sức. Bố tự hỏi liệu tôi có quá tham vọng về mặt thời gian hay không vì đã lâu tôi không chạy, nhưng tôi có chơi bóng đá nên biết mình có thể lực tương đối ổn. Tôi được khuyên không nên ép bản thân quá sức mà không nghỉ ngơi hồi phục giữa các buổi tập, nhưng tôi thú nhận là mình không thực sự nghe theo lời khuyên đó." },
          { speaker: "Interviewer", en: "I imagine the training was tough. Were there any problems?", vi: "Tôi hình dung việc tập luyện rất vất vả. Có vấn đề gì phát sinh không?" },
          { speaker: "John", en: "Well, of course there were school mornings when the alarm went off really early, and it was freezing outside, but I'd still look forward to getting myself out there. Getting back home again in time for the school bus caused problems though, and when I got home from school after 4pm, it was really too dark to run, but I still went. Anyway, at least after my training, I could still play computer games on the sofa as usual.", vi: "Đương nhiên có những buổi sáng đi học chuông báo thức reo rất sớm và ngoài trời thì lạnh cóng, nhưng tôi vẫn háo hức xỏ giày ra ngoài. Tuy nhiên, việc chạy về nhà kịp giờ xe buýt trường học lại gây ra rắc rối, và khi tôi đi học về sau 4 giờ chiều thì trời đã quá tối để chạy, nhưng tôi vẫn cố gắng đi. Dù sao thì sau khi tập xong, tôi vẫn có thể nằm ghế sofa chơi điện tử như bình thường." },
          { speaker: "Interviewer", en: "And did you follow a special diet?", vi: "Và bạn có tuân theo chế độ ăn uống đặc biệt nào không?" },
          { speaker: "John", en: "Well, some runners do things like eat high-protein, high-carbohydrate diets, but I just tried to eat what I usually do, pretty healthily, apart from chocolate and chips, which I cut out, and I didn't miss them. Then about a week before the race, I started eating more carbohydrates, like pizza and pasta, to build up my energy levels. That worked fine, especially on the day of the race itself. I knew I had to start all that well before the race though; it's too late to experiment on the day.", vi: "Một số người chạy thường áp dụng chế độ ăn giàu protein, giàu carbs, nhưng tôi chỉ cố gắng ăn như bình thường một cách lành mạnh, ngoại trừ sô cô la và khoai tây chiên là tôi cắt bỏ hoàn toàn, và tôi cũng không thấy thèm chúng. Sau đó khoảng một tuần trước cuộc đua, tôi bắt đầu nạp nhiều carbohydrate hơn như pizza và mì Ý để tích lũy năng lượng. Điều đó phát huy hiệu quả rất tốt, đặc biệt là vào chính ngày thi đấu. Tôi biết mình phải chuẩn bị kỹ từ trước ngày đua; vào ngày thi mà thử nghiệm là quá muộn." },
          { speaker: "Interviewer", en: "And what was the day of the race like?", vi: "Và ngày thi đấu diễn ra như thế nào?" },
          { speaker: "John", en: "Pretty exciting! There were loads of people there when we arrived, and even complete strangers were wishing me luck. Anyway, once we'd all set off, everyone was cheering us along the route, and calling out the names of their friends. I actually spotted my mates holding up a sign with my name on. That really made me determined to finish the race.", vi: "Rất hồi hộp và phấn khích! Có rất đông người khi chúng tôi đến nơi, và thậm chí những người hoàn toàn xa lạ cũng chúc tôi may mắn. Khi tất cả chúng tôi xuất phát, mọi người dọc đường đều hò reo cổ vũ và gọi tên bạn bè họ. Tôi bất ngờ nhìn thấy đám bạn của mình đang giơ cao tấm biển có tên tôi. Điều đó thực sự tiếp thêm quyết tâm để tôi hoàn thành chặng đua." },
          { speaker: "Interviewer", en: "So did you have any strategies to help you keep going?", vi: "Vậy bạn có chiến thuật nào giúp duy trì thể lực và bước chạy không?" },
          { speaker: "John", en: "I had a finishing time in mind that I was aiming for, but once I'd started, the aim just became: keep going and cross the finish line. Since I'd never done a race like that before, I didn't have a personal best to beat. I'd been told too that starting too fast is a mistake, that I should just relax and enjoy it, then speed up before the end, which did work. It's blocking out the voice in your head telling you that you can't do it that's hardest. But I'd learnt to manage that by dealing with the race in stages, and remembering my training.", vi: "Tôi có một mốc thời gian về đích trong đầu để hướng tới, nhưng một khi đã chạy, mục tiêu chỉ đơn giản là: tiếp tục chạy và vượt qua vạch đích. Vì chưa từng chạy cuộc đua nào như vậy trước đây, tôi không có kỷ lục cá nhân nào để phá. Tôi cũng được dặn rằng xuất phát quá nhanh là sai lầm, tôi nên thả lỏng và tận hưởng chặng đua, sau đó mới tăng tốc ở đoạn cuối, và điều đó thực sự hiệu quả. Khó khăn nhất là gạt bỏ tiếng nói trong đầu bảo rằng bạn không thể làm được. Nhưng tôi đã học cách kiểm soát điều đó bằng cách chia cuộc đua thành từng giai đoạn nhỏ và nhớ lại quá trình tập luyện." },
          { speaker: "Interviewer", en: "So how did you feel when you finally crossed the line?", vi: "Vậy bạn cảm thấy thế nào khi cuối cùng đã cán đích?" },
          { speaker: "John", en: "Well, I assumed my first thought would be that I'd never attempt anything so tough again, but I had such a feeling of achievement that I'd finished! And my dad looked so proud, waiting there with my friends. Although I was so exhausted, I barely registered it. But we did celebrate later, and I've already signed up for my next run!", vi: "Tôi từng nghĩ ý nghĩ đầu tiên trong đầu sẽ là không bao giờ thử làm điều gì gian khổ như thế này nữa, nhưng tôi lại tràn ngập cảm giác tự hào và thành tựu khi đã hoàn thành! Và bố tôi trông rất đỗi tự hào, đứng chờ cùng bạn bè tôi. Dù kiệt sức nhưng lúc đó tôi hầu như chẳng còn để ý đến mệt mỏi. Chúng tôi đã ăn mừng sau đó, và tôi thậm chí đã đăng ký tham gia chặng đua tiếp theo rồi!" },
          { speaker: "Interviewer", en: "I'm sure! Congratulations John.", vi: "Chắc chắn rồi! Chúc mừng bạn John." }
        ]
      },
      {
        partNumber: 3,
        title: "Part 3: Australian Wild Zoo & Map Labeling (Q11-20)",
        instruction: "Questions 11-15: Choose the correct letter A, B or C. Questions 16-20: Label the map below. Write the correct letter, A-H, next to questions 16-20. (5.0 points)",
        audioSrc: "",
        mapImage: "/map_test1_zoo.png",
        questions: [
          {
            id: 11,
            text: "11. What’s the new improvement about the zoo this time?",
            options: [
              { key: "A", text: "The zoo has built a new dog-walking area." },
              { key: "B", text: "The zoo has brought a new batch of animals" },
              { key: "C", text: "The zoo has expanded its exhibition area." }
            ],
            correct: "B",
            explanation: "Đáp án chính thức: 11. B. Người hướng dẫn viên thông báo: 'we have brought a brand-new batch of animals from regional sanctuaries' (sở thú đã đưa về một lứa động vật hoang dã mới)."
          },
          {
            id: 12,
            text: "12. What is the change for the new regulation enacted in June?",
            options: [
              { key: "A", text: "The zoo is not open during the weekdays." },
              { key: "B", text: "Visitors are allowed to feed the animals at night" },
              { key: "C", text: "Visitors are allowed to see the animals until the late night." }
            ],
            correct: "C",
            explanation: "Đáp án chính thức: 12. C. Hướng dẫn viên nói: 'Under our new regulation enacted in June, the zoo extends visiting hours so you can see the animals until late night'."
          },
          {
            id: 13,
            text: "13. While visiting the kangaroo, which behaviour is forbidden?",
            options: [
              { key: "A", text: "Photo-taking" },
              { key: "B", text: "Shouting" },
              { key: "C", text: "Feeding" }
            ],
            correct: "C",
            explanation: "Đáp án chính thức: 13. C. Hướng dẫn viên nhấn mạnh: 'Please remember, when visiting the kangaroo, feeding them is strictly forbidden'."
          },
          {
            id: 14,
            text: "14. Why is the pye-dog zone temporarily closed?",
            options: [
              { key: "A", text: "Because the fence is broken." },
              { key: "B", text: "Because the pye-dogs are in hibernation" },
              { key: "C", text: "Because the pye-dog zone is under construction." }
            ],
            correct: "A",
            explanation: "Đáp án chính thức: 14. A. Hướng dẫn viên nói: 'the pye-dog enclosure is temporarily closed today because the perimeter fence is broken and undergoing repair'."
          },
          {
            id: 15,
            text: "15. Where can the visitors buy the discounted ticket?",
            options: [
              { key: "A", text: "Gift shop" },
              { key: "B", text: "Photo shop" },
              { key: "C", text: "Reception desk" }
            ],
            correct: "B",
            explanation: "Đáp án chính thức: 15. B. Hướng dẫn viên chỉ dẫn: 'discounted tickets for special sessions can be purchased directly at the Photo Shop'."
          },
          {
            id: 16,
            text: "16. Bird hide",
            isMap: true,
            options: [
              { key: "A", text: "Khu vực A (Ngũ giác Tây Bắc)" },
              { key: "B", text: "Khu vực B (Hình chữ nhật phía Bắc)" },
              { key: "C", text: "Khu vực C (Hình chữ nhật phía Tây)" },
              { key: "D", text: "Khu vực D (Góc Tây Nam cạnh Gate)" },
              { key: "E", text: "Khu vực E (Bên trái đường chính)" },
              { key: "F", text: "Khu vực F (Hình tròn trung tâm)" },
              { key: "G", text: "Khu vực G (Hình chữ nhật Đông Nam)" },
              { key: "H", text: "Khu vực H (Hình chữ nhật Đông Bắc)" }
            ],
            correct: "G",
            explanation: "Đáp án chính thức: 16. G. Từ GATE đi thẳng vào theo lối bên phải qua thảm cỏ về phía Đông Nam, tòa nhà hình chữ nhật bên phải chính là Bird hide (G)."
          },
          {
            id: 17,
            text: "17. Pye-dog zone",
            isMap: true,
            options: [
              { key: "A", text: "Khu vực A" },
              { key: "B", text: "Khu vực B" },
              { key: "C", text: "Khu vực C" },
              { key: "D", text: "Khu vực D" },
              { key: "E", text: "Khu vực E" },
              { key: "F", text: "Khu vực F" },
              { key: "G", text: "Khu vực G" },
              { key: "H", text: "Khu vực H" }
            ],
            correct: "B",
            explanation: "Đáp án chính thức: 17. B. Từ khu trung tâm Kangaroo (F) nhìn thẳng về phía Bắc dọc theo lối đi uốn cong là khu chuồng Pye-dog zone (B)."
          },
          {
            id: 18,
            text: "18. Rest area",
            isMap: true,
            options: [
              { key: "A", text: "Khu vực A" },
              { key: "B", text: "Khu vực B" },
              { key: "C", text: "Khu vực C" },
              { key: "D", text: "Khu vực D" },
              { key: "E", text: "Khu vực E" },
              { key: "F", text: "Khu vực F" },
              { key: "G", text: "Khu vực G" },
              { key: "H", text: "Khu vực H" }
            ],
            correct: "A",
            explanation: "Đáp án chính thức: 18. A. Ở góc Tây Bắc (North-West) xa nhất là khu vực hình ngũ giác yên tĩnh dành cho khách nghỉ ngơi: Rest area (A)."
          },
          {
            id: 19,
            text: "19. Kangaroo visiting site",
            isMap: true,
            options: [
              { key: "A", text: "Khu vực A" },
              { key: "B", text: "Khu vực B" },
              { key: "C", text: "Khu vực C" },
              { key: "D", text: "Khu vực D" },
              { key: "E", text: "Khu vực E" },
              { key: "F", text: "Khu vực F" },
              { key: "G", text: "Khu vực G" },
              { key: "H", text: "Khu vực H" }
            ],
            correct: "F",
            explanation: "Đáp án chính thức: 19. F. Vị trí hình tròn ở ngay trung tâm vườn thú chính là Kangaroo visiting site (F)."
          },
          {
            id: 20,
            text: "20. Photo shop",
            isMap: true,
            options: [
              { key: "A", text: "Khu vực A" },
              { key: "B", text: "Khu vực B" },
              { key: "C", text: "Khu vực C" },
              { key: "D", text: "Khu vực D" },
              { key: "E", text: "Khu vực E" },
              { key: "F", text: "Khu vực F" },
              { key: "G", text: "Khu vực G" },
              { key: "H", text: "Khu vực H" }
            ],
            correct: "D",
            explanation: "Đáp án chính thức: 20. D. Ngay khi bước qua cổng chính GATE, rẽ ngay về phía bên tay trái ở góc Tây Nam (South-West) là Photo shop (D)."
          }
        ],
        transcript: [
          { speaker: "Tour Guide", en: "Good morning everyone and welcome to the Australian Wild Zoo! I'm thrilled to introduce you to our newly upgraded facilities this season. First off, you'll be delighted to know that we have brought a brand-new batch of animals from regional conservation sanctuaries [Q11]. Under our new regulation enacted this June, the zoo now extends visiting hours so you can observe nocturnal animal activities until late at night [Q12]! Please remember, when visiting the kangaroo sanctuary, feeding them any outside food is strictly forbidden [Q13]. Also, note that the pye-dog enclosure is temporarily closed today because the perimeter fence is broken and undergoing urgent repair [Q14]. Finally, if you wish to purchase discounted admission tickets for our interactive sessions, please head directly over to the Photo Shop [Q15]!", vi: "Chào buổi sáng quý khách và chào mừng đến với Sở thú Hoang dã Australia! Tôi rất vui được giới thiệu với quý khách những cơ sở vật chất mới được nâng cấp trong mùa này. Trước hết, quý khách sẽ rất thích thú khi biết sở thú vừa tiếp nhận một lứa động vật hoang dã mới từ các khu bảo tồn thiên nhiên [Q11]. Theo quy định mới áp dụng từ tháng 6, sở thú mở rộng giờ tham quan để quý khách có thể quan sát động vật ban đêm đến tận đêm muộn [Q12]! Xin lưu ý khi vào khu vực Kangaroo, hành vi cho thú ăn bị nghiêm cấm tuyệt đối [Q13]. Khu vực chó hoang pye-dog hiện đang tạm đóng cửa do hàng rào bị gãy hỏng cần sửa chữa khẩn cấp [Q14]. Cuối cùng, nếu quý khách muốn mua vé ưu đãi cho các trải nghiệm tương tác, xin vui lòng đến trực tiếp quầy Photo Shop [Q15]!" },
          { speaker: "Tour Guide (Map Orientation)", en: "Now, let me orient you with our site layout. We are currently standing right here at the main GATE at the southern edge. If you turn immediately to your left at the south-western corner, that building marked D is the Photo Shop [Q20: D]. Walking along the pathway on your right past the grassy area to the south-east, building G is our Bird Hide [Q16: G]. Continuing up into the heart of the park, this large circular enclosure marked F is the famous Kangaroo Visiting Site [Q19: F]. Straight north from the kangaroos along the curving path, structure B is the Pye-Dog Zone [Q17: B]. Finally, tucked away peacefully at the far north-western corner, the five-sided building marked A is our Rest Area with shaded seating [Q18: A].", vi: "Bây giờ, tôi xin hướng dẫn quý khách sơ đồ mặt bằng sở thú. Chúng ta hiện đang đứng ngay tại CỔNG CHÍNH (GATE) ở rìa phía Nam. Nếu quý khách rẽ ngay sang bên trái ở góc Tây Nam, tòa nhà D chính là quầy Photo Shop [Q20: D]. Đi theo lối đi bên phải qua bãi cỏ về phía Đông Nam, tòa nhà G là Trạm quan sát chim - Bird Hide [Q16: G]. Tiếp tục đi lên trung tâm công viên, khu vực hình tròn F chính là Điểm tham quan Kangaroo [Q19: F]. Nhìn thẳng về phía Bắc từ khu Kangaroo dọc theo con đường cong là Khu chó hoang Pye-Dog Zone (B) [Q17: B]. Cuối cùng, nằm yên tĩnh ở góc Tây Bắc xa nhất, tòa nhà ngũ giác A là Khu nghỉ ngơi - Rest Area có ghế ngồi râm mát [Q18: A]." }
        ]
      }
    ]
  },
  {
    id: "test_2",
    title: "ĐỀ SỐ 2: Listening HP3 (Đề Thi Tương Tự 1 - Chuẩn Ma Trận Bộ Công An)",
    subtitle: "20 Câu hỏi • Part 1 (Phỏng vấn nghệ sĩ piano) • Part 2 (Thám hiểm xe đạp) • Part 3 (Bảo tàng & Map)",
    parts: [
      {
        partNumber: 1,
        title: "Part 1: Interview with Young Musician David",
        instruction: "Questions 1-5. Choose the correct letter, A, B or C. (2.5 points)\nYou will hear an interview with a 17-year-old student called David, who won the National Young Musician Competition.",
        audioSrc: "",
        questions: [
          {
            id: 1,
            text: "1. Which musical instrument did David learn to play first?",
            options: [
              { key: "A", text: "guitar" },
              { key: "B", text: "piano" },
              { key: "C", text: "violin" }
            ],
            correct: "B",
            explanation: "David chia sẻ: 'My parents bought an upright piano when I was six, and that was the very first instrument I touched, long before I tried the guitar in high school'."
          },
          {
            id: 2,
            text: "2. David decided to enter the competition after",
            options: [
              { key: "A", text: "his music teacher strongly encouraged him." },
              { key: "B", text: "seeing an advertisement on social media." },
              { key: "C", text: "attending a live concert by a famous pianist." }
            ],
            correct: "A",
            explanation: "David nói: 'I was hesitant at first, but my school music teacher Mrs. Harrison convinced me that my technique was ready and urged me to submit an audition tape'."
          },
          {
            id: 3,
            text: "3. How does David feel when performing in front of a large audience?",
            options: [
              { key: "A", text: "anxious about forgetting the sheet music" },
              { key: "B", text: "energized by the crowd's reaction" },
              { key: "C", text: "uncomfortable under bright stage lights" }
            ],
            correct: "B",
            explanation: "David nói: 'Once I hit the first chord, all fear vanished; seeing the audience engaged actually gives me an incredible surge of energy'."
          },
          {
            id: 4,
            text: "4. What was the most difficult aspect of David’s preparation?",
            options: [
              { key: "A", text: "memorizing intricate musical passages" },
              { key: "B", text: "balancing practice hours with school exams" },
              { key: "C", text: "traveling long distances for masterclasses" }
            ],
            correct: "B",
            explanation: "David nhấn mạnh: 'The hardest challenge was definitely managing my schedule—I had final term exams while trying to practice 4 hours every evening'."
          },
          {
            id: 5,
            text: "5. What is David’s primary ambition for the near future?",
            options: [
              { key: "A", text: "join a touring orchestra abroad" },
              { key: "B", text: "release a solo commercial album" },
              { key: "C", text: "complete his formal degree in music composition" }
            ],
            correct: "C",
            explanation: "David khẳng định: 'Although there are tour offers, my priority is completing my music degree at university before launching a full-time professional career'."
          }
        ],
        transcript: [
          { speaker: "Interviewer", en: "Welcome David! Huge congratulations on winning the National Young Musician title. When did your musical journey begin?", vi: "Chào mừng David! Chúc mừng bạn đã giành giải quán quân Nhạc công trẻ Quốc gia. Hành trình âm nhạc của bạn bắt đầu từ khi nào?" },
          { speaker: "David", en: "Thank you! Well, my parents bought an upright piano when I was six, and that was the very first instrument I touched, long before I tried the guitar in high school [Q1: B].", vi: "Cảm ơn bạn! Bố mẹ tôi mua một cây đàn piano khi tôi 6 tuổi, và đó là nhạc cụ đầu tiên tôi tiếp xúc, rất lâu trước khi tôi thử chơi guitar hồi cấp ba [Q1: B]." },
          { speaker: "Interviewer", en: "What made you enter such a competitive contest?", vi: "Điều gì thúc đẩy bạn tham gia một cuộc thi có tính cạnh tranh cao như vậy?" },
          { speaker: "David", en: "I was hesitant at first, but my school music teacher Mrs. Harrison convinced me that my technique was ready and urged me to submit an audition tape [Q2: A].", vi: "Ban đầu tôi khá do dự, nhưng cô giáo dạy nhạc trường tôi là cô Harrison đã thuyết phục rằng kỹ thuật của tôi đã vững và thúc giục tôi gửi bản ghi âm dự thi [Q2: A]." },
          { speaker: "Interviewer", en: "How do you handle performing before thousands of spectators?", vi: "Bạn xử lý áp lực biểu diễn trước hàng ngàn khán giả như thế nào?" },
          { speaker: "David", en: "Once I hit the first chord, all fear vanished; seeing the audience engaged actually gives me an incredible surge of energy [Q3: B].", vi: "Khi tôi đánh hợp âm đầu tiên, mọi nỗi sợ đều biến mất; việc nhìn thấy khán giả đắm chìm thực sự tiếp thêm cho tôi nguồn năng lượng tuyệt vời [Q3: B]." },
          { speaker: "Interviewer", en: "What proved to be the toughest hurdle during training?", vi: "Điều gì là thử thách lớn nhất trong quá trình luyện tập?" },
          { speaker: "David", en: "The hardest challenge was definitely managing my schedule—I had final term exams while trying to practice 4 hours every evening [Q4: B].", vi: "Thử thách khó nhất chắc chắn là quản lý thời gian—tôi vướng kỳ thi học kỳ trong khi vẫn phải cố gắng tập 4 tiếng mỗi tối [Q4: B]." },
          { speaker: "Interviewer", en: "And what lies ahead in your career?", vi: "Và dự định tương lai của bạn là gì?" },
          { speaker: "David", en: "Although there are tour offers, my priority is completing my music degree at university before launching a full-time professional career [Q5: C].", vi: "Dù có lời mời đi lưu diễn, ưu tiên của tôi vẫn là hoàn thành bằng đại học ngành sáng tác âm nhạc trước khi bước vào sự nghiệp chuyên nghiệp toàn thời gian [Q5: C]." }
        ]
      },
      {
        partNumber: 2,
        title: "Part 2: Interview with Long-Distance Cyclist Sarah",
        instruction: "Questions 6-10. Choose the correct letter, A, B or C. (2.5 points)\nYou will hear an interview with a university student named Sarah, who completed a 500-kilometre coastal bike expedition.",
        audioSrc: "",
        questions: [
          {
            id: 6,
            text: "6. Why did Sarah undertake the 500-km coastal ride?",
            options: [
              { key: "A", text: "to raise funds for marine conservation" },
              { key: "B", text: "to break an amateur speed record" },
              { key: "C", text: "to test a prototype touring bicycle" }
            ],
            correct: "A",
            explanation: "Sarah giải thích: 'My primary goal was raising donations for a coastal marine charity protecting coral reefs'."
          },
          {
            id: 7,
            text: "7. During the journey, what was the most difficult physical challenge?",
            options: [
              { key: "A", text: "pedaling against powerful coastal headwinds" },
              { key: "B", text: "climbing steep rocky mountain passes" },
              { key: "C", text: "enduring heavy torrential afternoon rain" }
            ],
            correct: "A",
            explanation: "Sarah nói: 'The coastal gale headwinds were relentless; on day three, pedaling felt like pushing against a solid brick wall'."
          },
          {
            id: 8,
            text: "8. How did Sarah arrange overnight accommodation?",
            options: [
              { key: "A", text: "reserved hotel rooms weeks beforehand" },
              { key: "B", text: "pitched a lightweight tent at coastal campsites" },
              { key: "C", text: "stayed exclusively with local host families" }
            ],
            correct: "B",
            explanation: "Sarah kể: 'To keep expenses low, I carried a compact tent and camped overnight at designated public campsites along beaches'."
          },
          {
            id: 9,
            text: "9. What does Sarah say about her nutritional strategy during the ride?",
            options: [
              { key: "A", text: "ate heavy pasta dinners each night" },
              { key: "B", text: "snacked frequently on nuts, oats, and bananas" },
              { key: "C", text: "relied solely on liquid protein shakes" }
            ],
            correct: "B",
            explanation: "Sarah chia sẻ: 'Instead of huge meals that make you sluggish, I munched small portions of oats, bananas, and almonds every 45 minutes'."
          },
          {
            id: 10,
            text: "10. What key advice does Sarah offer to aspiring endurance cyclists?",
            options: [
              { key: "A", text: "always travel in large organized pelotons" },
              { key: "B", text: "master basic bicycle maintenance before departure" },
              { key: "C", text: "purchase top-tier carbon-fiber equipment" }
            ],
            correct: "B",
            explanation: "Sarah khuyên: 'Knowing how to patch a punctured tire and adjust a chain yourself is essential; you can't rely on bike shops in remote areas'."
          }
        ],
        transcript: [
          { speaker: "Interviewer", en: "Sarah, 500 kilometers on two wheels along rugged coastlines is breathtaking! What inspired this feat?", vi: "Sarah, 500 km trên chiếc xe đạp dọc bờ biển hiểm trở thật ngoạn mục! Điều gì đã truyền cảm hứng cho chuyến đi này?" },
          { speaker: "Sarah", en: "My primary goal was raising donations for a coastal marine charity protecting coral reefs [Q6: A].", vi: "Mục tiêu chính của tôi là gây quỹ quyên góp cho một tổ chức từ thiện bảo tồn san hô biển ven bờ [Q6: A]." },
          { speaker: "Interviewer", en: "What was the toughest physical obstacle along the Pacific highway?", vi: "Trở ngại thể lực khắc nghiệt nhất dọc đường quốc lộ ven biển là gì?" },
          { speaker: "Sarah", en: "The coastal gale headwinds were relentless; on day three, pedaling felt like pushing against a solid brick wall [Q7: A].", vi: "Gió ngược từ biển thổi rát rạt không ngừng; vào ngày thứ ba, đạp xe như thể đang cố đẩy một bức tường gạch kiên cố [Q7: A]." },
          { speaker: "Interviewer", en: "Where did you rest your head each night?", vi: "Bạn nghỉ qua đêm ở đâu?" },
          { speaker: "Sarah", en: "To keep expenses low, I carried a compact tent and camped overnight at designated public campsites along beaches [Q8: B].", vi: "Để tiết kiệm chi phí, tôi mang theo một chiếc lều nhỏ gọn và cắm trại qua đêm tại các bãi cắm trại công cộng ven biển [Q8: B]." },
          { speaker: "Interviewer", en: "How did you sustain your energy levels across consecutive days?", vi: "Bạn duy trì mức năng lượng như thế nào qua nhiều ngày liên tiếp?" },
          { speaker: "Sarah", en: "Instead of huge meals that make you sluggish, I munched small portions of oats, bananas, and almonds every 45 minutes [Q9: B].", vi: "Thay vì ăn bữa lớn gây nặng bụng, tôi nhâm nhi khẩu phần nhỏ gồm yến mạch, chuối và hạnh nhân cứ mỗi 45 phút [Q9: B]." },
          { speaker: "Interviewer", en: "What is your number one tip for beginners embarking on touring rides?", vi: "Lời khuyên số một của bạn cho người mới bắt đầu đạp xe đường trường là gì?" },
          { speaker: "Sarah", en: "Knowing how to patch a punctured tire and adjust a chain yourself is essential; you can't rely on bike shops in remote areas [Q10: B].", vi: "Biết cách tự vá lốp thủng và căn chỉnh xích xe là điều sống còn; bạn không thể trông chờ vào tiệm sửa xe ở các vùng hẻo lánh [Q10: B]." }
        ]
      },
      {
        partNumber: 3,
        title: "Part 3: National Security Heritage Museum & Floor Plan",
        instruction: "Questions 11-15: Choose the correct letter A, B or C. Questions 16-20: Label the map below. (5.0 points)",
        audioSrc: "",
        mapImage: "/map_test1_zoo.png",
        questions: [
          {
            id: 11,
            text: "11. What is the latest exhibition gallery added to the museum this year?",
            options: [
              { key: "A", text: "Historical cipher and cryptology machines" },
              { key: "B", text: "Ancient military armor and weaponry" },
              { key: "C", text: "Aviation surveillance history" }
            ],
            correct: "A",
            explanation: "Hướng dẫn viên giới thiệu: 'Our newest permanent exhibition focuses on historical cipher machines and cryptology'."
          },
          {
            id: 12,
            text: "12. Under the updated regulations, what is the evening closing time on weekends?",
            options: [
              { key: "A", text: "6:00 PM" },
              { key: "B", text: "8:30 PM" },
              { key: "C", text: "10:00 PM" }
            ],
            correct: "B",
            explanation: "Thông báo nêu rõ: 'Weekend hours are now extended to 8:30 PM to accommodate evening guided tours'."
          },
          {
            id: 13,
            text: "13. Which action is strictly prohibited inside the main archive room?",
            options: [
              { key: "A", text: "Wearing backpacks" },
              { key: "B", text: "Taking flash photography" },
              { key: "C", text: "Carrying sketchbooks" }
            ],
            correct: "B",
            explanation: "Quy định nêu rõ: 'Flash photography is strictly banned to preserve ancient parchment documents'."
          },
          {
            id: 14,
            text: "14. Why is the rooftop observation deck closed today?",
            options: [
              { key: "A", text: "Structural floor resurfacing" },
              { key: "B", text: "Excessive wind speeds" },
              { key: "C", text: "Private diplomatic reception" }
            ],
            correct: "A",
            explanation: "Hướng dẫn viên thông báo: 'The rooftop observation deck is temporarily closed for floor resurfacing'."
          },
          {
            id: 15,
            text: "15. Where can university students collect their free multilingual audio guide?",
            options: [
              { key: "A", text: "Security checkpoint" },
              { key: "B", text: "Information Desk" },
              { key: "C", text: "Gift store" }
            ],
            correct: "B",
            explanation: "Hướng dẫn viên cho biết: 'Students can present ID at the Information Desk to receive free audio headsets'."
          },
          {
            id: 16,
            text: "16. Cryptology & Cipher Gallery",
            isMap: true,
            options: [
              { key: "A", text: "Khu vực A" },
              { key: "B", text: "Khu vực B" },
              { key: "C", text: "Khu vực C" },
              { key: "D", text: "Khu vực D" },
              { key: "E", text: "Khu vực E" },
              { key: "F", text: "Khu vực F" },
              { key: "G", text: "Khu vực G" },
              { key: "H", text: "Khu vực H" }
            ],
            correct: "H",
            explanation: "Đi từ GATE dọc theo sảnh phía Đông về phía Đông Bắc: Tòa nhà triển lãm lớn H chính là Cryptology Gallery."
          },
          {
            id: 17,
            text: "17. Archive Preservation Room",
            isMap: true,
            options: [
              { key: "A", text: "Khu vực A" },
              { key: "B", text: "Khu vực B" },
              { key: "C", text: "Khu vực C" },
              { key: "D", text: "Khu vực D" },
              { key: "E", text: "Khu vực E" },
              { key: "F", text: "Khu vực F" },
              { key: "G", text: "Khu vực G" },
              { key: "H", text: "Khu vực H" }
            ],
            correct: "B",
            explanation: "Nằm ở phía Bắc đối diện khu trung tâm F là phòng lưu trữ tài liệu mật B."
          },
          {
            id: 18,
            text: "18. Officers Memorial Hall",
            isMap: true,
            options: [
              { key: "A", text: "Khu vực A" },
              { key: "B", text: "Khu vực B" },
              { key: "C", text: "Khu vực C" },
              { key: "D", text: "Khu vực D" },
              { key: "E", text: "Khu vực E" },
              { key: "F", text: "Khu vực F" },
              { key: "G", text: "Khu vực G" },
              { key: "H", text: "Khu vực H" }
            ],
            correct: "A",
            explanation: "Ở góc Tây Bắc xa nhất, tòa nhà ngũ giác uy nghiêm A là Nhà tưởng niệm các anh hùng liệt sĩ."
          },
          {
            id: 19,
            text: "19. Central Interactive Courtyard",
            isMap: true,
            options: [
              { key: "A", text: "Khu vực A" },
              { key: "B", text: "Khu vực B" },
              { key: "C", text: "Khu vực C" },
              { key: "D", text: "Khu vực D" },
              { key: "E", text: "Khu vực E" },
              { key: "F", text: "Khu vực F" },
              { key: "G", text: "Khu vực G" },
              { key: "H", text: "Khu vực H" }
            ],
            correct: "F",
            explanation: "Khuôn viên tròn lớn ở vị trí trung tâm F chính là Central Interactive Courtyard."
          },
          {
            id: 20,
            text: "20. Information & Headset Desk",
            isMap: true,
            options: [
              { key: "A", text: "Khu vực A" },
              { key: "B", text: "Khu vực B" },
              { key: "C", text: "Khu vực C" },
              { key: "D", text: "Khu vực D" },
              { key: "E", text: "Khu vực E" },
              { key: "F", text: "Khu vực F" },
              { key: "G", text: "Khu vực G" },
              { key: "H", text: "Khu vực H" }
            ],
            correct: "D",
            explanation: "Ngay lối vào bên trái cổng GATE ở góc Tây Nam là quầy Information Desk (D)."
          }
        ],
        transcript: [
          { speaker: "Guide", en: "Welcome cadets and visitors to the National Security Heritage Museum. We are proud to inaugurate our state-of-the-art Cryptology and Cipher Gallery this year [Q11: A]. Weekend opening hours have now been extended until 8:30 PM [Q12: B]. Inside the special archives, flash photography is strictly prohibited to safeguard delicate historical inks [Q13: B]. Please note the rooftop viewing platform is closed today due to scheduled maintenance [Q14: A]. Students may collect free digital audio headsets at our Information Desk [Q15: B].", vi: "Chào mừng các học viên và du khách đến với Bảo tàng Di sản An ninh Quốc gia. Chúng tôi tự hào khánh thành Phòng trưng bày Mật mã học trong năm nay [Q11: A]. Giờ mở cửa cuối tuần hiện kéo dài đến 8:30 tối [Q12: B]. Bên trong phòng lưu trữ, hành vi chụp ảnh có đèn flash bị cấm nghiêm ngặt để bảo vệ các tài liệu cổ [Q13: B]. Xin lưu ý đài quan sát trên mái tạm đóng cửa hôm nay để bảo dưỡng [Q14: A]. Học viên có thể nhận tai nghe thuyết minh miễn phí tại Quầy Thông tin [Q15: B]." },
          { speaker: "Guide (Layout)", en: "Standing at the southern entrance GATE, building D on your immediate left is the Information Desk where you collect audio guides [Q20: D]. Walking north-east up the eastern wing, the long hall H houses the Cryptology and Cipher Gallery [Q16: H]. In the center of the complex, the circular plaza F is the Central Interactive Courtyard [Q19: F]. Directly north of the courtyard, structure B is the Archive Preservation Room [Q17: B]. In the peaceful north-western corner, the pentagon-shaped hall A is the Officers Memorial Hall [Q18: A].", vi: "Đứng tại cổng vào phía Nam GATE, tòa nhà D ngay bên tay trái quý khách là Quầy Thông tin nhận tai nghe [Q20: D]. Đi về phía Đông Bắc dọc cánh phía Đông, đại sảnh H là Phòng Mật mã học [Q16: H]. Ở trung tâm khu phức hợp, quảng trường tròn F là Sân tương tác trung tâm [Q19: F]. Ngay phía Bắc quảng trường, tòa nhà B là Phòng bảo quản văn khố [Q17: B]. Nằm tại góc Tây Bắc trang nghiêm, đại sảnh ngũ giác A là Nhà tưởng niệm cán bộ chiến sĩ [Q18: A]." }
        ]
      }
    ]
  }
];
