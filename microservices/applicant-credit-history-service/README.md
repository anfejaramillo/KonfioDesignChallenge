# Applicant Credit History Service

Microservicio del bounded context `ApplicantCreditHistoryAggregate` para consultar, persistir y normalizar historial crediticio de solicitantes.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install dependencies

```bash
cd microservices/applicant-credit-history-service
npm install
```

### Run locally

```bash
npm run start:dev
```

Por defecto el servicio queda disponible en:

- `http://localhost:3001`

### Build

```bash
npm run build
```

### Run tests

```bash
npm run test
```

## Public API docs (OpenAPI)

- Swagger UI (public): `http://localhost:3001/public/docs`
- OpenAPI JSON download (public): `http://localhost:3001/public/openapi.json`

Descargar el archivo OpenAPI desde terminal:

```bash
curl -L "http://localhost:3001/public/openapi.json" -o applicant-credit-history-service.openapi.json
```

## Service flow

1. Consume `loanApplicationCreated`.
2. Consulta proveedores de buro (ACL local en el scaffold).
3. Persiste `BureauReport` por proveedor.
4. Normaliza score a escala Konfio (`0..1000`) y persiste `CreditScore`.
5. Publica `bureauDataFetched`.

## Endpoints

Base URL usada en ejemplos:

```bash
BASE_URL="http://localhost:3001"
```

### 1) Health check

- Method: `GET`
- Path: `/applicant-credit-history/health`
- Description: valida que el microservicio este activo.

```bash
curl -X GET "$BASE_URL/applicant-credit-history/health"
```

### 2) Process loanApplicationCreated event

- Method: `POST`
- Path: `/applicant-credit-history/events/loan-application-created`
- Description: procesa el evento, aplica idempotencia por `idempotencyKey`, persiste reportes/scores y dispara `bureauDataFetched`.

```bash
curl -X POST "$BASE_URL/applicant-credit-history/events/loan-application-created" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "evt-loan-app-001",
    "eventType": "loanApplicationCreated",
    "aggregateId": "loan-app-001",
    "applicationId": "loan-app-001",
    "applicantId": "applicant-001",
    "idempotencyKey": "idem-loan-app-001-v1",
    "correlationId": "corr-loan-app-001-v1",
    "occurredAt": "2026-03-30T12:00:00.000Z"
  }'
```

Respuesta esperada (ejemplo):

```json
{
  "applicantId": "applicant-001",
  "reportsStored": 2,
  "scoresUpdated": 2,
  "status": "PROCESSED"
}
```

Si se reenvia el mismo `idempotencyKey`, retorna `DUPLICATE_IGNORED`.

### 3) Get bureau reports by applicant

- Method: `GET`
- Path: `/applicant-credit-history/:applicantId/bureau-reports`
- Description: consulta todos los `BureauReport` del solicitante, ordenados por fecha de captura.

```bash
curl -X GET "$BASE_URL/applicant-credit-history/applicant-001/bureau-reports"
```

Respuesta esperada (ejemplo):

```json
{
  "applicantId": "applicant-001",
  "reports": [
    {
      "reportId": "report-uuid",
      "applicantId": "applicant-001",
      "providerName": "BuroDeCredito",
      "rawData": {
        "providerReference": "stub-buro-reference",
        "status": "OK",
        "debtRatio": 0.32
      },
      "fetchedAt": "2026-03-30T12:00:00.000Z"
    }
  ]
}
```

### 4) Get latest credit scores by applicant

- Method: `GET`
- Path: `/applicant-credit-history/:applicantId/credit-scores/latest`
- Description: trae el score mas reciente por proveedor para el solicitante.

```bash
curl -X GET "$BASE_URL/applicant-credit-history/applicant-001/credit-scores/latest"
```

Respuesta esperada (ejemplo):

```json
{
  "applicantId": "applicant-001",
  "scores": [
    {
      "scoreId": "score-uuid",
      "applicantId": "applicant-001",
      "providerName": "BuroDeCredito",
      "score": 691,
      "updatedAt": "2026-03-30T12:00:00.000Z"
    }
  ]
}
```

### 5) Get latest credit score by applicant and provider

- Method: `GET`
- Path: `/applicant-credit-history/:applicantId/credit-scores/latest?providerName=...`
- Description: filtra el score mas reciente de un proveedor especifico.

```bash
curl -X GET "$BASE_URL/applicant-credit-history/applicant-001/credit-scores/latest?providerName=BuroDeCredito"
```

## Event contracts

### Consumed event: loanApplicationCreated

Campos minimos:

- `eventId`
- `eventType` (`loanApplicationCreated`)
- `aggregateId`
- `applicationId`
- `applicantId`
- `idempotencyKey`
- `correlationId`
- `occurredAt`

### Produced event: bureauDataFetched

Campos relevantes:

- `eventId`
- `eventType` (`bureauDataFetched`)
- `aggregateId`
- `applicationId`
- `applicantId`
- `providersProcessed`
- `reportsStored`
- `scoresUpdated`
- `idempotencyKey`
- `correlationId`
- `occurredAt`

## Notes

- El scaffold usa adaptadores `in-memory` para repositorio e idempotencia.
- La ACL de buro tambien es local (`stub`) para desarrollo.
- En produccion se debe reemplazar por integraciones reales (DynamoDB, EventBridge, SQS/DLQ, proveedor de buro).
