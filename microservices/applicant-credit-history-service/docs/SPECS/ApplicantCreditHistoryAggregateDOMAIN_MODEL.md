# DOMAIN_MODEL - Applicant Credit History Aggregate

## Bounded Context

- `ApplicantCreditHistoryAggregate`

## Aggregate Root

- `ApplicantCreditHistory`

## Entities

### BureauReport

- `id`
- `applicantId`
- `scoreProvider`
- `rawData`
- `fetchedAt`

### CreditScore

- `id`
- `applicantId`
- `scoreProvider`
- `score`
- `updatedAt`

## Value Objects

### ScoreProvider

- `name`
- `minScore`
- `maxScore`

## Repositories

### LoanApplicantCreditHistoryRepository

- `saveBureauReport(report)`
- `saveCreditScore(score)`
- `findLatestCreditScoreByApplicantAndProvider(applicantId, providerName)`
- `findBureauReportsByApplicantId(applicantId)`

## Domain Events

### loanApplicationCreated

Evento consumido para iniciar el flujo de historial crediticio del solicitante.

### bureauDataFetched

Evento emitido cuando los reportes de buro fueron almacenados y los scores fueron normalizados.
