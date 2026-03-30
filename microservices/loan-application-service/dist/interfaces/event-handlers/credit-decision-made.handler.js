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
var CreditDecisionMadeHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditDecisionMadeHandler = void 0;
const common_1 = require("@nestjs/common");
const process_credit_decision_use_case_1 = require("../../application/use-cases/process-credit-decision.use-case");
let CreditDecisionMadeHandler = CreditDecisionMadeHandler_1 = class CreditDecisionMadeHandler {
    constructor(processCreditDecisionUseCase) {
        this.processCreditDecisionUseCase = processCreditDecisionUseCase;
        this.logger = new common_1.Logger(CreditDecisionMadeHandler_1.name);
    }
    async handle(event) {
        try {
            await this.processCreditDecisionUseCase.execute(event);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.logger.warn(error.message);
                return;
            }
            throw error;
        }
    }
};
exports.CreditDecisionMadeHandler = CreditDecisionMadeHandler;
exports.CreditDecisionMadeHandler = CreditDecisionMadeHandler = CreditDecisionMadeHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [process_credit_decision_use_case_1.ProcessCreditDecisionUseCase])
], CreditDecisionMadeHandler);
