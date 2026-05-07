// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test } from '../../fixtures/test-fixtures';
import type { AdminPage } from '../../pages/admin-page';
import { buildTradingState, defaultCocktails } from '../../utils/test-data';

async function openAuthenticatedAdmin(adminPage: AdminPage): Promise<void> {
  await adminPage.prepareStorage({
    items: defaultCocktails,
    session: null,
    tradingState: buildTradingState(defaultCocktails)
  });
  await adminPage.navigate();
  await adminPage.loginAsAdmin();
}

async function createCocktail(adminPage: AdminPage, nombre: string): Promise<void> {
  await adminPage.fillCocktailForm({
    nombre,
    descripcion: `Cocktail temporal ${nombre}`,
    precioMinimo: 11,
    precioPromedio: 16
  });
  await adminPage.save();
}

test.describe('Admin - Eliminar cocktail', () => {
  test('Eliminar un cocktail confirmando la acción', async ({ adminPage }) => {
    // 1. Iniciar sesión y crear un cocktail con nombre 'Margarita Test'
    await openAuthenticatedAdmin(adminPage);
    await createCocktail(adminPage, 'Margarita Test');
    await adminPage.expectCocktailVisible('Margarita Test');

    // 2. Hacer clic en 'Eliminar' para 'Margarita Test' y confirmar la eliminación
    await adminPage.deleteCocktail('Margarita Test', true);
    await adminPage.expectCocktailMissing('Margarita Test');
    await adminPage.expectCocktailVisible('Tequila Shot');
    await adminPage.expectCocktailVisible('Jagerbomb');
    await adminPage.expectCocktailVisible('B-52');
  });

  test('La eliminación persiste tras recargar la página', async ({ adminPage, page }) => {
    // 1. Crear el cocktail 'Cosmopolitan Test', eliminar y confirmar
    await openAuthenticatedAdmin(adminPage);
    await createCocktail(adminPage, 'Cosmopolitan Test');
    await adminPage.deleteCocktail('Cosmopolitan Test', true);
    await adminPage.expectCocktailMissing('Cosmopolitan Test');

    // 2. Recargar la página e iniciar sesión nuevamente
    await page.reload();
    await adminPage.expectCocktailMissing('Cosmopolitan Test');
  });

  test('Cancelar eliminación desde la confirmación mantiene el cocktail', async ({ adminPage }) => {
    // 1. Hacer clic en 'Eliminar' para 'Tequila Shot'
    await openAuthenticatedAdmin(adminPage);

    // 2. Cancelar la eliminación (no confirmar)
    await adminPage.deleteCocktail('Tequila Shot', false);
    await adminPage.expectCocktailVisible('Tequila Shot');
  });
});
