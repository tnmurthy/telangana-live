# Project Content Architecture & Milestones — telangana.live

This document outlines the content structure, design patterns, layouts, and release milestones for the independent citizen helper site **telangana.live**.

---

## 1. Information Architecture & Content Layout

The content is structured under the `frontend/src/content/docs/` directory. It is organized into **exactly 10 top-level categories**, each serving a specific domain of citizen-government interaction.

### Top-Level Directories and Sub-Pages

1. **`1-documents-certificates`** (Documents & Certificates)
   - `birth-certificate.md`
   - `caste-certificate.md`
   - `death-certificate.md`
   - `ews-certificate.md`
   - `family-membership-certificate.md`
   - `income-certificate.md`
   - `residence-certificate.md`

2. **`2-bills-taxes`** (Bills & Taxes)
   - `electricity-bill-payment.md`
   - `property-tax.md`
   - `rta-vehicle-tax.md`
   - `traffic-challan.md`
   - `water-bill-payment.md`

3. **`3-land-property`** (Land & Property)
   - `building-permissions.md`
   - `encumbrance-certificate.md`
   - `land-records-dharani.md`
   - `mutation-patta-transfer.md`
   - `property-registration.md`

4. **`4-ration-food-pensions`** (Ration, Food & Pensions)
   - `aasara-pension.md`
   - `new-ration-card.md`
   - `old-age-pension.md`
   - `ration-card-update.md`
   - `widow-disability-pension.md`

5. **`5-jobs-education-scholarships`** (Jobs, Education & Scholarships)
   - `post-matric-scholarship.md`
   - `pre-matric-scholarship.md`
   - `skill-development.md`
   - `tspsc-jobs.md`

6. **`6-complaints-grievances`** (Complaints & Grievances)
   - `ghmc-complaints.md`
   - `pg-portal.md`
   - `prajavani.md`
   - `road-civic-issues.md`

7. **`7-police-safety`** (Police & Safety)
   - `character-certificate.md`
   - `online-fir.md`
   - `tenant-verification.md`
   - `women-safety.md`

8. **`8-rti-courts-legal`** (RTI, Courts & Legal Help)
   - `court-case-status.md`
   - `free-legal-aid.md`
   - `lok-adalat.md`
   - `rti-application.md`

9. **`9-health-social-welfare`** (Health & Social Welfare)
   - `aarogyasri.md`
   - `basthi-dawakhana.md`
   - `disability-certificate.md`
   - `welfare-schemes.md`

10. **`10-elections-voting`** (Elections & Voting)
    - `address-update.md`
    - `check-voter-list.md`
    - `polling-booth.md`
    - `voter-registration.md`

---

## 2. Sub-page Content Contract

To maintain a consistent experience across all civic helper pages, every sub-page must strictly adhere to the following Markdown template and content requirements:

### Structure Template
```markdown
# [Citizen-Friendly Title]

[1-2 sentence introduction explaining what the service is and why people use it.]

## Who should use this
- [Target User Segment 1]
- [Target User Segment 2]
- [Target User Segment 3]

## Steps in short
1. [Generic Step 1 fitting Telangana online workflow]
2. [Generic Step 2 fitting Telangana online workflow]
3. [Generic Step 3 fitting Telangana online workflow]
4. [Generic Step 4 fitting Telangana online workflow]

## Important links
- [Descriptive Link 1 Text](#)
- [Descriptive Link 2 Text](#)

---

> **Disclaimer:** This website is not an official government portal. Telangana.live is an independent helper site that explains and links to official services. All actual transactions and applications must be done on the official government websites.
```

### Required Sections
1. **H1 Header (`# Title`)**: Clear, citizen-friendly name of the civic task (not internal government jargon).
2. **Intro Paragraph**: 1-2 concise sentences explaining the utility.
3. **`## Who should use this`**: 2 to 4 bullet points outlining eligibility or target audience.
4. **`## Steps in short`**: 4 to 7 numbered steps outlining the online/offline workflow.
5. **`## Important links`**: 2 to 5 descriptive anchor links with `#` as placeholder URLs.
6. **Disclaimer**: Statement confirming the unofficial helper nature of `telangana.live` and directing transactions to the official portals.

---

## 3. Project Milestones

The roadmap for the telangana.live civic helper portal consists of the following milestones:

### 🏁 Milestone 1: Content Setup and Verification (Current)
* **Goal:** Populate the core civic database with descriptive guides for the top 40+ citizen life events/services.
* **Success Criteria:** 
  - All 10 categories initialized.
  - Sub-pages written and complying with the UI template contract.
  - Structure verified successfully using `verify_structure.py`.

