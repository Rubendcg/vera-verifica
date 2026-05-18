# Estados Canonicos de Notificaciones - Fase 4

## Objetivo

Definir los estados canonicos de `notification_batches` y `notification_log` para la fase 4 de **Vera**, manteniendo separadas:

- la planeacion del envio;
- la ejecucion del envio;
- la confirmacion del proveedor;
- la reconciliacion operativa.

## Principio base

Las tablas no representan el mismo concepto:

- `notification_batches` modela el lote planeado o ejecutado;
- `notification_log` modela cada intento y su resultado frente al proveedor.

Por eso sus estados no deben duplicarse de forma mecanica.

## Estados canonicos de `notification_batches`

### `DRAFT`

Uso:

- lote construido pero aun editable;
- puede venir de un preview persistido o de una preparacion administrativa;
- no debe generar envios.

### `READY`

Uso:

- lote validado;
- con destinatario, regla, plantilla e items consistentes;
- listo para ponerse en cola o calendarizarse.

### `SCHEDULED`

Uso:

- lote listo pero programado para una fecha futura;
- no debe ejecutarse antes de `scheduled_for`.

### `PROCESSING`

Uso:

- un worker o job ya esta intentando despachar el lote;
- no debe tomarse por otro worker concurrente.

### `PARTIAL`

Uso:

- parte de los items ya genero intentos utiles;
- otra parte fallo o quedo inconclusa;
- requiere revision o reintento controlado.

### `SENT`

Uso:

- todos los items del lote ya fueron enviados al proveedor o cola externa;
- aun no implica confirmacion final de entrega.

### `RECONCILING`

Uso:

- el lote ya tuvo dispatch, pero sigue esperando acuses finales;
- el job de reconciliacion aun puede mover logs individuales.

### `CLOSED`

Uso:

- el lote ya cerro administrativamente;
- los logs asociados ya no esperan cambios relevantes;
- solo queda como historial.

### `FAILED`

Uso:

- el lote fallo como unidad antes de completar el dispatch esperado;
- no basta con revisar un item aislado;
- requiere rehacer o regenerar el lote.

### `CANCELLED`

Uso:

- el lote se aborto antes de completar el proceso;
- no debe volver a enviarse automaticamente.

## Transiciones permitidas de `notification_batches`

Secuencia principal:

1. `DRAFT -> READY`
2. `READY -> SCHEDULED`
3. `READY -> PROCESSING`
4. `SCHEDULED -> PROCESSING`
5. `PROCESSING -> SENT`
6. `PROCESSING -> PARTIAL`
7. `PROCESSING -> FAILED`
8. `SENT -> RECONCILING`
9. `PARTIAL -> RECONCILING`
10. `RECONCILING -> CLOSED`
11. `DRAFT -> CANCELLED`
12. `READY -> CANCELLED`
13. `SCHEDULED -> CANCELLED`

Reglas:

- `CLOSED`, `FAILED` y `CANCELLED` se tratan como estados terminales;
- `PARTIAL` no implica exito ni fracaso global;
- `SENT` no debe confundirse con entregado.

## Estados canonicos de `notification_log`

### `CREATED`

Uso:

- el intento se registro internamente;
- aun no se entrega al proveedor.

### `DISPATCHED`

Uso:

- el mensaje ya salio de Vera hacia el proveedor o cola externa;
- aun no existe acuse util del proveedor.

### `PROVIDER_ACCEPTED`

Uso:

- el proveedor acepto tecnicamente el mensaje;
- existe `provider_message_id` o equivalente;
- aun no se confirma entrega final.

### `DELIVERED`

Uso:

- el proveedor confirmo entrega al destino.

### `READ`

Uso:

- solo para canales que soporten confirmacion de lectura;
- no debe exigirse para correo clasico.

### `REJECTED`

Uso:

- el proveedor rechazo el mensaje por destino, plantilla, formato o politica;
- no es una falla transitoria de infraestructura.

### `FAILED`

Uso:

- el intento fallo por error tecnico interno o de comunicacion;
- puede ser reintentable segun politica.

### `EXPIRED`

Uso:

- paso la ventana maxima de confirmacion;
- el estado no pudo conciliarse a entrega o rechazo.

### `UNKNOWN`

Uso:

- el proveedor devolvio una respuesta inconsistente o insuficiente;
- la conciliacion no puede cerrar el intento con certeza.

## Transiciones permitidas de `notification_log`

Secuencia principal:

1. `CREATED -> DISPATCHED`
2. `DISPATCHED -> PROVIDER_ACCEPTED`
3. `DISPATCHED -> FAILED`
4. `PROVIDER_ACCEPTED -> DELIVERED`
5. `PROVIDER_ACCEPTED -> READ`
6. `PROVIDER_ACCEPTED -> REJECTED`
7. `PROVIDER_ACCEPTED -> EXPIRED`
8. `PROVIDER_ACCEPTED -> UNKNOWN`
9. `DELIVERED -> READ`

Reglas:

- `DELIVERED`, `READ`, `REJECTED`, `FAILED`, `EXPIRED` y `UNKNOWN` son estados terminales;
- `READ` implica `DELIVERED` previo o equivalente del proveedor;
- no debe existir salto directo `CREATED -> DELIVERED`.

## Relacion entre ambos niveles

### Como se resume el lote

`notification_batches.status` se calcula desde sus logs e items:

- si todos los logs quedaron en `DELIVERED`, `READ` o `PROVIDER_ACCEPTED` y aun falta conciliacion completa, el lote puede quedar en `RECONCILING`;
- si todos los items ya cerraron, el lote pasa a `CLOSED`;
- si coexistieron exitos y fallos, el lote pasa a `PARTIAL`;
- si no pudo salir como unidad, el lote pasa a `FAILED`.

### Lo que no debe hacerse

No debe inferirse:

- `batch = SENT` porque exista un solo `log = DISPATCHED`;
- `batch = CLOSED` porque un proveedor acepte el envio;
- `log = DELIVERED` solo por haber creado el lote.

## Reglas de reconciliacion

La reconciliacion debe:

- releer estados del proveedor cuando existan ids externos;
- cerrar intentos viejos sin confirmacion a `EXPIRED` o `UNKNOWN`;
- evitar que un mismo intento siga "abierto" indefinidamente;
- dejar marca de fecha de conciliacion en columnas futuras como `reconciled_at`.

## Campos que conviene reservar en la futura implementacion

Para `notification_batches`:

- `status`
- `scheduled_for`
- `started_at`
- `finished_at`
- `dedupe_key`
- `created_by_user_id`

Para `notification_log`:

- `status`
- `provider_name`
- `provider_message_id`
- `provider_status_raw`
- `attempt_no`
- `dispatched_at`
- `provider_confirmed_at`
- `reconciled_at`
- `error_code`
- `error_message`

## Reglas de deduplicacion vinculadas al estado

- no se debe regenerar automaticamente un lote `READY`, `SCHEDULED`, `PROCESSING`, `SENT` o `RECONCILING` con el mismo `dedupe_key`;
- un lote `FAILED` o `CANCELLED` puede regenerarse, pero como lote nuevo;
- un log `FAILED` puede generar reintento solo con nuevo `attempt_no`;
- no se debe reusar el mismo `provider_message_id` entre intentos.

## Criterio documental de aceptacion

Este catalogo se considerara suficiente cuando:

- permita disenar enums o catalogos SQL sin ambiguedad;
- distinga lote de intento individual;
- soporte conciliacion y deduplicacion;
- no mezcle "enviado" con "entregado".
