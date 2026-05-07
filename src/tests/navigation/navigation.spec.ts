// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '../../fixtures/test-fixtures';
import type { AdminPage } from '../../pages/admin-page';
import { buildTradingState, defaultCocktails } from '../../utils/test-data';

async function seedDefaults(adminPage: AdminPage): Promise<void> {
  await adminPage.prepareStorage({
    items: defaultCocktails,
    session: null,
    tradingState: buildTradingState(defaultCocktails)
  });
}

test.describe('Navegación entre Admin y Mercado', () => {
  test('Navegar desde Admin al Mercado con el enlace Ver Mercado', async ({ adminPage, marketPage, page }) => {
    // 1. Iniciar sesión en #admin
    await seedDefaults(adminPage);
    await adminPage.navigate();
    await adminPage.loginAsAdmin();
    await adminPage.expectAdminVisible();

    // 2. Hacer clic en el enlace 'Ver Mercado'
    await adminPage.marketLink.click();
    await expect(page).toHaveURL(/#market$/);
    await marketPage.expectMarketVisible();
  });

  test('Navegar desde Mercado al Admin usando #admin en URL', async ({ adminPage, marketPage, page }) => {
    // 1. Navegar a http://localhost:5173/#market
    await seedDefaults(adminPage);
    await marketPage.navigate();
    await marketPage.expectMarketVisible();

    // 2. Modificar la URL a http://localhost:5173/#admin
    await page.goto('/#admin');
    await adminPage.expectLoginVisible();
  });

  test('Admin permanece en sesión al navegar al mercado y volver', async ({ adminPage, marketPage, page }) => {
    // 1. Iniciar sesión en #admin
    await seedDefaults(adminPage);
    await adminPage.navigate();
    await adminPage.loginAsAdmin();

    // 2. Hacer clic en 'Ver Mercado' para ir a #market
    await adminPage.marketLink.click();
    await marketPage.expectMarketVisible();

    // 3. Navegar de vuelta a http://localhost:5173/#admin
    await page.goto('/#admin');
    await adminPage.expectAdminVisible();
  });
});
