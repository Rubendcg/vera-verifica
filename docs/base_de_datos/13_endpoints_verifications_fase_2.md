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

En esta etapa los endpoints ya aplican autenticacion con `Bearer token`, validacion formal de DTOs y autorizacion basica por rol/acceso vehicular.

Reglas activas:

- administracion entra con usuarios `isAdmin = true`;
- propietarios y usuarios autorizados solo pueden consultar vehiculos asignados en `user_vehicle_access`;
- las operaciones administrativas de alta, generacion y programacion quedan restringidas a admin.

Nota de transicion:

- esta lectura refleja la implementacion actual;
- el destino canonico de permisos internos del intermediario se cierra en [48_modelo_canonico_permisos_internos_del_intermediario.md](./48_modelo_canonico_permisos_internos_del_intermediario.md), donde las operaciones de `verifications` migran a `PLATFORM_ADMIN` y `OPERATIONS_OPERATOR`.

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

## Reglas de acceso

- `GET /verifications`, `GET /verifications/catalogs`, `GET /verifications/centers` y `GET /verifications/schedule-rules`: cualquier usuario autenticado;
- `GET /verifications/vehicles/:vehicleId/status`, `GET /verifications/events`, `GET /verifications/events/:id`, `GET /verifications/obligations`, `GET /verifications/obligations/:id` y `POST /verifications/obligations/:id/respond`: admin o usuario con acceso activo al vehiculo;
- `POST /verifications/centers`, `POST /verifications/schedule-rules`, `POST /verifications/events`, `POST /verifications/obligations`, `POST /verifications/obligations/generate` y `POST /verifications/obligations/:id/schedule`: solo admin.

## Encabezado requerido

Los endpoints protegidos esperan:

- `Authorization: Bearer <token>`

Token de entrada:

- `POST /auth/login`

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

### Centros y contacto operativo

El contrato canonico del centro queda cerrado en:

- [42_contrato_operativo_verification_centers.md](./42_contrato_operativo_verification_centers.md)

Regla base:

- `verification_centers` identifica la sede;
- el contacto operativo se resuelve aparte;
- un centro puede tener varios contactos historicos;
- pero solo uno debe resolver la via primaria activa de operacion.

El contrato del reporte o solicitud hacia centro se cierra aparte en:

- [43_contrato_reporte_hacia_agente_de_centro.md](./43_contrato_reporte_hacia_agente_de_centro.md)

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

Reglas canonicas:

- el evento cierra como maximo una obligacion;
- la obligacion puede recibir como maximo un evento de cierre;
- `COMPLETED` significa cierre operativo atendido, no necesariamente cumplimiento vigente aprobado;
- la lectura de vigencia real debe seguir saliendo de `verification_events`, `resultStatus` y `validUntil`;
- si existe evento sin obligacion previa, el endpoint puede registrar el evento sin inventar una obligacion retroactiva.

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
- `NO_APLICA` se usa solo cuando el perfil vigente de aplicabilidad marca esa verificacion como `NOT_REQUIRED`, por ejemplo emisiones en unidades de arrastre;
- `INACTIVO` se usa cuando la unidad no esta activa.

## Siguiente paso recomendado

La siguiente iteracion natural sobre estos endpoints es:

- extender las reglas de acceso al resto de los modulos;
- mantener cobertura de regresion sobre el flujo principal de obligaciones;
- tomar estos endpoints como base cerrada de fase 2 y mover el foco a fase 3.
