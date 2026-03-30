"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const get_loan_application_use_case_1 = require("./application/use-cases/get-loan-application.use-case");
const list_loan_applications_use_case_1 = require("./application/use-cases/list-loan-applications.use-case");
const process_credit_decision_use_case_1 = require("./application/use-cases/process-credit-decision.use-case");
const loan_application_controller_1 = require("./interfaces/http/loan-application.controller");
const credit_decision_made_handler_1 = require("./interfaces/event-handlers/credit-decision-made.handler");
const create_loan_application_use_case_1 = require("./application/use-cases/create-loan-application.use-case");
const register_applicant_use_case_1 = require("./application/use-cases/register-applicant.use-case");
const register_loan_product_use_case_1 = require("./application/use-cases/register-loan-product.use-case");
const loan_application_domain_service_1 = require("./domain/services/loan-application-domain.service");
const providers_1 = require("./infrastructure/wiring/providers");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [loan_application_controller_1.LoanApplicationController],
        providers: [
            ...providers_1.providers,
            credit_decision_made_handler_1.CreditDecisionMadeHandler,
            create_loan_application_use_case_1.CreateLoanApplicationUseCase,
            get_loan_application_use_case_1.GetLoanApplicationUseCase,
            list_loan_applications_use_case_1.ListLoanApplicationsUseCase,
            loan_application_domain_service_1.LoanApplicationDomainService,
            process_credit_decision_use_case_1.ProcessCreditDecisionUseCase,
            register_applicant_use_case_1.RegisterApplicantUseCase,
            register_loan_product_use_case_1.RegisterLoanProductUseCase,
        ],
    })
], AppModule);
