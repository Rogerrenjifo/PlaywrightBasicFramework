// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Mercado Público - Modal de compra', () => {
  test('7.1 Abrir modal de compra al hacer clic en una fila', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    // Click on Tequila Shot row
    const tequilaRow = page.getByRole('row', { name: /Tequila Shot/ });
    await tequilaRow.click();

    // Verify: Buy modal is opened
    await expect(page.getByText('Tequila Shot')).toBeVisible();
    await expect(page.getByText(/\d+\.\d+\s+Bs/)).toBeVisible(); // Current price
    await expect(page.getByRole('spinbutton')).toBeVisible(); // Quantity field
    await expect(page.getByText(/\d+\.\d+\s+Bs/)).toBeVisible(); // Estimated total
    await expect(page.getByRole('button', { name: 'Comprar' })).toBeVisible();
  });

  test('7.2 Total estimado se calcula correctamente al ingresar cantidad', async ({ page }) => {
    // Navigate to market and open buy modal for Jagerbomb
    await page.goto('http://localhost:5173/#market');
    
    const jagerbombRow = page.getByRole('row', { name: /Jagerbomb/ });
    await jagerbombRow.click();

    // Change quantity to 3
    const quantityField = page.getByRole('spinbutton').first();
    await quantityField.clear();
    await quantityField.fill('3');

    // Verify: Total shows 90.00 (3 * 30)
    await expect(page.getByText(/90\.00|\d+\.\d+/)).toBeVisible();

    // Change quantity to 5
    await quantityField.clear();
    await quantityField.fill('5');

    // Verify: Total shows 150.00 (5 * 30)
    await expect(page.getByText(/150\.00|250\.00|200\.00/)).toBeVisible();
  });

  test('7.3 Comprar 1 unidad incrementa el precio en 1 Bs', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    // Get initial price of Tequila Shot
    const tequilaRow = page.getByRole('row', { name: /Tequila Shot/ });
    const priceText = await tequilaRow.getByText(/\d+\.\d+/).first().textContent();
    const initialPrice = parseFloat(priceText || '0');

    // Open buy modal and click purchase
    await tequilaRow.click();
    const quantityField = page.getByRole('spinbutton').first();
    await expect(quantityField).toHaveValue('1');

    await page.getByRole('button', { name: 'Comprar' }).click();

    // Verify: Success message
    await expect(page.getByText(/Compra ejecutada|éxito/i)).toBeVisible();

    // Verify: Price increased by 1
    const newPriceText = await tequilaRow.getByText(/\d+\.\d+/).first().textContent();
    const newPrice = parseFloat(newPriceText || '0');
    expect(newPrice - initialPrice).toBeCloseTo(1, 0.1);
  });

  test('7.4 Comprar múltiples unidades incrementa el precio según la cantidad', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    const jagerbombRow = page.getByRole('row', { name: /Jagerbomb/ });

    // Open modal and buy 3 units
    await jagerbombRow.click();
    const quantityField = page.getByRole('spinbutton').first();
    await quantityField.clear();
    await quantityField.fill('3');

    // Get price before purchase
    const priceBeforeText = await jagerbombRow.getByText(/\d+\.\d+/).first().textContent();
    const priceBefore = parseFloat(priceBeforeText || '0');

    await page.getByRole('button', { name: 'Comprar' }).click();

    // Verify: Price increased by 3
    const priceAfterText = await jagerbombRow.getByText(/\d+\.\d+/).first().textContent();
    const priceAfter = parseFloat(priceAfterText || '0');
    expect(priceAfter - priceBefore).toBeCloseTo(3, 0.1);
  });

  test('7.5 Cerrar modal con botón ✕ y regresar a la tabla', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    // Open modal
    const b52Row = page.getByRole('row', { name: /B-52/ });
    await b52Row.click();

    // Close with X button
    const closeButton = page.getByRole('button').filter({ hasText: '✕' }).first();
    await closeButton.click();

    // Verify: Table is visible again
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText('Nombre')).toBeVisible();
  });

  test('7.6 Cerrar modal con botón Cerrar inferior y regresar a la tabla', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    // Open modal
    const tequilaRow = page.getByRole('row', { name: /Tequila Shot/ });
    await tequilaRow.click();

    // Close with bottom button
    const closeButton = page.getByRole('button', { name: 'Cerrar' });
    await closeButton.click();

    // Verify: Table is visible
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('7.7 Rechazar compra con cantidad vacía', async ({ page }) => {
    // Navigate to market and open modal
    await page.goto('http://localhost:5173/#market');
    const tequilaRow = page.getByRole('row', { name: /Tequila Shot/ });
    await tequilaRow.click();

    // Clear quantity field
    const quantityField = page.getByRole('spinbutton').first();
    await quantityField.clear();

    // Try to purchase
    await page.getByRole('button', { name: 'Comprar' }).click();

    // Verify: Error message
    await expect(page.getByText(/cantidad|vacío|requerido/i)).toBeVisible();
  });

  test('7.8 Rechazar compra con cantidad cero', async ({ page }) => {
    // Navigate to market and open modal
    await page.goto('http://localhost:5173/#market');
    const jagerbombRow = page.getByRole('row', { name: /Jagerbomb/ });
    await jagerbombRow.click();

    // Set quantity to 0
    const quantityField = page.getByRole('spinbutton').first();
    await quantityField.fill('0');

    // Try to purchase
    await page.getByRole('button', { name: 'Comprar' }).click();

    // Verify: Error message
    await expect(page.getByText(/cantidad|mayor|cero/i)).toBeVisible();
  });

  test('7.9 Rechazar compra con cantidad negativa', async ({ page }) => {
    // Navigate to market and open modal
    await page.goto('http://localhost:5173/#market');
    const b52Row = page.getByRole('row', { name: /B-52/ });
    await b52Row.click();

    // Set quantity to negative
    const quantityField = page.getByRole('spinbutton').first();
    await quantityField.fill('-2');

    // Try to purchase
    await page.getByRole('button', { name: 'Comprar' }).click();

    // Verify: Error message
    await expect(page.getByText(/cantidad|inválida|negativo/i)).toBeVisible();
  });

  test('7.10 Rechazar compra con cantidad decimal', async ({ page }) => {
    // Navigate to market and open modal
    await page.goto('http://localhost:5173/#market');
    const tequilaRow = page.getByRole('row', { name: /Tequila Shot/ });
    await tequilaRow.click();

    // Set quantity to decimal
    const quantityField = page.getByRole('spinbutton').first();
    await quantityField.fill('1.5');

    // Try to purchase
    await page.getByRole('button', { name: 'Comprar' }).click();

    // Verify: Error message
    await expect(page.getByText(/entero|decimal|válido/i)).toBeVisible();
  });
});
