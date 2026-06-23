## 2026-06-23T13:31:46Z

**Context**: We need to write the complete Markdown content and information architecture for the independent Telangana civic helper site at telangana.live, located in C:/tt-ai-stack/01_projects/telangana-live/frontend/src/content/docs.

**Objective**:
1. Create `PROJECT.md` at the root of the project `C:/tt-ai-stack/01_projects/telangana-live/` describing the content layout and milestones.
2. Write a Python script `verify_structure.py` at the root of the project `C:/tt-ai-stack/01_projects/telangana-live/` that parses the generated markdown files under `C:/tt-ai-stack/01_projects/telangana-live/frontend/src/content/docs` and asserts that:
   - There are exactly 10 top-level categories.
   - Every category contains between 3 and 7 sub-pages.
   - Every sub-page contains the exact required headings: `#`, `## Who should use this`, `## Steps in short`, and `## Important links`.
   - Every sub-page contains the non-official portal disclaimer.
   - The script exits with code 0 if all checks pass, and code 1 if any check fails.
3. Design and generate the complete Markdown content under `C:/tt-ai-stack/01_projects/telangana-live/frontend/src/content/docs`. Use 10 top-level directories named:
   - `1-documents-certificates`
   - `2-bills-taxes`
   - `3-land-property`
   - `4-ration-food-pensions`
   - `5-jobs-education-scholarships`
   - `6-complaints-grievances`
   - `7-police-safety`
   - `8-rti-courts-legal`
   - `9-health-social-welfare`
   - `10-elections-voting`
4. For each directory, create 3 to 7 sub-pages. You can read, adapt, and copy content from the existing draft markdown files located in the root `C:/tt-ai-stack/01_projects/telangana-live/content/` directory (which contains similar draft categories/files like `bills/`, `certificates/`, `complaints/`, `elections/`, `health/`, `jobs-education/`, `land/`, `legal/`, `police/`, `ration/`), but make sure you adapt them to strictly follow the required sub-page structure, tone, and disclaimer.
5. The sub-page template must be:
   - `#` Page title (clear, citizen-friendly)
   - 1-2 sentence intro explaining what the service is and why people use it
   - `## Who should use this` (2-4 bullets)
   - `## Steps in short` (4-7 generic steps that fit Telangana online workflows)
   - `## Important links` (2-5 descriptive items with `#` as placeholder URLs)
   - Disclaimer: "This website is not an official government portal. Telangana.live is an independent helper site that explains and links to official services. All actual transactions and applications must be done on the official government websites." (Or similar wording).
6. Run `verify_structure.py` and make sure it passes (exits with code 0).
7. Create a handoff report `handoff.md` in your working directory `.agents/worker_content_generation/` summarizing what you did, the verified structure, and the results of running `verify_structure.py`.
