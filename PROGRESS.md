# 📋 PROGRESS.md — Widget Date

> **Mục đích:** File theo dõi tiến độ dự án. Cập nhật sau **mỗi lần chỉnh sửa**.
> **Cách dùng:** Đọc file này trước khi bắt đầu một session làm việc. Commit file này cùng với code.

---

## 🗓️ Cập nhật lần cuối

| Ngày | 2026-05-13 |
| Phiên làm việc | #46 — Cleanup: dead code, README NVIDIA, JWT_SECRET enforce |
| Nhánh Git | `main` |

---

## 📊 Tổng quan tiến độ

```
Tính năng chính    █████████████████░░░  85%
Backend / Server   ████████████░░░░░░░░  60%
Security / Refactor████████████████░░░░  80%
Data & Database    ████████████████░░░░  80%
```

---

## ✅ Đã hoàn thành

### Core Features
- [x] Tab **Trang chủ** — Form lên lịch hẹn hò (ngân sách, bạn đồng hành, giờ rảnh, sở thích)
- [x] AI Combo Generator — gọi NVIDIA NIM (Llama 3.3 Nemotron), fallback sang SAMPLE_COMBOS khi lỗi
- [x] Tab **Khám phá** — Hiển thị danh sách địa điểm từ `REAL_LOCATIONS`
- [x] Tab **Khám phá** — Sort địa điểm (Best Choice / Rating / Khoảng cách)
- [x] Tab **Khám phá** — Tinder Swipe UI (vuốt trái/phải chọn địa điểm)
- [x] Tab **Khám phá** — Danh sách phim đang chiếu (dữ liệu tĩnh `movies.ts`)
- [x] Tab **Khám phá** — Hot Trends (dữ liệu từ crawler `trends.ts`)
- [x] Tab **Date Miles** — Hiển thị điểm thưởng, huy hiệu, lịch sử
- [x] **Gamification** — `useReward` hook: `earnMiles`, `incrementDates`, cấp bậc Newbie→Master, logic tính Streak và auto-unlock huy hiệu (Night Owl, Combo King)
- [x] **AI Chat Panel** — Full-screen chat với NVIDIA NIM (Llama 3.3 Nemotron) (`useChat` hook)
- [x] **Backend Trends** — Expose REST endpoint từ `data-service` cho client (W1)
- [x] **Ride Modal** — Deep link Grab, Be, Xanh SM với toạ độ lat/lng
- [x] **Weather Banner** — Trang chủ: Weather card lớn + hiển thị ngày tháng (W3)
- [x] **Toast Notification** — Component dùng chung với auto-dismiss 3 giây
- [x] **Payment Modal** — Xác nhận thanh toán + confetti + +100 Miles
- [x] **Image Viewer Modal** — Xem ảnh địa điểm (carousel)
- [x] **Focus Mode & AI Combo** — Nâng cấp Focus Mode fullscreen, thêm Modal tùy chỉnh cho AI Combo, cho phép tạo Manual Combo.
- [x] **HistoryView Logic** — Thêm logic chọn ngày, lọc danh sách, modal chi tiết, điều hướng tháng, enriched mock data và Calendar Bottom Sheet.
- [x] **DateMilesView Redesign** — Đồng bộ 100% với "Modern Romanticism" design system, áp dụng chuẩn design tokens (on-surface, etc.)
- [x] **i18n** — Thêm keys cho empty state trang Lịch sử
- [x] **Outfit Gợi ý** — Bỏ tính năng này theo yêu cầu (W7)
- [x] **ExploreView Pagination** — Giới hạn hiển thị 5 item và thêm nút "Load More" load 5 item mỗi lần bấm.

### Kiến trúc / Refactor (theo PLAN-client-server.md)
- [x] Tách monorepo npm workspaces: `client/` + `server/`
- [x] Express server scaffold (`server/src/index.ts`) với CORS, routes, error handler
- [x] Rate limiter middleware (dual-track: guest 3 req/h, auth 20 req/h)
- [x] Global error handler (không leak stack trace ra client)
- [x] `server/src/config/env.ts` — validate env vars khi khởi động
- [x] Routes server: `GET /api/health`, `/api/nearby-places`, `/api/combos`, `/api/chat`, `/api/weather`, `/api/place-image`
- [x] `scraperService.ts` — thay thế allorigins.win proxy bằng server-side fetch
- [x] `weatherService.ts` — fetch OpenWeather từ server, cache 10 phút
- [x] Vite client proxy `/api` → `localhost:3001`
- [x] Tách components: `ChatPanel`, `ExploreView`, `HomeView`, `DateMilesView`, `PaymentModal`, `RideModal`, `ImageViewer`, `Toast`
- [x] Tách hooks: `useWeather`, `useReward`, `useChat`, `useToast`

