# Modelado de Dominio.

## Entidades

### 1. Applicant (Persona)
- id
- name
- dni (Numero de identificacion para consultar historial crediticio)
- incomeOrigin (Origen de los recursos)
- monthlyIncome 
- mobile
- email

### 2. CreditScore (Score crediticio NORMALIZADO a la escala de Konfio)
- id
- idApplicant
- score (Score en escala interna de la compañia)
- scoreProvider (Proveedor de score crediticio, es un valueObject)
- _updatedAt

nota: Pueden haber varios reportes para una misma persona, tanto a nivel historico como a nivel de diferentes proveedores de score crediticio.

### 3. BureauReport (Historico Reportes Crediticios)
- id
- idApplicant
- scoreProvider (Proveedor de score crediticio, es un valueObject)
- rawData (Data en plano extraida del proveedor de score crediticio)
- _fetchedAt

### 4. CreditDecision (Historico de decisiones de analisis de credito)
- id
- idApplicant
- decision (APPROVED, REJECTED, UNDER_REVIEW)
- approvedAmount (Cantidad aprovada)
- assignedInterestRate
- idRiskAssesment
- calculatedAt

### 5. RiskAssesment (Historico del analisis de riesgos)
- id
- idApplicant
- riskLevel (Nivel de riesgo, es un valueObject)
- riskAnalysisResult (Object con la informacion resultado del analisis, su contrato/firma cambia con el tiempo...)
- calculatedAt

### 6. LoanProduct (Tipos de productos crediticios ofrecidos)
- id
- name
- term (Terminos del credito, es un valueObject)
- interestRate (Tasa de interes)
- currency (Tipo de moneda, es un value object)
- minAmmount (Minimo de monto permitido para el producto)
- maxAmmount (Maximo de monto permitido para el producto)
- loanPolicy (Politica del producto de credito, es un value object)

### 7. LoanApplication
- id
- idApplicant
- idLoanProduct
- requestedAmount (Cantidad solicitada por el usuario)
- currency (Tipo de moneda, es un value object)
- status (UNDER_REVIEW, APPROVED, REJECTED)
- requestedAt

## Value Objects

### 1. RiskLevel
- probabilityOfDefaultUpperLimit (Limite superior de la probabilidad de inpago, esto quiere decir, que los registros representan una serie de "riesgos" en orden ascendente, ej: max 20%, max 40%, max....)
- description

### 2. LoanPolicy
- minScore (Minimo Score necesario para aprovacion, en la escala normalizada)
- minRiskLevel (Minimo riesgo permitido para la aprovacion, resultado del analisis de riesgo)
- minIncomeToDebtRatio (Minimo ratio permitido entre los ingresos y la capacidad de endeudamiento)
- manualApproved (Es necesario aprobacion manual?, pensando en que existen clientes preferenciales, o ocaciones donde por motivos operacionales el credito se debe aprovar sin llevar a cabo el analisis de riesgo).

### 3. ScoreProvider
- name (nombre del proveedor de score, ej: Buro de Credito)
- minScore (valor minimo del score)
- maxScore (valor maximo del score)
- mapFunction (Funcion de mapeo del rango de valores de score del proveedor al rango de valores del score manejado internamente)

### 4. LoanTerms
- term
- timePeriodType (Tipo de periodo, ej: Semana, diario, mensual, etc)

### 5. Currency (Moneda)
- name
- code (ej: MXN, COP, USD,...)

## Agregados

### 1. LoanApplicationAggregate:
- Applicant (Informacion de la persona)
- LoanApplication (Informacion de la solicitud del credito)
- LoanProduct (Informacion del producto crediticio)

### 2. ApplicantCreditHistoryAggregate
- BureauReport (Informacion de historial de credito en formato original de la fuente)
- CreditScore (Informacion de historial de credito normalizado a los estandares de Konfio)

### 3. LoanDecisionAggregate:
- CreditDecision (Historico de decisiones de solicitudes de credito)
- RiskAssesment (Calculo del riesgo para una solicitud de credito)

## Repositorios

### 1. LoanApplicationRepository:
- save(applicant)
- save(loanApplication)
- findBy...
### 2. LoanApplicantCreditHistoryRepository:
- save(creditScore) (funcionalidad privada no expuesta)
- save(bureauReport) (funcionalidad privada no expuesta)
- findBy...
### 3. LoanLoadDecisionRepository:
- save(riskAssestMent)
- save(creditDesicion)
- findBy....

## Eventos de Dominio

Cada evento debera tener un idempotency key, y el consumidor debera de garantizar persistencia de las idempotency key (en una DB NoSQL clave-valor) por al menos, el tiempo de retencion configurado en las colas de mensajeria. De esta forma, no tendremos que implementar codigo para garantizar la consistencia de datos por reprocesamiento de eventos.

### 1. loanApplicationCreated
La solicitud de credito ha sido creada. Se debe iniciar el "flujo" de validacion de existencia de historial crediticio, de lo contrario, extraerlo de cada uno de los "#ScoreProvider"

### 2. bureauDataFetched 
La informacion de historial crediticio fue extraida, se debe validar si existe algun "#ScoreProvider" sin estar actualizado, de lo contrario, actualizarlo. En este proceso, la data plana de los "#ScoreProvider" fue almacenada, y normalizada. Se debe disparar la ejecucion del proceso de analisis de riesgo.

### 3. riskAssesmentCompleted
Se realizo el proceso de analisis de riesgo, y se procede a la toma de decision de aprobacion o no del credito

### 4. creditDecisionMade
Se toma la informacion del analisis de riesgo, se consideran las politicas asociadas al producto crediticio, y se evalua la aprobacion manual o no para finalmente, actualizar con el "status" final la entidad de "LoanApplication". Ahora se debe disparar una notificacion al usuario a traves de su "#Applicant.mobile" o "#Applicant.email".



