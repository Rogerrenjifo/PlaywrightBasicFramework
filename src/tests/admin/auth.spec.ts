// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin - Autenticación', () => {
  test('1.1 Login exitoso con credenciales válidas', async ({ page }) => {
    // 1. Navigate to http://localhost:5173/#admin
    await page.goto('http://localhost:5173/#admin');
    await expect(page.getByRole('heading', { name: 'Cocktail Admin' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Usuario' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Contraseña' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible();

    // 2. Enter 'roger' in Usuario field
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');

    // 3. Enter '12345' in Contraseña field
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');

    // 4. Click Iniciar sesión button
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Admin screen is displayed with header
    await expect(page.getByText('🍹 Cocktail Admin')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver Mercado' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '➕ Agregar cocktail' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cockteles registrados' })).toBeVisible();
  });

  test('1.2 Login fallido con contraseña incorrecta', async ({ page }) => {
    // 1. Navigate to http://localhost:5173/#admin
    await page.goto('http://localhost:5173/#admin');
    await expect(page.getByRole('heading', { name: 'Cocktail Admin' })).toBeVisible();

    // 2. Enter 'roger' in Usuario field
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');

    // 3. Enter '00000' (incorrect) in Contraseña field
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('00000');

    // 4. Click Iniciar sesión button
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Error message is displayed, no access to admin screen
    await expect(page.getByText(/Credenciales inválidas/)).toBeVisible();
    await expect(page.getByRole('heading', { name: '➕ Agregar cocktail' })).not.toBeVisible();
  });

  test('1.3 Login fallido con usuario vacío', async ({ page }) => {
    // 1. Navigate to http://localhost:5173/#admin
    await page.goto('http://localhost:5173/#admin');
    await expect(page.getByRole('heading', { name: 'Cocktail Admin' })).toBeVisible();

    // 2. Leave Usuario empty, fill Contraseña with '12345'
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');

    // 3. Click Iniciar sesión button
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Error message appears, no access to admin screen
    await expect(page.getByText(/Credenciales inválidas|vacío/)).toBeVisible();
    await expect(page.getByRole('heading', { name: '➕ Agregar cocktail' })).not.toBeVisible();
  });

  test('1.4 Persistencia de sesión tras recargar página', async ({ page }) => {
    // 1. Navigate to admin and login with roger / 12345
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page.getByRole('heading', { name: '➕ Agregar cocktail' })).toBeVisible();

    // 2. Reload page (F5)
    await page.reload();

    // Verify: Session persists, admin screen visible without login
    await expect(page.getByRole('heading', { name: '➕ Agregar cocktail' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cocktail Admin' })).not.toBeVisible();
  });

  test('1.5 Cerrar sesión y regresar al login', async ({ page }) => {
    // 1. Login as roger / 12345
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page.getByRole('heading', { name: '➕ Agregar cocktail' })).toBeVisible();

    // 2. Click Cerrar sesión button
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();

    // Verify: Login form displayed, admin screen not accessible
    await expect(page.getByRole('heading', { name: 'Cocktail Admin' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '➕ Agregar cocktail' })).not.toBeVisible();
  });

  test('1.6 Los cockteles persisten después de cerrar y volver a iniciar sesión', async ({ page }) => {
    // 1. Login as roger / 12345
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // 2. Verify Tequila Shot exists in the list
    await expect(page.getByText('Tequila Shot')).toBeVisible();

    // 3. Logout and login again
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Tequila Shot still appears in the list after re-login
    await expect(page.getByText('Tequila Shot')).toBeVisible();
  });
});
