import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base/base-page';
import { MARKET_ROUTE } from '../../utils/constants';

export class MarketPage extends BasePage {
  readonly marketTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.marketTitle = page.locator('span.app-logo');
  }

  async navigate(): Promise<void> {
    await this.page.goto(MARKET_ROUTE);
  }

  async isMarketTitleVisible(): Promise<void> {
    await expect(this.marketTitle).toBeVisible();
  }

    /**
     * Alias para navigate() - navega al mercado
     */
    async goto(): Promise<void> {
      await this.navigate();
    }

    /**
     * Verifica que la página del mercado esté visible
     */
    async isDisplayed(): Promise<void> {
      await this.isMarketTitleVisible();
    }

    /**
     * Locator para el título del mercado
     */
    get pageTitle(): Locator {
      return this.page.getByText('Mercado de Cockteles');
    }

  async getMarketTitleText(): Promise<string> {
    return (await this.marketTitle.textContent())?.trim() ?? '';
  }
}
