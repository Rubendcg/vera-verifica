# Diagrama Final de Base de Datos

## Objetivo

Este diagrama resume la estructura final propuesta para **Vera**, integrando:

- el enunciado canonico del negocio como tercero intermediario;

- acceso y usuarios;
- personas y relaciones con vehículos;
- verificaciones y calendario;
- confirmación del propietario sobre verificaciones pendientes;
- documentos PDF;
- reportes y notificaciones;
- analítica operativa;
- cobranza y control de deuda.

## Version SVG

- [06_diagrama_final_bd.svg](./06_diagrama_final_bd.svg)
- [55_diagrama_maestro_bd_aprobado.svg](./55_diagrama_maestro_bd_aprobado.svg)

Este documento permanece como narrativa visual extendida y antecedente de trabajo.

La version visual maestra aprobada en el cierre estructural se publica en:

- [55_diagrama_maestro_bd_aprobado.md](./55_diagrama_maestro_bd_aprobado.md)

El contrato maestro vigente se apoya en ese diagrama aprobado:

- [52_contrato_maestro_del_modelo_bd.md](./52_contrato_maestro_del_modelo_bd.md)

Si llega a existir conflicto entre cualquier diagrama y `02_tablas_y_relaciones.md`, debe corregirse el diagrama.

## Lectura del modelo

El modelo se organiza en cuatro capas:

### 1. Núcleo operativo

- `parties`
- `users`
- `internal_roles`
- `internal_permissions`
- `internal_role_permissions`
- `user_internal_roles`
- `vehicles`
- `vehicle_verification_profile`
- `vehicle_verification_profile_history`
- `vehicle_lifecycle_events`
- `vehicle_change_requests`
- `vehicle_change_request_history`
- `vehicle_party_roles`
- `party_owner_status_history`
- `user_vehicle_access`

### 2. Cumplimiento y documentos

- `verification_centers`
- `verification_center_contacts`
- `verification_events`
- `verification_schedule_rules`
- `verification_obligations`
- `verification_obligation_history`
- `documents`
- `document_files`
- `document_access_log`

### 3. Analítica y calidad del dato

- `vehicle_status_history`
- `daily_vehicle_status_snapshot`
- `verification_sessions`
- `verification_center_capacity_daily`
- `calendar_business_days`
- `data_quality_issues`

### 4. Gestión, cobranza y comunicación

- `service_orders`
- `service_order_items`
- `client_accounts`
- `receivable_documents`
- `receivable_installments`
- `payment_transactions`
- `payment_applications`
- `account_movements`
- `party_contacts`
- `report_recipients`
- `notification_rules`
- `message_templates`
- `notification_batches`
- `notification_batch_items`
- `notification_log`

## Diagrama ER Final

