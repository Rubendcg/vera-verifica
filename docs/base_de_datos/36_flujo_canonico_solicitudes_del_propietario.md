# Flujo Canonico de Solicitudes del Propietario

## Objetivo

Cerrar documentalmente el flujo por el cual el propietario, usuario autorizado o nuevo dueno reporta cambios administrativos sobre una unidad en **Vera**.

Este documento existe para separar con precision:

- la respuesta del propietario sobre una verificacion pendiente;
- de las solicitudes administrativas sobre la vida y titularidad del vehiculo.

## Regla canonica principal

`verification_obligations.owner_response` no debe usarse para:

- cambio de dueno;
- reclamo de nuevo dueno;
- suspension;
- baja;
- restablecimiento;
- ni cambios administrativos equivalentes sobre la vida del vehiculo.

`owner_response` queda reservado unicamente para el seguimiento de verificaciones pendientes.

## Submodelo propuesto

Se proponen dos piezas nuevas:

### 1. `vehicle_change_requests`

Tabla principal de solicitudes administrativas reportadas por usuarios externos al intermediario.

Campos minimos sugeridos:

- `id`
- `vehicle_id`
- `request_type`
- `request_status`
- `submitted_by_user_id`
- `claimant_party_id`
- `support_document_id`
- `current_lifecycle_status_snapshot`
- `proposed_lifecycle_status`
- `requested_effective_date`
- `reason_code`
- `reason_text`
- `assigned_admin_user_id`
- `reviewed_by_user_id`
- `submitted_at`
- `reviewed_at`
- `regularized_at`
- `resolution_notes`

### 2. `vehicle_change_request_history`

Bitacora append-only del ciclo de atencion de la solicitud.

Campos minimos sugeridos:

- `id`
- `request_id`
- `previous_status`
- `new_status`
- `changed_by_user_id`
- `change_notes`
- `created_at`

## Tipos canonicos de solicitud

Los tipos minimos de solicitud quedan asi:

- `OWNERSHIP_TRANSFER_REPORT`
- `NEW_OWNER_CLAIM`
- `SUSPENSION_REQUEST`
- `DEREGISTRATION_REQUEST`
- `RESTORATION_REQUEST`

## Semantica por tipo

### `OWNERSHIP_TRANSFER_REPORT`

- lo presenta quien hoy tiene la unidad en su control o visor;
- informa que la unidad cambio de dueno;
- no regulariza por si mismo propietarios, roles ni accesos;
- debe llevar al intermediario a validar y, cuando corresponda, dejar la unidad en `TRANSFERRED`.

### `NEW_OWNER_CLAIM`

- lo presenta quien busca incorporar a su propiedad una unidad que ya esta en `TRANSFERRED`;
- no devuelve la unidad a `ACTIVE` por si mismo;
- debe notificar al intermediario;
- la regularizacion requiere actualizar propietario, roles vigentes, accesos y datos documentales.

### `SUSPENSION_REQUEST`

- informa que la unidad debe salir temporalmente del flujo operativo normal;
- requiere revision administrativa;
- al regularizarse, la unidad debe reflejar `SUSPENDED`.

### `DEREGISTRATION_REQUEST`

- informa que la unidad debe quedar dada de baja;
- requiere revision administrativa;
- al regularizarse, la unidad debe reflejar `DEREGISTERED`.

### `RESTORATION_REQUEST`

- solo aplica para unidades que ya estan en `DEREGISTERED`;
- no reactiva la unidad automaticamente;
- debe notificar al intermediario;
- solo despues de regularizacion administrativa la unidad puede volver a `ACTIVE`.

## Estados canonicos de la solicitud

Los estados minimos de `vehicle_change_requests.request_status` quedan asi:

- `SUBMITTED`
- `UNDER_REVIEW`
- `WAITING_EVIDENCE`
- `APPROVED_PENDING_REGULARIZATION`
- `REGULARIZED`
- `REJECTED`
- `WITHDRAWN`

## Flujo canonico

1. El usuario presenta la solicitud y se crea `vehicle_change_requests` con `request_status = SUBMITTED`.
2. El intermediario debe ser notificado de inmediato.
3. La solicitud pasa a `UNDER_REVIEW` cuando ya fue tomada por operacion.
4. Si falta evidencia, pasa a `WAITING_EVIDENCE`.
5. Si la solicitud se acepta, pasa a `APPROVED_PENDING_REGULARIZATION`.
6. La unidad no se considera regularizada hasta que roles, accesos, estado de vida y datos relacionados se actualicen.
7. Cuando la regularizacion termina, la solicitud pasa a `REGULARIZED`.
8. Si no procede, pasa a `REJECTED`.
9. Si el solicitante la cancela antes de resolverla, pasa a `WITHDRAWN`.

