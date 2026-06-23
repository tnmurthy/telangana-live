# Original User Request

## Initial Request — 2026-06-23T13:29:36+05:30

Design and write the complete Markdown content and information architecture for an independent Telangana civic helper site at `telangana.live`. The site explains and aggregates official Telangana online services without executing transactions.

Working directory: `C:/tt-ai-stack/01_projects/telangana-live/frontend/src/content/docs`
Integrity mode: demo (The team can use pre-existing knowledge or search the web for actual MeeSeva / Telangana portal steps to ensure accuracy.)

## Requirements

### R1. Content Scope and Architecture
- Create exactly 10 Top-Level Categories in this priority order:
  1) Documents & Certificates, 2) Bills & Taxes, 3) Land & Property, 4) Ration, Food & Pensions, 5) Jobs, Education & Scholarships, 6) Complaints & Grievances, 7) Police & Safety, 8) RTI, Courts & Legal Help, 9) Health & Social Welfare, 10) Elections & Voting
- For each top-level category, create 3–7 sub-pages for the most common real citizen tasks.

### R2. Page Structure and Template
Each sub-page must strictly follow this Markdown template:
- `#` Page title (clear, citizen-friendly)
- 1–2 sentence intro explaining what the service is and why people use it
- `## Who should use this` (2–4 bullets)
- `## Steps in short` (4–7 generic steps that fit Telangana online workflows)
- `## Important links` (2–5 descriptive items with `#` as placeholder URLs)

### R3. Tone and Clarity
- Every page must use simple, non-bureaucratic English suitable for first-time smartphone users.
- Each page must contain a disclaimer stating that the site is not an official government portal and actual transactions happen on official sites.

### R4. Verification Script
- Before considering the task complete, you must write a python script `verify_structure.py` that parses the generated markdown files.
- The script must assert that:
  - There are exactly 10 top-level categories.
  - Every category contains between 3 and 7 sub-pages.
  - Every sub-page contains the exact required headings: `#`, `## Who should use this`, `## Steps in short`, and `## Important links`.
  - Every sub-page contains the non-official portal disclaimer.
- The script must exit with code 0 if all checks pass, and code 1 if any check fails. You must iterate on the content until the script passes.

## Acceptance Criteria

### Coverage & Structure
- [ ] `verify_structure.py` runs successfully (exit code 0).
- [ ] Exactly 10 top-level categories exist with 3-7 sub-pages each.
- [ ] Every sub-page strictly adheres to the required Markdown headings.

### Quality & Tone
- [ ] An independent agent-as-judge confirms the language is simple, non-bureaucratic, and suitable for first-time smartphone users.
- [ ] Every page includes the mandatory disclaimer.

## Follow-up — 2026-06-23T09:51:35Z

Build the frontend engine and user interface necessary to parse, serve, and beautifully display the 46 civic markdown guides currently stored in `frontend/src/content/docs` on the `telangana.live` platform. 

Working directory: `C:/tt-ai-stack/01_projects/telangana-live/frontend`
Integrity mode: development (Use standard React/Vite development practices. No external web searching required for content, just technical implementation.)

## Requirements

### R1. Markdown Parsing Engine
- Implement a utility to parse the local markdown files from `src/content/docs`.
- The engine must dynamically map the 10 top-level category directories and their respective sub-pages to generate a structured navigation map.
- You may install necessary dependencies for markdown parsing (e.g., `react-markdown`, `gray-matter`).

### R2. UI Reuse and Architecture
- **Review Existing Code:** Review the existing `MeeSevaPage.jsx`, `SchemesPage.jsx`, and similar pages. Notice their premium UI (glass-cards, accordions, status trackers).
- **Global Services Directory (`/services`)**: Create a beautiful index page that lists all 10 top-level categories. Reuse the glass-card and category tab UI patterns found in `MeeSevaPage`.
- **Dynamic Content Page (`/services/:category/:slug`)**: Create a dynamic React route that renders the selected markdown file. The layout must match the existing site's aesthetic. Reuse the layout wrappers, headers, and CSS classes already present in the codebase.
- Do NOT build generic, unstyled pages. Ensure high-contrast, GIGW 3.0 compliant, mobile-first design.

### R3. App Integration
- Update `src/App.jsx` to register the new routes (`/services` and the dynamic sub-routes).
- Add a prominent link to the new "Services Directory" in the main site navigation (`Header` or `BottomNav`).

### R4. Verification Mechanism
- Before completing the task, you must write a Node.js verification script `verify_engine.js` in the `frontend` root.
- The script must programmatically assert that:
  - The new routes exist in `App.jsx`.
  - The parser utility correctly identifies exactly 10 categories when pointed at the `src/content/docs` directory.
  - The necessary UI components exist and use the required CSS classes for consistency.
- The script must exit with code 0 on success, and code 1 on failure.

## Acceptance Criteria

### Implementation Quality
- [ ] `node verify_engine.js` runs successfully (exit code 0).
- [ ] The app compiles and runs locally without any new build or linting errors.

### UX & Architecture
- [ ] The markdown content is fully integrated into the React router.
- [ ] The design successfully reuses the premium aesthetic and components from existing pages like `MeeSevaPage`.
