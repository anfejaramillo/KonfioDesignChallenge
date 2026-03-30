"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providers = void 0;
const event_bus_port_1 = require("../../application/ports/event-bus.port");
const idempotency_store_port_1 = require("../../application/ports/idempotency-store.port");
const loan_application_repository_1 = require("../../domain/repositories/loan-application.repository");
const in_memory_idempotency_store_adapter_1 = require("../idempotency/in-memory-idempotency-store.adapter");
const eventbridge_event_bus_adapter_1 = require("../messaging/eventbridge-event-bus.adapter");
const in_memory_loan_application_repository_1 = require("../persistence/in-memory-loan-application.repository");
exports.providers = [
    {
        provide: loan_application_repository_1.LOAN_APPLICATION_REPOSITORY,
        useClass: in_memory_loan_application_repository_1.InMemoryLoanApplicationRepository,
    },
    {
        provide: event_bus_port_1.EVENT_BUS_PORT,
        useClass: eventbridge_event_bus_adapter_1.EventBridgeEventBusAdapter,
    },
    {
        provide: idempotency_store_port_1.IDEMPOTENCY_STORE_PORT,
        useClass: in_memory_idempotency_store_adapter_1.InMemoryIdempotencyStoreAdapter,
    },
];
