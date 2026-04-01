import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  LOAN_APPLICATION_REPOSITORY,
  LoanApplicationRepository,
} from '../../domain/repositories/loan-application.repository';
import { LoanApplicationView } from '../dto/loan-application-view.dto';

@Injectable()
export class GetLoanApplicationUseCase {
  /**
   * Receives the read repository dependency.
   */
  constructor(
    @Inject(LOAN_APPLICATION_REPOSITORY)
    private readonly repository: LoanApplicationRepository,
  ) {}

  /**
   * Returns a single loan application view by identifier.
   */
  async execute(applicationId: string): Promise<LoanApplicationView> {
    // Read aggregate from persistence.
    const application = await this.repository.findApplicationById(applicationId);
    if (!application) {
      throw new NotFoundException(`Loan application ${applicationId} not found`);
    }

    // Map domain entity into a transport-safe view model.
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
