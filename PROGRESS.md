# 📋 PROGRESS.md — Widget Date

> **Mục đích:** File theo dõi tiến độ dự án. Cập nhật sau **mỗi lần chỉnh sửa**.
> **Cách dùng:** Đọc file này trước khi bắt đầu một session làm việc. Commit file này cùng với code.

---

## 🗓️ Cập nhật lần cuối

| Trường | Giá trị |
|---|---|
| **Ngày** | 2026-04-27 |
| **Phiên làm việc** | #10 — Authentication System Integration |
| **Nhánh Git** | `main` |

---

## 📊 Tổng quan tiến độ

```
Tính năng chính    ██████████████░░░░░░  70%
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
- [ ] Sở thích | Chỉ hiện category có trong database, không hiện các mục thừa (W4)
| W5 | Trang chủ | Bổ sung thêm địa điểm vào mục Sở thích / Workspace | `data/locations.ts` |
- [x] **Database** — Tạo user database riêng (key = số điện thoại): lưu sở thích, địa điểm, lịch sử tab (W6)
- [x] **Authentication** — Triển khai hệ thống Đăng nhập/Đăng ký (Login/Register) bảo mật với mật khẩu hashed (W8)
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
