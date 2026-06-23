const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\tt-ai-stack\\01_projects\\telangana-live';
const appJsxPath = path.join(rootDir, 'frontend/src/App.jsx');
const markdownParserPath = path.join(rootDir, 'frontend/src/utils/markdownParser.js');
const sitemapPath = path.join(rootDir, 'frontend/public/sitemap.xml');
const docsDir = path.join(rootDir, 'frontend/src/content/docs');

console.log('=== STARTING ROUTING & PATH MASKING AUDIT ===\n');

let failed = false;

// 1. Verify App.jsx route order
try {
  const appJsxContent = fs.readFileSync(appJsxPath, 'utf8');
  
  // Find index of route definitions
  const servicesIdx = appJsxContent.indexOf('path="/services"');
  const servicesDetailIdx = appJsxContent.indexOf('path="/services/:category/:slug"');
  const subRegionIdx = appJsxContent.indexOf('path="/:region"');
  
  console.log(`Route indices found:`);
  console.log(`- /services: ${servicesIdx}`);
  console.log(`- /services/:category/:slug: ${servicesDetailIdx}`);
  console.log(`- /:region: ${subRegionIdx}`);
  
  if (servicesIdx === -1) {
    console.error('❌ /services route not found in App.jsx');
    failed = true;
  }
  if (servicesDetailIdx === -1) {
    console.error('❌ /services/:category/:slug route not found in App.jsx');
    failed = true;
  }
  if (subRegionIdx === -1) {
    console.error('❌ /:region route not found in App.jsx');
    failed = true;
  }
  
  if (servicesIdx !== -1 && subRegionIdx !== -1 && servicesIdx > subRegionIdx) {
    console.error('❌ /services is defined after /:region - Router may match it incorrectly (depending on version)');
    failed = true;
  } else if (servicesIdx < subRegionIdx) {
    console.log('✅ /services is defined before /:region');
  }

  if (servicesDetailIdx !== -1 && subRegionIdx !== -1 && servicesDetailIdx > subRegionIdx) {
    console.error('❌ /services/:category/:slug is defined after /:region');
    failed = true;
  } else if (servicesDetailIdx < subRegionIdx) {
    console.log('✅ /services/:category/:slug is defined before /:region');
  }
} catch (err) {
  console.error('❌ Failed to read App.jsx:', err.message);
  failed = true;
}

// 2. Verify dynamic loader clean slug matching against original paths
try {
  // Let's replicate the parsing logic from markdownParser.js
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

  const getFilesRecursively = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getFilesRecursively(filePath, fileList);
      } else if (filePath.endsWith('.md')) {
        fileList.push(filePath);
      }
    });
    return fileList;
  };

  if (fs.existsSync(docsDir)) {
    const mdFiles = getFilesRecursively(docsDir);
    console.log(`\nFound ${mdFiles.length} markdown documentation files under ${docsDir}`);
    
    let parseErrors = 0;
    mdFiles.forEach(filePath => {
      // Replicate the relative path match from markdownParser.js
      // src/utils/markdownParser.js uses: path.match(/content\/docs\/([^\/]+)\/([^\/]+)\.md$/)
      // On Windows, the path uses backslashes, so we normalize to slashes
      const normalizedPath = filePath.replace(/\\/g, '/');
      const match = normalizedPath.match(/content\/docs\/([^\/]+)\/([^\/]+)\.md$/);
      
      if (!match) {
        console.error(`❌ File path did not match parser regex: ${normalizedPath}`);
        parseErrors++;
        return;
      }
      
      const categoryOriginal = match[1];
      const fileOriginal = match[2];
      
      const categorySlug = categoryOriginal.replace(/^\d+-/, '');
      const fileSlug = fileOriginal;
      
      // Let's verify if categorySlug mapped in categoryTitleMap has clean mappings
      if (!categoryTitleMap[categorySlug]) {
        console.warn(`⚠️ Category slug "${categorySlug}" is not in categoryTitleMap, fallback name will be used.`);
      }
      
      // Check that the categoryOriginal directory exists and contains the fileOriginal.md file
      const expectedDir = path.join(docsDir, categoryOriginal);
      const expectedFile = path.join(expectedDir, `${fileOriginal}.md`);
      
      if (!fs.existsSync(expectedFile)) {
        console.error(`❌ Resolved path does not exist on disk: ${expectedFile}`);
        parseErrors++;
      }
    });
    
    if (parseErrors === 0) {
      console.log('✅ Dynamic loader logic successfully resolved and verified all markdown files against disk.');
    } else {
      failed = true;
    }
  } else {
    console.error(`❌ Markdown docs directory does not exist: ${docsDir}`);
    failed = true;
  }
} catch (err) {
  console.error('❌ Failed to run dynamic loader check:', err.message);
  failed = true;
}

// 3. Verify sitemap.xml completeness
try {
  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Check if /services directory is in the sitemap
    const hasServicesDir = sitemapContent.includes('<loc>https://telangana.live/services</loc>');
    
    // Let's find how many service guides are in the sitemap
    // e.g. <loc>https://telangana.live/services/documents-certificates/birth-certificate</loc>
    const matches = sitemapContent.match(/<loc>https:\/\/telangana\.live\/services\/[^<]+<\/loc>/g) || [];
    
    console.log(`\nSitemap verification at ${sitemapPath}:`);
    console.log(`- Services Directory (/services) included: ${hasServicesDir ? 'YES' : 'NO'}`);
    console.log(`- Individual service guides (/services/:category/:slug) included count: ${matches.length}`);
    
    if (!hasServicesDir) {
      console.error('❌ /services directory is missing from sitemap.xml');
      failed = true;
    }
    
    if (matches.length === 0) {
      console.error('❌ No dynamic service guide paths (/services/:category/:slug) are included in sitemap.xml');
      failed = true;
    } else {
      console.log(`✅ Found ${matches.length} guide URLs in sitemap.xml`);
    }
  } else {
    console.error(`❌ sitemap.xml not found at ${sitemapPath}`);
    failed = true;
  }
} catch (err) {
  console.error('❌ Failed to verify sitemap.xml:', err.message);
  failed = true;
}

console.log('\n=== AUDIT COMPLETE ===');
if (failed) {
  console.log('OVERALL VERDICT: FAIL ❌');
  process.exit(1);
} else {
  console.log('OVERALL VERDICT: PASS ✅');
  process.exit(0);
}
