"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantCreditHistoryDomainService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const bureau_report_entity_1 = require("../entities/bureau-report.entity");
const credit_score_entity_1 = require("../entities/credit-score.entity");
const score_provider_vo_1 = require("../value-objects/score-provider.vo");
let ApplicantCreditHistoryDomainService = class ApplicantCreditHistoryDomainService {
    createBureauReport(applicantId, input) {
        return new bureau_report_entity_1.BureauReport((0, crypto_1.randomUUID)(), applicantId, input.providerName, input.rawData, new Date());
    }
    createNormalizedCreditScore(applicantId, input) {
        const provider = new score_provider_vo_1.ScoreProvider(input.providerName, input.providerMinScore, input.providerMaxScore);
        return new credit_score_entity_1.CreditScore((0, crypto_1.randomUUID)(), applicantId, input.providerName, provider.normalizeToKonfioScale(input.providerScore), new Date());
    }
};
exports.ApplicantCreditHistoryDomainService = ApplicantCreditHistoryDomainService;
exports.ApplicantCreditHistoryDomainService = ApplicantCreditHistoryDomainService = __decorate([
    (0, common_1.Injectable)()
], ApplicantCreditHistoryDomainService);
