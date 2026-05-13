# Generacion Automatica de Obligaciones - Fase 2

## Objetivo

Documentar la logica con la que **Vera** puede generar obligaciones de verificacion a partir de:

- el vehiculo;
- su regimen y marcador efectivo;
- la regla activa de calendario;
- el ultimo evento vigente;
- la fecha de referencia de la corrida.

## Endpoint

- `POST /verifications/obligations/generate`

## Parametros de entrada

| Campo | Tipo | Uso |
| --- | --- | --- |
| `referenceDate` | `YYYY-MM-DD` | Fecha usada para resolver la ventana regulatoria. Si no se envia, usa la fecha local actual. |
| `vehicleId` | `string` | Limita la corrida a un solo vehiculo. |
| `regime` | `FEDERAL` \| `ESTATAL` | Filtra los vehiculos por regimen. |
| `verificationType` | `PHYSICAL_MECHANICAL` \| `EMISSIONS` | Limita la generacion a un solo tipo de verificacion. |
| `adminUserId` | `string` | Usuario administrativo que queda ligado a la corrida cuando hay escritura. |
| `previewOnly` | `boolean` | Si es `true`, no escribe nada y solo devuelve el resultado calculado. |
| `includeUpcomingWindow` | `boolean` | Si es `true`, permite generar tambien obligaciones para ventanas que aun no abren. |

## Reglas operativas

### 1. Seleccion del tipo de verificacion

- toda unidad activa requiere `PHYSICAL_MECHANICAL`;
- `EMISSIONS` solo aplica si la unidad no es de arrastre.

### 2. Seleccion de la regla

La regla se busca por:

- `regime`
- `schedulePosition`
- `scheduleMarkerEffective`
- `verificationType`
- `isActive = true`

## 3. Resolucion de ventana

Con la regla encontrada, Vera calcula:

- `windowStartDate`
- `windowEndDate`
- `dueDate`
- `windowStatus`

Valores posibles de `windowStatus`:

- `BEFORE_WINDOW`
- `IN_WINDOW`
- `AFTER_WINDOW`

## 4. Casos que no generan obligacion

La corrida devuelve `SKIPPED` cuando:

- la unidad esta inactiva;
- la verificacion no aplica;
- no existe regla activa;
- la ventana aun no abre y `includeUpcomingWindow = false`;
- ya existe un evento vigente que cubre la fecha de vencimiento;
- ya existe una obligacion activa para la misma fecha y no necesita cambio.

## 5. Casos que si generan o actualizan

### `CREATED`

Se crea una nueva obligacion cuando:

- existe regla activa;
- la verificacion aplica;
- no hay cumplimiento vigente suficiente;
- no existe una obligacion abierta para la misma fecha de vencimiento.

Estado inicial:

- `PENDING` si aun no vence;
- `OVERDUE` si la fecha de referencia ya rebaso el vencimiento.

### `UPDATED`

Se actualiza una obligacion existente cuando:

- ya existe una obligacion abierta para la misma ventana;
- su vencimiento ya paso;
- aun no estaba marcada como `OVERDUE`.

En ese caso se agrega historial con `SYSTEM_UPDATED`.

## Respuesta

La respuesta incluye:

- fecha de referencia;
- modo simulacion o escritura;
- filtros aplicados;
- totales de `created`, `updated` y `skipped`;
- detalle por vehiculo y tipo de verificacion.

## Uso recomendado

### Simulacion previa

Usar primero:

- `previewOnly = true`

para revisar:

- que reglas faltan;
- que unidades ya estan cubiertas;
- que obligaciones nuevas se van a crear.

### Corrida real

Despues ejecutar:

- `previewOnly = false`

para materializar la corrida y registrar historial.

## Pendientes relacionados

Este flujo deja lista la automatizacion base, pero aun faltan:

- carga inicial de reglas reales;
- autenticacion y autorizacion por rol;
- validacion formal de DTOs;
- pruebas de integracion del generador.
