# Context — 2026-06-23T15:22:56+05:30

## Active Workspaces
- Project root: `C:\tt-ai-stack\01_projects\telangana-live`
- Frontend root: `C:\tt-ai-stack\01_projects\telangana-live\frontend`
- Backend root: `C:\tt-ai-stack\01_projects\telangana-live\backend`

## Key Environment Config
- Vite version: ^8.0.1
- React version: ^19.2.4
- UI Framework: Tailwind CSS + glassmorphism/glass-card themes
- Available libraries: `react-router-dom` (v7), `react-markdown`, `rehype-raw`

## Integration Requirements
- R1: Markdown Parsing Engine mapping 10 categories dynamically
- R2: Index page `/services` and dynamic route `/services/:category/:slug` reusing `MeeSevaPage` aesthetic
- R3: Register routes in `App.jsx` and add nav links to `Header`/`BottomNav`
- R4: Verification script `verify_engine.js` in `frontend` root verifying routing, 10 categories mapping, and CSS classes
