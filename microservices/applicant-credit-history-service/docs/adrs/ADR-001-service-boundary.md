# ADR-001 - Bounded Context = Service Boundary

## Context

`ApplicantCreditHistoryAggregate` requiere evolucionar de forma independiente al aggregate de solicitudes y al de decisiones.

## Decision

Crear `applicant-credit-history-service` dedicado al agregado para aislar reglas de normalizacion y manejo de proveedores de buro.

## Consequences

- Mayor cohesion del dominio de historial crediticio.
- Menor acoplamiento con risk/decision.
- Integracion asincrona obligatoria por eventos.