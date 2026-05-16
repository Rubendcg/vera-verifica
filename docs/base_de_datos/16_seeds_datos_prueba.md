# Seeds de Datos de Prueba

## Objetivo

Documentar los archivos de carga generados para el juego de datos de revision de vehiculos.

## Archivos generados

- [20260510_vehicle_review_dataset.sql](../database/seeds/20260510_vehicle_review_dataset.sql)
- [vehicle_review_dataset.json](../database/seeds/vehicle_review_dataset.json)
- [15_datos_prueba_vehiculos_revision.md](./15_datos_prueba_vehiculos_revision.md)
- [17_referencia_vin_niv_y_anos_modelo.md](./17_referencia_vin_niv_y_anos_modelo.md)

## Alcance del seed SQL

El script SQL inserta o actualiza directamente:

- `verification_centers`
- `parties`
- `vehicles`
- `vehicle_party_roles`
- `verification_events`

## Comportamiento del seed SQL

- usa `ON CONFLICT` para centros, partes y vehiculos;
- elimina y recrea solo los roles de propiedad con la nota `SEED_REVIEW_2026_05_OWNER`;
- elimina y recrea solo los eventos de verificacion con la nota `SEED_REVIEW_2026_05_EVENT`;
- inserta verificaciones fisico-mecanicas para los 40 vehiculos;
- inserta verificaciones de emisiones para los 20 vehiculos con motor;
- carga `serial_niv` como VIN sintetico de `17` caracteres;
- no inserta usuarios, accesos, obligaciones ni documentos;
- no modifica otros registros ajenos al seed.

## Relacion con el JSON

El archivo `vehicle_review_dataset.json` contiene el mismo dataset en formato portable para:

- carga por script;
- pruebas automatizadas;
- transformacion a CSV;
- generacion posterior de seeds para otras tablas.

## Nota de uso

Este entregable deja listo el dataset para carga controlada, pero no lo ejecuta automaticamente sobre PostgreSQL.
