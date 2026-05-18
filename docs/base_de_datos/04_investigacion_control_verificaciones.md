# Investigación: Problemática de Control de Verificaciones

**Fecha:** Mayo 2026  
**Alcance:** Análisis de riesgos y gaps en el control de verificaciones físico-mecánicas y emisiones

## 1. Introducción

El sistema `vera-backend` centraliza la gestión de verificaciones para autotransporte con múltiples entidades (usuarios, propietarios, vehículos, centros verificadores) y reglas complejas por régimen y marcador de placa. Sin un control riguroso, surgen riesgos operativos, legales y de auditoría.

---

## 1.1 Frecuencia de Verificaciones según NOM

**Marco Regulatorio:**
- **NOM-041-SEMARNAT-2006**: Regula la verificación de emisiones contaminantes en zonas metropolitanas.
- **NOM-045-SEMARNAT-2017**: Regula la verificación de emisiones contaminantes para vehículos de autotransporte federal con diésel.
- **NOM-167-SEMARNAT-2017**: Regula la verificación físico-mecánica de vehículos.
- **NOM-068-SCT-2-2014**: Condiciones físico-mecánicas para autotransporte federal.

**Frecuencia General:**
- **Verificación de emisiones**: 
  - En zonas metropolitanas: Obligatoria **una vez al año** para hologramas 1 y 2.
  - En régimen federal (autotransporte con diésel): Obligatoria **dos veces al año** (semestral), según NOM-045-SEMARNAT-2017.
- **Verificación físico-mecánica**: Obligatoria **una vez al año** para autotransporte federal y estatal con hologramas 1 y 2.

**Calendario de Verificación de Emisiones (Zonas Metropolitanas):**
El mes de verificación se determina por el **último dígito** de la placa (para régimen federal) o **penúltimo** (estatal), según el Programa de Verificación Vehicular.

| Dígito | Mes de Verificación |
|--------|---------------------|
| 1 | Enero |
| 2 | Febrero |
| 3 | Marzo |
| 4 | Abril |
| 5 | Mayo |
| 6 | Junio |
| 7 | Julio |
| 8 | Agosto |
| 9 | Septiembre |
| 0 | Octubre |

**Calendario de Verificación de Emisiones (Régimen Federal, Autotransporte con Diésel):**
Obligatoria semestralmente. El calendario específico se determina por la SCT y puede variar; consultar NOM-045-SEMARNAT-2017 y avisos oficiales para 2026. Generalmente, se divide en dos periodos: enero-junio y julio-diciembre, con asignación por dígito de placa.

**Calendario de Verificación Físico-Mecánica (Autotransporte Federal, 2016 en adelante):**
Según el Aviso de la SCT (DOF 15/05/2015), los dígitos se agrupan en pares con periodos trimestrales.

| Dígitos | Meses de Verificación |
|---------|-----------------------|
| 5 ó 6 | Enero, Febrero, Marzo, Abril |
| 7 u 8 | Marzo, Abril, Mayo, Junio |
| 3 ó 4 | Mayo, Junio, Julio, Agosto |
| 1 ó 2 | Julio, Agosto, Septiembre, Octubre |
| 9 ó 0 | Septiembre, Octubre, Noviembre, Diciembre |

**Nota:** Al terminar el último día del mes correspondiente, los vehículos caen en estado vencido si no han sido verificados.

**Tipos de Hologramas y Frecuencia:**
- **Holograma 0 (Azul)**: Exento de verificación en zonas de verificación (ej. CDMX). En otras entidades, puede requerir verificación semestral o anual.
- **Holograma 1 (Verde)**: Verificación anual en el mes correspondiente al dígito.
- **Holograma 2 (Amarillo)**: Verificación anual en el mes correspondiente al dígito.
- **Holograma Doble 0**: Exento.

**Notas Importantes:**
- Las verificaciones de emisiones y físico-mecánica se realizan **conjuntamente** en centros de verificación vehicular para hologramas 1 y 2.
- Para físico-mecánica en autotransporte federal, se realiza en Unidades de Verificación acreditadas por SCT.
- Vehículos nuevos: Primera verificación en el año siguiente al de fabricación.
- Vigencia: El holograma es válido por **un año** a partir de la fecha de aprobación.
- Excepciones: Vehículos con menos de 2 años de antigüedad pueden estar exentos inicialmente.
- Zonas: Obligatorio en zonas de verificación para emisiones; para físico-mecánica, obligatorio en caminos federales.

**Impacto en el Sistema:**
El cálculo de fechas de vencimiento debe considerar el régimen (federal/estatal), tipo de verificación (emisiones/físico-mecánica), frecuencia (anual/semestral), marcador de placa y tipo de holograma para determinar la próxima verificación.

