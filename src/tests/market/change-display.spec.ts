// spec: pruebas/prueba-con-contexto/test-plan-cocktail-app.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '../../fixtures/test-fixtures';
import { buildCocktail, buildTradingState, defaultCocktails } from '../../utils/test-data';
import { CSS_STATE } from '../../utils/constants';

test.describe('Mercado Público - Cambio 15 minutos y semántica', () => {
  test('Cambio neutro (< 0.5%) muestra guion —', async ({ marketPage }) => {
    // 1. Navegar a #market e identificar un cocktail donde precioActualBs ≈ precioHace15Min (diferencia < 0.5%)
    await marketPage.prepareStorage({
      items: defaultCocktails,
      session: null,
      tradingState: buildTradingState(defaultCocktails, {
        'default-tequila-shot': { precioActualBs: 30.1, precioHace15Min: 30 }
      })
    });
    await marketPage.navigate();

    // 2. Verificar el cambio neutro visible
    await expect(marketPage.changeCell('Tequila Shot')).toContainText('—');
  });

  test('Cambio positivo muestra porcentaje y Bs en verde', async ({ marketPage }) => {
    // 1. Navegar a #market. Verificar la fila de Tequila Shot con cambio positivo visible
    await marketPage.prepareStorage({
      items: defaultCocktails,
      session: null,
      tradingState: buildTradingState(defaultCocktails, {
        'default-tequila-shot': { precioActualBs: 31.05, precioHace15Min: 30 }
      })
    });
    await marketPage.navigate();

    // 2. Verificar el porcentaje y el valor absoluto en verde
    await expect(marketPage.changeCell('Tequila Shot')).toContainText('+3.50%');
    await expect(marketPage.changeCell('Tequila Shot')).toContainText('+1.05 Bs');
    await marketPage.expectChangeCellClass('Tequila Shot', CSS_STATE.changePositive);
  });

  test('Cambio negativo muestra porcentaje y Bs en rojo', async ({ marketPage }) => {
    // 1. Navegar a #market. Verificar la fila de B-52 con cambio negativo visible
    await marketPage.prepareStorage({
      items: defaultCocktails,
      session: null,
      tradingState: buildTradingState(defaultCocktails, {
        'default-b-52': { precioActualBs: 40, precioHace15Min: 40.88 }
      })
    });
    await marketPage.navigate();

    // 2. Verificar el porcentaje y el valor absoluto en rojo
    await expect(marketPage.changeCell('B-52')).toContainText('-2.15%');
    await expect(marketPage.changeCell('B-52')).toContainText('-0.88 Bs');
    await marketPage.expectChangeCellClass('B-52', CSS_STATE.changeNegative);
  });

  test('Cambio porcentual se actualiza cada 15 minutos', async ({ marketPage, page }) => {
    const negroni = buildCocktail({
      nombre: 'Negroni',
      descripcion: 'Gin, vermut rosso y Campari',
      precioMinimo: 20,
      precioPromedio: 30
    });

    // 1. Navegar a #market con un cambio inicial visible
    await page.clock.install();
    await marketPage.prepareStorage({
      items: [negroni],
      session: null,
      tradingState: buildTradingState([negroni], {
        [negroni.id]: {
          precioActualBs: 33,
          precioHace15Min: 30,
          ultimaActualizacion: '2026-05-07T08:00:00.000Z',
          ultimaActualizacion15Min: '2026-05-07T08:00:00.000Z'
        }
      })
    });
    await marketPage.navigate();
    await expect(marketPage.changeCell('Negroni')).toContainText('+10.00%');

    // 2. Avanzar 15 minutos y verificar que el valor de referencia se actualiza
    await page.clock.fastForward(15 * 60 * 1000);
    await expect(marketPage.changeCell('Negroni')).toContainText('—');
  });
});
