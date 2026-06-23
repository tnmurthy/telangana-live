const fs = require('fs');
const path = require('path');

const districts = require('../src/data/districts.json');

const BASE_URL = 'https://telangana.live';

const staticRoutes = [
  { url: '/', changefreq: 'always', priority: 1.0 },
  { url: '/news', changefreq: 'always', priority: 0.9 },
  { url: '/weather', changefreq: 'hourly', priority: 0.8 },
  { url: '/rates/fuel', changefreq: 'daily', priority: 0.8 },
  { url: '/rates/gold', changefreq: 'daily', priority: 0.8 },
  { url: '/reservoirs', changefreq: 'daily', priority: 0.7 },
  { url: '/schemes', changefreq: 'weekly', priority: 0.6 },
  { url: '/transport/metro', changefreq: 'hourly', priority: 0.7 },
  { url: '/jobs', changefreq: 'daily', priority: 0.8 },
  { url: '/classifieds', changefreq: 'always', priority: 0.8 },
  { url: '/ai-pulse', changefreq: 'always', priority: 0.7 },
  { url: '/services', changefreq: 'weekly', priority: 0.8 }
];

function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static routes
  staticRoutes.forEach(route => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route.url}</loc>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Add district routes
  Object.keys(districts).forEach(slug => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/${slug}</loc>\n`;
    xml += `    <changefreq>always</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  // Add guide routes
  const docsDir = path.join(__dirname, '../src/content/docs');
  let dynamicCount = 0;
  if (fs.existsSync(docsDir)) {
    const categories = fs.readdirSync(docsDir);
    categories.forEach(categoryDir => {
      const categoryPath = path.join(docsDir, categoryDir);
      if (fs.statSync(categoryPath).isDirectory()) {
        const files = fs.readdirSync(categoryPath);
        const categorySlug = categoryDir.replace(/^\d+-/, '');
        files.forEach(file => {
          if (file.endsWith('.md')) {
            const fileSlug = file.replace(/\.md$/, '');
            xml += `  <url>\n`;
            xml += `    <loc>${BASE_URL}/services/${categorySlug}/${fileSlug}</loc>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.6</priority>\n`;
            xml += `  </url>\n`;
            dynamicCount++;
          }
        });
      }
    });
  }

  xml += '</urlset>';

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`✅ Sitemap generated with ${staticRoutes.length + Object.keys(districts).length + dynamicCount} URLs at ${outputPath}`);
}

generateSitemap();
