import { useState } from 'react';
import SourceBadge from './SourceBadge.jsx';

export default function MessageBubble({ role, content, sources = [] }) {
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike' | 'escalate' | null
  const [toast, setToast] = useState('');

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  }

  function handleLike() {
    setFeedback('like');
    showToast('✓ Đã gửi phản hồi. Cảm ơn bạn!');
  }

  function handleDislike() {
    setFeedback('dislike');
    showToast('✓ Đã gửi phản hồi. Chúng tôi sẽ cải thiện!');
  }

  function handleEscalate() {
    setFeedback('escalate');
    showToast('✓ Đã chuyển hướng đến nhân viên hỗ trợ online.');
  }

  if (role === 'user') {
    return (
      <div className="message-row user">
        <div className="bubble user">{content}</div>
      </div>
    );
  }

  return (
    <div className="message-row bot">
      <div className="avatar">AI</div>
      <div className="bot-column">
        <div className="bubble bot">{content}</div>
        {sources.length > 0 && (
          <div className="sources-row">
            {sources.map((s, i) => (
              <SourceBadge key={`${s}-${i}`} source={s} />
            ))}
          </div>
        )}
        <div className="feedback-row">
          <button
            type="button"
            className={`feedback-btn ${feedback === 'like' ? 'active like' : ''}`}
            onClick={handleLike}
            title="Câu trả lời hữu ích"
          >
            👍 <span>Thích</span>
          </button>
          <button
            type="button"
            className={`feedback-btn ${feedback === 'dislike' ? 'active dislike' : ''}`}
            onClick={handleDislike}
            title="Câu trả lời chưa tốt"
          >
            👎 <span>Không thích</span>
          </button>
          <button
            type="button"
            className={`feedback-btn escalate ${feedback === 'escalate' ? 'active' : ''}`}
            onClick={handleEscalate}
            title="Chuyển đến nhân viên hỗ trợ"
          >
            🙋 <span>Gặp nhân viên</span>
          </button>
          {toast && <span className="feedback-toast">{toast}</span>}
        </div>
      </div>
    </div>
  );
}
