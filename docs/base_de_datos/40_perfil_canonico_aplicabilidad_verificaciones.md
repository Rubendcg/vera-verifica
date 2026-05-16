# Perfil Canonico de Aplicabilidad de Verificaciones

## Objetivo

Cerrar documentalmente `NORM-008` definiendo donde vive la aplicabilidad de:

- `PHYSICAL_MECHANICAL`
- `EMISSIONS`

para cada vehiculo en **Vera**.

## Decision canonica

La aplicabilidad **no** debe vivir como columnas fijas en `vehicles`.

La aplicabilidad debe vivir en una tabla propia:

- `vehicle_verification_profile`

con historial append-only en:

- `vehicle_verification_profile_history`

## Justificacion

Guardar esta decision en una tabla propia es mejor que usar columnas como:

- `requires_physical`
- `requires_emissions`

por estas razones:

1. la aplicabilidad es una decision de negocio por `vehiculo + verification_type`, no solo un atributo plano del vehiculo;
2. permite escalar si el proyecto agrega nuevos tipos de verificacion;
3. permite auditar cambios y excepciones;
4. evita mezclar en `vehicles` datos de identidad con reglas regulatorias;
5. permite que `NO_APLICA` salga de una fuente explicita y no de heuristicas dispersas.

## Principio funcional

`verification_schedule_rules` responde:

- cuando debe verificarse una unidad.

`vehicle_verification_profile` responde:

- si ese tipo de verificacion aplica a esa unidad.

Sin perfil de aplicabilidad, el calendario no debe inferirse como obligatorio por inercia.

## Tabla canonica: `vehicle_verification_profile`

### Grano

Una fila vigente por:

- `vehicle_id`
- `verification_type`

### Campos minimos esperados

- `id`
- `vehicle_id`
- `verification_type`
- `applicability_status`
- `reason_code`
- `source_kind`
- `reviewed_by_user_id`
- `support_document_id`
- `effective_date`
- `is_current`

### Valores canonicos de `verification_type`

- `PHYSICAL_MECHANICAL`
- `EMISSIONS`

### Valores canonicos de `applicability_status`

- `REQUIRED`
- `NOT_REQUIRED`

## Regla de cierre fuerte

Para toda unidad operativa, debe existir una fila vigente por cada tipo canonico de verificacion.

Eso significa que, como minimo, cada vehiculo operativo debe tener dos decisiones explicitadas:

1. si requiere `PHYSICAL_MECHANICAL`;
2. si requiere `EMISSIONS`.

La ausencia de perfil:

- no significa `NOT_REQUIRED`;
- no significa `NO_APLICA`;
- significa dato incompleto y debe tratarse como problema de calidad del dato.

## Historial canonico: `vehicle_verification_profile_history`

### Finalidad

Conservar trazabilidad de cambios de aplicabilidad sin reescribir historia.

### Campos minimos esperados

- `id`
- `profile_id`
- `previous_applicability_status`
- `new_applicability_status`
- `previous_reason_code`
- `new_reason_code`
- `changed_by_user_id`
- `support_document_id`
- `change_notes`
- `created_at`

## Reglas canonicas del proyecto actual

### 1. `PHYSICAL_MECHANICAL`

Regla base del proyecto:

- toda unidad operativa requiere `PHYSICAL_MECHANICAL`.

Por tanto, el valor esperado por defecto es:

- `REQUIRED`

Solo una excepcion documentada y aprobada por el intermediario podria llevarlo a:

- `NOT_REQUIRED`

### 2. `EMISSIONS`

Regla base del proyecto:

- aplica a unidades motorizadas;
- no aplica a unidades de arrastre o sin propulsion propia.

Por tanto:

- vehiculo motorizado -> `REQUIRED`
- unidad de arrastre o sin propulsion propia -> `NOT_REQUIRED`

## Regla sobre una, dos o ninguna

El modelo debe poder responder sin ambiguedad:

- requiere una;
- requiere dos;
- o no requiere ninguna por excepcion documentada.

En el proyecto actual, el caso normal esperado es:

- `PHYSICAL_MECHANICAL = REQUIRED`
- `EMISSIONS = REQUIRED` o `NOT_REQUIRED`

El caso "ninguna" se admite solo como excepcion formal documentada, no como resultado de ausencia de datos.

