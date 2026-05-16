# Llaves, Restricciones e Indices de Fase 4

## Objetivo

Definir la robustez estructural minima de la fase 4 de **Vera** a nivel de base de datos, antes de abrir migraciones reales.

Este documento cubre:

- columnas minimas;
- tipos de dato;
- llaves primarias y foraneas;
- restricciones `UNIQUE` y `CHECK`;
- indices operativos;
- reglas de mutabilidad y auditoria.

## Convenciones tecnicas

### Tipos base

- `bigint` para llaves primarias y foraneas internas.
- `varchar(n)` para claves funcionales cortas.
- `text` para cuerpos de plantilla y mensajes de error.
- `date` para fechas de negocio.
- `timestamptz` para eventos operativos y reconciliacion.
- `jsonb` solo para filtros congelados, snapshots y payloads de proveedor.

### Catalogos cerrados

Para fase 4 conviene usar `ENUM` de PostgreSQL en:

- `notification_channel_enum`
- `report_type_enum`
- `notification_batch_status_enum`
- `notification_item_status_enum`
- `notification_log_status_enum`
- `notification_candidate_reason_enum`
- `verification_type_enum`
- `vehicle_regime_enum`

Los valores de `notification_batch_status_enum` y `notification_log_status_enum` deben salir de [25_estados_canonicos_notificaciones_fase_4.md](./25_estados_canonicos_notificaciones_fase_4.md).

Los valores de `notification_candidate_reason_enum` deben salir de [26_contrato_vw_notification_candidates_y_permisos_fase_4.md](./26_contrato_vw_notification_candidates_y_permisos_fase_4.md).

### Reglas globales

- no hacer `hard delete` sobre lotes, items o logs despues de salir de `DRAFT`;
- `notification_log` debe ser append-only;
- contactos, destinatarios, reglas y plantillas deben desactivarse o versionarse, no reciclarse;
- toda deduplicacion debe descansar en llaves persistidas, no solo en logica de aplicacion.

## Tablas nuevas

## 1. `party_contacts`

### Columnas minimas

| Columna | Tipo | Nulo | Regla |
| --- | --- | --- | --- |
| `id` | `bigint` | no | PK |
| `party_id` | `bigint` | no | FK a `parties.id` |
| `contact_name` | `varchar(200)` | no | nombre visible |
| `email` | `varchar(320)` | si | correo normalizado |
| `phone_e164` | `varchar(20)` | si | telefono general |
| `whatsapp_e164` | `varchar(20)` | si | canal WhatsApp |
| `receives_reports` | `boolean` | no | default `false` |
| `consent_email` | `boolean` | no | default `false` |
| `consent_whatsapp` | `boolean` | no | default `false` |
| `is_primary` | `boolean` | no | default `false` |
| `is_active` | `boolean` | no | default `true` |
| `valid_from` | `date` | si | inicio de vigencia |
| `valid_until` | `date` | si | fin de vigencia |
| `created_at` | `timestamptz` | no | default `now()` |
| `updated_at` | `timestamptz` | no | default `now()` |

### Restricciones

- `CHECK (email IS NOT NULL OR phone_e164 IS NOT NULL OR whatsapp_e164 IS NOT NULL)`
- `CHECK (consent_email = false OR email IS NOT NULL)`
- `CHECK (consent_whatsapp = false OR whatsapp_e164 IS NOT NULL)`
- `CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until >= valid_from)`
- `UNIQUE (id, party_id)` para habilitar FK compuesta desde `report_recipients`
- `UNIQUE (party_id, lower(email)) WHERE email IS NOT NULL`
- `UNIQUE (party_id, whatsapp_e164) WHERE whatsapp_e164 IS NOT NULL`
- `UNIQUE (party_id) WHERE is_primary = true AND is_active = true`

### Indices sugeridos

- `IDX_party_contacts_party_active` sobre `party_id, is_active`
- `IDX_party_contacts_reports` sobre `receives_reports, is_active`

## 2. `report_recipients`

### Columnas minimas

