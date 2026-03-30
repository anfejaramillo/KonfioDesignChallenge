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
exports.CreateLoanApplicationUseCase = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const loan_application_entity_1 = require("../../domain/entities/loan-application.entity");
const currency_vo_1 = require("../../domain/value-objects/currency.vo");
const loan_application_repository_1 = require("../../domain/repositories/loan-application.repository");
const loan_application_domain_service_1 = require("../../domain/services/loan-application-domain.service");
const event_bus_port_1 = require("../ports/event-bus.port");
const idempotency_store_port_1 = require("../ports/idempotency-store.port");
let CreateLoanApplicationUseCase = class CreateLoanApplicationUseCase {
    constructor(repository, eventBus, idempotencyStore, domainService) {
        this.repository = repository;
        this.eventBus = eventBus;
        this.idempotencyStore = idempotencyStore;
        this.domainService = domainService;
    }
    async execute(command) {
        const alreadyProcessed = await this.idempotencyStore.exists(command.idempotencyKey);
        if (alreadyProcessed) {
            const existingApplication = await this.repository.findApplicationById(command.applicationId);
            return {
                applicationId: command.applicationId,
                status: existingApplication?.status ?? 'UNDER_REVIEW',
            };
        }
        const product = await this.repository.findLoanProductById(command.loanProductId);
        if (!product) {
            throw new Error('Loan product not found');
        }
        const applicant = await this.repository.findApplicantById(command.applicantId);
        if (!applicant) {
            throw new Error('Applicant not found');
        }
        const application = new loan_application_entity_1.LoanApplication(command.applicationId, command.applicantId, command.loanProductId, command.requestedAmount, new currency_vo_1.Currency(command.currencyCode, command.currencyName), 'UNDER_REVIEW', new Date());
        this.domainService.validateCreation(application, product);
        await this.repository.saveLoanApplication(application);
        await this.eventBus.publishLoanApplicationCreated({
            eventId: (0, crypto_1.randomUUID)(),
            eventType: 'loanApplicationCreated',
            aggregateId: application.id,
            idempotencyKey: command.idempotencyKey,
            correlationId: command.correlationId,
            applicationId: application.id,
            applicantId: application.applicantId,
            loanProductId: application.loanProductId,
            requestedAmount: application.requestedAmount,
            currencyCode: application.currency.code,
            status: application.status,
            occurredAt: new Date().toISOString(),
        });
        await this.idempotencyStore.save(command.idempotencyKey, 60 * 60 * 24 * 7);
        return {
            applicationId: application.id,
            status: 'UNDER_REVIEW',
        };
    }
};
exports.CreateLoanApplicationUseCase = CreateLoanApplicationUseCase;
exports.CreateLoanApplicationUseCase = CreateLoanApplicationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(loan_application_repository_1.LOAN_APPLICATION_REPOSITORY)),
    __param(1, (0, common_1.Inject)(event_bus_port_1.EVENT_BUS_PORT)),
    __param(2, (0, common_1.Inject)(idempotency_store_port_1.IDEMPOTENCY_STORE_PORT)),
    __metadata("design:paramtypes", [Object, Object, Object, loan_application_domain_service_1.LoanApplicationDomainService])
], CreateLoanApplicationUseCase);
