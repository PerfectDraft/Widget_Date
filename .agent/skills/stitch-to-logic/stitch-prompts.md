# Stitch Import Prompt Templates

Use these prompts verbatim when pulling UI from Stitch. Copy, fill in the bracket placeholders, and send to `@super-manager`.

---

## Prompt 1 — Import a single screen and wire all logic

```text
@super-manager /stitch [screen_name]

**Screen:** [screen_name]
**Project:** Widget Date Mobile Dashboard (ID: 17526464061189967193)

**Tasks:**
- Import the screen from Stitch
- Run the full stitch-to-logic 6-step protocol
- Wire real data from existing hooks/APIs where available
- Create new hooks where data source does not exist yet
- Implement loading, empty, error, and success states
- Do NOT edit Stitch component internals

**Done when:** `npx tsc --noEmit` passes with zero errors and all 4 states render correctly.
```

---

## Prompt 2 — Import screen + wire to a specific API endpoint

```text
@super-manager /stitch [screen_name]

**Screen:** [screen_name]
**Data source:** [GET /api/your-endpoint]
**Response shape:** [describe or paste the interface here]

**Tasks:**
- Import the screen from Stitch
- Map all props to the data source above
- Generate TypeScript interface from the response shape
- Create `useHookName` hook that calls the endpoint
- Wire hook output into the Stitch component via a wrapper
- Implement loading, empty, error, and success states
- Do NOT edit Stitch component internals. Wrapper only.

**Done when:** `tsc` clean, all 4 states verified in browser.
```

---

## Prompt 3 — Import screen with a form / user interaction

```text
@super-manager /stitch [screen_name]

**Screen:** [screen_name]

**Interactive elements:**
- [Button name] → should do [action]
- [Input name] → feeds into [state or API param]
- [Form name] → submits to [POST /api/endpoint]

**Tasks:**
- Import the screen from Stitch
- Create handlers for every interactive element listed above
- Every async handler must have `try/catch` and user feedback (toast or error state)
- Wire handlers into the Stitch component via a wrapper — do NOT add `onClick` inline in Stitch file
- Implement form validation before submission
- Implement loading state on submit button while request is in flight

**Done when:** `tsc` clean, form submits correctly, error and success states both work.
```

---

## Prompt 4 — Re-sync screen after Stitch update (design changed)

```text
@super-manager /stitch [screen_name] re-sync

The design for [screen_name] has been updated in Stitch.

**Tasks:**
- Pull the latest version of the component from Stitch
- Compare new props interface against existing wrapper and hooks
- Update TypeScript interfaces if props changed
- Update wiring in the wrapper if new props were added or removed
- Do NOT touch hook internals unless prop shape changed
- Re-run `npx tsc --noEmit` after update
- Verify all 4 states still render correctly
- Do NOT rewrite logic that was not affected by the design change.

**Done when:** `tsc` clean, existing logic intact, new design renders correctly.
```

---

## Prompt 5 — Import multiple screens in sequence

```text
@super-manager /stitch batch

**Screens to import in order:**
1. [screen_name_1]
2. [screen_name_2]
3. [screen_name_3]

**Rules:**
- One screen at a time — confirm working before moving to the next
- Apply stitch-to-logic 6-step protocol to each screen
- Do NOT start screen N+1 until screen N passes `tsc` + visual check
- Report status after each screen: DONE / BLOCKED (with reason)

Start with screen 1 now.
```

---

## Quick Reference — Placeholder Cheatsheet

| Placeholder | What to fill in |
|---|---|
| `[screen_name]` | Exact screen name from Stitch (e.g. `LocationList`) |
| `[GET /api/endpoint]` | The real API route that feeds this screen |
| `[response shape]` | Paste the interface or describe the JSON fields |
| `[Button name]` | Label on the button as it appears in the UI |
| `[action]` | What the button should trigger (API call, navigate) |
| `[POST /api/endpoint]` | The route the form submits to |

---

## When to Use Which Prompt

| Situation | Use prompt |
|---|---|
| Kéo màn hình mới, chưa có logic gì | **Prompt 1** |
| Màn hình có API endpoint rõ ràng | **Prompt 2** |
| Màn hình có form hoặc button cần xử lý | **Prompt 3** |
| Design thay đổi, cần sync lại từ Stitch | **Prompt 4** |
| Kéo nhiều màn hình một lúc | **Prompt 5** |