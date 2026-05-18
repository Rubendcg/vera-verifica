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

Este documento es la fuente semantica canonica del contrato maestro del modelo:

- [52_contrato_maestro_del_modelo_bd.md](./52_contrato_maestro_del_modelo_bd.md)

## Terminos de negocio

### Agente de centro

Contacto operativo del centro de verificacion con quien el intermediario puede coordinar seguimiento, entrega o solicitud de informacion.

### Enunciado canonico del negocio

Descripcion documental oficial de lo que Vera es y no es dentro del proyecto.

Se documenta en `32_enunciado_canonico_del_negocio_vera.md`.

### Intermediario

Operador principal de Vera.

Es el tercero que administra el seguimiento de vehiculos, verificaciones, documentos, notificaciones, remisiones y pagos dentro del alcance del sistema.

Internamente puede dividirse en roles de operacion, documentos, notificaciones, finanzas o auditoria.

### Acceso vehicular

Permiso explicito para que un `user` consulte o gestione un `vehicle` en el sistema.

Se controla en `user_vehicle_access`.

No sustituye roles internos del intermediario.

### Administrador

Usuario interno con `is_admin = true`.

Puede ver toda la operacion, registrar eventos, crear reglas, generar obligaciones y consultar informacion global.

Regla canonica actualizada:

- `is_admin` ya no debe leerse como modelo de permisos de negocio suficiente;
- su cierre estructural pasa a `48_modelo_canonico_permisos_internos_del_intermediario.md`.

### Rol interno del intermediario

Perfil de autorizacion interno asignado a un usuario del intermediario para operar modulos especificos.

Su cierre canonico se define en `48_modelo_canonico_permisos_internos_del_intermediario.md`.

### Permiso interno

Capacidad granular asociada a un modulo o accion administrativa del intermediario.

Se recomienda agruparla por rol interno, no colgarla solo de `is_admin`.

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

Representa una sede operativa concreta, no una persona de contacto.

Se modela en `verification_centers`.

### Contacto primario de centro

Contacto operativo principal que el intermediario debe usar para coordinar con una sede de verificacion.

Se recomienda resolverlo desde `verification_center_contacts`.

### Elegibilidad de notificacion

Resultado administrativo que indica si una fila puede pasar al flujo externo normal de notificaciones.

Solo debe ser verdadera cuando la unidad sigue `ACTIVE`, el propietario sigue `ACTIVE`, existe requerimiento regulatorio real y existe base suficiente para notificar.

### Alcance de notificacion

Clasificacion documental del uso permitido de una fila en `vw_notification_candidates`.

Valores canonicos:

- `NORMAL_EXTERNAL`
- `INTERNAL_ONLY`
- `SUPPRESSED`

Sirve para separar recordatorio normal al cliente o propietario del seguimiento interno del intermediario.

### Solicitud operativa a centro

Salida administrativa generada por el intermediario hacia el agente del centro para coordinar una verificacion o su seguimiento.

Debe usar payload minimizado y no mezclar cobranza ni datos internos ajenos al caso.

### Cliente de consulta

Parte o empresa a la que se agrupa operativamente una unidad para reportes, seguimiento y servicio.

No siempre coincide con el propietario legal.

### Remision de verificacion

Encabezado administrativo que agrupa los conceptos economicos de una verificacion o entrega asociada a una sola unidad.

En el modelo canonico se representa en `service_orders`.

### Renglon economico de remision

Detalle canonico de una remision que representa un concepto economico puntual.

En el modelo canonico se representa en `service_order_items`.

### Folio externo de remision

Folio entregado por centro o documento origen.

Puede repetirse entre varias remisiones internas cuando el mismo folio externo cubre varias unidades y Vera las normaliza por separado.

### Pagador real

Parte que efectivamente cubre el importe de una remision.

No siempre coincide con el `client_party_id`; puede ser el propietario u otro tercero segun `payer_scheme`.

### Monto canonico

Precio de referencia reconocido por Vera para un concepto economico al momento de captura.

No necesariamente coincide con el monto finalmente aplicado.

### Monto aplicado

Precio realmente usado en el renglon economico de la remision.

Si difiere del monto canonico, debe quedar trazabilidad administrativa del origen o ajuste.

### Cuenta administrativa del cliente

