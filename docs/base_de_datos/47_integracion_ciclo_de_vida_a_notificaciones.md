# Integracion del Ciclo de Vida del Vehiculo a Notificaciones

## Objetivo

Cerrar la regla canonica por la cual la fase 4 no debe disparar notificaciones normales solo por estado regulatorio.

Las alertas tambien deben respetar:

- el estado de vida vigente del vehiculo;
- el estado administrativo vigente del propietario;
- y la diferencia entre seguimiento interno del intermediario y notificacion externa al propietario o contacto autorizado.

## Estado

Este documento deja cerrada la politica documental de integracion entre:

- `vw_vehicle_verification_status`;
- `vehicles.lifecycle_status_current`;
- `vw_current_owner_by_vehicle.owner_admin_status_current`;
- `vw_notification_candidates`;
- `notification_batches`;
- `notification_batch_items`.

## Regla canonica de alcance

Vera distingue dos flujos distintos:

1. flujo normal de notificacion externa;
2. seguimiento interno del intermediario.

No deben mezclarse.

### Flujo normal de notificacion externa

Aplica cuando la unidad aun debe seguir en operacion ordinaria y existe una razon regulatoria real para avisar.

Su destino puede ser:

- el propietario;
- o un contacto autorizado resuelto por `vw_current_operational_contacts_by_vehicle`.

### Seguimiento interno del intermediario

Aplica cuando la unidad ya no debe seguir en flujo externo normal, pero su situacion aun requiere monitoreo administrativo.

Ejemplos:

- unidad `SUSPENDED`;
- unidad `TRANSFERRED`;
- unidad `DEREGISTERED`;
- propietario `SUSPENDED`;
- propietario `DEREGISTERED`.

En esos casos el intermediario puede ver el caso, pero no debe reutilizar el mismo lote pensado para recordatorios ordinarios al cliente o propietario.

## Matriz canonica de elegibilidad

### Caso 1. Vehiculo `ACTIVE` y propietario `ACTIVE`

Resultado:

- puede seguir en flujo normal de notificacion externa;
- puede generar candidato elegible;
- puede entrar a preview y creacion de lote.

### Caso 2. Vehiculo `ACTIVE` y propietario `SUSPENDED`

Resultado:

- no debe seguir en flujo normal de notificacion externa;
- el caso queda para seguimiento interno del intermediario;
- no debe generarse lote externo mientras el propietario siga no activo.

### Caso 3. Vehiculo `ACTIVE` y propietario `DEREGISTERED`

Resultado:

- no debe seguir en flujo normal de notificacion externa;
- el caso queda para seguimiento interno del intermediario;
- cualquier reactivacion o regularizacion depende del intermediario.

### Caso 4. Vehiculo `SUSPENDED`

Resultado:

- no debe generar recordatorios ordinarios al propietario ni a contactos autorizados;
- puede mantenerse visible para seguimiento interno;
- no debe entrar a lotes externos hasta volver a `ACTIVE`.

### Caso 5. Vehiculo `TRANSFERRED`

Resultado:

- el propietario anterior no debe recibir recordatorios;
- la unidad no debe seguir en flujo externo normal;
- el caso queda para seguimiento interno hasta regularizacion;
- si existe `NEW_OWNER_CLAIM`, la atencion sigue siendo interna hasta que el intermediario cierre la regularizacion.

### Caso 6. Vehiculo `DEREGISTERED`

Resultado:

- no debe generar notificaciones externas;
- solo debe quedar visible al intermediario;
- cualquier intento de restablecimiento debe tratarse como seguimiento interno.

## Politica canonica de supresion

La capa de notificaciones debe distinguir entre:

- caso elegible para flujo normal;
- caso solo visible para seguimiento interno;
- caso totalmente suprimido por no tener valor operativo.

### `notification_scope`

Valores documentales canonicos:

- `NORMAL_EXTERNAL`
- `INTERNAL_ONLY`
- `SUPPRESSED`

Reglas:

