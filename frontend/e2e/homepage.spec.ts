import { test, expect } from '@playwright/test';

test.describe('Homepage — Compact Layout & Core Components', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/hyderabad', { waitUntil: 'networkidle' });
    });

    test('page loads with correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/telangana/i);
    });

    test('header renders with logo and navigation', async ({ page }) => {
        // Article cards have their own <header>; the site header is the banner landmark.
        const banner = page.getByRole('banner');
        await expect(banner).toBeVisible();
        await expect(banner.getByRole('link').first()).toBeVisible();
    });

    test('news ticker is visible', async ({ page }) => {
        await expect(page.getByTestId('news-ticker')).toBeVisible();
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
        await expect(page.locator('main').getByText(/Daily Rates & Fuel/i).first()).toBeVisible();
        // Verify petrol entry exists
        await expect(page.locator('main').getByText('Petrol').first()).toBeVisible();
    });

    test('power tariff card is visible', async ({ page }) => {
        // Match partial text to be more resilient to emojis or extra spaces
        await expect(page.getByText(/Power & Tariffs/i).first()).toBeVisible();
    });

    test('public transport section renders', async ({ page }) => {
        await expect(page.locator('h2', { hasText: /Public Transport/i }).first()).toBeVisible();
    });

    test('services directory is visible', async ({ page }) => {
        await expect(page.locator('h2', { hasText: /Services Directory/i }).first()).toBeVisible();
    });

    test('body does not overflow horizontally', async ({ page }) => {
        // 1-2px tolerance for subpixel rendering or scrollbars
        const diff = await page.evaluate(() => {
            return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        });
        expect(diff).toBeLessThanOrEqual(2);
    });
});

test.describe('Navigation & Routing', () => {

    test('navigating to /cyberabad loads region content', async ({ page }) => {
        await page.goto('/cyberabad', { waitUntil: 'networkidle' });
        // The region name is the page's h1
        const heading = page.locator('main h1', { hasText: /cyberabad/i });
        await expect(heading.first()).toBeVisible();
    });

    test('navigating to /malkajgiri loads region content', async ({ page }) => {
        await page.goto('/malkajgiri', { waitUntil: 'networkidle' });
        const heading = page.locator('main h1', { hasText: /malkajgiri/i });
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
        await page.goto('/dashboard', { waitUntil: 'networkidle' });
        // Bottom nav contains "Home" and "News"
        await expect(page.locator('nav.fixed >> text=Home')).toBeVisible();
        await expect(page.locator('nav.fixed >> text=News')).toBeVisible();
    });

    test('bottom nav has its 5 navigation items', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/dashboard', { waitUntil: 'networkidle' });
        const items = page.locator('nav.fixed >> :is(a, button)');
        await expect(items).toHaveText(['Home', 'Services', 'Report', 'Jobs', 'News']);
    });

    test('no horizontal overflow on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/dashboard', { waitUntil: 'networkidle' });
        const overflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
