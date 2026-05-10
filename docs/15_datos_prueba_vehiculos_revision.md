# Datos de Prueba para Revision de Vehiculos

## Objetivo

Concentrar un juego de datos de revision para **Vera** con:

- `20` vehiculos con motor que requieren fisico y contaminantes;
- `20` vehiculos de arrastre que requieren solo fisico;
- placas con formato federal y estatal;
- un maximo de `5` duenos distribuidos entre todas las unidades;
- `2` centros de verificacion.

## Criterios usados

- Vehiculos con motor:
  - `requires_physical = true`
  - `requires_emissions = true`
- Vehiculos de arrastre:
  - `requires_physical = true`
  - `requires_emissions = false`
- Regimen federal:
  - formato de placa `99AA9A`
  - ejemplo: `77UP1Z`
- Regimen estatal:
  - formato de placa `AA9999A`
  - ejemplo: `TB4104E`
- Distribucion de duenos:
  - `5` duenos totales
  - `8` vehiculos por dueno
- Distribucion de regimen:
  - `10` vehiculos con motor federales
  - `10` vehiculos con motor estatales
  - `10` vehiculos de arrastre federales
  - `10` vehiculos de arrastre estatales

## Duenos

| Codigo | Dueno |
| --- | --- |
| `D01` | Transportes del Mayab SA de CV |
| `D02` | Logistica Peninsular del Sureste SA de CV |
| `D03` | Carga Integral del Golfo SA de CV |
| `D04` | Arrendadora Carretera del Centro SA de CV |
| `D05` | Soluciones de Flota del Sureste SA de CV |

## Centros de verificacion

| Codigo | Nombre |
| --- | --- |
| `CVF-001` | Centro Integral de Verificacion Merida Norte |
| `CVF-002` | Centro Integral de Verificacion Merida Sur |

## Vehiculos con motor

| Codigo | Tipo unidad | Regimen | Placa | Motor | Schedule position | Schedule marker | Requiere fisico | Requiere contaminantes | Dueno | Centro fisico | Centro contaminantes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `M001` | Tractocamion | FEDERAL | `11AB1C` | `MOTF001MX26` | `3` | `A` | `SI` | `SI` | `D01` | `CVF-001` | `CVF-001` |
| `M002` | Camion unitario | FEDERAL | `12CD2E` | `MOTF002MX26` | `3` | `C` | `SI` | `SI` | `D01` | `CVF-002` | `CVF-002` |
| `M003` | Rabon | FEDERAL | `13EF3G` | `MOTF003MX26` | `3` | `E` | `SI` | `SI` | `D02` | `CVF-001` | `CVF-002` |
| `M004` | Torton | FEDERAL | `14GH4J` | `MOTF004MX26` | `3` | `G` | `SI` | `SI` | `D02` | `CVF-002` | `CVF-001` |
| `M005` | Tractocamion | FEDERAL | `15JK5L` | `MOTF005MX26` | `3` | `J` | `SI` | `SI` | `D03` | `CVF-001` | `CVF-001` |
| `M006` | Camion unitario | FEDERAL | `16MN6P` | `MOTF006MX26` | `3` | `M` | `SI` | `SI` | `D03` | `CVF-002` | `CVF-002` |
| `M007` | Rabon | FEDERAL | `17QR7S` | `MOTF007MX26` | `3` | `Q` | `SI` | `SI` | `D04` | `CVF-001` | `CVF-002` |
| `M008` | Torton | FEDERAL | `18TU8V` | `MOTF008MX26` | `3` | `T` | `SI` | `SI` | `D04` | `CVF-002` | `CVF-001` |
| `M009` | Tractocamion | FEDERAL | `19WX9Y` | `MOTF009MX26` | `3` | `W` | `SI` | `SI` | `D05` | `CVF-001` | `CVF-001` |
| `M010` | Camion unitario | FEDERAL | `20ZA1B` | `MOTF010MX26` | `3` | `Z` | `SI` | `SI` | `D05` | `CVF-002` | `CVF-002` |
| `M011` | Tractocamion | ESTATAL | `TA4101A` | `MOTE011MX26` | `4` | `1` | `SI` | `SI` | `D01` | `CVF-001` | `CVF-001` |
| `M012` | Camion unitario | ESTATAL | `TB4202B` | `MOTE012MX26` | `4` | `2` | `SI` | `SI` | `D01` | `CVF-002` | `CVF-002` |
| `M013` | Rabon | ESTATAL | `TC4303C` | `MOTE013MX26` | `4` | `3` | `SI` | `SI` | `D02` | `CVF-001` | `CVF-002` |
| `M014` | Torton | ESTATAL | `TD4404D` | `MOTE014MX26` | `4` | `4` | `SI` | `SI` | `D02` | `CVF-002` | `CVF-001` |
| `M015` | Tractocamion | ESTATAL | `TE4505E` | `MOTE015MX26` | `4` | `5` | `SI` | `SI` | `D03` | `CVF-001` | `CVF-001` |
| `M016` | Camion unitario | ESTATAL | `TF4606F` | `MOTE016MX26` | `4` | `6` | `SI` | `SI` | `D03` | `CVF-002` | `CVF-002` |
| `M017` | Rabon | ESTATAL | `TG4707G` | `MOTE017MX26` | `4` | `7` | `SI` | `SI` | `D04` | `CVF-001` | `CVF-002` |
| `M018` | Torton | ESTATAL | `TH4808H` | `MOTE018MX26` | `4` | `8` | `SI` | `SI` | `D04` | `CVF-002` | `CVF-001` |
| `M019` | Tractocamion | ESTATAL | `TJ4909J` | `MOTE019MX26` | `4` | `9` | `SI` | `SI` | `D05` | `CVF-001` | `CVF-001` |
| `M020` | Camion unitario | ESTATAL | `TK4010K` | `MOTE020MX26` | `4` | `0` | `SI` | `SI` | `D05` | `CVF-002` | `CVF-002` |

