import { LoanApplicationStatus } from '../../domain/entities/loan-application.entity';

export interface ProcessCreditDecisionResult {
  applicationId: string;
  status: LoanApplicationStatus;
}
