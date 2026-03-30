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
exports.LoanApplicationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_loan_application_use_case_1 = require("../../application/use-cases/get-loan-application.use-case");
const list_loan_applications_use_case_1 = require("../../application/use-cases/list-loan-applications.use-case");
const process_credit_decision_use_case_1 = require("../../application/use-cases/process-credit-decision.use-case");
const create_loan_application_use_case_1 = require("../../application/use-cases/create-loan-application.use-case");
const register_applicant_use_case_1 = require("../../application/use-cases/register-applicant.use-case");
const register_loan_product_use_case_1 = require("../../application/use-cases/register-loan-product.use-case");
let LoanApplicationController = class LoanApplicationController {
    constructor(registerApplicantUseCase, registerLoanProductUseCase, createLoanApplicationUseCase, getLoanApplicationUseCase, listLoanApplicationsUseCase, processCreditDecisionUseCase) {
        this.registerApplicantUseCase = registerApplicantUseCase;
        this.registerLoanProductUseCase = registerLoanProductUseCase;
        this.createLoanApplicationUseCase = createLoanApplicationUseCase;
        this.getLoanApplicationUseCase = getLoanApplicationUseCase;
        this.listLoanApplicationsUseCase = listLoanApplicationsUseCase;
        this.processCreditDecisionUseCase = processCreditDecisionUseCase;
    }
    async registerApplicant(body) {
        this.assertString(body.id, 'id');
        this.assertString(body.name, 'name');
        this.assertString(body.dni, 'dni');
        this.assertString(body.incomeOrigin, 'incomeOrigin');
        this.assertNumber(body.monthlyIncome, 'monthlyIncome');
        this.assertString(body.mobile, 'mobile');
        this.assertString(body.email, 'email');
        this.assertString(body.idempotencyKey, 'idempotencyKey');
        return this.registerApplicantUseCase.execute({
            id: body.id,
            name: body.name,
            dni: body.dni,
            incomeOrigin: body.incomeOrigin,
            monthlyIncome: body.monthlyIncome,
            mobile: body.mobile,
            email: body.email,
            idempotencyKey: body.idempotencyKey,
        });
    }
    async registerLoanProduct(body) {
        this.assertString(body.id, 'id');
        this.assertString(body.name, 'name');
        this.assertNumber(body.term, 'term');
        this.assertString(body.timePeriodType, 'timePeriodType');
        this.assertNumber(body.interestRate, 'interestRate');
        this.assertString(body.currencyCode, 'currencyCode');
        this.assertString(body.currencyName, 'currencyName');
        this.assertNumber(body.minAmount, 'minAmount');
        this.assertNumber(body.maxAmount, 'maxAmount');
        this.assertString(body.idempotencyKey, 'idempotencyKey');
        if (body.minAmount > body.maxAmount) {
            throw new common_1.BadRequestException('minAmount cannot be greater than maxAmount');
        }
        if (!['DAILY', 'WEEKLY', 'MONTHLY'].includes(body.timePeriodType)) {
            throw new common_1.BadRequestException('timePeriodType must be DAILY, WEEKLY or MONTHLY');
        }
        return this.registerLoanProductUseCase.execute({
            id: body.id,
            name: body.name,
            term: body.term,
            timePeriodType: body.timePeriodType,
            interestRate: body.interestRate,
            currencyCode: body.currencyCode,
            currencyName: body.currencyName,
            minAmount: body.minAmount,
            maxAmount: body.maxAmount,
            idempotencyKey: body.idempotencyKey,
        });
    }
    async create(body) {
        this.assertString(body.applicationId, 'applicationId');
        this.assertString(body.applicantId, 'applicantId');
        this.assertString(body.loanProductId, 'loanProductId');
        this.assertNumber(body.requestedAmount, 'requestedAmount');
        this.assertString(body.currencyCode, 'currencyCode');
        this.assertString(body.currencyName, 'currencyName');
        this.assertString(body.idempotencyKey, 'idempotencyKey');
        this.assertString(body.correlationId, 'correlationId');
        return this.createLoanApplicationUseCase.execute({
            applicationId: body.applicationId,
            applicantId: body.applicantId,
            loanProductId: body.loanProductId,
            requestedAmount: body.requestedAmount,
            currencyCode: body.currencyCode,
            currencyName: body.currencyName,
            idempotencyKey: body.idempotencyKey,
            correlationId: body.correlationId,
        });
    }
    async getAll(applicantId, status) {
        if (status && !['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
            throw new common_1.BadRequestException('status must be UNDER_REVIEW, APPROVED or REJECTED');
        }
        return this.listLoanApplicationsUseCase.execute({ applicantId, status });
    }
    async getById(applicationId) {
        this.assertString(applicationId, 'applicationId');
        return this.getLoanApplicationUseCase.execute(applicationId);
    }
    async processCreditDecision(body) {
        this.assertString(body.eventId, 'eventId');
        this.assertString(body.aggregateId, 'aggregateId');
        this.assertString(body.idempotencyKey, 'idempotencyKey');
        this.assertString(body.correlationId, 'correlationId');
        this.assertString(body.applicationId, 'applicationId');
        this.assertString(body.applicantId, 'applicantId');
        this.assertString(body.occurredAt, 'occurredAt');
        this.assertString(body.decision, 'decision');
        this.assertString(body.eventType, 'eventType');
        if (body.eventType !== 'creditDecisionMade') {
            throw new common_1.BadRequestException('eventType must be creditDecisionMade');
        }
        if (!['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(body.decision)) {
            throw new common_1.BadRequestException('decision must be UNDER_REVIEW, APPROVED or REJECTED');
        }
        if (Number.isNaN(Date.parse(body.occurredAt))) {
            throw new common_1.BadRequestException('occurredAt must be an ISO date');
        }
        if (body.approvedAmount !== undefined) {
            this.assertNumber(body.approvedAmount, 'approvedAmount');
        }
        if (body.interestRate !== undefined) {
            this.assertNumber(body.interestRate, 'interestRate');
        }
        return this.processCreditDecisionUseCase.execute({
            eventId: body.eventId,
            eventType: body.eventType,
            aggregateId: body.aggregateId,
            idempotencyKey: body.idempotencyKey,
            correlationId: body.correlationId,
            applicationId: body.applicationId,
            applicantId: body.applicantId,
            decision: body.decision,
            approvedAmount: body.approvedAmount,
            interestRate: body.interestRate,
            occurredAt: body.occurredAt,
        });
    }
    assertString(value, fieldName) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new common_1.BadRequestException(`${fieldName} must be a non-empty string`);
        }
    }
    assertNumber(value, fieldName) {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            throw new common_1.BadRequestException(`${fieldName} must be a valid number`);
        }
    }
};
exports.LoanApplicationController = LoanApplicationController;
__decorate([
    (0, common_1.Post)('applicants'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Register applicant', description: 'Creates or updates an applicant profile.' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['id', 'name', 'dni', 'incomeOrigin', 'monthlyIncome', 'mobile', 'email', 'idempotencyKey'],
            properties: {
                id: { type: 'string', example: 'applicant-100' },
                name: { type: 'string', example: 'Ana Gomez' },
                dni: { type: 'string', example: '10101010' },
                incomeOrigin: { type: 'string', example: 'SALARY' },
                monthlyIncome: { type: 'number', example: 12000 },
                mobile: { type: 'string', example: '+525511112222' },
                email: { type: 'string', example: 'ana.gomez@example.com' },
                idempotencyKey: { type: 'string', example: 'idem-applicant-100-v1' },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Applicant registered',
        schema: {
            type: 'object',
            properties: {
                applicantId: { type: 'string', example: 'applicant-100' },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error in request body' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "registerApplicant", null);
__decorate([
    (0, common_1.Post)('products'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Register loan product',
        description: 'Creates or updates a loan product definition.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: [
                'id',
                'name',
                'term',
                'timePeriodType',
                'interestRate',
                'currencyCode',
                'currencyName',
                'minAmount',
                'maxAmount',
                'idempotencyKey',
            ],
            properties: {
                id: { type: 'string', example: 'product-100' },
                name: { type: 'string', example: 'Capital de Trabajo PYME' },
                term: { type: 'number', example: 12 },
                timePeriodType: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY'], example: 'MONTHLY' },
                interestRate: { type: 'number', example: 0.24 },
                currencyCode: { type: 'string', example: 'MXN' },
                currencyName: { type: 'string', example: 'Mexican Peso' },
                minAmount: { type: 'number', example: 5000 },
                maxAmount: { type: 'number', example: 250000 },
                idempotencyKey: { type: 'string', example: 'idem-product-100-v1' },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Loan product registered',
        schema: {
            type: 'object',
            properties: {
                loanProductId: { type: 'string', example: 'product-100' },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error in request body' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "registerLoanProduct", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create loan application',
        description: 'Registers a new loan application and publishes loanApplicationCreated event.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: [
                'applicationId',
                'applicantId',
                'loanProductId',
                'requestedAmount',
                'currencyCode',
                'currencyName',
                'idempotencyKey',
                'correlationId',
            ],
            properties: {
                applicationId: { type: 'string', example: 'loan-app-100' },
                applicantId: { type: 'string', example: 'applicant-100' },
                loanProductId: { type: 'string', example: 'product-100' },
                requestedAmount: { type: 'number', example: 20000 },
                currencyCode: { type: 'string', example: 'MXN' },
                currencyName: { type: 'string', example: 'Mexican Peso' },
                idempotencyKey: { type: 'string', example: 'idem-loan-app-100-v1' },
                correlationId: { type: 'string', example: 'corr-loan-app-100-v1' },
            },
        },
    }),
    (0, swagger_1.ApiAcceptedResponse)({
        description: 'Loan application accepted',
        schema: {
            type: 'object',
            properties: {
                applicationId: { type: 'string', example: 'loan-app-100' },
                status: { type: 'string', enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'], example: 'UNDER_REVIEW' },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error in request body' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List loan applications',
        description: 'Returns loan applications with optional filters by applicantId and status.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'applicantId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'] }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Loan applications list',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    applicationId: { type: 'string', example: 'loan-app-100' },
                    applicantId: { type: 'string', example: 'applicant-100' },
                    loanProductId: { type: 'string', example: 'product-100' },
                    requestedAmount: { type: 'number', example: 20000 },
                    currencyCode: { type: 'string', example: 'MXN' },
                    status: { type: 'string', enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'], example: 'UNDER_REVIEW' },
                    requestedAt: { type: 'string', format: 'date-time', example: '2026-03-30T18:00:00.000Z' },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid query params' }),
    __param(0, (0, common_1.Query)('applicantId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':applicationId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get loan application by ID' }),
    (0, swagger_1.ApiParam)({ name: 'applicationId', type: String, example: 'loan-app-100' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Loan application found',
        schema: {
            type: 'object',
            properties: {
                applicationId: { type: 'string', example: 'loan-app-100' },
                applicantId: { type: 'string', example: 'applicant-100' },
                loanProductId: { type: 'string', example: 'product-100' },
                requestedAmount: { type: 'number', example: 20000 },
                currencyCode: { type: 'string', example: 'MXN' },
                status: { type: 'string', enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'], example: 'UNDER_REVIEW' },
                requestedAt: { type: 'string', format: 'date-time', example: '2026-03-30T18:00:00.000Z' },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Loan application not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid path param' }),
    __param(0, (0, common_1.Param)('applicationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)('events/credit-decision-made'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({
        summary: 'Process creditDecisionMade event',
        description: 'Consumes an external decision event and updates loan application status.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: [
                'eventId',
                'eventType',
                'aggregateId',
                'idempotencyKey',
                'correlationId',
                'applicationId',
                'applicantId',
                'decision',
                'occurredAt',
            ],
            properties: {
                eventId: { type: 'string', example: 'evt-credit-decision-100' },
                eventType: { type: 'string', enum: ['creditDecisionMade'], example: 'creditDecisionMade' },
                aggregateId: { type: 'string', example: 'loan-app-100' },
                idempotencyKey: { type: 'string', example: 'idem-event-credit-decision-100-v1' },
                correlationId: { type: 'string', example: 'corr-event-credit-decision-100-v1' },
                applicationId: { type: 'string', example: 'loan-app-100' },
                applicantId: { type: 'string', example: 'applicant-100' },
                decision: { type: 'string', enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'], example: 'APPROVED' },
                approvedAmount: { type: 'number', example: 18000 },
                interestRate: { type: 'number', example: 0.24 },
                occurredAt: { type: 'string', format: 'date-time', example: '2026-03-30T18:10:00.000Z' },
            },
        },
    }),
    (0, swagger_1.ApiAcceptedResponse)({
        description: 'Credit decision processed',
        schema: {
            type: 'object',
            properties: {
                applicationId: { type: 'string', example: 'loan-app-100' },
                status: { type: 'string', enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'], example: 'APPROVED' },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error in request body' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Loan application not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoanApplicationController.prototype, "processCreditDecision", null);
exports.LoanApplicationController = LoanApplicationController = __decorate([
    (0, swagger_1.ApiTags)('loan-applications'),
    (0, common_1.Controller)('loan-applications'),
    __metadata("design:paramtypes", [register_applicant_use_case_1.RegisterApplicantUseCase,
        register_loan_product_use_case_1.RegisterLoanProductUseCase,
        create_loan_application_use_case_1.CreateLoanApplicationUseCase,
        get_loan_application_use_case_1.GetLoanApplicationUseCase,
        list_loan_applications_use_case_1.ListLoanApplicationsUseCase,
        process_credit_decision_use_case_1.ProcessCreditDecisionUseCase])
], LoanApplicationController);
