// Load all markdown files raw client-side
const modules = import.meta.glob('/src/content/docs/**/*.md', { query: '?raw', import: 'default', eager: true });

// Map category slugs to clean titles
const categoryTitleMap = {
  'documents-certificates': 'Documents & Certificates',
  'bills-taxes': 'Bills & Taxes',
  'land-property': 'Land & Property',
  'ration-food-pensions': 'Ration, Food & Pensions',
  'jobs-education-scholarships': 'Jobs, Education & Scholarships',
  'complaints-grievances': 'Complaints & Grievances',
  'police-safety': 'Police & Safety',
  'rti-courts-legal': 'RTI, Courts & Legal Help',
  'health-social-welfare': 'Health & Social Welfare',
  'elections-voting': 'Elections & Voting'
};

const guides = [];
const categoriesMap = {};

// Parse each module
for (const path in modules) {
  const content = modules[path];
  
  // Extract category and file info from path
  const match = path.match(/content\/docs\/([^\/]+)\/([^\/]+)\.md$/);
  if (!match) continue;

  const categoryOriginal = match[1]; // e.g. "1-documents-certificates"
  const fileOriginal = match[2];     // e.g. "birth-certificate"

  // Clean numeric prefixes
  const categorySlug = categoryOriginal.replace(/^\d+-/, '');
  const fileSlug = fileOriginal;

  // Extract H1 title from content (lines starting with "# ")
  let title = fileSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Get clean category title
  const categoryTitle = categoryTitleMap[categorySlug] || categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const guide = {
    title,
    content,
    categoryOriginal,
    fileOriginal,
    categorySlug,
    fileSlug,
    categoryTitle,
    path
  };

  guides.push(guide);

  // Group by category
  if (!categoriesMap[categorySlug]) {
    categoriesMap[categorySlug] = {
      slug: categorySlug,
      original: categoryOriginal,
      title: categoryTitle,
      guides: []
    };
  }
  categoriesMap[categorySlug].guides.push(guide);
}

const categories = Object.values(categoriesMap).sort((a, b) => {
  const parsedA = parseInt(a.original.split('-')[0], 10);
  const numA = isNaN(parsedA) ? 999 : parsedA;
  const parsedB = parseInt(b.original.split('-')[0], 10);
  const numB = isNaN(parsedB) ? 999 : parsedB;
  return numA - numB;
});

// Sort guides within each category alphabetically by title
categories.forEach(cat => {
  cat.guides.sort((a, b) => a.title.localeCompare(b.title));
});

export function getAllGuides() {
  return guides;
}

export function getCategories() {
  return categories;
}

export function getGuideBySlug(categorySlug, fileSlug) {
  return guides.find(g => g.categorySlug === categorySlug && g.fileSlug === fileSlug) || null;
}

export function getGuideByPrefixedSlug(categoryOriginal, fileOriginal) {
  return guides.find(g => g.categoryOriginal === categoryOriginal && g.fileOriginal === fileOriginal) || null;
}
