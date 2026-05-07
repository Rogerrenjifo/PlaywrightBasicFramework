// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '../../fixtures/test-fixtures';
import type { MarketPage } from '../../pages/market-page';
import { buildTradingState, defaultCocktails, type TradingStateEntry } from '../../utils/test-data';

async function openMarket(
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

test.describe('Mercado Público - Persistencia y comportamiento offline', () => {
  test('Precio después de compra persiste al recargar la página', async ({ marketPage, page }) => {
    // 1. Navegar a #market, abrir el modal de 'Tequila Shot', comprar 2 unidades
    await openMarket(marketPage, {
      'default-tequila-shot': { precioActualBs: 30, precioHace15Min: 30 }
    });
    await marketPage.openBuyModal('Tequila Shot');
    await marketPage.setQuantity('2');
    await marketPage.clickBuy();
    await expect(marketPage.priceValue('Tequila Shot')).toHaveText('32.00 Bs');

    // 2. Anotar el nuevo precio y recargar la página
    await page.reload();
    await expect(marketPage.priceValue('Tequila Shot')).toHaveText('32.00 Bs');
  });

  test('No se aplica decremento retroactivo al reabrir la página', async ({ marketPage, page }) => {
    // 1. Navegar a #market y anotar el precio actual de 'Jagerbomb'
    await openMarket(marketPage, {
      'default-jagerbomb': {
        precioActualBs: 35,
        precioHace15Min: 33,
        ultimaActualizacion: '2026-05-07T08:00:00.000Z',
        ultimaActualizacion15Min: '2026-05-07T08:00:00.000Z'
      }
    });
    await expect(marketPage.priceValue('Jagerbomb')).toHaveText('35.00 Bs');

    // 2. Cerrar la pestaña/navegador y volver a abrir http://localhost:5173/#market
    await page.goto('about:blank');
    await page.goto('/#market');
    await expect(marketPage.priceValue('Jagerbomb')).toHaveText('35.00 Bs');
  });

  test('Estado inicial: precio comienza en precioPromedio sin estado previo', async ({ marketPage }) => {
    // 1. Limpiar localStorage. Navegar a http://localhost:5173/#market
    await marketPage.prepareStorage({ clear: true, items: null, session: null, tradingState: null });
    await marketPage.navigate();
    await expect(marketPage.priceValue('Tequila Shot')).toHaveText('30.00 Bs');
    await expect(marketPage.priceValue('B-52')).toHaveText('40.00 Bs');
  });
});
