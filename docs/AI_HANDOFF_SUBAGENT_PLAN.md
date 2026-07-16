# Telangana.live Handoff Plan

Purpose: give the next AI agent a clean, executable map of what is already done, what remains, and how to split the remaining work across sub-agents if needed.

## Current State

- `/government` exists and is wired into the app shell.
- Government directory content is in `frontend/src/data/governmentDirectoryData.js`.
- District cards in the government page now deep-link to the existing district pages (`/:region`) instead of the external district web directory.
- The global meta description in `frontend/index.html` was shortened.
- Build-time validation now checks that `/dashboard` is prerendered.
- `npm run build` and `npm run lint` pass in `frontend/`.

## Important File Map

- `frontend/src/App.jsx` - route registration.
- `frontend/src/pages/GovernmentDirectoryPage.jsx` - government directory page UI.
- `frontend/src/pages/HomePage.jsx` - dashboard page with canonical `/dashboard` metadata.
- `frontend/src/pages/SubRegionPage.jsx` - existing district page implementation for `/:region`.
- `frontend/src/data/districts.json` - canonical district slugs used by the district pages.
- `frontend/scripts/prerender.cjs` - prerenders `/dashboard` and other public routes.
- `frontend/scripts/validate-prerender.cjs` - new guard that fails build if `/dashboard` is missing.
- `frontend/index.html` - global shell metadata used by crawlers that do not execute JS.
- `frontend/package.json` - build script wiring.
- `frontend/vercel.json` - SPA rewrites and host redirects.

## Why the SEO Checker Still Reported 404

The route itself is present, but the live host must serve the prerendered `dashboard/index.html` or rewrite `/dashboard` to `index.html`. If the deployed environment is stale, mispointed, or not using `frontend/` as the build root, the crawler sees a 404 before it can audit the page.

## Sub-Agent Plan

If the next AI tool needs to continue work, split it like this:

### Agent 1: Deployment Verifier

Goal: confirm the live deployment is serving the latest `frontend/dist` output.

Tasks:

- Verify the deploy target is the `frontend/` app, not the repo root.
- Confirm the hosting platform is honoring SPA rewrites for `/dashboard`.
- Confirm the live `https://www.telangana.live/dashboard` response is `200`, not `404`.
- If needed, inspect Vercel project settings or the build output path.

### Agent 2: SEO Hardeners

Goal: make the crawler-facing HTML cleaner and easier to audit.

Tasks:

- Keep page-specific descriptions under common audit thresholds.
- Ensure each major route has one clear `H1`.
- Add or refine structured data only where it matches the page content.
- Backfill internal links from strong pages to the new `/government` route.

### Agent 3: Content / Directory Builder

Goal: expand the government directory in the simplest useful order.

Priority order:

1. Telangana department directory cards.
2. District directory index using existing `/:region` pages.
3. Citizen services directory grouped by intent.
4. Helplines directory.
5. Schemes directory.

### Agent 4: Infrastructure / Headers

Goal: address non-page SEO warnings that cannot be fixed in React.

Tasks:

- Add or verify response compression.
- Add or verify a CSP header.
- Verify SPF/DNS setup for the domain if email tooling depends on it.

## Next Steps

1. Re-run the live audit after the next deployment.
2. If `/dashboard` still returns `404`, fix the host rewrite/build-root mapping first.
3. After the route returns `200`, rerun the SEO score checker and only then tune page-level content.

## Verification Commands

From `frontend/`:

```bash
npm run build
npm run lint
```

Optional route sanity check:

```bash
node scripts/validate-prerender.cjs
```

