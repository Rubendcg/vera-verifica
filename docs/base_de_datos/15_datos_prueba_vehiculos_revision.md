# Datos de Prueba para Revision de Vehiculos

## Objetivo

Concentrar un juego de datos de revision para **Vera** con:

- `20` vehiculos con motor que requieren fisico y contaminantes;
- `20` vehiculos de arrastre que requieren solo fisico;
- placas con formato federal y estatal;
- un maximo de `5` duenos distribuidos entre todas las unidades;
- `2` centros de verificacion;
- fechas de verificacion para fisico y humo;
- series VIN sinteticas de `17` caracteres con ano-modelo entre `2020` y `2024`.

## Criterios usados

- Vehiculos con motor:
  - `requires_physical = true`
  - `requires_emissions = true`
- Vehiculos de arrastre:
  - `requires_physical = true`
  - `requires_emissions = false`
- VIN:
  - longitud de `17` caracteres;
  - posicion `9` como digito verificador;
  - posicion `10` como ano-modelo;
  - series sinteticas de prueba, no asociadas a un fabricante real.
- Regimen federal:
  - formato de placa `99AA9A`
  - ejemplo: `77UP1Z`
  - el `schedule marker` corresponde al tercer digito numerico de la placa
- Regimen estatal:
  - formato de placa `AA9999A`
  - ejemplo: `TB4104E`
  - el `schedule marker` corresponde al cuarto digito numerico de la placa
- Distribucion de duenos:
  - `5` duenos totales
  - `8` vehiculos por dueno
- Distribucion de regimen:
  - `10` vehiculos con motor federales
  - `10` vehiculos con motor estatales
  - `10` vehiculos de arrastre federales
  - `10` vehiculos de arrastre estatales
- Distribucion de ano-modelo:
  - `8` vehiculos modelo `2020`
  - `8` vehiculos modelo `2021`
  - `8` vehiculos modelo `2022`
  - `8` vehiculos modelo `2023`
  - `8` vehiculos modelo `2024`

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

