import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  expect: {
    toHaveScreenshot: {
      // Allow 0.3% pixel difference to absorb anti-aliasing / sub-pixel rendering
      maxDiffPixelRatio: 0.003,
      // Threshold for individual pixel color comparison (0-1)
      threshold: 0.2,
    },
  },

  use: {
    baseURL: 'http://localhost:3000',
    // Disable animations so screenshots are deterministic
    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'tablet',
      use: {
        browserName: 'chromium',
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
      },
    },
  ],

  webServer: {
    command: 'python -m http.server 3000',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
