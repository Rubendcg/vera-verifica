# Bitacora de Implementacion de Fase 2

## Objetivo

Registrar los cambios tecnicos relacionados con la **fase 2** de la base de datos de **Vera**, centrada en el cumplimiento regulatorio de verificaciones.

## Alcance de esta bitacora

Esta bitacora cubre:

- `verification_centers`
- `verification_events`
- `verification_schedule_rules`
- `verification_obligations`
- `verification_obligation_history`
- endpoints funcionales del modulo `verifications`

## Convencion de registro

Cada entrada debe indicar:

- fecha;
- objetivo del cambio;
- archivos involucrados;
- impacto funcional;
- validacion ejecutada;
- pendientes inmediatos.

## Entradas

### 2026-05-09 - Arranque de fase 2

#### Objetivo

Agregar la base estructural de verificaciones en PostgreSQL y en TypeORM, manteniendo separado el expediente documental para la fase 3.

#### Cambios realizados

- se crearon las entidades `VerificationCenter`, `VerificationEvent` y `VerificationScheduleRule`;
- se conecto el modulo `verifications` a `TypeOrmModule.forFeature`;
- se registraron las nuevas entidades en `src/database/typeorm.entities.ts`;
- se extendio `Vehicle` para soportar la relacion con eventos de verificacion;
- se preparo la migracion `CreatePhase2Verifications20260509195500`;
- se actualizo la hoja de ruta para marcar la fase 2 como `En implementacion`.

#### Archivos involucrados

