# Módulos Nest Alineados con la Base de Datos

## Objetivo

Definir la estructura recomendada de módulos en Nest para **Vera**, alineada con la base de datos y con las fases de implementación del proyecto.

La meta es evitar dos errores comunes:

- crear módulos solo por tabla, sin criterio de negocio;
- mezclar responsabilidades operativas, documentales, analíticas y contables en un mismo módulo.

## Principio de diseño

En Vera, los módulos deben agruparse por **capacidad del negocio** y no solo por entidad.

Ejemplo:

- `documents` sí puede ser módulo propio porque concentra subida, almacenamiento, visibilidad y versionado;
- `vehicle-party-roles` no conviene como producto aislado si su lógica está absorbida por `vehicles` y `parties`.

## Estructura recomendada

## 1. `auth`

### Responsabilidad

- autenticación;
- emisión y validación de tokens;
- login;
- control de sesión;
- guardas de acceso.

### Tablas asociadas

- `users`

### Funciones principales

- `login`
- `refresh token`
- `password reset`
- `guards`
- `roles/claims`

### Dependencias

- depende de `users`

## 2. `users`

### Responsabilidad

- gestión de cuentas internas y externas;
- asociación de usuario con persona/empresa;
- activación o bloqueo de cuenta.

### Tablas asociadas

- `users`
- `user_vehicle_access`

### Funciones principales

- alta y edición de usuarios;
- asignación de acceso a vehículos;
- activación/desactivación.

### Dependencias

- depende de `parties`
- se coordina con `auth`

## 3. `parties`

### Responsabilidad

- catálogo de personas físicas y morales;
- propietarios;
- permisionarios;
- poseedores legales;
- clientes de consulta;
- datos fiscales y de contacto general.

### Tablas asociadas

- `parties`
- `party_contacts`

### Funciones principales

- CRUD de clientes/partes;
- identificación por RFC;
- contactos principales;
- datos para reportes y cobranza.

### Dependencias

- base para casi todos los demás módulos

## 4. `vehicles`

### Responsabilidad

- padrón vehicular;
- identificación de unidades;
- régimen federal/estatal;
- relaciones entre vehículo y partes;
- visibilidad de la unidad para usuarios.

### Tablas asociadas

- `vehicles`
- `vehicle_party_roles`
- `user_vehicle_access`

### Funciones principales

- alta de vehículo;
- asignación de propietario, cliente, permisionario y titular;
- consulta consolidada por unidad;
- lógica del tercer/cuarto dígito.

### Dependencias

- depende de `parties`
- se coordina con `users`

## 5. `verifications`

### Responsabilidad

- control de verificaciones;
- vigencias;
- centros;
- historial regulatorio del vehículo;
- estado actual.

### Tablas asociadas

- `verification_centers`
- `verification_events`
- `verification_schedule_rules`

### Funciones principales

- registrar verificación;
- calcular vigencia;
- marcar pendiente, vigente o vencida;
- segmentar por calendario.

### Dependencias

- depende de `vehicles`
- se coordina con `documents`

## 6. `documents`

### Responsabilidad

- expediente documental;
- carga de PDFs escaneados;
- versionado de archivos;
- control de visibilidad al propietario;
- vínculo entre documento y verificación.

### Tablas asociadas

- `documents`
- `document_files`

### Funciones principales

- subir PDF;
- crear registro lógico del documento;
- almacenar versiones;
- marcar documento vigente;
- exponer documentos visibles al propietario.

### Dependencias

- depende de `vehicles`
- puede depender de `parties`
- se coordina con `verifications`

## 7. `reports`

### Responsabilidad

- generación de reportes funcionales;
- consultas por cliente;
- pendientes por vencer;
- reportes por marcador de placa;
- tableros operativos.

### Tablas y vistas asociadas

- `vw_current_client_by_vehicle`
- `vw_vehicle_verification_status`
- `vw_pending_verifications_by_client`
- `vw_owner_vehicle_status`
- `vw_owner_vehicle_documents`

### Funciones principales

- reportes por cliente;
- reportes por régimen;
- reportes por vencimiento;
- reportes para exportación.

### Dependencias

- depende de `vehicles`
- depende de `verifications`
- usa `documents`

## 8. `notifications`

### Responsabilidad

- automatización de envío;
- reglas de notificación;
- plantillas;
- cola de envío;
- integración con correo y WhatsApp;
- bitácora.

### Tablas asociadas

- `report_recipients`
- `notification_log`
- `message_templates`
- `notification_rules`
- `notification_batches`
- `notification_batch_items`

### Funciones principales

- detectar candidatos;
- agrupar por cliente/canal;
- renderizar plantillas;
- registrar lotes;
- registrar resultado de envío.

