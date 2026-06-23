# Vijayawada Live — City Portal Blueprint

**Repo:** `tnmurthy/vijayawada-live`  
**Domain:** `vijayawada.live`  
**Stack:** React 19 + Vite + Tailwind CSS v3 + Supabase + Cloudflare Pages  
**Bootstrapped from:** `tnmurthy/telangana-live` (fork + customise)

---

## 🏙️ City Profile

| Field | Value |
|---|---|
| City | Vijayawada (Bezwada) |
| State | Andhra Pradesh |
| Municipal Body | Vijayawada Municipal Corporation (VMC) |
| Metro Region | Krishna District |
| Language | Telugu (`te`) |
| Population | ~1.1 million (city), ~1.5 million (metro) |
| Key Areas | Benz Circle, Moghalrajpuram, Gunadala, Patamata, Governorpet, Auto Nagar, Tadepalli |

---

## 🎨 Brand Identity

```js
// tailwind.config.js — extend colors
colors: {
  'city-primary':   '#1E6DB5',  // Krishna Blue
  'city-accent':    '#F2A70C',  // Durga Gold
  'city-bg':        '#0F1923',
  'city-surface':   '#1A2633',
  'city-muted':     '#6B8299',
}
```

**Logo concept:** Prakasam Barrage arch silhouette + Krishna river wave  
**Tagline:** *"Heart of Andhra — Live, Local, Yours"*

---

## 📁 Repo File Changes from Base (telangana-live)

### 1. `config.py`
```python
CONFIG = {
  'site_url':    'https://vijayawada.live',
  'city_name':   'Vijayawada',
  'state':       'Andhra Pradesh',
  'language':    'te',
  'supabase_schema': 'vijayawada',
}
```

### 2. `index.html`
```html
<title>Vijayawada Live — Civic Portal for Vijayawada Citizens</title>
<meta name="description" content="Water supply, bus routes, jobs, grievances and live news for Vijayawada citizens.">
<meta property="og:title" content="Vijayawada Live">
<meta property="og:url" content="https://vijayawada.live">
```

### 3. `src/data/districts.js`  → `src/data/divisions.js`
Replace Telangana district list with VMC divisions/wards:
```js
export const divisions = [
  { name: 'Division 1 – Patamata', wards: ['1','2','3'] },
  { name: 'Division 2 – Governorpet', wards: ['4','5','6'] },
  // … all 59 VMC wards
];
```

### 4. `src/data/waterSupplyData.js`
Replace HMWSSB data with VMC Water Supply Department schedule:
- Source: VMC Ward-wise supply timings
- Key fields: `zone`, `ward`, `morning_slot`, `evening_slot`, `disruption`

### 5. `src/data/emergencyData.js`
```js
export const emergencyContacts = {
  police:    { name: 'Vijayawada City Police', number: '0866-2577777' },
  fire:      { name: 'Vijayawada Fire Station', number: '101' },
  ambulance: { name: 'APSRTC Ambulance', number: '108' },
  vmc:       { name: 'VMC Control Room', number: '0866-2455007' },
  hospitals: [
    { name: 'GGH Vijayawada', number: '0866-2453822', type: 'govt' },
    { name: 'NIMS Vijayawada', number: '0866-2410777', type: 'govt' },
    { name: 'Apollo Vijayawada', number: '0866-6677777', type: 'private' },
  ],
};
```

### 6. `src/data/transportData.js`
Replace TSRTC/MMTS with APSRTC + Vijayawada City Bus routes:
- Key bus routes: 99, 99K, 99A (Pandit Nehru Bus Station ↔ outskirts)
- Auto-rickshaw zones and e-rickshaw corridors
- Vijayawada Railway Station junction info (major hub, 300+ trains/day)

### 7. `scripts/news_scraper.py`
```python
FEEDS = {
    'Eenadu Vijayawada':  'https://eenadu.net/rss/vijayawada',
    'Sakshi Vijayawada':  'https://sakshi.com/feed/vijayawada',
    'Andhra Jyothy':      'https://www.andhrajyothy.com/rss',
    'The Hindu Vijayawada': 'https://www.thehindu.com/news/cities/vijayawada/feeder/default.rss',
    'NTV Andhra Pradesh': 'https://www.ntvtelugu.com/rss',
    'TV9 Andhra':         'https://www.tv9telugu.com/rss',
}
```