Agrupador de cartera usado por Vera para concentrar la deuda y los pagos del cliente de consulta.

En el modelo canonico se representa en `client_accounts`.

### Documento por cobrar

Documento administrativo que convierte una remision en saldo exigible.

En el modelo canonico se representa en `receivable_documents`.

### Parcialidad

Vencimiento o tramo de cobro asociado a un documento por cobrar.

En el modelo canonico se representa en `receivable_installments`.

### Pago registrado

Entrada de dinero reconocida por el intermediario antes de su aplicacion final.

En el modelo canonico se representa en `payment_transactions`.

### Pago aplicado

Asignacion concreta de un pago hacia una parcialidad o documento por cobrar.

En el modelo canonico se representa en `payment_applications`.

### Pago no aplicado

Parte de un pago registrado que aun no ha sido asignada a una parcialidad o documento por cobrar.

En el modelo canonico vive como `unapplied_amount` en `payment_transactions`.

### Movimiento de cuenta

Asiento append-only que refleja un hecho contable relevante dentro de la cuenta administrativa del cliente.

En el modelo canonico se representa en `account_movements`.

### Saldo exigible

Importe aun pendiente de pago despues de emitir documento por cobrar y descontar aplicaciones registradas.

### Constancia de emisiones

Documento PDF que respalda una verificacion de emisiones.

En el modelo documental usa `document_type = CONSTANCIA_EMISIONES`.

### Constancia fisico-mecanica

Documento PDF que respalda una verificacion fisico-mecanica.

En el modelo documental usa `document_type = CONSTANCIA_FISICO_MECANICA`.

### Evento de verificacion

Registro de una verificacion realmente realizada sobre una unidad.

Incluye fecha, vigencia, resultado, centro y opcionalmente documento fuente.

Puede existir:

- ligado a una obligacion operativa;
- o sin obligacion previa cuando se captura historia o regularizacion.

Se modela en `verification_events`.

### Expediente documental

Conjunto de documentos y archivos PDF asociados a una unidad.

Se compone de `documents` y `document_files`.

El expediente oficial se compone de tres tipos nucleares y puede complementarse con tipos auxiliares.

### Estado de vida del vehiculo

Capa administrativa que responde si la unidad esta `ACTIVE`, `SUSPENDED`, `TRANSFERRED` o `DEREGISTERED`.

No debe confundirse con el estado regulatorio ni con `vehicles.is_active`.

Se documenta en `35_submodelo_estado_de_vida_del_vehiculo.md`.

### Supresion de notificacion

Motivo documental por el cual una unidad no debe entrar al flujo externo normal de notificaciones.

Ejemplos canonicos:

- `VEHICLE_SUSPENDED`
- `VEHICLE_TRANSFERRED`
- `VEHICLE_DEREGISTERED`
- `OWNER_SUSPENDED`
- `OWNER_DEREGISTERED`

### Identidad maestra del vehiculo

Regla canonica por la cual la unidad se identifica principalmente por `serial_niv` y no por la placa.

Se documenta en `34_politica_identidad_maestra_del_vehiculo.md`.

### Marcador de calendario

Caracter de placa usado para ubicar una unidad dentro de una regla de calendario.

En federal normalmente se toma de la posicion `3`.

En estatal normalmente se toma de la posicion `4`.

### Placa vigente

Valor actual de `vehicles.plate`.

Puede cambiar sin crear un vehiculo nuevo, pero obliga a recalcular el marcador y las reglas regulatorias futuras aplicables.

### Transferido

Estado de vida vigente en el que la unidad queda pendiente de regularizacion por cambio de dueno.

Mientras esta en `TRANSFERRED`, el propietario anterior deja de verla en su visor.

Un nuevo dueno puede reportar su incorporacion, pero la regularizacion depende del intermediario.

### Restablecimiento

Solicitud para reactivar o reincorporar una unidad que se encuentra en `DEREGISTERED`.

No opera automaticamente y debe notificar al intermediario.

### Solicitud administrativa del propietario

Reporte o caso administrativo separado de `owner_response` para cambios de vida o titularidad del vehiculo.

Se documenta en `36_flujo_canonico_solicitudes_del_propietario.md`.

### Rol vigente

Relacion reconocida por el intermediario entre una `party` y un `vehicle` que sigue abierta en `vehicle_party_roles`.