| Columna | Tipo | Nulo | Regla |
| --- | --- | --- | --- |
| `id` | `bigint` | no | PK |
| `client_party_id` | `bigint` | no | FK a `parties.id` |
| `party_contact_id` | `bigint` | no | contacto operativo |
| `channel` | `notification_channel_enum` | no | canal efectivo |
| `report_type` | `report_type_enum` | no | familia de reporte |
| `locale` | `varchar(10)` | no | default `es-MX` |
| `priority` | `smallint` | no | default `100` |
| `is_active` | `boolean` | no | default `true` |
| `valid_from` | `date` | si | inicio de vigencia |
| `valid_until` | `date` | si | fin de vigencia |
| `created_by_user_id` | `bigint` | si | FK a `users.id` |
| `created_at` | `timestamptz` | no | default `now()` |
| `updated_at` | `timestamptz` | no | default `now()` |

### Restricciones

- `FOREIGN KEY (party_contact_id, client_party_id) REFERENCES party_contacts (id, party_id)`
- `CHECK (priority BETWEEN 1 AND 999)`
- `CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until >= valid_from)`
- `UNIQUE (client_party_id, party_contact_id, channel, report_type) WHERE is_active = true`

### Indices sugeridos

- `IDX_report_recipients_client_active` sobre `client_party_id, is_active`
- `IDX_report_recipients_channel` sobre `channel, report_type, is_active`

## 3. `message_templates`

### Columnas minimas

| Columna | Tipo | Nulo | Regla |
| --- | --- | --- | --- |
| `id` | `bigint` | no | PK |
| `template_code` | `varchar(100)` | no | codigo estable |
| `channel` | `notification_channel_enum` | no | canal |
| `report_type` | `report_type_enum` | no | tipo de reporte |
| `locale` | `varchar(10)` | no | default `es-MX` |
| `version_no` | `integer` | no | version monotona |
| `template_name` | `varchar(150)` | no | nombre funcional |
| `subject_template` | `text` | si | aplica a correo |
| `body_template` | `text` | no | cuerpo renderizable |
| `is_active` | `boolean` | no | default `true` |
| `created_by_user_id` | `bigint` | si | FK a `users.id` |
| `created_at` | `timestamptz` | no | default `now()` |

### Restricciones

- `CHECK (version_no >= 1)`
- `CHECK (channel <> 'EMAIL' OR subject_template IS NOT NULL)`
- `UNIQUE (template_code, channel, locale, version_no)`
- `UNIQUE (template_code, channel, locale) WHERE is_active = true`

### Indices sugeridos

- `IDX_message_templates_lookup` sobre `report_type, channel, locale, is_active`

## 4. `notification_rules`

### Columnas minimas

| Columna | Tipo | Nulo | Regla |
| --- | --- | --- | --- |
| `id` | `bigint` | no | PK |
| `rule_code` | `varchar(100)` | no | codigo estable |
| `report_type` | `report_type_enum` | no | familia de salida |
| `verification_type` | `verification_type_enum` | si | filtro opcional |
| `regime` | `vehicle_regime_enum` | si | filtro opcional |
| `trigger_status` | `varchar(40)` | no | estado regulatorio origen |
| `trigger_offset_days` | `integer` | no | dias respecto al vencimiento |
| `candidate_reason` | `notification_candidate_reason_enum` | no | causa documental |
| `priority` | `smallint` | no | default `100` |
| `is_active` | `boolean` | no | default `true` |
| `valid_from` | `date` | si | inicio de vigencia |
| `valid_until` | `date` | si | fin de vigencia |
| `created_at` | `timestamptz` | no | default `now()` |
| `updated_at` | `timestamptz` | no | default `now()` |

### Restricciones

- `CHECK (trigger_offset_days BETWEEN -365 AND 365)`
- `CHECK (priority BETWEEN 1 AND 999)`
- `CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until >= valid_from)`
- `UNIQUE (rule_code)`
- `UNIQUE (report_type, verification_type, regime, trigger_status, trigger_offset_days, candidate_reason) WHERE is_active = true`

### Indices sugeridos

- `IDX_notification_rules_active` sobre `is_active, report_type`
- `IDX_notification_rules_match` sobre `verification_type, regime, trigger_status, trigger_offset_days`

## 5. `notification_batches`

### Columnas minimas

