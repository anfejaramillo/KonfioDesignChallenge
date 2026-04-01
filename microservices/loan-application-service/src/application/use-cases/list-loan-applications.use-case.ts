import { Inject, Injectable } from '@nestjs/common';
import { LoanApplicationStatus } from '../../domain/entities/loan-application.entity';
import {
  LOAN_APPLICATION_REPOSITORY,
  LoanApplicationRepository,
} from '../../domain/repositories/loan-application.repository';
import { LoanApplicationView } from '../dto/loan-application-view.dto';

@Injectable()
export class ListLoanApplicationsUseCase {
  /**
   * Receives the read repository dependency.
   */
  constructor(
    @Inject(LOAN_APPLICATION_REPOSITORY)
    private readonly repository: LoanApplicationRepository,
  ) {}

  /**
   * Returns loan applications filtered by applicant and/or status.
   */
  async execute(filters?: {
    applicantId?: string;
    status?: LoanApplicationStatus;
  }): Promise<LoanApplicationView[]> {
    // Pull records matching optional filters.
    const applications = await this.repository.findApplications(filters);

    // Convert domain entities to query DTOs.
    return applications.map((application) => ({
      applicationId: application.id,
      applicantId: application.applicantId,
      loanProductId: application.loanProductId,
      requestedAmount: application.requestedAmount,
      currencyCode: application.currency.code,
      status: application.status,
      requestedAt: application.requestedAt.toISOString(),
    }));
  }
}