- `NORMAL_EXTERNAL` permite continuar a resolucion de destinatarios y creacion de lotes;
- `INTERNAL_ONLY` conserva visibilidad administrativa, pero no crea lote externo;
- `SUPPRESSED` representa filas sin valor de notificacion ni de seguimiento operativo suficiente.

### `notification_suppression_reason`

Valores documentales recomendados:

- `VEHICLE_SUSPENDED`
- `VEHICLE_TRANSFERRED`
- `VEHICLE_DEREGISTERED`
- `OWNER_SUSPENDED`
- `OWNER_DEREGISTERED`
- `NO_ACTIVE_CLIENT`
- `NO_ACTIVE_RECIPIENT`
- `NOT_REQUIRED`
- `DATA_INSUFFICIENT`

Regla:

- solo debe venir nulo cuando `notification_scope = NORMAL_EXTERNAL`.

## Impacto canonico sobre `vw_notification_candidates`

La vista sigue siendo administrativa.

No es solo una vista de "unidades que se enviaran", sino una vista de:

- unidades elegibles;
- unidades suprimidas por politica;
- unidades retenidas para seguimiento interno.

### Columnas que deben participar

La vista debe exponer o derivar al menos:

- `vehicle_lifecycle_status_current`
- `owner_admin_status_current`
- `notification_scope`
- `notification_suppression_reason`
- `is_notification_eligible`

### Regla de `is_notification_eligible`

Solo debe ser `true` cuando:

- `notification_scope = NORMAL_EXTERNAL`;
- el tipo de verificacion aplica;
- existe razon regulatoria real;
- la base de datos minima permite una notificacion confiable.

Debe ser `false` cuando:

- la unidad esta `SUSPENDED`, `TRANSFERRED` o `DEREGISTERED`;
- el propietario esta `SUSPENDED` o `DEREGISTERED`;
- no existe cliente vigente;
- no existe destinatario activo para el flujo que se quiere operar;
- o el caso carece de valor regulatorio real.

### Regla de consulta administrativa

Cuando se consulte `vw_notification_candidates` para auditoria o backlog:

- `onlyEligible = true` debe devolver solo `notification_scope = NORMAL_EXTERNAL`;
- `onlyEligible = false` puede devolver tambien `INTERNAL_ONLY` para explicar por que una unidad no fue enviada.

## Regla sobre lotes y logs

### `notification_batches`

Los lotes normales para propietario o cliente solo pueden construirse con filas:

- `notification_scope = NORMAL_EXTERNAL`;
- `is_notification_eligible = true`.

### `notification_batch_items`

No debe existir item externo para casos:

- `VEHICLE_SUSPENDED`
- `VEHICLE_TRANSFERRED`
- `VEHICLE_DEREGISTERED`
- `OWNER_SUSPENDED`
- `OWNER_DEREGISTERED`

Si en una fase posterior se desea notificar internamente al intermediario, eso debe abrirse como flujo o tipo de lote explicito, no como reutilizacion silenciosa del lote externo.

### `notification_log`

No debe registrar intentos externos para filas `INTERNAL_ONLY` o `SUPPRESSED`, salvo que exista un flujo administrativo separado y declarado.

## Interaccion con reportes

Los reportes operativos por cliente pueden seguir mostrando unidades con riesgo regulatorio, pero deben respetar esta politica:

- `NORMAL_EXTERNAL`: puede mostrarse en reportes operativos ordinarios;
- `INTERNAL_ONLY`: puede mostrarse solo en reportes administrativos del intermediario;
- `SUPPRESSED`: debe quedar fuera de reportes normales y de lotes.

## Criterio documental de cierre

Este documento se considera suficiente cuando:

- separa notificacion externa de seguimiento interno;
- impide notificar al propietario anterior de una unidad `TRANSFERRED`;
- impide notificar externamente unidades `DEREGISTERED`;
- integra estado de vida del vehiculo y estado administrativo del propietario a `vw_notification_candidates`;
- y deja claro que los lotes externos no deben construirse con filas `INTERNAL_ONLY`.
