# Politica de Identidad Maestra del Vehiculo

## Objetivo

Cerrar la regla canonica de identidad del vehiculo en **Vera** antes de abrir cambios estructurales de SQL o codigo.

Esta politica fija como debe entenderse la serie o NIV, como debe tratarse la placa y que efecto tiene un cambio de placa sobre las reglas regulatorias futuras.

## Decision canonica

### 1. `serial_niv` es obligatorio

- toda unidad operativa en Vera debe tener `serial_niv`;
- no debe existir un vehiculo operativo sin serie o NIV;
- la serie es la identidad maestra de la unidad;
- la serie debe ser unica, estable, no reutilizable y no reasignable a otra unidad;
- para VIN modernos, la referencia esperada es de `17` caracteres conforme a [17_referencia_vin_niv_y_anos_modelo.md](./17_referencia_vin_niv_y_anos_modelo.md).

### 2. `plate` es un atributo mutable

- `plate` representa la placa vigente actual de la unidad;
- la placa puede cambiar por reemplacamiento, correccion administrativa o actualizacion documental;
- el cambio de placa no crea un vehiculo nuevo;
- el cambio de placa no reinicia el historial de verificaciones, documentos, relaciones juridicas, remisiones o pagos;
- la placa es importante para operar calendario y reportes, pero no sustituye a la identidad maestra por serie.

### 3. Efecto del cambio de placa sobre reglas aplicables

Cuando cambie `plate`, Vera debe tratar la nueva placa como la referencia vigente para calculo futuro.

Esto obliga a:

- recalcular `schedule_marker_auto` con base en la nueva placa y el regimen vigente;
- reevaluar `schedule_marker_effective` contra la nueva placa;
- usar la placa nueva y el nuevo marcador efectivo para obligaciones futuras, vistas regulatorias, reportes y candidatos de notificacion;
- conservar sin reescritura los `verification_events` historicos ya registrados.

Si no existe un `override` documental y administrativamente aprobado, `schedule_marker_effective` debe coincidir con `schedule_marker_auto`.

### 4. Regla para altas incompletas

- un registro sin `serial_niv` no debe entrar al padron operativo de `vehicles`;
- si negocio necesita capturar una unidad preliminar, eso debe manejarse como pre-registro o intake separado;
- mientras una unidad no tenga `serial_niv`, no debe generar obligaciones, notificaciones, expediente documental vigente ni remisiones operativas.

### 5. Implicaciones sobre el modelo

Esta politica fija el objetivo estructural del modelo:

- `vehicles.serial_niv` debe cerrar como dato obligatorio del vehiculo operativo;
- `vehicles.plate` debe permanecer como dato vigente y mutable;
- el calendario regulatorio siempre debe interpretarse contra la placa vigente y su marcador efectivo;
- la trazabilidad de cambios de placa debe quedar absorbida por el submodelo de vida o auditoria del vehiculo que se cierre en `NORM-004`.

## Regla de lectura para el proyecto

Toda referencia futura a identidad vehicular en Vera debe leerse asi:

1. la serie o NIV identifica a la unidad;
2. la placa identifica el estado operativo actual frente al calendario;
3. una placa nueva cambia las reglas regulatorias futuras aplicables;
4. un cambio de placa no cambia la identidad de la unidad;
5. una unidad sin serie no debe operar como vehiculo formal dentro del sistema.

## Criterio de cierre de NORM-003

`NORM-003` se considera cerrado cuando:

- exista esta politica documental;
- el enunciado canonico, las tablas, el diagrama, el glosario y la hoja de ruta ya no contradigan esta regla;
- quede claro que la serie es obligatoria y que la placa es mutable con recambio de reglas aplicables.
