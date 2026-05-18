# Casos De Uso MVP Intermediario

## Casos de uso incluidos

- `MVP-001 Registrar propietario o cliente`: dar de alta la persona fisica o moral relacionada con el vehiculo.
- `MVP-002 Registrar vehiculo`: crear la ficha de la unidad usando la serie o NIV como identificador principal.
- `MVP-003 Vincular vehiculo con sus relaciones`: asociar propietario, cliente y poseedor legal vigentes.
- `MVP-004 Registrar centro de verificacion`: guardar la informacion basica del centro donde se atendio la unidad.
- `MVP-005 Registrar verificacion fisico mecanica`: capturar fecha de realizacion, vigencia y centro de la revision fisico mecanica.
- `MVP-006 Registrar verificacion de contaminantes`: capturar fecha de realizacion, vigencia y centro de la revision de emisiones.
- `MVP-007 Consultar ficha integral del vehiculo`: ver en una sola vista datos de identidad, relaciones, verificaciones y documentos.
- `MVP-008 Cargar tarjeta de circulacion`: guardar el PDF oficial de la tarjeta de circulacion del vehiculo.
- `MVP-009 Cargar constancia fisico mecanica`: guardar el PDF oficial de la revision fisico mecanica.
- `MVP-010 Cargar constancia de emisiones`: guardar el PDF oficial de la revision de contaminantes.
- `MVP-011 Consultar expediente documental`: ver que documentos oficiales existen y cuales faltan por vehiculo.
- `MVP-012 Descargar documento oficial`: abrir o descargar el archivo vigente de tarjeta, fisico mecanica o emisiones.
- `MVP-013 Generar reporte de padron vehicular`: listar unidades con propietario, cliente, placa y serie.
- `MVP-014 Generar reporte de vigencias`: listar unidades por fecha de vencimiento de sus verificaciones.
- `MVP-015 Generar reporte documental`: listar unidades con expediente completo o incompleto.
- `MVP-016 Generar reporte por centro`: listar verificaciones realizadas por centro de verificacion.
- `MVP-017 Consultar historial por vehiculo`: revisar verificaciones previas y versiones documentales de una unidad.

## Casos de uso excluidos

- `MVP-X01 Notificar al propietario`: fuera del MVP porque no existe canal externo en esta version.
- `MVP-X02 Respuesta del propietario`: fuera del MVP porque el propietario no opera el sistema.
- `MVP-X03 Generar obligaciones automaticas`: fuera del MVP porque no se manejara seguimiento regulatorio completo.
- `MVP-X04 Gestionar transferencias o bajas`: fuera del MVP porque el flujo administrativo completo se difiere.
- `MVP-X05 Cobranza y pagos`: fuera del MVP porque el componente financiero se pospone.
