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
  status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  occurredAt: string;
}
