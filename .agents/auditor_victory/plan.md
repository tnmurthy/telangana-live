# Victory Audit Plan

This plan details the step-by-step verification steps to independently audit the victory claimed by the Project Orchestrator for the civic markdown guides parsing, rendering, and routing implementation.

## Phase A: Timeline & Provenance Audit
- [ ] Inspect agent metadata (progress logs, plan files) in `.agents/orchestrator_v2/` and other directories to reconstruct the implementation timeline.
- [ ] Analyze file timestamps and creation patterns to verify they represent genuine iterative progress rather than pre-fabricated or copy-pasted dumps.
- [ ] Document the reconstructed timeline and check for anomalies.

## Phase B: Cheating & Mocking Detection
- [ ] Inspect the verification scripts `frontend/verify_engine.js` and `verify_structure.py` for bypasses, mocked assertions, or exit 0 shortcuts.
- [ ] Scan the codebase for prohibited patterns (hardcoded test results, fake implementations, self-certifying tests, or execution delegation).
- [ ] Verify that files are read dynamically from the disk and processed correctly.

## Phase C: Verification Checks (Static Analysis & File Scanning)
- [ ] Confirm the presence of key deliverables:
  - `frontend/src/utils/markdownParser.js`
  - `frontend/src/pages/ServicesDirectoryPage.jsx`
  - `frontend/src/pages/ServiceDetailPage.jsx`
  - `frontend/src/App.jsx`
  - `frontend/src/components/LeftSidebar.jsx`
  - `frontend/src/components/BottomNav.jsx`
  - `frontend/scripts/generate-sitemap.cjs`
  - `frontend/public/sitemap.xml`
- [ ] Verify that React Router routes in `App.jsx` are configured correctly and that `/services` and `/services/:category/:slug` are registered above the wildcard `/:region` route.
- [ ] Count categories and files in `frontend/src/content/docs` (must be exactly 10 folders, with 3 to 7 markdown files each, totaling 46).
- [ ] Verify that all 46 markdown files comply with the formatting rules (exactly one H1, specific H2s, and the required disclaimer).
- [ ] Verify that the navigation entries are wired in `LeftSidebar` and `BottomNav`.
- [ ] Verify that `generate-sitemap.cjs` works dynamically and `sitemap.xml` includes all 46 guides.
