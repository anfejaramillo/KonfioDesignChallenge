# ADR-001 - Bounded Context = Service Boundary

## Context

Se requiere implementar el aggregate `LoanApplicationAggregate` sin mezclar logica de riesgo o decision.

## Decision

Crear `loan-application-service` dedicado al aggregate y exponer solo responsabilidades de creacion/actualizacion del estado de solicitud.

## Consequences

- Mejora cohesion del dominio.
- Reduce acoplamiento con agregados de decision.
- Obliga integracion asincrona por eventos.
