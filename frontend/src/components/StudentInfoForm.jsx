import { useState } from 'react';

export default function StudentInfoForm({
  mssv,
  setMssv,
  studentName,
  setStudentName,
  confirmed,
  onConfirm,
  onEdit,
}) {
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!mssv.trim()) next.mssv = 'Vui lòng nhập MSSV';
    if (!studentName.trim()) next.studentName = 'Vui lòng nhập họ tên';
    setErrors(next);
    if (Object.keys(next).length === 0) {
      onConfirm();
    }
  }

  if (confirmed) {
    return (
      <div className="student-form">
        <div className="confirmed-card">
          <div className="check">✅ Đã xác nhận</div>
          <div className="row">
            <span>MSSV</span>
            <span>{mssv}</span>
          </div>
          <div className="row">
            <span>Họ tên</span>
            <span>{studentName}</span>
          </div>
          <button className="btn-change" onClick={onEdit}>
            Đổi thông tin
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="mssv">Mã số sinh viên</label>
        <input
          id="mssv"
          type="text"
          placeholder="VD: VSC-102934"
          value={mssv}
          onChange={(e) => setMssv(e.target.value.toUpperCase())}
        />
        {errors.mssv && <div className="error">{errors.mssv}</div>}
      </div>
      <div className="field">
        <label htmlFor="studentName">Họ và tên</label>
        <input
          id="studentName"
          type="text"
          placeholder="VD: Nguyen Minh Khoa"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        {errors.studentName && <div className="error">{errors.studentName}</div>}
      </div>
      <button type="submit" className="btn-confirm">
        Xác nhận
      </button>
    </form>
  );
}
