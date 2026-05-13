# Bitacora de Implementacion de Fase 3

## Objetivo

Registrar los cambios tecnicos relacionados con la **fase 3** de la base de datos de **Vera**, centrada en el expediente documental del vehiculo.

## Alcance de esta bitacora

Esta bitacora cubre:

- `documents`
- `document_files`
- relacion documental con `verification_events`
- preparacion del modulo `documents` para TypeORM

## Convencion de registro

Cada entrada debe indicar:

- fecha;
- objetivo del cambio;
- archivos involucrados;
- impacto funcional;
- validacion ejecutada;
- pendientes inmediatos.

## Entradas

### 2026-05-10 - Arranque estructural de fase 3

#### Objetivo

Agregar la base estructural del expediente documental para soportar PDFs escaneados, versionado y visibilidad controlada para propietarios.

#### Cambios realizados

- se crearon las entidades `Document` y `DocumentFile`;
- se agregaron enums para estado documental, estrategia de almacenamiento y OCR;
- se relacionaron `documents` con `vehicles`, `parties` y `users`;
- se relacionaron `document_files` con `documents` y `users`;
- se agrego `source_document_id` a `verification_events` para vincular eventos con su evidencia;
- se conecto el modulo `documents` a `TypeOrmModule.forFeature`;
- se registraron `Document` y `DocumentFile` en `src/database/typeorm.entities.ts`;
- se preparo la migracion `CreatePhase3Documents20260510113000`.

#### Archivos involucrados

- `src/modules/documents/entities/document.entity.ts`
- `src/modules/documents/entities/document-file.entity.ts`
- `src/modules/documents/entities/documents.enums.ts`
- `src/modules/documents/documents.module.ts`
- `src/modules/documents/documents.service.ts`
- `src/modules/parties/entities/party.entity.ts`
- `src/modules/users/entities/user.entity.ts`
- `src/modules/vehicles/entities/vehicle.entity.ts`
- `src/modules/verifications/entities/verification-event.entity.ts`
- `src/database/typeorm.entities.ts`
- `src/database/migrations/20260510113000-create-phase-3-documents.ts`

#### Impacto funcional

- Vera ya puede modelar el expediente logico de tarjetas, constancias y otros soportes;
- Vera ya puede modelar multiples versiones de un PDF por documento;
- ya existe base para guardar metadatos de archivo, hash, OCR y visibilidad para propietario;
- un evento de verificacion ya puede vincularse con su documento fuente.

#### Validacion ejecutada

- se copiaron los cambios al proyecto real;
- `npm run build`: correcto;
- `npm test`: correcto;
- `npm run db:migration:run`: correcto;
- la migracion `CreatePhase3Documents20260510113000` quedo aplicada en PostgreSQL;
- se valido la existencia de `documents`, `document_files` y `verification_events.source_document_id` en la base `vera`.

#### Pendientes inmediatos

- implementar endpoints reales de `documents`;
- definir estrategia final de almacenamiento de PDF;
- decidir si el PDF se guardara en ruta local, object storage o `bytea`;
- agregar reglas de negocio para una sola version vigente por documento.
