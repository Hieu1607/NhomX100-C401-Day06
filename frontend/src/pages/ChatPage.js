import React, { useMemo, useState } from "react";
import ChatInput from "../components/ChatInput";
import ChatWindow from "../components/ChatWindow";
import IdentityPanel from "../components/IdentityPanel";
import PromptSuggestions from "../components/PromptSuggestions";
import { sendMessage } from "../api";

const promptSuggestions = [
  "Cho mình biết nội quy liên quan đến thi cử.",
  "Tra cứu thông tin hồ sơ của mình.",
  "Mình muốn xem tình trạng học tập hiện tại.",
  "Những quy định nào áp dụng khi nghỉ học có phép?",
];

function ChatPage() {
  const [identity, setIdentity] = useState({ studentName: "", mssv: "" });
  const [session, setSession] = useState({ studentName: "", mssv: "" });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [identityLocked, setIdentityLocked] = useState(false);
  const [identityError, setIdentityError] = useState("");

  const welcomeName = useMemo(() => {
    if (!identityLocked) {
      return "bạn";
    }

    return session.studentName || "bạn";
  }, [identityLocked, session.studentName]);

  const lockIdentity = ({ studentName, mssv }) => {
    const trimmedName = studentName.trim().replace(/\s+/g, " ");
    const trimmedMssv = mssv.trim();

    if (!trimmedName || !trimmedMssv) {
      setIdentityError("Vui lòng nhập đầy đủ họ tên và mã số sinh viên.");
      return false;
    }

    setIdentity({ studentName: trimmedName, mssv: trimmedMssv });
    setSession({ studentName: trimmedName, mssv: trimmedMssv });
    setIdentityLocked(true);
    setIdentityError("");
    return true;
  };

  const unlockIdentity = () => {
    setIdentityLocked(false);
    setIdentityError("");
  };

  const handleIdentityChange = (nextIdentity) => {
    setIdentity(nextIdentity);
    if (identityError) {
      setIdentityError("");
    }
  };

  const handleSend = async (text) => {
    if (!identityLocked) {
      setIdentityError("Bạn cần khóa thông tin sinh viên trước khi bắt đầu chat.");
      return;
    }

    const userMessage = { id: `user-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await sendMessage({
        message: text,
        mssv: session.mssv,
        student_name: session.studentName,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          sources: data.sources,
        },
      ]);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.detail ||
        "Hiện chưa kết nối được tới backend hoặc dữ liệu chưa sẵn sàng. Bạn có thể thử lại sau ít giây.";

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (loading || !identityLocked) {
      return;
    }

    handleSend(suggestion);
  };

  return (
    <section className="chat-page">
      <div className="container">
        <div className="chat-page__heading">
          <div className="section-label">Chatbot page</div>
          <h1 className="chat-page__title">Student-context assistant</h1>
          <p className="section-copy">
            Nhập họ tên và MSSV trước, sau đó bắt đầu hỏi về hồ sơ, học tập, tài chính hoặc nội
            quy. Giao diện này giữ context rõ ràng để backend nhận đủ dữ liệu ngay từ tin nhắn đầu
            tiên.
          </p>
        </div>

        <div className="chat-layout">
          <aside className="chat-layout__sidebar">
            <IdentityPanel
              identity={identity}
              identityLocked={identityLocked}
              identityError={identityError}
              onIdentityChange={handleIdentityChange}
              onLockIdentity={lockIdentity}
              onUnlockIdentity={unlockIdentity}
              session={session}
            />

            <div className="quick-guide">
              <h2>Gợi ý flow demo</h2>
              <ul className="bullet-list">
                <li>Nhập thông tin sinh viên để mở phiên chat.</li>
                <li>Chọn một câu hỏi mẫu hoặc gõ câu hỏi riêng.</li>
                <li>Quan sát phản hồi, nguồn và trạng thái hệ thống.</li>
              </ul>
            </div>
          </aside>

          <div className="chat-layout__main">
            <ChatWindow
              messages={messages}
              loading={loading}
              identityLocked={identityLocked}
              welcomeName={welcomeName}
            />
            <PromptSuggestions
              prompts={promptSuggestions}
              disabled={!identityLocked || loading}
              onSelectPrompt={handleSuggestionClick}
            />
            <ChatInput
              disabled={!identityLocked || loading}
              loading={loading}
              onSend={handleSend}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatPage;
