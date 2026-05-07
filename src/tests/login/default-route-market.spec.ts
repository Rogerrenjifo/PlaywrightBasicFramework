import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_DATA } from '../../utils/login-test-data';

test.describe('Navigation', () => {
  test('Redirección al mercado si no hay hash', async ({ page, marketPage }) => {
    await page.goto(TEST_DATA.urls.home);
    
    await expect(page).toHaveURL(/.*#market|.*\/$/);
    await expect(marketPage.pageTitle).toBeVisible();
  });
});
