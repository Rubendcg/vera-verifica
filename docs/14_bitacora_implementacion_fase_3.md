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

### 2026-05-12 - Formalizacion de tipos documentales del expediente PDF

#### Objetivo

Dejar explicito en el modelo que el expediente documental soporta la subida de PDFs de tarjeta de circulacion, constancia fisico-mecanica y constancia de emisiones.

#### Cambios realizados

- se agrego el enum `DocumentType` en TypeORM;
- se formalizo `documents.document_type` como enum en lugar de texto libre;
- se preparo una migracion para convertir valores existentes a tipos controlados;
- se actualizo la documentacion funcional del expediente PDF.

#### Archivos involucrados

- `src/modules/documents/entities/documents.enums.ts`
- `src/modules/documents/entities/document.entity.ts`
- `src/database/migrations/20260512213000-formalize-document-types.ts`
- `docs/03_reportes_notificaciones_y_documentos.md`
- `docs/14_bitacora_implementacion_fase_3.md`

#### Impacto funcional

- el modelo ya deja explicito que puede recibir PDFs de tarjeta de circulacion;
- el modelo ya deja explicito que puede recibir PDFs de constancia fisico-mecanica;
- el modelo ya deja explicito que puede recibir PDFs de constancia de emisiones;
- se reduce la ambiguedad de `document_type` para futuras cargas y endpoints.

#### Validacion prevista

- ejecutar `npm run build`;
- ejecutar `npm test`;
- validar que la migracion convierta correctamente valores documentales existentes.

#### Pendientes inmediatos

- implementar endpoints reales de `documents`;
- definir estrategia final de almacenamiento de PDF;
- decidir si el PDF se guardara en ruta local, object storage o `bytea`;
- agregar reglas de negocio para una sola version vigente por documento.

### 2026-05-13 - API inicial operativa de `documents`

#### Objetivo

Sacar el modulo `documents` del estado scaffold y convertirlo en una API funcional con seguridad, consulta segura para propietario y versionado de PDFs.

#### Cambios realizados

- se agregaron DTOs de consulta, alta documental y alta de version PDF;
- se protegieron las rutas con `JwtAuthGuard` y `AdminGuard`;
- se implementaron listados y detalle de documentos con filtro por acceso vehicular;
- se implemento visibilidad de propietario basada en `is_visible_to_owner`;
- se implemento alta administrativa de `documents`;
- se implemento alta de nuevas versiones en `document_files`;
- se incorporo la regla de una sola version vigente por documento;
- se implemento carga fisica local segura de archivos PDF;
- se implemento descarga controlada de la version vigente;
- se agrego documentacion de endpoints de fase 3;
- se agregaron pruebas e2e del modulo `documents`.

#### Archivos involucrados

- `src/modules/documents/documents.controller.ts`
- `src/modules/documents/documents.module.ts`
- `src/modules/documents/documents.service.ts`
- `src/modules/documents/dto/*`
- `test/documents.e2e-spec.ts`
- `docs/14_bitacora_implementacion_fase_3.md`
- `docs/22_endpoints_documents_fase_3.md`

#### Impacto funcional

- Vera ya puede consultar expedientes documentales desde API;
- un propietario ya solo ve documentos visibles y de vehiculos asignados;
- administracion ya puede crear el documento logico y agregar nuevas versiones PDF;
- administracion ya puede cargar fisicamente un PDF vigente en almacenamiento local controlado;
- propietario y admin ya pueden descargar el PDF vigente segun permisos;
- cada documento ya conserva una sola version marcada como vigente.

#### Validacion ejecutada

- `npm run build`: correcto;
- `npx jest --runInBand`: correcto;
- `npx jest --config ./test/jest-e2e.json --runInBand`: correcto.

#### Pendientes inmediatos

- definir e implementar la estrategia final de carga fisica del PDF;
- decidir si `LOCAL_PATH` queda como estrategia final o si se migra a `OBJECT_STORAGE`;
- ampliar pruebas sobre descarga y versionado con almacenamiento real.

### 2026-05-13 - Decision de estrategia estable para almacenamiento documental

#### Objetivo

Cerrar la ambiguedad de fase 3 sobre el destino estable de los PDFs del expediente documental.

#### Decision tomada

La estrategia estable objetivo de **Vera** sera `OBJECT_STORAGE`.

`LOCAL_PATH` queda como implementacion temporal valida para:

- desarrollo local;
- pruebas automatizadas;
- despliegues controlados de un solo nodo.

#### Razon tecnica

- el expediente documental no debe depender del disco local del nodo de aplicacion como almacenamiento estable;
- `OBJECT_STORAGE` separa mejor persistencia binaria, despliegue y escalado;
- el respaldo, versionado y operacion multiinstancia son mas robustos fuera del filesystem local;
- `DATABASE` no se toma como estrategia principal para no cargar PostgreSQL con binarios como flujo dominante.

#### Implicacion de implementacion

- la carga y descarga local actual cierran el flujo funcional de fase 3;
- el siguiente bloque tecnico es migrar ese flujo a `OBJECT_STORAGE`;
- la operacion actual con `LOCAL_PATH` debe leerse como puente de implementacion, no como arquitectura final.

#### Archivos involucrados

