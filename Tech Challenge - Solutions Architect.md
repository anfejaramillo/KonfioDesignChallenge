# **Tech Challenge: Solutions Architect 🚀**

> Gracias por tu interés en formar parte de nuestro equipo. Este reto técnico está diseñado para evaluar tus habilidades, visión estratégica y capacidad de ejecución para la posición de **Solutions Architect** en Konfío.

## **🏢 Contexto del Negocio**

En Konfío, estamos en un proceso continuo de modernización para ofrecer servicios financieros de clase mundial a las PyMEs. Actualmente, contamos con un sistema monolítico *legacy* fuertemente acoplado que maneja la originación y evaluación de crédito, el cual se ha convertido en un cuello de botella operativo.

Tu misión como Solutions Architect es diseñar la estrategia para extraer el "Motor de Decisión de Crédito" hacia una arquitectura moderna, *cloud-native* y orientada a eventos en AWS. Además, queremos evaluar tu visión de **Platform Engineering** para proporcionar un "Golden Path" completo que el equipo de desarrollo pueda consumir fácilmente.

Todo esto, en el contexto de la **Agentic Software Engineering (2026)**, donde evaluaremos cómo orquestas agentes de IA utilizando desarrollo guiado por especificaciones (SDD) para acelerar la entrega de tu solución.

## **🎯 Objetivo del Reto**

Evaluar tu pensamiento sistémico, tus habilidades de diseño de software (patrones y tácticas), tu madurez en Platform Engineering y tu capacidad para liderar migraciones complejas. No buscamos un producto terminado, sino un "esqueleto" funcional y una arquitectura excepcionalmente bien pensada.

## **🛠️ Fases de Entrega y Alcance Técnico (Scope)**

El proyecto debe entregarse en un único repositorio (ej. GitHub/GitLab) e incluir las siguientes fases:

### **Fase 1: System Design y Diseño de Dominio (DDD)**

Documenta y diagrama la arquitectura *To-Be* del nuevo "Motor de Decisión de Crédito":

* **Modelado de Dominio (DDD Estratégico y Táctico):** Muestra cómo aislarías el dominio core. Define los *Bounded Contexts* principales. Profundiza en la parte táctica: identifica y define claramente tus **Entities, Value Objects, Aggregates, Repositories y Domain Events**.

* **Estrategia de Migración del Monolito:** Explica cómo migrarías desde el sistema *legacy*. Evalúa el patrón *Strangler Fig*, cómo manejarías la consistencia eventual y la sincronización de bases de datos (ej. CDC) durante la etapa de coexistencia.

* **Patrones de Integración y Diseño:** El motor necesita consumir APIs de burós de crédito externos. Diseña tus modelos de integración y justifica tus elecciones de **Patrones de Diseño de Software** (ej. *Anti-Corruption Layer*, *Circuit Breaker*, *Transactional Outbox* (***NOP, USO MEJOR IDEMPOTENCIA***), *Strategy* para reglas de crédito).

* **Diagrama de Arquitectura AWS:** Incluye un diagrama completo de la infraestructura enfocada a la solución (uso de serverless/containers, event brokers, bases de datos, networking, etc.).

### **Fase 2: Arquitectura del Código Backend (Hands-on)**

Provee el *scaffold* o código base del microservicio principal (en Python, Go o TypeScript).

* Implementa la estructura basada en **Arquitectura Hexagonal (Ports & Adapters)** o **Clean Architecture**.

* Demuestra en el código la separación estricta dictada por tu diseño táctico de DDD (Dominios, Casos de Uso/Servicios, Adaptadores, Eventos).

### **Fase 3: Decisiones de Arquitectura (ADRs)**

Redacta al menos **dos (2) Architecture Decision Records (ADRs)** que justifiquen tus elecciones técnicas más críticas.

* Deben incluir el contexto, las opciones evaluadas, la decisión final y los **Trade-offs** asumidos. *(Recomendación: enfoca uno en la arquitectura de software y otro en decisiones de plataforma/infraestructura).*

