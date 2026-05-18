# Lista Base De Casos De Uso Vera

Esta lista sale del alcance canonico del negocio y del modelo de base de datos ya normalizado.

## Casos de uso del intermediario

- `CU-001 Registrar parte relacionada`: dar de alta una persona fisica o moral para usarla como propietario, cliente o poseedor legal.
- `CU-002 Registrar usuario`: crear un usuario interno o un usuario visor ligado a una parte relacionada.
- `CU-003 Asignar rol interno`: otorgar permisos internos al personal del intermediario segun su funcion operativa, documental, financiera o de auditoria.
- `CU-004 Registrar vehiculo`: dar de alta una unidad usando la serie o NIV como identidad maestra obligatoria.
- `CU-005 Actualizar placa vigente`: cambiar la placa actual del vehiculo y recalcular las reglas aplicables a la nueva placa.
- `CU-006 Asignar relaciones del vehiculo`: definir quien es el propietario, cliente y poseedor legal vigentes de una unidad.
- `CU-007 Otorgar acceso al visor`: autorizar que un usuario pueda consultar los datos de uno o varios vehiculos.
- `CU-008 Cambiar estado del propietario`: poner a un propietario como activo, suspendido o dado de baja.
- `CU-009 Cambiar estado de vida del vehiculo`: marcar un vehiculo como activo, suspendido, transferido o dado de baja.
- `CU-010 Revisar solicitud administrativa`: atender reportes del propietario como transferencia, suspension, baja o restablecimiento.
- `CU-011 Regularizar cambio de propietario`: cerrar el proceso cuando una unidad transferida ya fue reasignada correctamente.
- `CU-012 Definir perfil de verificaciones`: establecer si el vehiculo requiere fisico mecanica, emisiones o ambas.
- `CU-013 Registrar centro de verificacion`: dar de alta la sede donde se realizan verificaciones.
- `CU-014 Registrar contacto del centro`: mantener la informacion de contacto operativo del centro de verificacion.
- `CU-015 Configurar reglas de calendario`: mantener reglas de periodicidad, ventana y vigencia para las verificaciones.
- `CU-016 Generar obligaciones de verificacion`: crear las obligaciones futuras o vencidas que debe atender cada vehiculo.
- `CU-017 Consultar estado regulatorio`: ver el estado vigente de cumplimiento de un vehiculo y sus proximos vencimientos.
- `CU-018 Registrar respuesta del propietario`: capturar si el propietario confirma, rechaza o solicita ayuda sobre una obligacion.
- `CU-019 Programar atencion con centro`: preparar la gestion operativa de una obligacion con un centro especifico.
- `CU-020 Registrar evento de verificacion`: capturar que una verificacion fue realizada, donde se hizo y hasta cuando queda vigente.
- `CU-021 Cerrar obligacion`: terminar una obligacion por cumplimiento real o por cancelacion administrativa.
- `CU-022 Crear expediente documental`: abrir el expediente logico de documentos oficiales y auxiliares de un vehiculo.
- `CU-023 Cargar PDF documental`: subir una nueva version fisica del PDF de tarjeta, fisico mecanica o emisiones.
- `CU-024 Auditar acceso documental`: consultar quien vio, descargo o modifico documentos del expediente.
- `CU-025 Consultar faltantes documentales`: identificar si a un vehiculo le falta algun documento oficial requerido.
- `CU-026 Generar reporte operativo`: armar reportes filtrados por cliente, vehiculo, centro, estado o vencimiento.
- `CU-027 Generar solicitud hacia centro`: producir la salida operativa con los vehiculos que el centro debe atender.
- `CU-028 Preparar candidatos a notificacion`: identificar vehiculos proximos a vencer o con accion pendiente.
- `CU-029 Crear lote de notificaciones`: congelar un conjunto de destinatarios y mensajes a enviar.
- `CU-030 Ejecutar envio de notificaciones`: mandar mensajes o push y registrar cada intento.
- `CU-031 Reintentar y reconciliar notificaciones`: gestionar errores, reenvios y confirmaciones del proveedor.
- `CU-032 Registrar remision`: capturar la remision entregada por el centro para una unidad.
- `CU-033 Registrar conceptos economicos`: detallar importes por tipo de verificacion u otros cargos autorizados.
- `CU-034 Emitir cuenta por cobrar`: convertir la remision en deuda formal del cliente.
- `CU-035 Registrar pago`: capturar un pago recibido de un propietario, cliente u otro pagador.
- `CU-036 Aplicar pago`: distribuir el pago sobre la deuda o parcialidades correspondientes.
- `CU-037 Consultar saldo y cartera`: revisar deuda, pagos aplicados, remisiones y movimientos contables.

## Casos de uso del propietario o usuario autorizado

- `CU-038 Consultar mis vehiculos`: ver las unidades a las que tiene acceso vigente.
- `CU-039 Consultar estado de verificacion`: revisar fechas de ultima verificacion, vencimientos y cumplimiento regulatorio.
- `CU-040 Descargar documentos visibles`: bajar los PDFs oficiales que el intermediario puso a disposicion del propietario.
- `CU-041 Responder a una obligacion`: indicar si desea que se gestione la verificacion o si necesita apoyo.
- `CU-042 Reportar cambio administrativo`: informar transferencia, suspension, baja o solicitud de restablecimiento de una unidad.
- `CU-043 Reclamar unidad transferida`: pedir que una unidad en estado transferido sea incorporada a su propiedad.

## Casos de uso del sistema automatico

- `CU-044 Resolver relaciones vigentes`: calcular propietario, cliente y poseedor legal vigentes por vehiculo.
- `CU-045 Calcular aplicabilidad`: resolver si a una unidad le corresponde fisico mecanica, emisiones o ambas.
- `CU-046 Detectar proximos vencimientos`: identificar obligaciones que deben notificarse o escalarse.
- `CU-047 Resolver visibilidad documental`: decidir si un documento puede mostrarse al propietario segun estado y reglas de acceso.
- `CU-048 Mantener trazabilidad historica`: conservar historial de cambios en roles, solicitudes, obligaciones, documentos y finanzas.

## Casos de uso de salida externa hacia centro

- `CU-049 Entregar solicitud operativa al centro`: compartir al agente del centro la lista minimizada de unidades a atender.
- `CU-050 Confirmar referencia de atencion`: conservar la referencia operativa con la que el centro devuelve o relaciona la atencion realizada.
