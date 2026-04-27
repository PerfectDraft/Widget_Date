# Autonomous Operation Log — Widget Date

This file records every action taken during autonomous mode runs.
Do NOT edit manually. Updated automatically by @super-manager during autonomous execution.

Format per entry:
```
## [ISO timestamp] — [issue description]
- Files: [list]
- Change type: Low / Medium
- Root cause: [one sentence]
- Fix applied: [description]
- Verification: lint [pass/fail] / types [pass/fail] / tests [pass/fail]
- Result: Resolved / Handed off
```

---

<!-- Autonomous run entries will appear below this line -->

## 2026-04-27T16:29 — B4/B5: Delete obsolete client geminiService.ts
- Files: `client/src/services/geminiService.ts` (DELETED)
- Change type: Low
- Root cause: Legacy file from pre-monorepo era imports `@google/genai` (removed package) and uses `import.meta.env` incorrectly, causing TS compilation errors B4 and B5.
- Fix applied: Verified zero imports via grep, then deleted the file.
- Verification: grep [pass] — no references found in client/src
- Result: Resolved

## 2026-04-27T16:33 — B2: "Thêm vào Combo" button has no state
- Files: `client/src/App.tsx`, `client/src/components/explore/ExploreView.tsx`
- Change type: Medium
- Root cause: The "+ Combo" button in ExploreView line 112 only called `showToast()` without saving the location to any state array.
- Fix applied: Added `savedPlaces` state + `handleAddToCombo` callback in App.tsx (with duplicate check). Added `onAddToCombo` + `savedPlacesCount` props to ExploreView. Button now pushes LocationItem into list and shows count badge.
- Verification: lint [pass] / types [pass]
- Result: Resolved

## 2026-04-27T16:39 — Low-risk cleanup scan (4 issues)
- Files: `useDriveSync.ts`, `ExploreView.tsx`, `main.tsx`, `tsconfig.json`
- Change type: Low
- Root cause: Leftover `console.log` in login error handler, 2x unnecessary `as any` casts in ExploreView (LocationItem already has `imageUrl`, placesSort type inferrable), and missing `vite/client` types in tsconfig forcing `import.meta as any` workaround.
- Fix applied: (1) `console.log` → `console.error` (2) `as any` → `as typeof placesSort` (3) `(loc as any).imageUrl` → `loc.imageUrl` (4) Added `"types": ["vite/client"]` to tsconfig, removed `as any` cast in main.tsx.
- Verification: tsc --noEmit [pass] / lint [pass]
- Result: Resolved (all 4 issues)

## 2026-04-27T17:19 — Autonomous scan: log severity + accessibility
- Files: `server/src/services/geminiService.ts`, `client/src/App.tsx`
- Change type: Low
- Root cause: (1) Server `geminiService.ts` used `console.log` for operational info (should be `console.info`). (2) Client App.tsx had zero `aria-label` attributes on interactive buttons (nav, logout, login).
- Fix applied: (1) `console.log` → `console.info` in server fallback handler. (2) Added `aria-label` to nav buttons, logout button, login button. Added `aria-current="page"` to active nav tab. Added `aria-label` to `<nav>` element.
- Verification: tsc --noEmit [pass] on both client + server
- Result: Resolved

### Issues skipped (out of scope)
- **B3** (Geolocation error) — Medium risk, needs real device testing to reproduce
- **B6** (CANNOT GET /) — High risk, server config, protected scope