Se documenta en `37_reglas_canonicas_vehicle_party_roles.md`.

### Cliente vigente

Parte actualmente reconocida con rol `CLIENT` sobre un vehiculo.

Se resuelve de forma canonica en `vw_current_client_by_vehicle`.

### Propietario vigente

Parte actualmente reconocida con rol `OWNER` sobre un vehiculo.

Se resuelve de forma canonica en `vw_current_owner_by_vehicle`.

Puede quedar temporalmente vacio si la unidad esta en `TRANSFERRED`.

### Estado administrativo del propietario

Estado de una `party` cuando participa como propietario dentro de Vera.

Se documenta en `39_estado_administrativo_del_propietario.md`.

Valores canonicos propuestos:

- `ACTIVE`
- `SUSPENDED`
- `DEREGISTERED`

Solo el intermediario puede moverlo.

### Poseedor legal vigente

Parte actualmente reconocida con rol `LEGAL_POSSESSOR` sobre un vehiculo.

Se resuelve de forma canonica en `vw_current_legal_possessor_by_vehicle`.

### Contacto operativo vigente

Destinatario activo de reportes o notificaciones para un vehiculo, resuelto sobre el `CLIENT` vigente.

Se resuelve de forma canonica en `vw_current_operational_contacts_by_vehicle`.

### Obligacion de verificacion

Pendiente operativo que representa una verificacion que debe atenderse, confirmarse, programarse, vencer o cerrarse.

Puede ligar como maximo un `verification_event`.

Si queda `COMPLETED`, significa que ya hubo atencion real del caso con evento ligado.

Si queda `CANCELLED`, significa cierre administrativo sin afirmar que la verificacion ya se realizo.

Se modela en `verification_obligations`.

### Aplicabilidad de verificacion

Decision de negocio que responde si un tipo de verificacion aplica o no a una unidad concreta.

Se documenta en `40_perfil_canonico_aplicabilidad_verificaciones.md`.

### `NO_APLICA`

Salida regulatoria valida solo cuando el perfil vigente de aplicabilidad marca ese tipo de verificacion como `NOT_REQUIRED`.

### Party

Persona fisica o moral relacionada con la operacion.

Puede actuar como propietario, cliente, poseedor legal o contacto operativo.

Se modela en `parties`.

### PDF vigente

Archivo actual de un documento dentro del expediente.

En `document_files` se identifica con `is_current = true`.

### Documento vigente

Documento logico que sigue contando como soporte actual del expediente.

En Vera corresponde a `documents.document_status = ACTIVE`.

### Documento visible al propietario

Documento que, ademas de existir en el expediente, supera la matriz canonica de visibilidad del visor del propietario.

No depende solo de `is_visible_to_owner`; tambien depende de acceso, estado del propietario, estado del vehiculo, tipo documental y estado documental.

### Tipo documental oficial

Categoria documental nuclear del expediente base de Vera.

El catalogo canonico es:

- `TARJETA_CIRCULACION`
- `CONSTANCIA_FISICO_MECANICA`
- `CONSTANCIA_EMISIONES`

### Tipo documental auxiliar

Categoria documental admitida como soporte complementario, pero no sustitutivo del expediente oficial.

El catalogo actual admitido es:

- `PERMISO`
- `CONTRATO_ARRENDAMIENTO`
- `OTRO`

### Poseedor legal

Parte que mantiene la posesion legal reconocida de una unidad cuando aplica.

La misma `party` puede ser `LEGAL_POSSESSOR` en varias unidades distintas sin conflicto global, incluso con distintos propietarios o clientes.

### Propietario

Parte que tiene la propiedad juridica o control principal de la unidad.

Puede ser una persona fisica o una empresa.

No necesariamente coincide con el usuario que entra al portal.

### Visor del propietario

Alcance controlado del propietario o usuario autorizado dentro de Vera.

Permite consultar su informacion, descargar documentos visibles y reportar cambios controlados, pero no operar la administracion global del sistema.

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

### Serie o NIV

Dato maestro obligatorio de identidad del vehiculo operativo.

Debe ser unico, estable y no reutilizable.

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

Regla canonica:

- `is_admin` se conserva como superusuario tecnico y compatibilidad temporal;
- el modelo de permisos interno canonico se resuelve en `internal_roles`, `internal_permissions`, `internal_role_permissions` y `user_internal_roles`.

