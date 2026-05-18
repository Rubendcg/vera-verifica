# Diseno de Fase 4: Reportes y Notificaciones

## Objetivo

Definir la capa documental formal de la fase 4 de **Vera** para reportes operativos y notificaciones, sin abrir aun implementacion operativa, migraciones ni jobs productivos.

## Estado de esta fase

La fase 4 queda en estado:

- `Diseno documental completo`

Esto significa:

- el alcance funcional ya se define con precision;
- la estructura SQL objetivo ya esta identificada;
- los contratos de salida y los flujos ya pueden documentarse;
- no se asume aun que existan endpoints reales, jobs, migraciones o integracion con proveedores.
- el modelo canonico de permisos internos del intermediario ya queda definido, aunque la implementacion inicial siga usando reglas conservadoras de admin-only.

## Documentos de detalle

El diseno de fase 4 se complementa con:

- [25_estados_canonicos_notificaciones_fase_4.md](./25_estados_canonicos_notificaciones_fase_4.md)
- [26_contrato_vw_notification_candidates_y_permisos_fase_4.md](./26_contrato_vw_notification_candidates_y_permisos_fase_4.md)
- [27_llaves_restricciones_indices_fase_4.md](./27_llaves_restricciones_indices_fase_4.md)
- [28_contrato_preview_y_creacion_lotes_fase_4.md](./28_contrato_preview_y_creacion_lotes_fase_4.md)
- [29_reintentos_y_reconciliacion_fase_4.md](./29_reintentos_y_reconciliacion_fase_4.md)
- [47_integracion_ciclo_de_vida_a_notificaciones.md](./47_integracion_ciclo_de_vida_a_notificaciones.md)
- [48_modelo_canonico_permisos_internos_del_intermediario.md](./48_modelo_canonico_permisos_internos_del_intermediario.md)

## Dependencia de entrada

La fase 4 solo debe abrirse a implementacion operativa despues de que fase 3 cierre su parte real de almacenamiento:

- bucket S3-compatible validado;
- cutover de archivos previos a `OBJECT_STORAGE`;
- politica operativa definida para borrado o retencion del origen `LOCAL_PATH`.

Este documento no levanta ese bloqueo. Solo prepara la fase siguiente.

## Alcance funcional

La fase 4 cubre dos capacidades relacionadas pero distintas:

1. `reports`
2. `notifications`

### `reports`

Responsabilidad:

- exponer pendientes por cliente;
- resumir vigencias por vehiculo;
- agrupar por regimen, marcador y tipo de verificacion;
- preparar salidas operativas hacia centros cuando exista una sede ya resuelta;
- preparar payload exportable para correo y WhatsApp.

Base de datos que alimenta reportes:

- `vw_current_owner_by_vehicle`
- `vw_current_client_by_vehicle`
- `vw_current_legal_possessor_by_vehicle`
- `vw_current_operational_contacts_by_vehicle`
- `vehicle_verification_profile` o una vista derivada de aplicabilidad
- `vw_vehicle_verification_status`
- `vw_pending_verifications_by_client`
- una vista futura `vw_center_request_items`
- `vw_owner_vehicle_documents`
- una vista futura `vw_notification_candidates`

### `notifications`

Responsabilidad:

- definir destinatarios efectivos;
- definir reglas de disparo;
- respetar estado de vida del vehiculo y estado administrativo del propietario;
- seleccionar plantilla y canal;
- generar lotes y items por vehiculo;
- registrar bitacora de envio y reconciliacion.

Tablas objetivo:

- `party_contacts`
- `report_recipients`
- `message_templates`
- `notification_rules`
- `notification_batches`
- `notification_batch_items`
- `notification_log`

## Submodelo funcional

### 1. Contactos

Tabla principal:

- `party_contacts`

Uso:

- almacenar el contacto operativo real de una parte;
- separar contacto general del cliente de los destinatarios efectivos de reportes;
- soportar multiples contactos por empresa.

Campos funcionales minimos esperados:

- nombre del contacto;
- correo;
- telefono o WhatsApp;
- banderas de consentimiento y vigencia del contacto;
- indicador de uso para reportes.

