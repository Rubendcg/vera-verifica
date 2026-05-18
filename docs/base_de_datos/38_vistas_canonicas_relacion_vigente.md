# Vistas Canonicas de Relacion Vigente

## Objetivo

Cerrar documentalmente `NORM-007` definiendo como se resuelve, de forma canonica y sin interpretacion manual, la relacion vigente entre un vehiculo y sus partes principales.

Este documento fija como obtener:

- propietario vigente;
- cliente vigente;
- poseedor legal vigente;
- contacto operativo vigente.

## Principio base

La relacion vigente no debe inferirse manualmente recorriendo historiales en cada reporte.

La fuente canonica de relacion vigente es:

- `vehicle_party_roles` para `OWNER`, `CLIENT` y `LEGAL_POSSESSOR`;
- `party_contacts` y `report_recipients` para contacto operativo;
- `vehicles.lifecycle_status_current` para interpretar estados especiales como `TRANSFERRED`.

No debe usarse como fuente de relacion vigente:

- `user_vehicle_access`;
- `vehicle_change_requests`;
- `vehicle_change_request_history`;
- documentos PDF;
- filas historicas cerradas de `vehicle_party_roles`.

## Regla general de vigencia

Una relacion se considera vigente solo si cumple todo lo siguiente:

1. `role_type` coincide con el rol consultado.
2. `is_current = true`.
3. `start_date` ya inicio.
4. `end_date` es nula o no ha vencido.

En caso de conflicto, este documento no define heuristicas de desempate. El modelo debe llegar limpio desde `NORM-006`.

## Vista canonica: `vw_current_owner_by_vehicle`

### Finalidad

Resolver el propietario actualmente reconocido por el intermediario para cada vehiculo.

### Grano

Maximo una fila por `vehicle_id`.

### Fuente

- `vehicles`
- `vehicle_party_roles`
- `parties`

### Filtro canonico

- `vehicle_party_roles.role_type = 'OWNER'`
- `vehicle_party_roles.is_current = true`
- `start_date <= CURRENT_DATE`
- `end_date IS NULL OR end_date >= CURRENT_DATE`

### Columnas minimas esperadas

- `vehicle_id`
- `lifecycle_status_current`
- `owner_party_id`
- `owner_admin_status_current`
- `owner_is_operationally_enabled`
- `owner_party_type`
- `owner_legal_name`
- `owner_display_name`
- `owner_role_start_date`

### Semantica

- `OWNER` puede ser persona fisica o empresa;
- el rol juridico y el estado administrativo del propietario son capas distintas;
- si la unidad esta en `TRANSFERRED`, la vista puede devolver fila nula para el propietario vigente;
- no debe hacerse fallback al propietario anterior;
- no debe derivarse el propietario desde solicitudes aun no regularizadas.

## Vista canonica: `vw_current_client_by_vehicle`

### Finalidad

Resolver el cliente operativo vigente bajo el cual el intermediario agrupa reportes, seguimiento y servicio.

### Grano

Maximo una fila por `vehicle_id`.

### Fuente

- `vehicles`
- `vehicle_party_roles`
- `parties`

### Filtro canonico

- `vehicle_party_roles.role_type = 'CLIENT'`
- `vehicle_party_roles.is_current = true`
- `start_date <= CURRENT_DATE`
- `end_date IS NULL OR end_date >= CURRENT_DATE`

### Columnas minimas esperadas

- `vehicle_id`
- `lifecycle_status_current`
- `client_party_id`
- `client_party_type`
- `client_legal_name`
- `client_display_name`
- `client_role_start_date`

### Semantica

- ya no existe la prioridad antigua entre `cliente_consulta` y `seguimiento`;
- la vista solo acepta el rol canonico `CLIENT`;
- si no existe `CLIENT` vigente, la vista devuelve fila nula y el consumidor decide si excluye o marca pendiente de regularizacion.

## Vista canonica: `vw_current_legal_possessor_by_vehicle`

### Finalidad

Resolver el poseedor legal vigente cuando aplique.

### Grano

Maximo una fila por `vehicle_id`.

### Fuente

- `vehicles`
- `vehicle_party_roles`
- `parties`

### Filtro canonico

- `vehicle_party_roles.role_type = 'LEGAL_POSSESSOR'`
- `vehicle_party_roles.is_current = true`
- `start_date <= CURRENT_DATE`
- `end_date IS NULL OR end_date >= CURRENT_DATE`

### Columnas minimas esperadas

- `vehicle_id`
- `lifecycle_status_current`
- `legal_possessor_party_id`
- `legal_possessor_party_type`
- `legal_possessor_legal_name`
- `legal_possessor_display_name`
- `legal_possessor_role_start_date`

### Semantica

