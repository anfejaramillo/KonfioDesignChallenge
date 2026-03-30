---
name: createscaffold
description: Generate and evolve NestJS microservice scaffolds for the Konfio credit decision platform using Spec-Driven Development, DDD tactical modeling, and Clean Architecture (hexagonal). Use when creating a new bounded-context service, reorganizing an existing service to domain/application/infrastructure/interfaces, enforcing idempotent event-driven integration (EventBridge, SQS, DLQ), or aligning implementation with SPEC.md, DOMAIN_MODEL.md, and AGENTS.md constraints.
---

# Create Scaffold

Use this skill to build or refactor a backend microservice scaffold without skipping SDD gates.

## Enforce non-negotiable gates

1. Confirm `SPEC.md` exists and is the source of truth for functional scope.
2. Confirm `DOMAIN_MODEL.md` exists and maps entities, value objects, aggregates, repositories, and domain events.
3. Stop and ask for missing specs before generating code.
4. Keep traceability from every code artifact back to SPEC/domain decisions.

## Load only required context

1. Read `SPEC.md` and `DOMAIN_MODEL.md` first.
2. Read `AGENTS.md` to enforce orchestration and architecture rules.
3. Read `ARCHITECTURE.md` and ADRs only when integration or platform choices affect code structure.
4. Avoid loading unrelated documents.

## Derive service boundaries

1. Map each bounded context to one microservice.
2. Keep one service focused on one domain capability.
3. Define inbound and outbound domain events with explicit payload contracts.
4. Mark every event as idempotent and define deduplication persistence strategy.

## Generate mandatory structure

Create this layout per service:

```text
<service-name>/
  src/
    domain/
    application/
    infrastructure/
    interfaces/
```

Apply these boundaries:

1. Keep domain logic only in `src/domain`.
2. Put use cases and orchestration in `src/application`.
3. Implement adapters, persistence, messaging, and external clients in `src/infrastructure`.
4. Place controllers, handlers, DTOs, and transport contracts in `src/interfaces`.
5. Prevent domain imports from infrastructure.

## Apply event-driven standards

1. Define consumed and produced events as explicit contracts.
2. Require `eventId`, `idempotencyKey`, and timestamp metadata.
3. Implement idempotency store in DynamoDB or equivalent key-value persistence.
4. Configure retries with exponential backoff and DLQ routing for non-recoverable failures.
5. Include outbox-like reliability mechanism when publishing events from state changes.

## Apply platform alignment

1. Target AWS primitives expected by the challenge: Lambda, EventBridge, SQS, API Gateway, DynamoDB.
2. Keep application code cloud-agnostic behind ports where possible.
3. Add structured logs, correlation IDs, and basic telemetry hooks.

## Produce minimum outputs

When creating or updating a service, deliver:

1. Folder scaffold and initial module wiring.
2. Domain entities/value objects/events skeletons tied to `DOMAIN_MODEL.md`.
3. Application use-case skeletons tied to domain events and commands.
4. Infrastructure adapters for repositories, event bus, and idempotency store.
5. Interface layer handlers/controllers with DTO contracts.
6. Basic unit test skeletons for domain and use cases.
7. README section describing event flow and idempotency guarantees.

## Validate before handoff

1. Verify architecture rule: domain has no infrastructure dependency.
2. Verify each produced event has idempotency metadata.
3. Verify each consumer checks duplicates before side effects.
4. Verify naming and paths are consistent with bounded context terminology.
5. Report assumptions and unresolved spec gaps explicitly.

## Use this execution order

1. Spec and domain validation.
2. Service boundary definition.
3. Scaffold generation.
4. Domain and use-case skeletons.
5. Infrastructure and interfaces.
6. Tests and validation checks.