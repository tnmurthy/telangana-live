# Handover: telangana.live

What a new owner needs to run the site. Checked 2026-10-09. Secret values are
never written here, only their names.

## Accounts and assets

| Asset | Where | Notes |
|---|---|---|
| Domain `telangana.live` | Hostinger (registrar and DNS) | Registered 2026-02-18, expires 2027-02-18. Earlier owners held the name before 2026 (Wayback 2018–2024). Registrar transfer lock applies for 60 days after a change of registrant. |
| Source code | GitHub `tnmurthy/telangana-live` (**public**) | `main` is production. LICENSE: all rights reserved. |
| Hosting | Vercel project `telangana-live` (team `narayanamurthy-ts-projects`) | Deploys every push to `main`. Frontend in `frontend/` (Vite + React, prerendered), serverless routes in `frontend/api/`. |
| Database | Supabase project **Talia** (`onsmkbwqucvbzggugmmn`), schema `telangana` | Talia is shared with the owner's other apps (`public` schema) and the `vizag` schema. A buyer gets a dump of `telangana`, not the project. |
| Analytics / ads | Google Analytics 4, Search Console, AdSense | Grant the buyer owner access; do not hand over the Google account. |

## Scheduled data jobs (GitHub Actions)

| Workflow | Schedule (UTC) | What it does |
|---|---|---|
| `news_aggregation.yml` | every 2 h | News RSS → `frontend/src/data`, AI summaries |
| `emergency_alerts_sync.yml` | every 15 min | NDMA SACHET alerts |
| `weather_update.yml` | hourly | Open-Meteo forecast and AQI snapshot |
| `gold_silver_update.yml`, `rates_sync.yml` | 12 h / twice daily | Gold and silver rates |
| `prices_update.yml` | every 6 h | Fuel prices; pulses file (empty until a source exists) |
| `ai_pulse_update.yml` | 3× daily | Tech and AI pulse |
| `data_freshness.yml` | daily | Flags stale data files |
| `daily_pulse.yml` | daily | WhatsApp summary (**not running: secrets missing**) |
| `seo_agent.yml` | daily | SEO report |

The data jobs commit to `main` as "GitHub Action" / "Data Engine Bot".

## Secrets

**GitHub Actions secrets set:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TYPESAFE_API_KEY`.

**Referenced by workflows but not set** (those steps run without them or
fail quietly): `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`,
`WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TO_NUMBER`,
`SUPABASE_KEY`, `OWM_API_KEY`, `NEWS_API_KEY`, `GOOGLE_API_KEY`.

**Vercel environment variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
(publishable, RLS enforced), `VITE_API_URL`, `VITE_OWM_API_KEY`,
`VITE_N8N_WEBHOOK_URL`, `VITE_UPSTASH_REDIS_REST_URL`,
`VITE_UPSTASH_REDIS_REST_TOKEN`, `LLM_PROVIDER`, `Z_AI_API_KEY`,
`Z_AI_BASE_URL`, `Z_AI_MODEL`, `GA_PROPERTY_ID`.

- `VITE_*` values are compiled into the public JavaScript. `VITE_OWM_API_KEY`
  is read by `src/services/weatherService.js`, so the OpenWeatherMap key is
  public; give it a quota or move the call behind a serverless route.
- `VITE_UPSTASH_REDIS_REST_*` are no longer read by the code (TL-20) and can
  be deleted.

**Rotate at handover:** every key above, plus any key that appears in git
history. A gitleaks scan on 2026-10-09 found `.env` and `tmp.tmpenv`
committed in the past (OpenWeatherMap, Upstash, Notion, Google, Gemini,
VAPID keys, and keys for a Supabase project that has since been deleted).

## Restore and move the database

```bash
# dump only this site's schema from Talia
supabase db dump --db-url "$TALIA_DB_URL" --schema telangana -f telangana.sql
supabase db dump --db-url "$TALIA_DB_URL" --schema telangana --data-only -f telangana_data.sql
# restore into the buyer's project
psql "$NEW_DB_URL" -f telangana.sql -f telangana_data.sql
```

Then point `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` and the GitHub
secrets at the new project, and redeploy. Migrations live in
`supabase/migrations/`.

User data held (2026-10-09): `citizen_reports` 0 rows, `smart_classifieds`
0, `ad_enquiries` 0. `news_articles` holds about 1,600 rows of headlines.

Row Level Security is on for every table in the `telangana` schema (the
last eight were enabled on 2026-10-09,
`supabase/migrations/20261009_telangana_enable_rls.sql`).

## Verify after transfer

```bash
cd frontend && npm ci && npm test -- --run && npm run build
cd .. && pip install -r requirements.txt && pytest tests/
```

Then check that each scheduled workflow's next run succeeds on the buyer's
secrets, and that `/sources`, `/alerts` and `/weather` show current data.

## Known gaps

- Mandi prices: the Agmarknet endpoint used by `frontend/api/mandi-prices.js`
  returns 404, so the farmer page shows no prices.
- Power alerts: TSSPDCL answers 403 to the scraper.
- Gold, silver and fuel prices are read from published retail-rate pages;
  a licensed feed would remove that dependency.
- Open-Meteo's free API is for non-commercial use; an ad-funded site needs
  its commercial plan.
- Reservoir levels are not published until an official source is wired.
