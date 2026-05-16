# Flujo Canonico de Cobranza desde Remision hasta Pago Aplicado

## Objetivo

Cerrar como se liga en Vera:

- una remision `service_orders`;
- su detalle economico `service_order_items`;
- el documento por cobrar `receivable_documents`;
- las parcialidades `receivable_installments`;
- el pago recibido `payment_transactions`;
- la aplicacion del pago `payment_applications`;
- y la bitacora contable `account_movements`.

## Decision canonica

La trazabilidad de cobranza en Vera sigue esta cadena:

1. `service_orders`
2. `service_order_items`
3. `receivable_documents`
4. `receivable_installments`
5. `payment_transactions`
6. `payment_applications`
7. `account_movements`

Regla principal:

- la remision no se considera saldo por si sola;
- el saldo nace al emitir el `receivable_document`;
- el pago no cancela deuda por si solo;
- la deuda se cancela cuando el pago queda aplicado contra documento o parcialidad.

## Regla sobre la cuenta administrativa

### `client_accounts`

Vera mantiene la cartera agrupada por `client_party_id`.

Regla canonica:

- toda remision cobrable debe poder amarrarse a una `client_account`;
- la cuenta representa el agrupador administrativo del cliente de consulta;
- el pagador real puede ser distinto y se registra aparte.

## Regla sobre quien paga

### `payer_party_id`

El hecho de que la cuenta administrativa sea del cliente no significa que siempre pague el cliente.

Por eso debe mantenerse:

- `service_orders.payer_party_id` como expectativa o dato operativo del pagador;
- `payment_transactions.payer_party_id` como pagador real del pago recibido.

Esto permite cubrir casos como:

- el cliente paga;
- el propietario paga directamente;
- un tercero paga;
- o el cargo se condona.

## Flujo canonico

### Paso 1. Captura de remision

Se crea:

- `service_orders`
- `service_order_items`

En este punto ya deben conocerse:

- `vehicle_id`
- `client_party_id`
- `payer_scheme`
- `settlement_status_current`
- detalle economico por renglon.

### Paso 2. Emision de documento por cobrar

Si la remision es cobrable, se crea:

- `receivable_documents`

Regla:

- una remision cobrable genera un `receivable_document` activo;
- si `payer_scheme = WAIVED`, no debe generarse documento por cobrar;
- si la remision se cancela antes de emitir cartera, no debe generarse documento por cobrar.

### Paso 3. Generacion de parcialidades

Todo `receivable_document` debe tener al menos una fila en:

- `receivable_installments`

Regla:

- incluso si el cobro es de una sola exhibicion, debe existir la parcialidad `installment_no = 1`;
- esto evita dos rutas distintas de aplicacion y unifica saldo, vencimiento y aging.

### Paso 4. Registro de pago recibido

Cuando entra dinero, se crea:

- `payment_transactions`

Regla:

- el pago puede entrar antes o despues de conocer la aplicacion exacta;
- por eso el pago primero se registra y despues se aplica.

### Paso 5. Aplicacion del pago

El pago se amarra mediante:

- `payment_applications`

Regla:

- la aplicacion se hace contra `receivable_installments`;
- y por consistencia tambien referencia a `receivable_document`.

### Paso 6. Actualizacion de saldo y estados

Despues de la aplicacion:

- se actualiza `amount_paid` y `installment_status` en `receivable_installments`;
- se actualiza `balance_amount` y `receivable_status` en `receivable_documents`;
- se actualiza `settlement_status_current` en `service_orders`.

### Paso 7. Bitacora contable

Cada evento economico relevante debe reflejarse en:

- `account_movements`

Como minimo:

- emision del documento por cobrar;
- registro de pago;
- aplicacion de pago;
- cancelacion;
- ajuste o reversa.

## Reglas canonicas por tabla

### `receivable_documents`

Representa el documento administrativo que convierte una remision en saldo exigible.

Campos canonicos minimos adicionales:

- `client_account_id`
- `service_order_id`
- `folio`
- `document_type`
- `issue_date`
- `due_date`
- `subtotal_amount`
- `tax_amount`
- `total_amount`
- `balance_amount`
- `receivable_status`
- `payer_scheme_snapshot`

Reglas:

- debe referenciar a una sola `service_order`;
- debe existir como maximo un documento activo por remision dentro del alcance actual;
- `balance_amount` no puede ser negativo;
- `payer_scheme_snapshot` congela la forma de cobro al momento de emitir cartera.

### `receivable_installments`

Representa los vencimientos o parcialidades del documento por cobrar.

Campos canonicos minimos adicionales:

