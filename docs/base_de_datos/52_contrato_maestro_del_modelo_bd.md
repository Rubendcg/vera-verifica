# Contrato Maestro del Modelo de Base de Datos

## Objetivo

Cerrar `NORM-020` dejando una sola regla de interpretacion para el modelo de Vera.

La meta no es crear otro documento paralelo, sino fijar:

- que documento manda sobre estructura;
- que documento manda sobre lenguaje;
- que documento resume visualmente;
- y como deben mantenerse alineados.

## Decision canonica

El contrato maestro del modelo queda compuesto por cuatro piezas coordinadas:

1. [02_tablas_y_relaciones.md](./02_tablas_y_relaciones.md)
2. [20_glosario_base_de_datos.md](./20_glosario_base_de_datos.md)
3. [55_diagrama_maestro_bd_aprobado.md](./55_diagrama_maestro_bd_aprobado.md)
4. [10_hoja_de_ruta_base_de_datos.md](./10_hoja_de_ruta_base_de_datos.md)

Cada una tiene un rol distinto.

## Regla de precedencia

### 1. Estructura manda desde `02_tablas_y_relaciones.md`

Si existe duda sobre:

- tablas;
- relaciones;
- campos principales;
- grano;
- o dependencias transaccionales;

la fuente estructural canonica es:

- [02_tablas_y_relaciones.md](./02_tablas_y_relaciones.md)

### 2. Lenguaje manda desde `20_glosario_base_de_datos.md`

Si existe duda sobre:

- significado de un termino;
- alcance de una palabra de negocio;
- o diferencia entre conceptos parecidos;

la fuente semantica canonica es:

- [20_glosario_base_de_datos.md](./20_glosario_base_de_datos.md)

### 3. Visualizacion manda desde `55_diagrama_maestro_bd_aprobado.md`, pero subordinada

El diagrama final es la representacion visual oficial del modelo.

Sin embargo:

- no crea semantica nueva por si solo;
- no crea tablas nuevas por si solo;
- y si llega a existir conflicto con `02` o `20`, debe corregirse el diagrama.

### 4. Estado y secuencia mandan desde `10_hoja_de_ruta_base_de_datos.md`

El roadmap es la fuente oficial para:

- estado por fase;
- secuencia de trabajo;
- dependencias de implementacion;
- y cierre documental acumulado.

Pero no debe introducir semantica estructural nueva que no exista ya en `02`, `20` o documentos canonicos especializados.

## Regla de sincronizacion

Todo cambio estructural nuevo del modelo debe reflejarse, en la misma pasada documental, en:

- `02_tablas_y_relaciones.md`
- `20_glosario_base_de_datos.md`
- `55_diagrama_maestro_bd_aprobado.md`
- `10_hoja_de_ruta_base_de_datos.md`

Si no afecta una de esas capas, debe explicarse por que.

## Dominios que ya quedan alineados

### Identidad y vida del vehiculo

Ya deben decir lo mismo en las cuatro capas:

- `serial_niv` como identidad maestra;
- `plate` como dato vigente mutable;
- `lifecycle_status_current` como vida administrativa;
- y `owner_admin_status_current` como estado del propietario.

### Relaciones vigentes

Ya deben decir lo mismo:

- `OWNER`
- `CLIENT`
- `LEGAL_POSSESSOR`
- vistas canonicas de relacion vigente.

### Cumplimiento regulatorio

Ya deben decir lo mismo:

- diferencia entre `verification_obligations` y `verification_events`;
- aplicabilidad por `vehicle_verification_profile`;
- y uso de `verification_centers` como sede operativa.

### Expediente documental

Ya deben decir lo mismo:

- tipos oficiales nucleares;
- version vigente de PDF;
- visibilidad del propietario;
- y trazabilidad de acceso documental.

### Notificaciones

Ya deben decir lo mismo:

- supresion por ciclo de vida;
- separacion entre flujo externo e interno;
- y permisos internos del intermediario.

### Remision, conceptos y cobranza

Ya deben decir lo mismo:

- `service_orders` como remision por unidad;
- `service_order_items` como renglon economico auditable;
- deuda naciendo en `receivable_documents`;
- pagos registrados en `payment_transactions`;
- aplicaciones en `payment_applications`;
- y saldo trazado por `account_movements`.

## Regla sobre documentos especializados

Los documentos canonicos especializados de `NORM-001` a `NORM-019` siguen vigentes.

Su papel es:

- fijar la decision puntual de cada subdominio;
- y alimentar a las cuatro piezas del contrato maestro.

Pero, una vez integrados, el estado maestro del modelo debe poder leerse sin contradiccion desde:

- `02`
- `20`
- `55`
- `10`

## Regla de salida para cambios futuros

Si despues del cierre estructural se detecta una mejora:

1. primero se decide si cambia semantica o solo redaccion;
2. si cambia semantica, debe reabrirse controladamente el contrato maestro;
3. si solo cambia redaccion, la correccion debe respetar la precedencia aqui definida.

## Criterio documental de cierre

Este documento se considera suficiente cuando:

- deja clara la precedencia entre tablas, glosario, diagrama y roadmap;
- fija la obligacion de sincronizacion entre esas capas;
- declara que esos cuatro documentos forman el contrato maestro del modelo;
- y permite cerrar `NORM-020` sin ambiguedad sobre donde manda cada cosa.
