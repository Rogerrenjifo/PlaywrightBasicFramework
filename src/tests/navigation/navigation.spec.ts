// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navegación entre Admin y Mercado', () => {
  test('10.1 Navegar desde Admin al Mercado con el enlace Ver Mercado', async ({ page }) => {
    // Navigate to admin and login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Admin screen visible with Ver Mercado link
    await expect(page.getByRole('link', { name: 'Ver Mercado' })).toBeVisible();

    // Click Ver Mercado link
    await page.getByRole('link', { name: 'Ver Mercado' }).click();

    // Verify: URL changed to #market and market page visible
    expect(page.url()).toContain('#market');
    await expect(page.getByText('Mercado de Cockteles')).toBeVisible();
  });

  test('10.2 Navegar desde Mercado al Admin usando #admin en URL', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');
    await expect(page.getByText('Mercado de Cockteles')).toBeVisible();

    // Navigate to admin URL
    await page.goto('http://localhost:5173/#admin');

    // Verify: Login form displayed
    await expect(page.getByRole('heading', { name: 'Cocktail Admin' })).toBeVisible();
  });

  test('10.3 Admin permanece en sesión al navegar al mercado y volver', async ({ page }) => {
    // Navigate to admin and login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Admin screen visible
    await expect(page.getByRole('heading', { name: '➕ Agregar cocktail' })).toBeVisible();

    // Navigate to market
    await page.goto('http://localhost:5173/#market');
    await expect(page.getByText('Mercado de Cockteles')).toBeVisible();

    // Navigate back to admin
    await page.goto('http://localhost:5173/#admin');

    // Verify: Session persists, admin screen visible without re-login
    await expect(page.getByRole('heading', { name: '➕ Agregar cocktail' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cocktail Admin' })).not.toBeVisible();
  });
});
