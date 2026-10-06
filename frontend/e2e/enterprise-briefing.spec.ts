import { test, expect, type Page } from '@playwright/test';

test.describe('Telangana.live Enterprise Briefing & Liquid Glass UI', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Visit the local dev server
    await page.goto('/dashboard');
  });

  test('Page loads with Liquid Glass aesthetic', async ({ page }: { page: Page }) => {
    // Dark theme: the body background stays near-black (exact shade may change).
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const [r, g, b] = bodyBg.match(/\d+/g)!.map(Number);
    expect(Math.max(r, g, b)).toBeLessThan(30);

    // Check for glassmorphic elements
    const glassCard = page.locator('.liquid-glass').first();
    await expect(glassCard).toBeVisible();
    
    // Cards use a solid surface now (the backdrop blur was removed from .liquid-glass).
    const cardBg = await glassCard.evaluate((el: HTMLElement) => getComputedStyle(el).backgroundColor);
    expect(cardBg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('Category filtering works correctly', async ({ page }: { page: Page }) => {
    // Click on 'Security' (Safety) category
    const securityBtn = page.getByRole('button', { name: 'Security' });
    await securityBtn.click();
    
    // Verify that the news cards are filtered (should be fewer or different)
    // We check if the active class is applied to the button
    await expect(securityBtn).toHaveClass(/bg-white text-black/);
  });

  test('Article Modal opens with high-density content', async ({ page }: { page: Page }) => {
    // Click on the first news card
    const firstCard = page.locator('article').first();
    await firstCard.click();

    // Verify the ArticleModal is visible
    const modal = page.locator('.fixed.z-\\[150\\]'); // ArticleModal z-index
    await expect(modal).toBeVisible();

    // No invented "AI Confidence" score (it was derived from the title length; TL-23)
    await expect(modal.getByText(/AI Confidence/)).toHaveCount(0);
  });

  test('Emergency Mode transforms the UI theme', async ({ page }: { page: Page }) => {
    // Click the Emergency Simulator toggle (floating button)
    const emergencyToggle = page.locator('#emergency-simulator-toggle');
    await emergencyToggle.click({ force: true });

    // Trigger 'Heatwave' mode
    const heatwaveBtn = page.getByRole('button', { name: /Heatwave/ });
    await heatwaveBtn.click({ force: true });

    // Verify the theme class on the root element
    const rootClass = await page.evaluate(() => document.documentElement.className);
    expect(rootClass).toContain('theme-emergency-heatwave');

    // Verify the background pulse is active
    const mainContainer = page.locator('.min-h-screen').last();
    await expect(mainContainer).toHaveClass(/emergency-pulse/);

    // Verify Heatwave Panel is visible
    await expect(page.getByText('Cooling Dashboard')).toBeVisible();
  });
});
