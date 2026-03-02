import { test, expect } from '@playwright/test';

/**
 * Scroll Smoothness Test — Hero Planet Iris-Frame
 *
 * Sends trusted wheel events via Playwright's mouse.wheel() and measures
 * how the planet container's clip-path inset responds on each tick.
 *
 * The iris (clip-path on planet-container) is the primary visual driver.
 * The planet barely scales — the iris crop does the work.
 * Hero text is completely unaffected by the iris.
 */

test.describe('hero planet scroll smoothness', () => {
  test('each wheel tick produces incremental iris change', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    // Helper: read the planet container's clip-path inset %
    const getIrisInset = () =>
      page.evaluate(() => {
        const el = document.querySelector('.planet-container') as HTMLElement;
        if (!el) return 18;
        const cp = el.style.clipPath || getComputedStyle(el).clipPath;
        const match = cp.match(/inset\([^)]*?\s+([\d.]+)%/);
        return match ? parseFloat(match[1]) : 18;
      });

    const getScrollY = () => page.evaluate(() => window.scrollY);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);

    const initialInset = await getIrisInset();
    expect(initialInset).toBeGreaterThanOrEqual(15);

    const TICKS = 15;
    const DELTA_PER_TICK = 100;
    const PAUSE_BETWEEN = 120;

    interface TickResult {
      tick: number;
      scrollY: number;
      inset: number;
      irisDelta: number;
    }

    const results: TickResult[] = [];
    let prevInset = initialInset;

    for (let i = 1; i <= TICKS; i++) {
      await page.mouse.wheel(0, DELTA_PER_TICK);
      await page.waitForTimeout(PAUSE_BETWEEN);

      const scrollY = await getScrollY();
      const inset = await getIrisInset();
      const irisDelta = Math.round((prevInset - inset) * 10000) / 10000;

      results.push({ tick: i, scrollY, inset: Math.round(inset * 100) / 100, irisDelta });
      prevInset = inset;
    }

    // --- Analysis ---
    console.log('\n=== Scroll Smoothness Report (Planet Iris) ===');
    console.log('Tick | scrollY | inset% | delta');
    console.log('-----|---------|--------|------');
    for (const r of results) {
      console.log(
        `  ${String(r.tick).padStart(2)}  |  ${String(r.scrollY).padStart(5)} | ${r.inset.toFixed(2).padStart(5)}% | ${r.irisDelta >= 0 ? '+' : ''}${r.irisDelta.toFixed(4)}`
      );
    }

    const inTrackResults = results.filter((r) => r.scrollY > 0);
    const activeTicks = inTrackResults.filter((r) => r.irisDelta > 0.01);
    const deadTicks = inTrackResults.filter((r) => r.irisDelta <= 0.01);
    const deltas = activeTicks.map((r) => r.irisDelta);

    console.log(`\nActive ticks (iris changed): ${activeTicks.length}/${inTrackResults.length}`);
    console.log(`Dead ticks (no change):      ${deadTicks.length}/${inTrackResults.length}`);

    if (deltas.length > 0) {
      const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const maxDelta = Math.max(...deltas);
      const minDelta = Math.min(...deltas);
      console.log(`Avg delta: ${avgDelta.toFixed(4)}`);
      console.log(`Min delta: ${minDelta.toFixed(4)}`);
      console.log(`Max delta: ${maxDelta.toFixed(4)}`);
      console.log(`Max/Min ratio: ${(maxDelta / minDelta).toFixed(2)}x`);

      // No single tick should jump more than 5x the average
      for (const r of activeTicks) {
        expect(
          r.irisDelta,
          `Tick ${r.tick} had a ${(r.irisDelta / avgDelta).toFixed(1)}x spike`
        ).toBeLessThan(avgDelta * 5);
      }
    }

    // At least 60% of in-track ticks should produce iris change
    const responsiveness = inTrackResults.length > 0 ? activeTicks.length / inTrackResults.length : 0;
    console.log(`Responsiveness: ${(responsiveness * 100).toFixed(0)}%`);
    expect(
      responsiveness,
      `Only ${(responsiveness * 100).toFixed(0)}% of wheel ticks produced iris change — target is >60%`
    ).toBeGreaterThan(0.6);

    // The iris should have opened
    const finalInset = await getIrisInset();
    expect(finalInset, 'Iris should have opened from initial inset').toBeLessThan(initialInset - 2);

    // No more than 2 consecutive dead ticks
    let maxConsecutiveDead = 0;
    let consecutiveDead = 0;
    for (const r of inTrackResults) {
      if (r.irisDelta <= 0.01) {
        consecutiveDead++;
        maxConsecutiveDead = Math.max(maxConsecutiveDead, consecutiveDead);
      } else {
        consecutiveDead = 0;
      }
    }
    console.log(`Max consecutive dead ticks: ${maxConsecutiveDead}`);
    expect(
      maxConsecutiveDead,
      `${maxConsecutiveDead} consecutive dead ticks — user feels a stall`
    ).toBeLessThanOrEqual(2);

    console.log('=== Test Complete ===\n');
  });
});
