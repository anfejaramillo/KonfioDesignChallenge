# ADR-002 - Idempotency-first Event Processing

## Context

El flujo usa mensajeria asincrona y puede reprocesar mensajes.

## Decision

Hacer `idempotencyKey` obligatorio en comandos y eventos, y validar duplicados antes de persistir o publicar.

## Consequences

- Evita side effects duplicados.
- Requiere almacenamiento adicional con TTL.
- Simplifica consistencia eventual entre servicios.
