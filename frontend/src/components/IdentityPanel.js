import React from "react";

function IdentityPanel({
  identity,
  identityLocked,
  identityError,
  onIdentityChange,
  onLockIdentity,
  onUnlockIdentity,
  session,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onLockIdentity(identity);
  };

  return (
    <div className="identity-card">
      <div className="section-label">Student context</div>
      <h2>Thông tin bắt buộc trước khi chat</h2>
      <p className="helper-text">
        Backend hiện yêu cầu cả họ tên và MSSV trong mỗi request. Phần này giúp khóa context
        trước khi gửi tin nhắn đầu tiên.
      </p>

      {identityLocked ? (
        <>
          <div className="identity-summary">
            <div className="form-field">
              <span className="identity-summary__label">Họ và tên</span>
              <strong>{session.studentName}</strong>
            </div>
            <div className="form-field">
              <span className="identity-summary__label">Mã số sinh viên</span>
              <strong>{session.mssv}</strong>
            </div>
          </div>
          <div className="chat-page__actions">
            <button className="button button--ghost" onClick={onUnlockIdentity} type="button">
              Chỉnh sửa thông tin
            </button>
          </div>
        </>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="student-name">Họ và tên</label>
            <input
              className="input"
              id="student-name"
              type="text"
              value={identity.studentName}
              onChange={(event) =>
                onIdentityChange({
                  ...identity,
                  studentName: event.target.value,
                })
              }
              placeholder="Ví dụ: Nguyễn Minh Anh"
            />
          </div>

          <div className="form-field">
            <label htmlFor="student-mssv">Mã số sinh viên</label>
            <input
              className="input"
              id="student-mssv"
              type="text"
              value={identity.mssv}
              onChange={(event) =>
                onIdentityChange({
                  ...identity,
                  mssv: event.target.value,
                })
              }
              placeholder="Ví dụ: 2A202600401"
            />
          </div>

          {identityError ? <div className="field-error">{identityError}</div> : null}

          <button className="button button--primary" type="submit">
            Khóa thông tin và bắt đầu chat
          </button>
        </form>
      )}
    </div>
  );
}

export default IdentityPanel;
