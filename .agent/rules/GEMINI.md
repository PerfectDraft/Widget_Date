---
trigger: always_on
---

# GEMINI.md - Widget Date

> Quy tắc kỹ thuật cốt lõi. Routing & orchestration → xem super-manager.md.

---

## TIER 0: UNIVERSAL RULES

### 🌐 Language
- User nói tiếng Việt → trả lời tiếng Việt
- Code comments + variable names → English

### 💾 Token Budget (MAX 20KB/session cho infrastructure files)
Priority load order:
1. GEMINI.md (always_on)
2. Active agent file (theo domain task)
3. Task-relevant skills (chỉ skills trong frontmatter agent)
4. ARCHITECTURE.md — skip nếu đã đọc

### 📁 File Dependency
Trước khi sửa file:
1. Check `CODEBASE.md` → File Dependencies
2. Xác định file phụ thuộc
3. Update tất cả file bị ảnh hưởng

### 🧠 Read → Understand → Apply
Trước khi code, trả lời:
1. GOAL của agent/skill này là gì?
2. PRINCIPLES nào phải áp dụng?
3. Khác gì với generic output?

---

## 🛑 Socratic Gate (rút gọn)

| Request Type | Hành động |
|---|---|
| New Feature / Build | Hỏi ≥3 câu strategic |
| Bug Fix / Edit | Confirm understanding + impact |
| Vague / Simple | Hỏi Purpose, Users, Scope |
| "Proceed" sau khi đã trả lời | Hỏi thêm 2 câu Edge Case |

Nếu 1% không rõ → ASK. Không code khi chưa clear gate.

---

## 🎨 DESIGN RULES
Không dùng violet/purple. Template ban. Chi tiết → `@frontend-specialist` hoặc `@mobile-developer`.

---

## 📁 QUICK REFERENCE
- **Agents**: `.agent/agents/` — orchestrator, project-planner, backend-specialist, frontend-specialist, debugger...
- **Skills**: `.agent/skills/` — clean-code, frontend-design, api-patterns, systematic-debugging...
- **Scripts**: `.agent/skills/<skill>/scripts/` — verify_all.py, checklist.py là 2 script chính
- **Routing**: `.agent/agents/super-manager.md` — full routing table + slash commands
