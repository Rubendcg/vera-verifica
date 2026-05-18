# Contrato Canonico de Conceptos Economicos por Verificacion

## Objetivo

Cerrar la semantica de `service_order_items` dentro de Vera para que cada renglon economico quede ligado a la operacion real de verificacion y no se reduzca a texto libre con un monto.

## Decision canonica

`service_order_items` se especializa como:

- detalle economico canonico de una remision de verificaciones;
- por concepto economico;
- por alcance operativo;
- y, cuando aplique, por tipo de verificacion y referencia a la operacion origen.

La respuesta documental para `NORM-018` es:

- si, el renglon debe poder guardar `verification_type`;
- si, debe poder guardar referencia a `verification_obligation` o `verification_event`;
- y si, debe conservar monto canonico y monto efectivamente aplicado.

## Regla de grano

Un `service_order_item` debe representar:

- un solo concepto economico;
- dentro de una sola remision `service_order`;
- y sobre un solo alcance operativo.

Grano canonico:

- una fila por `service_order_id + concept_code + operational_scope + source_reference`.

## Alcance operativo del renglon

### `VERIFICATION_LINE`

Renglon ligado a una verificacion concreta.

Ejemplos:

- fisico-mecanica;
- emisiones.

### `ORDER_LEVEL`

Renglon ligado al encabezado de la remision y no a una verificacion puntual.

Ejemplos:

- entrega;
- gasto administrativo;
- descuento general;
- ajuste administrativo.

## Catalogo canonico minimo de `concept_code`

### Conceptos de verificacion

- `PHYSICAL_MECHANICAL_SERVICE`
- `EMISSIONS_SERVICE`

### Conceptos de orden

- `DELIVERY_FEE`
- `ADMIN_FEE`
- `DISCOUNT`
- `ADJUSTMENT`

Regla:

- el catalogo debe mantenerse cerrado;
- no debe depender de descripciones libres para clasificar economicamente la remision.

## Regla sobre `verification_type`

### Cuando es obligatorio

`verification_type` debe ser obligatorio cuando:

- `operational_scope = VERIFICATION_LINE`.

Valores canonicos esperados:

- `PHYSICAL_MECHANICAL`
- `EMISSIONS`

### Cuando debe ir nulo

`verification_type` debe ir nulo cuando:

- `operational_scope = ORDER_LEVEL`.

### Regla adicional

Un mismo renglon no debe representar dos tipos de verificacion al mismo tiempo.

Si una remision cubre ambas verificaciones:

- debe tener dos renglones distintos de servicio;
- uno para `PHYSICAL_MECHANICAL`;
- y otro para `EMISSIONS`.

## Regla sobre referencias operativas

### `verification_obligation_id`

Referencia operativa al pendiente o caso que origino el renglon.

Debe poder existir cuando:

- el renglon nace de seguimiento administrativo;
- o cuando el evento final aun no esta capturado.

### `verification_event_id`

Referencia al hecho realmente realizado.

Debe poder existir cuando:

- la remision corresponde a una verificacion ya ejecutada;
- o cuando la entrega del centro ya viene respaldada por evento capturado.

### Regla de obligatoriedad

Para `VERIFICATION_LINE`, debe existir al menos uno de:

- `verification_obligation_id`
- `verification_event_id`

Para `ORDER_LEVEL`, ambos deben ir nulos.

### Regla de coherencia

Si un renglon tiene ambos:

- la obligacion y el evento deben corresponder al mismo `vehicle_id`;
- y deben corresponder al mismo `verification_type`.

Si el renglon tiene solo `verification_event_id`:

- `verification_type` debe coincidir con el evento.

Si el renglon tiene solo `verification_obligation_id`:

- `verification_type` debe coincidir con la obligacion.

## Campos canonicos minimos de `service_order_items`

### Identidad y orden

- `service_order_id`
- `line_no`
- `concept_code`
- `operational_scope`

### Referencias operativas

