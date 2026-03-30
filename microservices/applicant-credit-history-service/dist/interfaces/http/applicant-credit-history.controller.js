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
exports.ApplicantCreditHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fetch_applicant_credit_history_use_case_1 = require("../../application/use-cases/fetch-applicant-credit-history.use-case");
const get_applicant_bureau_reports_use_case_1 = require("../../application/use-cases/get-applicant-bureau-reports.use-case");
const get_latest_credit_scores_use_case_1 = require("../../application/use-cases/get-latest-credit-scores.use-case");
let ApplicantCreditHistoryController = class ApplicantCreditHistoryController {
    constructor(fetchApplicantCreditHistoryUseCase, getApplicantBureauReportsUseCase, getLatestCreditScoresUseCase) {
        this.fetchApplicantCreditHistoryUseCase = fetchApplicantCreditHistoryUseCase;
        this.getApplicantBureauReportsUseCase = getApplicantBureauReportsUseCase;
        this.getLatestCreditScoresUseCase = getLatestCreditScoresUseCase;
    }
    async processLoanApplicationCreated(body) {
        this.assertString(body.eventId, 'eventId');
        this.assertString(body.aggregateId, 'aggregateId');
        this.assertString(body.applicationId, 'applicationId');
        this.assertString(body.applicantId, 'applicantId');
        this.assertString(body.idempotencyKey, 'idempotencyKey');
        this.assertString(body.correlationId, 'correlationId');
        this.assertString(body.occurredAt, 'occurredAt');
        if (body.eventType !== 'loanApplicationCreated') {
            throw new common_1.BadRequestException('eventType must be loanApplicationCreated');
        }
        if (Number.isNaN(Date.parse(body.occurredAt))) {
            throw new common_1.BadRequestException('occurredAt must be an ISO date');
        }
        return this.fetchApplicantCreditHistoryUseCase.execute({
            eventId: body.eventId,
            eventType: body.eventType,
            aggregateId: body.aggregateId,
            applicationId: body.applicationId,
            applicantId: body.applicantId,
            idempotencyKey: body.idempotencyKey,
            correlationId: body.correlationId,
            occurredAt: body.occurredAt,
            bureauResponses: body.bureauResponses,
        });
    }
    async getBureauReports(applicantId) {
        this.assertString(applicantId, 'applicantId');
        return this.getApplicantBureauReportsUseCase.execute(applicantId);
    }
    async getLatestCreditScores(applicantId, providerName) {
        this.assertString(applicantId, 'applicantId');
        if (providerName !== undefined) {
            this.assertString(providerName, 'providerName');
        }
        return this.getLatestCreditScoresUseCase.execute(applicantId, providerName);
    }
    async health() {
        return { message: 'Applicant Credit History Service is running.' };
    }
    assertString(value, fieldName) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new common_1.BadRequestException(`${fieldName} must be a non-empty string`);
        }
    }
};
exports.ApplicantCreditHistoryController = ApplicantCreditHistoryController;
__decorate([
    (0, common_1.Post)('events/loan-application-created'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({
        summary: 'Process loanApplicationCreated event',
        description: 'Consumes the event, fetches bureau data, normalizes scores, and publishes bureauDataFetched.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: [
                'eventId',
                'eventType',
                'aggregateId',
                'applicationId',
                'applicantId',
                'idempotencyKey',
                'correlationId',
                'occurredAt',
            ],
            properties: {
                eventId: { type: 'string', example: 'evt-loan-app-001' },
                eventType: { type: 'string', enum: ['loanApplicationCreated'], example: 'loanApplicationCreated' },
                aggregateId: { type: 'string', example: 'loan-app-001' },
                applicationId: { type: 'string', example: 'loan-app-001' },
                applicantId: { type: 'string', example: 'applicant-001' },
                idempotencyKey: { type: 'string', example: 'idem-loan-app-001-v1' },
                correlationId: { type: 'string', example: 'corr-loan-app-001-v1' },
                occurredAt: { type: 'string', format: 'date-time', example: '2026-03-30T12:00:00.000Z' },
            },
        },
    }),
    (0, swagger_1.ApiAcceptedResponse)({
        description: 'Event processed or ignored as duplicate',
        schema: {
            type: 'object',
            properties: {
                applicantId: { type: 'string', example: 'applicant-001' },
                reportsStored: { type: 'number', example: 2 },
                scoresUpdated: { type: 'number', example: 2 },
                status: { type: 'string', enum: ['PROCESSED', 'DUPLICATE_IGNORED'], example: 'PROCESSED' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApplicantCreditHistoryController.prototype, "processLoanApplicationCreated", null);
__decorate([
    (0, common_1.Get)(':applicantId/bureau-reports'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get bureau reports by applicant' }),
    (0, swagger_1.ApiParam)({ name: 'applicantId', type: String, example: 'applicant-001' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Bureau reports found',
        schema: {
            type: 'object',
            properties: {
                applicantId: { type: 'string', example: 'applicant-001' },
                reports: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            reportId: { type: 'string', example: 'report-uuid' },
                            applicantId: { type: 'string', example: 'applicant-001' },
                            providerName: { type: 'string', example: 'BuroDeCredito' },
                            rawData: { type: 'object' },
                            fetchedAt: { type: 'string', format: 'date-time', example: '2026-03-30T12:00:00.000Z' },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('applicantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicantCreditHistoryController.prototype, "getBureauReports", null);
__decorate([
    (0, common_1.Get)(':applicantId/credit-scores/latest'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest credit scores by applicant and optional provider' }),
    (0, swagger_1.ApiParam)({ name: 'applicantId', type: String, example: 'applicant-001' }),
    (0, swagger_1.ApiQuery)({ name: 'providerName', required: false, type: String, example: 'BuroDeCredito' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Latest scores found',
        schema: {
            type: 'object',
            properties: {
                applicantId: { type: 'string', example: 'applicant-001' },
                scores: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            scoreId: { type: 'string', example: 'score-uuid' },
                            applicantId: { type: 'string', example: 'applicant-001' },
                            providerName: { type: 'string', example: 'BuroDeCredito' },
                            score: { type: 'number', example: 691 },
                            updatedAt: { type: 'string', format: 'date-time', example: '2026-03-30T12:00:00.000Z' },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('applicantId')),
    __param(1, (0, common_1.Query)('providerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ApplicantCreditHistoryController.prototype, "getLatestCreditScores", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Applicant Credit History Service is running.' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApplicantCreditHistoryController.prototype, "health", null);
exports.ApplicantCreditHistoryController = ApplicantCreditHistoryController = __decorate([
    (0, swagger_1.ApiTags)('applicant-credit-history'),
    (0, common_1.Controller)('applicant-credit-history'),
    __metadata("design:paramtypes", [fetch_applicant_credit_history_use_case_1.FetchApplicantCreditHistoryUseCase,
        get_applicant_bureau_reports_use_case_1.GetApplicantBureauReportsUseCase,
        get_latest_credit_scores_use_case_1.GetLatestCreditScoresUseCase])
], ApplicantCreditHistoryController);
