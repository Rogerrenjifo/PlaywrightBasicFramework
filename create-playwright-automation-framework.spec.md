# Create Playwright Automation Framework (POM)

## 1. Dependencias
- `package.json` con `@playwright/test`
- Script `npm install` para instalar

## 2. Configuración
- `playwright.config.ts`:
  - `baseURL`: `http://localhost:5173`
  - `testDir`: `./src/tests`
  - `reporter`: `html` (default)
  - `workers`: 1
  - `use`: `headless: false` por defecto (modo visible), screenshot on failure

## 3. Page Object Model
- `src/pages/base/base-page.ts` - clase base abstracta
  - Constructor con `page` de Playwright
- `src/pages/market/market-page.ts` - POM específico
  - Locator `marketTitle = page.getByTestId('market-title')`
  - `async navigate()` -> `await this.page.goto('/#market')`
  - `async isMarketTitleVisible()` -> validación del locator visible

## 4. Utilidades y Fixtures (estructura más elaborada)
- `src/fixtures/test-fixtures.ts`:
  - Extiende `test` de Playwright e inyecta `marketPage`
- `src/utils/constants.ts`:
  - Constantes de rutas y textos esperados (`/#market`, `Mercado de Cockteles`)
- `src/utils/test-data.ts`:
  - Datos de prueba reutilizables

## 5. Primer Test
- `src/tests/market/navigate-to-market.spec.ts`:
  - Navega a `/#market`
  - Verifica: `span.app-logo` visible
  - Verifica: texto === "Mercado de Cockteles"

## 6. Estructura final
```
├── package.json
├── playwright.config.ts
├── src/
│   ├── fixtures/
│   │   └── test-fixtures.ts
│   ├── pages/
│   │   ├── base/
│   │   │   └── base-page.ts
│   │   └── market/
│   │       └── market-page.ts
│   ├── tests/
│   │   └── market/
│   │       └── navigate-to-market.spec.ts
│   └── utils/
│       ├── constants.ts
│       └── test-data.ts
```
