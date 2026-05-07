import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Input Handling & Edge Cases', () => {
  test('Envío de formulario con Enter', async ({ loginPage, adminPage }) => {
    await loginPage.goto();
    await loginPage.fillUsername(LOGIN_CREDENTIALS.valid.username);
    await loginPage.fillPassword(LOGIN_CREDENTIALS.valid.password);
    await loginPage.submitWithEnter();
    
    await adminPage.isDisplayed();
  });
});
