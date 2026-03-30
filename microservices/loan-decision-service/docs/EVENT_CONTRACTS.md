# Event Contracts

## Consumed: riskAssesmentCompleted

```json
{
  "eventId": "string",
  "eventType": "riskAssesmentCompleted",
  "aggregateId": "application-id",
  "idempotencyKey": "string",
  "correlationId": "string",
  "applicationId": "string",
  "applicantId": "string",
  "riskAssessmentId": "string",
  "riskLevel": {
    "probabilityOfDefaultUpperLimit": 0.28,
    "description": "MEDIUM"
  },
  "riskAnalysisResult": {
    "score": 640
  },
  "occurredAt": "2026-03-30T00:00:00.000Z"
}
```

## Produced: creditDecisionMade

```json
{
  "eventId": "string",
  "eventType": "creditDecisionMade",
  "aggregateId": "application-id",
  "idempotencyKey": "string",
  "correlationId": "string",
  "applicationId": "string",
  "applicantId": "string",
  "decision": "APPROVED",
  "approvedAmount": 12000,
  "interestRate": 0.48,
  "riskAssessmentId": "string",
  "occurredAt": "2026-03-30T00:00:00.000Z"
}
```
