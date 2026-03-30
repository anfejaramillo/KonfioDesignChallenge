import { LoanApplicationStatus } from '../../domain/entities/loan-application.entity';

export interface LoanApplicationView {
  applicationId: string;
  applicantId: string;
  loanProductId: string;
  requestedAmount: number;
  currencyCode: string;
  status: LoanApplicationStatus;
  requestedAt: string;
}
