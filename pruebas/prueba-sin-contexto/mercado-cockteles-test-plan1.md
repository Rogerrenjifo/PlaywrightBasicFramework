# Mercado de Cockteles - Test Plan 

## Application Overview

La aplicación "Mercado de Cockteles" es una plataforma de compra de cócteles con precios que fluctúan dinámicamente. Los usuarios pueden navegar una tabla de tres cócteles disponibles (Tequila Shot, Jagerbomb, B-52), ver información actualizada de precios, cambios porcentuales y volumen de transacciones. Al hacer clic en un cóctel, se abre un modal de compra donde pueden especificar la cantidad deseada y completar la transacción. Los precios se actualizan en tiempo real con volatilidad simulada.

## Test Scenarios

### 1. Visualización e Interfaz de Usuario

**Seed:** `src/tests/seed.spec.ts`

#### 1.1. Cargar página principal y verificar elementos visibles

**File:** `tests/ui/load-page.spec.ts`

**Steps:**
  1. Navegar a http://localhost:5173/
    - expect: La página carga correctamente
    - expect: El título de la página es 'Cocktail Admin'
    - expect: Se muestra el encabezado 'Mercado de Cockteles'
    - expect: Se muestra el mensaje 'Haz click en un cocktail para comprar...'
  2. Verificar que la tabla de cócteles está visible
    - expect: La tabla tiene encabezados: Nombre, Precio Actual, Cambio (15min), Vol 15m
    - expect: Se muestran los tres cócteles: Tequila Shot, Jagerbomb, B-52
  3. Verificar el contador de actualización
    - expect: Se muestra 'Último tick' con una hora/fecha
    - expect: El formato es válido

#### 1.2. Verificar actualización dinámica de precios

**File:** `tests/ui/dynamic-prices.spec.ts`

**Steps:**
  1. Cargar la página y capturar los precios iniciales
    - expect: Se capturan los precios de los tres cócteles
  2. Esperar 3 segundos y verificar que los precios hayan cambiado
    - expect: Al menos uno de los precios ha cambiado
    - expect: El 'Último tick' se ha actualizado
  3. Verificar que los cambios porcentuales se muestran correctamente
    - expect: Cada cóctel muestra su cambio en porcentaje y cantidad absoluta
    - expect: Los signos '+' y '-' se muestran correctamente

#### 1.3. Verificar indicadores visuales de precios

**File:** `tests/ui/price-indicators.spec.ts`

**Steps:**
  1. Observar los cócteles con precios al alza
    - expect: Los precios al alza tienen un indicador visual diferente (clase CSS positivo)
    - expect: Se muestra una visualización de tendencia pequeña
  2. Observar los cócteles con precios a la baja
    - expect: Los precios a la baja tienen un indicador visual diferente (clase CSS negativo)

### 2. Flujo de Compra - Casos Exitosos

**Seed:** `src/tests/seed.spec.ts`

#### 2.1. Comprar Tequila Shot con cantidad válida

**File:** `tests/purchase/buy-tequila-shot.spec.ts`

**Steps:**
  1. Navegar a la página principal
    - expect: La página se carga correctamente
  2. Hacer clic en la fila de Tequila Shot
    - expect: Se abre el modal de compra
    - expect: El modal muestra 'Tequila Shot' como título
    - expect: Se muestra el precio actual del cóctel
  3. Verificar que el campo de cantidad tiene valor inicial 1
    - expect: El spinbutton 'Cantidad' tiene valor 1
    - expect: El total se calcula como: 1 × precio actual
  4. Cambiar la cantidad a 3
    - expect: El campo de cantidad se actualiza a 3
    - expect: El total se recalcula correctamente: 3 × precio actual
  5. Hacer clic en el botón 'Comprar'
    - expect: El modal se cierra
    - expect: La compra se procesa correctamente
    - expect: No aparecen mensajes de error
  6. Verificar que la tabla se actualiza
    - expect: El volumen de Tequila Shot aumentó en 3 unidades
    - expect: El número de operaciones para Tequila Shot aumentó en 1

#### 2.2. Comprar Jagerbomb con cantidad 1

**File:** `tests/purchase/buy-jagerbomb.spec.ts`

**Steps:**
  1. Navegar a la página principal
    - expect: La página se carga correctamente
  2. Hacer clic en la fila de Jagerbomb
    - expect: Se abre el modal de compra
    - expect: El modal muestra 'Jagerbomb' como título
  3. Verificar el precio y dejar cantidad en 1
    - expect: Precio actual se muestra correctamente
    - expect: Cantidad es 1
    - expect: Total = Precio Actual
  4. Hacer clic en 'Comprar'
    - expect: La compra se completa exitosamente
    - expect: El modal se cierra
  5. Verificar que la tabla actualiza el volumen de Jagerbomb
    - expect: El volumen aumentó en 1 unidad
    - expect: El número de operaciones aumentó en 1

