# Individual reflection — [Ha Huy Hoang] ([2A202600054])

## 1. Role
API Route Engineer (Backend Integration). Phụ trách thiết kế và triển khai layer routing cho endpoint `/api/chat`, đóng vai trò cầu nối giữa frontend và backend LLM agent logic.

## 2. Đóng góp cụ thể
- Thiết kế `ChatRequest` model để chuẩn hóa dữ liệu từ frontend, gồm ba trường cốt lõi: `message` (câu hỏi user), `mssv` (mã sinh viên), `student_name` (tên sinh viên) để phục vụ personalization trong agent.
- Xây dựng endpoint `/chat` (POST) với kiểm tra type và validation tự động nhờ Pydantic, upstream request từ frontend và stream qua layer service.
- Triển khai `ChatResponse` model chuẩn hóa response với hai thành phần: `reply` (câu trả lời từ agent) và `sources` (danh sách nguồn trích dẫn cho traceability).
- Tích hợp async pattern bằng `await run_agent()` để đảm bảo non-blocking I/O khi gọi LLM qua API Groq.

## 3. SPEC mạnh/yếu
- Mạnh nhất: phần model validation. Pydantic schema đơn giản nhưng đủ để bắt lỗi input sơ khai (missing fields, type mismatch) mà không thêm phức tạp.
- Yếu nhất: phần error handling. Route chưa định nghĩa try-catch hoặc custom exception handler, nên nếu `run_agent()` raise exception thì sẽ fallback vào generic FastAPI 500 error mà không có thông tin context hữu ích cho debugging hoặc user experience.

## 4. Đóng góp khác
- Hỗ trợ định dạng dữ liệu sinh viên (`mssv`, `student_name`) để làm input cho tools như `tra_cuu_hoc_vien` trong agent, giúp agent có context về user mà không cần query thêm.
- Đảm bảo response sources được serialize thành list[str] để frontend dễ dàng render badge hoặc footnote.
- Hỗ trợ CORS configuration ở `main.py` để endpoint này có thể được call từ frontend React mà không bị block browser.

## 5. Điều học được
Ban đầu tôi nghĩ route chỉ là "pass-through" đơn giản từ frontend sang service layer. Nhưng sau khi implement, tôi nhận ra rằng việc định dạng input/output model là quan trọng để:
- Tạo계약 rõ ràng giữa frontend–backend (frontend biết rõ cần gửi gì, backend biết rõ sẽ nhận gì).
- Hỗ trợ auto-documentation qua Swagger UI (FastAPI tự sinh docs từ models).
- Dễ dàng extend sau nếu thêm field (VD: thêm `user_context` hay `session_id`).

## 6. Nếu làm lại
Mình sẽ:
- Thêm detailed logging ngay từ khi nhận request, để tracking request lifespan từ frontend → route → service → LLM → response.
- Triển khai custom exception handlers để trả về HTTP 4xx/5xx với meaningful error message thay vì generic 500.
- Thêm optional fields vào `ChatRequest` như `session_id`, `include_debug` để hỗ trợ debugging và session tracking từ sớm.
- Viết unit test cho route bằng TestClient, giả lập các scenario (valid input, missing field, service failure) để đảm bảo stability trước production.

## 7. AI giúp gì / AI sai gì
- Giúp: AI gợi ý dùng Pydantic BaseModel để validate request/response, và suggest async/await pattern để optimize I/O handling.
- Giúp: AI cung cấp template FastAPI router structure và best practice để route definition rõ ràng.
- Sai/mislead: AI từng gợi ý thêm middleware phức tạp cho authentication ở route level, nhưng lúc đó team chưa có cơ chế auth, nên advice đó là premature optimization.
- Bài học: dùng AI tốt nhất khi cần pattern hoặc boilerplate; nhưng phải sàng lọc advice dựa trên scope hiện tại và không cho phép "scope creep" bằng cách thêm feature chưa cần thiết.