| Codigo | Tipo unidad | Regimen | Placa | Serie VIN | Modelo | Motor | Schedule position | Schedule marker | Requiere fisico | Fecha fisico | Vigencia fisico | Requiere contaminantes | Fecha humo | Vigencia humo | Dueno | Centro fisico | Centro contaminantes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `M001` | Tractocamion | FEDERAL | `11AB1C` | `VRAMF1A16LN000001` | `2020` | `MOTF001MX26` | `3` | `1` | `SI` | `2025-05-12` | `2026-05-12` | `SI` | `2025-11-14` | `2026-05-14` | `D01` | `CVF-001` | `CVF-001` |
| `M002` | Camion unitario | FEDERAL | `12CD2E` | `VRAMF2A28LS000002` | `2020` | `MOTF002MX26` | `3` | `2` | `SI` | `2025-05-20` | `2026-05-20` | `SI` | `2025-11-22` | `2026-05-22` | `D01` | `CVF-002` | `CVF-002` |
| `M003` | Rabon | FEDERAL | `13EF3G` | `VRAMF3B35LN000003` | `2020` | `MOTF003MX26` | `3` | `3` | `SI` | `2025-05-28` | `2026-05-28` | `SI` | `2025-11-30` | `2026-05-30` | `D02` | `CVF-001` | `CVF-002` |
| `M004` | Torton | FEDERAL | `14GH4J` | `VRAMF4B47LS000004` | `2020` | `MOTF004MX26` | `3` | `4` | `SI` | `2025-06-05` | `2026-06-05` | `SI` | `2025-12-08` | `2026-06-08` | `D02` | `CVF-002` | `CVF-001` |
| `M005` | Tractocamion | FEDERAL | `15JK5L` | `VRAMF1C53LN000005` | `2020` | `MOTF005MX26` | `3` | `5` | `SI` | `2025-06-13` | `2026-06-13` | `SI` | `2025-12-16` | `2026-06-16` | `D03` | `CVF-001` | `CVF-001` |
| `M006` | Camion unitario | FEDERAL | `16MN6P` | `VRAMF2C65LS000006` | `2020` | `MOTF006MX26` | `3` | `6` | `SI` | `2025-06-21` | `2026-06-21` | `SI` | `2025-12-24` | `2026-06-24` | `D03` | `CVF-002` | `CVF-002` |
| `M007` | Rabon | FEDERAL | `17QR7S` | `VRAMF3D72LN000007` | `2020` | `MOTF007MX26` | `3` | `7` | `SI` | `2025-06-29` | `2026-06-29` | `SI` | `2026-01-01` | `2026-07-01` | `D04` | `CVF-001` | `CVF-002` |
| `M008` | Torton | FEDERAL | `18TU8V` | `VRAMF4D84LS000008` | `2020` | `MOTF008MX26` | `3` | `8` | `SI` | `2025-07-07` | `2026-07-07` | `SI` | `2026-01-09` | `2026-07-09` | `D04` | `CVF-002` | `CVF-001` |
| `M009` | Tractocamion | FEDERAL | `19WX9Y` | `VRAMF1E99MN000009` | `2021` | `MOTF009MX26` | `3` | `9` | `SI` | `2025-07-15` | `2026-07-15` | `SI` | `2026-01-17` | `2026-07-17` | `D05` | `CVF-001` | `CVF-001` |
| `M010` | Camion unitario | FEDERAL | `20ZA1B` | `VRAMF2E13MS000010` | `2021` | `MOTF010MX26` | `3` | `1` | `SI` | `2025-07-23` | `2026-07-23` | `SI` | `2026-01-25` | `2026-07-25` | `D05` | `CVF-002` | `CVF-002` |
| `M011` | Tractocamion | ESTATAL | `TA4101A` | `VRAME1A13MN000011` | `2021` | `MOTE011MX26` | `4` | `1` | `SI` | `2025-07-31` | `2026-07-31` | `SI` | `2026-02-02` | `2026-08-02` | `D01` | `CVF-001` | `CVF-001` |
| `M012` | Camion unitario | ESTATAL | `TB4202B` | `VRAME2A25MS000012` | `2021` | `MOTE012MX26` | `4` | `2` | `SI` | `2025-08-08` | `2026-08-08` | `SI` | `2026-02-10` | `2026-08-10` | `D01` | `CVF-002` | `CVF-002` |
| `M013` | Rabon | ESTATAL | `TC4303C` | `VRAME3B32MN000013` | `2021` | `MOTE013MX26` | `4` | `3` | `SI` | `2025-08-16` | `2026-08-16` | `SI` | `2026-02-18` | `2026-08-18` | `D02` | `CVF-001` | `CVF-002` |
| `M014` | Torton | ESTATAL | `TD4404D` | `VRAME4B44MS000014` | `2021` | `MOTE014MX26` | `4` | `4` | `SI` | `2025-08-24` | `2026-08-24` | `SI` | `2026-02-26` | `2026-08-26` | `D02` | `CVF-002` | `CVF-001` |
| `M015` | Tractocamion | ESTATAL | `TE4505E` | `VRAME1C50MN000015` | `2021` | `MOTE015MX26` | `4` | `5` | `SI` | `2025-09-01` | `2026-09-01` | `SI` | `2026-03-06` | `2026-09-06` | `D03` | `CVF-001` | `CVF-001` |
| `M016` | Camion unitario | ESTATAL | `TF4606F` | `VRAME2C62MS000016` | `2021` | `MOTE016MX26` | `4` | `6` | `SI` | `2025-09-09` | `2026-09-09` | `SI` | `2026-03-14` | `2026-09-14` | `D03` | `CVF-002` | `CVF-002` |
| `M017` | Rabon | ESTATAL | `TG4707G` | `VRAME3D78NN000017` | `2022` | `MOTE017MX26` | `4` | `7` | `SI` | `2025-09-17` | `2026-09-17` | `SI` | `2026-03-22` | `2026-09-22` | `D04` | `CVF-001` | `CVF-002` |
| `M018` | Torton | ESTATAL | `TH4808H` | `VRAME4D8XNS000018` | `2022` | `MOTE018MX26` | `4` | `8` | `SI` | `2025-09-25` | `2026-09-25` | `SI` | `2026-03-30` | `2026-09-30` | `D04` | `CVF-002` | `CVF-001` |
| `M019` | Tractocamion | ESTATAL | `TJ4909J` | `VRAME1E96NN000019` | `2022` | `MOTE019MX26` | `4` | `9` | `SI` | `2025-10-03` | `2026-10-03` | `SI` | `2026-04-07` | `2026-10-07` | `D05` | `CVF-001` | `CVF-001` |
| `M020` | Camion unitario | ESTATAL | `TK4010K` | `VRAME2E01NS000020` | `2022` | `MOTE020MX26` | `4` | `0` | `SI` | `2025-10-11` | `2026-10-11` | `SI` | `2026-04-15` | `2026-10-15` | `D05` | `CVF-002` | `CVF-002` |

