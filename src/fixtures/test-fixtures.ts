import { test as base } from '@playwright/test';
import { MarketPage } from '../pages/market/market-page';

type TestFixtures = {
  marketPage: MarketPage;
};

export const test = base.extend<TestFixtures>({
  marketPage: async ({ page }, use) => {
    await use(new MarketPage(page));
  }
});

export { expect } from '@playwright/test';
