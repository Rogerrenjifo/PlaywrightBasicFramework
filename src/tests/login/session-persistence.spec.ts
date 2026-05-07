import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Session Management', () => {
  test('Persistencia de sesión tras recargar la página', async ({ page, loginPage, adminPage }) => {
    await loginPage.goto();
    await loginPage.login(LOGIN_CREDENTIALS.valid.username, LOGIN_CREDENTIALS.valid.password);
    
    await adminPage.isDisplayed();
    
    await page.reload();
    
    await adminPage.isDisplayed();
    await expect(loginPage.loginSubtitle).not.toBeVisible();
  });
});
