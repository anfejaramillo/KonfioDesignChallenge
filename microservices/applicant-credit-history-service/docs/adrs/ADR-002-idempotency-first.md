# ADR-002 - Idempotency-first Event Processing

## Context

El flujo asincrono de buro puede entregar mensajes duplicados o reintentos.

## Decision

Requerir `idempotencyKey` en todos los comandos/eventos del servicio y validar duplicados antes de persistir o publicar.

## Consequences

- Se evitan side effects duplicados en reportes y scores.
- Se requiere almacenamiento con TTL para llaves procesadas.
- Se simplifica consistencia eventual en cadena de eventos.