```mermaid
erDiagram
    PARTIES ||--o{ USERS : "puede_tener"
    PARTIES ||--o{ PARTY_CONTACTS : "tiene"
    PARTIES ||--o{ VEHICLE_PARTY_ROLES : "participa"
    PARTIES ||--o{ PARTY_OWNER_STATUS_HISTORY : "historial_owner"
    PARTIES ||--o{ SERVICE_ORDERS : "es_cliente"
    PARTIES ||--o{ SERVICE_ORDERS : "es_pagador"
    PARTIES ||--o{ PAYMENT_TRANSACTIONS : "paga"
    PARTIES ||--|| CLIENT_ACCOUNTS : "tiene_cuenta"
    PARTIES ||--o{ REPORT_RECIPIENTS : "recibe_reportes"
    PARTIES ||--o{ DOCUMENTS : "relaciona_documento"
    PARTY_CONTACTS ||--o{ REPORT_RECIPIENTS : "es_contacto"

    USERS ||--o{ USER_VEHICLE_ACCESS : "accede"
    USERS ||--o{ USER_INTERNAL_ROLES : "recibe_rol"
    USERS ||--o{ DOCUMENTS : "carga"
    USERS ||--o{ DOCUMENT_FILES : "sube"
    USERS ||--o{ DOCUMENT_ACCESS_LOG : "audita"
    USERS ||--o{ PARTY_OWNER_STATUS_HISTORY : "mueve_estado_owner"
    USERS ||--o{ VEHICLE_VERIFICATION_PROFILE_HISTORY : "mueve_aplicabilidad"
    USERS ||--o{ VEHICLE_LIFECYCLE_EVENTS : "reporta_o_regulariza"
    USERS ||--o{ VEHICLE_CHANGE_REQUESTS : "solicita_o_revisa"
    USERS ||--o{ VEHICLE_CHANGE_REQUEST_HISTORY : "mueve_solicitud"
    USERS ||--o{ VERIFICATION_OBLIGATIONS : "responde_o_administra"
    USERS ||--o{ VERIFICATION_OBLIGATION_HISTORY : "registra_cambio"
    USERS ||--o{ NOTIFICATION_BATCHES : "genera"
    USERS ||--o{ PAYMENT_TRANSACTIONS : "registra"

    VEHICLES ||--o{ VEHICLE_PARTY_ROLES : "relacionado_con"
    VEHICLES ||--o{ VEHICLE_VERIFICATION_PROFILE : "define_aplicabilidad"
    VEHICLES ||--o{ VEHICLE_LIFECYCLE_EVENTS : "vida_admin"
    VEHICLES ||--o{ VEHICLE_CHANGE_REQUESTS : "recibe_solicitud"
    VEHICLES ||--o{ USER_VEHICLE_ACCESS : "visible_para"
    VEHICLES ||--o{ VERIFICATION_EVENTS : "registra"
    VEHICLES ||--o{ VERIFICATION_OBLIGATIONS : "genera_obligacion"
    VEHICLES ||--o{ DOCUMENTS : "tiene"
    VEHICLES ||--o{ DOCUMENT_ACCESS_LOG : "traza"
    VEHICLES ||--o{ SERVICE_ORDERS : "genera"
    VEHICLES ||--o{ VEHICLE_STATUS_HISTORY : "historial"
    VEHICLES ||--o{ DAILY_VEHICLE_STATUS_SNAPSHOT : "snapshot"
    VEHICLES ||--o{ VERIFICATION_SESSIONS : "sesiones"
    VEHICLES ||--o{ NOTIFICATION_BATCH_ITEMS : "notificado_en"

    VERIFICATION_CENTERS ||--o{ VERIFICATION_EVENTS : "respalda"
    VERIFICATION_CENTERS ||--o{ VERIFICATION_CENTER_CONTACTS : "contactos"
    VERIFICATION_CENTERS ||--o{ VERIFICATION_OBLIGATIONS : "programa"
    VERIFICATION_CENTERS ||--o{ VERIFICATION_SESSIONS : "atiende"
    VERIFICATION_CENTERS ||--o{ VERIFICATION_CENTER_CAPACITY_DAILY : "capacidad"
    VERIFICATION_CENTERS ||--o{ SERVICE_ORDERS : "origina_remision"
    VERIFICATION_EVENTS o|--o| VERIFICATION_OBLIGATIONS : "cierra_opcionalmente"
    VERIFICATION_OBLIGATIONS ||--o{ VERIFICATION_OBLIGATION_HISTORY : "historial"

    DOCUMENTS ||--o{ DOCUMENT_FILES : "versiones"
    DOCUMENTS ||--o{ DOCUMENT_ACCESS_LOG : "registra_traza"
    DOCUMENTS ||--o{ VERIFICATION_EVENTS : "respalda_evento"
    DOCUMENTS ||--o{ VEHICLE_VERIFICATION_PROFILE : "respalda_aplicabilidad"
    DOCUMENTS ||--o{ VEHICLE_LIFECYCLE_EVENTS : "respalda_cambio"
    DOCUMENTS ||--o{ VEHICLE_CHANGE_REQUESTS : "respalda_solicitud"
    DOCUMENT_FILES ||--o{ DOCUMENT_ACCESS_LOG : "deja_historial"

    VEHICLE_VERIFICATION_PROFILE ||--o{ VEHICLE_VERIFICATION_PROFILE_HISTORY : "historial"
    VEHICLE_CHANGE_REQUESTS ||--o{ VEHICLE_CHANGE_REQUEST_HISTORY : "historial"

    VERIFICATION_EVENTS ||--o{ SERVICE_ORDER_ITEMS : "sustenta_linea"
    VERIFICATION_OBLIGATIONS ||--o{ SERVICE_ORDER_ITEMS : "origina_linea"
    SERVICE_ORDERS ||--o{ SERVICE_ORDER_ITEMS : "detalla"
    SERVICE_ORDERS ||--o{ RECEIVABLE_DOCUMENTS : "origina"

    CLIENT_ACCOUNTS ||--o{ RECEIVABLE_DOCUMENTS : "genera"
    CLIENT_ACCOUNTS ||--o{ PAYMENT_TRANSACTIONS : "recibe"
    CLIENT_ACCOUNTS ||--o{ ACCOUNT_MOVEMENTS : "movimientos"

    RECEIVABLE_DOCUMENTS ||--o{ RECEIVABLE_INSTALLMENTS : "divide"
    RECEIVABLE_DOCUMENTS ||--o{ PAYMENT_APPLICATIONS : "recibe_aplicacion"
    RECEIVABLE_INSTALLMENTS ||--o{ PAYMENT_APPLICATIONS : "se_liquida_con"

    PAYMENT_TRANSACTIONS ||--o{ PAYMENT_APPLICATIONS : "se_aplica_en"

    REPORT_RECIPIENTS ||--o{ NOTIFICATION_BATCHES : "origina"
    PARTY_CONTACTS ||--o{ NOTIFICATION_BATCHES : "destinatario"
    NOTIFICATION_RULES ||--o{ NOTIFICATION_BATCHES : "dispara"
    MESSAGE_TEMPLATES ||--o{ NOTIFICATION_BATCHES : "usa"
    NOTIFICATION_BATCHES ||--o{ NOTIFICATION_BATCH_ITEMS : "incluye"
    NOTIFICATION_BATCHES ||--o{ NOTIFICATION_LOG : "bitacora"
    NOTIFICATION_BATCH_ITEMS ||--o{ NOTIFICATION_LOG : "intenta"

    PARTIES {
        bigint id PK
        string party_type
        string owner_admin_status_current
        string rfc
        string legal_name
        string display_name
        string phone
        string email
    }

    PARTY_OWNER_STATUS_HISTORY {
        bigint id PK
        bigint party_id FK
        bigint changed_by_user_id FK
        bigint support_document_id FK
        string previous_status
        string new_status
        date effective_date
        string reason_code
        string notes
        timestamptz created_at
    }

    USERS {
        bigint id PK
        bigint party_id FK
        string email
        string password_hash
        string full_name
        boolean is_admin
    }

    INTERNAL_ROLES {
        bigint id PK
        string role_code
        string role_name
        boolean is_system
        boolean is_active
    }

    INTERNAL_PERMISSIONS {
        bigint id PK
        string permission_code
        string module_code
        string action_code
        boolean is_active
    }

    INTERNAL_ROLE_PERMISSIONS {
        bigint id PK
        bigint role_id FK
        bigint permission_id FK
    }

    USER_INTERNAL_ROLES {
        bigint id PK
        bigint user_id FK
        bigint role_id FK
        bigint granted_by_user_id FK
        timestamptz start_at
        timestamptz end_at
        boolean is_current
    }

    PARTY_CONTACTS {
        bigint id PK
        bigint party_id FK
        string contact_name
        string email
        string whatsapp_phone
        boolean receives_reports
    }

    VEHICLES {
        bigint id PK
        string plate
        string serial_niv
        string engine_number
        string unit_type
        string regime
        string lifecycle_status_current
        string schedule_marker_auto
        string schedule_marker_override
        string schedule_marker_effective
        boolean is_active
    }

    VEHICLE_VERIFICATION_PROFILE {
        bigint id PK
        bigint vehicle_id FK
        bigint reviewed_by_user_id FK
        bigint support_document_id FK
        string verification_type
        string applicability_status
        string reason_code
        string source_kind
        date effective_date
        boolean is_current
    }

    VEHICLE_VERIFICATION_PROFILE_HISTORY {
        bigint id PK
        bigint profile_id FK
        bigint changed_by_user_id FK
        bigint support_document_id FK
        string previous_applicability_status
        string new_applicability_status
        string previous_reason_code
        string new_reason_code
        string change_notes
        timestamptz created_at
    }

    VEHICLE_LIFECYCLE_EVENTS {
        bigint id PK
        bigint vehicle_id FK
        bigint reported_by_user_id FK
        bigint regularized_by_user_id FK
        bigint support_document_id FK
        string previous_status
        string new_status
        date effective_date
        timestamptz reported_at
        timestamptz regularized_at
        string reason_code
    }

    VEHICLE_CHANGE_REQUESTS {
        bigint id PK
        bigint vehicle_id FK
        bigint submitted_by_user_id FK
        bigint reviewed_by_user_id FK
        bigint claimant_party_id FK
        bigint support_document_id FK
        string request_type
        string request_status
        string current_lifecycle_status_snapshot
        string proposed_lifecycle_status
        date requested_effective_date
        timestamptz submitted_at
        timestamptz reviewed_at
        timestamptz regularized_at
        string reason_code
    }

    VEHICLE_CHANGE_REQUEST_HISTORY {
        bigint id PK
        bigint request_id FK
        bigint changed_by_user_id FK
        string previous_status
        string new_status
        string change_notes
        timestamptz created_at
    }

    VEHICLE_PARTY_ROLES {
        bigint id PK
        bigint vehicle_id FK
        bigint party_id FK
        string role_type
        date start_date
        date end_date
        boolean is_current
    }

    USER_VEHICLE_ACCESS {
        bigint id PK
        bigint user_id FK
        bigint vehicle_id FK
        string access_type
        boolean is_active
    }

    VERIFICATION_CENTERS {
        bigint id PK
        string center_type
        string code
        string name
        string state_code
        string city
        string address_line
        string contact_name
        string phone
        string email
        boolean is_active
    }

    VERIFICATION_CENTER_CONTACTS {
        bigint id PK
        bigint center_id FK
        string contact_role
        string contact_name
        string phone
        string whatsapp_phone
        string email
        string preferred_channel
        boolean is_primary
        boolean is_active
        date start_date
        date end_date
    }

    VERIFICATION_EVENTS {
        bigint id PK
        bigint vehicle_id FK
        bigint center_id FK
        bigint source_document_id FK
        string verification_type
        date event_date
        date valid_until
        string result_status
    }

    VERIFICATION_SCHEDULE_RULES {
        bigint id PK
        string regime
        int schedule_position
        string schedule_marker
        string verification_type
    }

    VERIFICATION_OBLIGATIONS {
        bigint id PK
        bigint vehicle_id FK
        string verification_type
        date due_date
        date window_start_date
        date window_end_date
        string status
        string owner_response
        bigint owner_user_id FK
        bigint admin_user_id FK
        bigint scheduled_center_id FK
        bigint verification_event_id FK
    }

    VERIFICATION_OBLIGATION_HISTORY {
        bigint id PK
        bigint obligation_id FK
        bigint changed_by_user_id FK
        string action_type
        string previous_status
        string new_status
        string previous_owner_response
        string new_owner_response
    }

    DOCUMENTS {
        bigint id PK
        bigint vehicle_id FK
        bigint related_party_id FK
        bigint uploaded_by_user_id FK
        string document_type
        string verification_type
        string document_number
        date issue_date
        date valid_until
        string document_status
        boolean is_visible_to_owner
    }

    DOCUMENT_FILES {
        bigint id PK
        bigint document_id FK
        bigint uploaded_by_user_id FK
        int version_no
        string mime_type
        string original_file_name
        string storage_kind
        string storage_path
        bytea content_bytea
        bigint file_size_bytes
        string sha256_hex
        int page_count
        timestamptz scanned_at
        string ocr_status
        boolean is_current
    }

    DOCUMENT_ACCESS_LOG {
        bigint id PK
        bigint document_id FK
        bigint document_file_id FK
        bigint vehicle_id FK
        bigint actor_user_id FK
        string action_type
        boolean actor_is_admin
        string storage_kind
        jsonb details_json
        timestamptz created_at
    }

    VEHICLE_STATUS_HISTORY {
        bigint id PK
        bigint vehicle_id FK
        date status_date
        string physical_status
        string emissions_status
    }

    DAILY_VEHICLE_STATUS_SNAPSHOT {
        bigint id PK
        date snapshot_date
        bigint vehicle_id FK
        bigint client_party_id FK
        string regime
        string lifecycle_status_current
        string schedule_marker_effective
    }

    VERIFICATION_SESSIONS {
        bigint id PK
        bigint vehicle_id FK
        bigint center_id FK
        string verification_type
        datetime scheduled_at
        datetime finished_at
        int duration_minutes
        string session_result
    }

    VERIFICATION_CENTER_CAPACITY_DAILY {
        bigint id PK
        bigint center_id FK
        date capacity_date
        int lines_available
        numeric hours_open
        int capacity_operational
    }

    CALENDAR_BUSINESS_DAYS {
        date calendar_date PK
        boolean is_business_day
        boolean is_holiday
        string holiday_name
    }

    DATA_QUALITY_ISSUES {
        bigint id PK
        string entity_type
        bigint entity_id
        string issue_type
        string severity
        string status
    }

    SERVICE_ORDERS {
        bigint id PK
        string folio
        string external_remission_folio
        bigint vehicle_id FK
        bigint client_party_id FK
        bigint verification_center_id FK
        bigint payer_party_id FK
        date service_date
        string service_order_type
        string remittance_status_current
        string payer_scheme
        string settlement_status_current
        decimal total_amount
    }

    SERVICE_ORDER_ITEMS {
        bigint id PK
        bigint service_order_id FK
        int line_no
        string concept_code
        string operational_scope
        string verification_type
        bigint verification_obligation_id FK
        bigint verification_event_id FK
        decimal quantity
        decimal canonical_unit_price_amount
        decimal applied_unit_price_amount
        decimal line_subtotal_amount
        decimal discount_amount
        decimal tax_amount
        decimal line_total_amount
        string currency
        string price_origin
    }

    CLIENT_ACCOUNTS {
        bigint id PK
        bigint client_party_id FK
        string account_status
        decimal credit_limit
        int credit_days
        string currency
    }

    RECEIVABLE_DOCUMENTS {
        bigint id PK
        bigint client_account_id FK
        bigint service_order_id FK
        string document_type
        string folio
        date issue_date
        date due_date
        decimal subtotal_amount
        decimal tax_amount
        decimal total_amount
        decimal balance_amount
        string receivable_status
        string payer_scheme_snapshot
    }

    RECEIVABLE_INSTALLMENTS {
        bigint id PK
        bigint receivable_document_id FK
        int installment_no
        date due_date
        decimal amount_due
        decimal amount_paid
        string installment_status
    }

    PAYMENT_TRANSACTIONS {
        bigint id PK
        bigint client_account_id FK
        bigint payer_party_id FK
        date payment_date
        string payment_method
        string reference
        decimal amount
        string payment_status
        decimal unapplied_amount
    }

    PAYMENT_APPLICATIONS {
        bigint id PK
        bigint payment_transaction_id FK
        bigint receivable_document_id FK
        bigint receivable_installment_id FK
        decimal applied_amount
        timestamptz applied_at
    }

    ACCOUNT_MOVEMENTS {
        bigint id PK
        bigint client_account_id FK
        datetime movement_date
        string movement_type
        string reference_type
        bigint reference_id
        decimal debit_amount
        decimal credit_amount
        decimal balance_after_amount
    }

    REPORT_RECIPIENTS {
        bigint id PK
        bigint client_party_id FK
        bigint party_contact_id FK
        string channel
        string report_type
        string locale
        int priority
        boolean is_active
    }

    NOTIFICATION_RULES {
        bigint id PK
        string rule_code
        string report_type
        string verification_type
        string regime
        string trigger_status
        int trigger_offset_days
        string candidate_reason
        int priority
    }

    MESSAGE_TEMPLATES {
        bigint id PK
        string template_code
        string channel
        string report_type
        string locale
        int version_no
        string template_name
    }

    NOTIFICATION_BATCHES {
        bigint id PK
        bigint report_recipient_id FK
        bigint party_contact_id FK
        bigint client_party_id FK
        bigint rule_id FK
        bigint template_id FK
        string channel
        string report_type
        datetime scheduled_for
        string status
        string dedupe_key
        string source_snapshot_hash
    }

    NOTIFICATION_BATCH_ITEMS {
        bigint id PK
        bigint batch_id FK
        bigint vehicle_id FK
        bigint obligation_id FK
        string verification_type
        date due_anchor_date
        int days_to_due
        string candidate_reason
        string item_key
        string final_status
    }

    NOTIFICATION_LOG {
        bigint id PK
        bigint batch_id FK
        bigint batch_item_id FK
        int attempt_no
        string channel
        string destination
        string delivery_status
        string provider_name
        string provider_message_id
        datetime next_retry_at
        datetime reconciled_at
        datetime sent_at
    }
```