### Data Service (Crawler)
- [x] `data-service/scraper.js` — crawl báo mạng lấy Hot Trends
- [x] `data-service/cronjob.js` — chạy tự động hàng đêm (node-cron)
- [x] `data-service/database.js` — lưu trữ bằng better-sqlite3
- [x] Python scraper (`python-scraper/scraper.py`) — scrape ảnh Google Maps với cache SQLite

---

## 🔴 Lỗi cần sửa (Bugs)

| # | Tab | Mô tả | Độ ưu tiên | File liên quan |
|---|---|---|---|---|
| B1 | Khám phá | ~~Ảnh thực tế địa điểm không hiển thị~~ → **ĐÃ FIX**: parse `lh3.googleusercontent.com` URL từ `imageUrl` field trong `locations.json` | ✅ Fixed | `ImageViewer.tsx`, `ExploreView.tsx`, `App.tsx` |
| B2 | Khám phá | ~~Nút "Thêm vào Combo" chỉ hiện toast, không có state để gom thành danh sách~~ → **ĐÃ FIX**: Thêm `savedPlaces` state + `onAddToCombo` callback, chặn duplicate, hiện badge count | ✅ Fixed | `ExploreView.tsx`, `App.tsx` |
| B3 | Khám phá | Cải thiện logic xử lý quyền truy cập Geolocation | ✅ Fixed | `ExploreView.tsx` (handleFetchPlaces) |
| B4 | Client | ~~TypeScript error: `Cannot find module '@google/genai'` trong `geminiService.ts` cũ~~ → **ĐÃ FIX**: Xoá file obsolete | ✅ Fixed | `client/src/services/geminiService.ts` → **ĐÃ XOÁ** |
| B5 | Client | ~~TypeScript error: `Property 'env' does not exist on type 'ImportMeta'`~~ → **ĐÃ FIX**: Xoá file obsolete | ✅ Fixed | `client/src/services/geminiService.ts` → **ĐÃ XOÁ** |
| B6 | Local | ~~Chạy local bị lỗi `CANNOT GET /`~~ → **ĐÃ FIX**: Thêm route fallback tường minh và cải thiện logic serve static | ✅ Fixed | `server/src/index.ts` |

---

## 🟡 Đang làm / Chưa hoàn thành

| # | Hạng mục | Mô tả | File cần tạo / sửa |
|---|---|---|---|
| W1 | Backend | ~~Expose REST endpoint từ `data-service` để client React lấy data Trends thực tế~~ | ✅ Fixed | `server/src/routes/trends.ts` |
| W2 | Huy hiệu | ~~Auto-unlock badge theo hành động~~ → **ĐÃ FIX**: Triển khai logic trong `useReward.ts` | ✅ Fixed | `useReward.ts` |
| W3 | Home | Bỏ phần "kỷ niệm" buổi sáng, làm to phần thời tiết, hiển thị ngày tháng | ✅ Fixed | `HomeDashboardUI.tsx` |
| W4 | Sở thích | Chỉ hiện category có trong database | ✅ Fixed | `ExploreView.tsx` |
| W5 | Trang chủ | Mở rộng danh sách địa điểm gợi ý | ✅ Fixed | `data/locations.json` |
| W6 | Database | Tạo user database riêng | ✅ Fixed | `server/src/db/client.ts` |
| W7 | Outfit | Bỏ tính năng "Outfit Gợi ý" | ✅ Fixed | (Cleaned) |
| W8 | Auth | Hệ thống Đăng nhập/Đăng ký | ✅ Fixed | `server/src/routes/auth.ts` |

---

## 🔵 Kế hoạch tương lai (Backlog)

- [ ] **Leaderboard** — bảng xếp hạng cặp đôi
- [ ] **Challenges** — thử thách hẹn hò theo tuần
- [ ] **PWA Push Notification** — nhắc nhở trước giờ hẹn
- [ ] **Bộ lọc nâng cao** — lọc địa điểm theo giá, khoảng cách, đánh giá

