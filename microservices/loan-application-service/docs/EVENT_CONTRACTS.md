# Event Contracts

## Produced: loanApplicationCreated

```json
{
  "eventId": "string",
  "eventType": "loanApplicationCreated",
  "aggregateId": "string",
  "idempotencyKey": "string",
  "correlationId": "string",
  "applicationId": "string",
  "applicantId": "string",
  "loanProductId": "string",
  "requestedAmount": 10000,
  "currencyCode": "MXN",
  "status": "UNDER_REVIEW",
  "occurredAt": "2026-03-30T00:00:00.000Z"
}
```

## Consumed: creditDecisionMade

```json
{
  "eventId": "string",
  "eventType": "creditDecisionMade",
  "aggregateId": "string",
  "idempotencyKey": "string",
  "correlationId": "string",
  "applicationId": "string",
  "applicantId": "string",
  "decision": "APPROVED",
  "approvedAmount": 8000,
  "interestRate": 0.25,
  "occurredAt": "2026-03-30T00:00:00.000Z"
}
```
