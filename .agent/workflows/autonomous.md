# Workflow: /autonomous

**Trigger:** User types `/autonomous [optional scope description]`  
**Purpose:** Activate conservative, risk-gated autonomous execution for background maintenance or bug-fix passes.

---

## Pre-conditions (check before starting)

1. Read `.agent/rules/autonomous-policy.md` — understand allowed scope and risk levels
2. Read `.agent/rules/progress-tracking.md` — understand current project state and pending issues
3. Read `.agent/.shared/PROJECT_CONTEXT.md` — load project memory
4. Check if `/scan` was run recently. If yes, reuse scan results. If no, run Step 0 below.

If no specific scope was given by the user, default to: fix all Low-risk issues found by proactive scan.

---

## Step 0 — Proactive Scan (MANDATORY — runs before anything else)

```
1. Run: python .agent/scripts/verify_all.py
   → Captures TypeScript errors, missing imports, type mismatches across /client and /server

2. Run: python .agent/scripts/checklist.py
   → Captures known pending issues and TODO items

3. Load: .agent/skills/lint-and-validate/
   → Apply lint rules to classify findings

4. Load: .agent/skills/systematic-debugging/
   → Apply debug methodology to trace root causes

5. Build: prioritized issue list
   Format each item as: [risk level] — [file] — [description]

6. Announce to user:
   "Scan complete. Found [N] issues: [X] Low, [Y] Medium, [Z] High.
   Proceeding to fix Low and Medium. High-risk items will be handed off."
```

If zero issues found: state "Project health: CLEAN." and exit autonomous mode gracefully.

---

## Step 1 — Triage

For each issue from Step 0:
- Classify: Low / Medium / High risk (see autonomous-policy.md)
- Assess confidence using the rubric in autonomous-policy.md
- If High risk or confidence < 80%: add to handoff list, do NOT implement
- If Low or Medium with sufficient confidence: proceed to Step 2

---

## Step 2 — Execute (Low and Medium only)

For each approved issue:
1. State the root cause in one sentence before making any change
2. Make the minimal change required
3. Verify: `npx tsc --noEmit` + lint + run affected tests
4. If verification passes: log to `AUTONOMOUS_LOG.md`
5. If verification fails: retry once — if fails again, add to handoff list and stop this issue

---

## Step 3 — Post-run Verification

After all issues are processed:

```
1. Run: python .agent/scripts/verify_all.py  (final check)
   → Must return ZERO new errors introduced by this run
   → If new errors found: this is a Hard Stop — write handoff note immediately

2. Confirm: issue count decreased or stayed the same
```

---

## Step 4 — Report

At end of run, produce a summary with three sections:

```
## Autonomous Run Summary — [timestamp]

### ✅ Resolved
- [issue 1] — [file] — [what was changed]
- [issue 2] — [file] — [what was changed]

### 🔁 Handed Off (needs human review)
- [issue A] — [reason stopped] — [proposed fix]
- [issue B] — [reason stopped] — [proposed fix]

### ⏭️ Skipped (out of scope or high risk)
- [issue X] — [classification]

### 📊 Project Health After Run
- verify_all.py: [CLEAN / N errors remain]
- Issues resolved this run: [count]
- Issues still pending: [count]
```

Update `progress-tracking.md` with this summary.
Append summary line to `AUTONOMOUS_LOG.md`.

---

## Constraints During Autonomous Run

- One issue at a time — no batching unrelated fixes
- Only touch files within the declared scope
- Never create new components or features — fix only
- Never commit directly to main branch — use a feature branch if possible
- Stop immediately if a hard stop condition is triggered (see autonomous-policy.md)
- Maximum 10 files modified per run, maximum 5 issues addressed per run

---

## Exiting Autonomous Mode

Autonomous mode ends when:
- All candidate issues have been processed (resolved or handed off)
- Step 3 post-run verify_all.py returns clean
- A hard stop condition is triggered
- The user explicitly cancels with `/status` or a new command

On exit: write the run summary, update `progress-tracking.md`, return to normal orchestration mode.