- `src/modules/verifications/entities/verification-center.entity.ts`
- `src/modules/verifications/entities/verification-event.entity.ts`
- `src/modules/verifications/entities/verification-schedule-rule.entity.ts`
- `src/modules/verifications/verifications.module.ts`
- `src/modules/verifications/verifications.service.ts`
- `src/modules/vehicles/entities/vehicle.entity.ts`
- `src/database/typeorm.entities.ts`
- `src/database/migrations/20260509195500-create-phase-2-verifications.ts`
- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`

#### Impacto funcional

- Vera ya queda preparada para registrar centros de verificacion;
- ya existe un modelo formal para eventos de verificacion con vigencia y resultado;
- ya existe una tabla para parametrizar el calendario por regimen, posicion y marcador de placa.

#### Validacion prevista

- copiar los cambios al proyecto real;
- ejecutar `npm run build`;
- ejecutar `npm test`;
- aplicar la migracion de fase 2 sobre la base `vera`;
- verificar las tablas creadas en PostgreSQL.

#### Validacion ejecutada

- `npm run build`: correcto;
- `npm test`: correcto;
- `npm run db:migration:run`: correcto;
- la migracion `CreatePhase2Verifications20260509195500` quedo aplicada en PostgreSQL;
- se verifico la existencia de `verification_centers`, `verification_events` y `verification_schedule_rules` en la base `vera`.

#### Pendientes inmediatos

- definir la carga inicial de reglas de calendario;
- construir servicios y DTOs reales para `verifications`;
- decidir si la logica de vigencia vive en servicio, vista o ambos.

### 2026-05-09 - Modelo de obligaciones de verificacion

#### Objetivo

Agregar la capa que permita registrar la decision del propietario sobre una verificacion pendiente y reflejarla automaticamente en la vista del administrador.

#### Cambios realizados

- se creo la entidad `VerificationObligation`;
- se creo la entidad `VerificationObligationHistory`;
- se extendieron relaciones con `users`, `vehicles`, `verification_centers` y `verification_events`;
- se preparo la migracion `CreateVerificationObligations20260509211000`;
- se documento el modelo SQL especifico en `12_modelo_sql_verification_obligations.md`.

#### Archivos involucrados

- `src/modules/verifications/entities/verification-obligation.entity.ts`
- `src/modules/verifications/entities/verification-obligation-history.entity.ts`
- `src/modules/verifications/entities/verification-center.entity.ts`
- `src/modules/verifications/entities/verification-event.entity.ts`
- `src/modules/users/entities/user.entity.ts`
- `src/modules/vehicles/entities/vehicle.entity.ts`
- `src/modules/verifications/verifications.module.ts`
- `src/modules/verifications/verifications.service.ts`
- `src/database/typeorm.entities.ts`
- `src/database/migrations/20260509211000-create-verification-obligations.ts`
- `docs/base_de_datos/12_modelo_sql_verification_obligations.md`

#### Impacto funcional

- Vera ya puede distinguir entre una obligacion pendiente y una verificacion ya ejecutada;
- el propietario puede responder sobre una obligacion sin marcar todavia cumplimiento real;
- administracion puede ver el estado de la respuesta sin recaptura manual.

#### Validacion prevista

- copiar cambios al proyecto real;
- ejecutar `npm run build`;
- ejecutar `npm test`;
- aplicar la migracion sobre `vera`;
- verificar tablas nuevas en PostgreSQL.

#### Validacion ejecutada

- `npm run build`: correcto;
- `npm test`: correcto;
- `npm run db:migration:run`: correcto;
- la migracion `CreateVerificationObligations20260509211000` quedo aplicada;
- se valido la creacion de `verification_obligations` y `verification_obligation_history` en PostgreSQL.

#### Pendientes inmediatos

- decidir reglas exactas de generacion automatica de obligaciones;
- construir endpoints para respuesta del propietario y seguimiento administrativo.

### 2026-05-10 - Endpoints funcionales de verificaciones

#### Objetivo

Convertir el modulo `verifications` de Vera de un resumen estatico a una API inicial operativa para centros, reglas, eventos y obligaciones.

#### Cambios realizados

- se agregaron DTOs para consultas y operaciones de `verifications`;
- se reemplazo el controlador minimo por endpoints reales;
- se implementaron listados y altas para `verification_centers`;
- se implementaron listados y altas para `verification_schedule_rules`;
- se implementaron listados, detalle y alta para `verification_events`;
- se implementaron listados, detalle y alta para `verification_obligations`;
- se implementaron endpoints para respuesta del propietario y programacion administrativa;
- se agrego documentacion funcional de endpoints en `13_endpoints_verifications_fase_2.md`.

#### Archivos involucrados

- `src/modules/verifications/verifications.controller.ts`
- `src/modules/verifications/verifications.service.ts`
- `src/modules/verifications/verifications.module.ts`
- `src/modules/verifications/dto/*`
- `docs/base_de_datos/13_endpoints_verifications_fase_2.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- Vera ya expone una API base para operar la fase 2;
- el frontend ya puede consultar catalogos, centros, reglas, eventos y obligaciones;
- el propietario ya puede responder una obligacion desde API;
- administracion ya puede programar una obligacion y cerrar una obligacion al registrar un evento.

#### Validacion ejecutada

- `npm run build`: correcto;
- `npm test`: correcto.

#### Pendientes inmediatos

- agregar autenticacion y autorizacion por rol;
- formalizar validacion de DTOs;
- crear pruebas de integracion para flujos de verificaciones;
- automatizar generacion de obligaciones desde reglas de calendario.

### 2026-05-10 - Calculo de estado regulatorio por vehiculo

#### Objetivo

Cerrar la brecha principal de fase 2 exponiendo un calculo consolidado del estado regulatorio vigente por vehiculo.

#### Cambios realizados

- se agrego el endpoint `GET /verifications/vehicles/:vehicleId/status`;
- se implemento el calculo de estado para fisico-mecanica y emisiones;
- se incorporo la regla de `POR_VENCER` con umbral de `30` dias;
- se usa el ultimo evento util como fuente primaria de cumplimiento;
- se usa la obligacion activa como referencia cuando no existe evento vigente;
- se incorpora la regla de calendario aplicable por regimen, posicion y marcador;
- se agrega el estado general del vehiculo a partir de los estados individuales.

#### Archivos involucrados

- `src/modules/verifications/verifications.controller.ts`
- `src/modules/verifications/verifications.service.ts`
- `docs/base_de_datos/13_endpoints_verifications_fase_2.md`

#### Impacto funcional

- Vera ya puede responder el estado regulatorio de una unidad concreta;
- el frontend ya puede mostrar fisico, emisiones, obligacion activa y estado general en una sola consulta;
- la fase 2 ya cuenta con el endpoint que faltaba para acercarse a su criterio de cierre.

#### Validacion ejecutada

- `npm run build`: correcto;
- `npm test`: correcto.

#### Pendientes inmediatos

- cargar reglas base en `verification_schedule_rules`;
- agregar autenticacion y autorizacion por rol;
- formalizar validacion de DTOs;
- crear pruebas de integracion para el endpoint de estado regulatorio.

### 2026-05-12 - Generacion automatica de obligaciones

#### Objetivo

Agregar una operacion sistemica que permita generar obligaciones pendientes a partir de las reglas de calendario ya modeladas en Vera.

#### Cambios realizados

- se agrego el endpoint `POST /verifications/obligations/generate`;
- se implemento soporte para `previewOnly` y `includeUpcomingWindow`;
- se calcula la ventana de cumplimiento aplicable segun la fecha de referencia;
- se omiten verificaciones no requeridas o vehiculos inactivos;
- se detecta cumplimiento previo por evento vigente antes de generar una nueva obligacion;
- se reutiliza una obligacion activa si ya existe para la misma fecha de vencimiento;
- se marca una obligacion activa como `OVERDUE` cuando corresponde;
- se documento el flujo operativo de generacion automatica.

#### Archivos involucrados

- `src/modules/verifications/dto/generate-verification-obligations.dto.ts`
- `src/modules/verifications/verifications.controller.ts`
- `src/modules/verifications/verifications.service.ts`
- `docs/base_de_datos/13_endpoints_verifications_fase_2.md`
- `docs/base_de_datos/18_generacion_automatica_obligaciones_fase_2.md`

#### Impacto funcional

- Vera ya puede construir obligaciones operativas desde la parametrizacion del calendario sin capturarlas una por una;
- administracion puede ejecutar una corrida real o una simulacion antes de crear pendientes;
- la fase 2 ya conecta reglas, estado regulatorio y obligaciones en un solo flujo.

#### Validacion ejecutada

- cambios copiados al proyecto real;
- `npm run build`: correcto;
- `npm test`: correcto.

#### Pendientes inmediatos

- cargar reglas base reales en `verification_schedule_rules`;
- agregar autenticacion y autorizacion por rol;
- formalizar validacion de DTOs;
- probar `POST /verifications/obligations/generate` con datos y reglas reales;
- crear pruebas de integracion para el flujo de generacion automatica.

### 2026-05-12 - Carga de reglas reales en `verification_schedule_rules`

#### Objetivo

Cargar una base realista y documentada de reglas de calendario para que Vera pueda operar ventanas anuales y semestrales sin hardcodearlas en el servicio.

#### Cambios realizados

- se amplio `verification_schedule_rules` con `windowSequence`;
- se ajusto la unicidad para soportar multiples ventanas por marcador y tipo;
- se adapto el servicio para seleccionar la regla aplicable segun la fecha de referencia;
- se preparo una migracion con la carga base de reglas federales y estatales;
- se documento por separado que reglas entraron y cuales quedaron fuera.

#### Archivos involucrados

- `src/modules/verifications/entities/verification-schedule-rule.entity.ts`
- `src/modules/verifications/dto/create-verification-schedule-rule.dto.ts`
- `src/modules/verifications/dto/query-verification-schedule-rules.dto.ts`
- `src/modules/verifications/verifications.service.ts`
- `src/database/migrations/20260512193000-seed-real-verification-schedule-rules.ts`
- `docs/base_de_datos/19_reglas_reales_verification_schedule_rules.md`
- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/13_endpoints_verifications_fase_2.md`

#### Impacto funcional

- Vera ya puede modelar reglas semestrales sin perder las anuales;
- la fase 2 ya tiene una base legal sembrable para `PHYSICAL_MECHANICAL` federal y `EMISSIONS` federal/estatal;
- el motor de estado regulatorio y el generador de obligaciones ya no dependen de una sola ventana por regla.

#### Validacion ejecutada

- cambios copiados al proyecto real;
- `npm run build`: correcto;
- `npm test`: correcto;
- `npm run db:migration:run`: correcto;
- reglas cargadas en PostgreSQL:
  - `FEDERAL` + `PHYSICAL_MECHANICAL`: `10`
  - `FEDERAL` + `EMISSIONS`: `20`
  - `ESTATAL` + `EMISSIONS`: `20`

#### Pendientes inmediatos

- probar `POST /verifications/obligations/generate` con estas reglas;
- agregar autenticacion y autorizacion por rol;
- formalizar validacion de DTOs;
- crear pruebas de integracion del flujo regulatorio.

### 2026-05-12 - Correccion documental del criterio estatal

#### Objetivo

Corregir la documentacion para reflejar el criterio confirmado del proyecto sobre reglas estatales.

#### Cambios realizados

- se actualizo la referencia documental de `verification_schedule_rules`;
- se dejo asentado que `ESTATAL` usa las mismas ventanas que `FEDERAL`;
- se preciso que la unica diferencia aceptada es `schedulePosition = 4`.

#### Archivos involucrados

- `docs/base_de_datos/19_reglas_reales_verification_schedule_rules.md`
- `docs/base_de_datos/11_bitacora_implementacion_fase_2.md`

#### Impacto funcional

- la documentacion del proyecto ya no presenta a `ESTATAL` como un calendario distinto por meses;
- queda claro que la diferencia vigente es solo el digito verificador tomado de la placa.

#### Pendientes inmediatos

- alinear el seed y los datos tecnicos sembrados en la base a este criterio documental;
- volver a validar conteos una vez aplicado ese ajuste.

### 2026-05-12 - Alineacion tecnica del criterio estatal

#### Objetivo

Corregir el seed y la base ya sembrada para que `ESTATAL` replique las mismas ventanas que `FEDERAL`, cambiando solo `schedulePosition`.

#### Cambios realizados

- se actualizo la migracion base del seed para futuras bases nuevas;
- se agrego una migracion correctiva para la base ya sembrada;
- se incorporaron reglas estatales de `PHYSICAL_MECHANICAL`;
- se ajustaron las reglas estatales de `EMISSIONS` para usar Enero-Junio y Julio-Diciembre.

#### Archivos involucrados

- `src/database/migrations/20260512193000-seed-real-verification-schedule-rules.ts`
- `src/database/migrations/20260512201500-align-state-schedule-rules.ts`
- `docs/base_de_datos/11_bitacora_implementacion_fase_2.md`
- `docs/base_de_datos/19_reglas_reales_verification_schedule_rules.md`

#### Impacto funcional

- las bases nuevas ya nacen con el criterio estatal correcto;
- la base real ya no conserva una version distinta del calendario estatal;
- Vera ya tiene consistencia entre documentacion, seed y datos cargados.

#### Validacion ejecutada

- cambios copiados al proyecto real;
- `npm run build`: correcto;
- `npm test`: correcto;
- `npm run db:migration:run`: correcto;
- conteos finales en PostgreSQL:
  - `FEDERAL` + `PHYSICAL_MECHANICAL`: `10`
  - `FEDERAL` + `EMISSIONS`: `20`
  - `ESTATAL` + `PHYSICAL_MECHANICAL`: `10`
  - `ESTATAL` + `EMISSIONS`: `20`
  - total de reglas: `60`

#### Pendientes inmediatos

- probar `POST /verifications/obligations/generate` con estas reglas ya alineadas;
- agregar autenticacion y autorizacion por rol;
- formalizar validacion de DTOs;
- crear pruebas de integracion del flujo regulatorio.

### 2026-05-12 - Prueba real de generacion automatica y limpieza de fixtures

#### Objetivo

Validar `POST /verifications/obligations/generate` contra reglas federales y estatales ya alineadas, y limpiar los datos temporales usados en la prueba.

#### Cambios realizados

- se levanto Vera localmente en `http://127.0.0.1:3100`;
- se cargo un fixture minimo identificado como `TEST_PHASE2_GENERATE_20260512`;
- se probaron tres vehiculos de control:
  - `55AB5C` `FEDERAL` `TRACTOCAMION`;
  - `TA4707A` `ESTATAL` `REMOLQUE`;
  - `TB4101B` `ESTATAL` `CAMION UNITARIO`;
- se ejecuto una corrida de simulacion con `previewOnly = true`;
- se ejecuto una primera corrida real para crear obligaciones;
- se ejecuto una segunda corrida real para validar idempotencia;
- se eliminaron los fixtures de `users`, `vehicles`, `user_vehicle_access`, `verification_obligations` y `verification_obligation_history`.

#### Archivos involucrados

- `docs/base_de_datos/11_bitacora_implementacion_fase_2.md`

#### Impacto funcional

- Vera ya quedo validada con reglas estatales y federales sobre una corrida real del generador;
- se confirmo que el flujo no duplica obligaciones al repetir la misma referencia;
- se confirmo que las unidades de arrastre omiten emisiones y que las ventanas futuras no generan pendientes antes de abrirse.

#### Validacion ejecutada

- `previewOnly = true`: `created = 4`, `updated = 0`, `skipped = 2`;
- primera corrida real: `created = 4`, `updated = 0`, `skipped = 2`;
- segunda corrida real: `created = 0`, `updated = 0`, `skipped = 6`;
- casos validados:
  - `55AB5C`: `PHYSICAL_MECHANICAL` `OVERDUE` con vencimiento `2026-04-30`; `EMISSIONS` `PENDING` con vencimiento `2026-06-30`;
  - `TA4707A`: `PHYSICAL_MECHANICAL` `PENDING` con vencimiento `2026-06-30`; `EMISSIONS` omitida como `NOT_REQUIRED`;
  - `TB4101B`: `PHYSICAL_MECHANICAL` omitida como `WINDOW_NOT_OPEN`; `EMISSIONS` `PENDING` con vencimiento `2026-06-30`;
- limpieza ejecutada:
  - `verification_obligation_history`: `4` registros eliminados;
  - `verification_obligations`: `4` registros eliminados;
  - `user_vehicle_access`: `3` registros eliminados;
  - `vehicles`: `3` registros eliminados;
  - `users`: `3` registros eliminados;
- verificacion posterior a la limpieza: conteos `0` para fixtures, obligaciones, historial, accesos y usuarios temporales.

#### Pendientes inmediatos

- agregar autenticacion y autorizacion por rol;
- formalizar validacion de DTOs;
- crear pruebas de integracion del flujo regulatorio;
- decidir si esta validacion se automatiza despues como seed de pruebas controladas.

### 2026-05-12 - Seguridad, validacion formal y pruebas e2e de fase 2

#### Objetivo

Cerrar el bloque base de seguridad del modulo `verifications` con autenticacion real, autorizacion por acceso vehicular y pruebas de integracion ejecutables sin depender de la base productiva.

#### Cambios realizados

- se agrego `POST /auth/login` para emision de token `Bearer`;
- se agrego `GET /auth/me` para recuperar el usuario autenticado;
- se incorporo `JwtAuthGuard` y `AdminGuard`;
- se activo `ValidationPipe` global en `main.ts`;
- se decoraron formalmente los DTOs de `verifications`;
- se restringieron las rutas administrativas de `verifications` a usuarios `isAdmin = true`;
- se filtro el acceso de consulta y respuesta sobre vehiculos mediante `user_vehicle_access`;
- se agregaron pruebas e2e para `app`, `auth` y `verifications`.

#### Archivos involucrados

- `src/main.ts`
- `src/modules/auth/*`
- `src/modules/verifications/verifications.controller.ts`
- `src/modules/verifications/verifications.module.ts`
- `src/modules/verifications/verifications.service.ts`
- `src/modules/verifications/dto/*`
- `test/app.e2e-spec.ts`
- `test/auth.e2e-spec.ts`
- `test/verifications.e2e-spec.ts`
- `docs/base_de_datos/13_endpoints_verifications_fase_2.md`

#### Impacto funcional

- Vera ya exige autenticacion para operar `verifications`;
- un propietario o usuario autorizado solo puede consultar y responder sobre unidades asignadas;
- las altas de reglas, eventos, obligaciones y la generacion automatica quedan bloqueadas para no-admin;
- los DTOs ya rechazan payloads mal formados antes de tocar la capa de servicio.

#### Validacion prevista

- instalar dependencias de autenticacion y validacion;
- ejecutar `npm run build`;
- ejecutar `npm test`;
- ejecutar `npm run test:e2e`.

#### Pendientes inmediatos

- llevar el mismo esquema de autenticacion y autorizacion al resto de modulos;
- ampliar cobertura e2e sobre respuesta del propietario y programacion administrativa con fixtures reales;
- decidir si fase 2 ya puede entrar a criterios formales de cierre despues de estas validaciones.

### 2026-05-12 - Cobertura e2e del flujo operativo de obligaciones

#### Objetivo

Cubrir con pruebas de integracion ejecutables el flujo principal que aun faltaba de fase 2: respuesta del propietario, programacion administrativa y cierre al registrar el evento.

#### Cambios realizados

- se rehizo la suite `test/verifications.e2e-spec.ts` con repositorios en memoria mas completos;
- se agrego una prueba del flujo `respond -> schedule -> create event -> completed`;
- se agrego una prueba para impedir que un propietario responda en nombre de otro usuario;
- se mantuvo cobertura de autenticacion, acceso por vehiculo y restriccion admin.

#### Archivos involucrados

- `test/verifications.e2e-spec.ts`
- `docs/base_de_datos/11_bitacora_implementacion_fase_2.md`

#### Impacto funcional

- Vera ya tiene una validacion automatizada del ciclo principal de una obligacion de verificacion;
- el cambio reduce riesgo de regresion en transiciones `OWNER_CONFIRMED`, `SCHEDULED` y `COMPLETED`;
- la cobertura e2e de fase 2 ya no se limita a seguridad basica.

#### Validacion prevista

- ejecutar `npm run build`;
- ejecutar `npx jest --config ./test/jest-e2e.json --runInBand`;
- ejecutar `npx jest --runInBand`.

#### Pendientes inmediatos

- llevar el mismo esquema de autenticacion y autorizacion al resto de modulos;
- decidir si fase 2 pasa a estado de cierre formal o si se deja abierta por el tema de `overrides` temporales de calendario.

### 2026-05-13 - Decision de cierre sobre `overrides` temporales de calendario

#### Objetivo

Resolver si las prorrogas y periodos extraordinarios de calendario deben bloquear el cierre de fase 2 o salir como alcance posterior.

#### Decision tomada

Los `overrides` temporales de calendario quedan **fuera del alcance de cierre de fase 2**.

Fase 2 pasa a estado de **cierre formal** porque ya cumple su criterio funcional: consultar y operar el estado regulatorio vigente de un vehiculo con reglas base, obligaciones, seguridad y pruebas e2e del flujo principal.

#### Razon tecnica

- el criterio de cierre vigente de fase 2 pide operar el estado regulatorio vigente, no modelar todas las excepciones extraordinarias de calendario;
- las reglas maestras ya quedaron sembradas y alineadas para `FEDERAL` y `ESTATAL`;
- las prorrogas o periodos extraordinarios no son regla permanente y no deben contaminar `verification_schedule_rules`;
- implementarlas ahora abriria un submodelo nuevo de vigencia excepcional, prioridad, aplicacion por periodo y trazabilidad normativa.

#### Implicacion de alcance

- fase 2 no queda reabierta por no tener `overrides`;
- los `overrides` se registran como extension posterior del calendario regulatorio;
- cualquier prorroga futura debe tratarse como requerimiento nuevo con su propio diseno de datos y validacion.

#### Archivos involucrados

- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/11_bitacora_implementacion_fase_2.md`
- `docs/base_de_datos/19_reglas_reales_verification_schedule_rules.md`

#### Validacion aplicada para sostener la decision

- reglas base reales sembradas y alineadas en PostgreSQL;
- generacion automatica validada con corrida real e idempotencia;
- autenticacion, autorizacion y validacion formal activas;
- pruebas e2e del flujo principal de obligaciones ejecutadas correctamente.

#### Pendientes inmediatos

- cerrar administrativamente la fase 2 como `En cierre formal` hasta completar el checklist final;
- abrir, cuando haga falta, una extension especifica para `overrides` temporales de calendario.

### 2026-05-13 - Cierre formal completado de fase 2

#### Objetivo

Completar administrativamente el cierre de fase 2 despues de validar alcance, evidencia funcional y deuda controlada.

#### Cambios realizados

- se actualizo la hoja de ruta para marcar la fase 2 como `Completada`;
- se redacto un acta breve de cierre formal de fase 2;
- se ajustaron referencias globales para indicar que el siguiente foco pasa a fase 3.

#### Archivos involucrados

- `docs/base_de_datos/10_hoja_de_ruta_base_de_datos.md`
- `docs/base_de_datos/11_bitacora_implementacion_fase_2.md`
- `docs/base_de_datos/13_endpoints_verifications_fase_2.md`
- `docs/base_de_datos/19_reglas_reales_verification_schedule_rules.md`
- `docs/base_de_datos/21_cierre_formal_fase_2.md`
- `docs/base_de_datos/README.md`

#### Impacto funcional

- el proyecto ya no presenta la fase 2 como abierta;
- queda documentado que los `overrides` temporales no bloquean este cierre;
- la prioridad documental y tecnica se mueve a fase 3.

#### Validacion aplicada

- consistencia de criterio entre hoja de ruta, bitacora y referencia de reglas;
- evidencia previa ya documentada de migraciones, calculo regulatorio, generacion automatica, seguridad y pruebas e2e.

#### Pendientes posteriores al cierre

- continuar con endpoints y carga segura de `documents`;
- disenar `overrides` temporales solo como extension posterior del calendario regulatorio.
