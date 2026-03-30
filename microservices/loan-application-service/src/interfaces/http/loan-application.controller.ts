import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetLoanApplicationUseCase } from '../../application/use-cases/get-loan-application.use-case';
import { ListLoanApplicationsUseCase } from '../../application/use-cases/list-loan-applications.use-case';
import { ProcessCreditDecisionUseCase } from '../../application/use-cases/process-credit-decision.use-case';
import { CreateLoanApplicationUseCase } from '../../application/use-cases/create-loan-application.use-case';
import { RegisterApplicantUseCase } from '../../application/use-cases/register-applicant.use-case';
import { RegisterLoanProductUseCase } from '../../application/use-cases/register-loan-product.use-case';
import { LoanApplicationStatus } from '../../domain/entities/loan-application.entity';
import { CreditDecisionMadeHttpDto } from './dto/credit-decision-made.http.dto';
import { CreateLoanApplicationHttpDto } from './dto/create-loan-application.http.dto';
import { RegisterApplicantHttpDto } from './dto/register-applicant.http.dto';
import { RegisterLoanProductHttpDto } from './dto/register-loan-product.http.dto';

@ApiTags('loan-applications')
@Controller('loan-applications')
export class LoanApplicationController {
  constructor(
    private readonly registerApplicantUseCase: RegisterApplicantUseCase,
    private readonly registerLoanProductUseCase: RegisterLoanProductUseCase,
    private readonly createLoanApplicationUseCase: CreateLoanApplicationUseCase,
    private readonly getLoanApplicationUseCase: GetLoanApplicationUseCase,
    private readonly listLoanApplicationsUseCase: ListLoanApplicationsUseCase,
    private readonly processCreditDecisionUseCase: ProcessCreditDecisionUseCase,
  ) {}

  @Post('applicants')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register applicant', description: 'Creates or updates an applicant profile.' })
  @ApiBody({
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
  })
  @ApiCreatedResponse({
    description: 'Applicant registered',
    schema: {
      type: 'object',
      properties: {
        applicantId: { type: 'string', example: 'applicant-100' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Validation error in request body' })
  async registerApplicant(@Body() body: RegisterApplicantHttpDto): Promise<{ applicantId: string }> {
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

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register loan product',
    description: 'Creates or updates a loan product definition.',
  })
  @ApiBody({
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
  })
  @ApiCreatedResponse({
    description: 'Loan product registered',
    schema: {
      type: 'object',
      properties: {
        loanProductId: { type: 'string', example: 'product-100' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Validation error in request body' })
  async registerLoanProduct(@Body() body: RegisterLoanProductHttpDto): Promise<{ loanProductId: string }> {
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
      throw new BadRequestException('minAmount cannot be greater than maxAmount');
    }

    if (!['DAILY', 'WEEKLY', 'MONTHLY'].includes(body.timePeriodType)) {
      throw new BadRequestException('timePeriodType must be DAILY, WEEKLY or MONTHLY');
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

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Create loan application',
    description: 'Registers a new loan application and publishes loanApplicationCreated event.',
  })
  @ApiBody({
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
  })
  @ApiAcceptedResponse({
    description: 'Loan application accepted',
    schema: {
      type: 'object',
      properties: {
        applicationId: { type: 'string', example: 'loan-app-100' },
        status: { type: 'string', enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'], example: 'UNDER_REVIEW' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Validation error in request body' })
  async create(@Body() body: CreateLoanApplicationHttpDto): Promise<{ applicationId: string; status: string }> {
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

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List loan applications',
    description: 'Returns loan applications with optional filters by applicantId and status.',
  })
  @ApiQuery({ name: 'applicantId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'] })
  @ApiOkResponse({
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
  })
  @ApiBadRequestResponse({ description: 'Invalid query params' })
  async getAll(
    @Query('applicantId') applicantId?: string,
    @Query('status') status?: LoanApplicationStatus,
  ): Promise<
    {
      applicationId: string;
      applicantId: string;
      loanProductId: string;
      requestedAmount: number;
      currencyCode: string;
      status: LoanApplicationStatus;
      requestedAt: string;
    }[]
  > {
    if (status && !['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
      throw new BadRequestException('status must be UNDER_REVIEW, APPROVED or REJECTED');
    }

    return this.listLoanApplicationsUseCase.execute({ applicantId, status });
  }

  @Get(':applicationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get loan application by ID' })
  @ApiParam({ name: 'applicationId', type: String, example: 'loan-app-100' })
  @ApiOkResponse({
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
  })
  @ApiNotFoundResponse({ description: 'Loan application not found' })
  @ApiBadRequestResponse({ description: 'Invalid path param' })
  async getById(@Param('applicationId') applicationId: string): Promise<{
    applicationId: string;
    applicantId: string;
    loanProductId: string;
    requestedAmount: number;
    currencyCode: string;
    status: LoanApplicationStatus;
    requestedAt: string;
  }> {
    this.assertString(applicationId, 'applicationId');
    return this.getLoanApplicationUseCase.execute(applicationId);
  }

  @Post('events/credit-decision-made')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Process creditDecisionMade event',
    description: 'Consumes an external decision event and updates loan application status.',
  })
  @ApiBody({
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
  })
  @ApiAcceptedResponse({
    description: 'Credit decision processed',
    schema: {
      type: 'object',
      properties: {
        applicationId: { type: 'string', example: 'loan-app-100' },
        status: { type: 'string', enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'], example: 'APPROVED' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Validation error in request body' })
  @ApiNotFoundResponse({ description: 'Loan application not found' })
  async processCreditDecision(
    @Body() body: CreditDecisionMadeHttpDto,
  ): Promise<{ applicationId: string; status: LoanApplicationStatus }> {
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
      throw new BadRequestException('eventType must be creditDecisionMade');
    }

    if (!['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(body.decision)) {
      throw new BadRequestException('decision must be UNDER_REVIEW, APPROVED or REJECTED');
    }

    if (Number.isNaN(Date.parse(body.occurredAt))) {
      throw new BadRequestException('occurredAt must be an ISO date');
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

  private assertString(value: unknown, fieldName: string): void {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} must be a non-empty string`);
    }
  }

  private assertNumber(value: unknown, fieldName: string): void {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new BadRequestException(`${fieldName} must be a valid number`);
    }
  }
}