### 2. Destinatarios de reporte

Tabla principal:

- `report_recipients`

Uso:

- decidir a quien se le envian reportes;
- separar la parte cliente del contacto puntual;
- soportar varios canales por cliente y por tipo de reporte.

Debe permitir responder:

- que cliente recibe reportes;
- a traves de que contacto;
- por que canal;
- para que tipo de reporte;
- si ese destinatario sigue activo.

### 3. Reglas de disparo

Tabla principal:

- `notification_rules`

Uso:

- parametrizar cuando nace un candidato a notificacion;
- distinguir vencido, por vencer, sin registro o confirmacion pendiente;
- evitar codificar offsets y condiciones directamente en jobs.

Dimensiones minimas:

- `report_type`
- `verification_type`
- `trigger_status`
- `trigger_offset_days`
- regimen o segmento cuando aplique

### 4. Plantillas

Tabla principal:

- `message_templates`

Uso:

- definir contenido por canal;
- mantener separada la logica de negocio del texto a enviar;
- versionar plantillas sin reescribir el generador de lotes.

Cada plantilla debe distinguir al menos:

- codigo de plantilla;
- canal;
- nombre funcional;
- asunto o cuerpo renderizable segun canal.

### 5. Lotes de notificacion

Tablas principales:

- `notification_batches`
- `notification_batch_items`

Uso:

- congelar un envio planeado;
- dejar trazabilidad de que se intento mandar, a quien, y con que regla;
- soportar reintentos y conciliacion sin recalcular todo desde cero.

Separacion funcional:

- `notification_batches` representa el envio agrupado;
- `notification_batch_items` representa el detalle por vehiculo o unidad reportada.

### 6. Bitacora de entrega

Tabla principal:

- `notification_log`

Uso:

- registrar lo que el sistema intento enviar;
- registrar respuesta del proveedor;
- distinguir enviado, fallido, entregado, rechazado o pendiente de conciliacion.

Esta tabla no debe verse solo como log tecnico. Debe servir para auditoria operativa.

## Flujo objetivo de fase 4

### Flujo 1. Generacion de reporte operativo

1. Consultar `vw_pending_verifications_by_client`.
2. Resolver aplicabilidad vigente por vehiculo y tipo.
3. Resolver cliente vigente por vehiculo.
4. Resolver contactos operativos vigentes por vehiculo cuando el reporte requiera destinatario.
5. Aplicar filtros por tipo de verificacion, estado y ventana.
6. Agrupar por cliente y por destinatario.
7. Exponer resultado como reporte descargable o payload de lote.

### Flujo 1B. Generacion de solicitud hacia centro

1. Partir de obligaciones abiertas con `scheduled_center_id`.
2. Validar que la unidad siga `ACTIVE` y que la verificacion siga aplicando.
3. Resolver sede y contacto primario del centro.
4. Aplicar perfil de payload `MINIMAL`, `OPERATIVE` u `OPERATIVE_WITH_DOCUMENT_FLAGS`.
5. Excluir cobranza y datos internos no necesarios.
6. Exponer resultado como export administrativo o mensaje dirigido al centro.

### Flujo 2. Generacion de candidatos a notificacion

1. Partir del estado regulatorio vigente.
2. Excluir verificaciones con aplicabilidad `NOT_REQUIRED`.
3. Resolver `vehicle_lifecycle_status_current` y `owner_admin_status_current`.
4. Clasificar `notification_scope` en `NORMAL_EXTERNAL`, `INTERNAL_ONLY` o `SUPPRESSED`.
5. Aplicar reglas de `notification_rules` solo sobre filas `NORMAL_EXTERNAL`.
6. Resolver destinatarios activos desde `vw_current_operational_contacts_by_vehicle`.
7. Seleccionar plantilla por canal.
8. Generar lote e items solo para filas elegibles.

Regla canonica:

- `SUSPENDED`, `TRANSFERRED` y `DEREGISTERED` no deben seguir el flujo externo normal;
- propietario `SUSPENDED` o `DEREGISTERED` tampoco;
- esos casos pueden quedar para seguimiento interno del intermediario, pero no para lote ordinario al cliente o propietario.

