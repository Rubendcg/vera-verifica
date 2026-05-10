# Modelo SQL de `verification_obligations`

## Objetivo

Definir la estructura SQL que permite que:

- el propietario o usuario autorizado confirme si una verificación se va a realizar;
- la decisión quede visible de inmediato para administración;
- la obligación pendiente no se confunda con la verificación ya ejecutada;
- exista trazabilidad de cambios para auditoría operativa.

## Principio funcional

En **Vera**, una obligación pendiente y una verificación realizada son cosas distintas:

- `verification_obligations` representa lo que debe atenderse;
- `verification_events` representa lo que realmente ya se hizo.

Esa separación permite que un propietario responda:

- sí la realizará;
- no la realizará;
- necesita ayuda;
- necesita reprogramación;

sin alterar todavía el cumplimiento real del vehículo.

## Tablas propuestas

### 1. `verification_obligations`

Tabla principal de seguimiento operativo.

Campos clave:

- `vehicle_id`
- `verification_type`
- `due_date`
- `window_start_date`
- `window_end_date`
- `status`
- `owner_response`
- `owner_response_at`
- `owner_user_id`
- `admin_user_id`
- `scheduled_center_id`
- `scheduled_for`
- `verification_event_id`
- `closed_at`

### 2. `verification_obligation_history`

Tabla de auditoría de cambios.

Campos clave:

- `obligation_id`
- `changed_by_user_id`
- `action_type`
- `previous_status`
- `new_status`
- `previous_owner_response`
- `new_owner_response`
- `notes`
- `created_at`

## Flujo de estados

Estados sugeridos en `verification_obligations.status`:

- `PENDING`
- `OWNER_CONFIRMED`
- `OWNER_DECLINED`
- `REQUESTED_ASSISTANCE`
- `SCHEDULED`
- `COMPLETED`
- `OVERDUE`
- `CANCELLED`

Respuesta del propietario en `owner_response`:

- `CONFIRMED`
- `DECLINED`
- `REQUEST_ASSISTANCE`
- `REQUEST_RESCHEDULE`

## Lógica operativa

| Acción | Cambio en `verification_obligations` | Impacto administrativo |
| --- | --- | --- |
| Se genera obligación por calendario | `status = PENDING` | El administrador ve que existe una atención pendiente. |
| El propietario confirma que sí la hará | `owner_response = CONFIRMED`, `status = OWNER_CONFIRMED` | El administrador ve la decisión en tiempo real. |
| El propietario pide apoyo | `owner_response = REQUEST_ASSISTANCE`, `status = REQUESTED_ASSISTANCE` | El administrador sabe que debe intervenir. |
| El administrador agenda cita | `scheduled_center_id`, `scheduled_for`, `status = SCHEDULED` | El propietario y el administrador ven el mismo compromiso. |
| Se realiza la verificación | se vincula `verification_event_id`, `status = COMPLETED` | El caso deja de ser solo intención y pasa a cumplimiento real. |
| Se vence sin atención | `status = OVERDUE` | Entra a reportes y alertas como pendiente vencida. |

## Restricciones recomendadas

### Unicidad

- una obligación por combinación de:
  - `vehicle_id`
  - `verification_type`
  - `due_date`

### Integridad referencial

- `vehicle_id` → `vehicles.id`
- `owner_user_id` → `users.id`
- `admin_user_id` → `users.id`
- `scheduled_center_id` → `verification_centers.id`
- `verification_event_id` → `verification_events.id`

### Historial

Cada cambio importante debe registrar una fila en `verification_obligation_history`.

## SQL implementado

La implementación real quedó preparada como migración en:

- [20260509211000-create-verification-obligations.ts](../src/database/migrations/20260509211000-create-verification-obligations.ts)

## Resultado esperado en la interfaz

### Vista del propietario

Debe poder:

- ver verificaciones pendientes;
- confirmar atención;
- rechazar;
- pedir ayuda;
- pedir reprogramación.

### Vista del administrador

Debe ver automáticamente:

- el nuevo estado;
- la respuesta del propietario;
- quién respondió;
- cuándo respondió;
- si ya existe agenda o evento real asociado.

## Conclusión

`verification_obligations` es la pieza que conecta:

- calendario regulatorio;
- portal del propietario;
- operación del administrador;
- notificaciones;
- cumplimiento real.

Sin esta tabla, Vera solo sabría lo que ya se hizo.  
Con esta tabla, Vera también sabe lo que está pendiente, comprometido, rechazado o en espera de atención.
