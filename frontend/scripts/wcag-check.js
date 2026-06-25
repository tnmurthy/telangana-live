import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

async function runAudit() {
  console.log('Starting WCAG Accessibility Audit...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to local district page (Hyderabad as default)
    console.log('Navigating to http://localhost:5173/hyderabad...');
    await page.goto('http://localhost:5173/hyderabad', { waitUntil: 'domcontentloaded' });

    console.log('Running Axe accessibility engine...');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (results.violations.length === 0) {
      console.log('🎉 Excellent! No WCAG accessibility violations found.');
    } else {
      console.log(`⚠️ Found ${results.violations.length} types of accessibility violations:`);
      results.violations.forEach((violation, index) => {
        console.log(`\n--------------------------------------------------`);
        console.log(`${index + 1}. [${violation.id}] - ${violation.impact.toUpperCase()}: ${violation.help}`);
        console.log(`Help URL: ${violation.helpUrl}`);
        console.log(`Instances found: ${violation.nodes.length}`);
        
        // Print elements and HTML that caused the issue
        violation.nodes.forEach((node, nodeIdx) => {
          if (nodeIdx < 3) { // Limit output to first 3 instances
            console.log(`  - Target: ${node.target.join(', ')}`);
            console.log(`    Snippet: ${node.html}`);
          }
        });
      });
    }
  } catch (error) {
    console.error('Audit failed:', error);
  } finally {
    await browser.close();
  }
}

runAudit();
