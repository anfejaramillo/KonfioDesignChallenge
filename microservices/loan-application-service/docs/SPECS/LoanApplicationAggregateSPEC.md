# SPEC - Loan Application Aggregate Microservice

## Business Case

Construir el microservicio del bounded context `LoanApplicationAggregate` para administrar la captura y persistencia de solicitudes de credito, conservar trazabilidad de eventos de dominio y habilitar orquestacion event-driven con idempotencia.

## Functional Requirements

1. Registrar una solicitud de credito con datos de `Applicant`, `LoanApplication` y `LoanProduct`.
2. Validar reglas basicas de dominio:
   - Monto solicitado debe estar dentro del rango permitido por el producto.
   - Moneda de solicitud debe coincidir con moneda del producto.
3. Persistir el estado inicial de la solicitud en `UNDER_REVIEW`.
4. Publicar evento `loanApplicationCreated` con metadata de idempotencia.
5. Consumir evento `creditDecisionMade` para actualizar el estado final (`APPROVED` o `REJECTED`).
6. Evitar reprocesamiento de comandos/eventos mediante `idempotencyKey`.

## Domain Events

### Produced

- `loanApplicationCreated`
  - `eventId`
  - `idempotencyKey`
  - `applicationId`
  - `applicantId`
  - `loanProductId`
  - `requestedAmount`
  - `currencyCode`
  - `status`
  - `occurredAt`

### Consumed

- `creditDecisionMade`
  - `eventId`
  - `idempotencyKey`
  - `applicationId`
  - `applicantId`
  - `decision` (`APPROVED | REJECTED | UNDER_REVIEW`)
  - `approvedAmount`
  - `interestRate`
  - `occurredAt`

## Non-Functional Requirements

1. Arquitectura: Clean Architecture + Ports and Adapters.
2. Dominio desacoplado de infraestructura.
3. Integracion cloud-native orientada a AWS (EventBridge, SQS, DynamoDB, Lambda).
4. Logs estructurados y `correlationId`.
5. Retries con backoff exponencial y DLQ en consumidores.

## Out of Scope

1. Analisis de riesgo.
2. Integracion directa con buro de credito.
3. Desembolso y cobranza.
