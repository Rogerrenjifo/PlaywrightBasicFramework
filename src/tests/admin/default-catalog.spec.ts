// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test } from '../../fixtures/test-fixtures';
import type { AdminPage } from '../../pages/admin-page';
import { buildTradingState, defaultCocktails } from '../../utils/test-data';

async function openAdminWithState(adminPage: AdminPage): Promise<void> {
  await adminPage.navigate();
  await adminPage.loginAsAdmin();
}

test.describe('Admin - Catálogo por defecto', () => {
  test('Mostrar tres cockteles por defecto al primer acceso', async ({ adminPage }) => {
    // 1. Limpiar localStorage del navegador para simular primer acceso, luego navegar a http://localhost:5173/#admin
    await adminPage.prepareStorage({ clear: true, items: null, session: null, tradingState: null });
    await adminPage.navigate();

    // 2. Iniciar sesión con roger / 12345
    await adminPage.loginAsAdmin();
    await adminPage.expectCocktailCount(3);
    await adminPage.expectCocktailVisible('Tequila Shot');
    await adminPage.expectCocktailVisible('Jagerbomb');
    await adminPage.expectCocktailVisible('B-52');

    // 3. Verificar la ficha de 'Tequila Shot'
    await adminPage.expectCocktailDetails('Tequila Shot', {
      descripcion: 'El clasico con sal y limon. Simple pero infalible.',
      minPrice: '$10.00',
      avgPrice: '$30.00'
    });

    // 4. Verificar la ficha de 'Jagerbomb'
    await adminPage.expectCocktailDetails('Jagerbomb', {
      minPrice: '$20.00',
      avgPrice: '$30.00'
    });

    // 5. Verificar la ficha de 'B-52'
    await adminPage.expectCocktailDetails('B-52', {
      minPrice: '$25.00',
      avgPrice: '$40.00'
    });
  });

  test('El catálogo por defecto no sobreescribe datos existentes', async ({ adminPage, page }) => {
    // 1. Iniciar sesión y crear un cocktail con nombre 'Mojito Test'
    await adminPage.prepareStorage({
      items: defaultCocktails,
      session: null,
      tradingState: buildTradingState(defaultCocktails)
    });
    await openAdminWithState(adminPage);
    await adminPage.fillCocktailForm({
      nombre: 'Mojito Test',
      descripcion: 'Ron, hierbabuena y limón',
      precioMinimo: 8,
      precioPromedio: 12
    });
    await adminPage.save();
    await adminPage.expectCocktailVisible('Mojito Test');

    // 2. Recargar la página e iniciar sesión nuevamente
    await page.reload();
    await adminPage.expectCocktailVisible('Mojito Test');
    await adminPage.expectCocktailVisible('Tequila Shot');
    await adminPage.expectCocktailVisible('Jagerbomb');
    await adminPage.expectCocktailVisible('B-52');
    await adminPage.expectCocktailCount(4);
  });
});
