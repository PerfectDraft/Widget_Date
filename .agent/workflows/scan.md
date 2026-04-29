# Workflow: /scan

**Trigger:** User types `/scan` or `/scan [optional scope]`  
**Purpose:** Proactive full-project health check — find all errors, risks, and improvement opportunities without modifying any code.

---

## Agents Summoned
- `@debugger` — error analysis and root cause tracing
- `@qa-automation-engineer` — test coverage gaps and quality issues

## Skills Loaded
- `.agent/skills/lint-and-validate/` — lint and type classification
- `.agent/skills/vulnerability-scanner/` — security issues
- `.agent/skills/systematic-debugging/` — error methodology
- `.agent/skills/code-review-checklist/` — code quality patterns

---

## Execution Steps

### Step 1 — Type and Lint Scan
```bash
python .agent/scripts/verify_all.py
```
Captures: TypeScript errors, missing imports, type mismatches, lint violations across `/client` and `/server`.

### Step 2 — Issue Inventory
```bash
python .agent/scripts/checklist.py
```
Captures: Known pending issues, TODO markers, flagged items from previous sessions.

### Step 3 — Security Scan
Load `skills/vulnerability-scanner/` and apply to findings.
Look for: hardcoded secrets, exposed API keys, XSS risks, unsafe type casts, unvalidated user input.

### Step 4 — Code Quality Review
Load `skills/code-review-checklist/` and apply to recent changes.
Look for: dead code, missing error states, components without loading/empty states, console.log leaks.

### Step 5 — Classify All Findings
For each issue found:
- Assign risk level: Low / Medium / High
- Assign owner: which agent can fix it
- Note: autonomous-fixable vs needs human review

### Step 6 — Report

Produce a structured scan report:

```
## /scan Report — [ISO timestamp]

### 🔴 High Risk (needs human decision)
- [issue] — [file:line] — [why high risk] — Owner: [agent]

### 🟡 Medium Risk (autonomous can fix with review)
- [issue] — [file:line] — [suggested fix] — Owner: [agent]

### 🟢 Low Risk (autonomous will fix automatically)
- [issue] — [file:line] — [fix plan] — Owner: [agent]

### ✅ Clean Modules
- [module]: no issues

### 📊 Summary
- Total issues: [N]
- High: [X] | Medium: [Y] | Low: [Z]
- Autonomous-fixable: [count]
- Needs human: [count]

### 💡 Recommended Next Step
- Type `/autonomous` to automatically fix all Low and Medium issues
- Or specify: `/autonomous fix [specific issue]`
```

---

## Constraints

- `/scan` is **read-only**. It NEVER modifies any file.
- `/scan` produces a report and waits for user instruction.
- To apply fixes, the user must run `/autonomous` after reviewing the report.
- Scan covers both `/client` and `/server` directories.

---

## Integration with Autonomous Mode

If `/scan` was run immediately before `/autonomous`:
- Skip Step 0 in the autonomous workflow (scan results are already fresh)
- Use the /scan report directly as the issue list for autonomous execution
- Autonomous mode should reference: "Using results from /scan report at [timestamp]"
