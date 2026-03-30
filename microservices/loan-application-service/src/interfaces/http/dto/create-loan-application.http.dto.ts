export interface CreateLoanApplicationHttpDto {
  applicationId: string;
  applicantId: string;
  loanProductId: string;
  requestedAmount: number;
  currencyCode: string;
  currencyName: string;
  idempotencyKey: string;
  correlationId: string;
}
