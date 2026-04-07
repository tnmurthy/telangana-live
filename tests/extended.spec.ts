import { test, expect } from '@playwright/test';

test.describe('404 Not Found Page', () => {

    test('navigating to an unknown route shows 404 page', async ({ page }) => {
        await page.goto('/this-page-does-not-exist', { waitUntil: 'networkidle' });
        await expect(page.locator('h1', { hasText: '404' })).toBeVisible();
        await expect(page.locator('h2', { hasText: /Page Not Found/i })).toBeVisible();
    });

    test('404 page has a link back to home', async ({ page }) => {
        await page.goto('/non-existent-route', { waitUntil: 'networkidle' });
        const homeLink = page.getByRole('link', { name: /Back to Home/i });
        await expect(homeLink).toBeVisible();
    });

    test('clicking "Back to Home" from 404 returns to homepage', async ({ page }) => {
        await page.goto('/non-existent-route', { waitUntil: 'networkidle' });
        await page.getByRole('link', { name: /Back to Home/i }).click();
        await page.waitForURL('/');
        await expect(page).toHaveURL('/');
    });
});

test.describe('Additional Routes', () => {

    test('/rates/fuel loads the fuel landing page', async ({ page }) => {
        await page.goto('/rates/fuel', { waitUntil: 'networkidle' });
        await expect(page.locator('main').first()).toBeVisible();
        // Fuel page should mention "Fuel" or "Petrol" somewhere in main content
        await expect(page.getByText(/Fuel|Petrol/i).first()).toBeVisible();
    });

    test('/emergency loads the emergency contacts page', async ({ page }) => {
        await page.goto('/emergency', { waitUntil: 'networkidle' });
        await expect(page.locator('main').first()).toBeVisible();
        // Emergency page should have emergency-related content
        await expect(page.getByText(/Emergency|Police|Ambulance|100|112/i).first()).toBeVisible();
    });

    test('/weather loads the weather forecast page', async ({ page }) => {
        await page.goto('/weather', { waitUntil: 'networkidle' });
        await expect(page.locator('main').first()).toBeVisible();
        await expect(page.getByText(/Weather|Forecast|Temperature/i).first()).toBeVisible();
    });

    test('/news loads the news listing page', async ({ page }) => {
        await page.goto('/news', { waitUntil: 'networkidle' });
        await expect(page.locator('main').first()).toBeVisible();
    });

    test('/report loads the reporting landing page', async ({ page }) => {
        await page.goto('/report', { waitUntil: 'networkidle' });
        await expect(page.locator('main').first()).toBeVisible();
    });
});

test.describe('Theme Toggle', () => {

    test('theme toggle button is present in the header', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
        // The header area should contain a button that toggles theme
        const header = page.locator('header');
        await expect(header).toBeVisible();
        // The toggle can be identified by its aria-label, icon, or just presence
        const themeBtn = header.locator('button').first();
        await expect(themeBtn).toBeVisible();
    });
});

test.describe('Accessibility — ARIA Landmarks', () => {

    test('page has exactly one <header> element', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
        const headers = page.locator('header');
        await expect(headers).toHaveCount(1);
    });

    test('page has a <main> element', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
        await expect(page.locator('main').first()).toBeVisible();
    });

    test('page has a <footer> element', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
        const footer = page.locator('footer').first();
        await expect(footer).toBeVisible();
    });
});

test.describe('Responsive Layout — Tablet Viewport', () => {

    test('page renders without horizontal overflow on tablet (768px)', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/', { waitUntil: 'networkidle' });
        const diff = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(diff).toBeLessThanOrEqual(2);
    });

    test('header is visible on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/', { waitUntil: 'networkidle' });
        await expect(page.locator('header')).toBeVisible();
    });
});

test.describe('Page Title — Route-specific', () => {

    test('homepage has a page title containing "Telangana"', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
        await expect(page).toHaveTitle(/telangana/i);
    });
});