## Notas de diseño

### Acceso al propietario

El acceso del propietario no depende del rol jurídico directo en `vehicle_party_roles`.

Se controla mediante:

- `user_vehicle_access`

Esto permite:

- propietarios;
- gestores;
- administradores de flota;
- usuarios autorizados temporalmente.

### Identidad del vehiculo

La identidad maestra de la unidad vive en:

- `vehicles.serial_niv`

Reglas canonicas:

- la serie o NIV es obligatoria para toda unidad operativa;
- `vehicles.plate` representa la placa vigente y puede cambiar;
- si cambia `vehicles.plate`, deben recalcularse `schedule_marker_auto` y `schedule_marker_effective` para reglas futuras;
- el cambio de placa no crea un vehiculo nuevo ni reescribe eventos historicos.

### Vida del vehiculo

La vida administrativa de la unidad no debe modelarse solo con:

- `vehicles.is_active`

El contrato canonico es:

- `vehicles.lifecycle_status_current` para el estado vigente;
- `vehicle_lifecycle_events` para la historia append-only;
- `TRANSFERRED` permanece vigente hasta que el intermediario regulariza el cambio;
- en `TRANSFERRED`, el propietario anterior deja de ver la unidad en su visor.

### Aplicabilidad de verificaciones

La aplicabilidad no debe inferirse solo desde `vehicles`.

