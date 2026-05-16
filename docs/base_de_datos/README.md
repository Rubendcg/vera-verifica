# Documentacion de Base de Datos

Esta carpeta concentra la documentacion funcional y tecnica del esquema SQL de **Vera**.

## Objetivo

Documentar el modelo de datos que soporta:

- a Vera como tercero intermediario del seguimiento vehicular;
- control de vehiculos;
- verificaciones fisico-mecanicas y emisiones;
- acceso limitado por propietario o usuario autorizado;
- expedientes PDF de tarjetas y verificaciones;
- reportes de pendientes por cliente;
- automatizacion de correo y WhatsApp;
- contabilidad visible solo para roles internos autorizados del intermediario.

## Documentos

- [01_esquema_sql_general.md](./01_esquema_sql_general.md)
- [02_tablas_y_relaciones.md](./02_tablas_y_relaciones.md)
- [03_reportes_notificaciones_y_documentos.md](./03_reportes_notificaciones_y_documentos.md)
- [05_lineamientos_estadisticos_y_cobranza.md](./05_lineamientos_estadisticos_y_cobranza.md)
- [06_diagrama_final_bd.md](./06_diagrama_final_bd.md)
- [07_orden_creacion_sql_por_fases.md](./07_orden_creacion_sql_por_fases.md)
- [08_modulos_nest_alineados_bd.md](./08_modulos_nest_alineados_bd.md)
- [09_bitacora_implementacion_fase_1.md](./09_bitacora_implementacion_fase_1.md)
- [10_hoja_de_ruta_base_de_datos.md](./10_hoja_de_ruta_base_de_datos.md)
- [11_bitacora_implementacion_fase_2.md](./11_bitacora_implementacion_fase_2.md)
- [12_modelo_sql_verification_obligations.md](./12_modelo_sql_verification_obligations.md)
- [13_endpoints_verifications_fase_2.md](./13_endpoints_verifications_fase_2.md)
- [14_bitacora_implementacion_fase_3.md](./14_bitacora_implementacion_fase_3.md)
- [15_datos_prueba_vehiculos_revision.md](./15_datos_prueba_vehiculos_revision.md)
- [16_seeds_datos_prueba.md](./16_seeds_datos_prueba.md)
- [17_referencia_vin_niv_y_anos_modelo.md](./17_referencia_vin_niv_y_anos_modelo.md)
- [18_generacion_automatica_obligaciones_fase_2.md](./18_generacion_automatica_obligaciones_fase_2.md)
- [19_reglas_reales_verification_schedule_rules.md](./19_reglas_reales_verification_schedule_rules.md)
- [20_glosario_base_de_datos.md](./20_glosario_base_de_datos.md)
- [21_cierre_formal_fase_2.md](./21_cierre_formal_fase_2.md)
- [22_endpoints_documents_fase_3.md](./22_endpoints_documents_fase_3.md)
- [23_diseno_fase_4_reportes_y_notificaciones.md](./23_diseno_fase_4_reportes_y_notificaciones.md)
- [24_bitacora_implementacion_fase_4.md](./24_bitacora_implementacion_fase_4.md)
- [25_estados_canonicos_notificaciones_fase_4.md](./25_estados_canonicos_notificaciones_fase_4.md)
- [26_contrato_vw_notification_candidates_y_permisos_fase_4.md](./26_contrato_vw_notification_candidates_y_permisos_fase_4.md)
- [27_llaves_restricciones_indices_fase_4.md](./27_llaves_restricciones_indices_fase_4.md)
- [28_contrato_preview_y_creacion_lotes_fase_4.md](./28_contrato_preview_y_creacion_lotes_fase_4.md)
- [29_reintentos_y_reconciliacion_fase_4.md](./29_reintentos_y_reconciliacion_fase_4.md)
- [30_revision_senior_alineacion_modelo_bd.md](./30_revision_senior_alineacion_modelo_bd.md)
- [31_todo_cierre_normalizacion_bd.md](./31_todo_cierre_normalizacion_bd.md)
- [32_enunciado_canonico_del_negocio_vera.md](./32_enunciado_canonico_del_negocio_vera.md)
- [33_gobierno_del_cierre_estructural_bd.md](./33_gobierno_del_cierre_estructural_bd.md)
- [34_politica_identidad_maestra_del_vehiculo.md](./34_politica_identidad_maestra_del_vehiculo.md)
- [35_submodelo_estado_de_vida_del_vehiculo.md](./35_submodelo_estado_de_vida_del_vehiculo.md)
- [36_flujo_canonico_solicitudes_del_propietario.md](./36_flujo_canonico_solicitudes_del_propietario.md)
- [37_reglas_canonicas_vehicle_party_roles.md](./37_reglas_canonicas_vehicle_party_roles.md)
- [38_vistas_canonicas_relacion_vigente.md](./38_vistas_canonicas_relacion_vigente.md)
- [39_estado_administrativo_del_propietario.md](./39_estado_administrativo_del_propietario.md)
- [40_perfil_canonico_aplicabilidad_verificaciones.md](./40_perfil_canonico_aplicabilidad_verificaciones.md)
- [41_cierre_canonico_entre_obligacion_y_evento.md](./41_cierre_canonico_entre_obligacion_y_evento.md)
- [42_contrato_operativo_verification_centers.md](./42_contrato_operativo_verification_centers.md)
- [43_contrato_reporte_hacia_agente_de_centro.md](./43_contrato_reporte_hacia_agente_de_centro.md)
- [44_politica_tipos_documentales_oficiales.md](./44_politica_tipos_documentales_oficiales.md)
- [45_unicidad_logica_del_expediente.md](./45_unicidad_logica_del_expediente.md)
- [46_matriz_visibilidad_documental_del_propietario.md](./46_matriz_visibilidad_documental_del_propietario.md)
- [47_integracion_ciclo_de_vida_a_notificaciones.md](./47_integracion_ciclo_de_vida_a_notificaciones.md)
- [48_modelo_canonico_permisos_internos_del_intermediario.md](./48_modelo_canonico_permisos_internos_del_intermediario.md)
- [49_contrato_canonico_remision_verificaciones.md](./49_contrato_canonico_remision_verificaciones.md)
- [50_contrato_canonico_conceptos_economicos_por_verificacion.md](./50_contrato_canonico_conceptos_economicos_por_verificacion.md)
- [51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md](./51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md)
- [52_contrato_maestro_del_modelo_bd.md](./52_contrato_maestro_del_modelo_bd.md)
- [53_acta_cierre_normalizacion_bd.md](./53_acta_cierre_normalizacion_bd.md)
- [54_visto_bueno_senior_modelo_bd.md](./54_visto_bueno_senior_modelo_bd.md)
- [55_diagrama_maestro_bd_aprobado.md](./55_diagrama_maestro_bd_aprobado.md)

