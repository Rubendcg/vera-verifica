# Modulos Nest Alineados con la Base de Datos

## Objetivo

Definir la estructura recomendada de modulos en Nest para **Vera**, alineada con la base de datos y con las fases de implementacion del proyecto.

La meta es evitar dos errores comunes:

- crear modulos solo por tabla, sin criterio de negocio;
- mezclar responsabilidades operativas, documentales, analiticas y contables en un mismo modulo.

## Principio de diseno

En Vera, los modulos deben agruparse por **capacidad del negocio** y no solo por entidad.

Ejemplo:

- `documents` si puede ser modulo propio porque concentra subida, almacenamiento, visibilidad y versionado;
- `vehicle-party-roles` no conviene como producto aislado si su logica esta absorbida por `vehicles` y `parties`.

## Estructura recomendada

## 1. `auth`

### Responsabilidad

- autenticacion;
- emision y validacion de tokens;
- login;
- control de sesion;
- guardas de acceso.

### Tablas asociadas

- `users`
- `internal_roles`
- `internal_permissions`
- `internal_role_permissions`
- `user_internal_roles`

### Funciones principales

- `login`
- `refresh token`
- `password reset`
- `guards`
- `roles/claims`
- resolucion de permisos internos

### Dependencias

- depende de `users`

## 2. `users`

### Responsabilidad

- gestion de cuentas internas y externas;
- asociacion de usuario con persona o empresa;
- activacion o bloqueo de cuenta.

### Tablas asociadas

- `users`
- `user_vehicle_access`
- `user_internal_roles`

### Funciones principales

- alta y edicion de usuarios;
- asignacion de acceso a vehiculos;
- asignacion de roles internos;
- activacion o desactivacion.

### Dependencias

- depende de `parties`
- se coordina con `auth`

## 3. `parties`

### Responsabilidad

- catalogo de personas fisicas y morales;
- propietarios;
- poseedores legales;
- clientes de consulta;
- estado administrativo del propietario;
- datos fiscales y de contacto general.

### Tablas asociadas

- `parties`
- `party_owner_status_history`
- `party_contacts`

### Funciones principales

- CRUD de clientes y partes;
- identificacion por RFC;
- suspension o baja administrativa de propietario por intermediario;
- contactos principales;
- datos para reportes y cobranza.

### Dependencias

- base para casi todos los demas modulos

## 4. `vehicles`

### Responsabilidad

- padron vehicular;
- identidad maestra por serie o NIV;
- regimen federal o estatal;
- relaciones entre vehiculo y partes;
- visibilidad de la unidad para usuarios;
- estado de vida administrativo.

### Tablas asociadas

- `vehicles`
- `vehicle_party_roles`
- `vehicle_lifecycle_events`
- `vehicle_change_requests`
- `vehicle_change_request_history`
- `user_vehicle_access`

### Funciones principales

- alta de vehiculo;
- asignacion de propietario, cliente y poseedor legal;
- consulta consolidada por unidad;
- logica del tercer o cuarto digito;
- gestion de cambios administrativos del vehiculo.

### Dependencias

- depende de `parties`
- se coordina con `users`

## 5. `verifications`

### Responsabilidad

- control de verificaciones;
- perfil de aplicabilidad por vehiculo;
- vigencias;
- centros;
- historial regulatorio del vehiculo;
- estado actual.

### Tablas asociadas

- `vehicle_verification_profile`
- `vehicle_verification_profile_history`
- `verification_centers`
- `verification_center_contacts`
- `verification_events`
- `verification_schedule_rules`
- `verification_obligations`
- `verification_obligation_history`

### Funciones principales

- resolver si una verificacion aplica a una unidad;
- registrar verificacion;
- calcular vigencia;
- resolver la sede y el contacto primario operativo del centro;
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
- vinculo entre documento y verificacion.

### Tablas asociadas

- `documents`
- `document_files`
- `document_access_log`

### Funciones principales

- subir PDF;
- crear registro logico del documento;
- almacenar versiones;
- marcar documento vigente;
- exponer documentos visibles al propietario;
- registrar auditoria operativa de acceso, descarga, upload y migracion.

