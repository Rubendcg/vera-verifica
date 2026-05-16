# Contrato Canonico de Remision para Verificaciones

## Objetivo

Cerrar la semantica de `service_orders` dentro de Vera para que deje de leerse como una tabla generica de servicios y pase a representar la remision administrativa de una operacion de verificacion.

## Decision canonica

Dentro del alcance actual de Vera, `service_orders` se especializa como:

- encabezado de remision de verificaciones;
- ligado a una unidad concreta;
- ligado a un cliente de consulta concreto;
- y preparado para alimentar despues la cuenta por cobrar y el pago aplicado.

No debe seguir leyendose como un contenedor abstracto de cualquier servicio.

## Regla de grano

Un `service_order` debe representar:

- una sola unidad;
- un solo encabezado administrativo de remision;
- una sola captura operativa del folio recibido o generado;
- y un solo contexto comercial base.

Grano canonico:

- una fila por `vehicle_id + remittance_capture_event`.

## Regla sobre folios

Vera debe distinguir dos identificadores:

### `folio`

Folio interno o canonico de Vera para la remision ya normalizada.

Debe ser unico dentro del sistema.

### `external_remission_folio`

Folio externo entregado por centro, proveedor o documento origen.

Puede repetirse entre varias filas de `service_orders` cuando un mismo folio externo cubre varias unidades.

## Regla de normalizacion por unidad

Si un centro entrega un solo folio externo que incluye varias unidades:

- Vera no debe crear una sola remision multi-vehiculo;
- Vera debe crear una remision por `vehicle_id`;
- y repetir `external_remission_folio` en cada una cuando corresponda.

Razon:

- el eje del sistema sigue siendo el vehiculo;
- la trazabilidad operativa, documental y financiera debe poder reconstruirse por unidad;
- y no debe mezclarse cobranza de varias unidades en un mismo encabezado ambiguo.

## Lo que `service_orders` si representa

- la recepcion o captura administrativa de una remision ligada a verificaciones;
- el encabezado comercial que agrupa conceptos economicos de esa remision;
- el cliente base al que se carga la operacion;
- el pagador esperado o real cuando ya se conoce;
- el estado operativo de entrega o recepcion de la remision;
- y el resumen monetario de los conceptos detallados en `service_order_items`.

## Lo que `service_orders` no representa

- el hecho regulatorio de cumplimiento;
- el PDF oficial del expediente;
- la cuenta por cobrar final por si sola;
- ni el pago aplicado en detalle.

Esas capas pertenecen a:

- `verification_events` para el hecho regulatorio;
- `documents` y `document_files` para el respaldo;
- `receivable_documents`, `payment_transactions` y `payment_applications` para la cobranza formal.

## Relacion canonica con la operacion de verificacion

`service_orders` debe quedar siempre dentro del dominio de verificaciones.

Por eso cada remision debe enlazar como minimo con:

- `vehicle_id`;
- `client_party_id`;
- y el conjunto de conceptos que despues se detallaran en `service_order_items`.

Adicionalmente puede enlazar con:

- `verification_center_id`;
- `payer_party_id`;
- `received_by_user_id`;
- `delivered_by_center_contact_id`.

La referencia exacta a `verification_type`, `verification_event_id` u `obligation_id` se cierra en `NORM-018` a nivel de `service_order_items`.

## Campos canonicos minimos de `service_orders`

### Identidad del encabezado

- `folio`
- `external_remission_folio`
- `service_order_type`

Valor canonico actual de `service_order_type`:

- `VERIFICATION_REMITTANCE`

### Referencias base

- `vehicle_id`
- `client_party_id`
- `verification_center_id`
- `payer_party_id`

### Fechas operativas

- `service_date`
- `received_from_center_at`
- `delivered_to_client_at`
- `captured_at`

### Actores operativos

- `received_by_user_id`
- `delivered_by_center_contact_id`

### Estado de remision

- `remittance_status_current`
- `payer_scheme`
- `settlement_status_current`

### Resumen monetario

- `currency`
- `subtotal_amount`
- `discount_amount`
- `tax_amount`
- `total_amount`

### Soporte administrativo

- `notes`
- `source_kind`
- `source_reference`

## Estados canonicos del encabezado

### `remittance_status_current`

Valores recomendados:

- `DRAFT`
- `RECEIVED_FROM_CENTER`
- `DELIVERED_TO_CLIENT`
- `CANCELLED`
- `CLOSED`

Semantica:

- `DRAFT`: captura incompleta o en revision;
- `RECEIVED_FROM_CENTER`: la remision ya fue recibida o registrada por el intermediario;
- `DELIVERED_TO_CLIENT`: la entrega administrativa al cliente o propietario ya quedo reflejada cuando aplique;
- `CANCELLED`: la remision se invalido y no debe seguir flujo normal;
- `CLOSED`: el encabezado ya no requiere mas gestion operativa.

### `payer_scheme`

Valores recomendados:

- `CLIENT_ACCOUNT`
- `OWNER_DIRECT`
- `THIRD_PARTY`
- `WAIVED`

Semantica:

- `CLIENT_ACCOUNT`: el cargo se lleva a la cuenta administrativa del cliente;
- `OWNER_DIRECT`: el propietario pago directamente la verificacion;
- `THIRD_PARTY`: un tercero distinto al cliente base cubre el importe;
- `WAIVED`: la remision no generara cobro.

### `settlement_status_current`

Valores recomendados:

- `UNSETTLED`
- `PARTIALLY_SETTLED`
- `SETTLED`
- `CANCELLED`

Regla:

- este campo es solo lectura de estado administrativo actual del encabezado;
- la trazabilidad fina desde remision hasta pago aplicado se cierra en `51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md`.

## Reglas de integridad documental

### 1. No mezclar varias unidades

Una remision canonica no debe incluir mas de un `vehicle_id`.

### 2. No mezclar varios clientes base

Una remision canonica no debe incluir mas de un `client_party_id`.

### 3. No existir sin conceptos

`service_orders` no debe convertirse en un sobre vacio.

Debe tener por lo menos un renglon en `service_order_items` ligado a la operacion de verificacion.

### 4. Los totales del encabezado se derivan del detalle

`subtotal_amount`, `tax_amount` y `total_amount` deben poder reconstruirse desde `service_order_items`.

### 5. No usar `service_orders` para cartera final

El hecho de que una remision exista no significa que ya exista un saldo o pago formalmente aplicado.

Esa capa se cierra despues con:

- `receivable_documents`
- `receivable_installments`
- `payment_transactions`
- `payment_applications`

## Efecto sobre el modelo actual

La especializacion correcta de `service_orders` en Vera es:

- un encabezado de remision por unidad;
- no una orden generica multiuso;
- no una factura;
- no un pago;
- no un lote de multiples vehiculos.

## Criterio documental de cierre

Este documento se considera suficiente cuando:

- deja claro que `service_orders` representa remisiones de verificaciones;
- fija el grano por unidad y evento de captura;
- separa folio interno de folio externo;
- evita remisiones multi-vehiculo;
- y deja lista la base para `service_order_items` y para la trazabilidad de cobranza ya cerrada en `51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md`.
