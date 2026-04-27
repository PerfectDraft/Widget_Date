# Workflow: /autonomous

**Trigger:** User types `/autonomous [optional scope description]`  
**Purpose:** Activate conservative, risk-gated autonomous execution for background maintenance or bug-fix passes.

---

## Pre-conditions (check before starting)

1. Read `.agent/rules/autonomous-policy.md` — understand allowed scope and risk levels
2. Read `.agent/rules/progress-tracking.md` — understand current project state and pending issues
3. Read `.agent/.shared/PROJECT_CONTEXT.md` — load project memory
4. Confirm the task list: what issues will be addressed in this autonomous run?

If no specific scope was given by the user, default to: scan for Low-risk issues only (UI states, import errors, null safety, type annotations).

---

## Execution Flow

### Step 1 — Discovery
Identify candidate issues using available tools:
- Run `python .agent/scripts/checklist.py` to find known issues
- Run `python .agent/scripts/verify_all.py` to find type/lint errors
- Review `progress-tracking.md` for flagged items

Build a prioritized issue list. Classify each item by risk level before touching anything.

### Step 2 — Triage
For each issue:
- Classify: Low / Medium / High risk
- Assess confidence (see autonomous-policy.md rubric)
- If High risk or confidence below threshold: add to handoff list, skip implementation

### Step 3 — Execute (Low and Medium only)
For each approved issue:
1. State the root cause in one sentence before making any change
2. Make the minimal change required
3. Verify: lint + type-check + run affected tests
4. If verification passes: log to `AUTONOMOUS_LOG.md`
5. If verification fails: retry once — if fails again, add to handoff list

### Step 4 — Report
At end of run, produce a summary with three sections:

```
## Autonomous Run Summary — [timestamp]

### Resolved
- [issue 1] — [file] — [what was changed]
- [issue 2] — [file] — [what was changed]

### Handed Off (needs human review)
- [issue A] — [reason stopped] — [proposed fix]
- [issue B] — [reason stopped] — [proposed fix]

### Skipped (out of scope or high risk)
- [issue X] — [classification]
```

Update `progress-tracking.md` with this summary.

---

## Constraints During Autonomous Run

- One issue at a time — no batching
- Only touch files within the declared scope
- Never create new components or features — fix only
- Never commit directly to main branch — use a feature branch if possible
- Stop immediately if a hard stop condition is triggered (see autonomous-policy.md)

---

## Exiting Autonomous Mode

Autonomous mode ends when:
- All candidate issues have been processed (resolved or handed off)
- A hard stop condition is triggered
- The user explicitly cancels with `/status` or a new command

On exit: write the run summary, update `progress-tracking.md`, return to normal orchestration mode.
