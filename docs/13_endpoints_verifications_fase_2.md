# Endpoints de Verifications - Fase 2

## Objetivo

Documentar los endpoints iniciales del modulo `verifications` de **Vera**, alineados con la fase 2 de base de datos.

## Alcance

Estos endpoints cubren:

- catalogos de verificacion;
- centros de verificacion;
- reglas de calendario;
- eventos de verificacion;
- obligaciones de verificacion;
- respuesta del propietario;
- programacion administrativa.

## Nota operativa

En esta etapa los endpoints todavia no aplican autenticacion ni autorizacion por rol.

La semantica ya esta preparada para separar accion del propietario y accion administrativa, pero el control de acceso se implementara en una fase posterior.

## Tabla de endpoints

| Metodo | Ruta | Finalidad |
| --- | --- | --- |
| `GET` | `/verifications` | Resumen del modulo y tablas cubiertas |
| `GET` | `/verifications/catalogs` | Catalogos de enums para frontend |
| `GET` | `/verifications/vehicles/:vehicleId/status` | Estado regulatorio consolidado por vehiculo |
| `GET` | `/verifications/centers` | Listado de centros con filtros |
| `POST` | `/verifications/centers` | Alta de centro de verificacion |
| `GET` | `/verifications/schedule-rules` | Listado de reglas de calendario |
| `POST` | `/verifications/schedule-rules` | Alta de regla de calendario |
| `GET` | `/verifications/events` | Listado de eventos de verificacion |
| `GET` | `/verifications/events/:id` | Detalle de un evento |
| `POST` | `/verifications/events` | Registro de un evento y cierre opcional de obligacion |
| `GET` | `/verifications/obligations` | Listado de obligaciones con filtros |
| `GET` | `/verifications/obligations/:id` | Detalle de una obligacion con historial |
| `POST` | `/verifications/obligations` | Alta manual de obligacion |
| `POST` | `/verifications/obligations/generate` | Generacion automatica o simulada de obligaciones desde reglas |
| `POST` | `/verifications/obligations/:id/respond` | Respuesta del propietario |
| `POST` | `/verifications/obligations/:id/schedule` | Programacion administrativa |

## Filtros disponibles

### `GET /verifications/centers`

- `centerType`
- `stateCode`
- `isActive`
- `search`

### `GET /verifications/schedule-rules`

- `regime`
- `verificationType`
- `scheduleMarker`
- `windowSequence`
- `isActive`

### `GET /verifications/events`

- `vehicleId`
- `centerId`
- `verificationType`
- `resultStatus`
- `fromDate`
- `toDate`

### `GET /verifications/obligations`

- `vehicleId`
- `status`
- `verificationType`
- `ownerResponse`
- `ownerUserId`
- `adminUserId`
- `dueFrom`
- `dueTo`
- `includeHistory`

## Decisiones de diseno

### Eventos vs obligaciones

`verification_events` representa verificaciones realmente realizadas.

`verification_obligations` representa lo pendiente, confirmado, programado, vencido o cerrado.

### Respuesta del propietario

El endpoint:

- `POST /verifications/obligations/:id/respond`

no marca cumplimiento real.

Solo actualiza:

- `owner_response`
- `owner_response_at`
- `status`
- historial en `verification_obligation_history`

### Generacion automatica de obligaciones

El endpoint:

- `POST /verifications/obligations/generate`

evalua los vehiculos filtrados por:

- `vehicleId`
- `regime`
- `verificationType`

y toma como referencia:

- `referenceDate`
- `includeUpcomingWindow`
- `previewOnly`

Comportamiento principal:

- detecta la regla activa por regimen, posicion y marcador;
- calcula la ventana regulatoria aplicable para la fecha de referencia;
- omite unidades inactivas o verificaciones no requeridas;
- omite casos ya cubiertos por un evento vigente;
- crea la obligacion si no existe una activa para la misma fecha de vencimiento;
- actualiza a `OVERDUE` una obligacion activa cuando ya vencio y todavia no estaba marcada asi;
- puede trabajar en modo simulacion cuando `previewOnly = true`.

### Cierre de obligacion

Si se registra un evento mediante:

- `POST /verifications/events`

y se envia `verificationObligationId`, el sistema:

- vincula el evento con la obligacion;
- marca la obligacion como `COMPLETED`;
- registra entrada de historial.

### Estado regulatorio por vehiculo

El endpoint:

- `GET /verifications/vehicles/:vehicleId/status`

consolida por vehiculo:

- estado de fisico-mecanica;
- estado de emisiones;
- ultimo evento util;
- obligacion activa;
- regla de calendario aplicable;
- estado general del vehiculo.

Estados contemplados:

- `VIGENTE`
- `POR_VENCER`
- `VENCIDO`
- `SIN_REGISTRO`
- `NO_APLICA`
- `INACTIVO`

Regla operativa actual:

- `POR_VENCER` aplica cuando faltan `30` dias o menos para la fecha de referencia;
- `VENCIDO` aplica cuando la fecha de referencia ya paso;
- `SIN_REGISTRO` aplica cuando no hay evento vigente ni obligacion activa para resolver el caso;
- `NO_APLICA` se usa para verificaciones no requeridas, por ejemplo emisiones en unidades de arrastre;
- `INACTIVO` se usa cuando la unidad no esta activa.

## Siguiente paso recomendado

La siguiente iteracion natural sobre estos endpoints es:

- autenticacion y autorizacion por rol;
- validacion formal de DTOs;
- pruebas de integracion para flujos de propietario y administrador.
