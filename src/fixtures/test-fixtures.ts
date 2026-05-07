import { test as base } from '@playwright/test';
import { AdminPage } from '../pages/admin-page';
import { MarketPage } from '../pages/market-page';

type TestFixtures = {
  adminPage: AdminPage;
  marketPage: MarketPage;
};

export const test = base.extend<TestFixtures>({
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },
  marketPage: async ({ page }, use) => {
    await use(new MarketPage(page));
  }
});

export { expect } from '@playwright/test';
