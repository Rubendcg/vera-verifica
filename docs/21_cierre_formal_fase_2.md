# Cierre Formal de Fase 2

## Fecha de cierre

`2026-05-13`

## Fase cerrada

`Fase 2. Cumplimiento regulatorio`

## Objetivo cumplido

La fase 2 queda cerrada formalmente porque **Vera** ya puede consultar y operar el estado regulatorio vigente de un vehiculo.

Esto incluye:

- reglas de calendario funcionales para `FEDERAL` y `ESTATAL`;
- eventos de verificacion;
- obligaciones de verificacion;
- historial de cambios de obligaciones;
- generacion automatica de obligaciones;
- autenticacion y autorizacion sobre el modulo;
- validacion formal de DTOs;
- pruebas e2e del flujo principal.

## Evidencia de cierre

### Modelo y migraciones

- `verification_centers`
- `verification_events`
- `verification_schedule_rules`
- `verification_obligations`
- `verification_obligation_history`

Migraciones aplicadas y validadas en PostgreSQL.

### Operacion funcional

- alta y consulta de centros;
- alta y consulta de reglas de calendario;
- alta y consulta de eventos;
- alta, consulta, respuesta y programacion de obligaciones;
- cierre de obligacion al registrar evento;
- consulta de estado regulatorio por vehiculo;
- generacion automatica e idempotente de obligaciones.

### Seguridad y validacion

- `POST /auth/login` operativo;
- `GET /auth/me` operativo;
- `JwtAuthGuard` activo;
- `AdminGuard` activo;
- `ValidationPipe` global activo;
- acceso filtrado por `user_vehicle_access`.

### Pruebas que sostienen el cierre

- `npm run build`
- `npx jest --runInBand`
- `npx jest --config ./test/jest-e2e.json --runInBand`
- validacion real documentada del generador contra reglas federales y estatales;
- cobertura e2e del flujo `respond -> schedule -> create event -> completed`.

## Alcance explicitamente fuera de esta fase

No bloquean el cierre de fase 2:

- prorrogas extraordinarias;
- periodos regulatorios temporales;
- `overrides` de calendario por decreto puntual.

Estos casos quedan diferidos a una extension posterior del calendario regulatorio para no contaminar la regla maestra sembrada en `verification_schedule_rules`.

## Deuda controlada posterior al cierre

- extender autenticacion y autorizacion al resto de modulos;
- disenar el submodelo de `overrides` temporales cuando exista necesidad real de negocio;
- continuar con la fase 3 de expediente documental.

## Siguiente foco recomendado

El siguiente bloque correcto es la **fase 3**, centrada en:

- endpoints reales de `documents`;
- carga segura de PDFs;
- versionado vigente;
- consulta visible para propietario.
