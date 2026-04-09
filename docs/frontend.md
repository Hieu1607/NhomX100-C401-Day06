# Frontend — Agent Demo (Đại học VinUni)

Tài liệu mô tả yêu cầu thiết kế và triển khai frontend cho hệ thống chatbot hỗ trợ học viên Đại học VinUni.

## 1. Tổng quan

Frontend là ứng dụng **React** (Vite) gồm hai trang:

- **Landing Page** (`/`) — Giới thiệu hệ thống, hướng dẫn sử dụng, nút bắt đầu trải nghiệm.
- **Chatbot Page** (`/chat`) — Nhập MSSV + Họ tên, sau đó chat với agent.

Frontend giao tiếp với backend qua endpoint `POST /api/chat` (xem [backend.md](./backend.md)).

## 2. Cấu trúc thư mục

```
frontend/
├── Dockerfile
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                  # React entry, khai báo router
    ├── App.jsx                   # Root component, định tuyến
    ├── index.css                 # CSS global, biến màu, font
    ├── pages/
    │   ├── LandingPage.jsx       # Trang chủ / giới thiệu
    │   └── ChatPage.jsx          # Trang chatbot chính
    └── components/
        ├── ChatWindow.jsx        # Khung hội thoại, render tin nhắn
        ├── MessageBubble.jsx     # Bong bóng tin nhắn (user / bot)
        ├── StudentInfoForm.jsx   # Form nhập MSSV + Họ tên
        └── SourceBadge.jsx       # Badge hiển thị nguồn dữ liệu
```

## 3. Định tuyến — [src/main.jsx](../frontend/src/main.jsx)

Dùng `react-router-dom` v6:

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/chat" element={<ChatPage />} />
  </Routes>
</BrowserRouter>
```

## 4. Thiết kế giao diện

### Aesthetic direction

Tone: **Học thuật – tin cậy – hiện đại**. Phong cách thiết kế lấy cảm hứng từ giao diện hành chính đại học châu Âu: nền sáng kem/trắng xám, accent xanh navy hoặc xanh đậm, typography serif trang trọng kết hợp sans-serif gọn gàng cho nội dung. Không sử dụng gradient tím, không dùng font Inter/Roboto.

### Biến màu CSS (`src/index.css`)

```css
:root {
  --color-bg:         #F5F4F0;   /* nền kem nhạt */
  --color-surface:    #FFFFFF;   /* card / chat bubble */
  --color-primary:    #1B3A6B;   /* navy — accent chính */
  --color-primary-light: #2E5299;
  --color-accent:     #C8922A;   /* vàng đồng — điểm nhấn */
  --color-text:       #1A1A2E;
  --color-text-muted: #6B7280;
  --color-border:     #DDD9D0;
  --color-user-bubble: #1B3A6B;
  --color-bot-bubble:  #FFFFFF;
  --radius-card:      12px;
  --radius-bubble:    18px;
  --shadow-card:      0 2px 12px rgba(27,58,107,0.08);
}
```

### Font

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet" />
```

- **Display / heading:** `Playfair Display` (serif, trang trọng)
- **Body / UI:** `Source Sans 3` (humanist sans, dễ đọc)

## 5. Landing Page — [src/pages/LandingPage.jsx](../frontend/src/pages/LandingPage.jsx)

### Bố cục

```
┌─────────────────────────────────┐
│  Header: Logo + tên trường      │
├─────────────────────────────────┤
│  Hero Section                   │
│  • Tiêu đề lớn (Playfair)       │
│  • Mô tả ngắn hệ thống          │
│  • [Bắt đầu tư vấn →] button   │
├─────────────────────────────────┤
│  Feature Cards (3 cột)          │
│  🎓 Hồ sơ học viên              │
│  📊 Kết quả học tập             │
│  💰 Thông tin tài chính         │
│  📋 Nội quy trường              │
├─────────────────────────────────┤
│  How It Works (3 bước)          │
│  1. Nhập MSSV & Họ tên          │
│  2. Đặt câu hỏi tự nhiên        │
│  3. Nhận thông tin chính xác    │
├─────────────────────────────────┤
│  Footer: © Đại học VinUni       │
└─────────────────────────────────┘
```

### Chi tiết component

**Hero Section**
- Tiêu đề: `"Trợ lý học vụ thông minh"` — font Playfair Display, 48px+
- Subtitle: `"Tra cứu thông tin học tập, tài chính và nội quy ngay lập tức"` — Source Sans 3, muted
- CTA button: `"Bắt đầu tư vấn →"` — background `var(--color-primary)`, hover lift + shadow, `useNavigate('/chat')` khi click
- Background: texture giấy nhạt hoặc pattern hình học nhỏ (CSS `background-image: radial-gradient(...)`)

