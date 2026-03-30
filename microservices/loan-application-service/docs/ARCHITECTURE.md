# Service Architecture

## Layers

- Domain: pure business model and invariants.
- Application: use cases and orchestration.
- Infrastructure: persistence, messaging and idempotency adapters.
- Interfaces: HTTP and event ingress points.

## AWS mapping (target)

- API Gateway + Lambda: HTTP ingress.
- EventBridge: publish `loanApplicationCreated`.
- SQS + DLQ: consume `creditDecisionMade` with retries.
- DynamoDB: idempotency key store and aggregate persistence.

## Reliability controls

- Idempotency check before side effects.
- DLQ for poison events.
- Correlation IDs in logs and events.
