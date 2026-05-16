# Revision Senior de Alineacion del Modelo de Base de Datos

## Objetivo

Evaluar si el modelo de base de datos de **Vera** realmente soporta la idea inicial del negocio y definir, desde una perspectiva senior, si el esquema ya puede considerarse bien encaminado o si aun requiere cambios estructurales antes de seguir con desarrollo funcional.

## Contexto de negocio resumido

Vera no es el centro de verificacion ni el propietario del vehiculo.

Vera opera como:

- un tercero intermediario;
- un concentrador de datos del vehiculo;
- un monitor de vencimientos y estados;
- un gestor documental de respaldos;
- un emisor de alertas y reportes operativos;
- un controlador administrativo de remisiones, pagos y seguimiento.

La base debe dejar muy claro:

- cual es el vehiculo unico e irrepetible;
- a quien pertenece;
- a nombre de quien esta;
- que verificaciones tiene y cuando vencen;
- que documentos respaldan cada estado;
- en que centro ocurrieron las verificaciones;
- que puede ver y actualizar el propietario;
- que puede operar el intermediario;
- como se ligan servicio, remision, entrega y pago.

## Dictamen ejecutivo

El modelo **si esta encaminado** a la idea inicial.

No recomiendo rehacerlo.

La arquitectura base ya es correcta en sus ejes principales:

- vehiculo;
- parte relacionada;
- acceso por usuario;
- verificaciones y calendario;
- expediente documental;
- notificaciones;
- cobranza separada del visor del propietario.

Pero todavia **no lo consideraria estructuralmente cerrado**.

Antes de tocar mas codigo funcional conviene hacer una ultima pasada de normalizacion y cierre documental, porque hoy el esquema tiene brechas en las zonas mas sensibles del negocio:

- identidad maestra del vehiculo;
- estado de vida del vehiculo;
- integridad de roles vigentes;
- aplicabilidad de fisico-mecanica y emisiones;
- flujo de cambios reportados por el propietario;
- trazabilidad operativa con centros;
- especializacion financiera de remisiones y pagos.

## Lo que ya esta bien planteado

## 1. Separacion entre identidad de negocio y acceso

La separacion entre:

- `parties`
- `users`
- `vehicle_party_roles`
- `user_vehicle_access`

es correcta para este negocio.

Esto permite no confundir:

- propietario juridico;
- cliente de consulta;
- poseedor legal;
- usuario que entra al portal;
- usuario administrativo del intermediario.

## 2. Cumplimiento regulatorio separado del seguimiento operativo

La existencia simultanea de:

- `verification_events`
- `verification_schedule_rules`
- `verification_obligations`
- `verification_obligation_history`

es una buena decision.

Permite separar:

- lo que realmente ocurrio;
- lo que debe ocurrir;
- la respuesta del propietario;
- la accion administrativa del intermediario.

## 3. Expediente documental en dos niveles

La separacion entre:

- `documents`
- `document_files`
- `document_access_log`

es correcta.

Eso da una base defendible para:

- tarjeta de circulacion;
- constancia fisico-mecanica;
- constancia de emisiones;
- versionado del PDF;
- trazabilidad de accesos y descargas.

## 4. Notificaciones como capa administrativa

La fase 4 tambien va en la direccion correcta.

La separacion entre:

- destinatario;
- regla;
- plantilla;
- lote;
- item;
- intento;

es la adecuada para un intermediario que monitorea y notifica.

## 5. Cobranza fuera del visor del propietario

Mantener separadas las tablas de cobranza del portal del propietario es correcto.

Ese principio debe conservarse.

## Brechas estructurales que aun requieren cierre

## 1. Identidad maestra del vehiculo

### Situacion actual

Hoy el modelo trata `serial_niv` como unico, pero lo deja nullable.

Tambien deja `plate` como unico.

### Problema

Para este negocio, la placa no es el identificador mas estable.

Puede cambiar.

La serie del vehiculo es la identidad real.

Si Vera pretende tratar al vehiculo como unico e irrepetible, no deberia operar unidades activas sin una politica estricta de serie.

### Cambio recomendado

