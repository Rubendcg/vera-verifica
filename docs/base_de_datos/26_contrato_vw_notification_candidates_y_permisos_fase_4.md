# Contrato de `vw_notification_candidates` y Matriz de Permisos - Fase 4

## Objetivo

Definir dos piezas documentales base para fase 4:

1. el contrato de la vista `vw_notification_candidates`;
2. la matriz de permisos de `reports` y `notifications`.

## Estado

Este documento define contrato objetivo y reglas de acceso deseadas.

No implica que la vista o los endpoints ya existan.

## Contrato funcional de `vw_notification_candidates`

### Finalidad

Concentrar, en una sola vista administrativa, los vehiculos que son candidatos a reporte o notificacion segun su estado regulatorio vigente.

La vista debe servir para:

- construir reportes por cliente;
- alimentar previews de lotes;
- evaluar reglas de disparo;
- auditar por que una unidad entro o no entro a un envio.

### Grano de la vista

Una fila por:

- `client_party_id`
- `vehicle_id`
- `verification_type`
- `due_anchor_date`

En otras palabras:

- una misma unidad puede aparecer dos veces si tiene dos tipos de verificacion relevantes;
- no debe duplicarse por destinatario o por canal;
- la resolucion de destinatarios ocurre despues, fuera de la vista, mediante `vw_current_operational_contacts_by_vehicle`.

### Dependencias de entrada

La vista debe derivarse de:

- `vehicle_verification_profile` o `vw_vehicle_verification_applicability`
- `vw_current_client_by_vehicle`
- `vw_current_owner_by_vehicle`
- `vw_vehicle_verification_status`
- `verification_obligations`
- `verification_events`
- `vehicles`
- `parties`

Opcionalmente puede enriquecer con:

- `vw_owner_vehicle_documents`
- `documents`

si se quiere saber si existe evidencia documental vigente.

### Columnas minimas esperadas

Identidad:

- `client_party_id`
- `client_display_name`
- `vehicle_id`
- `plate`
- `unit_type`
- `regime`
- `schedule_marker_effective`

Contexto administrativo:

- `vehicle_lifecycle_status_current`
- `owner_admin_status_current`

Contexto regulatorio:

- `verification_type`
- `compliance_status`
- `current_valid_until`
- `days_to_due`
- `due_anchor_date`
- `window_start_date`
- `window_end_date`

Contexto de obligacion:

- `obligation_id`
- `obligation_status`
- `owner_response`
- `last_admin_action_at`

Contexto operativo:

- `last_verification_event_id`
- `last_verification_event_date`
- `verification_center_id`
- `verification_center_name`

Contexto documental opcional:

- `has_current_support_document`
- `current_support_document_type`
- `current_support_document_visible_to_owner`

Campos de control:

- `candidate_reason`
- `candidate_priority`
- `notification_scope`
- `notification_suppression_reason`
- `is_notification_eligible`

### Semantica de columnas clave

#### `compliance_status`

Debe representar el estado operativo vigente del cumplimiento.

Valores esperados:

- `VIGENTE`
- `POR_VENCER`
- `VENCIDO`
- `SIN_REGISTRO`
- `NO_APLICA`
- `INACTIVO`

Regla canonica:

- `NO_APLICA` solo debe aparecer cuando la aplicabilidad vigente del tipo de verificacion sea `NOT_REQUIRED`.

#### `candidate_reason`

Explica por que la unidad es candidata.

Valores documentales sugeridos:

- `UPCOMING_DUE`
- `OVERDUE`
- `NO_VALID_RECORD`
- `OWNER_CONFIRMED_PENDING`
- `OWNER_DECLINED_PENDING`
- `ADMIN_SCHEDULED_PENDING`

#### `candidate_priority`

Sirve para ordenar operativamente el procesamiento.

Valores sugeridos:

- `HIGH`
- `MEDIUM`
- `LOW`

#### `notification_scope`

Clasifica si la fila puede seguir flujo externo, solo monitoreo interno o supresion total.

Valores canonicos:

- `NORMAL_EXTERNAL`
- `INTERNAL_ONLY`
- `SUPPRESSED`

Regla documental:

- `NORMAL_EXTERNAL` permite preview, creacion de lote y resolucion de destinatarios;
- `INTERNAL_ONLY` conserva trazabilidad administrativa, pero no crea lote externo;
- `SUPPRESSED` queda fuera del flujo normal y solo se conserva si se consulta con fines de auditoria.

#### `notification_suppression_reason`

Explica por que una fila no debe entrar a flujo externo normal.

Valores sugeridos:

- `VEHICLE_SUSPENDED`
- `VEHICLE_TRANSFERRED`
- `VEHICLE_DEREGISTERED`
- `OWNER_SUSPENDED`
- `OWNER_DEREGISTERED`
- `NO_ACTIVE_CLIENT`
- `NO_ACTIVE_RECIPIENT`
- `NOT_REQUIRED`
- `DATA_INSUFFICIENT`

#### `is_notification_eligible`

Regla binaria de elegibilidad administrativa.

