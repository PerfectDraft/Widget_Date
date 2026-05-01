# Workflow: /autonomous

**Trigger:** User types `/autonomous [optional scope description]`  
**Purpose:** Activate conservative, risk-gated autonomous execution.

→ **See `.agent/rules/autonomous-policy.md` for full rules (Scope Limits, Risk, Logging, Hard Stops, etc.)**

---

## Pre-conditions (check before starting)

1. Read `.agent/rules/autonomous-policy.md`
2. Read `.agent/rules/progress-tracking.md`
3. Read `.agent/.shared/PROJECT_CONTEXT.md`
4. Check if `/scan` was run recently. If yes, reuse scan results. If no, run Step 0 below.

---

## Step 0 — Proactive Scan (MANDATORY)

1. Run: `python .agent/scripts/verify_all.py`
If verify_all.py is unavailable or throws execution error:
→ Log: "Scan: SKIPPED — script unavailable ([reason])"
→ Limit session to Low-risk tasks only (confidence threshold raised to 90%)
→ Mark all results as "Unverified — script unavailable"
→ Do NOT address Medium or High risk tasks without script verification

2. Run: `python .agent/scripts/checklist.py`
3. Load: `.agent/skills/lint-and-validate/` & `.agent/skills/systematic-debugging/`
4. Build prioritized issue list and announce to user.

---

## Step 1 — Triage

For each issue from Step 0:
- Classify: Low / Medium / High risk & assess confidence (see policy).
- If High risk or confidence < 80%: add to handoff list, do NOT implement.
- If Low or Medium with sufficient confidence: proceed to Step 2.

---

## Step 2 — Execute (Low and Medium only)

For each approved issue:
1. State the root cause in one sentence before making any change.
2. Make the minimal change required.
3. Verify: `npx tsc --noEmit` + lint + run affected tests.
4. If verification passes: log to `AUTONOMOUS_LOG.md`.
5. If verification fails: retry once — if fails again, add to handoff list and stop.

---

## Step 3 — Post-run Verification

After all issues are processed:
1. Run: `python .agent/scripts/verify_all.py` (final check)
   → Must return ZERO new errors introduced by this run.
   → If new errors found: this is a Hard Stop — write handoff note immediately.
2. Confirm: issue count decreased or stayed the same.

---

## Step 4 — Report

At end of run, produce a summary in `progress-tracking.md` and append to `AUTONOMOUS_LOG.md`:

```markdown
## Autonomous Run Summary — [timestamp]

### ✅ Resolved
### 🔁 Handed Off (needs human review)
### ⏭️ Skipped (out of scope or high risk)
### 📊 Project Health After Run
```