#### 2.3. Comprar B-52 con cantidad máxima

**File:** `tests/purchase/buy-b52-max.spec.ts`

**Steps:**
  1. Navegar a la página principal
    - expect: La página se carga correctamente
  2. Hacer clic en la fila de B-52
    - expect: Se abre el modal con el cóctel B-52
  3. Cambiar la cantidad a 10 (cantidad grande)
    - expect: La cantidad se actualiza a 10
    - expect: El total se calcula como 10 × precio actual
  4. Hacer clic en 'Comprar'
    - expect: La compra se completa sin errores
    - expect: El modal se cierra
  5. Verificar que el volumen de B-52 aumentó en 10 unidades
    - expect: La columna de volumen para B-52 se incrementó en 10

#### 2.4. Comprar múltiples cócteles en secuencia

**File:** `tests/purchase/buy-multiple-sequence.spec.ts`

**Steps:**
  1. Navegar a la página principal
    - expect: La página se carga correctamente
  2. Comprar 2 Tequila Shots
    - expect: La compra se completa
    - expect: El volumen de Tequila Shot aumenta en 2
  3. Comprar 3 Jagerbombs
    - expect: La compra se completa
    - expect: El volumen de Jagerbomb aumenta en 3
  4. Comprar 1 B-52
    - expect: La compra se completa
    - expect: El volumen de B-52 aumenta en 1
  5. Verificar que todas las compras se registraron
    - expect: Los volúmenes de cada cóctel reflejan las compras realizadas
    - expect: El número de operaciones de cada uno aumentó

### 3. Validación y Casos de Error

**Seed:** `src/tests/seed.spec.ts`

#### 3.1. Validar que la cantidad no puede ser cero

**File:** `tests/validation/quantity-zero.spec.ts`

**Steps:**
  1. Navegar a la página y abrir el modal de cualquier cóctel
    - expect: El modal se abre correctamente
  2. Cambiar la cantidad a 0
    - expect: El campo de cantidad se actualiza a 0
    - expect: El total se muestra como 0.00 Bs
  3. Hacer clic en el botón 'Comprar'
    - expect: Aparece un mensaje de validación: 'La cantidad debe ser un entero mayor que 0.'
    - expect: El botón Comprar está deshabilitado o visible el error
    - expect: La compra NO se procesa
  4. Verificar que la tabla no cambió
    - expect: Los volúmenes permanecen sin cambios

#### 3.2. Validar que la cantidad no puede ser negativa

**File:** `tests/validation/quantity-negative.spec.ts`

**Steps:**
  1. Abrir el modal de un cóctel
    - expect: El modal se abre correctamente
  2. Intentar cambiar la cantidad a -1
    - expect: El campo rechaza el valor negativo O lo convierte a positivo
    - expect: Se muestra un mensaje de validación si es necesario
  3. Si el valor se aceptó, hacer clic en 'Comprar'
    - expect: Se muestra un mensaje de error
    - expect: La compra no se procesa

#### 3.3. Validar que la cantidad debe ser un número entero

**File:** `tests/validation/quantity-decimal.spec.ts`

**Steps:**
  1. Abrir el modal de un cóctel
    - expect: El modal se abre correctamente
  2. Intentar ingresar una cantidad decimal como 2.5
    - expect: El campo rechaza o redondea el valor decimal
    - expect: Se muestra una aclaración sobre enteros si es necesario
  3. Si el valor se aceptó, hacer clic en 'Comprar'
    - expect: Se valida correctamente
    - expect: El mensaje de error menciona que debe ser entero si aplica

#### 3.4. Cerrar modal sin comprar

**File:** `tests/validation/cancel-purchase.spec.ts`

**Steps:**
  1. Navegar a la página principal
    - expect: La página se carga correctamente
  2. Capturar los volúmenes iniciales de cada cóctel
    - expect: Se registran los volúmenes actuales
  3. Abrir el modal de Tequila Shot
    - expect: El modal se abre correctamente
  4. Cambiar la cantidad a 5
    - expect: La cantidad se actualiza a 5
  5. Hacer clic en el botón 'Cerrar' en lugar de 'Comprar'
    - expect: El modal se cierra sin procesar la compra
  6. Verificar que los volúmenes no cambiaron
    - expect: Los volúmenes siguen siendo los mismos que al inicio

