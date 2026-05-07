# Plan de Pruebas - Cocktail Admin & Mercado

## Application Overview

Aplicación frontend-only construida con React 18 y Vite. Persiste datos en localStorage sin backend. Expone dos vistas principales mediante hash routing: #admin (gestión CRUD de cockteles con autenticación) y #market (mercado público de tipo trading con precios dinámicos en Bolivianos). Los tres cockteles por defecto son Tequila Shot, Jagerbomb y B-52. No existen atributos data-testid; las pruebas deben usar selectores CSS, roles ARIA o jerarquía de elementos.

## Test Scenarios

### 1. Admin - Autenticación

**Seed:** `src/tests/seed.spec.ts`

#### 1.1. Login exitoso con credenciales válidas

**File:** `specs/admin/auth.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: Se muestra el formulario de login con campos 'Usuario' y 'Contraseña' y botón 'Iniciar sesión'
  2. Ingresar 'roger' en el campo 'Usuario'
  3. Ingresar '12345' en el campo 'Contraseña'
  4. Hacer clic en 'Iniciar sesión'
    - expect: Se muestra la pantalla de administración con el encabezado '🍹 Cocktail Admin'
    - expect: Se muestran los botones 'Ver Mercado' y 'Cerrar sesión' en el header
    - expect: Se muestra el formulario 'Agregar cocktail' y la sección 'Cockteles registrados'

#### 1.2. Login fallido con contraseña incorrecta

**File:** `specs/admin/auth.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: Se muestra el formulario de login
  2. Ingresar 'roger' en el campo 'Usuario'
  3. Ingresar '00000' en el campo 'Contraseña'
  4. Hacer clic en 'Iniciar sesión'
    - expect: No se accede a la pantalla de administración
    - expect: Se muestra un mensaje de error indicando credenciales inválidas

#### 1.3. Login fallido con usuario vacío

**File:** `specs/admin/auth.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin
    - expect: Se muestra el formulario de login
  2. Dejar el campo 'Usuario' vacío y la 'Contraseña' en '12345'
  3. Hacer clic en 'Iniciar sesión'
    - expect: No se accede a la pantalla de administración
    - expect: Se muestra feedback de error

#### 1.4. Persistencia de sesión tras recargar página

**File:** `specs/admin/auth.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#admin e iniciar sesión con roger / 12345
    - expect: Se muestra la pantalla de administración
  2. Recargar la página (F5 o navegación a la misma URL)
    - expect: La sesión se mantiene activa
    - expect: Se muestra la pantalla de administración sin volver a pedir credenciales

#### 1.5. Cerrar sesión y regresar al login

**File:** `specs/admin/auth.spec.ts`

**Steps:**
  1. Iniciar sesión como roger / 12345 en #admin
    - expect: Se muestra la pantalla de administración
  2. Hacer clic en 'Cerrar sesión'
    - expect: Se muestra nuevamente el formulario de login
    - expect: No se accede a la pantalla de administración sin autenticarse de nuevo

#### 1.6. Los cockteles persisten después de cerrar y volver a iniciar sesión

**File:** `specs/admin/auth.spec.ts`

**Steps:**
  1. Iniciar sesión como roger / 12345
  2. Verificar que existe el cocktail 'Tequila Shot' en el listado
    - expect: El cocktail 'Tequila Shot' es visible
  3. Hacer clic en 'Cerrar sesión' y volver a iniciar sesión con roger / 12345
    - expect: El cocktail 'Tequila Shot' sigue apareciendo en el listado después del re-login

### 2. Admin - Catálogo por defecto

**Seed:** `src/tests/seed.spec.ts`

#### 2.1. Mostrar tres cockteles por defecto al primer acceso

**File:** `specs/admin/default-catalog.spec.ts`

