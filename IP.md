# Intellectual property

## Ownership
The code, page content, design and data pipelines in this repository were
written by or for Narayanamurthy T, who holds the copyright (see LICENSE).
Commits by "tnmurthy", "tnmurthy8181" and "Narayanamurthy T" are the owner's
accounts; "GitHub Action" and "Data Engine Bot" are the site's own scheduled
data jobs. Parts were written with AI coding assistants under the owner's
direction; no third-party code was copied into the repository.

## Third-party packages (frontend production dependencies, 2026-10-09)
| Licence | Packages |
|---|---|
| MIT | 123 |
| ISC | 3 |
| BSD-2-Clause | 2 |
| Hippocratic-2.1 | 2 (react-leaflet, @react-leaflet/core) |
| Apache-2.0 | 1 |
| 0BSD | 1 |

Hippocratic-2.1 permits use subject to human-rights conditions; a civic
information site meets them. Regenerate this table with
`npx license-checker --production --summary` in `frontend/`.

## Content and data we do not own
Listed with each dataset on the public page https://www.telangana.live/sources
and in `frontend/src/data/dataSources.js`. In short:
- News headlines and feed descriptions belong to their publishers; the site
  links to every story and shows no publisher photos.
- Weather and air-quality data from Open-Meteo is CC BY 4.0 (attributed on
  /sources).
- Fuel prices are read from a published retail-rate page (Goodreturns).
  These are facts, but the page's terms may restrict automated reading; a
  licensed feed would remove that dependency. Gold and silver rates were
  dropped for this reason on 2026-10-09 (TL-46).
