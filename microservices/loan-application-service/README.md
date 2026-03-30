# Loan Application Service

Microservicio del bounded context `LoanApplicationAggregate` para registrar solicitudes de credito, mantener su estado y procesar decisiones de credito de forma idempotente.

## Getting Started

### 1. Requisitos

- Node.js 20+
- npm 10+

### 2. Instalar dependencias

```bash
cd microservices/loan-application-service
npm install
```

### 3. Ejecutar en local

```bash
npm run start:dev
```

Servidor por defecto: `http://localhost:3000`

### 4. Build y pruebas

```bash
npm run build
npm run test
```

## Endpoints

Base URL:

```bash
http://localhost:3000
```

### 1. Registrar Applicant

Crea o actualiza el `Applicant` en el repositorio del agregado.

- Metodo: `POST`
- Path: `/loan-applications/applicants`

```bash
curl -X POST "http://localhost:3000/loan-applications/applicants" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "applicant-100",
    "name": "Ana Gomez",
    "dni": "10101010",
    "incomeOrigin": "SALARY",
    "monthlyIncome": 12000,
    "mobile": "+525511112222",
    "email": "ana.gomez@example.com",
    "idempotencyKey": "idem-applicant-100-v1"
  }'
```

Respuesta esperada:

```json
{
  "applicantId": "applicant-100"
}
```

### 2. Registrar Loan Product

Crea o actualiza el `LoanProduct` que luego se usa al crear solicitudes.

- Metodo: `POST`
- Path: `/loan-applications/products`

```bash
curl -X POST "http://localhost:3000/loan-applications/products" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "product-100",
    "name": "Capital de Trabajo PYME",
    "term": 12,
    "timePeriodType": "MONTHLY",
    "interestRate": 0.24,
    "currencyCode": "MXN",
    "currencyName": "Mexican Peso",
    "minAmount": 5000,
    "maxAmount": 250000,
    "idempotencyKey": "idem-product-100-v1"
  }'
```

Respuesta esperada:

```json
{
  "loanProductId": "product-100"
}
```

### 3. Crear Loan Application

Registra una solicitud, valida reglas de dominio (monto y moneda) y la deja en `UNDER_REVIEW`.

- Metodo: `POST`
- Path: `/loan-applications`

```bash
curl -X POST "http://localhost:3000/loan-applications" \
  -H "Content-Type: application/json" \
  -d '{
    "applicationId": "loan-app-100",
    "applicantId": "applicant-100",
    "loanProductId": "product-100",
    "requestedAmount": 20000,
    "currencyCode": "MXN",
    "currencyName": "Mexican Peso",
    "idempotencyKey": "idem-loan-app-100-v1",
    "correlationId": "corr-loan-app-100-v1"
  }'
```

Respuesta esperada:

```json
{
  "applicationId": "loan-app-100",
  "status": "UNDER_REVIEW"
}
```

### 4. Listar Loan Applications

Consulta solicitudes. Permite filtros opcionales por `applicantId` y `status`.

- Metodo: `GET`
- Path: `/loan-applications`

```bash
curl -X GET "http://localhost:3000/loan-applications"
```

Con filtros:

```bash
curl -X GET "http://localhost:3000/loan-applications?applicantId=applicant-100&status=UNDER_REVIEW"
```

Respuesta esperada:

```json
[
  {
    "applicationId": "loan-app-100",
    "applicantId": "applicant-100",
    "loanProductId": "product-100",
    "requestedAmount": 20000,
    "currencyCode": "MXN",
    "status": "UNDER_REVIEW",
    "requestedAt": "2026-03-30T18:00:00.000Z"
  }
]
```

### 5. Obtener Loan Application por ID

Consulta una solicitud puntual por `applicationId`.

- Metodo: `GET`
- Path: `/loan-applications/:applicationId`

```bash
curl -X GET "http://localhost:3000/loan-applications/loan-app-100"
```

Respuesta esperada:

```json
{
  "applicationId": "loan-app-100",
  "applicantId": "applicant-100",
  "loanProductId": "product-100",
  "requestedAmount": 20000,
  "currencyCode": "MXN",
  "status": "UNDER_REVIEW",
  "requestedAt": "2026-03-30T18:00:00.000Z"
}
```

### 6. Procesar evento creditDecisionMade

Actualiza el estado final de la solicitud a partir del evento consumido (`APPROVED`, `REJECTED` o `UNDER_REVIEW`).

- Metodo: `POST`
- Path: `/loan-applications/events/credit-decision-made`

```bash
curl -X POST "http://localhost:3000/loan-applications/events/credit-decision-made" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "evt-credit-decision-100",
    "eventType": "creditDecisionMade",
    "aggregateId": "loan-app-100",
    "idempotencyKey": "idem-event-credit-decision-100-v1",
    "correlationId": "corr-event-credit-decision-100-v1",
    "applicationId": "loan-app-100",
    "applicantId": "applicant-100",
    "decision": "APPROVED",
    "approvedAmount": 18000,
    "interestRate": 0.24,
    "occurredAt": "2026-03-30T18:10:00.000Z"
  }'
```

Respuesta esperada:

```json
{
  "applicationId": "loan-app-100",
  "status": "APPROVED"
}
```

## Notas de idempotencia

- Todos los comandos/eventos deben enviar `idempotencyKey`.
- Si se reenvia la misma llave, el servicio no reprocesa efectos secundarios.
- En este scaffold la persistencia de idempotencia es en memoria; en produccion debe migrarse a un store clave-valor con TTL.
