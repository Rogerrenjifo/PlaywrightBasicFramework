import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Input Handling & Edge Cases', () => {
  test('Intento de login múltiple fallido', async ({ loginPage }) => {
    await loginPage.goto();
    
    for (let i = 0; i < 3; i++) {
      await loginPage.login(LOGIN_CREDENTIALS.invalid.username, LOGIN_CREDENTIALS.invalid.password);
      await loginPage.verifyErrorMessage();
      
      await expect(loginPage.usernameInput).toBeEnabled();
      await expect(loginPage.passwordInput).toBeEnabled();
      
      await loginPage.clearFields();
    }
  });
});
