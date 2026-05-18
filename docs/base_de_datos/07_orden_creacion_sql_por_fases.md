# Orden de Creación SQL por Fases

## Objetivo

Definir el orden recomendado para crear la base de datos de **Vera** y justificar por qué el modelo debe implementarse por fases y no como un bloque único.

## Por qué se divide en fases

La división por fases no es un tema de comodidad; responde a tres razones técnicas y de negocio.

### 1. Dependencia entre tablas

No todas las tablas tienen el mismo nivel de dependencia.

Ejemplo:

- `vehicles` puede existir sin `notification_batches`;
- `notification_batches` no tiene sentido sin `users`, `parties`, `report_recipients` y reglas previas;
- `payment_applications` no puede existir correctamente sin `payment_transactions` y `receivable_documents`.

Si intentas crear todo al mismo tiempo:

- aumentas el riesgo de errores de claves foráneas;
- complicas las migraciones;
- vuelves más difícil probar cada bloque.

### 2. Reducción de riesgo

Vera tiene componentes con criticidad distinta:

- el padrón de vehículos y verificaciones es núcleo del negocio;
- la analítica es importante, pero puede vivir sobre la operación ya establecida;
- la cobranza tiene reglas propias y requiere más control.

Implementar por fases permite:

- validar el modelo operativo primero;
- evitar que reportes, analítica o cobranza bloqueen la salida inicial;
- corregir el modelo base antes de construir capas más complejas.

### 3. Entrega incremental de valor

El proyecto ya puede generar valor desde la primera fase si resuelve:

- padrón;
- verificaciones;
- acceso por propietario;
- documentos PDF.

No necesitas esperar a tener:

- automatización completa;
- proyecciones estadísticas;
- cartera y cobranza;

para empezar a usar Vera.

## Principio de implementación

La base de datos debe crecer en este orden:

1. **identidad y acceso**
2. **operación y cumplimiento**
3. **documentos**
4. **reportes y notificaciones**
5. **analítica**
6. **cobranza**

Ese orden minimiza dependencias y maximiza utilidad temprana.

## Fase 1. Núcleo operativo mínimo

## Objetivo

Poder registrar vehículos, relacionarlos con clientes/propietarios y consultar su estado básico.

## Tablas

- `parties`
- `users`
- `vehicles`
- `vehicle_party_roles`
- `user_vehicle_access`

## Por qué va primero

Estas tablas definen:

- quién existe en el sistema;
- qué vehículos existen;
- qué relación tiene cada parte con cada vehículo;
- qué usuario puede consultar qué vehículos.

Sin esta fase no puedes construir nada confiable encima.

## Valor entregado

- padrón inicial;
- acceso restringido por usuario;
- estructura jurídica y operativa básica.

## Fase 2. Cumplimiento regulatorio

## Objetivo

Registrar verificaciones, vigencias y reglas de calendario.

## Tablas

- `verification_centers`
- `verification_events`
- `verification_schedule_rules`

## Dependencias

Depende de:

- `vehicles`

Puede existir sin:

- notificaciones;
- analítica;
- cobranza.

## Por qué va en segunda fase

Porque aquí nace el valor principal del producto:

- saber si un vehículo está vigente;
- saber cuándo vence;
- segmentar por régimen y marcador de placa.

## Valor entregado

- control de físico-mecánica;
- control de emisiones;
- reportes básicos de pendientes.

## Fase 3. Expediente documental

## Objetivo

Soportar PDFs escaneados y versión documental por vehículo.

## Tablas

- `documents`
- `document_files`

## Dependencias

Depende de:

- `vehicles`
- opcionalmente `parties`
- opcionalmente `users`
- relación funcional con `verification_events`

## Por qué va después del cumplimiento

Porque el documento debe respaldar un hecho operativo ya existente:

- tarjeta;
- constancia;
- permiso;
- contrato.

Primero defines el proceso; después lo documentas digitalmente.

## Valor entregado

- expediente PDF por vehículo;
- evidencia para consulta del propietario;
- soporte para auditoría y validación.

## Fase 4. Reportes y notificaciones

