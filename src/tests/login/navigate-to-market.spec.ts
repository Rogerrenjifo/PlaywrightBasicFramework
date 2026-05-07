import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS, TEST_DATA } from '../../utils/login-test-data';

test.describe('Navigation', () => {
  test('Navegación al mercado desde el admin', async ({ page, loginPage, adminPage, marketPage }) => {
    await loginPage.goto();
    await loginPage.login(LOGIN_CREDENTIALS.valid.username, LOGIN_CREDENTIALS.valid.password);
    
    await adminPage.navigateToMarket();
    
    await expect(page).toHaveURL(TEST_DATA.urls.market);
    await marketPage.isDisplayed();
  });
});
