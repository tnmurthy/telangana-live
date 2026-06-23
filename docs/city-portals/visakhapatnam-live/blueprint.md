# Visakhapatnam Live — City Portal Blueprint

**Repo:** `tnmurthy/visakhapatnam-live`  
**Domain:** `vizag.live` (or `visakhapatnam.live`)  
**Stack:** React 19 + Vite + Tailwind CSS v3 + Supabase + Cloudflare Pages  
**Bootstrapped from:** `tnmurthy/telangana-live` (fork + customise)

---

## 🏙️ City Profile

| Field | Value |
|---|---|
| City | Visakhapatnam (Vizag) |
| State | Andhra Pradesh |
| Municipal Body | Greater Visakhapatnam Municipal Corporation (GVMC) |
| Region | North Andhra / Uttarandhra |
| Language | Telugu (`te`) |
| Population | ~2.1 million (city), ~2.5 million (metro) |
| Key Areas | MVP Colony, Madhurawada, Rushikonda, Seethammadhara, Gajuwaka, Steel Plant Area, Kommadi |

---

## 🎨 Brand Identity

```js
// tailwind.config.js — extend colors
colors: {
  'city-primary':   '#0D9488',  // Bay Teal (Bay of Bengal)
  'city-accent':    '#F97316',  // Vizag Sunrise Orange
  'city-bg':        '#0C1A1F',
  'city-surface':   '#152530',
  'city-muted':     '#5E8D99',
}
```

**Logo concept:** Kailasagiri Hill silhouette + Bay of Bengal wave  
**Tagline:** *"City of Destiny — Live, Local, Connected"*

---

## 📁 Repo File Changes from Base (telangana-live)

### 1. `config.py`
```python
CONFIG = {
  'site_url':    'https://vizag.live',
  'city_name':   'Visakhapatnam',
  'state':       'Andhra Pradesh',
  'language':    'te',
  'supabase_schema': 'visakhapatnam',
}
```

### 2. `index.html`
```html
<title>Vizag Live — Civic Portal for Visakhapatnam Citizens</title>
<meta name="description" content="Water supply, GVMC services, jobs, grievances and live news for Vizag citizens.">
<meta property="og:title" content="Vizag Live">
<meta property="og:url" content="https://vizag.live">
```

### 3. `src/data/divisions.js`
Replace Telangana districts with GVMC divisions/zones:
```js
export const divisions = [
  { name: 'Zone I – Sriharipuram', wards: ['1','2','3','4','5'] },
  { name: 'Zone II – Gajuwaka', wards: ['6','7','8','9','10'] },
  { name: 'Zone III – Visakhapatnam', wards: ['11','12','13','14','15'] },
  { name: 'Zone IV – Bheemunipatnam', wards: ['16','17','18','19','20'] },
  // … all 98 GVMC wards across 4 zones
];
```

### 4. `src/data/waterSupplyData.js`
Replace with GVMC Water Supply Department data:
- Primary source: Mudasarlova & Gambhiram reservoirs
- Key fields: `zone`, `ward`, `supply_slot`, `duration_hrs`, `disruption`
- Note: Many wards get only 1–2 hrs/day — disruption field is critical

### 5. `src/data/emergencyData.js`
```js
export const emergencyContacts = {
  police:    { name: 'Visakhapatnam City Police', number: '0891-2754444' },
  fire:      { name: 'Vizag Fire Station', number: '101' },
  ambulance: { name: '108 Ambulance Service', number: '108' },
  gvmc:      { name: 'GVMC Control Room', number: '0891-2506868' },
  coast_guard: { name: 'Coast Guard Vizag', number: '0891-2874831' },
  hospitals: [
    { name: 'King George Hospital (KGH)', number: '0891-2564891', type: 'govt' },
    { name: 'GITAM Hospital', number: '0891-2840444', type: 'private' },
    { name: 'Apollo Hospitals Vizag', number: '0891-6677777', type: 'private' },
    { name: 'VIMS (Vizag)', number: '0891-2889999', type: 'govt' },
  ],
};
```

### 6. `src/data/transportData.js`
Replace with APSRTC Vizag + GVMC city bus routes:
- Major corridors: RTC Complex ↔ Steel Plant, Simhachalam ↔ Beach Road
- Harbour Line railway stops (Vizag, Duvvada, Simhachalam)
- APSRTC Volvo routes to Hyderabad/Vijayawada
- Vizag Metro Rail (under construction — show project status)

