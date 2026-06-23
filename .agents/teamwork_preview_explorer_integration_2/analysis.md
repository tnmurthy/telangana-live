# Design Analysis: Markdown Guides Parser & Verification Engine

This analysis documents the design and architecture for a client-side dynamic markdown guide parser utility (`markdownParser.js`) and a corresponding Node.js directory scan validation utility (`verify_engine.js`) to support the 46 civic guides under `frontend/src/content/docs`.

---

## 1. Directory Structure Analysis

The target directory `frontend/src/content/docs` contains exactly **10 categories** and **46 markdown guide files**. 

### Top-Level Category Directory Mapping
Each subdirectory is named with a numeric index prefix and a slug representing the category. There are no standalone files in the root of the `docs` directory:
1. `1-documents-certificates` (7 files)
2. `2-bills-taxes` (5 files)
3. `3-land-property` (5 files)
4. `4-ration-food-pensions` (5 files)
5. `5-jobs-education-scholarships` (4 files)
6. `6-complaints-grievances` (4 files)
7. `7-police-safety` (4 files)
8. `8-rti-courts-legal` (4 files)
9. `9-health-social-welfare` (4 files)
10. `10-elections-voting` (4 files)

*Total Guides: 7 + 5 + 5 + 5 + 4 + 4 + 4 + 4 + 4 + 4 = 46 guides.*

### Markdown File Content Schema
Each markdown file adheres to a strict outline structure:
- **H1 Header** (`# <Guide Title>`): The first non-whitespace line, representing the title for menus/navigation.
- **Intro Paragraph**: Clarifying context.
- **H2 Sections**:
  - `## Who should use this`
  - `## Steps in short`
  - `## Important links`
- **Disclaimer Banner**: A standardized footer explaining that the website is not an official government portal.

---

## 2. Client-Side Parser Design (`markdownParser.js`)

To keep the application fast, SEO-friendly, and maintainable, Vite's `import.meta.glob` is utilized. This prevents hardcoding the list of 46 guides and allows new guides to be automatically loaded upon creation.

### Dynamic Loading Mechanism
We use Vite's `{ query: '?raw', import: 'default', eager: true }` glob configurations:
- `query: '?raw'`: Injects the markdown file as a raw text string, which bypasses compilation as a module and exposes the text content directly to the custom parser.
- `import: 'default'`: Ensures we import the default export from the raw module (which is the raw content string).
- `eager: true`: Loads all files synchronously during application bootstrap, enabling instant layout compilation and menu generation without loading delays.

### Core Parsing Logic
- **Prefix Removal**: Extract order index and clean slug using regex `/^(\d+)-(.*)$/`.
- **H1 Extraction**: Find the first `# ` header using the regex `/^#\s+(.+)$/m`.
- **Category Labels**: Map category slugs to polished human-readable labels using a predefined registry.

### Designed Code: `frontend/src/utils/markdownParser.js`

```javascript
/**
 * Clean human-readable labels for category names.
 */
export const categoryLabels = {
  'documents-certificates': 'Documents & Certificates',
  'bills-taxes': 'Bills & Taxes',
  'land-property': 'Land & Property',
  'ration-food-pensions': 'Ration, Food & Pensions',
  'jobs-education-scholarships': 'Jobs, Education & Scholarships',
  'complaints-grievances': 'Complaints & Grievances',
  'police-safety': 'Police & Safety',
  'rti-courts-legal': 'RTI, Courts & Legal',
  'health-social-welfare': 'Health & Social Welfare',
  'elections-voting': 'Elections & Voting'
};

/**
 * Splits numeric prefix from category folders and file names.
 * Example: "10-elections-voting" -> { order: 10, cleanName: "elections-voting" }
 */
const stripNumericPrefix = (name) => {
  const match = name.match(/^(\d+)-(.*)$/);
  return match 
    ? { order: parseInt(match[1], 10), cleanName: match[2] } 
    : { order: null, cleanName: name };
};

/**
 * Extracts the first H1 header found in the markdown text.
 */
const extractH1Title = (markdownText) => {
  const match = markdownText.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
};

// Dynamically import all guide markdown files eagerly as raw text strings
const rawModules = import.meta.glob('/src/content/docs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

let cachedGuides = null;
let cachedCategories = null;
let cachedSlugMap = null;

/**
 * Processes raw modules and caches structural datasets.
 */
const processModules = () => {
  if (cachedGuides) return;

  const guides = [];
  const categoryMap = {};

  for (const [path, rawContent] of Object.entries(rawModules)) {
    // Expected path: "/src/content/docs/1-documents-certificates/birth-certificate.md"
    const parts = path.split('/');
    if (parts.length < 3) continue;

    const fileName = parts[parts.length - 1];
    const categoryFolder = parts[parts.length - 2];
    const fileBasename = fileName.replace(/\.md$/, '');

    // Extract categories metadata
    const { order: catOrder, cleanName: catSlug } = stripNumericPrefix(categoryFolder);
    const { cleanName: fileSlug } = stripNumericPrefix(fileBasename);

    const title = extractH1Title(rawContent) || fileSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const label = categoryLabels[catSlug] || catSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const guideObj = {
      id: `${catSlug}/${fileSlug}`,                  // clean URL id: "documents-certificates/birth-certificate"
      originalPath: path,                            // original filepath for reference
      categoryOriginal: categoryFolder,              // "1-documents-certificates"
      categorySlug: catSlug,                         // "documents-certificates"
      categoryLabel: label,                          // "Documents & Certificates"
      categoryOrder: catOrder || 999,
      fileOriginal: fileBasename,                    // "birth-certificate"
      fileSlug: fileSlug,                            // "birth-certificate"
      title: title,                                  // parsed H1
      content: rawContent                            // raw markdown
    };

    guides.push(guideObj);

    // Grouping
    if (!categoryMap[catSlug]) {
      categoryMap[catSlug] = {
        slug: catSlug,
        label: label,
        order: catOrder || 999,
        guides: []
      };
    }
    categoryMap[catSlug].guides.push({
      id: guideObj.id,
      slug: fileSlug,
      title: title
    });
  }

  // Sort categories by index
  const sortedCategories = Object.values(categoryMap).sort((a, b) => a.order - b.order);

  // Create fast-lookup indexes
  const slugLookup = {};
  guides.forEach(g => {
    slugLookup[g.id] = g;
    // Map with prefix too to handle legacy routes
    const prefixedId = `${g.categoryOriginal}/${g.fileOriginal}`;
    slugLookup[prefixedId] = g;
  });

  cachedGuides = guides;
  cachedCategories = sortedCategories;
  cachedSlugMap = slugLookup;
};

// Public APIs
export const getAllGuides = () => {
  processModules();
  return cachedGuides;
};

export const getCategories = () => {
  processModules();
  return cachedCategories;
};

export const getGuideBySlug = (categorySlug, fileSlug) => {
  processModules();
  return cachedSlugMap[`${categorySlug}/${fileSlug}`] || null;
};

export const getGuideByPrefixedSlug = (categoryOriginal, fileOriginal) => {
  processModules();
  return cachedSlugMap[`${categoryOriginal}/${fileOriginal}`] || null;
};
```

