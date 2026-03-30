# ApplicantCreditHistoryAggregate Documentation

## Aggregate intent

`ApplicantCreditHistoryAggregate` modela la captura del historial crediticio por proveedor y su normalizacion a la escala interna de Konfio.

## Aggregate members

- `BureauReport`
- `CreditScore`

## Invariants

1. Todo score de proveedor debe estar dentro del rango definido por `ScoreProvider`.
2. Todo score normalizado se calcula sobre escala fija Konfio `0..1000`.
3. Todo procesamiento debe ser idempotente por `idempotencyKey`.

## Lifecycle

1. Recibir `loanApplicationCreated`.
2. Consultar fuentes de historial crediticio (ACL).
3. Persistir `BureauReport`.
4. Normalizar y persistir `CreditScore`.
5. Emitir `bureauDataFetched`.