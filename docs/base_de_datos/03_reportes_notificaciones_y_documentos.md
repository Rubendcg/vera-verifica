# Reportes, Notificaciones y Documentos

Este documento debe interpretarse bajo el enunciado canonico de Vera como tercero intermediario:

- [32_enunciado_canonico_del_negocio_vera.md](./32_enunciado_canonico_del_negocio_vera.md)

## Reportes de vencimiento

El esquema soporta reportes por cliente con base en:

- tipo de verificacion;
- regimen;
- estado de vigencia;
- tercer digito para federal;
- cuarto digito para estatal.

## Vistas principales

Las vistas de reportes y de visor no deben resolver manualmente historiales de relacion.

Su base canonica se define en:

- [38_vistas_canonicas_relacion_vigente.md](./38_vistas_canonicas_relacion_vigente.md)

### `vw_current_owner_by_vehicle`

Obtiene el `OWNER` vigente por vehiculo.

Reglas:

- admite maximo una fila por unidad;
- puede devolver fila nula si la unidad esta en `TRANSFERRED` y aun no existe nuevo propietario regularizado;
- debe exponer tambien `owner_admin_status_current`;
- no debe hacer fallback al propietario anterior.

### `vw_current_client_by_vehicle`

Obtiene el `CLIENT` vigente por vehiculo.

Reglas:

- admite maximo una fila por unidad;
- ya no usa prioridades entre categorias antiguas;
- si no existe `CLIENT` vigente, devuelve fila nula.

Uso principal:

- determinar bajo que cliente se agrupa operativamente el reporte.

### `vw_current_legal_possessor_by_vehicle`

Obtiene el `LEGAL_POSSESSOR` vigente cuando aplica.

Reglas:

- admite maximo una fila por unidad;
- la misma `party` puede repetirse en multiples vehiculos distintos sin conflicto global;
- si no aplica o sigue en regularizacion, puede devolver fila nula.

### `vw_current_operational_contacts_by_vehicle`

Resuelve los contactos operativos vigentes del `CLIENT` por vehiculo.

Reglas:

- es una resolucion plural;
- puede devolver varias filas por `report_type` y `channel`;
- no debe hacer fallback automatico al `OWNER`;
- si no existe `CLIENT` vigente o no hay destinatarios activos, devuelve cero filas.

### `vw_vehicle_verification_status`

Consolida el estado actual por vehiculo.

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

Regla canonica:

- `NO_APLICA` solo procede cuando `vehicle_verification_profile.applicability_status = NOT_REQUIRED`;
- no debe inferirse por ausencia de evento, ausencia de regla o ausencia de historial.

### `vw_pending_verifications_by_client`

Es la vista principal para reportes.

Sirve para:

- pendientes por cliente;
- pendientes por regimen;
- pendientes por marcador de placa;
- agrupacion para correo o WhatsApp.

Debe partir de:

- `vehicle_verification_profile`
- `vw_current_client_by_vehicle`
- `vw_vehicle_verification_status`

### `vw_center_request_items`

Vista administrativa para solicitudes operativas hacia centros de verificacion.

Debe partir de:

- `verification_obligations`
- `verification_centers`
- `vw_primary_verification_center_contact`
- `vehicles`
- `vw_current_owner_by_vehicle`
- `vw_current_client_by_vehicle`

Reglas canonicas:

- solo expone obligaciones abiertas ya asignadas a un centro;
- no mezcla recordatorios al propietario;
- no debe incluir cobranza;
- debe sostener perfiles minimizados de salida hacia el agente del centro.

### `vw_owner_vehicle_status`

Vista segura para propietarios.

Expone:

- estatus de verificaciones;
- fechas de vigencia;
- identificacion de vehiculo;
- segmentacion por calendario.

Regla de vida administrativa:

- una unidad en `TRANSFERRED` deja de mostrarse al propietario anterior desde que entra a ese estado;
- el visor del propietario no debe usar solo `is_active`; debe respetar el estado de vida vigente de la unidad.
- una unidad `DEREGISTERED` debe quedar visible solo para el intermediario;
- una solicitud de incorporacion sobre `TRANSFERRED` o de restablecimiento sobre `DEREGISTERED` debe notificar al intermediario.

No expone:

