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
- `docs/10_hoja_de_ruta_base_de_datos.md`

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
- `docs/12_modelo_sql_verification_obligations.md`

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
- `docs/13_endpoints_verifications_fase_2.md`
- `docs/README.md`

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
- `docs/13_endpoints_verifications_fase_2.md`

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
