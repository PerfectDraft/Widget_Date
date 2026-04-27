# 🔍 .agent System Integrity Audit — Widget Date

**Date:** 2026-04-27T17:00  
**Auditor:** @super-manager + @security-auditor  
**Scope:** Toàn bộ `.agent/` — references, rule conflicts, policy gaps, file integrity

---

## 🔴 BLOCKING Issues (3)

### 1. `security_audit_report.md` — PHANTOM REFERENCE
- **Where:** [super-manager.md](file:///d:/UET/Nam_2/Kỳ 2/KNKN/Widget_Date/.agent/agents/super-manager.md) line 79
- **Quote:** `"Always remind summoned agents about security_audit_report.md to prevent leaking API keys"`
- **Problem:** File `security_audit_report.md` **DOES NOT EXIST** anywhere in `.agent/`
- **Risk:** Every agent that reads this instruction tries to load a nonexistent file → silently ignored → security guardrail is phantom
- **Fix:** Either create `security_audit_report.md` with real audit findings, or replace the reference with something that exists (e.g., the Protected Zones list in [autonomous-policy.md](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/rules/autonomous-policy.md))

### 2. [PROJECT_CONTEXT.md](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/.shared/PROJECT_CONTEXT.md) — WRONG TECH STACK
- **Where:** [PROJECT_CONTEXT.md](file:///d:/UET/Nam_2/Kỳ 2/KNKN/Widget_Date/.agent/.shared/PROJECT_CONTEXT.md) lines 14, 24, 38
- **Problem:** States project is **"React Native"** mobile app — but Widget Date is actually **React 19 + Vite 6** web app running in browser
- **Impact:**
  - Line 14: `Type: Mobile Application (React Native)` → **WRONG**
  - Line 24: `Mobile frontend | React Native` → **WRONG**
  - Line 38: `client/ <- React Native mobile app` → **WRONG**
  - Line 58: `always use @mobile-developer, never @frontend-specialist` → **CONFLICTING** with actual project type
- **Risk:** Any agent reading PROJECT_CONTEXT will apply React Native patterns to a React web project → incorrect code, wrong imports, wrong component patterns

### 3. Duplicate Folders at Project Root — ORPHANED FILES
- **Found:** `agents/`, `rules/`, `workflows/`, `.shared/` directories exist at **project root** (`d:\UET\...\Widget_Date\`)
- **Cause:** User ran `Expand-Archive` without `-DestinationPath .agent/`, then manually `Copy-Item`'d files but didn't delete originals
- **Risk:** Git tracks these orphaned copies → confusion about source of truth, potential stale data
- **Fix:** Delete root-level `agents/`, `rules/`, `workflows/`, `.shared/` folders (keep only `.agent/` versions)

---

## 🟡 SUGGESTION Issues (3)

### 4. Stitch MCP Routing Rule — MISLEADING
- **Where:** [super-manager.md](file:///d:/UET/Nam_2/Kỳ 2/KNKN/Widget_Date/.agent/agents/super-manager.md) line 91, [PROJECT_CONTEXT.md](file:///d:/UET/Nam_2/Kỳ 2/KNKN/Widget_Date/.agent/.shared/PROJECT_CONTEXT.md) line 58
- **Rule:** "Widget Date = MOBILE app → always `@mobile-developer`, NEVER `@frontend-specialist`"
- **Reality:** Widget Date is a **React web app** with Vite, not React Native
- **Fix:** Change to `@frontend-specialist` as default for UI work, keep `@mobile-developer` only if project migrates to React Native

### 5. [autonomous-policy.md](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/rules/autonomous-policy.md) — Missing "Max Files Per Run" Limit
- **Problem:** Policy defines risk levels and confidence thresholds but lacks a **max files per autonomous run** limit
- **Recommendation:** Add rule: "Maximum 10 files modified per autonomous run. Stop and hand off if approaching limit."
- **Rationale:** Prevents scope creep in long autonomous sessions

### 6. [progress-tracking.md](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/rules/progress-tracking.md) Rule References Ambiguous Path
- **Where:** [super-manager.md](file:///d:/UET/Nam_2/Kỳ 2/KNKN/Widget_Date/.agent/agents/super-manager.md) line 101
- **Quote:** "Read [progress-tracking.md](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/rules/progress-tracking.md) to resume context"
- **Problem:** There are TWO progress tracking files:
  - [.agent/rules/progress-tracking.md](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/rules/progress-tracking.md) (the RULE about how to track progress)
  - [PROGRESS.md](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/PROGRESS.md) at project root (the ACTUAL progress data)
- **Fix:** Clarify: "Read [.agent/rules/progress-tracking.md](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/rules/progress-tracking.md) for protocol, then read project root [PROGRESS.md](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/PROGRESS.md) for current state"

---

## 🟢 NIT Issues (3)

### 7. `terminal-guard.md` — Clean Removal ✅
- **Status:** Intentionally removed, documented in PROJECT_CONTEXT line 76
- **Verdict:** Clean. No dangling references found (old super-manager referenced it, new version uses inline pre-flight checklist)

### 8. Scripts — All Present ✅
| Script | Status |
|---|---|
| [checklist.py](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/scripts/checklist.py) | ✅ Exists (7.5KB) |
| [verify_all.py](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/scripts/verify_all.py) | ✅ Exists (11KB) |
| [session_manager.py](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/scripts/session_manager.py) | ✅ Exists (4.2KB) |
| [auto_preview.py](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/scripts/auto_preview.py) | ✅ Exists (4KB) |

GEMINI.md references 12 additional scripts (in `skills/` subdirs) — these are skill-level scripts, not core scripts. Their existence is managed by skill resolution, not core system.

### 9. AUTONOMOUS_LOG.md — Healthy ✅
- Format correct, entries follow spec
- 3 entries logged (B4/B5, B2, cleanup scan)

---

## 📊 Summary Matrix

| Category | Items Checked | 🔴 Blocking | 🟡 Suggestion | 🟢 Pass |
|---|---|---|---|---|
| File References | 8 | 1 | 1 | 6 |
| Rule Conflicts | 4 | 1 | 1 | 2 |
| Policy Gaps | 3 | 0 | 1 | 2 |
| Scripts | 4 | 0 | 0 | 4 |
| File Integrity | 5 | 1 | 0 | 4 |
| **Total** | **24** | **3** | **3** | **18** |

---

## 🛠️ Recommended Fix Priority

| Priority | Issue | Effort | Impact |
|---|---|---|---|
| **P0** | Fix PROJECT_CONTEXT.md tech stack (React Native → React + Vite) | 5 min | All agents read wrong context |
| **P1** | Delete orphaned root folders (`agents/`, `rules/`, `workflows/`, `.shared/`) | 1 min | Git cleanliness |
| **P1** | Fix or create `security_audit_report.md` | 10 min | Security guardrail restored |
| **P2** | Fix Stitch MCP routing rule in super-manager | 2 min | Correct agent delegation |
| **P2** | Clarify [progress-tracking.md](file:///d:/UET/Nam_2/K%E1%BB%B3%202/KNKN/Widget_Date/.agent/rules/progress-tracking.md) reference | 1 min | Prevent ambiguity |
| **P3** | Add max files limit to autonomous-policy | 2 min | Scope creep prevention |
