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

test.describe('Admin - Crear cocktail', () => {
  test('Crear un cocktail con datos válidos', async ({ adminPage }) => {
    // 1. Iniciar sesión con roger / 12345 en #admin
    await openAuthenticatedAdmin(adminPage);
    await adminPage.expectCreateMode();

    // 2. Completar el formulario: Nombre='Mojito Clásico', Descripción='Ron, hierbabuena y limón', Precio mínimo=8, Precio promedio=12
    await adminPage.fillCocktailForm({
      nombre: 'Mojito Clásico',
      descripcion: 'Ron, hierbabuena y limón',
      precioMinimo: 8,
      precioPromedio: 12
    });

    // 3. Hacer clic en 'Guardar'
    await adminPage.save();
    await adminPage.expectCocktailDetails('Mojito Clásico', {
      descripcion: 'Ron, hierbabuena y limón',
      minPrice: '$8.00',
      avgPrice: '$12.00'
    });
    await adminPage.expectCreateFormReset();
  });

  test('El cocktail creado persiste al recargar la página', async ({ adminPage, page }) => {
    // 1. Iniciar sesión y crear un cocktail con nombre 'Gimlet Test'
    await openAuthenticatedAdmin(adminPage);
    await adminPage.fillCocktailForm({
      nombre: 'Gimlet Test',
      descripcion: 'Gin, limón y azúcar',
      precioMinimo: 9,
      precioPromedio: 14
    });
    await adminPage.save();
    await adminPage.expectCocktailVisible('Gimlet Test');

    // 2. Recargar la página e iniciar sesión nuevamente
    await page.reload();
    await adminPage.expectCocktailVisible('Gimlet Test');
  });

  test('No permitir crear cocktail sin nombre', async ({ adminPage }) => {
    // 1. Iniciar sesión y dejar el campo 'Nombre del cocktail' vacío. Completar los demás campos con valores válidos
    await openAuthenticatedAdmin(adminPage);
    await adminPage.fillCocktailForm({
      nombre: '',
      descripcion: 'Prueba sin nombre',
      precioMinimo: 5,
      precioPromedio: 10
    });

    // 2. Hacer clic en 'Guardar'
    await adminPage.save();
    await adminPage.expectValidationMessage('El nombre es obligatorio.');
    await adminPage.expectCocktailCount(3);
  });

  test('No permitir nombre duplicado (case-insensitive)', async ({ adminPage }) => {
    // 1. Iniciar sesión. El cocktail 'Tequila Shot' ya existe por defecto
    await openAuthenticatedAdmin(adminPage);

    // 2. Completar el formulario con nombre='tequila shot' (minúsculas), valores de precio válidos y hacer clic en 'Guardar'
    await adminPage.fillCocktailForm({
      nombre: 'tequila shot',
      descripcion: 'Intento duplicado',
      precioMinimo: 7,
      precioPromedio: 11
    });
    await adminPage.save();
    await adminPage.expectValidationMessage('Ya existe un cocktail con ese nombre.');
    await adminPage.expectCocktailCount(3);
  });

  test('No permitir precio mínimo mayor que precio promedio', async ({ adminPage }) => {
    // 1. Iniciar sesión y completar el formulario: Nombre='Aperol Spritz', Precio mínimo=20, Precio promedio=10
    await openAuthenticatedAdmin(adminPage);
    await adminPage.fillCocktailForm({
      nombre: 'Aperol Spritz',
      descripcion: 'Prueba de precios',
      precioMinimo: 20,
      precioPromedio: 10
    });

    // 2. Hacer clic en 'Guardar'
    await adminPage.save();
    await adminPage.expectValidationMessage('El precio mínimo no puede ser mayor al precio promedio.');
    await adminPage.expectCocktailCount(3);
  });

  test('No permitir precio mínimo negativo', async ({ adminPage }) => {
    // 1. Completar el formulario con Nombre='Boulevardier', Precio mínimo=-1, Precio promedio=9 y hacer clic en 'Guardar'
    await openAuthenticatedAdmin(adminPage);
    await adminPage.fillCocktailForm({
      nombre: 'Boulevardier',
      descripcion: 'Precio negativo',
      precioMinimo: -1,
      precioPromedio: 9
    });
    await adminPage.save();
    await adminPage.expectValidationMessage(/precio|positiv|mayor a 0/i);
    await adminPage.expectCocktailCount(3);
  });

  test('No permitir precio promedio cero o negativo', async ({ adminPage }) => {
    // 1. Completar el formulario con Nombre='Sidecar', Precio mínimo=4, Precio promedio=0 y hacer clic en 'Guardar'
    await openAuthenticatedAdmin(adminPage);
    await adminPage.fillCocktailForm({
      nombre: 'Sidecar',
      descripcion: 'Promedio inválido',
      precioMinimo: 4,
      precioPromedio: 0
    });
    await adminPage.save();
    await adminPage.expectValidationMessage(/precio|positiv|mayor a 0/i);
    await adminPage.expectCocktailCount(3);
  });
});
