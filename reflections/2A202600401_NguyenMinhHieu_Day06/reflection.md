# Individual reflection — [Nguyễn Minh Hiếu] ([2A202600401])

## 1. Role
Khởi tạo và tinh chỉnh backend, frontend.

## 2. Đóng góp cụ thể
- Khởi tạo dự án, tạo rootbase.
- Finetune kiến trúc agent, chỉnh sửa edge case cho kết quả tốt nhất.
- Tinh chỉnh frontend cho đẹp mắt hơn.

## 3. SPEC mạnh/yếu
- Mạnh nhất: phần failure modes. Nhóm xác định đúng các rủi ro thực tế của hệ thống RAG như dùng tài liệu lỗi thời, trả lời sai ngữ cảnh, hoặc user hỏi mơ hồ; mitigation cũng cụ thể (metadata rõ, truy vấn có điều kiện, bắt buộc hỏi thêm khi thiếu thông tin).
- Yếu nhất: phần ROI. Ba kịch bản conservative/realistic/optimistic còn gần nhau về assumption và chưa chỉ rõ biến nào thay đổi nhiều nhất (quy mô rollout, tỉ lệ adoption, tỉ lệ giảm tải hotline), nên sức thuyết phục chưa cao.

## 4. Đóng góp khác
- Hỗ trợ team tạo database trên Weaviate
- Hỗ trợ team tạo docs hiệu quả
- Hoàn thiện README.md

## 5. Điều học được
Mình học được cách làm toàn bộ agent bằng LangGraph. Tầm này mình đi làm được ròi.

## 6. Nếu làm lại
Mình sẽ thêm database thật về người dùng và tạo RBAC cụ thể hơn để dự án thật hơn. 

## 7. AI giúp gì / AI sai gì
- Giúp: AI hỗ trợ brainstorm nhanh các lựa chọn schema, gợi ý cách tách collection theo loại dữ liệu, và đề xuất các pattern xử lý lỗi/fallback khi query Weaviate thất bại.
- Sai/mislead: AI từng gợi ý thêm nhiều lớp kiến trúc nâng cao (re-ranking phức tạp, cache nhiều tầng, hybrid retrieval đầy đủ) vượt quá scope demo. Nếu làm theo hết thì dễ trễ tiến độ.
- Bài học: dùng AI tốt nhất ở bước mở rộng phương án và rà soát rủi ro; còn quyết định cuối phải bám sát mục tiêu milestone và giới hạn thời gian của nhóm.
