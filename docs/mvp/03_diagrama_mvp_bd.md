# Diagrama MVP De Base De Datos

## Objetivo

Publicar el submodelo minimo de base de datos para el MVP de **Vera**, limitado a:

- consulta integral del vehiculo;
- reporteria operativa;
- resguardo de tarjeta de circulacion;
- resguardo de constancia fisico mecanica;
- resguardo de constancia de emisiones.

## Version SVG

- [03_diagrama_mvp_bd.svg](./03_diagrama_mvp_bd.svg)

## Tablas incluidas en el MVP

- `users`: acceso del personal del intermediario.
- `parties`: personas fisicas o morales ligadas a la unidad.
- `vehicles`: identidad maestra de cada vehiculo.
- `vehicle_party_roles`: propietario, cliente y poseedor legal vigentes.
- `verification_centers`: centro donde se realizo la verificacion.
- `verification_events`: historial y vigencias de fisico mecanica y emisiones.
- `documents`: expediente logico de tarjeta, fisico mecanica y emisiones.
- `document_files`: PDF versionado de cada documento.

## Relaciones estructurales del diagrama

```text
parties 1---N users
parties 1---N vehicle_party_roles N---1 vehicles
vehicles 1---N verification_events N---1 verification_centers
vehicles 1---N documents 1---N document_files
verification_events 0..N---0..1 documents
```

## Criterios de recorte

Este diagrama solo deja lo necesario para operar el MVP.

Se excluyen del trazo principal:

- notificaciones;
- obligaciones automaticas;
- reglas de calendario;
- portal del propietario;
- cambios administrativos complejos;
- finanzas, remisiones y pagos;
- auditoria extendida y almacenamiento avanzado.

## Regla de lectura

Los reportes del MVP no necesitan tablas nuevas.

Se derivan de cruces entre:

- `vehicles`;
- `vehicle_party_roles`;
- `verification_events`;
- `verification_centers`;
- `documents`;
- `document_files`.

## Reportes esperados desde este submodelo

- `Padron vehicular`: serie, placa, propietario, cliente y poseedor legal.
- `Vigencias`: fecha de verificacion y fecha de vencimiento por tipo.
- `Por centro`: que verificaciones se realizaron en cada centro.
- `Documental`: que vehiculos tienen expediente completo o incompleto.
- `Historico`: verificaciones y versiones documentales por unidad.

## Regla de precedencia

Si este diagrama simplificado contradice el modelo maestro, prevalece el contrato estructural aprobado en:

- [docs/base_de_datos/02_tablas_y_relaciones.md](../base_de_datos/02_tablas_y_relaciones.md)
- [docs/base_de_datos/52_contrato_maestro_del_modelo_bd.md](../base_de_datos/52_contrato_maestro_del_modelo_bd.md)

Este diagrama solo es el recorte visual del MVP.
