import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  LOAN_APPLICATION_REPOSITORY,
  LoanApplicationRepository,
} from '../../domain/repositories/loan-application.repository';
import { ProcessCreditDecisionCommand } from '../commands/process-credit-decision.command';
import { ProcessCreditDecisionResult } from '../dto/process-credit-decision.result';
import {
  IDEMPOTENCY_STORE_PORT,
  IdempotencyStorePort,
} from '../ports/idempotency-store.port';

@Injectable()
export class ProcessCreditDecisionUseCase {
  private readonly logger = new Logger(ProcessCreditDecisionUseCase.name);

  /**
   * Builds the use case with repository and idempotency dependencies.
   */
  constructor(
    @Inject(LOAN_APPLICATION_REPOSITORY)
    private readonly repository: LoanApplicationRepository,
    @Inject(IDEMPOTENCY_STORE_PORT)
    private readonly idempotencyStore: IdempotencyStorePort,
  ) {}

  /**
   * Applies a credit decision event to an existing loan application.
   */
  async execute(command: ProcessCreditDecisionCommand): Promise<ProcessCreditDecisionResult> {
    // Short-circuit duplicated events using idempotency.
    const alreadyProcessed = await this.idempotencyStore.exists(command.idempotencyKey);
    if (alreadyProcessed) {
      // Return current state for repeated delivery attempts.
      const existingApplication = await this.repository.findApplicationById(command.applicationId);
      return {
        applicationId: command.applicationId,
        status: existingApplication?.status ?? 'UNDER_REVIEW',
      };
    }

    // Resolve application targeted by the incoming event.
    const application = await this.repository.findApplicationById(command.applicationId);
    if (!application) {
      throw new NotFoundException(`Application not found for event: ${command.applicationId}`);
    }

    // Transition status depending on external decision.
    if (command.decision === 'APPROVED') {
      application.approve();
    } else if (command.decision === 'REJECTED') {
      application.reject();
    } else {
      // UNDER_REVIEW does not change current aggregate status.
      this.logger.log(`Decision ${command.decision} does not change application status`);
    }

    // Persist updated aggregate and register processed event key.
    await this.repository.saveLoanApplication(application);
    await this.idempotencyStore.save(command.idempotencyKey, 60 * 60 * 24 * 7);

    return {
      applicationId: application.id,
      status: application.status,
    };
  }
}
