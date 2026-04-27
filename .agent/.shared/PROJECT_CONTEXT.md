# Widget Date — Project Context

This file is the persistent memory for the Widget Date project.
All agents must read this at the start of any session.
Update this file when conventions change, decisions are made, or new constraints are discovered.

Last updated: 2026-04-27

---

## Project Overview

**Name:** Widget Date  
**Type:** Web Application (React 19 + Vite 6)  
**Purpose:** A mobile-first web dashboard for date planning, gamification, and AI recommendations  
**Status:** Active development

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 6 + TypeScript |
| UI framework | Tailwind CSS v4 + Motion (framer-motion) |
| Design import | Stitch MCP (className only) |
| Backend | Express.js (Node.js) |
| AI Gateway | OpenRouter API (proxied via server) |
| Auth | Google OAuth 2.0 (@react-oauth/google) + Phone/Password (bcryptjs) |
| Database | Google Drive AppData (decentralized) + SQLite (Server-side) |
| State management | React useState + custom hooks |
| Security | authMiddleware (Google token verify) + express-rate-limit |

---

## Repository Structure

```
Widget_Date/
├── client/          <- React 19 + Vite 6 web app (frontend agents work here)
├── server/          <- Express.js API gateway (backend agents work here)
├── data-service/    <- Crawler + cron jobs (better-sqlite3)
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
- **Constraint:** Widget Date is a **React web app** with mobile-first layout — use `@frontend-specialist` for UI work
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
- Project uses `npm workspaces` with root `package.json` managing `client/` and `server/`

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

- Do NOT use `@mobile-developer` for this project — Widget Date is a React web app
- Do NOT mix `/client` and `/server` dependencies
- Do NOT edit component props or handlers when importing from Stitch
- Do NOT batch unrelated fixes in a single autonomous commit
- Do NOT implement changes in protected zones without explicit approval

---

## Open Decisions (update when resolved)

- [x] State management: React useState + custom hooks (confirmed)
- [x] Database: Google Drive AppData (decentralized, confirmed)
- [x] Auth: Google OAuth + Native Phone/Password (confirmed)
- [ ] Testing framework and coverage targets
- [ ] Deployment pipeline details (Vercel deferred)

---

## Autonomous Log Reference

Autonomous run logs are stored in: `.agent/AUTONOMOUS_LOG.md`
Session progress is tracked in: `.agent/rules/progress-tracking.md`
