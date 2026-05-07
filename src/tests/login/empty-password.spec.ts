import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Login Error Validation', () => {
  test('Mensaje de error con campo Contraseña vacío', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.fillUsername(LOGIN_CREDENTIALS.valid.username);
    await loginPage.clickLoginButton();
    
    await loginPage.verifyErrorMessage();
    await expect(page).toHaveURL(loginPage.loginUrl);
  });
});
