import { test, expect } from '@playwright/test';

/**
 * Scroll Smoothness Test — Static hero
 *
 * Hero and governance image scroll naturally with the page.
 * No JS-driven animations. Verifies page scrolls and key
 * sections become visible.
 */

test.describe('hero scroll behavior', () => {
  test('page scrolls naturally and governance image is visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    // Start at top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);

    const getScrollY = () => page.evaluate(() => window.scrollY);

    // Hero content should be visible at top
    const heroContent = page.locator('.hero-content');
    await expect(heroContent).toBeVisible();

    // Scroll down with wheel ticks
    const TICKS = 8;
    const DELTA_PER_TICK = 60;
    const PAUSE_BETWEEN = 120;

    const scrollPositions: number[] = [];

    for (let i = 0; i < TICKS; i++) {
      await page.mouse.wheel(0, DELTA_PER_TICK);
      await page.waitForTimeout(PAUSE_BETWEEN);
      scrollPositions.push(await getScrollY());
    }

    // Page should have scrolled
    const finalScroll = scrollPositions[scrollPositions.length - 1];
    expect(finalScroll, 'Page should scroll').toBeGreaterThan(0);

    // Each tick should move the page (monotonically increasing)
    for (let i = 1; i < scrollPositions.length; i++) {
      expect(
        scrollPositions[i],
        `Tick ${i + 1} should scroll further than tick ${i}`
      ).toBeGreaterThanOrEqual(scrollPositions[i - 1]);
    }

    // Scroll to governance image
    const heroVisual = page.locator('.hero-visual-img');
    await heroVisual.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await expect(heroVisual).toBeVisible();

    // Caption should also be visible
    const caption = page.locator('.hero-visual-caption');
    await expect(caption).toBeVisible();
    await expect(caption).toContainText('governance');

    console.log('\n=== Scroll Smoothness Report (Static Hero) ===');
    console.log(`Scroll positions: ${scrollPositions.join(', ')}`);
    console.log(`Final scroll: ${finalScroll}px`);
    console.log('=== Test Complete ===\n');
  });
});
