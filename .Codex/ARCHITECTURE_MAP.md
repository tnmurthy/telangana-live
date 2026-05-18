# Architecture Map — telangana-live

```
telangana-live/
├── frontend/               # Vite + React + TypeScript PWA
│   └── src/
│       ├── pages/          # One file per route (30+ civic portal pages)
│       ├── components/     # Shared UI components
│       ├── data/           # Static civic data (JSON/JS modules)
│       ├── services/       # API clients (Supabase, weather, transit, etc.)
│       ├── hooks/          # Custom React hooks
│       └── context/        # React Context (AppContext, EmergencyContext)
│
├── backend/                # Python async backend + agent scheduler
│   ├── agents/             # Autonomous content agents
│   │   ├── content_generator.py  # Generates new content from topic queue
│   │   ├── quality_checker.py    # Reviews + publishes draft content
│   │   ├── content_monitor.py    # Monitors live site for stale content
│   │   ├── content_updater.py    # Updates content with fresh info
│   │   ├── news_sync_agent.py    # Syncs RSS/news feeds
│   │   ├── price_sync_agent.py   # Syncs fuel/gold/mandi prices
│   │   ├── water_sync_agent.py   # Syncs reservoir levels
│   │   └── transit_sync_agent.py # Syncs TSRTC/metro status
│   ├── core/
│   │   ├── config.py       # Central CONFIG dict from .env
│   │   ├── database.py     # Supabase `db` singleton
│   │   ├── llm_provider.py # LLMProvider (anthropic/gemini/ollama/zai) + `llm` singleton
│   │   └── logger.py       # Logging config
│   ├── api/                # Serverless API routes (Vercel edge functions)
│   ├── scripts/            # One-off data seeding / DB setup scripts
│   ├── tests/              # smoke_test.py (import checks + DB ping)
│   ├── main.py             # FastAPI app entry point
│   └── scheduler.py        # APScheduler job registration
│
├── graphify/               # git submodule — knowledge graph engine
├── graphify-out/           # Generated graph artefacts (GRAPH_REPORT.md, graph.json)
├── .Codex/                 # Session-start docs (QUICK_START, COMMON_MISTAKES, this file)
├── docs/                   # Project documentation
├── deployment/             # Docker / Vercel / infra config
└── tests/                  # Playwright e2e + Vitest smoke tests
```

## Data Flow

```
RSS / Gov APIs → sync agents → Supabase DB → FastAPI backend → React PWA
                                   ↑
                         LLM agents (content_generator,
                          quality_checker, content_updater,
                          content_monitor) via llm.generate()
```

## Key Singletons
| Symbol | Module | Purpose |
|--------|--------|---------|
| `db` | `core.database` | Supabase client wrapper |
| `llm` | `core.llm_provider` | Multi-provider LLM wrapper |
| `CONFIG` | `core.config` | Env-var dict |

## LLM Provider Selection
Set `LLM_PROVIDER` env var. Default: `anthropic`.
Options: `anthropic` \| `gemini` \| `ollama` \| `zai`
All agents call `llm.generate(prompt, provider=CONFIG['llm_provider'], ...)` — no direct SDK usage.
