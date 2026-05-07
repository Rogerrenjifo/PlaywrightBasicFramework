import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    await page.goto('http://localhost:5173/#admin');
    await page.getByTestId('input-username').fill('roger');
    await page.getByTestId('input-password').fill('12345');
    await page.getByTestId('btn-login').click();
  });
});
