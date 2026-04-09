import React, { useState } from "react";

function ChatInput({ onSend, disabled, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="composer">
      <form className="composer__form" onSubmit={handleSubmit}>
        <textarea
          className="textarea"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? "Khóa thông tin sinh viên để bắt đầu chat."
              : "Nhập câu hỏi của bạn. Enter để gửi, Shift+Enter để xuống dòng."
          }
          disabled={disabled}
        />
        <div className="composer__actions">
          <span className="composer__hint">
            {disabled
              ? "Composer sẽ mở sau khi bạn nhập họ tên và MSSV."
              : "Câu hỏi sẽ được gửi kèm context sinh viên hiện tại."}
          </span>
          <button className="button button--primary" type="submit" disabled={disabled || !text.trim()}>
            {loading ? "Đang gửi..." : "Gửi câu hỏi"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
