import { Page, expect } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly adminUrl = 'http://localhost:5173/#admin';

  constructor(page: Page) {
    this.page = page;
  }

  get logoutButton() {
    return this.page.getByTestId('btn-logout');
  }

  get marketLink() {
    return this.page.getByRole('link', { name: 'Ver Mercado' });
  }

  get addCocktailHeading() {
    return this.page.getByRole('heading', { name: '➕ Agregar cocktail' });
  }

  get registeredCocktailsHeading() {
    return this.page.getByRole('heading', { name: 'Cockteles registrados' });
  }

  get saveButton() {
    return this.page.getByTestId('btn-guardar');
  }

  /**
   * Verifica que el panel admin está visible
   */
  async isDisplayed(): Promise<void> {
    await expect(this.addCocktailHeading).toBeVisible();
    await expect(this.registeredCocktailsHeading).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  /**
   * Verifica que todos los campos del formulario están presentes
   */
  async verifyFormFields(): Promise<void> {
    await expect(this.page.getByText('Nombre del cocktail')).toBeVisible();
    await expect(this.page.getByText('Descripción')).toBeVisible();
    await expect(this.page.getByText('Precio mínimo')).toBeVisible();
    await expect(this.page.getByText('Precio promedio')).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  /**
   * Verifica que los cockteles por defecto están listados
   */
  async verifyDefaultCocktails(): Promise<void> {
    await expect(this.page.getByText('Tequila shot')).toBeVisible();
    await expect(this.page.getByText('Jagerbomb')).toBeVisible();
    await expect(this.page.getByText('B-52')).toBeVisible();
  }

  /**
   * Hace clic en el botón de logout
   */
  async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }

  /**
   * Navega al mercado
   */
  async navigateToMarket(): Promise<void> {
    await this.marketLink.click();
  }
}
