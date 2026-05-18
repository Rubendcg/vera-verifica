# Submodelo de Estado de Vida del Vehiculo

## Objetivo

Cerrar la capa administrativa del vehiculo en **Vera** para separarla del estado regulatorio, del estado documental y del acceso tecnico.

Esta politica define:

- cuales son los estados vigentes de vida del vehiculo;
- como transitan;
- que efectos operativos producen;
- y como debe modelarse esa historia sin seguir usando `is_active` como sustituto de todo.

## Separacion canonica de estados

En Vera no deben confundirse estos cuatro planos:

### 1. Estado de vida del vehiculo

Responde si la unidad esta administrativamente activa, suspendida, transferida o dada de baja.

### 2. Estado regulatorio

Responde si la unidad esta `VIGENTE`, `POR_VENCER`, `VENCIDO`, `SIN_REGISTRO`, `NO_APLICA` o equivalente para verificaciones.

### 3. Estado documental

Responde si un documento esta `ACTIVE`, `EXPIRED`, `CANCELLED`, `ARCHIVED` o `PENDING_REVIEW`.

### 4. Estado tecnico de fila

`vehicles.is_active` no debe representar el estado administrativo completo del vehiculo.

Su uso debe quedar limitado a bandera tecnica o de soft-delete del registro, no a la vida operativa del negocio.

## Estados canonicos de vida del vehiculo

Los estados vigentes de vida del vehiculo quedan cerrados asi:

- `ACTIVE`
- `SUSPENDED`
- `TRANSFERRED`
- `DEREGISTERED`

## Semantica por estado

### `ACTIVE`

- la unidad esta dentro del flujo operativo normal;
- puede participar en seguimiento, visor, reportes, obligaciones y notificaciones;
- sus relaciones vigentes y accesos pueden operar normalmente.

### `SUSPENDED`

- la unidad esta temporalmente fuera del flujo operativo normal;
- conserva historial, documentos y trazabilidad;
- no debe seguir el flujo normal de atencion, agenda y notificacion hasta que el intermediario la reactive o regularice.

### `TRANSFERRED`

- la unidad fue reportada o reconocida como cambio de dueno y queda pendiente de regularizacion por el intermediario;
- `TRANSFERRED` es un estado vigente, no solo un evento historico;
- el propietario anterior deja de verla en su visor desde que la unidad entra en `TRANSFERRED`;
- la unidad sigue visible para el intermediario;
- un nuevo dueno puede reportar que la unidad debe quedar bajo su propiedad;
- ese reporte no regulariza por si mismo la unidad;
- el intermediario debe ser notificado de ese nuevo reporte o intento de incorporacion;
- la unidad no debe seguir notificando al propietario anterior;
- la reasignacion del nuevo propietario, titularidad y accesos se formaliza hasta la regularizacion administrativa.

### `DEREGISTERED`

- la unidad se considera dada de baja;
- sale del flujo operativo y regulatorio normal;
- la unidad debe quedar visible solo para el intermediario;
- si alguien solicita restablecerla, el intermediario debe ser notificado;
- conserva historial, pero no debe generar nuevas obligaciones, notificaciones ni seguimiento ordinario.

## Transiciones canonicas

Las transiciones ordinarias permitidas quedan asi:

1. `ACTIVE -> SUSPENDED`
2. `SUSPENDED -> ACTIVE`
3. `ACTIVE -> TRANSFERRED`
4. `SUSPENDED -> TRANSFERRED`
5. `TRANSFERRED -> ACTIVE`
6. `ACTIVE -> DEREGISTERED`
7. `SUSPENDED -> DEREGISTERED`
8. `TRANSFERRED -> DEREGISTERED`

## Regla especial de `TRANSFERRED`

`TRANSFERRED -> ACTIVE` solo puede ocurrir cuando el intermediario ya regularizo:

- el cambio de propietario;
- los roles vigentes de la unidad;
- los accesos de visor;
- y, cuando aplique, la placa o los datos documentales asociados.

## Regla de no retorno ordinario

`DEREGISTERED` no debe tener transicion ordinaria de regreso.

Si negocio en el futuro requiere re-alta despues de una baja definitiva, debe abrirse como proceso excepcional documentado y no como camino normal del modelo.

## Submodelo propuesto

El modelo objetivo queda compuesto por dos piezas:

### 1. Estado vigente en `vehicles`

Se propone un campo canonico:

- `vehicles.lifecycle_status_current`

Ese campo debe usarse para filtros funcionales, visor, reportes y decisiones de flujo.

### 2. Historial append-only de vida

Se propone la tabla:

- `vehicle_lifecycle_events`

Campos minimos sugeridos:

- `id`
- `vehicle_id`
- `previous_status`
- `new_status`
- `effective_date`
- `reported_at`
- `regularized_at`
- `reported_by_user_id`
- `regularized_by_user_id`
- `support_document_id`
- `reason_code`
- `notes`

Reglas esperadas:

- append-only;
- un evento por cambio administrativo relevante;
- sin reescribir historia;
- con trazabilidad de quien reporta y quien regulariza.

## Efectos operativos del estado de vida

### Visor del propietario

- `ACTIVE`: visible segun `user_vehicle_access`;
- `SUSPENDED`: visible segun politica de acceso vigente;
- `TRANSFERRED`: deja de ser visible para el propietario anterior en cuanto entra al estado;
- `TRANSFERRED`: un nuevo dueno puede emitir su solicitud de incorporacion, pero la unidad no se regulariza hasta validacion del intermediario;
- `DEREGISTERED`: visible solo para el intermediario; no debe quedar en visor normal de propietarios.

### Reportes y notificaciones

- el flujo normal de reportes y notificaciones debe operar sobre unidades en `ACTIVE`;
- `SUSPENDED`, `TRANSFERRED` y `DEREGISTERED` deben tratarse como exclusiones del flujo normal, salvo reporte interno del intermediario.
- los intentos de incorporacion de un nuevo dueno sobre una unidad `TRANSFERRED` deben notificar al intermediario;
- las solicitudes de restablecimiento sobre una unidad `DEREGISTERED` deben notificar al intermediario.

### Cumplimiento regulatorio

- el historial regulatorio no se borra ni se reescribe por cambio de estado de vida;
- el estado de vida gobierna si la unidad sigue en flujo operativo normal;
- el estado regulatorio sigue siendo una capa separada.

## Relacion con NORM-005

El propietario puede reportar cambios, pero su reporte no debe convertirse automaticamente en estado de vida vigente.

La separacion correcta es:

- `NORM-004`: define el estado administrativo vigente ya regularizado;
- `NORM-005`: define la solicitud o reporte del propietario que alimenta ese proceso.

Entre esas solicitudes futuras deben quedar al menos:

- reclamo o incorporacion de nuevo dueno sobre unidad `TRANSFERRED`;
- solicitud de restablecimiento sobre unidad `DEREGISTERED`.

Ese flujo ya se cierra formalmente en:

- [36_flujo_canonico_solicitudes_del_propietario.md](./36_flujo_canonico_solicitudes_del_propietario.md)

## Criterio de cierre de NORM-004

`NORM-004` se considera cerrado cuando:

- exista este submodelo documental;
- `is_active` deje de describirse como sustituto del estado administrativo;
- quede claro que `TRANSFERRED` permanece vigente hasta regularizacion del intermediario;
- y el visor del propietario anterior deje de aplicar en estado `TRANSFERRED`.
