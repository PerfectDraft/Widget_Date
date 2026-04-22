# 🔒 Security & Structure Audit — Widget Date

> 🤖 **Applying knowledge of `@security-auditor`...**

**Thời điểm kiểm tra:** 2026-04-20 14:33 UTC+7
**Phạm vi:** Toàn bộ source code `d:\UET\Nam_2\KNKN\Widget_Date`

---

## 🚨 1. API Key Exposure (CRITICAL)

### 1.1. File `.env` — Lộ Key thật

> [!CAUTION]
> File `.env` chứa **API Key thật** đang expose ra plaintext:

```
VITE_GEMINI_API_KEY="AIzaSyALrBG8Zfzf3glUx35TJXcyyQSFwiKwrdE"
VITE_OPENWEATHER_API_KEY="7eb67699a868fd2f0b5be2741b92b5dd"
```

| Item | Severity | Chi tiết |
|------|----------|----------|
| Gemini API Key (`AIzaSy...`) | **🔴 CRITICAL** | Key thật, lộ sẽ bị abuse quota / billing |
| OpenWeather Key | **🟠 HIGH** | Key thật, dùng free tier nhưng vẫn là credential |

**Tình trạng `.gitignore`:** `.env*` ĐÃ được exclude (`!.env.example` exception đúng) → nếu chưa từng commit `.env` thì OK. **Cần xác nhận lại git history.**

### 1.2. Prefix `VITE_` — Key bị bake vào Client Bundle

> [!WARNING]
> Tất cả biến env có prefix `VITE_` sẽ bị Vite **inject trực tiếp vào JavaScript bundle** gửi cho browser. Bất kỳ ai mở DevTools → Sources đều đọc được key.

