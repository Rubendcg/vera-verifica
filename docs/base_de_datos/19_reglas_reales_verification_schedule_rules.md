# Reglas Reales para `verification_schedule_rules`

## Objetivo

Dejar documentado el criterio vigente de **Vera** para las reglas de calendario en `verification_schedule_rules`, indicando:

- que ventanas usa el proyecto;
- que diferencia existe entre `FEDERAL` y `ESTATAL`;
- que excepciones no deben tratarse como regla maestra permanente.

Este documento responde cuando debe verificarse una unidad, no si ese tipo de verificacion le aplica.

La aplicabilidad se cierra aparte en:

- [40_perfil_canonico_aplicabilidad_verificaciones.md](./40_perfil_canonico_aplicabilidad_verificaciones.md)

## Decision de modelado

El modelo original de `verification_schedule_rules` solo permitia una ventana por:

- `regime`
- `schedulePosition`
- `scheduleMarker`
- `verificationType`

Eso no alcanzaba para reglas semestrales.

Por eso se agrego:

- `windowSequence`

con el fin de permitir multiples ventanas dentro del mismo ejercicio.

## Criterio vigente del proyecto

El criterio confirmado para **Vera** es este:

- las reglas estatales usan las mismas ventanas que las federales;
- la unica diferencia es el numero verificador usado para la placa;
- en `FEDERAL` se usa `schedulePosition = 3`;
- en `ESTATAL` se usa `schedulePosition = 4`.

En otras palabras:

- cambian la posicion y el marcador usado para identificar el grupo;
- no cambian los meses base del calendario.

## 1. Federal - Fisico mecanica

Se usa la base anual permanente `2016 en adelante`:

| Marcador | Meses |
| --- | --- |
| `5` o `6` | Enero a Abril |
| `7` u `8` | Marzo a Junio |
| `3` o `4` | Mayo a Agosto |
| `1` o `2` | Julio a Octubre |
| `9` o `0` | Septiembre a Diciembre |

Uso en Vera:

- `regime = FEDERAL`
- `schedulePosition = 3`
- `verificationType = PHYSICAL_MECHANICAL`
- `windowSequence = 1`

Fuente base:

- DOF, modificacion del 15 de mayo de 2015, calendario `2016 en adelante`
- `https://www.dof.gob.mx/index_111.php?day=15&month=05&year=2015`

## 2. Federal - Emisiones

Se usa la base semestral vigente:

| Secuencia | Meses |
| --- | --- |
| `1` | Enero a Junio |
| `2` | Julio a Diciembre |

Uso en Vera:

- `regime = FEDERAL`
- `schedulePosition = 3`
- `verificationType = EMISSIONS`
- `windowSequence = 1` y `2`

Nota de modelado:

La publicacion federal de emisiones no segmenta por digito. En Vera se replica la misma ventana sobre los marcadores `0-9` para mantener compatibilidad con el motor actual de calendario y filtros por marcador.

Fuente base:

- DOF, aviso del 3 de abril de 2026
- `https://dof.gob.mx/nota_detalle.php?codigo=5784029&fecha=03/04/2026#gsc.tab=0`

## 3. Estatal - Fisico mecanica

Se debe usar la misma base anual que federal:

| Marcador | Meses |
| --- | --- |
| `5` o `6` | Enero a Abril |
| `7` u `8` | Marzo a Junio |
| `3` o `4` | Mayo a Agosto |
| `1` o `2` | Julio a Octubre |
| `9` o `0` | Septiembre a Diciembre |

Uso en Vera:

- `regime = ESTATAL`
- `schedulePosition = 4`
- `verificationType = PHYSICAL_MECHANICAL`
- `windowSequence = 1`

## 4. Estatal - Emisiones

Se debe usar la misma base semestral que federal:

| Secuencia | Meses |
| --- | --- |
| `1` | Enero a Junio |
| `2` | Julio a Diciembre |

Uso en Vera:

- `regime = ESTATAL`
- `schedulePosition = 4`
- `verificationType = EMISSIONS`
- `windowSequence = 1` y `2`

## Lo que no se debe tomar como regla maestra

### Prorrogas o modificaciones extraordinarias

No se deben sembrar como regla maestra permanente las prorrogas extraordinarias de un ejercicio concreto.

Motivo:

- son excepciones temporales;
- no deben reemplazar el calendario base;
- quedan fuera del cierre de fase 2;
- Vera debe modelarlas despues como `overrides` o periodos extraordinarios en una extension puntual del calendario regulatorio.

### Calendarios estatales alternos por publicacion local

Si existe una publicacion local con meses distintos, no debe reemplazar automaticamente este criterio del proyecto sin una decision explicita de negocio.

Motivo:

- hoy el criterio confirmado del proyecto es replicar federal en estatal;
- la diferencia aceptada en Vera es solo la posicion del digito verificador;
- cualquier divergencia futura debe quedar documentada como cambio de regla, no como inferencia.

## Implicacion tecnica

Con este criterio, la alineacion correcta del sistema debe ser:

- `FEDERAL` y `ESTATAL` comparten ventanas;
- `ESTATAL` solo cambia `schedulePosition`;
- el seed y la base deben reflejar ese criterio en la misma forma.
