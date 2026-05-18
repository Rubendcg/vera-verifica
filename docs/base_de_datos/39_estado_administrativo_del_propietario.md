# Estado Administrativo del Propietario

## Objetivo

Definir documentalmente como se modela el estado administrativo del propietario dentro de **Vera**, separado de:

- la identidad juridica del propietario;
- la relacion vigente `OWNER` sobre un vehiculo;
- el estado de vida del vehiculo;
- el estado tecnico de una cuenta `user`.

## Principio base

Un propietario puede ser:

- una persona fisica;
- o una empresa.

Ese dato vive en `parties.party_type`.

Ademas, el propietario puede tener un estado administrativo propio dentro de Vera.

Ese estado no describe si sigue siendo el `OWNER` juridico de una unidad. Describe si el intermediario lo mantiene habilitado, suspendido o dado de baja dentro del alcance administrativo del sistema.

## Regla de autoridad

El estado administrativo del propietario solo puede ser cambiado por el intermediario.

No puede ser cambiado por:

- el propio propietario;
- un usuario autorizado no admin;
- una solicitud automatica;
- una regla derivada solo por vencimientos.

Las solicitudes del propietario pueden detonar revision, pero no cambian por si mismas el estado administrativo del propietario.

## Estados canonicos propuestos

### `ACTIVE`

Propietario habilitado administrativamente en Vera.

Efectos:

- puede seguir apareciendo como propietario vigente en sus unidades;
- puede mantener acceso a visor si tambien existen `users` y `user_vehicle_access` activos;
- puede ser destinatario de seguimiento o notificaciones cuando aplique.

### `SUSPENDED`

Propietario temporalmente suspendido por decision del intermediario.

Efectos:

- puede seguir siendo el `OWNER` juridico vigente en `vehicle_party_roles`;
- no debe operar normalmente el visor como propietario activo;
- no debe ser destinatario normal de notificaciones al propietario;
- cualquier continuidad operativa queda bajo control directo del intermediario.

### `DEREGISTERED`

Propietario dado de baja administrativamente dentro de Vera.

Efectos:

- conserva historia y trazabilidad;
- no debe operar visor de propietario;
- no debe recibir notificaciones ordinarias;
- no debe tratarse como propietario activo para flujo normal del sistema.

## Modelo de datos canonico recomendado

### En `parties`

Agregar una capa de estado administrativo del propietario:

- `owner_admin_status_current`

Semantica:

- se usa solo cuando la `party` participa o ha participado como `OWNER`;
- no reemplaza `party_type`;
- no reemplaza `vehicle_party_roles`;
- no reemplaza `users.is_active`.

Valores canonicos:

- `ACTIVE`
- `SUSPENDED`
- `DEREGISTERED`

### Historial append-only

Agregar una bitacora propia:

- `party_owner_status_history`

Campos minimos esperados:

- `id`
- `party_id`
- `previous_status`
- `new_status`
- `effective_date`
- `changed_by_user_id`
- `support_document_id`
- `reason_code`
- `notes`
- `created_at`

## Reglas de transicion

Transiciones ordinarias permitidas:

1. `ACTIVE -> SUSPENDED`
2. `SUSPENDED -> ACTIVE`
3. `ACTIVE -> DEREGISTERED`
4. `SUSPENDED -> DEREGISTERED`

Regla conservadora:

- `DEREGISTERED` no debe volver a `ACTIVE` por camino ordinario.

Si negocio requiere reactivacion posterior:

- debe documentarse como proceso excepcional controlado por el intermediario;
- no debe asumirse como camino normal del modelo.

## Relacion con `vehicle_party_roles`

El estado administrativo del propietario no debe borrar ni reescribir por si mismo la relacion juridica vigente.

Regla canonica:

- una `party` puede seguir siendo `OWNER` vigente de una unidad aun estando `SUSPENDED`;
- una `party` puede seguir apareciendo en historico aun estando `DEREGISTERED`;
- si el intermediario decide tambien cambiar la titularidad juridica, eso debe resolverse aparte en `vehicle_party_roles` y, si aplica, en `vehicle_change_requests`.

## Relacion con `users`

`users.is_active` sigue siendo una bandera tecnica de cuenta.

No debe confundirse con:

- `parties.owner_admin_status_current`

Regla canonica:

- un `user` puede seguir existiendo aunque su `party` propietaria quede `SUSPENDED` o `DEREGISTERED`;
- pero el visor de propietario y los accesos derivados no deben seguir comportandose como flujo normal mientras el propietario no este `ACTIVE`.

## Relacion con `user_vehicle_access`

Si un propietario deja de estar `ACTIVE`:

- el intermediario debe revisar y ajustar `user_vehicle_access`;
- no debe asumirse que el acceso tecnico queda valido por inercia;
- el acceso de otros usuarios administrativos del intermediario no depende de este estado.

## Efecto sobre vistas canonicas

### `vw_current_owner_by_vehicle`

Debe seguir resolviendo el `OWNER` juridico vigente, pero debe exponer tambien:

- `owner_admin_status_current`
- `owner_is_operationally_enabled`

Regla:

- `owner_is_operationally_enabled = true` solo cuando el propietario este `ACTIVE`.

### Vistas seguras para propietario

- `vw_owner_vehicle_status`
- `vw_owner_vehicle_documents`

No deben comportarse como visor normal si el propietario no esta `ACTIVE`.

### Contactos y notificaciones

Las notificaciones dirigidas al propietario o a sus contactos no deben dispararse como flujo normal cuando:

- `owner_admin_status_current = 'SUSPENDED'`
- `owner_admin_status_current = 'DEREGISTERED'`

## Efecto sobre solicitudes administrativas

El propietario no puede autoasignarse estos estados.

Puede:

- reportar situaciones;
- enviar evidencia;
- solicitar revision.

Pero solo el intermediario puede:

- suspenderlo;
- reactivarlo desde `SUSPENDED`;
- o darlo de baja en Vera.

## Diferencia contra el estado del vehiculo

No debe mezclarse:

- propietario `SUSPENDED`
- vehiculo `SUSPENDED`

Son capas distintas.

Ejemplos validos:

- propietario `SUSPENDED` con vehiculo `ACTIVE`;
- propietario `ACTIVE` con vehiculo `DEREGISTERED`;
- propietario `DEREGISTERED` con vehiculos historicos aun visibles para el intermediario.

## Criterio de cierre

Esta regla se considera cerrada cuando:

- quede claro que el propietario puede estar `ACTIVE`, `SUSPENDED` o `DEREGISTERED`;
- quede claro que solo el intermediario puede mover ese estado;
- y el modelo documental deje de mezclar estado del propietario, estado del vehiculo y estado tecnico del `user`.