## `NO_APLICA` en vistas y endpoints

`NO_APLICA` no debe salir por:

- falta de evento;
- falta de regla;
- falta de historial.

`NO_APLICA` solo debe salir cuando:

- existe perfil vigente para ese `vehicle_id + verification_type`;
- y `applicability_status = NOT_REQUIRED`.

## Reglas operativas derivadas

### Generacion de obligaciones

Antes de buscar regla de calendario, el generador debe consultar:

- `vehicle_verification_profile`

Comportamiento:

- `REQUIRED` -> continua con regla y ventana;
- `NOT_REQUIRED` -> omite generacion y devuelve `NO_APLICA` o `SKIPPED` segun el consumidor.

### Estado regulatorio por vehiculo

La vista de estado consolidado debe interpretar:

- `REQUIRED` sin cumplimiento vigente -> `PENDING`, `SIN_REGISTRO`, `POR_VENCER` o `VENCIDO`, segun el caso;
- `NOT_REQUIRED` -> `NO_APLICA`.

### Reportes y notificaciones

Los reportes y lotes no deben intentar notificar:

- verificaciones con `applicability_status = NOT_REQUIRED`

## Fuente del perfil

La aplicabilidad puede sembrarse inicialmente desde reglas de clasificacion del negocio, por ejemplo:

- tipo de unidad;
- si la unidad es motorizada o de arrastre;
- criterio regulatorio confirmado por el intermediario.

Pero una vez sembrada, la fuente canonica deja de ser la heuristica y pasa a ser:

- la fila vigente en `vehicle_verification_profile`

## `source_kind` y `reason_code`

Para no perder explicacion de origen, la fila vigente debe conservar al menos:

- `source_kind`
- `reason_code`

Valores documentales sugeridos para `source_kind`:

- `DEFAULT_RULE`
- `MANUAL_REVIEW`
- `REGULATORY_EXCEPTION`

Valores documentales sugeridos para `reason_code`:

- `ALL_OPERATIONAL_UNITS_REQUIRE_PHYSICAL`
- `MOTORIZED_UNIT_REQUIRES_EMISSIONS`
- `TRAILING_UNIT_NO_EMISSIONS`
- `DOCUMENTED_EXCEPTION`

## Restricciones recomendadas

### 1. Unicidad vigente

- `UNIQUE (vehicle_id, verification_type) WHERE is_current = true`

### 2. Dominio cerrado

- `verification_type` solo admite tipos canonicos definidos;
- `applicability_status` solo admite `REQUIRED` o `NOT_REQUIRED`.

### 3. Integridad temporal

Si se maneja historia temporal adicional:

- no debe haber dos filas vigentes del mismo tipo para la misma unidad.

## Vista derivada recomendada

Para consumo operativo, se recomienda una vista:

- `vw_vehicle_verification_applicability`

### Grano

Una fila por:

- `vehicle_id`
- `verification_type`

### Columnas minimas esperadas

- `vehicle_id`
- `verification_type`
- `applicability_status`
- `reason_code`
- `source_kind`
- `is_required`

## Regla de no inferencia silenciosa

Si un vehiculo no tiene perfil vigente:

- no debe asumirse que `EMISSIONS` no aplica;
- no debe asumirse que `PHYSICAL_MECHANICAL` si aplica;
- debe levantarse inconsistencia documental o de calidad del dato.

## Relacion con otros cierres

Este documento se apoya en:

- [34_politica_identidad_maestra_del_vehiculo.md](./34_politica_identidad_maestra_del_vehiculo.md)
- [35_submodelo_estado_de_vida_del_vehiculo.md](./35_submodelo_estado_de_vida_del_vehiculo.md)
- [38_vistas_canonicas_relacion_vigente.md](./38_vistas_canonicas_relacion_vigente.md)

## Criterio de cierre de NORM-008

`NORM-008` se considera cerrado cuando:

- quede claro que la aplicabilidad vive en tabla propia y no en `vehicles`;
- se sepa como responder si una unidad requiere una, dos o ninguna verificacion;
- `NO_APLICA` deje de depender de heuristicas implicitas;
- y los consumidores administrativos sepan que primero se resuelve aplicabilidad y despues calendario.
