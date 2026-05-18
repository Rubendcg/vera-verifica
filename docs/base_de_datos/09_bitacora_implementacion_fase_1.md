# Bitácora de Implementación de Fase 1

## Objetivo

Registrar de forma acumulativa los cambios técnicos que se van incorporando a **Vera** durante la implementación del backend y de la base de datos, para que cada bloque tenga contexto claro antes de subirse a Git.

## Alcance de esta bitácora

Esta bitácora cubre la **fase 1** definida en [07_orden_creacion_sql_por_fases.md](./07_orden_creacion_sql_por_fases.md):

- `parties`
- `users`
- `vehicles`
- `vehicle_party_roles`
- `user_vehicle_access`

## Convención de registro

Cada entrada debe indicar:

- fecha;
- objetivo del cambio;
- archivos tocados;
- impacto funcional;
- validación ejecutada;
- pendientes antes del siguiente commit.

## Entradas

### 2026-05-09 - Inicio de persistencia PostgreSQL y fase 1

#### Objetivo

Conectar **Vera** a PostgreSQL y preparar la primera capa real de persistencia con entidades y migraciones del núcleo operativo.

#### Cambios realizados

- se agregó configuración base para PostgreSQL con TypeORM;
- se definió un `DataSource` independiente para ejecutar migraciones;
- se creó `.env.example` con las variables de conexión esperadas;
- se crearon las entidades de fase 1;
- se preparó la primera migración manual del núcleo operativo;
- se enlazaron los módulos `parties`, `users` y `vehicles` con `TypeOrmModule.forFeature`;
- se integró `ConfigModule` y `TypeOrmModule` en `AppModule`.

#### Archivos involucrados

- `package.json`
- `.env.example`
- `src/config/database.environment.ts`
- `src/database/typeorm.entities.ts`
- `src/database/typeorm.config.ts`
- `src/database/data-source.ts`
- `src/database/migrations/20260509170000-create-phase-1-core.ts`
- `src/modules/parties/entities/party.entity.ts`
- `src/modules/users/entities/user.entity.ts`
- `src/modules/vehicles/entities/vehicle.entity.ts`
- `src/modules/vehicles/entities/vehicle-party-role.entity.ts`
- `src/modules/vehicles/entities/user-vehicle-access.entity.ts`
- `src/modules/parties/parties.module.ts`
- `src/modules/users/users.module.ts`
- `src/modules/vehicles/vehicles.module.ts`
- `src/app.module.ts`

#### Impacto funcional

- el backend ya queda preparado para levantar conexión a PostgreSQL vía variables de entorno;
- el proyecto ya tiene un punto único para ejecutar migraciones;
- el núcleo operativo de la base queda definido en código y en SQL reversible.

#### Validación prevista

- instalar dependencias necesarias de TypeORM y PostgreSQL;
- ejecutar `npm run build`;
- ejecutar `npm test`;
- validar scripts de migración;
- correr `db:migration:show` o `db:migration:run` cuando exista una base disponible.

#### Validación ejecutada

- se instalaron `@nestjs/config`, `@nestjs/typeorm`, `typeorm`, `pg` y `dotenv`;
- `npm run build`: correcto;
- `npm test`: correcto;
- se actualizó `.env` con credenciales locales de PostgreSQL;
- se validó conectividad contra PostgreSQL 18 en `localhost:5433`;
- se creó la base `vera`;
- se ejecutó `npm run db:migration:run` correctamente;
- la migración `CreatePhase1Core20260509170000` quedó aplicada;
- la conexión final quedó validada sobre `vera` con el usuario `postgres`.

#### Pendientes inmediatos

- documentar la carga inicial de catálogos o datos semilla de fase 1;
- preparar repositorios, DTOs y servicios reales sobre las tablas base;
- preparar la fase 2 de verificaciones una vez estabilizada la fase 1.

### 2026-05-09 - Preparación del repositorio para GitHub

#### Objetivo

Dejar el proyecto en un estado seguro, entendible y reproducible antes del siguiente commit y push a GitHub.

#### Cambios realizados

- se saneó `.env.example` para no publicar una contraseña de ejemplo engañosa;
- se agregó `.gitattributes` para normalizar textos y tratar imágenes como binarios;
- se actualizó el `README.md` raíz con pasos reales de arranque local;
- se actualizó `docs/base_de_datos/README.md` para reflejar que la fase 1 ya está implementada;
- se verificó que `.env` siga fuera del control de versiones;
- se confirmó el remoto `origin` del repositorio.

#### Impacto funcional

- un tercero puede clonar el proyecto y entender cómo levantarlo;
- las credenciales reales no forman parte del contenido publicable;
- la documentación ya refleja el estado actual del código.

#### Validación ejecutada

- revisión de `.gitignore`;
- revisión de `git status`;
- búsqueda de secretos en archivos versionables;
- confirmación del remoto GitHub configurado.

#### Pendientes inmediatos

- revisar el conjunto final de archivos a stagear;
- generar el commit de preparación y hacer push;
- continuar con DTOs y endpoints reales de fase 1.
