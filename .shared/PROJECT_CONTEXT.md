# Widget Date — Project Context

This file is the persistent memory for the Widget Date project.
All agents must read this at the start of any session.
Update this file when conventions change, decisions are made, or new constraints are discovered.

Last updated: 2026-04-27

---

## Project Overview

**Name:** Widget Date  
**Type:** Mobile Application (React Native)  
**Purpose:** A mobile dashboard / widget-based date and scheduling tool  
**Status:** Active development

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile frontend | React Native |
| UI components | Stitch MCP (design import) |
| Styling | Tailwind / className-based |
| Backend | Node.js (server directory) |
| State management | React useState + useContext (no Redux/Zustand) |
| Database         | Google Drive AppData (primary) + localStorage (fallback) + better-sqlite3 (server crawler) |
| Testing          | Chưa có (pending — xem Open Decisions)         |

---

## Repository Structure

```
Widget_Date/
├── client/          <- React Native mobile app (frontend agents work here)
├── server/          <- Backend API (backend agents work here)
├── .agent/          <- AI agent system (Antigravity Kit)
│   ├── agents/
│   ├── skills/
│   ├── workflows/
│   ├── rules/
│   ├── scripts/
│   └── .shared/
└── .gitignore
```

**Critical rule:** Frontend agents work in `/client` only. Backend agents work in `/server` only. Never mix.

---

## Stitch MCP Integration

- **Project ID:** `17526464061189967193`
- **Flow:** `list_projects` → `list_screens [PROJECT_ID]` → confirm screen with user → import
- **Constraint:** Widget Date is a MOBILE app — always use `@mobile-developer`, never `@frontend-specialist`
- **Editing rule:** Change `className` ONLY when editing Stitch-imported components. Never touch props, event handlers, or data bindings

---

## Established Conventions

- All agent instructions are written in English
- `@super-manager` communicates with the user in Vietnamese
- Component edits follow `component-contract.md` strictly
- Session state is tracked in `progress-tracking.md`
- Autonomous actions are logged in `AUTONOMOUS_LOG.md`

---

## Known Constraints

- Auto Accept extension is installed — terminal commands do not need manual approval
- `terminal-guard.md` was intentionally NOT created (replaced by Auto Accept + inline pre-flight checklist in super-manager)
- `.agent/` was previously in `.gitignore` — now tracked in git

---

## Protected Zones (do not edit autonomously)

- Auth and session logic
- Payment and billing flows
- Database schema and migration files
- Deployment and CI-CD configuration
- `.env` files and any secrets
- Global state store shape

---

## Anti-Patterns (things we do NOT do)

- Do NOT use `@frontend-specialist` for mobile UI work
- Do NOT mix `/client` and `/server` dependencies
- Do NOT edit component props or handlers when importing from Stitch
- Do NOT batch unrelated fixes in a single autonomous commit
- Do NOT implement changes in protected zones without explicit approval

---

## Open Decisions
- [x] State management → confirmed: useState only, no global store library
- [x] Database → confirmed: Google Drive AppData + localStorage + better-sqlite3
- [ ] Testing framework and coverage targets → chưa quyết định
- [ ] Deployment pipeline details

---

## Autonomous Log Reference

Autonomous run logs are stored in: `.agent/AUTONOMOUS_LOG.md`
Session progress is tracked in: `.agent/rules/progress-tracking.md`
