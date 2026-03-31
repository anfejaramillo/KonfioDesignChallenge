# Service Architecture

## Layers

- Domain: reglas de decision y modelo de `CreditDecision`/`RiskAssesment`.
- Application: orquestacion del caso de uso y validacion de idempotencia.
- Infrastructure: adapters de repositorio, idempotencia y EventBridge.
- Interfaces: endpoint HTTP y handler para evento de riesgo.

## AWS mapping (target)

- EventBridge + SQS + DLQ: consumo de `riskAssesmentCompleted`.
- EventBridge: publicacion de `creditDecisionMade`.
- DynamoDB: idempotency store y persistencia de decisiones/riesgo.
- Lambda: ejecucion del handler y endpoints internos.

## Reliability controls

- Validacion idempotente antes de persistir/publicar.
- Metadata de trazabilidad (`eventId`, `idempotencyKey`, `correlationId`).
- DLQ para eventos no recuperables.

## Architecture Decision Records

A continuacion se enumeran las ADRs respectivas a la contruccion de este microservicio.

| Título | Contexto | Decisión | Consecuencias |
|:-------------|:---------------|:-------------|:-------------|
|Bounded Context = Service Bondary| El aggregate `LoanDecisionAggregate` debe evolucionar de forma independiente al flujo de aplicacion y al de historial crediticio. Se define el agregado como entidad de computo con una carga de trabajo marcadamente diferente de los demas microservicios, por ello, se "un una sola instancia autoescalable de computo"| Crear `loan-decision-service` dedicado al agregado de decision para aislar reglas de aprobacion/rechazo. | 1)Mayor cohesion del dominio de decision. 2) Menor acoplamiento con servicios upstream. 3) Integracion asincrona por eventos como contrato principal.|
|Idemppotency First para consistencia eventual|El flujo asincrono de buro puede entregar mensajes duplicados o reintentos.|Requerir `idempotencyKey` en todos los comandos/eventos del servicio y validar duplicados antes de persistir o publicar.|1) Se evitan side effects duplicados en reportes y scores. 2) Se requiere almacenamiento con TTL para llaves procesadas. 3) Se simplifica consistencia eventual en cadena de eventos.|
