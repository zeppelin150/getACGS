import { test, expect } from '@playwright/test';

/**
 * Scroll Smoothness Test — Invisible Planet Container Expansion
 *
 * The planet does NOT scale. An invisible overflow:hidden wrapper around
 * the planet starts narrow (64%) and widens to 100%, progressively
 * revealing more of the planet. Hero stays full-bleed with starry bg.
 */

test.describe('hero planet scroll smoothness', () => {
  test('each wheel tick expands the planet container', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    const getContainerWidth = () =>
      page.evaluate(() => {
        const el = document.querySelector('.planet-container') as HTMLElement;
        if (!el) return 64;
        return parseFloat(el.style.width) || 64;
      });

    const getScrollY = () => page.evaluate(() => window.scrollY);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);

    const initialWidth = await getContainerWidth();
    expect(initialWidth).toBeLessThanOrEqual(68);

    const TICKS = 8;
    const DELTA_PER_TICK = 60;
    const PAUSE_BETWEEN = 120;

    interface TickResult {
      tick: number;
      scrollY: number;
      width: number;
      widthDelta: number;
    }

    const results: TickResult[] = [];
    let prevWidth = initialWidth;

    for (let i = 1; i <= TICKS; i++) {
      await page.mouse.wheel(0, DELTA_PER_TICK);
      await page.waitForTimeout(PAUSE_BETWEEN);

      const scrollY = await getScrollY();
      const width = await getContainerWidth();
      const widthDelta = Math.round((width - prevWidth) * 10000) / 10000;

      results.push({ tick: i, scrollY, width: Math.round(width * 100) / 100, widthDelta });
      prevWidth = width;
    }

    console.log('\n=== Scroll Smoothness Report (Container Width) ===');
    console.log('Tick | scrollY | width% | delta');
    console.log('-----|---------|--------|------');
    for (const r of results) {
      console.log(
        `  ${String(r.tick).padStart(2)}  |  ${String(r.scrollY).padStart(5)} | ${r.width.toFixed(2).padStart(6)}% | ${r.widthDelta >= 0 ? '+' : ''}${r.widthDelta.toFixed(4)}`
      );
    }

    const inTrackResults = results.filter((r) => r.scrollY > 0);
    const activeTicks = inTrackResults.filter((r) => r.widthDelta > 0.01);
    const deadTicks = inTrackResults.filter((r) => r.widthDelta <= 0.01);
    const deltas = activeTicks.map((r) => r.widthDelta);

    console.log(`\nActive ticks: ${activeTicks.length}/${inTrackResults.length}`);
    console.log(`Dead ticks:   ${deadTicks.length}/${inTrackResults.length}`);

    if (deltas.length > 0) {
      const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const maxDelta = Math.max(...deltas);
      const minDelta = Math.min(...deltas);
      console.log(`Avg delta: ${avgDelta.toFixed(4)}, Min: ${minDelta.toFixed(4)}, Max: ${maxDelta.toFixed(4)}`);

      for (const r of activeTicks) {
        expect(r.widthDelta, `Tick ${r.tick} spike`).toBeLessThan(avgDelta * 5);
      }
    }

    const responsiveness = inTrackResults.length > 0 ? activeTicks.length / inTrackResults.length : 0;
    console.log(`Responsiveness: ${(responsiveness * 100).toFixed(0)}%`);
    expect(responsiveness, `${(responsiveness * 100).toFixed(0)}% responsiveness`).toBeGreaterThan(0.6);

    const finalWidth = await getContainerWidth();
    expect(finalWidth, 'Container should have expanded').toBeGreaterThan(initialWidth + 3);

    let maxConsecutiveDead = 0;
    let consecutiveDead = 0;
    for (const r of inTrackResults) {
      if (r.widthDelta <= 0.01) { consecutiveDead++; maxConsecutiveDead = Math.max(maxConsecutiveDead, consecutiveDead); }
      else { consecutiveDead = 0; }
    }
    console.log(`Max consecutive dead: ${maxConsecutiveDead}`);
    expect(maxConsecutiveDead, `${maxConsecutiveDead} consecutive dead`).toBeLessThanOrEqual(2);

    console.log('=== Test Complete ===\n');
  });
});
