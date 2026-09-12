<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Widget Date 💖 | Smart Dating Planner & AI Assistant

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA_NIM-Llama_3.3_Nemotron-76B900?logo=nvidia&logoColor=white)](https://www.nvidia.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

**Widget Date** là nền tảng ứng dụng lên kế hoạch hẹn hò thông minh thế hệ mới dành riêng cho giới trẻ Việt Nam. Ứng dụng kết hợp giữa sức mạnh của Trí tuệ Nhân tạo (Generative AI), hệ thống dữ liệu địa điểm thực tế và phong cách thiết kế **"Modern Romanticism"** (Glassmorphism & Material Design 3 tokens) để mang đến trải nghiệm hẹn hò tinh tế, cá nhân hóa và liền mạch từ A đến Z.

</div>

---

## ✨ Tính Năng Nổi Bật

### 🤖 AI Combo Planner (Lên Kế Hoạch Tự Động)
* **Tạo lịch trình cá nhân hóa:** Phân tích ngân sách, bạn đồng hành, thời gian rảnh và sở thích để tự động sắp xếp chuỗi hoạt động tối ưu (ăn uống, giải trí, cafe, dạo phố).
* **Mô hình AI cao cấp:** Tích hợp mô hình **Llama 3.3 Nemotron Super 49B** qua **NVIDIA NIM API**, chạy trên server proxy bảo mật.
* **Cơ chế Fallback thông minh:** Tự động chuyển đổi sang kho kịch bản tuyển chọn (Curated Combos) trong trường hợp gián đoạn kết nối mạng hoặc lỗi dịch vụ ngoại vi.

### 🏆 Gamification & Hệ Thống Date Miles
* **Tích lũy dặm thưởng:** Nhận điểm thưởng (Date Miles) cho mỗi buổi hẹn hò hoàn tất, mở khóa quà tặng và ưu đãi.
* **Cấp bậc thành viên:** Lộ trình thăng hạng từ *Newbie* đến *Master*.
* **Huy hiệu độc quyền:** Tự động mở khóa các danh hiệu đặc biệt (*Night Owl*, *Combo King*, *First Date Hero*).
* **Theo dõi Streak:** Duy trì chuỗi hẹn hò định kỳ để nhân đôi điểm thưởng.

### 🗺️ Khám Phá Địa Điểm (Explore & Trends)
* **Tinder-style Swipe Cards:** Trải nghiệm vuốt thẻ trực quan để chọn nhanh hoặc bỏ qua các địa điểm tiềm năng.
* **Bộ lọc thông minh:** Sắp xếp địa điểm theo *Lựa chọn hàng đầu (Best Choice)*, *Đánh giá (Rating)* hoặc *Khoảng cách thực tế*.
* **Hot Trends & Phim Rạp:** Hệ thống tự động thu thập (crawler) các quán cafe, nhà hàng đang thịnh hành và lịch chiếu phim rạp mới nhất.
* **Deep Link Gọi Xe 1 Chạm:** Tích hợp mở trực tiếp ứng dụng Grab, Be, Xanh SM kèm tọa độ địa điểm định tuyến.

### 💬 Trợ Lý Hẹn Hò Ảo (AI Dating Assistant)
* Hộp thoại tương tác thông minh hỗ trợ giải đáp thắc mắc, tư vấn trang phục, gợi ý chủ đề trò chuyện và gỡ rối tình huống trong buổi hẹn.

### 📅 Quản Lý Lịch Sử & Calendar Sheet
* **Timeline Buổi Hẹn:** Lưu trữ nhật ký chi tiết các buổi hẹn đã qua và lịch trình sắp tới.
* **Calendar Bottom Sheet:** Giao diện lịch chọn ngày trực quan, hỗ trợ lọc và xem lại kế hoạch theo từng tháng.

### 🔐 Hệ Thống Xác Thực & Bảo Mật
* Đăng ký và đăng nhập bảo mật bằng cơ chế mã hóa mật khẩu `bcryptjs` và xác thực phiên qua `JWT (JSON Web Token)`.
* Hỗ trợ đăng nhập nhanh bằng tài khoản Google (Google OAuth).
* Cơ chế phân tầng lưu lượng (Dual-track Rate Limiter) ngăn chặn lạm dụng tài nguyên API.

---

## 🏛️ Kiến Trúc Hệ Thống (Monorepo)

Dự án được tổ chức theo mô hình **npm workspaces** tách biệt rõ ràng giữa Client, Server và Data Crawler:

```text
Widget_Date/
├── client/                     # Frontend SPA (React 19 + Vite)
│   ├── src/
│   │   ├── components/         # UI Components (ChatPanel, RideModal, PaymentModal...)
│   │   ├── hooks/              # Custom React Hooks (useChat, useReward, useWeather...)
│   │   ├── services/           # HTTP API client với auto-attach JWT
│   │   ├── views/              # Các màn hình chính (Home, Explore, DateMiles, History)
│   │   └── index.css           # Design tokens, Glassmorphism, Tailwind CSS 4 theme
│   └── vite.config.ts          # Cấu hình Vite & dev proxy /api
│
├── server/                     # Backend REST API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/             # Kiểm tra và tải biến môi trường nghiêm ngặt
│   │   ├── db/                 # Quản trị cơ sở dữ liệu SQLite (better-sqlite3)
│   │   ├── middleware/         # Xác thực JWT, Dual-track Rate Limiter, Error Handler
│   │   ├── routes/             # Định tuyến API (auth, combos, chat, weather, places)
│   │   └── services/           # Logic nghiệp vụ gọi NVIDIA NIM, OpenWeather
│   └── tsconfig.json
│
├── data-service/               # Service thu thập dữ liệu độc lập
│   ├── scraper.js              # Web scraper thu thập Hot Trends và địa điểm bằng Cheerio
│   ├── cronjob.js              # Tác vụ định kỳ cập nhật dữ liệu tự động (node-cron)
│   └── database.js             # Kết nối lưu trữ dữ liệu vào SQLite
│
├── docs/                       # Tài liệu thiết kế và đặc tả kiến trúc
└── vercel.json                 # Cấu hình triển khai Serverless và định tuyến SPA
```

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Tầng | Công nghệ / Thư viện | Vai trò |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 6 | Nền tảng SPA hiệu năng cao |
| **Styling** | Tailwind CSS 4, Glassmorphism | Thiết kế giao diện hiện đại theo Modern Romanticism |
| **Motion** | Framer Motion (`motion/react` v12), Canvas Confetti | Hiệu ứng chuyển động mượt mà và chúc mừng thành tích |
| **Icons & Font** | Material Symbols, Plus Jakarta Sans, Epilogue | Hệ thống icon biến thể và typography cao cấp |
| **Backend** | Node.js, Express, TypeScript (via `tsx`) | Xây dựng RESTful API serverless-ready |
| **Database** | SQLite (`better-sqlite3`) | Cơ sở dữ liệu quan hệ nhúng tốc độ cao |
| **AI Integration** | NVIDIA NIM API (Llama 3.3 Nemotron Super 49B) | Sinh lịch trình thông minh và xử lý hội thoại NLP |
| **Auth & Security** | JWT, bcryptjs, express-rate-limit, Google Auth | Bảo vệ endpoint và phân quyền người dùng |
| **Data Scraping** | Cheerio, Node-cron | Thu thập và làm mới dữ liệu xu hướng định kỳ |
| **Deployment** | Vercel | Nền tảng triển khai toàn diện |

---

## 📡 Danh Sách API Endpoints Chính

| Phương thức | Endpoint | Chức năng | Phân quyền |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Đăng ký tài khoản người dùng mới | Public |
| `POST` | `/api/auth/login` | Đăng nhập hệ thống và cấp phát JWT | Public |
| `POST` | `/api/auth/google` | Xác thực đăng nhập qua Google OAuth Token | Public |
| `GET` | `/api/user/profile` | Lấy thông tin tài khoản và điểm thưởng Date Miles | Yêu cầu JWT |
| `POST` | `/api/combos` | Gọi AI sinh lịch trình hẹn hò theo tiêu chí | Rate Limited |
| `POST` | `/api/chat` | Tương tác trò chuyện với trợ lý ảo NVIDIA NIM | Rate Limited |
| `GET` | `/api/weather` | Truy vấn dữ liệu thời tiết thực tế (cached 10m) | Public |
| `GET` | `/api/nearby-places` | Tìm kiếm địa điểm theo tọa độ và bộ lọc | Public |
| `GET` | `/api/trends` | Lấy danh sách xu hướng và quán xá thịnh hành | Public |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Yêu cầu môi trường
* **Node.js**: Phiên bản `v18.0.0` trở lên (khuyên dùng Node LTS 20+)
* **npm**: Phiên bản `v9.0.0` trở lên

### 2. Cài đặt mã nguồn
```bash
# Clone repository về máy
git clone https://github.com/PerfectDraft/Widget_Date.git

# Di chuyển vào thư mục dự án
cd Widget_Date

# Cài đặt toàn bộ dependencies cho cả Client và Server (workspaces)
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc của dự án (tham khảo mẫu tại `.env.example`):
```env
# NVIDIA NIM API Key dùng cho tính năng sinh Combo và Chatbot AI
NVIDIA_API_KEY="nvapi-your-key-here"

# OpenWeather API Key dùng cho thẻ thời tiết
OPENWEATHER_API_KEY="your-openweather-key"

# Khóa bí mật ký token JWT (bắt buộc)
JWT_SECRET="your-super-secret-jwt-key"

# Địa chỉ Client được phép gọi CORS
CLIENT_ORIGIN="http://localhost:5173"
PORT=3001
```

*(Tùy chọn)* Cấu hình Google Login cho client tại `client/.env`:
```env
VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

### 4. Khởi chạy ứng dụng
```bash
# Chạy đồng thời cả Server (Port 3001) và Client (Port 5173)
npm run dev

# Hoặc chạy riêng biệt từng phần
npm run dev:client  # Chạy riêng Client Vite
npm run dev:server  # Chạy riêng Server Express
```

Truy cập ứng dụng tại: `http://localhost:5173`

### 5. Đóng gói cho Production
```bash
# Build mã nguồn Client ra thư mục client/dist
npm run build
```

---

## 🔒 Chính Sách Bảo Mật & Hiệu Năng
1. **Bảo mật API Keys:** Toàn bộ API Key của các dịch vụ bên thứ ba (NVIDIA NIM, OpenWeather) được lưu trữ hoàn toàn ở server backend; client không bao giờ có quyền truy cập trực tiếp các khóa này.
2. **Kiểm soát lưu lượng (Rate Limiting):** Phân chia hai tầng hạn mức gọi API (khách vãng lai và người dùng đã xác thực) để ngăn chặn tấn công DDoS và tối ưu chi phí hạ tầng.
3. **Hiệu năng cơ sở dữ liệu:** Thư viện `better-sqlite3` chạy ở chế độ đồng bộ native đem lại độ trễ phản hồi cực thấp (sub-millisecond queries) cho các tác vụ di động.

---

## 👨‍💻 Tác Giả & Bản Quyền

Dự án được xây dựng và phát triển bởi **Phan Văn Phước Hưng** ([@PerfectDraft](https://github.com/PerfectDraft)).

*Đồ án đạt điểm xuất sắc **9.1 / 10 (A+)** học phần Kỹ năng khởi nghiệp (UET1002) tại Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội (VNU UET).*
