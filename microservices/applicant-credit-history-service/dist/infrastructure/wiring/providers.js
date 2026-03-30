"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providers = void 0;
const credit_bureau_acl_port_1 = require("../../application/ports/credit-bureau-acl.port");
const event_bus_port_1 = require("../../application/ports/event-bus.port");
const idempotency_store_port_1 = require("../../application/ports/idempotency-store.port");
const applicant_credit_history_repository_1 = require("../../domain/repositories/applicant-credit-history.repository");
const in_memory_credit_bureau_acl_adapter_1 = require("../acl/in-memory-credit-bureau-acl.adapter");
const in_memory_idempotency_store_adapter_1 = require("../idempotency/in-memory-idempotency-store.adapter");
const eventbridge_event_bus_adapter_1 = require("../messaging/eventbridge-event-bus.adapter");
const in_memory_applicant_credit_history_repository_1 = require("../persistence/in-memory-applicant-credit-history.repository");
exports.providers = [
    {
        provide: applicant_credit_history_repository_1.APPLICANT_CREDIT_HISTORY_REPOSITORY,
        useClass: in_memory_applicant_credit_history_repository_1.InMemoryApplicantCreditHistoryRepository,
    },
    {
        provide: event_bus_port_1.EVENT_BUS_PORT,
        useClass: eventbridge_event_bus_adapter_1.EventBridgeEventBusAdapter,
    },
    {
        provide: idempotency_store_port_1.IDEMPOTENCY_STORE_PORT,
        useClass: in_memory_idempotency_store_adapter_1.InMemoryIdempotencyStoreAdapter,
    },
    {
        provide: credit_bureau_acl_port_1.CREDIT_BUREAU_ACL_PORT,
        useClass: in_memory_credit_bureau_acl_adapter_1.InMemoryCreditBureauAclAdapter,
    },
];
