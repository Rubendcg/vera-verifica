# Enunciado Canonico del Negocio de Vera

## Objetivo

Dejar en una sola pieza documental la descripcion oficial del negocio que soporta la base de datos de **Vera**, para que diagrama, glosario, roadmap y desarrollo futuro partan del mismo enunciado.

## Enunciado canonico

**Vera** es un sistema operado por un tercero intermediario que da seguimiento administrativo al cumplimiento vehicular de unidades de autotransporte.

Su funcion principal no es realizar la verificacion, ni sustituir al centro de verificacion, ni transferir la propiedad legal del vehiculo.

Su funcion principal es:

- identificar de forma confiable cada vehiculo;
- saber a quien pertenece y a nombre de quien esta;
- conocer que verificaciones tiene, cuando se realizaron y cuando vencen;
- resguardar los documentos que respaldan ese estado;
- monitorear vencimientos y cambios operativos;
- notificar oportunamente a propietarios o contactos autorizados;
- permitir al intermediario coordinar seguimiento, documentacion, remisiones y pagos;
- exponer al propietario un visor seguro de sus datos y documentos.

## Actores canonicos

## 1. Intermediario

Es el operador principal de Vera.

Puede:

- ver toda la operacion;
- administrar vehiculos, relaciones, verificaciones y documentos;
- administrar el estado del propietario dentro de Vera;
- identificar proximos vencimientos;
- generar reportes;
- enviar alertas;
- recibir y registrar actualizaciones del propietario;
- capturar remisiones;
- dar seguimiento a pagos;
- reflejar verificaciones ya realizadas y sus nuevos respaldos.

## 2. Propietario o usuario autorizado

No opera el sistema completo.

Su papel canonico es:

- consultar solo las unidades a las que tiene acceso;
- ver el estado de sus verificaciones;
- ver fechas de vigencia y vencimiento;
- descargar los documentos visibles de respaldo;
- informar al intermediario si desea realizar la verificacion;
- informar cambios relevantes sobre la unidad mediante solicitud administrativa, por ejemplo:
  cambio de dueno,
  suspension,
  baja,
  o situacion equivalente definida por negocio.

No debe poder:

- ver informacion contable global;
- ver remisiones internas de otros clientes;
- operar reportes multi-cliente;
- administrar centros o reglas;
- modificar verificaciones como hecho cumplido;
- suspenderse o darse de baja a si mismo dentro de Vera.

## 3. Centro de verificacion

Es una entidad externa al sistema.

Vera solo la registra como referencia operativa para:

- saber donde se realizo una verificacion;
- ubicar el centro;
- identificar a su contacto o agente operativo;
- preparar reportes o solicitudes que el intermediario le haga llegar.

Regla canonica del reporte hacia centro:

- la salida debe ser minimizada y operativa;
- no debe mezclar cobranza ni datos tecnicos internos;
- y solo debe incluir el detalle necesario para coordinar la atencion del vehiculo.

Regla canonica:

- un centro representa una sede operativa concreta;
- puede tener varios contactos historicos u operativos;
- pero debe resolver un solo contacto primario activo para la operacion cotidiana.

El centro no es el operador principal de Vera dentro de este alcance.

## Objeto central del negocio

El objeto central es el **vehiculo**.

Sobre cada vehiculo, Vera debe poder responder:

- cual es su identidad operativa;
- cual es su identidad documental;
- quien es su propietario;
- cual es su cliente de consulta;
- quien es su poseedor legal cuando aplique;
- cual es su estado regulatorio;
- cual es su estado administrativo;
- que verificaciones le aplican;
- cuales son sus fechas de cumplimiento;
- cuales son sus documentos vigentes de respaldo.

## Identidad canonica del vehiculo

La regla de negocio canonica es:

- la serie o NIV es obligatoria para toda unidad operativa;
- la serie o NIV es la identidad principal, estable y no reutilizable;
- la placa es un identificador operativo mutable;
- el cambio de placa no crea una unidad nueva;
- la placa nueva obliga a recalcular el marcador y las reglas regulatorias futuras aplicables.

Esta politica se cierra formalmente en:

- [34_politica_identidad_maestra_del_vehiculo.md](./34_politica_identidad_maestra_del_vehiculo.md)