### ✅ Milestone 1.5: Repository Hygiene & Cleanup (Complete)
* **Priority:** High — blocks clean collaboration and inflates repo size/noise for every future contributor (human or agent).
* **Effort:** Small (~half a day)
* **Owner:** Unassigned
* **Goal:** Remove dead weight and duplicated artifacts accumulated during the content restructure and various AI-assisted sessions.
* **Outcome:**
  - ✅ Duplicate root `content/` directory removed (superseded by `frontend/src/content/docs/`). — `cb3e291`
  - ✅ `.vs/`, `graphify-out/`, and `frontend/test-results/` untracked from git; `.gitignore` corruption fixed. — `cb3e291`
  - ✅ Scratch/debug files removed (`scratch/`, `test_ephem.py`, `tmp.tmpenv`, `TG-Live.txt`, `manifest.txt`, `cc2c211.patch`). — `cb3e291`
  - ✅ `.agents/` session debris removed (24 files/dirs from a single orchestration run); `rules/`, `skills/`, `workflows/`, `team_roster.md` kept as persistent config. — `5176967`
  - ✅ Dead code removed: orphaned landing-page component cluster (Button/CTA/Features/Hero/Navigation/Pricing), superseded `Footer.tsx`/`NewsPage.jsx`, unused backend agents (`business_analyst`, `content_updater`, `transit_sync_agent`, `water_sync_agent`). Verified with a clean prod build. — `4e8b8a4`
  - ✅ `deployment/wrangler.toml` **kept** — retained as a Cloudflare Pages backup/alt deployment path alongside the primary Vercel setup.
  - **Follow-up found later (2026-07-14):** a full nested duplicate clone (`telangana-live/telangana-live/`, ~278MB, its own `.git` on the `master` branch) was discovered sitting inside the repo — unrelated to this milestone's original scope, predating it. Confirmed safe (0 unpushed commits, `master` fully synced with `origin/master`) and removed, except `.pytest_cache` and `frontend/.npm-cache`, which are permission-locked and need an Administrator PowerShell session on the owner's machine to clear.

### ✅ Milestone 2: UI & PWA Integration (Complete)
* **Goal:** Load the Markdown pages into the React frontend and bundle them using MDX/frontmatter or a local Vite content parser.
* **Outcome:**
  - ✅ **Dynamic documentation rendering** — `frontend/src/utils/markdownParser.js` glob-loads all 46 markdown files at build time (`import.meta.glob`, eager), extracts H1 titles, groups by category. `ServiceDetailPage.jsx` renders guides via `react-markdown` + `rehype-raw`; `ServicesDirectoryPage.jsx` lists them via `getCategories()`. Verified against a clean production build and a passing `verify_structure.py` run. — `23c04e4` (fixed an unrelated encoding bug in the verification script along the way)
  - ✅ **Search index functionality across all sub-pages** — `SearchPage.jsx` previously only searched News, Government Schemes, and Services Directory — the 46 civic guide sub-pages were not searchable at all. Added a "Guides" section that searches guide title, category, and full markdown content (stripped to plain text), with a highlighted context snippet per result. Same lightweight substring-match approach as the rest of the page; no new search library needed at this corpus size. — `2f2048d`
  - ✅ **Offline compatibility via service workers** — Already implemented: `public/sw.js` is a network-first, cache-fallback service worker precaching the app shell, registered from `src/main.jsx` (gated on production builds). Fixed a real gap found during the audit: `manifest.json`'s icons all pointed to the default Vite placeholder logo instead of the site's actual branded icon — swapped to `/favicon.svg`. — `d14b9e4`
  - **Known follow-up (not blocking):** the maskable icon entry reuses the same artwork without a dedicated 40%-safe-zone-padded variant, so some Android launchers may crop it slightly.

### 🏁 Milestone 3: Multilingual Support (English, Telugu, Urdu)
* **Goal:** Expand content accessibility to cover the major languages spoken in Telangana.
* **Status:** Deferred, skipped ahead to Milestone 4 at owner's request.
* **Success Criteria:** 
  - Structure translation dictionary for static strings.
  - Dynamic lang route matching (e.g., `/te/docs/...` and `/ur/docs/...`).
  - Screen reader compliance (WCAG 2.1 AA) for Telugu and Urdu scripts.

### ✅ Milestone 4: Life-Event Bundling & Wizard Interface (Complete)
* **Goal:** Pivot the user experience from departmental lists to citizen intent journeys (e.g., "New Homeowner" bundle linking Dharani, Property Tax, Water/Electricity connection).
* **Outcome:**
  - **Audit found:** `LifeEventWizard.jsx` already existed on the homepage as a "New Resident Setup" flow (utilities + MeeSeva identity updates), but the specific example this milestone names — a "New Homeowner" bundle — didn't exist, and there was no DigiLocker integration.
  - ✅ **New Homeowner journey added**, using the exact bundle named in this milestone's goal: Land Records (Dharani) → Property Tax → Water/Electricity, reusing the existing guide content for each.
  - ✅ **Restructured as a single journey-picker wizard** rather than stacking a second competing widget on the homepage: one clear two-card choice up front (New Resident / New Homeowner), only one journey visible at a time.
  - ✅ **Multi-step progressive disclosure**, deliberately hand-holding: each topic step has exactly one primary action (an in-app guide link, not scattered external tabs) and a mandatory acknowledgment checkbox gating "Continue" — no accidental skipping ahead. Final step shows a completion checklist recap.
  - **DigiLocker:** intentionally not built. A real connector needs government API/OAuth credentials this project doesn't have access to; faking one would be worse than not having it. Kept as external link-outs via MeeSeva, same pattern used for the existing Resident journey.
  - — `bb2253c`

