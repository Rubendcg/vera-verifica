# Esquema SQL General

## Finalidad del proyecto

`Vera` debe servir como plataforma de control de verificaciones para autotransporte, con estas metas:

- centralizar el padrón de vehículos;
- controlar verificaciones físico-mecánicas y emisiones;
- separar propiedad, operación, permiso y titularidad documental;
- permitir que cada propietario vea solo sus vehículos;
- permitir que el administrador vea toda la operación y la contabilidad;
- preparar reportes automáticos por vencimiento;
- almacenar evidencia documental en PDF.

## Principios del modelo

- No mezclar acceso del usuario con propiedad jurídica del vehículo.
- No usar una sola tabla de clientes para todo.
- Separar datos operativos, documentales, regulatorios y contables.
- Permitir varias relaciones entre una misma unidad y varias personas o empresas.
- Mantener una vista segura para propietarios sin datos contables.

## Bloques del esquema

### 1. Seguridad y acceso

Tablas:

- `users`
- `user_vehicle_access`

Responsabilidad:

- autenticar usuarios;
- definir si una cuenta es administradora;
- limitar qué vehículos puede consultar cada usuario.

### 2. Personas y empresas

Tablas:

- `parties`
- `vehicle_party_roles`
- `party_contacts`

Responsabilidad:

- modelar clientes, propietarios, permisionarios, poseedores legales y titulares documentales;
- guardar contactos para reportes;
- distinguir entre vínculo jurídico y contacto operativo.

### 3. Vehículos

Tabla principal:

- `vehicles`

Responsabilidad:

- identificar la unidad;
- definir régimen `FEDERAL` o `ESTATAL`;
- calcular el marcador de calendario a partir del tercer o cuarto dígito;
- guardar estado base de la unidad.

### 4. Verificaciones

Tablas:

- `verification_centers`
- `verification_events`
- `verification_schedule_rules`

Responsabilidad:

- registrar eventos de verificación;
- guardar vigencias;
- clasificar pendientes, vencidos y por vencer;
- aplicar reglas por régimen y marcador de placa.

### 5. Documentos PDF

Tablas:

- `documents`
- `document_files`

Responsabilidad:

- guardar el expediente lógico del documento;
- guardar el PDF escaneado y sus versiones;
- asociar constancias o tarjetas con un vehículo;
- definir si un documento puede ser visible para el propietario.

### 6. Reportes y notificaciones

Tablas:

- `report_recipients`
- `notification_log`
- `message_templates`
- `notification_rules`
- `notification_batches`
- `notification_batch_items`

Responsabilidad:

- preparar destinatarios;
- automatizar avisos por vencimiento;
- evitar duplicados;
- llevar bitácora de envío por correo y WhatsApp.

### 7. Gestión y contabilidad

Tablas:

- `service_orders`
- `service_order_items`

Responsabilidad:

- registrar remisiones o servicios;
- separar importes y conceptos;
- restringir esa información al administrador.

### 8. Lineamientos estadísticos y analítica operativa

Tablas sugeridas:

- `vehicle_status_history`
- `daily_vehicle_status_snapshot`
- `verification_sessions`
- `verification_center_capacity_daily`
- `data_quality_issues`

Responsabilidad:

- conservar historia del estado por vehículo;
- medir saturación y capacidad por centro;
- soportar proyecciones de vencimiento;
- distinguir dato observado, dato derivado y dato imputado;
- mejorar la calidad estadística del modelo.

### 9. Cuentas por cobrar y deuda por cliente

Tablas sugeridas:

- `client_accounts`
- `receivable_documents`
- `receivable_installments`
- `payment_transactions`
- `account_movements`

Responsabilidad:

- controlar deuda vigente por cliente;
- separar cargos, abonos y saldos;
- identificar antigüedad de deuda;
- soportar cobranza administrativa sin exponerla a propietarios.

## Regla de visibilidad

### Administrador

Puede ver:

- todos los vehículos;
- relaciones jurídicas;
- verificaciones;
- PDFs;
- remisiones;
- montos y contabilidad;
- bitácora de envíos.

### Propietario o usuario autorizado

Puede ver solo:

- vehículos asignados en `user_vehicle_access`;
- estatus de verificaciones;
- fechas de vencimiento;
- documentos permitidos;
- observaciones operativas.

No puede ver:

- costos;
- remisiones con monto;
- utilidad;
- información de otros vehículos;
- información contable interna.