**Steps:**
  1. Limpiar localStorage del navegador para simular primer acceso, luego navegar a http://localhost:5173/#admin
  2. Iniciar sesión con roger / 12345
    - expect: Se muestran exactamente tres cockteles en el listado: Tequila Shot, Jagerbomb y B-52
  3. Verificar la ficha de 'Tequila Shot'
    - expect: Precio mínimo: $10.00
    - expect: Precio promedio: $30.00
    - expect: Descripción: 'El clasico con sal y limon. Simple pero infalible.'
  4. Verificar la ficha de 'Jagerbomb'
    - expect: Precio mínimo: $20.00
    - expect: Precio promedio: $30.00
  5. Verificar la ficha de 'B-52'
    - expect: Precio mínimo: $25.00
    - expect: Precio promedio: $40.00

#### 2.2. El catálogo por defecto no sobreescribe datos existentes

**File:** `specs/admin/default-catalog.spec.ts`

**Steps:**
  1. Iniciar sesión y crear un cocktail con nombre 'Mojito Test'
    - expect: El cocktail 'Mojito Test' aparece en el listado
  2. Recargar la página e iniciar sesión nuevamente
    - expect: El cocktail 'Mojito Test' sigue presente
    - expect: Los tres cockteles por defecto también están presentes
    - expect: No hay duplicados de los cockteles por defecto

### 3. Admin - Crear cocktail

**Seed:** `src/tests/seed.spec.ts`

#### 3.1. Crear un cocktail con datos válidos

**File:** `specs/admin/create-cocktail.spec.ts`

**Steps:**
  1. Iniciar sesión con roger / 12345 en #admin
    - expect: Se muestra el formulario 'Agregar cocktail'
  2. Completar el formulario: Nombre='Mojito Clásico', Descripción='Ron, hierbabuena y limón', Precio mínimo=8, Precio promedio=12
  3. Hacer clic en 'Guardar'
    - expect: El cocktail 'Mojito Clásico' aparece en la sección 'Cockteles registrados'
    - expect: El formulario se limpia para una nueva entrada
    - expect: Los precios se muestran correctamente: Mín $8.00, Prom $12.00

#### 3.2. El cocktail creado persiste al recargar la página

**File:** `specs/admin/create-cocktail.spec.ts`

**Steps:**
  1. Iniciar sesión y crear un cocktail con nombre 'Gimlet Test'
    - expect: El cocktail aparece en el listado
  2. Recargar la página e iniciar sesión nuevamente
    - expect: El cocktail 'Gimlet Test' sigue presente en el listado

#### 3.3. No permitir crear cocktail sin nombre

**File:** `specs/admin/create-cocktail.spec.ts`

**Steps:**
  1. Iniciar sesión y dejar el campo 'Nombre del cocktail' vacío. Completar los demás campos con valores válidos
  2. Hacer clic en 'Guardar'
    - expect: Se muestra un mensaje de validación indicando que el nombre es obligatorio
    - expect: El cocktail no se guarda en el listado

#### 3.4. No permitir nombre duplicado (case-insensitive)

**File:** `specs/admin/create-cocktail.spec.ts`

**Steps:**
  1. Iniciar sesión. El cocktail 'Tequila Shot' ya existe por defecto
  2. Completar el formulario con nombre='tequila shot' (minúsculas), valores de precio válidos y hacer clic en 'Guardar'
    - expect: Se muestra mensaje de validación por nombre duplicado
    - expect: El cocktail no se guarda

#### 3.5. No permitir precio mínimo mayor que precio promedio

**File:** `specs/admin/create-cocktail.spec.ts`

**Steps:**
  1. Iniciar sesión y completar el formulario: Nombre='Aperol Spritz', Precio mínimo=20, Precio promedio=10
  2. Hacer clic en 'Guardar'
    - expect: Se muestra mensaje de validación: precio mínimo debe ser <= precio promedio
    - expect: El cocktail no se guarda

#### 3.6. No permitir precio mínimo negativo

**File:** `specs/admin/create-cocktail.spec.ts`

**Steps:**
  1. Completar el formulario con Nombre='Boulevardier', Precio mínimo=-1, Precio promedio=9 y hacer clic en 'Guardar'
    - expect: Se muestra mensaje de validación: los precios deben ser positivos
    - expect: El cocktail no se guarda

#### 3.7. No permitir precio promedio cero o negativo

