import { Injectable, Logger } from '@nestjs/common';
import { LoanApplicationCreatedEvent } from '../../domain/events/loan-application-created.event';
import { FetchApplicantCreditHistoryUseCase } from '../../application/use-cases/fetch-applicant-credit-history.use-case';

@Injectable()
export class LoanApplicationCreatedHandler {
  private readonly logger = new Logger(LoanApplicationCreatedHandler.name);

  constructor(private readonly useCase: FetchApplicantCreditHistoryUseCase) {}

  async handle(event: LoanApplicationCreatedEvent): Promise<void> {
    this.logger.log(
      JSON.stringify({
        message: 'Handling loanApplicationCreated event',
        eventId: event.eventId,
        aggregateId: event.aggregateId,
        correlationId: event.correlationId,
        applicationId: event.applicationId,
        applicantId: event.applicantId,
      }),
    );

    await this.useCase.execute({
      eventId: event.eventId,
      eventType: event.eventType,
      aggregateId: event.aggregateId,
      applicationId: event.applicationId,
      applicantId: event.applicantId,
      idempotencyKey: event.idempotencyKey,
      correlationId: event.correlationId,
      occurredAt: event.occurredAt,
    });
  }
}
