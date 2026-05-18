# Endpoints de Documents - Fase 3

## Objetivo

Documentar los endpoints iniciales del modulo `documents` de **Vera**, alineados con la fase 3 del expediente documental.

## Alcance

Estos endpoints cubren:

- consulta de documentos;
- consulta admin de trazabilidad operativa;
- consulta detallada de un documento;
- alta administrativa de expediente documental;
- alta de nuevas versiones PDF por documento;
- visibilidad segura para propietario.

## Nota operativa

En esta etapa los endpoints ya aplican:

- autenticacion con `Bearer token`;
- autorizacion por rol y por acceso vehicular;
- visibilidad de propietario basada en `is_visible_to_owner`;
- control de una sola version vigente por documento.

Nota de transicion:

- esta lectura refleja la implementacion actual;
- el destino canonico de permisos internos del intermediario se cierra en [48_modelo_canonico_permisos_internos_del_intermediario.md](./48_modelo_canonico_permisos_internos_del_intermediario.md), donde la operacion interna de `documents` migra a `PLATFORM_ADMIN` y `DOCUMENTS_OPERATOR`.

## Tabla de endpoints

| Metodo | Ruta | Finalidad |
| --- | --- | --- |
| `GET` | `/documents/summary` | Resumen del modulo y tablas cubiertas |
| `GET` | `/documents/catalogs` | Catalogos de enums documentales |
| `POST` | `/documents/storage/object/probe` | Probe admin de conectividad real con bucket S3-compatible |
| `POST` | `/documents/storage/object/migrate` | Migracion admin de archivos `LOCAL_PATH` hacia `OBJECT_STORAGE` |
| `GET` | `/documents/access-log` | Consulta admin de trazabilidad operativa del expediente |
| `GET` | `/documents` | Listado de documentos segun filtros y permisos |
| `GET` | `/documents/:id` | Detalle de un documento |
| `POST` | `/documents` | Alta de documento logico |
| `POST` | `/documents/:id/files` | Alta de una nueva version PDF del documento |
| `POST` | `/documents/:id/files/upload` | Carga fisica segura de un PDF y alta de nueva version vigente |
| `GET` | `/documents/:id/files/current/download` | Descarga controlada del PDF vigente |

## Reglas de acceso

- `GET /documents/summary`, `GET /documents/catalogs` y `GET /documents`: cualquier usuario autenticado;
- `POST /documents/storage/object/probe`: solo admin;
- `POST /documents/storage/object/migrate`: solo admin;
- `GET /documents/access-log`: solo admin;
- `GET /documents/:id`: admin o usuario con acceso activo al vehiculo y visibilidad permitida del documento;
- `POST /documents` y `POST /documents/:id/files`: solo admin;
- `POST /documents/:id/files/upload`: solo admin;
- `GET /documents/:id/files/current/download`: admin o usuario con acceso activo al vehiculo y visibilidad permitida del documento.

## Encabezado requerido

Los endpoints protegidos esperan:

- `Authorization: Bearer <token>`

Token de entrada:

- `POST /auth/login`

## Filtros disponibles

### `GET /documents`

- `vehicleId`
- `documentType`
- `verificationType`
- `documentStatus`
- `isVisibleToOwner`
- `onlyWithCurrentFile`
- `search`

## Decisiones de diseno

### Documento logico vs archivo PDF

`documents` representa el expediente logico del soporte.

`document_files` representa el PDF real y versionado.

La politica canonica de tipos documentales se cierra en:

- [44_politica_tipos_documentales_oficiales.md](./44_politica_tipos_documentales_oficiales.md)

Regla base:

- `TARJETA_CIRCULACION`, `CONSTANCIA_FISICO_MECANICA` y `CONSTANCIA_EMISIONES` son los tipos oficiales nucleares;
- `PERMISO`, `CONTRATO_ARRENDAMIENTO` y `OTRO` son auxiliares;
- los auxiliares no sustituyen un faltante del expediente oficial.

La unicidad logica del expediente se cierra en:

- [45_unicidad_logica_del_expediente.md](./45_unicidad_logica_del_expediente.md)

Reglas base:

- un nuevo PDF del mismo soporte debe crear nueva version en `document_files`;
- un nuevo soporte con nueva vigencia o nuevo numero debe crear nuevo `document`;
- para tipos oficiales nucleares solo debe existir un `ACTIVE` por `vehicleId + documentType`.

### Visibilidad para propietario

Un usuario no administrador solo puede ver:

- documentos de vehiculos asignados en `user_vehicle_access`;
- documentos con `is_visible_to_owner = true`.

La matriz canonica completa se cierra en:

- [46_matriz_visibilidad_documental_del_propietario.md](./46_matriz_visibilidad_documental_del_propietario.md)

Regla importante:

- la implementacion base actual aplica el minimo `user_vehicle_access + is_visible_to_owner`;
- la politica canonica completa agrega ademas estado del propietario, estado de vida del vehiculo, tipo documental y estado documental.

### Version vigente

Cada documento conserva una sola version vigente.

Cuando se agrega una nueva version por:

- `POST /documents/:id/files`

el sistema:

- incrementa `version_no`;
- marca la nueva version como `is_current = true`;
- marca como no vigentes las versiones anteriores.

### Restriccion inicial de archivos

En este bloque de fase 3 solo se aceptan archivos con:

- `mimeType = application/pdf`

La estrategia de almacenamiento puede ser:

- `LOCAL_PATH`
- `OBJECT_STORAGE`
- `DATABASE`

### Carga fisica segura con backend seleccionable

El endpoint:

- `POST /documents/:id/files/upload`

recibe un archivo real por multipart y:

- valida que sea PDF;
- selecciona el backend de escritura por `DOCUMENTS_STORAGE_DRIVER`;
- soporta `LOCAL_PATH` y `OBJECT_STORAGE`;
- calcula `sha256`;
- crea una nueva version vigente del documento;
- deja la version anterior como no vigente;
- elimina el archivo fisico recien subido si la persistencia de metadatos falla.

### Descarga controlada del vigente

El endpoint:

- `GET /documents/:id/files/current/download`

solo entrega la version vigente cuando el usuario:

- es admin; o
- tiene acceso activo al vehiculo y el documento es visible para propietario.

Lectura canonica objetivo para propietario:

- propietario `ACTIVE`;
- unidad `ACTIVE` o `SUSPENDED`;
- documento `ACTIVE`;
- tipo documental elegible por la matriz;
- `is_visible_to_owner = true`;
- archivo vigente disponible.

La descarga resuelve el backend segun `document_files.storage_kind`, por lo que puede leer:

- PDFs historicos en `LOCAL_PATH`;
- PDFs nuevos o migrados en `OBJECT_STORAGE`;
- `DATABASE` cuando el contenido viva en `content_bytea`.

## Trazabilidad operativa

La tabla `document_access_log` registra eventos append-only del expediente documental.

Eventos cubiertos:

- `VIEW_DOCUMENT`
- `DOWNLOAD_CURRENT_FILE`
- `CREATE_DOCUMENT`
- `ADD_FILE_VERSION`
- `UPLOAD_FILE`
- `PROBE_OBJECT_STORAGE`
- `MIGRATE_FILE_TO_OBJECT_STORAGE`

Campos principales:

- `document_id`
- `document_file_id`
- `vehicle_id`
- `actor_user_id`
- `action_type`
- `actor_is_admin`
- `storage_kind`
- `details_json`
- `created_at`

## Consulta admin del log

El endpoint `GET /documents/access-log` permite filtrar por:

- `documentId`
- `documentFileId`
- `vehicleId`
- `actorUserId`
- `actionType`
- `storageKind`
- `createdFrom`
- `createdTo`
- `limit`

## Decision de almacenamiento estable

La decision tecnica del proyecto es:

- `OBJECT_STORAGE` sera la estrategia estable objetivo;
- `LOCAL_PATH` queda como implementacion temporal para desarrollo, pruebas y operacion mononodo controlada;
- `DATABASE` no se toma como estrategia principal por costo y crecimiento del volumen binario en PostgreSQL.

Razon principal:

- el expediente PDF necesita persistencia desacoplada del nodo de aplicacion;
- `OBJECT_STORAGE` soporta mejor respaldo, escalado y despliegues multiples;
- `LOCAL_PATH` sirve para cerrar el flujo funcional, pero no es el destino correcto de largo plazo.

## Configuracion requerida

Variables relevantes:

- `DOCUMENTS_STORAGE_DRIVER=LOCAL_PATH|OBJECT_STORAGE`
- `DOCUMENTS_STORAGE_ROOT`
- `DOCUMENTS_S3_ENDPOINT`
- `DOCUMENTS_S3_REGION`
- `DOCUMENTS_S3_BUCKET`
- `DOCUMENTS_S3_ACCESS_KEY_ID`
- `DOCUMENTS_S3_SECRET_ACCESS_KEY`
- `DOCUMENTS_S3_FORCE_PATH_STYLE`
- `DOCUMENTS_S3_PREFIX`

## Probe de bucket real

El endpoint:

- `POST /documents/storage/object/probe`

ejecuta un ciclo real de:

- `putObject`
- `getObject`
- `deleteObject`

contra el bucket configurado y devuelve:

- `bucket`
- `endpoint`
- `prefix`
- `objectKey`
- `uploadedBytes`
- `downloadedBytes`
- `deleted`

## Migracion operativa a `OBJECT_STORAGE`

El endpoint:

- `POST /documents/storage/object/migrate`

permite migrar archivos existentes desde `LOCAL_PATH` hacia `OBJECT_STORAGE` sin crear una nueva version documental.

Campos de entrada:

- `documentId`
- `fileId`
- `onlyCurrent`
- `deleteSourceAfterMigration`
- `dryRun`
- `limit`

Comportamiento:

- lee el PDF origen segun su `storage_kind`;
- escribe el mismo contenido en `OBJECT_STORAGE`;
- actualiza el mismo registro de `document_files` con `storage_kind = OBJECT_STORAGE`;
- conserva `version_no`, `is_current` y `original_file_name`;
- puede operar en `dryRun` para previsualizar candidatos;
- puede intentar borrar el origen local si `deleteSourceAfterMigration = true`.

## Siguiente paso recomendado

La siguiente iteracion natural sobre este modulo es:

- cargar credenciales reales y ejecutar el probe admin contra un bucket S3-compatible real;
- ejecutar la migracion operativa de archivos existentes en `LOCAL_PATH` hacia `OBJECT_STORAGE`;
- cerrar el cutover real a bucket y definir la politica final de borrado del origen local.
