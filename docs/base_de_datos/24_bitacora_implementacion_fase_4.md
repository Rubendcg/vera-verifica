# Bitacora de Implementacion de Fase 4

## Objetivo

Registrar los cambios tecnicos y documentales relacionados con la **fase 4** de la base de datos de **Vera**, centrada en reportes operativos y notificaciones.

## Alcance de esta bitacora

Esta bitacora cubre:

- `party_contacts`
- `report_recipients`
- `message_templates`
- `notification_rules`
- `notification_batches`
- `notification_batch_items`
- `notification_log`
- contratos de salida para `reports`
- contratos de salida para `notifications`

## Convencion de registro

Cada entrada debe indicar:

- fecha;
- objetivo del cambio;
- archivos involucrados;
- impacto funcional;
- validacion ejecutada;
- pendientes inmediatos.

## Entradas

### 2026-05-14 - Arranque documental de fase 4

#### Objetivo

Abrir formalmente la fase 4 en su capa documental sin iniciar aun implementacion operativa, migraciones ni integracion con proveedores externos.

#### Cambios realizados

- se formalizo el documento de diseno de fase 4 para `reports` y `notifications`;
- se definio el alcance funcional de reportes, destinatarios, reglas, plantillas, lotes y bitacora de envio;
- se explicitaron dependencias de entrada con fase 3, manteniendo bloqueada la implementacion operativa hasta cerrar bucket real y cutover documental;
- se documentaron flujos objetivo, contratos de salida y criterios de cierre documental y operativo;
- se alineo la hoja de ruta y el indice general de documentacion.

#### Archivos involucrados

- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/23_diseno_fase_4_reportes_y_notificaciones.md`
- `docs/base_de_datos/24_bitacora_implementacion_fase_4.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya tiene definida la siguiente fase a nivel documental;
- el alcance de fase 4 deja de depender solo de notas dispersas;
- se reduce el riesgo de abrir migraciones y endpoints sin contrato funcional previo.

#### Validacion ejecutada

- revision documental de consistencia con `docs/base_de_datos/03_reportes_notificaciones_y_documentos.md`;
- revision documental de consistencia con `docs/base_de_datos/07_orden_creacion_sql_por_fases.md`;
- revision documental de consistencia con `docs/base_de_datos/08_modulos_nest_alineados_bd.md`;
- no se ejecutaron pruebas porque este bloque es solo documental.

#### Pendientes inmediatos

- documentar estados canonicos de `notification_batches` y `notification_log`;
- definir contrato de `vw_notification_candidates`;
- documentar matriz de permisos de `reports` y `notifications`;
- mantener fase 4 sin implementacion operativa hasta cerrar bucket real y cutover de fase 3.

### 2026-05-14 - Estados canonicos, candidatos y permisos de fase 4

#### Objetivo

Bajar la fase 4 a un nivel documental ejecutable, definiendo estados canonicos para notificaciones, contrato de candidatos y politica de permisos compatible con el modelo actual de Vera.

#### Cambios realizados

- se definieron estados canonicos y transiciones permitidas para `notification_batches`;
- se definieron estados canonicos y transiciones permitidas para `notification_log`;
- se documento la separacion entre planeacion de lote, dispatch, entrega y reconciliacion;
- se formalizo el contrato objetivo de `vw_notification_candidates`;
- se fijo el grano de la vista y sus columnas minimas;
- se documento la matriz de permisos de `reports` y `notifications`, dejando la primera implementacion de notificaciones como admin-only;
- se actualizaron referencias del diseno principal de fase 4 y del indice documental.

#### Archivos involucrados

