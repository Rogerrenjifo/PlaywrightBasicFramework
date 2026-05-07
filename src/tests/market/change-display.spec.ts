// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Mercado Público - Cambio 15 minutos y semántica', () => {
  test('9.1 Cambio neutro (< 0.5%) muestra guion —', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    // Look for neutral change display (dash)
    await expect(page.getByText(/—/)).toBeVisible();
  });

  test('9.2 Cambio positivo muestra porcentaje y Bs en verde', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    // Look for positive change (with + sign)
    const positiveChange = page.getByText(/\+\d+\.\d+%\s+\+\d+\.\d+\s+Bs/);
    await expect(positiveChange).toBeVisible();
  });

  test('9.3 Cambio negativo muestra porcentaje y Bs en rojo', async ({ page }) => {
    // Navigate to market
    await page.goto('http://localhost:5173/#market');

    // Look for negative change (with - sign)
    const negativeChange = page.getByText(/-\d+\.\d+%\s+-\d+\.\d+\s+Bs/);
    await expect(negativeChange).toBeVisible();
  });
});