**File:** `specs/admin/create-cocktail.spec.ts`

**Steps:**
  1. Completar el formulario con Nombre='Sidecar', Precio mínimo=4, Precio promedio=0 y hacer clic en 'Guardar'
    - expect: Se muestra mensaje de validación: los precios deben ser positivos
    - expect: El cocktail no se guarda

### 4. Admin - Editar cocktail

**Seed:** `src/tests/seed.spec.ts`

#### 4.1. Editar un cocktail existente con datos válidos

**File:** `specs/admin/edit-cocktail.spec.ts`

**Steps:**
  1. Iniciar sesión. En la ficha de 'Tequila Shot' hacer clic en 'Editar'
    - expect: El formulario se popula con los datos actuales de 'Tequila Shot'
    - expect: El botón cambia a 'Actualizar' o similar
  2. Cambiar la Descripción a 'Descripción actualizada para test' y hacer clic en 'Actualizar'
    - expect: La ficha de 'Tequila Shot' muestra la nueva descripción
    - expect: Los demás campos se mantienen sin cambios

#### 4.2. Los cambios de edición persisten tras recargar

**File:** `specs/admin/edit-cocktail.spec.ts`

**Steps:**
  1. Editar 'Jagerbomb': cambiar Precio promedio a 35 y guardar
    - expect: La ficha muestra Prom: $35.00
  2. Recargar la página e iniciar sesión nuevamente
    - expect: La ficha de 'Jagerbomb' sigue mostrando Prom: $35.00

#### 4.3. Cancelar edición en curso sin guardar cambios

**File:** `specs/admin/edit-cocktail.spec.ts`

**Steps:**
  1. Hacer clic en 'Editar' para 'B-52'
    - expect: El formulario se popula con los datos de 'B-52'
  2. Modificar el campo Descripción a 'Cambio temporal que no debe guardarse'
  3. Hacer clic en 'Cancelar edición'
    - expect: El formulario vuelve al modo crear (campos vacíos o resetados)
    - expect: La ficha de 'B-52' mantiene su descripción original
    - expect: No se guarda el cambio temporal

#### 4.4. No permitir editar con nombre duplicado de otro cocktail

**File:** `specs/admin/edit-cocktail.spec.ts`

**Steps:**
  1. Hacer clic en 'Editar' para 'Jagerbomb'
  2. Cambiar el nombre a 'Tequila Shot' (nombre de otro cocktail existente) y hacer clic en 'Actualizar'
    - expect: Se muestra mensaje de validación por nombre duplicado
    - expect: El cocktail no se actualiza

### 5. Admin - Eliminar cocktail

**Seed:** `src/tests/seed.spec.ts`

#### 5.1. Eliminar un cocktail confirmando la acción

**File:** `specs/admin/delete-cocktail.spec.ts`

**Steps:**
  1. Iniciar sesión y crear un cocktail con nombre 'Margarita Test'
    - expect: El cocktail aparece en el listado
  2. Hacer clic en 'Eliminar' para 'Margarita Test' y confirmar la eliminación
    - expect: El cocktail 'Margarita Test' desaparece del listado
    - expect: Los demás cockteles permanecen sin cambios

#### 5.2. La eliminación persiste tras recargar la página

**File:** `specs/admin/delete-cocktail.spec.ts`

**Steps:**
  1. Crear el cocktail 'Cosmopolitan Test', eliminar y confirmar
    - expect: El cocktail desaparece del listado
  2. Recargar la página e iniciar sesión nuevamente
    - expect: El cocktail 'Cosmopolitan Test' no reaparece en el listado

#### 5.3. Cancelar eliminación desde la confirmación mantiene el cocktail

**File:** `specs/admin/delete-cocktail.spec.ts`

**Steps:**
  1. Hacer clic en 'Eliminar' para 'Tequila Shot'
    - expect: Se muestra diálogo o acción de confirmación
  2. Cancelar la eliminación (no confirmar)
    - expect: El cocktail 'Tequila Shot' sigue apareciendo en el listado

### 6. Mercado Público - Visualización general

**Seed:** `src/tests/seed.spec.ts`

