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

### Remediation Backlog

_Verified 2026-10-02. Priority reflects impact on a trustworthy, monetisable civic portal: **P0** = users see wrong or invented information; **P1** = data quality on indexed pages; **P2** = cost and efficiency; **P3** = engineering hygiene._

**Update, 2 Oct (later):** TL-03 and TL-12 fixed and live; TL-08 partly fixed; TL-16 and TL-17 added. The rules behind these fixes are in [docs/DATA_STANDARDS.md](docs/DATA_STANDARDS.md), shared with vizag-live.

#### Where the issues live

```
backend/
├── core/
│   ├── alert_triage.py        ✅ TypeSafe triage of alert headlines (type, in-Telangana, current, severity)
│   ├── alert_feed.py          ✅ single alerts.json schema, freshness and expiry rules
│   ├── news_classifier.py     ⚠ TL-04 substring keyword matching ("business" → Transit)
│   │                          ⚠ TL-15 entity keyword table duplicated in correlation_engine.py
│   └── correlation_engine.py, clustering.py, llm_provider.py, config.py
├── agents/
│   └── fact_checker.py        ⚠ TL-07 parse failure silently passes every article (score 85)
├── scripts/
│   ├── data_engine.py         ⚠ TL-05 gold scrapers depend on fixed table layout; currently "Stale Mode"
│   ├── emergency_alerts.py    ✅ entry point for alerts job; fabricated-alert generator removed
│   ├── news_scraper.py        ⚠ TL-10 numbered-list parsing can attach summaries to the wrong article
│   └── news_aggregation.py, weather_scraper.py, whatsapp_bot.py
└── api/civic_gateway.py       ✅ /alerts reads the published feed
tests/test_data_engine.py      ⚠ TL-11 7 failing tests; network-bound tests take more than an hour

frontend/
├── src/data/alerts.js         ✅ TL-03 static "live" alerts removed (tariff reference data kept)
├── src/components/
│   ├── NewsTicker.jsx         ✅ TL-03 live feed only; news shows its real publish time
│   ├── PowerTariffCard.jsx    ✅ reads tariff reference data only (not affected)
│   ├── BreakingNewsBanner.jsx ✅ severity-based, reads live feed
│   ├── FuelPriceWidget.jsx    ⚠ TL-06 no stale indicator
│   └── DailyRatesDashboard.jsx ⚠ TL-06 no stale indicator
├── src/pages/GoldLandingPage.jsx ⚠ TL-06 no stale indicator
├── src/services/powerAlertsService.js ✅ TL-03 reads /data/alerts.json; no invented fallback
├── src/App.tsx, src/main.tsx  ⚠ TL-14 dead files (entry is main.jsx → App.jsx)
└── vitest.config.ts           ✅ TL-12 runs the repo-root tests (8 files, 95 tests)

infrastructure/
├── Vercel project settings    ⚠ TL-01 Production Branch is master; work lands on main
├── GitHub secrets             ⚠ TL-02 TYPESAFE_API_KEY missing · TL-13 VERCEL_* missing
│                              ⚠ TL-16 VERCEL_DEPLOY_HOOK_URL returns 404 → syncs rebuild nothing
├── .github/workflows/*.yml    ◐ TL-08 hook gated on a push, but syncs write the run time so most runs push
│                              ⚠ TL-09 gold scraped by three overlapping jobs
│                              ⚠ TL-13 Bandit SAST step failing in ci_cd_master
└── vercel.json                ✅ SPA fallback fixed (rewrite to /, not /index.html)
```

#### For the Product Owner — what, why it matters, what's needed

