# Prototype — School Assistant Chatbot

## Mô tả
Prototype này là một school assistant chatbot phục vụ tra cứu thông tin học sinh/sinh viên và nội quy/chính sách nhà trường theo ngôn ngữ tự nhiên. Ứng dụng gồm 2 phần chính: landing page để giới thiệu bài toán và chatbot page để demo flow thật với phần nhập `Họ và tên` và `MSSV` trước khi chat.

Frontend được build thành React SPA với 2 route `/` và `/chat`, kết nối tới FastAPI backend qua API `/api/chat`. Backend sử dụng LLM + tool calling để tra cứu dữ liệu hồ sơ, học tập, tài chính và nội quy từ nguồn dữ liệu đã chuẩn bị.

## Level: Working prototype
- Có giao diện landing page và chatbot page chạy thật
- Chatbot gọi API backend thật qua Docker Compose
- Backend có AI call thật qua Groq LLM và tích hợp Weaviate cho truy vấn nội quy

## Links
- Prototype local: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Health check: `http://localhost:8000/health`
- Source code: repo hiện tại

## Tools và API đã dùng
- Frontend: React, React Router, Axios, CSS thuần
- Backend: FastAPI, LangChain, Python
- LLM: Groq (`openai/gpt-oss-120b`)
- Vector database / retrieval: Weaviate
- Infra / run local: Docker, Docker Compose

## Tính năng chính của prototype
- Landing page giới thiệu narrative `SPEC -> Prototype -> Demo`
- Chatbot page có form nhập `Họ và tên` và `MSSV` trước khi bắt đầu chat
- Hiển thị trạng thái loading, lỗi kết nối và danh sách `sources` trong câu trả lời
- Hỗ trợ các nhóm câu hỏi chính:
  - Tra cứu hồ sơ học viên
  - Tra cứu học tập và chuyên cần
  - Tra cứu tài chính
  - Tra cứu nội quy, quy định

## Cách chạy prototype
```bash
docker compose up -d frontend backend
```

Sau khi chạy:
- Mở `http://localhost:3000` để xem giao diện
- Mở `http://localhost:8000/health` để kiểm tra backend

Để dừng:
```bash
docker compose down
```

## Phân công
| Thành viên | MSSV | Phần phụ trách |
|-----------|------|----------------|
| Nguyễn Minh Hiếu | 2A202600401 | Phần 1 |
| Nguyễn Quang Đăng | 2A202600483 | Phần 2 |
| Hoàng Anh Quyền | 2A202600062 | Phần 3 |
| Nguyễn Minh Tuấn | 2A202600183 | Phần 4 |
| Tống Tiến Mạnh | 2A202600494 | Phần 5 |
| Hà Huy Hoàng | 2A202600054 | Phần 6.1, 6.2 |
| Nguyễn Việt Long | 2A202600242 | Phần 6.3 |

## Ghi chú
- Prototype hiện ưu tiên demo flow end-to-end bằng Docker thay vì yêu cầu cài Node local
- Nội dung product trong spec draft thiên về VinSchool, còn prototype code hiện tại đang triển khai theo hướng school assistant trung tính để bám sát backend đã có