#### 6.1. Acceso a la página de mercado sin login

**File:** `specs/market/market-display.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#market (o a la URL base sin hash)
    - expect: Se muestra la pantalla de mercado sin solicitar autenticación
    - expect: El título es 'Mercado de Cockteles'
    - expect: Se muestra el texto de instrucción 'Haz click en un cocktail para comprar...'

#### 6.2. La URL base redirige al mercado

**File:** `specs/market/market-display.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/ (sin hash)
    - expect: La vista mostrada es la página de mercado pública
    - expect: Se muestra la tabla con los tres cockteles por defecto

#### 6.3. Tabla de mercado con cuatro columnas correctas

**File:** `specs/market/market-display.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#market
    - expect: La tabla tiene exactamente cuatro columnas: 'Nombre', 'Precio Actual', 'Cambio (15min)', 'Vol 15m'
  2. Verificar que los tres cockteles por defecto están en la tabla
    - expect: Se muestran filas para 'Tequila Shot', 'Jagerbomb' y 'B-52'
    - expect: Cada fila tiene datos en las cuatro columnas

#### 6.4. Precio actual muestra valor en Bs con sparkline

**File:** `specs/market/market-display.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#market
  2. Inspeccionar la columna 'Precio Actual' de cada fila
    - expect: El precio se muestra en formato 'XX.XX Bs'
    - expect: Cada celda contiene un elemento de imagen SVG (sparkline) junto al precio

#### 6.5. Columna Cambio (15min) muestra porcentaje y valor absoluto en Bs

**File:** `specs/market/market-display.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#market
  2. Verificar la columna 'Cambio (15min)' para cada cocktail
    - expect: Cada celda muestra dos métricas: porcentaje (ej. '+3.63%') y valor absoluto (ej. '+1.05 Bs')
    - expect: Si el cambio es positivo aparece en color verde
    - expect: Si el cambio es negativo aparece en color rojo

#### 6.6. Columna Vol 15m muestra volumen y contador de operaciones

**File:** `specs/market/market-display.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#market
  2. Inspeccionar la columna 'Vol 15m' de cada fila
    - expect: Se muestra un número de volumen y el texto 'N ops' indicando la cantidad de operaciones
    - expect: Al inicio (sin actividad) se muestra '0' y '0 ops'

#### 6.7. Texto 'Último tick' visible con formato de hora

**File:** `specs/market/market-display.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#market
    - expect: Se muestra un texto con el formato 'Último tick: HH:MM:SS' indicando la última actualización de precio

#### 6.8. Semántica de color: precio sobre promedio se muestra en verde

**File:** `specs/market/market-display.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#market
  2. Identificar un cocktail cuyo precio actual sea mayor que su precioPromedio
    - expect: El precio en la columna 'Precio Actual' se muestra en color verde

#### 6.9. Semántica de color: precio por debajo del promedio se muestra en rojo

**File:** `specs/market/market-display.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#market
  2. Identificar un cocktail cuyo precio actual sea menor que su precioPromedio (ej. B-52 con cambio negativo visible)
    - expect: El precio en la columna 'Precio Actual' se muestra en color rojo

### 7. Mercado Público - Modal de compra

**Seed:** `src/tests/seed.spec.ts`

#### 7.1. Abrir modal de compra al hacer clic en una fila

**File:** `specs/market/buy-modal.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#market
    - expect: La tabla de mercado es visible
  2. Hacer clic en la fila de 'Tequila Shot'
    - expect: Se abre el modal de compra
    - expect: El modal muestra el nombre 'Tequila Shot'
    - expect: El modal muestra el precio actual en Bs
    - expect: El modal tiene un campo de entrada de cantidad (spinbutton) con valor inicial 1
    - expect: El modal muestra el total estimado calculado
    - expect: Existen los botones 'Comprar' y 'Cerrar' (✕)

#### 7.2. Total estimado se calcula correctamente al ingresar cantidad

**File:** `specs/market/buy-modal.spec.ts`