## Relacion con el estado de vida del vehiculo

`vehicle_change_requests` alimenta al submodelo de vida, pero no lo reemplaza.

La separacion correcta es:

- `vehicle_change_requests`: caso administrativo reportado por usuario;
- `vehicle_lifecycle_events`: cambio administrativo ya reconocido o regularizado;
- `vehicles.lifecycle_status_current`: estado vigente de la unidad.

## Regla por tipo respecto al estado de vida

### `OWNERSHIP_TRANSFER_REPORT`

- puede derivar en `TRANSFERRED`;
- el propietario anterior deja de verla cuando el intermediario reconoce la unidad en `TRANSFERRED`.

### `NEW_OWNER_CLAIM`

- opera sobre una unidad ya `TRANSFERRED`;
- la unidad permanece `TRANSFERRED` hasta regularizacion;
- al concluir la regularizacion, la unidad puede volver a `ACTIVE`.

### `SUSPENSION_REQUEST`

- no debe cambiar el estado vigente solo por captura de usuario;
- al regularizarse, debe quedar `SUSPENDED`.

### `DEREGISTRATION_REQUEST`

- no debe cambiar el estado vigente solo por captura de usuario;
- al regularizarse, debe quedar `DEREGISTERED`.

### `RESTORATION_REQUEST`

- parte de una unidad ya `DEREGISTERED`;
- la unidad sigue `DEREGISTERED` durante revision;
- solo la regularizacion del intermediario permite `ACTIVE`.

## Reglas de visibilidad

### Para el propietario o usuario autorizado

- puede ver sus propias solicitudes;
- puede aportar evidencia complementaria si el caso esta en `WAITING_EVIDENCE`;
- no debe poder regularizar por si mismo el estado de la unidad;
- no debe recuperar automaticamente visor sobre una unidad `TRANSFERRED` o `DEREGISTERED`.

### Para el intermediario

- ve todas las solicitudes;
- decide procedencia;
- regulariza el cambio sobre vida, roles, accesos y documentos;
- deja trazabilidad en historia de solicitud y en historia de vida del vehiculo.

Las reglas de integridad y cardinalidad de esos roles se cierran en:

- [37_reglas_canonicas_vehicle_party_roles.md](./37_reglas_canonicas_vehicle_party_roles.md)

## Evidencia y soporte

Toda solicitud administrativa debe poder ligarse a evidencia documental cuando aplique.

Ejemplos:

- baja o suspension con documento soporte;
- reclamo de nuevo dueno con respaldo de titularidad;
- restablecimiento con evidencia administrativa.

## Integracion con notificaciones

Las siguientes acciones deben notificar al intermediario:

- nueva `OWNERSHIP_TRANSFER_REPORT`;
- nueva `NEW_OWNER_CLAIM`;
- nueva `SUSPENSION_REQUEST`;
- nueva `DEREGISTRATION_REQUEST`;
- nueva `RESTORATION_REQUEST`;
- transicion a `WAITING_EVIDENCE` o vencimiento sin respuesta;
- cualquier solicitud de incorporacion sobre `TRANSFERRED`;
- cualquier solicitud de restablecimiento sobre `DEREGISTERED`.

## Lo que no debe pasar

No debe suceder que:

- `owner_response` cambie por si mismo `vehicles.lifecycle_status_current`;
- una solicitud de nuevo dueno reactive la unidad sin regularizacion;
- una solicitud de restablecimiento saque de `DEREGISTERED` a la unidad sin decision del intermediario;
- el propietario anterior siga viendo una unidad ya reconocida como `TRANSFERRED`;
- el visor del propietario normal incluya unidades `DEREGISTERED`.

## Integracion con NORM-004

`NORM-004` definio el estado vigente de vida del vehiculo.

`NORM-005` define el canal documental por el cual los usuarios alimentan ese proceso sin sobrecargar `verification_obligations`.

## Criterio de cierre de NORM-005

`NORM-005` se considera cerrado cuando:

- exista este flujo canonico;
- quede claro que `owner_response` solo sirve para verificaciones;
- las solicitudes administrativas del propietario vivan en submodelo separado;
- y el intermediario siga siendo quien regulariza la vida del vehiculo.
