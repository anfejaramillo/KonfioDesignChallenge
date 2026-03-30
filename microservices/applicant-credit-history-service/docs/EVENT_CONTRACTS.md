# Event Contracts

## Consumed: loanApplicationCreated

```json
{
  "eventId": "string",
  "eventType": "loanApplicationCreated",
  "aggregateId": "loan-application-id",
  "idempotencyKey": "string",
  "correlationId": "string",
  "applicationId": "string",
  "applicantId": "string",
  "loanProductId": "string",
  "requestedAmount": 12000,
  "currencyCode": "MXN",
  "status": "UNDER_REVIEW",
  "occurredAt": "2026-03-30T00:00:00.000Z"
}
```

## Produced: bureauDataFetched

```json
{
  "eventId": "string",
  "eventType": "bureauDataFetched",
  "aggregateId": "loan-application-id",
  "idempotencyKey": "string",
  "correlationId": "string",
  "applicationId": "string",
  "applicantId": "string",
  "providersProcessed": ["BuroDeCredito", "CirculoDeCredito"],
  "reportsStored": 2,
  "scoresUpdated": 2,
  "occurredAt": "2026-03-30T00:00:00.000Z"
}
```
