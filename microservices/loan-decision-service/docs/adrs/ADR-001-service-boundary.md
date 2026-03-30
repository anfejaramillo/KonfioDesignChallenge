# ADR-001 - Bounded Context = Service Boundary

## Context

El aggregate `LoanDecisionAggregate` debe evolucionar de forma independiente al flujo de aplicacion y al de historial crediticio.

## Decision

Crear `loan-decision-service` dedicado al agregado de decision para aislar reglas de aprobacion/rechazo.

## Consequences

- Mayor cohesion del dominio de decision.
- Menor acoplamiento con servicios upstream.
- Integracion asincrona por eventos como contrato principal.