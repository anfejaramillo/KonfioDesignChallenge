# Service Architecture

## Layers

- Domain: modelo de historial crediticio y reglas de normalizacion.
- Application: casos de uso de ingesta (`loanApplicationCreated`) y consultas `findBy`.
- Infrastructure: adapters de repositorio, bus de eventos, idempotencia y ACL local para buro.
- Interfaces: handler de eventos y endpoints HTTP de orquestacion/consulta.

## AWS mapping (target, no esta implementado)

- EventBridge + SQS + DLQ: consumo de `loanApplicationCreated` y manejo de retries.
- EventBridge: publicacion de `bureauDataFetched`.
- DynamoDB: almacenamiento de idempotency keys y persistencia de reportes/scores.
- Lambda: ejecucion de handlers y endpoints internos.

## Reliability controls

- Validacion de idempotencia antes de side effects.
- Metadata de trazabilidad (`eventId`, `eventType`, `aggregateId`, `idempotencyKey`, `correlationId`).
- DLQ para eventos no recuperables (representado a nivel de contratos).

## Architecture Decision Records

A continuacion se enumeran las ADRs respectivas a la contruccion de este microservicio.

| Título | Contexto | Decisión | Consecuencias |
|:-------------|:---------------|:-------------|:-------------|
|Idemppotency First para consistencia eventual|El flujo asincrono de buro puede entregar mensajes duplicados o reintentos.|Requerir `idempotencyKey` en todos los comandos/eventos del servicio y validar duplicados antes de persistir o publicar.|1) Se evitan side effects duplicados en reportes y scores. 2) Se requiere almacenamiento con TTL para llaves procesadas. 3) Se simplifica consistencia eventual en cadena de eventos.|


