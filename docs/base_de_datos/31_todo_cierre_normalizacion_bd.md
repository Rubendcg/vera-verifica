# TODO de Cierre y Normalizacion de la Base de Datos

## Objetivo

Definir la lista de trabajo documental para dejar la base de datos de **Vera** estructuralmente cerrada antes de seguir con desarrollo funcional.

Este TODO busca que, al terminarlo, la normalizacion del modelo quede concluida y no sea necesario seguir haciendo cambios estructurales salvo por requerimientos excepcionales controlados.

## Regla de trabajo

Mientras este TODO no quede cerrado:

- no abrir mas codigo funcional nuevo por modulo;
- no abrir migraciones estructurales nuevas sin antes aprobar el cambio en documentos;
- no declarar terminado el modelo de datos;
- no usar el diagrama final como contrato cerrado.

## Convencion de estado

Cada tarea debe manejarse con uno de estos estados:

- `TODO`
- `EN_REVISION`
- `CERRADO`

## Bloque A. Gobierno del modelo

### NORM-001 - Fijar el enunciado canonico del negocio

Estado: `CERRADO`

Objetivo:

- dejar por escrito el alcance exacto de Vera como intermediario.

Entregable documental:

- `32_enunciado_canonico_del_negocio_vera.md`;
- ajuste de documentos maestros para que todos describan el mismo negocio.

Criterio de cierre:

- ya no exista contradiccion entre roadmap, diagrama, glosario y narrativa funcional.

### NORM-002 - Congelar la regla de trabajo del proyecto

Estado: `CERRADO`

Objetivo:

- formalizar que primero se cierra el modelo y despues se desarrolla.

Entregable documental:

- `33_gobierno_del_cierre_estructural_bd.md`;
- referencia explicita desde roadmap e indice documental.

Criterio de cierre:

- el proyecto tenga una regla explicita de no tocar estructura sin cambio documental previo.

## Bloque B. Identidad y vida del vehiculo

### NORM-003 - Cerrar la identidad maestra del vehiculo

Estado: `CERRADO`

Objetivo:

- definir si `serial_niv` es obligatorio para toda unidad operativa;
- definir si la placa se trata como atributo mutable.

Entregable documental:

- `34_politica_identidad_maestra_del_vehiculo.md`;
- ajuste de enunciado, tablas, diagrama, glosario e indice documental.

Criterio de cierre:

- exista una regla canonica sobre serie, placa y altas incompletas.

### NORM-004 - Definir el estado de vida del vehiculo

Estado: `CERRADO`

Objetivo:

- modelar separado del estado regulatorio si el vehiculo esta:
  `ACTIVE`, `SUSPENDED`, `TRANSFERRED`, `DEREGISTERED` o equivalente.

Entregable documental:

- `35_submodelo_estado_de_vida_del_vehiculo.md`;
- ajuste de enunciado, tablas, diagrama, glosario e indice documental.

Criterio de cierre:

- ya no se use `is_active` como sustituto de todo el estado administrativo.

### NORM-005 - Cerrar el modelo de cambios reportados por el propietario

Estado: `CERRADO`

Objetivo:

- separar respuesta a verificaciones de solicitudes de cambio de dueño, suspension o baja.

Entregable documental:

- `36_flujo_canonico_solicitudes_del_propietario.md`;
- ajuste de obligaciones, estado de vida, tablas, diagrama, glosario e indice documental.

Criterio de cierre:

- quede claro que `owner_response` no resuelve cambios de vida del vehiculo.

## Bloque C. Roles y relaciones juridicas

### NORM-006 - Cerrar reglas de `vehicle_party_roles`

Estado: `CERRADO`

Objetivo:

- definir unicidad y vigencia por rol.

Entregable documental:

- `37_reglas_canonicas_vehicle_party_roles.md`;
- ajuste de tablas, diagrama, glosario e indice documental.

Criterio de cierre:

- se sepa exactamente que roles admiten una sola fila vigente y cuales admiten multiples.

### NORM-007 - Definir vistas canonicas de relacion vigente

Estado: `CERRADO`

Objetivo:

- dejar claro como obtener:
  propietario vigente,
  poseedor legal vigente,
  cliente vigente,
  contacto operativo vigente.

Entregable documental:

- `38_vistas_canonicas_relacion_vigente.md`;
- ajuste de reportes, diagrama, glosario e indice documental.

