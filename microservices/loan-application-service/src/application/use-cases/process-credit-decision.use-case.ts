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

  constructor(
    @Inject(LOAN_APPLICATION_REPOSITORY)
    private readonly repository: LoanApplicationRepository,
    @Inject(IDEMPOTENCY_STORE_PORT)
    private readonly idempotencyStore: IdempotencyStorePort,
  ) {}

  async execute(command: ProcessCreditDecisionCommand): Promise<ProcessCreditDecisionResult> {
    const alreadyProcessed = await this.idempotencyStore.exists(command.idempotencyKey);
    if (alreadyProcessed) {
      const existingApplication = await this.repository.findApplicationById(command.applicationId);
      return {
        applicationId: command.applicationId,
        status: existingApplication?.status ?? 'UNDER_REVIEW',
      };
    }

    const application = await this.repository.findApplicationById(command.applicationId);
    if (!application) {
      throw new NotFoundException(`Application not found for event: ${command.applicationId}`);
    }

    if (command.decision === 'APPROVED') {
      application.approve();
    } else if (command.decision === 'REJECTED') {
      application.reject();
    } else {
      this.logger.log(`Decision ${command.decision} does not change application status`);
    }

    await this.repository.saveLoanApplication(application);
    await this.idempotencyStore.save(command.idempotencyKey, 60 * 60 * 24 * 7);

    return {
      applicationId: application.id,
      status: application.status,
    };
  }
}
