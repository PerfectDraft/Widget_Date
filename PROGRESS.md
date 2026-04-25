# 📋 PROGRESS.md — Widget Date

> **Mục đích:** File theo dõi tiến độ dự án. Cập nhật sau **mỗi lần chỉnh sửa**.
> **Cách dùng:** Đọc file này trước khi bắt đầu một session làm việc. Commit file này cùng với code.

---

## 🗓️ Cập nhật lần cuối

| Trường | Giá trị |
|---|---|
| **Ngày** | 2026-04-25 |
| **Phiên làm việc** | #3 — Fix OpenRouter + Google Maps + Combo Persistence |
| **Nhánh Git** | `main` |

---

## 📊 Tổng quan tiến độ

```
Tính năng chính    ████████████░░░░░░░░  60%
Backend / Server   █████████░░░░░░░░░░░  45%
Security / Refactor████████████████░░░░  80%
Data & Database    █████░░░░░░░░░░░░░░░  25%
```

---

## ✅ Đã hoàn thành

### Core Features
- [x] Tab **Trang chủ** — Form lên lịch hẹn hò (ngân sách, bạn đồng hành, giờ rảnh, sở thích)
- [x] AI Combo Generator — gọi Gemini 2.5 Flash, fallback sang SAMPLE_COMBOS khi lỗi
- [x] Tab **Khám phá** — Hiển thị danh sách địa điểm từ `REAL_LOCATIONS`
- [x] Tab **Khám phá** — Sort địa điểm (Best Choice / Rating / Khoảng cách)
- [x] Tab **Khám phá** — Tinder Swipe UI (vuốt trái/phải chọn địa điểm)
- [x] Tab **Khám phá** — Danh sách phim đang chiếu (dữ liệu tĩnh `movies.ts`)
- [x] Tab **Khám phá** — Hot Trends (dữ liệu từ crawler `trends.ts`)
- [x] Tab **Date Miles** — Hiển thị điểm thưởng, huy hiệu, lịch sử
- [x] **Gamification** — `useReward` hook: `earnMiles`, `incrementDates`, cấp bậc Newbie→Master
- [x] **AI Chat Panel** — Full-screen chat với Gemini 2.5 Pro (`useChat` hook)
- [x] **Ride Modal** — Deep link Grab, Be, Xanh SM với toạ độ lat/lng
- [x] **Weather Banner** — Tích hợp OpenWeather API (`useWeather` hook)
- [x] **Toast Notification** — Component dùng chung với auto-dismiss 3 giây
- [x] **Payment Modal** — Xác nhận thanh toán + confetti + +100 Miles
- [x] **Image Viewer Modal** — Xem ảnh địa điểm (carousel)

### Kiến trúc / Refactor (theo PLAN-client-server.md)
- [x] Tách monorepo npm workspaces: `client/` + `server/`
- [x] Express server scaffold (`server/src/index.ts`) với CORS, routes, error handler
- [x] Rate limiter middleware (`chatLimiter` 15 req/min, `geminiLimiter` 10 req/min)
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
| B2 | Khám phá | Nút "Thêm vào Combo" chỉ hiện toast, không có state để gom thành danh sách | 🔴 Cao | `ExploreView.tsx`, `App.tsx` |
| B3 | Khám phá | Geolocation đôi khi báo lỗi quyền truy cập không chính xác | 🟡 Trung | `ExploreView.tsx` (handleFetchPlaces) |
| B4 | Client | TypeScript error: `Cannot find module '@google/genai'` trong `geminiService.ts` cũ | 🔴 Cao | `client/src/services/geminiService.ts` → **cần xoá file này** |
| B5 | Client | TypeScript error: `Property 'env' does not exist on type 'ImportMeta'` | 🔴 Cao | `client/src/services/geminiService.ts` → **cần xoá file này** |
| B6 | Local | Chạy local bị lỗi `CANNOT GET /` | 🔴 Cao | `server/src/index.ts` (thiếu route fallback hoặc config sai) |

---

## 🟡 Đang làm / Chưa hoàn thành