- `docs/base_de_datos/23_diseno_fase_4_reportes_y_notificaciones.md`
- `docs/base_de_datos/24_bitacora_implementacion_fase_4.md`
- `docs/base_de_datos/25_estados_canonicos_notificaciones_fase_4.md`
- `docs/base_de_datos/26_contrato_vw_notification_candidates_y_permisos_fase_4.md`
- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya tiene definidas las bases documentales para modelar lotes, logs y reconciliacion sin ambiguedad;
- la futura vista de candidatos ya tiene contrato claro antes de abrir SQL o endpoints;
- la fase 4 ya tiene una politica de permisos coherente con el esquema actual de autenticacion y acceso.

#### Validacion ejecutada

- revision documental de consistencia con `docs/base_de_datos/23_diseno_fase_4_reportes_y_notificaciones.md`;
- revision documental de consistencia con `docs/base_de_datos/03_reportes_notificaciones_y_documentos.md`;
- revision documental de consistencia con `docs/base_de_datos/04_investigacion_control_verificaciones.md`;
- no se ejecutaron pruebas porque este bloque es solo documental.

#### Pendientes inmediatos

- definir campos minimos y restricciones tecnicas de las tablas nuevas de fase 4;
- documentar contrato de preview y creacion de lotes;
- definir estrategia de reintentos y conciliacion por canal;
- mantener fase 4 sin implementacion operativa hasta cerrar bucket real y cutover de fase 3.

### 2026-05-15 - Robustez estructural de fase 4

#### Objetivo

Cerrar el diseno documental de fase 4 a nivel de base de datos, dejando definidos los elementos de robustez que faltaban antes de abrir migraciones reales.

#### Cambios realizados

- se definieron columnas minimas, llaves, `FK`, `UNIQUE`, `CHECK` e indices para `party_contacts`, `report_recipients`, `message_templates`, `notification_rules`, `notification_batches`, `notification_batch_items` y `notification_log`;
- se formalizo el contrato de `preview` y `create` de lotes con hash documental, snapshot congelado e idempotencia;
- se formalizo la politica documental de reintentos por canal y reconciliacion de proveedor;
- se bajo el modelo de notificaciones a nivel de item e intento individual;
- se alinearon roadmap, indice y documentos de apoyo con este nuevo nivel de detalle.

#### Archivos involucrados

- `docs/base_de_datos/03_reportes_notificaciones_y_documentos.md`
- `docs/base_de_datos/06_diagrama_final_bd.md`
- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/23_diseno_fase_4_reportes_y_notificaciones.md`
- `docs/base_de_datos/24_bitacora_implementacion_fase_4.md`
- `docs/base_de_datos/27_llaves_restricciones_indices_fase_4.md`
- `docs/base_de_datos/28_contrato_preview_y_creacion_lotes_fase_4.md`
- `docs/base_de_datos/29_reintentos_y_reconciliacion_fase_4.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya tiene fase 4 definida con robustez estructural suficiente para abrir migraciones sin improvisar tablas ni dedupe;
- la separacion entre lote, item e intento ya queda documentada de forma defendible;
- el siguiente paso deja de ser diseno y pasa a desbloqueo operativo de fase 3 para luego abrir SQL real de fase 4.

#### Validacion ejecutada

- revision documental de consistencia con `docs/base_de_datos/23_diseno_fase_4_reportes_y_notificaciones.md`;
- revision documental de consistencia con `docs/base_de_datos/25_estados_canonicos_notificaciones_fase_4.md`;
- revision documental de consistencia con `docs/base_de_datos/26_contrato_vw_notification_candidates_y_permisos_fase_4.md`;
- no se ejecutaron pruebas porque este bloque es solo documental.

#### Pendientes inmediatos

- cerrar bucket real y cutover de fase 3 para quitar el bloqueo operativo;
- abrir migraciones SQL de fase 4 en el orden ya documentado;
- mantener `notifications` y `reports` sin codigo funcional nuevo hasta abrir esas migraciones.

### 2026-05-15 - Integracion documental de ciclo de vida a notificaciones

#### Objetivo

Cerrar la regla por la cual las notificaciones de fase 4 no se disparan solo por vencimiento regulatorio, sino tambien por la vida administrativa de la unidad y del propietario.

