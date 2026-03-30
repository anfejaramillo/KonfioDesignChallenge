# SPEC - Applicant Credit History Aggregate Microservice

## Business Case

Construir el microservicio del bounded context `ApplicantCreditHistoryAggregate` para consultar, persistir y normalizar historial crediticio de solicitantes, habilitando orquestacion event-driven con idempotencia.

## Functional Requirements

1. Consumir `loanApplicationCreated` para iniciar la obtencion del historial crediticio del solicitante.
2. Almacenar la data cruda de cada proveedor como `BureauReport`.
3. Normalizar score por proveedor hacia la escala interna de Konfio y almacenar `CreditScore`.
4. Publicar `bureauDataFetched` cuando termine el proceso de persistencia y normalizacion.
5. Incluir metadata de trazabilidad en eventos: `eventId`, `idempotencyKey`, `correlationId`, `occurredAt`.
6. Evitar reprocesamiento de comandos/eventos usando `idempotencyKey`.

## Domain Events

### Consumed

- `loanApplicationCreated`
  - `eventId`
  - `idempotencyKey`
  - `correlationId`
  - `applicationId`
  - `applicantId`
  - `loanProductId`
  - `requestedAmount`
  - `currencyCode`
  - `status`
  - `occurredAt`

### Produced

- `bureauDataFetched`
  - `eventId`
  - `idempotencyKey`
  - `correlationId`
  - `applicationId`
  - `applicantId`
  - `providersProcessed`
  - `reportsStored`
  - `scoresUpdated`
  - `occurredAt`

## Non-Functional Requirements

1. Arquitectura: Clean Architecture + Ports and Adapters.
2. Dominio sin dependencias de infraestructura.
3. Integracion cloud-native orientada a AWS (EventBridge, SQS, DLQ, DynamoDB).
4. Logging estructurado con `correlationId`.
5. Idempotencia persistente con TTL, alineada al tiempo de retencion de colas.
6. Retries con backoff exponencial y DLQ para errores no recuperables.

## Out of Scope

1. Integracion real con proveedores externos de buro (se deja scaffold de ACL).
2. Calculo de riesgo (`RiskAssessment`).
3. Toma de decision de credito (`CreditDecision`).
