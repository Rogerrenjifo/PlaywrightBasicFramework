import { test as base } from '@playwright/test';
import { MarketPage } from '../pages/market/market-page';
import { LoginPage } from '../pages/login/login-page';
import { AdminPage } from '../pages/admin/admin-page';

type TestFixtures = {
  marketPage: MarketPage;
  loginPage: LoginPage;
  adminPage: AdminPage;
};

export const test = base.extend<TestFixtures>({
  marketPage: async ({ page }, use) => {
    await use(new MarketPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  }
});

export { expect } from '@playwright/test';