#### Cambios realizados

- se creo la politica canonica de integracion entre `vw_notification_candidates`, `lifecycle_status_current` y `owner_admin_status_current`;
- se formalizo la separacion entre flujo externo normal, seguimiento interno y supresion total;
- se definio `notification_scope` con valores `NORMAL_EXTERNAL`, `INTERNAL_ONLY` y `SUPPRESSED`;
- se definieron razones canonicas de supresion para suspension, transferencia, baja y falta de base operativa;
- se ajusto el contrato de `vw_notification_candidates` para exponer elegibilidad y supresion de forma auditable;
- se alinearon reportes, roadmap, indice y glosario con esta politica.

#### Archivos involucrados

- `docs/base_de_datos/03_reportes_notificaciones_y_documentos.md`
- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/20_glosario_base_de_datos.md`
- `docs/base_de_datos/23_diseno_fase_4_reportes_y_notificaciones.md`
- `docs/base_de_datos/24_bitacora_implementacion_fase_4.md`
- `docs/base_de_datos/26_contrato_vw_notification_candidates_y_permisos_fase_4.md`
- `docs/base_de_datos/31_todo_cierre_normalizacion_bd.md`
- `docs/base_de_datos/47_integracion_ciclo_de_vida_a_notificaciones.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya separa formalmente recordatorio externo de seguimiento interno del intermediario;
- una unidad `TRANSFERRED` o `DEREGISTERED` deja de ser candidata a lote externo normal aunque siga teniendo relevancia administrativa;
- el modelo ya puede auditar por que una unidad no fue notificada sin reintroducirla por error al flujo ordinario.

#### Validacion ejecutada

- revision documental de consistencia con `docs/base_de_datos/35_submodelo_estado_de_vida_del_vehiculo.md`;
- revision documental de consistencia con `docs/base_de_datos/39_estado_administrativo_del_propietario.md`;
- revision documental de consistencia con `docs/base_de_datos/26_contrato_vw_notification_candidates_y_permisos_fase_4.md`;
- no se ejecutaron pruebas porque este bloque es solo documental.

#### Pendientes inmediatos

- cerrar el modelo de permisos internos del intermediario;
- decidir si `notifications` requiere RBAC fino o si `is_admin` sigue siendo suficiente;
- mantener fase 4 sin codigo funcional hasta completar el cierre documental de normalizacion.

### 2026-05-15 - Cierre documental del modelo de permisos internos

#### Objetivo

Cerrar si el intermediario puede seguir operando solo con `is_admin` o si el modelo ya exige roles internos por modulo.

#### Cambios realizados

- se declaro que `is_admin` ya no es suficiente como modelo canonico de negocio;
- se definio `is_admin` como superusuario tecnico y compatibilidad temporal;
- se formalizo un submodelo de roles internos acumulables por usuario;
- se definio la matriz canonica por modulo para operacion, documentos, notificaciones, finanzas y auditoria;
- se alinearon modulos, roadmap, glosario, endpoints documentales e indice con esta decision.

#### Archivos involucrados

- `docs/base_de_datos/08_modulos_nest_alineados_bd.md`
- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/13_endpoints_verifications_fase_2.md`
- `docs/base_de_datos/20_glosario_base_de_datos.md`
- `docs/base_de_datos/22_endpoints_documents_fase_3.md`
- `docs/base_de_datos/23_diseno_fase_4_reportes_y_notificaciones.md`
- `docs/base_de_datos/24_bitacora_implementacion_fase_4.md`
- `docs/base_de_datos/26_contrato_vw_notification_candidates_y_permisos_fase_4.md`
- `docs/base_de_datos/31_todo_cierre_normalizacion_bd.md`
- `docs/base_de_datos/48_modelo_canonico_permisos_internos_del_intermediario.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya separa el visor externo del propietario de la autorizacion interna del intermediario;
- los modulos de verificacion, documentos, notificaciones y finanzas ya no dependen conceptualmente de un admin global unico;
- el siguiente RBAC real puede implementarse sin reabrir la base conceptual de autorizacion.

