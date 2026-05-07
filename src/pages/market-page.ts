import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base-page';
import { MARKET_ROUTE } from '../utils/constants';

export class MarketPage extends BasePage {
  readonly marketTitle: Locator;
  readonly instructionText: Locator;
  readonly lastTickText: Locator;
  readonly marketTable: Locator;
  readonly quantityInput: Locator;
  readonly buyButton: Locator;
  readonly modalCloseButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.marketTitle = page.getByText('Mercado de Cockteles', { exact: true });
    this.instructionText = page.getByText('Haz click en un cocktail para comprar. El precio fluctua con deriva y volatilidad.');
    this.lastTickText = page.getByText(/^Último tick:/);
    this.marketTable = page.getByRole('table');
    this.quantityInput = page.getByRole('spinbutton', { name: 'Cantidad' });
    this.buyButton = page.getByRole('button', { name: 'Comprar' });
    this.modalCloseButtons = page.getByRole('button', { name: 'Cerrar' });
  }

  async navigate(): Promise<void> {
    await this.page.goto(MARKET_ROUTE);
  }

  async isMarketTitleVisible(): Promise<void> {
    await expect(this.marketTitle).toBeVisible();
  }

  async getMarketTitleText(): Promise<string> {
    return (await this.marketTitle.textContent())?.trim() ?? '';
  }

  async expectMarketVisible(): Promise<void> {
    await expect(this.marketTitle).toBeVisible();
    await expect(this.instructionText).toBeVisible();
    await expect(this.marketTable).toBeVisible();
  }

  row(nombre: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(`^${this.escapeRegex(nombre)}\\b`) });
  }

  priceCell(nombre: string): Locator {
    return this.row(nombre).locator('td').nth(1);
  }

  changeCell(nombre: string): Locator {
    return this.row(nombre).locator('td').nth(2);
  }

  volumeCell(nombre: string): Locator {
    return this.row(nombre).locator('td').nth(3);
  }

  priceValue(nombre: string): Locator {
    return this.priceCell(nombre).locator('span').first();
  }

  changePercent(nombre: string): Locator {
    return this.changeCell(nombre).locator('.market-cambio-percent').first();
  }

  changeAbsolute(nombre: string): Locator {
    return this.changeCell(nombre).locator('span').last();
  }

  modal(nombre: string): Locator {
    return this.page.locator(`xpath=//div[.//h3[normalize-space()="${nombre}"] and .//button[normalize-space()="Comprar"]][1]`);
  }

  async openBuyModal(nombre: string): Promise<void> {
    await this.row(nombre).click();
  }

  async expectBuyModalVisible(nombre: string): Promise<void> {
    await expect(this.modal(nombre).getByRole('heading', { name: nombre })).toBeVisible();
    await expect(this.quantityInput).toBeVisible();
    await expect(this.buyButton).toBeVisible();
    await expect(this.modalCloseButtons.first()).toBeVisible();
  }

  async setQuantity(value: string): Promise<void> {
    await this.quantityInput.fill(value);
  }

  async clickBuy(): Promise<void> {
    await this.buyButton.click();
  }

  async closeWithX(): Promise<void> {
    await this.modalCloseButtons.first().click();
  }

  async closeWithFooterButton(): Promise<void> {
    await this.modalCloseButtons.last().click();
  }

  async expectModalClosed(nombre: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: nombre })).toHaveCount(0);
  }

  async getCurrentPriceText(nombre: string): Promise<string> {
    return (await this.priceValue(nombre).textContent())?.trim() ?? '';
  }

  async expectHeaders(headers: string[]): Promise<void> {
    for (const header of headers) {
      await expect(this.page.getByRole('columnheader', { name: header })).toBeVisible();
    }
  }

  async expectPriceCellClass(nombre: string, className: string): Promise<void> {
    await expect(this.priceCell(nombre)).toHaveClass(new RegExp(className));
  }

  async expectChangeCellClass(nombre: string, className: string): Promise<void> {
    await expect(this.changeCell(nombre)).toHaveClass(new RegExp(className));
  }

  async expectSparklineVisible(nombre: string): Promise<void> {
    await expect(this.priceCell(nombre).getByRole('img')).toBeVisible();
  }

  async expectVolume(nombre: string, volume: string, operations: string): Promise<void> {
    await expect(this.volumeCell(nombre)).toContainText(volume);
    await expect(this.volumeCell(nombre)).toContainText(operations);
  }

  async expectBuyValidation(message: string | RegExp): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