| Columna | Tipo | Nulo | Regla |
| --- | --- | --- | --- |
| `id` | `bigint` | no | PK |
| `report_recipient_id` | `bigint` | no | FK a `report_recipients.id` |
| `client_party_id` | `bigint` | no | snapshot administrativo |
| `party_contact_id` | `bigint` | no | snapshot administrativo |
| `rule_id` | `bigint` | no | FK a `notification_rules.id` |
| `template_id` | `bigint` | no | FK a `message_templates.id` |
| `created_by_user_id` | `bigint` | no | FK a `users.id` |
| `channel` | `notification_channel_enum` | no | snapshot del lote |
| `report_type` | `report_type_enum` | no | snapshot del lote |
| `status` | `notification_batch_status_enum` | no | default `DRAFT` |
| `scheduled_for` | `timestamptz` | si | fecha futura si aplica |
| `source_snapshot_hash` | `char(64)` | no | hash del preview |
| `filters_json` | `jsonb` | no | criterios congelados |
| `preview_generated_at` | `timestamptz` | no | fecha del preview base |
| `batch_dedupe_key` | `varchar(200)` | no | llave idempotente |
| `item_count_expected` | `integer` | no | default `0` |
| `item_count_final` | `integer` | no | default `0` |
| `started_at` | `timestamptz` | si | inicio de dispatch |
| `finished_at` | `timestamptz` | si | fin operativo |
| `cancelled_at` | `timestamptz` | si | cancelacion |
| `last_error_summary` | `text` | si | error agregado |
| `created_at` | `timestamptz` | no | default `now()` |
| `updated_at` | `timestamptz` | no | default `now()` |

### Restricciones

- `CHECK (item_count_expected >= 0 AND item_count_final >= 0)`
- `CHECK (scheduled_for IS NOT NULL OR status <> 'SCHEDULED')`
- `CHECK (started_at IS NOT NULL OR status <> 'PROCESSING')`
- `CHECK (finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at)`
- `CHECK (cancelled_at IS NOT NULL OR status <> 'CANCELLED')`
- `UNIQUE (batch_dedupe_key)`

### Indices sugeridos

- `IDX_notification_batches_status_schedule` sobre `status, scheduled_for`
- `IDX_notification_batches_contact` sobre `client_party_id, party_contact_id, created_at DESC`
- `IDX_notification_batches_open` parcial sobre `status` cuando `status IN ('READY', 'SCHEDULED', 'PROCESSING', 'SENT', 'RECONCILING', 'PARTIAL')`

### Regla de mutabilidad

- despues de `READY`, `filters_json`, `source_snapshot_hash`, `channel`, `report_type`, `rule_id` y `template_id` deben tratarse como inmutables.

## 6. `notification_batch_items`

### Columnas minimas

| Columna | Tipo | Nulo | Regla |
| --- | --- | --- | --- |
| `id` | `bigint` | no | PK |
| `batch_id` | `bigint` | no | FK a `notification_batches.id` |
| `client_party_id` | `bigint` | no | snapshot administrativo |
| `party_contact_id` | `bigint` | no | snapshot administrativo |
| `vehicle_id` | `bigint` | no | FK a `vehicles.id` |
| `obligation_id` | `bigint` | si | FK a `verification_obligations.id` |
| `verification_type` | `verification_type_enum` | no | tipo de verificacion |
| `due_anchor_date` | `date` | no | fecha ancla |
| `days_to_due` | `integer` | no | calculado al preview |
| `candidate_reason` | `notification_candidate_reason_enum` | no | causa documental |
| `item_key` | `varchar(200)` | no | dedupe interno por unidad |
| `final_status` | `notification_item_status_enum` | no | default `PENDING` |
| `last_attempt_no` | `integer` | no | default `0` |
| `last_attempt_at` | `timestamptz` | si | ultimo intento |
| `created_at` | `timestamptz` | no | default `now()` |
| `updated_at` | `timestamptz` | no | default `now()` |

### Restricciones

- `CHECK (last_attempt_no >= 0)`
- `UNIQUE (batch_id, item_key)`
- `UNIQUE (batch_id, vehicle_id, verification_type, due_anchor_date)`

