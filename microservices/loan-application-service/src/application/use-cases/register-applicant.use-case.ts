import { Inject, Injectable } from '@nestjs/common';
import { Applicant } from '../../domain/entities/applicant.entity';
import {
  LOAN_APPLICATION_REPOSITORY,
  LoanApplicationRepository,
} from '../../domain/repositories/loan-application.repository';
import {
  IDEMPOTENCY_STORE_PORT,
  IdempotencyStorePort,
} from '../ports/idempotency-store.port';
import { RegisterApplicantCommand } from '../commands/register-applicant.command';
import { RegisterApplicantResult } from '../dto/register-applicant.result';

@Injectable()
export class RegisterApplicantUseCase {
  /**
   * Builds the use case with write repository and idempotency dependencies.
   */
  constructor(
    @Inject(LOAN_APPLICATION_REPOSITORY)
    private readonly repository: LoanApplicationRepository,
    @Inject(IDEMPOTENCY_STORE_PORT)
    private readonly idempotencyStore: IdempotencyStorePort,
  ) {}

  /**
   * Registers an applicant in an idempotent manner.
   */
  async execute(command: RegisterApplicantCommand): Promise<RegisterApplicantResult> {
    // Avoid duplicate writes for retried commands.
    const alreadyProcessed = await this.idempotencyStore.exists(command.idempotencyKey);
    if (alreadyProcessed) {
      return { applicantId: command.id };
    }

    // Build and persist applicant entity.
    const applicant = new Applicant(
      command.id,
      command.name,
      command.dni,
      command.incomeOrigin,
      command.monthlyIncome,
      command.mobile,
      command.email,
    );

    // Persist state and track idempotency key lifetime.
    await this.repository.saveApplicant(applicant);
    await this.idempotencyStore.save(command.idempotencyKey, 60 * 60 * 24 * 7);

    return { applicantId: applicant.id };
  }
}
