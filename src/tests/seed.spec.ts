import { test, expect } from '../fixtures/test-fixtures';
import { marketData } from '../utils/test-data';

test.describe('Test group', () => {
  test('seed', async ({ marketPage }) => {
    await marketPage.navigate();
    await marketPage.isMarketTitleVisible();

    const title = await marketPage.getMarketTitleText();
    expect(title).toBe(marketData.title);
  });
});
