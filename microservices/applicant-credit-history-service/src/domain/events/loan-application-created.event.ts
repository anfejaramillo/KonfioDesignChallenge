/**
 * Input event consumed by this service from loan-application context.
 */
export interface LoanApplicationCreatedEvent {
  /** Event unique id. */
  eventId: string;
  /** Event type discriminator. */
  eventType: 'loanApplicationCreated';
  /** Aggregate id associated with the source event. */
  aggregateId: string;
  /** Idempotency key for exactly-once behavior at application level. */
  idempotencyKey: string;
  /** Correlation id for cross-service tracing. */
  correlationId: string;
  /** Loan application identifier. */
  applicationId: string;
  /** Applicant identifier. */
  applicantId: string;
  /** Product requested by the applicant. */
  loanProductId: string;
  /** Requested amount in source currency. */
  requestedAmount: number;
  /** ISO currency code. */
  currencyCode: string;
  /** Loan application lifecycle status. */
  status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  /** Event occurrence timestamp in ISO-8601 format. */
  occurredAt: string;
}