# Agent Playbook — Reusable Patterns from Widget Date

> **Mục đích**: Tổng hợp kiến thức, pattern, template workflow từ dự án Widget Date.
> Có thể áp dụng ngay vào bất kỳ dự án phần mềm nào có sử dụng AI coding agent.
> **Không phụ thuộc** vào công nghệ cụ thể (React, Express, SQLite).

---

## Mục lục
1. [Cấu trúc `.agent/` — Agent System Folder](#1-cấu-trúc-agent---agent-system-folder)
2. [Agent Pattern — Multi-Agent Orchestration](#2-agent-pattern--multi-agent-orchestration)
3. [Rule System — 3 Tầng Quy Tắc](#3-rule-system--3-tầng-quy-tắc)
4. [Skill System — Modular & Trigger-Based](#4-skill-system--modular--trigger-based)
5. [Autonomous Mode — Risk-Gated Execution](#5-autonomous-mode--risk-gated-execution)
6. [Component Contract — Props Locking](#6-component-contract--props-locking)
7. [Progress Tracking — Session-Based Changelog](#7-progress-tracking--session-based-changelog)
8. [Security Patterns — API Key Management](#8-security-patterns--api-key-management)
9. [Pre-commit Checklist — Automated Gate](#9-pre-commit-checklist--automated-gate)
10. [Stitch-to-Logic — Design Import Protocol](#10-stitch-to-logic--design-import-protocol)
11. [Quick-Start Template](#11-quick-start-template)

---

## 1. Cấu trúc `.agent/` — Agent System Folder

```
.agent/
├── agents/           # Specialist agents (mỗi file 1 agent)
│   ├── super-manager.md      # Orchestrator chính
│   ├── frontend-specialist.md
│   ├── backend-specialist.md
│   ├── security-auditor.md
│   ├── debugger.md
│   └── ...
├── rules/            # Quy tắc toàn cục (luôn được load)
│   ├── GEMINI.md             # Quy tắc kỹ thuật cốt lõi
│   ├── component-contract.md # Props locking
│   ├── autonomous-policy.md  # Chính sách autonomous
│   ├── progress-tracking.md  # Cách ghi PROGRESS.md
│   └── security_audit_report.md
├── skills/           # Skill modules (mỗi folder 1 skill)
│   ├── clean-code/
│   │   └── SKILL.md
│   ├── frontend-design/
│   │   ├── SKILL.md
│   │   └── scripts/ux_audit.py
│   ├── vulnerability-scanner/
│   │   ├── SKILL.md
│   │   └── scripts/security_scan.py
│   └── ...
├── scripts/          # Script kiểm tra toàn cục
│   ├── verify_all.py
│   ├── checklist.py
│   ├── auto_preview.py
│   └── session_manager.py
└── workflows/        # Workflow định nghĩa sẵn
    ├── autonomous.md
    ├── plan.md
    ├── test.md
    └── ...
```

### Nguyên tắc
- **agents/** = ai làm việc gì (routing table)
- **rules/** = luật luôn áp dụng (không cần trigger)
- **skills/** = cách làm việc (có trigger hoặc frontmatter)
- **scripts/** = công cụ tự động (chạy độc lập)
- **workflows/** = quy trình nhiều bước (gọi khi cần)

---

## 2. Agent Pattern — Multi-Agent Orchestration

### 2.1 Super-Manager (Orchestrator)

Mỗi project cần 1 file `super-manager.md` làm não trung tâm. Nội dung tối thiểu:

```markdown
---
name: super-manager
description: Central orchestrator. Discovers resources, delegates tasks, executes autonomous maintenance.
tools: Read, Grep, Glob, Bash, Edit, Write
model: inherit
skills: clean-code, systematic-debugging, lint-and-validate
---

# Role: @super-manager

## Discovery Protocol (MANDATORY mỗi task)
1. Scan `.agent/agents/`, `.agent/skills/`, `.agent/workflows/`
2. Chọn top 2-3 agent phù hợp nhất
3. Xác định skill cần load
4. Phân loại rủi ro

## Full Agent Routing Table
| Task type | Primary Agent | Support Agent |
|---|---|---|
| CSS / UI / layout | @frontend-specialist | @mobile-developer |
| API / routes / middleware | @backend-specialist | @security-auditor |
| ... | | |

## Slash Command Routing
| Command | Action |
|---|---|
| /check | Run checklist.py |
| /autonomous | Activate autonomous mode |
| ... | |
```

### 2.2 Specialist Agent Template

Mỗi specialist agent có cấu trúc:

```markdown
---
name: agent-name
description: What this agent does
tools: Read, Grep, Glob, Bash, Edit
model: inherit
skills: skill-1, skill-2
---

# Role: @agent-name

**Expertise:** Domain expertise summary.

## Core Rules
1. Rule 1
2. Rule 2

## Workflow
1. Step 1
2. Step 2
```

### 2.3 Agent Routing Pattern

| Yêu cầu | Agent chính | Agent hỗ trợ |
|---|---|---|
| UI / CSS / layout | frontend-specialist | mobile-developer |
| API / backend | backend-specialist | security-auditor |
| Database / schema | database-architect | backend-specialist |
| Security | security-auditor | penetration-tester |
| Bug / debug | debugger | code-archaeologist |
| Performance | performance-optimizer | backend-specialist |
| Testing / QA | qa-automation-engineer | test-engineer |
| DevOps / CI-CD | devops-engineer | — |
| Planning | project-planner | product-manager |
| Refactor / legacy | code-archaeologist | debugger |

---

## 3. Rule System — 3 Tầng Quy Tắc

### 3.1 GEMINI.md (Tầng cốt lõi — luôn load)

```markdown
---
trigger: always_on
---

# GEMINI.md - [Project Name]

## TIER 0: UNIVERSAL RULES

### 🌐 Language
- User nói tiếng gì → trả lời tiếng đó
- Code + comments → English

### 💾 Token Budget (MAX 20KB/session cho infrastructure)
Priority: GEMINI.md → Active agent → Relevant skills → ARCHITECTURE

### 🧠 Read → Understand → Apply
Trước khi code: GOAL? → PRINCIPLES? → Khác gì generic?

## 🛑 Socratic Gate
| Request | Action |
|---|---|
| New Feature | Hỏi ≥3 câu strategic |
| Bug Fix | Confirm understanding |
| Vague | Hỏi Purpose, Users, Scope |
```

### 3.2 Component Contract (Props Locking)

Pattern để bảo vệ component khỏi bị sửa sai props khi design-to-code:

```markdown
# Component Contract

## [ComponentName].tsx
Props bắt buộc: prop1, prop2, prop3
Props optional: optProp1?

## Quy tắc cứng
- Không xóa prop đang được truyền từ parent
- Không đổi tên handler
- Không thay dynamic data bằng static value
```

### 3.3 Autonomous Policy (Risk-Gated)

Xem Section 5 bên dưới.

---

## 4. Skill System — Modular & Trigger-Based

### 4.1 Cấu trúc 1 skill

```
.agent/skills/[skill-name]/
├── SKILL.md              # File chính (bắt buộc)
├── INDEX.md              # Index nếu skill >5KB
└── scripts/              # Script riêng của skill
    └── [tool].py
```

### 4.2 SKILL.md Template

```markdown
# Skill: [Skill Name]

**Purpose:** What this skill does.
**When to use:** Trigger keywords.
**Prerequisites:** What must be loaded first.

## Methodology
1. Step 1
2. Step 2

## Scripts
| Script | Purpose | Command |
|---|---|---|
| tool.py | Description | `python .agent/skills/[skill]/scripts/tool.py` |
```

### 4.3 Auto-Skill Loading (Trigger → Skill Map)

Pattern để tự động load skill dựa trên từ khóa trong câu hỏi của user:

```markdown
| Trigger keywords | Skill to load |
|---|---|
| "debug", "lỗi", "error", "fix" | systematic-debugging |
| "lint", "type error", "tsc" | lint-and-validate |
| "refactor", "clean", "dọn" | clean-code |
| "security", "bảo mật" | vulnerability-scanner |
| "test", "unit test", "coverage" | testing-patterns |
| "api", "route", "endpoint" | api-patterns |
| "database", "schema" | database-design |
| "performance", "chậm" | performance-profiling |
```

### 4.4 Danh sách skill nên có trong mọi project

| Skill | Mục đích | Bắt buộc? |
|---|---|---|
| `clean-code` | Quy tắc code sạch, không over-engineer | ✅ CÓ |
| `systematic-debugging` | Phương pháp debug có hệ thống | ✅ CÓ |
| `lint-and-validate` | TypeScript + lint checking | ✅ CÓ |
| `vulnerability-scanner` | Quét lỗ hổng bảo mật | Khuyên dùng |
| `testing-patterns` | Pattern viết test | Khuyên dùng |
| `api-patterns` | Pattern REST API | Nếu có backend |
| `database-design` | Pattern thiết kế DB | Nếu có database |
| `frontend-design` | Pattern thiết kế UI | Nếu có frontend |
| `performance-profiling` | Phân tích hiệu năng | Khuyên dùng |

---

## 5. Autonomous Mode — Risk-Gated Execution

### 5.1 Risk Classification

| Level | Definition | Action |
|---|---|---|
| **Low** | Single file, isolated, reversible | Implement → verify → log |
| **Medium** | 2-4 files, moderate blast radius | Implement if confidence ≥85% |
| **High** | Cross-module, protected zone | STOP → write proposal |

### 5.2 Confidence Self-Assessment

Start at 50%, adjust:

| Factor | Effect |
|---|---|
| Root cause identified | +20% |
| Single file change | +15% |
| Similar issue handled before | +10% |
| Verified by type definitions | +10% |
| Multiple possible causes | -20% |
| Touches shared utilities | -15% |
| Tests missing for affected code | -10% |

### 5.3 Allowed vs Protected Scope

| Allowed (auto-execute) | Protected (proposal only) |
|---|---|
| UI text fixes, typos | Auth, session, token logic |
| Import path resolution | Payment, billing flows |
| Null/undefined safety checks | DB schema, migrations |
| Loading/empty/error states | Deployment config |
| TypeScript annotations | .env, secrets, API keys |
| Dead code cleanup | External API contracts |
| Console severity fixes | Global store shape |

### 5.4 Autonomous Loop

```
STEP 0: Proactive Scan (verify_all.py + checklist.py)
FOR each issue:
  1. Classify risk
  2. Assess confidence
  3. If high risk or low confidence → SKIP, write proposal
  4. Else → implement → verify
  5. If verify fails → retry once
  6. If retry fails → STOP, write handoff
  7. Log to AUTONOMOUS_LOG.md
AT END: update PROGRESS.md
```

### 5.5 Stop Conditions (Hard Stops)

- Protected scope touched
- 2 failed fix attempts on same issue  
- Root cause unclear
- Blast radius expanded beyond scope
- verify_all.py shows NEW errors after session

---

## 6. Component Contract — Props Locking

Pattern bảo vệ component trong workflow design-to-code:

```markdown
## [Component].tsx
Props bắt buộc: propA, propB, propC
Props optional: optD?, optE?

## Quy tắc cứng
- Chỉ sửa `className` — không sửa props, handlers, data bindings
- Không xóa prop đang truyền từ parent
- Không đổi tên handler (handleX, onY, v.v.)
- Không thay dynamic data bằng static value
```

**Khi nào dùng:** Mỗi khi có component được import từ design tool (Figma, Stitch...) và cần giữ nguyên contract với phần còn lại của app.

---

## 7. Progress Tracking — Session-Based Changelog

### 7.1 PROGRESS.md Template

```markdown
# PROGRESS.md — [Project Name]

## 🗓️ Cập nhật lần cuối
| Ngày | YYYY-MM-DD |
| Phiên | #N — description |
| Nhánh | main |

## 📊 Tổng quan tiến độ
```
Feature A  ████████░░  80%
Feature B  ██████████  100%
```

## ✅ Đã hoàn thành
- [x] Task 1
- [x] Task 2

## 🔴 Lỗi cần sửa
| # | Mô tả | Ưu tiên | File |
|---|---|---|---|

## 🟡 Đang làm
| # | Mô tả | File |
|---|---|---|

## 🔵 Backlog
- [ ] Future feature

## 📝 Changelog
### Session #N — YYYY-MM-DD
- Mô tả thay đổi
- Files: path/to/file.ts
- Verification: PASS/FAIL
```

### 7.2 Quy tắc ghi changelog
- Chỉ thêm vào, không xóa cũ
- Chỉ đánh dấu xong sau khi verify
- Commit PROGRESS.md cùng với code
- Mỗi session có số thứ tự riêng

---

## 8. Security Patterns — API Key Management

### 8.1 Quy tắc

| Rule | Giải thích |
|---|---|
| **Keys trong server/.env** | Tất cả secret key phải nằm ở server |
| **Proxy qua Express** | Client không gọi API ngoài trực tiếp |
| **Không VITE_ prefix** | Trừ public client ID (OAuth) |
| **Rate limiting** | Theo user + IP, ít nhất 15 req/phút cho AI routes |
| **CORS whitelist** | Chỉ cho phép CLIENT_ORIGIN |
| **Strip stack trace** | Production không leak internal paths |

### 8.2 Pre-commit Security Check

```bash
# Phải return 0 matches
grep -r "API_KEY_SECRET\|PRIVATE_TOKEN" client/src --include="*.ts" --include="*.tsx"
```

---

## 9. Pre-commit Checklist — Automated Gate

### 9.1 checklist.py Pattern

Script tự động chạy 6 checks trước commit:

```python
# Structure
checks = [
    SecurityScan(),    # grep API keys in client
    LintCheck(),       # tsc --noEmit
    SchemaValidation(),# type-check
    TestRunner(),      # npm test
    UXAudit(),         # accessibility + responsive
    SEOCheck(),        # meta tags + headings
]
```

### 9.2 AGENTS.md Pre-commit Section

```markdown
## Pre-commit Checklist
Trước mỗi commit:
```bash
npx tsc --noEmit
python .agent/scripts/checklist.py
grep -r "SECRET" src/ --include="*.ts"  # expect 0
```
```

---

## 10. Stitch-to-Logic — Design Import Protocol

Quy trình 6 bước khi import design từ tool (Figma, Stitch):

```
1. INVENTORY  → Liệt kê tất cả component trong screen
2. MAP PROPS  → Xác định props mỗi component
3. GENERATE   → Tạo TypeScript types từ props
4. CREATE     → Viết hooks cho logic (isLoading, error, data)
5. WIRE       → Kết nối hooks vào component (CHỈ sửa className)
6. VERIFY     → type-check + visual check
```

**Quy tắc cứng:**
- Chỉ sửa `className` — không sửa props, handlers, data bindings
- 1 component 1 lần — confirm hoạt động trước khi sang component tiếp theo
- Đọc `component-contract.md` trước mọi edit

---

## 11. Quick-Start Template

Copy-paste để bootstrap agent system cho project mới:

### Cấu trúc tối thiểu

```
.agent/
├── agents/
│   └── super-manager.md          # Orchestrator
├── rules/
│   ├── GEMINI.md                 # Quy tắc cốt lõi
│   ├── component-contract.md     # (nếu có design import)
│   ├── autonomous-policy.md      # (nếu dùng autonomous)
│   └── progress-tracking.md      # Cách ghi PROGRESS.md
└── scripts/
    ├── checklist.py              # Pre-commit gate
    └── verify_all.py             # Full scan
```

### super-manager.md (minimum)

```markdown
---
name: super-manager
description: Central orchestrator. Routes tasks, manages autonomous execution.
tools: Read, Grep, Glob, Bash, Edit, Write
model: inherit
skills: clean-code, systematic-debugging
---

# Role: @super-manager

## Discovery Protocol
1. Scan `.agent/agents/`, `.agent/skills/`
2. Select best agent for task
3. Classify risk (Low/Medium/High)

## Agent Routing
| Task | Agent |
|---|---|
| UI/CSS | @frontend-specialist |
| API/Backend | @backend-specialist |
| Security | @security-auditor |
| Bug | @debugger |

## Slash Commands
| Command | Action |
|---|---|
| /check | Run checklist.py |
| /status | Read PROGRESS.md |
```

### GEMINI.md (minimum)

```markdown
---
trigger: always_on
---

# GEMINI.md

## Language
- User's language for responses, English for code

## Socratic Gate
- New feature: ask ≥3 questions before coding
- Bug fix: confirm understanding first

## Read → Understand → Apply
1. What's the GOAL?
2. What PRINCIPLES apply?
3. How is this different from generic output?

## Pre-commit
```bash
npx tsc --noEmit && python .agent/scripts/checklist.py
```
```

---

## Tổng kết — Cái gì nên copy sang project mới

| Item | Priority | File nguồn |
|---|---|---|
| **Super-manager** | 🔴 Bắt buộc | `.agent/agents/super-manager.md` |
| **GEMINI.md** | 🔴 Bắt buộc | `.agent/rules/GEMINI.md` |
| **checklist.py** | 🔴 Bắt buộc | `.agent/scripts/checklist.py` |
| **verify_all.py** | 🔴 Bắt buộc | `.agent/scripts/verify_all.py` |
| **Autonomous Policy** | 🟡 Khuyên dùng | `.agent/rules/autonomous-policy.md` |
| **Progress Tracking** | 🟡 Khuyên dùng | `.agent/rules/progress-tracking.md` |
| **Component Contract** | 🟢 Nếu có design import | `.agent/rules/component-contract.md` |
| **Security Report** | 🟡 Khuyên dùng | `.agent/rules/security_audit_report.md` |
| **Skill System** | 🟡 Theo nhu cầu | `.agent/skills/*/` |
| **AGENTS.md** | 🔴 Bắt buộc | Root `AGENTS.md` |
| **PROGRESS.md** | 🟡 Khuyên dùng | Root `PROGRESS.md` |
