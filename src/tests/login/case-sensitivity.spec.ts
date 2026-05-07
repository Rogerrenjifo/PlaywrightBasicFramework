import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Login Error Validation', () => {
  test('Sensibilidad a mayúsculas y minúsculas', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ROGER', LOGIN_CREDENTIALS.valid.password);
    
    // El sistema es case-sensitive, así que esto debe fallar
    await loginPage.verifyErrorMessage();
  });
});
