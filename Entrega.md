# Documento de arquitectura: Tech Challenge Konfio

En el siguiente documento se enumeran los diferentes aspectos solicitados en la descripcion del *Tech Challenge*.

## Fase 1. Modelado

**Modelado de Dominio:**

Puede encontrarse en el documento "Modelado de Dominio.md", y basicamente se construyo siguiendo los lineamientos del *Domain Driven Design* (DDD) y consta de entidades, value objects, agregados, repositorios y eventos de dominio.

**Patrones de Integración y Diseño:**

Se escogieron algunos patrones de diseño para la implementacion, mientras que otros fueron descartados, estan enumerados en la lista de ADRs. Aqui, se hace un breve resumen:

- Esquema de CDC (On-Going DB Replication): Debido a que la consistencia de datos eventual entre el sistema legacy y modernizado es temporal, se eligen servicios administrados, donde basicamente, se mantiene el CDC mediante la colocacion de mensajes en topicos de KinesisDataStream para invocar los correspondientes endpoints de los respositorios en los agregados respectivos.

- Alta disponibilidad: Solo una region, cuyo Workload esta distribuido en 3 zonas de disponibilidad.

- Anticorruption Layer: Se elije como adecuado, puesto que el acceso a la persistencia desde el monolito legacy es altamente acoplada, y se intuye que separar el ORM de la capa de datos sera una tarea dificil. Ademas, solo se disponibilizaran endpoint desde legacy para consumo desde el sistema modernizado que sean IDEMPOTENTES, por medio del servicio "anticorrucion" y que esta ubicado en la VPC legacy y con las configuraciones de traffic inbound y outbound que le permitan acceder al mismo.

- Strategy: Este patron se propone su implementacion en el procesamiento de la decision de credito, luego de realizar el analisis de riesgo. ya que en tiempo de ejecucion debe decidirse cual "algoritmo" de decision se ejecutara, o si debera realizarse una aprobacion manual (para clientes "particulares").

- Patron repositorio: Se implementa a nivel de Agregado para garantizar desarrollo rapido y aislamiento de la capa de datos desde la capa de computo.

- Circuit Breaker: Se elije como estrategia fundamental para llevar a cabo la migracion. A traves de una lambda proxy implementada como middleware se enrutara un porcentaje del trafico hacia el sistema modernizado y el resto hacia el sistema legacy (Canary Releases). El Estado del circuito (por cada path o ruta) se almacenara en una DB clave-valor, y su configuracion se realizara por medio de variables de entorno.

- Patron Fanout: Se elije usar Fanout para la notificacion final al cliente.

- CQRS pattern: Para dividir cargas en las DB de carga de lectura y escritura.

- DLQs: Asignacion de DLQs para los errores persistentes en el procesamiento de los mensajes de eventos de dominio (Ver especificaciones en el diagrama de arquitectura). Ademas, de realizar notificaciones por correo a los suscritos. Ademas, todos los mensajes deberan tener una llave de idempotencia para asegurar su no reprocesamiento y la consistencia eventual. Estrategia de reintentos: exponential backoff.

- Outbox: Implementada dentro de la capa de computo de los agregados para asegurar no reprocesamiento y consistencia eventual de los mensjaes (Tabla con los metadatos y contenido de los mensajes, y el resultado y sus metadatos correspondientes). Ademas, de la implementacion de un cron para enviar notificaciones de los mensajes que no fueron procesados a las DLQs correspondientes.

- Strangler Fig: Seleccion de modulos, flujos de eventos y/o data pipelines para ser migrados, por partes, enfocandose en un proceso iterativo de migracion y estabilizacion.

**Diagrama de Arquitectura AWS:**

