/**
 * Transport DTO for HTTP endpoint that ingests loanApplicationCreated events.
 */
export interface FetchApplicantCreditHistoryHttpDto {
  /** Event unique id. */
  eventId: string;
  /** Event type discriminator. */
  eventType: 'loanApplicationCreated';
  /** Aggregate id associated with the source event. */
  aggregateId: string;
  /** Loan application identifier. */
  applicationId: string;
  /** Applicant identifier. */
  applicantId: string;
  /** Idempotency key for duplicate suppression. */
  idempotencyKey: string;
  /** Correlation id for distributed tracing. */
  correlationId: string;
  /** Event occurrence timestamp in ISO-8601 format. */
  occurredAt: string;
  /** Optional provider responses to bypass external ACL calls. */
  bureauResponses?: {
    /** Provider source name. */
    providerName: string;
    /** Minimum score in provider range. */
    providerMinScore: number;
    /** Maximum score in provider range. */
    providerMaxScore: number;
    /** Score value in provider range. */
    providerScore: number;
    /** Unmapped provider payload. */
    rawData: Record<string, unknown>;
  }[];
}