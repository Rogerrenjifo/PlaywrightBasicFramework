// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Mercado Público - Persistencia y comportamiento offline', () => {
  test('8.1 Precio después de compra persiste al recargar la página', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    // Get initial price and open modal for Tequila Shot
    const tequilaRow = page.getByRole('row', { name: /Tequila Shot/ });
    const priceBeforeText = await tequilaRow.getByText(/\d+\.\d+/).first().textContent();
    const priceBefore = parseFloat(priceBeforeText || '0');

    // Buy 2 units
    await tequilaRow.click();
    const quantityField = page.getByRole('spinbutton').first();
    await quantityField.fill('2');
    await page.getByRole('button', { name: 'Comprar' }).click();

    // Note the new price
    const priceAfterText = await tequilaRow.getByText(/\d+\.\d+/).first().textContent();
    const priceAfter = parseFloat(priceAfterText || '0');

    // Reload page
    await page.reload();

    // Verify: Price persists at the new value
    const priceReloadText = await tequilaRow.getByText(/\d+\.\d+/).first().textContent();
    const priceReload = parseFloat(priceReloadText || '0');
    expect(priceReload).toBeCloseTo(priceAfter, 0.1);
  });

  test('8.2 No se aplica decremento retroactivo al reabrir la página', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    // Note Jagerbomb price
    const jagerbombRow = page.getByRole('row', { name: /Jagerbomb/ });
    const priceText = await jagerbombRow.getByText(/\d+\.\d+/).first().textContent();
    const price = parseFloat(priceText || '0');

    // Close browser/tab simulation (clear context)
    await page.context().clearCookies();

    // Reopen market page
    await page.goto('http://localhost:5173/#market');

    // Verify: Price equals last persisted value (no retroactive decrease)
    const newPriceText = await jagerbombRow.getByText(/\d+\.\d+/).first().textContent();
    const newPrice = parseFloat(newPriceText || '0');
    expect(newPrice).toBeCloseTo(price, 0.1);
  });

  test('8.3 Estado inicial: precio comienza en precioPromedio sin estado previo', async ({ page, context }) => {
    // Clear localStorage to simulate fresh session
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());

    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    // Verify: Tequila Shot starts at $30.00 (average price)
    await expect(page.getByText('$30.00')).toBeVisible();

    // Verify: B-52 starts at $40.00 (its average price)
    await expect(page.getByText('$40.00')).toBeVisible();
  });
});
