// ============================================================================
// ENGLISH LISTENING PRACTICE MODULE (FORM CHUẨN ĐỀ THI HP3 & CAMBRIDGE B1/B2)
// ============================================================================
const LISTENING_TESTS = [
  {
    id: "test_1",
    title: "Đề Thi Số 1: Listening HP3 (Chuẩn Học Viện)",
    subtitle: "Gồm 3 Phần thi • Thời lượng: 15 Phút • Audio Player tua ±5s • Chấm điểm & Lời thoại song ngữ",
    parts: [
      {
        partNumber: 1,
        title: "Part 1: Phỏng Vấn Vận Động Viên Andrea (Ice Hockey)",
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
            explanation: "Andrea nói: 'I've always loved sport though, and have played basketball since I was five or six. I gave that up for a while when I got into football about five years ago... ice hockey not until about three years ago'. Môn đầu tiên là basketball (5-6 tuổi)."
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
            explanation: "Andrea nói: 'I'd been really happy with how I'd been playing for my club, and felt I could do just as well at a higher level. There'd been a lot of talk about me being picked, so I kind of knew it was coming' (tự tin mình sẽ chơi tốt ở cấp độ cao hơn)."
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
        title: "Part 2: Phỏng Vấn John Benton (Cuộc Thi Chạy 25km)",
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
        title: "Part 3: Talk about Australian Wild Zoo",
        instruction: "Questions 11-15. Choose the correct letter, A, B or C. (5 points)\nYou will hear parts of the talk about an Australian Wild Zoo given by a tourguide.",
        audioSrc: "",
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
            explanation: "Theo đáp án chuẩn Đề 1 (Key: 11. B): Sở thú vừa đưa về một lứa động vật hoang dã mới."
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
            explanation: "Theo đáp án chuẩn Đề 1 (Key: 12. C): Quy định mới cho phép du khách tham quan đến đêm muộn."
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
            explanation: "Theo đáp án chuẩn Đề 1 (Key: 13. C): Nghiêm cấm du khách cho Kangaroo ăn (Feeding)."
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
            explanation: "Theo đáp án chuẩn Đề 1 (Key: 14. A): Khu pye-dog tạm thời đóng cửa do hàng rào bảo vệ bị gãy hỏng."
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
            explanation: "Theo đáp án chuẩn Đề 1 (Key: 15. B): Mua vé giảm giá tại Photo shop."
          }
        ],
        transcript: [
          { speaker: "Tour Guide", en: "Good morning everyone and welcome to the Australian Wild Zoo! I'm thrilled to introduce you to our newly upgraded facilities this season. First off, you'll be delighted to know that we have brought a brand-new batch of animals from regional conservation sanctuaries. Under our new regulation enacted this June, the zoo now extends visiting hours so you can observe nocturnal animal activities until late at night! Please remember, when visiting the kangaroo sanctuary, feeding them any outside food is strictly forbidden. Also, note that the pye-dog enclosure is temporarily closed today because the perimeter fence is undergoing urgent repair. Finally, if you wish to purchase discounted admission tickets for our interactive experiences, please head directly over to the Photo Shop!", vi: "Chào buổi sáng quý khách và chào mừng đến với Sở thú Hoang dã Australia! Tôi rất vui được giới thiệu với quý khách những cơ sở vật chất mới được nâng cấp trong mùa này. Trước hết, quý khách sẽ rất thích thú khi biết sở thú vừa tiếp nhận một lứa động vật mới từ các khu bảo tồn thiên nhiên. Theo quy định mới áp dụng từ tháng 6, sở thú mở rộng giờ tham quan để quý khách có thể quan sát động vật ban đêm đến tận đêm muộn! Xin lưu ý khi vào khu vực Kangaroo, hành vi cho thú ăn bị nghiêm cấm tuyệt đối. Khu vực chó hoang pye-dog hiện đang tạm đóng cửa do hàng rào bị hỏng cần sửa chữa. Cuối cùng, nếu quý khách muốn mua vé ưu đãi cho các trải nghiệm tương tác, xin vui lòng đến trực tiếp quầy Photo Shop!" }
        ]
      }
    ]
  }
];
