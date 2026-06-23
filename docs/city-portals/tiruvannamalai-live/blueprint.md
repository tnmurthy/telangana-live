# Tiruvannamalai Live — City Portal Blueprint

**Repo:** `tnmurthy/tiruvannamalai-live`  
**Domain:** `tiruvannamalai.live` (or `tvmalai.live`)  
**Stack:** React 19 + Vite + Tailwind CSS v3 + Supabase + Cloudflare Pages  
**Bootstrapped from:** `tnmurthy/telangana-live` (fork + customise)

---

## 🏙️ City Profile

| Field | Value |
|---|---|
| City | Tiruvannamalai |
| State | Tamil Nadu |
| Municipal Body | Tiruvannamalai Municipality (Town Panchayat areas) |
| District | Tiruvannamalai District |
| Language | Tamil (`ta`) |
| Population | ~145,000 (city), ~250,000 (district HQ area) |
| Key Areas | Girivalam Path, Big Temple Area, Chengam Road, Chennai Salai, Polur Road, Mazhavilai |

---

## 🎨 Brand Identity

```js
// tailwind.config.js — extend colors
colors: {
  'city-primary':   '#EA580C',  // Arunachala Saffron (sacred fire/mountain)
  'city-accent':    '#78350F',  // Temple Stone Brown
  'city-bg':        '#1A0F0A',
  'city-surface':   '#2A1810',
  'city-muted':     '#9A6B50',
}
```

**Logo concept:** Arunachaleswarar Temple gopuram silhouette + Arunachala hill  
**Tagline:** *"Sacred City, Smart Citizens"*

---

## 📁 Repo File Changes from Base (telangana-live)

### 1. `config.py`
```python
CONFIG = {
  'site_url':    'https://tiruvannamalai.live',
  'city_name':   'Tiruvannamalai',
  'state':       'Tamil Nadu',
  'language':    'ta',
  'supabase_schema': 'tiruvannamalai',
}
```

### 2. `index.html`
```html
<title>Tiruvannamalai Live — Civic Portal for Tiruvannamalai Citizens</title>
<meta name="description" content="Water supply, municipality services, temple events, jobs and live news for Tiruvannamalai citizens.">
<meta property="og:title" content="Tiruvannamalai Live">
<meta property="og:url" content="https://tiruvannamalai.live">
<!-- Tamil language hint -->
<meta http-equiv="Content-Language" content="ta">
```

### 3. `src/data/divisions.js`
Replace Telangana districts with Tiruvannamalai municipality wards:
```js
export const divisions = [
  { name: 'Ward 1 – Temple Area', zones: ['Big Temple', 'Car Street'] },
  { name: 'Ward 2 – Girivalam Path North', zones: ['Adi Annamalai', 'Pavazhakundru'] },
  { name: 'Ward 3 – Chennai Salai', zones: ['Vettavalam Road', 'Bus Stand'] },
  // … all 30 municipality wards
];
```

### 4. `src/data/waterSupplyData.js`
Replace with Tiruvannamalai Municipality water schedule:
- Source: TWAD Board (Tamil Nadu Water Supply and Drainage Board)
- Key challenge: Many wards on alternate-day supply
- Key fields: `ward`, `supply_day`, `slot`, `source` (TWAD/Borewell/River), `disruption`

### 5. `src/data/emergencyData.js`
```js
export const emergencyContacts = {
  police:    { name: 'Tiruvannamalai Town Police', number: '04175-222100' },
  fire:      { name: 'TVM Fire & Rescue', number: '101' },
  ambulance: { name: '108 Ambulance', number: '108' },
  municipality: { name: 'TVM Municipality Office', number: '04175-225550' },
  temple:    { name: 'Arunachaleswarar Temple Admin', number: '04175-252001' },
  hospitals: [
    { name: 'Govt. District Headquarters Hospital', number: '04175-223333', type: 'govt' },
    { name: 'Arunai Annamalai Hospital', number: '04175-231000', type: 'private' },
    { name: 'TVM Medical College Hospital', number: '04175-234444', type: 'govt' },
  ],
};
```

### 6. `src/data/transportData.js`
Replace with TN state transport + local routes:
- TNSTC (TN State Transport Corp) bus routes: Chennai ↔ TVM, Villupuram ↔ TVM, Vellore ↔ TVM
- Key stands: New Bus Stand (Chengam Road), Arunachala Temple Bus Stand
- Girivalam day auto-rickshaw routes (full circuit = 14 km)
- Nearest railway station: Tiruvannamalai (TVMAL) — on Villupuram–Katpadi line

### 7. `scripts/news_scraper.py`
```python
FEEDS = {
    'Dinamalar TVM':     'https://www.dinamalar.com/rss/tiruvannamalai',
    'Dinamani TVM':      'https://www.dinamani.com/rss',
    'Sun News TN':       'https://www.sunnews.in/rss',
    'The Hindu TN':      'https://www.thehindu.com/news/states/tamil-nadu/feeder/default.rss',
    'Puthiyathalaimurai': 'https://www.puthiyathalaimurai.com/rss',
    'Polimer News':      'https://polimerdigital.com/rss',
}
```

> ⚠️ Language note: Most feeds are in Tamil script. The Claude agent should summarise in both Tamil and English. Set `'language': 'ta'` in `config.py`.

### 8. `wrangler.toml`
```toml
name = "tiruvannamalai-live"
compatibility_date = "2024-01-01"
```

---

## 🗺️ Pages & Routes