Definir formalmente una politica canonica:

- `serial_niv` obligatorio para todo vehiculo en estado operativo;
- `plate` identificador operativo mutable;
- si se aceptan altas incompletas, documentar un estado especial de captura preliminar y no mezclarlo con operacion normal.

## 2. Estado de vida del vehiculo

### Situacion actual

Hoy el modelo regula cumplimiento y acceso, pero no modela bien la vida administrativa de la unidad.

El propietario puede responder sobre la obligacion de verificacion, pero no existe un submodelo claro para:

- cambio de dueño;
- suspendido;
- baja;
- reactivado.

### Problema

Eso deja una ambiguedad fuerte entre:

- estado regulatorio;
- estado documental;
- estado administrativo del vehiculo.

### Cambio recomendado

Crear un submodelo especifico para vida del vehiculo, por ejemplo:

- `vehicle_lifecycle_events`

o

- `vehicle_change_requests`

con estados como:

- `ACTIVE`
- `SUSPENDED`
- `TRANSFERRED`
- `DEREGISTERED`
- `REACTIVATED`

y con:

- fecha efectiva;
- actor que reporta;
- actor que valida;
- motivo;
- documento soporte.

## 3. Integridad de roles vigentes

### Situacion actual

`vehicle_party_roles` esta bien como concepto, pero aun no tiene reglas documentadas de integridad fuerte para vigencias.

### Problema

Sin reglas claras podrian coexistir:

- dos propietarios vigentes;
- dos titulares de tarjeta vigentes;
- solapamientos temporales contradictorios.

### Cambio recomendado

Cerrar documentalmente:

- que roles admiten uno solo vigente por vehiculo;
- reducir el catalogo canonico al alcance real del proyecto si las demas categorias son redundantes;
- que roles pueden convivir;
- como se resuelve el historial de transferencias;
- que restricciones parciales o exclusiones temporales deben existir.

## 4. Aplicabilidad de tipos de verificacion

### Situacion actual

La documentacion habla de `requires_physical` y `requires_emissions`, pero el esquema real actual del vehiculo no refleja eso como contrato cerrado.

### Problema

No todas las unidades requieren el mismo tratamiento.

Sin esa capa, parte de la logica queda implita o dispersa.

### Cambio recomendado

Definir un perfil canonico de aplicabilidad por vehiculo:

- mediante columnas controladas en `vehicles`;

o mejor:

- mediante una tabla `vehicle_verification_profile`.

Debe responder sin ambiguedad si una unidad requiere:

- fisico-mecanica;
- emisiones;
- ambas;
- ninguna por excepcion documentada.

## 5. Modelo de centro de verificacion

### Situacion actual

El SQL real ya soporta ubicacion y un contacto basico del centro.

### Problema

Para la operacion descrita, el intermediario probablemente tratara con un agente o contacto operativo del centro, no solo con un nombre generico.

Ademas, el diagrama maestro no expone aun toda esa riqueza.

### Cambio recomendado

Tomar una decision documental explicita:

1. dejar un solo contacto por centro como regla oficial del negocio inicial;
2. o abrir desde ahora `verification_center_contacts` si el centro puede tener varios interlocutores operativos.

## 6. Vinculo entre evento, documento y entrega real

### Situacion actual

El expediente documental ya esta bien orientado, pero aun falta endurecer reglas de unicidad logica.

### Problema

El sistema debe poder responder con claridad cual es:

- la tarjeta vigente;
- la constancia vigente de fisico-mecanica;
- la constancia vigente de emisiones;
- el documento que respaldo el ultimo evento valido.

### Cambio recomendado

Definir reglas documentales y luego SQL para:

- un solo documento vigente por tipo cuando aplique;
- politicas de reemplazo por version;
- politica de expiracion y archivo;
- criterio de visibilidad al propietario por tipo documental.

## 7. Flujo del propietario mas alla de confirmar verificaciones

### Situacion actual

El propietario hoy encaja bien como visor y como emisor de respuesta sobre obligaciones.

### Problema

Tu negocio requiere que tambien pueda declarar cambios relevantes del vehiculo.

