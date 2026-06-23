# Plan — Content Generation and Verification for telangana.live

## Objectives
1. Create content categories and sub-pages in `C:/tt-ai-stack/01_projects/telangana-live/frontend/src/content/docs`.
2. Follow requirements: 10 categories, 3-7 sub-pages per category, specific headings, disclaimer, simple tone.
3. Write `verify_structure.py`.
4. Iterate and pass the verification script.

## Steps
### Step 1: Initialize Global Project State
- Create `PROJECT.md` at root.
- Define architecture, categories, and sub-pages mapping.
- Update `BRIEFING.md` and `progress.md`.

### Step 2: Establish Test Runner and Verification Script
- Before generating all files, write `verify_structure.py` in the workspace root.
- This will act as our E2E quality gate.

### Step 3: Content Generation (Dual Track / Iterative)
- We will delegate content generation tasks to workers.
- Since we have 10 categories, we can spawn a worker (e.g., `civic_editor` using `teamwork_preview_worker`) to generate markdown files category by category, or a few categories at a time.
- The categories:
  1. documents-certificates
  2. bills-taxes
  3. land-property
  4. ration-food-pensions
  5. jobs-education-scholarships
  6. complaints-grievances
  7. police-safety
  8. rti-courts-legal
  9. health-social-welfare
  10. elections-voting

### Step 4: Verification and Audit
- Run `verify_structure.py` on the generated content.
- Fix any formatting, header, or disclaimer issues.
- Report completion.
