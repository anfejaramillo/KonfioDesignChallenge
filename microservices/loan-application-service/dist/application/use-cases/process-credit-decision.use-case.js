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
var ProcessCreditDecisionUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessCreditDecisionUseCase = void 0;
const common_1 = require("@nestjs/common");
const loan_application_repository_1 = require("../../domain/repositories/loan-application.repository");
const idempotency_store_port_1 = require("../ports/idempotency-store.port");
let ProcessCreditDecisionUseCase = ProcessCreditDecisionUseCase_1 = class ProcessCreditDecisionUseCase {
    constructor(repository, idempotencyStore) {
        this.repository = repository;
        this.idempotencyStore = idempotencyStore;
        this.logger = new common_1.Logger(ProcessCreditDecisionUseCase_1.name);
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
        const application = await this.repository.findApplicationById(command.applicationId);
        if (!application) {
            throw new common_1.NotFoundException(`Application not found for event: ${command.applicationId}`);
        }
        if (command.decision === 'APPROVED') {
            application.approve();
        }
        else if (command.decision === 'REJECTED') {
            application.reject();
        }
        else {
            this.logger.log(`Decision ${command.decision} does not change application status`);
        }
        await this.repository.saveLoanApplication(application);
        await this.idempotencyStore.save(command.idempotencyKey, 60 * 60 * 24 * 7);
        return {
            applicationId: application.id,
            status: application.status,
        };
    }
};
exports.ProcessCreditDecisionUseCase = ProcessCreditDecisionUseCase;
exports.ProcessCreditDecisionUseCase = ProcessCreditDecisionUseCase = ProcessCreditDecisionUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(loan_application_repository_1.LOAN_APPLICATION_REPOSITORY)),
    __param(1, (0, common_1.Inject)(idempotency_store_port_1.IDEMPOTENCY_STORE_PORT)),
    __metadata("design:paramtypes", [Object, Object])
], ProcessCreditDecisionUseCase);
