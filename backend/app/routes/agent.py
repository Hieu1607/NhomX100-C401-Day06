from app.services.agent_service import run_agent
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    mssv: str
    student_name: str


class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = []


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    result = await run_agent(request.message, request.mssv, request.student_name)
    return ChatResponse(reply=result["reply"], sources=result.get("sources", []))
