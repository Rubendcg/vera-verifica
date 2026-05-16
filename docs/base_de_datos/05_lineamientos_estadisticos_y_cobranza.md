# Lineamientos Estadísticos y Cobranza

## Objetivo

Ampliar el modelo actual de Vera para que no solo sirva para operar verificaciones, sino también para:

- hacer análisis estadístico confiable;
- proyectar carga operativa;
- medir saturación por centro;
- controlar clientes y deuda;
- separar claramente operación, analítica y cobranza.

## Problema que resuelve esta ampliación

El modelo actual ya sirve para:

- padrón de vehículos;
- verificaciones;
- documentos PDF;
- reportes;
- notificaciones.

Pero para análisis y control financiero todavía faltan lineamientos adicionales:

- conservar historia;
- registrar calidad del dato;
- medir tiempos reales de atención;
- distinguir deuda vigente, vencida y pagada;
- construir reportes de cartera por cliente.

## Lineamientos estadísticos

## 1. No sobrescribir estados históricos

El sistema no debe depender solo del estado actual.

Se recomienda guardar historia con:

- `vehicle_status_history`
- `valid_from`
- `valid_to`
- `changed_at`
- `changed_by_user_id`
- `change_reason`

Esto permite:

- ver cómo evolucionó un vehículo;
- reconstruir el estado en una fecha pasada;
- medir cuánto tiempo permaneció vencido o por vencer.

## 2. Separar dato observado de dato derivado

Dato observado:

- fecha del documento;
- fecha de verificación;
- resultado real;
- centro;
- fecha de captura.

Dato derivado:

- `days_to_due`
- `status`
- `aging_bucket`
- `saturation_index`

Regla:

- guardar el dato observado;
- calcular el derivado en vistas, snapshots o tablas analíticas.

## 3. Registrar calidad de dato

Agregar lineamientos o tablas para:

- `source_system`
- `captured_at`
- `capture_method`
- `is_verified`
- `is_imputed`
- `data_quality_status`

Tabla sugerida:

- `data_quality_issues`

Campos sugeridos:

- `id`
- `entity_type`
- `entity_id`
- `issue_type`
- `severity`
- `detected_at`
- `resolved_at`
- `comments`

## 4. Crear snapshots diarios

Tabla sugerida:

- `daily_vehicle_status_snapshot`

Campos sugeridos:

- `snapshot_date`
- `vehicle_id`
- `client_party_id`
- `regime`
- `lifecycle_status_current`
- `schedule_marker_effective`
- `physical_status`
- `emissions_status`
- `physical_days_to_due`
- `emissions_days_to_due`
- `is_active`

Notas:

- `lifecycle_status_current` debe distinguir la vida administrativa del vehiculo;
- `is_active` no debe leerse como sustituto del estado administrativo canonico.

Uso:

- tendencia de vencidos;
- proyección de demanda;
- análisis por cliente;
- backlog diario.

## 5. Medir sesiones reales de atención

Tabla sugerida:

- `verification_sessions`

Campos sugeridos:

- `id`
- `vehicle_id`
- `center_id`
- `scheduled_at`
- `check_in_at`
- `started_at`
- `finished_at`
- `duration_minutes`
- `session_result`
- `no_show`
- `rescheduled`
- `verification_event_id`

Uso:

- medir duración real;
- calcular tiempos de espera;
- conocer productividad por centro;
- comparar capacidad nominal vs real.

## 6. Medir capacidad diaria del centro

Tabla sugerida:

- `verification_center_capacity_daily`

Campos sugeridos:

- `id`
- `center_id`
- `capacity_date`
- `lines_available`
- `hours_open`
- `minutes_per_verification`
- `capacity_nominal`
- `capacity_operational`
- `occupancy_factor`
- `notes`

Uso:

- capacidad diaria;
- comparación contra demanda;
- índice de saturación;
- forecast operativo.

## 7. Mantener un calendario laboral

Tabla sugerida:

- `calendar_business_days`

Campos sugeridos:

- `calendar_date`
- `is_business_day`
- `is_holiday`
- `holiday_name`
- `state_code`

Uso:

- cálculos de vencimiento;
- proyección de carga por días hábiles;
- ventanas reales de atención.

## 8. Catálogos cerrados para análisis

Usar catálogos cerrados para:

- estatus de verificación;
- motivos de rechazo;
- motivos de reprogramación;
- tipo de deuda;
- estatus de cobranza.

Esto mejora:

- consistencia;
- agregación estadística;
- comparabilidad histórica.

## Lineamientos de cobranza y deuda

## 1. Separar servicio, documento por cobrar y pago

No usar solo `service_orders` para saber si un cliente debe.

Se recomienda separar:

- el servicio realizado;
- el documento por cobrar;
- los pagos;
- los movimientos de cuenta.

### `service_orders` como remision de verificaciones

Antes de abrir cartera o pagos, `service_orders` debe cerrarse como encabezado de remision de verificaciones.

Regla canonica:

- una remision por `vehicle_id`;
- una remision por evento de captura administrativa;
- y un solo contexto comercial base por encabezado.

No debe usarse como:

- lote multi-vehiculo;
- factura;
- pago;
- o tabla generica de cualquier servicio.

Su contrato formal se cierra en:

- [49_contrato_canonico_remision_verificaciones.md](./49_contrato_canonico_remision_verificaciones.md)

### `service_order_items` como conceptos economicos auditables

El detalle economico no debe quedarse en `concept + amount`.

Cada renglon debe poder responder:

- que concepto economico se esta cobrando;
- si corresponde a una verificacion puntual o a un cargo de orden;
- que `verification_type` representa cuando aplica;
- a que `verification_obligation` o `verification_event` apunta;
- cual era el monto canonico;
- y cual fue el monto realmente aplicado.

Su contrato formal se cierra en:

- [50_contrato_canonico_conceptos_economicos_por_verificacion.md](./50_contrato_canonico_conceptos_economicos_por_verificacion.md)

## 2. Cuentas por cliente

Tabla sugerida:

- `client_accounts`

Campos sugeridos:

- `id`
- `client_party_id`
- `account_status`
- `credit_limit`
- `credit_days`
- `currency`
- `created_at`

Uso:

- una cuenta administrativa por cliente;
- condiciones comerciales;
- control de crédito.

## 3. Documentos por cobrar

Regla canonica para cuentas:

- la cuenta administrativa agrupa la cartera por `client_party_id`;
- el pagador real puede ser distinto y se registra aparte en el pago;
- la trazabilidad completa se cierra en `51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md`.

Tabla sugerida:

- `receivable_documents`

Campos sugeridos:

- `id`
- `client_account_id`
- `service_order_id`
- `document_type`
- `folio`
- `issue_date`
- `due_date`
- `subtotal`
- `tax_amount`
- `total_amount`
- `balance_amount`
- `receivable_status`

Estados sugeridos:

- `PENDIENTE`
- `PARCIAL`
- `PAGADO`
- `VENCIDO`
- `CANCELADO`

Uso:

- factura o cargo administrativo;
- saldo actual;
- fecha de vencimiento.

## 4. Parcialidades o vencimientos

Regla canonica para documentos por cobrar:

- la deuda no nace directo en `service_orders`;
- nace cuando la remision genera `receivable_documents`;
- dentro del alcance actual debe existir como maximo un documento activo por remision cobrable.

Tabla sugerida:

- `receivable_installments`

Campos sugeridos:

- `id`
- `receivable_document_id`
- `installment_no`
- `due_date`
- `amount_due`
- `amount_paid`
- `installment_status`

Uso:

- pagos parciales;
- convenios;
- control de vencimientos múltiples.

## 5. Pagos

Regla canonica para parcialidades:

- incluso el cobro de una sola exhibicion debe tener una parcialidad `1`;
- la suma de `amount_due` debe igualar el total del documento;
- la suma de `amount_paid` no puede exceder la deuda de la parcialidad.

Tabla sugerida:

- `payment_transactions`

Campos sugeridos:

- `id`
- `client_account_id`
- `payment_date`
- `payment_method`
- `reference`
- `amount`
- `currency`
- `registered_by_user_id`
- `notes`

Uso:

- registrar depósitos, transferencias o efectivo;
- conciliar pagos con deuda.

## 6. Aplicación de pagos y movimientos

Tabla sugerida:

- `account_movements`

Campos sugeridos:

- `id`
- `client_account_id`
- `movement_date`
- `movement_type`
- `reference_type`
- `reference_id`
- `debit_amount`
- `credit_amount`
- `balance_after`
- `comments`

Tipos de movimiento:

- `CARGO`
- `ABONO`
- `AJUSTE`
- `CANCELACION`

Uso:

- estado de cuenta;
- auditoría de saldo;
- trazabilidad financiera.

## 7. Indicadores de deuda

Campos o vistas recomendadas:

- `current_balance`
- `overdue_balance`
- `days_past_due`
- `aging_bucket`
- `last_payment_date`

Buckets sugeridos:

- `0-30`
- `31-60`
- `61-90`
- `91+`

Vista sugerida:

- `vw_client_receivables_aging`

## 8. Visibilidad

La deuda del cliente no debe estar visible para el propietario en el portal operativo.

Debe quedar reservada para:

- administrador;
- perfiles de cobranza;
- usuarios internos autorizados.

## Propuesta de nuevas tablas

### Analítica y estadística

- `vehicle_status_history`
- `daily_vehicle_status_snapshot`
- `verification_sessions`
- `verification_center_capacity_daily`
- `calendar_business_days`
- `data_quality_issues`

### Cobranza

- `client_accounts`
- `receivable_documents`
- `receivable_installments`
- `payment_transactions`
- `account_movements`

## Flujo canonico de cobranza

La trazabilidad financiera ya no debe leerse como salto directo de remision a pago.

Su contrato canonico se cierra en:

- [51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md](./51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md)

Cadena base:

- `service_orders`
- `service_order_items`
- `receivable_documents`
- `receivable_installments`
- `payment_transactions`
- `payment_applications`
- `account_movements`

Reglas base:

- la deuda nace en `receivable_documents`;
- el pago se registra primero y se cancela deuda solo cuando queda aplicado;
- la cuenta administrativa sigue agrupada por cliente;
- el pagador real puede ser distinto del cliente y se conserva en el pago.

## Beneficios para Vera

Con estos lineamientos nuevos, Vera podría:

- proyectar carga de verificación por cliente y por centro;
- medir saturación real de operación;
- calcular backlog histórico;
- detectar problemas de calidad de datos;
- controlar deuda vigente y vencida por cliente;
- emitir reportes de cartera;
- separar claramente operación, documentos, reportes y cobranza.

## Siguiente paso recomendado

Traducir esta ampliación a:

- documentación SQL detallada;
- migraciones;
- módulos Nest:
  - `analytics`
  - `capacity`
  - `billing`
  - `collections`