El diagrama de arqutiectura puede encontrarse en el archivo *"Diagrama de arquitectura.drawio"*, y puede abrise directamente sobre la pagina:
[https://www.drawio.com/](https://www.drawio.com/)

(Herramienta para diagramar que permite mantener sincronizados los archivos en repositorios de Github y Gitlab, ademas de sistemas de archivos en la nube, entre otras posibilidades).

**Estrategia de Migración del Monolito:**

La migracion se realizara utilizando el circuitBreaker como **"inspector"** de los nuevos releases, alli deberemos controlar la distribucion de las peticiones entre el sistema legado y el modernizado, garantizando la no afectacion de las aplicaciones frontales.

Se debe tener presente, que el consumo del nuevo motor de "recomendaciones de credito" desde el sistema legacy debera ser Machine-to-Machine y que posiblemente se debera configurar el listener en los load balancer para apuntar al sistema modernizado, sin embargo, se recomienda redirigir el trafico desde el ALB hacia el API Gateway que integra el Circuit Breaker para garantizar la intercepcion de peticiones y la obtencion de metricas asociadas al correcto funcionamiento del sistema modernizado.

La migracion se debe realizar usando el patron Strangler Fig, recorriendo modulo por modulo, sin embargo, en general, todos deberan seguir algo cercano al siguiente esquema de fases:

### Fases de la migración

### Fase 1 - Fundacion
- Diseño DDD
- Introduccion middleware y redireccion API Gateway (Sin apuntar a nada)
- Habilitar monitoreo y observabilidad basica

---

### Fase 2 - Replicacion funcionalidades sin Dependencias

Por ejemplo (Para el caso de Loan Application):

- Extraer informacion de buro de credito
- Normalizar y guardar informacion de buro de credito 

---

### Fase 3 - Implementacion funcional con dependencias unicamente de dominio

Esto garantiza que los Boundary Context se mantegan. Por ej:

- Desarrollo de RiskAssessmentService
- Consumo de APIs legado a traves de la ACL.

---

### Fase 4 - Pruebas Shadow
- Correr los sistemas en paralelo, y comparar sus resultados (Simulando trafico en el sistema modernizado)

---

### Fase 5 - Canary Releases
- Mediante el circuit breaker gradualmente redirigir el trafico hacia la infraestructura modernizada.

---

### Fase 6 - Full Migration
- Enrutado de trafico total a la nueva infraestructura
- Implementacion de CircuitBreaker multi-region (con DRP basado en la estrategia Pilot-Light)
- Desactivacion del CircuitBreaker original.

## Fase 3. Architecture Decision Records

A continuacion se dejan algunas de las ADRs realizadas, su contexto y consecuencias.

| Título | Contexto | Decisión | Consecuencias |
|:-------------|:---------------|:-------------|:-------------|
| Servicio DMS e infraestructura serverless para proceso CDC | Se necesita definir qué servicios y estrategias se implementarán para mantener actualizada la persistencia en el sistema modernizado respecto al legado. | Se decide implementar DMS para los procesos de CDC, enviando los cambios a un tópico de Kinesis Data Streams que invocará una Lambda. Esta realizará el mapeo de contratos entre el esquema de datos anterior y el nuevo, impuesto por el diseño de dominio, e invocará su almacenamiento en el sistema modernizado. | Agiliza la implementación, elimina la gestión de la capa de infraestructura, facilita la remoción tras el período de coexistencia. Sin embargo, los servicios pueden resultar más costosos a largo plazo. |
| Metodología Push-Based para colas DLQ | SQS es un servicio que puede usarse como message broker que, por defecto, es pull-based de cara a los consumidores. Sin embargo, al asociarle una Lambda, esta puede ser activada al llegar uno o varios mensajes, lo cual aumenta el performance y throughput, siendo útil en casos donde se requiera tomar acciones rápidamente. | Se define la integración entre las DLQ y una Lambda de notificación por correo ("internalEmailNotificationHandler") para todos los mensajes que no puedan ser procesados después de su respectiva política de reintentos. Se implementa así una metodología push-based, notificando al personal interno de la compañía para habilitar procesos manuales. | El servicio de mensajería DLQ es serverless y entrega notificaciones con alto rendimiento. Sin embargo, cuando haya muchos mensajes en las DLQ, el costo podría llegar a ser representativo. |
| Circuit Breaker y enrutador "Canary Releases" | Se necesita implementar el patrón Circuit Breaker para garantizar que, en caso de que el sistema modernizado falle, el circuito redirija el tráfico hacia el sistema legacy, previniendo el consumo ineficiente de recursos. Se consideró implementar circuit breakers independientes y gestionar el pesaje del tráfico a nivel de capa 4 (enrutado de red mediante reglas de ponderación en la hosted zone). Sin embargo, dado que los sistemas coexistirán, se debe asegurar resiliencia automática sin intervención del equipo de infraestructura. | Se debe integrar una Lambda Proxy como middleware entre el API Gateway del sistema legado y el API Gateway del sistema modernizado. Características principales del diseño: 1) Actúa como middleware entre ambos sistemas. 2) Implementa el Circuit Breaker hacia el sistema modernizado. 3) La persistencia del estado del Circuit Breaker residirá en una base de datos NoSQL clave-valor (por su baja latencia de lectura/escritura). 4) La configuración de enrutamiento y ponderación del tráfico se manejará mediante variables de entorno en la Lambda. 5) Debe desarrollarse en un lenguaje/framework que permita SnapStart. | Es un componente crítico para la implementación. Añade latencia a las peticiones (estimada en ~200 ms). Se debe validar el número de Lambdas concurrentes en la cuenta productiva para evitar alcanzar los límites de cuota. Debe ser implementado por personal de desarrollo de nivel senior. |
|Pilot Light como estrategia inicial de DRP.| Se debe definir la estrategia de DRP inicial de la plataforma modernizada| Se implementara una estrategia Pilot Light, con el objetivo de minimizar costos, y teniendo presente que se tendra una forma rapida y economica de realizar rollbacks en caso de despliegues nuevos mediante la lambda del circuit breaker.| Costos de facturacion de la implementacion del sistema modernizado se elevaran entre un 15% y 25%.|

