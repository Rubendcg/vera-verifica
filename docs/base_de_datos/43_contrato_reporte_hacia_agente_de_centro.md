# Contrato de Reporte hacia Agente de Centro

## Objetivo

Definir el contrato canonico del reporte o solicitud operativa que Vera puede generar hacia el agente de contacto de un centro de verificacion.

Este contrato debe responder:

- que casos pueden salir hacia un centro;
- que informacion minima debe viajar;
- que informacion puede viajar de forma opcional;
- que informacion no debe enviarse;
- y como se distingue este flujo de las notificaciones al propietario o al cliente.

## Decision canonica

En Vera, el reporte hacia centro se trata como:

- una salida administrativa generada por el intermediario;
- dirigida a la sede y al contacto primario activo del centro;
- con finalidad operativa de coordinacion, programacion o seguimiento;
- y nunca como sustituto del registro formal del `verification_event`.

No es:

- una notificacion automatica al propietario;
- una constancia de verificacion;
- un comprobante financiero;
- ni una regularizacion automatica del cumplimiento.

## Fuente canonica del reporte

La fuente de datos recomendada debe ser una vista administrativa derivada:

- `vw_center_request_items`

Grano canonico:

- una fila por `scheduled_center_id + obligation_id`

Eso significa:

- un mismo centro puede recibir muchas filas;
- una misma unidad puede aparecer hasta una vez por obligacion abierta programada al centro;
- una misma unidad puede aparecer dos veces si tiene dos obligaciones distintas por tipo de verificacion;
- no debe duplicarse por canal ni por contacto.

## Elegibilidad canonica

Una fila solo puede ser candidata a reporte hacia centro cuando:

- existe `verification_obligations.scheduled_center_id`;
- el centro esta `is_active = true`;
- existe contacto primario activo resuelto para el centro;
- el vehiculo esta en `lifecycle_status_current = ACTIVE`;
- la verificacion sigue siendo aplicable para la unidad;
- la obligacion no esta en estado terminal.

Estados de obligacion elegibles:

- `OWNER_CONFIRMED`
- `REQUESTED_ASSISTANCE`
- `SCHEDULED`
- `OVERDUE`

Estados no elegibles:

- `PENDING`
- `OWNER_DECLINED`
- `COMPLETED`
- `CANCELLED`

## Tipos canonicos de salida

El catalogo minimo de `report_type` para centros queda asi:

- `CENTER_OPERATION_REQUEST`
- `CENTER_OPERATION_SUMMARY`

### `CENTER_OPERATION_REQUEST`

Salida detallada por caso.

Sirve para:

- solicitar atencion de una unidad concreta;
- confirmar preparacion de expediente;
- coordinar cita o ventanilla;
- dar seguimiento a una obligacion ya asignada a un centro.

### `CENTER_OPERATION_SUMMARY`

Salida agrupada por centro.

Sirve para:

- enviar lista resumida del backlog coordinado con esa sede;
- preparar una jornada o bloque de atencion;
- compartir volumen esperado sin adjuntar detalle documental completo.

## Perfiles canonicos de payload

El intermediario puede variar la informacion, pero solo dentro de perfiles documentales permitidos.

Perfiles minimos:

- `MINIMAL`
- `OPERATIVE`
- `OPERATIVE_WITH_DOCUMENT_FLAGS`

### Perfil `MINIMAL`

Debe incluir:

- `report_type`
- `generated_at`
- `generated_by_user_id`
- `center_id`
- `center_code`
- `center_name`
- `center_contact_name`
- `center_contact_channel`
- `obligation_id`
- `vehicle_id`
- `plate`
- `serial_niv`
- `verification_type`
- `due_date`
- `scheduled_for`

### Perfil `OPERATIVE`

Incluye todo `MINIMAL` y agrega:

- `unit_type`
- `regime`
- `schedule_marker_effective`
- `owner_display_name`
- `client_display_name`
- `window_start_date`
- `window_end_date`
- `obligation_status`
- `owner_response`
- `request_notes`

