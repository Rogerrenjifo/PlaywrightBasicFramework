import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    headless: false,
    screenshot: 'only-on-failure'
  }
});
