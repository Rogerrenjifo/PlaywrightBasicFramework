import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_DATA } from '../../utils/login-test-data';

test.describe('Navigation', () => {
  test('Acceso al mercado sin autenticación', async ({ page, marketPage }) => {
    await marketPage.goto();
    
    await expect(page).toHaveURL(TEST_DATA.urls.market);
    await marketPage.isDisplayed();
  });
});