- montos;
- remisiones;
- contabilidad.

Debe respetar:

- `user_vehicle_access` como control tecnico de acceso;
- las reglas de vida del vehiculo;
- el estado administrativo del propietario;
- y no debe reconstruir manualmente relaciones historicas cerradas.

### `vw_owner_vehicle_documents`

Vista segura de documentos para el propietario.

Expone solo:

- documentos del vehiculo al que tiene acceso;
- documentos marcados con `is_visible_to_owner = true`;
- PDF actual asociado al documento.

La matriz canonica de visibilidad se cierra en:

- [46_matriz_visibilidad_documental_del_propietario.md](./46_matriz_visibilidad_documental_del_propietario.md)

Reglas base:

- el propietario debe seguir `ACTIVE`;
- la unidad debe estar `ACTIVE` o `SUSPENDED`;
- `TRANSFERRED` y `DEREGISTERED` quedan fuera del visor normal;
- por defecto solo entran tipos oficiales nucleares;
- el documento debe estar `ACTIVE`;
- y debe existir archivo actual.

## Solicitudes administrativas del propietario

Las solicitudes administrativas del propietario no deben viajar en `verification_obligations`.

Deben vivir en un flujo separado para:

- cambio de dueno;
- reclamo de nuevo dueno sobre unidad `TRANSFERRED`;
- suspension;
- baja;
- restablecimiento de unidad `DEREGISTERED`.

Ese flujo canonico se define en:

- [36_flujo_canonico_solicitudes_del_propietario.md](./36_flujo_canonico_solicitudes_del_propietario.md)

## Expediente documental PDF

La politica canonica de tipos documentales se cierra en:

- [44_politica_tipos_documentales_oficiales.md](./44_politica_tipos_documentales_oficiales.md)

## `documents`

Representa el documento logico.

Ejemplos:

- tarjeta de circulacion;
- constancia fisico-mecanica;
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

Clasificacion canonica:

- oficiales nucleares: `TARJETA_CIRCULACION`, `CONSTANCIA_FISICO_MECANICA`, `CONSTANCIA_EMISIONES`
- auxiliares admitidos: `PERMISO`, `CONTRATO_ARRENDAMIENTO`, `OTRO`

Reglas base:

- los tres nucleares forman el expediente base del negocio;
- los auxiliares no sustituyen a un tipo oficial faltante;
- la exigencia efectiva de constancias depende de la aplicabilidad vigente por unidad.
- la unicidad logica del soporte vigente se cierra en `45_unicidad_logica_del_expediente.md`.

### `vw_vehicle_official_document_status`

Vista derivada recomendada para leer completitud del expediente oficial.

Debe resolver al menos:

- si la unidad tiene `TARJETA_CIRCULACION` vigente;
- si tiene `CONSTANCIA_FISICO_MECANICA` vigente cuando aplica;
- si tiene `CONSTANCIA_EMISIONES` vigente cuando aplica;
- y cuantos faltantes oficiales siguen abiertos.

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

Recomendacion tecnica:

- usar `storage_path` u `OBJECT_STORAGE` como estrategia principal;
- usar `content_bytea` solo si se decide guardar el PDF dentro de PostgreSQL;
- mantener una sola version actual por documento.

## `document_access_log`

Representa la trazabilidad operativa del expediente documental.

Eventos ya cubiertos en la implementacion:

- consulta detallada de documento;
- descarga del PDF vigente;
- alta del documento logico;
- alta de nueva version PDF;
- carga fisica de PDF;
- probe admin de `OBJECT_STORAGE`;
- migracion de archivo a `OBJECT_STORAGE`.

Campos funcionales:

- `document_id`
- `document_file_id`
- `vehicle_id`
- `actor_user_id`
- `action_type`
- `actor_is_admin`
- `storage_kind`
- `details_json`
- `created_at`

## Automatizacion de notificaciones

La capa de automatizacion agrega estas tablas:

- `message_templates`
- `notification_rules`
- `notification_batches`
- `notification_batch_items`
- `notification_log`

Su finalidad de negocio es:

- ayudar al intermediario a monitorear proximos vencimientos;
- avisar a propietarios o contactos autorizados;
- soportar seguimiento administrativo sin convertir al propietario en operador global del sistema.