El contrato canonico es:

- `vehicle_verification_profile` como fila vigente por `vehicle_id + verification_type`;
- `vehicle_verification_profile_history` como trazabilidad append-only;
- `vw_vehicle_verification_applicability` como salida derivada recomendada para consumo operativo;
- `PHYSICAL_MECHANICAL` y `EMISSIONS` se resuelven primero por perfil;
- `verification_schedule_rules` solo responde la ventana cuando el perfil indica `REQUIRED`;
- `NO_APLICA` solo sale cuando el perfil vigente marca `NOT_REQUIRED`.

### Solicitudes del propietario

Las solicitudes administrativas no deben mezclarse con:

- `verification_obligations.owner_response`

El contrato canonico es:

- `vehicle_change_requests` para la solicitud principal;
- `vehicle_change_request_history` para la bitacora de atencion;
- `OWNERSHIP_TRANSFER_REPORT`, `NEW_OWNER_CLAIM`, `SUSPENSION_REQUEST`, `DEREGISTRATION_REQUEST` y `RESTORATION_REQUEST` como tipos base;
- el intermediario sigue siendo quien regulariza la vida de la unidad.

### Roles vigentes

`vehicle_party_roles` ya no debe leerse como una lista abierta sin reglas.

El contrato canonico es:

- el catalogo canonico actual se limita a `OWNER`, `CLIENT` y `LEGAL_POSSESSOR`;
- los tres admiten una sola fila vigente por vehiculo;
- `OWNER` puede corresponder a persona fisica o empresa;
- la misma `party` puede sostener varios roles distintos;
- la misma `party` puede ser `LEGAL_POSSESSOR` en varias unidades distintas sin conflicto global;
- en `TRANSFERRED`, `OWNER` puede quedar temporalmente sin fila vigente hasta regularizacion.

