import { Inject, Injectable } from '@nestjs/common';
import { LoanApplicationStatus } from '../../domain/entities/loan-application.entity';
import {
  LOAN_APPLICATION_REPOSITORY,
  LoanApplicationRepository,
} from '../../domain/repositories/loan-application.repository';
import { LoanApplicationView } from '../dto/loan-application-view.dto';

@Injectable()
export class ListLoanApplicationsUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_REPOSITORY)
    private readonly repository: LoanApplicationRepository,
  ) {}

  async execute(filters?: {
    applicantId?: string;
    status?: LoanApplicationStatus;
  }): Promise<LoanApplicationView[]> {
    const applications = await this.repository.findApplications(filters);

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