- `receivable_document_id`
- `installment_no`
- `due_date`
- `amount_due`
- `amount_paid`
- `installment_status`

Reglas:

- la suma de `amount_due` de las parcialidades debe igualar el total del documento;
- `amount_paid` no puede exceder `amount_due`;
- el estado de la parcialidad debe derivarse de saldo y vencimiento.

### `payment_transactions`

Representa la entrada de dinero o el pago reconocido por el intermediario.

Campos canonicos minimos adicionales:

- `client_account_id`
- `payer_party_id`
- `payment_date`
- `payment_method`
- `reference`
- `amount`
- `currency`
- `registered_by_user_id`
- `payment_status`
- `unapplied_amount`

Reglas:

- el pago pertenece a una sola `client_account`;
- puede aplicarse a una o varias parcialidades de esa misma cuenta;
- `unapplied_amount` no puede ser negativo;
- el pagador real puede ser distinto del cliente titular de la cuenta.

### `payment_applications`

Representa la asignacion concreta de un pago hacia una deuda.

Campos canonicos minimos adicionales:

- `payment_transaction_id`
- `receivable_document_id`
- `receivable_installment_id`
- `applied_amount`
- `applied_at`

Reglas:

- `applied_amount` debe ser positivo;
- la suma aplicada de un pago no puede exceder el `payment_transactions.amount`;
- la suma aplicada a una parcialidad no puede exceder su saldo;
- `receivable_document_id` debe coincidir con el padre de `receivable_installment_id`.

### `account_movements`

Representa la bitacora append-only del saldo administrativo de la cuenta.

Campos canonicos minimos adicionales:

- `client_account_id`
- `movement_date`
- `movement_type`
- `reference_type`
- `reference_id`
- `debit_amount`
- `credit_amount`
- `balance_after_amount`

Reglas:

- no debe sobrescribirse el historial;
- debe existir una fila por cada hecho contable relevante;
- `reference_type` debe permitir distinguir al menos:
  `RECEIVABLE_DOCUMENT`,
  `PAYMENT_TRANSACTION`,
  `PAYMENT_APPLICATION`,
  `ADJUSTMENT`.

## Estados canonicos sugeridos

### `receivable_status`

- `ISSUED`
- `PARTIALLY_PAID`
- `PAID`
- `OVERDUE`
- `CANCELLED`

### `installment_status`

- `OPEN`
- `PARTIALLY_PAID`
- `PAID`
- `OVERDUE`
- `CANCELLED`

### `payment_status`

- `REGISTERED`
- `PARTIALLY_APPLIED`
- `FULLY_APPLIED`
- `VOIDED`

### `settlement_status_current`

Para `service_orders`:

- `UNSETTLED`
- `PARTIALLY_SETTLED`
- `SETTLED`
- `CANCELLED`

Regla:

- `settlement_status_current` debe leerse como derivado de cartera y aplicaciones, no como captura arbitraria aislada.

## Reglas de integridad transversales

### 1. No pago sin cuenta

No debe registrarse un `payment_transaction` fuera de una `client_account`.

### 2. No saldo sin documento

La deuda exigible no debe nacer directo desde `service_orders`.

Debe nacer desde `receivable_documents`.

### 3. No aplicacion sin pago y sin deuda

No debe existir `payment_application` sin:

- `payment_transaction_id` valido;
- `receivable_document_id` valido;
- y `receivable_installment_id` valido.

### 4. Una remision puede estar pagada por alguien distinto del cliente

Eso no rompe el modelo.

Se conserva:

- la cuenta administrativa por cliente;
- y el pagador real en el pago.

### 5. La remision puede quedar sin cartera si se condona

Si `payer_scheme = WAIVED`:

- puede no existir `receivable_document`;
- `settlement_status_current` debe reflejar cierre no cobrable;
- y debe quedar traza administrativa del motivo.

## Lectura canonica del saldo

El saldo vigente debe poder reconstruirse asi:

- saldo por parcialidad;
- saldo agregado por documento;
- saldo agregado por cuenta;
- estado de liquidacion de la remision.

## Efecto sobre el modelo actual

La trazabilidad correcta en Vera es:

- remision;
- detalle economico;
- documento por cobrar;
- parcialidad;
- pago;
- aplicacion;
- movimiento contable.

No debe saltarse directamente de remision a pago final sin esas capas intermedias.

## Criterio documental de cierre

Este documento se considera suficiente cuando:

- deja claro donde nace la deuda;
- deja claro donde entra el pago;
- deja claro donde se aplica el pago;
- conserva separado cliente de cuenta y pagador real;
- y permite reconstruir saldo por remision, documento, parcialidad y cuenta.
