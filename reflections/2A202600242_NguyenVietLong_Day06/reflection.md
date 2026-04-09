# Individual reflection — Nguyễn Việt Long (2A202600242)

## 1. Role
Frontend developer + integration support. Mình phụ trách dựng giao diện prototype, nối frontend với backend hiện có, chỉnh lại một phần prompt để flow demo bám đúng context người dùng, và hỗ trợ đóng gói file nộp bài của nhóm.

## 2. Đóng góp cụ thể
- Implement phần frontend cho prototype với React SPA gồm 2 màn hình chính: landing page và chatbot page, kèm flow nhập `Họ và tên` + `MSSV` trước khi chat.
- Nối frontend với backend qua API `/api/chat`, đảm bảo payload gửi đúng `message`, `mssv`, `student_name` và hiển thị loading, error, sources trong giao diện.
- Chỉnh lại system prompt trong `agent_service.py` để assistant bám hơn vào bối cảnh student support của nhóm thay vì trả lời lan man ngoài phạm vi.

## 3. SPEC phần nào mạnh nhất, phần nào yếu nhất? Vì sao?
- Mạnh nhất: phần **Top 3 failure modes**. Nhóm xác định khá đúng các rủi ro nguy hiểm như dữ liệu stale, nhầm học sinh và dùng tài liệu cũ. Đây là phần có giá trị thực tế nhất vì khi mình làm frontend và integration, mình thấy các failure này ảnh hưởng trực tiếp tới UX và độ tin cậy của sản phẩm.
- Yếu nhất: phần **ROI 3 kịch bản**. Phần này hợp lý về mặt trình bày nhưng trong bối cảnh hackathon 1 ngày thì assumption vẫn còn khá ước lượng, chưa có dữ liệu thật để kiểm chứng nên mức độ thuyết phục chưa mạnh bằng các phần còn lại.

## 4. Đóng góp khác
- Chuẩn hóa cách chạy prototype bằng Docker để không phụ thuộc vào việc máy local có cài Node hay không, giúp demo ổn định hơn.
- Viết `prototype-readme.md` để nhóm có file mô tả prototype, tools, level và cách chạy đúng format nộp bài.
- Hỗ trợ hoàn thiện đầu ra cuối bằng cách đổi `spec-draft.md` thành `spec-final.md` để repo nhóm khớp deliverables yêu cầu.

## 5. 1 điều học được trong hackathon mà trước đó chưa biết
Trước hackathon mình nghĩ frontend cho AI app chủ yếu là làm giao diện cho đẹp và gọi API được là đủ. Sau khi làm prototype này, mình hiểu rõ hơn rằng với AI product, frontend còn là nơi thể hiện trust: user đang chat trong context nào, dữ liệu nào được gửi lên, khi lỗi thì báo ra sao, và nguồn trả lời có hiển thị rõ hay không. Ngoài ra khi xem feedback của nhóm cho các team khác, mình cũng nhận ra vấn đề session, phân quyền và bảo vệ dữ liệu quan trọng gần như ngang với chất lượng model.

## 6. Nếu làm lại
Nếu làm lại, mình sẽ khóa sớm hơn 2 thứ ngay từ đầu:
- Thứ nhất là thống nhất narrative sản phẩm giữa spec và prototype. Spec của nhóm thiên về VinSchool/phụ huynh, còn backend prototype lại đi theo student assistant, nên phần copy, prompt và UI phải chỉnh khá muộn.
- Thứ hai là kiểm tra compatibility của stack sớm hơn, đặc biệt là Docker, package version và thư viện Weaviate. Nếu test từ đầu thì nhóm sẽ đỡ mất thời gian xử lý integration ở sát giờ chót.

## 7. AI giúp gì / AI sai gì
- **Giúp:** AI giúp mình dựng nhanh khung frontend ban đầu, gợi ý cấu trúc component, route, copy cho landing page và một số phần boilerplate integration. Nó cũng hữu ích khi cần tổng hợp nhanh nội dung để viết `prototype-readme.md`.
- **Sai/mislead:** AI có xu hướng đề xuất giải pháp nhìn hợp lý nhưng không luôn khớp với codebase hiện có. Ví dụ có chỗ narrative giao diện bị lệch với backend thực tế, và có gợi ý kỹ thuật cần chỉnh lại để tương thích với dependency/version đang dùng. Bài học mình rút ra là AI giúp tăng tốc rất tốt, nhưng với phần integration thì vẫn phải kiểm tra bằng git, Docker và contract backend thật.
