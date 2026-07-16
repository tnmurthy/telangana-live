# Telangana.live Operating Note

Use this as the short handoff when another AI agent takes over.

## Objective

Grow the Telangana government section using the simplest India.gov-style surfaces first, while keeping the site deployable and crawlable.

## What Exists

- `/government` route is live in the app.
- Government links are in `frontend/src/data/governmentDirectoryData.js`.
- District cards now deep-link to the existing district pages (`/:region`).
- Build-time validation now checks that `/dashboard` is prerendered.

## Immediate Priority

1. Add a dedicated Telangana department directory section on `/government`.
2. Keep district cards linked to existing internal district pages.
3. Preserve the prerender/build validation.

## Relevant Files

- `frontend/src/pages/GovernmentDirectoryPage.jsx`
- `frontend/src/data/governmentDirectoryData.js`
- `frontend/src/pages/SubRegionPage.jsx`
- `frontend/src/data/districts.json`
- `frontend/scripts/prerender.cjs`
- `frontend/scripts/validate-prerender.cjs`
- `frontend/package.json`

## Guardrails

- Keep civic data in `frontend/src/data/`.
- Do not remove the prerender validation for `/dashboard`.
- Prefer internal links for district navigation.
- Run `npm run build` and `npm run lint` in `frontend/` after changes.