#### 3.5. Cerrar modal usando el botón X

**File:** `tests/validation/close-with-x.spec.ts`

**Steps:**
  1. Abrir el modal de cualquier cóctel
    - expect: El modal se abre correctamente
  2. Cambiar la cantidad a una valor específico
    - expect: La cantidad se actualiza
  3. Hacer clic en el botón '✕' (cerrar) en la esquina superior del modal
    - expect: El modal se cierra sin procesar la compra
  4. Verificar que el estado de la tabla no cambió
    - expect: No hay nuevas compras registradas

### 4. Cálculos y Precisión de Datos

**Seed:** `src/tests/seed.spec.ts`

#### 4.1. Verificar cálculo correcto del total

**File:** `tests/calculations/total-calculation.spec.ts`

**Steps:**
  1. Abrir el modal de Tequila Shot
    - expect: El modal se abre correctamente
  2. Capturar el precio actual mostrado
    - expect: Se obtiene el precio en formato 'XX.XX Bs'
  3. Cambiar la cantidad a 2
    - expect: El total mostrado = 2 × precio capturado
  4. Cambiar la cantidad a 5
    - expect: El total mostrado = 5 × precio capturado
  5. Cambiar la cantidad a 1
    - expect: El total vuelve al precio original

#### 4.2. Verificar que el volumen aumenta exactamente por la cantidad comprada

**File:** `tests/calculations/volume-increment.spec.ts`

**Steps:**
  1. Capturar el volumen inicial de un cóctel
    - expect: Se registra el volumen inicial
  2. Comprar 3 unidades del cóctel
    - expect: La compra se completa exitosamente
  3. Verificar el nuevo volumen
    - expect: Nuevo volumen = Volumen inicial + 3
  4. Comprar 2 unidades más del mismo cóctel
    - expect: La compra se completa exitosamente
  5. Verificar el volumen final
    - expect: Volumen final = Volumen inicial + 3 + 2

#### 4.3. Verificar que el contador de operaciones aumenta en 1 por compra

**File:** `tests/calculations/operations-counter.spec.ts`

**Steps:**
  1. Capturar el número de operaciones inicial de un cóctel
    - expect: Se registra el número de operaciones
  2. Realizar una compra (cualquier cantidad)
    - expect: La compra se completa
  3. Verificar que el contador de operaciones aumentó en exactamente 1
    - expect: Operaciones nuevas = Operaciones iniciales + 1
  4. Realizar otra compra del mismo cóctel
    - expect: La compra se completa
  5. Verificar que el contador aumentó nuevamente en 1
    - expect: El contador refleja 2 operaciones adicionales desde el inicio

#### 4.4. Verificar que el cambio porcentual (15min) se actualiza

**File:** `tests/calculations/price-change.spec.ts`

**Steps:**
  1. Capturar el cambio porcentual inicial de un cóctel
    - expect: Se registra el cambio inicial en formato '+X.XX%' o '-X.XX%'
  2. Esperar 2 segundos y verificar cambios en la tabla
    - expect: Al menos algunos precios han cambiado
    - expect: Los cambios porcentuales se actualizaron
  3. Verificar que los cambios absolutos (en Bs) corresponden al porcentaje
    - expect: Cambio absoluto ≈ Precio anterior × (Porcentaje / 100)

### 5. Usabilidad e Interacción

**Seed:** `src/tests/seed.spec.ts`

#### 5.1. Verificar que las filas de la tabla son clickeables

**File:** `tests/usability/clickable-rows.spec.ts`

**Steps:**
  1. Navegar a la página principal
    - expect: La página se carga correctamente
  2. Hacer clic en la fila de cada cóctel
    - expect: Cada fila es clickeable y abre el modal del cóctel correspondiente
    - expect: El nombre en el modal corresponde al cóctel clickeado
  3. Cerrar cada modal
    - expect: Todos los modales se cierran correctamente

#### 5.2. Verificar que el spinbutton de cantidad funciona correctamente

**File:** `tests/usability/quantity-spinner.spec.ts`

**Steps:**
  1. Abrir el modal de un cóctel
    - expect: El modal se abre correctamente
  2. Hacer clic en el spinbutton y escribir diferentes valores (1, 5, 10, 100)
    - expect: Todos los valores se aceptan
    - expect: El total se recalcula para cada valor
  3. Verificar que el spinner de cantidad tiene controles arriba/abajo
    - expect: Si el spinbutton tiene botones +/-, estos funcionan correctamente
    - expect: La cantidad incrementa o decrementa según sea esperado