### `internal_roles`

Catalogo canonico de roles internos acumulables del intermediario.

Campos clave:

- `role_code`
- `role_name`
- `is_active`

### `internal_permissions`

Catalogo canonico de permisos internos granulares.

Campos clave:

- `permission_code`
- `module_code`
- `action_code`
- `is_active`

### `internal_role_permissions`

Tabla puente que compone un rol interno a partir de permisos concretos.

Campos clave:

- `internal_role_id`
- `internal_permission_id`
- `granted_by_user_id`
- `granted_at`

### `user_internal_roles`

Asignacion vigente o historica de roles internos a usuarios del intermediario.

Campos clave:

- `user_id`
- `internal_role_id`
- `start_date`
- `end_date`
- `is_current`

### `parties`

Personas fisicas o morales relacionadas con la operacion.

Campos clave:

- `party_type`
- `owner_admin_status_current`
- `rfc`
- `legal_name`
- `display_name`

### `party_owner_status_history`

Bitacora append-only del estado administrativo del propietario.

Campos clave:

- `party_id`
- `previous_status`
- `new_status`
- `effective_date`
- `changed_by_user_id`
- `support_document_id`
- `reason_code`

### `vehicles`

Padron maestro de unidades.

Campos clave:

- `plate`
- `serial_niv`
- `engine_number`
- `unit_type`
- `regime`
- `lifecycle_status_current`
- `schedule_marker_auto`
- `schedule_marker_override`
- `schedule_marker_effective`
- `is_active`

### `vehicle_lifecycle_events`

Bitacora append-only de cambios administrativos de vida del vehiculo.

Campos clave:

- `vehicle_id`
- `previous_status`
- `new_status`
- `effective_date`
- `reported_by_user_id`
- `regularized_by_user_id`
- `support_document_id`
- `reason_code`

### `vehicle_change_requests`

Tabla principal de solicitudes administrativas del propietario, usuario autorizado o nuevo dueno.

Campos clave:

- `vehicle_id`
- `request_type`
- `request_status`
- `submitted_by_user_id`
- `claimant_party_id`
- `support_document_id`
- `proposed_lifecycle_status`
- `requested_effective_date`

### `vehicle_change_request_history`

Bitacora append-only de cambios de estado sobre una solicitud administrativa.

Campos clave:

- `request_id`
- `previous_status`
- `new_status`
- `changed_by_user_id`
- `change_notes`

### `vehicle_party_roles`

Relacion juridica u operativa entre una `party` y un `vehicle`.

Campos clave:

- `vehicle_id`
- `party_id`
- `role_type`
- `start_date`
- `end_date`
- `is_current`

Regla canonica:

- el catalogo canonico actual se limita a `OWNER`, `CLIENT` y `LEGAL_POSSESSOR`;
- los tres son singleton por vehiculo;
- la misma `party` puede repetirse como `LEGAL_POSSESSOR` en varias unidades distintas;
- la integridad de vigencias se cierra en `37_reglas_canonicas_vehicle_party_roles.md`.

### `vw_current_owner_by_vehicle`

Vista canonica de propietario vigente por unidad.

### `vw_current_client_by_vehicle`

Vista canonica de cliente vigente por unidad.

### `vw_current_legal_possessor_by_vehicle`

Vista canonica de poseedor legal vigente por unidad.

### `vw_current_operational_contacts_by_vehicle`

Vista canonica de destinatarios operativos vigentes por unidad, canal y tipo de reporte.

### `user_vehicle_access`

Control de acceso de usuarios a unidades.

Campos clave:

- `user_id`
- `vehicle_id`
- `access_type`
- `granted_by_user_id`
- `is_active`

### `vehicle_verification_profile`

Perfil vigente de aplicabilidad por unidad y tipo de verificacion.

Campos clave:

- `vehicle_id`
- `verification_type`
- `applicability_status`
- `reason_code`
- `source_kind`
- `reviewed_by_user_id`
- `support_document_id`
- `effective_date`
- `is_current`

### `vehicle_verification_profile_history`

Bitacora append-only de cambios de aplicabilidad.

Campos clave:

- `profile_id`
- `previous_applicability_status`
- `new_applicability_status`
- `previous_reason_code`
- `new_reason_code`
- `changed_by_user_id`
- `support_document_id`