**Feature Cards**
- 4 card trong grid 2×2 (mobile) hoặc 4 cột (desktop)
- Mỗi card: icon emoji lớn + tên tính năng + mô tả 1 dòng
- Hover: border-color chuyển sang `var(--color-accent)`, shadow tăng nhẹ

**How It Works**
- 3 bước theo chiều ngang, nối nhau bằng dấu `→`
- Số thứ tự: hình tròn màu navy, chữ trắng

## 6. Chat Page — [src/pages/ChatPage.jsx](../frontend/src/pages/ChatPage.jsx)

### Bố cục

```
┌──────────────────────────────────────────┐
│ Header: ← Quay lại | Trợ lý Học vụ VinUni │
├──────────────────────┬───────────────────┤
│                      │  Chat Window      │
│  StudentInfoForm     │  (flex-grow)      │
│  ─────────────────   │                   │
│  MSSV: [________]    │  [tin nhắn 1]     │
│  Họ tên: [________]  │  [tin nhắn 2]     │
│  [Xác nhận]          │  ...              │
│                      │                   │
│  ─────────────────   ├───────────────────┤
│  Trạng thái:         │  [Input + Send]   │
│  ✅ Đã xác nhận      │                   │
│  MSSV: SV001         │                   │
│  Họ tên: Nguyễn ...  │                   │
└──────────────────────┴───────────────────┘
```

**Layout:** flexbox row. Sidebar trái cố định 280px, phần chat chiếm còn lại. Trên mobile: sidebar thu gọn thành header bar, hiện form qua modal/drawer.

### State management (trong `ChatPage.jsx`)

```js
const [mssv, setMssv]               = useState('');
const [studentName, setStudentName] = useState('');
const [confirmed, setConfirmed]     = useState(false);
const [messages, setMessages]       = useState([]);   // [{role, content, sources}]
const [input, setInput]             = useState('');
const [loading, setLoading]         = useState(false);
```

### Gửi tin nhắn — `handleSend()`

```js
async function handleSend() {
  if (!input.trim() || !confirmed) return;
  const userMsg = { role: 'user', content: input };
  setMessages(prev => [...prev, userMsg]);
  setInput('');
  setLoading(true);

  try {
    const res = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, mssv, student_name: studentName }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, {
      role: 'bot',
      content: data.reply,
      sources: data.sources ?? [],
    }]);
  } catch {
    setMessages(prev => [...prev, {
      role: 'bot',
      content: '❌ Không thể kết nối tới máy chủ. Vui lòng thử lại.',
      sources: [],
    }]);
  } finally {
    setLoading(false);
  }
}
```

- Gửi bằng `Enter` (không kèm Shift) hoặc click nút `Send`
- Input bị disabled khi `loading === true` hoặc `confirmed === false`

## 7. Component: StudentInfoForm — [src/components/StudentInfoForm.jsx](../frontend/src/components/StudentInfoForm.jsx)

### Props

| Prop | Type | Mô tả |
|---|---|---|
| `mssv` | `string` | Giá trị MSSV hiện tại |
| `setMssv` | `fn` | Setter MSSV |
| `studentName` | `string` | Tên học viên |
| `setStudentName` | `fn` | Setter tên |
| `confirmed` | `boolean` | Trạng thái đã xác nhận |
| `onConfirm` | `fn` | Callback khi nhấn Xác nhận |

### Hành vi

- Nếu `confirmed === false`: hiện 2 input text + nút `"Xác nhận"`.
  - Validate: MSSV không rỗng, Họ tên không rỗng. Hiện lỗi inline nếu thiếu.
  - Khi submit: gọi `onConfirm()` → `setConfirmed(true)`.
- Nếu `confirmed === true`: ẩn form, hiện thẻ xanh lá xác nhận với MSSV + tên và nút nhỏ `"Đổi thông tin"` → `setConfirmed(false)`.
- Input MSSV tự động uppercase khi nhập (`onChange: e => setMssv(e.target.value.toUpperCase())`).

### Giao diện input

```css
.student-form input {
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 14px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  transition: border-color 0.2s;
}
.student-form input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(27,58,107,0.12);
}
```

## 8. Component: ChatWindow — [src/components/ChatWindow.jsx](../frontend/src/components/ChatWindow.jsx)

### Props

| Prop | Type | Mô tả |
|---|---|---|
| `messages` | `array` | Danh sách tin nhắn `[{role, content, sources}]` |
| `loading` | `boolean` | Hiển thị typing indicator |

### Hành vi

- Scroll xuống cuối tự động sau mỗi tin nhắn mới (`useEffect` + `ref.scrollIntoView()`).
- Nếu `messages` rỗng và `confirmed === false`: hiện placeholder `"Vui lòng nhập MSSV và Họ tên để bắt đầu"`.
- Nếu `messages` rỗng và `confirmed === true`: hiện gợi ý các câu hỏi mẫu (xem mục 10).
- Khi `loading === true`: hiện **typing indicator** — 3 chấm nhảy (CSS animation).

