# Reglas Canonicas de `vehicle_party_roles`

## Objetivo

Cerrar documentalmente la integridad de `vehicle_party_roles` bajo el alcance actual de **Vera**.

Para este proyecto, el catalogo canonico de relaciones del vehiculo se reduce a:

- `OWNER`
- `CLIENT`
- `LEGAL_POSSESSOR`

Las demas categorias quedan fuera del alcance normal del proyecto actual y no deben usarse como contrato canonico mientras no exista una extension documental posterior.

## Principio base

`vehicle_party_roles` modela relaciones juridicas u operativas ya reconocidas por el intermediario.

No debe usarse para capturar cambios futuros aun no regularizados.

Los cambios propuestos por propietarios, usuarios autorizados o nuevos duenos deben vivir primero en:

- [36_flujo_canonico_solicitudes_del_propietario.md](./36_flujo_canonico_solicitudes_del_propietario.md)

Solo despues de regularizacion se convierten en filas vigentes de `vehicle_party_roles`.

## Catalogo canonico vigente

### `OWNER`

Representa al propietario reconocido de la unidad.

Puede corresponder a:

- una persona fisica;
- o una empresa.

Ese dato vive en `parties.party_type` y no cambia la semantica del rol.

### `CLIENT`

Representa al cliente operativo o de consulta bajo el cual el intermediario agrupa la unidad para seguimiento, reportes y servicio.

No siempre coincide con el propietario.

### `LEGAL_POSSESSOR`

Representa a quien tiene la posesion legal reconocida de la unidad cuando aplica.

Puede coexistir con un `OWNER` distinto y con un `CLIENT` distinto sobre la misma unidad.

La misma `party` puede ser `LEGAL_POSSESSOR` en varias unidades distintas sin generar conflicto, incluso si esas unidades tienen propietarios o clientes diferentes.

## Regla general de integridad temporal

Toda fila de `vehicle_party_roles` debe obedecer estas reglas:

1. `start_date` es obligatoria.
2. `end_date` puede ser nula solo para filas vigentes.
3. `is_current = true` implica fila abierta y vigente.
4. `is_current = false` implica fila historica cerrada.
5. no se debe reciclar una fila cambiando `vehicle_id`, `party_id` o `role_type`.
6. para cambiar una relacion vigente se debe cerrar la fila anterior y crear una fila nueva.

## Matriz canonica por rol

### `OWNER`

- cardinalidad vigente: maximo `1` por vehiculo;
- solapamiento temporal: no permitido;
- cero vigentes permitido: solo cuando la unidad ya fue reconocida en `TRANSFERRED` y la nueva propiedad sigue en regularizacion.

### `CLIENT`

- cardinalidad vigente: maximo `1` por vehiculo;
- solapamiento temporal: no permitido;
- cero vigentes permitido: si el cliente operativo aun no esta regularizado.

### `LEGAL_POSSESSOR`

- cardinalidad vigente: maximo `1` por vehiculo;
- solapamiento temporal: no permitido;
- cero vigentes permitido: si no aplica o si la posesion aun no esta regularizada.
- reutilizacion global de la misma `party`: permitida en cualquier numero de unidades.

## Reglas de coexistencia

No existe problema en que una misma `party` tenga varios roles distintos sobre la misma unidad al mismo tiempo.

Ejemplos validos:

- una misma `party` puede ser `OWNER` y `CLIENT`;
- una misma `party` puede ser `OWNER` y `LEGAL_POSSESSOR`;
- una misma `party` puede ser `CLIENT` y `LEGAL_POSSESSOR`.

Tambien es valido que:

- el `OWNER` sea una empresa;
- el `OWNER` sea una persona fisica;
- el `LEGAL_POSSESSOR` sea la misma `party` en varias unidades con distintos `OWNER` o `CLIENT`.

Lo que no debe pasar es:

- dos `OWNER` vigentes al mismo tiempo sobre la misma unidad;
- dos `CLIENT` vigentes al mismo tiempo sobre la misma unidad;
- dos `LEGAL_POSSESSOR` vigentes al mismo tiempo sobre la misma unidad;
- dos filas vigentes iguales de la misma `party` con el mismo `role_type` sobre la misma unidad.

## Reglas de fechas

- no deben existir periodos traslapados para la misma combinacion `vehicle_id + role_type`;
- el relevo se hace cerrando el rol anterior y abriendo el nuevo;
- no debe haber dos filas abiertas simultaneas del mismo rol para la misma unidad;
- la misma `party` si puede repetirse en varias unidades distintas con el mismo rol.

## Excepcion controlada en `TRANSFERRED`

Cuando el intermediario reconoce la unidad en `TRANSFERRED`:

- el propietario anterior deja de ser vigente para visor normal;
- el rol `OWNER` puede quedar temporalmente sin fila vigente;
- el nuevo dueno no entra a `vehicle_party_roles` hasta regularizacion;
- el `CLIENT` y el `LEGAL_POSSESSOR` deben revisarse segun el caso, pero no deben reescribirse sin validacion del intermediario;
- cualquier acceso derivado del propietario anterior debe revisarse o cerrarse fuera de este submodelo segun `user_vehicle_access`.

## Relacion con acceso

`vehicle_party_roles` no sustituye a `user_vehicle_access`.

Regla canonica:

- un rol juridico u operativo no concede por si mismo visor tecnico;
- el acceso se regula aparte;
- al cambiar roles vigentes, el intermediario debe revisar si el acceso tambien debe cambiar.

## Restricciones tecnicas recomendadas

Para endurecer el modelo despues en SQL:

### 1. Validaciones basicas

- `CHECK (start_date IS NOT NULL)`
- `CHECK (end_date IS NULL OR end_date >= start_date)`

### 2. Restriccion de unicidad vigente por rol

- `UNIQUE (vehicle_id, role_type) WHERE is_current = true`

Aplicada al catalogo canonico actual:

- `OWNER`
- `CLIENT`
- `LEGAL_POSSESSOR`

### 3. Exclusiones temporales recomendadas

- exclusion de periodos traslapados por `vehicle_id + role_type`

## Regla de operacion sobre historiales

Cuando cambia una relacion vigente:

1. se cierra la fila anterior con `end_date`;
2. se marca `is_current = false`;
3. se crea una fila nueva con nueva `party`, `role_type` y `start_date`;
4. la historia no se sobrescribe ni se recicla.

## Fuera de alcance actual

Las categorias siguientes no forman parte del contrato canonico del proyecto actual:

- `PERMISSION_HOLDER`
- `CARD_HOLDER`
- `MANAGER`
- `RELATED`

Si en el futuro se necesitan, deben volver a abrirse como extension documental controlada y no reactivarse por inercia.

## Relacion con NORM-007

Este documento cierra las reglas de integridad.

La resolucion canonica posterior de:

- propietario vigente;
- cliente vigente;
- poseedor legal vigente;
- contacto operativo vigente;

queda cerrada en:

- [38_vistas_canonicas_relacion_vigente.md](./38_vistas_canonicas_relacion_vigente.md)

## Criterio de cierre de NORM-006

`NORM-006` se considera cerrado cuando:

- exista esta matriz reducida de cardinalidad y vigencia;
- quede claro que el catalogo actual se limita a `OWNER`, `CLIENT` y `LEGAL_POSSESSOR`;
- se sepa como manejar la excepcion de `TRANSFERRED`;
- y ya no exista ambiguedad sobre solapamientos, duplicados o reutilizacion global del `LEGAL_POSSESSOR`.
