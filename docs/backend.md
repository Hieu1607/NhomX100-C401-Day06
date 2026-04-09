# Backend — Agent Demo (Đại học VinUni)

Tài liệu mô tả nội dung backend đã hoàn thiện cho hệ thống chatbot hỗ trợ học viên Đại học VinUni.

## 1. Tổng quan

Backend là ứng dụng **FastAPI** (Python) đóng vai trò cổng API cho chatbot. Nó sử dụng kiến trúc **RAG (Retrieval-Augmented Generation)** với một **LangChain tool-calling agent** làm lớp điều phối:

- **LLM:** Groq `openai/gpt-oss-120b` (qua `langchain-groq`)
- **Vector DB:** Weaviate Cloud (collection `Document` cho nội quy, `ChinhSachQuyDinh` cho chính sách) với vectorizer `Snowflake/snowflake-arctic-embed-l-v2.0`
- **Dữ liệu học viên:** JSON tĩnh trong [data/processed/](../data/processed/)
- **Framework:** FastAPI + Pydantic + LangChain 0.3.x

Backend expose một endpoint chat duy nhất, nhận câu hỏi kèm ngữ cảnh học viên (MSSV + tên), sau đó agent tự quyết định gọi công cụ nào để tra cứu dữ liệu trước khi trả lời.

## 2. Cấu trúc thư mục

```
backend/
├── Dockerfile
├── requirements.txt
└── app/
    ├── main.py                    # FastAPI entrypoint
    ├── routes/
    │   └── agent.py               # /api/chat endpoint
    └── services/
        ├── agent_service.py       # LangChain agent builder
        ├── tools.py               # 4 custom @tool của agent
        ├── weaviate_client.py     # Weaviate Cloud client + search
        └── chunking_service.py    # Xử lý chia chunk văn bản nội quy
```

## 3. Entrypoint — [backend/app/main.py](../backend/app/main.py)

- Nạp biến môi trường từ `.env` bằng `python-dotenv`
- Tạo `FastAPI(title="Agent Demo API")`
- Cấu hình **CORS** cho origin `http://localhost:3000` (frontend React)
- Mount router `agent` dưới prefix `/api`
- Expose `GET /health` trả về `{"status": "ok"}` để health-check

## 4. API Router — [backend/app/routes/agent.py](../backend/app/routes/agent.py)

### `POST /api/chat`

**Request body** (`ChatRequest`):

| Field | Type | Mô tả |
|---|---|---|
| `message` | `str` | Câu hỏi của học viên |
| `mssv` | `str` | Mã số sinh viên (ngữ cảnh bắt buộc) |
| `student_name` | `str` | Tên học viên (ngữ cảnh bắt buộc) |

**Response body** (`ChatResponse`):

| Field | Type | Mô tả |
|---|---|---|
| `reply` | `str` | Câu trả lời sinh ra bởi agent |
| `sources` | `list[str]` | Các nguồn tool đã được agent gọi để lấy dữ liệu (xem mục 6) |

Router ủy thác logic cho `run_agent()` trong `agent_service.py`.

## 5. Agent Service — [backend/app/services/agent_service.py](../backend/app/services/agent_service.py)

### `get_llm()`
Khởi tạo `ChatGroq` với model `openai/gpt-oss-120b`, `temperature=0` để đảm bảo tính ổn định của câu trả lời.

### `build_agent()`
Dựng `AgentExecutor` theo pattern **tool-calling agent** của LangChain:

1. **System prompt** định nghĩa vai trò trợ lý hỗ trợ học viên, luôn tone lịch sự, ưu tiên dữ liệu tra cứu thực tế, từ chối các câu hỏi ngoài phạm vi hỗ trợ học viên. Prompt nhận tham số `{mssv}` và `{student_name}` để agent biết ngữ cảnh học viên hiện tại.
2. **MessagesPlaceholder** `chat_history` (optional) và `agent_scratchpad` cho bước suy luận.
3. **Tools** — đăng ký 4 công cụ: `tra_cuu_ho_so`, `tra_cuu_hoc_tap`, `tra_cuu_tai_chinh`, `tra_cuu_noi_quy`.
4. Trả về `AgentExecutor` với `verbose=True` và `return_intermediate_steps=True` để thu thập tool calls.

### `run_agent(message, mssv, student_name) -> dict`
- Gọi `executor.invoke(...)` với input và ngữ cảnh học viên
- Duyệt `intermediate_steps` để thu thập danh sách tool đã được gọi thành công, map thành các nhãn nguồn: `ho_so`, `hoc_tap`, `tai_chinh`, `noi_quy`
- Trả về `{"reply": ..., "sources": [...]}`

## 6. Tools — [backend/app/services/tools.py](../backend/app/services/tools.py)

Mỗi tool là một hàm Python được trang trí `@tool` của LangChain, docstring được LLM dùng làm mô tả để quyết định khi nào gọi.

| Tool | Dữ liệu nguồn | Chức năng |
|---|---|---|
| `tra_cuu_ho_so(query)` | [data/processed/student_profiles.json](../data/processed/student_profiles.json) | Tra hồ sơ cá nhân (lớp, chương trình học, phụ huynh, liên hệ) theo tên hoặc MSSV |
| `tra_cuu_hoc_tap(query)` | [data/processed/hoctap_chuyencan.json](../data/processed/hoctap_chuyencan.json) | Tra điểm, đánh giá, chuyên cần, nhận xét giáo viên |
| `tra_cuu_tai_chinh(query)` | [data/processed/taichinh.json](../data/processed/taichinh.json) + `student_profiles.json` | Tra học phí, phí dịch vụ, công nợ, trạng thái thanh toán |
| `tra_cuu_noi_quy(query)` | Weaviate Cloud collection `Document` | Tìm kiếm ngữ nghĩa trên nội quy trường (theo chương/điều/nội dung) |

