# Documentacion de Base de Datos

Esta carpeta concentra la documentacion funcional y tecnica del esquema SQL de **Vera**.

## Objetivo

Documentar el modelo de datos que soporta:

- control de vehiculos;
- verificaciones fisico-mecanicas y emisiones;
- acceso limitado por propietario o usuario autorizado;
- expedientes PDF de tarjetas y verificaciones;
- reportes de pendientes por cliente;
- automatizacion de correo y WhatsApp;
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
- [13_endpoints_verifications_fase_2.md](./13_endpoints_verifications_fase_2.md)
- [14_bitacora_implementacion_fase_3.md](./14_bitacora_implementacion_fase_3.md)
- [15_datos_prueba_vehiculos_revision.md](./15_datos_prueba_vehiculos_revision.md)
- [16_seeds_datos_prueba.md](./16_seeds_datos_prueba.md)

## Scripts SQL base

Los scripts fuente que respaldan esta documentacion estan actualmente en el workspace:

- `sql_mvp_reportes_notificaciones_postgres.sql`
- `sql_mvp_automatizacion_envios_postgres.sql`

## Alcance actual

La documentacion cubre el esquema logico definido hasta ahora, la implementacion completa de fase 1 y la base funcional de fase 2.

Estado actual:

- estructura base de modulos Nest creada;
- configuracion de TypeORM y PostgreSQL integrada;
- migracion inicial de fase 1 creada y aplicada;
- migracion de fase 2 creada y aplicada para verificaciones;
- migracion de fase 3 creada y aplicada para expediente documental;
- endpoints base de fase 2 implementados para centros, reglas, eventos y obligaciones;
- bitacora de implementacion disponible en esta carpeta.

El siguiente paso natural es:

- desarrollar DTOs y servicios reales sobre fase 1;
- extender fase 2 con permisos, autenticacion y generacion automatica de obligaciones;
- cerrar fase 3 con carga, consulta y visibilidad de PDFs vigentes;
- seguir registrando cambios en la bitacora antes de cada subida a Git.
