# LoanDecisionAggregate Documentation

## Aggregate intent

`LoanDecisionAggregate` modela la persistencia del riesgo evaluado y la decision final de credito para una solicitud.

## Aggregate members

- `RiskAssesment`
- `CreditDecision` (aggregate root)

## Invariants

1. Toda decision se deriva de un `RiskAssesment` previo.
2. Una politica con aprobacion manual marca `UNDER_REVIEW`.
3. La decision debe emitirse con metadata idempotente.

## Lifecycle

1. Recibir `riskAssesmentCompleted`.
2. Persistir `RiskAssesment`.
3. Evaluar decision por reglas de dominio.
4. Persistir `CreditDecision`.
5. Emitir `creditDecisionMade`.