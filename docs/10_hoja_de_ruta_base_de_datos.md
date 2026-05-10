# Hoja de Ruta para Terminar la Base de Datos

## Objetivo

Definir, en una sola vista, el camino que debe seguir **Vera** para completar la base de datos desde el núcleo ya implementado hasta las capas de cumplimiento, documentos, notificaciones, analítica y cobranza.

## Estado actual

La **fase 1** ya quedó implementada y validada en PostgreSQL:

- `parties`
- `users`
- `vehicles`
- `vehicle_party_roles`
- `user_vehicle_access`

La **fase 2** ya quedó abierta a nivel estructural:

- `verification_centers`
- `verification_events`
- `verification_schedule_rules`

La ruta restante debe construirse sobre esa base, sin mezclar fases ni abrir más dependencias de las necesarias.

## Tabla de trabajo

| Fase | Estado | Objetivo | Tablas principales | Qué falta construir | Dependencias | Validación mínima | Criterio de cierre |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Núcleo operativo | Completada | Tener identidad, padrón y control de acceso por vehículo. | `parties`, `users`, `vehicles`, `vehicle_party_roles`, `user_vehicle_access` | DTOs, servicios, repositorios y endpoints CRUD reales. | Ninguna previa. | `build`, `test`, migración aplicada, conexión validada. | Poder crear usuarios, partes, vehículos y accesos desde el backend. |
| 2. Cumplimiento regulatorio | En implementación | Registrar verificaciones, vigencias y reglas de calendario. | `verification_centers`, `verification_events`, `verification_schedule_rules` | Cálculo de vigencia, servicios reales y carga inicial de reglas/calendario. | Fase 1 estable. | Migraciones correctas, casos de cálculo por régimen federal y estatal. | Consultar el estado regulatorio vigente de un vehículo. |
| 3. Expediente documental | Pendiente | Soportar PDFs y su vínculo con vehículo y verificación. | `documents`, `document_files` | Modelo documental, versionado, visibilidad para propietario, carga segura. | Fases 1 y 2. | Subida, lectura y consulta de PDFs vigentes. | Poder consultar tarjeta y constancias desde el expediente. |
| 4. Reportes y notificaciones | Pendiente | Preparar pendientes por cliente y avisos automáticos. | `party_contacts`, `report_recipients`, `message_templates`, `notification_rules`, `notification_batches`, `notification_batch_items`, `notification_log` | Reglas, plantillas, candidatos de envío, bitácora y control de duplicados. | Fases 1, 2 y 3. | Consultas por vencer, simulación de envío y trazabilidad. | Generar y registrar reportes automáticos por canal. |
| 5. Analítica operativa | Pendiente | Medir historial, snapshots, capacidad y calidad del dato. | `vehicle_status_history`, `daily_vehicle_status_snapshot`, `verification_sessions`, `verification_center_capacity_daily`, `calendar_business_days`, `data_quality_issues` | Snapshots, calidad del dato, demanda diaria, saturación y capacidad por centro. | Operación estable en fases 1 a 4. | Jobs de snapshot, consultas de tendencia y métricas de saturación. | Poder proyectar carga, vencimientos y backlog. |
| 6. Gestión y cobranza | Pendiente | Controlar servicios, deuda, pagos y estado de cuenta. | `service_orders`, `service_order_items`, `client_accounts`, `receivable_documents`, `receivable_installments`, `payment_transactions`, `payment_applications`, `account_movements` | Flujo de remisiones, documentos por cobrar, aplicaciones de pago y saldos. | Fases 1 a 4; idealmente 5 ya estable. | Saldos consistentes, pagos aplicados y reporte de antigüedad. | Tener cartera y cobranza integradas sin exponerla al propietario. |

## Orden recomendado de implementación técnica

| Paso | Bloque | Resultado esperado |
| --- | --- | --- |
| 1 | Entidades y migraciones faltantes de fase 2 | Base de verificaciones funcional. |
| 2 | Servicios y DTOs reales de fase 1 | CRUD operativo del núcleo. |
| 3 | Servicios y reglas de fase 2 | Cálculo de vigencias y estado por vehículo. |
| 4 | Migraciones y servicios de fase 3 | Expediente PDF integrado. |
| 5 | Consultas y vistas de fase 4 | Reportes listos para correo y WhatsApp. |
| 6 | Jobs y bitácoras de fase 4 y 5 | Automatización y trazabilidad. |
| 7 | Migraciones y lógica de fase 6 | Cobranza controlada por administrador. |

## Reglas para no romper el avance

| Regla | Motivo |
| --- | --- |
| No abrir una fase nueva si la migración de la anterior no quedó aplicada y probada. | Evita deuda técnica estructural. |
| No mezclar contabilidad con vistas para propietarios. | Mantiene separación funcional y de permisos. |
| No publicar un módulo como “terminado” si no tiene criterio de cierre validado. | Evita falsos avances. |
| Registrar cada bloque técnico en la bitácora antes de subir a Git. | Conserva trazabilidad del proyecto. |
| Mantener scripts, migraciones, entidades y documentación alineados. | Evita que el código y la documentación diverjan. |

## Próximo paso recomendado

El siguiente paso correcto para terminar la base de datos no es abrir más tablas de una vez.  
Lo correcto es:

1. cerrar la **fase 1 funcional** con DTOs, servicios y endpoints;
2. construir la **fase 2 funcional** con reglas, DTOs y servicios de verificaciones;
3. validar el cálculo de vigencias antes de pasar a documentos y reportes.
