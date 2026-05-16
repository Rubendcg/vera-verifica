# Hoja de Ruta para Terminar la Base de Datos

## Objetivo

Definir, en una sola vista, el camino que debe seguir **Vera** para completar la base de datos desde el nucleo ya implementado hasta las capas de cumplimiento, documentos, notificaciones, analitica y cobranza.

Esta hoja debe leerse bajo el enunciado canonico del negocio:

- [32_enunciado_canonico_del_negocio_vera.md](./32_enunciado_canonico_del_negocio_vera.md)

y bajo la regla formal de gobierno del cierre estructural:

- [33_gobierno_del_cierre_estructural_bd.md](./33_gobierno_del_cierre_estructural_bd.md)

y bajo la politica de identidad maestra del vehiculo:

- [34_politica_identidad_maestra_del_vehiculo.md](./34_politica_identidad_maestra_del_vehiculo.md)

y bajo el submodelo de estado de vida del vehiculo:

- [35_submodelo_estado_de_vida_del_vehiculo.md](./35_submodelo_estado_de_vida_del_vehiculo.md)

y bajo el flujo canonico de solicitudes del propietario:

- [36_flujo_canonico_solicitudes_del_propietario.md](./36_flujo_canonico_solicitudes_del_propietario.md)

y bajo las reglas canonicas de `vehicle_party_roles`:

- [37_reglas_canonicas_vehicle_party_roles.md](./37_reglas_canonicas_vehicle_party_roles.md)

y bajo las vistas canonicas de relacion vigente:

- [38_vistas_canonicas_relacion_vigente.md](./38_vistas_canonicas_relacion_vigente.md)

y bajo el estado administrativo del propietario:

- [39_estado_administrativo_del_propietario.md](./39_estado_administrativo_del_propietario.md)

y bajo el perfil canonico de aplicabilidad de verificaciones:

- [40_perfil_canonico_aplicabilidad_verificaciones.md](./40_perfil_canonico_aplicabilidad_verificaciones.md)

y bajo el cierre canonico entre obligacion y evento:

- [41_cierre_canonico_entre_obligacion_y_evento.md](./41_cierre_canonico_entre_obligacion_y_evento.md)

y bajo el contrato operativo de `verification_centers`:

- [42_contrato_operativo_verification_centers.md](./42_contrato_operativo_verification_centers.md)

y bajo el contrato del reporte hacia agente de centro:

- [43_contrato_reporte_hacia_agente_de_centro.md](./43_contrato_reporte_hacia_agente_de_centro.md)

y bajo la politica de tipos documentales oficiales:

- [44_politica_tipos_documentales_oficiales.md](./44_politica_tipos_documentales_oficiales.md)

y bajo la unicidad logica del expediente:

- [45_unicidad_logica_del_expediente.md](./45_unicidad_logica_del_expediente.md)

y bajo la matriz de visibilidad documental del propietario:

- [46_matriz_visibilidad_documental_del_propietario.md](./46_matriz_visibilidad_documental_del_propietario.md)

y bajo la integracion del ciclo de vida del vehiculo a notificaciones:

- [47_integracion_ciclo_de_vida_a_notificaciones.md](./47_integracion_ciclo_de_vida_a_notificaciones.md)

y bajo el modelo canonico de permisos internos del intermediario:

- [48_modelo_canonico_permisos_internos_del_intermediario.md](./48_modelo_canonico_permisos_internos_del_intermediario.md)

y bajo el contrato canonico de remision para verificaciones:

- [49_contrato_canonico_remision_verificaciones.md](./49_contrato_canonico_remision_verificaciones.md)

y bajo el contrato canonico de conceptos economicos por verificacion:

- [50_contrato_canonico_conceptos_economicos_por_verificacion.md](./50_contrato_canonico_conceptos_economicos_por_verificacion.md)

y bajo el flujo canonico de cobranza desde remision hasta pago aplicado:

- [51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md](./51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md)

y bajo el contrato maestro del modelo:

- [52_contrato_maestro_del_modelo_bd.md](./52_contrato_maestro_del_modelo_bd.md)

y bajo el acta formal de cierre de normalizacion:

- [53_acta_cierre_normalizacion_bd.md](./53_acta_cierre_normalizacion_bd.md)

y bajo el visto bueno senior del modelo:

- [54_visto_bueno_senior_modelo_bd.md](./54_visto_bueno_senior_modelo_bd.md)

## Estado actual

La **fase 1** ya quedo implementada y validada en PostgreSQL:

- `parties`
- `users`
- `vehicles`
- `vehicle_party_roles`
- `user_vehicle_access`

La **fase 2** ya quedo implementada y cerrada formalmente:

- `verification_centers`
- `verification_events`
- `verification_schedule_rules`
- `verification_obligations`
- `verification_obligation_history`

La **fase 3** ya quedo implementada a nivel operativo base:

- `documents`
- `document_files`
- `document_access_log`

A nivel de normalizacion documental ya quedaron fijados:

- el enunciado canonico del negocio;
- la regla de gobierno del cierre estructural;
- la politica de identidad maestra del vehiculo.
- el submodelo de estado de vida del vehiculo.
- el flujo canonico de solicitudes del propietario.
- las reglas canonicas de `vehicle_party_roles`.
- las vistas canonicas de relacion vigente.
- el estado administrativo del propietario.
- el perfil canonico de aplicabilidad de verificaciones.
- el cierre canonico entre obligacion y evento.
- el contrato operativo de `verification_centers`.
- el contrato del reporte hacia agente de centro.
- la politica de tipos documentales oficiales.
- la unicidad logica del expediente.
- la matriz de visibilidad documental del propietario.
- la integracion del ciclo de vida del vehiculo a notificaciones.
- el modelo canonico de permisos internos del intermediario.
- el contrato canonico de remision para verificaciones.
- el contrato canonico de conceptos economicos por verificacion.
- el flujo canonico de cobranza desde remision hasta pago aplicado.
- el contrato maestro del modelo.
- el acta formal de cierre de normalizacion.
- el visto bueno senior del modelo.

La ruta restante debe construirse sobre esa base ya cerrada, sin reabrir el modelo salvo por control de cambio excepcional.

## Tabla de trabajo

| Fase | Estado | Objetivo | Tablas principales | Que falta construir | Dependencias | Validacion minima | Criterio de cierre |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Nucleo operativo | Completada | Tener identidad, padron y control de acceso por vehiculo. | `parties`, `users`, `vehicles`, `vehicle_party_roles`, `user_vehicle_access` | DTOs, servicios, repositorios y endpoints CRUD reales. | Ninguna previa. | `build`, `test`, migracion aplicada, conexion validada. | Poder crear usuarios, partes, vehiculos y accesos desde el backend. |
| 2. Cumplimiento regulatorio | Completada | Registrar verificaciones, vigencias y reglas de calendario. | `verification_centers`, `verification_events`, `verification_schedule_rules`, `verification_obligations`, `verification_obligation_history` | Sin bloqueadores para cierre. Los `overrides` temporales de calendario quedan fuera del alcance de fase 2 y se difieren como extension posterior del modelo regulatorio. | Fase 1 estable. | Migraciones correctas, casos de calculo por regimen federal y estatal, autenticacion, autorizacion y pruebas e2e del flujo principal. | Consultar y operar el estado regulatorio vigente de un vehiculo. |
| 3. Expediente documental | En implementacion | Soportar PDFs y su vinculo con vehiculo y verificacion. | `documents`, `document_files`, `document_access_log` | Validar la capa S3-compatible en bucket real y ejecutar el cutover de archivos previos a `OBJECT_STORAGE`. | Fases 1 y 2. | Subida, lectura, migracion, consulta y trazabilidad admin de PDFs vigentes. | Poder consultar tarjeta y constancias desde el expediente con trazabilidad operativa. |
| 4. Reportes y notificaciones | Diseno documental completo | Preparar pendientes por cliente y avisos automaticos. | `party_contacts`, `report_recipients`, `message_templates`, `notification_rules`, `notification_batches`, `notification_batch_items`, `notification_log` | Mantener bloqueada la implementacion operativa hasta cerrar bucket real y cutover de fase 3; despues abrir migraciones SQL, vistas y jobs reales. | Fases 1, 2 y 3. | Diseno funcional, contratos de salida, estados canonicos, permisos, llaves, preview/create y reconciliacion definidos. | Generar y registrar reportes automaticos por canal con trazabilidad, control de duplicados y cierre defendible por intento. |
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
| 7 | Migraciones y logica de fase 6 | Cobranza controlada por roles internos autorizados. |

## Reglas para no romper el avance

| Regla | Motivo |
| --- | --- |
| No abrir una fase nueva si la migracion de la anterior no quedo aplicada y probada. | Evita deuda tecnica estructural. |
| No mezclar contabilidad con vistas para propietarios. | Mantiene separacion funcional y de permisos. |
| No publicar un modulo como terminado si no tiene criterio de cierre validado. | Evita falsos avances. |
| Registrar cada bloque tecnico en la bitacora antes de subir a Git. | Conserva trazabilidad del proyecto. |
| Mantener scripts, migraciones, entidades y documentacion alineados. | Evita que el codigo y la documentacion diverjan. |
| No abrir mas codigo funcional estructural hasta cerrar el TODO de normalizacion del modelo. | Evita desarrollar sobre una base aun cambiante. |
| Todo cambio estructural debe aprobarse primero en documentos antes de tocar SQL o codigo. | Mantiene el control del modelo y evita congelar errores conceptuales. |

## Proximo paso recomendado

El siguiente paso correcto para terminar la base de datos no es abrir mas tablas de una vez.

Lo correcto es:

1. mantener el modelo estructural ya cerrado como base de trabajo;
2. validar la **fase 3** con `OBJECT_STORAGE` S3-compatible y migracion operativa de PDFs;
3. abrir migraciones SQL y desarrollo funcional sobre el modelo ya congelado;
4. abrir una extension puntual para `overrides` temporales de calendario solo cuando exista requerimiento real de negocio;
5. tratar cualquier cambio estructural posterior como control de cambio excepcional.