**File ảnh hưởng:**
- [geminiService.ts](file:///d:/UET/Nam_2/KNKN/Widget_Date/src/services/geminiService.ts#L55) — `import.meta.env.VITE_GEMINI_API_KEY`
- [App.tsx](file:///d:/UET/Nam_2/KNKN/Widget_Date/src/App.tsx#L280) — `import.meta.env.VITE_OPENWEATHER_API_KEY`

### 1.3. `vite.config.ts` — Redundant Key Injection

[vite.config.ts](file:///d:/UET/Nam_2/KNKN/Widget_Date/vite.config.ts#L11-L12) có block `define` inject thêm key vào `process.env` — thừa và tăng diện tích lộ:

```ts
'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
```

### 1.4. Khuyến nghị

| Action | Priority |
|--------|----------|
| Đổi luân chuyển (rotate) tất cả API keys ngay lập tức | 🔴 P0 |
| Tạo backend proxy (API route) để giấu key khỏi client | 🔴 P0 |
| Xóa block `define` thừa trong `vite.config.ts` | 🟡 P2 |
| Kiểm tra `git log -- .env` xem key có từng bị commit chưa | 🔴 P0 |

---

## ⚠️ 2. Lỗ hổng bảo mật khác

### 2.1. `allorigins.win` — Untrusted 3rd-party Proxy

[geminiService.ts#L339](file:///d:/UET/Nam_2/KNKN/Widget_Date/src/services/geminiService.ts#L339) dùng `api.allorigins.win` để proxy fetch HTML tránh CORS:

```ts
fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(mapsUri)}`)
```

| Risk | Description |
|------|-------------|
| **Man-in-the-Middle** | Bên thứ 3 có thể inject/modify response |
| **Data Leakage** | URL người dùng truy vấn bị log bởi bên thứ 3 |
| **Service Availability** | Nếu allorigins.win sập → feature hỏng |

### 2.2. `localStorage` — Unsanitized Data Storage

- [geminiService.ts#L354](file:///d:/UET/Nam_2/KNKN/Widget_Date/src/services/geminiService.ts#L354): Cache ảnh vào `localStorage` không giới hạn, có thể gây **quota overflow**.
- [App.tsx#L223](file:///d:/UET/Nam_2/KNKN/Widget_Date/src/App.tsx#L223): `JSON.parse(localStorage.getItem('user_reward'))` — không có try/catch, nếu data bị corrupt sẽ **crash app**.

### 2.3. Deep Link Injection

[App.tsx#L436-L448](file:///d:/UET/Nam_2/KNKN/Widget_Date/src/App.tsx#L436-L448): Tạo deep link Grab/Be/Xanh SM từ user input (name, lat, lng) mà không validate → potential XSS/open redirect qua `window.open(url, '_blank')`.

---

## 📁 3. Cấu trúc thư mục — Đánh giá

### 3.1. Sơ đồ hiện tại

```
Widget_Date/
├── .env                    ← 🔴 Key thật
├── .env.example            ← ✅ OK
├── .gitignore              ← ✅ Đã exclude .env
├── index.html
├── package.json
├── vite.config.ts
├── dist/                   ← ⚠️ Build output, KHÔNG nên commit
├── data-service/           ← ⚠️ Module phụ, stale crawler
│   ├── crawl.js
│   ├── cronjob.js
│   ├── scraper.js
│   ├── database.js
│   ├── python-scraper/     ← SQLite + Python scraper
│   └── data/               ← raw_places.json + SQLite DB
└── src/
    ├── App.tsx             ← 🔴 74KB MONOLITH (1306 dòng!)
    ├── data.tsx            ← 🟠 72KB (973 dòng data cứng)
    ├── main.tsx            ← ✅ OK (241B)
    ├── index.css           ← ✅ OK (251B)
    ├── components/
    │   └── Toast.tsx       ← ✅ OK (1KB) - DUY NHẤT 1 component
    ├── lib/
    │   └── utils.ts        ← ✅ OK (175B)
    └── services/
        └── geminiService.ts ← 🟡 14KB, chứa nhiều concern khác nhau
```

### 3.2. Verdict: **RẤT LỘN XỘN** 🟥

| Vấn đề | Severity | Chi tiết |
|---------|----------|----------|
| `App.tsx` = God Component | **🔴 CRITICAL** | **1306 dòng, 74KB** — chứa TẤT CẢ: routing, state, UI render, business logic, modals, chat, payment, gamification. Không component nào được tách ra. |
| `data.tsx` = Data Dump | **🟠 HIGH** | 973 dòng, chủ yếu là JSON hardcoded `REAL_LOCATIONS` (45+ entries với URLs rất dài). Nên tách ra file `.json` riêng. |
| `components/` gần trống | **🟠 HIGH** | Chỉ có 1 file `Toast.tsx`. Tất cả UI components (`SwipeCard`, `AIMonitor`, tabs...) đều nằm trong `App.tsx`. |
| `data-service/` stale | **🟡 MEDIUM** | Crawler Python + JS cũ, SQLite DB, không liên quan trực tiếp tới app. Nên tách repo hoặc xóa. |
| `dist/` committed | **🟡 MEDIUM** | Build output không nên nằm trong git. Thêm vào `.gitignore`. |

---

## 🗑️ 4. Danh sách File "Rác" / Logic hỗn tạp

| File | Loại | Lý do |
|------|------|-------|
| [App.tsx](file:///d:/UET/Nam_2/KNKN/Widget_Date/src/App.tsx) | 🗑️ Logic hỗn tạp | **God File** — 1306 dòng chứa mọi thứ: `SwipeCard`, `AIMonitor`, `renderHome()`, `renderExplore()`, payment, chat, gamification, weather, ride-hailing, image viewer — TẤT CẢ TRONG 1 FILE. |
| [data.tsx](file:///d:/UET/Nam_2/KNKN/Widget_Date/src/data.tsx) | 🗑️ Data dump | 973 dòng, mix giữa TypeScript interfaces + JSX icons + JSON data cứng. `REAL_LOCATIONS` array chiếm ~700 dòng với Google Maps URLs rất dài. Nên tách thành `locations.json` + `types.ts`. |
| [data-service/crawl.js](file:///d:/UET/Nam_2/KNKN/Widget_Date/data-service/crawl.js) | 🗑️ Stale | Crawler cũ, chỉ scrape 1 URL Vincom, output ra `raw_places.json`. Không được dùng trong app. |
| [data-service/cronjob.js](file:///d:/UET/Nam_2/KNKN/Widget_Date/data-service/cronjob.js) | 🗑️ Stale | Cronjob chưa implement hoặc không dùng. |
| [data-service/scraper.js](file:///d:/UET/Nam_2/KNKN/Widget_Date/data-service/scraper.js) | 🗑️ Stale | Scraper JS cũ, trùng chức năng với Python scraper. |
| [data-service/database.js](file:///d:/UET/Nam_2/KNKN/Widget_Date/data-service/database.js) | 🗑️ Stale | SQLite handler, không kết nối với frontend. |
| [data-service/python-scraper/](file:///d:/UET/Nam_2/KNKN/Widget_Date/data-service/python-scraper) | 🗑️ Stale | Python scraper + SQLite `.db` cache. Artifact cũ. |
| [data-service/data/places.sqlite](file:///d:/UET/Nam_2/KNKN/Widget_Date/data-service/data/places.sqlite) | 🗑️ Binary rác | SQLite binary 24KB nằm trong repo — không nên commit binary DB. |
| [dist/](file:///d:/UET/Nam_2/KNKN/Widget_Date/dist) | 🗑️ Build artifact | Production build output. Thêm `dist/` vào `.gitignore` và xóa khỏi git. |
| [TaskList.ini](file:///d:/UET/Nam_2/KNKN/Widget_Date/TaskList.ini) | ❓ Suspect | File `.ini` ở root — có thể là file quản lý task cá nhân, không thuộc source code. |

---

## 📊 5. Tóm tắt điểm Risk

```
┌─────────────────────────────────┬──────────┐
│ Category                        │ Score    │
├─────────────────────────────────┼──────────┤
│ A04 - Cryptographic Failures    │ 🔴 9/10  │  ← API keys exposed client-side
│ A02 - Security Misconfiguration │ 🟠 7/10  │  ← dist committed, allorigins proxy
│ A03 - Supply Chain              │ 🟡 5/10  │  ← untrusted proxy dependency
│ A06 - Insecure Design           │ 🟠 7/10  │  ← God component, no separation
│ Code Quality / Tech Debt        │ 🔴 9/10  │  ← Monolith App.tsx, no tests
└─────────────────────────────────┴──────────┘
```

---

## ✅ 6. Action Items (Theo Priority)

| # | Action | Priority | Effort |
|---|--------|----------|--------|
| 1 | **Rotate tất cả API keys** (Gemini + OpenWeather) | 🔴 P0 | 5 min |
| 2 | **Kiểm tra git history** (`git log -- .env`) — nếu có, dùng `git filter-branch` hoặc BFG để xóa | 🔴 P0 | 30 min |
| 3 | **Tạo backend proxy** để giấu API key khỏi client bundle | 🔴 P0 | 2-4h |
| 4 | **Tách `App.tsx`** thành 8-10 components nhỏ | 🟠 P1 | 4-6h |
| 5 | **Tách `data.tsx`** → `types.ts` + `locations.json` + `constants.ts` | 🟠 P1 | 1-2h |
| 6 | **Xóa/archive `data-service/`** | 🟡 P2 | 10 min |
| 7 | **Thêm `dist/` vào `.gitignore`** + xóa khỏi git | 🟡 P2 | 5 min |
| 8 | **Xóa block `define` thừa** trong `vite.config.ts` | 🟡 P2 | 2 min |
| 9 | **Thay thế `allorigins.win`** bằng backend proxy riêng | 🟡 P2 | 1-2h |
| 10 | **Thêm try/catch** cho `localStorage.getItem` parse | 🟢 P3 | 5 min |