---

## 2. Problemáticas Identificadas

### 2.11 Impacto Financiero: Costos de Multas por Incumplimiento según NOM

**Problema:**  
Sin un control efectivo de verificaciones, los propietarios incurren en multas regulatorias por circular sin verificaciones vigentes, generando costos significativos y pérdida de confianza.

**Marco Regulatorio:**  
Las verificaciones vehiculares en México están reguladas por:
- **NOM-041-SEMARNAT-2006**: Emisiones contaminantes para vehículos en circulación.
- **NOM-167-SEMARNAT-2017**: Verificación físico-mecánica de vehículos.
- **Ley General del Equilibrio Ecológico y la Protección al Ambiente (LGEEPA)**: Establece sanciones.
- **Ley de Movilidad y Transporte**: Multas por circulación sin verificaciones.

**Costos de Multas (2026, aproximados):**

| Tipo de Infracción | Primera Infracción | Reincidencia |
|-------------------|-------------------|--------------|
| Circulación sin verificación físico-mecánica | 25 UMAs (~$3,200 MXN) | 40 UMAs (~$5,100 MXN) |
| Circulación sin verificación de emisiones | 25 UMAs (~$3,200 MXN) | 40 UMAs (~$5,100 MXN) |
| Circulación con hologramas vencidos | 30 UMAs (~$3,800 MXN) | 50 UMAs (~$6,400 MXN) |
| Falsificación de hologramas | 100 UMAs (~$12,800 MXN) | Hasta 200 UMAs (~$25,600 MXN) |

**Notas:**
- **UMA (Unidad de Medida y Actualización)**: Valor diario para 2026 ≈ $128 MXN (actualizado anualmente por INEGI).
- Multas varían por entidad federativa (federal vs. estatal).
- Reincidencia se considera dentro de los 365 días siguientes.
- Costos adicionales: Retención del vehículo hasta pago de multa, posibles sanciones administrativas.

**Impacto en el Sistema:**
- Propietarios pueden demandar compensación por notificaciones tardías o errores en el control.
- Pérdida de reputación si el sistema no previene vencimientos.
- Costos operativos adicionales por gestión de disputas.

**Solución Propuesta:**
- Integrar alertas financieras en reportes: Mostrar costo estimado de multa por vehículo vencido.
- Dashboard con "riesgo financiero total" por cliente.
- Automatización de recordatorios con cálculo de multas potenciales.

---

### 2.1 Falta de Auditoría Completa

**Problema:**  
No registrar quién, cuándo y por qué cambió el estado de una verificación deja a la organización vulnerable ante:
- Cuestionamientos regulatorios.
- Disputas con propietarios sobre fechas y estados.
- Imposibilidad de rastrear errores humanos o maliciosos.

**Impacto:**
- Sin trazabilidad, es imposible reconstruir la cadena de eventos ante un incidente.
- Propietarios pueden no saber si el cambio fue automático, manual o por error.

**Solución Propuesta:**
- Tabla de auditoría: `verification_audit_log` que registre:
  - `id`, `verification_event_id`, `user_id`, `change_type`, `old_value`, `new_value`, `timestamp`, `reason`, `ip_address`
  - Todos los cambios deben ser inmutables (insert-only).

---

### 2.2 Inconsistencia de Estados en Tiempo Real

**Problema:**  
La vista `vw_vehicle_verification_status` consolida estados, pero si no se actualiza en tiempo real o hay conflictos entre:
- El evento registrado en base de datos.
- La fecha de vigencia calculada.
- El estado derivado (VIGENTE, POR_VENCER, VENCIDO).

Pueden coexistir múltiples "verdades" en el sistema.

**Impacto:**
- Un vehículo aparece VIGENTE en el portal, pero en realidad se vence hoy.
- Propietarios reciben notificaciones confusas o tardías.
- Reportes de administrador no coinciden con la realidad operativa.

**Solución Propuesta:**
- Crear un **estado materializado y versionado**:
  - Tabla: `verification_status_snapshot` que capture el estado en momentos clave.
  - Trigger o job que recalcule y valide consistencia diaria.
  - Alerta automática si hay divergencia entre estado calculado y registrado.

---

### 2.4 Falta de Validación de Integridad de Datos

**Problema:**  
Sin validación en la inserción o actualización de verificaciones, pueden ocurrir errores como:
- Fecha de vigencia anterior a la fecha de emisión.
- Varias verificaciones activas simultáneamente para el mismo tipo en un vehículo.
- Centro verificador inexistente.
- Régimen del vehículo no coincide con la regla aplicada.

