// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '../../fixtures/test-fixtures';
import type { AdminPage } from '../../pages/admin-page';
import { buildTradingState, defaultCocktails } from '../../utils/test-data';

async function openAdminLogin(adminPage: AdminPage): Promise<void> {
  await adminPage.prepareStorage({
    items: defaultCocktails,
    session: null,
    tradingState: buildTradingState(defaultCocktails)
  });
  await adminPage.navigate();
}

test.describe('Admin - Autenticación', () => {
  test('Login exitoso con credenciales válidas', async ({ adminPage }) => {
    // 1. Navegar a http://localhost:5173/#admin
    await openAdminLogin(adminPage);
    await adminPage.expectLoginVisible();

    // 2. Ingresar 'roger' en el campo 'Usuario'
    await adminPage.usernameInput.fill('roger');

    // 3. Ingresar '12345' en el campo 'Contraseña'
    await adminPage.passwordInput.fill('12345');

    // 4. Hacer clic en 'Iniciar sesión'
    await adminPage.loginButton.click();
    await adminPage.expectAdminVisible();
    await adminPage.expectCreateMode();
  });

  test('Login fallido con contraseña incorrecta', async ({ adminPage }) => {
    // 1. Navegar a http://localhost:5173/#admin
    await openAdminLogin(adminPage);
    await adminPage.expectLoginVisible();

    // 2. Ingresar 'roger' en el campo 'Usuario'
    await adminPage.usernameInput.fill('roger');

    // 3. Ingresar '00000' en el campo 'Contraseña'
    await adminPage.passwordInput.fill('00000');

    // 4. Hacer clic en 'Iniciar sesión'
    await adminPage.loginButton.click();
    await adminPage.expectLoginVisible();
    await expect(adminPage.invalidLoginMessage).toBeVisible();
    await expect(adminPage.marketLink).toHaveCount(0);
  });

  test('Login fallido con usuario vacío', async ({ adminPage }) => {
    // 1. Navegar a http://localhost:5173/#admin
    await openAdminLogin(adminPage);
    await adminPage.expectLoginVisible();

    // 2. Dejar el campo 'Usuario' vacío y la 'Contraseña' en '12345'
    await adminPage.passwordInput.fill('12345');

    // 3. Hacer clic en 'Iniciar sesión'
    await adminPage.loginButton.click();
    await adminPage.expectLoginVisible();
    await adminPage.expectValidationMessage(/usuario|obligatorio|inválid/i);
    await expect(adminPage.marketLink).toHaveCount(0);
  });

  test('Persistencia de sesión tras recargar página', async ({ adminPage, page }) => {
    // 1. Navegar a http://localhost:5173/#admin e iniciar sesión con roger / 12345
    await openAdminLogin(adminPage);
    await adminPage.loginAsAdmin();
    await adminPage.expectAdminVisible();

    // 2. Recargar la página (F5 o navegación a la misma URL)
    await page.reload();
    await adminPage.expectAdminVisible();
    await expect(adminPage.loginButton).toHaveCount(0);
  });

  test('Cerrar sesión y regresar al login', async ({ adminPage }) => {
    // 1. Iniciar sesión como roger / 12345 en #admin
    await openAdminLogin(adminPage);
    await adminPage.loginAsAdmin();
    await adminPage.expectAdminVisible();

    // 2. Hacer clic en 'Cerrar sesión'
    await adminPage.logout();
    await adminPage.expectLoginVisible();
    await expect(adminPage.marketLink).toHaveCount(0);
  });

  test('Los cockteles persisten después de cerrar y volver a iniciar sesión', async ({ adminPage }) => {
    // 1. Iniciar sesión como roger / 12345
    await openAdminLogin(adminPage);
    await adminPage.loginAsAdmin();

    // 2. Verificar que existe el cocktail 'Tequila Shot' en el listado
    await adminPage.expectCocktailVisible('Tequila Shot');

    // 3. Hacer clic en 'Cerrar sesión' y volver a iniciar sesión con roger / 12345
    await adminPage.logout();
    await adminPage.loginAsAdmin();
    await adminPage.expectCocktailVisible('Tequila Shot');
  });
});
