import { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentInfoForm from '../components/StudentInfoForm.jsx';
import ChatWindow from '../components/ChatWindow.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export default function ChatPage() {
  const [mssv, setMssv] = useState('');
  const [studentName, setStudentName] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  function handleConfirm() {
    setConfirmed(true);
    setMessages([]);
  }

  function handleEdit() {
    setConfirmed(false);
    setMessages([]);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || !confirmed || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mssv,
          student_name: studentName,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: data.reply,
          sources: data.sources ?? [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: '❌ Không thể kết nối tới máy chủ. Vui lòng thử lại.',
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = confirmed && !loading && input.trim().length > 0;

  return (
    <div className="chat-page">
      <header className="chat-header">
        <Link to="/" className="back-link">
          ← Quay lại
        </Link>
        <div className="title">Trợ lý Học vụ VinUni</div>
      </header>

      <div className="chat-body">
        <aside className="chat-sidebar">
          <div className="sidebar-title">Thông tin học viên</div>
          <div className="sidebar-sub">
            Cung cấp MSSV và họ tên để agent định danh đúng học viên.
          </div>
          <StudentInfoForm
            mssv={mssv}
            setMssv={setMssv}
            studentName={studentName}
            setStudentName={setStudentName}
            confirmed={confirmed}
            onConfirm={handleConfirm}
            onEdit={handleEdit}
          />
        </aside>

        <main className="chat-main">
          <ChatWindow
            messages={messages}
            loading={loading}
            confirmed={confirmed}
            onPickSuggestion={(q) => setInput(q)}
          />

          <div className="chat-input-area">
            <textarea
              rows={1}
              placeholder={
                confirmed
                  ? 'Nhập câu hỏi của bạn... (Enter để gửi, Shift+Enter để xuống dòng)'
                  : 'Vui lòng xác nhận thông tin học viên trước khi chat'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!confirmed || loading}
            />
            <button
              className="btn-send"
              onClick={handleSend}
              disabled={!canSend}
            >
              Gửi
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
