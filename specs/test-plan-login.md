# Test Plan - Funcionalidad de Login

## Application Overview

Plan de pruebas para la funcionalidad de login del Admin en Cocktail Admin. La aplicación utiliza credenciales hardcodeadas (username: roger, password: 12345) para acceder al panel de administración. El login es un componente crítico que controla el acceso a todas las operaciones CRUD de cockteles. Este plan cubre casos de éxito, validación de errores, manejo de sesión y comportamientos edge cases.

## Test Scenarios

### 1. Login Happy Path

**Seed:** `src/tests/seed.spec.ts`

#### 1.1. Login exitoso con credenciales válidas

**File:** `tests/login/successful-login.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
    - expect: Se muestra el título 'Cocktail Admin'
    - expect: Se muestra el mensaje 'Inicia sesión para continuar'
  2. Llenar el campo de Usuario con 'roger'
    - expect: El campo de usuario contiene el valor 'roger'
  3. Llenar el campo de Contraseña con '12345'
    - expect: El campo de contraseña está lleno (valores ocultos)
  4. Hacer clic en el botón 'Iniciar sesión'
    - expect: El usuario es autenticado correctamente
    - expect: La página navega al panel admin
    - expect: Se muestra el encabezado 'Cocktail Admin' con logout

### 2. Login Error Validation

**Seed:** `src/tests/seed.spec.ts`

#### 2.1. Mensaje de error con usuario incorrecto

**File:** `tests/login/invalid-username.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
  2. Llenar el campo de Usuario con 'usuarioincorrecto'
    - expect: El campo de usuario contiene el valor 'usuarioincorrecto'
  3. Llenar el campo de Contraseña con '12345'
    - expect: El campo de contraseña está lleno
  4. Hacer clic en el botón 'Iniciar sesión'
    - expect: El usuario NO es autenticado
    - expect: Se muestra el mensaje de error 'Credenciales inválidas. Verifica tu usuario y contraseña.'
    - expect: El usuario permanece en la página de login

#### 2.2. Mensaje de error con contraseña incorrecta

**File:** `tests/login/invalid-password.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
  2. Llenar el campo de Usuario con 'roger'
    - expect: El campo de usuario contiene el valor 'roger'
  3. Llenar el campo de Contraseña con 'contraseñaincorrecta'
    - expect: El campo de contraseña está lleno
  4. Hacer clic en el botón 'Iniciar sesión'
    - expect: El usuario NO es autenticado
    - expect: Se muestra el mensaje de error 'Credenciales inválidas. Verifica tu usuario y contraseña.'
    - expect: El usuario permanece en la página de login

#### 2.3. Mensaje de error con campo Usuario vacío

**File:** `tests/login/empty-username.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
  2. Dejar el campo de Usuario vacío
    - expect: El campo de usuario está vacío
  3. Llenar el campo de Contraseña con '12345'
    - expect: El campo de contraseña está lleno
  4. Hacer clic en el botón 'Iniciar sesión'
    - expect: El usuario NO es autenticado
    - expect: Se muestra el mensaje de error 'Credenciales inválidas. Verifica tu usuario y contraseña.'
    - expect: El usuario permanece en la página de login

#### 2.4. Mensaje de error con campo Contraseña vacío

**File:** `tests/login/empty-password.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
  2. Llenar el campo de Usuario con 'roger'
    - expect: El campo de usuario contiene el valor 'roger'
  3. Dejar el campo de Contraseña vacío
    - expect: El campo de contraseña está vacío
  4. Hacer clic en el botón 'Iniciar sesión'
    - expect: El usuario NO es autenticado
    - expect: Se muestra el mensaje de error 'Credenciales inválidas. Verifica tu usuario y contraseña.'
    - expect: El usuario permanece en la página de login

#### 2.5. Mensaje de error con ambos campos vacíos

**File:** `tests/login/empty-both-fields.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
  2. Dejar ambos campos vacíos (Usuario y Contraseña)
    - expect: Ambos campos están vacíos
  3. Hacer clic en el botón 'Iniciar sesión'
    - expect: El usuario NO es autenticado
    - expect: Se muestra el mensaje de error 'Credenciales inválidas. Verifica tu usuario y contraseña.'
    - expect: El usuario permanece en la página de login
#### 2.6. Sensibilidad a mayúsculas y minúsculas

