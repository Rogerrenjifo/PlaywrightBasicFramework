import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Input Handling & Edge Cases', () => {
  test('Espacios en blanco en credenciales', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(' roger ', LOGIN_CREDENTIALS.valid.password);
    
    await loginPage.verifyErrorMessage();
  });
});
