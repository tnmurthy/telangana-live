const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🚀 Navigating to http://localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // 1. Take a full page screenshot to verify layout
    await page.screenshot({ path: 'v2_ui_audit.png', fullPage: true });
    console.log('📸 Screenshot saved as v2_ui_audit.png');

    // 2. Perform Visual Hierarchy Check
    const audit = await page.evaluate(() => {
      const getBg = (el) => window.getComputedStyle(el).backgroundColor;
      const getWeight = (el) => window.getComputedStyle(el).fontWeight;
      
      return {
        bodyBg: getBg(document.body),
        headerText: document.querySelector('header h1')?.innerText,
        hasRegionBar: !!document.querySelector('div.bg-white.p-3.rounded-lg'),
        isLightMode: window.getComputedStyle(document.body).backgroundColor === 'rgb(250, 251, 252)', // hsl(210, 20%, 98%)
        navLinks: Array.from(document.querySelectorAll('nav a')).map(a => a.innerText),
        cardCount: document.querySelectorAll('.grid > div').length
      };
    });

    console.log('📊 UI Audit Results:', JSON.stringify(audit, null, 2));

    if (audit.bodyBg.includes('250, 251, 252') || audit.bodyBg.includes('255, 255, 255')) {
      console.log('✅ LIGHT MODE VERIFIED: Background is clean off-white.');
    } else {
      console.log('❌ DARK MODE DETECTED: Still seeing dark background.');
    }

  } catch (e) {
    console.error('❌ Failed to load page:', e.message);
  }

  await browser.close();
})();