| ID | Issue | Impact on users and the business | Priority | Needed from PO |
|---|---|---|---|---|
| TL-01 | Live site deployed from `master` while work landed on `main` | Fixed 4 Oct: Vercel Production Branch is now `main`; every push deploys; `master` retired | ✅ Fixed | — |
| TL-02 | TypeSafe key missing in GitHub | Alerts are filtered by old keyword rules: weaker quality | ✅ Fixed | Set 4 Oct in both repos; CI runs confirmed calling TypeSafe |
| TL-16 | Deploy hook returned 404 | Fixed 4 Oct: hook no longer needed — Vercel's Git integration deploys every push to `main`, data commits included; hook step removed from 8 workflows | ✅ Fixed | Delete the unused `VERCEL_DEPLOY_HOOK_URL` secret (optional) |
| TL-17 | AI Pulse page was a fixed placeholder | Fixed 4 Oct: rebuilt as Tech & AI Pulse (digital safety, government & AI, jobs & skills) on sourced, dated local news | ✅ Fixed | Set the `TYPESAFE_API_KEY` secret (TL-02) so the scheduled run uses judgment, not the keyword fallback |
| TL-18 | Database paused; citizen reports, classifieds and the emergency banner could not load | Fixed 4 Oct: moved to the `telangana` schema of the shared "Talia" Supabase project, with RLS | ✅ Fixed | 4 Oct: schemas exposed; service key set; news job saved 159 articles |
| TL-19 | Grievance dashboard shows 8 invented reports | Same sample data the report map used to show; presented as real | P1 | Wire it to approved reports, or hide it |
| TL-20 | Redis token was public | Fixed 4 Oct: the browser no longer uses Redis, so no token ships; the leaked token's database (`tough-rat-69556`) no longer exists | ✅ Fixed | Optional: delete the unused `VITE_UPSTASH_*` Vercel variables |
| TL-21 | Paid "featured listing" removed | It showed a placeholder UPI QR (`telangana.live@upi`) and a "Simulate Success" button | P2 | Decide whether to offer paid listings; if yes, integrate a real payment provider |
| TL-22 | Fuel tax breakup is invented | Every price is split as fixed 55% base / 22% excise / 15% VAT; real excise is a fixed ₹ per litre | P1 | Use published central excise and Telangana VAT rates, or hide the breakup |
| TL-23 | News cards showed an invented "AI confidence" | Fixed 5 Oct: was 75 + title length % 20 whenever no score existed (every article) | ✅ Fixed | — |
| TL-24 | Fuel and gold fell back to built-in prices | Fixed 5 Oct: fixed 107.41 / 97.82 / 803 / 72.8 and 15704 / 14395 / 290 were published as today's prices whenever a page failed | ✅ Fixed | — |
| TL-25 | Prices on the site were June's | Fixed 5 Oct: a data file last written 7 Jun was read first; API routes returned fixed lists dated today. Now live API or the synced daily files, with dates; API routes answer 503 when they have nothing | ✅ Fixed | — |
| TL-26 | Unpaid placements labelled "Sponsored" | Fixed 5 Oct: T-Fiber / T-Hub / Tourism promos relabelled "Featured service"; six invented "verified" partner businesses removed; /advertise page with an enquiry form (telangana.ad_enquiries) | ✅ Fixed | Read enquiries in Supabase; sell the slots |
| TL-27 | Search engines were sent to redirecting URLs | Fixed 5 Oct: canonical tags, sitemap, robots.txt and share links now use www.telangana.live | ✅ Fixed | Verify the site in Google Search Console and submit the sitemap; make the bare-domain redirect permanent (308) in Vercel |
| TL-28 | Jobs board is a fixed list from May | 20 hand-entered listings (TSPSC, TCS, Wipro, ...) never refreshed; shown as current openings | ✅ Fixed | 5 Oct: counts from the real date; expired notifications are not shown; official recruitment portals always linked. A live notifications feed is still a possible upgrade |
| TL-29 | Reservoir and transit data are months old | Reservoirs last updated 13 Jul, transit 24 May; no workflow runs their writers. The daily freshness check (added 5 Oct) fails on both | P1 | Schedule water_scraper.py, or find a current source (Telangana irrigation portal) |
| TL-30 | Metro crowd levels and bus "flow" figures are hand-entered | Shown as live (e.g. "127K: 93, Severe") with no source | P1 | Remove them, or connect a real feed |
| TL-31 | Google Analytics and Tag Manager load before cookie consent | The banner records "accepted" but gates nothing; consent is required under India's DPDP Act | P1 | Decide: gate GA/GTM behind consent, or switch to cookieless Plausible (already wired, off until VITE_PLAUSIBLE_DOMAIN is set) |
| TL-32 | Official disaster alerts not used | Fixed 5 Oct: IMD, CWC and SDMA alerts from NDMA SACHET that name Telangana now feed /alerts every 15 minutes, with issuer, area and an "until" time; hidden once the authority's alert expires | ✅ Fixed | None. Telangana had no active SACHET alert on 5 Oct, so the first one will show when IMD or the SDMA issues it |
| TL-33 | Sponsor card showed an invented match score | Fixed 5 Oct: `PartnerCard` showed a random "Brand Sync 85–99% Match" and "Business DNA Verified" on every paid spotlight; now a plain card labelled Sponsored with `rel="sponsored"` | ✅ Fixed | — |
| TL-34 | Secondary domains duplicated or misdirected | Fixed 5 Oct: bare telangana.live redirected with a temporary 307 (now 308); www.telanganalive.in served a full duplicate of the site; `vercel.json` sent telanganalive.in/.online to telanganalive.shop, which is not on the project. All now 308 to www.telangana.live | ◐ Partly fixed | In Vercel → Domains, set telanganalive.in and telanganalive.online to 308 (they still 307) |
| TL-35 | Shared links had no preview image | Fixed 5 Oct: `og:image`/`twitter:image` pointed at `/og-image.png`, which did not exist. Added a 1200×630 image | ✅ Fixed | — |
| TL-36 | Every page told Google it was the home page | Fixed 5 Oct: `index.html` carried a fixed canonical to "/" on every route, and pages that set their own produced two. Now one canonical per route; the 46 service guides get titles like "Birth Certificate in Telangana: Step-by-Step Guide" and a description from the guide; 24 more routes get their own title; district pages' titles were empty (Helmet got mixed children) and now render; /admin and /search are noindex | ✅ Fixed | — |
| TL-37 | "Unified Enterprise CI/CD Pipeline" fails on lint | 313 Ruff errors kept the pipeline red, so its deploy and E2E jobs never ran. 5 Oct: ruff's safe auto-fixes applied (import order, typing syntax, unused imports): 144 left | ◐ Partly fixed | Decide: fix the 88 broad excepts and 25 naive datetimes by hand, or relax those rules in the Ruff config |
| TL-03 | Ticker and crisis panel showed invented "live" alerts (6 static + 2 fallback shutdowns) | Fixed 2 Oct: live feed only, empty when quiet | ✅ Fixed | — |
| TL-04 | News filed under wrong category | Category pages, the SEO surface, carry wrong articles | P1 | Confirm category and region list |
| TL-05 | Gold price scraper fragile, currently stale | Gold page, a high-traffic page, shows old prices | ◐ Partly fixed | 5 Oct: no more invented gold prices (stale runs keep the last real reading with its own date; no fixed fallback). Still needed: confirm acceptable sources |
| TL-06 | Rate cards don't show staleness | A 3-day-old price looks current | P1 | Set the stale threshold per rate (e.g. gold 12 h, fuel 24 h) |
| TL-07 | Fake-news check silently switches off on errors | Unverified articles published as checked | ✅ Fixed | 5 Oct: unchecked articles are published as unchecked with no score; failures logged |
| TL-08 | Rebuild triggered even when nothing changed | Gate added; but every sync writes the run time, so most runs still push and rebuild | ✅ Fixed | 5 Oct: data files are not rewritten when only timestamps changed, so quiet runs commit and deploy nothing |
| TL-09 | Gold fetched by three overlapping jobs | Wasted runs, conflicting writes | P2 | Choose one refresh cadence |
| TL-10 | AI summaries can attach to the wrong article | Misleading summaries | ✅ Fixed | 5 Oct: summaries placed by their number; a batch not numbered 1..N is discarded |
| TL-11 | Backend test suite red and slow | Regressions go unnoticed | ✅ Fixed | 5 Oct: 172 tests pass in about 40 s (was 8 failing, minutes to hours) |
| TL-12 | Frontend tests never ran | Fixed 2 Oct: 95 tests now run on every `npm test` | ✅ Fixed | — |
| TL-13 | CI deploy jobs lack secrets; security scan step failing | Pipeline can't gate production | P3 | Decide: delete the never-working deploy jobs (Vercel now deploys every push to main) |
| TL-14 | Dead entry files | Confusion for contributors | ✅ Fixed | 5 Oct: removed; build output identical |
| TL-15 | Duplicated entity keyword tables | Two lists drift apart | ✅ Fixed | 5 Oct: one table in core/correlation_engine.py; classifier derives from it |

