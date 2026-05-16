# Tablas y Relaciones

## Relacion principal del sistema

La estructura gira alrededor de tres ejes:

- `vehicles`: la unidad;
- `parties`: la persona o empresa;
- `vehicle_party_roles`: el rol que esa parte tiene respecto al vehiculo.

Esto evita errores comunes como asumir que:

- el cliente de consulta siempre es el propietario;
- el propietario siempre coincide con el poseedor legal;
- el cliente de consulta siempre coincide con el poseedor legal;
- quien entra al portal siempre coincide con la relacion juridica.

Este documento es la fuente estructural canonica del contrato maestro del modelo:

- [52_contrato_maestro_del_modelo_bd.md](./52_contrato_maestro_del_modelo_bd.md)

## Tablas base

### `parties`

Representa cualquier persona fisica o moral relacionada con la operacion.

Campos importantes:

- `party_type`
- `owner_admin_status_current`
- `rfc`
- `legal_name`
- `display_name`
- `phone`
- `email`

Uso:

- cliente de consulta;
- propietario;
- poseedor legal;
- contacto operativo.

Logica relevante:

- `owner_admin_status_current` solo aplica cuando la `party` participa como `OWNER`;
- un propietario puede estar `ACTIVE`, `SUSPENDED` o `DEREGISTERED`;
- ese estado lo mueve solo el intermediario;
- no sustituye `party_type` ni la vigencia de `vehicle_party_roles`.

### `party_owner_status_history`

Bitacora administrativa append-only del estado del propietario dentro de Vera.

Campos importantes:

- `party_id`
- `previous_status`
- `new_status`
- `effective_date`
- `changed_by_user_id`
- `support_document_id`
- `reason_code`

Uso:

- separar el estado administrativo del propietario del estado del vehiculo;
- auditar suspensiones y bajas de propietario;
- conservar trazabilidad de quien movio ese estado y cuando.

### `users`

Representa la cuenta que entra al sistema.

Campos importantes:

- `party_id`
- `email`
- `password_hash`
- `full_name`
- `is_active`
- `is_admin`

Uso:

- autenticacion;
- acceso al portal;
- segregacion entre administrador y propietario.

Logica relevante:

- `is_active` es una bandera tecnica de cuenta;
- `is_admin` queda como superusuario tecnico o compatibilidad temporal;
- no sustituye el estado administrativo del propietario en `parties.owner_admin_status_current`;
- y no sustituye el submodelo canonico de permisos internos del intermediario.

### `internal_roles`

Catalogo de roles internos del intermediario.

Campos importantes:

- `role_code`
- `role_name`
- `description`
- `is_system`
- `is_active`

### `internal_permissions`

Catalogo de permisos internos granulares.

Campos importantes:

- `permission_code`
- `module_code`
- `action_code`
- `description`
- `is_active`

### `internal_role_permissions`

Relacion N:M entre rol interno y permiso.

Campos importantes:

- `role_id`
- `permission_id`

### `user_internal_roles`

Asignacion de roles internos a usuarios.

Campos importantes:

- `user_id`
- `role_id`
- `granted_by_user_id`
- `start_at`
- `end_at`
- `is_current`

### `vehicles`

Tabla maestra de unidades.

Campos importantes:

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

Logica relevante:

- `serial_niv` es obligatorio para toda unidad operativa;
- `serial_niv` es la identidad maestra del vehiculo;
- `lifecycle_status_current` representa la vida administrativa vigente de la unidad;
- `plate` representa la placa vigente actual y puede cambiar sin crear un vehiculo nuevo;
- si cambia `plate`, se recalcula `schedule_marker_auto` y se reevalua `schedule_marker_effective` con la nueva placa;
- `schedule_marker_effective` solo debe diferir de `schedule_marker_auto` cuando exista una correccion aprobada por negocio;
- `FEDERAL` usa la posicion `3` de la placa y `ESTATAL` la posicion `4`;
- `is_active` debe quedar como bandera tecnica y no como sustituto de todo el estado administrativo.

### `vehicle_verification_profile`

Perfil canonico de aplicabilidad por vehiculo y tipo de verificacion.

Campos importantes:

- `vehicle_id`
- `verification_type`
- `applicability_status`
- `reason_code`
- `source_kind`
- `reviewed_by_user_id`
- `support_document_id`
- `effective_date`
- `is_current`

Uso:

- declarar si `PHYSICAL_MECHANICAL` aplica;
- declarar si `EMISSIONS` aplica;
- evitar que `NO_APLICA` salga por heuristica implicita;
- resolver primero el "si aplica" antes de consultar calendario.

### `vehicle_verification_profile_history`

Bitacora append-only de cambios de aplicabilidad.

Campos importantes:

- `profile_id`
- `previous_applicability_status`
- `new_applicability_status`
- `previous_reason_code`
- `new_reason_code`
- `changed_by_user_id`
- `support_document_id`
- `change_notes`

Uso:

- auditar cambios de aplicabilidad;
- justificar excepciones regulatorias o de negocio;
- conservar trazabilidad sin reescribir la fila vigente.

### `vehicle_lifecycle_events`

Bitacora administrativa append-only de la vida del vehiculo.

Campos importantes:

- `vehicle_id`
- `previous_status`
- `new_status`
- `effective_date`
- `reported_by_user_id`
- `regularized_by_user_id`
- `support_document_id`
- `reason_code`

Uso:

- separar `ACTIVE`, `SUSPENDED`, `TRANSFERRED` y `DEREGISTERED` del estado regulatorio;
- conservar historial de suspension, transferencia, reactivacion administrativa y baja;
- quitar del visor del propietario anterior las unidades en `TRANSFERRED` hasta regularizacion.

### `vehicle_change_requests`

Tabla principal de solicitudes administrativas reportadas por propietarios, usuarios autorizados o nuevos duenos.

Campos importantes:

- `vehicle_id`
- `request_type`
- `request_status`
- `submitted_by_user_id`
- `claimant_party_id`
- `support_document_id`
- `proposed_lifecycle_status`
- `requested_effective_date`

Uso:

- separar cambios administrativos de `owner_response`;
- capturar cambio de dueno, reclamo de nuevo dueno, suspension, baja y restablecimiento;
- notificar al intermediario sin regularizar automaticamente la unidad.

### `vehicle_change_request_history`

Bitacora append-only del flujo de revision administrativa.

Campos importantes:

- `request_id`
- `previous_status`
- `new_status`
- `changed_by_user_id`
- `change_notes`

Uso:

- auditar revision, requerimiento de evidencia, aprobacion, rechazo y regularizacion;
- dejar claro quien movio cada solicitud y cuando.

### `vehicle_party_roles`

Es la tabla mas importante del modelo relacional del vehiculo.

Campos importantes:

- `vehicle_id`
- `party_id`
- `role_type`
- `start_date`
- `end_date`
- `is_current`

Valores permitidos de `role_type`:

- `CLIENT`
- `OWNER`
- `LEGAL_POSSESSOR`

Reglas canonicas de vigencia:

- el catalogo canonico actual se limita a `OWNER`, `CLIENT` y `LEGAL_POSSESSOR`;
- los tres son roles singleton por vehiculo;
- una misma `party` puede tener varios `role_type` distintos sobre la misma unidad;
- una misma `party` puede ser `LEGAL_POSSESSOR` en varias unidades distintas sin conflicto global;
- los cambios regularizados cierran la fila anterior y crean una nueva, sin reciclar historia.

Consultas derivadas canonicas:

- `vw_current_owner_by_vehicle`
- `vw_current_client_by_vehicle`
- `vw_current_legal_possessor_by_vehicle`
- `vw_vehicle_current_relationships`

## Acceso al portal

### `user_vehicle_access`

Controla que usuario puede ver que vehiculo.

Campos importantes:

- `user_id`
- `vehicle_id`
- `access_type`
- `granted_by_user_id`
- `is_active`

Razon de diseno:

El acceso del propietario no debe depender directamente del rol juridico del vehiculo. Se controla aparte para soportar:

- propietarios;
- gestores;
- administradores de flota;
- usuarios autorizados temporalmente.

Regla adicional:

- `user_vehicle_access` no sustituye roles internos del intermediario;
- esos viven en `internal_roles`, `internal_permissions`, `internal_role_permissions` y `user_internal_roles`.

## Verificaciones

### `verification_centers`

Catalogo de centros.

Campos importantes:

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

Reglas canonicas:

- una fila representa una sede operativa concreta;
- si una misma organizacion opera varias sedes, deben ser varios centros;
- `contact_name`, `phone` y `email` solo deben leerse como snapshot o reflejo operativo del contacto primario;
- la fuente normalizada del contacto vive en `verification_center_contacts`.

### `verification_center_contacts`

