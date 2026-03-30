export interface CreateLoanApplicationResult {
  applicationId: string;
  status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}