### 8. `wrangler.toml`
```toml
name = "vijayawada-live"
compatibility_date = "2024-01-01"
```

---

## 🗺️ Pages & Routes

| Route | Page | Civic Data Source |
|---|---|---|
| `/` | Splash | — |
| `/dashboard` | Home Feed | APSRTC + VMC + AP Govt RSS |
| `/news` | News Listing | Eenadu / Sakshi / Andhra Jyothy RSS |
| `/water-supply` | Water Schedule | VMC Water Dept |
| `/emergency-contacts` | Emergency SOS | VMC / AP Police / GGH |
| `/transport` | Bus Routes | APSRTC city routes |
| `/jobs` | Job Board | APPSC / AP Govt / IT-AP |
| `/events` | AP State Holidays | AP Govt Calendar |
| `/budget` | VMC Budget | VMC Annual Budget 2025-26 |
| `/politicians` | MLA/MP Tracker | AP Assembly + LS constituencies |
| `/property-tax` | Tax Calculator | VMC property tax rules |
| `/ration-pds` | PDS Shops | APFCS (AP Food Corp) |
| `/schemes` | AP Govt Schemes | AP Welfare Dept |
| `/report` | Grievance / Report | VMC Grievance Portal |
| `/ai-pulse` | AI Briefing | Anthropic Claude (claude-3-5-haiku) |

---

## 🗃️ Supabase Schema

```sql
-- In your existing Supabase project:
CREATE SCHEMA vijayawada;

CREATE TABLE vijayawada.content (LIKE public.content INCLUDING ALL);
CREATE TABLE vijayawada.activity_log (LIKE public.activity_log INCLUDING ALL);
CREATE TABLE vijayawada.news_cache (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  source      text,
  url         text UNIQUE,
  category    text,
  published_at timestamptz,
  created_at  timestamptz DEFAULT now()
);
```

Set `database.py` `schema = 'vijayawada'` in this repo.

---

## ⚙️ GitHub Secrets Required

| Secret | Notes |
|---|---|
| `ANTHROPIC_API_KEY` | Shared from telangana-live |
| `GOOGLE_API_KEY` | Gemini for news summaries (shared) |
| `SUPABASE_URL` | Same Supabase project |
| `SUPABASE_KEY` | Same anon key |
| `CLOUDFLARE_API_TOKEN` | Cloudflare Pages deploy |

---

## 🚀 Bootstrap Commands

```bash
# 1. Clone base and point to new repo
git clone https://github.com/tnmurthy/telangana-live vijayawada-live
cd vijayawada-live
git remote remove origin
git remote add origin https://github.com/tnmurthy/vijayawada-live
git push -u origin main

# 2. Install deps
npm install

# 3. Update config.py, index.html, tailwind.config.js (brand colors)
# 4. Replace data files (see sections above)
# 5. Build and preview
npm run build && npm run preview
```

---

## 📐 Cloudflare Pages Config

| Field | Value |
|---|---|
| Build command | `npm run build` |
| Output dir | `dist` |
| Node version | `20` |
| Custom domain | `vijayawada.live` |

DNS: Add CNAME `vijayawada.live → <pages-project>.pages.dev`

---

## 🗓️ Launch Checklist

- [ ] Create GitHub repo `tnmurthy/vijayawada-live`
- [ ] Push base code (`git push -u origin main`)
- [ ] Update `config.py` — city name, state, URL
- [ ] Update `index.html` — title, meta, OG tags
- [ ] Update `tailwind.config.js` — brand colors
- [ ] Replace `src/data/waterSupplyData.js` with VMC data
- [ ] Replace `src/data/emergencyData.js` with AP data
- [ ] Replace `src/data/transportData.js` with APSRTC data
- [ ] Update `scripts/news_scraper.py` — Vijayawada RSS feeds
- [ ] Add GitHub Secrets (5 secrets)
- [ ] Create Cloudflare Pages project
- [ ] Connect custom domain `vijayawada.live`
- [ ] Supabase schema `vijayawada` created
- [ ] Test build `npm run build`
- [ ] Go live 🎉