## Vehiculos de arrastre

| Codigo | Tipo unidad | Regimen | Placa | Serie VIN | Modelo | Motor | Schedule position | Schedule marker | Requiere fisico | Fecha fisico | Vigencia fisico | Requiere contaminantes | Fecha humo | Vigencia humo | Dueno | Centro fisico | Centro contaminantes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A001` | Remolque | FEDERAL | `21BC2D` | `VRAAF1A23NN000021` | `2022` | `N/A` | `3` | `2` | `SI` | `2025-05-18` | `2026-05-18` | `NO` | `NO_APLICA` | `NO_APLICA` | `D01` | `CVF-001` | `NO_APLICA` |
| `A002` | Semirremolque | FEDERAL | `22DE3F` | `VRAAF2A35NS000022` | `2022` | `N/A` | `3` | `3` | `SI` | `2025-05-26` | `2026-05-26` | `NO` | `NO_APLICA` | `NO_APLICA` | `D01` | `CVF-002` | `NO_APLICA` |
| `A003` | Caja seca | FEDERAL | `23FG4H` | `VRAAF3B42NN000023` | `2022` | `N/A` | `3` | `4` | `SI` | `2025-06-03` | `2026-06-03` | `NO` | `NO_APLICA` | `NO_APLICA` | `D02` | `CVF-001` | `NO_APLICA` |
| `A004` | Plataforma | FEDERAL | `24HJ5K` | `VRAAF4B54NS000024` | `2022` | `N/A` | `3` | `5` | `SI` | `2025-06-11` | `2026-06-11` | `NO` | `NO_APLICA` | `NO_APLICA` | `D02` | `CVF-002` | `NO_APLICA` |
| `A005` | Remolque | FEDERAL | `25KL6M` | `VRAAF1C67PN000025` | `2023` | `N/A` | `3` | `6` | `SI` | `2025-06-19` | `2026-06-19` | `NO` | `NO_APLICA` | `NO_APLICA` | `D03` | `CVF-001` | `NO_APLICA` |
| `A006` | Semirremolque | FEDERAL | `26NP7Q` | `VRAAF2C79PS000026` | `2023` | `N/A` | `3` | `7` | `SI` | `2025-06-27` | `2026-06-27` | `NO` | `NO_APLICA` | `NO_APLICA` | `D03` | `CVF-002` | `NO_APLICA` |
| `A007` | Caja seca | FEDERAL | `27RS8T` | `VRAAF3D86PN000027` | `2023` | `N/A` | `3` | `8` | `SI` | `2025-07-05` | `2026-07-05` | `NO` | `NO_APLICA` | `NO_APLICA` | `D04` | `CVF-001` | `NO_APLICA` |
| `A008` | Plataforma | FEDERAL | `28UV9W` | `VRAAF4D98PS000028` | `2023` | `N/A` | `3` | `9` | `SI` | `2025-07-13` | `2026-07-13` | `NO` | `NO_APLICA` | `NO_APLICA` | `D04` | `CVF-002` | `NO_APLICA` |
| `A009` | Remolque | FEDERAL | `29XY1Z` | `VRAAF1E12PN000029` | `2023` | `N/A` | `3` | `1` | `SI` | `2025-07-21` | `2026-07-21` | `NO` | `NO_APLICA` | `NO_APLICA` | `D05` | `CVF-001` | `NO_APLICA` |
| `A010` | Semirremolque | FEDERAL | `30AC2D` | `VRAAF2E29PS000030` | `2023` | `N/A` | `3` | `2` | `SI` | `2025-07-29` | `2026-07-29` | `NO` | `NO_APLICA` | `NO_APLICA` | `D05` | `CVF-002` | `NO_APLICA` |
| `A011` | Remolque | ESTATAL | `UA5101A` | `VRAAE1A1XPN000031` | `2023` | `N/A` | `4` | `1` | `SI` | `2025-08-06` | `2026-08-06` | `NO` | `NO_APLICA` | `NO_APLICA` | `D01` | `CVF-001` | `NO_APLICA` |
| `A012` | Semirremolque | ESTATAL | `UB5202B` | `VRAAE2A21PS000032` | `2023` | `N/A` | `4` | `2` | `SI` | `2025-08-14` | `2026-08-14` | `NO` | `NO_APLICA` | `NO_APLICA` | `D01` | `CVF-002` | `NO_APLICA` |
| `A013` | Caja seca | ESTATAL | `UC5303C` | `VRAAE3B35RN000033` | `2024` | `N/A` | `4` | `3` | `SI` | `2025-08-22` | `2026-08-22` | `NO` | `NO_APLICA` | `NO_APLICA` | `D02` | `CVF-001` | `NO_APLICA` |
| `A014` | Plataforma | ESTATAL | `UD5404D` | `VRAAE4B47RS000034` | `2024` | `N/A` | `4` | `4` | `SI` | `2025-08-30` | `2026-08-30` | `NO` | `NO_APLICA` | `NO_APLICA` | `D02` | `CVF-002` | `NO_APLICA` |
| `A015` | Remolque | ESTATAL | `UE5505E` | `VRAAE1C53RN000035` | `2024` | `N/A` | `4` | `5` | `SI` | `2025-09-07` | `2026-09-07` | `NO` | `NO_APLICA` | `NO_APLICA` | `D03` | `CVF-001` | `NO_APLICA` |
| `A016` | Semirremolque | ESTATAL | `UF5606F` | `VRAAE2C65RS000036` | `2024` | `N/A` | `4` | `6` | `SI` | `2025-09-15` | `2026-09-15` | `NO` | `NO_APLICA` | `NO_APLICA` | `D03` | `CVF-002` | `NO_APLICA` |
| `A017` | Caja seca | ESTATAL | `UG5707G` | `VRAAE3D72RN000037` | `2024` | `N/A` | `4` | `7` | `SI` | `2025-09-23` | `2026-09-23` | `NO` | `NO_APLICA` | `NO_APLICA` | `D04` | `CVF-001` | `NO_APLICA` |
| `A018` | Plataforma | ESTATAL | `UH5808H` | `VRAAE4D84RS000038` | `2024` | `N/A` | `4` | `8` | `SI` | `2025-10-01` | `2026-10-01` | `NO` | `NO_APLICA` | `NO_APLICA` | `D04` | `CVF-002` | `NO_APLICA` |
| `A019` | Remolque | ESTATAL | `UJ5909J` | `VRAAE1E90RN000039` | `2024` | `N/A` | `4` | `9` | `SI` | `2025-10-09` | `2026-10-09` | `NO` | `NO_APLICA` | `NO_APLICA` | `D05` | `CVF-001` | `NO_APLICA` |
| `A020` | Semirremolque | ESTATAL | `UK5010K` | `VRAAE2E06RS000040` | `2024` | `N/A` | `4` | `0` | `SI` | `2025-10-17` | `2026-10-17` | `NO` | `NO_APLICA` | `NO_APLICA` | `D05` | `CVF-002` | `NO_APLICA` |

## Resumen de control

| Concepto | Cantidad |
| --- | --- |
| Vehiculos con motor | `20` |
| Vehiculos de arrastre | `20` |
| Vehiculos federales | `20` |
| Vehiculos estatales | `20` |
| Duenos totales | `5` |
| Centros de verificacion | `2` |