### Flujo 3. Envio y reconciliacion

1. Tomar lotes `READY` o `SCHEDULED` ya vencidos para ejecucion.
2. Renderizar plantilla.
3. Entregar a proveedor externo.
4. Registrar evento inicial en `notification_log`.
5. Conciliar acuse posterior o fallo.
6. Evitar duplicados con `dedupe_key`.

## Contratos documentales objetivo

Estos contratos son objetivo documental, no endpoints ya implementados.

### `reports`

Consultas objetivo:

- `GET /reports/summary`
- `GET /reports/pending-by-client`
- `GET /reports/vehicle-status`
- `GET /reports/notification-candidates`

Filtros minimos deseables:

- `clientPartyId`
- `vehicleId`
- `verificationType`
- `regime`
- `status`
- `daysToDueFrom`
- `daysToDueTo`
- `documentVisibleOnly`

### `notifications`

Consultas y acciones objetivo:

- `GET /notifications/summary`
- `GET /notifications/rules`
- `GET /notifications/templates`
- `GET /notifications/recipients`
- `POST /notifications/batches/preview`
- `POST /notifications/batches`
- `GET /notifications/batches/:id`
- `GET /notifications/log`

## Reglas documentales clave

### 1. Un reporte no debe depender solo del marcador

El marcador de placa sirve para segmentacion, no sustituye:

- fecha real de vigencia;
- ultimo evento valido;
- estado vigente de la obligacion.

### 2. No mezclar canal con destinatario sin tabla intermedia

El cliente, el contacto y el canal no son la misma cosa.

Por eso:

- `party_contacts` resuelve personas o buzones;
- `report_recipients` resuelve configuracion de recepcion.

### 3. `notification_log` no sustituye el lote

`notification_log` registra lo enviado.

`notification_batches` y `notification_batch_items` registran lo planeado.

Sin esa separacion:

- no hay reintentos consistentes;
- no hay forma limpia de conciliar;
- se mezclan planeacion y entrega.

### 4. Debe existir estrategia anti-duplicado

Se requiere `dedupe_key` o equivalente para evitar:

- reenvios el mismo dia;
- reenvios por rejecucion accidental del job;
- estados falsos de sobre-notificacion.

### 5. Debe existir reconciliacion

La documentacion de investigacion ya marca este riesgo.

Por tanto, fase 4 debe contemplar desde diseno:

- estado interno del intento;
- estado reportado por proveedor;
- fecha de envio;
- fecha de confirmacion;
- mecanismo para relectura o conciliacion.

## Criterios de cierre documental de fase 4

La fase 4 documental quedara formalmente preparada cuando existan:

- alcance y tablas objetivo definidos;
- flujos objetivo documentados;
- criterios de cierre operativo definidos;
- dependencias de entrada y salida explicitadas;
- rutas objetivo de `reports` y `notifications` descritas;
- bitacora de arranque documental registrada;
- llaves, restricciones e indices definidos;
- contrato de `preview` y `create` de lotes definido;
- politica de reintentos y reconciliacion definida.

## Criterios de cierre operativo de fase 4

La fase 4 solo podra marcarse como operativamente completada cuando existan:

- migraciones aplicadas para tablas de notificacion;
- consultas reales de reportes;
- generacion real de lotes;
- bitacora de envio y conciliacion;
- pruebas de permisos, deduplicacion y trazabilidad;
- simulacion de envio sin proveedor y prueba controlada con proveedor real.

## Fuera de alcance en este momento

Este bloque documental no incluye:

- migraciones SQL de fase 4;
- implementacion de DTOs reales;
- endpoints de negocio;
- jobs de envio;
- integracion con proveedor de correo;
- integracion con proveedor de WhatsApp;
- reconciliacion automatica ejecutable.

## Siguiente paso no documental recomendado

Con la base documental ya cerrada, lo siguiente correcto es:

1. cerrar la validacion real de `OBJECT_STORAGE` y el cutover de fase 3;
2. abrir migraciones SQL de fase 4 empezando por catalogos y contactos;
3. abrir despues la vista `vw_notification_candidates` y el flujo admin de lotes.
