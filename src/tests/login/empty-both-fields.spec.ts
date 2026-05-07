import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Login Error Validation', () => {
  test('Mensaje de error con ambos campos vacíos', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.clickLoginButton();
    
    await loginPage.verifyErrorMessage();
    await expect(page).toHaveURL(loginPage.loginUrl);
  });
});
