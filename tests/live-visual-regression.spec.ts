import { test, expect } from '@playwright/test';

/**
 * Live Site Visual Regression Test Suite — Cambric AI Website
 *
 * Captures full-page screenshots against the live site at getacgs.io
 * and compares against stored baselines. Uses a separate snapshot
 * directory from local tests to avoid conflicts.
 *
 * Run:            npx playwright test --config=playwright-live.config.ts
 * Update baselines: npx playwright test --config=playwright-live.config.ts --update-snapshots
 */

const PAGES = [
  { name: 'home',         path: '/' },
  { name: 'products',     path: '/products.html' },
  { name: 'harpax',       path: '/harpax.html' },
  { name: 'revvit',       path: '/revvit.html' },
  { name: 'quinte',       path: '/quinte.html' },
  { name: 'blog',         path: '/blog.html' },
  { name: 'testimonials', path: '/testimonials.html' },
  { name: 'store',        path: '/store.html' },
  { name: 'about',        path: '/about.html' },
  { name: 'research',     path: '/research.html' },
  { name: 'news',         path: '/news.html' },
  { name: 'contact',      path: '/contact.html' },
  { name: 'privacy',      path: '/privacy.html' },
  { name: 'terms',        path: '/terms.html' },
  { name: '404',          path: '/404.html' },
];

for (const page of PAGES) {
  test(`${page.name} — live visual snapshot`, async ({ page: p }) => {
    await p.goto(page.path, { waitUntil: 'networkidle' });

    // Wait for Inter font to load
    await p.evaluate(() => document.fonts.ready);

    // Disable CSS animations & transitions for deterministic screenshots
    await p.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    });

    // Force all .reveal elements to visible
    await p.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('visible');
      });
    });

    // Longer delay for live site network assets
    await p.waitForTimeout(500);

    await expect(p).toHaveScreenshot(`live-${page.name}.png`, {
      fullPage: true,
    });
  });
}
