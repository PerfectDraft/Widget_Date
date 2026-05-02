<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Widget Date 💖 | Modern Romanticism Dating App

**Widget Date** là một siêu ứng dụng lên kế hoạch hẹn hò thông minh dành riêng cho người dùng Việt Nam. Ứng dụng kết hợp giữa sức mạnh của trí tuệ nhân tạo (AI) và thiết kế hiện đại "Modern Romanticism" để tạo ra những trải nghiệm hẹn hò tinh tế, cá nhân hóa và đầy thú vị.

---

## 🌟 Chức Năng Nổi Bật

### 🤖 AI Combo Generator
Tự động lên lịch trình hẹn hò hoàn hảo dựa trên ngân sách, sở thích và thời gian rảnh. Sử dụng mô hình **Gemini 2.5 Flash** để tối ưu hóa gợi ý, kèm theo cơ chế dự phòng (fallback) thông minh.

### 🏆 Hệ Thống Date Miles (Gamification)
Tích điểm thưởng cho mỗi chuyến đi hoàn thành. Hệ thống bao gồm:
- **Thăng hạng:** Từ Newbie đến Master.
- **Huy hiệu:** Tự động mở khóa các danh hiệu như *Night Owl*, *Combo King*, *First Date*.
- **Streak:** Theo dõi chuỗi ngày hẹn hò liên tục để nhận thêm phần thưởng.

### 🗺️ Khám Phá & Trải Nghiệm
- **Tinder-style Swipe:** Khám phá địa điểm bằng cử chỉ vuốt thẻ trực quan.
- **Hot Trends & Movies:** Cập nhật các quán xá đang "hot" và lịch chiếu phim thực tế thông qua hệ thống Crawler tự động.
- **Deep Link Gọi Xe:** Kết nối trực tiếp với Grab, Be, Xanh SM để đặt xe chỉ với một chạm.

### 💬 Trợ Lý AI Hẹn Hò
Box chat thông minh sử dụng **Gemini 2.5 Pro** tích hợp sẵn, giúp giải đáp mọi thắc mắc và vạch nhanh ý tưởng hẹn hò ngay lập tức.

### 📅 Lịch Sử & Lịch Trình (New!)
- **Timeline Lịch Sử:** Theo dõi lại các buổi hẹn hò đã qua và sắp tới.
- **Calendar Bottom Sheet:** Dễ dàng chọn và lọc buổi hẹn theo ngày cụ thể.

---

## 🚀 Công Nghệ Sử Dụng

### Frontend
- **Core:** React 19, Vite.
- **Styling:** Tailwind CSS 4, Glassmorphism, Modern Design Tokens.
- **Animation:** Framer Motion (motion/react), Canvas Confetti.
- **Icons:** Material Symbols (Google Fonts).

### Backend & Data
- **Engine:** Node.js (Express) tích hợp npm workspaces.
- **Database:** SQLite (better-sqlite3) cho mobile-first performance.
- **Crawler:** Cheerio + Node-cron cho service tự động hóa dữ liệu.
- **Security:** Rate limiting, Server-side API handling (ẩn hoàn toàn API keys khỏi client).

### AI Services
- **Google Gemini API:** Sử dụng song song Gemini 2.5 Pro (cho logic phức tạp) và Gemini 2.5 Flash (cho tốc độ phản hồi nhanh).

---

## 📂 Cấu Trúc Dự Án

```text
Widget_Date/
├── client/          # Giao diện React (Vite)
├── server/          # REST API & Business Logic
├── data-service/    # Crawler & Cron jobs dữ liệu
├── docs/            # Tài liệu kiến trúc & kế hoạch
└── vercel.json      # Cấu hình triển khai Cloud
```

---

## 🛠️ Hướng Dẫn Cài Đặt

### Yêu cầu
- Node.js v18+ 
- npm hoặc yarn

### Các bước thực hiện
1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Cấu hình Environment:**
   Tạo file `.env` tại thư mục gốc hoặc trong `server/` (tham khảo `.env.example`):
   ```env
   GEMINI_API_KEY="your-api-key"
   OPENWEATHER_API_KEY="your-api-key"
   CLIENT_ORIGIN="http://localhost:5173"
   ```

3. **Chạy ở chế độ Phát triển (Development):**
   ```bash
   npm run dev
   ```
   *Lệnh này sẽ khởi động đồng thời cả Client (Vite) và Server (Express).*

4. **Build cho Production:**
   ```bash
   npm run build
   ```

---

## 🔐 Bảo mật & Hiệu năng
- Toàn bộ các tác vụ gọi AI và thời tiết đều được xử lý qua Server-side để bảo vệ API Keys.
- Hệ thống Rate Limiter giúp ngăn chặn việc lạm dụng tài nguyên API.
- Tối ưu hóa SEO và Core Web Vitals theo tiêu chuẩn 2025.

---
*Widget Date - Thổi bùng ngọn lửa lãng mạn bằng công nghệ.*