- la misma `party` puede aparecer como `LEGAL_POSSESSOR` en muchas unidades distintas;
- eso no genera conflicto mientras por cada vehiculo exista a lo sumo una fila vigente;
- la ausencia de poseedor legal vigente puede ser valida si no aplica o si sigue en regularizacion.

## Vista canonica: `vw_current_operational_contacts_by_vehicle`

### Finalidad

Resolver los contactos operativos vigentes a quienes pueden dirigirse reportes o notificaciones administrativas por vehiculo.

### Aclaracion importante

El contacto operativo no debe forzarse a una sola persona universal por vehiculo.

Por naturaleza puede variar por:

- canal;
- tipo de reporte;
- configuracion de destinatario.

Por eso la resolucion canonica de contacto operativo es **plural**.

### Grano

Una fila por:

- `vehicle_id`
- `report_type`
- `channel`
- `party_contact_id`

### Fuente

- `vw_current_client_by_vehicle`
- `report_recipients`
- `party_contacts`

### Filtro canonico

- existe `CLIENT` vigente;
- `report_recipients.party_id = client_party_id`;
- `report_recipients.is_active = true`;
- `party_contacts.receives_reports = true`.

### Columnas minimas esperadas

- `vehicle_id`
- `client_party_id`
- `party_contact_id`
- `contact_name`
- `email`
- `whatsapp_phone`
- `report_type`
- `channel`
- `priority`

### Semantica

- el contacto operativo vigente se resuelve sobre el `CLIENT`, no sobre el `OWNER` por defecto;
- si no existe `CLIENT` vigente, no existe contacto operativo vigente;
- si existen varios destinatarios activos, la vista devuelve varias filas;
- si una consulta necesita una sola opcion primaria, debe ordenar por `priority` y no improvisar otra heuristica.

## Vista consolidada recomendada: `vw_vehicle_current_relationships`

### Finalidad

Ofrecer una fila administrativa por vehiculo con la relacion vigente ya resuelta.

### Dependencias

- `vw_current_owner_by_vehicle`
- `vw_current_client_by_vehicle`
- `vw_current_legal_possessor_by_vehicle`
- `vehicles`

### Grano

Una fila por `vehicle_id`.

### Columnas minimas esperadas

- `vehicle_id`
- `lifecycle_status_current`
- `owner_party_id`
- `owner_admin_status_current`
- `client_party_id`
- `legal_possessor_party_id`
- `has_current_owner`
- `has_current_client`
- `has_current_legal_possessor`

### Uso esperado

- reportes administrativos;
- trazabilidad de regularizacion;
- joins base para vistas de fase 4;
- auditoria de unidades con relacion incompleta.

## Reglas sobre estados de vida del vehiculo

### `ACTIVE`

- las vistas deben resolver relacion vigente normalmente.

### `SUSPENDED`

- las vistas pueden seguir resolviendo relacion vigente;
- la suspension se interpreta despues en reglas operativas o regulatorias.

### `TRANSFERRED`

- `vw_current_owner_by_vehicle` puede devolver sin propietario vigente;
- no se debe reusar el propietario anterior por comodidad;
- `CLIENT` y `LEGAL_POSSESSOR` solo se muestran si realmente siguen vigentes en `vehicle_party_roles`;
- el visor del propietario anterior no debe reconstruirse desde estas vistas.

### `DEREGISTERED`

- las vistas de relacion pueden seguir mostrando la relacion vigente si esa fila no fue cerrada;
- la exclusion de notificaciones, reportes o visor se resuelve en las vistas consumidoras.

## Reglas para vistas consumidoras

Las siguientes vistas o consultas no deben reimplementar logica de historiales por su cuenta:

- `vw_pending_verifications_by_client`
- `vw_notification_candidates`
- `vw_owner_vehicle_status`
- `vw_owner_vehicle_documents`

Deben partir de las vistas canonicas aqui definidas.

Adicionalmente, las vistas seguras del propietario no deben operar flujo normal cuando:

- `owner_admin_status_current = 'SUSPENDED'`
- `owner_admin_status_current = 'DEREGISTERED'`

## Regla de no fallback

Si falta una relacion vigente:

- no se debe recorrer historia cerrada para inferir la actual;
- no se debe tomar una solicitud no regularizada como relacion vigente;
- no se debe usar `user_vehicle_access` como sustituto del rol juridico u operativo.

La salida correcta es:

- fila nula;
- exclusion controlada;
- o bandera de dato incompleto.

## Criterio de cierre de NORM-007

`NORM-007` se considera cerrado cuando:

- exista un contrato canonico para propietario, cliente y poseedor legal vigentes;
- quede claro que el contacto operativo vigente es una resolucion plural por destinatario y canal;
- las vistas de reportes y notificaciones ya no dependan de interpretar historiales manualmente;
- y el modelo documental deje de usar categorias previas fuera del alcance actual.