#### Validacion ejecutada

- revision documental de consistencia con `docs/base_de_datos/26_contrato_vw_notification_candidates_y_permisos_fase_4.md`;
- revision documental de consistencia con `docs/base_de_datos/08_modulos_nest_alineados_bd.md`;
- revision documental de consistencia con `docs/base_de_datos/32_enunciado_canonico_del_negocio_vera.md`;
- no se ejecutaron pruebas porque este bloque es solo documental.

#### Pendientes inmediatos

- cerrar el contrato canonico de reportes internos y su separacion respecto a notificaciones;
- decidir si la siguiente capa requiere scopes por cliente o por centro, o si los roles modulares bastan para esta version;
- mantener el backend actual sin cambios funcionales hasta cerrar el TODO documental completo.

### 2026-05-16 - Especializacion documental de `service_order_items`

#### Objetivo

Cerrar el detalle economico de remisiones para que cada renglon quede ligado al tipo de verificacion y a la operacion origen cuando corresponda.

#### Cambios realizados

- se formalizo `service_order_items` como detalle economico canonico por verificacion o por concepto de orden;
- se definio `operational_scope` para separar lineas de verificacion de lineas de orden;
- se definio `verification_type` como obligatorio para `VERIFICATION_LINE`;
- se definio la referencia operativa a `verification_obligation_id` o `verification_event_id`;
- se separo `canonical_unit_price_amount` de `applied_unit_price_amount`;
- se alinearon tablas, lineamientos, diagrama, glosario, roadmap e indice documental.

#### Archivos involucrados

- `docs/base_de_datos/01_esquema_sql_general.md`
- `docs/base_de_datos/02_tablas_y_relaciones.md`
- `docs/base_de_datos/05_lineamientos_estadisticos_y_cobranza.md`
- `docs/base_de_datos/06_diagrama_final_bd.md`
- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/20_glosario_base_de_datos.md`
- `docs/base_de_datos/24_bitacora_implementacion_fase_4.md`
- `docs/base_de_datos/31_todo_cierre_normalizacion_bd.md`
- `docs/base_de_datos/50_contrato_canonico_conceptos_economicos_por_verificacion.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya puede distinguir economicamente lo que se cobro por fisico-mecanica, emisiones y cargos de orden;
- cada renglon queda listo para auditarse contra evento u obligacion sin mezclarlo aun con pagos aplicados;
- la base documental quedo preparada para cerrar la trazabilidad financiera sin tener que redefinir el detalle economico.

#### Validacion ejecutada

- revision documental de consistencia con `docs/base_de_datos/49_contrato_canonico_remision_verificaciones.md`;
- revision documental de consistencia con `docs/base_de_datos/05_lineamientos_estadisticos_y_cobranza.md`;
- revision documental de consistencia con `docs/base_de_datos/06_diagrama_final_bd.md`;
- no se ejecutaron pruebas porque este bloque es solo documental.

#### Pendientes inmediatos

- cerrar la trazabilidad desde remision hasta saldo y pago aplicado;
- definir como `receivable_documents`, `payment_transactions` y `payment_applications` se amarran a la remision y a sus renglones;
- mantener el backend sin cambios funcionales mientras siga abierto el cierre documental.

### 2026-05-16 - Cierre documental de trazabilidad de cobro y pago

#### Objetivo

Cerrar como nace la deuda desde una remision, como se registra el pago y como se aplica hasta afectar saldo.

#### Cambios realizados

- se formalizo la cadena canonica `service_orders -> receivable_documents -> receivable_installments -> payment_transactions -> payment_applications -> account_movements`;
- se definio que la deuda nace en `receivable_documents`, no en la remision;
- se definio que el pago se registra primero y se cancela deuda solo cuando queda aplicado;
- se mantuvo la cuenta administrativa por cliente, separando al mismo tiempo el pagador real;
- se alinearon tablas, diagrama, glosario, roadmap e indice documental con este flujo.