### `verification_centers`

Catalogo de centros de verificacion.

Campos clave:

- `center_type`
- `code`
- `name`
- `state_code`
- `city`
- `address_line`
- `contact_name`
- `phone`
- `email`
- `is_active`

### `verification_center_contacts`

Contactos operativos historicos o vigentes de una sede de verificacion.

Campos clave:

- `center_id`
- `contact_role`
- `contact_name`
- `phone`
- `whatsapp_phone`
- `email`
- `preferred_channel`
- `is_primary`
- `is_active`
- `start_date`
- `end_date`

Regla canonica:

- un centro puede tener varios contactos;
- solo uno debe ser el contacto primario activo para operacion cotidiana.

### `vw_center_request_items`

Vista administrativa derivada para solicitudes o reportes hacia centro.

Grano canonico:

- una fila por `scheduled_center_id + obligation_id`

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

Regla canonica:

- los tipos nucleares oficiales se definen en `44_politica_tipos_documentales_oficiales.md`;
- los tipos auxiliares siguen permitidos, pero no sustituyen a un faltante oficial.
- para tipos oficiales nucleares solo puede existir un `ACTIVE` por unidad y por tipo.
- la visibilidad del propietario se cierra aparte en `46_matriz_visibilidad_documental_del_propietario.md`.

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

Regla canonica:

- por `document_id` solo puede existir una fila `is_current = true`.

## Estados y valores operativos

### Estado de vida vigente del vehiculo

Valores canonicos propuestos:

- `ACTIVE`
- `SUSPENDED`
- `TRANSFERRED`
- `DEREGISTERED`

### Estado de solicitud administrativa

Valores canonicos propuestos para `vehicle_change_requests.request_status`:

- `SUBMITTED`
- `UNDER_REVIEW`
- `WAITING_EVIDENCE`
- `APPROVED_PENDING_REGULARIZATION`
- `REGULARIZED`
- `REJECTED`
- `WITHDRAWN`

### Tipo de solicitud administrativa

Valores canonicos propuestos para `vehicle_change_requests.request_type`:

- `OWNERSHIP_TRANSFER_REPORT`
- `NEW_OWNER_CLAIM`
- `SUSPENSION_REQUEST`
- `DEREGISTRATION_REQUEST`
- `RESTORATION_REQUEST`

### Estado de aplicabilidad de verificacion

Valores canonicos propuestos para `vehicle_verification_profile.applicability_status`:

- `REQUIRED`
- `NOT_REQUIRED`

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

Semantica canonica:

- `ACTIVE`: cuenta como soporte vigente;
- `EXPIRED`: historico vencido;
- `CANCELLED`: soporte invalidado;
- `ARCHIVED`: soporte sustituido o retenido solo como antecedente;
- `PENDING_REVIEW`: soporte cargado pero aun no aceptado como vigente.

### Tipo documental

Valores actuales de `documents.document_type`:

- `TARJETA_CIRCULACION`
- `CONSTANCIA_FISICO_MECANICA`
- `CONSTANCIA_EMISIONES`
- `PERMISO`
- `CONTRATO_ARRENDAMIENTO`
- `OTRO`

Clasificacion canonica:

- oficiales nucleares: `TARJETA_CIRCULACION`, `CONSTANCIA_FISICO_MECANICA`, `CONSTANCIA_EMISIONES`
- auxiliares: `PERMISO`, `CONTRATO_ARRENDAMIENTO`, `OTRO`

## Reglas de lectura rapida

### Diferencia entre `party` y `user`

`party` representa a la persona o empresa en el modelo de negocio.

`user` representa la cuenta que entra al sistema.

### Diferencia entre `verification_event` y `verification_obligation`

`verification_event` es una verificacion ya realizada.

`verification_obligation` es un pendiente operativo o un seguimiento de cumplimiento.

Regla canonica adicional:

- `COMPLETED` significa obligacion atendida;
- cumplimiento vigente sale del evento compliant y su `valid_until`, no de la obligacion por si sola.

### Diferencia entre `document` y `document_file`

`document` es el expediente logico.

`document_file` es el PDF concreto y versionado.

### Diferencia entre acceso y propiedad

Un usuario puede tener acceso a una unidad sin ser su propietario legal.

Por eso `user_vehicle_access` no reemplaza a `vehicle_party_roles`.