- `.env.example`
- `docs/10_hoja_de_ruta_base_de_datos.md`
- `docs/14_bitacora_implementacion_fase_3.md`
- `docs/22_endpoints_documents_fase_3.md`

#### Pendientes inmediatos

- definir proveedor o estrategia S3-compatible para `OBJECT_STORAGE`;
- adaptar upload y download del modulo `documents` a esa capa;
- mantener `LOCAL_PATH` solo como fallback local de desarrollo.

### 2026-05-13 - Implementacion real de `OBJECT_STORAGE` S3-compatible

#### Objetivo

Implementar una capa de almacenamiento desacoplada para que `documents` pueda escribir en `OBJECT_STORAGE` sin perder compatibilidad de lectura con archivos previos en `LOCAL_PATH`.

#### Cambios realizados

- se extrajo la carga y descarga fisica a backends dedicados de almacenamiento;
- se implemento backend local para `LOCAL_PATH`;
- se implemento backend S3-compatible para `OBJECT_STORAGE` con `@aws-sdk/client-s3`;
- se agrego un servicio de resolucion por `storage_kind` para lectura y por `DOCUMENTS_STORAGE_DRIVER` para escritura;
- se agrego compensacion para borrar el archivo fisico si falla la persistencia SQL despues del upload;
- se agrego configuracion de entorno para bucket, endpoint, credenciales y prefijo;
- se agrego un probe admin para validar `put/get/delete` reales contra el bucket configurado;
- se agrego prueba unitaria del backend S3-compatible;
- se adaptaron las e2e existentes para seguir validando el fallback local y el acceso admin al probe.

#### Archivos involucrados

- `package.json`
- `package-lock.json`
- `.env.example`
- `src/modules/documents/documents.module.ts`
- `src/modules/documents/documents.service.ts`
- `src/modules/documents/storage/*`
- `test/documents.e2e-spec.ts`
- `docs/14_bitacora_implementacion_fase_3.md`
- `docs/22_endpoints_documents_fase_3.md`
- `docs/10_hoja_de_ruta_base_de_datos.md`
- `docs/README.md`

#### Impacto funcional

- Vera ya puede escribir PDFs nuevos en `OBJECT_STORAGE`;
- Vera mantiene lectura de archivos existentes segun `document_files.storage_kind`;
- `LOCAL_PATH` queda como fallback funcional para desarrollo y pruebas;
- Vera ya puede verificar conectividad real con un bucket S3-compatible desde API admin;
- la API de `documents` deja de conocer directamente filesystem o S3.

#### Validacion ejecutada

- `npm run build`: correcto;
- `npx jest --runInBand`: correcto;
- `npx jest --config ./test/jest-e2e.json --runInBand`: correcto.

#### Pendientes inmediatos

- cargar credenciales reales y ejecutar el probe contra un bucket S3-compatible real;
- definir migracion operativa de archivos previos en `LOCAL_PATH`;
- ampliar auditoria de acceso y descargas de PDF.

### 2026-05-14 - Migracion operativa de `LOCAL_PATH` a `OBJECT_STORAGE`

#### Objetivo

Implementar el flujo admin para migrar archivos documentales ya existentes desde `LOCAL_PATH` hacia `OBJECT_STORAGE` sin crear nuevas versiones ni romper la descarga vigente.

#### Cambios realizados

- se agrego DTO de migracion operativa con filtros por `documentId`, `fileId`, `onlyCurrent`, `limit` y `dryRun`;
- se agrego endpoint admin `POST /documents/storage/object/migrate`;
- se implemento la migracion por archivo reutilizando la capa de storage desacoplada;
- se agrego soporte para previsualizacion `dryRun`;
- se agrego opcion para borrar el archivo origen despues de migrar;
- se mantiene la misma fila de `document_files`, actualizando solo `storage_kind`, `storage_path`, tamano y hash;
- se agrego cobertura e2e para subir un PDF local, migrarlo y seguirlo descargando desde `OBJECT_STORAGE`.

#### Archivos involucrados

- `src/modules/documents/dto/migrate-document-storage.dto.ts`
- `src/modules/documents/documents.controller.ts`
- `src/modules/documents/documents.service.ts`
- `src/modules/documents/storage/documents-storage.service.ts`
- `test/documents.e2e-spec.ts`
- `docs/14_bitacora_implementacion_fase_3.md`
- `docs/22_endpoints_documents_fase_3.md`
- `docs/10_hoja_de_ruta_base_de_datos.md`
- `docs/README.md`

#### Impacto funcional

- Vera ya puede planear y ejecutar migraciones de PDFs previos desde `LOCAL_PATH`;
- un documento vigente puede seguir descargandose despues del cambio de backend sin crear una nueva version;
- el corte operativo hacia `OBJECT_STORAGE` ya no depende de cambios manuales directos en base de datos.

#### Validacion ejecutada

- `npm run build`: correcto;
- `npx jest --runInBand`: correcto;
- `npx jest --config ./test/jest-e2e.json --runInBand`: correcto.

#### Pendientes inmediatos

- cargar credenciales reales y ejecutar `probe` y `migrate` contra un bucket S3-compatible real;
- decidir la politica final de borrado de archivos origen despues del cutover;
- ampliar auditoria de acceso, descargas y migraciones del expediente PDF.
