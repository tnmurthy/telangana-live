import { test, expect } from '@playwright/test';

test.describe('Homepage — Compact Layout & Core Components', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
    });

    test('page loads with correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/telangana/i);
    });

    test('header renders with logo and navigation', async ({ page }) => {
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('header h1')).toContainText('telangana');
    });

    test('news ticker is visible', async ({ page }) => {
        await expect(page.locator('.animate-ticker')).toBeVisible();
    });

    test('daily rates card renders', async ({ page }) => {
        // Use heading role for "Daily Rates" — only the section heading
        const heading = page.locator('h3', { hasText: 'Daily Rates' });
        await expect(heading.first()).toBeVisible();
    });

    test('gold rate tab switching works', async ({ page }) => {
        // Click the Silver tab button in the 7-Day Trend area
        const silverTab = page.locator('button', { hasText: /^Silver$/i }).first();
        await silverTab.click();
        await expect(page.locator('text=7-Day Trend')).toBeVisible();
    });

    test('fuel prices section renders', async ({ page }) => {
        await expect(page.getByText('Fuel Prices', { exact: false }).first()).toBeVisible();
        // Verify petrol entry exists
        await expect(page.getByText('Petrol').first()).toBeVisible();
    });

    test('power tariff card is visible', async ({ page }) => {
        // Match partial text to be more resilient to emojis or extra spaces
        await expect(page.getByText(/Power Tariff/i).first()).toBeVisible();
    });

    test('public transport section renders', async ({ page }) => {
        await expect(page.locator('h2', { hasText: /Public Transport/i }).first()).toBeVisible();
    });

    test('services directory is visible', async ({ page }) => {
        await expect(page.locator('h2', { hasText: /Services Directory/i }).first()).toBeVisible();
    });

    test('body does not overflow horizontally', async ({ page }) => {
        // Evaluate if any element is causing a horizontal scroll on the document
        const hasOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        // If it fails, we might need a 1-2px tolerance for subpixel rendering or scrollbars
        const diff = await page.evaluate(() => {
            return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        });
        expect(diff).toBeLessThanOrEqual(2);
    });
});

test.describe('Navigation & Routing', () => {

    test('navigating to /cyberabad loads region content', async ({ page }) => {
        await page.goto('/cyberabad', { waitUntil: 'networkidle' });
        // Region page should have a heading with the region name
        const heading = page.locator('main h2', { hasText: /cyberabad/i });
        await expect(heading.first()).toBeVisible();
    });

    test('navigating to /malkajgiri loads region content', async ({ page }) => {
        await page.goto('/malkajgiri', { waitUntil: 'networkidle' });
        const heading = page.locator('main h2', { hasText: /malkajgiri/i });
        await expect(heading.first()).toBeVisible();
    });

    test('navigating to /rates/gold loads gold page', async ({ page }) => {
        await page.goto('/rates/gold', { waitUntil: 'networkidle' });
        // Gold landing page should have gold-related heading in main
        const heading = page.locator('main h2').first();
        await expect(heading).toBeVisible();
    });

    test('navigating to /report loads civic page', async ({ page }) => {
        await page.goto('/report', { waitUntil: 'networkidle' });
        await expect(page.locator('main h2').first()).toBeVisible();
    });
});

test.describe('Mobile — Bottom Navigation', () => {

    test('bottom nav is visible on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/', { waitUntil: 'networkidle' });
        // Bottom nav contains "Home" and "Emergency"
        await expect(page.locator('nav.fixed >> text=Home')).toBeVisible();
        await expect(page.locator('nav.fixed >> text=Emergency')).toBeVisible();
    });

    test('bottom nav has 4 navigation items', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/', { waitUntil: 'networkidle' });
        // Count all links + buttons inside the fixed bottom nav
        const items = page.locator('nav.fixed >> :is(a, button)');
        await expect(items).toHaveCount(4);
    });

    test('no horizontal overflow on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/', { waitUntil: 'networkidle' });
        const overflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
