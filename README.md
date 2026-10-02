# 🌐 Telangana.live

> A real-time civic portal & content aggregator for Telangana / Hyderabad citizens.

[![Production](https://img.shields.io/badge/deployment-Vercel-black)](https://telangana-live.vercel.app)
[![Python](https://img.shields.io/badge/backend-Python%203.11-blue)](./backend/)
[![React](https://img.shields.io/badge/frontend-React%20+%20Vite-61dafb)](./frontend/)
[![Supabase](https://img.shields.io/badge/database-Supabase-3ecf8e)](https://supabase.com)

## 🏗️ Architecture

Telangana.live is a **full-stack web application** that aggregates real-time news, civic information, and regional data for Telangana citizens. The architecture consists of:

- **Frontend**: React 19 + Vite with Tailwind CSS, deployed on Vercel
- **Backend**: Python 3.11 automation agents for data collection & normalization
- **Database**: Supabase (PostgreSQL) for persistent storage
- **Data Pipeline**: Automated web scrapers and RSS feed aggregators

### Technology Stack

```
Frontend (56.5% of codebase)
├── React 19 + React Router v7
├── Vite (build system)
├── Tailwind CSS + PostCSS
├── Leaflet + React-Leaflet (interactive maps)
├── Framer Motion (animations)
├── Supabase JS client
└── Vitest + Playwright (testing)

Backend (20.9% of codebase)
├── Python 3.11
├── Anthropic API (Claude AI)
├── Google Generative AI (Gemini)
├── BeautifulSoup4 (web scraping)
├── Feedparser (RSS parsing)
├── Supabase Python SDK
├── APScheduler (task scheduling)
└── Pytest (testing)

Infrastructure
├── Vercel (frontend deployment)
├── Supabase Database (data persistence)
└── GitHub Actions (CI/CD automation)
```

## 📡 Features

### Current Capabilities

- **🗞️ News Aggregation**: Multi-source RSS feed aggregator with regional news from 8+ sources
- **🗺️ Interactive Maps**: Leaflet-based maps for civic infrastructure visualization
- **📊 Data Dashboards**: Real-time statistics on regional transit, water, and pricing
- **🤖 AI-Powered Insights**: AI briefings & fact-checking via Claude & Gemini APIs
- **🌍 Multi-Language Support**: Content in English & Telugu (Unicode support)
- **⚡ Real-Time Updates**: Automated data sync agents running on a schedule

### News Sources

The platform aggregates content from:

| Source | Language | Focus | Format |
|--------|----------|-------|--------|
| Nijam Today | Telugu | Regional/State News | RSS 2.0 / Atom |
| The Organiser | English | State Desk & Policy | Custom XML |
| The Commune | English | Southern States | RSS 2.0 / Atom |
| Swarajya Mag | English | Electoral Analysis | API Feed |
| VSK Telangana | Telugu | Grassroot/Cultural | RSS 2.0 / Atom |
| OpIndia | Telugu | Counter-Narratives | Enterprise XML |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **Git** (for version control)
- Supabase account (free tier available)
- API keys for: Anthropic, Google Generative AI (optional)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev          # Start dev server on http://localhost:5173
npm run build        # Production build
npm run test         # Run tests with Vitest
npm run lint         # ESLint checks
```

### Backend Setup

```bash
# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Run automation agents
python backend/agents/news_sync_agent.py
python backend/agents/price_sync_agent.py
python backend/agents/transit_sync_agent.py
python backend/agents/water_sync_agent.py

# Or run the API server
python api_server.py
```

### Environment Variables

Create a `.env` file with:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# AI APIs
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_generative_ai_key

# News Sources
RSS_PROXY_URL=optional_proxy_for_cloudflare_bypass
```

See [`.env.example`](.env.example) for all available options.

## 📁 Project Structure

```
telangana-live/
├── frontend/                    # React + Vite frontend app
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components (News, Maps, AI Pulse, etc.)
│   │   ├── data/               # Static data files (news.json, etc.)
│   │   ├── services/           # API & data fetching logic
│   │   └── assets/             # Images, fonts, etc.
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Python automation & scraping
│   ├── agents/
│   │   ├── news_sync_agent.py  # RSS aggregator
│   │   ├── price_sync_agent.py # Commodity pricing scraper
│   │   ├── transit_sync_agent.py # Public transit data
│   │   ├── water_sync_agent.py  # Water utility scraper
│   │   └── fact_checker.py      # AI-powered fact verification
│   ├── scripts/
│   │   ├── data_engine.py       # Data normalization & JS export
│   │   ├── news_scraper.py      # RSS feed parsing
│   │   └── weather_scraper.py   # Weather data collection
│   └── requirements.txt
│
├── docs/                        # Documentation
│   └── README.md               # Detailed RSS feed & schema spec
│
├── tests/                       # Test suite
│   └── test_data_engine.py      # Unit tests
│
├── api_server.py                # FastAPI server (optional)
├── .env.example                 # Environment variable template
└── README.md                    # This file
```

## 🗺️ System Context Map

_Verified against the repo, workflows and Vercel on 2026-10-02._

### How data reaches the site

```
 SOURCES                 GITHUB ACTIONS (cron)               REPO (main)                      VERCEL                    SITE
 ───────                 ─────────────────────               ───────────                      ──────                    ────
 Google News RSS ──┐
 OWM / Open-Meteo ─┤     scheduled sync jobs                 frontend/src/data/*.js|json ┐    deploy hook ─► build
 gold/fuel sites ──┼──►  python backend/scripts/* ──commit─► frontend/public/data/*.json ├──► vite build + prerender ─► www.telangana.live
 eNAM mandi ───────┤     [skip ci] + POST deploy hook        (bundled at build time)     ┘    (113 static pages)
 TypeSafe API ─────┘
```

Data files are bundled into the build, so **new data only appears after a rebuild**. Sync commits carry `[skip ci]`, so each sync job calls the Vercel deploy hook itself.

### Scheduled jobs

| Workflow | Cron (UTC) | Runs | Writes |
|---|---|---|---|
| `emergency_alerts_sync` | every 15 min | `emergency_alerts.py` → `data_engine.sync_alerts()` | `alerts.json` (src + public) |
| `weather_update` | hourly at :30 | `weather_scraper.py` | `weatherData.js` |
| `news_aggregation` | every 2 h | `news_aggregation.py` | `news.json` |
| `scraper` | every 4 h | `data_engine` gold + fuel | `goldRates.js`, `fuelPrices.js` |
| `prices_update` | every 6 h | `data_engine` fuel + pulses | `fuelPrices.js`, `pulses.js` |
| `gold_silver_update` | every 12 h | `data_engine --task gold` | `goldRates.js` |
| `rates_sync` | 01:00, 13:00 | `data_engine --finance-only` | gold, fuel, pulses |
| `ai_pulse_update` | daily 01:00 | `data_engine --task ai_pulse`, `sync_ai_metrics.py` | `aiBriefingData.js` |
| `daily_pulse` | daily 02:30 | `whatsapp_bot.py` | WhatsApp message |

On push: `ci_cd_master` (secret scan → lint, typecheck, build → deploy jobs), plus `ci`, `node.js`, `webpack` and `test`.

### Backend map

```
backend/
├── core/
│   ├── alert_triage.py      TypeSafe judgments per headline: Choice(type), Noul(in Telangana),
│   │                        Noul(current), Score(severity). Regex fallback without a key.
│   ├── alert_feed.py        the one alerts.json schema; freshness and expiry rules
│   ├── news_classifier.py   keyword category / region tagging
│   └── correlation_engine.py, clustering.py, llm_provider.py, config.py
├── scripts/
│   ├── data_engine.py       hub: gold, fuel, pulses, news, alerts, ai_pulse
│   ├── emergency_alerts.py  entry point for the alerts job; fetch_latest_alerts() for the API
│   └── news_scraper.py, news_aggregation.py, weather_scraper.py, whatsapp_bot.py
└── api/civic_gateway.py     FastAPI: /news, /alerts, /services
tools/calibrate_alert_triage.py   re-derive alert thresholds against labelled headlines
```

### Alert feed consumers

| Component | Reads | How |
|---|---|---|
| `AlertsPage`, `AlertsBanner` | `src/data/alerts.json` | imported at build time |
| `BreakingNewsBanner` | `/data/alerts.json` | fetched at runtime every 5 min; shows `critical` / `high` |
| `NewsTicker` | `src/data/alerts.js` | separate static file |

Every `alerts.json` record carries the fields all of these read; see `backend/core/alert_feed.py`.

### Required secrets (GitHub Actions)

| Secret | Used by | Status |
|---|---|---|
| `VERCEL_DEPLOY_HOOK_URL` | every sync job | set |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | sync jobs | set |
| `TYPESAFE_API_KEY` | `emergency_alerts_sync` | **missing**: alert triage falls back to regex |
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | `ci_cd_master` deploy jobs | **missing** |

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm run test              # Run all tests once
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Backend Tests

```bash
pytest tests/ -v         # Run all tests
pytest tests/test_data_engine.py -v  # Specific test file
```

## 📊 Data Schema

All news items normalize into this JSON schema:

```json
{
  "id": "sha256_hash_of_link",
  "source_key": "nijam_ts",
  "title": "Article Title",
  "link": "https://example.com/article",
  "published_at": "2026-06-02T12:00:00Z",
  "language": "te",
  "content_summary": "Article summary text...",
  "meta_tags": ["politics", "state-government"]
}
```

See [docs/README.md](./docs/README.md) for the complete schema specification.

## 🚨 Known Issues & Roadmap

### Current Issues

Verified 2026-10-02, highest impact first:

- **Vercel Production Branch is `master`, but all work and data syncs land on `main`.** Builds from `main` arrive as previews. Until the setting is switched, production is updated by fast-forwarding `master` to a commit carrying `main`'s tree.
- **`TYPESAFE_API_KEY` is not set in GitHub secrets**, so scheduled alert triage runs on the regex fallback.
- **The deploy hook fires even when a sync had nothing to commit**, so the 15-minute alerts job alone triggers about 96 builds a day.
- **Gold is scraped by three overlapping jobs** (`scraper`, `gold_silver_update`, `rates_sync`), and the primary source currently returns no fresh data ("Stale Mode").
- **`classify_article()` matches keywords as substrings**, so for example "business" matches "bus" and is filed under Transit.
- **Tests**: 7 pre-existing failures in `tests/test_data_engine.py`, and the network-bound tests take more than an hour. Frontend `npm test` finds no test files, because its config looks for `tests/unit/` under `frontend/`.

Previously reported, not re-verified:

- Double `src` path bug in Python sync agents (data outputs to wrong directory)
- AI Pulse page schema mismatch causing render crashes
- Custom WhatsApp share parameters not properly handled

### Planned Features

- [ ] Autonomous LLM agent for civic issue tracking
- [ ] SMS notifications for critical updates
- [ ] Community voting on news credibility
- [ ] Offline-first PWA support
- [ ] Dark mode toggle
- [ ] Multi-language translation engine

See [notion_findings.md](./notion_findings.md) for detailed technical analysis.

## 🛠️ Development Workflow

### Running Both Frontend & Backend Locally

**Terminal 1 (Frontend)**
```bash
cd frontend
npm run dev
```

**Terminal 2 (Backend)**
```bash
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
python backend/agents/news_sync_agent.py
```

### Code Quality

- **Linting**: ESLint (frontend) + Pylint (backend)
- **Formatting**: Prettier (JS), Black (Python)
- **Type Safety**: TypeScript (frontend), type hints (backend)

```bash
# Frontend
npm run lint

# Backend
pylint backend/
black backend/
```

## 📱 Deployment

### Vercel (Frontend)

Production serves the Vercel project's **Production Branch**, currently `master` (see Current Issues). Development happens on `main`.

- **Data refreshes**: each sync job POSTs `VERCEL_DEPLOY_HOOK_URL` after committing.
- **Routing**: prerendered routes are served as static files. All other routes fall back to the SPA via a rewrite to `/` in `vercel.json`. A rewrite to `/index.html` does not resolve under `cleanUrls: true`.
- **Check what's live** with the newest production deployment's commit ref and SHA, not just that a build ran.

### Supabase (Database)

Database migrations are managed in Supabase dashboard:
- Schema: PostgreSQL with RLS policies
- Auth: JWT-based (optional for public feeds)

### Backend Agents

Backend agents can be deployed as:
- Cron jobs (GitHub Actions)
- Serverless functions (AWS Lambda, Google Cloud Functions)
- Scheduled Docker containers

## 📞 Support & Contributing

### Getting Help

- 📖 Check [docs/README.md](./docs/README.md) for technical specs
- 🐛 Open an [issue](https://github.com/tnmurthy/telangana-live/issues) for bugs
- 💡 Start a [discussion](https://github.com/tnmurthy/telangana-live/discussions) for questions

### Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase** for the database infrastructure
- **Vercel** for deployment hosting
- **Anthropic** & **Google** for AI/ML APIs
- **Leaflet** for mapping functionality
- Open-source contributors to BeautifulSoup, React, and Python ecosystems

---

**Last Updated**: June 2, 2026

For live updates and status, visit **[telangana.live](https://telangana-live.vercel.app)**
