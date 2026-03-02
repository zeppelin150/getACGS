import { test, expect } from '@playwright/test';

/**
 * Scroll Smoothness Test — Hero Planet Growth
 *
 * Sends trusted wheel events via Playwright's mouse.wheel() and measures
 * how the planet's --planet-scale CSS variable responds on each tick.
 *
 * Detects:
 *   - Dead zones: wheel ticks that produce zero scale change
 *   - Lag spikes: single ticks with disproportionately large jumps
 *   - Overall responsiveness: % of wheel ticks that produce visible growth
 */

test.describe('hero planet scroll smoothness', () => {
  test('each wheel tick produces incremental planet growth', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // Wait for planet.js to initialize
    await page.waitForTimeout(500);

    // Helper: read the current planet scale
    const getScale = () =>
      page.evaluate(() => {
        const img = document.getElementById('neptune-img');
        return parseFloat(img?.style.getPropertyValue('--planet-scale') || '1');
      });

    // Helper: read current scrollY
    const getScrollY = () => page.evaluate(() => window.scrollY);

    // Ensure we start at top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);

    const initialScale = await getScale();
    expect(initialScale).toBeCloseTo(1, 1);

    // --- Send 15 trusted wheel events, one at a time ---
    const TICKS = 15;
    const DELTA_PER_TICK = 100; // pixels, typical single notch
    const PAUSE_BETWEEN = 120; // ms, realistic scroll cadence

    interface TickResult {
      tick: number;
      scrollY: number;
      scale: number;
      scaleDelta: number;
    }

    const results: TickResult[] = [];
    let prevScale = initialScale;

    for (let i = 1; i <= TICKS; i++) {
      await page.mouse.wheel(0, DELTA_PER_TICK);

      // Wait one frame + a bit for the scroll handler to fire
      await page.waitForTimeout(PAUSE_BETWEEN);

      const scrollY = await getScrollY();
      const scale = await getScale();
      const scaleDelta = Math.round((scale - prevScale) * 10000) / 10000;

      results.push({ tick: i, scrollY, scale: Math.round(scale * 1000) / 1000, scaleDelta });
      prevScale = scale;
    }

    // --- Analysis ---
    console.log('\n=== Scroll Smoothness Report ===');
    console.log('Tick | scrollY | scale  | delta');
    console.log('-----|---------|--------|------');
    for (const r of results) {
      console.log(
        `  ${String(r.tick).padStart(2)}  |  ${String(r.scrollY).padStart(5)} | ${r.scale.toFixed(3)} | ${r.scaleDelta >= 0 ? '+' : ''}${r.scaleDelta.toFixed(4)}`
      );
    }

    // Find ticks where scale actually changed (after hero-track is reached)
    const inTrackResults = results.filter((r) => r.scrollY > 0);
    const activeTicks = inTrackResults.filter((r) => r.scaleDelta > 0.001);
    const deadTicks = inTrackResults.filter((r) => r.scaleDelta <= 0.001);
    const deltas = activeTicks.map((r) => r.scaleDelta);

    console.log(`\nActive ticks (scale changed): ${activeTicks.length}/${inTrackResults.length}`);
    console.log(`Dead ticks (no change):       ${deadTicks.length}/${inTrackResults.length}`);

    if (deltas.length > 0) {
      const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const maxDelta = Math.max(...deltas);
      const minDelta = Math.min(...deltas);
      console.log(`Avg delta: ${avgDelta.toFixed(4)}`);
      console.log(`Min delta: ${minDelta.toFixed(4)}`);
      console.log(`Max delta: ${maxDelta.toFixed(4)}`);
      console.log(`Max/Min ratio: ${(maxDelta / minDelta).toFixed(2)}x`);

      // ASSERTION 1: No single tick should jump more than 5x the average
      // (indicates batching / lag spike)
      for (const r of activeTicks) {
        expect(
          r.scaleDelta,
          `Tick ${r.tick} had a ${(r.scaleDelta / avgDelta).toFixed(1)}x spike (delta=${r.scaleDelta.toFixed(4)}, avg=${avgDelta.toFixed(4)})`
        ).toBeLessThan(avgDelta * 5);
      }
    }

    // ASSERTION 2: At least 60% of in-track ticks should produce growth
    // (if less, the animation feels laggy/unresponsive)
    const responsiveness = inTrackResults.length > 0 ? activeTicks.length / inTrackResults.length : 0;
    console.log(`Responsiveness: ${(responsiveness * 100).toFixed(0)}%`);
    expect(
      responsiveness,
      `Only ${(responsiveness * 100).toFixed(0)}% of wheel ticks produced growth — target is >60%`
    ).toBeGreaterThan(0.6);

    // ASSERTION 3: The planet should have actually grown
    const finalScale = await getScale();
    expect(finalScale, 'Planet should have grown beyond initial scale').toBeGreaterThan(1.2);

    // ASSERTION 4: No more than 2 consecutive dead ticks in a row
    let maxConsecutiveDead = 0;
    let consecutiveDead = 0;
    for (const r of inTrackResults) {
      if (r.scaleDelta <= 0.001) {
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
