# CLAUDE.md

**Quick-start guide for Claude Code - Complete details in linked docs**
---
## Session Start Protocol ⚡
**MANDATORY** at start of each session:
✓ .claude/COMMON_MISTAKES.md
✓ .claude/QUICK_START.md
✓ .claude/ARCHITECTURE_MAP.md

**⚠️ NEVER auto-load:**
- Files in .claude/completions/ (0 token cost)
- Files in .claude/sessions/ (0 token cost)
- Files in docs/archive/ (0 token cost)

---

## Loop Verification Commands
- **Frontend Unit Tests:** `npm test -- --run` (in `frontend/`)
- **Frontend Typecheck & Build:** `npm run build` (in `frontend/`)
- **Backend Tests:** `pytest tests/` (in project root)

---

## Active Task Queue (Agent Loop Backlog)

- [x] **TASK-01: Baseline Verification & Health Check**
  - **Files:** `frontend/package.json`, `tests/`
  - **Acceptance:** All existing unit tests and build commands run cleanly with exit code 0.
  - **Verify:** `cd frontend && npm run build`

