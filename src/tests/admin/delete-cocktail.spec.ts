// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin - Eliminar cocktail', () => {
  test('5.1 Eliminar un cocktail confirmando la acción', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Create a test cocktail
    await page.getByRole('textbox', { name: 'Nombre del cocktail' }).fill('Margarita Test');
    await page.getByRole('textbox', { name: 'Descripción' }).fill('Test margarita');
    await page.getByRole('spinbutton', { name: 'Precio mínimo' }).fill('8');
    await page.getByRole('spinbutton', { name: 'Precio promedio' }).fill('12');
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify cocktail appears
    await expect(page.getByText('Margarita Test')).toBeVisible();

    // Find and click Delete button for Margarita Test
    const margaritaCard = page.locator('generic').filter({ hasText: 'Margarita Test' }).first();
    await margaritaCard.getByRole('button', { name: 'Eliminar' }).click();

    // Accept confirmation dialog
    await page.on('dialog', dialog => {
      expect(dialog.type()).toBe('confirm');
      dialog.accept();
    });

    // Verify: Cocktail disappears from list
    await expect(page.getByText('Margarita Test')).not.toBeVisible();
    // Verify other cocktails remain
    await expect(page.getByText('Tequila Shot')).toBeVisible();
  });

  test('5.2 La eliminación persiste tras recargar la página', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Create test cocktail
    await page.getByRole('textbox', { name: 'Nombre del cocktail' }).fill('Cosmopolitan Test');
    await page.getByRole('textbox', { name: 'Descripción' }).fill('Test cosmopolitan');
    await page.getByRole('spinbutton', { name: 'Precio mínimo' }).fill('10');
    await page.getByRole('spinbutton', { name: 'Precio promedio' }).fill('15');
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Verify cocktail appears
    await expect(page.getByText('Cosmopolitan Test')).toBeVisible();

    // Delete the cocktail
    const cosmCard = page.locator('generic').filter({ hasText: 'Cosmopolitan Test' }).first();
    await cosmCard.getByRole('button', { name: 'Eliminar' }).click();

    // Accept confirmation
    await page.on('dialog', dialog => {
      dialog.accept();
    });

    // Verify deleted
    await expect(page.getByText('Cosmopolitan Test')).not.toBeVisible();

    // Reload and login again
    await page.reload();
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Cocktail still deleted after reload
    await expect(page.getByText('Cosmopolitan Test')).not.toBeVisible();
  });

  test('5.3 Cancelar eliminación desde la confirmación mantiene el cocktail', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Find Tequila Shot
    await expect(page.getByText('Tequila Shot')).toBeVisible();

    // Click Delete button for Tequila Shot
    const tequilaCard = page.locator('generic').filter({ hasText: 'Tequila Shot' }).first();
    await tequilaCard.getByRole('button', { name: 'Eliminar' }).click();

    // Dismiss confirmation dialog
    await page.on('dialog', dialog => {
      dialog.dismiss();
    });

    // Verify: Cocktail still exists
    await expect(page.getByText('Tequila Shot')).toBeVisible();
  });
});
