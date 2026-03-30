# LoanApplicationAggregate Documentation

## Aggregate intent

`LoanApplicationAggregate` modela la captura y evolucion de una solicitud de credito dentro de su ciclo de vida inicial.

## Aggregate members

- `Applicant`
- `LoanApplication` (aggregate root)
- `LoanProduct`

## Invariants

1. `requestedAmount` debe estar entre `minAmount` y `maxAmount` del producto.
2. La moneda de la solicitud debe coincidir con la moneda del producto.
3. El estado inicial siempre es `UNDER_REVIEW`.

## Lifecycle

1. Crear solicitud.
2. Emitir `loanApplicationCreated`.
3. Esperar `creditDecisionMade`.
4. Actualizar estado final de `LoanApplication`.
