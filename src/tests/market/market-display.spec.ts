// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '../../fixtures/test-fixtures';
import type { MarketPage } from '../../pages/market-page';
import { BASE_ROUTE, CSS_STATE } from '../../utils/constants';
import { buildTradingState, defaultCocktails, type TradingStateEntry } from '../../utils/test-data';

async function openDefaultMarket(
  marketPage: MarketPage,
  overrides: Record<string, Partial<TradingStateEntry>> = {}
): Promise<void> {
  await marketPage.prepareStorage({
    items: defaultCocktails,
    session: null,
    tradingState: buildTradingState(defaultCocktails, overrides)
  });
  await marketPage.navigate();
}

test.describe('Mercado Público - Visualización general', () => {
  test('Acceso a la página de mercado sin login', async ({ marketPage }) => {
    // 1. Navegar a http://localhost:5173/#market (o a la URL base sin hash)
    await openDefaultMarket(marketPage);
    await marketPage.expectMarketVisible();
    await expect(marketPage.lastTickText).toBeVisible();
  });

  test('La URL base redirige al mercado', async ({ marketPage, page }) => {
    // 1. Navegar a http://localhost:5173/ (sin hash)
    await marketPage.prepareStorage({
      items: defaultCocktails,
      session: null,
      tradingState: buildTradingState(defaultCocktails)
    });
    await page.goto(BASE_ROUTE);
    await marketPage.expectMarketVisible();
    await expect(marketPage.row('Tequila Shot')).toBeVisible();
    await expect(marketPage.row('Jagerbomb')).toBeVisible();
    await expect(marketPage.row('B-52')).toBeVisible();
  });

  test('Tabla de mercado con cuatro columnas correctas', async ({ marketPage }) => {
    // 1. Navegar a http://localhost:5173/#market
    await openDefaultMarket(marketPage);
    await marketPage.expectHeaders(['Nombre', 'Precio Actual', 'Cambio (15min)', 'Vol 15m']);

    // 2. Verificar que los tres cockteles por defecto están en la tabla
    await expect(marketPage.row('Tequila Shot').locator('td')).toHaveCount(4);
    await expect(marketPage.row('Jagerbomb').locator('td')).toHaveCount(4);
    await expect(marketPage.row('B-52').locator('td')).toHaveCount(4);
  });

  test('Precio actual muestra valor en Bs con sparkline', async ({ marketPage }) => {
    // 1. Navegar a http://localhost:5173/#market
    await openDefaultMarket(marketPage);

    // 2. Inspeccionar la columna 'Precio Actual' de cada fila
    expect(await marketPage.getCurrentPriceText('Tequila Shot')).toMatch(/^\d+\.\d{2} Bs$/);
    expect(await marketPage.getCurrentPriceText('Jagerbomb')).toMatch(/^\d+\.\d{2} Bs$/);
    expect(await marketPage.getCurrentPriceText('B-52')).toMatch(/^\d+\.\d{2} Bs$/);
    await marketPage.expectSparklineVisible('Tequila Shot');
    await marketPage.expectSparklineVisible('Jagerbomb');
    await marketPage.expectSparklineVisible('B-52');
  });

  test('Columna Cambio (15min) muestra porcentaje y valor absoluto en Bs', async ({ marketPage }) => {
    // 1. Navegar a http://localhost:5173/#market
    await openDefaultMarket(marketPage, {
      'default-tequila-shot': { precioActualBs: 31.05, precioHace15Min: 30 },
      'default-jagerbomb': { precioActualBs: 30.33, precioHace15Min: 30 },
      'default-b-52': { precioActualBs: 39.12, precioHace15Min: 40 }
    });

    // 2. Verificar la columna 'Cambio (15min)' para cada cocktail
    await expect(marketPage.changeCell('Tequila Shot')).toContainText('+3.50%');
    await expect(marketPage.changeCell('Tequila Shot')).toContainText('+1.05 Bs');
    await marketPage.expectChangeCellClass('Tequila Shot', CSS_STATE.changePositive);
    await expect(marketPage.changeCell('B-52')).toContainText('-2.20%');
    await expect(marketPage.changeCell('B-52')).toContainText('-0.88 Bs');
    await marketPage.expectChangeCellClass('B-52', CSS_STATE.changeNegative);
  });

  test('Columna Vol 15m muestra volumen y contador de operaciones', async ({ marketPage }) => {
    // 1. Navegar a http://localhost:5173/#market
    await openDefaultMarket(marketPage);

    // 2. Inspeccionar la columna 'Vol 15m' de cada fila
    await marketPage.expectVolume('Tequila Shot', '0', '0 ops');
    await marketPage.expectVolume('Jagerbomb', '0', '0 ops');
    await marketPage.expectVolume('B-52', '0', '0 ops');
  });

  test('Texto Último tick visible con formato de hora', async ({ marketPage }) => {
    // 1. Navegar a http://localhost:5173/#market
    await openDefaultMarket(marketPage);
    await expect(marketPage.lastTickText).toHaveText(/Último tick: \d{1,2}:\d{2}:\d{2}/);
  });

  test('Semántica de color: precio sobre promedio se muestra en verde', async ({ marketPage }) => {
    // 1. Navegar a http://localhost:5173/#market
    await openDefaultMarket(marketPage, {
      'default-tequila-shot': { precioActualBs: 31, precioHace15Min: 30 }
    });

    // 2. Identificar un cocktail cuyo precio actual sea mayor que su precioPromedio
    await marketPage.expectPriceCellClass('Tequila Shot', CSS_STATE.priceUp);
  });

  test('Semántica de color: precio por debajo del promedio se muestra en rojo', async ({ marketPage }) => {
    // 1. Navegar a http://localhost:5173/#market
    await openDefaultMarket(marketPage, {
      'default-b-52': { precioActualBs: 39, precioHace15Min: 40 }
    });

    // 2. Identificar un cocktail cuyo precio actual sea menor que su precioPromedio
    await marketPage.expectPriceCellClass('B-52', CSS_STATE.priceDown);
  });
});
