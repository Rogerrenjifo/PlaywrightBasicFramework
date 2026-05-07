import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Login Happy Path', () => {
  test('Acceso al panel admin después del login', async ({ loginPage, adminPage }) => {
    await loginPage.goto();
    await loginPage.login(LOGIN_CREDENTIALS.valid.username, LOGIN_CREDENTIALS.valid.password);
    
    await adminPage.isDisplayed();
    await adminPage.verifyFormFields();
    await adminPage.verifyDefaultCocktails();
  });
});
