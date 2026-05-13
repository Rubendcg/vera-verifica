# Glosario de la Base de Datos

## Objetivo

Definir en un solo lugar los terminos principales del modelo de datos de **Vera** para que documentacion, backend y operacion usen el mismo lenguaje.

## Alcance

Este glosario cubre:

- conceptos de negocio;
- tablas principales;
- estados operativos;
- tipos documentales;
- terminos de acceso y cumplimiento regulatorio.

## Terminos de negocio

### Acceso vehicular

Permiso explicito para que un `user` consulte o gestione un `vehicle` en el sistema.

Se controla en `user_vehicle_access`.

### Administrador

Usuario interno con `is_admin = true`.

Puede ver toda la operacion, registrar eventos, crear reglas, generar obligaciones y consultar informacion global.

### Calendario regulatorio

Conjunto de reglas que determina cuando una unidad debe verificar segun:

- regimen;
- posicion aplicable en placa;
- marcador de calendario;
- tipo de verificacion;
- ventana de cumplimiento.

Se modela en `verification_schedule_rules`.

### Centro de verificacion

Entidad autorizada o registrada donde ocurre una verificacion fisico-mecanica o de emisiones.

Se modela en `verification_centers`.

### Cliente de consulta

Parte o empresa a la que se agrupa operativamente una unidad para reportes, seguimiento y servicio.

No siempre coincide con el propietario legal.

### Constancia de emisiones

Documento PDF que respalda una verificacion de emisiones.

En el modelo documental usa `document_type = CONSTANCIA_EMISIONES`.

### Constancia fisico-mecanica

Documento PDF que respalda una verificacion fisico-mecanica.

En el modelo documental usa `document_type = CONSTANCIA_FISICO_MECANICA`.

### Evento de verificacion

Registro de una verificacion realmente realizada sobre una unidad.

Incluye fecha, vigencia, resultado, centro y opcionalmente documento fuente.

Se modela en `verification_events`.

### Expediente documental

Conjunto de documentos y archivos PDF asociados a una unidad.

Se compone de `documents` y `document_files`.

### Marcador de calendario

Caracter de placa usado para ubicar una unidad dentro de una regla de calendario.

En federal normalmente se toma de la posicion `3`.

En estatal normalmente se toma de la posicion `4`.

### Obligacion de verificacion

Pendiente operativo que representa una verificacion que debe atenderse, confirmarse, programarse, vencer o cerrarse.

Se modela en `verification_obligations`.

### Party

Persona fisica o moral relacionada con la operacion.

Puede actuar como propietario, permisionario, poseedor legal, titular documental, cliente o contacto operativo.

Se modela en `parties`.

### PDF vigente

Archivo actual de un documento dentro del expediente.

En `document_files` se identifica con `is_current = true`.

### Permisionario

Parte que opera o ampara legalmente la unidad bajo permiso.

Se expresa por rol en `vehicle_party_roles`.

### Propietario

Parte que tiene la propiedad juridica o control principal de la unidad.

No necesariamente coincide con el usuario que entra al portal.

### Regimen

Clasificacion regulatoria principal de la unidad.

Valores actuales:

- `FEDERAL`
- `ESTATAL`

### Tarjeta de circulacion

Documento PDF que respalda la identificacion documental de la unidad para circular.

En el modelo documental usa `document_type = TARJETA_CIRCULACION`.

### Unidad

Vehiculo registrado en el sistema.

Se modela en `vehicles`.

### Usuario autorizado

Cuenta con acceso activo a una unidad sin ser necesariamente administrador ni propietario juridico.

Se modela por `users` mas `user_vehicle_access`.

### Verificacion de emisiones

Control regulatorio de contaminantes o humo aplicable segun tipo de unidad y regimen.

En Vera se representa con `verification_type = EMISSIONS`.

### Verificacion fisico-mecanica

Control regulatorio del estado mecanico y condiciones fisicas de la unidad.

En Vera se representa con `verification_type = PHYSICAL_MECHANICAL`.

### Ventana de cumplimiento

Periodo regulatorio en el que una unidad debe atender una verificacion.

Se define con meses de inicio y fin en `verification_schedule_rules`.

## Tablas principales

### `users`

Cuentas que entran al sistema.

Campos clave:

- `email`
- `password_hash`
- `full_name`
- `is_admin`
- `is_active`

### `parties`

Personas fisicas o morales relacionadas con la operacion.

Campos clave:

- `party_type`
- `rfc`
- `legal_name`
- `display_name`

### `vehicles`

Padron maestro de unidades.

Campos clave:

- `plate`
- `serial_niv`
- `engine_number`
- `unit_type`
- `regime`
- `schedule_marker_auto`
- `schedule_marker_override`
- `schedule_marker_effective`
- `is_active`