### Helpers chung
- `_load_json(filename)` — đọc JSON từ `data/processed/`
- `_find_student(data, query)` — tìm theo MSSV (uppercase) hoặc tên (lowercase, substring match)
- `_find_student_taichinh(data, query, profiles)` — tra tài chính bắc cầu qua `student_profiles.json` để cho phép tìm theo tên

### Ràng buộc bảo mật
Mỗi tool trả về một `⚠️ Lưu ý` ở cuối kết quả, nhắc nhở agent chỉ được trả lời về học viên được yêu cầu, không tiết lộ dữ liệu học viên khác.

## 7. Weaviate Client — [backend/app/services/weaviate_client.py](../backend/app/services/weaviate_client.py)

Module cung cấp toàn bộ logic giao tiếp với Weaviate Cloud.

### Kết nối
- `get_weaviate_client()` — kết nối bằng `weaviate.connect_to_weaviate_cloud()` với `WEAVIATE_URL` + `WEAVIATE_API_KEY` từ env

### Collections
| Collection | Mục đích | Vectorizer |
|---|---|---|
| `Document` | Nội quy trường (chunk theo điều/chương) | `text2vec_weaviate` (named vector `content_vector`) |
| `ChinhSachQuyDinh` | Chính sách quy định theo topic | `text2vec_weaviate` |

Cả hai đều dùng model embedding `Snowflake/snowflake-arctic-embed-l-v2.0`.

### Các hàm chính
- `create_collection(client)` / `create_policy_collection(client)` — tạo collection nếu chưa tồn tại
- `index_chunks(client, chunks_path)` — batch import chunks nội quy (batch size 100)
- `index_policies(client, policies_path)` — batch import policy JSON
- `search_noi_quy(query)` — entry point được `tra_cuu_noi_quy` tool gọi
- `search_chinh_sach(query)` — tra cứu chính sách
- `_search_collection(...)` — helper dùng chung: thử `near_text` (semantic), fallback sang `bm25` (lexical), trả về JSON top-4 kết quả. Nếu collection chưa tồn tại hoặc query lỗi, trả về thông báo thân thiện cho agent.

### Script indexer
Khi chạy trực tiếp `python backend/app/services/weaviate_client.py`, file sẽ nạp `.env`, kết nối Weaviate, tạo cả hai collections và index dữ liệu từ:
- [data/processed/quy_dinh_truong_hoc_chunks.json](../data/processed/quy_dinh_truong_hoc_chunks.json)
- [data/processed/chinhsach_quydinh.json](../data/processed/chinhsach_quydinh.json)

## 8. Chunking Service — [backend/app/services/chunking_service.py](../backend/app/services/chunking_service.py)

Tiện ích offline: đọc văn bản nội quy thô từ [data/raw/](../data/raw/), tách thành các chunk theo **chương** và **điều** (regex-based), ghép metadata (`chuong`, `dieu`, `source`, `doc_title`) và ghi JSON vào [data/processed/](../data/processed/). File này chạy một lần trước khi index vào Weaviate.

## 9. Dependencies — [backend/requirements.txt](../backend/requirements.txt)

| Package | Phiên bản | Mục đích |
|---|---|---|
| `fastapi` | 0.115.6 | Web framework |
| `uvicorn` | 0.34.0 | ASGI server |
| `weaviate-client` | 4.9.6 | Kết nối Weaviate Cloud |
| `python-dotenv` | 1.0.1 | Nạp `.env` |
| `pydantic` | 2.10.4 | Validation request/response |
| `langchain` | 0.3.14 | Agent framework |
| `langchain-groq` | 0.2.4 | Adapter cho Groq LLM |

> `langchain-core` được import trực tiếp trong `agent_service.py` và `tools.py` nhưng là transitive dependency của `langchain` nên không cần khai báo riêng.

## 10. Biến môi trường

Copy `.env.example` sang `.env` và điền các giá trị:

| Biến | Mô tả |
|---|---|
| `GROQ_API_KEY` | API key của Groq cho LLM `openai/gpt-oss-120b` |
| `WEAVIATE_URL` | URL cluster Weaviate Cloud |
| `WEAVIATE_API_KEY` | API key Weaviate Cloud |

## 11. Chạy backend

### Docker (cùng frontend)
```bash
docker compose up --build
```
Backend sẽ chạy tại `http://localhost:8000`, frontend tại `http://localhost:3000`.

### Local dev
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Index dữ liệu Weaviate (chạy một lần hoặc khi có dữ liệu mới)
```bash
# Tách nội quy thành chunks
python backend/app/services/chunking_service.py

# Index chunks + policies vào Weaviate Cloud
python backend/app/services/weaviate_client.py
```

## 12. Luồng xử lý một request

```
[Frontend]
   │  POST /api/chat { message, mssv, student_name }
   ▼
[routes/agent.py → chat()]
   │
   ▼
[agent_service.run_agent()]
   │
   ├─▶ build_agent() — dựng AgentExecutor với 4 tools
   │
   ├─▶ LLM (Groq) quyết định tool cần gọi dựa trên câu hỏi
   │     ├─▶ tra_cuu_ho_so      → đọc student_profiles.json
   │     ├─▶ tra_cuu_hoc_tap    → đọc hoctap_chuyencan.json
   │     ├─▶ tra_cuu_tai_chinh  → đọc taichinh.json (+ profiles)
   │     └─▶ tra_cuu_noi_quy    → Weaviate near_text / bm25
   │
   ├─▶ LLM sinh câu trả lời dựa trên kết quả tool
   │
   ▼
[ChatResponse { reply, sources }]
   │
   ▼
[Frontend hiển thị]
```
