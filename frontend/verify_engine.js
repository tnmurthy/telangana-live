const fs = require('fs');
const path = require('path');

function verify() {
  console.log('Starting verification...');

  // 1. Verify files exist
  const appPath = path.join(__dirname, 'src', 'App.jsx');
  const servicesPagePath = path.join(__dirname, 'src', 'pages', 'ServicesDirectoryPage.jsx');
  const detailPagePath = path.join(__dirname, 'src', 'pages', 'ServiceDetailPage.jsx');
  const docsPath = path.join(__dirname, 'src', 'content', 'docs');

  if (!fs.existsSync(appPath)) {
    console.error('App.jsx not found!');
    process.exit(1);
  }
  if (!fs.existsSync(servicesPagePath)) {
    console.error('ServicesDirectoryPage.jsx not found!');
    process.exit(1);
  }
  if (!fs.existsSync(detailPagePath)) {
    console.error('ServiceDetailPage.jsx not found!');
    process.exit(1);
  }
  if (!fs.existsSync(docsPath)) {
    console.error('docs directory not found!');
    process.exit(1);
  }

  // 2. Check App.jsx content
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Verify imports
  if (!appContent.includes('ServicesDirectoryPage') || !appContent.includes('ServiceDetailPage')) {
    console.error('App.jsx is missing page imports!');
    process.exit(1);
  }

  // Verify route registration order
  const regionIndex = appContent.indexOf('path="/:region"');
  const servicesIndex = appContent.indexOf('path="/services"');
  const servicesDetailIndex = appContent.indexOf('path="/services/:category/:slug"');

  if (regionIndex === -1) {
    console.error('/:region route not found in App.jsx!');
    process.exit(1);
  }
  if (servicesIndex === -1) {
    console.error('/services route not found in App.jsx!');
    process.exit(1);
  }
  if (servicesDetailIndex === -1) {
    console.error('/services/:category/:slug route not found in App.jsx!');
    process.exit(1);
  }

  if (servicesIndex >= regionIndex) {
    console.error('/services route is registered AFTER /:region! It must be BEFORE it.');
    process.exit(1);
  }
  if (servicesDetailIndex >= regionIndex) {
    console.error('/services/:category/:slug route is registered AFTER /:region! It must be BEFORE it.');
    process.exit(1);
  }

  console.log('App.jsx routing verification passed.');

  // 3. Scan directories under src/content/docs
  const docsDirs = fs.readdirSync(docsPath).filter(file => {
    return fs.statSync(path.join(docsPath, file)).isDirectory();
  });

  console.log(`Found docs directories: ${docsDirs.length}`, docsDirs);
  if (docsDirs.length !== 10) {
    console.error(`Expected exactly 10 subdirectories in src/content/docs, found ${docsDirs.length}!`);
    process.exit(1);
  }

  // 4. Verify Pages contain 'glass-card'
  const servicesPageContent = fs.readFileSync(servicesPagePath, 'utf8');
  const detailPageContent = fs.readFileSync(detailPagePath, 'utf8');

  if (!servicesPageContent.includes('glass-card')) {
    console.error('ServicesDirectoryPage.jsx is missing "glass-card" class!');
    process.exit(1);
  }
  if (!detailPageContent.includes('glass-card')) {
    console.error('ServiceDetailPage.jsx is missing "glass-card" class!');
    process.exit(1);
  }

  console.log('All verification checks passed successfully.');
  process.exit(0);
}

verify();