#### Archivos involucrados

- `docs/base_de_datos/01_esquema_sql_general.md`
- `docs/base_de_datos/02_tablas_y_relaciones.md`
- `docs/base_de_datos/05_lineamientos_estadisticos_y_cobranza.md`
- `docs/base_de_datos/06_diagrama_final_bd.md`
- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/20_glosario_base_de_datos.md`
- `docs/base_de_datos/24_bitacora_implementacion_fase_4.md`
- `docs/base_de_datos/31_todo_cierre_normalizacion_bd.md`
- `docs/base_de_datos/51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya puede reconstruir la ruta completa desde remision hasta saldo y pago aplicado;
- se evita confundir remision capturada con deuda emitida o con pago ya conciliado;
- la base documental queda preparada para congelar el modelo financiero sin volver a improvisar la cartera.

#### Validacion ejecutada

- revision documental de consistencia con `docs/base_de_datos/49_contrato_canonico_remision_verificaciones.md`;
- revision documental de consistencia con `docs/base_de_datos/50_contrato_canonico_conceptos_economicos_por_verificacion.md`;
- revision documental de consistencia con `docs/base_de_datos/05_lineamientos_estadisticos_y_cobranza.md`;
- no se ejecutaron pruebas porque este bloque es solo documental.

#### Pendientes inmediatos

- alinear de forma final diagrama, glosario y tablas como contrato maestro unico;
- emitir el acta final de cierre de normalizacion;
- mantener el backend sin cambios funcionales hasta terminar ese cierre documental.

### 2026-05-16 - Contrato maestro unico del modelo

#### Objetivo

Cerrar la alineacion final entre tablas, glosario, diagrama y roadmap para que el modelo quede con una sola jerarquia documental valida.

#### Cambios realizados

- se formalizo `52_contrato_maestro_del_modelo_bd.md` como regla de precedencia documental;
- se declaro `02_tablas_y_relaciones.md` como fuente estructural canonica;
- se declaro `20_glosario_base_de_datos.md` como fuente semantica canonica;
- se reafirmo `06_diagrama_final_bd.md` como resumen visual subordinado al contrato maestro;
- se alinearon glosario, roadmap, esquema general e indice con esta jerarquia;
- se cerro `NORM-020` en el TODO documental.

#### Archivos involucrados

- `docs/base_de_datos/01_esquema_sql_general.md`
- `docs/base_de_datos/02_tablas_y_relaciones.md`
- `docs/base_de_datos/06_diagrama_final_bd.md`
- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/20_glosario_base_de_datos.md`
- `docs/base_de_datos/24_bitacora_implementacion_fase_4.md`
- `docs/base_de_datos/31_todo_cierre_normalizacion_bd.md`
- `docs/base_de_datos/52_contrato_maestro_del_modelo_bd.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya tiene una jerarquia documental unica para interpretar el modelo;
- se reduce el riesgo de contradicciones entre diagrama, glosario y tablas al abrir migraciones futuras;
- el siguiente paso deja de ser alineacion y pasa a acta formal de cierre de normalizacion.

#### Validacion ejecutada

- revision documental de consistencia con `docs/base_de_datos/02_tablas_y_relaciones.md`;
- revision documental de consistencia con `docs/base_de_datos/20_glosario_base_de_datos.md`;
- revision documental de consistencia con `docs/base_de_datos/06_diagrama_final_bd.md`;
- no se ejecutaron pruebas porque este bloque es solo documental.

#### Pendientes inmediatos

- emitir el acta final de cierre de normalizacion;
- declarar congelamiento estructural ordinario del modelo;
- mantener el backend sin cambios funcionales hasta cerrar esa acta.

### 2026-05-16 - Acta formal de cierre de normalizacion

#### Objetivo

