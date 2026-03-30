# Service Architecture

## Layers

- Domain: reglas de decision y modelo de `CreditDecision`/`RiskAssesment`.
- Application: orquestacion del caso de uso y validacion de idempotencia.
- Infrastructure: adapters de repositorio, idempotencia y EventBridge.
- Interfaces: endpoint HTTP y handler para evento de riesgo.

## AWS mapping (target)

- EventBridge + SQS + DLQ: consumo de `riskAssesmentCompleted`.
- EventBridge: publicacion de `creditDecisionMade`.
- DynamoDB: idempotency store y persistencia de decisiones/riesgo.
- Lambda: ejecucion del handler y endpoints internos.

## Reliability controls

- Validacion idempotente antes de persistir/publicar.
- Metadata de trazabilidad (`eventId`, `idempotencyKey`, `correlationId`).
- DLQ para eventos no recuperables.