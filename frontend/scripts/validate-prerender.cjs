const fs = require('fs');
const path = require('path');
const districts = require('../src/data/districts.json');

const DIST_DIR = path.join(__dirname, '../dist');
const DASHBOARD_INDEX = path.join(DIST_DIR, 'dashboard', 'index.html');
const SAMPLE_DISTRICTS = ['hyderabad', 'warangal', 'malkajgiri', 'nizamabad', 'khammam'];

function fail(message) {
  console.error(`❌ Prerender validation failed: ${message}`);
  process.exit(1);
}

function main() {
  if (!fs.existsSync(DASHBOARD_INDEX)) {
    fail('missing prerendered /dashboard/index.html');
  }

  const html = fs.readFileSync(DASHBOARD_INDEX, 'utf8');
  if (!html.includes('href="https://telangana.live/dashboard"')) {
    fail('missing canonical link for /dashboard');
  }

  if (!/<h1[^>]*>[\s\S]*Dashboard[\s\S]*<\/h1>/i.test(html)) {
    fail('missing dashboard H1 in prerendered HTML');
  }

  SAMPLE_DISTRICTS.forEach((slug) => {
    const district = districts[slug];
    if (!district) {
      fail(`missing district metadata for ${slug}`);
    }

    const districtIndex = path.join(DIST_DIR, slug, 'index.html');
    if (!fs.existsSync(districtIndex)) {
      fail(`missing prerendered /${slug}/index.html`);
    }

    const districtHtml = fs.readFileSync(districtIndex, 'utf8');
    if (!districtHtml.includes(`href="https://telangana.live/${slug}"`)) {
      fail(`missing canonical link for /${slug}`);
    }

    if (!new RegExp(`<h1[^>]*>[\\s\\S]*${district.title.split(' ')[0]}[\\s\\S]*<\\/h1>`, 'i').test(districtHtml)) {
      fail(`missing district H1 in prerendered /${slug} HTML`);
    }

    if (!districtHtml.includes(district.district)) {
      fail(`missing district name in prerendered /${slug} HTML`);
    }
  });

  console.log('✅ Prerender validation passed for /dashboard');
}

main();