### Estado administrativo del propietario

El propietario tambien puede tener un estado administrativo propio en Vera.

El contrato canonico es:

- `parties.owner_admin_status_current` con `ACTIVE`, `SUSPENDED` o `DEREGISTERED`;
- `party_owner_status_history` como bitacora append-only;
- solo el intermediario puede mover ese estado;
- ese estado no reemplaza el rol juridico `OWNER` ni el estado de vida del vehiculo.

Consultas derivadas canonicas:

- `vw_current_owner_by_vehicle`
- `vw_current_client_by_vehicle`
- `vw_current_legal_possessor_by_vehicle`
- `vw_current_operational_contacts_by_vehicle`
- `vw_vehicle_current_relationships`

### Documentos visibles

No todos los documentos deben mostrarse al propietario.

La visibilidad no se controla solo con:

- `documents.is_visible_to_owner`

La regla canonica completa exige ademas:

- propietario `ACTIVE`;
- vehiculo visible por su estado de vida;
- tipo documental elegible;
- `document_status = ACTIVE`;
- y archivo vigente disponible.

### Expediente documental

El expediente documental ya distingue entre:

- `documents`: expediente logico, tipo documental, estado, vigencia y visibilidad;
- `document_files`: version fisica del PDF, backend de almacenamiento, hash y OCR;
- `document_access_log`: trazabilidad append-only de accesos y operaciones del expediente.

