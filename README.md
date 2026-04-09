# NhomX100 — VinUni Student Support Agent

A demo chatbot for Đại học VinUni students that answers questions about academic regulations and personal student records. Built with a LangChain tool-calling agent over Groq LLM, using Weaviate Cloud for retrieval-augmented search of university regulations.

## Features

The agent has two tools:

- **`tra_cuu_hoc_vien`** — looks up a student profile from local JSON data
- **`tra_cuu_noi_quy`** — semantic search over university regulations via Weaviate Cloud `QueryAgent`

## Tech Stack

- **Backend** — Python, FastAPI, LangChain, Groq (`openai/gpt-oss-120b`)
- **Vector DB** — Weaviate Cloud with `Snowflake/snowflake-arctic-embed-l-v2.0` vectorizer
- **Embeddings** — HuggingFace `all-MiniLM-L6-v2`
- **Frontend** — ReactJS
- **Orchestration** — Docker Compose

## Project Structure

```
backend/         FastAPI app, agent service, tools, Weaviate client
frontend/        React chat UI
data/raw/        Source regulation text files
data/processed/  Chunked JSON + student/policy datasets
docker-compose.yml
```

Key files:
- [backend/app/main.py](backend/app/main.py) — FastAPI entrypoint
- [backend/app/routers/agent.py](backend/app/routers/agent.py) — `/api/chat` endpoint
- [backend/app/services/agent_service.py](backend/app/services/agent_service.py) — LangChain agent setup
- [backend/app/services/tools.py](backend/app/services/tools.py) — Tool definitions
- [backend/app/services/weaviate_client.py](backend/app/services/weaviate_client.py) — Weaviate Cloud client + indexing
- [backend/app/services/chunking_service.py](backend/app/services/chunking_service.py) — Regulation text chunker
- [frontend/src/App.js](frontend/src/App.js) — Chat UI

## Setup

1. Copy `.env.example` to `.env` and fill in:
   - `GROQ_API_KEY` — Groq LLM API key
   - `WEAVIATE_URL` — Weaviate Cloud cluster URL
   - `WEAVIATE_API_KEY` — Weaviate Cloud API key

2. (One-time) Process and index regulation data:

   ```bash
   python backend/app/services/chunking_service.py
   python backend/app/services/weaviate_client.py
   ```

## Running

### With Docker (recommended)

```bash
docker compose up --build
```

- Backend → http://localhost:8000
- Frontend → http://localhost:3000

### Local development

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm start
```

Run frontend tests:

```bash
cd frontend && npm test
```

## API

`POST /api/chat`

Request:
```json
{ "message": "Quy định về điểm danh là gì?" }
```

Response:
```json
{ "reply": "...", "sources": [...] }
```

Health check: `GET /health`
