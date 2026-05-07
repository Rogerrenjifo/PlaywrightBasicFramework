export const ADMIN_ROUTE = '/#admin';
export const MARKET_ROUTE = '/#market';
export const BASE_ROUTE = '/';

export const EXPECTED_ADMIN_TITLE = 'Cocktail Admin';
export const EXPECTED_MARKET_TITLE = 'Mercado de Cockteles';
export const MARKET_INSTRUCTION_TEXT = 'Haz click en un cocktail para comprar. El precio fluctua con deriva y volatilidad.';

export const STORAGE_KEYS = {
  items: 'cocktail-app-items',
  session: 'cocktail-app-session',
  trading: 'cocktail-user-trading-state'
} as const;

export const CSS_STATE = {
  priceUp: 'precio-up',
  priceDown: 'precio-down',
  changePositive: 'positivo',
  changeNegative: 'negativo'
} as const;