### **Fase 4: Platform Engineering \- El "Golden Path" Completo**

No solo queremos infraestructura, queremos evaluar tu visión de *Platform Engineering*. Provee un "Golden Path" completo y automatizado para este nuevo servicio:

* **Scaffolding / Templates:** ¿Cómo un nuevo desarrollador generaría este servicio mañana? (Puedes incluir configuraciones de herramientas como Projen, Cookiecutter, o plantillas tipo Backstage).

* **Infraestructura como Código (IaC):** Usa Terraform, AWS CDK o Pulumi para definir los recursos base de AWS.

* **CI/CD & DevSecOps:** Define los pipelines de integración y despliegue continuo (ej. GitHub Actions). Incluye pasos de análisis estático, pruebas y *Policy as Code* (ej. Checkov, OPA).

* **Observabilidad integrada:** Configuración base para logs, métricas y traces (OpenTelemetry) listos para usarse.

## **🤖 SDLC Agentic y Spec-Driven Development (2026)**

En Konfío esperamos que utilices flujos de trabajo **Agentic** de frontera para multiplicar tu productividad. Queremos evaluar tu capacidad para dirigir modelos avanzados (ej. **Claude 4.6, Gemini 3, GPT-5.4**) a través de herramientas y agentes (ej. **Cursor, Claude Code, Antigravity**, etc.).

Es **obligatorio** incluir un archivo AGENTS.md documentando tu orquestación:

1. **Spec-Driven Development (SDD):** Explica cómo utilizaste especificaciones técnicas y prompts estructurados (ej. .cursorrules, archivos SPEC.md) para dirigir el comportamiento del agente antes de generar código. ¿Cómo acotaste el contexto del LLM para evitar alucinaciones arquitectónicas?

2. **Ecosistema y Herramientas:** ¿Qué modelos y frameworks de agentes autónomos utilizaste?

3. **Skills y MCPs (Model Context Protocol):** ¿Qué servidores MCP inyectaste para darle superpoderes a tu agente? (ej. AWS MCP para IaC, Github MCP, herramientas de linting/ast-grep, review o integraciones de documentación).

## **🚦 Criterios de Evaluación y Entregables**

A continuación, detallamos exactamente cómo ponderaremos tu entrega. Ningún detalle será pasado por alto.

### **🔴 Requeridos (Lo esencial)**

* \[ \] **Fase 1:** Diseño del sistema, diagrama AWS, estrategia de migración y DDD profundo (Estratégico \+ Táctico).

* \[ \] **Fase 2:** Código backend estructurado reflejando patrones de diseño y Clean/Hexagonal Architecture.

* \[ \] **Fase 3:** Dos (2) ADRs con evaluación clara de *trade-offs*.

* \[ \] **Fase 4:** Golden Path completo evidenciando madurez en Platform Engineering (Scaffolding, IaC, CI/CD, Observability).

* \[ \] **IA:** Archivo AGENTS.md demostrando el uso de desarrollo agéntico de forma efectiva.

* \[ \] Repositorio de código accesible con un README.md estructurado y profesional que sirva como punto de entrada.

### **🟡 Recomendados**

* \[ \] **Tolerancia a fallos:** Código o IaC demostrando *Dead Letter Queues (DLQ)*, retries o circuit breakers.

* \[ \] **FinOps:** Estimación de costos y eficiencia en la elección de recursos cloud.

### **🟢 Opcionales**

* \[ \] **Test de Integración/Arquitectura:** Un test automatizado que demuestre que el dominio está verdaderamente desacoplado de la infraestructura.

**💡 Nota final:** Usa la IA a máxima capacidad para encargarte del *boilerplate*. Invierte tu tiempo humano en la arquitectura profunda, el diseño de la plataforma, la evaluación de trade-offs y las decisiones tácticas.

¡Mucho éxito\! Estamos ansiosos por ver tu solución y discutirla contigo en la entrevista técnica.