**File:** `tests/login/case-sensitivity.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
  2. Llenar el campo de Usuario con 'ROGER' (en mayúsculas)
    - expect: El campo de usuario contiene 'ROGER'
  3. Llenar el campo de Contraseña con '12345'
    - expect: El campo de contraseña está lleno
  4. Hacer clic en el botón 'Iniciar sesión'
    - expect: Verifica si el login es sensible a mayúsculas/minúsculas

### 3. Session Management

**Seed:** `src/tests/seed.spec.ts`

#### 3.1. Cierre de sesión con botón Logout

**File:** `tests/login/logout.spec.ts`

**Steps:**
  1. Completar el login con credenciales válidas (roger/12345)
    - expect: El usuario está autenticado en el panel admin
  2. Verificar que existe un botón 'Cerrar sesión' en la barra de navegación
    - expect: El botón 'Cerrar sesión' es visible
  3. Hacer clic en el botón 'Cerrar sesión'
    - expect: El usuario es desconectado
    - expect: La página navega de vuelta a la página de login
    - expect: Se muestra el formulario de login limpio o con campos vacíos

#### 3.2. Acceso a admin sin autenticación redirige al login

**File:** `tests/login/access-admin-without-auth.spec.ts`

**Steps:**
  1. Sin autenticarse, navegar directamente a http://localhost:5173/#admin
    - expect: La página muestra el formulario de login
    - expect: No se muestra el panel admin

#### 3.3. Persistencia de sesión tras recargar la página

**File:** `tests/login/session-persistence.spec.ts`

**Steps:**
  1. Completar el login con credenciales válidas (roger/12345)
    - expect: El usuario está autenticado en el panel admin
  2. Recargar la página (F5 o Ctrl+R)
    - expect: La página permanece en el panel admin
    - expect: El usuario sigue autenticado
    - expect: No es necesario hacer login nuevamente

#### 3.4. Destrucción de sesión al limpiar localStorage

**File:** `tests/login/session-clear-storage.spec.ts`

**Steps:**
  1. Completar el login con credenciales válidas (roger/12345)
    - expect: El usuario está autenticado en el panel admin
  2. Abrir la consola del navegador y ejecutar: localStorage.clear()
    - expect: El localStorage se limpia
  3. Recargar la página
    - expect: El usuario es desconectado
    - expect: La página redirige al login

### 4. Navigation

**Seed:** `src/tests/seed.spec.ts`

#### 4.1. Navegación al mercado desde el admin

**File:** `tests/login/navigate-to-market.spec.ts`

**Steps:**
  1. Completar el login con credenciales válidas (roger/12345)
    - expect: El usuario está autenticado en el panel admin
  2. Hacer clic en el link 'Ver Mercado'
    - expect: La página navega a http://localhost:5173/#market
    - expect: Se muestra el título 'Mercado de Cockteles'
    - expect: Se muestra la tabla con los cockteles

#### 4.2. Acceso al mercado sin autenticación

**File:** `tests/login/access-market-without-auth.spec.ts`

**Steps:**
  1. Navegar directamente a http://localhost:5173/#market
    - expect: La página se carga sin solicitar autenticación
    - expect: Se muestra el mercado de cockteles
    - expect: Se muestra la tabla con los cockteles

#### 4.3. Redirección al mercado si no hay hash

**File:** `tests/login/default-route-market.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/ (sin hash)
    - expect: La página redirecciona automáticamente al mercado (#market)
    - expect: Se muestra el mercado de cockteles

### 5. Input Handling & Edge Cases

**Seed:** `src/tests/seed.spec.ts`

#### 5.1. Espacios en blanco en credenciales

**File:** `tests/login/whitespace-credentials.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
  2. Llenar el campo de Usuario con ' roger ' (con espacios antes y después)
    - expect: El campo contiene los espacios
  3. Llenar el campo de Contraseña con '12345'
    - expect: El campo de contraseña está lleno
  4. Hacer clic en el botón 'Iniciar sesión'
    - expect: rechaza?

#### 5.2. Intento de login múltiple fallido

**File:** `tests/login/multiple-failed-attempts.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
  2. Intentar login con credenciales inválidas 3 veces seguidas
    - expect: Cada intento muestra el error 'Credenciales inválidas'
    - expect: Los campos de entrada permanecen disponibles (sin bloqueo de cuenta)

#### 5.3. Login con caracteres especiales

**File:** `tests/login/special-characters.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
  2. Llenar el campo de Usuario con 'roger<script>alert(1)</script>'
    - expect: El input maneja correctamente caracteres especiales sin ejecutar código
  3. Hacer clic en el botón 'Iniciar sesión'
    - expect: El input es tratado como texto literal
    - expect: No se ejecuta código malicioso

#### 5.4. Envío de formulario con Enter

**File:** `tests/login/submit-with-enter.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: La página de login se carga correctamente
  2. Llenar el campo de Usuario con 'roger'
    - expect: El campo de usuario contiene 'roger'
  3. Llenar el campo de Contraseña con '12345'
    - expect: El campo de contraseña está lleno
  4. Presionar Enter en el campo de contraseña
    - expect: El formulario se envía
    - expect: El login se procesa (tanto si es exitoso como si hay error)
