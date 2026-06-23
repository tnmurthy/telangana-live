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

## 🔄 Data Flow

```
RSS Sources (Nijam, Organiser, etc.)
    ↓
Backend RSS Parser (feedparser)
    ↓
Normalization Engine (data_engine.py)
    ↓
AI Fact-Checking (Claude/Gemini)
    ↓
Supabase Database
    ↓
Frontend (React components)
    ↓
User Interface (News Feed, Maps, Dashboards)
```

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

The frontend is automatically deployed to Vercel on every push to `master`:

```bash
vercel deploy --prod
```

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
