// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Admin - Editar cocktail', () => {
  test('4.1 Editar un cocktail existente con datos válidos', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Find and click Edit button for Tequila Shot
    const tequilaCard = page.locator('generic').filter({ hasText: 'Tequila Shot' }).first();
    await tequilaCard.getByRole('button', { name: 'Editar' }).click();

    // Verify form is populated with Tequila Shot data
    await expect(page.getByRole('textbox', { name: 'Nombre del cocktail' })).toHaveValue('Tequila Shot');

    // Change description
    const descField = page.getByRole('textbox', { name: 'Descripción' });
    await descField.fill('Descripción actualizada para test');

    // Click update button (could be "Actualizar" or "Guardar")
    await page.getByRole('button', { name: /Actualizar|Guardar/ }).click();

    // Verify new description appears in the card
    await expect(page.getByText('Descripción actualizada para test')).toBeVisible();
    await expect(page.getByText('Tequila Shot')).toBeVisible();
  });

  test('4.2 Los cambios de edición persisten tras recargar', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Find and click Edit button for Jagerbomb
    const jagerbombCard = page.locator('generic').filter({ hasText: 'Jagerbomb' }).first();
    await jagerbombCard.getByRole('button', { name: 'Editar' }).click();

    // Change average price to 35
    const avgPriceField = page.getByRole('spinbutton', { name: 'Precio promedio' });
    await avgPriceField.fill('35');

    // Click update button
    await page.getByRole('button', { name: /Actualizar|Guardar/ }).click();

    // Verify price changed
    await expect(page.getByText('$35.00')).toBeVisible();

    // Reload and login again
    await page.reload();
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verify: Price change persists
    await expect(page.getByText('$35.00')).toBeVisible();
  });

  test('4.3 Cancelar edición en curso sin guardar cambios', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Note original description
    const originalDesc = await page.locator('generic').filter({ hasText: 'B-52' }).first().locator('paragraph').textContent();

    // Find and click Edit button for B-52
    const b52Card = page.locator('generic').filter({ hasText: 'B-52' }).first();
    await b52Card.getByRole('button', { name: 'Editar' }).click();

    // Modify description
    const descField = page.getByRole('textbox', { name: 'Descripción' });
    await descField.fill('Cambio temporal que no debe guardarse');

    // Click cancel button (if exists) or navigate away
    const cancelButton = page.getByRole('button', { name: /Cancelar|Limpiar/ });
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
    } else {
      await page.goto('http://localhost:5173/#admin');
    }

    // Verify: Original description is unchanged
    await expect(page.getByText('Capas de Kahlua, Baileys y Grand Marnier. Visualmente atractivo y dulce.')).toBeVisible();
  });

  test('4.4 No permitir editar con nombre duplicado de otro cocktail', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/#admin');
    await page.getByRole('textbox', { name: 'Usuario' }).fill('roger');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Find and click Edit button for Jagerbomb
    const jagerbombCard = page.locator('generic').filter({ hasText: 'Jagerbomb' }).first();
    await jagerbombCard.getByRole('button', { name: 'Editar' }).click();

    // Change name to existing cocktail name (Tequila Shot)
    const nameField = page.getByRole('textbox', { name: 'Nombre del cocktail' });
    await nameField.clear();
    await nameField.fill('Tequila Shot');

    // Click update button
    await page.getByRole('button', { name: /Actualizar|Guardar/ }).click();

    // Verify: Duplicate error appears
    await expect(page.getByText(/duplicado|existe/i)).toBeVisible();
  });
});