Contactos operativos historicos o vigentes de un centro.

Campos importantes:

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

Reglas canonicas:

- un centro puede tener varios contactos;
- solo una fila activa puede ser el contacto primario operativo;
- el contacto primario resuelve a quien debe contactar el intermediario;
- si un centro activo no tiene contacto primario activo, el dato esta incompleto.

Vista derivada recomendada:

- `vw_primary_verification_center_contact`

### `verification_events`

Historial de verificaciones.

Campos importantes:

- `vehicle_id`
- `verification_type`
- `event_date`
- `valid_until`
- `result_status`
- `center_id`
- `source_document_id`

Notas:

- `source_document_id` puede apuntar al documento PDF que respalda la verificacion;
- esta tabla es la base del estatus vigente, vencido o por vencer.

### `verification_schedule_rules`

Calendario de vencimientos y segmentacion.

Campos importantes:

- `regime`
- `schedule_position`
- `schedule_marker`
- `verification_type`
- `window_start_month`
- `window_end_month`
- `cutoff_day`
- `window_label`

Uso:

- reportes por tercer digito en federal;
- reportes por cuarto digito en estatal;
- agrupacion de clientes por bloque de vencimiento.

Regla canonica:

- esta tabla responde cuando debe verificarse una unidad;
- no responde si la verificacion aplica;
- la aplicabilidad vive en `vehicle_verification_profile`.

### `verification_obligations`

Seguimiento operativo de una verificacion pendiente.

Campos importantes:

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
- `closed_at`

Reglas canonicas:

- una obligacion puede ligar `0..1` `verification_event`;
- `COMPLETED` exige `verification_event_id`;
- `CANCELLED` cierra administrativamente sin evento;
- `COMPLETED` no equivale por si mismo a cumplimiento vigente;
- el cumplimiento vigente se sigue resolviendo desde el ultimo evento compliant y su `valid_until`.

### `verification_obligation_history`

Bitacora append-only del seguimiento operativo de una obligacion.

Campos importantes:

- `obligation_id`
- `changed_by_user_id`
- `action_type`
- `previous_status`
- `new_status`
- `previous_owner_response`
- `new_owner_response`
- `notes`

Uso:

- auditar respuestas del propietario;
- auditar programacion administrativa;
- auditar cierres `COMPLETED` y `CANCELLED`;
- conservar la historia del caso sin reescribirla.

### `vw_center_request_items`

Vista administrativa derivada para reportes o solicitudes hacia centro.

Grano canonico:

- una fila por `scheduled_center_id + obligation_id`

Uso:

- preparar reporte detallado a centro;
- agrupar backlog por sede operativa;
- resolver payload minimizado para coordinacion;
- evitar mezclar esta salida con recordatorios al propietario.

## Expediente documental

### `documents`

Registro logico del expediente documental por unidad.

Campos importantes:

- `vehicle_id`
- `related_party_id`
- `document_type`
- `verification_type`
- `document_number`
- `issue_date`
- `valid_until`
- `document_status`
- `is_visible_to_owner`

Clasificacion canonica de `document_type`:

- tipos oficiales nucleares: `TARJETA_CIRCULACION`, `CONSTANCIA_FISICO_MECANICA`, `CONSTANCIA_EMISIONES`
- tipos auxiliares admitidos: `PERMISO`, `CONTRATO_ARRENDAMIENTO`, `OTRO`

Reglas canonicas:

- los tres tipos oficiales forman el expediente base;
- los tipos auxiliares complementan, pero no sustituyen a los oficiales;
- la obligatoriedad efectiva depende del estado de vida de la unidad y de la aplicabilidad vigente de cada verificacion.
- para tipos oficiales nucleares solo debe existir un `ACTIVE` por `vehicle_id + document_type`.

### `document_files`

Archivo PDF versionado de un documento logico.

Campos importantes:

- `document_id`
- `version_no`
- `mime_type`
- `storage_kind`
- `storage_path`
- `sha256_hex`
- `is_current`

Reglas canonicas:

- debe existir una sola version vigente por documento;
- la nuclearidad del tipo documental vive en `documents.document_type`, no en `document_files`.

### `vw_vehicle_official_document_status`

Vista derivada recomendada para leer completitud del expediente oficial por unidad.

Debe poder responder:

- que tipos oficiales le aplican;
- que tipos oficiales ya tienen documento vigente;
- y que faltantes documentales siguen abiertos.

### `document_access_log`