No basta con `owner_response`.

### Cambio recomendado

Separar dos cosas:

- respuesta a una obligacion de verificacion;
- solicitud administrativa del propietario sobre la vida del vehiculo.

Eso debe quedar en tablas distintas.

## 8. Permisos internos del intermediario

### Situacion actual

El modelo actual distingue basicamente:

- admin;
- usuario autenticado con acceso a vehiculos.

### Problema

Para operacion real del intermediario, eso se queda corto.

No separa bien:

- operacion;
- seguimiento;
- documentos;
- cobranza;
- supervision.

### Cambio recomendado

Definir antes de mas codigo si el sistema seguira con:

- `is_admin` binario;

o si necesita un modelo documental de:

- roles internos;
- permisos por modulo;
- perfiles de solo lectura;
- perfil de cobranza.

## 9. Especializacion financiera para remisiones de verificacion

### Situacion actual

La capa financiera propuesta existe, pero es todavia generica.

### Problema

Tu operacion necesita ligar claramente:

- remision;
- folio;
- tipo de verificacion;
- monto por concepto;
- si ya fue entregada;
- si ya fue pagada total o parcialmente;
- quien pago;
- a que vehiculo y a que evento se refiere.

### Cambio recomendado

Especializar documentalmente:

- `service_orders`
- `service_order_items`
- `receivable_documents`
- `payment_transactions`

para que soporten por lo menos:

- `verification_type`;
- referencia a `verification_event_id` u `obligation_id` cuando exista;
- tipo de entrega;
- estado de remision;
- pagador real;
- fecha de entrega al intermediario o al propietario.

## 10. Consistencia entre diagrama maestro y esquema real

### Situacion actual

Todavia hay diferencias entre:

- documentacion narrativa;
- diagrama final;
- migraciones reales;
- entidades.

### Problema

Si los cimientos del proyecto van a ser los documentos, el diagrama maestro no puede quedarse por debajo del SQL real ni mezclar conceptos.

### Cambio recomendado

Hacer una pasada final de alineacion y declarar un solo contrato canonico.

## Cambios recomendados por prioridad

### Critica

1. cerrar identidad maestra del vehiculo;
2. definir estado de vida del vehiculo;
3. cerrar integridad de roles vigentes;
4. separar flujo de cambios del propietario respecto a `owner_response`.

### Alta

1. definir aplicabilidad de fisico-mecanica y emisiones;
2. endurecer reglas logicas del expediente documental;
3. especializar la capa financiera para remisiones de verificaciones;
4. alinear completamente diagrama, glosario y esquema real.

### Media

1. decidir si los centros tendran uno o varios contactos operativos;
2. definir roles internos del intermediario mas alla de `is_admin`;
3. definir el contrato exacto del reporte que sale hacia el agente del centro.

## Decision recomendada

Mi recomendacion es:

1. no abrir mas codigo funcional por ahora;
2. cerrar primero la normalizacion documental del modelo;
3. aprobar una sola pasada estructural final de la base;
4. declarar despues un congelamiento de cambios estructurales;
5. a partir de ahi desarrollar sobre una base ya cerrada.

## Criterio para considerar el modelo realmente cerrado

La base solo deberia declararse estructuralmente cerrada cuando:

- el vehiculo tenga politica canonica de identidad;
- existan reglas claras de propiedad, titularidad y vigencias;
- el estado de vida del vehiculo este modelado aparte del estado regulatorio;
- la aplicabilidad de verificaciones este formalizada;
- el expediente documental tenga reglas de vigencia y unicidad logica;
- el centro de verificacion tenga contrato operativo suficiente;
- la remision y el pago queden ligados a la operacion de verificacion;
- el visor del propietario y la operacion del intermediario queden separados sin ambiguedad;
- diagrama, glosario, roadmap y SQL apunten al mismo modelo.

## Conclusion

La direccion general del modelo es correcta.

El proyecto no necesita rediseño total.

Lo que necesita es una **fase de cierre de normalizacion** para convertir un buen esquema en una base verdaderamente estable, defendible y lista para servir como cimiento del desarrollo.
