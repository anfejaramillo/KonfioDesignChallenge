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
var LoanApplicationCreatedHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanApplicationCreatedHandler = void 0;
const common_1 = require("@nestjs/common");
const fetch_applicant_credit_history_use_case_1 = require("../../application/use-cases/fetch-applicant-credit-history.use-case");
let LoanApplicationCreatedHandler = LoanApplicationCreatedHandler_1 = class LoanApplicationCreatedHandler {
    constructor(useCase) {
        this.useCase = useCase;
        this.logger = new common_1.Logger(LoanApplicationCreatedHandler_1.name);
    }
    async handle(event) {
        this.logger.log(JSON.stringify({
            message: 'Handling loanApplicationCreated event',
            eventId: event.eventId,
            aggregateId: event.aggregateId,
            correlationId: event.correlationId,
            applicationId: event.applicationId,
            applicantId: event.applicantId,
        }));
        await this.useCase.execute({
            eventId: event.eventId,
            eventType: event.eventType,
            aggregateId: event.aggregateId,
            applicationId: event.applicationId,
            applicantId: event.applicantId,
            idempotencyKey: event.idempotencyKey,
            correlationId: event.correlationId,
            occurredAt: event.occurredAt,
        });
    }
};
exports.LoanApplicationCreatedHandler = LoanApplicationCreatedHandler;
exports.LoanApplicationCreatedHandler = LoanApplicationCreatedHandler = LoanApplicationCreatedHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fetch_applicant_credit_history_use_case_1.FetchApplicantCreditHistoryUseCase])
], LoanApplicationCreatedHandler);