## Scripts SQL base

Los scripts fuente que respaldan esta documentacion estan actualmente en el workspace:

- `sql_mvp_reportes_notificaciones_postgres.sql`
- `sql_mvp_automatizacion_envios_postgres.sql`

## Alcance actual

La documentacion cubre el esquema logico definido hasta ahora, la implementacion completa de fase 1, el cierre formal de fase 2 y la implementacion operativa actual de fase 3.

Estado actual:

- estructura base de modulos Nest creada;
- configuracion de TypeORM y PostgreSQL integrada;
- migracion inicial de fase 1 creada y aplicada;
- migracion de fase 2 creada y aplicada para verificaciones;
- migracion de fase 3 creada y aplicada para expediente documental;
- endpoints iniciales de fase 3 implementados para `documents`, `document_files` y `document_access_log`;
- carga y descarga de PDFs ya desacopladas por backend con soporte para `LOCAL_PATH` y `OBJECT_STORAGE`;
- probe admin agregado para validar bucket S3-compatible real desde el backend;
- migracion admin agregada para mover archivos existentes de `LOCAL_PATH` a `OBJECT_STORAGE`;
- trazabilidad admin agregada para consulta, descarga, upload, probe y migracion del expediente documental;
- decision tecnica asentada: `OBJECT_STORAGE` es la estrategia estable y `LOCAL_PATH` queda como implementacion temporal;
- endpoints base de fase 2 implementados para centros, reglas, eventos y obligaciones;
- generacion automatica de obligaciones de fase 2 implementada con modo simulacion;
- estructura de reglas de calendario ampliada para soportar ventanas reales semestrales;
- autenticacion `Bearer`, autorizacion por `user_vehicle_access` y validacion formal de DTOs activadas en `verifications`;
- pruebas e2e agregadas para `auth` y flujo protegido de `verifications`;
- cierre formal de fase 2 documentado con deuda controlada de `overrides` temporales;
- bitacora de implementacion disponible en esta carpeta.
- fase 4 ya cuenta con diseno documental completo y bitacora propia.
- estados canonicos de lotes y logs de notificacion ya definidos documentalmente.
- contrato de `vw_notification_candidates` y matriz de permisos de fase 4 ya definidos documentalmente.
- llaves, restricciones, indices y dedupe de fase 4 ya definidos documentalmente.
- contrato de `preview/create` y politica de reintentos y reconciliacion de fase 4 ya definidos documentalmente.
- revision senior del modelo y plan de cierre de normalizacion ya definidos documentalmente.
- enunciado canonico del negocio ya fijado documentalmente para alinear modelo, diagrama y roadmap.
- regla formal de gobierno del cierre estructural ya definida documentalmente.
- politica de identidad maestra del vehiculo ya fijada documentalmente para cerrar la diferencia entre serie y placa.
- submodelo de estado de vida del vehiculo ya fijado documentalmente para separar vida administrativa de estado regulatorio.
- flujo canonico de solicitudes del propietario ya fijado documentalmente para separar cambios administrativos de `owner_response`.
- reglas canonicas de `vehicle_party_roles` ya fijadas documentalmente para cerrar unicidad y vigencia por rol.
- vistas canonicas de relacion vigente ya fijadas documentalmente para propietario, cliente, poseedor legal y contacto operativo.
- estado administrativo del propietario ya fijado documentalmente para separar owner activo, suspendido o dado de baja del estado del vehiculo y del `user`.
- perfil canonico de aplicabilidad ya fijado documentalmente para separar si una verificacion aplica de cuando debe calendarizarse.
- cierre canonico entre obligacion y evento ya fijado documentalmente para separar caso operativo atendido de cumplimiento regulatorio vigente.
- contrato operativo de `verification_centers` ya fijado documentalmente para separar la sede del centro de su contacto operativo primario.
- contrato del reporte hacia agente de centro ya fijado documentalmente para separar la coordinacion operativa con centros del flujo de notificaciones a propietarios o clientes.
- politica de tipos documentales oficiales ya fijada documentalmente para separar expediente base nuclear de soportes auxiliares.
- unicidad logica del expediente ya fijada documentalmente para separar documento vigente, version fisica vigente y reemplazo historico del soporte.
- matriz de visibilidad documental del propietario ya fijada documentalmente para separar elegibilidad del visor de la simple bandera `is_visible_to_owner`.
- integracion del ciclo de vida del vehiculo a notificaciones ya fijada documentalmente para bloquear flujo externo sobre unidades o propietarios que ya no deben seguir en operacion ordinaria.
- modelo canonico de permisos internos del intermediario ya fijado documentalmente para separar autorizacion interna por modulo del visor externo del propietario.
- contrato canonico de remision para verificaciones ya fijado documentalmente para separar encabezado de remision, conceptos economicos y futura cobranza aplicada.
- contrato canonico de conceptos economicos por verificacion ya fijado documentalmente para separar renglon economico, referencia operativa y monto canonico frente a monto aplicado.
- flujo canonico de cobranza desde remision hasta pago aplicado ya fijado documentalmente para separar nacimiento de deuda, registro de pago, aplicacion y saldo.
- contrato maestro del modelo ya fijado documentalmente para dejar una sola jerarquia formal entre tablas, glosario, diagrama y roadmap.
- acta formal de cierre de normalizacion ya emitida documentalmente para congelar el modelo estructural ordinario.
- visto bueno senior del modelo ya emitido documentalmente para aprobar el cierre estructural.
- diagrama maestro aprobado ya publicado documentalmente para lectura visual limpia del modelo.

El siguiente paso natural es:

- mantener el modelo estructural ya cerrado como contrato de trabajo;
- validar bucket real y cutover de fase 3;
- abrir migraciones SQL y desarrollo sobre el modelo ya congelado;
- abrir `overrides` temporales de calendario solo cuando exista requerimiento real de negocio y bajo control de cambio excepcional;
- seguir registrando cambios en la bitacora antes de cada subida a Git.
