import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';

const SUGGESTED_QUESTIONS = [
  'Điểm học kỳ gần nhất của tôi như thế nào?',
  'Tôi còn nợ học phí không?',
  'Quy định về nghỉ học của trường là gì?',
  'Thông tin liên hệ của tôi trong hồ sơ có gì?',
];

export default function ChatWindow({
  messages,
  loading,
  confirmed,
  onPickSuggestion,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (messages.length === 0 && !confirmed) {
    return (
      <div className="chat-window">
        <div className="empty-state">
          <div className="emoji">🎓</div>
          <h4>Chào mừng đến với Trợ lý Học vụ</h4>
          <p>Vui lòng nhập MSSV và Họ tên ở thanh bên trái để bắt đầu trò chuyện.</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0 && confirmed) {
    return (
      <div className="chat-window">
        <div className="empty-state">
          <div className="emoji">💬</div>
          <h4>Bạn muốn hỏi gì hôm nay?</h4>
          <p>Chọn một gợi ý bên dưới hoặc tự đặt câu hỏi của riêng bạn.</p>
          <div className="suggested-chips">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button key={q} className="chip" onClick={() => onPickSuggestion(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {messages.map((m, i) => (
        <MessageBubble
          key={i}
          role={m.role}
          content={m.content}
          sources={m.sources}
        />
      ))}
      {loading && (
        <div className="message-row bot">
          <div className="avatar">AI</div>
          <div className="bubble bot typing-indicator">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
