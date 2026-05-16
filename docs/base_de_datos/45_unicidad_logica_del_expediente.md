# Unicidad Logica del Expediente

## Objetivo

Cerrar documentalmente cuando puede existir mas de un documento activo por tipo y por vehiculo dentro de Vera.

Este contrato debe distinguir entre:

- unicidad del `document` logico;
- versionado de `document_files`;
- reemplazo de un documento vigente;
- y convivencia valida de documentos auxiliares.

## Decision canonica

En Vera, la unicidad del expediente se resuelve en dos capas:

1. `documents` resuelve la unicidad logica del soporte;
2. `document_files` resuelve la version fisica del PDF.

Regla central:

- puede existir un solo documento logico vigente por unidad y por tipo oficial nuclear;
- puede existir una sola version fisica vigente por documento logico;
- la historia se conserva hacia atras, pero no con varios vigentes para el mismo hueco semantico.

## Diferencia entre reemplazo y version

### Nueva version de `document_file`

Se crea una nueva version fisica del mismo `document` cuando:

- es el mismo documento juridico u operativo;
- conserva el mismo `document_type`;
- conserva el mismo `document_number` cuando exista;
- conserva la misma vigencia logica;
- solo cambia la calidad del PDF, el escaneo, el OCR o el archivo fisico.

Ejemplos:

- se sube un escaneo mas legible de la misma tarjeta;
- se corrige orientacion o resolucion del PDF;
- se reemplaza el archivo fisico sin cambiar el documento legal.

### Nuevo `document` logico

Se crea un nuevo `document` cuando cambia el soporte juridico u operativo, por ejemplo:

- cambia el `document_number`;
- cambia `issue_date`;
- cambia `valid_until`;
- cambia el `document_type`;
- cambia la constancia que respalda un nuevo ciclo o nuevo evento;
- cambia la parte relacionada relevante;
- o el soporte anterior deja de ser el vigente y es sustituido por uno nuevo.

## Regla de unicidad por tipo oficial

### `TARJETA_CIRCULACION`

Por `vehicle_id` puede existir:

- maximo un `document` con `document_type = TARJETA_CIRCULACION` y `document_status = ACTIVE`.

Reglas:

- una tarjeta nueva reemplaza logicamente a la anterior;
- la tarjeta anterior debe pasar a `ARCHIVED`, `EXPIRED` o `CANCELLED` segun el caso;
- una nueva carga del mismo plastico o del mismo PDF no crea documento nuevo, solo nueva version fisica.

### `CONSTANCIA_FISICO_MECANICA`

Por `vehicle_id` puede existir:

- maximo un `document` con `document_type = CONSTANCIA_FISICO_MECANICA` y `document_status = ACTIVE`.

Reglas:

- la constancia vigente debe corresponder al ciclo mas reciente que siga siendo util;
- una constancia nueva derivada de una nueva verificacion crea documento nuevo;
- la constancia anterior no debe quedar simultaneamente `ACTIVE`.

### `CONSTANCIA_EMISIONES`

Por `vehicle_id` puede existir:

- maximo un `document` con `document_type = CONSTANCIA_EMISIONES` y `document_status = ACTIVE`.

Reglas:

- la ausencia del tipo no implica error si `EMISSIONS = NOT_REQUIRED`;
- si `EMISSIONS = REQUIRED`, una nueva constancia reemplaza logicamente a la anterior;
- no deben quedar dos constancias de emisiones `ACTIVE` para la misma unidad.

## Regla de coherencia con `verification_type`

Para evitar ambiguedad documental:

- `TARJETA_CIRCULACION` debe llevar `verification_type = null`;
- `CONSTANCIA_FISICO_MECANICA` debe llevar `verification_type = PHYSICAL_MECHANICAL`;
- `CONSTANCIA_EMISIONES` debe llevar `verification_type = EMISSIONS`.

Los tipos auxiliares pueden llevar `verification_type = null`, salvo que en el futuro exista una necesidad puntual y documentada de asociarlos a un tipo de verificacion.

## Regla de documentos auxiliares

Los tipos auxiliares no siguen la misma rigidez que los oficiales nucleares.

