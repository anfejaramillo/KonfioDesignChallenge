# Service Architecture

## Layers

- Domain: pure business model and invariants.
- Application: use cases and orchestration.
- Infrastructure: persistence, messaging and idempotency adapters.
- Interfaces: HTTP and event ingress points.

## AWS mapping (target)

- API Gateway + Lambda: HTTP ingress.
- EventBridge: publish `loanApplicationCreated`.
- SQS + DLQ: consume `creditDecisionMade` with retries.
- DynamoDB: idempotency key store and aggregate persistence.

## Reliability controls

- Idempotency check before side effects.
- DLQ for poison events.
- Correlation IDs in logs and events.

## Architecture Decision Records

A continuacion se enumeran las ADRs respectivas a la contruccion de este microservicio.

| Titulo | Contexto | Decision | Consecuencias |
|:-------------|:---------------|:-------------|:-------------|
| Bounded Context = Service Boundary | El agregado `LoanApplicationAggregate` concentra el alta de solicitudes, sus invariantes iniciales y la transicion desde `UNDER_REVIEW` hasta estado final al recibir decision de credito. Mezclar esta responsabilidad con decision/riesgo aumenta acoplamiento y dificulta escalar por carga. | Mantener `loan-application-service` como microservicio dedicado al bounded context de originacion de solicitudes. | 1) Mayor cohesion funcional sobre captura de solicitud y estado. 2) Menor dependencia de cambios en decision/riesgo. 3) Integracion asincrona por eventos como contrato entre contextos. |
| Arquitectura Hexagonal con capas explicitas | Se requiere cumplir reglas de DDD y evitar fugas de infraestructura dentro del dominio. El servicio necesita exponer HTTP y consumir/publicar eventos sin contaminar reglas de negocio. | Adoptar estructura obligatoria `domain/`, `application/`, `infrastructure/`, `interfaces/` y usar puertos/adaptadores para repositorio, bus de eventos e idempotencia. | 1) Dominio testeable y agnostico de framework/cloud. 2) Menor riesgo de deuda tecnica por acoplamiento. 3) Mayor claridad para evolucionar adapters (AWS/local) sin tocar reglas de negocio. |
| Integracion Event-Driven como mecanismo principal | El ciclo de vida de la solicitud es distribuido: al crear una aplicacion se debe notificar a otros bounded contexts y luego procesar `creditDecisionMade` para cerrar estado. Se necesita desacople temporal y contrato estable. | Publicar `loanApplicationCreated` y consumir `creditDecisionMade` como eventos de dominio versionables, con metadata de trazabilidad (`eventId`, `idempotencyKey`, `correlationId`, `aggregateId`). | 1) Se habilita orquestacion asincrona entre servicios. 2) Requiere gobernanza de contratos (`EVENT_CONTRACTS.md`) y versionado de payload. 3) Facilita observabilidad end-to-end por `correlationId`. |
| Idempotency First en comandos y eventos | API y mensajeria pueden reenviar solicitudes/eventos por retries, timeouts o reentregas. Sin control idempotente habria duplicidad de solicitudes/publicaciones y transiciones de estado inconsistentes. | Hacer obligatorio `idempotencyKey` en todos los comandos/eventos y validar la llave antes de ejecutar side effects (persistencia, publicacion o actualizacion de estado). | 1) Se evitan efectos duplicados y race conditions comunes en sistemas event-driven. 2) Se requiere un store de idempotencia con TTL (DynamoDB en target). 3) Los consumidores obtienen comportamiento deterministico ante reintentos. |
| Estado inicial y reglas invariantes en el agregado | La calidad de originacion depende de validar monto y moneda contra `LoanProduct` y de iniciar siempre en un estado coherente. Estas reglas no deben vivir en controllers ni adapters. | Centralizar invariantes en `LoanApplicationAggregate`: validar rango (`minAmount`/`maxAmount`), validar moneda, y crear siempre con estado `UNDER_REVIEW`. | 1) Consistencia de negocio desde el punto de entrada. 2) Menos regresiones al cambiar transporte o infraestructura. 3) Trazabilidad directa entre modelo de dominio y comportamiento operativo del servicio. |
