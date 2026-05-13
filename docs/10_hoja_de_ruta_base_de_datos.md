# Hoja de Ruta para Terminar la Base de Datos

## Objetivo

Definir, en una sola vista, el camino que debe seguir **Vera** para completar la base de datos desde el nucleo ya implementado hasta las capas de cumplimiento, documentos, notificaciones, analitica y cobranza.

## Estado actual

La **fase 1** ya quedo implementada y validada en PostgreSQL:

- `parties`
- `users`
- `vehicles`
- `vehicle_party_roles`
- `user_vehicle_access`

La **fase 2** ya quedo implementada a nivel estructural y con API base:

- `verification_centers`
- `verification_events`
- `verification_schedule_rules`
- `verification_obligations`
- `verification_obligation_history`

La **fase 3** ya quedo implementada a nivel estructural:

- `documents`
- `document_files`

La ruta restante debe construirse sobre esa base, sin mezclar fases ni abrir mas dependencias de las necesarias.

## Tabla de trabajo

| Fase | Estado | Objetivo | Tablas principales | Que falta construir | Dependencias | Validacion minima | Criterio de cierre |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Nucleo operativo | Completada | Tener identidad, padron y control de acceso por vehiculo. | `parties`, `users`, `vehicles`, `vehicle_party_roles`, `user_vehicle_access` | DTOs, servicios, repositorios y endpoints CRUD reales. | Ninguna previa. | `build`, `test`, migracion aplicada, conexion validada. | Poder crear usuarios, partes, vehiculos y accesos desde el backend. |
| 2. Cumplimiento regulatorio | En implementacion | Registrar verificaciones, vigencias y reglas de calendario. | `verification_centers`, `verification_events`, `verification_schedule_rules`, `verification_obligations`, `verification_obligation_history` | Calculo de vigencia, carga inicial de reglas, permisos y autenticacion. | Fase 1 estable. | Migraciones correctas, casos de calculo por regimen federal y estatal. | Consultar y operar el estado regulatorio vigente de un vehiculo. |
| 3. Expediente documental | En implementacion | Soportar PDFs y su vinculo con vehiculo y verificacion. | `documents`, `document_files` | Endpoints, carga segura, versionado vigente y consulta para propietario. | Fases 1 y 2. | Subida, lectura y consulta de PDFs vigentes. | Poder consultar tarjeta y constancias desde el expediente. |
| 4. Reportes y notificaciones | Pendiente | Preparar pendientes por cliente y avisos automaticos. | `party_contacts`, `report_recipients`, `message_templates`, `notification_rules`, `notification_batches`, `notification_batch_items`, `notification_log` | Reglas, plantillas, candidatos de envio, bitacora y control de duplicados. | Fases 1, 2 y 3. | Consultas por vencer, simulacion de envio y trazabilidad. | Generar y registrar reportes automaticos por canal. |
| 5. Analitica operativa | Pendiente | Medir historial, snapshots, capacidad y calidad del dato. | `vehicle_status_history`, `daily_vehicle_status_snapshot`, `verification_sessions`, `verification_center_capacity_daily`, `calendar_business_days`, `data_quality_issues` | Snapshots, calidad del dato, demanda diaria, saturacion y capacidad por centro. | Operacion estable en fases 1 a 4. | Jobs de snapshot, consultas de tendencia y metricas de saturacion. | Poder proyectar carga, vencimientos y backlog. |
| 6. Gestion y cobranza | Pendiente | Controlar servicios, deuda, pagos y estado de cuenta. | `service_orders`, `service_order_items`, `client_accounts`, `receivable_documents`, `receivable_installments`, `payment_transactions`, `payment_applications`, `account_movements` | Flujo de remisiones, documentos por cobrar, aplicaciones de pago y saldos. | Fases 1 a 4; idealmente 5 ya estable. | Saldos consistentes, pagos aplicados y reporte de antiguedad. | Tener cartera y cobranza integradas sin exponerla al propietario. |

## Orden recomendado de implementacion tecnica

| Paso | Bloque | Resultado esperado |
| --- | --- | --- |
| 1 | Entidades y migraciones faltantes de fase 2 | Base de verificaciones funcional. |
| 2 | Servicios y DTOs reales de fase 1 | CRUD operativo del nucleo. |
| 3 | Servicios y reglas de fase 2 | Calculo de vigencias y estado por vehiculo. |
| 4 | Migraciones y servicios de fase 3 | Expediente PDF integrado. |
| 5 | Consultas y vistas de fase 4 | Reportes listos para correo y WhatsApp. |
| 6 | Jobs y bitacoras de fase 4 y 5 | Automatizacion y trazabilidad. |
| 7 | Migraciones y logica de fase 6 | Cobranza controlada por administrador. |

## Reglas para no romper el avance

| Regla | Motivo |
| --- | --- |
| No abrir una fase nueva si la migracion de la anterior no quedo aplicada y probada. | Evita deuda tecnica estructural. |
| No mezclar contabilidad con vistas para propietarios. | Mantiene separacion funcional y de permisos. |
| No publicar un modulo como terminado si no tiene criterio de cierre validado. | Evita falsos avances. |
| Registrar cada bloque tecnico en la bitacora antes de subir a Git. | Conserva trazabilidad del proyecto. |
| Mantener scripts, migraciones, entidades y documentacion alineados. | Evita que el codigo y la documentacion diverjan. |

## Proximo paso recomendado

El siguiente paso correcto para terminar la base de datos no es abrir mas tablas de una vez.

Lo correcto es:

1. cerrar la **fase 1 funcional** con DTOs, servicios y endpoints;
2. terminar la **fase 2 funcional** con autenticacion, permisos y reglas de vigencia;
3. cerrar la **fase 3** con carga y consulta controlada de PDFs antes de abrir notificaciones.
