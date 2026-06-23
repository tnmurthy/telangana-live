# Original User Request

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
