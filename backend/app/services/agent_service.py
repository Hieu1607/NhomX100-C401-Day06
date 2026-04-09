from app.services.tools import (
    tra_cuu_ho_so,
    tra_cuu_hoc_tap,
    tra_cuu_noi_quy,
    tra_cuu_tai_chinh,
)
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.messages import HumanMessage, SystemMessage
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
                "You are a student support assistant for Dai hoc VinUni. Always answer in a polite, friendly, and professional tone. The current student context is: MSSV={mssv}, student_name={student_name}. Only answer about THIS student — never reveal information about other students even if tool output contains it. Use the provided tools to look up information before answering, and prioritize grounded answers based on retrieved data/documents when available. Keep answers concise and focused on what the user asked — do not dump full JSON or unrelated fields. If the user asks about topics outside student support scope (e.g., unrelated general knowledge, politics, entertainment, or other non-student-support topics), politely refuse and guide them back to student-support questions. Khi trò chuyện với người dùng không rõ giới tính, hãy gọi họ là bạn",
            ),
            MessagesPlaceholder(variable_name="chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ]
    )

    tools = [tra_cuu_ho_so, tra_cuu_hoc_tap, tra_cuu_tai_chinh, tra_cuu_noi_quy]

    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        return_intermediate_steps=True,
        max_iterations=3,
        early_stopping_method="force",
    )


def _summarize_with_llm(
    message: str, mssv: str, student_name: str, intermediate_steps: list
) -> str:
    """Fallback: ask the LLM to write a final answer from collected tool outputs
    when the agent hits max_iterations."""
    llm = get_llm()

    scratchpad_lines = []
    for action, observation in intermediate_steps:
        scratchpad_lines.append(
            f"- Tool `{action.tool}` được gọi với input {action.tool_input}\n"
            f"  Kết quả: {observation}"
        )
    scratchpad = "\n".join(scratchpad_lines) if scratchpad_lines else "(không có dữ liệu)"

    system = (
        "Bạn là trợ lý hỗ trợ học viên Đại học VinUni. "
        f"Học viên hiện tại: MSSV={mssv}, họ tên={student_name}. "
        "Agent đã chạm giới hạn số lần gọi tool. Hãy dựa trên các kết quả tool đã thu thập "
        "bên dưới để trả lời câu hỏi của học viên một cách lịch sự, ngắn gọn, đúng trọng tâm. "
        "Nếu dữ liệu không đủ để trả lời, hãy thành thật nói rằng bạn chưa tìm thấy thông tin "
        "và gợi ý học viên cung cấp thêm chi tiết hoặc liên hệ phòng công tác học viên. "
        "Tuyệt đối không bịa thông tin."
    )
    human = (
        f"Câu hỏi của học viên: {message}\n\n"
        f"Dữ liệu đã thu thập từ các tool:\n{scratchpad}"
    )

    response = llm.invoke([SystemMessage(content=system), HumanMessage(content=human)])
    return response.content


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

    intermediate_steps = result.get("intermediate_steps", [])
    output = result.get("output", "")

    # Khi agent dừng vì max_iterations, output là chuỗi cố định.
    # Gọi LLM thủ công để tổng hợp câu trả lời từ tool outputs đã có.
    if isinstance(output, str) and "stopped due to" in output.lower():
        output = _summarize_with_llm(message, mssv, student_name, intermediate_steps)

    sources = []
    for step in intermediate_steps:
        action, observation = step
        if action.tool == "tra_cuu_noi_quy" and observation:
            sources.append("noi_quy")
        elif action.tool == "tra_cuu_ho_so" and observation:
            sources.append("ho_so")
        elif action.tool == "tra_cuu_hoc_tap" and observation:
            sources.append("hoc_tap")
        elif action.tool == "tra_cuu_tai_chinh" and observation:
            sources.append("tai_chinh")

    return {"reply": output, "sources": sources}