| Route | Page | Civic Data Source |
|---|---|---|
| `/` | Splash | — |
| `/dashboard` | Home Feed | TVM Municipality + TN Govt RSS |
| `/news` | News Listing | Dinamalar / Dinamani / The Hindu RSS |
| `/water-supply` | Water Schedule | TWAD Board / TVM Municipality |
| `/emergency-contacts` | Emergency SOS | TVM Police / DHQ Hospital / Temple Admin |
| `/transport` | Bus Routes | TNSTC + Local Auto Routes |
| `/jobs` | Job Board | TNPSC / TN Govt / SIPCOT IT Park jobs |
| `/events` | TN State Holidays + Temple Festivals | TN Govt Calendar + Temple Calendar |
| `/budget` | Municipality Budget | TVM Municipality Annual Budget |
| `/politicians` | MLA/MP Tracker | TN Assembly (TVM constituency) + Parliament |
| `/property-tax` | Tax Calculator | TVM Municipality property tax rules |
| `/ration-pds` | PDS Shops | TNCSC (TN Civil Supplies) |
| `/schemes` | TN Govt Schemes | Kalaignar Magalir Urimai Thittam, CM Breakfast, etc. |
| `/report` | Grievance | TVM Municipality online complaint |
| `/girivalam` | Girivalam Guide | Full-moon dates, route map, facilities |
| `/ai-pulse` | AI Briefing | Anthropic Claude (bilingual: Tamil + English) |

> 💡 Unique to TVM: `/girivalam` page — Girivalam (circumambulation of Arunachala hill, 14km) draws 3–5 lakh devotees on full-moon days. Show next date, facilities, and crowd alerts.

---

## 🛕 Unique Feature: Girivalam Tracker (`/girivalam`)

This is the **killer feature** that differentiates tiruvannamalai.live:

```js
// src/data/girivalamData.js
export const fullMoonDates2026 = [
  { date: '2026-01-13', nakshatra: 'Poosam', crowd_level: 'Very High (5L+)' },
  { date: '2026-02-12', nakshatra: 'Magam', crowd_level: 'High (3L)' },
  // ...
];

export const girivalamStops = [
  { name: 'Arunachaleswarar Temple (Start)', km: 0, facilities: ['Toilet','Water','Food'] },
  { name: 'Adi Annamalai Temple', km: 2.5, facilities: ['Temple','Water'] },
  { name: 'Pavazhakundru', km: 5, facilities: ['Rest Area','Toilet'] },
  { name: 'Nandi Temple', km: 8, facilities: ['Water','Food'] },
  { name: 'Eesanya Lingam', km: 11, facilities: ['Rest Area'] },
  { name: 'Return to Main Temple', km: 14, facilities: ['Temple','Medical Camp'] },
];
```

---

## 🗃️ Supabase Schema

```sql
CREATE SCHEMA tiruvannamalai;

CREATE TABLE tiruvannamalai.content (LIKE public.content INCLUDING ALL);
CREATE TABLE tiruvannamalai.activity_log (LIKE public.activity_log INCLUDING ALL);
CREATE TABLE tiruvannamalai.news_cache (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  source      text,
  url         text UNIQUE,
  language    text DEFAULT 'ta',
  category    text,
  published_at timestamptz,
  created_at  timestamptz DEFAULT now()
);
```

---

## ⚙️ GitHub Secrets Required

| Secret | Notes |
|---|---|
| `ANTHROPIC_API_KEY` | Shared — model supports Tamil |
| `GOOGLE_API_KEY` | Gemini 1.5 supports Tamil summaries |
| `SUPABASE_URL` | Same Supabase project |
| `SUPABASE_KEY` | Same anon key |
| `CLOUDFLARE_API_TOKEN` | Cloudflare Pages deploy |

---

## 🚀 Bootstrap Commands

```bash
# 1. Clone base and point to new repo
git clone https://github.com/tnmurthy/telangana-live tiruvannamalai-live
cd tiruvannamalai-live
git remote remove origin
git remote add origin https://github.com/tnmurthy/tiruvannamalai-live
git push -u origin main

# 2. Install deps
npm install

# 3. Update config.py (language: 'ta'), index.html, tailwind.config.js
# 4. Replace data files with TVM/TWAD/TNSTC data
# 5. Add unique /girivalam page (Girivalam tracker — killer feature)
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
| Custom domain | `tiruvannamalai.live` |

---

## 🗓️ Launch Checklist

- [ ] Create GitHub repo `tnmurthy/tiruvannamalai-live`
- [ ] Push base code (`git push -u origin main`)
- [ ] Update `config.py` — city, Tamil Nadu state, language: `ta`
- [ ] Update `index.html` — Tamil title, meta, OG tags
- [ ] Update `tailwind.config.js` — Saffron + Temple Stone
- [ ] Replace `src/data/waterSupplyData.js` with TWAD/TVM data
- [ ] Replace `src/data/emergencyData.js` with TVM Police, DHQ, Temple contacts
- [ ] Replace `src/data/transportData.js` with TNSTC routes
- [ ] Update `scripts/news_scraper.py` — Dinamalar/Dinamani feeds
- [ ] Add unique `/girivalam` page with full-moon dates + route stops
- [ ] Add GitHub Secrets (5 secrets)
- [ ] Create Cloudflare Pages project
- [ ] Connect custom domain `tiruvannamalai.live`
- [ ] Supabase schema `tiruvannamalai` created
- [ ] Test build `npm run build`
- [ ] Go live 🎉
