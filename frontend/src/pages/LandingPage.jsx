import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🎓',
    title: 'Hồ sơ học viên',
    desc: 'Tra cứu thông tin cá nhân, lớp, chương trình học và liên hệ.',
  },
  {
    icon: '📊',
    title: 'Kết quả học tập',
    desc: 'Xem điểm số, đánh giá, chuyên cần và nhận xét giáo viên.',
  },
  {
    icon: '💰',
    title: 'Thông tin tài chính',
    desc: 'Kiểm tra học phí, phí dịch vụ và trạng thái thanh toán.',
  },
  {
    icon: '📋',
    title: 'Nội quy trường',
    desc: 'Tìm kiếm ngữ nghĩa các điều khoản, quy định của nhà trường.',
  },
];

const STEPS = [
  { n: 1, title: 'Nhập MSSV & Họ tên', desc: 'Cung cấp thông tin học viên' },
  { n: 2, title: 'Đặt câu hỏi tự nhiên', desc: 'Hỏi bằng tiếng Việt thông thường' },
  { n: 3, title: 'Nhận thông tin chính xác', desc: 'Dữ liệu từ hệ thống nhà trường' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="logo-mark">V</div>
        <div>
          <h1>Đại học VinUni</h1>
          <small>Phòng Công tác Học viên</small>
        </div>
      </header>

      <section className="hero">
        <span className="eyebrow">Trợ lý học vụ</span>
        <h2>Trợ lý học vụ thông minh</h2>
        <p>
          Tra cứu thông tin học tập, tài chính và nội quy nhà trường ngay lập tức.
          Được hỗ trợ bởi công nghệ AI và dữ liệu chính thức từ Đại học VinUni.
        </p>
        <button className="btn-primary" onClick={() => navigate('/chat')}>
          Bắt đầu tư vấn <span className="arrow">→</span>
        </button>
      </section>

      <section className="features">
        <h3>Chúng tôi có thể giúp gì cho bạn?</h3>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="howto">
        <h3>Cách sử dụng</h3>
        <div className="howto-steps">
          {STEPS.map((s, i) => (
            <Fragment key={s.n}>
              <div className="howto-step">
                <div className="step-num">{s.n}</div>
                <div className="step-text">
                  <strong>{s.title}</strong>
                  <span>{s.desc}</span>
                </div>
              </div>
              {i < STEPS.length - 1 && <div className="howto-arrow">→</div>}
            </Fragment>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} Đại học VinUni — Phòng Công tác Học viên
      </footer>
    </div>
  );
}
