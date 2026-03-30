"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryApplicantCreditHistoryRepository = void 0;
const common_1 = require("@nestjs/common");
let InMemoryApplicantCreditHistoryRepository = class InMemoryApplicantCreditHistoryRepository {
    constructor() {
        this.reportsByApplicant = new Map();
        this.scoresByApplicant = new Map();
    }
    async saveBureauReport(report) {
        const current = this.reportsByApplicant.get(report.applicantId) ?? [];
        this.reportsByApplicant.set(report.applicantId, [...current, report]);
    }
    async saveCreditScore(score) {
        const current = this.scoresByApplicant.get(score.applicantId) ?? [];
        this.scoresByApplicant.set(score.applicantId, [...current, score]);
    }
    async findLatestCreditScoreByApplicantAndProvider(applicantId, providerName) {
        const scores = this.scoresByApplicant.get(applicantId) ?? [];
        const filtered = scores
            .filter((score) => score.scoreProviderName === providerName)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        return filtered[0] ?? null;
    }
    async findLatestCreditScoresByApplicantId(applicantId) {
        const scores = this.scoresByApplicant.get(applicantId) ?? [];
        const latestByProvider = new Map();
        for (const score of scores) {
            const current = latestByProvider.get(score.scoreProviderName);
            if (!current || score.updatedAt.getTime() > current.updatedAt.getTime()) {
                latestByProvider.set(score.scoreProviderName, score);
            }
        }
        return Array.from(latestByProvider.values()).sort((a, b) => a.scoreProviderName.localeCompare(b.scoreProviderName));
    }
    async findBureauReportsByApplicantId(applicantId) {
        return (this.reportsByApplicant.get(applicantId) ?? []).sort((a, b) => b.fetchedAt.getTime() - a.fetchedAt.getTime());
    }
};
exports.InMemoryApplicantCreditHistoryRepository = InMemoryApplicantCreditHistoryRepository;
exports.InMemoryApplicantCreditHistoryRepository = InMemoryApplicantCreditHistoryRepository = __decorate([
    (0, common_1.Injectable)()
], InMemoryApplicantCreditHistoryRepository);
