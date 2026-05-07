import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base-page';
import { ADMIN_ROUTE, EXPECTED_ADMIN_TITLE } from '../utils/constants';
import { adminCredentials } from '../utils/test-data';

type CocktailFormData = {
  nombre?: string;
  descripcion?: string;
  precioMinimo?: number | string;
  precioPromedio?: number | string;
};

type CocktailDetails = {
  descripcion?: string;
  minPrice?: string;
  avgPrice?: string;
};

export class AdminPage extends BasePage {
  readonly loginHeading: Locator;
  readonly introText: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly invalidLoginMessage: Locator;
  readonly adminHeader: Locator;
  readonly marketLink: Locator;
  readonly logoutButton: Locator;
  readonly formHeading: Locator;
  readonly createHeading: Locator;
  readonly editHeading: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly minPriceInput: Locator;
  readonly avgPriceInput: Locator;
  readonly saveButton: Locator;
  readonly updateButton: Locator;
  readonly cancelEditButton: Locator;
  readonly registeredHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.loginHeading = page.getByRole('heading', { name: EXPECTED_ADMIN_TITLE });
    this.introText = page.getByText('Inicia sesión para continuar');
    this.usernameInput = page.getByRole('textbox', { name: 'Usuario' });
    this.passwordInput = page.getByRole('textbox', { name: 'Contraseña' });
    this.loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
    this.invalidLoginMessage = page.getByText('Credenciales inválidas. Verifica tu usuario y contraseña.');
    this.adminHeader = page.getByText('🍹 Cocktail Admin');
    this.marketLink = page.getByRole('link', { name: 'Ver Mercado' });
    this.logoutButton = page.getByRole('button', { name: 'Cerrar sesión' });
    this.formHeading = page.locator('main h2').first();
    this.createHeading = page.getByRole('heading', { name: '➕ Agregar cocktail' });
    this.editHeading = page.getByRole('heading', { name: '✏️ Editar cocktail' });
    this.nameInput = page.getByRole('textbox', { name: 'Nombre del cocktail' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Descripción' });
    this.minPriceInput = page.getByRole('spinbutton', { name: 'Precio mínimo' });
    this.avgPriceInput = page.getByRole('spinbutton', { name: 'Precio promedio' });
    this.saveButton = page.getByRole('button', { name: 'Guardar' });
    this.updateButton = page.getByRole('button', { name: 'Actualizar' });
    this.cancelEditButton = page.getByRole('button', { name: 'Cancelar edición' });
    this.registeredHeading = page.getByRole('heading', { name: 'Cockteles registrados' });
  }

  async navigate(): Promise<void> {
    await this.page.goto(ADMIN_ROUTE);
  }

  async expectLoginVisible(): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.introText).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectAdminVisible(): Promise<void> {
    await expect(this.adminHeader).toBeVisible();
    await expect(this.marketLink).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
    await expect(this.registeredHeading).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsAdmin(): Promise<void> {
    await this.login(adminCredentials.username, adminCredentials.password);
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async fillCocktailForm(data: CocktailFormData): Promise<void> {
    await this.nameInput.fill(data.nombre ?? '');
    await this.descriptionInput.fill(data.descripcion ?? '');
    await this.minPriceInput.fill(data.precioMinimo === undefined ? '' : String(data.precioMinimo));
    await this.avgPriceInput.fill(data.precioPromedio === undefined ? '' : String(data.precioPromedio));
  }

  async expectFormValues(data: Required<CocktailFormData>): Promise<void> {
    await expect(this.nameInput).toHaveValue(data.nombre);
    await expect(this.descriptionInput).toHaveValue(data.descripcion);
    await expect(this.minPriceInput).toHaveValue(String(data.precioMinimo));
    await expect(this.avgPriceInput).toHaveValue(String(data.precioPromedio));
  }

  async expectCreateMode(): Promise<void> {
    await expect(this.createHeading).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  async expectEditMode(data: Required<CocktailFormData>): Promise<void> {
    await expect(this.editHeading).toBeVisible();
    await expect(this.updateButton).toBeVisible();
    await expect(this.cancelEditButton).toBeVisible();
    await this.expectFormValues(data);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async update(): Promise<void> {
    await this.updateButton.click();
  }

  async cancelEdit(): Promise<void> {
    await this.cancelEditButton.click();
  }

  async expectValidationMessage(message: string | RegExp): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectCreateFormReset(): Promise<void> {
    await expect(this.nameInput).toHaveValue('');
    await expect(this.descriptionInput).toHaveValue('');
    await expect(this.minPriceInput).toHaveValue('');
    await expect(this.avgPriceInput).toHaveValue('');
  }

  async expectCocktailCount(count: number): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Editar' })).toHaveCount(count);
  }

  card(nombre: string): Locator {
    return this.page.locator(`xpath=//main//div[.//button[normalize-space()="Editar"] and .//*[normalize-space()="${nombre}"]][1]`);
  }

  async expectCocktailVisible(nombre: string): Promise<void> {
    await expect(this.card(nombre)).toContainText(nombre);
  }

  async expectCocktailMissing(nombre: string): Promise<void> {
    await expect(this.page.getByText(nombre, { exact: true })).toHaveCount(0);
  }

  async expectCocktailDetails(nombre: string, details: CocktailDetails): Promise<void> {
    const card = this.card(nombre);

    await expect(card).toContainText(nombre);

    if (details.descripcion) {
      await expect(card).toContainText(details.descripcion);
    }

    if (details.minPrice) {
      await expect(card).toContainText(`Mín:${details.minPrice}`);
    }

    if (details.avgPrice) {
      await expect(card).toContainText(`Prom:${details.avgPrice}`);
    }
  }

  async startEdit(nombre: string): Promise<void> {
    await this.card(nombre).getByRole('button', { name: 'Editar' }).click();
  }

  async deleteCocktail(nombre: string, confirmDelete: boolean): Promise<void> {
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.card(nombre).getByRole('button', { name: 'Eliminar' }).click();
    const dialog = await dialogPromise;

    if (confirmDelete) {
      await dialog.accept();
      return;
    }

    await dialog.dismiss();
  }
}
