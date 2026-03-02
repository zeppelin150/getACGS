import { test, expect } from '@playwright/test';

/**
 * Scroll Smoothness Test — GPU-accelerated clip-path expansion
 *
 * The planet does NOT scale. A clip-path on .planet-container starts
 * cropped (inset 18% each side) and opens to 0%, progressively
 * revealing more of the planet. No layout reflow — compositor only.
 */

test.describe('hero planet scroll smoothness', () => {
  test('each wheel tick opens the planet clip', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    // Read the clip-path inset % (lower = more revealed)
    const getInset = () =>
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

    const initialInset = await getInset();
    expect(initialInset).toBeGreaterThanOrEqual(15);

    const TICKS = 8;
    const DELTA_PER_TICK = 60;
    const PAUSE_BETWEEN = 120;

    interface TickResult {
      tick: number;
      scrollY: number;
      inset: number;
      delta: number;
    }

    const results: TickResult[] = [];
    let prevInset = initialInset;

    for (let i = 1; i <= TICKS; i++) {
      await page.mouse.wheel(0, DELTA_PER_TICK);
      await page.waitForTimeout(PAUSE_BETWEEN);

      const scrollY = await getScrollY();
      const inset = await getInset();
      const delta = Math.round((prevInset - inset) * 10000) / 10000;

      results.push({ tick: i, scrollY, inset: Math.round(inset * 100) / 100, delta });
      prevInset = inset;
    }

    console.log('\n=== Scroll Smoothness Report (Clip Inset) ===');
    console.log('Tick | scrollY | inset% | delta');
    console.log('-----|---------|--------|------');
    for (const r of results) {
      console.log(
        `  ${String(r.tick).padStart(2)}  |  ${String(r.scrollY).padStart(5)} | ${r.inset.toFixed(2).padStart(6)}% | ${r.delta >= 0 ? '+' : ''}${r.delta.toFixed(4)}`
      );
    }

    const inTrackResults = results.filter((r) => r.scrollY > 0);
    const activeTicks = inTrackResults.filter((r) => r.delta > 0.01);
    const deadTicks = inTrackResults.filter((r) => r.delta <= 0.01);
    const deltas = activeTicks.map((r) => r.delta);

    console.log(`\nActive ticks: ${activeTicks.length}/${inTrackResults.length}`);
    console.log(`Dead ticks:   ${deadTicks.length}/${inTrackResults.length}`);

    if (deltas.length > 0) {
      const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const maxDelta = Math.max(...deltas);
      const minDelta = Math.min(...deltas);
      console.log(`Avg delta: ${avgDelta.toFixed(4)}, Min: ${minDelta.toFixed(4)}, Max: ${maxDelta.toFixed(4)}`);

      for (const r of activeTicks) {
        expect(r.delta, `Tick ${r.tick} spike`).toBeLessThan(avgDelta * 5);
      }
    }

    const responsiveness = inTrackResults.length > 0 ? activeTicks.length / inTrackResults.length : 0;
    console.log(`Responsiveness: ${(responsiveness * 100).toFixed(0)}%`);
    expect(responsiveness, `${(responsiveness * 100).toFixed(0)}% responsiveness`).toBeGreaterThan(0.6);

    const finalInset = await getInset();
    expect(finalInset, 'Clip should have opened').toBeLessThan(initialInset - 2);

    let maxConsecutiveDead = 0;
    let consecutiveDead = 0;
    for (const r of inTrackResults) {
      if (r.delta <= 0.01) { consecutiveDead++; maxConsecutiveDead = Math.max(maxConsecutiveDead, consecutiveDead); }
      else { consecutiveDead = 0; }
    }
    console.log(`Max consecutive dead: ${maxConsecutiveDead}`);
    expect(maxConsecutiveDead, `${maxConsecutiveDead} consecutive dead`).toBeLessThanOrEqual(2);

    console.log('=== Test Complete ===\n');
  });
});
