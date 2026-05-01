# Documentación de Base de Datos

Esta carpeta concentra la documentación funcional y técnica del esquema SQL de `vera-backend`.

## Objetivo

Documentar el modelo de datos que soporta:

- control de vehículos;
- verificaciones físico-mecánicas y emisiones;
- acceso limitado por propietario o usuario autorizado;
- expedientes PDF de tarjetas y verificaciones;
- reportes de pendientes por cliente;
- automatización de correo y WhatsApp;
- contabilidad visible solo para administrador.

## Documentos

- [01_esquema_sql_general.md](./01_esquema_sql_general.md)
- [02_tablas_y_relaciones.md](./02_tablas_y_relaciones.md)
- [03_reportes_notificaciones_y_documentos.md](./03_reportes_notificaciones_y_documentos.md)

## Scripts SQL base

Los scripts fuente que respaldan esta documentación están actualmente en el workspace:

- `sql_mvp_reportes_notificaciones_postgres.sql`
- `sql_mvp_automatizacion_envios_postgres.sql`

## Alcance actual

La documentación cubre el esquema lógico definido hasta ahora. El siguiente paso natural sería:

- mover estos scripts a `vera-backend/database/` o `vera-backend/docs/sql/`;
- convertirlos en migraciones reales;
- alinear módulos Nest con este modelo.