**Steps:**
  1. Abrir el modal de compra de 'Jagerbomb' (precio 30.00 Bs)
    - expect: El modal está abierto con precio actual visible
  2. Cambiar la cantidad a 3
    - expect: El total estimado se actualiza a 90.00 Bs (3 × 30.00 Bs)
  3. Cambiar la cantidad a 5
    - expect: El total estimado se actualiza a 150.00 Bs (5 × 30.00 Bs)

#### 7.3. Comprar 1 unidad incrementa el precio en 1 Bs

**File:** `specs/market/buy-modal.spec.ts`

**Steps:**
  1. Navegar a #market. Anotar el precio actual de 'Tequila Shot' (ej. 30.00 Bs)
    - expect: Precio inicial anotado
  2. Hacer clic en la fila de 'Tequila Shot', verificar cantidad=1 y hacer clic en 'Comprar'
    - expect: Se muestra el mensaje de éxito 'Compra ejecutada'
    - expect: El precio en la tabla de 'Tequila Shot' aumenta en 1 Bs (ej. 31.00 Bs)

#### 7.4. Comprar múltiples unidades incrementa el precio según la cantidad

**File:** `specs/market/buy-modal.spec.ts`

**Steps:**
  1. Abrir el modal de 'Jagerbomb', anotar el precio actual
  2. Cambiar la cantidad a 3 y hacer clic en 'Comprar'
    - expect: El precio de 'Jagerbomb' en la tabla aumenta exactamente 3 Bs respecto al precio anotado
    - expect: Se muestra mensaje de éxito 'Compra ejecutada'

#### 7.5. Cerrar modal con botón ✕ y regresar a la tabla

**File:** `specs/market/buy-modal.spec.ts`

**Steps:**
  1. Abrir el modal de compra de 'B-52'
    - expect: El modal está visible
  2. Hacer clic en el botón '✕' (Cerrar) en la esquina del modal
    - expect: El modal se cierra
    - expect: La tabla de mercado es visible nuevamente
    - expect: No se realizó ninguna compra

#### 7.6. Cerrar modal con botón 'Cerrar' inferior y regresar a la tabla

**File:** `specs/market/buy-modal.spec.ts`

**Steps:**
  1. Abrir el modal de compra de 'Tequila Shot'
    - expect: El modal está visible
  2. Hacer clic en el botón 'Cerrar' en la parte inferior del modal
    - expect: El modal se cierra
    - expect: La tabla de mercado es visible nuevamente

#### 7.7. Rechazar compra con cantidad vacía

**File:** `specs/market/buy-modal.spec.ts`

**Steps:**
  1. Abrir el modal de 'Tequila Shot' y borrar el valor del campo cantidad dejándolo vacío
  2. Hacer clic en 'Comprar'
    - expect: Se muestra un error de validación de cantidad
    - expect: No se ejecuta la compra
    - expect: El precio en la tabla no cambia

#### 7.8. Rechazar compra con cantidad cero

**File:** `specs/market/buy-modal.spec.ts`

**Steps:**
  1. Abrir el modal de 'Jagerbomb' e ingresar cantidad 0
  2. Hacer clic en 'Comprar'
    - expect: Se muestra un error indicando que la cantidad debe ser mayor que cero
    - expect: No se ejecuta la compra

#### 7.9. Rechazar compra con cantidad negativa

**File:** `specs/market/buy-modal.spec.ts`

**Steps:**
  1. Abrir el modal de 'B-52' e ingresar cantidad -2
  2. Hacer clic en 'Comprar'
    - expect: Se muestra un error de cantidad inválida
    - expect: No se ejecuta la compra

#### 7.10. Rechazar compra con cantidad decimal

**File:** `specs/market/buy-modal.spec.ts`

**Steps:**
  1. Abrir el modal de 'Tequila Shot' e ingresar cantidad 1.5
  2. Hacer clic en 'Comprar'
    - expect: Se muestra un error indicando que la cantidad debe ser un número entero
    - expect: No se ejecuta la compra

### 8. Mercado Público - Persistencia y comportamiento offline

**Seed:** `src/tests/seed.spec.ts`

#### 8.1. Precio después de compra persiste al recargar la página

