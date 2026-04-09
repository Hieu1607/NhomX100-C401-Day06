import React from "react";

function ChatWindow({ messages }) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, minHeight: 400, maxHeight: 500, overflowY: "auto", marginBottom: 16 }}>
      {messages.length === 0 && <p style={{ color: "#999" }}>Start a conversation...</p>}
      {messages.map((msg, i) => (
        <div key={i} style={{ marginBottom: 12, textAlign: msg.role === "user" ? "right" : "left" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: 16,
              background: msg.role === "user" ? "#007bff" : "#e9ecef",
              color: msg.role === "user" ? "#fff" : "#000",
              maxWidth: "75%",
            }}
          >
            {msg.content}
          </div>
          {msg.sources && msg.sources.length > 0 && (
            <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              Sources: {msg.sources.join(", ")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
