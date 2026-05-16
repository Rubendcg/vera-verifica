# Modelo Canonico de Permisos Internos del Intermediario

## Objetivo

Cerrar la decision documental sobre como se autorizan las operaciones internas del intermediario dentro de Vera.

La pregunta de cierre es:

- si `users.is_admin` sigue siendo suficiente;
- o si el modelo ya requiere roles internos mas finos por modulo.

## Decision canonica

`is_admin` ya no es suficiente como modelo de permisos del negocio.

La decision formal de normalizacion es:

1. `is_admin` se conserva solo como bandera tecnica de superusuario y compatibilidad temporal;
2. el modelo canonico del intermediario pasa a roles internos acumulables por usuario;
3. la autorizacion del propietario o usuario externo sigue separada mediante `user_vehicle_access` y reglas del visor.

## Regla de separacion

Vera debe distinguir con claridad:

- autorizacion interna del intermediario;
- autorizacion externa del propietario o usuario autorizado.

No deben mezclarse.

### Autorizacion interna

Controla que puede hacer un usuario del intermediario sobre:

- vehiculos;
- verificaciones;
- documentos;
- reportes;
- notificaciones;
- remisiones y pagos;
- y administracion de usuarios internos.

### Autorizacion externa

Controla que puede ver o reportar un propietario o usuario autorizado sobre unidades asignadas.

Se basa en:

- `user_vehicle_access`;
- estado de vida del vehiculo;
- estado administrativo del propietario;
- reglas especificas del visor y del expediente.

## Regla sobre `is_admin`

`users.is_admin` no debe seguir interpretandose como el permiso de negocio unico del intermediario.

Su lectura correcta, una vez cerrado este documento, es:

- superusuario tecnico;
- bypass de emergencia;
- compatibilidad temporal mientras no se implemente el RBAC interno real.

Regla canonica:

- cuando el modelo interno de roles exista en SQL y backend, `is_admin` debe equivaler funcionalmente a `PLATFORM_ADMIN` o quedar reservado para bootstrap;
- las decisiones de negocio por modulo ya no deben colgar solo de esa bandera.

## Submodelo canonico recomendado

### Tablas objetivo

#### `internal_roles`

Catalogo de roles internos del intermediario.

Campos minimos sugeridos:

- `role_code`
- `role_name`
- `description`
- `is_system`
- `is_active`

#### `internal_permissions`

Catalogo de permisos internos granulares.

Campos minimos sugeridos:

- `permission_code`
- `module_code`
- `action_code`
- `description`
- `is_active`

#### `internal_role_permissions`

Relacion N:M entre rol interno y permiso.

Campos minimos sugeridos:

- `role_id`
- `permission_id`

#### `user_internal_roles`

Asignacion historica o vigente de roles internos a usuarios.

Campos minimos sugeridos:

- `user_id`
- `role_id`
- `granted_by_user_id`
- `start_at`
- `end_at`
- `is_current`

## Catalogo canonico minimo de roles

### `PLATFORM_ADMIN`

Rol interno con control total del sistema.

Puede:

- administrar usuarios internos;
- asignar o retirar roles;
- operar cualquier modulo;
- ver logs y auditoria global.

### `OPERATIONS_OPERATOR`

Rol interno para la operacion principal del cumplimiento vehicular.

Puede:

- operar vehiculos y relaciones vigentes;
- revisar solicitudes administrativas del propietario;
- operar verificaciones, obligaciones, centros y seguimiento regulatorio;
- consultar reportes operativos.

### `DOCUMENTS_OPERATOR`

Rol interno para expediente documental.

Puede:

- crear y actualizar documentos;
- subir o versionar PDFs;
- consultar trazabilidad documental;
- revisar completitud del expediente.

### `NOTIFICATIONS_OPERATOR`

Rol interno para automatizacion de reportes y envios.

Puede:

- operar destinatarios;
- administrar reglas y plantillas;
- generar previews y lotes;
- consultar logs de notificacion y reconciliacion.

### `FINANCE_OPERATOR`

Rol interno para remisiones, cobros y saldos.

Puede:

- operar remisiones y conceptos;
- consultar cuentas por cobrar;
- registrar pagos y aplicaciones;
- cerrar saldos y conciliaciones financieras.

### `AUDIT_READER`

Rol interno de solo lectura transversal.

Puede:

- consultar datos y trazas administrativas;
- revisar reportes y logs;
- auditar sin capacidad de escritura.

## Reglas canonicas de asignacion

### Acumulacion de roles

Un mismo usuario interno puede tener mas de un rol.

Ejemplo:

- `OPERATIONS_OPERATOR` + `DOCUMENTS_OPERATOR`;
- `NOTIFICATIONS_OPERATOR` + `AUDIT_READER`.

### No sustitucion del visor externo

Un propietario o usuario externo no debe recibir estos roles internos para resolver una necesidad del visor.

Si requiere mas visibilidad externa, eso debe resolverse en:

- `user_vehicle_access`;
- vistas seguras;
- reglas del visor del propietario.

### Gobierno de asignacion

Solo `PLATFORM_ADMIN` debe poder:

- crear o desactivar roles internos;
- cambiar mapas rol-permiso;
- otorgar o retirar roles internos a otros usuarios.

## Matriz canonica por modulo

| Modulo o dominio | Lectura canonica | Escritura canonica |
| --- | --- | --- |
| `auth` e IAM interno | `PLATFORM_ADMIN`, `AUDIT_READER` | `PLATFORM_ADMIN` |
| `users` internos | `PLATFORM_ADMIN`, `AUDIT_READER` | `PLATFORM_ADMIN` |
| `parties` | `PLATFORM_ADMIN`, `OPERATIONS_OPERATOR`, `FINANCE_OPERATOR`, `AUDIT_READER` | `PLATFORM_ADMIN`, `OPERATIONS_OPERATOR` |
| `vehicles` y cambios administrativos | `PLATFORM_ADMIN`, `OPERATIONS_OPERATOR`, `AUDIT_READER` | `PLATFORM_ADMIN`, `OPERATIONS_OPERATOR` |
| `verifications` y `verification_centers` | `PLATFORM_ADMIN`, `OPERATIONS_OPERATOR`, `DOCUMENTS_OPERATOR`, `AUDIT_READER` | `PLATFORM_ADMIN`, `OPERATIONS_OPERATOR` |
| `documents` | `PLATFORM_ADMIN`, `OPERATIONS_OPERATOR`, `DOCUMENTS_OPERATOR`, `AUDIT_READER` | `PLATFORM_ADMIN`, `DOCUMENTS_OPERATOR` |
| `reports` operativos | `PLATFORM_ADMIN`, `OPERATIONS_OPERATOR`, `DOCUMENTS_OPERATOR`, `NOTIFICATIONS_OPERATOR`, `AUDIT_READER` | no aplica como escritura de negocio principal |
| `notifications` | `PLATFORM_ADMIN`, `OPERATIONS_OPERATOR`, `NOTIFICATIONS_OPERATOR`, `AUDIT_READER` | `PLATFORM_ADMIN`, `NOTIFICATIONS_OPERATOR` |
| `finance` y cobranza | `PLATFORM_ADMIN`, `FINANCE_OPERATOR`, `AUDIT_READER` | `PLATFORM_ADMIN`, `FINANCE_OPERATOR` |
| auditoria global | `PLATFORM_ADMIN`, `AUDIT_READER` | no aplica |

## Politica de transicion

Mientras el backend siga usando autorizacion binaria por `is_admin`, la implementacion actual puede seguir leyendo:

- admin;
- no admin con acceso vehicular.

Pero esa lectura ya no debe considerarse el estado objetivo del modelo.

Regla documental:

- cualquier endpoint o modulo que hoy diga "solo admin" debe entenderse como compatibilidad temporal;
- su destino canonico es la matriz de roles internos definida en este documento.

## Impacto sobre modulos existentes

### `verifications`

Las altas, programaciones y cierres administrativos ya no deben pensarse a largo plazo como "solo admin".

Su destino canonico es:

- `PLATFORM_ADMIN`;
- `OPERATIONS_OPERATOR`.

### `documents`

La carga, versionado, migracion y trazabilidad interna del expediente ya no deben pensarse a largo plazo como "solo admin".

Su destino canonico es:

- `PLATFORM_ADMIN`;
- `DOCUMENTS_OPERATOR`.

### `notifications`

La administracion de lotes, reglas, plantillas y logs ya no debe depender de un admin global unico.

Su destino canonico es:

- `PLATFORM_ADMIN`;
- `NOTIFICATIONS_OPERATOR`.

### `finance`

La cobranza debe quedar separada de operacion, visor y notificaciones.

Su destino canonico es:

- `PLATFORM_ADMIN`;
- `FINANCE_OPERATOR`.

## Criterio documental de cierre

Este documento se considera suficiente cuando:

- declara que `is_admin` ya no basta como modelo de negocio;
- separa permisos internos del intermediario del visor externo del propietario;
- define un catalogo minimo de roles internos;
- fija una matriz canonica por modulo;
- y deja la ruta clara para migrar de admin-only a RBAC interno sin reabrir el modelo conceptual.
