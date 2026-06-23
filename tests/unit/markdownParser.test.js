import { describe, it, expect } from 'vitest';
import { getAllGuides, getCategories, getGuideBySlug, getGuideByPrefixedSlug } from '../../src/utils/markdownParser.js';

describe('markdownParser', () => {
  it('loads all guides and groups them', () => {
    const guides = getAllGuides();
    expect(guides).toBeInstanceOf(Array);
    expect(guides.length).toBeGreaterThan(0);
    
    // Each guide must have the required fields
    guides.forEach(guide => {
      expect(guide).toHaveProperty('title');
      expect(guide).toHaveProperty('content');
      expect(guide).toHaveProperty('categoryOriginal');
      expect(guide).toHaveProperty('fileOriginal');
      expect(guide).toHaveProperty('categorySlug');
      expect(guide).toHaveProperty('fileSlug');
      expect(guide).toHaveProperty('categoryTitle');
      expect(guide).toHaveProperty('path');
      
      expect(typeof guide.title).toBe('string');
      expect(typeof guide.content).toBe('string');
      expect(typeof guide.categorySlug).toBe('string');
      expect(typeof guide.fileSlug).toBe('string');
    });
  });

  it('groups guides into categories and sorts them', () => {
    const categories = getCategories();
    expect(categories).toBeInstanceOf(Array);
    expect(categories.length).toBeGreaterThan(0);

    // Verify sort order by category original prefix (1, 2, ..., 10)
    let lastNum = -1;
    categories.forEach(cat => {
      expect(cat).toHaveProperty('slug');
      expect(cat).toHaveProperty('original');
      expect(cat).toHaveProperty('title');
      expect(cat).toHaveProperty('guides');
      expect(cat.guides).toBeInstanceOf(Array);
      expect(cat.guides.length).toBeGreaterThan(0);

      const currentNum = parseInt(cat.original.split('-')[0], 10);
      expect(currentNum).toBeGreaterThanOrEqual(lastNum);
      lastNum = currentNum;

      // Verify guides in each category are sorted alphabetically by title
      let lastTitle = '';
      cat.guides.forEach(guide => {
        expect(guide.title.localeCompare(lastTitle)).toBeGreaterThanOrEqual(0);
        lastTitle = guide.title;
      });
    });
  });

  it('retrieves guides by slug correctly', () => {
    const categories = getCategories();
    const firstCat = categories[0];
    const firstGuide = firstCat.guides[0];

    const found = getGuideBySlug(firstCat.slug, firstGuide.fileSlug);
    expect(found).not.toBeNull();
    expect(found.title).toBe(firstGuide.title);

    // Non-existent guide
    const notFound = getGuideBySlug('non-existent-category', 'non-existent-file');
    expect(notFound).toBeNull();
  });

  it('retrieves guides by prefixed slug correctly', () => {
    const categories = getCategories();
    const firstCat = categories[0];
    const firstGuide = firstCat.guides[0];

    const found = getGuideByPrefixedSlug(firstCat.original, firstGuide.fileOriginal);
    expect(found).not.toBeNull();
    expect(found.title).toBe(firstGuide.title);

    // Non-existent prefixed guide
    const notFound = getGuideByPrefixedSlug('1-documents-certificates', 'non-existent-file');
    expect(notFound).toBeNull();
  });

  // Verify search logic behavior (reproducing ServicesDirectoryPage.jsx filter)
  it('filters guides and categories by query correctly', () => {
    const allCategories = getCategories();
    
    // Case 1: Empty or whitespace query
    const runSearch = (searchQuery) => {
      if (!searchQuery.trim()) return allCategories;
      const query = searchQuery.toLowerCase();
      
      return allCategories.map(cat => {
        const matchedGuides = cat.guides.filter(guide => 
          guide.title.toLowerCase().includes(query) ||
          guide.content.toLowerCase().includes(query)
        );
        const categoryMatches = cat.title.toLowerCase().includes(query);
        const finalGuides = categoryMatches ? cat.guides : matchedGuides;
        if (categoryMatches || finalGuides.length > 0) {
          return {
            ...cat,
            guides: finalGuides
          };
        }
        return null;
      }).filter(Boolean);
    };

    // Test empty search
    expect(runSearch('')).toEqual(allCategories);
    expect(runSearch('   ')).toEqual(allCategories);

    // Test specific match (e.g., "birth")
    const searchBirth = runSearch('birth');
    expect(searchBirth.length).toBeGreaterThan(0);
    // The documents category should be included and only guides matching "birth"
    const docsCat = searchBirth.find(c => c.slug === 'documents-certificates');
    expect(docsCat).toBeDefined();
    // It should only have the birth-certificate guide (or matching guides)
    docsCat.guides.forEach(g => {
      expect(
        g.title.toLowerCase().includes('birth') || 
        g.content.toLowerCase().includes('birth')
      ).toBe(true);
    });

    // Test category matching (e.g., "documents")
    const searchDocs = runSearch('documents');
    const docsCatFull = searchDocs.find(c => c.slug === 'documents-certificates');
    expect(docsCatFull).toBeDefined();
    // Since category matched, it must contain ALL its guides
    const originalDocsCat = allCategories.find(c => c.slug === 'documents-certificates');
    expect(docsCatFull.guides.length).toBe(originalDocsCat.guides.length);
  });
});
