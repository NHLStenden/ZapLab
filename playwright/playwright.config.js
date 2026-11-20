const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:80';
const target = new URL(baseURL);
const allowedHosts = new Set(['127.0.0.1', 'localhost', '::1']);
if (!allowedHosts.has(target.hostname)) {
  throw new Error(`Safety check: Playwright tests may only target localhost. Received: ${baseURL}`);
}

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ...devices['Desktop Chrome']
  },
});
