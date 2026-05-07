import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Session Management', () => {
  test('Destrucción de sesión al limpiar localStorage', async ({ page, loginPage, adminPage }) => {
    await loginPage.goto();
    await loginPage.login(LOGIN_CREDENTIALS.valid.username, LOGIN_CREDENTIALS.valid.password);
    
    await adminPage.isDisplayed();
    
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    await loginPage.isDisplayed();
  });
});
