# Gobierno del Cierre Estructural de la Base de Datos

## Objetivo

Formalizar la regla de trabajo del proyecto para que **Vera** cierre primero su modelo de base de datos y solo despues abra desarrollo funcional normal sobre una estructura ya aprobada.

Este documento cierra `NORM-002`.

## Regla canonica del proyecto

En **Vera**, primero se cierra el modelo de datos y despues se desarrolla.

Mientras la normalizacion estructural no quede formalmente cerrada:

- no deben abrirse mas cambios funcionales que expandan el modelo;
- no deben abrirse migraciones estructurales nuevas sin aprobacion documental previa;
- no debe declararse congelado el diagrama final;
- no debe tratarse el modelo actual como contrato inmutable.

## Alcance de esta regla

Aplica a:

- tablas nuevas;
- columnas nuevas o eliminadas;
- cambios de cardinalidad;
- cambios de llaves primarias o foraneas;
- cambios de unicidad, `CHECK` o enums;
- cambios de estados canonicos;
- cambios de permisos estructurales;
- cambios que afecten el significado del negocio en el modelo.

## Lo que se considera cambio estructural

Se considera cambio estructural cualquier cambio que altere:

- la forma de identificar un vehiculo;
- la forma de representar propietario, cliente, titular o acceso;
- la forma de modelar verificaciones, documentos, notificaciones o cobranza;
- la forma de cerrar estados o relaciones entre entidades;
- la lectura contractual del diagrama o del glosario.

## Lo que si puede avanzar mientras la normalizacion sigue abierta

Durante esta etapa si pueden avanzar:

- analisis documental;
- correcciones de consistencia entre documentos;
- definicion de reglas de negocio;
- revision del diagrama;
- definicion de contratos SQL futuros;
- aclaraciones del glosario;
- priorizacion del TODO de normalizacion.

## Lo que no debe avanzar mientras la normalizacion sigue abierta

Mientras el TODO no llegue a cierre formal, no deben abrirse:

- nuevas migraciones estructurales por impulso de implementacion;
- nuevos modulos funcionales que dependan de una base aun cambiante;
- APIs que congelen contratos sobre tablas aun no cerradas;
- refactors que oculten una decision de modelo no resuelta.

## Mecanismo obligatorio antes de cualquier cambio estructural

Antes de aceptar un cambio estructural debe existir:

1. necesidad de negocio descrita;
2. impacto sobre tablas y relaciones identificado;
3. actualizacion documental propuesta;
4. aprobacion explicita sobre el documento fuente;
5. reflejo del cambio en el TODO de normalizacion o en el control excepcional correspondiente.

## Regla de entrada a desarrollo funcional normal

El proyecto solo debe abrir desarrollo funcional normal sobre la base cuando ocurra todo esto:

1. `NORM-001` a `NORM-021` cerrados;
2. acta formal de cierre de normalizacion emitida;
3. diagrama, glosario, roadmap y documentos maestros alineados;
4. decision explicita de congelamiento estructural aceptada.

## Regla de salida despues del cierre

Una vez cerrado el modelo:

- los cambios estructurales dejan de ser trabajo normal;
- cualquier cambio posterior pasa a control de cambio excepcional;
- primero se justifica el cambio en documentos;
- despues se autoriza modificar SQL, migraciones o codigo.

## Control de cambio excepcional

Despues del cierre, solo debe abrirse un cambio estructural si existe al menos uno de estos motivos:

- requerimiento real nuevo de negocio;
- correccion de error conceptual del modelo;
- obligacion regulatoria nueva;
- imposibilidad tecnica demostrable de operar con el esquema cerrado.

En ese caso debe registrarse:

- motivo;
- alcance;
- riesgo;
- impacto en datos;
- documentos afectados;
- decision de aprobacion.

## Autoridad documental

Para efectos del proyecto, la autoridad del modelo debe descansar en este orden:

1. enunciado canonico del negocio;
2. TODO de cierre de normalizacion;
3. roadmap de base de datos;
4. diagrama, glosario y documentos de detalle;
5. implementacion tecnica.

Si hay conflicto entre implementacion y documento canonico, no se resuelve "por el codigo".

Se corrige por decision documental primero.

## Relacion con otros documentos

Este documento depende de:

- [31_todo_cierre_normalizacion_bd.md](./31_todo_cierre_normalizacion_bd.md)
- [32_enunciado_canonico_del_negocio_vera.md](./32_enunciado_canonico_del_negocio_vera.md)
- [10_hoja_de_ruta_base_de_datos.md](./10_hoja_de_ruta_base_de_datos.md)
- [53_acta_cierre_normalizacion_bd.md](./53_acta_cierre_normalizacion_bd.md)

## Criterio de cierre de NORM-002

`NORM-002` se considera cerrado cuando:

- exista esta regla formal de gobierno;
- roadmap e indice remitan a ella;
- el TODO ya no deje ambigua la secuencia "cerrar modelo primero, desarrollar despues".
