import { test, expect } from '../../fixtures/test-fixtures';
import { LOGIN_CREDENTIALS } from '../../utils/login-test-data';

test.describe('Login Happy Path', () => {
  test('Login exitoso con credenciales válidas', async ({ loginPage, adminPage }) => {
    // Ir a la página de login
    await loginPage.goto();
    
    // Hacer login con credenciales válidas
    await loginPage.login(LOGIN_CREDENTIALS.valid.username, LOGIN_CREDENTIALS.valid.password);
    
    // Verificar que el usuario está autenticado
    await adminPage.isDisplayed();
  });
});
