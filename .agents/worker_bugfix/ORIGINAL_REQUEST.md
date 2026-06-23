## 2026-06-23T17:17:49Z
You are the Worker agent. Your working directory is C:\tt-ai-stack\01_projects\telangana-live\.agents\worker_bugfix.

Your task is to fix correctness issues, update sitemap generation, and run final verifications. Please modify the following files:

1. **Modify `frontend/src/pages/ServiceDetailPage.jsx`**:
   - In the `ReactMarkdown` rendering overrides, fix the ordered list rendering timeline bug. Instead of using `node?.parent?.tagName === 'ol'` (which is always undefined because AST nodes lack parent pointers), destructure `ordered` directly from the `li` override component properties:
     ```javascript
     li: ({node, children, ordered, index, ...props}) => {
       if (ordered) {
         return (
           <li className="relative mb-4 last:mb-0" {...props}>
             <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-dark-bg border-telangana-green flex items-center justify-center">
               <div className="w-1.5 h-1.5 rounded-full bg-telangana-green" />
             </div>
             <div className="text-sm text-text-secondary leading-relaxed pl-2">
               {children}
             </div>
           </li>
         );
       }
       return (
         <li className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed mb-2" {...props}>
           <span className="text-telangana-green font-bold select-none">✓</span>
           <span>{children}</span>
         </li>
       );
     }
     ```
   - Guard against page crashes on anchor tags without href attributes. In the `a` renderer override, default the `href` parameter to `#` to prevent `href.startsWith` calling on undefined:
     ```javascript
     a: ({node, children, href = '#', ...props}) => { ... }
     ```
   - Add `aria-current={isActive ? 'page' : undefined}` on sidebar active links (around line 114).

2. **Modify `frontend/src/utils/markdownParser.js`**:
   - Fix the sorting weights comparison bug for categories/folders starting with index `0-`. Ensure that when `parseInt()` returns `0`, it is not treated as falsy and overridden with weight `999`. Use explicit checking:
     ```javascript
     const categories = Object.values(categoriesMap).sort((a, b) => {
       const parsedA = parseInt(a.original.split('-')[0], 10);
       const numA = isNaN(parsedA) ? 999 : parsedA;
       const parsedB = parseInt(b.original.split('-')[0], 10);
       const numB = isNaN(parsedB) ? 999 : parsedB;
       return numA - numB;
     });
     ```

3. **Modify `frontend/scripts/generate-sitemap.cjs`**:
   - Add `{ url: '/services', changefreq: 'weekly', priority: 0.8 }` to the `staticRoutes` array.
   - Inside `generateSitemap()`, scan `src/content/docs` subdirectories and markdown files using `fs.readdirSync`, clean category numeric prefixes, and dynamically append each guide page URL (in the format `/services/categorySlug/fileSlug`) to the XML sitemap.

4. **Verify & Build**:
   - Run the sitemap generator script to update the sitemap file:
     `node scripts/generate-sitemap.cjs` in directory `C:\tt-ai-stack\01_projects\telangana-live\frontend`
   - Run the Node.js verification script:
     `node verify_engine.js` in directory `C:\tt-ai-stack\01_projects\telangana-live\frontend`
   - Run local build to confirm clean bundler compilation:
     `npm run build` in directory `C:\tt-ai-stack\01_projects\telangana-live\frontend`
   - Refresh the Graphify code graph:
     `python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` in directory `C:\tt-ai-stack\01_projects\telangana-live`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your handoff report to C:\tt-ai-stack\01_projects\telangana-live\.agents\worker_bugfix\handoff.md containing the outputs of the commands.