### Dependencias

- depende de `reports`
- depende de `parties`
- depende de `documents` solo si adjunta archivos

## 9. `analytics`

### Responsabilidad

- snapshots;
- historia del estado;
- calidad del dato;
- métricas de backlog;
- tendencias de vencimiento.

### Tablas asociadas

- `vehicle_status_history`
- `daily_vehicle_status_snapshot`
- `data_quality_issues`
- `calendar_business_days`

### Funciones principales

- generación de snapshots diarios;
- revisión de calidad del dato;
- métricas de tendencia;
- proyecciones de carga.

### Dependencias

- depende de `vehicles`
- depende de `verifications`

## 10. `capacity`

### Responsabilidad

- capacidad operativa de centros;
- sesiones de atención;
- duración real de verificaciones;
- saturación y ocupación.

### Tablas asociadas

- `verification_sessions`
- `verification_center_capacity_daily`

### Funciones principales

- registrar sesión;
- medir tiempos reales;
- calcular saturación;
- proyectar capacidad diaria.

### Dependencias

- depende de `verifications`
- puede coordinarse con `analytics`

## 11. `service-orders`

### Responsabilidad

- gestión administrativa de servicios;
- remisiones;
- detalle de conceptos;
- vínculo entre servicio y operación.

### Tablas asociadas

- `service_orders`
- `service_order_items`

### Funciones principales

- crear servicio o remisión;
- relacionar servicio con vehículo y cliente;
- desglosar conceptos.

### Dependencias

- depende de `vehicles`
- depende de `parties`

## 12. `billing`

### Responsabilidad

- cuentas por cobrar;
- cargos;
- documentos de cobro;
- saldo por cliente.

### Tablas asociadas

- `client_accounts`
- `receivable_documents`
- `receivable_installments`

### Funciones principales

- generar documento por cobrar;
- calcular saldo;
- clasificar estado del documento;
- generar antigüedad de cartera.

### Dependencias

- depende de `parties`
- depende de `service-orders`

## 13. `collections`

### Responsabilidad

- pagos;
- aplicación de pagos;
- movimientos de cuenta;
- estado de cuenta;
- seguimiento de deuda.

### Tablas asociadas

- `payment_transactions`
- `payment_applications`
- `account_movements`

### Funciones principales

- registrar pago;
- aplicar pago a factura o parcialidad;
- recalcular saldo;
- mantener trazabilidad contable.

### Dependencias

- depende de `billing`

## Dependencias entre módulos

```text
auth -> users
users -> parties
vehicles -> parties, users
verifications -> vehicles
documents -> vehicles, verifications
reports -> vehicles, verifications, documents
notifications -> reports, parties
analytics -> vehicles, verifications
capacity -> verifications, analytics
service-orders -> vehicles, parties
billing -> parties, service-orders
collections -> billing
```

## Orden recomendado de implementación

### Fase 1

- `parties`
- `users`
- `auth`
- `vehicles`

### Fase 2

- `verifications`

### Fase 3

- `documents`

### Fase 4

- `reports`
- `notifications`

### Fase 5

- `analytics`
- `capacity`

### Fase 6

- `service-orders`
- `billing`
- `collections`

## Estructura sugerida de carpetas

```text
src/
  auth/
  users/
  parties/
  vehicles/
  verifications/
  documents/
  reports/
  notifications/
  analytics/
  capacity/
  service-orders/
  billing/
  collections/
  common/
  database/
  config/
```

## Convención recomendada por módulo

Cada módulo debería tener como mínimo:

- `controller`
- `service`
- `module`
- `dto`
- `entities` o `schemas` internos del ORM
- `repository` o acceso a persistencia si separas capa

Ejemplo:

```text
vehicles/
  vehicles.module.ts
  vehicles.controller.ts
  vehicles.service.ts
  dto/
  entities/
  repositories/
```

## Recomendación arquitectónica

No exponer toda la base de datos directamente como CRUD plano.

Vera necesita módulos con lógica de negocio, por ejemplo:

- `verifications` no solo crea registros, también calcula vigencias;
- `documents` no solo guarda archivos, también controla versión y visibilidad;
- `notifications` no solo guarda logs, también arma lotes y evita duplicados;
- `billing` no solo guarda facturas, también mantiene saldo;
- `collections` no solo registra pagos, también los aplica.

## Conclusión

La estructura modular de Nest debe seguir el modelo de datos, pero no copiarlo mecánicamente.

La mejor alineación para Vera es:

- módulos por capacidad de negocio;
- dependencias claras;
- implementación por fases;
- separación estricta entre operación, documentos, analítica y cobranza.
