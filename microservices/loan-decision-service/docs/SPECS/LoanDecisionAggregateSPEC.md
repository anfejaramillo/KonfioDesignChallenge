# SPEC - Loan Decision Aggregate Microservice

## Business Case

Construir el microservicio del bounded context `LoanDecisionAggregate` para persistir resultados de riesgo y orquestar la toma de decision crediticia con trazabilidad e idempotencia.

## Functional Requirements

1. Consumir `riskAssesmentCompleted` para iniciar evaluacion de decision.
2. Persistir `RiskAssesment` recibido desde el proceso de riesgo.
3. Calcular y persistir `CreditDecision` (`APPROVED | REJECTED | UNDER_REVIEW`) usando reglas de dominio.
4. Publicar `creditDecisionMade` al finalizar la evaluacion.
5. Incluir metadata obligatoria en eventos: `eventId`, `idempotencyKey`, `correlationId`, `occurredAt`.
6. Evitar reprocesamiento de comandos/eventos con `idempotencyKey`.

## Domain Events

### Consumed

- `riskAssesmentCompleted`
  - `eventId`
  - `idempotencyKey`
  - `correlationId`
  - `applicationId`
  - `applicantId`
  - `riskAssessmentId`
  - `riskLevel`
  - `riskAnalysisResult`
  - `occurredAt`

### Produced

- `creditDecisionMade`
  - `eventId`
  - `idempotencyKey`
  - `correlationId`
  - `applicationId`
  - `applicantId`
  - `decision`
  - `approvedAmount`
  - `interestRate`
  - `riskAssessmentId`
  - `occurredAt`

## Non-Functional Requirements

1. Arquitectura: Clean Architecture + Ports and Adapters.
2. Dominio sin dependencias de infraestructura.
3. Integracion cloud-native orientada a AWS (EventBridge, SQS, DLQ, DynamoDB).
4. Logging estructurado con `correlationId`.
5. Idempotencia persistente con TTL acorde a retencion de colas.
6. Retries y DLQ para errores no recuperables.

## Out of Scope

1. Calculo del riesgo (pertenece al servicio de riesgo).
2. Actualizacion directa de `LoanApplication` (se hace por integracion asincrona).
3. Notificacion final al cliente.