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

### 🧹 Milestone 1.5: Repository Hygiene & Cleanup (Now)
* **Priority:** High — blocks clean collaboration and inflates repo size/noise for every future contributor (human or agent).
* **Effort:** Small (~half a day)
* **Owner:** Unassigned
* **Dependencies:** None — self-contained, runs in parallel with closing out Milestone 1.
* **Goal:** Remove dead weight and duplicated artifacts accumulated during the content restructure and various AI-assisted sessions.
* **Success Criteria:**
  - Duplicate root `content/` directory removed (superseded by `frontend/src/content/docs/`).
  - `.vs/`, `graphify-out/`, and `frontend/test-results/` untracked from git.
  - Scratch/debug files removed (`scratch/`, `test_ephem.py`, `tmp.tmpenv`, `TG-Live.txt`, `manifest.txt`, `cc2c211.patch`).
  - `.gitignore` corruption fixed (garbled `.env` line, duplicate entries).
  - Fate of `.agents/` versioned duplicates (`worker_verification_v2/v3/v4`, etc.) and `deployment/wrangler.toml` vs. Vercel-only deployment decided and documented.

### 🏁 Milestone 2: UI & PWA Integration
* **Goal:** Load the Markdown pages into the React frontend and bundle them using MDX/frontmatter or a local Vite content parser.
* **Success Criteria:** 
  - Dynamic documentation rendering.
  - Offline compatibility via service workers.
  - Search index functionality across all sub-pages.

### 🏁 Milestone 3: Multilingual Support (English, Telugu, Urdu)
* **Goal:** Expand content accessibility to cover the major languages spoken in Telangana.
* **Success Criteria:** 
  - Structure translation dictionary for static strings.
  - Dynamic lang route matching (e.g., `/te/docs/...` and `/ur/docs/...`).
  - Screen reader compliance (WCAG 2.1 AA) for Telugu and Urdu scripts.

### 🏁 Milestone 4: Life-Event Bundling & Wizard Interface
* **Goal:** Pivot the user experience from departmental lists to citizen intent journeys (e.g., "New Homeowner" bundle linking Dharani, Property Tax, Water/Electricity connection).
* **Success Criteria:** 
  - DigiLocker/MeeSeva connector architecture.
  - Multi-step progressive disclosure forms.

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
