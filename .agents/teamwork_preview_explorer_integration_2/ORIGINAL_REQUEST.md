## 2026-06-23T09:54:56Z

You are an Explorer agent. Your working directory is C:\tt-ai-stack\01_projects\telangana-live\.agents\teamwork_preview_explorer_integration_2.
Your task is to examine the markdown files structure in frontend/src/content/docs. Design a client-side parser utility (`markdownParser.js` or similar) using Vite's `import.meta.glob('/src/content/docs/**/*.md', { query: '?raw', import: 'default', eager: true })` to load the 46 markdown guides dynamically.
The utility must parse:
- Category directory mapping (10 top-level category names and labels).
- File slugs mapping (removing the numeric prefixes from folders and files, or maintaining them for URL mapping).
- Markdown H1 titles (for displaying in menus/navigation).
Design a corresponding Node.js directory scan for `verify_engine.js` that counts and confirms exactly 10 categories under `src/content/docs`.
Write your design analysis to C:\tt-ai-stack\01_projects\telangana-live\.agents\teamwork_preview_explorer_integration_2\analysis.md and notify me. Do not write any code or make changes.
