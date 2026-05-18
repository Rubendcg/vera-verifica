# Referencia VIN NIV y Anos Modelo

## Objetivo

Documentar la estructura oficial del VIN o NIV para **Vera**, corregir la longitud base del dato y dejar la tabla de codigos de ano-modelo que servira para validar series en el futuro.

## Correccion base

Para vehiculos modernos regulados por NHTSA y 49 CFR Part 565, el VIN estandar no es de `16` caracteres. Es de `17` caracteres.

Esto aplica a los VIN modernos usados para identificacion vehicular y para la posicion `10`, que codifica el ano-modelo.

## Estructura general del VIN

| Posiciones | Seccion | Uso general |
| --- | --- | --- |
| `1-3` | WMI | Identificador mundial del fabricante |
| `4-8` | VDS | Atributos descriptivos del vehiculo |
| `9` | Check digit | Digito verificador |
| `10` | VIS | Ano-modelo |
| `11` | VIS | Planta de manufactura |
| `12-17` | VIS | Secuencia de produccion |

## Lo mas importante para Vera

- toda unidad operativa debe tener `serie_niv`;
- la `serie_niv` debe tratarse como identificador unico y estable del vehiculo;
- la placa, el motor, el tipo y el dueno pueden cambiar;
- la serie no debe reutilizarse;
- la posicion `10` del VIN representa el ano-modelo;
- la posicion `9` es el digito verificador;
- la posicion `11` identifica la planta donde el fabricante afijo el VIN.

La regla documental cerrada para identidad del vehiculo se fija en:

- [34_politica_identidad_maestra_del_vehiculo.md](./34_politica_identidad_maestra_del_vehiculo.md)

## Tabla de ano-modelo

La referencia oficial publicada cubre de `1980` a `2039`. El patron es ciclico, pero la interpretacion correcta depende del contexto regulatorio del VIN y, para ciertos vehiculos, tambien de la naturaleza alfabetica o numerica de la posicion `7`.

| Ano | Codigo |
| --- | --- |
| `1980` | `A` |
| `1981` | `B` |
| `1982` | `C` |
| `1983` | `D` |
| `1984` | `E` |
| `1985` | `F` |
| `1986` | `G` |
| `1987` | `H` |
| `1988` | `J` |
| `1989` | `K` |
| `1990` | `L` |
| `1991` | `M` |
| `1992` | `N` |
| `1993` | `P` |
| `1994` | `R` |
| `1995` | `S` |
| `1996` | `T` |
| `1997` | `V` |
| `1998` | `W` |
| `1999` | `X` |
| `2000` | `Y` |
| `2001` | `1` |
| `2002` | `2` |
| `2003` | `3` |
| `2004` | `4` |
| `2005` | `5` |
| `2006` | `6` |
| `2007` | `7` |
| `2008` | `8` |
| `2009` | `9` |
| `2010` | `A` |
| `2011` | `B` |
| `2012` | `C` |
| `2013` | `D` |
| `2014` | `E` |
| `2015` | `F` |
| `2016` | `G` |
| `2017` | `H` |
| `2018` | `J` |
| `2019` | `K` |
| `2020` | `L` |
| `2021` | `M` |
| `2022` | `N` |
| `2023` | `P` |
| `2024` | `R` |
| `2025` | `S` |
| `2026` | `T` |
| `2027` | `V` |
| `2028` | `W` |
| `2029` | `X` |
| `2030` | `Y` |
| `2031` | `1` |
| `2032` | `2` |
| `2033` | `3` |
| `2034` | `4` |
| `2035` | `5` |
| `2036` | `6` |
| `2037` | `7` |
| `2038` | `8` |
| `2039` | `9` |

## Nota de interpretacion

En la tabla oficial vigente de 49 CFR Part 565, para passenger cars, multipurpose passenger vehicles y trucks de `10,000 lb GVWR` o menos:

- si la posicion `7` es numerica, el codigo de ano en posicion `10` se interpreta en el rango `1980-2009`;
- si la posicion `7` es alfabetica, el codigo de ano en posicion `10` se interpreta en el rango `2010-2039`.

## Criterio aplicado en Vera

Para el dataset de prueba de Vera se generaron series VIN sinteticas de `17` caracteres con estas reglas:

- prefijo sintetico de fabricante en posiciones `1-3`;
- clase de unidad y regimen en posiciones `4-5`;
- familia de unidad en posicion `6`;
- codigo alfabetico interno en posicion `7`;
- `schedule marker` en posicion `8`;
- digito verificador correcto en posicion `9`;
- ano-modelo en posicion `10`;
- planta sintetica en posicion `11`;
- secuencia de produccion en posiciones `12-17`.

Los VIN generados cubren anos-modelo de `2020` a `2024` y su detalle por vehiculo se encuentra en:

- [15_datos_prueba_vehiculos_revision.md](./15_datos_prueba_vehiculos_revision.md)

## Fuentes oficiales

- NHTSA, VIN Decoder: https://www.nhtsa.gov/vin-decoder
- NHTSA, Vehicle Identification Number - VIN: https://www.nhtsa.gov/document/vehicle-identification-number-vin
- GovInfo, 49 CFR 2024 edition, Part 565: https://www.govinfo.gov/content/pkg/CFR-2024-title49-vol6/pdf/CFR-2024-title49-vol6-part565.pdf
- GovInfo, 49 CFR 2024 edition, Section 565.25: https://www.govinfo.gov/content/pkg/CFR-2024-title49-vol6/pdf/CFR-2024-title49-vol6-sec565-25.pdf
