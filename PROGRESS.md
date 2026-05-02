# 📋 PROGRESS.md — Widget Date

> **Mục đích:** File theo dõi tiến độ dự án. Cập nhật sau **mỗi lần chỉnh sửa**.
> **Cách dùng:** Đọc file này trước khi bắt đầu một session làm việc. Commit file này cùng với code.

# 📋 PROGRESS.md — Widget Date

> **Mục đích:** File theo dõi tiến độ dự án. Cập nhật sau **mỗi lần chỉnh sửa**.
> **Cách dùng:** Đọc file này trước khi bắt đầu một session làm việc. Commit file này cùng với code.

---

## 🗓️ Cập nhật lần cuối

| Ngày | 2026-05-02 |
| Phiên làm việc | #30 — HistoryView Redesign Execution |
| Nhánh Git | `main` |

---

## 📊 Tổng quan tiến độ

```
Tính năng chính    ████████████████░░░░  80%
Backend / Server   ████████████░░░░░░░░  60%
Security / Refactor████████████████░░░░  80%
Data & Database    ████████░░░░░░░░░░░░  40%
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
- [x] **Weather Banner** — Trang chủ: Weather card lớn + hiển thị ngày tháng (W3)
- [x] **Toast Notification** — Component dùng chung với auto-dismiss 3 giây
- [x] **Payment Modal** — Xác nhận thanh toán + confetti + +100 Miles
- [x] **Image Viewer Modal** — Xem ảnh địa điểm (carousel)
- [x] **Focus Mode & AI Combo** — Nâng cấp Focus Mode fullscreen, thêm Modal tùy chỉnh cho AI Combo, cho phép tạo Manual Combo.
- [x] **HistoryView Redesign** — Đồng bộ 100% với "Modern Romanticism" design system
- [x] **i18n** — Thêm keys cho empty state trang Lịch sử
- [x] **Outfit Gợi ý** — Bỏ tính năng này theo yêu cầu (W7)

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
| B2 | Khám phá | ~~Nút "Thêm vào Combo" chỉ hiện toast, không có state để gom thành danh sách~~ → **ĐÃ FIX**: Thêm `savedPlaces` state + `onAddToCombo` callback, chặn duplicate, hiện badge count | ✅ Fixed | `ExploreView.tsx`, `App.tsx` |
| B3 | Khám phá | Geolocation đôi khi báo lỗi quyền truy cập không chính xác | 🟡 Trung | `ExploreView.tsx` (handleFetchPlaces) |
| B4 | Client | ~~TypeScript error: `Cannot find module '@google/genai'` trong `geminiService.ts` cũ~~ → **ĐÃ FIX**: Xoá file obsolete | ✅ Fixed | `client/src/services/geminiService.ts` → **ĐÃ XOÁ** |
| B5 | Client | ~~TypeScript error: `Property 'env' does not exist on type 'ImportMeta'`~~ → **ĐÃ FIX**: Xoá file obsolete | ✅ Fixed | `client/src/services/geminiService.ts` → **ĐÃ XOÁ** |
| B6 | Local | Chạy local bị lỗi `CANNOT GET /` | 🔴 Cao | `server/src/index.ts` (thiếu route fallback hoặc config sai) |

---

## 🟡 Đang làm / Chưa hoàn thành

| # | Hạng mục | Mô tả | File cần tạo / sửa |
|---|---|---|---|
| W1 | Backend | Expose REST endpoint từ `data-service` để client React lấy data Trends thực tế | `server/src/routes/trends.ts` |
| W2 | Huy hiệu | Auto-unlock badge theo hành động (chỉ có "First Date" tự động, các badge khác chưa có logic) | `useReward.ts` |
- [x] Home | Bỏ phần "kỷ niệm" buổi sáng, làm to phần thời tiết, hiển thị ngày tháng (W3)
- [x] Sở thích | Chỉ hiện category có trong database, không hiện các mục thừa (W4)
| W5 | Trang chủ | Bổ sung thêm địa điểm vào mục Sở thích / Workspace | `data/locations.ts` |
- [x] **Database** — Tạo user database riêng (key = số điện thoại): lưu sở thích, địa điểm, lịch sử tab (W6)
- [x] **Authentication** — Triển khai hệ thống Đăng nhập/Đăng ký (Login/Register) bảo mật với mật khẩu hashed (W8)
- [x] **Outfit** — Bỏ tính năng "Outfit Gợi ý" (W7)

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
- Fix OpenRouter lần 2, Thêm nút "Mở trong Google Maps", Fix mất combo khi chuyển tab

### Session #4 — 2026-04-27
- Google Drive Database, Tích hợp Stitch UI

### Session #5 — 2026-04-27
- Audit UI & Material Symbols, Fix Error 400 redirect_uri_mismatch, Fix Error Mapping, Fix JSON Parse Error, Fix Drive API 403

### Session #6 — 2026-04-27
- **UI Revamp (W3)**: Loại bỏ banner cảnh báo "kỷ niệm", mở rộng phần Weather Banner thành card lớn chuyên nghiệp.
- **Date & Time**: Hiển thị ngày tháng tiếng Việt (Thứ, ngày, tháng) trực tiếp trên Dashboard.
- **Model Upgrade (Fix)**: Khắc phục lỗi 404/429 bằng cách chuyển sang các model ổn định nhất của OpenRouter (cập nhật 27/04): `meta-llama/llama-3.3-70b-instruct:free` (Primary), và fallbacks: `google/gemma-4-31b-it:free`, `nvidia/nemotron-nano-9b-v2:free`.
- **Port Conflict Fix**: Kill process chiếm port 3001, khắc phục lỗi `EADDRINUSE` và WebSocket HMR error.
- Files đã sửa: `HomeDashboardUI.tsx`, `.env`, `PROGRESS.md`, `task.md`.
- **Google Drive Database**: Cấu trúc Decentralized Database. Đã tích hợp Google OAuth 2.0 và Google Drive API.
- Tạo `driveService.ts` tạo và đọc ghi `database.json` thẳng lên AppData Drive của người dùng bảo mật cao. 
- Xây dựng hook `useDriveSync` cho phép auto-sync dữ liệu khi người dùng sử dụng app.
- Xuất server API Key Gateway Server. Cài `google-auth-library` và `express-rate-limit`.
- Xây dựng `authMiddleware.ts` decode ID Token / Access Token tự động và gắp ra Google ID.
- Client `api.ts` tự động ghép Header `Authorization`.
- Files đã sửa thêm: `api.ts`, `gemini.ts`, phân nhánh middleware auth hoàn toàn độc lập cho Backend.
- Bỏ qua triển khai Vercel theo yêu cầu của user.
- **Tích hợp Stitch UI**: Import giao diện "Home Dashboard - AI Planner". Tách logic ra `useAIPlanner.ts` và tái cấu trúc `HomeView.tsx` sử dụng 100% components từ Stitch (`HomeDashboardUI.tsx`, `ComboList.tsx`). Implement đủ 4 trạng thái (Loading, Empty, Error, Success). Khắc phục type errors của TypeScript (`ComboActivity` -> `Activity`).

### Session #5 — 2026-04-27
- **Audit UI & Material Symbols**: Fix lỗi font Epilogue/Plus Jakarta Sans và Material Symbols Outlined không hiển thị (xử lý tại `index.html`).
- **Fix Error 400 redirect_uri_mismatch**: Enforce `strictPort: true` trong `vite.config.ts` để chặn Vite tự động nhảy sang port 5174 (phá vỡ Authorized Origins của Google).
- **Fix Error Mapping**: Cập nhật `api.ts` để forward đúng HTTP status code (401, 429) vào UI. Bổ sung thông báo yêu cầu login Google Drive khi bị 401.
- **Fix JSON Parse Error**: Triển khai `cleanedJson` trong `geminiService.ts` để tự động dọn dẹp trailing commas và comments trong kết quả trả về từ AI, giúp parse combo ổn định hơn.
- **Fix Drive API 403**: Bổ sung log chỉ dẫn kích hoạt Google Drive API trong Google Cloud Console khi gặp lỗi Forbidden (403).
- Files đã sửa: `index.html`, `vite.config.ts`, `api.ts`, `useAIPlanner.ts`, `HomeDashboardUI.tsx`, `ComboList.tsx`, `useDriveSync.ts`, `geminiService.ts`, `driveService.ts`.

### Session #7 — 2026-04-27
- **Git Merge Conflict Resolution**: Giải quyết triệt để các conflict markers xuất hiện sau khi merge/rebase (xảy ra trong session trước).
- **Files đã sửa**: `client/src/hooks/useAIPlanner.ts`, `client/src/components/home/ComboList.tsx`, `client/src/components/home/HomeDashboardUI.tsx`, `PROGRESS.md`.
- **Verification**: Chạy thành công `tsc --noEmit` cho client, đảm bảo không còn lỗi syntax hay type-safety.
- **Status**: Project đã có thể build và chạy lại bình thường.
 
### Session #9 — 2026-04-27
- **User Database (W6)**: Triển khai hệ thống database server-side sử dụng SQLite (`better-sqlite3`).
- **Phone Identification**: Dùng số điện thoại làm khóa chính để lưu trữ sở thích (`preferences`) và địa điểm yêu thích.
- **Sync Logic**: Cập nhật `useDriveSync` để đồng bộ dữ liệu song song lên cả Google Drive và Server DB.
- **UI Interaction**: Thêm ô nhập số điện thoại tại Header để người dùng tự xác thực và kích hoạt đồng bộ server.
- **Files đã sửa**: `server/src/index.ts`, `server/src/db/client.ts`, `server/src/services/userService.ts`, `server/src/routes/user.ts`, `client/src/services/api.ts`, `client/src/services/driveService.ts`, `client/src/hooks/useDriveSync.ts`, `client/src/App.tsx`, `client/src/components/home/HomeView.tsx`, `client/src/hooks/useAIPlanner.ts`.
- **Tasks hoàn thành**: W6.
- **PROJECT_CONTEXT.md synced.**
- **Multi-Account Fix**: Triển khai cơ chế reset state (`combos`, `userReward`, `chatMessages`) khi logout để tránh rò rỉ dữ liệu giữa các tài khoản khác nhau.
- **Chat Sync to Drive**: Tích hợp đồng bộ lịch sử chat trực tiếp lên Google Drive. Toàn bộ cuộc hội thoại sẽ được lưu và tải lại tự động khi đăng nhập.
- **Account Identification**: Sử dụng `userId` (sub/email từ Google UserInfo) để quản lý phiên làm việc chính xác trong `useChat` và `useDriveSync`.
- **Fix regressions in App.tsx**: Khắc phục lỗi mất hook và thiếu import phát sinh trong quá trình tái cấu trúc.
- **Files đã sửa**: `driveService.ts`, `useChat.ts`, `useDriveSync.ts`, `App.tsx`.

---

### Session #10 — 2026-04-27
- **Authentication System (W8)**: Triển khai hệ thống Đăng nhập/Đăng ký hoàn chỉnh.
- **UI/UX**: Thiết kế `AuthView.tsx` theo phong cách "Modern Romanticism" với glassmorphism và hiệu ứng chuyển cảnh mượt mà.
- **Backend**: Thêm `password_hash` vào SQLite, cấu trúc `authRouter` xử lý `/register` và `/login`. Sử dụng `bcryptjs` để bảo mật mật khẩu.
- **Integration**: Gated truy cập ứng dụng bằng Auth, tích hợp header logout và đồng bộ state người dùng theo phone number.
- **Files đã sửa**: `server/src/db/client.ts`, `server/src/services/userService.ts`, `server/src/routes/auth.ts`, `server/src/index.ts`, `client/src/services/api.ts`, `client/src/components/auth/AuthView.tsx`, `client/src/App.tsx`.
- **Tasks hoàn thành**: W8.

---

> 💡 **Hướng dẫn cập nhật:** Sau mỗi session, thêm một dòng mới vào **Changelog**, tick ✅ các task đã xong, chuyển bugs đã fix sang phần ✅, và commit cùng với code.

### Session #11 — 2026-04-28
- **Home UI Redesign**: Thiết kế lại header (avatar clickable + Welcome back + Date Miles badge), bỏ logo Widget Date và sync UI cũ.
- **Profile Screen (NEW)**: Tạo `ProfileView.tsx` — full-page overlay với Account, Data Sync, Notifications, App Info, Logout.
- **Weather Detail Screen (NEW)**: Tạo `WeatherDetailView.tsx` — giao diện chi tiết thời tiết premium (temp, wind, humidity, UV, sunset, pressure, visibility, clouds).
- **Bug Fix — Mobile Clickability**: Thêm `pointer-events-none` vào decorative blur divs để fix click bị chặn trên phone dimensions.
- **Bug Fix — Drive Gate**: Sửa thông báo lỗi 401 trong `useAIPlanner.ts`, bỏ yêu cầu đăng nhập Drive.
- **Bug Fix — Profile Interactivity**: Thêm toast feedback cho Edit Profile, Phone, Change Password.
- **Files đã sửa**: `App.tsx`, `HomeDashboardUI.tsx`, `HomeView.tsx`, `ProfileView.tsx`, `WeatherDetailView.tsx`, `useAIPlanner.ts`.

---

### Session #12 — 2026-04-28
- **Fix Auth → AI Decoupling**: AI routes (`/combos`, `/chat`, `/nearby-places`) không còn yêu cầu Google OAuth. Thay `authGuard` bằng `optionalAuth` + `dualLimiter` (verified: 20 req/hr, guest: 3 req/hr).
- **Fix Drive Sync Toggle**: Kết nối `drive.logout` vào nút toggle Data Sync trong ProfileView (trước đó là placeholder rỗng).
- **Fix Error Message**: Thay "Phiên đăng nhập đã hết hạn" bằng "Bạn đã hết lượt dùng AI" khi bị rate limit.
- **OpenRouter Model Rotation**: Đưa `nvidia/nemotron-nano-9b-v2:free` lên primary (model ổn định nhất). Test 10 model, loại bỏ 7 model chết/429.
- **Unique Combo Images**: Thêm pool 10 ảnh Unsplash, mỗi combo card hiển thị ảnh riêng theo index.
- **Clickable Venue in Combo**: Bấm vào địa điểm trong combo luôn mở modal xem ảnh + link Google Maps.
- **Fix Combo Tab Persistence**: Sync combos từ `useAIPlanner` ngược lên App state qua `useEffect` — combos không mất khi chuyển tab.
- **localStorage Persistence**: Auth, combos, preferences lưu vào localStorage, chỉ xóa khi logout — reload page không mất data.
- **Files đã sửa**: `authMiddleware.ts`, `gemini.ts`, `App.tsx`, `useAIPlanner.ts`, `ComboList.tsx`, `HomeView.tsx`, `.env`.

---


### Session #13 — 2026-04-28 (Autonomous)
- **Type Safety Cleanup**: Loại bỏ toàn bộ 8 chỗ `as any` trong codebase (7 server + 1 client).
- **New**: Tạo `server/src/types/index.ts` chứa `AuthenticatedRequest`, `HttpError` interfaces.
- **Client**: Tạo `ApiError` class thay thế `(error as any).status`. Thêm `WeatherData`, `UserProfile` interfaces. Type `AuthResponse.user` đầy đủ.
- **Server**: Thay `(req as any).user` bằng `req.user` qua `AuthenticatedRequest` type mở rộng.
- **Verification**: TSC 0 errors cả client + server. Zero `as any` còn lại.
- Files đã sửa: `server/src/types/index.ts` (NEW), `authMiddleware.ts`, `errorHandler.ts`, `rateLimiter.ts`, `gemini.ts`, `client/src/services/api.ts`.

---


### Session #14 — 2026-04-28
- **Explore Page Redesign**: Chuyển từ 4-tab layout sang single-scroll discovery page.
  - Sticky header với search bar + category filter pills (Tất cả, Cafe, Food, Lãng mạn, Sang trọng)
  - Map preview section "Địa điểm gần đây" với geolocation
  - Image-card place listings với favorite hearts, rating, tags, action buttons
  - 2x2 category discovery grid (Ăn tối, Cafe & Chill, Đi dạo, Xem phim)
  - Horizontal scroll cards cho Movies và Trends
- **Bottom Nav Redesign**: Thay purple → rose primary (#894c5c), floating circle active indicator, glass-card background, Material Symbols icons.
- **Chat FAB**: Cập nhật màu từ purple gradient sang primary rose.
- **CSS**: Thêm `.category-card` overlay + `.scroll-hidden` scrollbar utilities.
- **Verification**: TSC 0 errors cả client + server.
- Files đã sửa: `App.tsx`, `index.css`, `ExploreView.tsx` (rewrite).

---

### Session #15 — 2026-04-28 (Autonomous)
- **Fix GitHub MCP**: Chuyển cấu hình `github-mcp-server` từ Docker sang `npx` để fix lỗi "docker not found" trên Windows.
- **MCP Config Cleanup**: Tối ưu lại file `mcp_config.json`, xóa bỏ các object `mcpServers` lồng nhau không cần thiết.
- Files đã sửa: `c:\Users\cun\.gemini\antigravity\mcp_config.json`.
- Status: GitHub MCP đã sẵn sàng chạy qua npx.

---

### Session #16 — 2026-04-29
- **ComboActionModal**: Tạo modal xác nhận hỏi ý kiến người dùng khi chọn AI Combo ("Bạn có muốn tự chọn thêm không?").
- **Bug Fix (Pre-population)**: Sửa lỗi mất dữ liệu khi vào Focus Mode. Tự động map các hoạt động từ AI Combo vào `comboSlots`.
- **Manual Combo**: Thêm tính năng "Tự tạo combo" (3 slot trống mặc định), cho phép đổi tên Combo tùy ý và hỗ trợ thêm không giới hạn các điểm đến mới bằng nút "Thêm địa điểm".
- **UI Full-screen Focus Mode**: Chuyển giao diện Focus Mode thành Overlay toàn màn hình (`fixed inset-0`), bao gồm progress bar, header sticky.
- **TypeScript Fixes**: Sửa lỗi `TS2739` ở `HomeView.tsx` bằng cách pass `onManualCombo` và `setActiveCombo` từ `App.tsx`. Đã fix logic override sai của `handleSelectCombo` trong `HomeView.tsx`.
- **Files đã sửa**: `App.tsx`, `HomeDashboardUI.tsx`, `HomeView.tsx`, `ComboActionModal.tsx` (mới).
- **Tasks hoàn thành**: Focus Mode & AI Combo
- **Verification**: `npx tsc --noEmit` hoàn thành không lỗi.

---
### Session #17 — 2026-04-29
- **Fix Vercel Build**: Bổ sung `@tailwindcss/oxide-linux-x64-gnu` và `@tailwindcss/oxide-linux-x64-musl` vào `optionalDependencies`.
- **Context**: Build Vercel (Linux) thất bại do thiếu native binary của Tailwind v4 Oxide engine.
- Files đã sửa: `client/package.json`, `package.json`, `PROGRESS.md`.
- Status: Đã push và chờ Vercel auto-deploy.

### Session #18 — 2026-04-29
- **Final Validation**: Chạy `npx tsc --noEmit` cho client, kết quả 0 lỗi.
- **Live Deploy**: Xác nhận commit "fix: add ErrorBoundary + weather fallback..." đã được Vercel build thành công.
- **Status**: READY. App live tại https://widget-date-client.vercel.app

---

### Session #19 — 2026-04-29
- **API Hardening**: Thêm try-catch và fallbacks cho toàn bộ endpoints trong `api.ts` (Weather, Trends, User Sync, Profile).
- **Background Resilience**: Cập nhật `useDriveSync` để cô lập lỗi đồng bộ ngầm, không gây crash UI.
- **Hook Optimization**: Refactor `useWeather` check null API response.
- **UI Logic**: Chuyển trends fetch trong `ExploreView.tsx` sang `useEffect` để quản lý side-effect an toàn.
- **Verification**: `npx tsc --noEmit` Pass.
- **Files đã sửa**: `api.ts`, `useDriveSync.ts`, `ExploreView.tsx`, `useWeather.ts`.


### Session #20 — 2026-04-29
- Xóa bỏ tính năng "Outfit Gợi ý" và các dữ liệu liên quan (OUTFIT_STYLES, RENTAL_STYLES) để làm gọn ứng dụng.
- Tối ưu danh sách Category trong ExploreView để lấy động từ database (REAL_LOCATIONS), loại bỏ các mục hardcode thừa (Lãng mạn, Sang trọng, Xem phim).
- Đồng bộ hằng số giữa data.tsx và constants.ts.
- Kiểm tra tính nhất quán của dữ liệu locations.json.
- Files đã sửa: client/src/data.tsx, client/src/data/constants.ts, client/src/components/explore/ExploreView.tsx, AUTONOMOUS_LOG.md, PROGRESS.md
- Tasks hoàn thành: W7, W4

### Session #21 — 2026-04-30
- Khắc phục lỗi crash ứng dụng trên Vercel do `GoogleOAuthProvider` thiếu `clientId`.
- Bổ sung fallback `clientId` (giá trị dummy) trong `client/src/main.tsx` khi `VITE_GOOGLE_CLIENT_ID` không tồn tại ở môi trường production. Điều này giúp `GoogleOAuthProvider` vẫn khởi tạo thay vì ném lỗi đồng bộ gây sập Component Tree (do chưa có ErrorBoundary cụ thể cho hook OAuth).
- Hủy bỏ bọc `try/catch` ở hook `useGoogleLogin` trong `useDriveSync.ts` để tuân thủ Rules of Hooks.
- Files đã sửa: `client/src/main.tsx`

### Session #23 — 2026-05-01
- **Localization Infrastructure**: Triển khai `useLocale` hook để quản lý đa ngôn ngữ tập trung qua `vi.json`.
- **Explore & History View Localization**: Hoàn tất chuyển đổi chuỗi cứng sang translation keys cho cả hai view.
- **Accessibility (A11y)**: 
    - Thêm `.sr-only` utility vào `index.css` cho các heading SEO ẩn.
    - Chuẩn hoá ARIA labels, roles (`tablist`, `tab`, `article`) và focus management.
    - Đảm bảo tất cả các button và link có label mô tả rõ ràng cho Screen Reader.
- **Files đã sửa**: `vi.json`, `useLocale.ts` (mới), `index.css`, `HistoryView.tsx`, `ExploreView.tsx`.
- **Tasks hoàn thành**: Localization & A11y Finalization.
- **PROJECT_CONTEXT.md synced.**

### Session #24 — 2026-05-01
- **Autonomous Log Consolidation**: Hợp nhất toàn bộ log phân mảnh từ `.agent/AUTONOMOUS_LOG.md` vào file root `AUTONOMOUS_LOG.md`.
- **Git History Integration**: Bổ sung lịch sử các phiên chạy từ Session #17 đến #22 dựa trên Git commit history để đảm bảo tính liên tục.
- **Log Standardization**: Chuẩn hoá format log theo chuẩn ISO timestamp, chi tiết file thay đổi và root cause.
- **Infrastructure Cleanup**: Xoá file log dư thừa trong `.agent/` và cập nhật reference path trong `PROJECT_CONTEXT.md`.
- Files đã sửa: `AUTONOMOUS_LOG.md`, `PROJECT_CONTEXT.md`, `PROGRESS.md`.
- Tasks hoàn thành: Log output fix & Migration.

### Session #25 — 2026-05-01
- **Agent Infrastructure Refactoring**: 
  - Tách `GEMINI.md` thành `GEMINI-routing.md` và `GEMINI-scripts.md` để giảm token bloat.
  - Bổ sung `Token Budget Rule` vào `GEMINI.md`.
  - Hợp nhất quy tắc Autonomous vào `.agent/rules/autonomous-policy.md`.
  - Làm gọn workflow tại `.agent/workflows/autonomous.md`.
  - Cập nhật Rollback Protocol, Progress Tracking Format, Session ID format vào `autonomous-policy.md`.
  - Tạo mới `.agent/CHANGELOG.md` để theo dõi các thay đổi hạ tầng.
- Files đã sửa: `GEMINI.md`, `GEMINI-routing.md`, `GEMINI-scripts.md`, `autonomous-policy.md`, `autonomous.md`, `CHANGELOG.md`, `PROGRESS.md`.
- Tasks hoàn thành: Refactor `.agent/` infrastructure, P0, P1, P2, P3 tasks.

### Session #26 — 2026-05-01
- **Agent Infrastructure Cleanup Pass #3**:
  - Hợp nhất Hard Stop #6 và #7 trong `autonomous-policy.md`.
  - Thêm quy tắc `Commit Discipline` để ngăn chặn việc mix commit giữa infra và code.
  - Thêm `Session Scope Declaration` bắt buộc khai báo trước khi chạy autonomous.
  - Cấu trúc lại `CHANGELOG.md` theo chuẩn Keep a Changelog.
  - Thêm trigger tiếng Việt vào `GEMINI-scripts.md`.
- Files đã sửa: `.agent/rules/autonomous-policy.md`, `.agent/rules/GEMINI-scripts.md`, `.agent/CHANGELOG.md`, `PROGRESS.md`, `AUTONOMOUS_LOG.md`.
- Tasks hoàn thành: Cleanup pass #3.
### Session #27 — 2026-05-01
- **Agent Infrastructure Cleanup Pass #3 (Correction)**:
  - Sửa lại `load_when` trong `GEMINI-routing.md` để khớp hoàn toàn yêu cầu của user.
  - Chuyển các thay đổi từ `[Unreleased]` sang `[2026-05-01]` trong `CHANGELOG.md` để đúng chuẩn.
  - Kiểm tra và đảm bảo không còn "Antigravity Kit" trong toàn bộ project (ngoại trừ changelog log).
- Files đã sửa: `.agent/rules/GEMINI-routing.md`, `.agent/CHANGELOG.md`, `PROGRESS.md`, `AUTONOMOUS_LOG.md`.
- Tasks hoàn thành: Cleanup pass #3 (Final Refinement).
### Session #28 — 2026-05-01
- **Agent Infrastructure Cleanup Pass #4**:
  - Thêm Hard Stop #7 để thực thi việc phân tách domain (infra vs code).
  - Bổ sung ví dụ BAD/GOOD cho quy tắc đặt tên commit trong Commit Discipline.
- Files đã sửa: `.agent/rules/autonomous-policy.md`, `PROGRESS.md`, `AUTONOMOUS_LOG.md`.
- Tasks hoàn thành: Cleanup pass #4.
### Session #29 — 2026-05-01
- [x] Fix SEO Meta Tags in `date_history_visual_timeline/code.html`
- [x] Fix Image Alt Tags in `HomeDashboardUI.tsx` and `HistoryView.tsx`
- [x] Move skip link in `client/index.html` from head to body
- [x] Đã verify toàn bộ 8/8 core checks trong `checklist.py` (Security, Lint, Schema, Tests, UX, SEO, Lighthouse, Playwright) đều PASSED.
- Files đã sửa: `client/index.html`, `client/src/components/home/HomeDashboardUI.tsx`, `client/src/components/history/HistoryView.tsx`, `Date_history_screens/date_history_visual_timeline/code.html`
- Tasks hoàn thành: Giải quyết triệt để các vấn đề SEO tồn đọng.

### Session #30 — 2026-05-02
- **HistoryView Redesign**: Thực hiện redesign toàn diện tab Lịch sử.
- **Design System Sync**: Chuyển đổi toàn bộ `pink-*` sang `primary` tokens, thay `glass-panel` bằng `glass-card`.
- **UI Polish**: Redesign Header (bỏ avatar/tên app), Tab Switcher (dùng pill buttons), Timeline Cards (staggered animation), và Empty State.
- **i18n**: Cập nhật `vi.json` với các keys mới cho trạng thái trống.
- **Verification**: Đã chạy `tsc` và pass 100% type safety.
- Files đã sửa: `HistoryView.tsx`, `vi.json`, `PROGRESS.md`, `task.md`.
- Tasks hoàn thành: Redesign HistoryView.
