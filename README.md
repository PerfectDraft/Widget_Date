<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Widget Date 💖

Widget Date là một siêu ứng dụng lên kế hoạch hẹn hò dành riêng cho người dùng Việt Nam. Ứng dụng nổi bật với các tính năng: tạo lịch trình bằng AI, hệ thống điểm thưởng "Date Miles" (Gamification), khám phá địa điểm theo phong cách vuốt thẻ Tinder, tư vấn trang phục thông minh, và tích hợp gọi xe công nghệ trực tiếp.

## 🌟 Chức Năng

### ✅ Đã Hoàn Thành
*   **Tạo Combo Hẹn Hò bằng AI:** Tự động lên lịch trình cá nhân hóa sử dụng mô hình Gemini 2.5 Flash, tính năng dự phòng fallback chuẩn xác.
*   **Hệ thống Điểm Thưởng Date Miles (Gamification):** Nhận "Date Miles" mỗi khi thanh toán/hoàn thành chuyến đi hoặc thuê trang phục. Thăng hạng (Newbie -> Master), mở khóa huy hiệu, và theo dõi lịch sử nhận điểm.
*   **Khám Phá Địa Điểm & Giao Diện Quẹt Thẻ:** Tích hợp Gemini 2.5 Pro và Google Maps để tìm kiếm địa điểm quanh bạn. Cử chỉ kéo hình sang phải/trái như Tinder để "thả tim" địa điểm.
*   **Trợ Lý AI Hẹn Hò:** Tư vấn chuyên sâu, vạch nhanh ý tưởng qua hệ thống Box Chat nổi thông minh sử dụng Gemini 2.5 Pro.
*   **Tích Hợp Deep Link Gọi Xe:** Bấm gọi trực tiếp xe Grab, Be hoặc Xanh SM với tọa độ tự điền cho từng điểm đi.
*   **Gợi Ý Trang Phục (Dynamic Outfits):** Tự động phân tích theme AI quyết định để ra mắt trang phục cho cặp đôi (Nam/Nữ). Chọn mua trên Shopee hoặc giả lập thuê đồ cấp tốc với đủ Size + Kho.
*   **Cào Ảnh Thực Tế:** Cơ chế Scrape Proxy vượt CORS bóc tách và nạp thẻ meta `og:image` thật của từng địa điểm trên Google Maps.
*   **Hệ Thống Crawler Backend (Node.js):** Một service độc lập (`data-service/`) chạy theo Cronjob mỗi đêm để Scrape các báo mạng tìm kiếm quán Hot Trend (Dùng `better-sqlite3`, `node-cron`, và `cheerio`).

### ⚠️ Đang Thực Hiện / Vấn Đề
*   **Xây Dựng Combo Thủ Công:** Nút "Thêm vào Combo" ở chế độ Khám phá/Thẻ đang dừng ở mức `showToast`, thiếu `State` gom nhóm thành danh sách riêng.
*   **Tích Hợp Server Data:** Dịch vụ `data-service/` vẫn hoạt động độc lập, chưa mở Endpoint /REST để gửi data cho phía React.
*   **Logic Huy Hiệu Code Cứng:** Trừ huy hiệu First Date mặc định, các biểu tượng Badge khác ở "Date Miles" chưa liên kết chéo với hành động App (auto-unlock).
*   **Hệ Thời Tiết Tĩnh:** Header hiển thị độ C (26°C nắng đẹp) và cơ chế nhắc ngày kỷ niệm hiện được Fixed tay. Cần API thời tiết hỗ trợ (vd: OpenWeather).

### 🔮 Dự Định
*   Cung cấp API REST từ Backend để truyền Data Crawler về App.
*   Liên kết trực tiếp tới API Thời Tiết thật theo thời điểm trong ngày.
*   Hệ thống Giao Lưu / Lên bảng xếp hạng với các cặp đôi khác (Leaderboards / Challenges).
*   Gửi push notification báo thức PWA vào sát giờ hẹn.

## 🚀 Tech Stack

*   **Frontend:** React 19, Vite, TailwindCSS 4, Framer Motion, canvas-confetti, Lucide React
*   **Backend (Data Service):** Node.js, Express, Axios, Cheerio, better-sqlite3, node-cron
*   **AI:** Gemini 2.5 Pro, Gemini 2.5 Flash (sử dụng `@google/genai` tân tiến nhất)

## 🛠 Hướng Dẫn Chạy Dịch Vụ Cục Bộ (Local)

**Yêu cầu môi trường:** Node.js v18+ 

1. Cài đặt các thư viện gói:
   ```bash
   npm install
   ```
2. Cấu hình khóa bảo mật (Environment):
   * Nhân bản file `.env.example` trỏ tên thành `.env.local`
   * Thay API Key Gemini của bạn vào trong:
     ```env
     GEMINI_API_KEY="your-gemini-key-here"
     ```
3. Khởi xướng máy chủ Frontend UI:
   ```bash
   npm run dev
   ```

*(Tuỳ chọn)* Chạy kèm Module Crawler (Data Backend):
```bash
cd data-service
# Nếu chưa install packet, hãy run "npm install" nhé
node scraper.js
```

---
*Created in AI Studio:* [Link to App (Demo Preview)](https://ai.studio/apps/9a2923f6-4591-48d0-96fe-2e0c8cf01b2a)
