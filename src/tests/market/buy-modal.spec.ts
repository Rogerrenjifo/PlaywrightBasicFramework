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

test.describe('Mercado Público - Modal de compra', () => {
  test('Abrir modal de compra al hacer clic en una fila', async ({ marketPage }) => {
    // 1. Navegar a http://localhost:5173/#market
    await openMarket(marketPage, {
      'default-tequila-shot': { precioActualBs: 30, precioHace15Min: 29 }
    });
    await marketPage.expectMarketVisible();

    // 2. Hacer clic en la fila de 'Tequila Shot'
    await marketPage.openBuyModal('Tequila Shot');
    await marketPage.expectBuyModalVisible('Tequila Shot');
    await expect(marketPage.appPage.getByText('30.00 Bs')).toBeVisible();
    await expect(marketPage.quantityInput).toHaveValue('1');
    await expect(marketPage.appPage.getByText('Total: 30.00 Bs')).toBeVisible();
  });

  test('Total estimado se calcula correctamente al ingresar cantidad', async ({ marketPage }) => {
    // 1. Abrir el modal de compra de 'Jagerbomb' (precio 30.00 Bs)
    await openMarket(marketPage, {
      'default-jagerbomb': { precioActualBs: 30, precioHace15Min: 30 }
    });
    await marketPage.openBuyModal('Jagerbomb');
    await marketPage.expectBuyModalVisible('Jagerbomb');

    // 2. Cambiar la cantidad a 3
    await marketPage.setQuantity('3');
    await expect(marketPage.appPage.getByText('Total: 90.00 Bs')).toBeVisible();

    // 3. Cambiar la cantidad a 5
    await marketPage.setQuantity('5');
    await expect(marketPage.appPage.getByText('Total: 150.00 Bs')).toBeVisible();
  });

  test('Comprar 1 unidad incrementa el precio en 1 Bs', async ({ marketPage }) => {
    // 1. Navegar a #market. Anotar el precio actual de 'Tequila Shot'
    await openMarket(marketPage, {
      'default-tequila-shot': { precioActualBs: 30, precioHace15Min: 29 }
    });
    const initialPrice = await marketPage.getCurrentPriceText('Tequila Shot');
    expect(initialPrice).toBe('30.00 Bs');

    // 2. Hacer clic en la fila de 'Tequila Shot', verificar cantidad=1 y hacer clic en 'Comprar'
    await marketPage.openBuyModal('Tequila Shot');
    await expect(marketPage.quantityInput).toHaveValue('1');
    await marketPage.clickBuy();
    await expect(marketPage.appPage.getByText(/Compra ejecutada/i)).toBeVisible();
    await expect(marketPage.priceValue('Tequila Shot')).toHaveText('31.00 Bs');
  });

  test('Comprar múltiples unidades incrementa el precio según la cantidad', async ({ marketPage }) => {
    // 1. Abrir el modal de 'Jagerbomb', anotar el precio actual
    await openMarket(marketPage, {
      'default-jagerbomb': { precioActualBs: 30, precioHace15Min: 30 }
    });
    await marketPage.openBuyModal('Jagerbomb');

    // 2. Cambiar la cantidad a 3 y hacer clic en 'Comprar'
    await marketPage.setQuantity('3');
    await marketPage.clickBuy();
    await expect(marketPage.appPage.getByText(/Compra ejecutada/i)).toBeVisible();
    await expect(marketPage.priceValue('Jagerbomb')).toHaveText('33.00 Bs');
  });

  test('Cerrar modal con botón ✕ y regresar a la tabla', async ({ marketPage }) => {
    // 1. Abrir el modal de compra de 'B-52'
    await openMarket(marketPage);
    await marketPage.openBuyModal('B-52');
    await marketPage.expectBuyModalVisible('B-52');

    // 2. Hacer clic en el botón '✕' (Cerrar) en la esquina del modal
    await marketPage.closeWithX();
    await marketPage.expectModalClosed('B-52');
    await expect(marketPage.marketTable).toBeVisible();
  });

  test('Cerrar modal con botón Cerrar inferior y regresar a la tabla', async ({ marketPage }) => {
    // 1. Abrir el modal de compra de 'Tequila Shot'
    await openMarket(marketPage);
    await marketPage.openBuyModal('Tequila Shot');
    await marketPage.expectBuyModalVisible('Tequila Shot');

    // 2. Hacer clic en el botón 'Cerrar' en la parte inferior del modal
    await marketPage.closeWithFooterButton();
    await marketPage.expectModalClosed('Tequila Shot');
    await expect(marketPage.marketTable).toBeVisible();
  });

  test('Rechazar compra con cantidad vacía', async ({ marketPage }) => {
    // 1. Abrir el modal de 'Tequila Shot' y borrar el valor del campo cantidad dejándolo vacío
    await openMarket(marketPage, {
      'default-tequila-shot': { precioActualBs: 30, precioHace15Min: 29 }
    });
    const initialPrice = await marketPage.getCurrentPriceText('Tequila Shot');
    await marketPage.openBuyModal('Tequila Shot');
    await marketPage.setQuantity('');

    // 2. Hacer clic en 'Comprar'
    await marketPage.clickBuy();
    await marketPage.expectBuyValidation('La cantidad debe ser un entero mayor que 0.');
    await expect(marketPage.priceValue('Tequila Shot')).toHaveText(initialPrice);
  });

  test('Rechazar compra con cantidad cero', async ({ marketPage }) => {
    // 1. Abrir el modal de 'Jagerbomb' e ingresar cantidad 0
    await openMarket(marketPage);
    await marketPage.openBuyModal('Jagerbomb');
    await marketPage.setQuantity('0');

    // 2. Hacer clic en 'Comprar'
    await marketPage.clickBuy();
    await marketPage.expectBuyValidation(/cantidad debe ser un entero mayor que 0|mayor que cero/i);
  });

  test('Rechazar compra con cantidad negativa', async ({ marketPage }) => {
    // 1. Abrir el modal de 'B-52' e ingresar cantidad -2
    await openMarket(marketPage);
    await marketPage.openBuyModal('B-52');
    await marketPage.setQuantity('-2');

    // 2. Hacer clic en 'Comprar'
    await marketPage.clickBuy();
    await marketPage.expectBuyValidation(/cantidad debe ser un entero mayor que 0|inválida/i);
  });

  test('Rechazar compra con cantidad decimal', async ({ marketPage }) => {
    // 1. Abrir el modal de 'Tequila Shot' e ingresar cantidad 1.5
    await openMarket(marketPage);
    await marketPage.openBuyModal('Tequila Shot');
    await marketPage.setQuantity('1.5');

    // 2. Hacer clic en 'Comprar'
    await marketPage.clickBuy();
    await marketPage.expectBuyValidation(/entero|cantidad debe ser un entero mayor que 0/i);
  });
});
