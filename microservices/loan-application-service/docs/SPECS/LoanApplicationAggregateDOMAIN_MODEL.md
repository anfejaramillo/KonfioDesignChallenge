# DOMAIN_MODEL - Loan Application Aggregate

## Bounded Context

- `LoanApplicationAggregate`

## Aggregate Root

- `LoanApplication`

## Entities

### Applicant

- `id`
- `name`
- `dni`
- `incomeOrigin`
- `monthlyIncome`
- `mobile`
- `email`

### LoanProduct

- `id`
- `name`
- `term`
- `interestRate`
- `currency`
- `minAmount`
- `maxAmount`

### LoanApplication (Aggregate Root)

- `id`
- `applicantId`
- `loanProductId`
- `requestedAmount`
- `currency`
- `status` (`UNDER_REVIEW | APPROVED | REJECTED`)
- `requestedAt`

## Value Objects

### Currency

- `code`
- `name`

### LoanTerms

- `term`
- `timePeriodType`

## Repositories

### LoanApplicationRepository

- `saveApplicant(applicant)`
- `saveLoanApplication(application)`
- `saveLoanProduct(product)`
- `findApplicationById(id)`
- `findApplicantById(id)`
- `findLoanProductById(id)`

## Domain Events

### loanApplicationCreated

Evento emitido cuando se crea una nueva solicitud de credito en estado `UNDER_REVIEW`.

### creditDecisionMade

Evento consumido para actualizar estado final de la solicitud despues del proceso de decision.
