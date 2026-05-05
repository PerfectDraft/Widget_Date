# CODEBASE.md — Widget Date

## OS
- **Windows** (win32-x64)
- Use PowerShell for shell commands, `Write` tool for file creation
- Path separator: `\`

## Project Type
- **Monorepo** (npm workspaces): `client/` + `server/`
- React 19 + Vite frontend, Express + SQLite backend

## File Dependencies
- `client/` → React SPA, Tailwind CSS 4, Framer Motion
- `server/` → Express API, better-sqlite3, Google OAuth
- `data-service/` → Standalone crawler (Cheerio + node-cron)
- `.agent/` → AI agent infrastructure (agents, skills, workflows, scripts)
- `docs/` → Architecture plans and postmortems

## Key Config Files
- `.env` → Environment variables (API keys, CORS origin)
- `vercel.json` → Vercel deployment config
- `package.json` → Root workspace config

## Entry Points
- Client: `client/src/main.tsx`
- Server: `server/src/index.ts`
- Data service: `data-service/cronjob.js`