### Perfil `OPERATIVE_WITH_DOCUMENT_FLAGS`

Incluye todo `OPERATIVE` y agrega solo metadata documental:

- `has_current_tarjeta_circulacion`
- `has_current_constancia_fisico_mecanica`
- `has_current_constancia_emisiones`
- `selected_document_count`

Regla importante:

- este perfil no adjunta PDFs por defecto;
- solo informa si el expediente relevante existe y esta vigente.

## Datos opcionales permitidos

Solo por seleccion expresa del intermediario pueden agregarse:

- `last_verification_event_date`
- `last_verification_result_status`
- `last_verification_valid_until`
- `verification_center_reference_notes`
- lista de documentos seleccionados para acompanar la solicitud

## Datos prohibidos

El reporte hacia centro no debe incluir:

- saldos, remisiones, precios o cobranza;
- `service_orders`, `service_order_items`, `receivable_documents`, `payment_transactions` o equivalentes;
- usuarios, hashes, credenciales o control tecnico de acceso;
- informacion de otros vehiculos del mismo propietario;
- historial completo de solicitudes administrativas del propietario;
- documentos no seleccionados expresamente para esa salida;
- notas internas marcadas como confidenciales.

## Regla de documentos adjuntos

Los PDFs no deben viajar automaticamente.

Solo pueden adjuntarse si:

- el intermediario los selecciona expresamente;
- corresponden al vehiculo de la fila;
- son version actual;
- pertenecen a tipos documentales oficiales o auxiliares permitidos;
- y no estan bloqueados por politica interna de visibilidad o confidencialidad.

Tipos oficiales prioritarios:

- `TARJETA_CIRCULACION`
- `CONSTANCIA_FISICO_MECANICA`
- `CONSTANCIA_EMISIONES`

## Regla de canal

Canales documentales permitidos:

- export administrativo descargable;
- correo electronico;
- WhatsApp u otro canal de mensajeria equivalente.

Reglas:

- el canal debe ser compatible con `preferred_channel` del contacto primario o con seleccion explicita del intermediario;
- el envio a centro no debe reutilizar sin control los mismos destinatarios de `report_recipients`;
- la resolucion de contacto sale de `vw_primary_verification_center_contact`, no de `party_contacts`.

## Regla de privacidad y minimizacion

El centro solo debe recibir lo necesario para atender la coordinacion operativa.

Por defecto:

- se privilegia `MINIMAL`;
- `OPERATIVE` requiere necesidad funcional;
- `OPERATIVE_WITH_DOCUMENT_FLAGS` requiere validacion administrativa;
- adjuntar PDFs requiere seleccion expresa.

## Regla de trazabilidad

Toda generacion de reporte hacia centro debe poder responder al menos:

- quien lo genero;
- cuando se genero;
- a que centro se dirigio;
- que contacto se resolvio;
- que perfil de payload se uso;
- cuantas filas incluyo.

Hasta que exista una bitacora propia o un reuse controlado de la capa de notificaciones, esta trazabilidad debe considerarse requisito obligatorio del flujo futuro.

## Relacion con fase 4

Este contrato pertenece a la capa de `reports`, no al flujo base de alertas al propietario.

Sin embargo, en implementacion futura puede:

- exportarse manualmente;
- o transportarse por infraestructura de mensajeria comun,

siempre que no se mezcle semanticamente con:

- `vw_notification_candidates`
- `notification_rules`
- recordatorios de vencimiento al propietario o cliente

## Conclusion

El reporte hacia agente de centro en Vera queda asi:

- nace de obligaciones abiertas ya asignadas a una sede;
- se dirige al contacto primario activo del centro;
- usa payload minimizado por perfiles canonicos;
- puede incluir metadata documental y adjuntos solo por seleccion expresa;
- y nunca debe mezclar coordinacion operativa con cobranza, credenciales o datos ajenos al caso.
