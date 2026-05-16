# Vera

Plataforma para el control de verificaciones de autotransporte, orientada a centralizar vehículos, vigencias, documentos PDF, reportes por cliente y notificaciones automáticas.

## Objetivo

`Vera` está pensado para operar como la base técnica de **Veraverifica**, con estas metas:

- centralizar el padrón de vehículos;
- controlar verificaciones físico-mecánicas y de emisiones;
- separar propiedad, operación, permiso y titularidad documental;
- permitir que cada propietario vea solo sus vehículos;
- mantener la contabilidad visible solo para administración;
- almacenar expedientes PDF como tarjetas de circulación y constancias de verificación;
- preparar reportes automáticos por vencimiento vía correo y WhatsApp.

## Enfoque funcional

El sistema no trata a "cliente", "propietario" y "usuario" como la misma cosa.

El modelo separa:

- `vehicles`: la unidad;
- `parties`: la persona o empresa relacionada;
- `vehicle_party_roles`: el rol que esa parte tiene respecto al vehículo;
- `users`: la cuenta que entra al sistema;
- `user_vehicle_access`: qué usuario puede consultar qué vehículos.

Eso permite distinguir correctamente entre:

- propietario;
- poseedor legal;
- permisionario;
- titular de tarjeta;
- cliente de consulta;
- usuario autorizado del portal.

## Capacidades previstas

- control por régimen `FEDERAL` y `ESTATAL`;
- segmentación por tercer dígito para federal;
- segmentación por cuarto dígito para estatal;
- historial de verificaciones y vigencias;
- carga de PDFs escaneados y versiones documentales;
- reportes de pendientes, por vencer y vencidos;
- automatización de notificaciones;
- restricción de contabilidad para propietarios.

## Documentación

La documentación del modelo actual está en [docs/base_de_datos/README.md](./docs/base_de_datos/README.md).

Documentos principales:

- [docs/base_de_datos/01_esquema_sql_general.md](./docs/base_de_datos/01_esquema_sql_general.md)
- [docs/base_de_datos/02_tablas_y_relaciones.md](./docs/base_de_datos/02_tablas_y_relaciones.md)
- [docs/base_de_datos/03_reportes_notificaciones_y_documentos.md](./docs/base_de_datos/03_reportes_notificaciones_y_documentos.md)

## Puesta en marcha local

1. Instala dependencias:
   `npm install`
2. Crea tu archivo local a partir de [`.env.example`](./.env.example):
   `copy .env.example .env`
3. Ajusta las credenciales de PostgreSQL en `.env`.
4. Ejecuta migraciones:
   `npm run db:migration:run`
5. Levanta el backend:
   `npm run start:dev`

## Scripts útiles

- `npm run build`
- `npm test`
- `npm run db:migration:run`
- `npm run db:migration:revert`
- `npm run db:migration:show`
- `npm run db:schema:log`

## Estado actual

Actualmente Vera ya tiene implementada la base de fase 1 con PostgreSQL y Nest para:

- vehículos y relaciones jurídicas/operativas;
- usuarios y control de acceso por vehículo;
- verificaciones;
- documentos PDF;
- reportes por cliente;
- notificaciones automáticas;
- gestión y contabilidad.

Estado técnico actual:

- módulos Nest base creados en `src/modules/`;
- TypeORM configurado;
- migración inicial de fase 1 aplicada;
- conexión local validada contra PostgreSQL;
- documentación técnica y bitácora de implementación en `docs/base_de_datos/`.

El siguiente paso natural es desarrollar:

- DTOs y servicios reales sobre fase 1;
- endpoints CRUD para `parties`, `users` y `vehicles`;
- fase 2 de verificaciones;
- carga documental y reglas de negocio.

## Módulos sugeridos

- `auth`
- `users`
- `parties`
- `vehicles`
- `verifications`
- `documents`
- `reports`
- `notifications`
- `analytics`
- `capacity`
- `service-orders`
- `billing`
- `collections`

## Regla de acceso

### Administrador

Puede ver:

- toda la operación;
- relaciones jurídicas;
- verificaciones;
- PDFs;
- remisiones;
- montos y contabilidad;
- bitácora de envíos.

### Propietario o usuario autorizado

Puede ver solo:

- vehículos asignados;
- estatus de verificaciones;
- fechas de vencimiento;
- documentos permitidos;
- observaciones operativas.

No puede ver:

- costos;
- remisiones con monto;
- utilidad;
- vehículos ajenos;
- contabilidad interna.
