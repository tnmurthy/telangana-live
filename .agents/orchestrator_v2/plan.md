# Project Plan: Markdown Guides Integration

This document outlines the step-by-step plan for parsing, serving, and displaying the 46 civic markdown guides on the `telangana.live` platform.

## Milestones and Status

| Milestone | Description | Dependencies | Status |
|-----------|-------------|--------------|--------|
| **M1: Exploration & Setup** | Run code exploration, design the parser loading strategy, and write the plan | None | In Progress |
| **M2: Verification & Routing Skeletons** | Write `verify_engine.js` verification script and create empty routes/pages to verify basic router integration | M1 | Planned |
| **M3: Parsing Engine** | Implement utility to dynamically scan directories using Vite's `import.meta.glob` and build the category-slug map | M2 | Planned |
| **M4: Directory UI (`/services`)** | Build the `/services` index page reusing the glass-cards and category tabs from `MeeSevaPage.jsx` | M3 | Planned |
| **M5: Guide Details UI (`/services/:category/:slug`)** | Build the dynamic page to render parsed markdown using `react-markdown` and `rehype-raw` | M4 | Planned |
| **M6: App Integration & Final Verification** | Wire up final navigation in `Header`/`BottomNav`, test all routes, and run `verify_engine.js` | M5 | Planned |

---

## Technical Design & Strategy

### 1. File Loader (Client-Side)
- Vite does not allow server-side Node.js `fs` operations in the browser.
- We will use `import.meta.glob('/src/content/docs/**/*.md', { query: '?raw', import: 'default', eager: true })` to load the 46 markdown files as raw strings at bundle/runtime.
- The path mapping will extract category IDs, categories names, and file slugs dynamically.

### 2. Router Integration
- In `frontend/src/App.jsx`:
  - Route `/services` maps to `ServicesDirectoryPage.jsx`
  - Route `/services/:category/:slug` maps to `ServiceDetailPage.jsx`
- Add dynamic routes registration and verify using the verification script.

### 3. Component Re-use
- `/services` will present 10 glass-cards mapping the 10 top-level categories.
- `/services/:category/:slug` will feature a sidebar navigation showing other sub-pages in the same category (like `DeepDivesPage.jsx`), with a central article layout matching `MeeSevaPage.jsx`.

### 4. Verification Script (`verify_engine.js`)
- Runs in Node.js in the `frontend` directory.
- Reads `src/App.jsx` to assert `/services` and `/services/:category/:slug` are registered.
- Mocks or runs the parser code under Node.js (or parses directory structure) to confirm 10 categories are found.
- Scans source code of new pages to verify CSS class name existence (e.g. `glass-card`).
