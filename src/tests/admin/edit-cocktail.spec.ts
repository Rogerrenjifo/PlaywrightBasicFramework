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

test.describe('Admin - Editar cocktail', () => {
  test('Editar un cocktail existente con datos válidos', async ({ adminPage }) => {
    // 1. Iniciar sesión. En la ficha de 'Tequila Shot' hacer clic en 'Editar'
    await openAuthenticatedAdmin(adminPage);
    await adminPage.startEdit('Tequila Shot');
    await adminPage.expectEditMode({
      nombre: 'Tequila Shot',
      descripcion: 'El clasico con sal y limon. Simple pero infalible.',
      precioMinimo: 10,
      precioPromedio: 30
    });

    // 2. Cambiar la Descripción a 'Descripción actualizada para test' y hacer clic en 'Actualizar'
    await adminPage.fillCocktailForm({
      nombre: 'Tequila Shot',
      descripcion: 'Descripción actualizada para test',
      precioMinimo: 10,
      precioPromedio: 30
    });
    await adminPage.update();
    await adminPage.expectCocktailDetails('Tequila Shot', {
      descripcion: 'Descripción actualizada para test',
      minPrice: '$10.00',
      avgPrice: '$30.00'
    });
  });

  test('Los cambios de edición persisten tras recargar', async ({ adminPage, page }) => {
    // 1. Editar 'Jagerbomb': cambiar Precio promedio a 35 y guardar
    await openAuthenticatedAdmin(adminPage);
    await adminPage.startEdit('Jagerbomb');
    await adminPage.fillCocktailForm({
      nombre: 'Jagerbomb',
      descripcion: 'Jagermeister con bebida energetica. Fuerte y muy popular en fiestas.',
      precioMinimo: 20,
      precioPromedio: 35
    });
    await adminPage.update();
    await adminPage.expectCocktailDetails('Jagerbomb', {
      avgPrice: '$35.00'
    });

    // 2. Recargar la página e iniciar sesión nuevamente
    await page.reload();
    await adminPage.expectCocktailDetails('Jagerbomb', {
      avgPrice: '$35.00'
    });
  });

  test('Cancelar edición en curso sin guardar cambios', async ({ adminPage }) => {
    // 1. Hacer clic en 'Editar' para 'B-52'
    await openAuthenticatedAdmin(adminPage);
    await adminPage.startEdit('B-52');
    await adminPage.expectEditMode({
      nombre: 'B-52',
      descripcion: 'Capas de Kahlua, Baileys y Grand Marnier. Visualmente atractivo y dulce.',
      precioMinimo: 25,
      precioPromedio: 40
    });

    // 2. Modificar el campo Descripción a 'Cambio temporal que no debe guardarse'
    await adminPage.fillCocktailForm({
      nombre: 'B-52',
      descripcion: 'Cambio temporal que no debe guardarse',
      precioMinimo: 25,
      precioPromedio: 40
    });

    // 3. Hacer clic en 'Cancelar edición'
    await adminPage.cancelEdit();
    await adminPage.expectCreateMode();
    await adminPage.expectCreateFormReset();
    await adminPage.expectCocktailDetails('B-52', {
      descripcion: 'Capas de Kahlua, Baileys y Grand Marnier. Visualmente atractivo y dulce.'
    });
  });

  test('No permitir editar con nombre duplicado de otro cocktail', async ({ adminPage }) => {
    // 1. Hacer clic en 'Editar' para 'Jagerbomb'
    await openAuthenticatedAdmin(adminPage);
    await adminPage.startEdit('Jagerbomb');

    // 2. Cambiar el nombre a 'Tequila Shot' (nombre de otro cocktail existente) y hacer clic en 'Actualizar'
    await adminPage.fillCocktailForm({
      nombre: 'Tequila Shot',
      descripcion: 'Jagermeister con bebida energetica. Fuerte y muy popular en fiestas.',
      precioMinimo: 20,
      precioPromedio: 30
    });
    await adminPage.update();
    await adminPage.expectValidationMessage('Ya existe un cocktail con ese nombre.');
    await adminPage.expectCocktailVisible('Jagerbomb');
  });
});