Ademas:

- `documents.related_party_id` vincula el soporte con la parte relevante cuando aplica;
- `documents.document_type` ya opera como enum controlado;
- `document_files.storage_kind` soporta `LOCAL_PATH`, `OBJECT_STORAGE` y `DATABASE`;
- `document_access_log.action_type` registra consulta, descarga, upload, probe y migracion;
- `verification_events.source_document_id` conecta el evento con su evidencia documental.

Politica canonica de tipos:

- `TARJETA_CIRCULACION`, `CONSTANCIA_FISICO_MECANICA` y `CONSTANCIA_EMISIONES` son los tipos oficiales nucleares;
- `PERMISO`, `CONTRATO_ARRENDAMIENTO` y `OTRO` son auxiliares;
- los auxiliares complementan, pero no sustituyen a un tipo oficial faltante;
- la obligatoriedad real del expediente depende de la vida del vehiculo y de la aplicabilidad vigente.

Politica canonica de unicidad:

- por tipo oficial nuclear solo debe existir un `documents.document_status = ACTIVE` por vehiculo;
- por `document_id` solo debe existir un `document_files.is_current = true`;
- un nuevo PDF del mismo soporte crea nueva version fisica;
- un soporte nuevo con nueva vigencia o nuevo numero crea nuevo `document`.

