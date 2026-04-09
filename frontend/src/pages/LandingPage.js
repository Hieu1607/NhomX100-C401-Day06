import React from "react";
import { Link } from "react-router-dom";

const timeline = [
  {
    step: "01",
    title: "SPEC",
    copy:
      "Chốt bài toán, người dùng và failure mode trước khi build. Landing page nhấn mạnh tư duy grounded thay vì chỉ đẹp mắt.",
  },
  {
    step: "02",
    title: "Prototype",
    copy:
      "Dựng UI đủ rõ để demo nhanh, sau đó nối backend thật để kiểm tra flow từ context sinh viên đến câu trả lời.",
  },
  {
    step: "03",
    title: "Demo",
    copy:
      "Kể câu chuyện mạch lạc: vì sao trợ lý này hữu ích, tin được ở đâu, và user sẽ thao tác như thế nào trong vài giây đầu.",
  },
];

const features = [
  {
    title: "Student-context chat",
    copy:
      "Mỗi phiên chat được gắn với họ tên và MSSV để backend có đủ context trước khi truy vấn dữ liệu hoặc nội quy liên quan.",
  },
  {
    title: "Grounded answers",
    copy:
      "Phản hồi ưu tiên dựa trên tool và nguồn thực tế. Nếu có nguồn, giao diện hiển thị rõ để người dùng biết assistant đang dựa vào đâu.",
  },
  {
    title: "Demo-ready flow",
    copy:
      "Tách landing page và chatbot page để người xem hiểu sản phẩm trước, sau đó chuyển sang tương tác live trong cùng một ứng dụng.",
  },
];

const trustCards = [
  {
    title: "Khóa context trước khi chat",
    copy:
      "Người dùng phải nhập họ tên và MSSV trước khi composer mở, giúp hạn chế gửi thiếu dữ liệu cho backend.",
  },
  {
    title: "Trạng thái rõ ràng",
    copy:
      "Loading, lỗi kết nối và no-data đều có giao diện riêng để tránh cảm giác chatbot đang treo hoặc trả lời mơ hồ.",
  },
  {
    title: "Narrative trung tính",
    copy:
      "Nội dung giao diện giữ trung tính để vừa khớp tinh thần hackathon vừa không mâu thuẫn với backend đang chạy theo context sinh viên.",
  },
];

function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <div className="kicker">Hackathon-ready frontend</div>
            <h1 className="hero__title">School assistant with a calmer, clearer first impression.</h1>
            <p className="hero__lead">
              Một landing page để kể đúng câu chuyện sản phẩm, và một chatbot page để demo
              live với context sinh viên ngay từ đầu. Mọi thứ được giữ gọn, rõ, và đủ tin cậy
              cho một buổi trình bày ngắn.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/chat">
                Mở chatbot demo
              </Link>
              <a className="button button--secondary" href="#journey">
                Xem flow sản phẩm
              </a>
            </div>
            <div className="hero__metrics">
              <div className="metric">
                <strong>2</strong>
                <span>screen chính: landing và chat</span>
              </div>
              <div className="metric">
                <strong>3</strong>
                <span>giai đoạn kể chuyện: SPEC, Prototype, Demo</span>
              </div>
              <div className="metric">
                <strong>1</strong>
                <span>payload chuẩn gửi backend: name, MSSV, message</span>
              </div>
            </div>
          </div>

          <div className="hero__panel">
            <div className="panel-card panel-card--accent">
              <p className="section-label">Why this UI</p>
              <h2>Thiết kế để giải thích sản phẩm trước khi thuyết phục bằng AI.</h2>
              <p className="section-copy">
                Landing page tạo framing cho người xem, còn chatbot page tập trung vào một
                flow thật: nhập context sinh viên, hỏi, nhận phản hồi có căn cứ.
              </p>
            </div>
            <div className="panel-card">
              <p className="section-label">Demo checklist</p>
              <ul className="bullet-list">
                <li>Giới thiệu problem và capability trong dưới 30 giây.</li>
                <li>Khóa họ tên + MSSV trước khi nhắn tin đầu tiên.</li>
                <li>Hiển thị loading, lỗi và sources rõ ràng trong live demo.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="journey">
        <div className="container">
          <div className="section-heading">
            <div className="section-label">Journey</div>
            <h2 className="section-title">SPEC -&gt; Prototype -&gt; Demo</h2>
            <p className="section-copy">
              README mô tả hackathon theo ba chặng rõ ràng. Giao diện này bám vào chính nhịp đó
              để landing page không chỉ là phần mở đầu, mà còn là phần giải thích logic sản phẩm.
            </p>
          </div>
          <div className="timeline-grid">
            {timeline.map((item) => (
              <article className="section-card" key={item.step}>
                <div className="timeline__step">{item.step}</div>
                <h3>{item.title}</h3>
                <p className="timeline__copy">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div className="section-label">Capabilities</div>
            <h2 className="section-title">Frontend bọc backend thành một flow dễ hiểu hơn</h2>
            <p className="section-copy">
              Không đổi contract API. Thay vào đó, phần giao diện làm rõ khi nào assistant sẵn
              sàng trả lời và người dùng đang hỏi trong context nào.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature) => (
              <article className="section-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p className="feature-card__copy">{feature.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div className="section-label">Trust</div>
            <h2 className="section-title">Demo UX cần cảm giác đáng tin, không chỉ là gọi API thành công</h2>
            <p className="section-copy">
              Những lựa chọn nhỏ như khóa context, render nguồn và giữ lại lịch sử khi lỗi sẽ tạo
              khác biệt lớn trong lúc thuyết trình hoặc test nhanh.
            </p>
          </div>
          <div className="trust-grid">
            {trustCards.map((card) => (
              <article className="section-card" key={card.title}>
                <h3>{card.title}</h3>
                <p className="trust-card__copy">{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default LandingPage;
