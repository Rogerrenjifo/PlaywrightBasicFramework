import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginUrl = 'http://localhost:5173/#admin';

  constructor(page: Page) {
    this.page = page;
  }

  // Locators as getters to avoid initialization issues
  get usernameInput() {
    return this.page.getByTestId('input-username');
  }

  get passwordInput() {
    return this.page.getByTestId('input-password');
  }

  get loginButton() {
    return this.page.getByTestId('btn-login');
  }

  get errorMessage() {
    return this.page.getByText('Credenciales inválidas. Verifica tu usuario y contraseña.');
  }

  get pageTitle() {
    return this.page.getByRole('heading', { name: /Cocktail/ });
  }

  get loginSubtitle() {
    return this.page.getByText('Inicia sesión para continuar');
  }

  /**
   * Navega a la página de login
   */
  async goto(): Promise<void> {
    await this.page.goto(this.loginUrl);
    await this.isDisplayed();
  }

  /**
   * Verifica que la página de login esté visible
   */
  async isDisplayed(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.loginSubtitle).toBeVisible();
    // await expect(this.pageTitle).;
  }

  /**
   * Rellena el campo de usuario
   */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Rellena el campo de contraseña
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Hace clic en el botón de login
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Realiza el login completo con credenciales
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Verifica que el error de credenciales inválidas sea visible
   */
  async verifyErrorMessage(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }

  /**
   * Verifica que NO hay error visible
   */
  async verifyNoError(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }

  /**
   * Limpia ambos campos de entrada
   */
  async clearFields(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Obtiene el valor del campo de usuario
   */
  async getUsernameValue(): Promise<string> {
    return await this.usernameInput.inputValue();
  }

  /**
   * Obtiene el valor del campo de contraseña
   */
  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  /**
   * Presiona Enter en el campo de contraseña
   */
  async submitWithEnter(): Promise<void> {
    await this.passwordInput.press('Enter');
  }

  /**
   * Selecciona todo el texto en un campo
   */
  async selectAllInUsername(): Promise<void> {
    await this.usernameInput.click();
    await this.page.keyboard.press('Control+a');
  }
}
