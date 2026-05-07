import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Input Handling & Edge Cases', () => {
  test('Login con caracteres especiales', async ({ loginPage }) => {
    await loginPage.goto();
    
    const payloadXSS = 'roger<script>alert(1)</script>';
    await loginPage.fillUsername(payloadXSS);
    
    const usernameValue = await loginPage.getUsernameValue();
    expect(usernameValue).toBe(payloadXSS);
    
    await loginPage.fillPassword('password');
    await loginPage.clickLoginButton();
    
    await loginPage.verifyErrorMessage();
  });
});
