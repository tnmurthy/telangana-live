# Quick Start — telangana-live

## What This Project Is
A civic intelligence portal for Telangana state. Real-time feeds for news, weather, fuel prices, gold rates, reservoirs, transit, and government schemes — served as a Vite/React PWA with a Python/FastAPI backend.

## Local Dev Setup

```bash
# Backend (Python 3.14+)
cd backend
pip install -r requirements.txt
cp ../.env.example ../.env   # fill in keys
python main.py

# Frontend
cd frontend
npm install
npm run dev          # http://localhost:5173

# Run backend smoke tests
cd backend && python tests/smoke_test.py

# Run frontend smoke tests
cd frontend && npm run test -- tests/smoke_test.spec.ts

# CI/CD Master Pipeline (GitHub Actions)
# Trigger manually or on PR/push to main or staging
gh workflow run ci_cd_master.yml
```

## Key Environment Variables
| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Primary LLM (default provider) |
| `SUPABASE_URL` + `SUPABASE_KEY` | Database |
| `SUPABASE_SERVICE_KEY` | Admin operations |
| `LLM_PROVIDER` | `anthropic` (default) \| `gemini` \| `ollama` \| `zai` |
| `Z_AI_API_KEY` | Required only when `LLM_PROVIDER=zai` |
| `GOOGLE_API_KEY` | Required only when `LLM_PROVIDER=gemini` |
| `OLLAMA_URL` | Defaults to `http://localhost:11434` |

## Adding a New Backend Agent
1. Create `backend/agents/my_agent.py`
2. Import and use `from core.llm_provider import llm` — never instantiate a raw `anthropic.Anthropic()` or call HTTP directly.
3. Call `llm.generate(prompt, provider=CONFIG['llm_provider'], model=..., max_tokens=...)`
4. Register in `backend/scheduler.py`

## Rebuilding the Knowledge Graph
```bash
python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
```
