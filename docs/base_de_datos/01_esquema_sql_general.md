# Esquema SQL General

## Finalidad del proyecto

Este documento debe leerse junto con el enunciado canonico del negocio:

- [32_enunciado_canonico_del_negocio_vera.md](./32_enunciado_canonico_del_negocio_vera.md)
- [34_politica_identidad_maestra_del_vehiculo.md](./34_politica_identidad_maestra_del_vehiculo.md)
- [35_submodelo_estado_de_vida_del_vehiculo.md](./35_submodelo_estado_de_vida_del_vehiculo.md)
- [36_flujo_canonico_solicitudes_del_propietario.md](./36_flujo_canonico_solicitudes_del_propietario.md)
- [37_reglas_canonicas_vehicle_party_roles.md](./37_reglas_canonicas_vehicle_party_roles.md)
- [39_estado_administrativo_del_propietario.md](./39_estado_administrativo_del_propietario.md)
- [40_perfil_canonico_aplicabilidad_verificaciones.md](./40_perfil_canonico_aplicabilidad_verificaciones.md)
- [41_cierre_canonico_entre_obligacion_y_evento.md](./41_cierre_canonico_entre_obligacion_y_evento.md)
- [42_contrato_operativo_verification_centers.md](./42_contrato_operativo_verification_centers.md)
- [43_contrato_reporte_hacia_agente_de_centro.md](./43_contrato_reporte_hacia_agente_de_centro.md)
- [44_politica_tipos_documentales_oficiales.md](./44_politica_tipos_documentales_oficiales.md)
- [45_unicidad_logica_del_expediente.md](./45_unicidad_logica_del_expediente.md)
- [46_matriz_visibilidad_documental_del_propietario.md](./46_matriz_visibilidad_documental_del_propietario.md)
- [48_modelo_canonico_permisos_internos_del_intermediario.md](./48_modelo_canonico_permisos_internos_del_intermediario.md)
- [49_contrato_canonico_remision_verificaciones.md](./49_contrato_canonico_remision_verificaciones.md)
- [50_contrato_canonico_conceptos_economicos_por_verificacion.md](./50_contrato_canonico_conceptos_economicos_por_verificacion.md)
- [51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md](./51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md)
- [52_contrato_maestro_del_modelo_bd.md](./52_contrato_maestro_del_modelo_bd.md)

Este documento debe mantenerse alineado al contrato maestro y no puede contradecir la fuente estructural ni la fuente semantica del modelo.

`Vera` debe servir como plataforma de control de verificaciones para autotransporte, con estas metas:

- centralizar el padrón de vehículos;
- controlar verificaciones físico-mecánicas y emisiones;
- separar propietario, cliente y poseedor legal;
- permitir que cada propietario vea solo sus vehículos;
- permitir que los roles internos autorizados vean la operación y la contabilidad según su alcance;
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
- `internal_roles`
- `internal_permissions`
- `internal_role_permissions`
- `user_internal_roles`

Responsabilidad:

- autenticar usuarios;
- distinguir superusuario técnico de permisos internos por rol;
- limitar qué vehículos puede consultar cada usuario.

### 2. Personas y empresas

Tablas:

- `parties`
- `vehicle_party_roles`
- `party_owner_status_history`
- `party_contacts`

Responsabilidad:

- modelar clientes, propietarios y poseedores legales;
- modelar si el propietario esta activo, suspendido o dado de baja en Vera;
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
- `verification_center_contacts`
- `verification_events`
- `verification_schedule_rules`

Responsabilidad:

- registrar eventos de verificación;
- guardar vigencias;
- cerrar seguimiento operativo sin confundirlo con cumplimiento vigente;
- identificar sede y contacto primario del centro;
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
- distinguir tipos oficiales nucleares y auxiliares;
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
- preparar solicitudes operativas minimizadas hacia centros;
- evitar duplicados;
- llevar bitácora de envío por correo y WhatsApp.

### 7. Gestión y contabilidad

Tablas:

- `service_orders`
- `service_order_items`

Lectura canonica:

- `service_orders` funciona como encabezado de remision por unidad;
- `service_order_items` concentra los conceptos economicos de esa remision.
- cada renglon debe poder identificar si cobra una verificacion puntual o un concepto de orden.
- la deuda nace en `receivable_documents` y se cancela solo mediante `payment_applications`.

Responsabilidad:

- registrar remisiones o servicios;
- separar importes y conceptos;
- restringir esa información a roles internos autorizados.

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

### Roles internos autorizados

Pueden ver, según su rol:

- todos los vehículos;
- relaciones jurídicas;
- verificaciones;
- PDFs;
- remisiones;
- montos y contabilidad cuando su permiso interno lo autorice;
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
