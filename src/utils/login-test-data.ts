export const LOGIN_CREDENTIALS = {
  valid: {
    username: 'roger',
    password: '12345'
  },
  invalid: {
    username: 'usuarioincorrecto',
    password: 'contraseñaincorrecta'
  },
  partial: {
    validUsername: 'roger',
    invalidPassword: 'contraseñaincorrecta'
  }
};

export const TEST_DATA = {
  urls: {
    admin: 'http://localhost:5173/#admin',
    market: 'http://localhost:5173/#market',
    home: 'http://localhost:5173/'
  },
  messages: {
    loginRequired: 'Inicia sesión para continuar',
    invalidCredentials: 'Credenciales inválidas. Verifica tu usuario y contraseña.'
  },
  defaultCocktails: ['Tequila Shot', 'Jagerbomb', 'B-52'],
  timeout: 5000
};