**Impacto:**
- Cálculos incorrectos de pendientes y vencimientos.
- Reportes corruptos.
- Automatización de notificaciones envía avisos errados.

**Solución Propuesta:**
- **Constraints y validaciones en BD:**
  - `CHECK` para fechas lógicas.
  - Índice único con condición: `UNIQUE (vehicle_id, verification_type, is_current) WHERE is_current = true`.
  - Foreign keys con `ON DELETE RESTRICT`.

- **Validación de lógica en aplicación:**
  - DTO con validadores personalizados antes de guardar.
  - Endpoint de validación previo: `POST /verification/validate` antes de confirmar.

---

### 2.5 Pérdida de Historial y Versioning

**Problema:**  
Si se elimina o sobrescribe un registro de verificación, no hay forma de saber cuál fue el estado anterior. Esto es crítico para:
- Disputas legales.
- Auditorías internas.
- Análisis de tendencias.

**Impacto:**
- No se puede responder "¿cuándo fue la última vez que estuvo vigente?".
- Imposible detectar cambios no autorizados.

**Solución Propuesta:**
- **Soft deletes:** Nunca eliminar; marcar como `deleted_at`.
- **Tabla de historial:** `verification_event_history` que capture:
  - Versión anterior de cada campo importante.
  - Timestamp de cada cambio.
  - Razón del cambio (según categoría: sistema, usuario, corrección, etc.).

---

### 2.6 Gestión de Centros Verificadores y Expedientes

**Problema:**  
La tabla `verification_centers` puede desactualizar (cambios de domicilio, horarios, estatus regulatorio) sin que haya trazabilidad. Además:
- Un centro podría estar inactivo pero aún vinculado a verificaciones recientes.
- Los expedientes PDF (`documents` y `document_files`) no tienen auditoría de acceso.
- Falta de validación de que el centro que realizó la verificación sigue siendo válido.

**Impacto:**
- Reportes direccionan a clientes a centros desactualizados.
- Falta de trazabilidad sobre quién accedió a documentos confidenciales.
- Nulo control sobre integridad de PDFs escaneados.

**Solución Propuesta:**
- **Auditoría de centros:** Agregar `verification_center_audit`:
  - `id`, `center_id`, `change_type`, `change_details`, `timestamp`, `changed_by`.

- **Auditoría de acceso a documentos:** Agregar `document_access_log`:
  - `id`, `document_id`, `user_id`, `accessed_at`, `ip_address`, `action` (view, download).

- **Validación de centro:** Al crear verificación, verificar que el centro no esté marcado como inactivo o derogado.

---

### 2.7 Automatización de Notificaciones sin Reconciliación

**Problema:**  
El flujo de `notification_batches`, `notification_batch_items` y `notification_log` puede causar:
- Duplicados: la misma notificación enviada dos veces en el mismo período.
- Huérfanos: registros de notificación sin correlato en verificación.
- Falta de reconciliación: no se sabe si la notificación llegó realmente al propietario.

**Impacto:**
- Propietarios reciben avisos redundantes, perdiendo confianza.
- Falsos positivos en reportes de "notificaciones enviadas".
- No hay forma de saber si el propietario vio o actuó sobre el aviso.

**Solución Propuesta:**
- **Idempotencia:** Implementar `dedupe_key` con índice único.
- **Reconciliación:** Agregar estados en `notification_log`:
  - `PENDING`, `SENT`, `DELIVERED`, `FAILED`, `BOUNCED`.
- **Reporte de efectividad:** Vista que cruce notificaciones enviadas vs. verificaciones actualizadas.
- **Job de reconciliación:** Ejecutarse diariamente para detectar notificaciones antiguas sin confirmación.

---

### 2.8 Falta de Validación de Reglas de Calendario

**Problema:**  
Las reglas en `verification_schedule_rules` definen el marcador de placa (3er o 4to dígito según régimen), pero:
- No hay validación de que `schedule_marker_effective` en `vehicles` sea consistente.
- Cambios manuales a `schedule_marker_effective` sin auditoría.
- Reglas obsoletas no se limpian.

**Impacto:**
- Cálculos incorrectos de próxima verificación.
- Propietarios reciben avisos en fechas equivocadas.
- Reportes de pendientes no son precisos.

**Solución Propuesta:**
- **Validación en vehículo:** Crear función `verify_schedule_consistency(vehicle_id)` que:
  - Calcule el marcador esperado.
  - Compare con `schedule_marker_effective`.
  - Reporte discrepancias.

- **Auditoría de cambios en marcador:** Registrar en `vehicle_audit` cualquier cambio a `schedule_marker_effective`.

---

### 2.9 Segregación de Acceso sin Verificación