### Cobranza separada

La deuda, cartera, pagos y movimientos deben permanecer fuera del portal del propietario.

Las tablas de cobranza son internas:

- `client_accounts`
- `receivable_documents`
- `receivable_installments`
- `payment_transactions`
- `payment_applications`
- `account_movements`

### Remision de verificaciones por unidad

`service_orders` ya no debe leerse como encabezado generico de cualquier servicio.

Su lectura canonica correcta es:

- una remision de verificaciones;
- por una sola unidad;
- con folio interno propio;
- y con folio externo opcional del centro o documento origen.

Si un folio externo cubre varias unidades, Vera debe normalizarlo en varias filas por `vehicle_id`.

### Renglon economico por verificacion

`service_order_items` ya no debe leerse como concepto libre con monto unico.

Su lectura canonica correcta es:

- un concepto economico cerrado;
- con alcance `VERIFICATION_LINE` u `ORDER_LEVEL`;
- con `verification_type` obligatorio cuando cobra una verificacion puntual;
- y con referencia a `verification_event` u `verification_obligation` cuando aplique.

### Flujo de cobranza por capas

La cobranza ya no debe leerse como salto directo de remision a pago.

Su lectura canonica correcta es:

- `service_orders`: remision;
- `receivable_documents`: nacimiento de la deuda;
- `receivable_installments`: vencimiento o parcialidad;
- `payment_transactions`: entrada de dinero;
- `payment_applications`: cancelacion concreta de deuda;
- `account_movements`: bitacora contable append-only.

