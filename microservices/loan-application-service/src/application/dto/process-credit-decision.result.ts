import { LoanApplicationStatus } from '../../domain/entities/loan-application.entity';

/**
 * Output DTO returned after applying a credit decision to an application.
 */
export interface ProcessCreditDecisionResult {
  applicationId: string;
  status: LoanApplicationStatus;
}
