# Reportes, Notificaciones y Documentos

## Reportes de vencimiento

El esquema ya soporta reportes por cliente con base en:

- tipo de verificación;
- régimen;
- estado de vigencia;
- tercer dígito para federal;
- cuarto dígito para estatal.

## Vistas principales

### `vw_current_client_by_vehicle`

Obtiene el cliente vigente por vehículo priorizando:

- `cliente_consulta`
- `seguimiento`

Uso:

- determinar a quién pertenece operativamente el reporte.

### `vw_vehicle_verification_status`

Consolida el estado actual por vehículo.

Campos funcionales:

- `physical_status`
- `physical_valid_until`
- `physical_days_to_due`
- `emissions_status`
- `emissions_valid_until`
- `emissions_days_to_due`
- `schedule_rule_position`
- `schedule_marker_effective`

Estados principales:

- `VIGENTE`
- `POR_VENCER`
- `VENCIDO`
- `SIN_REGISTRO`
- `NO_APLICA`
- `INACTIVO`

### `vw_pending_verifications_by_client`

Es la vista principal para reportes.

Sirve para:

- pendientes por cliente;
- pendientes por régimen;
- pendientes por marcador de placa;
- agrupación para correo o WhatsApp.

### `vw_owner_vehicle_status`

Vista segura para propietarios.

Expone:

- estatus de verificaciones;
- fechas de vigencia;
- identificación de vehículo;
- segmentación por calendario.

No expone:

- montos;
- remisiones;
- contabilidad.

### `vw_owner_vehicle_documents`

Vista segura de documentos para el propietario.

Expone solo:

- documentos del vehículo al que tiene acceso;
- documentos marcados con `is_visible_to_owner = true`;
- PDF actual asociado al documento.

## Expediente documental PDF

## `documents`

Representa el documento lógico.

Ejemplos:

- tarjeta de circulación;
- constancia físico-mecánica;
- constancia de emisiones;
- permiso;
- contrato de arrendamiento.

Tipos formales en el modelo:

- `TARJETA_CIRCULACION`
- `CONSTANCIA_FISICO_MECANICA`
- `CONSTANCIA_EMISIONES`
- `PERMISO`
- `CONTRATO_ARRENDAMIENTO`
- `OTRO`

Campos funcionales:

- `document_type`
- `verification_type`
- `document_number`
- `issue_date`
- `valid_until`
- `document_status`
- `is_visible_to_owner`

## `document_files`

Representa el PDF real.

Campos funcionales:

- `version_no`
- `mime_type`
- `original_file_name`
- `storage_kind`
- `storage_path`
- `content_bytea`
- `file_size_bytes`
- `sha256_hex`
- `page_count`
- `scanned_at`
- `ocr_status`
- `ocr_text`
- `is_current`

Recomendación técnica:

- usar `storage_path` o `object_storage` como estrategia principal;
- usar `content_bytea` solo si decides guardar el PDF dentro de PostgreSQL;
- mantener una sola versión actual por documento.

## Automatización de notificaciones

La capa de automatización agrega estas tablas:

- `message_templates`
- `notification_rules`
- `notification_batches`
- `notification_batch_items`
- `notification_log`

## Flujo resumido

### 1. Detectar candidatos

Se consulta:

- `vw_pending_verifications_by_client`
- `vw_notification_candidates`

### 2. Aplicar reglas

Se filtra por:

- canal;
- consentimiento;
- tipo de verificación;
- régimen;
- días al vencimiento.

Ejemplos de reglas:

- 30 días antes;
- 15 días antes;
- 7 días antes;
- día del vencimiento;
- 1 día vencido;
- 7 días vencido.

### 3. Crear lotes

Se genera un lote por:

- cliente;
- destinatario;
- canal;
- regla;
- fecha.

Tablas:

- `notification_batches`
- `notification_batch_items`

### 4. Evitar duplicados

Se usa:

- `dedupe_key`

Esto evita enviar el mismo reporte dos veces el mismo día.

### 5. Enviar

La plataforma debe:

- tomar lotes `PENDIENTE`;
- renderizar plantilla;
- enviar por proveedor externo;
- registrar éxito o error;
- dejar traza en `notification_log`.

## Información mínima para automatizar bien

Debes capturar correctamente:

- correo del contacto;
- WhatsApp del contacto;
- consentimiento del canal;
- régimen correcto del vehículo;
- vigencia real de las verificaciones;
- si la unidad requiere físico, emisiones o ambos;
- si el PDF cargado corresponde a la vigencia actual.

## Regla de negocio importante

El disparador principal de envío debe ser:

- la fecha de vencimiento real;

No solamente:

- el tercer o cuarto dígito.

El marcador de placa sirve para segmentar y ordenar reportes, pero no sustituye la fecha real de vigencia.