### `vehicle_party_roles`

Relacion juridica u operativa entre una `party` y un `vehicle`.

Campos clave:

- `vehicle_id`
- `party_id`
- `role_type`
- `start_date`
- `end_date`
- `is_current`

### `user_vehicle_access`

Control de acceso de usuarios a unidades.

Campos clave:

- `user_id`
- `vehicle_id`
- `access_type`
- `granted_by_user_id`
- `is_active`

### `verification_centers`

Catalogo de centros de verificacion.

Campos clave:

- `center_type`
- `code`
- `name`
- `state_code`
- `is_active`

### `verification_events`

Historial de verificaciones ejecutadas.

Campos clave:

- `vehicle_id`
- `center_id`
- `verification_type`
- `event_date`
- `valid_until`
- `result_status`
- `source_document_id`

### `verification_schedule_rules`

Reglas de calendario por regimen, marcador y tipo de verificacion.

Campos clave:

- `regime`
- `schedule_position`
- `schedule_marker`
- `verification_type`
- `window_sequence`
- `window_start_month`
- `window_end_month`
- `window_label`
- `is_active`

### `verification_obligations`

Pendientes operativos derivados de calendario o captura manual.

Campos clave:

- `vehicle_id`
- `verification_type`
- `due_date`
- `window_start_date`
- `window_end_date`
- `status`
- `owner_response`
- `owner_user_id`
- `admin_user_id`
- `scheduled_center_id`
- `scheduled_for`
- `verification_event_id`

### `verification_obligation_history`

Bitacora de cambios de una obligacion.

Campos clave:

- `obligation_id`
- `changed_by_user_id`
- `action_type`
- `previous_status`
- `new_status`
- `previous_owner_response`
- `new_owner_response`

### `documents`

Registro logico del documento asociado a una unidad.

Campos clave:

- `vehicle_id`
- `document_type`
- `verification_type`
- `document_number`
- `issue_date`
- `valid_until`
- `document_status`
- `is_visible_to_owner`

### `document_files`

Archivo PDF real y sus versiones.

Campos clave:

- `document_id`
- `version_no`
- `mime_type`
- `storage_kind`
- `storage_path`
- `content_bytea`
- `sha256_hex`
- `page_count`
- `ocr_status`
- `is_current`

## Estados y valores operativos

### Estado regulatorio del vehiculo

Valores actuales usados por fase 2:

- `VIGENTE`
- `POR_VENCER`
- `VENCIDO`
- `SIN_REGISTRO`
- `NO_APLICA`
- `INACTIVO`

### Resultado de verificacion

Valores actuales de `verification_events.result_status`:

- `PASSED`
- `FAILED`
- `CONDITIONAL`
- `CANCELLED`

### Estado de obligacion

Valores actuales de `verification_obligations.status`:

- `PENDING`
- `OWNER_CONFIRMED`
- `OWNER_DECLINED`
- `REQUESTED_ASSISTANCE`
- `SCHEDULED`
- `COMPLETED`
- `OVERDUE`
- `CANCELLED`

### Respuesta del propietario

Valores actuales de `verification_obligations.owner_response`:

- `CONFIRMED`
- `DECLINED`
- `REQUEST_ASSISTANCE`
- `REQUEST_RESCHEDULE`

### Accion de historial de obligacion

Valores actuales de `verification_obligation_history.action_type`:

- `CREATED`
- `OWNER_RESPONSE`
- `ADMIN_UPDATED`
- `SCHEDULED`
- `COMPLETED`
- `CANCELLED`
- `SYSTEM_UPDATED`

### Estado documental

Valores actuales de `documents.document_status`:

- `ACTIVE`
- `EXPIRED`
- `CANCELLED`
- `ARCHIVED`
- `PENDING_REVIEW`

### Tipo documental

Valores actuales de `documents.document_type`:

- `TARJETA_CIRCULACION`
- `CONSTANCIA_FISICO_MECANICA`
- `CONSTANCIA_EMISIONES`
- `PERMISO`
- `CONTRATO_ARRENDAMIENTO`
- `OTRO`

## Reglas de lectura rapida

### Diferencia entre `party` y `user`

`party` representa a la persona o empresa en el modelo de negocio.

`user` representa la cuenta que entra al sistema.

### Diferencia entre `verification_event` y `verification_obligation`

`verification_event` es una verificacion ya realizada.

`verification_obligation` es un pendiente operativo o un seguimiento de cumplimiento.

### Diferencia entre `document` y `document_file`

`document` es el expediente logico.

`document_file` es el PDF concreto y versionado.

### Diferencia entre acceso y propiedad

Un usuario puede tener acceso a una unidad sin ser su propietario legal.

Por eso `user_vehicle_access` no reemplaza a `vehicle_party_roles`.
