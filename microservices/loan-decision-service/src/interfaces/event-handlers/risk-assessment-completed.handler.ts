import { randomUUID } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { MakeCreditDecisionUseCase } from '../../application/use-cases/make-credit-decision.use-case';
import { RiskAssessmentCompletedEvent } from '../../domain/events/risk-assessment-completed.event';

@Injectable()
export class RiskAssessmentCompletedHandler {
  private readonly logger = new Logger(RiskAssessmentCompletedHandler.name);

  constructor(private readonly useCase: MakeCreditDecisionUseCase) {}

  /**
   * Handles `riskAssesmentCompleted` events and triggers decision workflow.
   */
  async handle(event: RiskAssessmentCompletedEvent): Promise<void> {
    this.logger.log(
      JSON.stringify({
        message: 'Handling riskAssesmentCompleted event',
        eventId: event.eventId,
        aggregateId: event.aggregateId,
        correlationId: event.correlationId,
        applicationId: event.applicationId,
        riskAssessmentId: event.riskAssessmentId,
      }),
    );

    // Generate decision id here because upstream event only carries risk assessment metadata.
    await this.useCase.execute({
      eventId: event.eventId,
      eventType: event.eventType,
      aggregateId: event.aggregateId,
      decisionId: randomUUID(),
      applicationId: event.applicationId,
      applicantId: event.applicantId,
      riskAssessmentId: event.riskAssessmentId,
      riskLevel: event.riskLevel,
      riskAnalysisResult: event.riskAnalysisResult,
      idempotencyKey: event.idempotencyKey,
      correlationId: event.correlationId,
      occurredAt: event.occurredAt,
    });
  }
}