---

## 🔐 Bảo mật

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| API key Gemini trong client bundle | ✅ Đã sửa | Chuyển sang server, không dùng `VITE_` prefix |
| API key OpenWeather trong client | ✅ Đã sửa | Chuyển sang server |
| Rate limiting Chat API | ✅ Có | 15 req/phút |
| Rate limiting Gemini API | ✅ Có | 10 req/phút |
| CORS chỉ cho phép client origin | ✅ Có | `CLIENT_ORIGIN` env var |
| Stack trace leak ra client | ✅ Đã chặn | `errorHandler.ts` |
| Input validation trên routes | 🟡 Một phần | Có check cơ bản, chưa dùng schema validation (Zod) |
| User data DB | ✅ Có | Đã triển khai SQLite |

---

## 🧪 Kiểm tra nhanh (chạy trước khi commit)

```bash
# 1. TypeScript không có lỗi
npm run lint -w client

# 2. Build client thành công
npm run build -w client

# 3. Server khởi động được
npm run dev -w server
# Kiểm tra: curl http://localhost:3001/api/health → {"status":"ok"}

# 4. Không có API key nào trong client bundle
grep -r "AIza\|GEMINI\|openrouter" client/src --include="*.ts" --include="*.tsx"
# Kết quả mong đợi: 0 matches

# 5. Toàn bộ app
npm run dev
```

---

## 📝 Changelog theo session

### Session #30 — 2026-05-02
- **HistoryView Redesign**: Thực hiện redesign toàn diện tab Lịch sử.
- **Design System Sync**: Chuyển đổi toàn bộ `pink-*` sang `primary` tokens, thay `glass-panel` bằng `glass-card`.
- **UI Polish**: Redesign Header, Tab Switcher, Timeline Cards, và Empty State.
- **Verification**: Đã chạy `tsc` và pass 100% type safety.

### Session #31 — 2026-05-02
- **DateMilesView Redesign**: Redesign toàn diện tab Thành tích (Date Miles) theo chuẩn Modern Romanticism.
- **Design System Sync**: Đồng bộ hóa toàn bộ design tokens.
- **UI Polish**: Redesign Hero Card với gradient custom, Stats Row và Badges Grid.
- **Verification**: Đã chạy `tsc` và grep checklist.

### Session #32 — 2026-05-02
- **Gamification Logic**: Triển khai logic tính **Streak** dựa trên lịch sử hoạt động.
- **Auto Badge Unlocking**: Thêm logic tự động mở khóa huy hiệu: `first_date`, `night_owl`, `combo_king`.
- **Drive Sync**: Cập nhật `useDriveSync` đồng bộ `streak`.
- **UI Integration**: Kết nối dữ liệu streak thực tế vào màn hình `DateMilesView`.

### Session #36 — 2026-05-02
- **HistoryView Logic**: Hoàn thiện logic cho tab Lịch sử.
- **Interactions**: Thêm state `selectedDay`, `detailItem`, và `monthOffset`.
- **Date Strip**: Cập nhật `DateItem` hỗ trợ click và active state.
- **Detail Modal**: Implement `DateDetailModal` với animation và đầy đủ thông tin.
- **Mock Data**: Mở rộng dữ liệu mẫu để demo tính năng lọc.
- **i18n**: Cập nhật `vi.json` với các nhãn mới cho modal và tháng.
- **Files đã sửa**: `HistoryView.tsx`, `vi.json`, `PROGRESS.md`.

### Session #37 — 2026-05-02
- **HistoryView Enrichment**: Mở rộng mock data phong phú (2-3 event/ngày, đa dạng thể loại: shopping, movie, coffee...).
- **Calendar Selection**: Triển khai `CalendarBottomSheet` cho phép chọn ngày cụ thể từ header.
- **Past Tab Data**: Thêm dữ liệu mẫu cho tab "Đã đi" để giao diện không bị rỗng.
- **Files đã sửa**: `HistoryView.tsx`, `vi.json`, `PROGRESS.md`.

### Session #38 — 2026-05-02
- **ExploreView Pagination**: Giới hạn danh sách địa điểm hiển thị ban đầu xuống 5 item.
- **Load More Logic**: Triển khai nút "Hiển thị thêm" để load thêm 5 item mỗi lần bấm.
- **Auto Reset**: Tự động reset số lượng hiển thị về 5 khi thay đổi category hoặc tìm kiếm.
- **Files đã sửa**: `ExploreView.tsx`, `PROGRESS.md`.

