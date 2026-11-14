// ============================================================================
// 100 BỘ ĐỀ THI LUYỆN NGHE TOÀN DIỆN (IELTS, APTIS, BBC ACTIVE, TALK SHOWS, CAMBRIDGE)
// Chuẩn Form Đầy Đủ • Cân Bằng Độ Dài Đáp Án • Chống Đoán Mẹo Theo Độ Dài
// ============================================================================

const LISTENING_TESTS = [
  {
    "id": "ielts_test_1",
    "sourceType": "ielts",
    "title": "IELTS #1: Sports Centre Membership & Deep-Sea Hydrothermal Vents",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Sports Centre Membership",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding sports centre membership at West End Sports Centre.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at West End Sports Centre?",
            "options": [
              {
                "key": "A",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "B",
                "text": "Silver off-peak"
              },
              {
                "key": "C",
                "text": "Standard basic package"
              }
            ],
            "correct": "B",
            "explanation": "Người gọi xác nhận chọn gói 'Silver off-peak' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "No fee is required at all"
              },
              {
                "key": "B",
                "text": "$45/month"
              },
              {
                "key": "C",
                "text": "Double the standard rate"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $45/month."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, West End Sports Centre speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, West End Sports Centre xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about sports centre membership. I'd like to sign up for the Silver off-peak option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về sports centre membership. Tôi muốn đăng ký gói Silver off-peak nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Silver off-peak is $45/month. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Silver off-peak là $45/month. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Library Tour & Digital Archive",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Library Tour & Digital Archive.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Library Tour & Digital Archive?",
            "options": [
              {
                "key": "A",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "B",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "C",
                "text": "To inform visitors about updated schedules and new features"
              }
            ],
            "correct": "C",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "B",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "C",
                "text": "The main cafe at noon"
              }
            ],
            "correct": "A",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "B",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "C",
                "text": "An outdoor swimming pool"
              }
            ],
            "correct": "B",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Library Tour & Digital Archive. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Library Tour & Digital Archive. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Renewable Energy Transition",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Renewable Energy Transition.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Renewable Energy Transition?",
            "options": [
              {
                "key": "A",
                "text": "Their tutor cancelled the seminar, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "C",
                "text": "The laboratory equipment was stolen"
              }
            ],
            "correct": "B",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Reading the entire textbook aloud, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "C",
                "text": "Removing all statistical graphs, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "They should change their topic completely, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "C",
                "text": "The bibliography is too short and invalid, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "B",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Renewable Energy Transition? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Renewable Energy Transition chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Deep-Sea Hydrothermal Vents",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Deep-Sea Hydrothermal Vents.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Deep-Sea Hydrothermal Vents?",
            "options": [
              {
                "key": "A",
                "text": "It had zero impact on surrounding ecosystems, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "C",
                "text": "It was discovered only in the 21st century, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "B",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "C",
                "text": "Steam-powered mechanical calculators"
              }
            ],
            "correct": "B",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Funding should be halted immediately, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "C",
                "text": "No further observation is necessary, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Deep-Sea Hydrothermal Vents. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Deep-Sea Hydrothermal Vents. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_2",
    "sourceType": "ielts",
    "title": "IELTS #2: University Accommodation Booking & History of Ancient Cryptography",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: University Accommodation Booking",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding university accommodation booking at Oakwood Hall Residence.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Oakwood Hall Residence?",
            "options": [
              {
                "key": "A",
                "text": "Single En-suite"
              },
              {
                "key": "B",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "C",
                "text": "Standard basic package"
              }
            ],
            "correct": "A",
            "explanation": "Người gọi xác nhận chọn gói 'Single En-suite' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "Double the standard rate"
              },
              {
                "key": "B",
                "text": "No fee is required at all"
              },
              {
                "key": "C",
                "text": "£165/week"
              }
            ],
            "correct": "C",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là £165/week."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Oakwood Hall Residence speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Oakwood Hall Residence xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about university accommodation booking. I'd like to sign up for the Single En-suite option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về university accommodation booking. Tôi muốn đăng ký gói Single En-suite nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Single En-suite is £165/week. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Single En-suite là £165/week. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: City Botanical Garden Orientation",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about City Botanical Garden Orientation.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about City Botanical Garden Orientation?",
            "options": [
              {
                "key": "A",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "B",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "C",
                "text": "To announce a permanent closure of the facility"
              }
            ],
            "correct": "B",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "B",
                "text": "The main cafe at noon"
              },
              {
                "key": "C",
                "text": "The souvenir shop at closing time"
              }
            ],
            "correct": "A",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "B",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "C",
                "text": "An outdoor swimming pool"
              }
            ],
            "correct": "A",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on City Botanical Garden Orientation. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về City Botanical Garden Orientation. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Marine Microplastics Sampling",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Marine Microplastics Sampling.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Marine Microplastics Sampling?",
            "options": [
              {
                "key": "A",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "B",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "C",
                "text": "Their tutor cancelled the seminar, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "A",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "B",
                "text": "Reading the entire textbook aloud, which remains subject to further departmental verification"
              },
              {
                "key": "C",
                "text": "Removing all statistical graphs, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The bibliography is too short and invalid, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "They should change their topic completely, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "The methodology section needs clearer operational definitions"
              }
            ],
            "correct": "C",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Marine Microplastics Sampling? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Marine Microplastics Sampling chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — History of Ancient Cryptography",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on History of Ancient Cryptography.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about History of Ancient Cryptography?",
            "options": [
              {
                "key": "A",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "B",
                "text": "It was discovered only in the 21st century, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "It had zero impact on surrounding ecosystems, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "B",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "C",
                "text": "Manual handwritten surveys"
              }
            ],
            "correct": "A",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "B",
                "text": "Funding should be halted immediately, in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "No further observation is necessary, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine History of Ancient Cryptography. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về History of Ancient Cryptography. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_3",
    "sourceType": "ielts",
    "title": "IELTS #3: City Museum Guided Pass & Evolution of Indo-European Languages",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: City Museum Guided Pass",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding city museum guided pass at Metropolitan Heritage Museum.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Metropolitan Heritage Museum?",
            "options": [
              {
                "key": "A",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "B",
                "text": "Weekend Family Pass"
              },
              {
                "key": "C",
                "text": "Standard basic package"
              }
            ],
            "correct": "B",
            "explanation": "Người gọi xác nhận chọn gói 'Weekend Family Pass' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "Double the standard rate"
              },
              {
                "key": "B",
                "text": "$32"
              },
              {
                "key": "C",
                "text": "No fee is required at all"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $32."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Metropolitan Heritage Museum speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Metropolitan Heritage Museum xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about city museum guided pass. I'd like to sign up for the Weekend Family Pass option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về city museum guided pass. Tôi muốn đăng ký gói Weekend Family Pass nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Weekend Family Pass is $32. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Weekend Family Pass là $32. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Public Park Renovation Plan",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Public Park Renovation Plan.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Public Park Renovation Plan?",
            "options": [
              {
                "key": "A",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "B",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "C",
                "text": "To inform visitors about updated schedules and new features"
              }
            ],
            "correct": "C",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The main cafe at noon"
              },
              {
                "key": "B",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "C",
                "text": "The North Pavilion before 10:30 AM"
              }
            ],
            "correct": "C",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "B",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "C",
                "text": "An outdoor swimming pool"
              }
            ],
            "correct": "A",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Public Park Renovation Plan. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Public Park Renovation Plan. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Child Bilingualism Psychology",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Child Bilingualism Psychology.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Child Bilingualism Psychology?",
            "options": [
              {
                "key": "A",
                "text": "Their tutor cancelled the seminar, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "C",
                "text": "Lack of reliable longitudinal data from older studies"
              }
            ],
            "correct": "C",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "B",
                "text": "Reading the entire textbook aloud, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Removing all statistical graphs, in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "A",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "They should change their topic completely, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "C",
                "text": "The bibliography is too short and invalid, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "B",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Child Bilingualism Psychology? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Child Bilingualism Psychology chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Evolution of Indo-European Languages",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Evolution of Indo-European Languages.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Evolution of Indo-European Languages?",
            "options": [
              {
                "key": "A",
                "text": "It was discovered only in the 21st century, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "It had zero impact on surrounding ecosystems, which remains subject to further departmental verification"
              },
              {
                "key": "C",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "B",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "C",
                "text": "High-resolution automated sensor arrays"
              }
            ],
            "correct": "C",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "No further observation is necessary, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "C",
                "text": "Funding should be halted immediately, primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Evolution of Indo-European Languages. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Evolution of Indo-European Languages. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_4",
    "sourceType": "ielts",
    "title": "IELTS #4: Language Exchange Club Registration & Memory Consolidation in Sleep",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Language Exchange Club Registration",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding language exchange club registration at Polyglot Hub.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Polyglot Hub?",
            "options": [
              {
                "key": "A",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "B",
                "text": "Conversation Track"
              },
              {
                "key": "C",
                "text": "Standard basic package"
              }
            ],
            "correct": "B",
            "explanation": "Người gọi xác nhận chọn gói 'Conversation Track' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "No fee is required at all"
              },
              {
                "key": "B",
                "text": "Free for students"
              },
              {
                "key": "C",
                "text": "Double the standard rate"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là Free for students."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Polyglot Hub speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Polyglot Hub xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about language exchange club registration. I'd like to sign up for the Conversation Track option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về language exchange club registration. Tôi muốn đăng ký gói Conversation Track nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Conversation Track is Free for students. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Conversation Track là Free for students. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Coastal Cycling Safety Route",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Coastal Cycling Safety Route.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Coastal Cycling Safety Route?",
            "options": [
              {
                "key": "A",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "B",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "C",
                "text": "To announce a permanent closure of the facility"
              }
            ],
            "correct": "B",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "B",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "C",
                "text": "The main cafe at noon"
              }
            ],
            "correct": "B",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "B",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "C",
                "text": "An outdoor swimming pool"
              }
            ],
            "correct": "B",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Coastal Cycling Safety Route. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Coastal Cycling Safety Route. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Urban Vertical Farming Study",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Urban Vertical Farming Study.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Urban Vertical Farming Study?",
            "options": [
              {
                "key": "A",
                "text": "Their tutor cancelled the seminar, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "C",
                "text": "Lack of reliable longitudinal data from older studies"
              }
            ],
            "correct": "C",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Reading the entire textbook aloud, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "C",
                "text": "Removing all statistical graphs, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "B",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The bibliography is too short and invalid, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "They should change their topic completely, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "The methodology section needs clearer operational definitions"
              }
            ],
            "correct": "C",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Urban Vertical Farming Study? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Urban Vertical Farming Study chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Memory Consolidation in Sleep",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Memory Consolidation in Sleep.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Memory Consolidation in Sleep?",
            "options": [
              {
                "key": "A",
                "text": "It had zero impact on surrounding ecosystems, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "C",
                "text": "It was discovered only in the 21st century, primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "B",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "C",
                "text": "Steam-powered mechanical calculators"
              }
            ],
            "correct": "B",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "No further observation is necessary, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "C",
                "text": "Funding should be halted immediately, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Memory Consolidation in Sleep. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Memory Consolidation in Sleep. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_5",
    "sourceType": "ielts",
    "title": "IELTS #5: Car Insurance Policy Inquiry & Aerodynamics of Avian Flight",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Car Insurance Policy Inquiry",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding car insurance policy inquiry at ShieldSure Mutual.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at ShieldSure Mutual?",
            "options": [
              {
                "key": "A",
                "text": "Comprehensive Plus"
              },
              {
                "key": "B",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "C",
                "text": "Standard basic package"
              }
            ],
            "correct": "A",
            "explanation": "Người gọi xác nhận chọn gói 'Comprehensive Plus' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "Double the standard rate"
              },
              {
                "key": "B",
                "text": "No fee is required at all"
              },
              {
                "key": "C",
                "text": "$620/year"
              }
            ],
            "correct": "C",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $620/year."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, ShieldSure Mutual speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, ShieldSure Mutual xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about car insurance policy inquiry. I'd like to sign up for the Comprehensive Plus option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về car insurance policy inquiry. Tôi muốn đăng ký gói Comprehensive Plus nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Comprehensive Plus is $620/year. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Comprehensive Plus là $620/year. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Wildlife Sanctuary Visitor Guide",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Wildlife Sanctuary Visitor Guide.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Wildlife Sanctuary Visitor Guide?",
            "options": [
              {
                "key": "A",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "B",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "C",
                "text": "To request emergency volunteers for repairs"
              }
            ],
            "correct": "B",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The main cafe at noon"
              },
              {
                "key": "B",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "C",
                "text": "The souvenir shop at closing time"
              }
            ],
            "correct": "B",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "B",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "C",
                "text": "An outdoor swimming pool"
              }
            ],
            "correct": "B",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Wildlife Sanctuary Visitor Guide. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Wildlife Sanctuary Visitor Guide. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — AI Ethics in Medical Diagnosis",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on AI Ethics in Medical Diagnosis.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on AI Ethics in Medical Diagnosis?",
            "options": [
              {
                "key": "A",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "B",
                "text": "Their tutor cancelled the seminar, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "The laboratory equipment was stolen"
              }
            ],
            "correct": "A",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Reading the entire textbook aloud, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "C",
                "text": "Removing all statistical graphs, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "B",
                "text": "The bibliography is too short and invalid, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "They should change their topic completely, which remains subject to further departmental verification"
              }
            ],
            "correct": "A",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on AI Ethics in Medical Diagnosis? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về AI Ethics in Medical Diagnosis chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Aerodynamics of Avian Flight",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Aerodynamics of Avian Flight.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Aerodynamics of Avian Flight?",
            "options": [
              {
                "key": "A",
                "text": "It had zero impact on surrounding ecosystems, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "C",
                "text": "It was discovered only in the 21st century, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "B",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "C",
                "text": "Manual handwritten surveys"
              }
            ],
            "correct": "B",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "No further observation is necessary, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "Funding should be halted immediately, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Aerodynamics of Avian Flight. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Aerodynamics of Avian Flight. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_6",
    "sourceType": "ielts",
    "title": "IELTS #6: Photography Workshop Enrollment & Architecture of Ancient Rome",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Photography Workshop Enrollment",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding photography workshop enrollment at Aperture Arts Studio.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Aperture Arts Studio?",
            "options": [
              {
                "key": "A",
                "text": "Standard basic package"
              },
              {
                "key": "B",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "C",
                "text": "Digital Street Course"
              }
            ],
            "correct": "C",
            "explanation": "Người gọi xác nhận chọn gói 'Digital Street Course' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "Double the standard rate"
              },
              {
                "key": "B",
                "text": "$140"
              },
              {
                "key": "C",
                "text": "No fee is required at all"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $140."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Aperture Arts Studio speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Aperture Arts Studio xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about photography workshop enrollment. I'd like to sign up for the Digital Street Course option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về photography workshop enrollment. Tôi muốn đăng ký gói Digital Street Course nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Digital Street Course is $140. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Digital Street Course là $140. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Historic Theatre Restoration",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Historic Theatre Restoration.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Historic Theatre Restoration?",
            "options": [
              {
                "key": "A",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "B",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "C",
                "text": "To announce a permanent closure of the facility"
              }
            ],
            "correct": "B",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "B",
                "text": "The main cafe at noon"
              },
              {
                "key": "C",
                "text": "The North Pavilion before 10:30 AM"
              }
            ],
            "correct": "C",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "B",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "C",
                "text": "An outdoor swimming pool"
              }
            ],
            "correct": "A",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Historic Theatre Restoration. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Historic Theatre Restoration. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Soil Degradation Analysis",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Soil Degradation Analysis.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Soil Degradation Analysis?",
            "options": [
              {
                "key": "A",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "B",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "C",
                "text": "Their tutor cancelled the seminar, in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "B",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "B",
                "text": "Reading the entire textbook aloud, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "Removing all statistical graphs, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "A",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "They should change their topic completely, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "The bibliography is too short and invalid, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "The methodology section needs clearer operational definitions"
              }
            ],
            "correct": "C",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Soil Degradation Analysis? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Soil Degradation Analysis chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Architecture of Ancient Rome",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Architecture of Ancient Rome.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Architecture of Ancient Rome?",
            "options": [
              {
                "key": "A",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "B",
                "text": "It was discovered only in the 21st century, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "It had zero impact on surrounding ecosystems, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "B",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "C",
                "text": "High-resolution automated sensor arrays"
              }
            ],
            "correct": "C",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Funding should be halted immediately, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "No further observation is necessary, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Architecture of Ancient Rome. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Architecture of Ancient Rome. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_7",
    "sourceType": "ielts",
    "title": "IELTS #7: Airport Shuttle Transfer Booking & Exoplanet Atmosphere Spectroscopy",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Airport Shuttle Transfer Booking",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding airport shuttle transfer booking at Metro Express Transit.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Metro Express Transit?",
            "options": [
              {
                "key": "A",
                "text": "Standard basic package"
              },
              {
                "key": "B",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "C",
                "text": "Terminal 2 Direct"
              }
            ],
            "correct": "C",
            "explanation": "Người gọi xác nhận chọn gói 'Terminal 2 Direct' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "No fee is required at all"
              },
              {
                "key": "B",
                "text": "$18"
              },
              {
                "key": "C",
                "text": "Double the standard rate"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $18."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Metro Express Transit speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Metro Express Transit xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about airport shuttle transfer booking. I'd like to sign up for the Terminal 2 Direct option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về airport shuttle transfer booking. Tôi muốn đăng ký gói Terminal 2 Direct nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Terminal 2 Direct is $18. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Terminal 2 Direct là $18. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Farmers Market Relocation Map",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Farmers Market Relocation Map.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Farmers Market Relocation Map?",
            "options": [
              {
                "key": "A",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "B",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "C",
                "text": "To request emergency volunteers for repairs"
              }
            ],
            "correct": "B",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "B",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "C",
                "text": "The main cafe at noon"
              }
            ],
            "correct": "A",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "B",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "C",
                "text": "An outdoor swimming pool"
              }
            ],
            "correct": "A",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Farmers Market Relocation Map. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Farmers Market Relocation Map. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Smart Grid Power Distribution",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Smart Grid Power Distribution.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Smart Grid Power Distribution?",
            "options": [
              {
                "key": "A",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "B",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "C",
                "text": "Their tutor cancelled the seminar, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "A",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "B",
                "text": "Reading the entire textbook aloud, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "Removing all statistical graphs, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "A",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "B",
                "text": "The bibliography is too short and invalid, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "They should change their topic completely, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "A",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Smart Grid Power Distribution? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Smart Grid Power Distribution chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Exoplanet Atmosphere Spectroscopy",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Exoplanet Atmosphere Spectroscopy.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Exoplanet Atmosphere Spectroscopy?",
            "options": [
              {
                "key": "A",
                "text": "It was discovered only in the 21st century, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "It had zero impact on surrounding ecosystems, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "B",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "C",
                "text": "Manual handwritten surveys"
              }
            ],
            "correct": "B",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "B",
                "text": "Funding should be halted immediately, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "No further observation is necessary, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Exoplanet Atmosphere Spectroscopy. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Exoplanet Atmosphere Spectroscopy. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_8",
    "sourceType": "ielts",
    "title": "IELTS #8: Pottery Studio Trial Class & Primate Social Structures",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Pottery Studio Trial Class",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding pottery studio trial class at ClayWorks Collective.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at ClayWorks Collective?",
            "options": [
              {
                "key": "A",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "B",
                "text": "Standard basic package"
              },
              {
                "key": "C",
                "text": "Thursday Evening"
              }
            ],
            "correct": "C",
            "explanation": "Người gọi xác nhận chọn gói 'Thursday Evening' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "Double the standard rate"
              },
              {
                "key": "B",
                "text": "No fee is required at all"
              },
              {
                "key": "C",
                "text": "$55"
              }
            ],
            "correct": "C",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $55."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, ClayWorks Collective speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, ClayWorks Collective xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about pottery studio trial class. I'd like to sign up for the Thursday Evening option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về pottery studio trial class. Tôi muốn đăng ký gói Thursday Evening nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Thursday Evening is $55. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Thursday Evening là $55. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Harbor Eco-Boat Excursion",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Harbor Eco-Boat Excursion.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Harbor Eco-Boat Excursion?",
            "options": [
              {
                "key": "A",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "B",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "C",
                "text": "To inform visitors about updated schedules and new features"
              }
            ],
            "correct": "C",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "B",
                "text": "The main cafe at noon"
              },
              {
                "key": "C",
                "text": "The souvenir shop at closing time"
              }
            ],
            "correct": "A",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "B",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "C",
                "text": "A 500-car underground parking garage"
              }
            ],
            "correct": "B",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Harbor Eco-Boat Excursion. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Harbor Eco-Boat Excursion. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Climate Migration Patterns",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Climate Migration Patterns.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Climate Migration Patterns?",
            "options": [
              {
                "key": "A",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "B",
                "text": "Their tutor cancelled the seminar, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "Lack of reliable longitudinal data from older studies"
              }
            ],
            "correct": "C",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Reading the entire textbook aloud, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "C",
                "text": "Removing all statistical graphs, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "B",
                "text": "They should change their topic completely, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "The bibliography is too short and invalid, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Climate Migration Patterns? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Climate Migration Patterns chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Primate Social Structures",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Primate Social Structures.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Primate Social Structures?",
            "options": [
              {
                "key": "A",
                "text": "It had zero impact on surrounding ecosystems, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "C",
                "text": "It was discovered only in the 21st century, which remains subject to further departmental verification"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "B",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "C",
                "text": "High-resolution automated sensor arrays"
              }
            ],
            "correct": "C",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "B",
                "text": "Funding should be halted immediately, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "No further observation is necessary, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Primate Social Structures. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Primate Social Structures. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_9",
    "sourceType": "ielts",
    "title": "IELTS #9: Charity Marathon Registration & Volcanic Geothermal Systems",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Charity Marathon Registration",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding charity marathon registration at Green City 10K Run.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Green City 10K Run?",
            "options": [
              {
                "key": "A",
                "text": "Standard basic package"
              },
              {
                "key": "B",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "C",
                "text": "Corporate Team Entry"
              }
            ],
            "correct": "C",
            "explanation": "Người gọi xác nhận chọn gói 'Corporate Team Entry' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "Double the standard rate"
              },
              {
                "key": "B",
                "text": "$35"
              },
              {
                "key": "C",
                "text": "No fee is required at all"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $35."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "Three personal reference letters"
              },
              {
                "key": "B",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Green City 10K Run speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Green City 10K Run xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about charity marathon registration. I'd like to sign up for the Corporate Team Entry option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về charity marathon registration. Tôi muốn đăng ký gói Corporate Team Entry nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Corporate Team Entry is $35. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Corporate Team Entry là $35. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Astronomy Observatory Night",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Astronomy Observatory Night.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Astronomy Observatory Night?",
            "options": [
              {
                "key": "A",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "B",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "C",
                "text": "To request emergency volunteers for repairs"
              }
            ],
            "correct": "A",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The main cafe at noon"
              },
              {
                "key": "B",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "C",
                "text": "The North Pavilion before 10:30 AM"
              }
            ],
            "correct": "C",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "B",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "C",
                "text": "A 500-car underground parking garage"
              }
            ],
            "correct": "B",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Astronomy Observatory Night. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Astronomy Observatory Night. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Autonomous Delivery Drones",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Autonomous Delivery Drones.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Autonomous Delivery Drones?",
            "options": [
              {
                "key": "A",
                "text": "Their tutor cancelled the seminar, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "C",
                "text": "The laboratory equipment was stolen"
              }
            ],
            "correct": "B",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Removing all statistical graphs, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "C",
                "text": "Reading the entire textbook aloud, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "B",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "B",
                "text": "The bibliography is too short and invalid, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "They should change their topic completely, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Autonomous Delivery Drones? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Autonomous Delivery Drones chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Volcanic Geothermal Systems",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Volcanic Geothermal Systems.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Volcanic Geothermal Systems?",
            "options": [
              {
                "key": "A",
                "text": "It had zero impact on surrounding ecosystems, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "C",
                "text": "It was discovered only in the 21st century, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "B",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "C",
                "text": "Steam-powered mechanical calculators"
              }
            ],
            "correct": "A",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "No further observation is necessary, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "C",
                "text": "Funding should be halted immediately, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Volcanic Geothermal Systems. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Volcanic Geothermal Systems. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_10",
    "sourceType": "ielts",
    "title": "IELTS #10: Dental Clinic New Patient Intake & Carbon Sequestration in Mangroves",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Dental Clinic New Patient Intake",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding dental clinic new patient intake at BrightSmile Dental.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at BrightSmile Dental?",
            "options": [
              {
                "key": "A",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "B",
                "text": "Standard basic package"
              },
              {
                "key": "C",
                "text": "Morning Check-up"
              }
            ],
            "correct": "C",
            "explanation": "Người gọi xác nhận chọn gói 'Morning Check-up' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "10:15 AM"
              },
              {
                "key": "B",
                "text": "No fee is required at all"
              },
              {
                "key": "C",
                "text": "Double the standard rate"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là 10:15 AM."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "Three personal reference letters"
              },
              {
                "key": "B",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, BrightSmile Dental speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, BrightSmile Dental xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about dental clinic new patient intake. I'd like to sign up for the Morning Check-up option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về dental clinic new patient intake. Tôi muốn đăng ký gói Morning Check-up nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Morning Check-up is 10:15 AM. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Morning Check-up là 10:15 AM. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: National Park Hiking Trails",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about National Park Hiking Trails.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about National Park Hiking Trails?",
            "options": [
              {
                "key": "A",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "B",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "C",
                "text": "To inform visitors about updated schedules and new features"
              }
            ],
            "correct": "C",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "B",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "C",
                "text": "The main cafe at noon"
              }
            ],
            "correct": "B",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "B",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "C",
                "text": "A 500-car underground parking garage"
              }
            ],
            "correct": "A",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on National Park Hiking Trails. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về National Park Hiking Trails. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Sustainable Textile Fibers",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Sustainable Textile Fibers.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Sustainable Textile Fibers?",
            "options": [
              {
                "key": "A",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "B",
                "text": "Their tutor cancelled the seminar, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "The laboratory equipment was stolen"
              }
            ],
            "correct": "A",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "B",
                "text": "Removing all statistical graphs, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "Reading the entire textbook aloud, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "A",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "They should change their topic completely, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "C",
                "text": "The bibliography is too short and invalid, primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "B",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Sustainable Textile Fibers? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Sustainable Textile Fibers chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Carbon Sequestration in Mangroves",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Carbon Sequestration in Mangroves.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Carbon Sequestration in Mangroves?",
            "options": [
              {
                "key": "A",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "B",
                "text": "It was discovered only in the 21st century, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "It had zero impact on surrounding ecosystems, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "B",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "C",
                "text": "Manual handwritten surveys"
              }
            ],
            "correct": "A",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "B",
                "text": "No further observation is necessary, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "Funding should be halted immediately, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Carbon Sequestration in Mangroves. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Carbon Sequestration in Mangroves. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_11",
    "sourceType": "ielts",
    "title": "IELTS #11: Summer Youth Camp Sign-up & Neuroscience of Decision Making",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Summer Youth Camp Sign-up",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding summer youth camp sign-up at Pinecrest Adventure Camp.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Pinecrest Adventure Camp?",
            "options": [
              {
                "key": "A",
                "text": "Two-week Outdoor"
              },
              {
                "key": "B",
                "text": "Standard basic package"
              },
              {
                "key": "C",
                "text": "Premium VIP annual plan"
              }
            ],
            "correct": "A",
            "explanation": "Người gọi xác nhận chọn gói 'Two-week Outdoor' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "No fee is required at all"
              },
              {
                "key": "B",
                "text": "Double the standard rate"
              },
              {
                "key": "C",
                "text": "$480"
              }
            ],
            "correct": "C",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $480."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "Three personal reference letters"
              },
              {
                "key": "B",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Pinecrest Adventure Camp speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Pinecrest Adventure Camp xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about summer youth camp sign-up. I'd like to sign up for the Two-week Outdoor option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về summer youth camp sign-up. Tôi muốn đăng ký gói Two-week Outdoor nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Two-week Outdoor is $480. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Two-week Outdoor là $480. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Town Annual Music Festival",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Town Annual Music Festival.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Town Annual Music Festival?",
            "options": [
              {
                "key": "A",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "B",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "C",
                "text": "To announce a permanent closure of the facility"
              }
            ],
            "correct": "A",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The main cafe at noon"
              },
              {
                "key": "B",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "C",
                "text": "The souvenir shop at closing time"
              }
            ],
            "correct": "B",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "B",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "C",
                "text": "A 500-car underground parking garage"
              }
            ],
            "correct": "A",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Town Annual Music Festival. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Town Annual Music Festival. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Ocean Thermal Energy",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Ocean Thermal Energy.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Ocean Thermal Energy?",
            "options": [
              {
                "key": "A",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "B",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "C",
                "text": "Their tutor cancelled the seminar, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "A",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "B",
                "text": "Removing all statistical graphs, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Reading the entire textbook aloud, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The bibliography is too short and invalid, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "They should change their topic completely, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "The methodology section needs clearer operational definitions"
              }
            ],
            "correct": "C",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Ocean Thermal Energy? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Ocean Thermal Energy chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Neuroscience of Decision Making",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Neuroscience of Decision Making.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Neuroscience of Decision Making?",
            "options": [
              {
                "key": "A",
                "text": "It was discovered only in the 21st century, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "It had zero impact on surrounding ecosystems, which remains subject to further departmental verification"
              },
              {
                "key": "C",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "B",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "C",
                "text": "High-resolution automated sensor arrays"
              }
            ],
            "correct": "C",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Funding should be halted immediately, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "No further observation is necessary, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Neuroscience of Decision Making. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Neuroscience of Decision Making. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_12",
    "sourceType": "ielts",
    "title": "IELTS #12: Pet Shelter Volunteer Application & Silk Road Monetary History",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Pet Shelter Volunteer Application",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding pet shelter volunteer application at Happy Paws Sanctuary.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Happy Paws Sanctuary?",
            "options": [
              {
                "key": "A",
                "text": "Standard basic package"
              },
              {
                "key": "B",
                "text": "Weekend Dog Walker"
              },
              {
                "key": "C",
                "text": "Premium VIP annual plan"
              }
            ],
            "correct": "B",
            "explanation": "Người gọi xác nhận chọn gói 'Weekend Dog Walker' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "Saturdays 9 AM"
              },
              {
                "key": "B",
                "text": "No fee is required at all"
              },
              {
                "key": "C",
                "text": "Double the standard rate"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là Saturdays 9 AM."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "Three personal reference letters"
              },
              {
                "key": "B",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Happy Paws Sanctuary speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Happy Paws Sanctuary xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about pet shelter volunteer application. I'd like to sign up for the Weekend Dog Walker option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về pet shelter volunteer application. Tôi muốn đăng ký gói Weekend Dog Walker nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Weekend Dog Walker is Saturdays 9 AM. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Weekend Dog Walker là Saturdays 9 AM. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Eco-Friendly Commuting Plan",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Eco-Friendly Commuting Plan.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Eco-Friendly Commuting Plan?",
            "options": [
              {
                "key": "A",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "B",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "C",
                "text": "To inform visitors about updated schedules and new features"
              }
            ],
            "correct": "C",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "B",
                "text": "The main cafe at noon"
              },
              {
                "key": "C",
                "text": "The North Pavilion before 10:30 AM"
              }
            ],
            "correct": "C",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "B",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "C",
                "text": "A 500-car underground parking garage"
              }
            ],
            "correct": "B",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Eco-Friendly Commuting Plan. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Eco-Friendly Commuting Plan. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Archaeology Remote Sensing",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Archaeology Remote Sensing.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Archaeology Remote Sensing?",
            "options": [
              {
                "key": "A",
                "text": "Their tutor cancelled the seminar, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "C",
                "text": "Lack of reliable longitudinal data from older studies"
              }
            ],
            "correct": "C",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Removing all statistical graphs, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "C",
                "text": "Reading the entire textbook aloud, which remains subject to further departmental verification"
              }
            ],
            "correct": "B",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "They should change their topic completely, according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "C",
                "text": "The bibliography is too short and invalid, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Archaeology Remote Sensing? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Archaeology Remote Sensing chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Silk Road Monetary History",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Silk Road Monetary History.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Silk Road Monetary History?",
            "options": [
              {
                "key": "A",
                "text": "It had zero impact on surrounding ecosystems, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "C",
                "text": "It was discovered only in the 21st century, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "B",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "C",
                "text": "Steam-powered mechanical calculators"
              }
            ],
            "correct": "A",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Funding should be halted immediately, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "No further observation is necessary, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Silk Road Monetary History. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Silk Road Monetary History. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_13",
    "sourceType": "ielts",
    "title": "IELTS #13: Bicycle Rental for Tourists & Paleoclimatology Ice Cores",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Bicycle Rental for Tourists",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding bicycle rental for tourists at VeloCity Rentals.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at VeloCity Rentals?",
            "options": [
              {
                "key": "A",
                "text": "Electric Hybrid Bike"
              },
              {
                "key": "B",
                "text": "Standard basic package"
              },
              {
                "key": "C",
                "text": "Premium VIP annual plan"
              }
            ],
            "correct": "A",
            "explanation": "Người gọi xác nhận chọn gói 'Electric Hybrid Bike' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "No fee is required at all"
              },
              {
                "key": "B",
                "text": "Double the standard rate"
              },
              {
                "key": "C",
                "text": "$28/day"
              }
            ],
            "correct": "C",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $28/day."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "Three personal reference letters"
              },
              {
                "key": "B",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, VeloCity Rentals speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, VeloCity Rentals xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about bicycle rental for tourists. I'd like to sign up for the Electric Hybrid Bike option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về bicycle rental for tourists. Tôi muốn đăng ký gói Electric Hybrid Bike nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Electric Hybrid Bike is $28/day. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Electric Hybrid Bike là $28/day. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: University Art Gallery Opening",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about University Art Gallery Opening.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about University Art Gallery Opening?",
            "options": [
              {
                "key": "A",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "B",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "C",
                "text": "To announce a permanent closure of the facility"
              }
            ],
            "correct": "A",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "B",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "C",
                "text": "The main cafe at noon"
              }
            ],
            "correct": "A",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "B",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "C",
                "text": "A 500-car underground parking garage"
              }
            ],
            "correct": "B",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on University Art Gallery Opening. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về University Art Gallery Opening. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Global Food Security Policy",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Global Food Security Policy.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Global Food Security Policy?",
            "options": [
              {
                "key": "A",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "B",
                "text": "Their tutor cancelled the seminar, which remains subject to further departmental verification"
              },
              {
                "key": "C",
                "text": "Lack of reliable longitudinal data from older studies"
              }
            ],
            "correct": "C",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Removing all statistical graphs, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "C",
                "text": "Reading the entire textbook aloud, as demonstrated in multiple peer-reviewed observational studies"
              }
            ],
            "correct": "B",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The bibliography is too short and invalid, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "They should change their topic completely, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "The methodology section needs clearer operational definitions"
              }
            ],
            "correct": "C",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Global Food Security Policy? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Global Food Security Policy chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Paleoclimatology Ice Cores",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Paleoclimatology Ice Cores.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Paleoclimatology Ice Cores?",
            "options": [
              {
                "key": "A",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "B",
                "text": "It had zero impact on surrounding ecosystems, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "It was discovered only in the 21st century, which remains subject to further departmental verification"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "B",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "C",
                "text": "Manual handwritten surveys"
              }
            ],
            "correct": "A",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "No further observation is necessary, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Funding should be halted immediately, in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Paleoclimatology Ice Cores. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Paleoclimatology Ice Cores. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_14",
    "sourceType": "ielts",
    "title": "IELTS #14: Cooking Class Reservation & Development of Early Antibiotics",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Cooking Class Reservation",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding cooking class reservation at Taste of Asia Kitchen.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Taste of Asia Kitchen?",
            "options": [
              {
                "key": "A",
                "text": "Vegetarian Fusion"
              },
              {
                "key": "B",
                "text": "Standard basic package"
              },
              {
                "key": "C",
                "text": "Premium VIP annual plan"
              }
            ],
            "correct": "A",
            "explanation": "Người gọi xác nhận chọn gói 'Vegetarian Fusion' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "$75"
              },
              {
                "key": "B",
                "text": "Double the standard rate"
              },
              {
                "key": "C",
                "text": "No fee is required at all"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $75."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "Three personal reference letters"
              },
              {
                "key": "B",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Taste of Asia Kitchen speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Taste of Asia Kitchen xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about cooking class reservation. I'd like to sign up for the Vegetarian Fusion option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về cooking class reservation. Tôi muốn đăng ký gói Vegetarian Fusion nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Vegetarian Fusion is $75. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Vegetarian Fusion là $75. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Medieval Castle Audio Tour",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Medieval Castle Audio Tour.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Medieval Castle Audio Tour?",
            "options": [
              {
                "key": "A",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "B",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "C",
                "text": "To inform visitors about updated schedules and new features"
              }
            ],
            "correct": "C",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "B",
                "text": "The main cafe at noon"
              },
              {
                "key": "C",
                "text": "The souvenir shop at closing time"
              }
            ],
            "correct": "A",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An interactive digital audio guide system"
              },
              {
                "key": "B",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "C",
                "text": "A 500-car underground parking garage"
              }
            ],
            "correct": "A",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Medieval Castle Audio Tour. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Medieval Castle Audio Tour. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Urban Heat Island Mitigation",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Urban Heat Island Mitigation.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Urban Heat Island Mitigation?",
            "options": [
              {
                "key": "A",
                "text": "Their tutor cancelled the seminar, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "C",
                "text": "The laboratory equipment was stolen"
              }
            ],
            "correct": "B",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "B",
                "text": "Removing all statistical graphs, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "Reading the entire textbook aloud, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "A",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The bibliography is too short and invalid, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "C",
                "text": "They should change their topic completely, as demonstrated in multiple peer-reviewed observational studies"
              }
            ],
            "correct": "B",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Urban Heat Island Mitigation? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Urban Heat Island Mitigation chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Development of Early Antibiotics",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Development of Early Antibiotics.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Development of Early Antibiotics?",
            "options": [
              {
                "key": "A",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "B",
                "text": "It was discovered only in the 21st century, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "It had zero impact on surrounding ecosystems, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "B",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "C",
                "text": "Steam-powered mechanical calculators"
              }
            ],
            "correct": "B",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Funding should be halted immediately, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "C",
                "text": "No further observation is necessary, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Development of Early Antibiotics. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Development of Early Antibiotics. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_15",
    "sourceType": "ielts",
    "title": "IELTS #15: Lost Luggage Claim Report & Behavioral Economics of Choice",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Lost Luggage Claim Report",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding lost luggage claim report at TransGlobal Airlines.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at TransGlobal Airlines?",
            "options": [
              {
                "key": "A",
                "text": "Standard basic package"
              },
              {
                "key": "B",
                "text": "Blue Hard-shell Suitcase"
              },
              {
                "key": "C",
                "text": "Premium VIP annual plan"
              }
            ],
            "correct": "B",
            "explanation": "Người gọi xác nhận chọn gói 'Blue Hard-shell Suitcase' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "Flight TG402"
              },
              {
                "key": "B",
                "text": "No fee is required at all"
              },
              {
                "key": "C",
                "text": "Double the standard rate"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là Flight TG402."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "Three personal reference letters"
              },
              {
                "key": "B",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, TransGlobal Airlines speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, TransGlobal Airlines xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about lost luggage claim report. I'd like to sign up for the Blue Hard-shell Suitcase option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về lost luggage claim report. Tôi muốn đăng ký gói Blue Hard-shell Suitcase nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Blue Hard-shell Suitcase is Flight TG402. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Blue Hard-shell Suitcase là Flight TG402. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Central Library Renovation",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Central Library Renovation.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Central Library Renovation?",
            "options": [
              {
                "key": "A",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "B",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "C",
                "text": "To announce a permanent closure of the facility"
              }
            ],
            "correct": "B",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The main cafe at noon"
              },
              {
                "key": "B",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "C",
                "text": "The North Pavilion before 10:30 AM"
              }
            ],
            "correct": "C",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "B",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "C",
                "text": "An interactive digital audio guide system"
              }
            ],
            "correct": "C",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Central Library Renovation. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Central Library Renovation. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Biomimicry in Engineering",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Biomimicry in Engineering.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Biomimicry in Engineering?",
            "options": [
              {
                "key": "A",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "B",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "C",
                "text": "Their tutor cancelled the seminar, primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "B",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Removing all statistical graphs, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "C",
                "text": "Reading the entire textbook aloud, in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "B",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "They should change their topic completely, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "The bibliography is too short and invalid, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "The methodology section needs clearer operational definitions"
              }
            ],
            "correct": "C",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Biomimicry in Engineering? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Biomimicry in Engineering chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Behavioral Economics of Choice",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Behavioral Economics of Choice.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Behavioral Economics of Choice?",
            "options": [
              {
                "key": "A",
                "text": "It had zero impact on surrounding ecosystems, according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "It was discovered only in the 21st century, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "B",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "C",
                "text": "Manual handwritten surveys"
              }
            ],
            "correct": "B",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Funding should be halted immediately, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "C",
                "text": "No further observation is necessary, in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Behavioral Economics of Choice. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Behavioral Economics of Choice. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_16",
    "sourceType": "ielts",
    "title": "IELTS #16: Shared Apartment Viewing & Gravitational Wave Detection",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Shared Apartment Viewing",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding shared apartment viewing at Maple Street Flats.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Maple Street Flats?",
            "options": [
              {
                "key": "A",
                "text": "Top Floor Balcony Room"
              },
              {
                "key": "B",
                "text": "Standard basic package"
              },
              {
                "key": "C",
                "text": "Premium VIP annual plan"
              }
            ],
            "correct": "A",
            "explanation": "Người gọi xác nhận chọn gói 'Top Floor Balcony Room' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "No fee is required at all"
              },
              {
                "key": "B",
                "text": "Double the standard rate"
              },
              {
                "key": "C",
                "text": "$850/month"
              }
            ],
            "correct": "C",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $850/month."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "Three personal reference letters"
              },
              {
                "key": "B",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Maple Street Flats speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Maple Street Flats xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about shared apartment viewing. I'd like to sign up for the Top Floor Balcony Room option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về shared apartment viewing. Tôi muốn đăng ký gói Top Floor Balcony Room nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Top Floor Balcony Room is $850/month. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Top Floor Balcony Room là $850/month. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Riverside Flood Barrier Project",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Riverside Flood Barrier Project.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Riverside Flood Barrier Project?",
            "options": [
              {
                "key": "A",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "B",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "C",
                "text": "To request emergency volunteers for repairs"
              }
            ],
            "correct": "B",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "B",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "C",
                "text": "The main cafe at noon"
              }
            ],
            "correct": "B",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "B",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "C",
                "text": "An interactive digital audio guide system"
              }
            ],
            "correct": "C",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Riverside Flood Barrier Project. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Riverside Flood Barrier Project. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Cognitive Robotics Lab",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Cognitive Robotics Lab.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Cognitive Robotics Lab?",
            "options": [
              {
                "key": "A",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "B",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "C",
                "text": "Their tutor cancelled the seminar, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Removing all statistical graphs, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "C",
                "text": "Reading the entire textbook aloud, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "B",
                "text": "The bibliography is too short and invalid, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "They should change their topic completely, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "A",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Cognitive Robotics Lab? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Cognitive Robotics Lab chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Gravitational Wave Detection",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Gravitational Wave Detection.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Gravitational Wave Detection?",
            "options": [
              {
                "key": "A",
                "text": "It had zero impact on surrounding ecosystems, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "C",
                "text": "It was discovered only in the 21st century, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "B",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "C",
                "text": "High-resolution automated sensor arrays"
              }
            ],
            "correct": "C",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "B",
                "text": "No further observation is necessary, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "Funding should be halted immediately, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Gravitational Wave Detection. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Gravitational Wave Detection. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_17",
    "sourceType": "ielts",
    "title": "IELTS #17: Guitar Tuition Inquiry & Urban Hydrology Management",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Guitar Tuition Inquiry",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding guitar tuition inquiry at Harmony Music School.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Harmony Music School?",
            "options": [
              {
                "key": "A",
                "text": "Acoustic Fingerpicking"
              },
              {
                "key": "B",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "C",
                "text": "Standard basic package"
              }
            ],
            "correct": "A",
            "explanation": "Người gọi xác nhận chọn gói 'Acoustic Fingerpicking' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "$40/hour"
              },
              {
                "key": "B",
                "text": "Double the standard rate"
              },
              {
                "key": "C",
                "text": "No fee is required at all"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $40/hour."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Harmony Music School speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Harmony Music School xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about guitar tuition inquiry. I'd like to sign up for the Acoustic Fingerpicking option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về guitar tuition inquiry. Tôi muốn đăng ký gói Acoustic Fingerpicking nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Acoustic Fingerpicking is $40/hour. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Acoustic Fingerpicking là $40/hour. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Local Maritime Museum",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Local Maritime Museum.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Local Maritime Museum?",
            "options": [
              {
                "key": "A",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "B",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "C",
                "text": "To announce a permanent closure of the facility"
              }
            ],
            "correct": "B",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The main cafe at noon"
              },
              {
                "key": "B",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "C",
                "text": "The souvenir shop at closing time"
              }
            ],
            "correct": "B",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "B",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "C",
                "text": "An interactive digital audio guide system"
              }
            ],
            "correct": "C",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Local Maritime Museum. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Local Maritime Museum. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Coral Reef Bleaching Study",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Coral Reef Bleaching Study.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Coral Reef Bleaching Study?",
            "options": [
              {
                "key": "A",
                "text": "Their tutor cancelled the seminar, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "C",
                "text": "Lack of reliable longitudinal data from older studies"
              }
            ],
            "correct": "C",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Comparing real-world case studies from three regions"
              },
              {
                "key": "B",
                "text": "Removing all statistical graphs, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Reading the entire textbook aloud, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "A",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "B",
                "text": "They should change their topic completely, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "The bibliography is too short and invalid, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "A",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Coral Reef Bleaching Study? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Coral Reef Bleaching Study chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Urban Hydrology Management",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Urban Hydrology Management.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Urban Hydrology Management?",
            "options": [
              {
                "key": "A",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "B",
                "text": "It had zero impact on surrounding ecosystems, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "It was discovered only in the 21st century, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "B",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "C",
                "text": "Steam-powered mechanical calculators"
              }
            ],
            "correct": "B",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "No further observation is necessary, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "C",
                "text": "Funding should be halted immediately, which remains subject to further departmental verification"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Urban Hydrology Management. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Urban Hydrology Management. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_18",
    "sourceType": "ielts",
    "title": "IELTS #18: Public Library Card Renewal & Genetics of Domesticated Crops",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Public Library Card Renewal",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding public library card renewal at Civic Knowledge Center.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Civic Knowledge Center?",
            "options": [
              {
                "key": "A",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "B",
                "text": "Digital Media Access"
              },
              {
                "key": "C",
                "text": "Standard basic package"
              }
            ],
            "correct": "B",
            "explanation": "Người gọi xác nhận chọn gói 'Digital Media Access' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "Free"
              },
              {
                "key": "B",
                "text": "No fee is required at all"
              },
              {
                "key": "C",
                "text": "Double the standard rate"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là Free."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Civic Knowledge Center speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Civic Knowledge Center xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about public library card renewal. I'd like to sign up for the Digital Media Access option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về public library card renewal. Tôi muốn đăng ký gói Digital Media Access nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Digital Media Access is Free. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Digital Media Access là Free. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Solar Microgrid Community",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Solar Microgrid Community.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Solar Microgrid Community?",
            "options": [
              {
                "key": "A",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "B",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "C",
                "text": "To request emergency volunteers for repairs"
              }
            ],
            "correct": "B",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "B",
                "text": "The main cafe at noon"
              },
              {
                "key": "C",
                "text": "The North Pavilion before 10:30 AM"
              }
            ],
            "correct": "C",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "B",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "C",
                "text": "An interactive digital audio guide system"
              }
            ],
            "correct": "C",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Solar Microgrid Community. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Solar Microgrid Community. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Circadian Rhythm & Grades",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Circadian Rhythm & Grades.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Circadian Rhythm & Grades?",
            "options": [
              {
                "key": "A",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "B",
                "text": "Their tutor cancelled the seminar, in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "The laboratory equipment was stolen"
              }
            ],
            "correct": "A",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Removing all statistical graphs, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "Reading the entire textbook aloud, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "Comparing real-world case studies from three regions"
              }
            ],
            "correct": "C",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "B",
                "text": "The bibliography is too short and invalid, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "They should change their topic completely, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Circadian Rhythm & Grades? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Circadian Rhythm & Grades chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Genetics of Domesticated Crops",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Genetics of Domesticated Crops.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Genetics of Domesticated Crops?",
            "options": [
              {
                "key": "A",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "B",
                "text": "It was discovered only in the 21st century, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "It had zero impact on surrounding ecosystems, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "B",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "C",
                "text": "Manual handwritten surveys"
              }
            ],
            "correct": "B",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "No further observation is necessary, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "Funding should be halted immediately, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Genetics of Domesticated Crops. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Genetics of Domesticated Crops. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_19",
    "sourceType": "ielts",
    "title": "IELTS #19: Travel Agency Package Inquiry & Solar Storms & Satellites",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Travel Agency Package Inquiry",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding travel agency package inquiry at Horizon Expeditions.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at Horizon Expeditions?",
            "options": [
              {
                "key": "A",
                "text": "Nordic Fjord Cruise"
              },
              {
                "key": "B",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "C",
                "text": "Standard basic package"
              }
            ],
            "correct": "A",
            "explanation": "Người gọi xác nhận chọn gói 'Nordic Fjord Cruise' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "No fee is required at all"
              },
              {
                "key": "B",
                "text": "Double the standard rate"
              },
              {
                "key": "C",
                "text": "$1,450"
              }
            ],
            "correct": "C",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $1,450."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, Horizon Expeditions speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, Horizon Expeditions xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about travel agency package inquiry. I'd like to sign up for the Nordic Fjord Cruise option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về travel agency package inquiry. Tôi muốn đăng ký gói Nordic Fjord Cruise nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Nordic Fjord Cruise is $1,450. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Nordic Fjord Cruise là $1,450. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Regional Science Fair Guide",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Regional Science Fair Guide.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Regional Science Fair Guide?",
            "options": [
              {
                "key": "A",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "B",
                "text": "To request emergency volunteers for repairs"
              },
              {
                "key": "C",
                "text": "To inform visitors about updated schedules and new features"
              }
            ],
            "correct": "C",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "B",
                "text": "The souvenir shop at closing time"
              },
              {
                "key": "C",
                "text": "The main cafe at noon"
              }
            ],
            "correct": "A",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "B",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "C",
                "text": "An interactive digital audio guide system"
              }
            ],
            "correct": "C",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Regional Science Fair Guide. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Regional Science Fair Guide. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Microbiome Gut-Brain Axis",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Microbiome Gut-Brain Axis.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Microbiome Gut-Brain Axis?",
            "options": [
              {
                "key": "A",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "B",
                "text": "Their tutor cancelled the seminar, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "The laboratory equipment was stolen"
              }
            ],
            "correct": "A",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Reading the entire textbook aloud, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "Removing all statistical graphs, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "Comparing real-world case studies from three regions"
              }
            ],
            "correct": "C",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "They should change their topic completely, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "The methodology section needs clearer operational definitions"
              },
              {
                "key": "C",
                "text": "The bibliography is too short and invalid, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Microbiome Gut-Brain Axis? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Microbiome Gut-Brain Axis chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Solar Storms & Satellites",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Solar Storms & Satellites.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Solar Storms & Satellites?",
            "options": [
              {
                "key": "A",
                "text": "It had zero impact on surrounding ecosystems, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "It was discovered only in the 21st century, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "Manual handwritten surveys"
              },
              {
                "key": "B",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "C",
                "text": "High-resolution automated sensor arrays"
              }
            ],
            "correct": "C",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "No further observation is necessary, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Funding should be halted immediately, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              }
            ],
            "correct": "C",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Solar Storms & Satellites. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Solar Storms & Satellites. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "ielts_test_20",
    "sourceType": "ielts",
    "title": "IELTS #20: Volunteer First-Aid Course & Quantum Computing Basics",
    "subtitle": "4 Sections (IELTS Standard) • 12 Câu hỏi • Section 1-4 có Audio & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Section 1: Volunteer First-Aid Course",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C.\nYou will hear a telephone conversation regarding volunteer first-aid course at RedCross Metro Branch.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. Which option does the caller decide to select at RedCross Metro Branch?",
            "options": [
              {
                "key": "A",
                "text": "Premium VIP annual plan"
              },
              {
                "key": "B",
                "text": "Certified Weekend"
              },
              {
                "key": "C",
                "text": "Standard basic package"
              }
            ],
            "correct": "B",
            "explanation": "Người gọi xác nhận chọn gói 'Certified Weekend' vì phù hợp với lịch trình và ngân sách cá nhân."
          },
          {
            "id": 2,
            "text": "2. How much is the confirmed fee or rate mentioned by the staff?",
            "options": [
              {
                "key": "A",
                "text": "Double the standard rate"
              },
              {
                "key": "B",
                "text": "$60"
              },
              {
                "key": "C",
                "text": "No fee is required at all"
              }
            ],
            "correct": "B",
            "explanation": "Nhân viên thông báo mức chi phí chính thức là $60."
          },
          {
            "id": 3,
            "text": "3. What must the caller bring or provide to finalize the registration?",
            "options": [
              {
                "key": "A",
                "text": "A printed passport photo and proof of address"
              },
              {
                "key": "B",
                "text": "Three personal reference letters"
              },
              {
                "key": "C",
                "text": "A medical certificate from a hospital"
              }
            ],
            "correct": "A",
            "explanation": "Nhân viên nhắc cần mang theo ảnh thẻ và giấy xác nhận địa chỉ để hoàn tất thủ tục."
          }
        ],
        "transcript": [
          {
            "speaker": "Staff",
            "en": "Good morning, RedCross Metro Branch speaking. How may I assist you today?",
            "vi": "Chào buổi sáng, RedCross Metro Branch xin nghe. Tôi có thể hỗ trợ gì cho bạn hôm nay?"
          },
          {
            "speaker": "Caller",
            "en": "Hi, I'm calling to inquire about volunteer first-aid course. I'd like to sign up for the Certified Weekend option if it's still available.",
            "vi": "Chào bạn, tôi gọi để hỏi về volunteer first-aid course. Tôi muốn đăng ký gói Certified Weekend nếu vẫn còn suất."
          },
          {
            "speaker": "Staff",
            "en": "Yes, it is definitely available! The current rate for Certified Weekend is $60. You just need to bring a printed passport photo and proof of address when you visit.",
            "vi": "Vâng, gói này vẫn còn ạ! Mức phí hiện tại cho Certified Weekend là $60. Bạn chỉ cần mang theo một ảnh thẻ và giấy xác nhận địa chỉ khi đến."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Section 2: Heritage Railway Station",
        "instruction": "Questions 4-6. Choose the correct letter, A, B or C.\nYou will hear a public coordinator giving information about Heritage Railway Station.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the main purpose of the announcement about Heritage Railway Station?",
            "options": [
              {
                "key": "A",
                "text": "To announce a permanent closure of the facility"
              },
              {
                "key": "B",
                "text": "To inform visitors about updated schedules and new features"
              },
              {
                "key": "C",
                "text": "To request emergency volunteers for repairs"
              }
            ],
            "correct": "B",
            "explanation": "Bài nói giới thiệu về lịch trình cập nhật và những điểm mới dành cho khách tham quan."
          },
          {
            "id": 5,
            "text": "5. Which area is recommended to visit first to avoid crowds?",
            "options": [
              {
                "key": "A",
                "text": "The North Pavilion before 10:30 AM"
              },
              {
                "key": "B",
                "text": "The main cafe at noon"
              },
              {
                "key": "C",
                "text": "The souvenir shop at closing time"
              }
            ],
            "correct": "A",
            "explanation": "Hướng dẫn viên khuyên nên ghé khu North Pavilion trước 10:30 sáng để tránh đông đúc."
          },
          {
            "id": 6,
            "text": "6. What new facility has been added this season?",
            "options": [
              {
                "key": "A",
                "text": "A 500-car underground parking garage"
              },
              {
                "key": "B",
                "text": "An outdoor swimming pool"
              },
              {
                "key": "C",
                "text": "An interactive digital audio guide system"
              }
            ],
            "correct": "C",
            "explanation": "Hệ thống hướng dẫn âm thanh kỹ thuật số tương tác vừa được bổ sung trong mùa này."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Welcome everyone to today's briefing on Heritage Railway Station. We've updated our visitor schedule and introduced several exciting features this season.",
            "vi": "Chào mừng mọi người đến với buổi giới thiệu về Heritage Railway Station. Chúng tôi đã cập nhật lịch tham quan và bổ sung nhiều điểm mới thú vị trong mùa này."
          },
          {
            "speaker": "Coordinator",
            "en": "To beat the midday crowds, we strongly recommend heading to the North Pavilion before 10:30 AM. Also, don't forget to try our brand-new interactive digital audio guide system.",
            "vi": "Để tránh đám đông buổi trưa, chúng tôi khuyên bạn nên ghé North Pavilion trước 10:30 sáng. Cũng đừng quên trải nghiệm hệ thống hướng dẫn âm thanh kỹ thuật số tương tác mới tinh của chúng tôi."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Section 3: Academic Discussion — Plastic-Eating Enzymes",
        "instruction": "Questions 7-9. Choose the correct letter, A, B or C.\nYou will hear two university students discussing their research project on Plastic-Eating Enzymes.",
        "questions": [
          {
            "id": 7,
            "text": "7. What challenge did the students encounter during their initial research on Plastic-Eating Enzymes?",
            "options": [
              {
                "key": "A",
                "text": "The laboratory equipment was stolen"
              },
              {
                "key": "B",
                "text": "Lack of reliable longitudinal data from older studies"
              },
              {
                "key": "C",
                "text": "Their tutor cancelled the seminar, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "B",
            "explanation": "Hai sinh viên nhận thấy dữ liệu dài hạn từ các nghiên cứu cũ thiếu độ tin cậy."
          },
          {
            "id": 8,
            "text": "8. What do both students agree to focus on in the final presentation?",
            "options": [
              {
                "key": "A",
                "text": "Reading the entire textbook aloud, according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "Removing all statistical graphs, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "Comparing real-world case studies from three regions"
              }
            ],
            "correct": "C",
            "explanation": "Cả hai thống nhất sẽ tập trung so sánh các nghiên cứu thực tế từ 3 khu vực khác nhau."
          },
          {
            "id": 9,
            "text": "9. What feedback did Dr. Evans give on their draft outline?",
            "options": [
              {
                "key": "A",
                "text": "The bibliography is too short and invalid, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "They should change their topic completely, in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "The methodology section needs clearer operational definitions"
              }
            ],
            "correct": "C",
            "explanation": "Tiến sĩ Evans góp ý phần phương pháp nghiên cứu cần định nghĩa rõ ràng hơn."
          }
        ],
        "transcript": [
          {
            "speaker": "Maya",
            "en": "Liam, have you reviewed the literature on Plastic-Eating Enzymes? I noticed a serious shortage of reliable longitudinal data from older studies.",
            "vi": "Liam, bạn đã xem tài liệu về Plastic-Eating Enzymes chưa? Mình thấy rất thiếu dữ liệu dài hạn đáng tin cậy từ các nghiên cứu cũ."
          },
          {
            "speaker": "Liam",
            "en": "Totally agree. Dr. Evans also emailed saying our methodology section needs clearer operational definitions. Let's focus our final presentation on comparing real-world case studies from three regions.",
            "vi": "Hoàn toàn đồng ý. Tiến sĩ Evans cũng nhắn rằng phần phương pháp cần định nghĩa rõ ràng hơn. Hãy tập trung bài thuyết trình cuối vào việc so sánh các nghiên cứu thực tế từ 3 khu vực nhé."
          }
        ]
      },
      {
        "partNumber": 4,
        "title": "Section 4: University Lecture — Quantum Computing Basics",
        "instruction": "Questions 10-12. Choose the correct letter, A, B or C.\nYou will hear part of a university lecture on Quantum Computing Basics.",
        "questions": [
          {
            "id": 10,
            "text": "10. According to the lecturer, what was previously misunderstood about Quantum Computing Basics?",
            "options": [
              {
                "key": "A",
                "text": "It had zero impact on surrounding ecosystems, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Scientists assumed the phenomenon occurred only in isolated environments"
              },
              {
                "key": "C",
                "text": "It was discovered only in the 21st century, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên cho biết trước đây giới khoa học từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập."
          },
          {
            "id": 11,
            "text": "11. What recent technological breakthrough accelerated research in this field?",
            "options": [
              {
                "key": "A",
                "text": "High-resolution automated sensor arrays"
              },
              {
                "key": "B",
                "text": "Steam-powered mechanical calculators"
              },
              {
                "key": "C",
                "text": "Manual handwritten surveys"
              }
            ],
            "correct": "A",
            "explanation": "Mạng lưới cảm biến tự động độ phân giải cao đã thúc đẩy đột phá nghiên cứu trong lĩnh vực này."
          },
          {
            "id": 12,
            "text": "12. What conclusion does the lecturer draw for future research?",
            "options": [
              {
                "key": "A",
                "text": "Funding should be halted immediately, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Interdisciplinary collaboration is essential to unlock remaining mysteries"
              },
              {
                "key": "C",
                "text": "No further observation is necessary, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Giảng viên kết luận sự hợp tác liên ngành là chìa khóa để giải mã các bí ẩn còn lại."
          }
        ],
        "transcript": [
          {
            "speaker": "Professor",
            "en": "Today we examine Quantum Computing Basics. For decades, researchers assumed this phenomenon occurred only in isolated environments. However, high-resolution automated sensor arrays have completely transformed our observations.",
            "vi": "Hôm nay chúng ta tìm hiểu về Quantum Computing Basics. Nhiều thập kỷ qua, các nhà nghiên cứu từng cho rằng hiện tượng này chỉ xảy ra ở môi trường biệt lập. Tuy nhiên, hệ thống cảm biến tự động độ phân giải cao đã thay đổi hoàn toàn góc nhìn của chúng ta."
          },
          {
            "speaker": "Professor",
            "en": "Moving forward, interdisciplinary collaboration between engineers and theoretical scientists will be essential to unlock the remaining mysteries.",
            "vi": "Trong tương lai, sự hợp tác liên ngành giữa các kỹ sư và nhà khoa học lý thuyết sẽ là yếu tố cốt lõi để giải mã những bí ẩn còn lại."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_1",
    "sourceType": "aptis",
    "title": "APTIS #1: Train Platform Change & Telecommuting Opinions",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "No changes have been made"
              },
              {
                "key": "B",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "C",
                "text": "Platform 4"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Platform 4."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "International journalists"
              },
              {
                "key": "B",
                "text": "Maintenance engineers only"
              },
              {
                "key": "C",
                "text": "Customers and scheduled visitors"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Platform 4. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Platform 4. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Remote Work Flexibility",
        "instruction": "Questions 4-6. Four speakers share their opinions about remote work flexibility. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for remote work flexibility?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "A",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "A",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "A",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about remote work flexibility. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ remote work flexibility. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Nobody cares about the topic anymore, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "C",
                "text": "People often rely on outdated headlines rather than data"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Indifferent"
              },
              {
                "key": "B",
                "text": "Cautiously optimistic"
              },
              {
                "key": "C",
                "text": "Completely furious"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "B",
                "text": "Avoid using any modern technology, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "Change careers every three months, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_2",
    "sourceType": "aptis",
    "title": "APTIS #2: Doctor Appointment Reschedule & Cashless Payments",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "No changes have been made"
              },
              {
                "key": "B",
                "text": "Wednesday 2:30 PM"
              },
              {
                "key": "C",
                "text": "The service is cancelled permanently"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Wednesday 2:30 PM."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "B",
                "text": "International journalists"
              },
              {
                "key": "C",
                "text": "Maintenance engineers only"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Wednesday 2:30 PM. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Wednesday 2:30 PM. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Digital Wallet Security",
        "instruction": "Questions 4-6. Four speakers share their opinions about digital wallet security. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for digital wallet security?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "C",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "C",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "B",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about digital wallet security. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ digital wallet security. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Nobody cares about the topic anymore, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "C",
                "text": "People often rely on outdated headlines rather than data"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Completely furious"
              },
              {
                "key": "B",
                "text": "Indifferent"
              },
              {
                "key": "C",
                "text": "Cautiously optimistic"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Change careers every three months, according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "Avoid using any modern technology, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Stay adaptable and continuously update practical skills"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_3",
    "sourceType": "aptis",
    "title": "APTIS #3: Bookstore Order Pickup & Online Higher Education",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "Counter B"
              },
              {
                "key": "B",
                "text": "No changes have been made"
              },
              {
                "key": "C",
                "text": "The service is cancelled permanently"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Counter B."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "B",
                "text": "Maintenance engineers only"
              },
              {
                "key": "C",
                "text": "International journalists"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Counter B. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Counter B. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Self-Paced University Courses",
        "instruction": "Questions 4-6. Four speakers share their opinions about self-paced university courses. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for self-paced university courses?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "B",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "A",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "B",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about self-paced university courses. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ self-paced university courses. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "B",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "C",
                "text": "Nobody cares about the topic anymore, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Completely furious"
              },
              {
                "key": "B",
                "text": "Indifferent"
              },
              {
                "key": "C",
                "text": "Cautiously optimistic"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "B",
                "text": "Change careers every three months, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "Avoid using any modern technology, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_4",
    "sourceType": "aptis",
    "title": "APTIS #4: Flight Gate Update & Electric Vehicles",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "Gate 18B"
              },
              {
                "key": "B",
                "text": "No changes have been made"
              },
              {
                "key": "C",
                "text": "The service is cancelled permanently"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Gate 18B."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "B",
                "text": "International journalists"
              },
              {
                "key": "C",
                "text": "Maintenance engineers only"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Gate 18B. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Gate 18B. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Charging Infrastructure",
        "instruction": "Questions 4-6. Four speakers share their opinions about charging infrastructure. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for charging infrastructure?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "C",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "C",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "A",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about charging infrastructure. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ charging infrastructure. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "B",
                "text": "Nobody cares about the topic anymore, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Everyone understands the technical details perfectly"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Cautiously optimistic"
              },
              {
                "key": "B",
                "text": "Completely furious"
              },
              {
                "key": "C",
                "text": "Indifferent"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "B",
                "text": "Avoid using any modern technology, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Change careers every three months, in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_5",
    "sourceType": "aptis",
    "title": "APTIS #5: Delivery Package Timing & AI in Classrooms",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "No changes have been made"
              },
              {
                "key": "B",
                "text": "Between 4 and 6 PM"
              },
              {
                "key": "C",
                "text": "The service is cancelled permanently"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Between 4 and 6 PM."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "B",
                "text": "Maintenance engineers only"
              },
              {
                "key": "C",
                "text": "International journalists"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "B",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "B",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Between 4 and 6 PM. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Between 4 and 6 PM. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Personalized Tutoring",
        "instruction": "Questions 4-6. Four speakers share their opinions about personalized tutoring. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for personalized tutoring?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "B",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 4 (David)"
              }
            ],
            "correct": "B",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "A",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about personalized tutoring. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ personalized tutoring. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Nobody cares about the topic anymore, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "C",
                "text": "Everyone understands the technical details perfectly"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Cautiously optimistic"
              },
              {
                "key": "B",
                "text": "Indifferent"
              },
              {
                "key": "C",
                "text": "Completely furious"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Change careers every three months, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Avoid using any modern technology, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "Stay adaptable and continuously update practical skills"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_6",
    "sourceType": "aptis",
    "title": "APTIS #6: Library Closing Hours & Fast Fashion Impact",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "8:30 PM"
              },
              {
                "key": "B",
                "text": "No changes have been made"
              },
              {
                "key": "C",
                "text": "The service is cancelled permanently"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: 8:30 PM."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "International journalists"
              },
              {
                "key": "B",
                "text": "Maintenance engineers only"
              },
              {
                "key": "C",
                "text": "Customers and scheduled visitors"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "B",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "B",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: 8:30 PM. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: 8:30 PM. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Ethical Clothing Production",
        "instruction": "Questions 4-6. Four speakers share their opinions about ethical clothing production. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for ethical clothing production?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "C",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "B",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "B",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about ethical clothing production. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ ethical clothing production. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "B",
                "text": "Nobody cares about the topic anymore, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "People often rely on outdated headlines rather than data"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Indifferent"
              },
              {
                "key": "B",
                "text": "Completely furious"
              },
              {
                "key": "C",
                "text": "Cautiously optimistic"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "B",
                "text": "Change careers every three months, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Avoid using any modern technology, as demonstrated in multiple peer-reviewed observational studies"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_7",
    "sourceType": "aptis",
    "title": "APTIS #7: Hotel Check-in Delay & Urban High-Rises",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "B",
                "text": "3:00 PM"
              },
              {
                "key": "C",
                "text": "No changes have been made"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: 3:00 PM."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "B",
                "text": "International journalists"
              },
              {
                "key": "C",
                "text": "Maintenance engineers only"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "B",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "B",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: 3:00 PM. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: 3:00 PM. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on City Housing Density",
        "instruction": "Questions 4-6. Four speakers share their opinions about city housing density. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for city housing density?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "B",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "C",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "B",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about city housing density. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ city housing density. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "B",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "C",
                "text": "Nobody cares about the topic anymore, primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Completely furious"
              },
              {
                "key": "B",
                "text": "Cautiously optimistic"
              },
              {
                "key": "C",
                "text": "Indifferent"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "B",
                "text": "Avoid using any modern technology, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Change careers every three months, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_8",
    "sourceType": "aptis",
    "title": "APTIS #8: Museum Ticket Discount & Social Media Habits",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "B",
                "text": "25% off for students"
              },
              {
                "key": "C",
                "text": "No changes have been made"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: 25% off for students."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "B",
                "text": "Maintenance engineers only"
              },
              {
                "key": "C",
                "text": "International journalists"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "B",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "B",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: 25% off for students. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: 25% off for students. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Youth Mental Focus",
        "instruction": "Questions 4-6. Four speakers share their opinions about youth mental focus. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for youth mental focus?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "C",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 4 (David)"
              }
            ],
            "correct": "A",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "A",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about youth mental focus. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ youth mental focus. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "B",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "C",
                "text": "Nobody cares about the topic anymore, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Indifferent"
              },
              {
                "key": "B",
                "text": "Cautiously optimistic"
              },
              {
                "key": "C",
                "text": "Completely furious"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Avoid using any modern technology, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "Change careers every three months, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "Stay adaptable and continuously update practical skills"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_9",
    "sourceType": "aptis",
    "title": "APTIS #9: Weather Warning & Plant-Based Diets",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "Heavy coastal rain"
              },
              {
                "key": "B",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "C",
                "text": "No changes have been made"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Heavy coastal rain."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "International journalists"
              },
              {
                "key": "B",
                "text": "Maintenance engineers only"
              },
              {
                "key": "C",
                "text": "Customers and scheduled visitors"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "B",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "B",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Heavy coastal rain. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Heavy coastal rain. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Environmental Footprint",
        "instruction": "Questions 4-6. Four speakers share their opinions about environmental footprint. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for environmental footprint?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "A",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "A",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "C",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about environmental footprint. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ environmental footprint. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "B",
                "text": "Nobody cares about the topic anymore, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "Everyone understands the technical details perfectly"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Completely furious"
              },
              {
                "key": "B",
                "text": "Indifferent"
              },
              {
                "key": "C",
                "text": "Cautiously optimistic"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Change careers every three months, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "C",
                "text": "Avoid using any modern technology, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_10",
    "sourceType": "aptis",
    "title": "APTIS #10: Gym Class Cancellation & Space Exploration",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "B",
                "text": "Yoga moved to Friday"
              },
              {
                "key": "C",
                "text": "No changes have been made"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Yoga moved to Friday."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "International journalists"
              },
              {
                "key": "B",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "C",
                "text": "Maintenance engineers only"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "B",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "B",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Yoga moved to Friday. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Yoga moved to Friday. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Public Science Funding",
        "instruction": "Questions 4-6. Four speakers share their opinions about public science funding. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for public science funding?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "A",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "C",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "C",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about public science funding. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ public science funding. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Nobody cares about the topic anymore, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "C",
                "text": "People often rely on outdated headlines rather than data"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Cautiously optimistic"
              },
              {
                "key": "B",
                "text": "Completely furious"
              },
              {
                "key": "C",
                "text": "Indifferent"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Avoid using any modern technology, according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "C",
                "text": "Change careers every three months, as demonstrated in multiple peer-reviewed observational studies"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_11",
    "sourceType": "aptis",
    "title": "APTIS #11: Restaurant Table Confirmation & Freelance Work",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "B",
                "text": "7:45 PM for four"
              },
              {
                "key": "C",
                "text": "No changes have been made"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: 7:45 PM for four."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Maintenance engineers only"
              },
              {
                "key": "B",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "C",
                "text": "International journalists"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "B",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "B",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: 7:45 PM for four. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: 7:45 PM for four. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Income Stability",
        "instruction": "Questions 4-6. Four speakers share their opinions about income stability. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for income stability?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "A",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 4 (David)"
              }
            ],
            "correct": "B",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "C",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about income stability. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ income stability. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "B",
                "text": "Nobody cares about the topic anymore, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "People often rely on outdated headlines rather than data"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Cautiously optimistic"
              },
              {
                "key": "B",
                "text": "Indifferent"
              },
              {
                "key": "C",
                "text": "Completely furious"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Avoid using any modern technology, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Change careers every three months, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "Stay adaptable and continuously update practical skills"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_12",
    "sourceType": "aptis",
    "title": "APTIS #12: Dentist Waiting Room & Smartphone Screen Time",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "Dr. Taylor's office"
              },
              {
                "key": "B",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "C",
                "text": "No changes have been made"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Dr. Taylor's office."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Maintenance engineers only"
              },
              {
                "key": "B",
                "text": "International journalists"
              },
              {
                "key": "C",
                "text": "Customers and scheduled visitors"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "B",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "B",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Dr. Taylor's office. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Dr. Taylor's office. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Evening Sleep Quality",
        "instruction": "Questions 4-6. Four speakers share their opinions about evening sleep quality. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for evening sleep quality?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "A",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "B",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "C",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about evening sleep quality. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ evening sleep quality. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "B",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "C",
                "text": "Nobody cares about the topic anymore, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Indifferent"
              },
              {
                "key": "B",
                "text": "Completely furious"
              },
              {
                "key": "C",
                "text": "Cautiously optimistic"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Change careers every three months, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "C",
                "text": "Avoid using any modern technology, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_13",
    "sourceType": "aptis",
    "title": "APTIS #13: Cinema Screening Change & Renewable Subsidies",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "B",
                "text": "No changes have been made"
              },
              {
                "key": "C",
                "text": "Screen 3 at 8:15"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Screen 3 at 8:15."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "International journalists"
              },
              {
                "key": "B",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "C",
                "text": "Maintenance engineers only"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Screen 3 at 8:15. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Screen 3 at 8:15. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Solar Energy Adoption",
        "instruction": "Questions 4-6. Four speakers share their opinions about solar energy adoption. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for solar energy adoption?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "C",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "C",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "C",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about solar energy adoption. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ solar energy adoption. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "B",
                "text": "Nobody cares about the topic anymore, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "Everyone understands the technical details perfectly"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Completely furious"
              },
              {
                "key": "B",
                "text": "Cautiously optimistic"
              },
              {
                "key": "C",
                "text": "Indifferent"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Avoid using any modern technology, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "C",
                "text": "Change careers every three months, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_14",
    "sourceType": "aptis",
    "title": "APTIS #14: School Bus Route Update & Public Transport",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "B",
                "text": "No changes have been made"
              },
              {
                "key": "C",
                "text": "Stop at Oak Avenue"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Stop at Oak Avenue."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Maintenance engineers only"
              },
              {
                "key": "B",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "C",
                "text": "International journalists"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Stop at Oak Avenue. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Stop at Oak Avenue. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Urban Traffic Congestion",
        "instruction": "Questions 4-6. Four speakers share their opinions about urban traffic congestion. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for urban traffic congestion?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "A",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 4 (David)"
              }
            ],
            "correct": "A",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "C",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about urban traffic congestion. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ urban traffic congestion. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Nobody cares about the topic anymore, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "C",
                "text": "Everyone understands the technical details perfectly"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Indifferent"
              },
              {
                "key": "B",
                "text": "Cautiously optimistic"
              },
              {
                "key": "C",
                "text": "Completely furious"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Avoid using any modern technology, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Change careers every three months, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Stay adaptable and continuously update practical skills"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_15",
    "sourceType": "aptis",
    "title": "APTIS #15: Concert Venue Entrance & E-books vs Print",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "No changes have been made"
              },
              {
                "key": "B",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "C",
                "text": "East Gate entrance"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: East Gate entrance."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Maintenance engineers only"
              },
              {
                "key": "B",
                "text": "International journalists"
              },
              {
                "key": "C",
                "text": "Customers and scheduled visitors"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: East Gate entrance. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: East Gate entrance. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Reading Retention",
        "instruction": "Questions 4-6. Four speakers share their opinions about reading retention. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for reading retention?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "C",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "A",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "C",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about reading retention. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ reading retention. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Nobody cares about the topic anymore, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "C",
                "text": "People often rely on outdated headlines rather than data"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Indifferent"
              },
              {
                "key": "B",
                "text": "Cautiously optimistic"
              },
              {
                "key": "C",
                "text": "Completely furious"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Change careers every three months, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "Avoid using any modern technology, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "Stay adaptable and continuously update practical skills"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_16",
    "sourceType": "aptis",
    "title": "APTIS #16: Pharmacy Prescription Ready & Smart Homes",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "B",
                "text": "No changes have been made"
              },
              {
                "key": "C",
                "text": "Ready after 1 PM"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Ready after 1 PM."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Maintenance engineers only"
              },
              {
                "key": "B",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "C",
                "text": "International journalists"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Ready after 1 PM. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Ready after 1 PM. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Automated Energy Savings",
        "instruction": "Questions 4-6. Four speakers share their opinions about automated energy savings. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for automated energy savings?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "B",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "C",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "A",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about automated energy savings. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ automated energy savings. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "B",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "C",
                "text": "Nobody cares about the topic anymore, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Indifferent"
              },
              {
                "key": "B",
                "text": "Completely furious"
              },
              {
                "key": "C",
                "text": "Cautiously optimistic"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "B",
                "text": "Change careers every three months, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "Avoid using any modern technology, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_17",
    "sourceType": "aptis",
    "title": "APTIS #17: Tennis Court Booking & Telemedicine Visits",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "No changes have been made"
              },
              {
                "key": "B",
                "text": "The service is cancelled permanently"
              },
              {
                "key": "C",
                "text": "Court 2 indoor"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Court 2 indoor."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Maintenance engineers only"
              },
              {
                "key": "B",
                "text": "International journalists"
              },
              {
                "key": "C",
                "text": "Customers and scheduled visitors"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Court 2 indoor. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Court 2 indoor. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Rural Healthcare Access",
        "instruction": "Questions 4-6. Four speakers share their opinions about rural healthcare access. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for rural healthcare access?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "C",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 4 (David)"
              }
            ],
            "correct": "B",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "B",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about rural healthcare access. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ rural healthcare access. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "B",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "C",
                "text": "Nobody cares about the topic anymore, which remains subject to further departmental verification"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Cautiously optimistic"
              },
              {
                "key": "B",
                "text": "Completely furious"
              },
              {
                "key": "C",
                "text": "Indifferent"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "B",
                "text": "Avoid using any modern technology, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "Change careers every three months, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_18",
    "sourceType": "aptis",
    "title": "APTIS #18: Bank Branch Relocation & Work-Life Balance",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "High Street branch"
              },
              {
                "key": "B",
                "text": "No changes have been made"
              },
              {
                "key": "C",
                "text": "The service is cancelled permanently"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: High Street branch."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "International journalists"
              },
              {
                "key": "B",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "C",
                "text": "Maintenance engineers only"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: High Street branch. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: High Street branch. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Disconnecting After Hours",
        "instruction": "Questions 4-6. Four speakers share their opinions about disconnecting after hours. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for disconnecting after hours?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "B",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "B",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "B",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "B",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about disconnecting after hours. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ disconnecting after hours. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "People often rely on outdated headlines rather than data"
              },
              {
                "key": "B",
                "text": "Nobody cares about the topic anymore, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "Everyone understands the technical details perfectly"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Cautiously optimistic"
              },
              {
                "key": "B",
                "text": "Indifferent"
              },
              {
                "key": "C",
                "text": "Completely furious"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Change careers every three months, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "Avoid using any modern technology, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "Stay adaptable and continuously update practical skills"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_19",
    "sourceType": "aptis",
    "title": "APTIS #19: Art Exhibition Extension & Four-Day Work Week",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "No changes have been made"
              },
              {
                "key": "B",
                "text": "Extended until Sunday"
              },
              {
                "key": "C",
                "text": "The service is cancelled permanently"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Extended until Sunday."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "Maintenance engineers only"
              },
              {
                "key": "B",
                "text": "Customers and scheduled visitors"
              },
              {
                "key": "C",
                "text": "International journalists"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Extended until Sunday. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Extended until Sunday. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Employee Productivity",
        "instruction": "Questions 4-6. Four speakers share their opinions about employee productivity. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for employee productivity?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "C",
                "text": "Speaker 1 (Sarah)"
              }
            ],
            "correct": "C",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 4 (David)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "C",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "A",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about employee productivity. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ employee productivity. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "B",
                "text": "Nobody cares about the topic anymore, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "People often rely on outdated headlines rather than data"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Completely furious"
              },
              {
                "key": "B",
                "text": "Indifferent"
              },
              {
                "key": "C",
                "text": "Cautiously optimistic"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "B",
                "text": "Change careers every three months, in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "Avoid using any modern technology, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "aptis_test_20",
    "sourceType": "aptis",
    "title": "APTIS #20: Airport Lounge Access & Plastic Packaging Bans",
    "subtitle": "3 Parts (British Council APTIS ESOL Standard) • 9 Câu hỏi • Information Recognition, Speaker Matching & Inference",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Information Recognition (Short Messages)",
        "instruction": "Questions 1-3. Choose the correct answer, A, B or C.\nYou will hear short phone messages and public announcements.",
        "questions": [
          {
            "id": 1,
            "text": "1. What key information or change is specifically confirmed in the message?",
            "options": [
              {
                "key": "A",
                "text": "Terminal 1 Mezzanine"
              },
              {
                "key": "B",
                "text": "No changes have been made"
              },
              {
                "key": "C",
                "text": "The service is cancelled permanently"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo xác nhận cụ thể chi tiết quan trọng là: Terminal 1 Mezzanine."
          },
          {
            "id": 2,
            "text": "2. Who is the announcement primarily intended for?",
            "options": [
              {
                "key": "A",
                "text": "International journalists"
              },
              {
                "key": "B",
                "text": "Maintenance engineers only"
              },
              {
                "key": "C",
                "text": "Customers and scheduled visitors"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo hướng tới khách hàng và người tham dự đã đặt lịch."
          },
          {
            "id": 3,
            "text": "3. What should listeners do if they require further assistance?",
            "options": [
              {
                "key": "A",
                "text": "Contact the reception desk or helpline"
              },
              {
                "key": "B",
                "text": "Send a handwritten postcard"
              },
              {
                "key": "C",
                "text": "Wait until next month"
              }
            ],
            "correct": "A",
            "explanation": "Người nghe được hướng dẫn liên hệ quầy lễ tân hoặc đường dây nóng nếu cần hỗ trợ thêm."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcement",
            "en": "Attention please. For all customers and scheduled visitors, please note the updated detail: Terminal 1 Mezzanine. If you require further assistance, kindly contact our reception desk or helpline.",
            "vi": "Xin chú ý. Đối với tất cả khách hàng và khách tham quan đã đặt lịch, vui lòng lưu ý thông tin cập nhật: Terminal 1 Mezzanine. Nếu bạn cần hỗ trợ thêm, xin liên hệ quầy lễ tân hoặc đường dây nóng."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Speaker Matching — Opinions on Reusable Shopping Bags",
        "instruction": "Questions 4-6. Four speakers share their opinions about reusable shopping bags. Match the viewpoint to the correct speaker.",
        "questions": [
          {
            "id": 4,
            "text": "4. Which speaker expresses strong enthusiasm for reusable shopping bags?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 3 (Elena)"
              }
            ],
            "correct": "B",
            "explanation": "Sarah (Speaker 1) bày tỏ sự ủng hộ mạnh mẽ và nhìn thấy nhiều lợi ích dài hạn."
          },
          {
            "id": 5,
            "text": "5. Which speaker raises concerns about hidden costs or practical drawbacks?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 2 (Mark)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 4 (David)"
              }
            ],
            "correct": "A",
            "explanation": "Mark (Speaker 2) lo ngại về những chi phí ẩn và trở ngại thực tế khi triển khai."
          },
          {
            "id": 6,
            "text": "6. Which speaker advocates for a balanced, regulated approach?",
            "options": [
              {
                "key": "A",
                "text": "Speaker 3 (Elena)"
              },
              {
                "key": "B",
                "text": "Speaker 1 (Sarah)"
              },
              {
                "key": "C",
                "text": "Speaker 2 (Mark)"
              }
            ],
            "correct": "A",
            "explanation": "Elena (Speaker 3) đề xuất cách tiếp cận cân bằng và có quy định rõ ràng."
          }
        ],
        "transcript": [
          {
            "speaker": "Speaker 1 (Sarah)",
            "en": "Personally, I'm completely enthusiastic about reusable shopping bags. It brings tremendous long-term benefits to our daily routines.",
            "vi": "Cá nhân tôi hoàn toàn ủng hộ reusable shopping bags. Nó mang lại những lợi ích lâu dài tuyệt vời cho cuộc sống hằng ngày."
          },
          {
            "speaker": "Speaker 2 (Mark)",
            "en": "I'm a bit skeptical because people often overlook the hidden costs and practical drawbacks involved.",
            "vi": "Tôi hơi hoài nghi vì mọi người thường bỏ qua các chi phí ẩn và bất cập thực tế."
          },
          {
            "speaker": "Speaker 3 (Elena)",
            "en": "I believe we shouldn't go to extremes. A balanced, well-regulated approach works best for everyone.",
            "vi": "Tôi tin rằng chúng ta không nên cực đoan. Cách tiếp cận cân bằng và có quy định hợp lý là tốt nhất cho tất cả mọi người."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Extended Interview & Inference",
        "instruction": "Questions 7-9. Listen to an interview with an industry specialist and infer the speaker's attitude.",
        "questions": [
          {
            "id": 7,
            "text": "7. What does the specialist imply about public perception?",
            "options": [
              {
                "key": "A",
                "text": "Nobody cares about the topic anymore, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Everyone understands the technical details perfectly"
              },
              {
                "key": "C",
                "text": "People often rely on outdated headlines rather than data"
              }
            ],
            "correct": "C",
            "explanation": "Chuyên gia ngụ ý công chúng thường tin vào các tiêu đề lỗi thời thay vì số liệu thực tế."
          },
          {
            "id": 8,
            "text": "8. How does the specialist feel about upcoming policy reforms?",
            "options": [
              {
                "key": "A",
                "text": "Completely furious"
              },
              {
                "key": "B",
                "text": "Cautiously optimistic"
              },
              {
                "key": "C",
                "text": "Indifferent"
              }
            ],
            "correct": "B",
            "explanation": "Chuyên gia thể hiện thái độ lạc quan một cách thận trọng (cautiously optimistic)."
          },
          {
            "id": 9,
            "text": "9. What advice does the specialist give to young professionals?",
            "options": [
              {
                "key": "A",
                "text": "Stay adaptable and continuously update practical skills"
              },
              {
                "key": "B",
                "text": "Avoid using any modern technology, in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "Change careers every three months, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "A",
            "explanation": "Chuyên gia khuyên người trẻ hãy giữ sự linh hoạt và liên tục cập nhật kỹ năng thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host",
            "en": "Why is there still so much confusion around this issue?",
            "vi": "Tại sao vẫn còn nhiều sự nhầm lẫn xung quanh vấn đề này?"
          },
          {
            "speaker": "Specialist",
            "en": "Because people often rely on outdated headlines rather than looking at real data. As for the upcoming reforms, I'm cautiously optimistic. My best advice for young professionals is to stay adaptable and continuously update your practical skills.",
            "vi": "Bởi vì mọi người thường dựa vào những tiêu đề cũ kỹ thay vì xem xét dữ liệu thực tế. Về các cải cách sắp tới, tôi lạc quan một cách thận trọng. Lời khuyên tốt nhất cho các bạn trẻ là hãy luôn linh hoạt và liên tục trau dồi kỹ năng thực tiễn."
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_listening_5",
    "sourceType": "active",
    "title": "ACTIVE LISTENING: BBC Learning English (6 Minute English & Real English)",
    "subtitle": "Nguồn: @bbclearningenglish • Luyện nghe chủ động, phân tích từ vựng học thuật & đời sống",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: BBC 6 Minute English — The Psychology of Productivity & Focus",
        "instruction": "Active Listening: Listen carefully to the BBC Learning English discussion between Sam and Neil. Answer questions 1-5.",
        "audioSrc": "",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "options": [
              {
                "key": "A",
                "text": "It saves up to 40% of working time"
              },
              {
                "key": "B",
                "text": "The brain actually switches rapidly between tasks rather than doing them simultaneously"
              },
              {
                "key": "C",
                "text": "Only young people can multitask effectively"
              }
            ],
            "evidence": "Sam explains that human brains don't truly multitask; instead, they perform rapid 'task-switching', which drains mental energy.",
            "text": "1. According to Sam, what is the biggest myth about multitasking?",
            "correct": 1,
            "explanation": "Trong bài BBC 6 Minute English, Sam giải thích rằng não người không thực sự làm nhiều việc cùng lúc mà chuyển đổi qua lại nhanh chóng (task-switching), gây hao tổn năng lượng."
          },
          {
            "id": 2,
            "options": [
              {
                "key": "A",
                "text": "To waste electricity at night"
              },
              {
                "key": "B",
                "text": "To work or study late into the night"
              },
              {
                "key": "C",
                "text": "To feel completely exhausted in the morning"
              }
            ],
            "evidence": "Neil defines 'burn the midnight oil' as working or studying late into the night.",
            "text": "2. What does the idiom 'burn the midnight oil' mean in the BBC segment?",
            "correct": 1,
            "explanation": "Thành ngữ 'burn the midnight oil' có nghĩa là thức khuya làm việc hoặc học bài."
          },
          {
            "id": 3,
            "options": [
              {
                "key": "A",
                "text": "About 2 minutes"
              },
              {
                "key": "B",
                "text": "Around 23 minutes"
              },
              {
                "key": "C",
                "text": "Nearly 1 hour"
              }
            ],
            "evidence": "Research cited in the programme shows it takes an average of 23 minutes to return to deep focus after an interruption.",
            "text": "3. How long does it take to regain deep focus after a brief phone notification?",
            "correct": 1,
            "explanation": "Nghiên cứu được nhắc tới trong bài chỉ ra mất trung bình 23 phút để lấy lại sự tập trung sâu sau một lần bị ngắt quãng."
          },
          {
            "id": 4,
            "options": [
              {
                "key": "A",
                "text": "Studying 4 hours straight without breaks"
              },
              {
                "key": "B",
                "text": "Using 25-minute focused blocks followed by 5-minute breaks"
              },
              {
                "key": "C",
                "text": "Listening to loud music while memorizing words"
              }
            ],
            "evidence": "Neil recommends the Pomodoro method: 25 minutes of intense focus followed by a 5-minute rest.",
            "text": "4. What technique does Neil recommend for Active Listening & Studying?",
            "correct": 1,
            "explanation": "Neil khuyên dùng phương pháp Pomodoro: 25 phút tập trung cao độ và 5 phút nghỉ ngơi."
          },
          {
            "id": 5,
            "options": [
              {
                "key": "A",
                "text": "Active listening requires taking notes and shadowing key phrases"
              },
              {
                "key": "B",
                "text": "You only need to study grammar rules once a month"
              },
              {
                "key": "C",
                "text": "Reading silently is better than listening"
              }
            ],
            "answer": 0,
            "evidence": "Sam concludes that active listening — pausing, shadowing, and noting useful expressions — accelerates fluency.",
            "text": "5. What is the key takeaway for English learners at the end of the episode?",
            "explanation": "Sam kết luận rằng nghe chủ động (tạm dừng, nhại lại câu và ghi chú cụm từ) giúp tăng tốc độ trôi chảy."
          }
        ],
        "transcript": [
          {
            "speaker": "Sam",
            "en": "Hello and welcome to 6 Minute English from BBC Learning English. I'm Sam.",
            "vi": "Xin chào và chào mừng đến với chương trình 6 Minute English của BBC Learning English. Tôi là Sam."
          },
          {
            "speaker": "Neil",
            "en": "And I'm Neil. Today we're talking about why so many of us feel busy all day, yet struggle to finish important tasks — and we'll look at expressions for work and exams.",
            "vi": "Còn tôi là Neil. Hôm nay chúng ta nói về lý do nhiều người bận rộn cả ngày nhưng vẫn khó hoàn thành việc quan trọng — và tìm hiểu các cụm từ cho công việc và thi cử."
          },
          {
            "speaker": "Sam",
            "en": "Many people pride themselves on multitasking, or even burning the midnight oil — which means working or studying late into the night. But psychologists say our brains don't truly multitask.",
            "vi": "Nhiều người tự hào về việc làm đa nhiệm, hoặc thức khuya làm việc (burn the midnight oil). Nhưng các nhà tâm lý học nói rằng não chúng ta không thực sự làm đa nhiệm."
          },
          {
            "speaker": "Neil",
            "en": "That's right! What we're actually doing is rapid task-switching. Every time a phone notification interrupts you, research shows it takes around 23 minutes to regain deep focus.",
            "vi": "Đúng vậy! Điều chúng ta thực sự làm là chuyển đổi tác vụ liên tục. Mỗi lần có thông báo điện thoại, nghiên cứu cho thấy phải mất khoảng 23 phút để lấy lại sự tập trung sâu."
          },
          {
            "speaker": "Sam",
            "en": "So instead of scattered attention, try working in 25-minute focused sprints with 5-minute breaks. And when practising Active Listening, pause the audio, shadow the speaker, and note down real-life phrases!",
            "vi": "Vì vậy thay vì phân tán sự chú ý, hãy thử làm việc theo chặng tập trung 25 phút và nghỉ 5 phút. Và khi luyện Nghe Chủ Động, hãy tạm dừng audio, nhại lại lời người nói và ghi chú các cụm từ thực tế!"
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: BBC News Review — Artificial Intelligence & Future Jobs",
        "instruction": "Active Listening: Listen to the BBC News Review report on AI and employment. Choose the best answer A, B or C.",
        "audioSrc": "",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 6,
            "options": [
              {
                "key": "A",
                "text": "A game changer"
              },
              {
                "key": "B",
                "text": "A close call"
              },
              {
                "key": "C",
                "text": "A silver lining"
              }
            ],
            "answer": 0,
            "evidence": "The presenter highlights 'a game changer' as a key news phrase meaning something that completely transforms a situation.",
            "text": "6. What headline phrase means 'to change the rules or situation completely'?",
            "explanation": "'A game changer' nghĩa là nhân tố làm thay đổi hoàn toàn cục diện."
          },
          {
            "id": 7,
            "options": [
              {
                "key": "A",
                "text": "Manual data entry"
              },
              {
                "key": "B",
                "text": "Critical thinking and human communication"
              },
              {
                "key": "C",
                "text": "Memorizing phone numbers"
              }
            ],
            "evidence": "The BBC report emphasizes critical thinking, empathy, and persuasive communication.",
            "text": "7. Which skill is predicted to become MOST valuable alongside AI tools?",
            "correct": 1,
            "explanation": "Báo cáo của BBC nhấn mạnh tư duy phản biện, sự thấu cảm và giao tiếp thuyết phục."
          },
          {
            "id": 8,
            "options": [
              {
                "key": "A",
                "text": "To quit a job suddenly"
              },
              {
                "key": "B",
                "text": "To learn new, more advanced skills for work"
              },
              {
                "key": "C",
                "text": "To reduce working hours"
              }
            ],
            "evidence": "To 'upskill' means teaching or learning additional, higher-level job skills.",
            "text": "8. What does 'upskill' mean in the BBC workplace context?",
            "correct": 1,
            "explanation": "'Upskill' nghĩa là học thêm kỹ năng mới, nâng cao trình độ nghề nghiệp."
          },
          {
            "id": 9,
            "options": [
              {
                "key": "A",
                "text": "Banning all computers permanently"
              },
              {
                "key": "B",
                "text": "Adding more oral interviews and real-world problem solving"
              },
              {
                "key": "C",
                "text": "Canceling English exams"
              }
            ],
            "evidence": "Universities are shifting toward oral assessments and practical case studies.",
            "text": "9. How are universities adapting exams according to the report?",
            "correct": 1,
            "explanation": "Các trường đại học đang chuyển dần sang kiểm tra vấn đáp và giải quyết tình huống thực tế."
          },
          {
            "id": 10,
            "options": [
              {
                "key": "A",
                "text": "Cautiously optimistic if workers keep learning"
              },
              {
                "key": "B",
                "text": "Completely terrified"
              },
              {
                "key": "C",
                "text": "Indifferent"
              }
            ],
            "answer": 0,
            "evidence": "The presenter remains cautiously optimistic, stressing lifelong learning.",
            "text": "10. What is the tone of the BBC presenter regarding AI?",
            "explanation": "Người dẫn chương trình giữ thái độ lạc quan thận trọng nếu người lao động liên tục học hỏi."
          }
        ],
        "transcript": [
          {
            "speaker": "Georgina",
            "en": "Welcome to BBC News Review, where we help you understand the language of real news stories.",
            "vi": "Chào mừng đến với BBC News Review, nơi chúng tôi giúp bạn hiểu ngôn ngữ của các bản tin thời sự thực tế."
          },
          {
            "speaker": "Rob",
            "en": "This week, headlines call generative AI a 'game changer' — something that completely transforms how industries operate.",
            "vi": "Tuần này, các trang nhất gọi AI tạo sinh là một 'game changer' — nhân tố thay đổi hoàn toàn cách các ngành vận hành."
          },
          {
            "speaker": "Georgina",
            "en": "True, but experts say workers don't need to panic if they 'upskill' — meaning they learn new, advanced capabilities. Skills like critical thinking, teamwork, and clear communication remain uniquely human.",
            "vi": "Đúng vậy, nhưng chuyên gia nói người lao động không cần hoảng loạn nếu họ biết 'upskill' — tức là học các kỹ năng mới nâng cao. Tư duy phản biện, làm việc nhóm và giao tiếp rõ ràng vẫn là thế mạnh riêng của con người."
          },
          {
            "speaker": "Rob",
            "en": "Even universities are shifting toward oral interviews and practical problem-solving exams. So keep practising your English actively every single day!",
            "vi": "Ngay cả các trường đại học cũng đang chuyển sang thi vấn đáp và giải quyết vấn đề thực tế. Vì vậy hãy luyện tiếng Anh chủ động mỗi ngày nhé!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_2",
    "sourceType": "active",
    "title": "BBC Active #2: Is AI Smarter Than Humans?",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'algorithmic bias' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Is AI Smarter Than Humans?",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Is AI Smarter Than Humans? and focus on 'algorithmic bias'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Is AI Smarter Than Humans?'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative is variables based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "The role of algorithmic bias in understanding artificial intelligence"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative is variables primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "B",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'algorithmic bias' đối với chủ đề artificial intelligence."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'algorithmic bias' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a type of tropical fruit, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "C",
                "text": "As an obsolete grammar rule, which remains subject to further departmental verification"
              }
            ],
            "correct": "B",
            "explanation": "Thuật ngữ 'algorithmic bias' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "How to spell 'encyclopedia', following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "The capital city of Australia, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "A surprising statistical question about global trends"
              }
            ],
            "correct": "C",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Science cannot explain anything, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "Stop learning English immediately, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "Awareness and small evidence-based changes make a real difference"
              }
            ],
            "correct": "C",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Is AI Smarter Than Humans?. First, let's start with a quick quiz about global statistics in artificial intelligence.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Is AI Smarter Than Humans?. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực artificial intelligence."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'algorithmic bias' — a critical mechanism shaping how artificial intelligence works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'algorithmic bias' — một cơ chế then chốt định hình cách artificial intelligence vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_3",
    "sourceType": "active",
    "title": "BBC Active #3: The Mystery of Gut Bacteria",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'microbiome' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: The Mystery of Gut Bacteria",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing The Mystery of Gut Bacteria and focus on 'microbiome'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'The Mystery of Gut Bacteria'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative the variables based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "The role of microbiome in understanding digestive health"
              },
              {
                "key": "C",
                "text": "Tips for repairing vintage automobiles"
              }
            ],
            "correct": "B",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'microbiome' đối với chủ đề digestive health."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'microbiome' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a type of tropical fruit, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "As an obsolete grammar rule, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              }
            ],
            "correct": "C",
            "explanation": "Thuật ngữ 'microbiome' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "B",
                "text": "The capital city of Australia, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "How to spell 'encyclopedia', following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "A",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "B",
                "text": "Stop learning English immediately, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "Science cannot explain anything, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "A",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about The Mystery of Gut Bacteria. First, let's start with a quick quiz about global statistics in digestive health.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề The Mystery of Gut Bacteria. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực digestive health."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'microbiome' — a critical mechanism shaping how digestive health works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'microbiome' — một cơ chế then chốt định hình cách digestive health vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_4",
    "sourceType": "active",
    "title": "BBC Active #4: Why Do We Procrastinate?",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'emotional regulation' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Why Do We Procrastinate?",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Why Do We Procrastinate? and focus on 'emotional regulation'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Why Do We Procrastinate?'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative why variables as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative why variables without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "The role of emotional regulation in understanding time management"
              }
            ],
            "correct": "C",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'emotional regulation' đối với chủ đề time management."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'emotional regulation' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              }
            ],
            "correct": "C",
            "explanation": "Thuật ngữ 'emotional regulation' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "The capital city of Australia, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "C",
                "text": "How to spell 'encyclopedia', based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "B",
                "text": "Science cannot explain anything, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "Stop learning English immediately, primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "A",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Why Do We Procrastinate?. First, let's start with a quick quiz about global statistics in time management.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Why Do We Procrastinate?. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực time management."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'emotional regulation' — a critical mechanism shaping how time management works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'emotional regulation' — một cơ chế then chốt định hình cách time management vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_5",
    "sourceType": "active",
    "title": "BBC Active #5: The Future of Green Aviation",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'sustainable fuel' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: The Future of Green Aviation",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing The Future of Green Aviation and focus on 'sustainable fuel'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'The Future of Green Aviation'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative the variables concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "The role of sustainable fuel in understanding carbon emissions"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative the variables despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'sustainable fuel' đối với chủ đề carbon emissions."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'sustainable fuel' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "B",
                "text": "As an obsolete grammar rule, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "As a type of tropical fruit, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Thuật ngữ 'sustainable fuel' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "B",
                "text": "The capital city of Australia, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "How to spell 'encyclopedia', in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "A",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Science cannot explain anything, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "Stop learning English immediately, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Awareness and small evidence-based changes make a real difference"
              }
            ],
            "correct": "C",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about The Future of Green Aviation. First, let's start with a quick quiz about global statistics in carbon emissions.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề The Future of Green Aviation. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực carbon emissions."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'sustainable fuel' — a critical mechanism shaping how carbon emissions works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'sustainable fuel' — một cơ chế then chốt định hình cách carbon emissions vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_6",
    "sourceType": "active",
    "title": "BBC Active #6: Can Money Buy Happiness?",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'diminishing returns' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Can Money Buy Happiness?",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Can Money Buy Happiness? and focus on 'diminishing returns'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Can Money Buy Happiness?'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative can variables concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "The role of diminishing returns in understanding well-being"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative can variables according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'diminishing returns' đối với chủ đề well-being."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'diminishing returns' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              }
            ],
            "correct": "C",
            "explanation": "Thuật ngữ 'diminishing returns' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "B",
                "text": "The capital city of Australia, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "How to spell 'encyclopedia', under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Science cannot explain anything, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "C",
                "text": "Stop learning English immediately, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "B",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Can Money Buy Happiness?. First, let's start with a quick quiz about global statistics in well-being.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Can Money Buy Happiness?. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực well-being."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'diminishing returns' — a critical mechanism shaping how well-being works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'diminishing returns' — một cơ chế then chốt định hình cách well-being vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_7",
    "sourceType": "active",
    "title": "BBC Active #7: Benefits of Daydreaming",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'mind wandering' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Benefits of Daydreaming",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Benefits of Daydreaming and focus on 'mind wandering'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Benefits of Daydreaming'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative benefits variables according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative benefits variables in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "The role of mind wandering in understanding creative problem solving"
              }
            ],
            "correct": "C",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'mind wandering' đối với chủ đề creative problem solving."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'mind wandering' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "As an obsolete grammar rule, as demonstrated in multiple peer-reviewed observational studies"
              }
            ],
            "correct": "A",
            "explanation": "Thuật ngữ 'mind wandering' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "The capital city of Australia, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "C",
                "text": "How to spell 'encyclopedia', despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Stop learning English immediately, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Science cannot explain anything, in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "Awareness and small evidence-based changes make a real difference"
              }
            ],
            "correct": "C",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Benefits of Daydreaming. First, let's start with a quick quiz about global statistics in creative problem solving.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Benefits of Daydreaming. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực creative problem solving."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'mind wandering' — a critical mechanism shaping how creative problem solving works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'mind wandering' — một cơ chế then chốt định hình cách creative problem solving vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_8",
    "sourceType": "active",
    "title": "BBC Active #8: How Trees Communicate",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'mycorrhizal network' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: How Trees Communicate",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing How Trees Communicate and focus on 'mycorrhizal network'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'How Trees Communicate'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative how variables despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "The role of mycorrhizal network in understanding forest ecology"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative how variables following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "B",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'mycorrhizal network' đối với chủ đề forest ecology."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'mycorrhizal network' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              }
            ],
            "correct": "C",
            "explanation": "Thuật ngữ 'mycorrhizal network' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "The capital city of Australia, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "C",
                "text": "How to spell 'encyclopedia', following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "B",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Stop learning English immediately, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "C",
                "text": "Science cannot explain anything, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about How Trees Communicate. First, let's start with a quick quiz about global statistics in forest ecology.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề How Trees Communicate. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực forest ecology."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'mycorrhizal network' — a critical mechanism shaping how forest ecology works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'mycorrhizal network' — một cơ chế then chốt định hình cách forest ecology vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_9",
    "sourceType": "active",
    "title": "BBC Active #9: Why Accents Change Over Time",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'phonetic drift' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Why Accents Change Over Time",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Why Accents Change Over Time and focus on 'phonetic drift'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Why Accents Change Over Time'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative why variables as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative why variables as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "The role of phonetic drift in understanding sociolinguistics"
              }
            ],
            "correct": "C",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'phonetic drift' đối với chủ đề sociolinguistics."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'phonetic drift' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "As an obsolete grammar rule, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "A",
            "explanation": "Thuật ngữ 'phonetic drift' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "B",
                "text": "The capital city of Australia, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "How to spell 'encyclopedia', concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "A",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Science cannot explain anything, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "C",
                "text": "Stop learning English immediately, as demonstrated in multiple peer-reviewed observational studies"
              }
            ],
            "correct": "B",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Why Accents Change Over Time. First, let's start with a quick quiz about global statistics in sociolinguistics.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Why Accents Change Over Time. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực sociolinguistics."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'phonetic drift' — a critical mechanism shaping how sociolinguistics works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'phonetic drift' — một cơ chế then chốt định hình cách sociolinguistics vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_10",
    "sourceType": "active",
    "title": "BBC Active #10: Science of Habit Formation",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'dopamine cue' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Science of Habit Formation",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Science of Habit Formation and focus on 'dopamine cue'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Science of Habit Formation'?",
            "options": [
              {
                "key": "A",
                "text": "The role of dopamine cue in understanding behavioral psychology"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative science variables despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative science variables which remains subject to further departmental verification"
              }
            ],
            "correct": "A",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'dopamine cue' đối với chủ đề behavioral psychology."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'dopamine cue' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a type of tropical fruit, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "As an obsolete grammar rule, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              }
            ],
            "correct": "C",
            "explanation": "Thuật ngữ 'dopamine cue' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "B",
                "text": "How to spell 'encyclopedia', based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "The capital city of Australia, which remains subject to further departmental verification"
              }
            ],
            "correct": "A",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Stop learning English immediately, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Science cannot explain anything, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "Awareness and small evidence-based changes make a real difference"
              }
            ],
            "correct": "C",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Science of Habit Formation. First, let's start with a quick quiz about global statistics in behavioral psychology.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Science of Habit Formation. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực behavioral psychology."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'dopamine cue' — a critical mechanism shaping how behavioral psychology works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'dopamine cue' — một cơ chế then chốt định hình cách behavioral psychology vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_11",
    "sourceType": "active",
    "title": "BBC Active #11: Ocean Plastic Cleanup",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'biodegradable polymers' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Ocean Plastic Cleanup",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Ocean Plastic Cleanup and focus on 'biodegradable polymers'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Ocean Plastic Cleanup'?",
            "options": [
              {
                "key": "A",
                "text": "The role of biodegradable polymers in understanding marine conservation"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative ocean variables as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative ocean variables despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "A",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'biodegradable polymers' đối với chủ đề marine conservation."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'biodegradable polymers' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a type of tropical fruit, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "C",
                "text": "As an obsolete grammar rule, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Thuật ngữ 'biodegradable polymers' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "How to spell 'encyclopedia', in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "C",
                "text": "The capital city of Australia, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Stop learning English immediately, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "C",
                "text": "Science cannot explain anything, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Ocean Plastic Cleanup. First, let's start with a quick quiz about global statistics in marine conservation.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Ocean Plastic Cleanup. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực marine conservation."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'biodegradable polymers' — a critical mechanism shaping how marine conservation works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'biodegradable polymers' — một cơ chế then chốt định hình cách marine conservation vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_12",
    "sourceType": "active",
    "title": "BBC Active #12: Psychology of Motivation",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'intrinsic drive' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Psychology of Motivation",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Psychology of Motivation and focus on 'intrinsic drive'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Psychology of Motivation'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative psychology variables as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative psychology variables primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "The role of intrinsic drive in understanding goal setting"
              }
            ],
            "correct": "C",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'intrinsic drive' đối với chủ đề goal setting."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'intrinsic drive' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "C",
                "text": "As a type of tropical fruit, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Thuật ngữ 'intrinsic drive' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "How to spell 'encyclopedia', under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "C",
                "text": "The capital city of Australia, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Science cannot explain anything, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "C",
                "text": "Stop learning English immediately, which remains subject to further departmental verification"
              }
            ],
            "correct": "B",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Psychology of Motivation. First, let's start with a quick quiz about global statistics in goal setting.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Psychology of Motivation. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực goal setting."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'intrinsic drive' — a critical mechanism shaping how goal setting works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'intrinsic drive' — một cơ chế then chốt định hình cách goal setting vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_13",
    "sourceType": "active",
    "title": "BBC Active #13: Urban Rewilding Projects",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'biodiversity corridors' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Urban Rewilding Projects",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Urban Rewilding Projects and focus on 'biodiversity corridors'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Urban Rewilding Projects'?",
            "options": [
              {
                "key": "A",
                "text": "The role of biodiversity corridors in understanding city planning"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative urban variables under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative urban variables under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'biodiversity corridors' đối với chủ đề city planning."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'biodiversity corridors' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a type of tropical fruit, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "C",
                "text": "As an obsolete grammar rule, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "B",
            "explanation": "Thuật ngữ 'biodiversity corridors' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "B",
                "text": "How to spell 'encyclopedia', despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "The capital city of Australia, in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "A",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Stop learning English immediately, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "Science cannot explain anything, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Awareness and small evidence-based changes make a real difference"
              }
            ],
            "correct": "C",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Urban Rewilding Projects. First, let's start with a quick quiz about global statistics in city planning.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Urban Rewilding Projects. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực city planning."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'biodiversity corridors' — a critical mechanism shaping how city planning works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'biodiversity corridors' — một cơ chế then chốt định hình cách city planning vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_14",
    "sourceType": "active",
    "title": "BBC Active #14: Why Sleep Cleans the Brain",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'glymphatic system' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Why Sleep Cleans the Brain",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Why Sleep Cleans the Brain and focus on 'glymphatic system'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Why Sleep Cleans the Brain'?",
            "options": [
              {
                "key": "A",
                "text": "The role of glymphatic system in understanding neuroscience"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative why variables following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative why variables which remains subject to further departmental verification"
              }
            ],
            "correct": "A",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'glymphatic system' đối với chủ đề neuroscience."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'glymphatic system' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "C",
                "text": "As a type of tropical fruit, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Thuật ngữ 'glymphatic system' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "B",
                "text": "How to spell 'encyclopedia', following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "The capital city of Australia, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "A",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "B",
                "text": "Stop learning English immediately, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Science cannot explain anything, which remains subject to further departmental verification"
              }
            ],
            "correct": "A",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Why Sleep Cleans the Brain. First, let's start with a quick quiz about global statistics in neuroscience.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Why Sleep Cleans the Brain. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực neuroscience."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'glymphatic system' — a critical mechanism shaping how neuroscience works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'glymphatic system' — một cơ chế then chốt định hình cách neuroscience vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_15",
    "sourceType": "active",
    "title": "BBC Active #15: Rise of the Circular Economy",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'zero-waste design' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Rise of the Circular Economy",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Rise of the Circular Economy and focus on 'zero-waste design'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Rise of the Circular Economy'?",
            "options": [
              {
                "key": "A",
                "text": "Tips for repairing vintage automobiles"
              },
              {
                "key": "B",
                "text": "The role of zero-waste design in understanding recycling"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative rise variables which remains subject to further departmental verification"
              }
            ],
            "correct": "B",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'zero-waste design' đối với chủ đề recycling."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'zero-waste design' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "C",
                "text": "As a type of tropical fruit, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Thuật ngữ 'zero-waste design' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "The capital city of Australia, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "C",
                "text": "How to spell 'encyclopedia', despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "B",
                "text": "Science cannot explain anything, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "Stop learning English immediately, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "A",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Rise of the Circular Economy. First, let's start with a quick quiz about global statistics in recycling.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Rise of the Circular Economy. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực recycling."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'zero-waste design' — a critical mechanism shaping how recycling works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'zero-waste design' — một cơ chế then chốt định hình cách recycling vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_16",
    "sourceType": "active",
    "title": "BBC Active #16: Digital Detox in Modern Life",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'attention span' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Digital Detox in Modern Life",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Digital Detox in Modern Life and focus on 'attention span'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Digital Detox in Modern Life'?",
            "options": [
              {
                "key": "A",
                "text": "The role of attention span in understanding screen fatigue"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative digital variables in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative digital variables under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'attention span' đối với chủ đề screen fatigue."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'attention span' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "C",
                "text": "As a type of tropical fruit, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Thuật ngữ 'attention span' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "How to spell 'encyclopedia', based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "C",
                "text": "The capital city of Australia, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "B",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Stop learning English immediately, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Science cannot explain anything, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "Awareness and small evidence-based changes make a real difference"
              }
            ],
            "correct": "C",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Digital Detox in Modern Life. First, let's start with a quick quiz about global statistics in screen fatigue.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Digital Detox in Modern Life. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực screen fatigue."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'attention span' — a critical mechanism shaping how screen fatigue works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'attention span' — một cơ chế then chốt định hình cách screen fatigue vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_17",
    "sourceType": "active",
    "title": "BBC Active #17: Evolutionary Purpose of Fear",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'amygdala response' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Evolutionary Purpose of Fear",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Evolutionary Purpose of Fear and focus on 'amygdala response'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Evolutionary Purpose of Fear'?",
            "options": [
              {
                "key": "A",
                "text": "The role of amygdala response in understanding survival instinct"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative evolutionary variables following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative evolutionary variables without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "A",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'amygdala response' đối với chủ đề survival instinct."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'amygdala response' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              }
            ],
            "correct": "C",
            "explanation": "Thuật ngữ 'amygdala response' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "How to spell 'encyclopedia', in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "The capital city of Australia, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "A surprising statistical question about global trends"
              }
            ],
            "correct": "C",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "B",
                "text": "Science cannot explain anything, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "Stop learning English immediately, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Evolutionary Purpose of Fear. First, let's start with a quick quiz about global statistics in survival instinct.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Evolutionary Purpose of Fear. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực survival instinct."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'amygdala response' — a critical mechanism shaping how survival instinct works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'amygdala response' — một cơ chế then chốt định hình cách survival instinct vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_18",
    "sourceType": "active",
    "title": "BBC Active #18: Future of Synthetic Biology",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'cellular engineering' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Future of Synthetic Biology",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Future of Synthetic Biology and focus on 'cellular engineering'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Future of Synthetic Biology'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative future variables without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative future variables based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "The role of cellular engineering in understanding biotech"
              }
            ],
            "correct": "C",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'cellular engineering' đối với chủ đề biotech."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'cellular engineering' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "As an obsolete grammar rule, which remains subject to further departmental verification"
              }
            ],
            "correct": "A",
            "explanation": "Thuật ngữ 'cellular engineering' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "How to spell 'encyclopedia', under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "The capital city of Australia, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "A surprising statistical question about global trends"
              }
            ],
            "correct": "C",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Science cannot explain anything, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "Stop learning English immediately, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "Awareness and small evidence-based changes make a real difference"
              }
            ],
            "correct": "C",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Future of Synthetic Biology. First, let's start with a quick quiz about global statistics in biotech.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Future of Synthetic Biology. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực biotech."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'cellular engineering' — a critical mechanism shaping how biotech works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'cellular engineering' — một cơ chế then chốt định hình cách biotech vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_19",
    "sourceType": "active",
    "title": "BBC Active #19: Surviving Extreme Urban Heat",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'reflective surfaces' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Surviving Extreme Urban Heat",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Surviving Extreme Urban Heat and focus on 'reflective surfaces'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Surviving Extreme Urban Heat'?",
            "options": [
              {
                "key": "A",
                "text": "The role of reflective surfaces in understanding climate adaptation"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative surviving variables based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative surviving variables primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "A",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'reflective surfaces' đối với chủ đề climate adaptation."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'reflective surfaces' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              }
            ],
            "correct": "C",
            "explanation": "Thuật ngữ 'reflective surfaces' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "The capital city of Australia, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "How to spell 'encyclopedia', despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "A surprising statistical question about global trends"
              }
            ],
            "correct": "C",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Stop learning English immediately, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "C",
                "text": "Science cannot explain anything, in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "B",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Surviving Extreme Urban Heat. First, let's start with a quick quiz about global statistics in climate adaptation.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Surviving Extreme Urban Heat. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực climate adaptation."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'reflective surfaces' — a critical mechanism shaping how climate adaptation works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'reflective surfaces' — một cơ chế then chốt định hình cách climate adaptation vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_20",
    "sourceType": "active",
    "title": "BBC Active #20: How Language Evolves",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'lexical borrowing' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: How Language Evolves",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing How Language Evolves and focus on 'lexical borrowing'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'How Language Evolves'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative how variables as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative how variables according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "The role of lexical borrowing in understanding digital slang"
              }
            ],
            "correct": "C",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'lexical borrowing' đối với chủ đề digital slang."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'lexical borrowing' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "As an obsolete grammar rule, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Thuật ngữ 'lexical borrowing' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "The capital city of Australia, according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "How to spell 'encyclopedia', following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "A surprising statistical question about global trends"
              }
            ],
            "correct": "C",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "B",
                "text": "Science cannot explain anything, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "Stop learning English immediately, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about How Language Evolves. First, let's start with a quick quiz about global statistics in digital slang.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề How Language Evolves. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực digital slang."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'lexical borrowing' — a critical mechanism shaping how digital slang works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'lexical borrowing' — một cơ chế then chốt định hình cách digital slang vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_21",
    "sourceType": "active",
    "title": "BBC Active #21: Cognitive Power of Bilingualism",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'executive function' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Cognitive Power of Bilingualism",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Cognitive Power of Bilingualism and focus on 'executive function'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Cognitive Power of Bilingualism'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative cognitive variables concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "The role of executive function in understanding brain reserve"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative cognitive variables without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "B",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'executive function' đối với chủ đề brain reserve."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'executive function' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              }
            ],
            "correct": "C",
            "explanation": "Thuật ngữ 'executive function' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "How to spell 'encyclopedia', concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "The capital city of Australia, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "A surprising statistical question about global trends"
              }
            ],
            "correct": "C",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Science cannot explain anything, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "Stop learning English immediately, which remains subject to further departmental verification"
              },
              {
                "key": "C",
                "text": "Awareness and small evidence-based changes make a real difference"
              }
            ],
            "correct": "C",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Cognitive Power of Bilingualism. First, let's start with a quick quiz about global statistics in brain reserve.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Cognitive Power of Bilingualism. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực brain reserve."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'executive function' — a critical mechanism shaping how brain reserve works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'executive function' — một cơ chế then chốt định hình cách brain reserve vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_22",
    "sourceType": "active",
    "title": "BBC Active #22: Psychology of Decision Fatigue",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'mental depletion' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Psychology of Decision Fatigue",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Psychology of Decision Fatigue and focus on 'mental depletion'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Psychology of Decision Fatigue'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative psychology variables despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "The role of mental depletion in understanding daily choices"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative psychology variables according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'mental depletion' đối với chủ đề daily choices."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'mental depletion' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "As an obsolete grammar rule, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "A",
            "explanation": "Thuật ngữ 'mental depletion' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "The capital city of Australia, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "How to spell 'encyclopedia', based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "A surprising statistical question about global trends"
              }
            ],
            "correct": "C",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Stop learning English immediately, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "C",
                "text": "Science cannot explain anything, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "B",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Psychology of Decision Fatigue. First, let's start with a quick quiz about global statistics in daily choices.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Psychology of Decision Fatigue. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực daily choices."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'mental depletion' — a critical mechanism shaping how daily choices works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'mental depletion' — một cơ chế then chốt định hình cách daily choices vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_23",
    "sourceType": "active",
    "title": "BBC Active #23: Circadian Clocks in Cells",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'melatonin cycle' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Circadian Clocks in Cells",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Circadian Clocks in Cells and focus on 'melatonin cycle'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Circadian Clocks in Cells'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative circadian variables according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "Critical investigation into alternative circadian variables concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "The role of melatonin cycle in understanding biological rhythm"
              }
            ],
            "correct": "C",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'melatonin cycle' đối với chủ đề biological rhythm."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'melatonin cycle' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "B",
                "text": "As an obsolete grammar rule, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "As a type of tropical fruit, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "A",
            "explanation": "Thuật ngữ 'melatonin cycle' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "The capital city of Australia, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "How to spell 'encyclopedia', in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "A surprising statistical question about global trends"
              }
            ],
            "correct": "C",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "B",
                "text": "Science cannot explain anything, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Stop learning English immediately, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "A",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Circadian Clocks in Cells. First, let's start with a quick quiz about global statistics in biological rhythm.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Circadian Clocks in Cells. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực biological rhythm."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'melatonin cycle' — a critical mechanism shaping how biological rhythm works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'melatonin cycle' — một cơ chế then chốt định hình cách biological rhythm vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_24",
    "sourceType": "active",
    "title": "BBC Active #24: Global Shift to Renewables",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'battery storage' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: Global Shift to Renewables",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing Global Shift to Renewables and focus on 'battery storage'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'Global Shift to Renewables'?",
            "options": [
              {
                "key": "A",
                "text": "The role of battery storage in understanding solar power"
              },
              {
                "key": "B",
                "text": "Tips for repairing vintage automobiles"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative global variables following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "A",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'battery storage' đối với chủ đề solar power."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'battery storage' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "As a type of tropical fruit, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              }
            ],
            "correct": "C",
            "explanation": "Thuật ngữ 'battery storage' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "How to spell 'encyclopedia', under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "The capital city of Australia, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "A surprising statistical question about global trends"
              }
            ],
            "correct": "C",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Science cannot explain anything, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "C",
                "text": "Stop learning English immediately, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "B",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about Global Shift to Renewables. First, let's start with a quick quiz about global statistics in solar power.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề Global Shift to Renewables. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực solar power."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'battery storage' — a critical mechanism shaping how solar power works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'battery storage' — một cơ chế then chốt định hình cách solar power vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "bbc_active_25",
    "sourceType": "active",
    "title": "BBC Active #25: The Neuroscience of Empathy",
    "subtitle": "Active Listening (BBC 6 Minute English) • Chú trọng từ vựng 'mirror neurons' & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "6 Minute English: The Neuroscience of Empathy",
        "instruction": "Questions 1-4. Listen carefully to the BBC Learning English presenters discussing The Neuroscience of Empathy and focus on 'mirror neurons'.",
        "sourceUrl": "https://www.youtube.com/@bbclearningenglish",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the central topic explored by Neil and Georgina in 'The Neuroscience of Empathy'?",
            "options": [
              {
                "key": "A",
                "text": "Critical investigation into alternative the variables despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "The role of mirror neurons in understanding social bonding"
              },
              {
                "key": "C",
                "text": "Critical investigation into alternative the variables as demonstrated in multiple peer-reviewed observational studies"
              }
            ],
            "correct": "B",
            "explanation": "Hai biên tập viên BBC phân tích vai trò của 'mirror neurons' đối với chủ đề social bonding."
          },
          {
            "id": 2,
            "text": "2. How is the key vocabulary 'mirror neurons' explained in the episode?",
            "options": [
              {
                "key": "A",
                "text": "As an obsolete grammar rule, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "As a critical scientific or behavioral mechanism shaping modern outcomes"
              },
              {
                "key": "C",
                "text": "As a type of tropical fruit, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "B",
            "explanation": "Thuật ngữ 'mirror neurons' được giải thích là cơ chế khoa học/hành vi quan trọng tạo nên kết quả thực tiễn."
          },
          {
            "id": 3,
            "text": "3. What quiz question is asked at the beginning of the show?",
            "options": [
              {
                "key": "A",
                "text": "A surprising statistical question about global trends"
              },
              {
                "key": "B",
                "text": "The capital city of Australia, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "How to spell 'encyclopedia', despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "A",
            "explanation": "Đúng format BBC 6 Minute English, chương trình luôn mở đầu bằng một câu đố số liệu thú vị."
          },
          {
            "id": 4,
            "text": "4. What final takeaway do the presenters leave with listeners?",
            "options": [
              {
                "key": "A",
                "text": "Stop learning English immediately, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Awareness and small evidence-based changes make a real difference"
              },
              {
                "key": "C",
                "text": "Science cannot explain anything, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "B",
            "explanation": "Thông điệp cuối bài là nhận thức đúng và thay đổi nhỏ dựa trên bằng chứng khoa học sẽ tạo ra khác biệt lớn."
          }
        ],
        "transcript": [
          {
            "speaker": "Neil (BBC)",
            "en": "Hello and welcome to 6 Minute English! Today we are asking a fascinating question about The Neuroscience of Empathy. First, let's start with a quick quiz about global statistics in social bonding.",
            "vi": "Xin chào và chào mừng đến với 6 Minute English! Hôm nay chúng ta cùng khám phá chủ đề The Neuroscience of Empathy. Trước tiên hãy bắt đầu với một câu đố nhanh về số liệu toàn cầu trong lĩnh vực social bonding."
          },
          {
            "speaker": "Georgina (BBC)",
            "en": "Great question, Neil! Scientists have recently highlighted the importance of 'mirror neurons' — a critical mechanism shaping how social bonding works in real life.",
            "vi": "Câu hỏi hay đấy Neil! Các nhà khoa học gần đây nhấn mạnh tầm quan trọng của 'mirror neurons' — một cơ chế then chốt định hình cách social bonding vận hành ngoài đời thực."
          },
          {
            "speaker": "Neil (BBC)",
            "en": "And remember, building awareness and making small evidence-based changes really makes a difference. Thanks for listening and bye for now!",
            "vi": "Và hãy nhớ rằng, nâng cao nhận thức và tạo ra những thay đổi nhỏ dựa trên khoa học thực sự tạo nên khác biệt. Cảm ơn bạn đã lắng nghe và tạm biệt!"
          }
        ]
      }
    ]
  },
  {
    "id": "passive_listening_interviews_6",
    "sourceType": "passive",
    "title": "PASSIVE LISTENING: Native Interviews & Talk Shows (Cosmopolitan / Celebrity English)",
    "subtitle": "Nguồn: YouTube Interviews (Jennie Blind Date, Talk Shows) • Tắm ngôn ngữ tự nhiên & phản xạ đời sống",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Celebrity Interview Style — Dating, Daily Routine & Real Spoken English",
        "instruction": "Passive Listening: Relax and immerse yourself in natural conversational speed, linking sounds, and casual expressions. Answer questions 1-5 to check your natural comprehension.",
        "audioSrc": "",
        "sourceUrl": "https://www.youtube.com/results?search_query=jennie+interview+in+english+cosmopolitan",
        "questions": [
          {
            "id": 1,
            "options": [
              {
                "key": "A",
                "text": "She sends ten texts in a row every hour"
              },
              {
                "key": "B",
                "text": "She prefers not to double text unless it is urgent or a close friend"
              },
              {
                "key": "C",
                "text": "She never uses text messages at all"
              }
            ],
            "evidence": "In the interview, the guest laughs and explains she would rather wait for a reply than double text someone she just met.",
            "text": "1. What does the guest say about 'double texting'?",
            "correct": 1,
            "explanation": "Trong buổi phỏng vấn, khách mời chia sẻ cô ấy thích chờ tin nhắn hồi âm hơn là nhắn tin dồn dập (double text) với người mới quen."
          },
          {
            "id": 2,
            "options": [
              {
                "key": "A",
                "text": "A traffic signal"
              },
              {
                "key": "B",
                "text": "A warning sign of bad behavior or incompatibility"
              },
              {
                "key": "C",
                "text": "A favorite fashion color"
              }
            ],
            "evidence": "The host asks about dating 'red flags', meaning warning signs in a person's attitude or habits.",
            "text": "2. In casual spoken English, what does 'red flag' refer to?",
            "correct": 1,
            "explanation": "'Red flag' trong giao tiếp tự nhiên là dấu hiệu cảnh báo tính cách hoặc thói quen không tốt."
          },
          {
            "id": 3,
            "options": [
              {
                "key": "A",
                "text": "Checking social media 24/7"
              },
              {
                "key": "B",
                "text": "Spending quiet mornings with tea, stretching, and walking her dogs"
              },
              {
                "key": "C",
                "text": "Skipping meals before concerts"
              }
            ],
            "evidence": "She shares that quiet mornings, stretching, and taking her dogs for a walk help her reset.",
            "text": "3. What helps the guest stay grounded despite a busy global schedule?",
            "correct": 1,
            "explanation": "Cô ấy chia sẻ những buổi sáng yên tĩnh, giãn cơ và dắt chó đi dạo giúp cô ấy cân bằng lại."
          },
          {
            "id": 4,
            "options": [
              {
                "key": "A",
                "text": "I feel very sad about that"
              },
              {
                "key": "B",
                "text": "I'm completely ready / enthusiastic to do that"
              },
              {
                "key": "C",
                "text": "I strongly refuse to do that"
              }
            ],
            "evidence": "'I'm down for that' is a very common native spoken expression meaning 'I agree / I'd love to do that'.",
            "text": "4. What does the casual phrase 'I'm totally down for that' mean?",
            "correct": 1,
            "explanation": "'I'm totally down for that' là cách nói tự nhiên của người bản xứ, nghĩa là 'Tôi hoàn toàn hào hứng / đồng ý với việc đó'."
          },
          {
            "id": 5,
            "options": [
              {
                "key": "A",
                "text": "You absorb natural intonation, filler words, and relaxed rhythm effortlessly"
              },
              {
                "key": "B",
                "text": "Interviews only use ancient formal vocabulary"
              },
              {
                "key": "C",
                "text": "They have no emotional expression"
              }
            ],
            "answer": 0,
            "evidence": "Passive listening to interviews trains your ear to recognize natural rhythm, contractions, and real spoken fillers.",
            "text": "5. Why is watching English interviews great for Passive Listening?",
            "explanation": "Nghe thụ động qua các buổi phỏng vấn giúp tai quen với ngữ điệu tự nhiên, từ nối âm và nhịp điệu nói thực tế."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (Willa)",
            "en": "Welcome to Blind Date! Today we're chatting about life, music, and everyday habits. First question: would you ever double text someone?",
            "vi": "Chào mừng đến với Blind Date! Hôm nay chúng ta trò chuyện về cuộc sống, âm nhạc và thói quen hằng ngày. Câu hỏi đầu tiên: bạn có bao giờ nhắn tin hai lần liên tiếp cho ai đó không?"
          },
          {
            "speaker": "Guest",
            "en": "Honestly, probably not! If it's a close friend and I'm excited, sure. But if I just met someone, I'd rather chill and wait for their reply. Double texting feels like a bit too much pressure.",
            "vi": "Thật lòng thì chắc là không đâu! Nếu là bạn thân và tôi đang hào hứng thì có. Nhưng nếu mới quen ai đó, tôi thà thư giãn chờ họ trả lời. Nhắn dồn dập tạo cảm giác hơi áp lực."
          },
          {
            "speaker": "Host (Willa)",
            "en": "Totally fair! What's your biggest green flag and red flag when meeting new people?",
            "vi": "Hoàn toàn hợp lý! Đâu là điểm cộng (green flag) và dấu hiệu cảnh báo (red flag) lớn nhất khi bạn gặp người mới?"
          },
          {
            "speaker": "Guest",
            "en": "A huge green flag is someone who listens genuinely and has a good sense of humor. And for my own routine, when work gets crazy, I'm totally down for quiet mornings — just stretching, tea, and walking my dogs.",
            "vi": "Điểm cộng lớn là người biết lắng nghe chân thành và có khiếu hài hước. Còn về thói quen của tôi, khi công việc bận rộn, tôi rất thích những buổi sáng yên tĩnh — chỉ giãn cơ, uống trà và dắt cún đi dạo."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Native Talk Show & Everyday Slang (Natural Speed)",
        "instruction": "Passive Listening: Let the dialogue play naturally while focusing on overall meaning and relaxed native expressions.",
        "audioSrc": "",
        "sourceUrl": "https://www.youtube.com/results?search_query=english+talk+show+interview+with+subtitles",
        "questions": [
          {
            "id": 6,
            "options": [
              {
                "key": "A",
                "text": "To decide how to deal with a situation as it develops rather than planning ahead"
              },
              {
                "key": "B",
                "text": "To listen to loud music with headphones"
              },
              {
                "key": "C",
                "text": "To practice playing the violin"
              }
            ],
            "answer": 0,
            "evidence": "Mark says they won't book strict tours; instead, they'll 'play it by ear' depending on the weather.",
            "text": "6. What does 'play it by ear' mean in the conversation?",
            "explanation": "'Play it by ear' nghĩa là tùy cơ ứng biến, không lên kế hoạch cứng nhắc trước."
          },
          {
            "id": 7,
            "options": [
              {
                "key": "A",
                "text": "Everything is walkable and people greet each other warmly"
              },
              {
                "key": "B",
                "text": "Rent doubled immediately"
              },
              {
                "key": "C",
                "text": "There are no cafes nearby"
              }
            ],
            "answer": 0,
            "evidence": "Elena loves that she can walk everywhere and chat with friendly neighbors.",
            "text": "7. Why did Elena feel relieved after moving to a smaller neighborhood?",
            "explanation": "Elena thích vì mọi thứ đều đi bộ được và hàng xóm thân thiện."
          },
          {
            "id": 8,
            "options": [
              {
                "key": "A",
                "text": "To stop working for the rest of the day"
              },
              {
                "key": "B",
                "text": "To wake up at 5 AM"
              },
              {
                "key": "C",
                "text": "To phone someone every morning"
              }
            ],
            "answer": 0,
            "evidence": "After filming for six hours, the crew decided to 'call it a day'.",
            "text": "8. What does 'call it a day' mean?",
            "explanation": "'Call it a day' nghĩa là kết thúc công việc trong ngày để nghỉ ngơi."
          },
          {
            "id": 9,
            "options": [
              {
                "key": "A",
                "text": "Listening passively while commuting or cooking dinner"
              },
              {
                "key": "B",
                "text": "Translating every single syllable with a dictionary"
              },
              {
                "key": "C",
                "text": "Only listening for 10 seconds a week"
              }
            ],
            "answer": 0,
            "evidence": "Mark listens to native podcasts while on the train or cooking.",
            "text": "9. How does Mark describe his favorite podcast habit?",
            "explanation": "Mark nghe podcast thụ động khi đi tàu hoặc nấu ăn tối."
          },
          {
            "id": 10,
            "options": [
              {
                "key": "A",
                "text": "Active builds precision and vocabulary; Passive builds natural speed and comfort"
              },
              {
                "key": "B",
                "text": "They cancel each other out"
              },
              {
                "key": "C",
                "text": "You forget your native language"
              }
            ],
            "answer": 0,
            "evidence": "Combining active study with passive immersion develops both accuracy and effortless comprehension.",
            "text": "10. What happens when you combine Active and Passive Listening?",
            "explanation": "Kết hợp Nghe Chủ Động (tăng độ chính xác & từ vựng) với Nghe Thụ Động (tăng phản xạ tốc độ & sự tự nhiên) mang lại hiệu quả tối ưu."
          }
        ],
        "transcript": [
          {
            "speaker": "Mark",
            "en": "So Elena, do you have strict plans for the weekend trip, or are we just going to play it by ear?",
            "vi": "Vậy Elena, cậu có kế hoạch cứng nhắc nào cho chuyến đi cuối tuần không, hay chúng ta cứ tùy cơ ứng biến (play it by ear)?"
          },
          {
            "speaker": "Elena",
            "en": "Definitely play it by ear! Honestly, ever since I moved to a quieter neighborhood where everything is walkable, I love just taking things slow. After six hours of filming yesterday, we just decided to call it a day and grab dinner.",
            "vi": "Chắc chắn là tùy cơ ứng biến rồi! Thật lòng từ khi chuyển đến khu phố yên tĩnh nơi mọi thứ đều đi bộ được, tớ thích sống chậm lại. Sau sáu tiếng quay hình hôm qua, cả nhóm quyết định nghỉ tay (call it a day) và đi ăn tối."
          },
          {
            "speaker": "Mark",
            "en": "That's the best vibe. Also, while I'm cooking or commuting, I keep English talk shows playing in the background — passive listening really trains your ear without feeling like homework!",
            "vi": "Không khí đó tuyệt nhất đấy. Ngoài ra lúc nấu ăn hay đi lại, tớ hay mở các talk show tiếng Anh chạy nền — nghe thụ động thực sự rèn tai rất tốt mà không có cảm giác nặng nề như làm bài tập!"
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_2",
    "sourceType": "passive",
    "title": "Passive Talk #2: Emma Watson — Vogue 73 Questions",
    "subtitle": "Passive Listening (Vogue) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Emma Watson — Vogue 73 Questions",
        "instruction": "Questions 1-3. Listen naturally to the Vogue conversation focusing on reading habits & film sets. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They never prepare before walking on set, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "With consistent passion, curiosity, and attention to reading habits & film sets"
              },
              {
                "key": "C",
                "text": "They dislike collaborating with other artists, which remains subject to further departmental verification"
              }
            ],
            "correct": "B",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào reading habits & film sets."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "B",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "C",
                "text": "A formal legal warning, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "A",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Hostile and argumentative"
              },
              {
                "key": "B",
                "text": "Robotic and monotone"
              },
              {
                "key": "C",
                "text": "Warm, candid, and engaging"
              }
            ],
            "correct": "C",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (Vogue)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to reading habits & film sets. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với reading habits & film sets. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to reading habits & film sets keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào reading habits & film sets giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_3",
    "sourceType": "passive",
    "title": "Passive Talk #3: Pedro Pascal — Hot Ones Spicy Interview",
    "subtitle": "Passive Listening (First We Feast) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Pedro Pascal — Hot Ones Spicy Interview",
        "instruction": "Questions 1-3. Listen naturally to the First We Feast conversation focusing on handling career pressure. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They dislike collaborating with other artists, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "With consistent passion, curiosity, and attention to handling career pressure"
              },
              {
                "key": "C",
                "text": "They never prepare before walking on set, primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "B",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào handling career pressure."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "B",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "C",
                "text": "A formal legal warning, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Robotic and monotone"
              },
              {
                "key": "B",
                "text": "Hostile and argumentative"
              },
              {
                "key": "C",
                "text": "Warm, candid, and engaging"
              }
            ],
            "correct": "C",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (First We Feast)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to handling career pressure. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với handling career pressure. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to handling career pressure keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào handling career pressure giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_4",
    "sourceType": "passive",
    "title": "Passive Talk #4: Christopher Nolan — Wired Physics Q&A",
    "subtitle": "Passive Listening (WIRED) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Christopher Nolan — Wired Physics Q&A",
        "instruction": "Questions 1-3. Listen naturally to the WIRED conversation focusing on time dilation in cinema. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They never prepare before walking on set, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "They dislike collaborating with other artists, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "With consistent passion, curiosity, and attention to time dilation in cinema"
              }
            ],
            "correct": "C",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào time dilation in cinema."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "B",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "C",
                "text": "A formal legal warning, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "A",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Hostile and argumentative"
              },
              {
                "key": "B",
                "text": "Robotic and monotone"
              },
              {
                "key": "C",
                "text": "Warm, candid, and engaging"
              }
            ],
            "correct": "C",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (WIRED)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to time dilation in cinema. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với time dilation in cinema. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to time dilation in cinema keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào time dilation in cinema giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_5",
    "sourceType": "passive",
    "title": "Passive Talk #5: Keanu Reeves — On Film Craft & Humility",
    "subtitle": "Passive Listening (The Late Show) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Keanu Reeves — On Film Craft & Humility",
        "instruction": "Questions 1-3. Listen naturally to the The Late Show conversation focusing on stunt choreography. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "With consistent passion, curiosity, and attention to stunt choreography"
              },
              {
                "key": "B",
                "text": "They never prepare before walking on set, which remains subject to further departmental verification"
              },
              {
                "key": "C",
                "text": "They dislike collaborating with other artists, which remains subject to further departmental verification"
              }
            ],
            "correct": "A",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào stunt choreography."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "A formal legal warning, according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "C",
                "text": "Physical exhaustion after running"
              }
            ],
            "correct": "B",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Hostile and argumentative"
              },
              {
                "key": "B",
                "text": "Robotic and monotone"
              },
              {
                "key": "C",
                "text": "Warm, candid, and engaging"
              }
            ],
            "correct": "C",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (The Late Show)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to stunt choreography. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với stunt choreography. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to stunt choreography keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào stunt choreography giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_6",
    "sourceType": "passive",
    "title": "Passive Talk #6: Anne Hathaway — Vocal Coaching Secrets",
    "subtitle": "Passive Listening (Vanity Fair) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Anne Hathaway — Vocal Coaching Secrets",
        "instruction": "Questions 1-3. Listen naturally to the Vanity Fair conversation focusing on musical theatre discipline. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "With consistent passion, curiosity, and attention to musical theatre discipline"
              },
              {
                "key": "B",
                "text": "They dislike collaborating with other artists, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "They never prepare before walking on set, which remains subject to further departmental verification"
              }
            ],
            "correct": "A",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào musical theatre discipline."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "B",
                "text": "A formal legal warning, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "Physical exhaustion after running"
              }
            ],
            "correct": "A",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Robotic and monotone"
              },
              {
                "key": "B",
                "text": "Hostile and argumentative"
              },
              {
                "key": "C",
                "text": "Warm, candid, and engaging"
              }
            ],
            "correct": "C",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (Vanity Fair)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to musical theatre discipline. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với musical theatre discipline. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to musical theatre discipline keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào musical theatre discipline giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_7",
    "sourceType": "passive",
    "title": "Passive Talk #7: Cillian Murphy — Character Immersion",
    "subtitle": "Passive Listening (Actors on Actors) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Cillian Murphy — Character Immersion",
        "instruction": "Questions 1-3. Listen naturally to the Actors on Actors conversation focusing on quiet preparation routines. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "With consistent passion, curiosity, and attention to quiet preparation routines"
              },
              {
                "key": "B",
                "text": "They never prepare before walking on set, in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "They dislike collaborating with other artists, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào quiet preparation routines."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "A formal legal warning, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "C",
                "text": "Physical exhaustion after running"
              }
            ],
            "correct": "B",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Hostile and argumentative"
              },
              {
                "key": "B",
                "text": "Warm, candid, and engaging"
              },
              {
                "key": "C",
                "text": "Robotic and monotone"
              }
            ],
            "correct": "B",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (Actors on Actors)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to quiet preparation routines. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với quiet preparation routines. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to quiet preparation routines keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào quiet preparation routines giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_8",
    "sourceType": "passive",
    "title": "Passive Talk #8: Zendaya — Fashion & Creative Ambition",
    "subtitle": "Passive Listening (Harper's Bazaar) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Zendaya — Fashion & Creative Ambition",
        "instruction": "Questions 1-3. Listen naturally to the Harper's Bazaar conversation focusing on designing red carpet looks. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "With consistent passion, curiosity, and attention to designing red carpet looks"
              },
              {
                "key": "B",
                "text": "They dislike collaborating with other artists, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "They never prepare before walking on set, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "A",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào designing red carpet looks."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "B",
                "text": "A formal legal warning, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "Physical exhaustion after running"
              }
            ],
            "correct": "A",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Hostile and argumentative"
              },
              {
                "key": "B",
                "text": "Warm, candid, and engaging"
              },
              {
                "key": "C",
                "text": "Robotic and monotone"
              }
            ],
            "correct": "B",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (Harper's Bazaar)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to designing red carpet looks. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với designing red carpet looks. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to designing red carpet looks keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào designing red carpet looks giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_9",
    "sourceType": "passive",
    "title": "Passive Talk #9: Ryan Reynolds — Comedy Improvisation",
    "subtitle": "Passive Listening (The Tonight Show) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Ryan Reynolds — Comedy Improvisation",
        "instruction": "Questions 1-3. Listen naturally to the The Tonight Show conversation focusing on quick-witted banter. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They dislike collaborating with other artists, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "They never prepare before walking on set, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "With consistent passion, curiosity, and attention to quick-witted banter"
              }
            ],
            "correct": "C",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào quick-witted banter."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "A formal legal warning, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "C",
                "text": "Physical exhaustion after running"
              }
            ],
            "correct": "B",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Warm, candid, and engaging"
              },
              {
                "key": "B",
                "text": "Hostile and argumentative"
              },
              {
                "key": "C",
                "text": "Robotic and monotone"
              }
            ],
            "correct": "A",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (The Tonight Show)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to quick-witted banter. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với quick-witted banter. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to quick-witted banter keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào quick-witted banter giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_10",
    "sourceType": "passive",
    "title": "Passive Talk #10: Billie Eilish — Songwriting at Home",
    "subtitle": "Passive Listening (Rolling Stone) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Billie Eilish — Songwriting at Home",
        "instruction": "Questions 1-3. Listen naturally to the Rolling Stone conversation focusing on minimalist studio production. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "With consistent passion, curiosity, and attention to minimalist studio production"
              },
              {
                "key": "B",
                "text": "They never prepare before walking on set, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "They dislike collaborating with other artists, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "A",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào minimalist studio production."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "B",
                "text": "A formal legal warning, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "Physical exhaustion after running"
              }
            ],
            "correct": "A",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Hostile and argumentative"
              },
              {
                "key": "B",
                "text": "Warm, candid, and engaging"
              },
              {
                "key": "C",
                "text": "Robotic and monotone"
              }
            ],
            "correct": "B",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (Rolling Stone)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to minimalist studio production. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với minimalist studio production. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to minimalist studio production keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào minimalist studio production giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_11",
    "sourceType": "passive",
    "title": "Passive Talk #11: Margot Robbie — Producing Independent Films",
    "subtitle": "Passive Listening (Variety) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Margot Robbie — Producing Independent Films",
        "instruction": "Questions 1-3. Listen naturally to the Variety conversation focusing on pitching bold scripts. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "With consistent passion, curiosity, and attention to pitching bold scripts"
              },
              {
                "key": "B",
                "text": "They dislike collaborating with other artists, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "They never prepare before walking on set, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "A",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào pitching bold scripts."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "A formal legal warning, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "C",
                "text": "Genuine emphasis and candid personal reflection"
              }
            ],
            "correct": "C",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Robotic and monotone"
              },
              {
                "key": "B",
                "text": "Warm, candid, and engaging"
              },
              {
                "key": "C",
                "text": "Hostile and argumentative"
              }
            ],
            "correct": "B",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (Variety)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to pitching bold scripts. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với pitching bold scripts. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to pitching bold scripts keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào pitching bold scripts giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_12",
    "sourceType": "passive",
    "title": "Passive Talk #12: Robert Downey Jr. — Reinventing a Career",
    "subtitle": "Passive Listening (SmartLess Podcast) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Robert Downey Jr. — Reinventing a Career",
        "instruction": "Questions 1-3. Listen naturally to the SmartLess Podcast conversation focusing on resilience and humor. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They dislike collaborating with other artists, according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "They never prepare before walking on set, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "With consistent passion, curiosity, and attention to resilience and humor"
              }
            ],
            "correct": "C",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào resilience and humor."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "B",
                "text": "A formal legal warning, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "Genuine emphasis and candid personal reflection"
              }
            ],
            "correct": "C",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Warm, candid, and engaging"
              },
              {
                "key": "B",
                "text": "Robotic and monotone"
              },
              {
                "key": "C",
                "text": "Hostile and argumentative"
              }
            ],
            "correct": "A",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (SmartLess Podcast)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to resilience and humor. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với resilience and humor. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to resilience and humor keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào resilience and humor giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_13",
    "sourceType": "passive",
    "title": "Passive Talk #13: Tom Holland — Acrobatic Stunt Training",
    "subtitle": "Passive Listening (GQ) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Tom Holland — Acrobatic Stunt Training",
        "instruction": "Questions 1-3. Listen naturally to the GQ conversation focusing on gymnastics background. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "With consistent passion, curiosity, and attention to gymnastics background"
              },
              {
                "key": "B",
                "text": "They never prepare before walking on set, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "They dislike collaborating with other artists, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "A",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào gymnastics background."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "A formal legal warning, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "C",
                "text": "Genuine emphasis and candid personal reflection"
              }
            ],
            "correct": "C",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Robotic and monotone"
              },
              {
                "key": "B",
                "text": "Warm, candid, and engaging"
              },
              {
                "key": "C",
                "text": "Hostile and argumentative"
              }
            ],
            "correct": "B",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (GQ)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to gymnastics background. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với gymnastics background. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to gymnastics background keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào gymnastics background giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_14",
    "sourceType": "passive",
    "title": "Passive Talk #14: Taylor Swift — Storytelling in Lyrics",
    "subtitle": "Passive Listening (NYU Commencement) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Taylor Swift — Storytelling in Lyrics",
        "instruction": "Questions 1-3. Listen naturally to the NYU Commencement conversation focusing on metaphors and bridges. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "With consistent passion, curiosity, and attention to metaphors and bridges"
              },
              {
                "key": "B",
                "text": "They dislike collaborating with other artists, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "C",
                "text": "They never prepare before walking on set, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "A",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào metaphors and bridges."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "B",
                "text": "A formal legal warning, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "Genuine emphasis and candid personal reflection"
              }
            ],
            "correct": "C",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Warm, candid, and engaging"
              },
              {
                "key": "B",
                "text": "Robotic and monotone"
              },
              {
                "key": "C",
                "text": "Hostile and argumentative"
              }
            ],
            "correct": "A",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (NYU Commencement)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to metaphors and bridges. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với metaphors and bridges. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to metaphors and bridges keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào metaphors and bridges giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_15",
    "sourceType": "passive",
    "title": "Passive Talk #15: Timothée Chalamet — Independent Cinema",
    "subtitle": "Passive Listening (British GQ) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Timothée Chalamet — Independent Cinema",
        "instruction": "Questions 1-3. Listen naturally to the British GQ conversation focusing on working with visionary directors. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They never prepare before walking on set, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "They dislike collaborating with other artists, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "With consistent passion, curiosity, and attention to working with visionary directors"
              }
            ],
            "correct": "C",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào working with visionary directors."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "A formal legal warning, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "C",
                "text": "Genuine emphasis and candid personal reflection"
              }
            ],
            "correct": "C",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Warm, candid, and engaging"
              },
              {
                "key": "B",
                "text": "Robotic and monotone"
              },
              {
                "key": "C",
                "text": "Hostile and argumentative"
              }
            ],
            "correct": "A",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (British GQ)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to working with visionary directors. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với working with visionary directors. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to working with visionary directors keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào working with visionary directors giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_16",
    "sourceType": "passive",
    "title": "Passive Talk #16: Scarlett Johansson — Voice Acting Nuance",
    "subtitle": "Passive Listening (BBC Radio 1) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Scarlett Johansson — Voice Acting Nuance",
        "instruction": "Questions 1-3. Listen naturally to the BBC Radio 1 conversation focusing on conveying emotion solely by voice. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They never prepare before walking on set, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "B",
                "text": "With consistent passion, curiosity, and attention to conveying emotion solely by voice"
              },
              {
                "key": "C",
                "text": "They dislike collaborating with other artists, in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "B",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào conveying emotion solely by voice."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "B",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "C",
                "text": "A formal legal warning, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "B",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Hostile and argumentative"
              },
              {
                "key": "B",
                "text": "Robotic and monotone"
              },
              {
                "key": "C",
                "text": "Warm, candid, and engaging"
              }
            ],
            "correct": "C",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (BBC Radio 1)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to conveying emotion solely by voice. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với conveying emotion solely by voice. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to conveying emotion solely by voice keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào conveying emotion solely by voice giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_17",
    "sourceType": "passive",
    "title": "Passive Talk #17: David Attenborough — Protecting Wild Nature",
    "subtitle": "Passive Listening (BBC Earth) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: David Attenborough — Protecting Wild Nature",
        "instruction": "Questions 1-3. Listen naturally to the BBC Earth conversation focusing on biodiversity documentaries. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They dislike collaborating with other artists, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "With consistent passion, curiosity, and attention to biodiversity documentaries"
              },
              {
                "key": "C",
                "text": "They never prepare before walking on set, as demonstrated in multiple peer-reviewed observational studies"
              }
            ],
            "correct": "B",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào biodiversity documentaries."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "B",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "C",
                "text": "A formal legal warning, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "A",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Robotic and monotone"
              },
              {
                "key": "B",
                "text": "Hostile and argumentative"
              },
              {
                "key": "C",
                "text": "Warm, candid, and engaging"
              }
            ],
            "correct": "C",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (BBC Earth)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to biodiversity documentaries. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với biodiversity documentaries. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to biodiversity documentaries keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào biodiversity documentaries giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_18",
    "sourceType": "passive",
    "title": "Passive Talk #18: Michelle Obama — Life Lessons from Becoming",
    "subtitle": "Passive Listening (Oprah Winfrey Show) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Michelle Obama — Life Lessons from Becoming",
        "instruction": "Questions 1-3. Listen naturally to the Oprah Winfrey Show conversation focusing on mentorship and confidence. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They never prepare before walking on set, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "With consistent passion, curiosity, and attention to mentorship and confidence"
              },
              {
                "key": "C",
                "text": "They dislike collaborating with other artists, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào mentorship and confidence."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "B",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "C",
                "text": "A formal legal warning, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Robotic and monotone"
              },
              {
                "key": "B",
                "text": "Hostile and argumentative"
              },
              {
                "key": "C",
                "text": "Warm, candid, and engaging"
              }
            ],
            "correct": "C",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (Oprah Winfrey Show)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to mentorship and confidence. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với mentorship and confidence. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to mentorship and confidence keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào mentorship and confidence giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_19",
    "sourceType": "passive",
    "title": "Passive Talk #19: Hugh Jackman — Stage & Screen Discipline",
    "subtitle": "Passive Listening (Graham Norton Show) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Hugh Jackman — Stage & Screen Discipline",
        "instruction": "Questions 1-3. Listen naturally to the Graham Norton Show conversation focusing on daily vocal warmups. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They dislike collaborating with other artists, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "With consistent passion, curiosity, and attention to daily vocal warmups"
              },
              {
                "key": "C",
                "text": "They never prepare before walking on set, primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "B",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào daily vocal warmups."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "B",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "C",
                "text": "A formal legal warning, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Hostile and argumentative"
              },
              {
                "key": "B",
                "text": "Robotic and monotone"
              },
              {
                "key": "C",
                "text": "Warm, candid, and engaging"
              }
            ],
            "correct": "C",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (Graham Norton Show)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to daily vocal warmups. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với daily vocal warmups. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to daily vocal warmups keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào daily vocal warmups giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "passive_talk_20",
    "sourceType": "passive",
    "title": "Passive Talk #20: Emma Stone — Mastering Comedic Timing",
    "subtitle": "Passive Listening (W Magazine) • Ngữ điệu tự nhiên, nối âm & Idioms đời thực",
    "parts": [
      {
        "partNumber": 1,
        "title": "Interview Spotlight: Emma Stone — Mastering Comedic Timing",
        "instruction": "Questions 1-3. Listen naturally to the W Magazine conversation focusing on rehearsal spontaneity. Notice connected speech and relaxed phrasing.",
        "sourceUrl": "https://www.youtube.com/@TED",
        "questions": [
          {
            "id": 1,
            "text": "1. How does the guest describe their approach to their craft?",
            "options": [
              {
                "key": "A",
                "text": "They never prepare before walking on set, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "They dislike collaborating with other artists, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "With consistent passion, curiosity, and attention to rehearsal spontaneity"
              }
            ],
            "correct": "C",
            "explanation": "Khách mời chia sẻ về sự đam mê bền bỉ, tò mò học hỏi và chú trọng vào rehearsal spontaneity."
          },
          {
            "id": 2,
            "text": "2. What does the conversational phrase 'hands down' or 'to be completely honest' convey in this clip?",
            "options": [
              {
                "key": "A",
                "text": "Physical exhaustion after running"
              },
              {
                "key": "B",
                "text": "Genuine emphasis and candid personal reflection"
              },
              {
                "key": "C",
                "text": "A formal legal warning, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Trong giao tiếp tự nhiên, các cụm từ này thể hiện sự nhấn mạnh chân thành và cởi mở."
          },
          {
            "id": 3,
            "text": "3. What tone characterizes this interview?",
            "options": [
              {
                "key": "A",
                "text": "Robotic and monotone"
              },
              {
                "key": "B",
                "text": "Hostile and argumentative"
              },
              {
                "key": "C",
                "text": "Warm, candid, and engaging"
              }
            ],
            "correct": "C",
            "explanation": "Cuộc trò chuyện mang sắc thái ấm áp, thẳng thắn và cuốn hút đặc trưng của talk show."
          }
        ],
        "transcript": [
          {
            "speaker": "Host (W Magazine)",
            "en": "Welcome to the show! Everyone has been asking about your process when it comes to rehearsal spontaneity. How do you keep things fresh?",
            "vi": "Chào mừng đến với chương trình! Mọi người đều tò mò về quy trình của bạn đối với rehearsal spontaneity. Bạn giữ sự mới mẻ bằng cách nào?"
          },
          {
            "speaker": "Guest",
            "en": "To be completely honest, it's hands down my favorite part of the job. Staying curious and paying close attention to rehearsal spontaneity keeps me grounded and excited every single day.",
            "vi": "Thành thật mà nói, đó chắc chắn là phần tôi thích nhất trong công việc. Việc luôn giữ sự tò mò và chú tâm vào rehearsal spontaneity giúp tôi giữ được sự vững vàng và hào hứng mỗi ngày."
          }
        ]
      }
    ]
  },
  {
    "id": "test_1",
    "title": "ĐỀ SỐ 1: Listening HP3 (Đề Thi Gốc - Học Viện Kỹ Thuật & Công Nghệ An Ninh)",
    "subtitle": "20 Câu hỏi • Thời lượng: 15 Phút • Audio Player tua ±5s • Bản đồ Map Labeling & Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Phỏng Vấn Andrea (U16 Ice Hockey)",
        "instruction": "Questions 1-5. Choose the correct letter, A, B or C. (2.5 points)\nYou will hear an interview with a 15-year-old girl called Andrea, who plays ice hockey for her National Under-16s Team.",
        "audioSrc": "./audio/part1_andrea_ice_hockey.mp3",
        "questions": [
          {
            "id": 1,
            "text": "1. Which sport does Andrea say she started playing first?",
            "options": [
              {
                "key": "A",
                "text": "basketball"
              },
              {
                "key": "B",
                "text": "ice hockey"
              },
              {
                "key": "C",
                "text": "football"
              }
            ],
            "correct": "A",
            "explanation": "Andrea nói: 'I've always loved sport though, and have played basketball since I was five or six. I gave that up for a while when I got into football about five years ago... ice hockey not until about three years ago'. Môn đầu tiên cô ấy chơi là bóng rổ (basketball lúc 5-6 tuổi)."
          },
          {
            "id": 2,
            "text": "2. Andrea says that she first started playing ice hockey after",
            "options": [
              {
                "key": "A",
                "text": "seeing a game on television."
              },
              {
                "key": "B",
                "text": "watching a family member play."
              },
              {
                "key": "C",
                "text": "talking about it with her friends."
              }
            ],
            "correct": "A",
            "explanation": "Andrea chia sẻ: 'My brother's into it, and I used to go to his games. His team wasn't very good though, so I didn't think of it as something I actually wanted to do. That moment came when there was a professional match on a sports program I was watching. I knew then I wanted to try it'."
          },
          {
            "id": 3,
            "text": "3. Why does Andrea think that playing against boys is important?",
            "options": [
              {
                "key": "A",
                "text": "It improves her own playing skills."
              },
              {
                "key": "B",
                "text": "It increases respect for female players."
              },
              {
                "key": "C",
                "text": "It proves there are many girls playing the sport."
              }
            ],
            "correct": "A",
            "explanation": "Andrea khẳng định: 'I want to do better against boys somehow, I'm not sure why, which really helps to develop my talents' (giúp tôi phát triển tài năng và kỹ năng chơi của mình)."
          },
          {
            "id": 4,
            "text": "4. How did Andrea feel when she was chosen for the national under-16s team?",
            "options": [
              {
                "key": "A",
                "text": "surprised to be asked"
              },
              {
                "key": "B",
                "text": "sorry to leave her club"
              },
              {
                "key": "C",
                "text": "confident in her abilities"
              }
            ],
            "correct": "C",
            "explanation": "Andrea nói: 'I'd been really happy with how I'd been playing for my club, and felt I could do just as well at a higher level. There'd been a lot of talk about me being picked, so I kind of knew it was coming' (tự tin mình sẽ chơi tốt tương tự ở cấp độ cao hơn)."
          },
          {
            "id": 5,
            "text": "5. Andrea’s favourite games are those which are",
            "options": [
              {
                "key": "A",
                "text": "easy to win."
              },
              {
                "key": "B",
                "text": "shown on TV."
              },
              {
                "key": "C",
                "text": "exciting to watch."
              }
            ],
            "correct": "C",
            "explanation": "Andrea giải thích: 'If a game's close because both teams are good, then it's fantastic for the crowd to see, and better to play in because of that. It's far more interesting than scoring loads of goals...' (trận đấu giằng co sát nút thì khán giả xem vô cùng mãn nhãn, hấp dẫn hơn nhiều)."
          }
        ],
        "transcript": [
          {
            "speaker": "Interviewer",
            "en": "Welcome Andrea. You're an expert ice hockey player now, but when did you start playing?",
            "vi": "Chào mừng Andrea. Hiện bạn đã là một vận động viên khúc côn cầu trên băng cừ khôi, nhưng bạn bắt đầu chơi từ khi nào?"
          },
          {
            "speaker": "Andrea",
            "en": "Not until about three years ago, actually, so quite recently. I've come a long way quite quickly. I've always loved sport though, and have played basketball since I was five or six. I gave that up for a while when I got into football about five years ago, but started playing again once I'd lost interest in football.",
            "vi": "Thực ra mới khoảng 3 năm trước thôi, khá là gần đây. Tôi đã tiến bộ rất nhanh. Dù vậy tôi luôn yêu thể thao và đã chơi bóng rổ từ khi mới 5, 6 tuổi. Tôi tạm nghỉ chơi một thời gian khi chuyển sang đá bóng khoảng 5 năm trước, nhưng đã bắt đầu chơi lại sau khi mất hứng thú với bóng đá."
          },
          {
            "speaker": "Interviewer",
            "en": "How did you first become interested in playing ice hockey?",
            "vi": "Làm thế nào mà lần đầu tiên bạn thấy hứng thú với việc chơi khúc côn cầu trên băng?"
          },
          {
            "speaker": "Andrea",
            "en": "My brother's into it, and I used to go to his games. His team wasn't very good though, so I didn't think of it as something I actually wanted to do. That moment came when there was a professional match on a sports program I was watching. I knew then I wanted to try it, and fortunately, a couple of friends did too, so we all started playing together.",
            "vi": "Anh trai tôi rất mê môn này và tôi thường đến xem các trận đấu của anh ấy. Nhưng đội của anh ấy không giỏi lắm, nên lúc đó tôi chưa nghĩ đây là môn mình thực sự muốn chơi. Khoảnh khắc quyết định đến khi có một trận đấu chuyên nghiệp trên chương trình thể thao tôi đang xem. Lúc đó tôi biết mình muốn thử sức, và may mắn thay một vài người bạn cũng vậy, thế là chúng tôi bắt đầu chơi cùng nhau."
          },
          {
            "speaker": "Interviewer",
            "en": "You sometimes play against boys' teams. How important is that?",
            "vi": "Bạn thỉnh thoảng có thi đấu với các đội nam. Điều đó quan trọng như thế nào?"
          },
          {
            "speaker": "Andrea",
            "en": "Very. There are as many girls playing ice hockey now as there are boys, which is great. Attitudes towards us have always been positive in my experience. I want to do better against boys somehow, I'm not sure why, which really helps to develop my talents.",
            "vi": "Rất quan trọng. Hiện nay số lượng bạn nữ chơi khúc côn cầu trên băng cũng nhiều như các bạn nam, điều đó thật tuyệt. Theo trải nghiệm của tôi thì thái độ đối với chúng tôi luôn rất tích cực. Tôi luôn muốn thể hiện tốt hơn khi đối đầu với các bạn nam, tôi cũng không rõ tại sao, nhưng điều này thực sự giúp phát triển tài năng của tôi."
          },
          {
            "speaker": "Interviewer",
            "en": "How did you feel when you were chosen for the national under-16s team?",
            "vi": "Bạn cảm thấy thế nào khi được chọn vào đội tuyển U16 quốc gia?"
          },
          {
            "speaker": "Andrea",
            "en": "I'd been really happy with how I'd been playing for my club, and felt I could do just as well at a higher level. There'd been a lot of talk about me being picked, so I kind of knew it was coming. It was great for my parents, too. They felt great having a daughter in the national team.",
            "vi": "Tôi đã rất hài lòng với phong độ của mình ở câu lạc bộ, và cảm thấy mình có thể thi đấu tốt tương tự ở một cấp độ cao hơn. Đã có rất nhiều người bàn tán về việc tôi được chọn, nên tôi cũng phần nào đoán trước được. Điều này cũng thật tuyệt vời đối với bố mẹ tôi. Họ rất tự hào khi có con gái góp mặt trong đội tuyển quốc gia."
          },
          {
            "speaker": "Interviewer",
            "en": "Are the national team matches your favourite games?",
            "vi": "Các trận đấu ở đội tuyển quốc gia có phải là những trận đấu yêu thích nhất của bạn không?"
          },
          {
            "speaker": "Andrea",
            "en": "Not always, even though some of them are big games, and appear on national television. If a game's close because both teams are good, then it's fantastic for the crowd to see, and better to play in because of that. It's far more interesting than scoring loads of goals because we're so much better than the other team.",
            "vi": "Không hẳn lúc nào cũng vậy, mặc dù một số trận là trận cầu lớn và được phát sóng trên truyền hình quốc gia. Nếu một trận đấu giằng co sát sao vì cả hai đội đều giỏi, thì khán giả xem sẽ vô cùng mãn nhãn, và được thi đấu trong bầu không khí đó cũng thích hơn nhiều. Nó thú vị hơn việc ghi hàng loạt bàn thắng chỉ vì chúng tôi vượt trội hơn hẳn đội kia."
          },
          {
            "speaker": "Interviewer",
            "en": "Any advice for people wanting to start playing ice hockey?",
            "vi": "Bạn có lời khuyên nào cho những ai muốn bắt đầu chơi khúc côn cầu trên băng không?"
          },
          {
            "speaker": "Andrea",
            "en": "You can spend hours reading books about what you can and can't do, but there's no better way of becoming good than playing. So borrow some skates and a stick if you need to. You can buy your own later, and join a team so you can start playing straight away.",
            "vi": "Bạn có thể dành hàng giờ đọc sách về những điều được và không được làm, nhưng không có cách nào giỏi hơn là hãy thực sự chơi. Vì vậy hãy mượn giày trượt và một cây gậy nếu cần. Bạn có thể tự mua sau, và hãy gia nhập một đội để có thể bắt đầu thi đấu ngay lập tức."
          },
          {
            "speaker": "Interviewer",
            "en": "Thank you Andrea.",
            "vi": "Cảm ơn bạn Andrea."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Phỏng Vấn John Benton (25km Race)",
        "instruction": "Questions 6-10. Choose the correct letter, A, B or C. (2.5 points)\nYou will hear an interview with a student called John Benton, who’s just completed a 25-kilometre running race.",
        "audioSrc": "./audio/part2_john_benton_race.mp3",
        "questions": [
          {
            "id": 6,
            "text": "6. Why did John decide to enter the race?",
            "options": [
              {
                "key": "A",
                "text": "He wanted to prove his friends wrong."
              },
              {
                "key": "B",
                "text": "He was encouraged by his father to take part."
              },
              {
                "key": "C",
                "text": "He was inspired by a celebrity’s achievements."
              }
            ],
            "correct": "A",
            "explanation": "John chia sẻ: 'what finally made me get my running shoes out was my mates' attitude. They reckoned I was far too lazy to complete any race at all, so I was determined to show them I could do it' (đám bạn nghĩ anh quá lười, anh muốn chứng minh họ đã sai)."
          },
          {
            "id": 7,
            "text": "7. One feature of John’s training before the event was to",
            "options": [
              {
                "key": "A",
                "text": "get some rest between training sessions."
              },
              {
                "key": "B",
                "text": "set targets that he felt were realistic."
              },
              {
                "key": "C",
                "text": "leave himself enough time to build up his fitness."
              }
            ],
            "correct": "B",
            "explanation": "John nói: 'First of all, I drew up a 12-week training plan, and built in goals I thought would be manageable' (manageable = realistic, các mục tiêu thực tế vừa sức)."
          },
          {
            "id": 8,
            "text": "8. John says that once he started training, he had difficulties",
            "options": [
              {
                "key": "A",
                "text": "making himself run in cold weather before school."
              },
              {
                "key": "B",
                "text": "finding time for leisure activities after school."
              },
              {
                "key": "C",
                "text": "fitting it in around his usual school schedule."
              }
            ],
            "correct": "C",
            "explanation": "John nói: 'Getting back home again in time for the school bus caused problems though, and when I got home from school after 4pm, it was really too dark to run' (sắp xếp lịch chạy khớp với giờ xe buýt và lịch học trường)."
          },
          {
            "id": 9,
            "text": "9. What does John say about his diet before the race?",
            "options": [
              {
                "key": "A",
                "text": "decided not to follow a very strict diet."
              },
              {
                "key": "B",
                "text": "was unwilling to give up his favourite foods."
              },
              {
                "key": "C",
                "text": "left it almost too late to adopt a suitable diet."
              }
            ],
            "correct": "A",
            "explanation": "John nói: 'Some runners do things like eat high-protein, high-carbohydrate diets, but I just tried to eat what I usually do, pretty healthily, apart from chocolate and chips...' (không theo chế độ ăn quá nghiêm ngặt, chỉ ăn lành mạnh bình thường)."
          },
          {
            "id": 10,
            "text": "10. What particularly encouraged John on the day of the race?",
            "options": [
              {
                "key": "A",
                "text": "Some people in the crowd were there to support him personally."
              },
              {
                "key": "B",
                "text": "People he’d never met before were wishing him well."
              },
              {
                "key": "C",
                "text": "The atmosphere was much more positive than he’d expected."
              }
            ],
            "correct": "A",
            "explanation": "John kể: 'I actually spotted my mates holding up a sign with my name on. That really made me determined to finish the race' (bạn bè đứng trong đám đông cầm bảng cổ vũ tên riêng của anh ấy)."
          }
        ],
        "transcript": [
          {
            "speaker": "Interviewer",
            "en": "Today I'm with John Benton, who's just taken part in a 25-kilometre running race. John, you'd never run that distance before. What made you decide to enter the race?",
            "vi": "Hôm nay tôi có mặt cùng John Benton, người vừa tham gia cuộc chạy đua cự ly 25 km. John, bạn chưa từng chạy cự ly đó bao giờ. Điều gì khiến bạn quyết định tham gia cuộc đua?"
          },
          {
            "speaker": "John",
            "en": "Well, a few famous people had recently taken up running. One in particular ran twice the distance I did. That really impressed me. But what finally made me get my running shoes out was my mates' attitude. They reckoned I was far too lazy to complete any race at all, so I was determined to show them I could do it. Anyway, my dad's a keen runner, and once I decided to enter, he came along during my training runs as my running buddy, which was great.",
            "vi": "Vâng, gần đây có một vài người nổi tiếng bắt đầu tập chạy. Đặc biệt có một người chạy gấp đôi cự ly của tôi. Điều đó thực sự gây ấn tượng với tôi. Nhưng điều cuối cùng thúc đẩy tôi xỏ giày chạy chính là thái độ của đám bạn. Họ cho rằng tôi quá lười để hoàn thành bất kỳ cuộc đua nào, vì vậy tôi quyết tâm chứng minh cho họ thấy tôi có thể làm được. Dù sao thì bố tôi cũng là người say mê chạy bộ, và khi tôi quyết định tham gia, ông đã chạy cùng tôi trong các buổi tập như một người bạn đồng hành, điều đó thật tuyệt."
          },
          {
            "speaker": "Interviewer",
            "en": "So how much training did you do beforehand?",
            "vi": "Vậy bạn đã tập luyện bao nhiêu trước đó?"
          },
          {
            "speaker": "John",
            "en": "Well, I was pretty organised. First of all, I drew up a 12-week training plan, and built in goals I thought would be manageable. Dad wondered if I was being over-ambitious time-wise, because I hadn't run for a while, but then I do play football, so I knew I was in reasonable shape. I was told I shouldn't push myself too hard without resting and recovering between training sessions, but I admit I didn't really listen to that advice.",
            "vi": "Tôi khá ngăn nắp và có kế hoạch. Trước hết, tôi lập một kế hoạch tập luyện 12 tuần và đặt ra các mục tiêu mà tôi nghĩ là vừa sức. Bố tự hỏi liệu tôi có quá tham vọng về mặt thời gian hay không vì đã lâu tôi không chạy, nhưng tôi có chơi bóng đá nên biết mình có thể lực tương đối ổn. Tôi được khuyên không nên ép bản thân quá sức mà không nghỉ ngơi hồi phục giữa các buổi tập, nhưng tôi thú nhận là mình không thực sự nghe theo lời khuyên đó."
          },
          {
            "speaker": "Interviewer",
            "en": "I imagine the training was tough. Were there any problems?",
            "vi": "Tôi hình dung việc tập luyện rất vất vả. Có vấn đề gì phát sinh không?"
          },
          {
            "speaker": "John",
            "en": "Well, of course there were school mornings when the alarm went off really early, and it was freezing outside, but I'd still look forward to getting myself out there. Getting back home again in time for the school bus caused problems though, and when I got home from school after 4pm, it was really too dark to run, but I still went. Anyway, at least after my training, I could still play computer games on the sofa as usual.",
            "vi": "Đương nhiên có những buổi sáng đi học chuông báo thức reo rất sớm và ngoài trời thì lạnh cóng, nhưng tôi vẫn háo hức xỏ giày ra ngoài. Tuy nhiên, việc chạy về nhà kịp giờ xe buýt trường học lại gây ra rắc rối, và khi tôi đi học về sau 4 giờ chiều thì trời đã quá tối để chạy, nhưng tôi vẫn cố gắng đi. Dù sao thì sau khi tập xong, tôi vẫn có thể nằm ghế sofa chơi điện tử như bình thường."
          },
          {
            "speaker": "Interviewer",
            "en": "And did you follow a special diet?",
            "vi": "Và bạn có tuân theo chế độ ăn uống đặc biệt nào không?"
          },
          {
            "speaker": "John",
            "en": "Well, some runners do things like eat high-protein, high-carbohydrate diets, but I just tried to eat what I usually do, pretty healthily, apart from chocolate and chips, which I cut out, and I didn't miss them. Then about a week before the race, I started eating more carbohydrates, like pizza and pasta, to build up my energy levels. That worked fine, especially on the day of the race itself. I knew I had to start all that well before the race though; it's too late to experiment on the day.",
            "vi": "Một số người chạy thường áp dụng chế độ ăn giàu protein, giàu carbs, nhưng tôi chỉ cố gắng ăn như bình thường một cách lành mạnh, ngoại trừ sô cô la và khoai tây chiên là tôi cắt bỏ hoàn toàn, và tôi cũng không thấy thèm chúng. Sau đó khoảng một tuần trước cuộc đua, tôi bắt đầu nạp nhiều carbohydrate hơn như pizza và mì Ý để tích lũy năng lượng. Điều đó phát huy hiệu quả rất tốt, đặc biệt là vào chính ngày thi đấu. Tôi biết mình phải chuẩn bị kỹ từ trước ngày đua; vào ngày thi mà thử nghiệm là quá muộn."
          },
          {
            "speaker": "Interviewer",
            "en": "And what was the day of the race like?",
            "vi": "Và ngày thi đấu diễn ra như thế nào?"
          },
          {
            "speaker": "John",
            "en": "Pretty exciting! There were loads of people there when we arrived, and even complete strangers were wishing me luck. Anyway, once we'd all set off, everyone was cheering us along the route, and calling out the names of their friends. I actually spotted my mates holding up a sign with my name on. That really made me determined to finish the race.",
            "vi": "Rất hồi hộp và phấn khích! Có rất đông người khi chúng tôi đến nơi, và thậm chí những người hoàn toàn xa lạ cũng chúc tôi may mắn. Khi tất cả chúng tôi xuất phát, mọi người dọc đường đều hò reo cổ vũ và gọi tên bạn bè họ. Tôi bất ngờ nhìn thấy đám bạn của mình đang giơ cao tấm biển có tên tôi. Điều đó thực sự tiếp thêm quyết tâm để tôi hoàn thành chặng đua."
          },
          {
            "speaker": "Interviewer",
            "en": "So did you have any strategies to help you keep going?",
            "vi": "Vậy bạn có chiến thuật nào giúp duy trì thể lực và bước chạy không?"
          },
          {
            "speaker": "John",
            "en": "I had a finishing time in mind that I was aiming for, but once I'd started, the aim just became: keep going and cross the finish line. Since I'd never done a race like that before, I didn't have a personal best to beat. I'd been told too that starting too fast is a mistake, that I should just relax and enjoy it, then speed up before the end, which did work. It's blocking out the voice in your head telling you that you can't do it that's hardest. But I'd learnt to manage that by dealing with the race in stages, and remembering my training.",
            "vi": "Tôi có một mốc thời gian về đích trong đầu để hướng tới, nhưng một khi đã chạy, mục tiêu chỉ đơn giản là: tiếp tục chạy và vượt qua vạch đích. Vì chưa từng chạy cuộc đua nào như vậy trước đây, tôi không có kỷ lục cá nhân nào để phá. Tôi cũng được dặn rằng xuất phát quá nhanh là sai lầm, tôi nên thả lỏng và tận hưởng chặng đua, sau đó mới tăng tốc ở đoạn cuối, và điều đó thực sự hiệu quả. Khó khăn nhất là gạt bỏ tiếng nói trong đầu bảo rằng bạn không thể làm được. Nhưng tôi đã học cách kiểm soát điều đó bằng cách chia cuộc đua thành từng giai đoạn nhỏ và nhớ lại quá trình tập luyện."
          },
          {
            "speaker": "Interviewer",
            "en": "So how did you feel when you finally crossed the line?",
            "vi": "Vậy bạn cảm thấy thế nào khi cuối cùng đã cán đích?"
          },
          {
            "speaker": "John",
            "en": "Well, I assumed my first thought would be that I'd never attempt anything so tough again, but I had such a feeling of achievement that I'd finished! And my dad looked so proud, waiting there with my friends. Although I was so exhausted, I barely registered it. But we did celebrate later, and I've already signed up for my next run!",
            "vi": "Tôi từng nghĩ ý nghĩ đầu tiên trong đầu sẽ là không bao giờ thử làm điều gì gian khổ như thế này nữa, nhưng tôi lại tràn ngập cảm giác tự hào và thành tựu khi đã hoàn thành! Và bố tôi trông rất đỗi tự hào, đứng chờ cùng bạn bè tôi. Dù kiệt sức nhưng lúc đó tôi hầu như chẳng còn để ý đến mệt mỏi. Chúng tôi đã ăn mừng sau đó, và tôi thậm chí đã đăng ký tham gia chặng đua tiếp theo rồi!"
          },
          {
            "speaker": "Interviewer",
            "en": "I'm sure! Congratulations John.",
            "vi": "Chắc chắn rồi! Chúc mừng bạn John."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: Australian Wild Zoo & Map Labeling (Q11-20)",
        "instruction": "Questions 11-15: Choose the correct letter A, B or C. Questions 16-20: Label the map below. Write the correct letter, A-H, next to questions 16-20. (5.0 points)",
        "audioSrc": "",
        "mapImage": "./map_test1_zoo.png",
        "questions": [
          {
            "id": 11,
            "text": "11. What’s the new improvement about the zoo this time?",
            "options": [
              {
                "key": "A",
                "text": "The zoo has expanded its exhibition area."
              },
              {
                "key": "B",
                "text": "The zoo has brought a new batch of animals"
              },
              {
                "key": "C",
                "text": "The zoo has built a new dog-walking area."
              }
            ],
            "correct": "B",
            "explanation": "Đáp án chính thức: 11. B. Người hướng dẫn viên thông báo: 'we have brought a brand-new batch of animals from regional sanctuaries' (sở thú đã đưa về một lứa động vật hoang dã mới)."
          },
          {
            "id": 12,
            "text": "12. What is the change for the new regulation enacted in June?",
            "options": [
              {
                "key": "A",
                "text": "Visitors are allowed to feed the animals at night"
              },
              {
                "key": "B",
                "text": "The zoo is not open during the weekdays, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Visitors are allowed to see the animals until the late night."
              }
            ],
            "correct": "C",
            "explanation": "Đáp án chính thức: 12. C. Hướng dẫn viên nói: 'Under our new regulation enacted in June, the zoo extends visiting hours so you can see the animals until late night'."
          },
          {
            "id": 13,
            "text": "13. While visiting the kangaroo, which behaviour is forbidden?",
            "options": [
              {
                "key": "A",
                "text": "Feeding"
              },
              {
                "key": "B",
                "text": "Photo-taking"
              },
              {
                "key": "C",
                "text": "Shouting"
              }
            ],
            "correct": "A",
            "explanation": "Đáp án chính thức: 13. C. Hướng dẫn viên nhấn mạnh: 'Please remember, when visiting the kangaroo, feeding them is strictly forbidden'."
          },
          {
            "id": 14,
            "text": "14. Why is the pye-dog zone temporarily closed?",
            "options": [
              {
                "key": "A",
                "text": "Because the pye-dog zone is under construction."
              },
              {
                "key": "B",
                "text": "Because the pye-dogs are in hibernation"
              },
              {
                "key": "C",
                "text": "Because the fence is broken."
              }
            ],
            "correct": "C",
            "explanation": "Đáp án chính thức: 14. A. Hướng dẫn viên nói: 'the pye-dog enclosure is temporarily closed today because the perimeter fence is broken and undergoing repair'."
          },
          {
            "id": 15,
            "text": "15. Where can the visitors buy the discounted ticket?",
            "options": [
              {
                "key": "A",
                "text": "Reception desk"
              },
              {
                "key": "B",
                "text": "Gift shop"
              },
              {
                "key": "C",
                "text": "Photo shop"
              }
            ],
            "correct": "C",
            "explanation": "Đáp án chính thức: 15. B. Hướng dẫn viên chỉ dẫn: 'discounted tickets for special sessions can be purchased directly at the Photo Shop'."
          },
          {
            "id": 16,
            "text": "16. Bird hide",
            "isMap": true,
            "options": [
              {
                "key": "A",
                "text": "Khu vực A (Ngũ giác Tây Bắc)"
              },
              {
                "key": "B",
                "text": "Khu vực B (Hình chữ nhật phía Bắc)"
              },
              {
                "key": "C",
                "text": "Khu vực C (Hình chữ nhật phía Tây)"
              },
              {
                "key": "D",
                "text": "Khu vực D (Góc Tây Nam cạnh Gate)"
              },
              {
                "key": "E",
                "text": "Khu vực E (Bên trái đường chính)"
              },
              {
                "key": "F",
                "text": "Khu vực F (Hình tròn trung tâm)"
              },
              {
                "key": "G",
                "text": "Khu vực G (Hình chữ nhật Đông Nam)"
              },
              {
                "key": "H",
                "text": "Khu vực H (Hình chữ nhật Đông Bắc)"
              }
            ],
            "correct": "G",
            "explanation": "Đáp án chính thức: 16. G. Từ GATE đi thẳng vào theo lối bên phải qua thảm cỏ về phía Đông Nam, tòa nhà hình chữ nhật bên phải chính là Bird hide (G)."
          },
          {
            "id": 17,
            "text": "17. Pye-dog zone",
            "isMap": true,
            "options": [
              {
                "key": "A",
                "text": "Khu vực A"
              },
              {
                "key": "B",
                "text": "Khu vực B"
              },
              {
                "key": "C",
                "text": "Khu vực C"
              },
              {
                "key": "D",
                "text": "Khu vực D"
              },
              {
                "key": "E",
                "text": "Khu vực E"
              },
              {
                "key": "F",
                "text": "Khu vực F"
              },
              {
                "key": "G",
                "text": "Khu vực G"
              },
              {
                "key": "H",
                "text": "Khu vực H"
              }
            ],
            "correct": "B",
            "explanation": "Đáp án chính thức: 17. B. Từ khu trung tâm Kangaroo (F) nhìn thẳng về phía Bắc dọc theo lối đi uốn cong là khu chuồng Pye-dog zone (B)."
          },
          {
            "id": 18,
            "text": "18. Rest area",
            "isMap": true,
            "options": [
              {
                "key": "A",
                "text": "Khu vực A"
              },
              {
                "key": "B",
                "text": "Khu vực B"
              },
              {
                "key": "C",
                "text": "Khu vực C"
              },
              {
                "key": "D",
                "text": "Khu vực D"
              },
              {
                "key": "E",
                "text": "Khu vực E"
              },
              {
                "key": "F",
                "text": "Khu vực F"
              },
              {
                "key": "G",
                "text": "Khu vực G"
              },
              {
                "key": "H",
                "text": "Khu vực H"
              }
            ],
            "correct": "A",
            "explanation": "Đáp án chính thức: 18. A. Ở góc Tây Bắc (North-West) xa nhất là khu vực hình ngũ giác yên tĩnh dành cho khách nghỉ ngơi: Rest area (A)."
          },
          {
            "id": 19,
            "text": "19. Kangaroo visiting site",
            "isMap": true,
            "options": [
              {
                "key": "A",
                "text": "Khu vực A"
              },
              {
                "key": "B",
                "text": "Khu vực B"
              },
              {
                "key": "C",
                "text": "Khu vực C"
              },
              {
                "key": "D",
                "text": "Khu vực D"
              },
              {
                "key": "E",
                "text": "Khu vực E"
              },
              {
                "key": "F",
                "text": "Khu vực F"
              },
              {
                "key": "G",
                "text": "Khu vực G"
              },
              {
                "key": "H",
                "text": "Khu vực H"
              }
            ],
            "correct": "F",
            "explanation": "Đáp án chính thức: 19. F. Vị trí hình tròn ở ngay trung tâm vườn thú chính là Kangaroo visiting site (F)."
          },
          {
            "id": 20,
            "text": "20. Photo shop",
            "isMap": true,
            "options": [
              {
                "key": "A",
                "text": "Khu vực A"
              },
              {
                "key": "B",
                "text": "Khu vực B"
              },
              {
                "key": "C",
                "text": "Khu vực C"
              },
              {
                "key": "D",
                "text": "Khu vực D"
              },
              {
                "key": "E",
                "text": "Khu vực E"
              },
              {
                "key": "F",
                "text": "Khu vực F"
              },
              {
                "key": "G",
                "text": "Khu vực G"
              },
              {
                "key": "H",
                "text": "Khu vực H"
              }
            ],
            "correct": "D",
            "explanation": "Đáp án chính thức: 20. D. Ngay khi bước qua cổng chính GATE, rẽ ngay về phía bên tay trái ở góc Tây Nam (South-West) là Photo shop (D)."
          }
        ],
        "transcript": [
          {
            "speaker": "Tour Guide",
            "en": "Good morning everyone and welcome to the Australian Wild Zoo! I'm thrilled to introduce you to our newly upgraded facilities this season. First off, you'll be delighted to know that we have brought a brand-new batch of animals from regional conservation sanctuaries [Q11]. Under our new regulation enacted this June, the zoo now extends visiting hours so you can observe nocturnal animal activities until late at night [Q12]! Please remember, when visiting the kangaroo sanctuary, feeding them any outside food is strictly forbidden [Q13]. Also, note that the pye-dog enclosure is temporarily closed today because the perimeter fence is broken and undergoing urgent repair [Q14]. Finally, if you wish to purchase discounted admission tickets for our interactive sessions, please head directly over to the Photo Shop [Q15]!",
            "vi": "Chào buổi sáng quý khách và chào mừng đến với Sở thú Hoang dã Australia! Tôi rất vui được giới thiệu với quý khách những cơ sở vật chất mới được nâng cấp trong mùa này. Trước hết, quý khách sẽ rất thích thú khi biết sở thú vừa tiếp nhận một lứa động vật hoang dã mới từ các khu bảo tồn thiên nhiên [Q11]. Theo quy định mới áp dụng từ tháng 6, sở thú mở rộng giờ tham quan để quý khách có thể quan sát động vật ban đêm đến tận đêm muộn [Q12]! Xin lưu ý khi vào khu vực Kangaroo, hành vi cho thú ăn bị nghiêm cấm tuyệt đối [Q13]. Khu vực chó hoang pye-dog hiện đang tạm đóng cửa do hàng rào bị gãy hỏng cần sửa chữa khẩn cấp [Q14]. Cuối cùng, nếu quý khách muốn mua vé ưu đãi cho các trải nghiệm tương tác, xin vui lòng đến trực tiếp quầy Photo Shop [Q15]!"
          },
          {
            "speaker": "Tour Guide (Map Orientation)",
            "en": "Now, let me orient you with our site layout. We are currently standing right here at the main GATE at the southern edge. If you turn immediately to your left at the south-western corner, that building marked D is the Photo Shop [Q20: D]. Walking along the pathway on your right past the grassy area to the south-east, building G is our Bird Hide [Q16: G]. Continuing up into the heart of the park, this large circular enclosure marked F is the famous Kangaroo Visiting Site [Q19: F]. Straight north from the kangaroos along the curving path, structure B is the Pye-Dog Zone [Q17: B]. Finally, tucked away peacefully at the far north-western corner, the five-sided building marked A is our Rest Area with shaded seating [Q18: A].",
            "vi": "Bây giờ, tôi xin hướng dẫn quý khách sơ đồ mặt bằng sở thú. Chúng ta hiện đang đứng ngay tại CỔNG CHÍNH (GATE) ở rìa phía Nam. Nếu quý khách rẽ ngay sang bên trái ở góc Tây Nam, tòa nhà D chính là quầy Photo Shop [Q20: D]. Đi theo lối đi bên phải qua bãi cỏ về phía Đông Nam, tòa nhà G là Trạm quan sát chim - Bird Hide [Q16: G]. Tiếp tục đi lên trung tâm công viên, khu vực hình tròn F chính là Điểm tham quan Kangaroo [Q19: F]. Nhìn thẳng về phía Bắc từ khu Kangaroo dọc theo con đường cong là Khu chó hoang Pye-Dog Zone (B) [Q17: B]. Cuối cùng, nằm yên tĩnh ở góc Tây Bắc xa nhất, tòa nhà ngũ giác A là Khu nghỉ ngơi - Rest Area có ghế ngồi râm mát [Q18: A]."
          }
        ]
      }
    ],
    "sourceType": "exam"
  },
  {
    "id": "test_2",
    "title": "ĐỀ SỐ 2: Listening HP3 (Đề Thi Tương Tự 1 - Chuẩn Ma Trận Bộ Công An)",
    "subtitle": "20 Câu hỏi • Part 1 (Phỏng vấn nghệ sĩ piano) • Part 2 (Thám hiểm xe đạp) • Part 3 (Bảo tàng & Map)",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Interview with Young Musician David",
        "instruction": "Questions 1-5. Choose the correct letter, A, B or C. (2.5 points)\nYou will hear an interview with a 17-year-old student called David, who won the National Young Musician Competition.",
        "audioSrc": "",
        "questions": [
          {
            "id": 1,
            "text": "1. Which musical instrument did David learn to play first?",
            "options": [
              {
                "key": "A",
                "text": "violin"
              },
              {
                "key": "B",
                "text": "guitar"
              },
              {
                "key": "C",
                "text": "piano"
              }
            ],
            "correct": "C",
            "explanation": "David chia sẻ: 'My parents bought an upright piano when I was six, and that was the very first instrument I touched, long before I tried the guitar in high school'."
          },
          {
            "id": 2,
            "text": "2. David decided to enter the competition after",
            "options": [
              {
                "key": "A",
                "text": "attending a live concert by a famous pianist."
              },
              {
                "key": "B",
                "text": "his music teacher strongly encouraged him."
              },
              {
                "key": "C",
                "text": "seeing an advertisement on social media."
              }
            ],
            "correct": "B",
            "explanation": "David nói: 'I was hesitant at first, but my school music teacher Mrs. Harrison convinced me that my technique was ready and urged me to submit an audition tape'."
          },
          {
            "id": 3,
            "text": "3. How does David feel when performing in front of a large audience?",
            "options": [
              {
                "key": "A",
                "text": "anxious about forgetting the sheet music"
              },
              {
                "key": "B",
                "text": "uncomfortable under bright stage lights"
              },
              {
                "key": "C",
                "text": "energized by the crowd's reaction"
              }
            ],
            "correct": "C",
            "explanation": "David nói: 'Once I hit the first chord, all fear vanished; seeing the audience engaged actually gives me an incredible surge of energy'."
          },
          {
            "id": 4,
            "text": "4. What was the most difficult aspect of David’s preparation?",
            "options": [
              {
                "key": "A",
                "text": "memorizing intricate musical passages"
              },
              {
                "key": "B",
                "text": "traveling long distances for masterclasses"
              },
              {
                "key": "C",
                "text": "balancing practice hours with school exams"
              }
            ],
            "correct": "C",
            "explanation": "David nhấn mạnh: 'The hardest challenge was definitely managing my schedule—I had final term exams while trying to practice 4 hours every evening'."
          },
          {
            "id": 5,
            "text": "5. What is David’s primary ambition for the near future?",
            "options": [
              {
                "key": "A",
                "text": "release a solo commercial album"
              },
              {
                "key": "B",
                "text": "complete his formal degree in music composition"
              },
              {
                "key": "C",
                "text": "join a touring orchestra abroad"
              }
            ],
            "correct": "B",
            "explanation": "David khẳng định: 'Although there are tour offers, my priority is completing my music degree at university before launching a full-time professional career'."
          }
        ],
        "transcript": [
          {
            "speaker": "Interviewer",
            "en": "Welcome David! Huge congratulations on winning the National Young Musician title. When did your musical journey begin?",
            "vi": "Chào mừng David! Chúc mừng bạn đã giành giải quán quân Nhạc công trẻ Quốc gia. Hành trình âm nhạc của bạn bắt đầu từ khi nào?"
          },
          {
            "speaker": "David",
            "en": "Thank you! Well, my parents bought an upright piano when I was six, and that was the very first instrument I touched, long before I tried the guitar in high school [Q1: B].",
            "vi": "Cảm ơn bạn! Bố mẹ tôi mua một cây đàn piano khi tôi 6 tuổi, và đó là nhạc cụ đầu tiên tôi tiếp xúc, rất lâu trước khi tôi thử chơi guitar hồi cấp ba [Q1: B]."
          },
          {
            "speaker": "Interviewer",
            "en": "What made you enter such a competitive contest?",
            "vi": "Điều gì thúc đẩy bạn tham gia một cuộc thi có tính cạnh tranh cao như vậy?"
          },
          {
            "speaker": "David",
            "en": "I was hesitant at first, but my school music teacher Mrs. Harrison convinced me that my technique was ready and urged me to submit an audition tape [Q2: A].",
            "vi": "Ban đầu tôi khá do dự, nhưng cô giáo dạy nhạc trường tôi là cô Harrison đã thuyết phục rằng kỹ thuật của tôi đã vững và thúc giục tôi gửi bản ghi âm dự thi [Q2: A]."
          },
          {
            "speaker": "Interviewer",
            "en": "How do you handle performing before thousands of spectators?",
            "vi": "Bạn xử lý áp lực biểu diễn trước hàng ngàn khán giả như thế nào?"
          },
          {
            "speaker": "David",
            "en": "Once I hit the first chord, all fear vanished; seeing the audience engaged actually gives me an incredible surge of energy [Q3: B].",
            "vi": "Khi tôi đánh hợp âm đầu tiên, mọi nỗi sợ đều biến mất; việc nhìn thấy khán giả đắm chìm thực sự tiếp thêm cho tôi nguồn năng lượng tuyệt vời [Q3: B]."
          },
          {
            "speaker": "Interviewer",
            "en": "What proved to be the toughest hurdle during training?",
            "vi": "Điều gì là thử thách lớn nhất trong quá trình luyện tập?"
          },
          {
            "speaker": "David",
            "en": "The hardest challenge was definitely managing my schedule—I had final term exams while trying to practice 4 hours every evening [Q4: B].",
            "vi": "Thử thách khó nhất chắc chắn là quản lý thời gian—tôi vướng kỳ thi học kỳ trong khi vẫn phải cố gắng tập 4 tiếng mỗi tối [Q4: B]."
          },
          {
            "speaker": "Interviewer",
            "en": "And what lies ahead in your career?",
            "vi": "Và dự định tương lai của bạn là gì?"
          },
          {
            "speaker": "David",
            "en": "Although there are tour offers, my priority is completing my music degree at university before launching a full-time professional career [Q5: C].",
            "vi": "Dù có lời mời đi lưu diễn, ưu tiên của tôi vẫn là hoàn thành bằng đại học ngành sáng tác âm nhạc trước khi bước vào sự nghiệp chuyên nghiệp toàn thời gian [Q5: C]."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Interview with Long-Distance Cyclist Sarah",
        "instruction": "Questions 6-10. Choose the correct letter, A, B or C. (2.5 points)\nYou will hear an interview with a university student named Sarah, who completed a 500-kilometre coastal bike expedition.",
        "audioSrc": "",
        "questions": [
          {
            "id": 6,
            "text": "6. Why did Sarah undertake the 500-km coastal ride?",
            "options": [
              {
                "key": "A",
                "text": "to break an amateur speed record"
              },
              {
                "key": "B",
                "text": "to raise funds for marine conservation"
              },
              {
                "key": "C",
                "text": "to test a prototype touring bicycle"
              }
            ],
            "correct": "B",
            "explanation": "Sarah giải thích: 'My primary goal was raising donations for a coastal marine charity protecting coral reefs'."
          },
          {
            "id": 7,
            "text": "7. During the journey, what was the most difficult physical challenge?",
            "options": [
              {
                "key": "A",
                "text": "enduring heavy torrential afternoon rain"
              },
              {
                "key": "B",
                "text": "climbing steep rocky mountain passes"
              },
              {
                "key": "C",
                "text": "pedaling against powerful coastal headwinds"
              }
            ],
            "correct": "C",
            "explanation": "Sarah nói: 'The coastal gale headwinds were relentless; on day three, pedaling felt like pushing against a solid brick wall'."
          },
          {
            "id": 8,
            "text": "8. How did Sarah arrange overnight accommodation?",
            "options": [
              {
                "key": "A",
                "text": "reserved hotel rooms weeks beforehand"
              },
              {
                "key": "B",
                "text": "stayed exclusively with local host families"
              },
              {
                "key": "C",
                "text": "pitched a lightweight tent at coastal campsites"
              }
            ],
            "correct": "C",
            "explanation": "Sarah kể: 'To keep expenses low, I carried a compact tent and camped overnight at designated public campsites along beaches'."
          },
          {
            "id": 9,
            "text": "9. What does Sarah say about her nutritional strategy during the ride?",
            "options": [
              {
                "key": "A",
                "text": "ate heavy pasta dinners each night"
              },
              {
                "key": "B",
                "text": "relied solely on liquid protein shakes"
              },
              {
                "key": "C",
                "text": "snacked frequently on nuts, oats, and bananas"
              }
            ],
            "correct": "C",
            "explanation": "Sarah chia sẻ: 'Instead of huge meals that make you sluggish, I munched small portions of oats, bananas, and almonds every 45 minutes'."
          },
          {
            "id": 10,
            "text": "10. What key advice does Sarah offer to aspiring endurance cyclists?",
            "options": [
              {
                "key": "A",
                "text": "purchase top-tier carbon-fiber equipment"
              },
              {
                "key": "B",
                "text": "always travel in large organized pelotons"
              },
              {
                "key": "C",
                "text": "master basic bicycle maintenance before departure"
              }
            ],
            "correct": "C",
            "explanation": "Sarah khuyên: 'Knowing how to patch a punctured tire and adjust a chain yourself is essential; you can't rely on bike shops in remote areas'."
          }
        ],
        "transcript": [
          {
            "speaker": "Interviewer",
            "en": "Sarah, 500 kilometers on two wheels along rugged coastlines is breathtaking! What inspired this feat?",
            "vi": "Sarah, 500 km trên chiếc xe đạp dọc bờ biển hiểm trở thật ngoạn mục! Điều gì đã truyền cảm hứng cho chuyến đi này?"
          },
          {
            "speaker": "Sarah",
            "en": "My primary goal was raising donations for a coastal marine charity protecting coral reefs [Q6: A].",
            "vi": "Mục tiêu chính của tôi là gây quỹ quyên góp cho một tổ chức từ thiện bảo tồn san hô biển ven bờ [Q6: A]."
          },
          {
            "speaker": "Interviewer",
            "en": "What was the toughest physical obstacle along the Pacific highway?",
            "vi": "Trở ngại thể lực khắc nghiệt nhất dọc đường quốc lộ ven biển là gì?"
          },
          {
            "speaker": "Sarah",
            "en": "The coastal gale headwinds were relentless; on day three, pedaling felt like pushing against a solid brick wall [Q7: A].",
            "vi": "Gió ngược từ biển thổi rát rạt không ngừng; vào ngày thứ ba, đạp xe như thể đang cố đẩy một bức tường gạch kiên cố [Q7: A]."
          },
          {
            "speaker": "Interviewer",
            "en": "Where did you rest your head each night?",
            "vi": "Bạn nghỉ qua đêm ở đâu?"
          },
          {
            "speaker": "Sarah",
            "en": "To keep expenses low, I carried a compact tent and camped overnight at designated public campsites along beaches [Q8: B].",
            "vi": "Để tiết kiệm chi phí, tôi mang theo một chiếc lều nhỏ gọn và cắm trại qua đêm tại các bãi cắm trại công cộng ven biển [Q8: B]."
          },
          {
            "speaker": "Interviewer",
            "en": "How did you sustain your energy levels across consecutive days?",
            "vi": "Bạn duy trì mức năng lượng như thế nào qua nhiều ngày liên tiếp?"
          },
          {
            "speaker": "Sarah",
            "en": "Instead of huge meals that make you sluggish, I munched small portions of oats, bananas, and almonds every 45 minutes [Q9: B].",
            "vi": "Thay vì ăn bữa lớn gây nặng bụng, tôi nhâm nhi khẩu phần nhỏ gồm yến mạch, chuối và hạnh nhân cứ mỗi 45 phút [Q9: B]."
          },
          {
            "speaker": "Interviewer",
            "en": "What is your number one tip for beginners embarking on touring rides?",
            "vi": "Lời khuyên số một của bạn cho người mới bắt đầu đạp xe đường trường là gì?"
          },
          {
            "speaker": "Sarah",
            "en": "Knowing how to patch a punctured tire and adjust a chain yourself is essential; you can't rely on bike shops in remote areas [Q10: B].",
            "vi": "Biết cách tự vá lốp thủng và căn chỉnh xích xe là điều sống còn; bạn không thể trông chờ vào tiệm sửa xe ở các vùng hẻo lánh [Q10: B]."
          }
        ]
      },
      {
        "partNumber": 3,
        "title": "Part 3: National Security Heritage Museum & Floor Plan",
        "instruction": "Questions 11-15: Choose the correct letter A, B or C. Questions 16-20: Label the map below. (5.0 points)",
        "audioSrc": "",
        "mapImage": "./map_test1_zoo.png",
        "questions": [
          {
            "id": 11,
            "text": "11. What is the latest exhibition gallery added to the museum this year?",
            "options": [
              {
                "key": "A",
                "text": "Ancient military armor and weaponry"
              },
              {
                "key": "B",
                "text": "Aviation surveillance history"
              },
              {
                "key": "C",
                "text": "Historical cipher and cryptology machines"
              }
            ],
            "correct": "C",
            "explanation": "Hướng dẫn viên giới thiệu: 'Our newest permanent exhibition focuses on historical cipher machines and cryptology'."
          },
          {
            "id": 12,
            "text": "12. Under the updated regulations, what is the evening closing time on weekends?",
            "options": [
              {
                "key": "A",
                "text": "8:30 PM"
              },
              {
                "key": "B",
                "text": "10:00 PM"
              },
              {
                "key": "C",
                "text": "6:00 PM"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo nêu rõ: 'Weekend hours are now extended to 8:30 PM to accommodate evening guided tours'."
          },
          {
            "id": 13,
            "text": "13. Which action is strictly prohibited inside the main archive room?",
            "options": [
              {
                "key": "A",
                "text": "Taking flash photography"
              },
              {
                "key": "B",
                "text": "Carrying sketchbooks"
              },
              {
                "key": "C",
                "text": "Wearing backpacks"
              }
            ],
            "correct": "A",
            "explanation": "Quy định nêu rõ: 'Flash photography is strictly banned to preserve ancient parchment documents'."
          },
          {
            "id": 14,
            "text": "14. Why is the rooftop observation deck closed today?",
            "options": [
              {
                "key": "A",
                "text": "Private diplomatic reception"
              },
              {
                "key": "B",
                "text": "Structural floor resurfacing"
              },
              {
                "key": "C",
                "text": "Excessive wind speeds"
              }
            ],
            "correct": "B",
            "explanation": "Hướng dẫn viên thông báo: 'The rooftop observation deck is temporarily closed for floor resurfacing'."
          },
          {
            "id": 15,
            "text": "15. Where can university students collect their free multilingual audio guide?",
            "options": [
              {
                "key": "A",
                "text": "Information Desk"
              },
              {
                "key": "B",
                "text": "Gift store"
              },
              {
                "key": "C",
                "text": "Security checkpoint"
              }
            ],
            "correct": "A",
            "explanation": "Hướng dẫn viên cho biết: 'Students can present ID at the Information Desk to receive free audio headsets'."
          },
          {
            "id": 16,
            "text": "16. Cryptology & Cipher Gallery",
            "isMap": true,
            "options": [
              {
                "key": "A",
                "text": "Khu vực A"
              },
              {
                "key": "B",
                "text": "Khu vực B"
              },
              {
                "key": "C",
                "text": "Khu vực C"
              },
              {
                "key": "D",
                "text": "Khu vực D"
              },
              {
                "key": "E",
                "text": "Khu vực E"
              },
              {
                "key": "F",
                "text": "Khu vực F"
              },
              {
                "key": "G",
                "text": "Khu vực G"
              },
              {
                "key": "H",
                "text": "Khu vực H"
              }
            ],
            "correct": "H",
            "explanation": "Đi từ GATE dọc theo sảnh phía Đông về phía Đông Bắc: Tòa nhà triển lãm lớn H chính là Cryptology Gallery."
          },
          {
            "id": 17,
            "text": "17. Archive Preservation Room",
            "isMap": true,
            "options": [
              {
                "key": "A",
                "text": "Khu vực A"
              },
              {
                "key": "B",
                "text": "Khu vực B"
              },
              {
                "key": "C",
                "text": "Khu vực C"
              },
              {
                "key": "D",
                "text": "Khu vực D"
              },
              {
                "key": "E",
                "text": "Khu vực E"
              },
              {
                "key": "F",
                "text": "Khu vực F"
              },
              {
                "key": "G",
                "text": "Khu vực G"
              },
              {
                "key": "H",
                "text": "Khu vực H"
              }
            ],
            "correct": "B",
            "explanation": "Nằm ở phía Bắc đối diện khu trung tâm F là phòng lưu trữ tài liệu mật B."
          },
          {
            "id": 18,
            "text": "18. Officers Memorial Hall",
            "isMap": true,
            "options": [
              {
                "key": "A",
                "text": "Khu vực A"
              },
              {
                "key": "B",
                "text": "Khu vực B"
              },
              {
                "key": "C",
                "text": "Khu vực C"
              },
              {
                "key": "D",
                "text": "Khu vực D"
              },
              {
                "key": "E",
                "text": "Khu vực E"
              },
              {
                "key": "F",
                "text": "Khu vực F"
              },
              {
                "key": "G",
                "text": "Khu vực G"
              },
              {
                "key": "H",
                "text": "Khu vực H"
              }
            ],
            "correct": "A",
            "explanation": "Ở góc Tây Bắc xa nhất, tòa nhà ngũ giác uy nghiêm A là Nhà tưởng niệm các anh hùng liệt sĩ."
          },
          {
            "id": 19,
            "text": "19. Central Interactive Courtyard",
            "isMap": true,
            "options": [
              {
                "key": "A",
                "text": "Khu vực A"
              },
              {
                "key": "B",
                "text": "Khu vực B"
              },
              {
                "key": "C",
                "text": "Khu vực C"
              },
              {
                "key": "D",
                "text": "Khu vực D"
              },
              {
                "key": "E",
                "text": "Khu vực E"
              },
              {
                "key": "F",
                "text": "Khu vực F"
              },
              {
                "key": "G",
                "text": "Khu vực G"
              },
              {
                "key": "H",
                "text": "Khu vực H"
              }
            ],
            "correct": "F",
            "explanation": "Khuôn viên tròn lớn ở vị trí trung tâm F chính là Central Interactive Courtyard."
          },
          {
            "id": 20,
            "text": "20. Information & Headset Desk",
            "isMap": true,
            "options": [
              {
                "key": "A",
                "text": "Khu vực A"
              },
              {
                "key": "B",
                "text": "Khu vực B"
              },
              {
                "key": "C",
                "text": "Khu vực C"
              },
              {
                "key": "D",
                "text": "Khu vực D"
              },
              {
                "key": "E",
                "text": "Khu vực E"
              },
              {
                "key": "F",
                "text": "Khu vực F"
              },
              {
                "key": "G",
                "text": "Khu vực G"
              },
              {
                "key": "H",
                "text": "Khu vực H"
              }
            ],
            "correct": "D",
            "explanation": "Ngay lối vào bên trái cổng GATE ở góc Tây Nam là quầy Information Desk (D)."
          }
        ],
        "transcript": [
          {
            "speaker": "Guide",
            "en": "Welcome cadets and visitors to the National Security Heritage Museum. We are proud to inaugurate our state-of-the-art Cryptology and Cipher Gallery this year [Q11: A]. Weekend opening hours have now been extended until 8:30 PM [Q12: B]. Inside the special archives, flash photography is strictly prohibited to safeguard delicate historical inks [Q13: B]. Please note the rooftop viewing platform is closed today due to scheduled maintenance [Q14: A]. Students may collect free digital audio headsets at our Information Desk [Q15: B].",
            "vi": "Chào mừng các học viên và du khách đến với Bảo tàng Di sản An ninh Quốc gia. Chúng tôi tự hào khánh thành Phòng trưng bày Mật mã học trong năm nay [Q11: A]. Giờ mở cửa cuối tuần hiện kéo dài đến 8:30 tối [Q12: B]. Bên trong phòng lưu trữ, hành vi chụp ảnh có đèn flash bị cấm nghiêm ngặt để bảo vệ các tài liệu cổ [Q13: B]. Xin lưu ý đài quan sát trên mái tạm đóng cửa hôm nay để bảo dưỡng [Q14: A]. Học viên có thể nhận tai nghe thuyết minh miễn phí tại Quầy Thông tin [Q15: B]."
          },
          {
            "speaker": "Guide (Layout)",
            "en": "Standing at the southern entrance GATE, building D on your immediate left is the Information Desk where you collect audio guides [Q20: D]. Walking north-east up the eastern wing, the long hall H houses the Cryptology and Cipher Gallery [Q16: H]. In the center of the complex, the circular plaza F is the Central Interactive Courtyard [Q19: F]. Directly north of the courtyard, structure B is the Archive Preservation Room [Q17: B]. In the peaceful north-western corner, the pentagon-shaped hall A is the Officers Memorial Hall [Q18: A].",
            "vi": "Đứng tại cổng vào phía Nam GATE, tòa nhà D ngay bên tay trái quý khách là Quầy Thông tin nhận tai nghe [Q20: D]. Đi về phía Đông Bắc dọc cánh phía Đông, đại sảnh H là Phòng Mật mã học [Q16: H]. Ở trung tâm khu phức hợp, quảng trường tròn F là Sân tương tác trung tâm [Q19: F]. Ngay phía Bắc quảng trường, tòa nhà B là Phòng bảo quản văn khố [Q17: B]. Nằm tại góc Tây Bắc trang nghiêm, đại sảnh ngũ giác A là Nhà tưởng niệm cán bộ chiến sĩ [Q18: A]."
          }
        ]
      }
    ],
    "sourceType": "exam"
  },
  {
    "id": "test_3",
    "title": "ĐỀ SỐ 3: VSTEP Listening B1-B2 (Nguồn: Ace of English - VSTEP Test Library)",
    "subtitle": "Form Chuẩn Đề Thi VSTEP Quốc Gia • 3 Parts • Trắc nghiệm 4 lựa chọn A, B, C, D • Lời thoại song ngữ",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: 8 Câu Hỏi Tình Huống Ngắn (Short Conversations)",
        "instruction": "Directions: In this part, you will hear eight short conversations. For questions 1-8, choose the best answer A, B, C or D.",
        "audioSrc": "./audio/vstep_part1_conversations.mp3",
        "questions": [
          {
            "id": 1,
            "text": "1. Where are the speakers talking?",
            "options": [
              {
                "key": "A",
                "text": "Inside a hotel lobby"
              },
              {
                "key": "B",
                "text": "At a central train station"
              },
              {
                "key": "C",
                "text": "At a crowded airport terminal"
              },
              {
                "key": "D",
                "text": "In a university lecture hall"
              }
            ],
            "correct": "C",
            "explanation": "Người phụ nữ thông báo: 'Passengers for flight VN-234 to Da Nang, please proceed to Gate 12 immediately for final boarding'. Tiếng loa phát thanh chuyến bay và gate xác nhận địa điểm là sân bay (airport terminal)."
          },
          {
            "id": 2,
            "text": "2. What time will the research presentation begin?",
            "options": [
              {
                "key": "A",
                "text": "At 9:15 AM"
              },
              {
                "key": "B",
                "text": "At 10:00 AM"
              },
              {
                "key": "C",
                "text": "At 10:30 AM"
              },
              {
                "key": "D",
                "text": "At 9:45 AM"
              }
            ],
            "correct": "D",
            "explanation": "Giáo sư thông báo: 'The seminar was scheduled for 9:15, but because the keynote speaker's flight was delayed, we will push the start back by thirty minutes to a quarter to ten'. 9:15 + 30 phút = 9:45 AM (a quarter to ten)."
          },
          {
            "id": 3,
            "text": "3. What is the woman complaining about?",
            "options": [
              {
                "key": "A",
                "text": "The slow Wi-Fi internet connection"
              },
              {
                "key": "B",
                "text": "The high cost of room service"
              },
              {
                "key": "C",
                "text": "The noisy construction outside her window"
              },
              {
                "key": "D",
                "text": "The poor air conditioning in her room"
              }
            ],
            "correct": "A",
            "explanation": "Người phụ nữ phàn nàn: 'I've been trying to submit my report for over an hour, but the wireless signal keeps dropping every two minutes. It's dreadfully slow!'"
          },
          {
            "id": 4,
            "text": "4. Why did the man decline the job invitation?",
            "options": [
              {
                "key": "A",
                "text": "The offered salary was insufficient."
              },
              {
                "key": "B",
                "text": "The working hours were too rigid."
              },
              {
                "key": "C",
                "text": "He prefers working part-time."
              },
              {
                "key": "D",
                "text": "He would have to relocate to another city."
              }
            ],
            "correct": "D",
            "explanation": "Người đàn ông nói: 'The package was quite generous, but they insisted that I move to their Da Nang branch next month. With my family settled in Hanoi, relocation was out of the question'."
          },
          {
            "id": 5,
            "text": "5. What will the students do on their field trip tomorrow?",
            "options": [
              {
                "key": "A",
                "text": "Conduct soil tests in the botanical gardens"
              },
              {
                "key": "B",
                "text": "Collect plastic waste along the coastline"
              },
              {
                "key": "C",
                "text": "Visit a high-tech solar power plant"
              },
              {
                "key": "D",
                "text": "Interview visitors at the history museum"
              }
            ],
            "correct": "B",
            "explanation": "Trưởng nhóm phổ biến: 'Don't forget your gloves and boots. We'll be joining the local community to clear plastic waste along the beach'."
          }
        ],
        "transcript": [
          {
            "speaker": "Announcer",
            "en": "Attention passengers for flight VN-234 to Da Nang, please proceed to Gate 12 immediately for final boarding.",
            "vi": "Xin hành khách trên chuyến bay VN-234 đi Đà Nẵng vui lòng khẩn trương di chuyển ra Cửa số 12 để làm thủ tục lên máy bay lần cuối."
          },
          {
            "speaker": "Professor",
            "en": "Good morning everyone. The seminar was scheduled for 9:15, but because the keynote speaker's flight was delayed, we will push the start back to a quarter to ten.",
            "vi": "Chào buổi sáng cả lớp. Hội thảo ban đầu dự kiến lúc 9:15, nhưng do chuyến bay của diễn giả chính bị hoãn nên chúng ta sẽ lùi giờ bắt đầu lại 30 phút đến 9:45."
          },
          {
            "speaker": "Guest",
            "en": "Front desk? I've been trying to submit my report for over an hour, but the wireless internet signal keeps dropping every two minutes. It's dreadfully slow!",
            "vi": "Lễ tân phải không ạ? Tôi đã cố gắng nộp báo cáo suốt hơn một tiếng qua nhưng tín hiệu mạng wifi cứ chập chờn rớt liên tục. Tốc độ quá chậm!"
          },
          {
            "speaker": "Candidate",
            "en": "The salary package was quite generous, but they insisted that I move to their Da Nang branch next month. With my family settled in Hanoi, relocation was out of the question.",
            "vi": "Mức đãi ngộ khá hậu hĩnh, nhưng họ yêu cầu tôi phải chuyển công tác vào chi nhánh Đà Nẵng ngay tháng sau. Gia đình tôi đã an cư ở Hà Nội nên việc chuyển nơi ở là không thể."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Hội Thoại Học Thuật Sinh Viên (Academic Discussion)",
        "instruction": "Directions: You will hear a conversation between two university students discussing an environmental project. Choose A, B, C or D.",
        "audioSrc": "./audio/vstep_part2_discussion.mp3",
        "questions": [
          {
            "id": 6,
            "text": "6. What is the central subject of Liam and Sarah's joint presentation?",
            "options": [
              {
                "key": "A",
                "text": "Reforestation strategies in mountainous areas"
              },
              {
                "key": "B",
                "text": "The economic impact of offshore wind farms"
              },
              {
                "key": "C",
                "text": "Urban rooftop gardens and local biodiversity"
              },
              {
                "key": "D",
                "text": "Microplastic pollution in freshwater river systems"
              }
            ],
            "correct": "D",
            "explanation": "Sarah mở đầu: 'Our assignment specifically asks us to analyze how synthetic fibers and microplastics contaminate urban freshwater lakes and rivers'."
          },
          {
            "id": 7,
            "text": "7. How do the students plan to divide the presentation workload?",
            "options": [
              {
                "key": "A",
                "text": "They will take turns speaking for equal five-minute intervals."
              },
              {
                "key": "B",
                "text": "They will invite an external guest speaker, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "Liam will create slides while Sarah gives the entire speech."
              },
              {
                "key": "D",
                "text": "Sarah will present data analysis and Liam will discuss policy solutions."
              }
            ],
            "correct": "D",
            "explanation": "Liam đề xuất: 'Why don't you cover the laboratory sample findings and statistical charts, while I handle government regulations and mitigation solutions?' Sarah đồng ý: 'That sounds perfect'."
          }
        ],
        "transcript": [
          {
            "speaker": "Sarah",
            "en": "Liam, did you finish reading the research paper Professor Evans sent yesterday?",
            "vi": "Liam, cậu đã đọc xong bài nghiên cứu mà Giáo sư Evans gửi hôm qua chưa?"
          },
          {
            "speaker": "Liam",
            "en": "Yes, I did! Our assignment specifically asks us to analyze how synthetic fibers and microplastics contaminate urban freshwater lakes and rivers.",
            "vi": "Tớ đọc rồi! Bài tập lớn của chúng mình yêu cầu phân tích cụ thể cách thức các sợi tổng hợp và hạt vi nhựa làm ô nhiễm các sông hồ nước ngọt đô thị."
          },
          {
            "speaker": "Liam",
            "en": "Why don't you cover the laboratory sample findings and statistical charts, while I handle government regulations and mitigation solutions?",
            "vi": "Sao cậu không phụ trách phần kết quả mẫu phân tích phòng thí nghiệm và biểu đồ thống kê, còn tớ sẽ phụ trách phần chính sách quy định của chính phủ và các giải pháp giảm thiểu nhỉ?"
          },
          {
            "speaker": "Sarah",
            "en": "That sounds perfect! That way both of us can play to our strengths.",
            "vi": "Ý tưởng tuyệt vời đấy! Như vậy cả hai chúng ta đều phát huy được thế mạnh của mình."
          }
        ]
      }
    ],
    "sourceType": "exam"
  },
  {
    "id": "test_4",
    "title": "ĐỀ SỐ 4: Cambridge B1 Preliminary & B2 First Listening (Cambridge Assessment English)",
    "subtitle": "Form Chuẩn Cambridge English • Kỹ năng nghe bắt ý chính & phát hiện bẫy chi tiết • Audio đa giọng US/UK",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Phỏng Vấn Chuyên Gia Du Lịch Mạo Hiểm (Adventure Travel)",
        "instruction": "Questions 1-5. You will hear an interview with a wilderness tour guide named Marcus. Choose the correct letter A, B or C.",
        "audioSrc": "./audio/cambridge_part1_marcus.mp3",
        "questions": [
          {
            "id": 1,
            "text": "1. What inspired Marcus to become a mountain expedition guide?",
            "options": [
              {
                "key": "A",
                "text": "Reading travel adventure novels as a boy"
              },
              {
                "key": "B",
                "text": "Watching nature documentaries on television"
              },
              {
                "key": "C",
                "text": "A memorable hiking trip with his grandfather"
              }
            ],
            "correct": "C",
            "explanation": "Marcus giải thích: 'People often think I read lots of adventure books, but the turning point was when my grandfather took me trekking in the Highlands when I was ten. Standing on that summit changed my perspective entirely'."
          },
          {
            "id": 2,
            "text": "2. What is Marcus's primary rule for clients undertaking high-altitude treks?",
            "options": [
              {
                "key": "A",
                "text": "Always prioritize physical safety over reaching the peak."
              },
              {
                "key": "B",
                "text": "Never hike without satellite navigation devices."
              },
              {
                "key": "C",
                "text": "Maintain an uninterrupted fast climbing pace."
              }
            ],
            "correct": "A",
            "explanation": "Marcus nhấn mạnh: 'Reaching the summit is optional; coming back down safely is mandatory. I tell every climber that your ego must never overrule safety judgment'."
          }
        ],
        "transcript": [
          {
            "speaker": "Interviewer",
            "en": "Welcome back Marcus. What first sparked your passion for wilderness expeditions?",
            "vi": "Chào mừng anh quay trở lại Marcus. Điều gì lần đầu tiên đã thắp lên niềm đam mê của anh với những chuyến thám hiểm thiên nhiên hoang dã?"
          },
          {
            "speaker": "Marcus",
            "en": "People often think I read lots of adventure books, but the turning point was when my grandfather took me trekking in the Highlands when I was ten. Standing on that summit changed my perspective entirely.",
            "vi": "Người ta thường nghĩ tôi đọc nhiều tiểu thuyết phiêu lưu, nhưng bước ngoặt thực sự là khi ông nội đưa tôi đi leo núi đường dài ở vùng cao nguyên năm tôi lên mười tuổi. Đứng trên đỉnh núi ngày hôm ấy đã thay đổi hoàn toàn lăng kính nhìn đời của tôi."
          },
          {
            "speaker": "Marcus",
            "en": "Reaching the summit is optional; coming back down safely is mandatory. I tell every climber that your ego must never overrule safety judgment.",
            "vi": "Lên tới đỉnh núi là tùy chọn; nhưng trở về an toàn là mệnh lệnh bắt buộc. Tôi luôn bảo mọi nhà leo núi rằng cái tôi kiêu hãnh không bao giờ được lấn át phán đoán an toàn."
          }
        ]
      }
    ],
    "sourceType": "exam"
  },
  {
    "id": "exam_test_5",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 5: VSTEP B2 #2: Campus Announcements & Academic Lectures",
    "subtitle": "Đề Thi Chuẩn VSTEP • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (VSTEP)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on New Science Wing.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding New Science Wing?",
            "options": [
              {
                "key": "A",
                "text": "Permanent cancellation of all activities"
              },
              {
                "key": "B",
                "text": "A change in national currency, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "Updated procedures and schedules for New Science Wing"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến New Science Wing."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "It already ended last winter"
              },
              {
                "key": "B",
                "text": "Starting next Monday morning at 8:00 AM"
              },
              {
                "key": "C",
                "text": "In five years' time, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "B",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "An automated weather hotline"
              },
              {
                "key": "B",
                "text": "The local fire department"
              },
              {
                "key": "C",
                "text": "The administrative coordinator via email"
              }
            ],
            "correct": "C",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for New Science Wing, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho New Science Wing, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (VSTEP)",
        "instruction": "Questions 4-6. Listen to an expert talk about New Science Wing and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with New Science Wing?",
            "options": [
              {
                "key": "A",
                "text": "Finding enough paperclips, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "C",
                "text": "Convincing people that gravity exists, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "B",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Systematic training and international cooperation"
              },
              {
                "key": "B",
                "text": "Closing all universities, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "Pure luck without planning, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "A",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Return to 19th-century methods, according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "Wider adoption and stronger regulatory frameworks"
              },
              {
                "key": "C",
                "text": "Complete disappearance of the field"
              }
            ],
            "correct": "B",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating New Science Wing, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về New Science Wing, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  },
  {
    "id": "exam_test_6",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 6: VSTEP C1 #3: Urban Sustainability & Economic Shifts",
    "subtitle": "Đề Thi Chuẩn VSTEP • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (VSTEP)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on Carbon Pricing.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding Carbon Pricing?",
            "options": [
              {
                "key": "A",
                "text": "Permanent cancellation of all activities"
              },
              {
                "key": "B",
                "text": "Updated procedures and schedules for Carbon Pricing"
              },
              {
                "key": "C",
                "text": "A change in national currency, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến Carbon Pricing."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "It already ended last winter"
              },
              {
                "key": "B",
                "text": "Starting next Monday morning at 8:00 AM"
              },
              {
                "key": "C",
                "text": "In five years' time, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "The administrative coordinator via email"
              },
              {
                "key": "B",
                "text": "The local fire department"
              },
              {
                "key": "C",
                "text": "An automated weather hotline"
              }
            ],
            "correct": "A",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for Carbon Pricing, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho Carbon Pricing, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (VSTEP)",
        "instruction": "Questions 4-6. Listen to an expert talk about Carbon Pricing and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with Carbon Pricing?",
            "options": [
              {
                "key": "A",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "B",
                "text": "Finding enough paperclips, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "Convincing people that gravity exists, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "A",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Pure luck without planning, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Closing all universities, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "C",
                "text": "Systematic training and international cooperation"
              }
            ],
            "correct": "C",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Return to 19th-century methods, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "B",
                "text": "Wider adoption and stronger regulatory frameworks"
              },
              {
                "key": "C",
                "text": "Complete disappearance of the field"
              }
            ],
            "correct": "B",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating Carbon Pricing, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về Carbon Pricing, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  },
  {
    "id": "exam_test_7",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 7: VSTEP B1-B2 #4: Travel Advisories & Cultural Festivals",
    "subtitle": "Đề Thi Chuẩn VSTEP • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (VSTEP)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on Lantern Parade.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding Lantern Parade?",
            "options": [
              {
                "key": "A",
                "text": "Updated procedures and schedules for Lantern Parade"
              },
              {
                "key": "B",
                "text": "A change in national currency, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "Permanent cancellation of all activities"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến Lantern Parade."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "It already ended last winter"
              },
              {
                "key": "B",
                "text": "Starting next Monday morning at 8:00 AM"
              },
              {
                "key": "C",
                "text": "In five years' time, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "An automated weather hotline"
              },
              {
                "key": "B",
                "text": "The local fire department"
              },
              {
                "key": "C",
                "text": "The administrative coordinator via email"
              }
            ],
            "correct": "C",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for Lantern Parade, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho Lantern Parade, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (VSTEP)",
        "instruction": "Questions 4-6. Listen to an expert talk about Lantern Parade and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with Lantern Parade?",
            "options": [
              {
                "key": "A",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "B",
                "text": "Finding enough paperclips, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "Convincing people that gravity exists, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "A",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Closing all universities, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Systematic training and international cooperation"
              },
              {
                "key": "C",
                "text": "Pure luck without planning, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Wider adoption and stronger regulatory frameworks"
              },
              {
                "key": "B",
                "text": "Return to 19th-century methods, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "Complete disappearance of the field"
              }
            ],
            "correct": "A",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating Lantern Parade, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về Lantern Parade, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  },
  {
    "id": "exam_test_8",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 8: VSTEP B2-C1 #5: Workplace Ethics & Digital Privacy",
    "subtitle": "Đề Thi Chuẩn VSTEP • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (VSTEP)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on Data Encryption.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding Data Encryption?",
            "options": [
              {
                "key": "A",
                "text": "Permanent cancellation of all activities"
              },
              {
                "key": "B",
                "text": "A change in national currency, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "Updated procedures and schedules for Data Encryption"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến Data Encryption."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "It already ended last winter"
              },
              {
                "key": "B",
                "text": "Starting next Monday morning at 8:00 AM"
              },
              {
                "key": "C",
                "text": "In five years' time, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "B",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "The local fire department"
              },
              {
                "key": "B",
                "text": "The administrative coordinator via email"
              },
              {
                "key": "C",
                "text": "An automated weather hotline"
              }
            ],
            "correct": "B",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for Data Encryption, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho Data Encryption, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (VSTEP)",
        "instruction": "Questions 4-6. Listen to an expert talk about Data Encryption and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with Data Encryption?",
            "options": [
              {
                "key": "A",
                "text": "Convincing people that gravity exists, in accordance with recently revised statutory regulations"
              },
              {
                "key": "B",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "C",
                "text": "Finding enough paperclips, which remains subject to further departmental verification"
              }
            ],
            "correct": "B",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Systematic training and international cooperation"
              },
              {
                "key": "B",
                "text": "Pure luck without planning, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "Closing all universities, primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "A",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Wider adoption and stronger regulatory frameworks"
              },
              {
                "key": "B",
                "text": "Return to 19th-century methods, which remains subject to further departmental verification"
              },
              {
                "key": "C",
                "text": "Complete disappearance of the field"
              }
            ],
            "correct": "A",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating Data Encryption, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về Data Encryption, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  },
  {
    "id": "exam_test_9",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 9: VSTEP C1 #6: Marine Ecology & Climate Models",
    "subtitle": "Đề Thi Chuẩn VSTEP • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (VSTEP)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on Ocean Currents.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding Ocean Currents?",
            "options": [
              {
                "key": "A",
                "text": "Permanent cancellation of all activities"
              },
              {
                "key": "B",
                "text": "Updated procedures and schedules for Ocean Currents"
              },
              {
                "key": "C",
                "text": "A change in national currency, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến Ocean Currents."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "It already ended last winter"
              },
              {
                "key": "B",
                "text": "Starting next Monday morning at 8:00 AM"
              },
              {
                "key": "C",
                "text": "In five years' time, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "B",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "An automated weather hotline"
              },
              {
                "key": "B",
                "text": "The administrative coordinator via email"
              },
              {
                "key": "C",
                "text": "The local fire department"
              }
            ],
            "correct": "B",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for Ocean Currents, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho Ocean Currents, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (VSTEP)",
        "instruction": "Questions 4-6. Listen to an expert talk about Ocean Currents and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with Ocean Currents?",
            "options": [
              {
                "key": "A",
                "text": "Convincing people that gravity exists, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "C",
                "text": "Finding enough paperclips, as highlighted during the initial stakeholder orientation phase"
              }
            ],
            "correct": "B",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Pure luck without planning, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "B",
                "text": "Closing all universities, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Systematic training and international cooperation"
              }
            ],
            "correct": "C",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Return to 19th-century methods, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "Wider adoption and stronger regulatory frameworks"
              },
              {
                "key": "C",
                "text": "Complete disappearance of the field"
              }
            ],
            "correct": "B",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating Ocean Currents, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về Ocean Currents, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  },
  {
    "id": "exam_test_10",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 10: Cambridge B2 First #2: Radio Documentary & Interviews",
    "subtitle": "Đề Thi Chuẩn Cambridge • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (Cambridge)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on Architectural Restoration.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding Architectural Restoration?",
            "options": [
              {
                "key": "A",
                "text": "Updated procedures and schedules for Architectural Restoration"
              },
              {
                "key": "B",
                "text": "A change in national currency, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "Permanent cancellation of all activities, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến Architectural Restoration."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "It already ended last winter"
              },
              {
                "key": "B",
                "text": "In five years' time, in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "Starting next Monday morning at 8:00 AM"
              }
            ],
            "correct": "C",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "The local fire department"
              },
              {
                "key": "B",
                "text": "An automated weather hotline"
              },
              {
                "key": "C",
                "text": "The administrative coordinator via email"
              }
            ],
            "correct": "C",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for Architectural Restoration, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho Architectural Restoration, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (Cambridge)",
        "instruction": "Questions 4-6. Listen to an expert talk about Architectural Restoration and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with Architectural Restoration?",
            "options": [
              {
                "key": "A",
                "text": "Convincing people that gravity exists, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "B",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "C",
                "text": "Finding enough paperclips, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Pure luck without planning, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Closing all universities, in accordance with recently revised statutory regulations"
              },
              {
                "key": "C",
                "text": "Systematic training and international cooperation"
              }
            ],
            "correct": "C",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Wider adoption and stronger regulatory frameworks"
              },
              {
                "key": "B",
                "text": "Return to 19th-century methods, which remains subject to further departmental verification"
              },
              {
                "key": "C",
                "text": "Complete disappearance of the field"
              }
            ],
            "correct": "A",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating Architectural Restoration, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về Architectural Restoration, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  },
  {
    "id": "exam_test_11",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 11: Cambridge B2 First #3: Youth Volunteering & Museum Guide",
    "subtitle": "Đề Thi Chuẩn Cambridge • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (Cambridge)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on Coastal Cleanup.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding Coastal Cleanup?",
            "options": [
              {
                "key": "A",
                "text": "Permanent cancellation of all activities"
              },
              {
                "key": "B",
                "text": "A change in national currency, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Updated procedures and schedules for Coastal Cleanup"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến Coastal Cleanup."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "It already ended last winter"
              },
              {
                "key": "B",
                "text": "Starting next Monday morning at 8:00 AM"
              },
              {
                "key": "C",
                "text": "In five years' time, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "An automated weather hotline"
              },
              {
                "key": "B",
                "text": "The administrative coordinator via email"
              },
              {
                "key": "C",
                "text": "The local fire department"
              }
            ],
            "correct": "B",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for Coastal Cleanup, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho Coastal Cleanup, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (Cambridge)",
        "instruction": "Questions 4-6. Listen to an expert talk about Coastal Cleanup and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with Coastal Cleanup?",
            "options": [
              {
                "key": "A",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "B",
                "text": "Convincing people that gravity exists, following rigorous cross-sectional evaluations of sample data"
              },
              {
                "key": "C",
                "text": "Finding enough paperclips, in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "A",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Systematic training and international cooperation"
              },
              {
                "key": "B",
                "text": "Pure luck without planning, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "C",
                "text": "Closing all universities, without taking into account prolonged systemic fluctuations"
              }
            ],
            "correct": "A",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Wider adoption and stronger regulatory frameworks"
              },
              {
                "key": "B",
                "text": "Return to 19th-century methods, according to standardized performance benchmarking metrics"
              },
              {
                "key": "C",
                "text": "Complete disappearance of the field"
              }
            ],
            "correct": "A",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating Coastal Cleanup, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về Coastal Cleanup, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  },
  {
    "id": "exam_test_12",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 12: Cambridge C1 Advanced #4: Expert Panel & Literary Critics",
    "subtitle": "Đề Thi Chuẩn Cambridge • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (Cambridge)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on Modernist Fiction.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding Modernist Fiction?",
            "options": [
              {
                "key": "A",
                "text": "Updated procedures and schedules for Modernist Fiction"
              },
              {
                "key": "B",
                "text": "Permanent cancellation of all activities"
              },
              {
                "key": "C",
                "text": "A change in national currency, as demonstrated in multiple peer-reviewed observational studies"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến Modernist Fiction."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "Starting next Monday morning at 8:00 AM"
              },
              {
                "key": "B",
                "text": "It already ended last winter"
              },
              {
                "key": "C",
                "text": "In five years' time, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "A",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "The local fire department"
              },
              {
                "key": "B",
                "text": "The administrative coordinator via email"
              },
              {
                "key": "C",
                "text": "An automated weather hotline"
              }
            ],
            "correct": "B",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for Modernist Fiction, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho Modernist Fiction, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (Cambridge)",
        "instruction": "Questions 4-6. Listen to an expert talk about Modernist Fiction and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with Modernist Fiction?",
            "options": [
              {
                "key": "A",
                "text": "Convincing people that gravity exists, concerning long-term environmental sustainability and impact"
              },
              {
                "key": "B",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "C",
                "text": "Finding enough paperclips, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Pure luck without planning, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "Closing all universities, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "C",
                "text": "Systematic training and international cooperation"
              }
            ],
            "correct": "C",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Complete disappearance of the field"
              },
              {
                "key": "B",
                "text": "Return to 19th-century methods, as highlighted during the initial stakeholder orientation phase"
              },
              {
                "key": "C",
                "text": "Wider adoption and stronger regulatory frameworks"
              }
            ],
            "correct": "C",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating Modernist Fiction, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về Modernist Fiction, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  },
  {
    "id": "exam_test_13",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 13: Cambridge C1 Advanced #5: Cognitive Science Symposium",
    "subtitle": "Đề Thi Chuẩn Cambridge • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (Cambridge)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on Attention Economy.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding Attention Economy?",
            "options": [
              {
                "key": "A",
                "text": "Updated procedures and schedules for Attention Economy"
              },
              {
                "key": "B",
                "text": "A change in national currency, as demonstrated in multiple peer-reviewed observational studies"
              },
              {
                "key": "C",
                "text": "Permanent cancellation of all activities"
              }
            ],
            "correct": "A",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến Attention Economy."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "Starting next Monday morning at 8:00 AM"
              },
              {
                "key": "B",
                "text": "It already ended last winter"
              },
              {
                "key": "C",
                "text": "In five years' time, following rigorous cross-sectional evaluations of sample data"
              }
            ],
            "correct": "A",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "An automated weather hotline"
              },
              {
                "key": "B",
                "text": "The administrative coordinator via email"
              },
              {
                "key": "C",
                "text": "The local fire department"
              }
            ],
            "correct": "B",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for Attention Economy, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho Attention Economy, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (Cambridge)",
        "instruction": "Questions 4-6. Listen to an expert talk about Attention Economy and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with Attention Economy?",
            "options": [
              {
                "key": "A",
                "text": "Convincing people that gravity exists, based on conventional assumptions of consumer market behavior"
              },
              {
                "key": "B",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "C",
                "text": "Finding enough paperclips, despite conflicting preliminary feedback from secondary surveys"
              }
            ],
            "correct": "B",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Closing all universities, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "Systematic training and international cooperation"
              },
              {
                "key": "C",
                "text": "Pure luck without planning, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Complete disappearance of the field"
              },
              {
                "key": "B",
                "text": "Return to 19th-century methods, without taking into account prolonged systemic fluctuations"
              },
              {
                "key": "C",
                "text": "Wider adoption and stronger regulatory frameworks"
              }
            ],
            "correct": "C",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating Attention Economy, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về Attention Economy, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  },
  {
    "id": "exam_test_14",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 14: HP3 An Ninh #3: Đề Luyện Chuyên Sâu Bộ Công An",
    "subtitle": "Đề Thi Chuẩn HP3 • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (HP3)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on Forensic Digital Evidence.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding Forensic Digital Evidence?",
            "options": [
              {
                "key": "A",
                "text": "A change in national currency, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "B",
                "text": "Permanent cancellation of all activities, despite conflicting preliminary feedback from secondary surveys"
              },
              {
                "key": "C",
                "text": "Updated procedures and schedules for Forensic Digital Evidence"
              }
            ],
            "correct": "C",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến Forensic Digital Evidence."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "In five years' time, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "Starting next Monday morning at 8:00 AM"
              },
              {
                "key": "C",
                "text": "It already ended last winter"
              }
            ],
            "correct": "B",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "The local fire department"
              },
              {
                "key": "B",
                "text": "An automated weather hotline"
              },
              {
                "key": "C",
                "text": "The administrative coordinator via email"
              }
            ],
            "correct": "C",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for Forensic Digital Evidence, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho Forensic Digital Evidence, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (HP3)",
        "instruction": "Questions 4-6. Listen to an expert talk about Forensic Digital Evidence and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with Forensic Digital Evidence?",
            "options": [
              {
                "key": "A",
                "text": "Convincing people that gravity exists, which remains subject to further departmental verification"
              },
              {
                "key": "B",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "C",
                "text": "Finding enough paperclips, in accordance with recently revised statutory regulations"
              }
            ],
            "correct": "B",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Pure luck without planning, according to standardized performance benchmarking metrics"
              },
              {
                "key": "B",
                "text": "Systematic training and international cooperation"
              },
              {
                "key": "C",
                "text": "Closing all universities, according to standardized performance benchmarking metrics"
              }
            ],
            "correct": "B",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Return to 19th-century methods, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "Wider adoption and stronger regulatory frameworks"
              },
              {
                "key": "C",
                "text": "Complete disappearance of the field"
              }
            ],
            "correct": "B",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating Forensic Digital Evidence, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về Forensic Digital Evidence, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  },
  {
    "id": "exam_test_15",
    "sourceType": "exam",
    "title": "ĐỀ SỐ 15: HP3 An Ninh #4: Đề Thi Mô Phỏng Học Viện Kỹ Thuật",
    "subtitle": "Đề Thi Chuẩn HP3 • 2 Parts • Audio & Lời thoại song ngữ kèm giải thích chi tiết",
    "parts": [
      {
        "partNumber": 1,
        "title": "Part 1: Short Dialogues & Announcements (HP3)",
        "instruction": "Questions 1-3. Choose the correct letter, A, B or C. Focus on Cybersecurity Protocols.",
        "questions": [
          {
            "id": 1,
            "text": "1. What is the main announcement regarding Cybersecurity Protocols?",
            "options": [
              {
                "key": "A",
                "text": "Permanent cancellation of all activities, primarily due to budgetary constraints and operational overheads"
              },
              {
                "key": "B",
                "text": "Updated procedures and schedules for Cybersecurity Protocols"
              },
              {
                "key": "C",
                "text": "A change in national currency, concerning long-term environmental sustainability and impact"
              }
            ],
            "correct": "B",
            "explanation": "Thông báo trình bày quy trình và lịch trình cập nhật liên quan đến Cybersecurity Protocols."
          },
          {
            "id": 2,
            "text": "2. When does the new arrangement take effect?",
            "options": [
              {
                "key": "A",
                "text": "Starting next Monday morning at 8:00 AM"
              },
              {
                "key": "B",
                "text": "In five years' time, which remains subject to further departmental verification"
              },
              {
                "key": "C",
                "text": "It already ended last winter"
              }
            ],
            "correct": "A",
            "explanation": "Lịch mới bắt đầu có hiệu lực từ 8 giờ sáng thứ Hai tuần tới."
          },
          {
            "id": 3,
            "text": "3. Who should participants contact for special accommodations?",
            "options": [
              {
                "key": "A",
                "text": "The administrative coordinator via email"
              },
              {
                "key": "B",
                "text": "The local fire department"
              },
              {
                "key": "C",
                "text": "An automated weather hotline"
              }
            ],
            "correct": "A",
            "explanation": "Người tham gia cần liên hệ điều phối viên hành chính qua email để được hỗ trợ đặc biệt."
          }
        ],
        "transcript": [
          {
            "speaker": "Coordinator",
            "en": "Please note the updated procedures and schedules for Cybersecurity Protocols, taking effect next Monday morning at 8:00 AM. Anyone requiring special accommodations should email our administrative coordinator beforehand.",
            "vi": "Vui lòng lưu ý quy trình và lịch trình cập nhật cho Cybersecurity Protocols, có hiệu lực từ 8:00 sáng thứ Hai tuần tới. Bất kỳ ai cần hỗ trợ đặc biệt vui lòng gửi email trước cho điều phối viên hành chính."
          }
        ]
      },
      {
        "partNumber": 2,
        "title": "Part 2: Extended Talk / Lecture (HP3)",
        "instruction": "Questions 4-6. Listen to an expert talk about Cybersecurity Protocols and answer the questions.",
        "questions": [
          {
            "id": 4,
            "text": "4. What is the primary challenge associated with Cybersecurity Protocols?",
            "options": [
              {
                "key": "A",
                "text": "Finding enough paperclips, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "Balancing rapid innovation with strict reliability standards"
              },
              {
                "key": "C",
                "text": "Convincing people that gravity exists, under specific experimental conditions evaluated by the committee"
              }
            ],
            "correct": "B",
            "explanation": "Thách thức cốt lõi là cân bằng giữa đổi mới nhanh chóng và tiêu chuẩn độ tin cậy nghiêm ngặt."
          },
          {
            "id": 5,
            "text": "5. Which factor contributed most to recent progress?",
            "options": [
              {
                "key": "A",
                "text": "Closing all universities, under specific experimental conditions evaluated by the committee"
              },
              {
                "key": "B",
                "text": "Systematic training and international cooperation"
              },
              {
                "key": "C",
                "text": "Pure luck without planning, based on conventional assumptions of consumer market behavior"
              }
            ],
            "correct": "B",
            "explanation": "Đào tạo bài bản và hợp tác quốc tế là nhân tố chính thúc đẩy tiến bộ gần đây."
          },
          {
            "id": 6,
            "text": "6. What does the speaker expect in the coming decade?",
            "options": [
              {
                "key": "A",
                "text": "Complete disappearance of the field"
              },
              {
                "key": "B",
                "text": "Wider adoption and stronger regulatory frameworks"
              },
              {
                "key": "C",
                "text": "Return to 19th-century methods, primarily due to budgetary constraints and operational overheads"
              }
            ],
            "correct": "B",
            "explanation": "Diễn giả kỳ vọng sự ứng dụng rộng rãi hơn cùng khung pháp lý chặt chẽ hơn trong thập kỷ tới."
          }
        ],
        "transcript": [
          {
            "speaker": "Lecturer",
            "en": "When evaluating Cybersecurity Protocols, the primary challenge has always been balancing rapid innovation with strict reliability standards. Thanks to systematic training and international cooperation, we expect wider adoption and stronger regulatory frameworks over the next decade.",
            "vi": "Khi đánh giá về Cybersecurity Protocols, thách thức lớn nhất luôn là cân bằng giữa đổi mới nhanh và tiêu chuẩn tin cậy nghiêm ngặt. Nhờ đào tạo bài bản và hợp tác quốc tế, chúng tôi kỳ vọng ứng dụng rộng rãi hơn cùng hành lang pháp lý vững chắc trong thập kỷ tới."
          }
        ]
      }
    ]
  }
];