## Informacion minima que Vera debe custodiar

## 1. Identidad y relacion del vehiculo

- serie o NIV;
- placa;
- motor;
- tipo de unidad;
- regimen;
- propietario, sea persona fisica o empresa;
- estado administrativo del propietario dentro de Vera cuando aplique;
- cliente de consulta;
- poseedor legal cuando aplique;
- accesos autorizados.

La misma parte puede aparecer como poseedor legal en varias unidades distintas sin conflicto, incluso si esas unidades tienen distintos propietarios o clientes.

## 2. Cumplimiento regulatorio

- tipo de verificacion aplicable;
- fecha en que se realizo;
- fecha en que vence;
- centro donde se realizo;
- calendario y regla que le aplica;
- estado vigente, por vencer, vencido o sin registro.

## 3. Expediente documental

Los documentos nucleares del negocio son:

- tarjeta de circulacion;
- constancia fisico-mecanica;
- constancia de emisiones.

El sistema puede soportar otros documentos auxiliares, pero esos tres son el expediente base del cumplimiento vehicular.

La politica canonica de tipos documentales se cierra formalmente en:

- [44_politica_tipos_documentales_oficiales.md](./44_politica_tipos_documentales_oficiales.md)

La unicidad logica y el reemplazo del expediente se cierran formalmente en:

- [45_unicidad_logica_del_expediente.md](./45_unicidad_logica_del_expediente.md)

La visibilidad del expediente para propietario se cierra formalmente en:

- [46_matriz_visibilidad_documental_del_propietario.md](./46_matriz_visibilidad_documental_del_propietario.md)

## 4. Seguimiento administrativo

Vera debe permitir al intermediario:

- detectar proximos vencimientos;
- enviar alertas;
- registrar respuesta del propietario;
- dar seguimiento a cambios sobre la unidad;
- regularizar el estado de vida administrativo de la unidad;
- actualizar el cumplimiento cuando ya exista evidencia real de verificacion.

El estado administrativo vigente del vehiculo se cierra formalmente en:

- [35_submodelo_estado_de_vida_del_vehiculo.md](./35_submodelo_estado_de_vida_del_vehiculo.md)

El canal canonico de solicitudes del propietario se cierra formalmente en:

- [36_flujo_canonico_solicitudes_del_propietario.md](./36_flujo_canonico_solicitudes_del_propietario.md)

El estado administrativo del propietario se cierra formalmente en:

- [39_estado_administrativo_del_propietario.md](./39_estado_administrativo_del_propietario.md)

## 5. Remisiones y pagos

Cuando la operacion lo requiera, Vera debe permitir:

- capturar una remision con folio;
- registrar conceptos y montos de verificaciones;
- llevar control de deuda o saldo;
- marcar pagos totales o parciales;
- dejar esa capa fuera del visor del propietario.

## Fronteras del sistema

Vera si debe:

- centralizar informacion del vehiculo;
- centralizar cumplimiento y documentos;
- apoyar seguimiento administrativo;
- apoyar reportes y notificaciones;
- apoyar trazabilidad financiera de la operacion del intermediario.

Vera no debe confundirse con:

- el centro de verificacion;
- la autoridad regulatoria;
- el sistema contable general del cliente;
- un portal abierto de escritura total para el propietario.

## Regla de interpretacion para el modelo de datos

Todo documento futuro de base de datos debe poder leerse bajo este criterio:

1. el vehiculo es el eje;
2. el intermediario es el operador principal;
3. el propietario es visor y emisor controlado de cambios;
4. el centro es una referencia externa operativa;
5. documentos, verificaciones, notificaciones y remisiones existen para sostener ese flujo.

## Efecto sobre la normalizacion

Este enunciado obliga a revisar y cerrar, antes de mas desarrollo funcional:

- identidad maestra del vehiculo;
- estado de vida de la unidad;
- roles vigentes sobre la unidad;
- aplicabilidad de tipos de verificacion;
- contrato operativo de centros;
- visibilidad del propietario;
- relacion entre remision, verificacion y pago.

## Criterio de cierre de NORM-001

`NORM-001` se considera cerrado cuando:

- exista este enunciado canonico;
- los documentos maestros remitan a el;
- ya no existan descripciones contradictorias de lo que Vera es y no es.