## 9. Component: MessageBubble — [src/components/MessageBubble.jsx](../frontend/src/components/MessageBubble.jsx)

### Props

| Prop | Type | Mô tả |
|---|---|---|
| `role` | `'user' \| 'bot'` | Người gửi |
| `content` | `string` | Nội dung tin nhắn |
| `sources` | `string[]` | Danh sách nguồn (chỉ có ở bot) |

### Giao diện

- **User bubble:** căn phải, background `var(--color-user-bubble)` (navy), chữ trắng, border-radius `18px 18px 4px 18px`.
- **Bot bubble:** căn trái, background `var(--color-bot-bubble)` (trắng), border `1px solid var(--color-border)`, border-radius `18px 18px 18px 4px`, box-shadow nhẹ.
- Avatar bot: hình tròn navy nhỏ với chữ `"AI"` đặt bên trái bubble.
- Dưới bot bubble: render `<SourceBadge />` cho từng source (nếu có).
- Nội dung hỗ trợ xuống dòng (`white-space: pre-wrap`).

## 10. Component: SourceBadge — [src/components/SourceBadge.jsx](../frontend/src/components/SourceBadge.jsx)

### Props

| Prop | Type | Mô tả |
|---|---|---|
| `source` | `string` | Tên nguồn: `ho_so`, `hoc_tap`, `tai_chinh`, `noi_quy` |

### Mapping hiển thị

| Giá trị `source` | Label hiển thị | Icon |
|---|---|---|
| `ho_so` | Hồ sơ học viên | 🎓 |
| `hoc_tap` | Kết quả học tập | 📊 |
| `tai_chinh` | Thông tin tài chính | 💰 |
| `noi_quy` | Nội quy trường | 📋 |

### Giao diện

```css
.source-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(27,58,107,0.08);
  color: var(--color-primary);
  border: 1px solid rgba(27,58,107,0.15);
  margin: 4px 4px 0 0;
}
```

## 11. Gợi ý câu hỏi mẫu

Khi chat window rỗng và đã xác nhận thông tin, hiện 4 chip câu hỏi gợi ý. Click vào chip → tự điền vào input:

```js
const SUGGESTED_QUESTIONS = [
  "Điểm học kỳ gần nhất của tôi như thế nào?",
  "Tôi còn nợ học phí không?",
  "Quy định về nghỉ học của trường là gì?",
  "Thông tin liên hệ của tôi trong hồ sơ có gì?",
];
```

Chip style: border navy, background trắng, hover fill navy, transition 0.15s.

## 12. Typing Indicator

```css
.typing-indicator span {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--color-text-muted);
  animation: bounce 1.2s infinite;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-6px); }
}
```

## 13. Responsive

| Breakpoint | Hành vi |
|---|---|
| `>= 768px` | Layout 2 cột: sidebar 280px cố định + chat flex-grow |
| `< 768px` | Sidebar ẩn; MSSV/tên hiện ở header bar thu gọn; nút `☰` mở drawer |

## 14. Dependencies — [frontend/package.json](../frontend/package.json)

| Package | Phiên bản | Mục đích |
|---|---|---|
| `react` | ^18 | UI framework |
| `react-dom` | ^18 | DOM renderer |
| `react-router-dom` | ^6 | Client-side routing |
| `vite` | ^5 | Build tool / dev server |

> Không dùng thư viện UI component (MUI, Chakra, Ant Design). Toàn bộ style viết bằng CSS thuần với biến CSS để dễ kiểm soát aesthetic.

## 15. Biến môi trường

Tạo file `.env` trong thư mục `frontend/`:

```
VITE_API_BASE_URL=http://localhost:8000
```

Sử dụng trong code:

```js
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
```

## 16. Chạy frontend

### Docker (cùng backend)

```bash
docker compose up --build
```

Frontend tại `http://localhost:3000`.

### Local dev

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## 17. Luồng người dùng

```
[Landing Page /]
   │  Click "Bắt đầu tư vấn"
   ▼
[Chat Page /chat]
   │
   ├─▶ StudentInfoForm (chưa xác nhận)
   │     Nhập MSSV + Họ tên → Click "Xác nhận"
   │     → confirmed = true
   │
   ├─▶ ChatWindow (sẵn sàng)
   │     Hiển thị gợi ý câu hỏi mẫu
   │
   ├─▶ Người dùng nhập câu hỏi → Enter / Send
   │     → POST /api/chat { message, mssv, student_name }
   │     → Hiển thị typing indicator
   │
   ├─▶ Nhận response { reply, sources }
   │     → Render MessageBubble (bot)
   │     → Render SourceBadge cho từng source
   │
   └─▶ Tiếp tục hội thoại ...
```
