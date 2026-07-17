import { chromium } from '@playwright/test';
import * as fs from 'fs';

async function fetchPage(url, outTextFile, outHtmlFile) {
  console.log(`Launching browser for ${url}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  
  console.log('Waiting for content to render...');
  await page.waitForTimeout(10000); // wait 10 seconds for client-side loading
  
  const title = await page.title();
  console.log(`Page Title: ${title}`);
  
  const content = await page.content();
  fs.writeFileSync(outHtmlFile, content);
  
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(outTextFile, text);
  
  console.log(`Done! Saved raw HTML to ${outHtmlFile} and plain text to ${outTextFile}`);
  await browser.close();
}

async function main() {
  await fetchPage(
    'https://share.google/aimode/lcrEusgqsRdwZJTXo',
    'C:\\Users\\Sriad\\.gemini\\antigravity-cli\\brain\\5c24525a-57c2-41bd-9356-cdc0f227c2ff\\scratch\\playwright_text1.txt',
    'C:\\Users\\Sriad\\.gemini\\antigravity-cli\\brain\\5c24525a-57c2-41bd-9356-cdc0f227c2ff\\scratch\\playwright_raw1.html'
  );
  await fetchPage(
    'https://share.google/aimode/NqtKXq1mhRDulKf2n',
    'C:\\Users\\Sriad\\.gemini\\antigravity-cli\\brain\\5c24525a-57c2-41bd-9356-cdc0f227c2ff\\scratch\\playwright_text2.txt',
    'C:\\Users\\Sriad\\.gemini\\antigravity-cli\\brain\\5c24525a-57c2-41bd-9356-cdc0f227c2ff\\scratch\\playwright_raw2.html'
  );
}

main().catch(err => {
  console.error('Error in main execution:', err);
  process.exit(1);
});