### Session #39 — 2026-05-02
- **README Rewrite**: Viết lại toàn bộ `README.md` để cập nhật tech stack (React 19, Tailwind 4), cấu trúc monorepo và các tính năng mới hoàn thiện.
- **Project Sync**: Loại bỏ các hạng mục "Đang làm" đã cũ trong tài liệu, đồng bộ hóa với trạng thái thực tế của codebase.
- **Files đã sửa**: `README.md`, `PROGRESS.md`.

### Session #42 — 2026-05-05
- **Autonomous Mode**: Proactive scan phát hiện 2 lỗi TypeScript sau khi git reset --hard về commit bbfb060.
- **TypeScript Fix**: Thêm `'fashion'` vào Tab union type tại `client/src/types/index.ts:98`.
- **Verification**: checklist.py 6/6 PASSED (Security, Lint, Schema, Test, UX, SEO).
- **Files đã sửa**: `client/src/types/index.ts`, `PROGRESS.md`, `AUTONOMOUS_LOG.md`.
### Session #43 — 2026-05-05
- **Bug Fix (B6)**: Đã sửa lỗi `CANNOT GET /` bằng cách thêm route fallback SPA tường minh trong server.
- **Path Cleanup**: Cập nhật `File-Tree.md` để khớp với đường dẫn thực tế (`Ky_2`).
- **Autonomous Scan**: Chạy verify toàn bộ (checklist.py) và đạt kết quả 6/6 PASSED.
- **Files đã sửa**: `server/src/index.ts`, `File-Tree.md`, `PROGRESS.md`, `AUTONOMOUS_LOG.md`.

### Session #44 — 2026-05-05
- **Autonomous Mode**: Proactive scan - checklist.py 6/6 PASSED, tsc clean.
- **Console Severity**: Đổi 6 `console.log` → `console.info` trong `server/src/db/client.ts` và `server/src/index.ts` (startup/init logs).
- **Verification**: checklist.py 6/6 PASSED, tsc --noEmit clean cả client và server.
- **Files đã sửa**: `server/src/db/client.ts`, `server/src/index.ts`, `AUTONOMOUS_LOG.md`, `PROGRESS.md`.

### Session #45 — 2026-05-08
- **UI Blur Fix**: Thêm hiệu ứng frosted glass cho bottom navigation và Explore header (`backdrop-blur-lg` + nền bán trong suốt).
- **Font Consistency**: Chuẩn hoá font fallback trong `index.css`, áp dụng thống nhất `var(--font-sans)` cho `html/body/#root`.
- **Home Weather Layout**: Cải thiện responsive layout tránh overflow/text vỡ ở card thời tiết.
- **Custom Combo Button**: Sửa style + dùng label i18n cho nút chuyển sang tab Khám phá; giữ logic chuyển tab qua prop callback.
- **Type/Lint Stability**: Sửa lỗi tổng chi phí slot dùng field không tồn tại (`price_per_person` → `price/cost`).
- **Verification**: `tsc` client/server pass, `npm run build -w client` pass, `checklist.py` 6/6 PASSED, secret grep 0 matches.
- **UI Capture**: Ảnh kiểm tra thủ công tại `/tmp/widget-date/home-tab.png` và `/tmp/widget-date/explore-tab.png`.


### Session #46 — 2026-05-13
- **Dead Code Cleanup**: Xoá server/src/middleware/rateLimit.ts — chatLimiter/geminiLimiter không dùng (dual-track rateLimiter.ts là live).
- **README Fix**: Sửa 4 chỗ đề cập sai "Gemini 2.5 Flash/Pro" → "NVIDIA NIM (Llama 3.3 Nemotron)". Update .env example trong README.
- **JWT_SECRET Enforce**: Thêm JWT_SECRET vào required env vars, loại bỏ fallback hardcoded.
- **.env.example Sync**: Sửa từ OPENROUTER_* sang NVIDIA_*, thêm JWT_SECRET.
- **PROGRESS.md Sync**: Update metadata, sửa Gemini mentions còn sót, update rate limiter description.
- **Files đã sửa**: `server/src/middleware/rateLimit.ts` (deleted), `server/src/config/env.ts`, `.env.example`, `README.md`, `PROGRESS.md`.
