# Politica de Tipos Documentales Oficiales

## Objetivo

Cerrar documentalmente cuales son los tipos documentales oficiales del expediente vehicular en Vera y como se distinguen de los documentos auxiliares.

Este contrato debe responder:

- cuales documentos forman el expediente base del negocio;
- cuales son auxiliares;
- cuando un tipo oficial se considera obligatorio;
- y que tipos auxiliares no pueden sustituir a los oficiales.

## Decision canonica

El expediente documental oficial de Vera se compone de tres tipos nucleares:

- `TARJETA_CIRCULACION`
- `CONSTANCIA_FISICO_MECANICA`
- `CONSTANCIA_EMISIONES`

Estos tres representan el expediente base del cumplimiento vehicular.

El modelo puede seguir soportando tipos auxiliares, pero esos tipos no redefinen el expediente oficial ni sustituyen a los tres nucleares.

## Clasificacion canonica de tipos

### 1. Tipos oficiales nucleares

Catalogo canonico:

- `TARJETA_CIRCULACION`
- `CONSTANCIA_FISICO_MECANICA`
- `CONSTANCIA_EMISIONES`

Semantica:

- `TARJETA_CIRCULACION` respalda la identificacion documental vigente de la unidad;
- `CONSTANCIA_FISICO_MECANICA` respalda la evidencia documental de la verificacion fisico-mecanica;
- `CONSTANCIA_EMISIONES` respalda la evidencia documental de la verificacion de emisiones.

### 2. Tipos auxiliares admitidos

Catalogo actual admitido por el enum:

- `PERMISO`
- `CONTRATO_ARRENDAMIENTO`
- `OTRO`

Semantica:

- sirven como soporte complementario;
- pueden respaldar aclaraciones, regularizaciones o relaciones juridicas;
- no convierten por si mismos a una unidad en documentalmente completa;
- no sustituyen un tipo oficial faltante.

## Regla de obligatoriedad documental

La obligatoriedad no debe leerse como:

- "siempre deben existir los tres PDFs para cualquier fila del padron"

porque la exigencia documental efectiva depende de:

- el estado de vida del vehiculo;
- la aplicabilidad vigente de cada verificacion.

La regla canonica queda asi:

### `TARJETA_CIRCULACION`

Debe considerarse obligatoria para:

- toda unidad `ACTIVE` que siga en flujo normal dentro de Vera.

No debe sustituirse por:

- `PERMISO`
- `OTRO`

salvo como soporte complementario o transitorio expresamente documentado.

### `CONSTANCIA_FISICO_MECANICA`

Debe considerarse obligatoria cuando:

- la unidad este `ACTIVE`; y
- `vehicle_verification_profile` marque `PHYSICAL_MECHANICAL = REQUIRED`.

### `CONSTANCIA_EMISIONES`

Debe considerarse obligatoria cuando:

- la unidad este `ACTIVE`; y
- `vehicle_verification_profile` marque `EMISSIONS = REQUIRED`.

Si el perfil vigente marca `EMISSIONS = NOT_REQUIRED`, la ausencia de `CONSTANCIA_EMISIONES` no debe tratarse como expediente incompleto.

## Regla por estado de vida del vehiculo

### Unidad `ACTIVE`

Se evalua expediente oficial completo segun:

- tarjeta vigente;
- constancia fisico-mecanica vigente si aplica;
- constancia de emisiones vigente si aplica.

### Unidad `SUSPENDED`

El expediente oficial sigue existiendo, pero la exigencia operativa de completitud puede quedar congelada hasta reactivacion.

### Unidad `TRANSFERRED`

El expediente historico se conserva.

La nueva regularizacion documental no debe asumirse completa hasta que el intermediario cierre el cambio y confirme la nueva situacion operativa de la unidad.

### Unidad `DEREGISTERED`

El expediente historico se conserva.

No debe tratarse como backlog documental activo del flujo normal.

## Regla de sustitucion

Ningun tipo auxiliar puede reemplazar semanticamente a un tipo oficial.

Ejemplos:

- `PERMISO` no reemplaza `TARJETA_CIRCULACION`;
- `CONTRATO_ARRENDAMIENTO` no reemplaza `CONSTANCIA_FISICO_MECANICA`;
- `OTRO` no reemplaza `CONSTANCIA_EMISIONES`.

Los auxiliares solo pueden:

- complementar;
- explicar;
- respaldar una excepcion o transicion;
- o sostener un proceso administrativo paralelo.

## Regla de relacion con `verification_events`

Los tipos oficiales de constancia son la evidencia documental natural de los eventos de verificacion, pero el tipo documental y el evento no deben confundirse.

Reglas:

- un `verification_event` puede estar respaldado por un `document` del tipo oficial correspondiente;
- la existencia del documento no sustituye el registro factual del evento;
- la existencia del evento no sustituye por si sola la carga documental del expediente cuando esa evidencia debe conservarse.

## Regla de visibilidad

La nuclearidad del tipo documental no implica automaticamente visibilidad al propietario.

La visibilidad se cierra aparte en:

- `NORM-014`

Por lo tanto:

- un tipo oficial puede ser interno en una etapa;
- o visible al propietario segun la politica documental que se cierre despues.

## Regla de uso para desarrollo futuro

Para fases siguientes, el modelo debe poder responder por unidad:

- que tipos oficiales le aplican;
- cuales ya tienen documento vigente;
- cuales siguen faltando;
- y cuales documentos auxiliares existen solo como complemento.

Vista derivada recomendada:

- `vw_vehicle_official_document_status`

Su cierre detallado de unicidad y vigencia queda formalizado en:

- [45_unicidad_logica_del_expediente.md](./45_unicidad_logica_del_expediente.md)

## Conclusion

La politica canonica de Vera queda asi:

- el expediente oficial tiene tres tipos nucleares;
- la obligatoriedad real depende de vida del vehiculo y aplicabilidad;
- los tipos auxiliares siguen permitidos;
- pero nunca sustituyen a `TARJETA_CIRCULACION`, `CONSTANCIA_FISICO_MECANICA` o `CONSTANCIA_EMISIONES`.