### `PERMISO`

Puede existir mas de un `PERMISO` activo por `vehicle_id` cuando:

- cada uno representa un permiso distinto;
- y queda diferenciado por `document_number`, vigencia o descripcion operativa.

Si dos permisos activos no pueden distinguirse semanticamente, el caso debe tratarse como problema de calidad del dato.

### `CONTRATO_ARRENDAMIENTO`

Puede existir mas de un contrato en historial, pero no deberia existir mas de uno `ACTIVE` para la misma relacion operativa vigente.

Regla recomendada:

- maximo uno `ACTIVE` por `vehicle_id + related_party_id` cuando el contrato representa la relacion vigente con esa parte.

### `OTRO`

`OTRO` puede coexistir en multiples filas activas si cada fila representa un soporte distinto.

Sin embargo:

- no debe participar en reglas de completitud del expediente oficial;
- no debe usarse para cubrir huecos de tipos oficiales;
- y debe tratarse como categoria abierta de baja capacidad para reglas automaticas fuertes.

## Regla de estados documentales

### `ACTIVE`

Cuenta como documento vigente para lectura de expediente.

Es el unico estado que participa en la unicidad logica del soporte vigente.

### `EXPIRED`

Documento que deja de ser vigente por su propia fecha o por perdida natural de validez.

Permanece en historial, pero ya no cuenta como vigente.

### `ARCHIVED`

Documento historico retenido porque fue sustituido por otro soporte vigente antes de expirar o porque debe conservarse solo como antecedente.

### `CANCELLED`

Documento invalidado o anulado administrativamente.

No puede seguir contando como soporte vigente.

### `PENDING_REVIEW`

Documento cargado pero todavia no aceptado como vigente.

Regla:

- no cuenta para completitud;
- no debe desplazar automaticamente a un `ACTIVE` hasta ser aceptado.

## Regla de reemplazo

Cuando un documento nuevo reemplaza al vigente del mismo tipo oficial:

- primero se crea el nuevo `document`;
- despues el anterior deja de estar `ACTIVE`;
- el anterior pasa a `ARCHIVED`, `EXPIRED` o `CANCELLED` segun la causa;
- la historia no se borra ni se recicla.

La regla busca evitar:

- dos soportes oficiales activos para el mismo hueco;
- o perdida del antecedente documental.

## Regla de lectura del expediente oficial

Para determinar completitud por unidad se deben considerar solo:

- tipos oficiales aplicables;
- `document_status = ACTIVE`;
- y la version `document_files.is_current = true` de cada documento activo.

No deben contarse como expediente vigente:

- documentos `PENDING_REVIEW`;
- documentos `ARCHIVED`;
- documentos `CANCELLED`;
- archivos viejos de un documento cuya version actual ya es otra.

## Vista derivada recomendada

`vw_vehicle_official_document_status` debe poder resolver por unidad:

- `has_active_tarjeta_circulacion`
- `has_active_constancia_fisico_mecanica`
- `has_active_constancia_emisiones`
- `missing_official_document_count`
- `official_document_completeness_status`

## Reglas de integridad documental recomendadas

El modelo objetivo debe quedar listo para expresar reglas como:

- maximo un `ACTIVE` por `vehicle_id + document_type` para tipos oficiales nucleares;
- maximo un `is_current = true` por `document_id`;
- coherencia entre `document_type` y `verification_type`;
- no permitir que un `PENDING_REVIEW` sea tratado como vigente;
- trazabilidad de reemplazo sin borrar historia.

## Relacion con NORM-012

`NORM-012` define:

- que tipos son oficiales y cuales son auxiliares.

`NORM-013` cierra:

- cuantos pueden estar vigentes a la vez;
- como se reemplazan;
- y como se distingue documento nuevo de nueva version fisica.

## Conclusion

La unicidad logica del expediente en Vera queda asi:

- por tipo oficial nuclear y por vehiculo solo puede existir un documento logico vigente;
- por documento logico solo puede existir una version fisica vigente;
- los auxiliares pueden coexistir con reglas mas flexibles;
- pero no sustituyen ni duplican semanticamente el expediente oficial vigente.
