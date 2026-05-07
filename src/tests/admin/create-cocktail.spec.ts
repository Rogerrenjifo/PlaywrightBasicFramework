// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin - Crear cocktail', () => {
  test('3.1 Crear un cocktail con datos válidos', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify form is visible
    await expect(page.getByRole('heading', { name: '➕ Agregar cocktail' })).toBeVisible();

    // Fill form with valid data
    await page.getByRole('textbox', { name: 'Nombre del cocktail' }).fill('Mojito Clásico');
    await page.getByRole('textbox', { name: 'Descripción' }).fill('Ron, hierbabuena y limón');
    await page.getByRole('spinbutton', { name: 'Precio mínimo' }).fill('8');
    await page.getByRole('spinbutton', { name: 'Precio promedio' }).fill('12');

    // Click Save button
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify: Cocktail appears in the list
    await expect(page.getByText('Mojito Clásico')).toBeVisible();
    // Verify prices are displayed correctly
    await expect(page.getByText('$8.00')).toBeVisible();
    await expect(page.getByText('$12.00')).toBeVisible();
    // Verify form is cleared for next entry
    await expect(page.getByRole('textbox', { name: 'Nombre del cocktail' })).toHaveValue('');
  });

  test('3.2 El cocktail creado persiste al recargar la página', async ({ page }) => {
    // Login and create cocktail
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Create cocktail
    await page.getByRole('textbox', { name: 'Nombre del cocktail' }).fill('Gimlet Test');
    await page.getByRole('textbox', { name: 'Descripción' }).fill('Gin and lime');
    await page.getByRole('spinbutton', { name: 'Precio mínimo' }).fill('6');
    await page.getByRole('spinbutton', { name: 'Precio promedio' }).fill('9');
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify cocktail appears
    await expect(page.getByText('Gimlet Test')).toBeVisible();

    // Reload page and login again
    await page.reload();
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Cocktail still appears after reload
    await expect(page.getByText('Gimlet Test')).toBeVisible();
  });

  test('3.3 No permitir crear cocktail sin nombre', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Fill form without name
    await page.getByRole('textbox', { name: 'Descripción' }).fill('Test description');
    await page.getByRole('spinbutton', { name: 'Precio mínimo' }).fill('5');
    await page.getByRole('spinbutton', { name: 'Precio promedio' }).fill('10');

    // Click Save button
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify: Error message appears
    await expect(page.getByText(/obligatorio|requerido|nombre/i)).toBeVisible();
  });

  test('3.4 No permitir nombre duplicado (case-insensitive)', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Tequila Shot already exists by default
    // Try to create with lowercase version
    await page.getByRole('textbox', { name: 'Nombre del cocktail' }).fill('tequila shot');
    await page.getByRole('textbox', { name: 'Descripción' }).fill('Test');
    await page.getByRole('spinbutton', { name: 'Precio mínimo' }).fill('5');
    await page.getByRole('spinbutton', { name: 'Precio promedio' }).fill('10');

    // Click Save button
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify: Duplicate name error appears
    await expect(page.getByText(/duplicado|existe/i)).toBeVisible();
  });

  test('3.5 No permitir precio mínimo mayor que precio promedio', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Fill form with min price > avg price
    await page.getByRole('textbox', { name: 'Nombre del cocktail' }).fill('Aperol Spritz');
    await page.getByRole('spinbutton', { name: 'Precio mínimo' }).fill('20');
    await page.getByRole('spinbutton', { name: 'Precio promedio' }).fill('10');

    // Click Save button
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify: Error message about price validation
    await expect(page.getByText(/mínimo.*promedio|precio.*válido/i)).toBeVisible();
  });

  test('3.6 No permitir precio mínimo negativo', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Fill form with negative min price
    await page.getByRole('textbox', { name: 'Nombre del cocktail' }).fill('Boulevardier');
    await page.getByRole('spinbutton', { name: 'Precio mínimo' }).fill('-1');
    await page.getByRole('spinbutton', { name: 'Precio promedio' }).fill('9');

    // Click Save button
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify: Error message about positive prices
    await expect(page.getByText(/positivo|mayor|válido/i)).toBeVisible();
  });

  test('3.7 No permitir precio promedio cero o negativo', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Fill form with zero avg price
    await page.getByRole('textbox', { name: 'Nombre del cocktail' }).fill('Sidecar');
    await page.getByRole('spinbutton', { name: 'Precio mínimo' }).fill('4');
    await page.getByRole('spinbutton', { name: 'Precio promedio' }).fill('0');

    // Click Save button
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify: Error message about positive prices
    await expect(page.getByText(/positivo|mayor|válido/i)).toBeVisible();
  });
});