---

## 3. Node.js Verification Engine Design (`verify_engine.js`)

To guarantee strict compliance with the folder structure (exactly 10 categories), we design a lightweight Node.js verification script that runs prior to builds or inside testing suites.

### Verification Engine Blueprint: `verify_engine.js`

```javascript
const fs = require('fs');
const path = require('path');

// Resolve the target directory relative to the repository root
const projectRoot = process.cwd();
const docsPath = path.resolve(projectRoot, 'frontend', 'src', 'content', 'docs');

console.log(`[Verify Engine] Checking path: ${docsPath}`);

try {
  if (!fs.existsSync(docsPath)) {
    console.error(`❌ Error: Directory not found at: ${docsPath}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(docsPath, { withFileTypes: true });
  const categoryDirs = entries.filter(entry => entry.isDirectory());
  const categoryNames = categoryDirs.map(d => d.name);

  // 1. Assert exactly 10 directories
  const expectedCount = 10;
  if (categoryDirs.length !== expectedCount) {
    console.error(`❌ Error: Expected exactly ${expectedCount} directories under src/content/docs, but found ${categoryDirs.length}.`);
    console.error(`   Found directories:`, categoryNames);
    process.exit(1);
  }
  console.log(`✅ Success: Found exactly ${expectedCount} category directories.`);

  // 2. Validate prefix formatting (should be integer 1 through 10)
  const actualPrefixes = categoryNames
    .map(name => {
      const match = name.match(/^(\d+)-/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter(val => val !== null)
    .sort((a, b) => a - b);

  const expectedPrefixes = Array.from({ length: 10 }, (_, i) => i + 1);
  const prefixesValid = expectedPrefixes.every((prefix, i) => actualPrefixes[i] === prefix);

  if (!prefixesValid) {
    console.error(`❌ Error: Directory prefixes do not form a sequential series from 1 to 10.`);
    console.error(`   Found prefixes:`, actualPrefixes);
    process.exit(1);
  }
  console.log(`✅ Success: All directories are correctly and sequentially prefixed from 1 to 10.`);

  // Log summary
  console.log(`🎉 [Verify Engine] Directories structured correctly.`);
  process.exit(0);
} catch (err) {
  console.error(`❌ Fatal Error during structure scan:`, err.message);
  process.exit(1);
}
```

---

## 4. Integration Blueprint

### Sidebar Navigation Generation
The parsed category list (`getCategories()`) can be fed directly to a frontend `<Sidebar>` component:
```jsx
import { getCategories } from '../utils/markdownParser';

export function Sidebar() {
  const categories = getCategories();
  return (
    <nav className="w-64 border-r p-4">
      {categories.map(category => (
        <div key={category.slug} className="mb-4">
          <h3 className="font-semibold text-gray-700">{category.label}</h3>
          <ul className="pl-3 mt-1 space-y-1">
            {category.guides.map(guide => (
              <li key={guide.id}>
                <a href={`/guides/${guide.id}`} className="text-sm text-blue-600 hover:underline">
                  {guide.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
```

### Route Handling
In a React Router or custom Vite router setup, the path parameters (`:category` and `:slug`) retrieve the content dynamically:
```jsx
import { useParams } from 'react-router-dom';
import { getGuideBySlug } from '../utils/markdownParser';

export function GuideDetailPage() {
  const { category, slug } = useParams();
  const guide = getGuideBySlug(category, slug);

  if (!guide) {
    return <NotFoundPage />;
  }

  return (
    <article className="prose max-w-4xl mx-auto p-6">
      {/* Since we have the raw markdown string, we can render it with a standard renderer */}
      <MarkdownRenderer content={guide.content} />
    </article>
  );
}
```
