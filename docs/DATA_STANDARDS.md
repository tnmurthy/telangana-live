# Civic Portal Data Standards

_Shared by **telangana-live** and **vizag-live**. This file is kept identical in both repos (`docs/DATA_STANDARDS.md`); change both in the same sitting. Last revised 2026-10-02._

A civic portal is only worth visiting, and only worth monetising, if what it shows is true. Every rule below exists because one of the two portals broke it.

## 1. Never invent a value

A value shown to users must come from a source that was actually fetched.

- **No generated data**: nothing derived from a hash, `random`, a base value plus a "simulated fluctuation", or a hard-coded list presented as live.
- **No source-less AI**: a model may judge, classify or summarise text we retrieved. It may not be asked to produce facts ("summarize current civic alerts") with nothing to read.
- **On failure, return empty.** A scraper that can't reach its source returns an empty result and records why. The page then says the data is unavailable.

_Broke it:_ telangana's alert generator invented outages ("Power restoration in progress for Jubilee Hills Road No. 36"), and its ticker shipped six static "live" alerts. vizag's beach flags, blood stock, AQI and daily prices come from MD5 hashes. vizag's mandi, power, tender, rainfall and schools scrapers follow this rule and are the model to copy.

## 2. Every value carries its source and time

Each record stores **where it came from** (`source`, `sourceLink` where one exists) and **when** (`publishedAt` from the source, `fetchedAt` from us). The UI shows both, for example "₹7,250 · Source: <name> · as of 1 Oct, 3:00 PM IST".

## 3. Freshness is enforced in code

- Each dataset has a **maximum age**, set by the Product Owner. Data older than that is either dropped or shown with a visible **stale** badge, never as current.
- Age is measured from the **source's publication time**, not from when we ingested it.
- Store **absolute** timestamps. Compute relative phrases ("2 hours ago") at render time. A stored "15 mins ago" stays wrong forever.

_Broke it:_ Google News search returned 2024 articles that read as current; expiry was keyed on ingestion time; hard-coded "15 mins ago" strings stayed live for weeks.

## 4. Safety, health and money data have a higher bar

Beach and weather safety, hospitals and blood stock, emergency alerts, and prices need a **named authoritative source**. Without one, the feature is **hidden**, not approximated. A wrong "Green" flag is worse than no flag.

## 5. AI judgments are typed, calibrated and labelled

- Ask narrow questions over retrieved text and get typed answers (choice, yes/no probability, score). Don't parse free text.
- Set thresholds from a labelled calibration set and record the numbers and the date next to the constants.
- When the AI path is unavailable, a fallback is allowed, but every output records which path produced it (`source="typesafe"` or `source="regex"`).

## 6. "Deployed" means verified live

A change is shipped only when **all** of these are true:

1. The newest **production** deployment's commit is the one you expect. Check the ref and SHA, not just that "a build ran".
2. The **custom domain** returns 200 on the routes you changed.
3. You checked from outside any browser cache or service worker (private window, or `curl`).

_Broke it:_ telangana served a July branch for months while every build "succeeded". vizag's builds have failed since August while the domain wasn't attached at all.

## 7. Pipelines tell the truth

- CI must be green before merging to `main`. A red pipeline that everyone ignores is the same as having no pipeline.
- Data-sync jobs trigger a rebuild **only when they committed something**.
- Required secrets are listed in the README. A missing secret produces a **loud warning**, never a silent fallback.
- Don't write the literal skip marker (`[skip ci]`) in prose in commit messages. GitHub and Vercel match it anywhere in the message.

## 8. Documentation stays current

Each README has a **System Context Map** and a **Remediation Backlog**, dated, in the same format. A fix isn't done until its backlog row is updated.

## Definition of Done: data feature

- [ ] Values come from a fetched source (rule 1). Failure returns empty, not fake
- [ ] `source` and `publishedAt`/`fetchedAt` stored and displayed (rule 2)
- [ ] Max age set by PO; stale state handled in code and UI (rule 3)
- [ ] Safety/health/money: named authoritative source, or feature hidden (rule 4)
- [ ] Any AI step is typed, calibrated and labels its path (rule 5)
- [ ] Tests cover the success, empty-source and stale cases
- [ ] Verified live on the custom domain (rule 6)
- [ ] README context map and backlog updated (rule 8)
