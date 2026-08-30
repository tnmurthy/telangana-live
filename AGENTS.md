# AGENTS.md

**Quick-start guide for Codex - Complete details in linked docs**
---
## Session Start Protocol ⚡
**MANDATORY** at start of each session:
✓ .Codex/COMMON_MISTAKES.md
✓ .Codex/QUICK_START.md
✓ .Codex/ARCHITECTURE_MAP.md

**⚠️ NEVER auto-load:**
- Files in .Codex/completions/ (0 token cost)
- Files in .Codex/sessions/ (0 token cost)
- Files in docs/archive/ (0 token cost)

---

## Autonomous Loop Protocol (Self-Correction Cycle)

When instructed to work on tasks or execute in loop mode:
1. **Pick Task:** Read `TASKS.md` and select the topmost unchecked item `[ ]`.
2. **Implement:** Write or modify the required code and tests (prefer minimal viable diffs).
3. **Execute Verification:** Run the associated test/build command:
   - Frontend Unit Tests: `npm test -- --run` (in `frontend/`)
   - Frontend Build: `npm run build` (in `frontend/`)
   - Backend Tests: `pytest tests/` (in root)
4. **Self-Healing Loop:** If a test or build fails:
   - Inspect the exact compiler/test runner error output.
   - Refactor the code to fix the root cause.
   - Re-run the verification command (max 5 retry attempts).
5. **State Update & Commit:**
   - Mark the task complete in `TASKS.md` (`- [x]`).
   - Git commit with Conventional Commits (`fix: ...` or `feat: ...`).
   - Advance to the next task until the queue is clear or human intervention is required.