**File:** `specs/market/persistence.spec.ts`

**Steps:**
  1. Navegar a #market, abrir el modal de 'Tequila Shot', comprar 2 unidades
    - expect: Precio aumenta 2 Bs respecto al valor anterior
  2. Anotar el nuevo precio y recargar la página
    - expect: Al recargar, el precio de 'Tequila Shot' mantiene el valor anotado (no regresa al precio promedio original)

#### 8.2. No se aplica decremento retroactivo al reabrir la página

**File:** `specs/market/persistence.spec.ts`

**Steps:**
  1. Navegar a #market y anotar el precio actual de 'Jagerbomb'
  2. Cerrar la pestaña/navegador y volver a abrir http://localhost:5173/#market
    - expect: El precio de 'Jagerbomb' es igual al último valor persistido
    - expect: No se aplica ningún cálculo de tiempo transcurrido mientras la página estuvo cerrada

#### 8.3. Estado inicial: precio comienza en precioPromedio sin estado previo

**File:** `specs/market/persistence.spec.ts`

**Steps:**
  1. Limpiar localStorage. Navegar a http://localhost:5173/#market
    - expect: El precio actual de 'Tequila Shot' inicia en 30.00 Bs (su precioPromedio)
    - expect: El precio actual de 'B-52' inicia en 40.00 Bs (su precioPromedio)

### 9. Mercado Público - Cambio 15 minutos y semántica

**Seed:** `src/tests/seed.spec.ts`

#### 9.1. Cambio neutro (< 0.5%) muestra guion '—'

**File:** `specs/market/change-display.spec.ts`

**Steps:**
  1. Navegar a #market e identificar un cocktail donde precioActualBs ≈ precioHace15Min (diferencia < 0.5%)
    - expect: La columna 'Cambio (15min)' muestra el símbolo '—' en lugar de porcentaje y valor

#### 9.2. Cambio positivo muestra porcentaje y Bs en verde

**File:** `specs/market/change-display.spec.ts`

**Steps:**
  1. Navegar a #market. Verificar la fila de 'Tequila Shot' con cambio positivo visible (ej. +3.63% +1.05 Bs)
    - expect: El porcentaje se muestra con prefijo '+' en color verde
    - expect: El valor absoluto se muestra con prefijo '+' en color verde

#### 9.3. Cambio negativo muestra porcentaje y Bs en rojo

**File:** `specs/market/change-display.spec.ts`

**Steps:**
  1. Navegar a #market. Verificar la fila de 'B-52' con cambio negativo visible (ej. -2.15% -0.88 Bs)
    - expect: El porcentaje se muestra con prefijo '-' en color rojo
    - expect: El valor absoluto se muestra con prefijo '-' en color rojo

### 10. Navegación entre Admin y Mercado

**Seed:** `src/tests/seed.spec.ts`

#### 10.1. Navegar desde Admin al Mercado con el enlace 'Ver Mercado'

**File:** `specs/navigation/navigation.spec.ts`

**Steps:**
  1. Iniciar sesión en #admin
    - expect: La pantalla de administración está visible con el enlace 'Ver Mercado' en el header
  2. Hacer clic en el enlace 'Ver Mercado'
    - expect: La URL cambia a #market
    - expect: Se muestra la tabla de mercado pública con los cockteles

#### 10.2. Navegar desde Mercado al Admin usando #admin en URL

**File:** `specs/navigation/navigation.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/#market
    - expect: Se muestra la página de mercado
  2. Modificar la URL a http://localhost:5173/#admin
    - expect: Se muestra el formulario de login del administrador

#### 10.3. Admin permanece en sesión al navegar al mercado y volver

**File:** `specs/navigation/navigation.spec.ts`

**Steps:**
  1. Iniciar sesión en #admin
  2. Hacer clic en 'Ver Mercado' para ir a #market
    - expect: Se muestra la página de mercado
  3. Navegar de vuelta a http://localhost:5173/#admin
    - expect: La sesión de admin sigue activa
    - expect: Se muestra la pantalla de administración sin necesidad de volver a hacer login
