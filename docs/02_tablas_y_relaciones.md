# Tablas y Relaciones

## Relación principal del sistema

La estructura gira alrededor de tres ejes:

- `vehicles`: la unidad;
- `parties`: la persona o empresa;
- `vehicle_party_roles`: el rol que esa parte tiene respecto al vehículo.

Esto evita errores comunes como asumir que:

- el cliente de consulta siempre es el propietario;
- el propietario siempre es el permisionario;
- el titular de la tarjeta siempre es quien usa la unidad;
- quien entra al portal siempre coincide con la relación jurídica.

## Tablas base

### `parties`

Representa cualquier persona física o moral relacionada con la operación.

Campos importantes:

- `party_type`
- `rfc`
- `legal_name`
- `display_name`
- `phone`
- `email`

Uso:

- cliente de consulta;
- propietario;
- poseedor legal;
- permisionario;
- titular de tarjeta.

### `users`

Representa la cuenta que entra al sistema.

Campos importantes:

- `party_id`
- `email`
- `password_hash`
- `full_name`
- `is_admin`

Uso:

- autenticación;
- acceso al portal;
- segregación entre administrador y propietario.

### `vehicles`

Tabla maestra de unidades.

Campos importantes:

- `plate`
- `serial_niv`
- `engine_number`
- `unit_type`
- `regime`
- `requires_physical`
- `requires_emissions`
- `schedule_rule_position`
- `schedule_marker_auto`
- `schedule_marker_effective`

Lógica relevante:

- `FEDERAL` usa posición `3`;
- `ESTATAL` usa posición `4`;
- `schedule_marker_effective` permite corrección manual si la regla del negocio no coincide con el carácter literal de la placa.

### `vehicle_party_roles`

Es la tabla más importante del modelo.

Campos importantes:

- `vehicle_id`
- `party_id`
- `role_type`
- `start_date`
- `end_date`
- `is_current`

Valores permitidos de `role_type`:

- `cliente_consulta`
- `propietario`
- `poseedor_legal`
- `permisionario`
- `titular_tarjeta`
- `seguimiento`

## Acceso al portal

### `user_vehicle_access`

Controla qué usuario puede ver qué vehículo.

Campos importantes:

- `user_id`
- `vehicle_id`
- `access_type`
- `granted_by_user_id`
- `is_active`

Razón de diseño:

El acceso del propietario no debe depender directamente del rol jurídico del vehículo. Se controla aparte para soportar:

- propietarios;
- gestores;
- administradores de flota;
- usuarios autorizados temporalmente.

## Verificaciones

### `verification_centers`

Catálogo de centros.

Campos importantes:

- `center_type`
- `code`
- `name`
- `contact_name`

### `verification_events`

Historial de verificaciones.

Campos importantes:

- `vehicle_id`
- `verification_type`
- `event_date`
- `valid_until`
- `result_status`
- `center_id`
- `source_document_id`

Notas:

- `source_document_id` puede apuntar al documento PDF que respalda la verificación;
- esta tabla es la base de estatus vigente, vencido o por vencer.

### `verification_schedule_rules`

Calendario de vencimientos y segmentación.

Campos importantes:

- `regime`
- `schedule_position`
- `schedule_marker`
- `verification_type`
- `window_start_month`
- `window_end_month`
- `cutoff_day`
- `window_label`

Uso:

- reportes por tercer dígito en federal;
- reportes por cuarto dígito en estatal;
- agrupación de clientes por bloque de vencimiento.

## Contabilidad

### `service_orders`

Encabezado de remisiones o servicios.

Campos importantes:

- `folio`
- `service_date`
- `vehicle_id`
- `client_party_id`
- `service_type`
- `subtype`

### `service_order_items`

Detalle económico.

Campos importantes:

- `service_order_id`
- `concept`
- `amount`
- `currency`

Nota:

Esta tabla no debe exponerse en APIs para propietarios.

## Relaciones resumidas

```text
parties 1---N vehicle_party_roles N---1 vehicles
users 1---N user_vehicle_access N---1 vehicles
vehicles 1---N verification_events
verification_centers 1---N verification_events
vehicles 1---N documents 1---N document_files
vehicles 1---N service_orders 1---N service_order_items
parties 1---N party_contacts
parties 1---N report_recipients
```