## Fase 4. Golden Path

El roadmap de implementacion tecnico aqui propuesto busca estandarizar la creacion, despliegue y operacion bajo un esquema de microservicios inicialmente agrupados por agregados de dominio (facilitacion de conceptualizacion), con un enfoque opinionado y que pueda ser reutilizable para migrar modulo a modulo un sistema legado a un sistema modernizado. Todo el diseño esta basado en el DDD y permite a nivel arquitectonico dilusidar y entender la solucion general de la problematica. A nivel especifico, se describe la infraestrcutura, patrones de diseño y herramientas a utilizar para garantizar una migracion exitosa y facil de llevar en terminos de soporte y costos operativos.

A nivel de scalfolding: Se deben generar los artefactos base para garantizar agilidad en los despligues, teniendo presente las normativas y politicas de ciberseguridad que apliquen en general a la compañia. Teniendo presente que la operacion comercial es/sera internacional.

A nivel de IaC: El objetivo central es garantizar la facilidad de despliegues en nuevas zonas de disponibilidad segun demanda y crecimiento/expansion comercial de la empresa. Se priorizara el uso de Terraform e implementar practicas de seguridad (e.g. least privilege) para garantizar acogimiento a la normativas vigentes en terminos de servicios de almacenamiento y procesamiento. Todo el trafico debe ser crifrado (in-transit y at-rest).

A nivel de Pipelines: se deben implementar Github Actions o Gitlab CI para la gestion de despliegues automaticos. La siguiente lista de stages son los minimos e indispensables:

- Automated Code Review
- Build
- Validación (tests unitarios)
- Análisis de seguridad (SAST, dependencias)
- Build y empaquetado (Registro de imagenes)
- Despliegue automatizado por ambiente
- Smoke Tests

A nivel de Observabilidad: Se debe integrar herramientas como DataDog o New Relic a los correspondientes health checks y/o sideCars en los contenedores. Se deben implementar Logs estructurados, Trazas distribuidas (Open telemetry) y monitoreo para garantizar en minimo nivel de observabilidad (Observabilidad inicialmente sin "actions", es decir, garantizar monitoreo para desarrollar e integrar observabilidad).

Lo anterior se debe alinear a la implementacion estrategica del patron Strangler Fig como sigue:

Inicialmente, el Golden Path debe permitir la coexistencia entre el sistema legacy y el modernizado, facilitando la creacion de nuevos microservicios que consuman eventos o datos replicados desde el monolito (Sistema Legacy) mediante procesos de CDC. En esta fase, el scaffolding incluye integraciones preconfiguradas con mecanismos de mensajeria (EventBridge/SQS) y adaptadores hacia el sistema legacy, permitiendo desacoplar progresivamente la logica de negocio.

Posteriormente, los pipelines y la infraestructura deben soportar despliegues progresivos (Canary Releases), donde el enrutamiento del trafico es controlado mediante el componente de Circuit Breaker definido en la arquitectura. Esto permite validar el comportamiento del sistema modernizado sin impactar la operacion productiva, manteniendo la capacidad de rollback inmediato.

A medida que se migran los modulos, el Golden Path asegura que cada nuevo microservicio cumpla con los estandares definidos (arquitectura, seguridad, observabilidad, etc), evitando desviaciones y reduciendo la deuda tecnica. Adicionalmente, la instrumentacion desde el inicio permite comparar resultados entre ambos sistemas (shadow testing), guiando la toma de decisiones (Data-Driven) en la migracion.

Finalmente, una vez alcanzada la estabilidad operativa, el mismo Golden Path permite retirar progresivamente las dependencias hacia el sistema legacy (componentes de CDC, adaptadores y rutas legacy), consolidando una arquitectura completamente desacoplada, event-driven y alineada a los principios definidos desde el dominio y la vision de arquitectura.