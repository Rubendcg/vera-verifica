# Base De Datos MVP En Docker

## Objetivo

Dejar la base de datos del MVP lista para levantarse en un contenedor PostgreSQL sin depender del modelo completo del proyecto.

## Artefactos creados

- [docker-compose.mvp.yml](../../docker-compose.mvp.yml)
- [database/mvp/README.md](../../database/mvp/README.md)
- [database/mvp/init/10_mvp_schema.sql](../../database/mvp/init/10_mvp_schema.sql)
- [database/mvp/init/20_mvp_views.sql](../../database/mvp/init/20_mvp_views.sql)
- [database/mvp/.env.example](../../database/mvp/.env.example)

## Que instala esta base

- tablas del submodelo MVP;
- restricciones e indices minimos;
- triggers para `updated_at`;
- vistas de lectura para relaciones vigentes, verificaciones mas recientes y estado documental oficial.

## Comando de arranque

```powershell
copy database\mvp\.env.example .env.mvp
docker compose --env-file .env.mvp -f docker-compose.mvp.yml up -d
```

## Comando de validacion estructural

```powershell
docker compose --env-file .env.mvp -f docker-compose.mvp.yml config
```

## Alcance funcional soportado

- alta y consulta de propietarios, clientes y poseedores legales;
- alta y consulta de vehiculos;
- captura de eventos de verificacion;
- registro de centros de verificacion;
- expediente PDF oficial por vehiculo;
- reportes construidos desde vistas del MVP.

## Lo que no instala

- obligaciones y calendario automatico;
- notificaciones;
- portal del propietario;
- finanzas y cobranza;
- flujos administrativos extendidos;
- storage S3 y migraciones de archivos.

## Regla de uso

Este paquete es la base minima para arrancar implementacion y pruebas del MVP.

Si luego se quiere reabrir el alcance, debe hacerse por capas y no mezclando de nuevo el modelo completo en este contenedor.
