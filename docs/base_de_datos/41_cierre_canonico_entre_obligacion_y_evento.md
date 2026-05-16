# Cierre Canonico entre Obligacion y Evento

## Objetivo

Cerrar documentalmente la relacion entre:

- `verification_obligations`
- `verification_events`

para que Vera no mezcle:

- seguimiento operativo de una verificacion pendiente;
- ocurrencia real de una verificacion;
- cumplimiento regulatorio efectivo.

## Decision canonica

En Vera:

- `verification_obligations` representa el caso operativo que debe atenderse;
- `verification_events` representa el hecho real ya registrado;
- ambas capas se conectan, pero no se sustituyen entre si.

La obligacion responde:

- que ventana o vencimiento debe atenderse;
- si el propietario confirmo, rechazo, pidio ayuda o ya existe programacion;
- si el caso ya fue cerrado operativamente.

El evento responde:

- que verificacion se realizo;
- en que fecha;
- en que centro;
- con que resultado;
- hasta cuando cubre `valid_until` cuando el resultado es util para cumplimiento.

## Cardinalidad canonica

La cardinalidad objetivo queda asi:

- una `verification_obligation` puede ligar `0..1` `verification_event`;
- un `verification_event` puede cerrar `0..1` `verification_obligation`.

Reglas asociadas:

- un mismo evento no debe cerrar varias obligaciones;
- una misma obligacion no debe ligar varios eventos;
- el cierre masivo de varias obligaciones con un solo evento queda fuera del modelo canonico;
- la unicidad actual sobre `verification_obligations.verification_event_id` ya apunta a esta regla.

## Regla de cierre operativo

### Estados abiertos

Mientras no exista cierre terminal, la obligacion puede vivir en estados como:

- `PENDING`
- `OWNER_CONFIRMED`
- `OWNER_DECLINED`
- `REQUESTED_ASSISTANCE`
- `SCHEDULED`
- `OVERDUE`

### Estado `COMPLETED`

`COMPLETED` significa:

- la obligacion ya fue atendida operativamente;
- existe un `verification_event` ligado;
- el caso ya no debe seguir tratandose como pendiente abierto.

Reglas canonicas:

- `COMPLETED` exige `verification_event_id` no nulo;
- `COMPLETED` exige `closed_at` no nulo;
- el evento ligado debe corresponder al mismo `vehicle_id`;
- el evento ligado debe corresponder al mismo `verification_type`.

### Estado `CANCELLED`

`CANCELLED` significa:

- la obligacion se cierra administrativamente;
- no se usa para afirmar que ya existe una verificacion realizada.

Reglas canonicas:

- `CANCELLED` no debe cargar `verification_event_id`;
- `CANCELLED` exige `closed_at` no nulo;
- si una ventana ya no debe seguir abierta, se cancela la obligacion, no se marca `COMPLETED` sin evento.

## Regla de cumplimiento real

`COMPLETED` no significa automaticamente:

- verificacion aprobada;
- vigencia util;
- cumplimiento regulatorio vigente.

El cumplimiento regulatorio debe seguir saliendo de la capa factual:

- `verification_events`
- su `result_status`
- su `valid_until`
- el perfil vigente de aplicabilidad
- la regla de calendario aplicable

Para Vera, un evento se considera **compliant** cuando al menos:

- corresponde al tipo de verificacion correcto;
- su `result_status` es util para cumplimiento;
- su `valid_until` todavia cubre la fecha que se esta evaluando.

Con el comportamiento actual del backend, los resultados que alimentan ese criterio son:

- `PASSED`
- `CONDITIONAL`

Consecuencia importante:

- una obligacion puede quedar `COMPLETED` y aun asi la unidad no quedar `VIGENTE`;
- el estado regulatorio no debe inferirse solo desde `verification_obligations.status`.

## Casos permitidos

### 1. Obligacion generada y luego atendida

Flujo normal:

- se genera una obligacion por calendario o captura manual;
- el propietario responde o administracion programa;
- se registra un `verification_event`;
- el evento se liga a esa obligacion;
- la obligacion pasa a `COMPLETED`.

### 2. Evento sin obligacion previa

Se permite registrar un `verification_event` sin obligacion asociada cuando:

- se captura historia previa;
- la verificacion se realizo fuera del flujo normal del intermediario;
- el dato llega por regularizacion o carga administrativa posterior.

En ese caso:

- el evento sigue siendo valido como hecho real;
- la existencia del evento no exige inventar una obligacion retroactiva.

### 3. Obligacion cancelada sin evento

Se permite cerrar una obligacion sin evento cuando:

- fue un caso abierto por error;
- la unidad dejo de aplicar por cambio administrativo;
- la ventana quedo absorbida por una regularizacion distinta;
- el intermediario decide cerrarla por control operativo.

### 4. Evento posterior sobre obligaciones abiertas antiguas

Si aparece un evento real y existen varias obligaciones abiertas historicas:

- el intermediario solo debe ligar el evento a una obligacion compatible;
- las demas no deben marcarse `COMPLETED` con ese mismo evento;
- las obligaciones que ya no deban seguir abiertas deben cancelarse individualmente.

## Reglas de integridad documental

El contrato canonico recomienda mantener o reforzar estas validaciones:

- `UNIQUE (verification_event_id)` en `verification_obligations`;
- una sola obligacion por `vehicle_id + verification_type + due_date`;
- historial append-only en `verification_obligation_history` para `COMPLETED` y `CANCELLED`;
- prohibir relink silencioso de un evento ya ligado;
- prohibir `COMPLETED` sin evento;
- prohibir `CANCELLED` con evento ligado.

## Impacto en consultas y vistas

Las vistas y reportes no deben usar:

- `verification_obligations.status = COMPLETED`

como sustituto de cumplimiento vigente.

Deben resolver por separado:

- ultimo evento compliant;
- `valid_until` vigente;
- obligacion abierta si existe;
- ultimo estado operativo de la obligacion.

Esto afecta especialmente a:

- `vw_vehicle_verification_status`
- `vw_pending_verifications_by_client`
- `vw_notification_candidates`

## Impacto en la generacion automatica

La generacion automatica de obligaciones debe evaluar:

- el ultimo evento compliant;
- no solo la existencia de una obligacion `COMPLETED`.

Por lo tanto:

- un evento que no deje cumplimiento vigente no bloquea nuevas obligaciones futuras;
- una obligacion `COMPLETED` sin vigencia util no debe interpretarse como cobertura suficiente.

## Fuente de verdad actual

La direccion estructural actual del esquema ya coincide con esta decision en:

- [20260509211000-create-verification-obligations.ts](../src/database/migrations/20260509211000-create-verification-obligations.ts)

porque la tabla `verification_obligations` ya declara:

- `verification_event_id` nullable;
- `UNIQUE (verification_event_id)`.

## Conclusion

El contrato canonico de Vera queda asi:

- la obligacion es seguimiento operativo;
- el evento es hecho real;
- `COMPLETED` significa caso atendido con evento ligado;
- cumplimiento regulatorio vigente se determina por evento compliant y vigencia, no por `COMPLETED` por si solo.
