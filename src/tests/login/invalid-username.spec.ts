import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Login Error Validation', () => {
  test('Mensaje de error con usuario incorrecto', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(LOGIN_CREDENTIALS.invalid.username, LOGIN_CREDENTIALS.valid.password);
    
    await loginPage.verifyErrorMessage();
    await expect(page).toHaveURL(loginPage.loginUrl);
  });
});