## Vehiculos de arrastre

| Codigo | Tipo unidad | Regimen | Placa | Motor | Schedule position | Schedule marker | Requiere fisico | Requiere contaminantes | Dueno | Centro fisico | Centro contaminantes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A001` | Remolque | FEDERAL | `21BC2D` | `N/A` | `3` | `B` | `SI` | `NO` | `D01` | `CVF-001` | `NO_APLICA` |
| `A002` | Semirremolque | FEDERAL | `22DE3F` | `N/A` | `3` | `D` | `SI` | `NO` | `D01` | `CVF-002` | `NO_APLICA` |
| `A003` | Caja seca | FEDERAL | `23FG4H` | `N/A` | `3` | `F` | `SI` | `NO` | `D02` | `CVF-001` | `NO_APLICA` |
| `A004` | Plataforma | FEDERAL | `24HJ5K` | `N/A` | `3` | `H` | `SI` | `NO` | `D02` | `CVF-002` | `NO_APLICA` |
| `A005` | Remolque | FEDERAL | `25KL6M` | `N/A` | `3` | `K` | `SI` | `NO` | `D03` | `CVF-001` | `NO_APLICA` |
| `A006` | Semirremolque | FEDERAL | `26NP7Q` | `N/A` | `3` | `N` | `SI` | `NO` | `D03` | `CVF-002` | `NO_APLICA` |
| `A007` | Caja seca | FEDERAL | `27RS8T` | `N/A` | `3` | `R` | `SI` | `NO` | `D04` | `CVF-001` | `NO_APLICA` |
| `A008` | Plataforma | FEDERAL | `28UV9W` | `N/A` | `3` | `U` | `SI` | `NO` | `D04` | `CVF-002` | `NO_APLICA` |
| `A009` | Remolque | FEDERAL | `29XY1Z` | `N/A` | `3` | `X` | `SI` | `NO` | `D05` | `CVF-001` | `NO_APLICA` |
| `A010` | Semirremolque | FEDERAL | `30AC2D` | `N/A` | `3` | `A` | `SI` | `NO` | `D05` | `CVF-002` | `NO_APLICA` |
| `A011` | Remolque | ESTATAL | `UA5101A` | `N/A` | `4` | `1` | `SI` | `NO` | `D01` | `CVF-001` | `NO_APLICA` |
| `A012` | Semirremolque | ESTATAL | `UB5202B` | `N/A` | `4` | `2` | `SI` | `NO` | `D01` | `CVF-002` | `NO_APLICA` |
| `A013` | Caja seca | ESTATAL | `UC5303C` | `N/A` | `4` | `3` | `SI` | `NO` | `D02` | `CVF-001` | `NO_APLICA` |
| `A014` | Plataforma | ESTATAL | `UD5404D` | `N/A` | `4` | `4` | `SI` | `NO` | `D02` | `CVF-002` | `NO_APLICA` |
| `A015` | Remolque | ESTATAL | `UE5505E` | `N/A` | `4` | `5` | `SI` | `NO` | `D03` | `CVF-001` | `NO_APLICA` |
| `A016` | Semirremolque | ESTATAL | `UF5606F` | `N/A` | `4` | `6` | `SI` | `NO` | `D03` | `CVF-002` | `NO_APLICA` |
| `A017` | Caja seca | ESTATAL | `UG5707G` | `N/A` | `4` | `7` | `SI` | `NO` | `D04` | `CVF-001` | `NO_APLICA` |
| `A018` | Plataforma | ESTATAL | `UH5808H` | `N/A` | `4` | `8` | `SI` | `NO` | `D04` | `CVF-002` | `NO_APLICA` |
| `A019` | Remolque | ESTATAL | `UJ5909J` | `N/A` | `4` | `9` | `SI` | `NO` | `D05` | `CVF-001` | `NO_APLICA` |
| `A020` | Semirremolque | ESTATAL | `UK5010K` | `N/A` | `4` | `0` | `SI` | `NO` | `D05` | `CVF-002` | `NO_APLICA` |

## Resumen de control

| Concepto | Cantidad |
| --- | --- |
| Vehiculos con motor | `20` |
| Vehiculos de arrastre | `20` |
| Vehiculos federales | `20` |
| Vehiculos estatales | `20` |
| Duenos totales | `5` |
| Centros de verificacion | `2` |