- `verification_type`
- `verification_obligation_id`
- `verification_event_id`

### Cantidad y precios

- `quantity`
- `canonical_unit_price_amount`
- `applied_unit_price_amount`
- `line_subtotal_amount`
- `discount_amount`
- `tax_amount`
- `line_total_amount`
- `currency`

### Gobierno del precio

- `price_origin`
- `price_override_reason_code`
- `notes`

## Regla sobre monto canonico

### `canonical_unit_price_amount`

Es el precio de referencia que el sistema reconoce como base para ese concepto en el momento de captura.

Puede venir de:

- tarifa del centro;
- tarifa pactada por cliente;
- politica interna del intermediario;
- o catalogo canonico vigente.

### `applied_unit_price_amount`

Es el precio realmente usado en esa remision.

Puede ser igual o distinto del canonico.

### Regla documental

Si `applied_unit_price_amount` difiere de `canonical_unit_price_amount`, debe existir trazabilidad administrativa en:

- `price_origin`;
- y, cuando aplique, `price_override_reason_code`.

## Regla sobre totales

`line_total_amount` no debe ser capturado como numero aislado imposible de reconstruir.

Debe poder derivarse de:

- `quantity`
- `applied_unit_price_amount`
- `line_subtotal_amount`
- `discount_amount`
- `tax_amount`

## Valores canonicos de `price_origin`

- `CANONICAL_DEFAULT`
- `CENTER_REPORTED`
- `INTERMEDIARY_OVERRIDE`
- `WAIVED`

Semantica:

- `CANONICAL_DEFAULT`: se uso el monto canonico sin ajuste;
- `CENTER_REPORTED`: el centro reporto un importe y ese fue el aplicado;
- `INTERMEDIARY_OVERRIDE`: el intermediario ajusto el importe aplicado;
- `WAIVED`: el concepto no genera cobro real.

## Reglas de integridad documental

### 1. Un renglon no reemplaza el encabezado

`service_order_items` no debe repetir datos propios de `service_orders` salvo los necesarios para trazabilidad economica.

### 2. No usar descripcion libre como clasificacion

`concept_code` debe ser la llave de interpretacion del renglon.

La descripcion libre puede existir, pero no sustituye al catalogo.

### 3. No mezclar dos verificaciones en el mismo renglon

Fisico-mecanica y emisiones deben vivir en renglones distintos.

### 4. Las lineas de orden no deben fingir verificacion

Si `operational_scope = ORDER_LEVEL`:

- `verification_type` debe ser nulo;
- `verification_obligation_id` debe ser nulo;
- `verification_event_id` debe ser nulo.

### 5. Toda linea de verificacion debe poder auditarse

Si `operational_scope = VERIFICATION_LINE`, debe poder responderse:

- que tipo de verificacion se cobro;
- a que obligacion o evento se refiere;
- cual era el precio canonico;
- cual fue el precio aplicado.

## Efecto sobre el modelo actual

La especializacion correcta de `service_order_items` en Vera es:

- detalle canonico de conceptos;
- no texto libre con monto unico;
- no sustituto de `verification_events`;
- no sustituto de pagos aplicados;
- no sustituto de cartera.

## Relacion con la trazabilidad de cobranza

Este documento cierra:

- que concepto economico se capturo;
- a que verificacion apunta;
- y con que monto canonico o aplicado.

No cierra aun por si solo:

- como ese renglon se convierte en saldo;
- como se aplica el pago;
- ni como se concilia contra cartera.

Eso ya queda formalizado en:

- [51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md](./51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md)

## Criterio documental de cierre

Este documento se considera suficiente cuando:

- obliga a distinguir lineas de verificacion de lineas de orden;
- exige `verification_type` cuando el renglon cobra una verificacion;
- define como ligar el renglon a obligacion o evento;
- fija monto canonico y monto aplicado como conceptos separados;
- y deja lista la base para la trazabilidad de cobro y pago ya formalizada en `51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md`.
