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
const fetch_applicant_credit_history_use_case_1 = require("./application/use-cases/fetch-applicant-credit-history.use-case");
const get_applicant_bureau_reports_use_case_1 = require("./application/use-cases/get-applicant-bureau-reports.use-case");
const get_latest_credit_scores_use_case_1 = require("./application/use-cases/get-latest-credit-scores.use-case");
const applicant_credit_history_domain_service_1 = require("./domain/services/applicant-credit-history-domain.service");
const loan_application_created_handler_1 = require("./interfaces/event-handlers/loan-application-created.handler");
const applicant_credit_history_controller_1 = require("./interfaces/http/applicant-credit-history.controller");
const providers_1 = require("./infrastructure/wiring/providers");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [applicant_credit_history_controller_1.ApplicantCreditHistoryController],
        providers: [
            ...providers_1.providers,
            fetch_applicant_credit_history_use_case_1.FetchApplicantCreditHistoryUseCase,
            get_applicant_bureau_reports_use_case_1.GetApplicantBureauReportsUseCase,
            get_latest_credit_scores_use_case_1.GetLatestCreditScoresUseCase,
            applicant_credit_history_domain_service_1.ApplicantCreditHistoryDomainService,
            loan_application_created_handler_1.LoanApplicationCreatedHandler,
        ],
    })
], AppModule);