Debe ser `true` solo si:

- `notification_scope = NORMAL_EXTERNAL`;
- existe requerimiento regulatorio real;
- y la base minima permite una notificacion confiable.

Debe ser `false` si:

- el vehiculo esta inactivo;
- el vehiculo esta `SUSPENDED`, `TRANSFERRED` o `DEREGISTERED`;
- el propietario esta `SUSPENDED` o `DEREGISTERED`;
- no existe cliente vigente;
- no existe destinatario activo para el flujo objetivo;
- el estado es `NO_APLICA`;
- el dato base es insuficiente para una notificacion confiable.

### Filtros documentales que debe soportar

- `clientPartyId`
- `vehicleId`
- `verificationType`
- `regime`
- `complianceStatus`
- `candidateReason`
- `candidatePriority`
- `daysToDueFrom`
- `daysToDueTo`
- `onlyEligible`

### Exclusiones obligatorias

La vista no debe incluir:

- relaciones cliente-vehiculo caducadas;
- estados sin requerimiento regulatorio real;
- filas duplicadas por canal o destinatario.

Regla adicional:

- las unidades `SUSPENDED`, `TRANSFERRED` o `DEREGISTERED` pueden conservarse en la vista cuando el objetivo sea auditoria administrativa y `onlyEligible = false`;
- aun en ese caso, deben ir con `notification_scope = INTERNAL_ONLY` y nunca deben alimentar lotes externos.

### Casos de uso directos

1. Reporte por cliente de unidades por vencer.
2. Preview de lote antes de generar `notification_batches`.
3. Auditoria de por que una unidad vencida no fue notificada.
4. Export administrativo de backlog regulatorio.

## Integracion canonica con ciclo de vida

La politica de ciclo de vida y supresion de flujo externo se cierra en:

- [47_integracion_ciclo_de_vida_a_notificaciones.md](./47_integracion_ciclo_de_vida_a_notificaciones.md)

## Matriz de permisos de `reports`

### Principio

El modelo actual de Vera distingue de forma realista:

- `admin`
- `usuario autenticado no admin` con acceso por `user_vehicle_access`

Mientras no exista un RBAC mas fino, la regla documental correcta para fase 4 es conservadora.

El cierre estructural de permisos internos ya quedo fijado en:

- [48_modelo_canonico_permisos_internos_del_intermediario.md](./48_modelo_canonico_permisos_internos_del_intermediario.md)

### Accesos objetivo

`GET /reports/summary`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

`GET /reports/pending-by-client`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

`GET /reports/vehicle-status`

- `admin`: permitido
- `usuario autenticado no admin`: denegado en su forma operativa global

`GET /reports/notification-candidates`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

### Nota importante

Las vistas seguras para propietario no deben salir del paquete operativo de fase 4.

El propietario ya debe consumir sus vistas seguras desde contratos separados, por ejemplo:

- `vw_owner_vehicle_status`
- `vw_owner_vehicle_documents`

No desde endpoints administrativos de reportes masivos por cliente.

## Matriz de permisos de `notifications`

### Principio

Todo el modulo `notifications` debe ser admin-only en la primera implementacion.

Razon:

- contiene destinatarios;
- contiene configuracion de reglas;
- contiene lotes y bitacora de envio;
- puede exponer datos cruzados de multiples clientes.

Nota de transicion:

- esta regla describe la implementacion inicial segura;
- el destino canonico del modulo, una vez implementado el RBAC interno, es `PLATFORM_ADMIN` y `NOTIFICATIONS_OPERATOR`, segun `48_modelo_canonico_permisos_internos_del_intermediario.md`.

### Accesos objetivo

`GET /notifications/summary`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

`GET /notifications/rules`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

`GET /notifications/templates`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

`GET /notifications/recipients`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

`POST /notifications/batches/preview`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

`POST /notifications/batches`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

`GET /notifications/batches/:id`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

`GET /notifications/log`

- `admin`: permitido
- `usuario autenticado no admin`: denegado

## Reglas complementarias de seguridad

### 1. No exponer reportes multi-cliente al propietario

Aunque un usuario tenga `user_vehicle_access`, no debe:

- listar candidatos de otras unidades;
- ver destinatarios;
- consultar bitacora de envio;
- exportar backlog agregado por cliente.

### 2. Separar consulta de operacion

Si en una fase posterior se habilita lectura no-admin de algun reporte puntual, debe ocurrir en endpoints distintos, no reusando el contrato admin.

### 3. Logs y reconciliacion son sensibles

`notification_log` y los futuros estados de reconciliacion deben ser visibles solo para administracion.

Esto ya es consistente con la linea de seguridad documentada para logs y auditoria.

## Criterio documental de aceptacion

Este documento se considera suficiente cuando:

- define el grano de `vw_notification_candidates`;
- define columnas minimas y semantica;
- distingue candidato administrativo de destinatario final;
- integra elegibilidad administrativa con estado de vida del vehiculo y estado administrativo del propietario;
- fija una politica de permisos compatible con el modelo actual de Vera.
