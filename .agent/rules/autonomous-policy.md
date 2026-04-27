# Autonomous Operation Policy — Widget Date

This file defines execution rules for AI-driven autonomous operation in the Widget Date project.
All agents operating in autonomous or semi-unattended mode MUST read this file before acting.

---

## What Autonomous Mode Means

Autonomous mode is active when:
- The user has run `/autonomous` explicitly
- The user is away and the AI is executing a multi-step plan
- The AI is running a background maintenance or bug-fix pass

In autonomous mode: do NOT prompt for confirmation on allowed-scope tasks.
Stop and write a proposal for anything outside allowed scope.

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
| Multiple possible root causes | -20% |
| Change touches shared utilities | -15% |
| Tests missing for affected code | -10% |
| File was recently changed by human | -10% |

If final score is below 80%: stop, write handoff note.

---

## Autonomous Loop Execution Order

```
FOR each issue in task list:
  1. CLASSIFY risk level
  2. ASSESS confidence
  3. IF high risk OR confidence below threshold: WRITE proposal, STOP
  4. ELSE: implement, verify
  5. IF verification fails: retry once
  6. IF retry fails: WRITE proposal, STOP
  7. LOG result to AUTONOMOUS_LOG.md
  8. CONTINUE to next issue

AT END of run:
  UPDATE progress-tracking.md with full run summary
```

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

## Hard Stops — Non-negotiable

Immediately stop and write a handoff note if any of these occur:

1. Protected scope file requires modification
2. Shell command would affect files outside the declared task scope
3. A secret, token, or credential is visible in any file being edited
4. Two consecutive verification failures on the same issue
5. A "simple" fix has unexpectedly grown to touch 5+ files
