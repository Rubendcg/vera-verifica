# Alcance MVP Intermediario

## Objetivo

Reducir **Vera** a un primer producto util donde solo el intermediario opera el sistema para consultar informacion, mantener el expediente documental oficial y generar reportes.

## Actor unico del MVP

- `Intermediario`: captura, consulta, corrige, reporta y resguarda la informacion del vehiculo.

## Capacidades incluidas

- `Consulta maestra del vehiculo`: ver la ficha de cada unidad con su serie, placa vigente, propietario, cliente, poseedor legal, centro de verificacion, historial de verificaciones y vigencias.
- `Consulta del propietario y relaciones`: ver a quien pertenece la unidad y a nombre de quien esta registrada.
- `Consulta del historial de verificaciones`: ver cuando se hicieron las verificaciones fisico mecanica y de contaminantes y cuando vencen.
- `Carga documental oficial`: guardar la tarjeta de circulacion, la constancia fisico mecanica y la constancia de emisiones como PDFs del expediente del vehiculo.
- `Consulta y descarga documental`: abrir y descargar los archivos oficiales asociados a la unidad.
- `Reporteria operativa`: generar reportes por propietario, cliente, vehiculo, centro, tipo de verificacion, fecha de vigencia y estatus documental.

## Captura minima necesaria

Aunque el MVP se centra en consulta y reportes, el intermediario necesita capturar la informacion base para que el sistema tenga valor.

- `Alta de vehiculo`: registrar la unidad por `serial_niv` como identidad maestra obligatoria.
- `Alta de partes`: registrar propietario, cliente y poseedor legal cuando aplique.
- `Vinculacion vigente`: relacionar vehiculo con propietario, cliente y poseedor legal.
- `Alta de centro`: registrar el centro de verificacion donde se realizo la atencion.
- `Alta de evento de verificacion`: capturar tipo de verificacion, fecha de realizacion, vigencia y centro donde se hizo.
- `Alta de documento`: asociar y versionar los archivos oficiales del vehiculo.

## Modelo minimo recomendado

- `users`: acceso del personal del intermediario.
- `parties`: personas fisicas o morales relacionadas con el vehiculo.
- `vehicles`: identidad maestra de la unidad.
- `vehicle_party_roles`: relacion vigente entre vehiculo y propietario, cliente o poseedor legal.
- `verification_centers`: centros donde se realizaron las verificaciones.
- `verification_events`: historial de verificaciones realizadas y su vigencia.
- `documents`: expediente logico por tipo documental.
- `document_files`: archivos PDF fisicos y sus versiones.

## Reportes minimos del MVP

- `Reporte de padron vehicular`: listado de unidades con propietario, cliente, placa y serie.
- `Reporte de vigencias`: unidades con fecha de vencimiento de fisico mecanica y emisiones.
- `Reporte por centro`: verificaciones realizadas agrupadas por centro de verificacion.
- `Reporte documental`: unidades con expediente completo, incompleto o con archivo faltante.
- `Reporte historico`: historial de verificaciones y documentos por vehiculo.

## Fuera de alcance del MVP

- `Portal del propietario`: el propietario no entra al sistema en esta version.
- `Notificaciones`: no se enviaran mensajes, correos ni push.
- `Obligaciones automaticas`: no se generan obligaciones ni lotes de seguimiento.
- `Solicitudes administrativas del propietario`: no entran transferencia, suspension, baja ni restablecimiento como flujo formal.
- `Permisos internos avanzados`: basta un acceso interno simple del intermediario.
- `Finanzas`: remisiones, cuentas por cobrar, pagos y cartera quedan fuera.
- `Integracion operativa con centros`: no se envia solicitud automatica al centro.
- `Gobierno documental avanzado`: migraciones de storage, auditoria avanzada y reglas extendidas quedan para despues.

## Regla de corte

Si una funcionalidad no ayuda directamente a:

- ver informacion del vehiculo;
- guardar documentos oficiales;
- generar reportes;

entonces queda fuera del MVP.
