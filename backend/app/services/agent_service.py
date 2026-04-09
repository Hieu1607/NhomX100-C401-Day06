from app.services.tools import (
    tra_cuu_ho_so,
    tra_cuu_hoc_tap,
    tra_cuu_noi_quy,
    tra_cuu_tai_chinh,
)
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq


def get_llm() -> ChatGroq:
    """Initialize Groq LLM."""
    return ChatGroq(model="openai/gpt-oss-120b", temperature=0)


def build_agent() -> AgentExecutor:
    """Build a LangChain agent with custom tools."""
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a student support assistant for Vinuni - Vinschool. Always answer in a polite, friendly, and professional tone. The current student context is: MSSV={mssv}, student_name={student_name}. Use this context to focus on the correct student. Use the provided tools to look up information before answering, and prioritize grounded answers based on retrieved data/documents when available. If the user asks about topics outside student support scope (e.g., unrelated general knowledge, politics, entertainment, or other non-student-support topics), politely refuse and guide them back to student-support questions.",
            ),
            MessagesPlaceholder(variable_name="chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ]
    )

    tools = [tra_cuu_ho_so, tra_cuu_hoc_tap, tra_cuu_tai_chinh, tra_cuu_noi_quy]

    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(
        agent=agent, tools=tools, verbose=True, return_intermediate_steps=True
    )


async def run_agent(message: str, mssv: str, student_name: str) -> dict:
    """Run the agent with a user message and return reply + sources."""
    executor = build_agent()
    result = executor.invoke(
        {
            "input": message,
            "mssv": mssv,
            "student_name": student_name,
        }
    )

    sources = []
    for step in result.get("intermediate_steps", []):
        action, observation = step
        if action.tool == "tra_cuu_noi_quy" and observation:
            sources.append("noi_quy")
        elif action.tool == "tra_cuu_ho_so" and observation:
            sources.append("ho_so")
        elif action.tool == "tra_cuu_hoc_tap" and observation:
            sources.append("hoc_tap")
        elif action.tool == "tra_cuu_tai_chinh" and observation:
            sources.append("tai_chinh")

    return {"reply": result["output"], "sources": sources}