#### 5.3. Verificar que el modal se centra en pantalla

**File:** `tests/usability/modal-positioning.spec.ts`

**Steps:**
  1. Abrir un modal de compra
    - expect: El modal se centra en la pantalla
    - expect: Es visible y accesible
  2. Redimensionar la ventana (si aplica)
    - expect: El modal permanece visible y centrado

#### 5.4. Verificar que el foco sea manejado correctamente en el modal

**File:** `tests/usability/focus-management.spec.ts`

**Steps:**
  1. Abrir un modal
    - expect: El foco se posiciona en el modal
  2. Navegar con Tab dentro del modal
    - expect: El foco se mueve entre: cantidad, botón Comprar, botón Cerrar
    - expect: El orden es lógico
  3. Presionar Escape si está soportado
    - expect: El modal se cierra (si Escape cierra modales en esta aplicación)

### 6. Casos Extremos y Rendimiento

**Seed:** `src/tests/seed.spec.ts`

#### 6.1. Comprar cantidad muy grande

**File:** `tests/edge-cases/large-quantity.spec.ts`

**Steps:**
  1. Abrir el modal de un cóctel
    - expect: El modal se abre correctamente
  2. Cambiar la cantidad a 9999
    - expect: El campo acepta valores grandes
    - expect: El total se calcula correctamente
  3. Hacer clic en 'Comprar'
    - expect: La compra se procesa sin errores
    - expect: El volumen se actualiza correctamente

#### 6.2. Cambiar cantidad rápidamente múltiples veces

**File:** `tests/edge-cases/rapid-quantity-change.spec.ts`

**Steps:**
  1. Abrir el modal de un cóctel
    - expect: El modal se abre correctamente
  2. Cambiar la cantidad rápidamente: 1 → 5 → 2 → 10 → 3
    - expect: Cada cambio se procesa correctamente
    - expect: El total se actualiza en cada cambio
  3. Hacer clic en 'Comprar' con el último valor (3)
    - expect: La compra se completa con la cantidad 3

#### 6.3. Esperar a que los precios cambien significativamente

**File:** `tests/edge-cases/price-fluctuation.spec.ts`

**Steps:**
  1. Capturar el precio actual de un cóctel
    - expect: Se registra el precio inicial
  2. Esperar 5-10 segundos sin hacer nada
    - expect: El precio se actualiza
    - expect: El 'Último tick' avanza
  3. Hacer clic en el cóctel para abrir el modal
    - expect: El modal muestra el precio actualizado
    - expect: El cambio porcentual refleja las fluctuaciones

#### 6.4. Abrir y cerrar modales repetidamente

**File:** `tests/edge-cases/rapid-modal-toggling.spec.ts`

**Steps:**
  1. Navegar a la página principal
    - expect: La página se carga correctamente
  2. Abrir y cerrar el modal de Tequila Shot 5 veces sin comprar
    - expect: Todos los abiertos y cierres son fluidos
    - expect: No hay errores
  3. Abrir el modal de Jagerbomb 3 veces, comprando en cada segundo intento
    - expect: Se realizan 1 o 2 compras dependiendo de la secuencia
    - expect: Los modales se cierran correctamente

### 7. Accesibilidad y Semántica

**Seed:** `src/tests/seed.spec.ts`

#### 7.1. Verificar estructura semántica correcta

**File:** `tests/accessibility/semantic-structure.spec.ts`

**Steps:**
  1. Inspeccionar la estructura HTML de la página
    - expect: Hay un elemento <header> con el logo
    - expect: Hay un elemento <main> con el contenido principal
    - expect: La tabla usa elementos <table>, <thead>, <tbody>, <tr>, <th>, <td>
  2. Verificar encabezados de columna
    - expect: Los encabezados usan <th> correctamente

#### 7.2. Verificar que el modal tiene atributos de accesibilidad

**File:** `tests/accessibility/modal-accessibility.spec.ts`

**Steps:**
  1. Abrir un modal
    - expect: El modal tiene un atributo role='dialog'
    - expect: El modal tiene un título accesible
  2. Verificar que los botones tienen etiquetas claras
    - expect: Los botones 'Comprar' y 'Cerrar' tienen texto visible
    - expect: El botón ✕ tiene un atributo aria-label o similar

#### 7.3. Verificar labels para inputs

**File:** `tests/accessibility/input-labels.spec.ts`

**Steps:**
  1. Inspeccionar el campo de cantidad
    - expect: El spinbutton tiene un label asociado
    - expect: El label dice 'Cantidad'
