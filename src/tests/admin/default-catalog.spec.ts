// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin - Catálogo por defecto', () => {
  test('2.1 Mostrar tres cockteles por defecto al primer acceso', async ({ page, context }) => {
    // Clear localStorage to simulate first access
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    
    // Navigate to admin and login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Exactly three cocktails are displayed
    await expect(page.getByText('Tequila Shot')).toBeVisible();
    await expect(page.getByText('Jagerbomb')).toBeVisible();
    await expect(page.getByText('B-52')).toBeVisible();

    // Verify Tequila Shot details
    await expect(page.getByText('El clasico con sal y limon. Simple pero infalible.')).toBeVisible();
    await expect(page.getByText('$10.00')).toBeVisible(); // Min price
    await expect(page.getByText('$30.00')).toBeVisible(); // Average price

    // Verify Jagerbomb details
    await expect(page.getByText('Jagermeister con bebida energetica. Fuerte y muy popular en fiestas.')).toBeVisible();
    await expect(page.getByText('$20.00')).toBeVisible(); // Jagerbomb min

    // Verify B-52 details
    await expect(page.getByText('Capas de Kahlua, Baileys y Grand Marnier. Visualmente atractivo y dulce.')).toBeVisible();
    await expect(page.getByText('$25.00')).toBeVisible(); // B-52 min
    await expect(page.getByText('$40.00')).toBeVisible(); // B-52 average
  });

  test('2.2 El catálogo por defecto no sobreescribe datos existentes', async ({ page }) => {
    // Login and create a custom cocktail
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Create new cocktail
    await page.getByRole('textbox', { name: 'Nombre del cocktail' }).fill('Mojito Test');
    await page.getByRole('textbox', { name: 'Descripción' }).fill('Test mojito');
    await page.getByRole('spinbutton', { name: 'Precio mínimo' }).fill('5');
    await page.getByRole('spinbutton', { name: 'Precio promedio' }).fill('10');
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify new cocktail appears
    await expect(page.getByText('Mojito Test')).toBeVisible();

    // Reload page and login again
    await page.reload();
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Custom cocktail still exists
    await expect(page.getByText('Mojito Test')).toBeVisible();
    // Verify: Default cocktails also still exist
    await expect(page.getByText('Tequila Shot')).toBeVisible();
    await expect(page.getByText('Jagerbomb')).toBeVisible();
    await expect(page.getByText('B-52')).toBeVisible();
  });
});
