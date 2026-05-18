# Matriz de Visibilidad Documental del Propietario

## Objetivo

Cerrar documentalmente que documentos puede ver y descargar un propietario dentro de Vera.

Esta matriz debe responder:

- que condiciones base debe cumplir el propietario;
- que condiciones base debe cumplir la unidad;
- que tipos documentales son elegibles para visor;
- que estados documentales permiten visibilidad;
- y como debe interpretarse `is_visible_to_owner`.

## Decision canonica

La visibilidad documental del propietario no depende de una sola bandera.

En Vera debe resolverse por capas:

1. acceso tecnico a la unidad;
2. estado administrativo del propietario;
3. estado de vida del vehiculo;
4. elegibilidad del tipo documental;
5. estado documental;
6. bandera explicita `is_visible_to_owner`.

Regla central:

- `is_visible_to_owner = true` no basta por si solo;
- solo habilita visibilidad cuando todas las demas condiciones canonicas tambien se cumplen.

## Condiciones base de acceso

Para que un usuario no administrador vea un documento deben cumplirse todas estas condiciones:

- existe `user_vehicle_access` activo sobre la unidad;
- el propietario esta `owner_admin_status_current = ACTIVE`;
- la unidad no esta excluida del visor por su estado de vida;
- el documento es elegible por tipo y por estado;
- `documents.is_visible_to_owner = true`;
- existe un PDF vigente `document_files.is_current = true`.

## Regla por estado administrativo del propietario

### Propietario `ACTIVE`

Puede ver documentos segun el resto de la matriz.

### Propietario `SUSPENDED`

No debe operar visor normal de documentos.

Regla:

- el expediente sigue existiendo;
- pero el flujo ordinario de consulta y descarga para propietario queda bloqueado.

### Propietario `DEREGISTERED`

No debe operar visor normal de documentos.

Regla:

- sus documentos historicos siguen visibles para el intermediario;
- no deben seguir expuestos como visor normal del propietario.

## Regla por estado de vida del vehiculo

### Vehiculo `ACTIVE`

El propietario puede ver documentos segun la matriz completa.

### Vehiculo `SUSPENDED`

Se permite visibilidad documental controlada, porque la unidad sigue perteneciendo al propietario y puede requerir consulta de respaldo.

Regla:

- se mantiene el visor documental si el propietario sigue `ACTIVE`;
- no implica que la unidad siga en flujo normal de notificaciones o cumplimiento.

### Vehiculo `TRANSFERRED`

No debe haber visibilidad para el propietario anterior.

Reglas:

- desde que la unidad entra a `TRANSFERRED`, deja de aplicar el visor documental del propietario anterior;
- un nuevo dueno no adquiere visibilidad hasta que exista regularizacion y acceso tecnico valido.

### Vehiculo `DEREGISTERED`

No debe haber visor documental normal para propietario.

Regla:

- el expediente historico queda reservado para el intermediario, salvo futura politica excepcional que se documente aparte.

## Regla por tipo documental

### Tipos oficiales nucleares

Tipos:

- `TARJETA_CIRCULACION`
- `CONSTANCIA_FISICO_MECANICA`
- `CONSTANCIA_EMISIONES`

Estos tipos son elegibles para visibilidad al propietario.

### Tipos auxiliares

Tipos:

- `PERMISO`
- `CONTRATO_ARRENDAMIENTO`
- `OTRO`

Regla canonica:

- por defecto no forman parte del visor ordinario del propietario;
- solo pueden mostrarse si existe decision administrativa expresa y `is_visible_to_owner = true`;
- aun con esa bandera, deben tratarse como excepcion controlada, no como regla base del visor.

## Regla por estado documental

### `ACTIVE`

Elegible para visibilidad al propietario, sujeto al resto de la matriz.

### `PENDING_REVIEW`

No elegible para visibilidad al propietario.

Motivo:

- aun no debe tratarse como soporte aceptado ni vigente.

### `CANCELLED`

No elegible para visibilidad al propietario.

Motivo:

- es un soporte invalidado.

### `ARCHIVED`

No elegible para visor ordinario del propietario.

Motivo:

- es antecedente historico, no soporte vigente del flujo normal.

### `EXPIRED`

No elegible para visor ordinario del propietario por defecto.

Motivo:

- sigue existiendo en historial;
- pero ya no debe presentarse como respaldo vigente.

Si en el futuro se abre un visor historico para propietario, debera documentarse aparte. No queda abierto por esta politica.

## Matriz canonica resumida

### Visibilidad ordinaria permitida

Se permite cuando:

- propietario `ACTIVE`;
- vehiculo `ACTIVE` o `SUSPENDED`;
- `document_type` oficial nuclear;
- `document_status = ACTIVE`;
- `is_visible_to_owner = true`;
- existe archivo actual.

### Visibilidad ordinaria denegada

Se deniega cuando ocurra cualquiera de estos casos:

- propietario `SUSPENDED` o `DEREGISTERED`;
- vehiculo `TRANSFERRED` o `DEREGISTERED`;
- `document_status` distinto de `ACTIVE`;
- tipo auxiliar sin excepcion expresa;
- `is_visible_to_owner = false`;
- no existe `document_file` vigente.

## Regla de `is_visible_to_owner`

La bandera se interpreta asi:

- `false`: oculto siempre para propietario;
- `true`: potencialmente visible, pero solo si la matriz base tambien lo permite.

Consecuencia:

- `is_visible_to_owner` no debe usarse para exponer `PENDING_REVIEW`;
- `is_visible_to_owner` no debe usarse para exponer `CANCELLED`;
- `is_visible_to_owner` no debe usarse para devolver al propietario una unidad `TRANSFERRED`;
- `is_visible_to_owner` no debe reactivar por si solo documentos auxiliares como visor normal.

## Regla de lectura de `vw_owner_vehicle_documents`

La vista canonica para propietario debe devolver solo:

- documentos de vehiculos visibles para ese propietario;
- `document_type` elegibles por la matriz;
- `document_status = ACTIVE`;
- `is_visible_to_owner = true`;
- y la version `document_files.is_current = true`.

No debe incluir por defecto:

- historiales `ARCHIVED`;
- soportes `EXPIRED`;
- cargas `PENDING_REVIEW`;
- soportes `CANCELLED`;
- auxiliares no habilitados de forma excepcional.

## Relacion con implementacion actual

La implementacion base actual de fase 3 ya resuelve el minimo de:

- `user_vehicle_access`
- `is_visible_to_owner`

Pero la politica canonica completa agrega ademas:

- estado administrativo del propietario;
- estado de vida del vehiculo;
- elegibilidad por tipo documental;
- elegibilidad por estado documental.

Esto queda como endurecimiento funcional pendiente para futuras iteraciones sobre el modulo `documents`.

## Conclusion

La visibilidad documental del propietario en Vera queda asi:

- solo aplica sobre su visor habilitado;
- solo para documentos vigentes y elegibles;
- solo para tipos oficiales nucleares por defecto;
- y `is_visible_to_owner` actua como autorizacion final, no como atajo para saltarse la matriz.