| # | Hạng mục | Mô tả | File cần tạo / sửa |
|---|---|---|---|
| W1 | Backend | Expose REST endpoint từ `data-service` để client React lấy data Trends thực tế | `server/src/routes/trends.ts` |
| W2 | Huy hiệu | Auto-unlock badge theo hành động (chỉ có "First Date" tự động, các badge khác chưa có logic) | `useReward.ts` |
| W3 | Trang chủ | Bỏ phần "kỷ niệm" buổi sáng, làm to phần thời tiết, hiển thị ngày tháng | `HomeView.tsx` |
| W4 | Sở thích | Chỉ hiện category có trong database, không hiện các mục thừa | `HomeView.tsx` (categories filter) |
| W5 | Trang chủ | Bổ sung thêm địa điểm vào mục Sở thích / Workspace | `data/locations.ts` |
| W6 | Database | Tạo user database riêng (key = số điện thoại): lưu sở thích, địa điểm, lịch sử tab | `server/src/services/userService.ts` |
| W7 | Outfit | Bỏ tính năng "Outfit Gợi ý" | `HomeView.tsx` |

---

## 🔵 Kế hoạch tương lai (Backlog)

- [ ] **Leaderboard** — bảng xếp hạng cặp đôi
- [ ] **Challenges** — thử thách hẹn hò theo tuần
- [ ] **PWA Push Notification** — nhắc nhở trước giờ hẹn
- [ ] **Bộ lọc nâng cao** — lọc địa điểm theo giá, khoảng cách, đánh giá
- [x] ~~**Ảnh thực tế từ Google Maps API**~~ → Đã giải quyết bằng cách parse URL CDN từ `locations.json` (không cần API key)

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
| User data DB | 🔴 Chưa có | Kế hoạch: W6 |

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

### Session #1 — 2026-04-25
- Khởi tạo file `PROGRESS.md` để theo dõi tiến độ
- Audit toàn bộ codebase, lập danh sách bugs và tasks còn lại
- Xác nhận kiến trúc monorepo client/server đã được tách thành công

### Session #2 — 2026-04-25
- **Fix OpenRouter 404**: Cập nhật `OPENROUTER_MODEL` và `OPENROUTER_FALLBACK_MODELS` trong `.env` — các model cũ (`llama-4-maverick:free`, `qwen3-235b:free`, `devstral-small:free`) đã bị OpenRouter xoá. Model mới: `gemini-2.5-flash-preview:free` (primary), `gemini-2.0-flash-lite-001:free`, `llama-4-scout:free`, `deepseek-chat-v3:free`, `qwen2.5-72b:free` (fallbacks)
- **Fix B1 — Ảnh thực tế**: Phát hiện `locations.json` đã có sẵn ảnh thật Google Maps trong field `imageUrl` (`lh3.googleusercontent.com` CDN). Viết `extractRealGooglePhoto()` để parse URL, upscale lên `w800-h600`. Dùng ảnh category Unsplash làm fallback slots 2-3.
- Files đã sửa: `.env`, `client/src/components/modals/ImageViewer.tsx`, `client/src/components/explore/ExploreView.tsx`, `client/src/App.tsx`
- Bugs đã fix: B1

### Session #3 — 2026-04-25
- **Fix OpenRouter lần 2**: Tất cả model IDs cũ đã bị dẹp → chuyển sang `openrouter/free` (auto-router tự chọn model free có sẵn). Fix retry logic trong `geminiService.ts`: mọi HTTP error (400/404/429/503) đều retry sang model tiếp theo thay vì crash.
- **Thêm nút "Mở trong Google Maps"**: Mỗi địa điểm trong tab Khám phá có nút mở chi tiết trên Google Maps. Mỗi activity trong combo ở Trang chủ cũng có link Google Maps.
- **Fix mất combo khi chuyển tab**: Lift `combos` state từ `HomeView` lên `App.tsx` → combo persist khi chuyển tab.
- Files đã sửa: `.env`, `server/src/services/geminiService.ts`, `client/src/components/explore/ExploreView.tsx`, `client/src/components/home/HomeView.tsx`, `client/src/App.tsx`

---

> 💡 **Hướng dẫn cập nhật:** Sau mỗi session, thêm một dòng mới vào **Changelog**, tick ✅ các task đã xong, chuyển bugs đã fix sang phần ✅, và commit cùng với code.