Bitacora append-only de trazabilidad operativa del expediente.

Campos importantes:

- `document_id`
- `document_file_id`
- `vehicle_id`
- `actor_user_id`
- `action_type`
- `storage_kind`
- `created_at`

## Contabilidad

### `service_orders`

Encabezado canonico de remision de verificaciones.

Campos importantes:

- `folio`
- `external_remission_folio`
- `service_date`
- `vehicle_id`
- `client_party_id`
- `verification_center_id`
- `payer_party_id`
- `service_order_type`
- `remittance_status_current`
- `payer_scheme`
- `settlement_status_current`
- `total_amount`

Reglas canonicas:

- una fila por `vehicle_id + remittance_capture_event`;
- no debe mezclar multiples unidades;
- `folio` debe ser interno y unico en Vera;
- `external_remission_folio` puede repetirse si un folio externo cubre varias unidades y Vera las normaliza por separado.

### `service_order_items`

Detalle economico canonico por verificacion o por concepto de orden.

Campos importantes:

- `service_order_id`
- `line_no`
- `concept_code`
- `operational_scope`
- `verification_type`
- `verification_obligation_id`
- `verification_event_id`
- `quantity`
- `canonical_unit_price_amount`
- `applied_unit_price_amount`
- `line_subtotal_amount`
- `discount_amount`
- `tax_amount`
- `line_total_amount`
- `currency`
- `price_origin`

Nota:

Esta tabla no debe exponerse en APIs para propietarios.

La especializacion del encabezado se cierra en:

- [49_contrato_canonico_remision_verificaciones.md](./49_contrato_canonico_remision_verificaciones.md)

La especializacion del detalle se cierra en:

- [50_contrato_canonico_conceptos_economicos_por_verificacion.md](./50_contrato_canonico_conceptos_economicos_por_verificacion.md)

### `client_accounts`

Cuenta administrativa de cartera por cliente de consulta.

Campos importantes:

- `client_party_id`
- `account_status`
- `credit_limit`
- `credit_days`
- `currency`

### `receivable_documents`

Documento por cobrar que convierte una remision en saldo exigible.

Campos importantes:

- `client_account_id`
- `service_order_id`
- `folio`
- `document_type`
- `issue_date`
- `due_date`
- `total_amount`
- `balance_amount`
- `receivable_status`
- `payer_scheme_snapshot`

### `receivable_installments`

Parcialidades o vencimientos del documento por cobrar.

Campos importantes:

- `receivable_document_id`
- `installment_no`
- `due_date`
- `amount_due`
- `amount_paid`
- `installment_status`

### `payment_transactions`

Pago recibido y registrado por el intermediario.

Campos importantes:

- `client_account_id`
- `payer_party_id`
- `payment_date`
- `payment_method`
- `amount`
- `payment_status`
- `unapplied_amount`

### `payment_applications`

Aplicacion concreta de un pago sobre deuda.

Campos importantes:

- `payment_transaction_id`
- `receivable_document_id`
- `receivable_installment_id`
- `applied_amount`
- `applied_at`

### `account_movements`

Bitacora append-only del saldo administrativo de la cuenta.

Campos importantes:

- `client_account_id`
- `movement_type`
- `reference_type`
- `reference_id`
- `debit_amount`
- `credit_amount`
- `balance_after_amount`

La trazabilidad de cobranza se cierra en:

- [51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md](./51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md)

## Relaciones resumidas

```text
parties 1---N vehicle_party_roles N---1 vehicles
users 1---N user_vehicle_access N---1 vehicles
vehicles 1---N vehicle_lifecycle_events
vehicles 1---N vehicle_change_requests 1---N vehicle_change_request_history
vehicles 1---N verification_events
verification_centers 1---N verification_events
verification_centers 1---N verification_center_contacts
vehicles 1---N verification_obligations 1---N verification_obligation_history
verification_centers 1---N verification_obligations
verification_centers 1---N service_orders
verification_events 0..1---0..1 verification_obligations
vehicles 1---N documents 1---N document_files
vehicles 1---N service_orders 1---N service_order_items
parties 1---N client_accounts
client_accounts 1---N receivable_documents 1---N receivable_installments
client_accounts 1---N payment_transactions 1---N payment_applications
receivable_documents 1---N payment_applications
receivable_installments 1---N payment_applications
client_accounts 1---N account_movements
parties 1---N party_contacts
parties 1---N report_recipients
```