Criterio de cierre:

- los reportes no dependan de interpretacion manual de historiales.

### NORM-007A - Definir estado administrativo del propietario

Estado: `CERRADO`

Objetivo:

- dejar claro si un propietario puede quedar `ACTIVE`, `SUSPENDED` o `DEREGISTERED`;
- separar ese estado del vehiculo, del rol `OWNER` y de la cuenta tecnica `user`;
- definir que solo el intermediario puede mover ese estado.

Entregable documental:

- `39_estado_administrativo_del_propietario.md`;
- ajuste de enunciado, tablas, glosario, vistas canonicas e indice documental.

Criterio de cierre:

- ya no exista ambiguedad entre propietario activo, propietario suspendido, propietario dado de baja y usuario tecnico activo.

## Bloque D. Cumplimiento regulatorio

### NORM-008 - Definir aplicabilidad de fisico-mecanica y emisiones

Estado: `CERRADO`

Objetivo:

- declarar si la aplicabilidad vive en `vehicles` o en una tabla propia.

Entregable documental:

- `40_perfil_canonico_aplicabilidad_verificaciones.md`;
- ajuste de tablas, verificaciones, reportes, glosario e indice documental.

Criterio de cierre:

- el modelo responda claramente si una unidad requiere una, dos o ninguna verificacion.

### NORM-009 - Revisar cierre entre obligacion y evento

Estado: `CERRADO`

Objetivo:

- validar que el flujo entre pendiente, programacion, realizacion y cierre ya cubre la operacion real.

Entregable documental:

- `41_cierre_canonico_entre_obligacion_y_evento.md`;
- ajuste de obligaciones, glosario, diagrama, roadmap e indice documental.

Criterio de cierre:

- no exista ambiguedad entre cumplimiento real y seguimiento operativo.

## Bloque E. Centros de verificacion

### NORM-010 - Cerrar el contrato operativo de `verification_centers`

Estado: `CERRADO`

Objetivo:

- decidir si un centro tiene un solo contacto o varios contactos operativos.

Entregable documental:

- `42_contrato_operativo_verification_centers.md`;
- ajuste de tablas, diagrama, glosario, modulos y narrativa canonica.

Criterio de cierre:

- el intermediario pueda saber a quien contactar en el centro sin improvisacion.

### NORM-011 - Definir el reporte hacia agente de centro

Estado: `CERRADO`

Objetivo:

- documentar que informacion podra salir desde Vera hacia el centro de verificacion.

Entregable documental:

- `43_contrato_reporte_hacia_agente_de_centro.md`;
- ajuste de narrativa canonica, reportes, glosario e indice documental.

Criterio de cierre:

- se sepa que datos se envian, a quien y bajo que regla.

## Bloque F. Expediente documental

### NORM-012 - Cerrar tipos documentales oficiales

Estado: `CERRADO`

Objetivo:

- declarar que el expediente base oficial del negocio esta compuesto por:
  tarjeta de circulacion,
  constancia fisico-mecanica,
  constancia de emisiones.

Entregable documental:

- `44_politica_tipos_documentales_oficiales.md`;
- ajuste de expediente documental, glosario, roadmap e indice documental.

Criterio de cierre:

- quede claro que documentos son nucleares y cuales son auxiliares.

### NORM-013 - Cerrar unicidad logica del expediente

Estado: `CERRADO`

Objetivo:

- definir cuando puede existir mas de un documento activo por tipo y por vehiculo.

Entregable documental:

- `45_unicidad_logica_del_expediente.md`;
- ajuste de expediente documental, glosario, roadmap e indice documental.

Criterio de cierre:

- el sistema pueda determinar sin duda cual es el respaldo vigente por tipo.

### NORM-014 - Cerrar visibilidad del propietario sobre documentos

Estado: `CERRADO`

Objetivo:

- confirmar que el propietario solo descarga lo que le corresponde ver.

Entregable documental:

- `46_matriz_visibilidad_documental_del_propietario.md`;
- ajuste de visor, glosario, endpoints y expediente documental.

Criterio de cierre:

- no exista ambiguedad entre expediente interno y visor del propietario.

## Bloque G. Notificaciones y seguimiento

### NORM-015 - Integrar ciclo de vida del vehiculo a notificaciones

Estado: `CERRADO`

Objetivo:

- asegurar que las alertas respeten estados como suspension, baja o transferencia.

Entregable documental:

- `47_integracion_ciclo_de_vida_a_notificaciones.md`;
- ajuste del contrato de candidatos, diseno de fase 4, reportes, glosario, roadmap e indice documental.

Criterio de cierre:

- el sistema no notifique unidades que ya no deban seguir en flujo normal.

### NORM-016 - Cerrar el modelo de permisos internos del intermediario

Estado: `CERRADO`

Objetivo:

- decidir si `is_admin` sigue siendo suficiente o si debe abrirse un modelo de roles internos.

Entregable documental:

- `48_modelo_canonico_permisos_internos_del_intermediario.md`;
- ajuste de modulos, permisos operativos, roadmap, glosario e indice documental.

Criterio de cierre:

- operacion, documentos, seguimiento y cobranza tengan una linea de acceso clara.

## Bloque H. Finanzas y remisiones

### NORM-017 - Especializar `service_orders` para verificaciones

Estado: `CERRADO`

Objetivo:

- ligar remision, folio y conceptos a la operacion real de verificacion.

Entregable documental:

- `49_contrato_canonico_remision_verificaciones.md`;
- ajuste de esquema general, tablas, diagrama, lineamientos, glosario, roadmap e indice documental.

Criterio de cierre:

- una remision pueda explicar que servicio se presto, a que vehiculo y sobre que verificacion.

### NORM-018 - Especializar `service_order_items`

Estado: `CERRADO`

Objetivo:

- definir si cada renglon debe guardar `verification_type`, referencia a evento u obligacion y monto canonico.

Entregable documental:

- `50_contrato_canonico_conceptos_economicos_por_verificacion.md`;
- ajuste de esquema general, tablas, diagrama, lineamientos, glosario, roadmap e indice documental.

Criterio de cierre:

- el intermediario pueda capturar precios y rastrear su origen sin usar texto libre como unica referencia.

### NORM-019 - Cerrar trazabilidad de cobro y pago

Estado: `CERRADO`

Objetivo:

- definir como se liga una remision con cuenta por cobrar, pago y saldo.

Entregable documental:

- `51_flujo_canonico_cobranza_desde_remision_hasta_pago_aplicado.md`;
- ajuste de esquema general, tablas, diagrama, lineamientos, glosario, roadmap e indice documental.

Criterio de cierre:

- el sistema pueda responder si una verificacion ya fue pagada total, parcial o no pagada.

## Bloque I. Alineacion documental final

### NORM-020 - Alinear diagrama, glosario y tablas

Estado: `CERRADO`

Objetivo:

- dejar un solo contrato maestro del modelo.

Entregable documental:

- actualizacion coordinada de:
  diagrama final,
  glosario,
  tablas y relaciones,
  roadmap.

- `52_contrato_maestro_del_modelo_bd.md`.

Criterio de cierre:

- no existan diferencias importantes entre narrativa, diagrama y esquema objetivo.

### NORM-021 - Acta de cierre de normalizacion

Estado: `CERRADO`

Objetivo:

- emitir el cierre formal de normalizacion del modelo.

Entregable documental:

- `53_acta_cierre_normalizacion_bd.md`.

Criterio de cierre:

- el proyecto declare que no se haran mas cambios estructurales normales;
- cualquier cambio posterior de base pase a control de cambio excepcional.

## Secuencia recomendada

1. `NORM-001` a `NORM-005`
2. `NORM-006` a `NORM-009`
3. `NORM-010` a `NORM-014`
4. `NORM-015` a `NORM-019`
5. `NORM-020`
6. `NORM-021`

## Resultado esperado al final del TODO

Cuando este TODO quede completamente cerrado, Vera debe contar con:

- un modelo de datos normalizado;
- un contrato documental unico;
- un diagrama maestro alineado;
- reglas claras para propietario, intermediario y centro;
- trazabilidad clara para verificacion, documento, remision y pago;
- una decision formal de congelamiento estructural de la base.

## Regla de salida

La base de datos solo debe considerarse verdaderamente cerrada cuando:

- todas las tareas anteriores esten en `CERRADO`;
- exista acta formal de cierre de normalizacion;
- el equipo acepte que el siguiente trabajo ya no es rediseñar la base, sino desarrollar sobre ella.
Estado final del TODO:

- `COMPLETAMENTE CERRADO`.
