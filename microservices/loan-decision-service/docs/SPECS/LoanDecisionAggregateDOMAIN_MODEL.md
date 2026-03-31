# DOMAIN_MODEL - Loan Decision Aggregate

## Bounded Context

- `LoanDecisionAggregate`

## Aggregate Root

- `CreditDecision`

## Entities

### CreditDecision (Aggregate Root)

- `id`
- `applicationId`
- `applicantId`
- `decision` (`APPROVED | REJECTED | UNDER_REVIEW`)
- `approvedAmount`
- `assignedInterestRate`
- `riskAssessmentId`
- `calculatedAt`

### RiskAssesment

- `id`
- `applicationId`
- `applicantId`
- `riskLevel`
- `riskAnalysisResult`
- `calculatedAt`

## Value Objects

### RiskLevel

- `probabilityOfDefaultUpperLimit`
- `description`

## Repositories

### LoanDecisionRepository

- `saveRiskAssessment(assessment)`
- `saveCreditDecision(decision)`
- `findDecisionByApplicationId(applicationId)`
- `findRiskAssessmentById(riskAssessmentId)`

## Domain Events

### riskAssesmentCompleted

Evento consumido cuando finaliza el analisis de riesgo para una solicitud.

### creditDecisionMade

Evento emitido con el resultado de decision para actualizar el estado final de la solicitud.