La politica canonica que integra estado de vida del vehiculo y estado administrativo del propietario se cierra en:

- [47_integracion_ciclo_de_vida_a_notificaciones.md](./47_integracion_ciclo_de_vida_a_notificaciones.md)

Reglas base:

- solo las unidades `ACTIVE` con propietario `ACTIVE` pueden seguir en flujo externo normal;
- `SUSPENDED`, `TRANSFERRED` y `DEREGISTERED` quedan fuera del lote ordinario al propietario o cliente;
- propietario `SUSPENDED` o `DEREGISTERED` tambien bloquea el flujo externo normal;
- esos casos pueden mantenerse para seguimiento interno del intermediario, pero no deben reutilizar el mismo lote externo.

## Solicitud operativa hacia centro

El reporte hacia centro es una salida distinta del flujo de notificaciones al propietario.

Su contrato canonico se cierra en:

- [43_contrato_reporte_hacia_agente_de_centro.md](./43_contrato_reporte_hacia_agente_de_centro.md)

Reglas base:

- nace de obligaciones ya asignadas a una sede;
- se dirige al contacto primario activo del centro;
- usa payload minimizado por perfiles;
- no mezcla remisiones, pagos ni datos tecnicos internos;
- solo adjunta documentos si el intermediario los selecciona expresamente.

## Flujo resumido

### 1. Detectar candidatos

Se consulta:

- `vw_pending_verifications_by_client`
- `vw_notification_candidates`

Regla:

- `vw_notification_candidates` debe distinguir `NORMAL_EXTERNAL`, `INTERNAL_ONLY` y `SUPPRESSED`.

### 2. Aplicar reglas

Se filtra por:

- canal;
- consentimiento;
- tipo de verificacion;
- regimen;
- dias al vencimiento.

Antes de generar lote externo tambien debe filtrarse por:

- estado de vida del vehiculo;
- estado administrativo del propietario;
- existencia de cliente y destinatario activos;
- y `is_notification_eligible = true`.

Ejemplos de reglas:

- 30 dias antes;
- 15 dias antes;
- 7 dias antes;
- dia del vencimiento;
- 1 dia vencido;
- 7 dias vencido.

Casos fuera del flujo externo normal:

- unidad `SUSPENDED`;
- unidad `TRANSFERRED`;
- unidad `DEREGISTERED`;
- propietario `SUSPENDED`;
- propietario `DEREGISTERED`.

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

Esto evita enviar el mismo reporte dos veces el mismo dia.

### 5. Enviar

La plataforma debe:

- tomar lotes `PENDIENTE`;
- tomar lotes `READY` o `SCHEDULED` cuando corresponda;
- renderizar plantilla;
- enviar por proveedor externo;
- registrar exito o error;
- dejar traza en `notification_log`.

### 6. Reintentar y conciliar

La capa de notificaciones debe distinguir:

- `notification_batches`: lote administrativo;
- `notification_batch_items`: unidad notificada por vehiculo y vencimiento;
- `notification_log`: intento individual append-only.

Reglas minimas:

- cada reintento crea nueva fila con `attempt_no`;
- no se debe sobrescribir el historial del intento previo;
- `provider_message_id` debe ser unico cuando exista;
- `next_retry_at` y `reconciled_at` deben sostener la conciliacion posterior.

## Informacion minima para automatizar bien

Debes capturar correctamente:

- correo del contacto;
- WhatsApp del contacto;
- consentimiento del canal;
- regimen correcto del vehiculo;
- vigencia real de las verificaciones;
- si la unidad requiere fisico, emisiones o ambos;
- si el PDF cargado corresponde a la vigencia actual.

## Robustez minima de la capa

La base debe poder sostener:

- `batch_dedupe_key` por lote;
- `item_key` por vehiculo, tipo de verificacion y fecha ancla;
- snapshot congelado de filtros y candidatos al crear lote;
- logs append-only por intento;
- cierre por reconciliacion sin confundir `enviado` con `entregado`.

## Regla de negocio importante

El disparador principal de envio debe ser:

- la fecha de vencimiento real;

No solamente:

- el tercer o cuarto digito.

El marcador de placa sirve para segmentar y ordenar reportes, pero no sustituye la fecha real de vigencia.
