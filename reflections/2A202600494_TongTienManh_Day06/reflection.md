# Individual Reflection — Tống Tiến Mạnh (AI20K001)

## 1. Role
Backend developer + tool engineer. Phụ trách thiết kế và triển khai các công cụ tra cứu (tools) cho hệ thống chatbot hỗ trợ học viên VinUni.

## 2. Đóng góp cụ thể
- Thiết kế kiến trúc module `tools.py` với 4 công cụ tra cứu độc lập: hồ sơ cá nhân, kết quả học tập, tài chính, và nội quy nhà trường
- Viết hai hàm helper nội bộ `_find_student` và `_find_student_taichinh` để xử lý tra cứu linh hoạt theo cả MSSV lẫn tên học viên (không phân biệt hoa thường)
- Tích hợp Weaviate vector database cho tool `tra_cuu_noi_quy`, cho phép tìm kiếm ngữ nghĩa trên các chính sách nhà trường thay vì keyword matching đơn thuần
- Quyết định tách `_find_student_taichinh` riêng vì dữ liệu tài chính lưu theo MSSV nhưng user có thể query bằng tên — cần join qua `student_profiles.json` làm bước trung gian

## 3. Điểm mạnh / yếu trong thiết kế

**Mạnh nhất:** Thiết kế hàm tra cứu chịu được cả hai dạng input (MSSV và tên). Thực tế người dùng (phụ huynh, học viên) không phải lúc nào cũng nhớ MSSV — hỗ trợ tìm theo tên giúp tool dùng được trong thực tế hơn nhiều.

**Yếu nhất:** Tool `tra_cuu_hoc_vien` bị comment out và chưa được thay thế rõ ràng. Khi đọc lại code không rõ đây là tính năng bị loại bỏ hẳn hay đang chờ refactor — nên có comment giải thích lý do hoặc xóa hẳn để tránh gây nhầm lẫn cho teammate.

## 4. Đóng góp khác
- Viết docstring chuẩn cho từng `@tool` để LangChain agent hiểu đúng ngữ cảnh gọi tool — nếu mô tả mơ hồ, agent dễ gọi nhầm tool hoặc không gọi khi cần
- Chuẩn hóa pattern xử lý lỗi thống nhất: tất cả tools đều trả về chuỗi thông báo thay vì raise exception, giúp agent downstream không bị crash khi không tìm thấy dữ liệu

## 5. Điều học được
Trước đây nghĩ viết tool cho LLM agent cũng giống viết hàm thông thường — chỉ cần đúng logic là đủ. Sau khi làm mới hiểu: **docstring của tool chính là "interface" để LLM ra quyết định gọi tool**. Nếu mô tả không rõ ràng hoặc hai tool có mô tả trùng lặp, agent sẽ chọn sai — lỗi không nằm ở code mà nằm ở ngôn ngữ tự nhiên mô tả tool. Đây là dạng bug rất khó debug nếu không hiểu cơ chế bên dưới.

## 6. Nếu làm lại
Sẽ thêm một lớp validation đầu vào (kiểm tra format MSSV, chuẩn hóa tên trước khi tìm kiếm) thay vì để logic xử lý thô trực tiếp trong helper function. Ngoài ra sẽ viết unit test cho `_find_student` và `_find_student_taichinh` sớm hơn — hiện tại chỉ test thủ công, dễ bỏ sót edge case như tên có dấu viết không đúng hoặc MSSV có khoảng trắng thừa.

## 7. AI giúp gì / AI sai gì
- **Giúp:** Dùng Claude để brainstorm các edge case khi tìm kiếm tên học viên tiếng Việt (VD: tên không dấu, viết tắt họ). Gợi ý normalize về lowercase và strip whitespace — đơn giản nhưng hiệu quả, đã áp dụng ngay vào `_find_student`.
- **Sai/mislead:** Claude gợi ý dùng fuzzy matching (thư viện `fuzzywuzzy`) để tìm tên gần đúng — nghe hấp dẫn nhưng trong ngữ cảnh tra cứu dữ liệu học viên thật, kết quả gần đúng có thể trả về sai người, gây rủi ro nghiêm trọng về quyền riêng tư. Bài học: AI đề xuất tốt về mặt kỹ thuật nhưng không tự đánh giá được rủi ro về dữ liệu nhạy cảm — đó là trách nhiệm của người thiết kế.