### Analítica separada

La analítica no debe recalcular todo desde tablas transaccionales en tiempo real.

Se recomienda operar con:

- `vehicle_status_history`
- `daily_vehicle_status_snapshot`
- `verification_center_capacity_daily`

para reportes históricos, proyección y saturación.

### Seguimiento del propietario

La intención del propietario de realizar una verificación no debe confundirse con cumplimiento real.

Por eso se separa:

- `verification_obligations`: lo pendiente, confirmado, programado o vencido;
- `verification_events`: lo efectivamente realizado;
- `verification_obligation_history`: la bitácora de cambios y decisiones.

Regla canonica adicional:

- cada obligacion puede ligar `0..1` evento;
- cada evento puede cerrar `0..1` obligacion;
- `COMPLETED` significa caso atendido con evento ligado;
- el estado regulatorio vigente se deriva del ultimo evento compliant y su `valid_until`, no solo de `COMPLETED`.

### Centros de verificacion

El centro y la persona de contacto no deben confundirse.

El contrato canonico es:

- `verification_centers` representa una sede operativa concreta;
- `verification_center_contacts` conserva los contactos historicos u operativos;
- solo un contacto activo debe resolver la via primaria de operacion cotidiana;
- `verification_events.center_id` y `verification_obligations.scheduled_center_id` siempre apuntan a la sede, no a la persona.

### Reporte hacia centro

La salida hacia centro tampoco debe confundirse con una notificacion al propietario.

El contrato canonico es:

- nace de obligaciones abiertas ya asignadas a `scheduled_center_id`;
- se resuelve sobre el contacto primario del centro;
- usa payload minimizado por perfiles;
- no debe incluir cobranza ni informacion ajena al caso;
- puede usar una vista administrativa derivada como `vw_center_request_items`.
    INTERNAL_ROLES ||--o{ USER_INTERNAL_ROLES : "asigna"
    INTERNAL_ROLES ||--o{ INTERNAL_ROLE_PERMISSIONS : "concede"
    INTERNAL_PERMISSIONS ||--o{ INTERNAL_ROLE_PERMISSIONS : "compone"
