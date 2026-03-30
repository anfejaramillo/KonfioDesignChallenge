"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchApplicantCreditHistoryUseCase = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const credit_bureau_acl_port_1 = require("../ports/credit-bureau-acl.port");
const event_bus_port_1 = require("../ports/event-bus.port");
const idempotency_store_port_1 = require("../ports/idempotency-store.port");
const applicant_credit_history_repository_1 = require("../../domain/repositories/applicant-credit-history.repository");
const applicant_credit_history_domain_service_1 = require("../../domain/services/applicant-credit-history-domain.service");
let FetchApplicantCreditHistoryUseCase = class FetchApplicantCreditHistoryUseCase {
    constructor(repository, eventBus, idempotencyStore, creditBureauAcl, domainService) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.idempotencyStore = idempotencyStore;
        this.creditBureauAcl = creditBureauAcl;
        this.domainService = domainService;
    }
    async execute(command) {
        const alreadyProcessed = await this.idempotencyStore.exists(command.idempotencyKey);
        if (alreadyProcessed) {
            return {
                applicantId: command.applicantId,
                reportsStored: 0,
                scoresUpdated: 0,
                status: 'DUPLICATE_IGNORED',
            };
        }
        const bureauResponses = command.bureauResponses ??
            (await this.creditBureauAcl.fetchByApplicantId(command.applicantId, command.correlationId));
        let reportsStored = 0;
        let scoresUpdated = 0;
        for (const response of bureauResponses) {
            const report = this.domainService.createBureauReport(command.applicantId, response);
            await this.repository.saveBureauReport(report);
            reportsStored += 1;
            const normalizedScore = this.domainService.createNormalizedCreditScore(command.applicantId, response);
            await this.repository.saveCreditScore(normalizedScore);
            scoresUpdated += 1;
        }
        await this.eventBus.publishBureauDataFetched({
            eventId: (0, crypto_1.randomUUID)(),
            eventType: 'bureauDataFetched',
            aggregateId: command.applicationId,
            idempotencyKey: command.idempotencyKey,
            correlationId: command.correlationId,
            applicationId: command.applicationId,
            applicantId: command.applicantId,
            providersProcessed: bureauResponses.map((response) => response.providerName),
            reportsStored,
            scoresUpdated,
            occurredAt: new Date().toISOString(),
        });
        await this.idempotencyStore.save(command.idempotencyKey, 60 * 60 * 24 * 7);
        return {
            applicantId: command.applicantId,
            reportsStored,
            scoresUpdated,
            status: 'PROCESSED',
        };
    }
};
exports.FetchApplicantCreditHistoryUseCase = FetchApplicantCreditHistoryUseCase;
exports.FetchApplicantCreditHistoryUseCase = FetchApplicantCreditHistoryUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(applicant_credit_history_repository_1.APPLICANT_CREDIT_HISTORY_REPOSITORY)),
    __param(1, (0, common_1.Inject)(event_bus_port_1.EVENT_BUS_PORT)),
    __param(2, (0, common_1.Inject)(idempotency_store_port_1.IDEMPOTENCY_STORE_PORT)),
    __param(3, (0, common_1.Inject)(credit_bureau_acl_port_1.CREDIT_BUREAU_ACL_PORT)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, applicant_credit_history_domain_service_1.ApplicantCreditHistoryDomainService])
], FetchApplicantCreditHistoryUseCase);
