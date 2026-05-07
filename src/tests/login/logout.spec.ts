import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Session Management', () => {
  test('Cierre de sesión con botón Logout', async ({ loginPage, adminPage }) => {
    await loginPage.goto();
    await loginPage.login(LOGIN_CREDENTIALS.valid.username, LOGIN_CREDENTIALS.valid.password);
    
    await adminPage.isDisplayed();
    await adminPage.clickLogout();
    
    await loginPage.isDisplayed();
  });
});