Emitir el cierre formal del TODO de normalizacion y declarar congelado el modelo estructural ordinario de Vera.

#### Cambios realizados

- se emitio `53_acta_cierre_normalizacion_bd.md` como documento formal de cierre;
- se cerro `NORM-021` en el TODO de normalizacion;
- se alinearon roadmap, indice y gobierno del cierre para que ya no hablen de normalizacion pendiente;
- se dejo explicito que el siguiente trabajo del proyecto es desarrollar sobre modelo cerrado y no reabrirlo informalmente.

#### Archivos involucrados

- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/24_bitacora_implementacion_fase_4.md`
- `docs/base_de_datos/31_todo_cierre_normalizacion_bd.md`
- `docs/base_de_datos/33_gobierno_del_cierre_estructural_bd.md`
- `docs/base_de_datos/53_acta_cierre_normalizacion_bd.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya cuenta con un cierre estructural formal de su modelo documental;
- el trabajo posterior deja de ser normalizacion y pasa a implementacion sobre contrato cerrado;
- cualquier cambio estructural posterior ya debe entrar por control de cambio excepcional.

#### Validacion ejecutada

- revision documental de consistencia con `docs/base_de_datos/31_todo_cierre_normalizacion_bd.md`;
- revision documental de consistencia con `docs/base_de_datos/52_contrato_maestro_del_modelo_bd.md`;
- revision documental de consistencia con `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`;
- no se ejecutaron pruebas porque este bloque es solo documental.

#### Pendientes inmediatos

- validar bucket real y cutover de fase 3;
- abrir migraciones SQL y desarrollo sobre el modelo ya congelado;
- tratar cualquier cambio estructural futuro solo por control de cambio excepcional.

### 2026-05-16 - Visto bueno senior y diagrama maestro aprobado

#### Objetivo

Dejar el modelo formalmente revisado por criterio senior y publicar un diagrama visual maestro legible para trabajar sobre el cierre.

#### Cambios realizados

- se emitio `54_visto_bueno_senior_modelo_bd.md` con dictamen formal de aprobacion estructural;
- se publico `55_diagrama_maestro_bd_aprobado.md` con su SVG limpio y ortogonal;
- se movio la referencia visual maestra del contrato desde el diagrama previo de trabajo hacia el nuevo diagrama aprobado;
- se alinearon acta, contrato maestro, roadmap e indice con este visto bueno.

#### Archivos involucrados

- `docs/base_de_datos/06_diagrama_final_bd.md`
- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/24_bitacora_implementacion_fase_4.md`
- `docs/base_de_datos/52_contrato_maestro_del_modelo_bd.md`
- `docs/base_de_datos/53_acta_cierre_normalizacion_bd.md`
- `docs/base_de_datos/54_visto_bueno_senior_modelo_bd.md`
- `docs/base_de_datos/55_diagrama_maestro_bd_aprobado.md`
- `docs/base_de_datos/55_diagrama_maestro_bd_aprobado.svg`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya tiene aprobacion senior formal sobre el modelo estructural;
- el equipo ya cuenta con un diagrama visual limpio para desarrollo posterior;
- la lectura visual del contrato deja de depender del SVG anterior, que permanecera como antecedente de trabajo.

#### Validacion ejecutada

- revision documental de consistencia con `docs/base_de_datos/53_acta_cierre_normalizacion_bd.md`;
- revision documental de consistencia con `docs/base_de_datos/52_contrato_maestro_del_modelo_bd.md`;
- revision documental de consistencia con `docs/base_de_datos/02_tablas_y_relaciones.md`;
- no se ejecutaron pruebas porque este bloque es solo documental.

#### Pendientes inmediatos

- validar visualmente el SVG nuevo en el visor local del repositorio;
- continuar con bucket real de fase 3 y luego con migraciones SQL sobre modelo ya cerrado;
- mantener cualquier cambio estructural futuro bajo control de cambio excepcional.