### Dependencias

- depende de `vehicles`
- puede depender de `parties`
- se coordina con `verifications`

## 7. `reports`

### Responsabilidad

- generacion de reportes funcionales;
- consultas por cliente;
- pendientes por vencer;
- reportes por marcador de placa;
- tableros operativos.

### Tablas y vistas asociadas

- `vw_current_owner_by_vehicle`
- `vw_current_client_by_vehicle`
- `vw_current_legal_possessor_by_vehicle`
- `vw_current_operational_contacts_by_vehicle`
- `vw_vehicle_verification_status`
- `vw_pending_verifications_by_client`
- `vw_owner_vehicle_status`
- `vw_owner_vehicle_documents`

### Funciones principales

- reportes por cliente;
- reportes por regimen;
- reportes por vencimiento;
- reportes operativos hacia centros de verificacion;
- reportes para exportacion.

### Dependencias

- depende de `vehicles`
- depende de `verifications`
- usa `documents`

## 8. `notifications`

### Responsabilidad

- automatizacion de envio;
- reglas de notificacion;
- plantillas;
- cola de envio;
- integracion con correo y WhatsApp;
- bitacora.

### Tablas asociadas

- `report_recipients`
- `notification_log`
- `message_templates`
- `notification_rules`
- `notification_batches`
- `notification_batch_items`

### Funciones principales

- detectar candidatos;
- agrupar por cliente y canal;
- renderizar plantillas;
- registrar lotes;
- registrar resultado de envio.

### Dependencias

- depende de `reports`
- depende de `parties`
- depende de `documents` solo si adjunta archivos

## 9. `analytics`

### Responsabilidad

- snapshots;
- historia del estado;
- calidad del dato;
- metricas de backlog;
- tendencias de vencimiento.

### Tablas asociadas

- `vehicle_status_history`
- `daily_vehicle_status_snapshot`
- `data_quality_issues`
- `calendar_business_days`

### Funciones principales

- generacion de snapshots diarios;
- revision de calidad del dato;
- metricas de tendencia;
- proyecciones de carga.

### Dependencias

- depende de `vehicles`
- depende de `verifications`

## 10. `capacity`

### Responsabilidad

- capacidad operativa de centros;
- sesiones de atencion;
- duracion real de verificaciones;
- saturacion y ocupacion.

### Tablas asociadas

- `verification_sessions`
- `verification_center_capacity_daily`

### Funciones principales

- registrar sesion;
- medir tiempos reales;
- calcular saturacion;
- proyectar capacidad diaria.

### Dependencias

- depende de `verifications`
- puede coordinarse con `analytics`

## 11. `service-orders`

### Responsabilidad

- gestion administrativa de servicios;
- remisiones;
- detalle de conceptos;
- vinculo entre servicio y operacion.

### Tablas asociadas

- `service_orders`
- `service_order_items`

### Funciones principales

- crear servicio o remision;
- relacionar servicio con vehiculo y cliente;
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
- generar antiguedad de cartera.

### Dependencias

- depende de `parties`
- depende de `service-orders`

## 13. `collections`

### Responsabilidad

- pagos;
- aplicacion de pagos;
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

## Dependencias entre modulos

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

## Orden recomendado de implementacion

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

## Convencion recomendada por modulo

Cada modulo deberia tener como minimo:

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

## Recomendacion arquitectonica

No exponer toda la base de datos directamente como CRUD plano.

Vera necesita modulos con logica de negocio, por ejemplo:

- `verifications` no solo crea registros, tambien calcula vigencias;
- `documents` no solo guarda archivos, tambien controla version y visibilidad;
- `notifications` no solo guarda logs, tambien arma lotes y evita duplicados;
- `billing` no solo guarda facturas, tambien mantiene saldo;
- `collections` no solo registra pagos, tambien los aplica.

## Conclusion

La estructura modular de Nest debe seguir el modelo de datos, pero no copiarlo mecanicamente.

La mejor alineacion para Vera es:

- modulos por capacidad de negocio;
- dependencias claras;
- implementacion por fases;
- separacion estricta entre operacion, documentos, analitica y cobranza.
