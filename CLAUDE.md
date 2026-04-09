# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Agent demo app for a university (Đại học ABC) student-support chatbot. Uses RAG (Retrieval-Augmented Generation) with LangChain agent framework, Groq LLM (`openai/gpt-oss-120b`), Weaviate Cloud vector database (with Weaviate `QueryAgent` for semantic search), and HuggingFace embeddings (`all-MiniLM-L6-v2`). Python/FastAPI backend, ReactJS frontend, orchestrated via Docker Compose.

The agent has 2 tools:
- `tra_cuu_hoc_vien` — student profile lookup from local JSON data
- `tra_cuu_noi_quy` — university regulation search via Weaviate Cloud QueryAgent

## Commands

```bash
# Start all services (backend + frontend + local Weaviate)
docker compose up --build

# Backend only (local dev, requires venv)
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend only (local dev)
cd frontend && npm install && npm start

# Run frontend tests
cd frontend && npm test

# Process raw regulation text into chunks
python backend/app/services/chunking_service.py

# Index chunks into Weaviate Cloud (requires .env with WEAVIATE_URL + WEAVIATE_API_KEY)
python backend/app/services/weaviate_client.py
```

## Architecture

- **docker-compose.yml** — 3 services: `weaviate` (local vector DB on :8080/:50051), `backend` (FastAPI on :8000), `frontend` (React on :3000)
- **backend/app/main.py** — FastAPI entrypoint, CORS configured for `localhost:3000`, includes `/health` endpoint
- **backend/app/routers/agent.py** — `/api/chat` endpoint (POST), receives `message`, returns `reply` + `sources`
- **backend/app/services/agent_service.py** — LangChain tool-calling agent: Groq LLM + 2 tools (`tra_cuu_hoc_vien`, `tra_cuu_noi_quy`), `build_agent()` creates AgentExecutor, `run_agent()` is the async entrypoint
- **backend/app/services/tools.py** — Custom LangChain `@tool` definitions: student lookup (from JSON) and regulation search (via Weaviate QueryAgent)
- **backend/app/services/weaviate_client.py** — Weaviate Cloud client (`connect_to_weaviate_cloud`), collection creation with `Snowflake/snowflake-arctic-embed-l-v2.0` vectorizer, batch indexing, and `search_noi_quy()` using Weaviate `QueryAgent`
- **backend/app/services/chunking_service.py** — Splits raw regulation text (`data/raw/`) into per-article chunks with chapter/article metadata, outputs to `data/processed/`
- **frontend/src/App.js** — Main React component, manages chat state
- **frontend/src/api.js** — Axios client, calls backend at `REACT_APP_API_URL` (default `http://localhost:8000/api`)
- **frontend/src/components/** — `ChatWindow` (message display) and `ChatInput` (user input form)

## Data

- **data/raw/** — Source regulation text files (e.g., `quy_dinh_truong_hoc.txt`)
- **data/processed/** — Chunked JSON files for indexing + student/policy JSON datasets (`du_lieu_hoc_vien.json`, `hoctap_chuyencan.json`, `taichinh.json`, `chinhsach_quydinh.json`, `student_profiles.json`)

## Environment Variables

Copy `.env.example` to `.env` and set:
- `GROQ_API_KEY` — API key for Groq LLM
- `WEAVIATE_URL` — Weaviate Cloud cluster URL
- `WEAVIATE_API_KEY` — Weaviate Cloud API key
