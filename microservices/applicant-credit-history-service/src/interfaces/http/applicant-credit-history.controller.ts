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
import { FetchApplicantCreditHistoryUseCase } from '../../application/use-cases/fetch-applicant-credit-history.use-case';
import { GetApplicantBureauReportsUseCase } from '../../application/use-cases/get-applicant-bureau-reports.use-case';
import { GetLatestCreditScoresUseCase } from '../../application/use-cases/get-latest-credit-scores.use-case';
import { FetchApplicantCreditHistoryHttpDto } from './dto/fetch-applicant-credit-history.http.dto';

/**
 * HTTP controller for applicant credit-history commands and queries.
 */
@ApiTags('applicant-credit-history')
@Controller('applicant-credit-history')
export class ApplicantCreditHistoryController {
  constructor(
    private readonly fetchApplicantCreditHistoryUseCase: FetchApplicantCreditHistoryUseCase,
    private readonly getApplicantBureauReportsUseCase: GetApplicantBureauReportsUseCase,
    private readonly getLatestCreditScoresUseCase: GetLatestCreditScoresUseCase,
  ) {}

  /**
   * Ingests the source integration event and triggers credit-history orchestration.
   */
  @Post('events/loan-application-created')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Process loanApplicationCreated event',
    description: 'Consumes the event, fetches bureau data, normalizes scores, and publishes bureauDataFetched.',
  })
  @ApiBody({
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
  })
  @ApiAcceptedResponse({
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
  })
  async processLoanApplicationCreated(@Body() body: FetchApplicantCreditHistoryHttpDto): Promise<{
    applicantId: string;
    reportsStored: number;
    scoresUpdated: number;
    status: 'PROCESSED' | 'DUPLICATE_IGNORED';
  }> {
    // Validates required envelope fields before command orchestration.
    this.assertString(body.eventId, 'eventId');
    this.assertString(body.aggregateId, 'aggregateId');
    this.assertString(body.applicationId, 'applicationId');
    this.assertString(body.applicantId, 'applicantId');
    this.assertString(body.idempotencyKey, 'idempotencyKey');
    this.assertString(body.correlationId, 'correlationId');
    this.assertString(body.occurredAt, 'occurredAt');

    if (body.eventType !== 'loanApplicationCreated') {
      throw new BadRequestException('eventType must be loanApplicationCreated');
    }

    if (Number.isNaN(Date.parse(body.occurredAt))) {
      throw new BadRequestException('occurredAt must be an ISO date');
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

  /**
   * Returns bureau reports persisted for one applicant.
   */
  @Get(':applicantId/bureau-reports')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get bureau reports by applicant' })
  @ApiParam({ name: 'applicantId', type: String, example: 'applicant-001' })
  @ApiOkResponse({
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
  })
  async getBureauReports(@Param('applicantId') applicantId: string): Promise<{
    applicantId: string;
    reports: {
      reportId: string;
      applicantId: string;
      providerName: string;
      rawData: Record<string, unknown>;
      fetchedAt: string;
    }[];
  }> {
    this.assertString(applicantId, 'applicantId');
    return this.getApplicantBureauReportsUseCase.execute(applicantId);
  }

  /**
   * Returns latest scores by applicant and optional provider filter.
   */
  @Get(':applicantId/credit-scores/latest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get latest credit scores by applicant and optional provider' })
  @ApiParam({ name: 'applicantId', type: String, example: 'applicant-001' })
  @ApiQuery({ name: 'providerName', required: false, type: String, example: 'BuroDeCredito' })
  @ApiOkResponse({
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
  })
  async getLatestCreditScores(
    @Param('applicantId') applicantId: string,
    @Query('providerName') providerName?: string,
  ): Promise<{
    applicantId: string;
    scores: {
      scoreId: string;
      applicantId: string;
      providerName: string;
      score: number;
      updatedAt: string;
    }[];
  }> {
    this.assertString(applicantId, 'applicantId');
    if (providerName !== undefined) {
      this.assertString(providerName, 'providerName');
    }

    return this.getLatestCreditScoresUseCase.execute(applicantId, providerName);
  }

  /**
   * Lightweight health endpoint.
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Applicant Credit History Service is running.' },
      },
    },
  })
  async health(): Promise<{ message: string }> {
    return { message: 'Applicant Credit History Service is running.' };
  }

  /**
   * Shared guard for non-empty string validations.
   */
  private assertString(value: unknown, fieldName: string): void {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} must be a non-empty string`);
    }
  }
}