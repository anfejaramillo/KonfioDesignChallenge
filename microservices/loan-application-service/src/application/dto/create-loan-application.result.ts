/**
 * Output DTO returned after creating a loan application.
 */
export interface CreateLoanApplicationResult {
  applicationId: string;
  status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}