## Objetivo

Automatizar avisos y preparar reportes por cliente.

## Tablas

- `party_contacts`
- `report_recipients`
- `notification_log`
- `message_templates`
- `notification_rules`
- `notification_batches`
- `notification_batch_items`

## Dependencias

Depende de:

- `parties`
- `users`
- `vehicles`
- `verification_events`

## Por qué va en esta fase

Porque primero necesitas:

- padrón confiable;
- fechas correctas;
- clientes correctamente relacionados;
- contactos válidos.

Notificar antes de consolidar eso produce ruido y errores.

## Valor entregado

- reportes por cliente;
- alertas automáticas;
- historial de envíos;
- operación semiautomatizada.

## Fase 5. Analítica operativa

## Objetivo

Medir comportamiento, carga, historia y capacidad.

## Tablas

- `vehicle_status_history`
- `daily_vehicle_status_snapshot`
- `verification_sessions`
- `verification_center_capacity_daily`
- `calendar_business_days`
- `data_quality_issues`

## Dependencias

Depende de:

- `vehicles`
- `verification_events`
- `verification_centers`
- `users`

## Por qué no debe ir al inicio

Porque la analítica depende de una operación ya viva.

Sin operación estable:

- no hay historia útil;
- no hay demanda real;
- no hay tiempos reales de atención;
- no hay base estadística confiable.

## Valor entregado

- proyecciones;
- saturación por centro;
- backlog;
- snapshots diarios;
- control de calidad del dato.

## Fase 6. Gestión y cobranza

## Objetivo

Controlar servicios, cargos, pagos, deuda y cartera.

## Tablas

- `service_orders`
- `service_order_items`
- `client_accounts`
- `receivable_documents`
- `receivable_installments`
- `payment_transactions`
- `payment_applications`
- `account_movements`

## Dependencias

Depende de:

- `parties`
- `users`
- `vehicles`
- opcionalmente `service_orders` como origen del cobro

## Por qué va al final

Porque es una capa administrativa más delicada:

- afecta saldo del cliente;
- requiere mayor trazabilidad;
- tiene impacto contable;
- no debe improvisarse.

Además, puede avanzar después de que la operación principal ya sea estable.

## Valor entregado

- control de cartera;
- deuda vigente y vencida;
- pagos parciales;
- estado de cuenta;
- soporte de cobranza.

## Orden resumido

```text
Fase 1: parties, users, vehicles, vehicle_party_roles, user_vehicle_access
Fase 2: verification_centers, verification_events, verification_schedule_rules
Fase 3: documents, document_files
Fase 4: party_contacts, report_recipients, message_templates, notification_rules,
         notification_batches, notification_batch_items, notification_log
Fase 5: vehicle_status_history, daily_vehicle_status_snapshot, verification_sessions,
         verification_center_capacity_daily, calendar_business_days, data_quality_issues
Fase 6: service_orders, service_order_items, client_accounts, receivable_documents,
         receivable_installments, payment_transactions, payment_applications, account_movements
```

## Recomendación práctica

Si Vera se implementa en Nest con PostgreSQL:

- cada fase debería corresponder a un bloque de migraciones;
- cada fase debería tener sus propias pruebas;
- no se debe abrir la siguiente fase hasta validar integridad de la anterior.

## Relación con módulos Nest

### Fase 1

- `auth`
- `users`
- `parties`
- `vehicles`
- `access`

### Fase 2

- `verifications`
- `schedule-rules`

### Fase 3

- `documents`

### Fase 4

- `reports`
- `notifications`

### Fase 5

- `analytics`
- `capacity`
- `data-quality`

### Fase 6

- `service-orders`
- `billing`
- `collections`

## Conclusión

Dividir Vera por fases permite:

- construir primero el núcleo del negocio;
- reducir riesgo técnico;
- evitar complejidad prematura;
- liberar valor temprano;
- mantener trazabilidad en un modelo que va creciendo.

La división correcta no es por cantidad de tablas, sino por:

- dependencia;
- criticidad;
- valor operativo;
- madurez del dato.
