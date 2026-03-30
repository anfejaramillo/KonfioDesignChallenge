import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  LOAN_APPLICATION_REPOSITORY,
  LoanApplicationRepository,
} from '../../domain/repositories/loan-application.repository';
import { LoanApplicationView } from '../dto/loan-application-view.dto';

@Injectable()
export class GetLoanApplicationUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_REPOSITORY)
    private readonly repository: LoanApplicationRepository,
  ) {}

  async execute(applicationId: string): Promise<LoanApplicationView> {
    const application = await this.repository.findApplicationById(applicationId);
    if (!application) {
      throw new NotFoundException(`Loan application ${applicationId} not found`);
    }

    return {
      applicationId: application.id,
      applicantId: application.applicantId,
      loanProductId: application.loanProductId,
      requestedAmount: application.requestedAmount,
      currencyCode: application.currency.code,
      status: application.status,
      requestedAt: application.requestedAt.toISOString(),
    };
  }
}
