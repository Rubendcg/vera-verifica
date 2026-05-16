# Reintentos y Reconciliacion - Fase 4

## Objetivo

Definir la politica documental de reintentos y reconciliacion para `notification_log`, manteniendo la robustez del modelo antes de integrar proveedores reales.

## Principio base

En fase 4 no basta con "enviar".

La base debe distinguir:

- intento creado;
- dispatch real;
- aceptacion tecnica del proveedor;
- entrega o rechazo;
- reintento;
- cierre por reconciliacion.

## Unidad de reintento

El reintento debe vivir en `notification_log` por `batch_item_id`.

No debe reintentarse:

- el lote completo por defecto;
- una fila sobrescrita;
- un estado sin nueva evidencia.

Cada reintento genera:

- nueva fila;
- `attempt_no` incremental;
- nueva ventana `next_retry_at` cuando aplique.

## Politica base por estado

### Reintentables

Pueden generar nuevo intento:

- `FAILED`
- `UNKNOWN`
- `EXPIRED`

### No reintentables automaticos

No deben reintentarse automaticamente:

- `REJECTED`
- `DELIVERED`
- `READ`

### Reconciliables sin reintento

Pueden cambiar por conciliacion sin nuevo dispatch:

- `DISPATCHED`
- `PROVIDER_ACCEPTED`

## Politica inicial por canal

## `EMAIL`

Reintentos sugeridos:

- hasta `3` intentos tecnicos;
- backoff de `15m`, `2h`, `24h`;
- no reintentar si el proveedor marca rebote permanente o destino invalido.

## `WHATSAPP`

Reintentos sugeridos:

- hasta `2` intentos tecnicos;
- backoff de `30m`, `6h`;
- no reintentar si el proveedor rechaza plantilla, opt-out o destino invalido.

## Causas de fallo

### Fallo transitorio

Ejemplos:

- timeout;
- error de red;
- proveedor no disponible;
- cola saturada.

Accion:

- nuevo `attempt_no`;
- llenar `next_retry_at`;
- mantener item en estado pendiente de cierre.

### Fallo permanente

Ejemplos:

- destino invalido;
- correo inexistente;
- telefono mal formado;
- falta de consentimiento;
- plantilla rechazada por politica.

Accion:

- marcar intento como terminal;
- no reintentar automaticamente;
- dejar causa explicita en `error_code` y `error_message`.

## Reglas de reconciliacion

### Entrada de conciliacion

La conciliacion puede venir de:

- webhook;
- polling administrativo;
- lectura manual controlada;
- reproceso de acuses crudos.

### Columnas minimas para conciliar

- `provider_name`
- `provider_message_id`
- `provider_status_raw`
- `provider_confirmed_at`
- `reconciled_at`
- `response_payload_json`

### Mapeo documental

El estado crudo del proveedor debe mapearse a:

- `PROVIDER_ACCEPTED`
- `DELIVERED`
- `READ`
- `REJECTED`
- `UNKNOWN`

Si no hay certeza suficiente:

- usar `UNKNOWN`;
- no inventar `DELIVERED`.

## Reglas temporales

- no dejar intentos abiertos indefinidamente;
- si un `DISPATCHED` o `PROVIDER_ACCEPTED` supera su ventana maxima sin acuse, debe pasar por conciliacion a `EXPIRED` o `UNKNOWN`;
- la ventana maxima puede variar por canal, pero debe documentarse y persistirse en configuracion operativa futura.

## Impacto sobre `notification_batch_items`

El item debe resumir su resultado sin perder detalle del log:

- `PENDING` mientras no exista cierre;
- `DELIVERED` si algun intento cerro en `DELIVERED` o `READ`;
- `FAILED` si ya no quedan reintentos y no hubo entrega;
- `EXPIRED` si la ventana vencio sin cierre confiable;
- `CANCELLED` si el lote se aborto antes de dispatch.

`last_attempt_no` y `last_attempt_at` en `notification_batch_items` deben actualizarse desde los logs, no al reves.

## Impacto sobre `notification_batches`

El lote no debe cerrarse por contar filas unicamente.

Debe cerrarse por resumen consistente de items y logs:

- `PARTIAL` si mezcla cierres exitosos y fallidos;
- `RECONCILING` si aun espera acuses;
- `CLOSED` cuando todos los items tengan cierre defendible;
- `FAILED` si el lote no pudo salir como unidad.

## Reglas de evidencia

- conservar `request_payload_json` y `response_payload_json` cuando el proveedor entregue evidencia util;
- no borrar `provider_status_raw`;
- no reciclar `provider_message_id`;
- si un proveedor no entrega id externo, documentarlo explicitamente por canal.

## Consultas operativas futuras

La base debe poder responder:

1. que items siguen esperando conciliacion;
2. que intentos fallaron y aun son reintentables;
3. que lotes quedaron parciales por canal;
4. que proveedor rechazo mas mensajes por causa;
5. que destinatarios concentran fallos permanentes.

## Relacion con otros documentos

Este documento depende de:

- [25_estados_canonicos_notificaciones_fase_4.md](./25_estados_canonicos_notificaciones_fase_4.md)
- [27_llaves_restricciones_indices_fase_4.md](./27_llaves_restricciones_indices_fase_4.md)
- [28_contrato_preview_y_creacion_lotes_fase_4.md](./28_contrato_preview_y_creacion_lotes_fase_4.md)

## Criterio documental de aceptacion

Este documento se considera suficiente cuando:

- define que se reintenta y que no;
- separa fallo transitorio de fallo permanente;
- deja claro como se cierra un intento sin sobreescribir historial;
- permite abrir integracion con proveedor real sin ambiguedad de estados.