### Indices sugeridos

- `IDX_notification_batch_items_batch_status` sobre `batch_id, final_status`
- `IDX_notification_batch_items_vehicle` sobre `vehicle_id, due_anchor_date`
- `IDX_notification_batch_items_obligation` sobre `obligation_id`

## 7. `notification_log`

### Columnas minimas

| Columna | Tipo | Nulo | Regla |
| --- | --- | --- | --- |
| `id` | `bigint` | no | PK |
| `batch_id` | `bigint` | no | FK a `notification_batches.id` |
| `batch_item_id` | `bigint` | no | FK a `notification_batch_items.id` |
| `attempt_no` | `integer` | no | intento monotono |
| `channel` | `notification_channel_enum` | no | canal usado |
| `destination` | `varchar(320)` | no | correo o telefono normalizado |
| `status` | `notification_log_status_enum` | no | estado del intento |
| `provider_name` | `varchar(50)` | si | proveedor externo |
| `provider_message_id` | `varchar(150)` | si | id externo |
| `provider_status_raw` | `varchar(100)` | si | estado crudo |
| `request_payload_json` | `jsonb` | si | payload enviado |
| `response_payload_json` | `jsonb` | si | acuse o error |
| `error_code` | `varchar(100)` | si | codigo tecnico |
| `error_message` | `text` | si | descripcion |
| `dispatched_at` | `timestamptz` | si | salida de Vera |
| `provider_confirmed_at` | `timestamptz` | si | acuse de proveedor |
| `next_retry_at` | `timestamptz` | si | proximo intento |
| `reconciled_at` | `timestamptz` | si | cierre documental |
| `created_at` | `timestamptz` | no | default `now()` |

### Restricciones

- `CHECK (attempt_no >= 1)`
- `CHECK (dispatched_at IS NOT NULL OR status = 'CREATED')`
- `CHECK (provider_confirmed_at IS NULL OR dispatched_at IS NOT NULL)`
- `CHECK (reconciled_at IS NULL OR dispatched_at IS NOT NULL)`
- `UNIQUE (batch_item_id, attempt_no)`
- `UNIQUE (provider_name, provider_message_id) WHERE provider_message_id IS NOT NULL`

### Indices sugeridos

- `IDX_notification_log_batch_item` sobre `batch_item_id, attempt_no DESC`
- `IDX_notification_log_status_retry` sobre `status, next_retry_at`
- `IDX_notification_log_provider_message` sobre `provider_name, provider_message_id`
- `IDX_notification_log_reconcile` sobre `status, reconciled_at`

### Regla de auditoria

- no actualizar una fila para "reusar" un intento;
- cada reintento debe crear una nueva fila con `attempt_no` incremental;
- `response_payload_json` puede enriquecerse en reconciliacion, pero no debe borrar evidencia anterior del intento.

## Reglas transversales de consistencia

### 1. Dedupe fuerte

La base debe poder defender tres niveles:

- `batch_dedupe_key` en `notification_batches`;
- `item_key` en `notification_batch_items`;
- `provider_message_id` y `attempt_no` en `notification_log`.

### 2. Inmutabilidad por referencia

Si un lote ya referencia una regla o plantilla:

- la regla no debe sobrescribirse destructivamente;
- la plantilla debe versionarse, no reciclarse;
- el lote debe conservar su snapshot propio aunque el catalogo cambie.

### 3. Orden temporal defendible

Conviene asumir y validar:

- `preview_generated_at <= started_at <= finished_at`
- `dispatched_at <= provider_confirmed_at`
- `dispatched_at <= reconciled_at`

### 4. Vistas futuras

`vw_notification_candidates` no necesita PK fisica, pero su grano debe seguir lo documentado en [26_contrato_vw_notification_candidates_y_permisos_fase_4.md](./26_contrato_vw_notification_candidates_y_permisos_fase_4.md).

## Criterio documental de aceptacion

Este documento se considera suficiente cuando:

- permite abrir migraciones reales sin redefinir columnas base;
- deja claro donde viven dedupe, intento y reconciliacion;
- evita ambiguedad entre configuracion, lote, item e intento;
- separa catalogos activos de historial operativo.
