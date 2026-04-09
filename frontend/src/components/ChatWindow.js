import React, { useEffect, useRef } from "react";

function ChatWindow({ messages, loading, identityLocked, welcomeName }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!bodyRef.current) {
      return;
    }

    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading]);

  return (
    <section className="chat-window">
      <div className="chat-window__header">
        <div className="section-label">Conversation</div>
        <h2>Phiên chat hiện tại</h2>
        <p className="helper-text">
          {identityLocked
            ? `Assistant đang trả lời trong context của ${welcomeName}.`
            : "Khóa thông tin sinh viên để bắt đầu một phiên chat mới."}
        </p>
      </div>

      <div className="chat-window__body" ref={bodyRef}>
        {messages.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state__title">Chưa có tin nhắn nào</h3>
            <p className="empty-state__copy">
              {identityLocked
                ? "Bạn có thể chọn một gợi ý bên dưới hoặc nhập câu hỏi của riêng mình."
                : "Hãy nhập họ tên và MSSV ở panel bên trái để mở composer và bắt đầu hội thoại."}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              className={`message-row message-row--${message.role}`}
              key={message.id}
            >
              <div
                className={[
                  "message",
                  message.role === "user" ? "message--user" : "message--assistant",
                  message.isError ? "message--error" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {message.content}
                {message.sources?.length ? (
                  <div className="sources">
                    <span className="sources__label">Nguồn</span>
                    {message.sources.map((source) => (
                      <span className="source-badge" key={source}>
                        {source}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}

        {loading ? (
          <div className="message-row message-row--assistant">
            <div className="message message--assistant message--loading">
              Assistant đang xử lý câu hỏi của bạn...
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ChatWindow;
