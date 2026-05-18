# Base De Datos MVP

Paquete de base de datos del MVP de **Vera**, preparado para correr en Docker con PostgreSQL.

## Alcance

Este paquete solo incluye el submodelo necesario para:

- consultar vehiculos;
- consultar relaciones vigentes;
- registrar verificaciones realizadas;
- guardar tarjeta de circulacion;
- guardar constancia fisico mecanica;
- guardar constancia de emisiones;
- generar reportes operativos del MVP.

## Estructura

- [init/10_mvp_schema.sql](./init/10_mvp_schema.sql): esquema, enums, tablas, restricciones, indices y triggers.
- [init/20_mvp_views.sql](./init/20_mvp_views.sql): vistas derivadas para lectura y reportes del MVP.
- [.env.example](./.env.example): variables sugeridas para levantar el contenedor.

## Levantar con Docker

Desde la raiz del proyecto:

```powershell
copy database\mvp\.env.example .env.mvp
docker compose --env-file .env.mvp -f docker-compose.mvp.yml up -d
```

## Bajar el contenedor

```powershell
docker compose --env-file .env.mvp -f docker-compose.mvp.yml down
```

Si tambien quieres borrar el volumen:

```powershell
docker compose --env-file .env.mvp -f docker-compose.mvp.yml down -v
```

## Conexion esperada

- host: `localhost`
- port: `54329`
- database: `vera_mvp`
- user: `postgres`

## Tablas incluidas

- `parties`
- `users`
- `vehicles`
- `vehicle_party_roles`
- `verification_centers`
- `verification_events`
- `documents`
- `document_files`

## Vistas incluidas

- `vw_current_vehicle_relationships`
- `vw_vehicle_latest_verification_events`
- `vw_vehicle_official_document_status`
- `vw_mvp_vehicle_master`

## Nota de integracion

Este paquete SQL es el recorte de base de datos del MVP y no depende del modelo completo.

Si despues quieres amarrarlo al backend actual, el siguiente paso sera alinear entidades y migraciones TypeORM al mismo recorte.
