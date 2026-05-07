import { test, expect } from '../../fixtures/test-fixtures';
import { marketData } from '../../utils/test-data';

test('navega al market y valida titulo visible con texto esperado', async ({ marketPage }) => {
  await marketPage.navigate();

  await marketPage.isMarketTitleVisible();

  const title = await marketPage.getMarketTitleText();
  expect(title).toBe(marketData.title);
});
