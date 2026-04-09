const SOURCE_META = {
  ho_so: { label: 'Hồ sơ học viên', icon: '🎓' },
  hoc_tap: { label: 'Kết quả học tập', icon: '📊' },
  tai_chinh: { label: 'Thông tin tài chính', icon: '💰' },
  noi_quy: { label: 'Nội quy trường', icon: '📋' },
};

export default function SourceBadge({ source }) {
  const meta = SOURCE_META[source] ?? { label: source, icon: '📄' };
  return (
    <span className="source-badge">
      <span>{meta.icon}</span>
      <span>{meta.label}</span>
    </span>
  );
}
