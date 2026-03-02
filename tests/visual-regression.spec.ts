import { test, expect } from '@playwright/test';

/**
 * Visual Regression Test Suite — Cambric AI Website
 *
 * Captures full-page screenshots of every page and compares them
 * against stored baseline snapshots. Run with --update-snapshots
 * to regenerate baselines after intentional design changes.
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
  test(`${page.name} — visual snapshot`, async ({ page: p }) => {
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

    // Force all .reveal elements to visible (skip scroll-triggered animation)
    await p.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('visible');
      });
    });

    // Small delay for any remaining paint
    await p.waitForTimeout(300);

    await expect(p).toHaveScreenshot(`${page.name}.png`, {
      fullPage: true,
    });
  });
}
