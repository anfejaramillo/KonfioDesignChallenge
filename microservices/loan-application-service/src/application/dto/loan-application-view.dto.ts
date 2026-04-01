import { LoanApplicationStatus } from '../../domain/entities/loan-application.entity';

/**
 * Read model returned by query use cases and controller endpoints.
 */
export interface LoanApplicationView {
  applicationId: string;
  applicantId: string;
  loanProductId: string;
  requestedAmount: number;
  currencyCode: string;
  status: LoanApplicationStatus;
  requestedAt: string;
}
