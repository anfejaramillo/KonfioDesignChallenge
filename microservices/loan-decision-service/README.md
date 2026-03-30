# Loan Decision Service

Microservicio del bounded context `LoanDecisionAggregate` para persistir resultados de riesgo y orquestar la toma de decision crediticia con trazabilidad e idempotencia.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install dependencies

```bash
cd microservices/loan-decision-service
npm install
```

### Run locally

```bash
npm run start:dev
```

El servicio inicia por defecto en:

- `http://localhost:3002`

### Build

```bash
npm run build
```

### Run tests

```bash
npm run test
```

## Service flow

1. Consume `riskAssesmentCompleted`.
2. Persiste `RiskAssesment`.
3. Obtiene contexto de decision (monto y politica) por ACL local si no llega en el request.
4. Calcula y persiste `CreditDecision` (`APPROVED | REJECTED | UNDER_REVIEW`).
5. Publica `creditDecisionMade`.

## Endpoints

Base URL para ejemplos:

```bash
BASE_URL="http://localhost:3002"
```

### 1) Health check

- Method: `GET`
- Path: `/loan-decisions/health`
- Description: valida que el servicio este activo.

```bash
curl -X GET "$BASE_URL/loan-decisions/health"
```

Respuesta esperada:

```json
{
  "message": "Loan Decision Service is running."
}
```

### 2) Process riskAssesmentCompleted event

- Method: `POST`
- Path: `/loan-decisions/events/risk-assessment-completed`
- Description: procesa el evento de riesgo, aplica idempotencia, persiste `RiskAssesment`, calcula/persiste `CreditDecision` y dispara `creditDecisionMade`.

```bash
curl -X POST "$BASE_URL/loan-decisions/events/risk-assessment-completed" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "evt-risk-001",
    "eventType": "riskAssesmentCompleted",
    "aggregateId": "loan-app-001",
    "decisionId": "decision-001",
    "applicationId": "loan-app-001",
    "applicantId": "applicant-001",
    "riskAssessmentId": "risk-001",
    "riskLevel": {
      "probabilityOfDefaultUpperLimit": 0.22,
      "description": "LOW"
    },
    "riskAnalysisResult": {
      "score": 730,
      "source": "risk-assessment-service"
    },
    "requestedAmount": 15000,
    "policy": {
      "maxProbabilityOfDefaultForApproval": 0.35,
      "manualApprovalRequired": false,
      "baseInterestRate": 0.2
    },
    "idempotencyKey": "idem-risk-001-v1",
    "correlationId": "corr-risk-001-v1",
    "occurredAt": "2026-03-30T12:00:00.000Z"
  }'
```

Respuesta esperada:

```json
{
  "decisionId": "decision-001",
  "applicationId": "loan-app-001",
  "decision": "APPROVED",
  "status": "PROCESSED"
}
```

Si se reenvia el mismo `idempotencyKey`, la respuesta sera `DUPLICATE_IGNORED`.

### 3) List credit decisions (optional filters)

- Method: `GET`
- Path: `/loan-decisions`
- Query params (optional):
  - `applicantId`
  - `decision` (`APPROVED | REJECTED | UNDER_REVIEW`)
- Description: lista decisiones persistidas y permite filtrar.

```bash
curl -X GET "$BASE_URL/loan-decisions"
```

```bash
curl -X GET "$BASE_URL/loan-decisions?applicantId=applicant-001&decision=APPROVED"
```

Respuesta esperada:

```json
[
  {
    "decisionId": "decision-001",
    "applicationId": "loan-app-001",
    "applicantId": "applicant-001",
    "decision": "APPROVED",
    "approvedAmount": 15000,
    "assignedInterestRate": 0.42,
    "riskAssessmentId": "risk-001",
    "calculatedAt": "2026-03-30T12:00:01.000Z"
  }
]
```

### 4) Get credit decision by applicationId

- Method: `GET`
- Path: `/loan-decisions/:applicationId`
- Description: retorna la decision asociada a una solicitud de credito.

```bash
curl -X GET "$BASE_URL/loan-decisions/loan-app-001"
```

Respuesta esperada:

```json
{
  "decisionId": "decision-001",
  "applicationId": "loan-app-001",
  "applicantId": "applicant-001",
  "decision": "APPROVED",
  "approvedAmount": 15000,
  "assignedInterestRate": 0.42,
  "riskAssessmentId": "risk-001",
  "calculatedAt": "2026-03-30T12:00:01.000Z"
}
```

### 5) Get risk assessment by riskAssessmentId

- Method: `GET`
- Path: `/loan-decisions/risk-assessments/:riskAssessmentId`
- Description: retorna el detalle de `RiskAssesment` persistido.

```bash
curl -X GET "$BASE_URL/loan-decisions/risk-assessments/risk-001"
```

Respuesta esperada:

```json
{
  "riskAssessmentId": "risk-001",
  "applicationId": "loan-app-001",
  "applicantId": "applicant-001",
  "riskLevel": {
    "probabilityOfDefaultUpperLimit": 0.22,
    "description": "LOW"
  },
  "riskAnalysisResult": {
    "score": 730,
    "source": "risk-assessment-service"
  },
  "calculatedAt": "2026-03-30T12:00:00.000Z"
}
```

## Event contracts summary

### Consumed event: `riskAssesmentCompleted`

Required fields:

- `eventId`
- `eventType` (`riskAssesmentCompleted`)
- `aggregateId`
- `applicationId`
- `applicantId`
- `riskAssessmentId`
- `riskLevel`
- `riskAnalysisResult`
- `idempotencyKey`
- `correlationId`
- `occurredAt`

### Produced event: `creditDecisionMade`

Key fields:

- `eventId`
- `eventType` (`creditDecisionMade`)
- `aggregateId`
- `applicationId`
- `applicantId`
- `decision`
- `approvedAmount`
- `interestRate`
- `riskAssessmentId`
- `idempotencyKey`
- `correlationId`
- `occurredAt`

## Notes

- El scaffold usa adapters `in-memory` para persistencia e idempotencia.
- El contexto de solicitud/politica puede obtenerse desde ACL local cuando no viene en el request.
- Para produccion, reemplazar por adaptadores reales (EventBridge, SQS/DLQ, DynamoDB, integraciones de catalogo/politicas).
