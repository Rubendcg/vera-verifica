# Bitácora de Implementación de Fase 2

## Objetivo

Registrar los cambios técnicos relacionados con la **fase 2** de la base de datos de **Vera**, centrada en el cumplimiento regulatorio de verificaciones.

## Alcance de esta bitácora

Esta bitácora cubre:

- `verification_centers`
- `verification_events`
- `verification_schedule_rules`

## Convención de registro

Cada entrada debe indicar:

- fecha;
- objetivo del cambio;
- archivos involucrados;
- impacto funcional;
- validación ejecutada;
- pendientes inmediatos.

## Entradas

### 2026-05-09 - Arranque de fase 2

#### Objetivo

Agregar la base estructural de verificaciones en PostgreSQL y en TypeORM, manteniendo separado el expediente documental para la fase 3.

#### Cambios realizados

- se crearon las entidades `VerificationCenter`, `VerificationEvent` y `VerificationScheduleRule`;
- se conectó el módulo `verifications` a `TypeOrmModule.forFeature`;
- se registraron las nuevas entidades en `src/database/typeorm.entities.ts`;
- se extendió `Vehicle` para soportar la relación con eventos de verificación;
- se preparó la migración `CreatePhase2Verifications20260509195500`;
- se actualizó la hoja de ruta para marcar la fase 2 como `En implementación`.

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

- Vera ya queda preparada para registrar centros de verificación;
- ya existe un modelo formal para eventos de verificación con vigencia y resultado;
- ya existe una tabla para parametrizar el calendario por régimen, posición y marcador de placa.

#### Validación prevista

- copiar los cambios al proyecto real;
- ejecutar `npm run build`;
- ejecutar `npm test`;
- aplicar la migración de fase 2 sobre la base `vera`;
- verificar las tablas creadas en PostgreSQL.

#### Validación ejecutada

- `npm run build`: correcto;
- `npm test`: correcto;
- `npm run db:migration:run`: correcto;
- la migración `CreatePhase2Verifications20260509195500` quedó aplicada en PostgreSQL;
- se verificó la existencia de `verification_centers`, `verification_events` y `verification_schedule_rules` en la base `vera`.

#### Pendientes inmediatos

- definir la carga inicial de reglas de calendario;
- construir servicios y DTOs reales para `verifications`;
- decidir si la lógica de vigencia vive en servicio, vista o ambos.

### 2026-05-09 - Modelo de obligaciones de verificación

#### Objetivo

Agregar la capa que permita registrar la decisión del propietario sobre una verificación pendiente y reflejarla automáticamente en la vista del administrador.

#### Cambios realizados

- se creó la entidad `VerificationObligation`;
- se creó la entidad `VerificationObligationHistory`;
- se extendieron relaciones con `users`, `vehicles`, `verification_centers` y `verification_events`;
- se preparó la migración `CreateVerificationObligations20260509211000`;
- se documentó el modelo SQL específico en `12_modelo_sql_verification_obligations.md`.

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

- Vera ya puede distinguir entre una obligación pendiente y una verificación ya ejecutada;
- el propietario puede responder sobre una obligación sin marcar todavía cumplimiento real;
- administración puede ver el estado de la respuesta sin recaptura manual.

#### Validación prevista

- copiar cambios al proyecto real;
- ejecutar `npm run build`;
- ejecutar `npm test`;
- aplicar la migración sobre `vera`;
- verificar tablas nuevas en PostgreSQL.

#### Validación ejecutada

- `npm run build`: correcto;
- `npm test`: correcto;
- `npm run db:migration:run`: correcto;
- la migración `CreateVerificationObligations20260509211000` quedó aplicada;
- se validó la creación de `verification_obligations` y `verification_obligation_history` en PostgreSQL.

#### Pendientes inmediatos

- decidir reglas exactas de generación automática de obligaciones;
- construir endpoints para respuesta del propietario y seguimiento administrativo.
