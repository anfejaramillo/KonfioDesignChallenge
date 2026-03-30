# Service Architecture

## Layers

- Domain: modelo de historial crediticio y reglas de normalizacion.
- Application: casos de uso de ingesta (`loanApplicationCreated`) y consultas `findBy`.
- Infrastructure: adapters de repositorio, bus de eventos, idempotencia y ACL local para buro.
- Interfaces: handler de eventos y endpoints HTTP de orquestacion/consulta.

## AWS mapping (target)

- EventBridge + SQS + DLQ: consumo de `loanApplicationCreated` y manejo de retries.
- EventBridge: publicacion de `bureauDataFetched`.
- DynamoDB: almacenamiento de idempotency keys y persistencia de reportes/scores.
- Lambda: ejecucion de handlers y endpoints internos.

## Reliability controls

- Validacion de idempotencia antes de side effects.
- Metadata de trazabilidad (`eventId`, `eventType`, `aggregateId`, `idempotencyKey`, `correlationId`).
- DLQ para eventos no recuperables (representado a nivel de contratos).
