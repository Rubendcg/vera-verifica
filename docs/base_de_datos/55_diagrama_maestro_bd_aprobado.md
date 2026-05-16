# Diagrama Maestro de Base de Datos Aprobado

## Objetivo

Publicar el diagrama visual maestro aprobado despues del cierre estructural del modelo de **Vera**.

## Version SVG aprobada

- [55_diagrama_maestro_bd_aprobado.svg](./55_diagrama_maestro_bd_aprobado.svg)

## Estado de este diagrama

Este diagrama se considera:

- el resumen visual maestro aprobado;
- la referencia grafica principal para lectura humana del modelo;
- subordinado a [02_tablas_y_relaciones.md](./02_tablas_y_relaciones.md) y [20_glosario_base_de_datos.md](./20_glosario_base_de_datos.md).

## Criterios de diseno usados

- lienzo amplio para evitar saturacion;
- lineas ortogonales, sin diagonales;
- ninguna linea trazada por encima de tablas;
- tipos de datos visibles en campos clave;
- agrupacion por dominios para permitir lectura por capas.

## Alcance visual

El SVG incluye:

- nucleo de identidad y acceso;
- vida del vehiculo y aplicabilidad;
- cumplimiento regulatorio;
- expediente documental;
- remisiones, cobranza y pagos;
- reportes y notificaciones;
- analitica operativa.

## Omisiones visuales deliberadas

Para preservar legibilidad, el diagrama **no dibuja todas las FK auxiliares**.

Se omiten del trazo principal cuando no cambian la lectura estructural:

- FK de auditoria hacia `users`;
- FK de soporte documental hacia `documents` en tablas historicas;
- vistas `vw_*`;
- algunas relaciones repetidas hacia `parties` o `vehicles` cuando ya quedan inequívocas por el contexto del bloque.

Esas relaciones siguen siendo parte del contrato estructural y deben leerse desde:

- [02_tablas_y_relaciones.md](./02_tablas_y_relaciones.md)
- [52_contrato_maestro_del_modelo_bd.md](./52_contrato_maestro_del_modelo_bd.md)

## Lectura recomendada

1. leer primero los bloques `Identity and Access` y `Vehicle Governance`;
2. seguir con `Compliance and Documents`;
3. despues leer `Finance and Settlement`;
4. cerrar con `Notifications` y `Analytics`.

## Regla de precedencia

Si este diagrama contradice:

- estructura de tablas;
- tipos funcionales;
- significado de estados;
- o reglas canonicas del negocio;

debe corregirse el diagrama, no el contrato maestro, salvo aprobacion documental expresa.

## Relacion con el diagrama anterior

[06_diagrama_final_bd.md](./06_diagrama_final_bd.md) y su SVG previo permanecen como antecedente de trabajo y narrativa extendida.

La version aprobada para lectura visual limpia de cierre es:

- [55_diagrama_maestro_bd_aprobado.svg](./55_diagrama_maestro_bd_aprobado.svg)
