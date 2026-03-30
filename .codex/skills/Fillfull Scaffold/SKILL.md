---
name: fillfullscaffold
description: Generate and complete full NestJS microservice scaffolds for the Konfio credit decision platform using Spec-Driven Development, DDD tactical modeling, and Clean Architecture (hexagonal). Use when Codex must finish missing components/endpoints in existing services under `microservices/`, enforce `domain/application/infrastructure/interfaces` boundaries, model idempotent event-driven flows, and represent external dependencies through local ports/adapters (no direct cloud dependency in domain or application), fully aligned with `AGENTS.md`, `Entrega.md`, `Modelado de Dominio.md`, and `SPECS/*`.
---

# Fill Full Scaffold

Use this skill to complete or repair a microservice scaffold end-to-end without skipping SDD gates.

## Enforce mandatory source of truth

Read and apply these documents in this exact order before coding:

1. `AGENTS.md`
2. `Entrega.md`
3. `Modelado de Dominio.md`
4. `SPECS/*DOMAIN_MODEL*.md` and `SPECS/*SPEC*.md` for the target aggregate
5. Service-local docs under `microservices/<service>/docs/` (if present)

Hard rule: if SPEC or domain model for the target context is missing or contradictory, stop and report the gap before implementation.

## Respect orchestration defined in AGENTS

Always follow this sequence:

1. Domain understanding and traceability
2. SPEC alignment
3. Architecture decisions and event flow
4. Implementation in NestJS
5. Validation of consistency between docs and code

Never generate free-form code outside documented scope.

## Scope and location rules

1. Work only in the intended service path under `microservices/`.
2. Do not scatter artifacts across unrelated services.
3. If a bounded context maps to one service, keep the implementation inside that service.
4. Preserve existing user code and adapt changes incrementally.

## Required service structure

Keep or create:

```text
src/
  domain/
  application/
  infrastructure/
  interfaces/
```

Layer constraints:

1. `domain/`: entities, value objects, aggregates, domain services, domain events, repository contracts.
2. `application/`: use cases, command/query DTOs, orchestration, ports.
3. `infrastructure/`: repository implementations, event adapters, idempotency adapters, external clients.
4. `interfaces/`: HTTP controllers, event handlers, transport DTOs, mappers.
5. Domain must not import infrastructure.
6. Application must depend on ports, not concrete adapters.

## Full implementation objective

When asked to "complete and fix scaffold", deliver all missing baseline parts for the selected context:

1. Domain model code aligned with `Modelado de Dominio.md` and aggregate SPEC.
2. Use cases for core flow and state transitions.
3. HTTP endpoints and DTO validation for business actions.
4. Event handlers/publishers for domain events.
5. Repository, event bus, and idempotency adapters.
6. Module/provider wiring and dependency injection.
7. Unit tests for domain rules and use cases.
8. Basic integration-style tests for controller/use-case path when feasible.

## Event-driven and idempotency rules

Apply to every produced/consumed event:

1. Include `eventId`, `eventType`, `occurredAt`, `aggregateId`, `idempotencyKey`.
2. Validate duplicate processing before side effects.
3. Store idempotency keys in a key-value adapter (local in-memory/file adapter for local development, cloud adapter swappable later).
4. Model retry and DLQ semantics in interfaces/contracts, even when local adapter is used.
5. Use outbox-style publication semantics for state-change-driven events.

## External dependencies as local interfaces

For challenge development, represent cloud/external systems through ports and local adapters:

1. Queue access through an application port + local adapter (simulate SQS behavior).
2. Event bus through an application port + local adapter (simulate EventBridge topics/rules).
3. Persistence through repository contracts + local implementation.
4. Credit bureau integration through anti-corruption adapter interface.

Do not couple domain logic to SDK clients or cloud-specific classes.

## Alignment with Entrega and migration strategy

Reflect these architectural decisions in code boundaries and contracts:

1. Strangler Fig migration mindset.
2. Circuit-breaker-aware coexistence assumptions (at interface/contracts level when relevant).
3. CQRS only where read/write split is justified by SPEC.
4. DLQ and exponential-backoff strategy represented in message handling contracts.
5. Observability-first hooks: structured logs, correlation IDs, trace propagation points.

## Anti-hallucination and traceability protocol

For each artifact created or edited, keep traceability:

1. Link implementation to SPEC requirement or domain rule.
2. Do not invent entities/events not backed by source docs.
3. If inference is needed, label it as assumption and keep it minimal.
4. Prefer focused context loading; avoid unrelated files.

## Completion checklist before handoff

1. No domain -> infrastructure imports.
2. All required folders/modules exist and compile.
3. Endpoints match use cases and DTO contracts.
4. Events include idempotency metadata.
5. Consumers enforce deduplication.
6. Tests cover critical domain invariants and use-case happy path.
7. Assumptions and open gaps are explicitly reported.

## Expected handoff format

Return:

1. Files created/updated.
2. Mapping from code changes to SPEC/domain requirements.
3. Validation executed (tests/lint/build) and results.
4. Remaining risks or pending decisions.
