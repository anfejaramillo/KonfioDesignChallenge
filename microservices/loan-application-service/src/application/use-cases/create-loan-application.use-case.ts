import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { LoanApplication } from '../../domain/entities/loan-application.entity';
import { Currency } from '../../domain/value-objects/currency.vo';
import {
  LOAN_APPLICATION_REPOSITORY,
  LoanApplicationRepository,
} from '../../domain/repositories/loan-application.repository';
import { LoanApplicationDomainService } from '../../domain/services/loan-application-domain.service';
import { EVENT_BUS_PORT, EventBusPort } from '../ports/event-bus.port';
import {
  IDEMPOTENCY_STORE_PORT,
  IdempotencyStorePort,
} from '../ports/idempotency-store.port';
import { CreateLoanApplicationCommand } from '../commands/create-loan-application.command';
import { CreateLoanApplicationResult } from '../dto/create-loan-application.result';

@Injectable()
export class CreateLoanApplicationUseCase {
  /**
   * Builds the use case with repository, integration bus, idempotency store and domain service.
   */
  constructor(
    @Inject(LOAN_APPLICATION_REPOSITORY)
    private readonly repository: LoanApplicationRepository,
    @Inject(EVENT_BUS_PORT)
    private readonly eventBus: EventBusPort,
    @Inject(IDEMPOTENCY_STORE_PORT)
    private readonly idempotencyStore: IdempotencyStorePort,
    private readonly domainService: LoanApplicationDomainService,
  ) {}

  /**
   * Creates a loan application, validates domain rules, persists it and publishes an integration event.
   */
  async execute(command: CreateLoanApplicationCommand): Promise<CreateLoanApplicationResult> {
    // Enforce idempotency before any mutable operation.
    const alreadyProcessed = await this.idempotencyStore.exists(command.idempotencyKey);
    if (alreadyProcessed) {
      // Return current state for retried requests using the same key.
      const existingApplication = await this.repository.findApplicationById(command.applicationId);
      return {
        applicationId: command.applicationId,
        status: existingApplication?.status ?? 'UNDER_REVIEW',
      };
    }

    // Resolve referenced aggregate roots required for creation.
    const product = await this.repository.findLoanProductById(command.loanProductId);
    if (!product) {
      throw new Error('Loan product not found');
    }

    const applicant = await this.repository.findApplicantById(command.applicantId);
    if (!applicant) {
      throw new Error('Applicant not found');
    }

    // Build the aggregate in initial UNDER_REVIEW state.
    const application = new LoanApplication(
      command.applicationId,
      command.applicantId,
      command.loanProductId,
      command.requestedAmount,
      new Currency(command.currencyCode, command.currencyName),
      'UNDER_REVIEW',
      new Date(),
    );

    // Validate business invariants before persisting.
    this.domainService.validateCreation(application, product);

    // Persist aggregate and publish domain-to-integration event.
    await this.repository.saveLoanApplication(application);
    await this.eventBus.publishLoanApplicationCreated({
      eventId: randomUUID(),
      eventType: 'loanApplicationCreated',
      aggregateId: application.id,
      idempotencyKey: command.idempotencyKey,
      correlationId: command.correlationId,
      applicationId: application.id,
      applicantId: application.applicantId,
      loanProductId: application.loanProductId,
      requestedAmount: application.requestedAmount,
      currencyCode: application.currency.code,
      status: application.status,
      occurredAt: new Date().toISOString(),
    });
    // Mark command as processed for one week.
    await this.idempotencyStore.save(command.idempotencyKey, 60 * 60 * 24 * 7);

    return {
      applicationId: application.id,
      status: 'UNDER_REVIEW',
    };
  }
}
