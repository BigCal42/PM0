import { defineConfig } from '@playwright/test';

const PORT = 5173;
const HOST = '127.0.0.1';
const BASE_URL = `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: './tests',
  use: {
    headless: true,
    trace: 'on-first-retry',
    baseURL: BASE_URL,
  },
  webServer: {
    command: `npm run dev -- --host ${HOST} --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
