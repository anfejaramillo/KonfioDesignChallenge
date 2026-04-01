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
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetCreditDecisionUseCase } from '../../application/use-cases/get-credit-decision.use-case';
import { GetRiskAssessmentUseCase } from '../../application/use-cases/get-risk-assessment.use-case';
import { ListCreditDecisionsUseCase } from '../../application/use-cases/list-credit-decisions.use-case';
import { MakeCreditDecisionUseCase } from '../../application/use-cases/make-credit-decision.use-case';
import { MakeCreditDecisionHttpDto } from './dto/make-credit-decision.http.dto';

@ApiTags('loan-decisions')
@Controller('loan-decisions')
export class LoanDecisionController {
  constructor(
    private readonly makeCreditDecisionUseCase: MakeCreditDecisionUseCase,
    private readonly getCreditDecisionUseCase: GetCreditDecisionUseCase,
    private readonly getRiskAssessmentUseCase: GetRiskAssessmentUseCase,
    private readonly listCreditDecisionsUseCase: ListCreditDecisionsUseCase,
  ) {}

  /**
   * Receives `riskAssesmentCompleted` event payload and delegates decision processing.
   */
  @Post('events/risk-assessment-completed')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Process riskAssesmentCompleted event',
    description: 'Persists risk assessment, calculates credit decision, and publishes creditDecisionMade.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'eventId',
        'eventType',
        'aggregateId',
        'decisionId',
        'applicationId',
        'applicantId',
        'riskAssessmentId',
        'riskLevel',
        'riskAnalysisResult',
        'idempotencyKey',
        'correlationId',
        'occurredAt',
      ],
      properties: {
        eventId: { type: 'string', example: 'evt-risk-001' },
        eventType: { type: 'string', enum: ['riskAssesmentCompleted'], example: 'riskAssesmentCompleted' },
        aggregateId: { type: 'string', example: 'loan-app-001' },
        decisionId: { type: 'string', example: 'decision-001' },
        applicationId: { type: 'string', example: 'loan-app-001' },
        applicantId: { type: 'string', example: 'applicant-001' },
        riskAssessmentId: { type: 'string', example: 'risk-001' },
        riskLevel: {
          type: 'object',
          properties: {
            probabilityOfDefaultUpperLimit: { type: 'number', example: 0.22 },
            description: { type: 'string', example: 'LOW' },
          },
        },
        riskAnalysisResult: { type: 'object' },
        requestedAmount: { type: 'number', example: 15000 },
        policy: {
          type: 'object',
          properties: {
            maxProbabilityOfDefaultForApproval: { type: 'number', example: 0.35 },
            manualApprovalRequired: { type: 'boolean', example: false },
            baseInterestRate: { type: 'number', example: 0.2 },
          },
        },
        idempotencyKey: { type: 'string', example: 'idem-risk-001-v1' },
        correlationId: { type: 'string', example: 'corr-risk-001-v1' },
        occurredAt: { type: 'string', format: 'date-time', example: '2026-03-30T12:00:00.000Z' },
      },
    },
  })
  @ApiAcceptedResponse({
    schema: {
      type: 'object',
      properties: {
        decisionId: { type: 'string', example: 'decision-001' },
        applicationId: { type: 'string', example: 'loan-app-001' },
        decision: { type: 'string', enum: ['APPROVED', 'REJECTED', 'UNDER_REVIEW'], example: 'APPROVED' },
        status: { type: 'string', enum: ['PROCESSED', 'DUPLICATE_IGNORED'], example: 'PROCESSED' },
      },
    },
  })
  async evaluateFromRiskAssessment(@Body() body: MakeCreditDecisionHttpDto): Promise<{
    decisionId: string;
    applicationId: string;
    decision: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
    status: 'PROCESSED' | 'DUPLICATE_IGNORED';
  }> {
    // Validate event envelope.
    this.assertString(body.eventId, 'eventId');
    this.assertString(body.aggregateId, 'aggregateId');
    this.assertString(body.decisionId, 'decisionId');
    this.assertString(body.applicationId, 'applicationId');
    this.assertString(body.applicantId, 'applicantId');
    this.assertString(body.riskAssessmentId, 'riskAssessmentId');
    this.assertString(body.idempotencyKey, 'idempotencyKey');
    this.assertString(body.correlationId, 'correlationId');
    this.assertString(body.occurredAt, 'occurredAt');
    this.assertIsoDate(body.occurredAt, 'occurredAt');

    if (body.eventType !== 'riskAssesmentCompleted') {
      throw new BadRequestException('eventType must be riskAssesmentCompleted');
    }

    this.assertNumber(body.riskLevel?.probabilityOfDefaultUpperLimit, 'riskLevel.probabilityOfDefaultUpperLimit');
    this.assertString(body.riskLevel?.description, 'riskLevel.description');

    if (body.requestedAmount !== undefined) {
      this.assertNumber(body.requestedAmount, 'requestedAmount');
    }

    if (body.policy !== undefined) {
      this.assertNumber(
        body.policy.maxProbabilityOfDefaultForApproval,
        'policy.maxProbabilityOfDefaultForApproval',
      );
      this.assertBoolean(body.policy.manualApprovalRequired, 'policy.manualApprovalRequired');
      this.assertNumber(body.policy.baseInterestRate, 'policy.baseInterestRate');
    }

    // Delegate orchestration to application use case.
    return this.makeCreditDecisionUseCase.execute({
      eventId: body.eventId,
      eventType: body.eventType,
      aggregateId: body.aggregateId,
      decisionId: body.decisionId,
      applicationId: body.applicationId,
      applicantId: body.applicantId,
      riskAssessmentId: body.riskAssessmentId,
      riskLevel: body.riskLevel,
      riskAnalysisResult: body.riskAnalysisResult,
      requestedAmount: body.requestedAmount,
      policy: body.policy,
      idempotencyKey: body.idempotencyKey,
      correlationId: body.correlationId,
      occurredAt: body.occurredAt,
    });
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Loan Decision Service is running.' },
      },
    },
  })
  /**
   * Returns service liveliness information.
   */
  async health(): Promise<{ message: string }> {
    return { message: 'Loan Decision Service is running.' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List credit decisions with optional filters' })
  @ApiQuery({ name: 'applicantId', required: false, type: String })
  @ApiQuery({ name: 'decision', required: false, enum: ['APPROVED', 'REJECTED', 'UNDER_REVIEW'] })
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          decisionId: { type: 'string', example: 'decision-001' },
          applicationId: { type: 'string', example: 'loan-app-001' },
          applicantId: { type: 'string', example: 'applicant-001' },
          decision: { type: 'string', enum: ['APPROVED', 'REJECTED', 'UNDER_REVIEW'], example: 'APPROVED' },
          approvedAmount: { type: 'number', nullable: true, example: 15000 },
          assignedInterestRate: { type: 'number', nullable: true, example: 0.42 },
          riskAssessmentId: { type: 'string', example: 'risk-001' },
          calculatedAt: { type: 'string', format: 'date-time', example: '2026-03-30T12:00:01.000Z' },
        },
      },
    },
  })
  /**
   * Lists decisions and applies optional query filters.
   */
  async getAllDecisions(
    @Query('applicantId') applicantId?: string,
    @Query('decision') decision?: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW',
  ): Promise<
    {
      decisionId: string;
      applicationId: string;
      applicantId: string;
      decision: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
      approvedAmount: number | null;
      assignedInterestRate: number | null;
      riskAssessmentId: string;
      calculatedAt: string;
    }[]
  > {
    if (decision !== undefined && !['APPROVED', 'REJECTED', 'UNDER_REVIEW'].includes(decision)) {
      throw new BadRequestException('decision must be APPROVED, REJECTED or UNDER_REVIEW');
    }

    return this.listCreditDecisionsUseCase.execute({ applicantId, decision });
  }

  @Get(':applicationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get credit decision by application id' })
  @ApiParam({ name: 'applicationId', type: String, example: 'loan-app-001' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        decisionId: { type: 'string', example: 'decision-001' },
        applicationId: { type: 'string', example: 'loan-app-001' },
        applicantId: { type: 'string', example: 'applicant-001' },
        decision: { type: 'string', enum: ['APPROVED', 'REJECTED', 'UNDER_REVIEW'], example: 'APPROVED' },
        approvedAmount: { type: 'number', nullable: true, example: 15000 },
        assignedInterestRate: { type: 'number', nullable: true, example: 0.42 },
        riskAssessmentId: { type: 'string', example: 'risk-001' },
        calculatedAt: { type: 'string', format: 'date-time', example: '2026-03-30T12:00:01.000Z' },
      },
    },
  })
  /**
   * Gets credit decision by application id.
   */
  async getDecisionByApplicationId(@Param('applicationId') applicationId: string): Promise<{
    decisionId: string;
    applicationId: string;
    applicantId: string;
    decision: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
    approvedAmount: number | null;
    assignedInterestRate: number | null;
    riskAssessmentId: string;
    calculatedAt: string;
  }> {
    this.assertString(applicationId, 'applicationId');
    return this.getCreditDecisionUseCase.execute(applicationId);
  }

  @Get('risk-assessments/:riskAssessmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get risk assessment by id' })
  @ApiParam({ name: 'riskAssessmentId', type: String, example: 'risk-001' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        riskAssessmentId: { type: 'string', example: 'risk-001' },
        applicationId: { type: 'string', example: 'loan-app-001' },
        applicantId: { type: 'string', example: 'applicant-001' },
        riskLevel: {
          type: 'object',
          properties: {
            probabilityOfDefaultUpperLimit: { type: 'number', example: 0.22 },
            description: { type: 'string', example: 'LOW' },
          },
        },
        riskAnalysisResult: { type: 'object' },
        calculatedAt: { type: 'string', format: 'date-time', example: '2026-03-30T12:00:00.000Z' },
      },
    },
  })
  /**
   * Gets risk assessment by risk assessment id.
   */
  async getRiskAssessmentById(@Param('riskAssessmentId') riskAssessmentId: string): Promise<{
    riskAssessmentId: string;
    applicationId: string;
    applicantId: string;
    riskLevel: {
      probabilityOfDefaultUpperLimit: number;
      description: string;
    };
    riskAnalysisResult: Record<string, unknown>;
    calculatedAt: string;
  }> {
    this.assertString(riskAssessmentId, 'riskAssessmentId');
    return this.getRiskAssessmentUseCase.execute(riskAssessmentId);
  }

  /**
   * Asserts a non-empty string field.
   */
  private assertString(value: unknown, fieldName: string): void {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} must be a non-empty string`);
    }
  }

  /**
   * Asserts a numeric field.
   */
  private assertNumber(value: unknown, fieldName: string): void {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new BadRequestException(`${fieldName} must be a valid number`);
    }
  }

  /**
   * Asserts a boolean field.
   */
  private assertBoolean(value: unknown, fieldName: string): void {
    if (typeof value !== 'boolean') {
      throw new BadRequestException(`${fieldName} must be boolean`);
    }
  }

  /**
   * Asserts a valid ISO date field.
   */
  private assertIsoDate(value: string, fieldName: string): void {
    if (Number.isNaN(new Date(value).getTime())) {
      throw new BadRequestException(`${fieldName} must be a valid ISO date`);
    }
  }
}