**Problema:**  
La vista `vw_owner_vehicle_status` restringe datos para el propietario, pero sin auditoría de quién accedió qué y cuándo. Además:
- Sin logs, es imposible detectar intentos de acceso no autorizado.
- Cambios en permisos no se registran.

**Impacto:**
- Propietarios podrían desconfiar del acceso a sus datos.
- Imposible cumplir RGPD/GDPR si es aplicable.
- Auditoría externa: no hay evidencia de cumplimiento.

**Solución Propuesta:**
- **Access log:** Tabla `user_vehicle_access_log`:
  - `id`, `user_id`, `vehicle_id`, `access_type` (read, write), `timestamp`, `ip_address`, `endpoint`.

---

### 2.10 Concurrencia y Condiciones de Carrera

**Problema:**  
Si dos procesos actualizan simultáneamente el estado de una verificación:
- Sin locks optimistas/pesimistas, ambos pueden escribir.
- No hay garantía de consistencia final.

**Impacto:**
- Un estado antiguo sobrescribe uno nuevo.
- Notificaciones se envían basadas en datos inconsistentes.

**Solución Propuesta:**
- **Versionado optimista:** Agregar `version` a `verification_events`:
  - Cada actualización incrementa versión.
  - Update incluye `WHERE id = ? AND version = ?`.
  - Retry en caso de conflicto.

---

### 2.11 Falta de Métricas y Alertas

**Problema:**  
Sin monitoreo proactivo, los problemas solo se detectan cuando los propietarios reclaman:
- Nunca sabes qué porcentaje de vehículos está actualizado.
- No hay alerta si repentinamente hay muchos vehículos vencidos.
- Imposible identificar patrones (ej. "los vehículos del cliente X siempre vencen juntos").

**Impacto:**
- Gestión reactiva, no proactiva.
- Riesgo regulatorio no detectado.

**Solución Propuesta:**
- **Tabla de métricas:** `verification_metrics_daily`:
  - `date`, `total_vehicles`, `vigent_count`, `pending_count`, `expired_count`, `without_registry_count`.

- **Alertas automáticas:**
  - Si `expired_count` crece > 10% desde ayer.
  - Si algún centro verificador no ha procesado registros en 30 días.
  - Si tasa de fallos en notificaciones > 5%.

---

## 3. Matriz de Priorización

| Problema | Severidad | Complejidad | Prioridad |
|----------|-----------|-------------|-----------|
| Falta de auditoría | ALTA | MEDIA | **P1** |
| Inconsistencia de estados | ALTA | MEDIA | **P1** |
| Validación de integridad | ALTA | BAJA | **P1** |
| Historial y versioning | ALTA | MEDIA | **P2** |
| Gestión de centros | MEDIA | MEDIA | **P2** |
| Automatización sin reconciliación | MEDIA | MEDIA | **P2** |
| Impacto financiero | MEDIA | BAJA | **P2** |
| Validación de calendario | MEDIA | BAJA | **P3** |
| Acceso sin verificación | MEDIA | BAJA | **P3** |
| Concurrencia | BAJA | ALTA | **P4** |
| Falta de métricas | BAJA | BAJA | **P4** |

---

## 4. Roadmap de Implementación

### **Fase 1 (Semanas 1-2): Auditoría y Validación**
- Crear `verification_audit_log`.
- Implementar constraint `UNIQUE` para verificaciones activas.
- Agregar validadores en DTO.

### **Fase 2 (Semanas 3-4): Integridad de Datos**
- Crear `verification_status_snapshot` y job de reconciliación.
- Soft deletes en `verification_events`.
- Validación de centros verificadores.

### **Fase 3 (Semanas 5-6): Trazabilidad**
- Auditoría de acceso a documentos.
- Access log para vehículos.
- Versionado optimista.

### **Fase 4 (Semanas 7-8): Monitoreo**
- Métricas diarias.
- Alertas automáticas.
- Dashboard de control.

---

## 5. Recomendaciones Técnicas

1. **Inmutabilidad:** Log de auditoría debe ser append-only.
2. **Índices:** Crear sobre `verification_event_id`, `user_id`, `timestamp` en audit log.
3. **Retención:** Política de backup antes de limpiar logs antiguos.
4. **Permisos:** Solo administrador puede ver logs de acceso y auditoría.
5. **Testing:** Unit tests para validadores, integration tests para triggers.

---

## 6. Conclusión

El sistema actual tiene vulnerabilidades críticas en visibilidad, trazabilidad e integridad de datos. Implementar estas mejoras no solo fortalecerá la confiabilidad operativa, sino que también preparará al sistema para auditorías regulatorias y escalamiento futuro.

