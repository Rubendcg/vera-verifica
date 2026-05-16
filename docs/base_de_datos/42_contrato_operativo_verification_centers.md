# Contrato Operativo de Verification Centers

## Objetivo

Cerrar documentalmente el contrato de:

- `verification_centers`
- su ubicacion operativa
- su resolucion de contacto

para que el intermediario sepa con precision:

- que centro se uso o se programo;
- donde esta ubicado;
- a quien debe contactar;
- y bajo que regla se resuelve ese contacto.

## Decision canonica

En Vera, un centro de verificacion se modela como:

- una sede operativa concreta;
- con codigo unico;
- con ubicacion propia;
- y con uno o mas contactos operativos historicos.

Regla principal:

- un centro puede tener varios contactos historicos u operativos;
- pero debe existir exactamente un contacto primario activo para operacion diaria.

Esto evita dos errores:

- perder trazabilidad cuando cambia la persona de contacto;
- forzar al intermediario a improvisar entre varios telefonos o correos sin regla de prioridad.

## Grano canonico del centro

Una fila en `verification_centers` representa:

- un sitio fisico concreto donde la verificacion ocurre o se coordina.

Por lo tanto:

- si una misma razon social opera dos sedes distintas, deben ser dos `verification_centers`;
- si la sede sigue siendo la misma y solo cambia el personal, no se crea un centro nuevo; solo cambia el contacto;
- `verification_events.center_id` y `verification_obligations.scheduled_center_id` siempre apuntan a la sede, no a la persona.

## Datos canonicos del centro

`verification_centers` debe contener la identidad y ubicacion del sitio.

Campos funcionales canonicos:

- `center_type`
- `code`
- `name`
- `state_code`
- `city`
- `address_line`
- `is_active`

Reglas canonicas:

- `code` es la llave operativa estable del centro;
- `name` identifica la sede para operacion y reportes;
- `state_code`, `city` y `address_line` describen la ubicacion operativa;
- `is_active` controla si la sede sigue operando en flujo normal;
- la ubicacion pertenece al centro, no al contacto.

## Modelo canonico de contacto

El contacto operativo no debe vivir solo como columnas planas dentro de `verification_centers`.

El modelo objetivo debe abrir:

- `verification_center_contacts`

con una fila por contacto historico u operativo del centro.

Campos funcionales canonicos propuestos:

- `center_id`
- `contact_role`
- `contact_name`
- `phone`
- `whatsapp_phone`
- `email`
- `preferred_channel`
- `is_primary`
- `is_active`
- `start_date`
- `end_date`
- `notes`

## Roles minimos del contacto

El catalogo canonico minimo queda asi:

- `PRIMARY_OPERATIONS`
- `BACKUP_OPERATIONS`

Semantica:

- `PRIMARY_OPERATIONS` es la persona o canal principal con quien el intermediario debe coordinar;
- `BACKUP_OPERATIONS` sirve cuando existe una segunda opcion valida, pero no sustituye la regla del primario.

## Regla de resolucion operativa

La resolucion canonica del contacto queda asi:

- un centro puede tener varias filas activas en `verification_center_contacts`;
- solo una fila puede ser `PRIMARY_OPERATIONS` activa a la vez;
- puede haber cero o varias filas `BACKUP_OPERATIONS` activas;
- si el centro esta `is_active = true`, debe existir un contacto primario activo;
- si no existe contacto primario activo, el centro queda incompleto para operacion y debe tratarse como incidencia de dato.

Vista derivada recomendada:

- `vw_primary_verification_center_contact`

Su salida debe resolver, por `center_id`:

- `contact_name`
- `phone`
- `whatsapp_phone`
- `email`
- `preferred_channel`

## Regla historica

El cambio de contacto no debe reescribir historia.

La regla canonica es:

- cerrar la fila previa con `end_date` o `is_active = false`;
- crear la nueva fila vigente;
- mantener al centro como la misma sede si su `code` y ubicacion operativa siguen representando el mismo sitio.

## Relacion con el esquema actual

La implementacion actual ya trae en `verification_centers`:

- `contact_name`
- `phone`
- `email`

Esos campos deben leerse como:

- snapshot operativo transitorio;
- o reflejo denormalizado del contacto primario vigente.

La fuente canonica normalizada a futuro debe ser:

- `verification_center_contacts`

## Regla de uso por modulo

### `verifications`

Debe usar:

- `verification_centers` para sede y ubicacion;
- `vw_primary_verification_center_contact` para la resolucion operativa por defecto.

### `reports` y `notifications`

No deben adivinar contacto desde texto libre del centro.

Si un flujo necesita enviar o preparar solicitud hacia centro, debe resolver primero:

- el centro programado o realizado;
- y su contacto primario activo.

El payload concreto de esa solicitud se cerrara en:

- `NORM-011`
- [43_contrato_reporte_hacia_agente_de_centro.md](./43_contrato_reporte_hacia_agente_de_centro.md)

## Conclusion

El contrato canonico queda asi:

- un centro es una sede operativa concreta;
- puede tener varios contactos historicos u operativos;
- pero solo uno puede ser el primario activo para operacion cotidiana;
- la ubicacion vive en `verification_centers`;
- la persona de contacto vive en `verification_center_contacts`.
