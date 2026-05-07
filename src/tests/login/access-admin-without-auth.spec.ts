import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Session Management', () => {
  test('Acceso a admin sin autenticación redirige al login', async ({ loginPage, adminPage }) => {
    await loginPage.goto();
    
    await loginPage.isDisplayed();
    await expect(adminPage.addCocktailHeading).not.toBeVisible();
  });
});
