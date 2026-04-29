# Autonomous Operation Policy — Widget Date

This file defines execution rules for AI-driven autonomous operation in the Widget Date project.
All agents operating in autonomous or semi-unattended mode MUST read this file before acting.

---

## What Autonomous Mode Means

Autonomous mode is active when:
- The user has run `/autonomous` explicitly
- The user has run `/scan` to trigger a full-project scan
- The user is away and the AI is executing a multi-step plan
- The AI is running a background maintenance or bug-fix pass

In autonomous mode: do NOT prompt for confirmation on allowed-scope tasks.
Stop and write a proposal for anything outside allowed scope.

---

## Step 0 — Proactive Scan (MANDATORY before every autonomous run)

This step MUST run before any issue is addressed. It is not optional.

```
Proactive Scan Protocol:
  1. Run: python .agent/scripts/verify_all.py   → collect TS/lint errors across entire project
  2. Run: python .agent/scripts/checklist.py    → collect known pending issues
  3. Load: .agent/skills/lint-and-validate/     → apply lint classification rules
  4. Load: .agent/skills/systematic-debugging/  → apply debug methodology to findings
  5. Optional (if /scan was used): Load .agent/skills/vulnerability-scanner/
  6. Produce: a prioritized issue list with risk level for each item
  7. Announce findings to user BEFORE executing any fix
```

If `verify_all.py` returns zero errors: state "Project health: CLEAN. No issues found." and exit autonomous mode.

---

## Allowed Autonomous Scope

| Category | Examples |
|---|---|
| UI text fixes | Typos, label corrections, placeholder text |
| Import resolution | Broken paths, missing modules, aliased imports |
| Null safety | Optional chaining, null checks, fallback values |
| UI states | Missing loading spinner, empty state, error boundary |
| Isolated state bugs | Local useState that does not affect other components |
| Type annotations | Adding TypeScript types, fixing `any` in isolated files |
| Code cleanup | Dead console.log, unused imports, commented-out code |
| Targeted tests | Unit tests for a function that was just changed |
| Accessibility | aria-label, role, alt text additions |
| Console severity | Upgrading console.log → console.error/info/warn where appropriate |

---

## Protected Scope — Proposal Only

Do NOT implement these without explicit human approval.

| Zone | Why Protected |
|---|---|
| auth/ and session logic | Security-critical; mistakes cause data exposure |
| Payment and billing flows | Financial risk; irreversible side effects |
| Database schema and migrations | Data integrity; destructive if wrong |
| Deployment config and CI-CD | Infrastructure risk; outage potential |
| .env and secrets | Security; never touch or log secrets |
| Stitch MCP API calls | External contract; must match design spec exactly |
| /server database layer | Backend data layer; high blast radius |
| Global store shape (Redux/Zustand) | Breaking change for entire app state |

---

## Risk Classification

### Level 1 — Low Risk
**Definition:** Single file, isolated change, no side effects outside the component, easily reversed.
**Required confidence:** >= 80%
**Process:** Identify change → implement → lint + type-check → log in AUTONOMOUS_LOG.md

### Level 2 — Medium Risk
**Definition:** 2–4 files touched, moderate blast radius, change affects a feature but not a protected zone, strong evidence exists.
**Required confidence:** >= 85%
**Process:** State root cause explicitly → implement → lint + type-check + tests → verify behavior → log in detail

Downgrade to High if:
- Evidence is ambiguous
- Change touches more files than expected during execution
- Tests fail in unexpected ways

### Level 3 — High Risk
**Definition:** Cross-module change, protected zone, unclear root cause, or confidence below threshold.
**Process:** Stop implementation → write handoff note in progress-tracking.md → do not attempt partial fix

---

## Confidence Self-Assessment

Start at 50%, adjust with these factors:

| Factor | Effect |
|---|---|
| Root cause identified in code | +20% |
| Single file change | +15% |
| Similar issue handled in previous session | +10% |
| Verified by reading type definitions | +10% |
| Issue found directly by `verify_all.py` output | +10% |
| Multiple possible root causes | -20% |
| Change touches shared utilities | -15% |
| Tests missing for affected code | -10% |
| File was recently changed by human | -10% |
| `verify_all.py` errors are ambiguous | -15% |

If final score is below 80%: stop, write handoff note.

---

## Autonomous Loop Execution Order

```
STEP 0: Run Proactive Scan (MANDATORY — see above)

FOR each issue in prioritized scan results:
  1. CLASSIFY risk level
  2. ASSESS confidence
  3. IF high risk OR confidence below threshold: WRITE proposal, SKIP
  4. ELSE: implement, verify
  5. IF verification fails: retry once
  6. IF retry fails: WRITE proposal, STOP
  7. LOG result to AUTONOMOUS_LOG.md
  8. CONTINUE to next issue

AT END of run:
  - Run: python .agent/scripts/verify_all.py  (confirm zero new errors)
  - UPDATE progress-tracking.md with full run summary
  - APPEND summary line to AUTONOMOUS_LOG.md
```

---

## /scan Command Policy

When `/scan` is invoked (separate from `/autonomous`):

1. Run `python .agent/scripts/verify_all.py` — full project scan
2. Run `python .agent/scripts/checklist.py` — pending issue check
3. Load `skills/lint-and-validate/` — lint assessment
4. Load `skills/vulnerability-scanner/` — security scan
5. Load `skills/systematic-debugging/` — error analysis
6. Summon `@debugger` + `@qa-automation-engineer` for deep analysis
7. Produce a structured report:

```
## /scan Report — [timestamp]

### 🔴 High Risk Issues (requires human review)
- [issue] — [file:line] — [why high risk]

### 🟡 Medium Risk Issues (autonomous can fix)
- [issue] — [file:line] — [proposed fix]

### 🟢 Low Risk Issues (autonomous will fix)
- [issue] — [file:line] — [fix applied or planned]

### ✅ Clean Areas
- [module/area]: no issues detected

### Recommended next command
- [/autonomous to fix Low+Medium] or [specific action]
```

8. Ask user: "Run `/autonomous` to fix Low and Medium issues automatically?"

---

## Logging Format

Every autonomous action must produce a log entry in `AUTONOMOUS_LOG.md`:

```
## [ISO timestamp] — [issue description]
- Files: [list of files touched]
- Change type: Low / Medium risk
- Root cause: [one sentence]
- Fix applied: [what was changed]
- Verification: lint [pass/fail] / types [pass/fail] / tests [pass/fail]
- Result: Resolved / Handed off
```

---

## Scope Limits

- **Maximum 10 files modified per autonomous run.** If approaching this limit, stop and hand off remaining issues.
- **Maximum 5 issues addressed per autonomous run.** Quality over quantity.
- **`/scan` does not count as a fix run.** It is report-only. Fixes only happen in `/autonomous`.

---

## Hard Stops — Non-negotiable

Immediately stop and write a handoff note if any of these occur:

1. Protected scope file requires modification
2. Shell command would affect files outside the declared task scope
3. A secret, token, or credential is visible in any file being edited
4. Two consecutive verification failures on the same issue
5. A "simple" fix has unexpectedly grown to touch 5+ files
6. `verify_all.py` final check shows NEW errors introduced by the autonomous run
