# Individual reflection — [Nguyễn Quang Đăng] ([2A202600483])

## 1. Role
Backend engineer (RAG/Vector DB). Phụ trách thiết kế và triển khai phần Weaviate client cho chatbot.

## 2. Đóng góp cụ thể
- Thiết kế luồng kết nối Weaviate Cloud trong backend, bao gồm xác thực qua biến môi trường và quản lý vòng đời client.
- Xây dựng logic tạo và quản lý 2 collections: `Document` (nội quy) và `ChinhSachQuyDinh` (chính sách), định nghĩa schema + vectorizer cho từng loại dữ liệu.
- Viết pipeline indexing dữ liệu từ JSON vào Weaviate theo batch, có kiểm tra và log object lỗi để debug import.
- Triển khai hàm truy vấn semantic search cho 2 collections, có fallback từ `near_text` sang `bm25` để tăng độ ổn định khi truy vấn.

## 3. SPEC mạnh/yếu
- Mạnh nhất: phần failure modes. Nhóm xác định đúng các rủi ro thực tế của hệ thống RAG như dùng tài liệu lỗi thời, trả lời sai ngữ cảnh, hoặc user hỏi mơ hồ; mitigation cũng cụ thể (metadata rõ, truy vấn có điều kiện, bắt buộc hỏi thêm khi thiếu thông tin).
- Yếu nhất: phần ROI. Ba kịch bản conservative/realistic/optimistic còn gần nhau về assumption và chưa chỉ rõ biến nào thay đổi nhiều nhất (quy mô rollout, tỉ lệ adoption, tỉ lệ giảm tải hotline), nên sức thuyết phục chưa cao.

## 4. Đóng góp khác
- Hỗ trợ team chuẩn hóa dữ liệu đầu vào để index ổn định hơn (field naming, định dạng metadata, xử lý thiếu trường).
- Hỗ trợ test end-to-end từ API chat xuống layer truy vấn Weaviate để kiểm tra chất lượng câu trả lời và độ nhất quán nguồn trích dẫn.
- Review nhanh một số edge cases khi truy vấn thất bại (collection chưa khởi tạo, không có kết quả, lỗi query) để tránh backend trả lỗi khó hiểu cho frontend.

## 5. Điều học được
Trước hackathon mình nghĩ vector DB chỉ là "kho lưu embedding". Sau khi tự triển khai mới thấy chất lượng RAG phụ thuộc mạnh vào thiết kế schema, metadata và chiến lược query fallback. Nếu schema không phản ánh đúng domain thì retrieval kém, kéo theo LLM trả lời sai dù prompt tốt.

## 6. Nếu làm lại
Mình sẽ làm benchmark retrieval sớm hơn (ngay từ lúc có bộ dữ liệu đầu tiên), thay vì đợi gần demo mới test sâu. Cụ thể, mình sẽ chuẩn bị sẵn bộ test query theo nhóm chủ đề để đo nhanh precision@k/recall@k sau mỗi lần thay đổi schema hoặc cách index.

## 7. AI giúp gì / AI sai gì
- Giúp: AI hỗ trợ brainstorm nhanh các lựa chọn schema, gợi ý cách tách collection theo loại dữ liệu, và đề xuất các pattern xử lý lỗi/fallback khi query Weaviate thất bại.
- Sai/mislead: AI từng gợi ý thêm nhiều lớp kiến trúc nâng cao (re-ranking phức tạp, cache nhiều tầng, hybrid retrieval đầy đủ) vượt quá scope demo. Nếu làm theo hết thì dễ trễ tiến độ.
- Bài học: dùng AI tốt nhất ở bước mở rộng phương án và rà soát rủi ro; còn quyết định cuối phải bám sát mục tiêu milestone và giới hạn thời gian của nhóm.
