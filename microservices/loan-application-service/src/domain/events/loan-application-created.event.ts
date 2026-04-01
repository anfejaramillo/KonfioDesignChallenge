/**
 * Domain integration event published when a loan application is created.
 */
export interface LoanApplicationCreatedEvent {
  eventId: string;
  eventType: 'loanApplicationCreated';
  aggregateId: string;
  idempotencyKey: string;
  correlationId: string;
  applicationId: string;
  applicantId: string;
  loanProductId: string;
  requestedAmount: number;
  currencyCode: string;
  status: LoanApplicationCreatedStatus;
  occurredAt: string;
}

export type LoanApplicationCreatedStatus = 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
