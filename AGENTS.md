# AGENTS.md — Widget Date

## Rules (auto-load mỗi session)
Đọc theo thứ tự ưu tiên:
1. `.agent/rules/GEMINI.md` — quy tắc kỹ thuật chung
2. `.agent/rules/component-contract.md` — props cố định từng component
3. `.agent/rules/security_audit_report.md` — vị trí API keys, auth, rate limit

## Pre-commit Checklist
Trước mỗi commit chạy:
```bash
npx tsc --noEmit -p client/tsconfig.json && npx tsc --noEmit -p server/tsconfig.json
python .agent/scripts/checklist.py
grep -r "AIza\|GEMINI\|openrouter" client/src --include="*.ts" --include="*.tsx"  # expect 0
```

## Project Overview
See @README.md và @package.json.

## Code Style
- const over let, descriptive names, extract complex conditions
- Tiếng Việt với user, code comments bằng English