#### For the Business Analyst — scope and acceptance criteria

| ID | Layer | Files | Acceptance criteria | Effort |
|---|---|---|---|---|
| TL-01 | Infra | Vercel settings | ✅ Done: production deployments come from `main` | S |
| TL-02 | Infra | GitHub secrets | Alerts job runs with `source="typesafe"` for every verdict; no regex fallback in logs | S |
| TL-16 | Infra | `.github/workflows/*` | ✅ Done: hook steps removed; data commits deploy through the Git integration | S |
| TL-17 | Backend + Frontend | `scripts/tech_pulse.py` (shared with vizag), `pages/TechPulsePage.jsx`, `ai_pulse_update.yml` | ✅ Done: every item links to a dated source; 14-day window; empty sections say so; 25 + 4 tests | M |
| TL-18 | Infra + Backend + Frontend | `supabase/migrations/20261004_telangana_schema.sql`, `services/*`, `core/database.py` | ✅ Code live; anon reads only public rows; inserts don't read back. Pending: exposed schema, service-key secret | M |
| TL-19 | Frontend | `components/GrievanceDashboard.jsx`, `data/reportingData.js` | No `mockReports` import; counts come from `citizen_reports` | S |
| TL-20 | Frontend | `services/pricesService.js`, `waterService.js` | ✅ Done: browser Redis client removed; `noBrowserSecrets.test.js` guards it | S |
| TL-21 | Frontend | `pages/ClassifiedsPage.jsx` | Featuring only after a verified payment webhook sets `is_featured` | M |
| TL-22 | Backend + Frontend | `scripts/data_engine.py` `_tax_breakup`, `FuelTaxCard` | Breakup computed from published duty and VAT rates with their source, or not shown | S–M |
| TL-23 | Frontend | `NewsCard.jsx`, `ArticleModal.jsx` | ✅ Done: `tests/unit/noInventedScores.test.js` | S |
| TL-24 | Backend | `sync_gold`, `sync_fuel` | ✅ Done: `staleFields`; previous file kept when petrol and diesel are unread | S |
| TL-25 | Frontend + API | `services/pricesService.js`, `api/fuel-prices.js`, `api/gold-rates.js`, `api/mandi-prices.js` | ✅ Done: no constants or June file; `tests/unit/pricesService.test.js` | M |
| TL-26 | Frontend + DB | `MainLayout`, `ProgrammaticAd`, `SubRegionPage`, `pages/AdvertisePage.jsx` | ✅ Done: `tests/unit/adEnquiryService.test.js`; insert-only RLS verified | M |
| TL-27 | Frontend | 14 files using the bare domain | ✅ Done: guard test in `noBrowserSecrets.test.js` | S |
| TL-28 | Data | `data/jobsData.js`, `JobBoardPage.jsx` | ✅ Done: `utils/jobs.js`, `tests/unit/jobs.test.js` | M |
| TL-29 | Data | `scripts/water_scraper.py`, transit writer | Both modules pass `check_freshness.py` daily | M |
| TL-30 | Frontend | `components/MetroCard.jsx`, `data/transportData.js`, `transit_status.json` | No crowd or flow value without a source and time | S |
| TL-31 | Frontend | `index.html`, `CookieConsent.jsx` | No analytics cookie before consent, or GA removed | S |
| TL-32 | Backend | new alerts source from SACHET RSS + CAP XML | ✅ Done: `core/sachet.py` (shared with vizag), `alert_feed.build_official_record`, `utils/alerts.js`; tests `test_sachet.py`, `alerts.test.js` | M |
| TL-33 | Frontend | `components/PartnerCard.jsx` | ✅ Done: guard in `tests/unit/noInventedScores.test.js` | S |
| TL-34 | Infra | `vercel.json`, `frontend/vercel.json`, Vercel domains | ◐ apex 308 and host redirects done; two domain-level 307s need the dashboard | S |
| TL-35 | Frontend | `public/og-image.png` | ✅ Done: `tests/unit/shareImage.test.js` checks every meta image exists | S |
| TL-36 | Frontend | `components/RouteMeta.jsx`, `utils/pageMeta.js`, `index.html`, `ServiceDetailPage`, `SubRegionPage` | ✅ Done: `tests/unit/pageMeta.test.js`; one canonical and one description per page checked in Chrome | S |
| TL-37 | Backend | 33 files under `backend/` (not the files shared with vizag) | ◐ 160 safe fixes applied; 144 remain, mostly BLE001 blind `except Exception` (88) and naive datetimes (DTZ, 25) | M |
| TL-03 | Frontend | `src/data/alerts.js`, `NewsTicker.jsx`, `services/powerAlertsService.js` | ✅ Done: reads `/data/alerts.json`; [] on failure; 7 tests in `tests/unit/powerAlertsService.test.js` | S |
| TL-04 | Backend | `core/news_classifier.py` | Labelled set of ≥30 headlines passes, including "business…" and "…training" cases; whole-word or TypeSafe category and region | M |
| TL-05 | Backend | `scripts/data_engine.py` (gold scrapers) | ◐ No invented values (tests in `TestSyncFinanceHistoryTracking`); sources still to confirm | M |
| TL-06 | Frontend + Backend | `FuelPriceWidget.jsx`, `DailyRatesDashboard.jsx`, `GoldLandingPage.jsx`; rate writers in `data_engine.py` | Every card shows source and "as of" time; stale badge past the PO threshold | M |
| TL-07 | Backend | `agents/fact_checker.py` | ✅ Done: `FactCheckVerdict`; `tests/test_fact_checker.py` | M |
| TL-08 | Infra | 8 sync workflows; rate/weather writers | ✅ Done: `write_js` / `write_js_module` skip unchanged data; `TestWritesSkipUnchangedData` | S |
| TL-09 | Infra | `scraper.yml`, `gold_silver_update.yml`, `rates_sync.yml` | One job per dataset; cadence documented in the context map | S |
| TL-10 | Backend | `scripts/news_scraper.py` | ✅ Done: `tests/test_news_summaries.py` covers 19-of-20 replies | S |
| TL-11 | Backend | `tests/test_data_engine.py` | ✅ Done: model and fact checker stubbed by an autouse fixture; dependency stubs only when missing | M |
| TL-12 | Frontend | `vitest.config.ts` | ✅ Done: `test.dir` is the repo root; 8 files, 95 tests | S |
| TL-13 | Infra | `ci_cd_master.yml` | Pipeline green end to end, or deploy jobs removed in favour of the hook | S–M |
| TL-14 | Frontend | `src/App.tsx`, `src/main.tsx` | ✅ Done | S |
| TL-15 | Backend | `core/correlation_engine.py`, `core/news_classifier.py` | ✅ Done: `tests/test_civic_entities.py` | M |

Effort: **S** under half a day · **M** one to two days.

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

Production serves the Vercel project's **Production Branch**, currently `master` (see Remediation Backlog, TL-01). Development happens on `main`.

- **Data refreshes**: each sync job POSTs `VERCEL_DEPLOY_HOOK_URL` after it pushes a commit. The hook currently returns 404 (TL-16).
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
