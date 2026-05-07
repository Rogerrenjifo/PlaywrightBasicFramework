# Test Plan - Mercado de Cockteles

## Application Overview

La aplicación "Mercado de Cockteles" es una plataforma de negociación de bebidas alcohólicas con precios fluctuantes en tiempo real. Los usuarios pueden ver un listado de cocktails disponibles con sus precios actuales, cambios percentuales en 15 minutos, y volumen de operaciones. La funcionalidad principal permite a los usuarios comprar cocktails seleccionando la cantidad deseada y completando la transacción a través de un modal de compra. Los precios fluctúan dinámicamente según un modelo de deriva y volatilidad, y cada compra se registra en el volumen de transacciones.

## Test Scenarios

### 1. Visualización y Navegación del Mercado

**Seed:** `src/tests/seed.spec.ts`

#### 1.1. Verificar carga inicial de la página de mercado

**File:** `tests/market/market-page-load.spec.ts`

**Steps:**
  1. Navegar a la página de mercado (URL: http://localhost:5173/#market)
    - expect: La página carga correctamente
    - expect: El título 'Mercado de Cockteles' es visible en el banner
    - expect: Se muestra la descripción: 'Haz click en un cocktail para comprar. El precio fluctua con deriva y volatilidad.'
    - expect: Se muestra el timestamp 'Último tick' con la hora actual
  2. Verificar que la tabla de productos sea visible
    - expect: La tabla contiene 4 columnas: Nombre, Precio Actual, Cambio (15min), Vol 15m
    - expect: La tabla muestra exactamente 3 cocktails: Tequila Shot, Jagerbomb, B-52
    - expect: Cada fila es interactiva (cursor pointer visible)

#### 1.2. Verificar actualización en tiempo real de precios

**File:** `tests/market/realtime-price-update.spec.ts`

**Steps:**
  1. Cargar la página de mercado y observar los precios iniciales
    - expect: Los precios se muestran en formato XX.XX Bs
    - expect: El timestamp 'Último tick' muestra la hora actual
  2. Esperar 5 segundos sin realizar acciones
    - expect: El timestamp 'Último tick' se actualiza cada segundo
    - expect: Los precios de los cocktails cambian (fluctúan arriba o abajo)
    - expect: Los porcentajes de cambio (15min) se actualizan
    - expect: Los valores de cambio en Bs también se actualizan
  3. Verificar que los cambios son consistentes con el modelo de precio
    - expect: El cambio en Bs es consistente con el porcentaje de cambio
    - expect: Algunos precios suben (indicador verde, +), otros bajan (indicador rojo, -)
    - expect: El volumen 15m puede cambiar si hay transacciones

#### 1.3. Verificar iconografía de precios

**File:** `tests/market/price-indicators.spec.ts`

**Steps:**
  1. Observar la columna 'Precio Actual' de la tabla
    - expect: Cada precio muestra un ícono o gráfico junto al valor
    - expect: Los iconos representan la tendencia del precio (ascendente/descendente)

### 2. Flujo de Compra - Happy Path

**Seed:** `src/tests/seed.spec.ts`

#### 2.1. Abrir modal de compra de un producto

**File:** `tests/market/open-purchase-modal.spec.ts`

**Steps:**
  1. Hacer click en la fila del producto 'Tequila Shot'
    - expect: Se abre un modal de compra
    - expect: El modal muestra el título del producto 'Tequila Shot'
    - expect: El modal muestra un botón 'Cerrar' (✕) en la esquina superior derecha
  2. Verificar los contenidos del modal
    - expect: Se muestra la etiqueta 'Precio Actual' con el precio en Bs
    - expect: Se muestra un campo de cantidad (spinbutton) con valor por defecto de 1
    - expect: Se muestra el total calculado (Total: XX.XX Bs)
    - expect: Se muestran dos botones: 'Comprar' y 'Cerrar'

#### 2.2. Cambiar cantidad y verificar cálculo de total

**File:** `tests/market/quantity-calculation.spec.ts`

**Steps:**
  1. Abrir el modal de compra de 'Jagerbomb'
    - expect: El modal muestra el precio actual (ej: 30.00 Bs)
    - expect: La cantidad inicial es 1
    - expect: El total inicial es igual al precio actual
  2. Cambiar la cantidad a 5
    - expect: El campo de cantidad muestra 5
    - expect: El total se actualiza a 5 veces el precio actual (ej: 150.00 Bs)
  3. Cambiar la cantidad a 10
    - expect: El campo de cantidad muestra 10
    - expect: El total se actualiza correctamente (ej: 300.00 Bs)
  4. Cambiar la cantidad a 1
    - expect: El campo de cantidad muestra 1
    - expect: El total vuelve al precio actual

#### 2.3. Completar una compra exitosa

**File:** `tests/market/complete-purchase.spec.ts`

**Steps:**
  1. Abrir el modal de compra de 'B-52' con cantidad 1
    - expect: Modal muestra 'B-52' como título
    - expect: Precio actual y total son visibles
  2. Hacer click en el botón 'Comprar'
    - expect: La compra se procesa
    - expect: El modal permanece abierto (no se cierra automáticamente)
    - expect: La tabla se actualiza con el volumen de transacciones incrementado
  3. Verificar que el volumen se actualizó en la tabla
    - expect: La columna 'Vol 15m' para 'B-52' aumenta de 0 a 1 op
    - expect: El precio puede haber fluctuado levemente

#### 2.4. Cerrar modal sin comprar

**File:** `tests/market/close-modal-without-purchase.spec.ts`

**Steps:**
  1. Abrir el modal de compra de 'Tequila Shot'
    - expect: El modal está abierto
  2. Hacer click en el botón 'Cerrar' dentro del modal
    - expect: El modal se cierra
    - expect: Se regresa a la vista de la tabla
    - expect: No se realiza ninguna compra
  3. Hacer click en la fila nuevamente y luego en el botón 'Cerrar' (✕)
    - expect: El modal se cierra
    - expect: Se regresa a la vista de la tabla

### 3. Validaciones y Casos Límite

**Seed:** `src/tests/seed.spec.ts`

#### 3.1. Validar que la cantidad debe ser mayor que 0

**File:** `tests/market/quantity-validation-zero.spec.ts`

**Steps:**
  1. Abrir el modal de compra de cualquier producto
    - expect: El modal está abierto
  2. Cambiar la cantidad a 0
    - expect: El campo de cantidad muestra 0
    - expect: El total se actualiza a 0.00 Bs
    - expect: Se muestra un mensaje de error: 'La cantidad debe ser un entero mayor que 0.'
  3. Intentar hacer click en 'Comprar'
    - expect: El botón 'Comprar' está activo
    - expect: Dependiendo de la validación: la compra se rechaza o se permite (según comportamiento específico)

#### 3.2. Validar cantidad negativa

**File:** `tests/market/quantity-validation-negative.spec.ts`

**Steps:**
  1. Abrir el modal de compra
    - expect: El modal está abierto
  2. Intentar ingresar cantidad negativa (ej: -5)
    - expect: El campo de cantidad muestra -5 o se rechaza la entrada
    - expect: Si se muestra, se despliega mensaje de validación
    - expect: El total refleja el valor (negativo o error)

#### 3.3. Validar cantidad con decimales

**File:** `tests/market/quantity-validation-decimal.spec.ts`

**Steps:**
  1. Abrir el modal de compra
    - expect: El modal está abierto
  2. Intentar ingresar cantidad con decimales (ej: 2.5)
    - expect: El campo acepta o rechaza la entrada
    - expect: Si se acepta, se muestra mensaje indicando que debe ser entero
    - expect: Si se rechaza, la entrada se ignora

#### 3.4. Validar cantidad muy grande

**File:** `tests/market/quantity-validation-large.spec.ts`

**Steps:**
  1. Abrir el modal de compra
    - expect: El modal está abierto
  2. Cambiar la cantidad a un número muy grande (ej: 999999)
    - expect: El campo acepta el valor
    - expect: El total se calcula correctamente (precio * 999999)
  3. Hacer click en 'Comprar'
    - expect: La compra se procesa normalmente
    - expect: El volumen se actualiza con la cantidad comprada

### 4. Múltiples Transacciones

**Seed:** `src/tests/seed.spec.ts`

#### 4.1. Realizar múltiples compras del mismo producto

**File:** `tests/market/multiple-purchases-same-product.spec.ts`

**Steps:**
  1. Hacer click en 'Tequila Shot' y comprar 2 unidades
    - expect: La compra se procesa
    - expect: El volumen en la tabla aumenta a 2
    - expect: El modal se mantiene abierto
  2. Sin cerrar el modal, cambiar la cantidad a 3 y comprar nuevamente
    - expect: La segunda compra se procesa
    - expect: El volumen aumenta a 5 (2+3)
    - expect: El total se recalcula con el nuevo precio

#### 4.2. Realizar compras de diferentes productos

**File:** `tests/market/purchases-different-products.spec.ts`

**Steps:**
  1. Comprar 1 unidad de 'Jagerbomb'
    - expect: La compra se procesa
    - expect: El volumen de Jagerbomb es 1
  2. Cerrar el modal y abrir 'B-52'
    - expect: El modal de B-52 abre correctamente
  3. Comprar 2 unidades de 'B-52'
    - expect: La compra se procesa
    - expect: El volumen de B-52 es 2
    - expect: El volumen de Jagerbomb se mantiene en 1

### 5. Interacción y UX

**Seed:** `src/tests/seed.spec.ts`

#### 5.1. Verificar que cada fila de producto es clickeable

**File:** `tests/market/product-row-clickability.spec.ts`

**Steps:**
  1. Hacer click en el centro de cada fila de producto
    - expect: Hacer click en 'Tequila Shot': abre modal
    - expect: Hacer click en 'Jagerbomb': abre modal
    - expect: Hacer click en 'B-52': abre modal

#### 5.2. Verificar respuesta visual al hover

**File:** `tests/market/hover-effects.spec.ts`

**Steps:**
  1. Pasar el mouse sobre una fila de producto
    - expect: La fila cambia visualmente (ej: cambio de color de fondo, elevación)
    - expect: El cursor cambia a pointer

#### 5.3. Verificar que el modal cierre al hacer click fuera del mismo

**File:** `tests/market/modal-click-outside.spec.ts`

**Steps:**
  1. Abrir el modal de compra
    - expect: El modal está abierto
  2. Hacer click en el área oscura fuera del modal (si existe)
    - expect: El modal se cierra
    - expect: Se regresa a la tabla del mercado

### 6. Rendimiento y Estabilidad

**Seed:** `src/tests/seed.spec.ts`

#### 6.1. Verificar que la página no se bloquea durante fluctuaciones de precio

**File:** `tests/market/performance-price-fluctuation.spec.ts`

**Steps:**
  1. Dejar la página abierta sin interacción durante 30 segundos
    - expect: La página continúa siendo receptiva
    - expect: Los precios se actualizan sin problemas
    - expect: El timestamp continúa incrementándose
    - expect: No hay congelamiento o lag visible

#### 6.2. Verificar que múltiples modales no se abren simultáneamente

**File:** `tests/market/single-modal-instance.spec.ts`

**Steps:**
  1. Abrir un modal de compra
    - expect: Un solo modal está visible
  2. Intentar hacer click en otra fila de producto
    - expect: El modal anterior se cierra
    - expect: Se abre el modal del nuevo producto
    - expect: No coexisten dos modales