### ✅ Milestone 4.5: Local Alerts Feed (Complete)
* **Goal:** Surface real-time civic disruptions (floods, power/water outages, road closures, bandhs, weather warnings) instead of requiring citizens to piece this together from general news.
* **Origin:** Scoped by benchmarking against a comparable civic platform (`forthepeople`), which implements this as a per-district Google News RSS scan with regex-based type/severity classification.
* **Outcome:**
  - ✅ **Backend sync job** — `sync_alerts()` in `backend/scripts/data_engine.py`: regex-first classification against 8 alert types (flood, natural disaster, emergency, weather, strike, road closure, power outage, water supply) over 6 topic queries against Google News RSS. Regionally scoped state-wide rather than per-district (reuses `core.news_classifier.classify_article()`'s existing region inference instead of multiplying RSS queries per district). Auto-expires alerts after 3 days, dedupes by title. Writes `frontend/src/data/alerts.json`.
  - ✅ **AI-filtering decision:** regex-first, cheap and reliable, matching the proven approach this was benchmarked against. An *optional* Ollama confidence pass runs only for the more ambiguous alert types (strike/road closure/power outage/water supply), and only while the provider keeps responding — alerts never depend on AI being available, mirroring the graceful-degradation pattern already used by `sync_ai_pulse()`.
  - ✅ **Precision fixes found via live testing** (not theoretical): (1) out-of-state articles that merely mentioned "Telangana" in passing were leaking through via `classify_article()`'s generic region fallback — added an explicit local-keyword relevance filter scoped to this feature only, without touching the shared classifier. (2) Google News RSS appends the source name to both `title` and `description` fields, which was defeating the relevance filter (a Telangana outlet reporting on Kerala floods matched on its own name) — fixed by matching against the cleaned headline only. (3) stored `description` was raw unescaped HTML; now stripped and entity-decoded.
  - ✅ **Scheduler wiring** — runs every 2 hours (`backend/scheduler.py`), configurable via `CONFIG['alerts_sync_interval_hours']`. Also included in the twice-daily full-refresh maintenance passes.
  - ✅ **Frontend** — `AlertsPage.jsx` (`/alerts`): full list, filterable by severity, links out to source. `AlertsBanner.jsx`: homepage banner deliberately restrained to avoid banner fatigue — only critical/high severity, capped at 2 alerts, session-only dismiss (not persisted) so a real emergency can't be permanently hidden by a stale dismissal.
  - **Unrelated bug fixed along the way:** `scheduler.py` had `from config import CONFIG`, but the module actually lives at `backend/core/config.py` — the entire scheduler couldn't start at all until this was corrected.
  - — backend: pushed via merge `f758fda`; frontend: `e925e72`

### ✅ Milestone 5: Enterprise CI/CD Pipeline & DevOps Architecture (Complete)
* **Goal:** Deploy a robust, foolproof, automated CI/CD pipeline ensuring code quality, security compliance, static analysis, and zero-downtime deployments.
* **Owner:** Senior DevOps Architect (`DevOps Automator` subagent)
* **Outcome:**
  - ✅ **Unified CI/CD Pipeline** — `.github/workflows/ci_cd_master.yml` created with parallelized security, frontend, backend, and E2E stages.
  - ✅ **Security & Compliance Gates** — TruffleHog secrets scanning, Bandit Python SAST, `npm audit`, and Python `safety check`.
  - ✅ **Frontend & Backend Quality Gates** — Vitest & Pytest unit tests with coverage, bundle size budget checks (`size-limit`), and ESLint/Ruff static analysis.
  - ✅ **Automated Deployment & Rollbacks** — Zero-downtime Vercel deployments to Staging and Production with concurrency group auto-cancellation.
  - ✅ **DevOps Documentation** — Complete architectural blueprint updated in `.Codex/ARCHITECTURE_MAP.md` and `ci_cd_architecture.md`.

---

## 4. Layout Compliance and Quality Assurance

A dedicated Python script `verify_structure.py` is included at the project root to enforce structure:
- **Execute validation:**
  ```bash
  python verify_structure.py
  ```
- **Automated Checks:**
  - Asserts exactly 10 categories are present in `frontend/src/content/docs`.
  - Confirms each category folder contains between 3 and 7 files.
  - Verifies presence of `#`, `## Who should use this`, `## Steps in short`, and `## Important links` in each file.
  - Assures the disclaimer is present on all pages.
