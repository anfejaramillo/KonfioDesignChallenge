# Konfio Tech Challenge - Solutions Architect

Este repositorio contiene los entregables de arquitectura y diseño de dominio para el reto de Solutions Architect de Konfio, enfocado en la extracción del motor de decisión de crédito desde un monolito legacy hacia una plataforma cloud-native en AWS orientada a eventos.

## 1) Propósito

La solución propuesta se basa en:

- Domain-Driven Design (DDD)
- Principios de Clean / Hexagonal Architecture para servicios backend
- Integración event-driven con garantías fuertes de idempotencia
- Migración progresiva desde el sistema legacy usando Strangler Fig + Canary

El objetivo es construir una plataforma escalable, desacoplada y observable, capaz de coexistir con el sistema legacy durante la migración con bajo riesgo de negocio.

## 2) Contenido del repositorio

- `Tech Challenge - Solutions Architect.md`
  - Enunciado original del reto y criterios de evaluación.
- `AGENTS.md`
  - Estrategia de orquestación de agentes y flujo SDD.
- `.cursorrules`
  - Guardrails para desarrollo asistido por IA (DDD, arquitectura, capas, idempotencia, testing).
- `Modelado de Dominio.md`
  - Modelo táctico DDD: entidades, value objects, agregados, repositorios y eventos de dominio.
- `Entrega.md`
  - Documento principal de arquitectura: estrategia de migración, ADRs y Golden Path.
- `Diagrama de arquitectura.drawio`
  - Diagrama de arquitectura en AWS (coexistencia legacy + moderno, flujo de eventos, CDC, circuit breaker, DLQs).

## 3) Alcance por fases

### Fase 1 - System Design y Diseño de Dominio
Entregado:
- Modelo de dominio táctico (entidades, value objects, agregados, repositorios, eventos)
- Estrategia de migración del monolito
- Selección de patrones de integración y resiliencia
- Diagrama de arquitectura en AWS

### Fase 2 - Arquitectura de código backend
Estado actual:
- Arquitectura y restricciones definidas para microservicios en NestJS
- Aún no se incluye código productivo en este repositorio

### Fase 3 - ADRs
Entregado:
- Estrategia CDC con DMS + Kinesis + Lambda
- Manejo de DLQ con SQS + Lambda
- Circuit breaker + enrutamiento canary con Lambda
- Estrategia de DR tipo Pilot Light

### Fase 4 - Golden Path / Platform Engineering
Entregado conceptualmente:
- Dirección IaC (Terraform-first)
- Etapas base de CI/CD
- Controles de seguridad y políticas
- Observabilidad base (logs, métricas, trazas)

## 4) Resumen del modelo de dominio

Entidades principales:
- Applicant
- CreditScore
- BureauReport
- CreditDecision
- RiskAssesment
- LoanProduct
- LoanApplication

Value Objects:
- RiskLevel
- LoanPolicy
- ScoreProvider
- LoanTerms
- Currency

Agregados:
- LoanApplicationAggregate
- ApplicantCreditHistoryAggregate
- LoanDecisionAggregate

Eventos de dominio:
- loanApplicationCreated
- bureauDataFetched
- riskAssesmentCompleted
- creditDecisionMade

La idempotencia es obligatoria en todos los eventos y consumidores.

## 5) Resumen de arquitectura

La arquitectura propuesta combina:

- Coexistencia con el monolito legacy
- Proxy con circuit breaker para control de tráfico
- Procesamiento asíncrono basado en eventos
- Sincronización temporal mediante CDC
- DLQs y políticas de reintento para resiliencia

Componentes clave en AWS:
- API Gateway
- Lambda
- SQS + DLQs
- Kinesis Data Streams
- DMS
- ECS/Fargate
- Aurora

## 6) Estrategia de migración

Fases:
1. Fundación
2. Replicación de capacidades independientes
3. Implementación de servicios modernos
4. Pruebas shadow
5. Canary releases
6. Migración completa

Patrón principal:
- Strangler Fig con control de tráfico y rollback seguro

## 7) Principios de ingeniería

- No implementación sin especificación previa (SDD)
- Diseño orientado a dominio (DDD-first)
- Separación dominio vs infraestructura
- Arquitectura hexagonal
- Eventos inmutables, versionados e idempotentes
- Principios tipo Outbox
- Observabilidad y seguridad por defecto

## 8) Cómo revisar el diagrama de arquitectura

1. Abrir https://www.drawio.com/
2. Cargar el archivo
3. Revisar:
   - Límites entre sistemas
   - Flujo CDC
   - Ciclo de eventos
   - Manejo de DLQ
   - Componente CircuitBreaker

## 9) Estado actual

Incluye:
- Artefactos de dominio y arquitectura
- Estrategia de migración
- ADRs
- Golden Path conceptual

No incluye:
- Código ejecutable
- IaC y pipelines como código
