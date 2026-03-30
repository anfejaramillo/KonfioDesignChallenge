# ADR-002 - Idempotency-first Event Processing

## Context

El consumo de `riskAssesmentCompleted` puede tener duplicados por reintentos o reprocesamiento.

## Decision

Hacer obligatorio `idempotencyKey` y validar duplicados antes de persistir `RiskAssesment`, `CreditDecision` o publicar `creditDecisionMade`.

## Consequences

- Se evitan side effects duplicados en decisiones.
- Se requiere almacenamiento con TTL para llaves de idempotencia.
- Se mejora consistencia eventual entre bounded contexts.