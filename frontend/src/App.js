import React, { useState } from "react";
import { sendMessage } from "./api";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text) => {
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await sendMessage(text);
      const botMsg = { role: "assistant", content: data.reply, sources: data.sources };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error connecting to server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Agent Demo</h1>
      <ChatWindow messages={messages} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}

export default App;
