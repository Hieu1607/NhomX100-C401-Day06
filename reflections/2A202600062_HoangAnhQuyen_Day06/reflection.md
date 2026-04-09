# Individual reflection - Hoang Anh Quyen (2A202600062)

## 1. Role
Backend developer. Phụ trách viết `agent_service.py` để khởi tạo và điều phối LangChain agent cho chatbot hỗ trợ học viên VinUni.

## 2. Đóng góp cụ thể
- Xây dựng hàm `get_llm()` để chuẩn hóa cấu hình Groq model `openai/gpt-oss-120b` với `temperature=0`, giúp câu trả lời ổn định hơn.
- Thiết kế prompt hệ thống trong `build_agent()` để agent trả lời đúng vai trò student support assistant, dùng đúng context của từng học viên (`MSSV`, `student_name`) và từ chối các câu hỏi ngoài phạm vi.
- Kết nối agent với 4 tool tra cứu: hồ sơ, học tập, tài chính và nội quy, để chatbot ưu tiên trả lời dựa trên dữ liệu thật thay vì suy đoán.
- Cấu hình `AgentExecutor` với `max_iterations=3`, `return_intermediate_steps=True` và `early_stopping_method="force"` để vừa giới hạn vòng lặp vừa giữ lại dấu vết truy xuất cho bước xử lý sau.
- Viết `_summarize_with_llm()` để tổng hợp lại câu trả lời từ các tool outputs khi agent bị dừng vì chạm giới hạn số lần gọi tool, giúp hệ thống vẫn trả ra phản hồi hữu ích thay vì báo lỗi cứng.
- Viết `run_agent()` để gom đầu vào, chạy agent, xử lý fallback summary và trả về cả `reply` lẫn `sources` cho API/frontend sử dụng.

## 3. SPEC mạnh/yếu
- Mạnh nhất: SPEC có hướng đi rõ về giá trị sản phẩm, tức là chatbot không chỉ chat chung chung mà phải trả lời dựa trên dữ liệu học viên và nội quy trường. Điều này giúp phần agent orchestration có mục tiêu rất cụ thể: ưu tiên grounded answers và gắn context theo đúng từng sinh viên.
- Mạnh nhất nữa là phạm vi tool khá thực tế: hồ sơ, học tập, tài chính, nội quy. Đây là các nhóm câu hỏi đúng với nhu cầu hỗ trợ sinh viên và đủ khác nhau để agent thể hiện được khả năng điều phối.
- Yếu nhất: SPEC chưa mô tả kỹ failure cases của agent, ví dụ khi agent gọi tool chưa đủ thông tin, gọi lặp lại, hoặc dừng ở `max_iterations` thì phải trả lời thế nào. Trong lúc làm em phải tự bổ sung cơ chế fallback summary để tránh trải nghiệm xấu cho người dùng.
- Yếu nữa là SPEC chưa nêu rõ tiêu chí đánh giá chất lượng câu trả lời, ví dụ thế nào là "đúng", "đủ", "an toàn", hay khi nào nên từ chối. Nếu có rubric sớm hơn thì việc tinh chỉnh prompt và hành vi agent sẽ nhanh hơn.

## 4. Đóng góp khác
- Phối hợp với phần tool để bảo đảm agent gọi đúng các hàm tra cứu và truyền đúng context học viên.
- Hỗ trợ hoàn thiện luồng backend bằng cách chuẩn hóa dữ liệu trả về gồm `reply` và danh sách `sources`, giúp frontend có thể hiển thị nguồn thông tin rõ hơn.
- Đóng góp vào việc giới hạn scope của chatbot ở bài toán student support, tránh để agent trả lời lan sang các chủ đề ngoài phạm vi dự án.

## 5. Điều học được
Trước khi làm phần này em nghĩ agent chủ yếu là "nối model với tools". Sau khi viết `agent_service.py` em hiểu rõ hơn rằng phần khó nằm ở orchestration: phải đặt prompt đủ chặt để model biết khi nào dùng tool, biết bám đúng context học viên, và vẫn trả lời tử tế khi luồng tool-calling không diễn ra hoàn hảo. Em cũng học được rằng fallback handling rất quan trọng, vì trong sản phẩm thật người dùng chỉ nhìn thấy kết quả cuối chứ không quan tâm agent đã dừng ở iteration nào.

## 6. Nếu làm lại
Em sẽ thiết kế test cases cho agent sớm hơn, đặc biệt là các tình huống mơ hồ như hỏi thiếu MSSV, hỏi nhiều ý trong một câu, hoặc hỏi vừa nội quy vừa tài chính. Nếu test các case này sớm thì prompt và giới hạn tool-calling có thể được tinh chỉnh tốt hơn ngay từ đầu. Em cũng sẽ tách prompt ra file riêng hoặc config riêng để dễ versioning và so sánh các phương án hơn.

## 7. AI giúp gì / AI sai gì
- **Giúp:** AI hỗ trợ em brainstorm cách viết system prompt, cách tổ chức `AgentExecutor`, và gợi ý pattern fallback khi agent không sinh được câu trả lời cuối cùng dù đã có intermediate steps.
- **Giúp:** AI cũng hỗ trợ giải thích nhanh tài liệu LangChain, giúp em hiểu rõ hơn vai trò của `MessagesPlaceholder`, `agent_scratchpad` và `return_intermediate_steps`.
- **Sai/mislead:** Có lúc AI gợi ý prompt khá dài và ôm quá nhiều yêu cầu, nhìn thì đầy đủ nhưng nếu đưa hết vào hệ thống sẽ làm prompt khó kiểm soát hơn. Em phải tự rút gọn lại để tập trung vào đúng scope student support.
- **Sai/mislead:** AI thường giả định agent sẽ luôn hoàn thành tốt sau vài lần gọi tool, nhưng thực tế hệ thống vẫn có thể dừng sớm hoặc lặp. Bài học của em là AI hữu ích để gợi ý hướng làm, nhưng phần xử lý edge case và trải nghiệm thật vẫn phải tự kiểm chứng bằng code và test.
