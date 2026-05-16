# Contrato de Preview y Creacion de Lotes - Fase 4

## Objetivo

Definir el contrato documental de:

- `POST /notifications/batches/preview`
- `POST /notifications/batches`

sin abrir aun implementacion operativa.

La prioridad aqui es dejar un flujo defendible para base de datos:

- determinista;
- idempotente;
- auditable;
- resistente a duplicados.

## Principios

### 1. Preview no equivale a envio

El preview debe resolver:

- candidatos;
- destinatarios;
- regla;
- plantilla;
- exclusiones;
- duplicados detectados.

Pero no debe disparar envio.

### 2. Creacion debe ser idempotente

Crear lote con el mismo conjunto de candidatos no debe producir duplicados si ya existe un lote abierto con la misma llave documental.

### 3. El lote debe congelar su base

El lote no debe depender de releer en caliente:

- reglas;
- plantillas;
- filtros;
- estado de candidatos.

Por eso el create debe persistir snapshot suficiente.

## `POST /notifications/batches/preview`

## Finalidad

Permitir revision administrativa antes de crear un lote.

## Entrada minima

Filtros base:

- `clientPartyId`
- `vehicleId`
- `verificationType`
- `regime`
- `complianceStatus`
- `candidateReason`
- `daysToDueFrom`
- `daysToDueTo`
- `onlyEligible`

Parametros de resolucion:

- `reportType`
- `channel`
- `ruleId`
- `templateId`
- `scheduledFor`

Controles:

- `limit`
- `offset`
- `persistAsDraft`

## Reglas de validacion documental

- `reportType` es obligatorio.
- `channel` es obligatorio.
- `limit` debe quedar acotado administrativamente.
- si llega `ruleId`, debe ser compatible con `reportType`, `verificationType` y `regime`.
- si llega `templateId`, debe coincidir con `channel` y `reportType`.
- `scheduledFor`, si existe, debe ser futura.

## Salida minima esperada

Metadatos:

- `generatedAt`
- `previewHash`
- `previewExpiresAt`
- `reportType`
- `channel`
- `scheduledFor`

Resumen:

- `candidateCount`
- `eligibleCount`
- `suppressedCount`
- `openBatchConflictCount`
- `missingRecipientCount`
- `missingTemplateCount`

Resolucion:

- `ruleResolved`
- `templateResolved`
- `recipientResolutionMode`

Detalle:

- `items[]`

Cada item debe incluir al menos:

- `clientPartyId`
- `clientDisplayName`
- `partyContactId`
- `vehicleId`
- `plate`
- `verificationType`
- `complianceStatus`
- `candidateReason`
- `dueAnchorDate`
- `daysToDue`
- `obligationId`
- `itemKey`
- `isEligible`
- `suppressionReason`

## Semantica de `previewHash`

`previewHash` debe representar un hash estable de:

- filtros normalizados;
- canal;
- tipo de reporte;
- regla resuelta;
- plantilla resuelta;
- conjunto ordenado de `itemKey`.

No debe depender de:

- orden visual de respuesta;
- ids temporales del proceso;
- timestamps no funcionales.

## `persistAsDraft`

Si `persistAsDraft = false`:

- el preview es solo de lectura;
- no crea filas en `notification_batches`.

Si `persistAsDraft = true`:

- puede crear un `notification_batches` en `DRAFT`;
- debe congelar `filters_json`, `source_snapshot_hash` y `preview_generated_at`;
- no debe crear `notification_log`.

## `POST /notifications/batches`

## Finalidad

Materializar un lote administrativamente valido para ejecucion posterior.

## Entrada minima

Modo recomendado:

- `previewHash`
- `idempotencyKey`
- `scheduledFor`
- `persistMode`

Modo alterno:

- `draftBatchId`
- `idempotencyKey`

## Reglas de validacion documental

- `idempotencyKey` es obligatoria.
- si llega `previewHash`, debe seguir vigente respecto a `previewExpiresAt`.
- si llega `draftBatchId`, el lote debe estar en `DRAFT`.
- no debe crearse lote si existe otro lote abierto con el mismo `batch_dedupe_key`.
- no debe crearse lote si el preview no tiene items elegibles.
- si el lote nace programado, debe salir en `SCHEDULED`; si no, en `READY`.

## Persistencia minima al crear

En `notification_batches`:

- snapshot de filtros;
- `source_snapshot_hash`;
- `batch_dedupe_key`;
- `report_recipient_id` resuelto;
- `rule_id` y `template_id`;
- `item_count_expected` e `item_count_final`.

En `notification_batch_items`:

- un renglon por `itemKey`;
- snapshot de `client_party_id`, `party_contact_id`, `vehicle_id`, `obligation_id`;
- `due_anchor_date`, `days_to_due`, `candidate_reason`;
- `final_status = PENDING`.

No debe escribir `notification_log` en esta etapa.

## Salida minima esperada

- `batchId`
- `status`
- `batchDedupeKey`
- `previewHash`
- `itemCount`
- `scheduledFor`
- `createdAt`

## Reglas de deduplicacion

### Lote

`batch_dedupe_key` debe construirse con:

- `reportType`
- `channel`
- `ruleId`
- `partyContactId`
- fecha logica del lote
- `previewHash`

### Item

`itemKey` debe construirse con:

- `clientPartyId`
- `vehicleId`
- `verificationType`
- `dueAnchorDate`
- `candidateReason`

## Conflictos que el preview debe exponer

El preview debe marcar explicitamente:

- candidato sin destinatario activo;
- candidato sin consentimiento de canal;
- candidato sin plantilla activa;
- candidato ya cubierto por lote abierto;
- candidato suprimido por dedupe;
- candidato con dato base insuficiente.

## Reglas de mutabilidad

### Antes de `READY`

Se permite:

- cancelar `DRAFT`;
- regenerar preview;
- recalcular items;
- cambiar `scheduledFor`.

### Desde `READY`

No debe cambiar:

- `source_snapshot_hash`
- `filters_json`
- `batch_dedupe_key`
- `itemKey`
- `rule_id`
- `template_id`

Solo pueden cambiar:

- `status`
- timestamps operativos
- contadores de progreso

## Relacion con la base de datos

Este contrato depende de lo definido en:

- [25_estados_canonicos_notificaciones_fase_4.md](./25_estados_canonicos_notificaciones_fase_4.md)
- [26_contrato_vw_notification_candidates_y_permisos_fase_4.md](./26_contrato_vw_notification_candidates_y_permisos_fase_4.md)
- [27_llaves_restricciones_indices_fase_4.md](./27_llaves_restricciones_indices_fase_4.md)

## Criterio documental de aceptacion

Este contrato se considera suficiente cuando:

- separa preview de create;
- deja clara la idempotencia del create;
- obliga a persistir snapshot suficiente;
- permite crear lotes sin ambiguedad sobre dedupe o elegibilidad.
