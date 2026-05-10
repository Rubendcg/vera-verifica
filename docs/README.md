# Documentación de Base de Datos

Esta carpeta concentra la documentación funcional y técnica del esquema SQL de **Vera**.

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
- [05_lineamientos_estadisticos_y_cobranza.md](./05_lineamientos_estadisticos_y_cobranza.md)
- [06_diagrama_final_bd.md](./06_diagrama_final_bd.md)
- [07_orden_creacion_sql_por_fases.md](./07_orden_creacion_sql_por_fases.md)
- [08_modulos_nest_alineados_bd.md](./08_modulos_nest_alineados_bd.md)
- [09_bitacora_implementacion_fase_1.md](./09_bitacora_implementacion_fase_1.md)
- [10_hoja_de_ruta_base_de_datos.md](./10_hoja_de_ruta_base_de_datos.md)
- [11_bitacora_implementacion_fase_2.md](./11_bitacora_implementacion_fase_2.md)
- [12_modelo_sql_verification_obligations.md](./12_modelo_sql_verification_obligations.md)

## Scripts SQL base

Los scripts fuente que respaldan esta documentación están actualmente en el workspace:

- `sql_mvp_reportes_notificaciones_postgres.sql`
- `sql_mvp_automatizacion_envios_postgres.sql`

## Alcance actual

La documentación cubre el esquema lógico definido hasta ahora, la implementación completa de fase 1 y la base estructural de fase 2.

Estado actual:

- estructura base de módulos Nest creada;
- configuración de TypeORM y PostgreSQL integrada;
- migración inicial de fase 1 creada y aplicada;
- migración de fase 2 creada y aplicada para verificaciones;
- bitácora de implementación disponible en esta carpeta.

El siguiente paso natural es:

- desarrollar DTOs y servicios reales sobre fase 1;
- construir reglas y servicios reales de fase 2;
- seguir registrando cambios en la bitácora antes de cada subida a Git.
