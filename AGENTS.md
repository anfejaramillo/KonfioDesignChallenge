# AGENTS.md — Agentic Orchestration 
## Filosofía

Este repositorio sigue estrictamente el paradigma:

## Spec-Driven Development (SDD)

NUNCA se genera código sin una especificación previa validada.

## El objetivo es:

Maximizar calidad arquitectónica
Minimizar alucinaciones de LLMs
Asegurar consistencia entre microservicios
Arquitectura de Agentes

# 1. Domain Agent

Leer, entender y aplicar DDD al tech challenge de Konfio, y usando los documentos de "Modelado de Dominio.md" y "Entrega.md".

## Responsabilidad:

Los archivos de salida deben tener el nombre del Dominio analizado y estar bajo la carpeta "SPECS"

Modelado táctico DDD
Entities
Value Objects
Aggregates
Domain Events

## Outputs:

DOMAIN_MODEL.md
SPEC.md for each aggregate (microservice) designed.

# 2. Backend Agent (NestJS)

Leer, entender y aplicar DDD al tech challenge de Konfio, y usando los documentos de "Modelado de Dominio.md" y "Entrega.md". Y ejecutar la responsabilidad.

## Responsabilidad:

Implementar microservicios
Aplicar Clean Architecture (Hexagonal)

## Reglas:

NO crear lógica fuera del dominio
NO acceder a infraestructura desde dominio

## Estructura obligatoria:

src/
domain/
application/
infrastructure/
interfaces/

# 3. Platform Agent

## Responsabilidad:

IaC (Terraform / CDK)
CI/CD
Observabilidad
Seguridad

## Outputs:

PLATFORM.md
infra/

# 4. Integration Agent

## Responsabilidad:

Integraciones externas (buró de crédito)
Anti-Corruption Layer

# 5. QA / Validation Agent

## Responsabilidad:

Validar consistencia entre:
SPEC
Código
Arquitectura
Flujo de Orquestación

## flow:

→ Domain Agent
→ SPEC.md
→ DOMAIN_MODEL.md
→ Backend Agent → Microservicios NestJS
→ Platform Agent → IaC + CI/CD (disable for now)
→ QA Agent → Validación final (disable for now)

# Spec-Driven Development

## Paso 1 — SPEC
Definir:

Caso de negocio
Requerimientos funcionales
Eventos de dominio

## Paso 2 — Dominio

MODELADO DDD completo

## Paso 3 — Arquitectura

Diagramas
Decisiones técnicas (ADRs)

## Paso 4 — Implementación

Microservicios NestJS

🚫 Prohibido saltarse pasos

🧱 Estándares de Código (NestJS)

## Arquitectura:

Clean Architecture
Ports & Adapters
CQRS cuando aplique

## Reglas:

Dominio NO depende de infraestructura
Casos de uso orquestan lógica
Infraestructura implementa interfaces
Integración con AWS

## Servicios esperados:

Lambda (compute)
EventBridge (event bus)
SQS (colas + DLQ)
DynamoDB (idempotency + eventos)
API Gateway
🔌 MCPs (Model Context Protocol)

## Recomendados:

AWS MCP → infraestructura
GitHub MCP → PRs / código
Terraform MCP → IaC
AST / Lint MCP → validación de código
Modelos por Tarea

Arquitectura → GPT-5.x / Claude
Código → Claude Code / Codex
Infraestructura → GPT + Terraform MCP
Validación → Claude

# 🚫 Control de Alucinaciones

## Estrategias:

Contexto limitado
Solo archivos relevantes
Uso de SPEC
Fuente única de verdad
Validación cruzada
QA Agent revisa outputs
No generación libre
Todo debe estar trazado a dominio

# Estrategia de Desarrollo

## Microservicios:

Cada bounded context → 1 microservicio NestJS

Ejemplo:

### loan-application-service
### risk-assessment-service
### credit-decision-service

## 🔁 Comunicación
### Event-driven (EventBridge)
### Idempotencia obligatoria
### Outbox pattern

## ⚙️ Uso en VS Code

### Herramientas:

Cursor / Codex extension
Claude Code

### Workflow sugerido:

Abrir SPEC.md
Invocar Architect Agent
Validar output
Invocar Backend Agent
Revisar código generado
Commit + PR
📌 Reglas Clave
NO código sin SPEC
NO lógica fuera del dominio
TODO evento debe ser idempotente
TODO servicio debe ser observable
🚀 Objetivo

## Construir una plataforma:

Escalable
Desacoplada
Event-driven
Cloud-native