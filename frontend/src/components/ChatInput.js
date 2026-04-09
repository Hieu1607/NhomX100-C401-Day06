import React, { useState } from "react";

function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", fontSize: 16 }}
      />
      <button type="submit" disabled={disabled || !text.trim()} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#007bff", color: "#fff", fontSize: 16, cursor: "pointer" }}>
        Send
      </button>
    </form>
  );
}

export default ChatInput;