### 7. `scripts/news_scraper.py`
```python
FEEDS = {
    'Eenadu Visakhapatnam': 'https://eenadu.net/rss/visakhapatnam',
    'Sakshi Vizag':         'https://sakshi.com/feed/visakhapatnam',
    'Andhra Jyothy Vizag':  'https://www.andhrajyothy.com/rss/visakhapatnam',
    'Hans India Vizag':     'https://www.thehansindia.com/feeds/andhra-pradesh',
    'Vizag Vision':         'https://www.vizagvision.com/feed',
    'NTV AP':               'https://www.ntvtelugu.com/rss',
}
```

### 8. `wrangler.toml`
```toml
name = "visakhapatnam-live"
compatibility_date = "2024-01-01"
```

---

## 🗺️ Pages & Routes

| Route | Page | Civic Data Source |
|---|---|---|
| `/` | Splash | — |
| `/dashboard` | Home Feed | GVMC + AP Govt + Harbour News |
| `/news` | News Listing | Eenadu / Sakshi / Hans India RSS |
| `/water-supply` | Water Schedule | GVMC Water Dept (zone-wise) |
| `/emergency-contacts` | Emergency SOS | GVMC / City Police / KGH / Coast Guard |
| `/transport` | Bus + Rail | APSRTC Vizag + Harbour Line |
| `/jobs` | Job Board | APPSC / AP Govt / Naval Dockyard / Steel Plant |
| `/events` | AP State Holidays | AP Govt Calendar |
| `/budget` | GVMC Budget | GVMC Annual Budget 2025-26 |
| `/politicians` | MLA/MP Tracker | AP Assembly + Parliament (Vizag constituency) |
| `/property-tax` | Tax Calculator | GVMC property tax rules |
| `/ration-pds` | PDS Shops | APFCS |
| `/schemes` | AP Govt Schemes | AP Welfare + MSME schemes |
| `/report` | GVMC Grievance | GVMC Samara App integration |
| `/beach-alert` | Beach Safety | NDRF / Coast Guard sea alerts |
| `/ai-pulse` | AI Briefing | Anthropic Claude |

> 💡 Unique to Vizag: `/beach-alert` page for storm/sea condition alerts from Coast Guard and NDRF — critical for a coastal city.

---

## 🗃️ Supabase Schema

```sql
CREATE SCHEMA visakhapatnam;

CREATE TABLE visakhapatnam.content (LIKE public.content INCLUDING ALL);
CREATE TABLE visakhapatnam.activity_log (LIKE public.activity_log INCLUDING ALL);
CREATE TABLE visakhapatnam.news_cache (
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
git clone https://github.com/tnmurthy/telangana-live visakhapatnam-live
cd visakhapatnam-live
git remote remove origin
git remote add origin https://github.com/tnmurthy/visakhapatnam-live
git push -u origin main

# 2. Install deps
npm install

# 3. Update config.py, index.html, tailwind.config.js (brand colors)
# 4. Replace data files (see sections above)
# 5. Add unique /beach-alert page for coastal safety
# 6. Build and preview
npm run build && npm run preview
```

---

## 📐 Cloudflare Pages Config

| Field | Value |
|---|---|
| Build command | `npm run build` |
| Output dir | `dist` |
| Node version | `20` |
| Custom domain | `vizag.live` |

---

## 🗓️ Launch Checklist

- [ ] Create GitHub repo `tnmurthy/visakhapatnam-live`
- [ ] Push base code (`git push -u origin main`)
- [ ] Update `config.py` — city name, state, URL
- [ ] Update `index.html` — title, meta, OG tags
- [ ] Update `tailwind.config.js` — Bay Teal + Sunrise Orange
- [ ] Replace `src/data/waterSupplyData.js` with GVMC zone data
- [ ] Replace `src/data/emergencyData.js` with Coast Guard + KGH contacts
- [ ] Replace `src/data/transportData.js` with APSRTC Vizag + Harbour Line
- [ ] Update `scripts/news_scraper.py` — Vizag RSS feeds
- [ ] Add unique `/beach-alert` page (coastal city differentiator)
- [ ] Add GitHub Secrets (5 secrets)
- [ ] Create Cloudflare Pages project
- [ ] Connect custom domain `vizag.live`
- [ ] Supabase schema `visakhapatnam` created
- [ ] Test build `npm run build`
- [ ] Go live 🎉
