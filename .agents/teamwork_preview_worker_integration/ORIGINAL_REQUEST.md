## 2026-06-23T11:00:43Z
You are the Worker agent. Your working directory is C:\tt-ai-stack\01_projects\telangana-live\.agents\teamwork_preview_worker_integration.

Your task is to implement the frontend engine and UI to parse, serve, and display the 46 civic markdown guides on the telangana.live platform. Follow these step-by-step instructions:

1. **Verify Existing Files**:
   - The guides are located in `frontend/src/content/docs` under 10 category subdirectories sequentially numbered from 1-10.
   - Read the existing `frontend/src/pages/MeeSevaPage.jsx` and `frontend/src/components/ServicesDirectory.jsx` for context and styling cues.

2. **Create Markdown Parser Utility**:
   - Create `frontend/src/utils/markdownParser.js` using Vite's `import.meta.glob('/src/content/docs/**/*.md', { query: '?raw', import: 'default', eager: true })` to load markdown files raw client-side.
   - Parse categories, clean numeric prefixes from slugs (e.g. '1-documents-certificates' -> 'documents-certificates'), extract H1 titles from the markdown text to serve as guide titles, and cache/expose:
     - `getAllGuides()`
     - `getCategories()`
     - `getGuideBySlug(categorySlug, fileSlug)`
     - `getGuideByPrefixedSlug(categoryOriginal, fileOriginal)`
   - Map category slugs to clean titles:
     - `documents-certificates` -> Documents & Certificates
     - `bills-taxes` -> Bills & Taxes
     - `land-property` -> Land & Property
     - `ration-food-pensions` -> Ration, Food & Pensions
     - `jobs-education-scholarships` -> Jobs, Education & Scholarships
     - `complaints-grievances` -> Complaints & Grievances
     - `police-safety` -> Police & Safety
     - `rti-courts-legal` -> RTI, Courts & Legal Help
     - `health-social-welfare` -> Health & Social Welfare
     - `elections-voting` -> Elections & Voting

3. **Create Services Directory Index Page**:
   - Create `frontend/src/pages/ServicesDirectoryPage.jsx` (route `/services`).
   - Replicate the glass-card style and container styling of `MeeSevaPage.jsx`.
   - Layout: Two-column grid (`grid-cols-1 md:grid-cols-2 gap-6`). Renders the 10 categories, each displaying a card with:
     - The category name, icon (e.g. from Lucide-React), description, and list of its guides.
     - A click link to `/services/:category/:slug` for each guide.
   - Include a search box to filter categories and guides by name or text.

4. **Create Service Detail Rendering Page**:
   - Create `frontend/src/pages/ServiceDetailPage.jsx` (route `/services/:category/:slug`).
   - Layout: Responsive split layout (`grid grid-cols-1 lg:grid-cols-4 gap-8`).
     - Sidebar (1 column, hidden on mobile): shows other guides in the same category to allow easy browsing.
     - Article (3 columns): uses `react-markdown` and `rehype-raw` to parse and render the markdown.
     - Override components in `ReactMarkdown` to render custom lists, timeline steps, blockquotes, and link lists using the premium glass-card, gold/green borders, and custom buttons.
     - Make sure the disclaimer blockquote is styled as a premium warning card.
     - Ensure GIGW 3.0 compliance: contrast ratio >= 4.5:1, keyboard focus rings, semantic landmark tags, and descriptive link anchors.

5. **Modify App Router**:
   - Edit `frontend/src/App.jsx`.
   - Add lazy imports for `ServicesDirectoryPage` and `ServiceDetailPage`.
   - Add routes `/services` and `/services/:category/:slug` inside `<Routes>`.
   - **CRITICAL**: The routes must be placed ABOVE the dynamic region/fallback routes (`/:region` and * ) to prevent shadowing.

6. **Wire Navigation Links**:
   - Edit `frontend/src/components/LeftSidebar.jsx` and add a NavLink for `/services` under "City Services".
   - Edit `frontend/src/components/BottomNav.jsx`. Add a 'Services' item mapped to `/services`, and change the grid classes of the items container from `grid-cols-4` to `grid-cols-5`.

7. **Create Verification Script**:
   - Create `frontend/verify_engine.js` in the `frontend` root.
   - The script must run in Node.js and verify:
     - Imports of `ServicesDirectoryPage` and `ServiceDetailPage` in `App.jsx`.
     - Route registrations in `App.jsx`, ensuring they are registered in the correct order (before `/:region`).
     - Directory scanning of `src/content/docs` using `fs` to assert exactly 10 directories are found.
     - Files `ServicesDirectoryPage.jsx` and `ServiceDetailPage.jsx` exist and contain the `glass-card` string.
     - Exit with code 0 on success, and code 1 on error.

8. **Verify & Build**:
   - Run `node verify_engine.js` inside the `frontend` folder and ensure it returns exit code 0.
   - Run `npm run build` or local tests in the `frontend` directory to ensure no compile or linting errors exist.
   - Run the graph rebuild script: `python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to update the knowledge graph.
