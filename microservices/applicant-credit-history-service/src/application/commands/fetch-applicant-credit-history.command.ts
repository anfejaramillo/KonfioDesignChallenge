/**
 * Command received by the application layer when a loan application is created
 * and credit history must be fetched and normalized.
 */
export interface FetchApplicantCreditHistoryCommand {
  /** Unique id of the incoming integration event. */
  eventId: string;
  /** Type discriminator for the source domain event. */
  eventType: 'loanApplicationCreated';
  /** Aggregate id from the event envelope. */
  aggregateId: string;
  /** Loan application identifier. */
  applicationId: string;
  /** Applicant identifier used to query bureau providers. */
  applicantId: string;
  /** Key used to guarantee idempotent command execution. */
  idempotencyKey: string;
  /** Correlation id propagated through the flow for tracing. */
  correlationId: string;
  /** Event occurrence timestamp in ISO-8601 format. */
  occurredAt: string;
  /**
   * Optional provider responses. Useful for tests or deterministic processing
   * when the ACL lookup is not required.
   */
  bureauResponses?: {
    /** Provider name (for example BuroDeCredito). */
    providerName: string;
    /** Minimum score in provider scale. */
    providerMinScore: number;
    /** Maximum score in provider scale. */
    providerMaxScore: number;
    /** Raw score returned by provider. */
    providerScore: number;
    /** Unmapped provider payload stored for traceability. */
    rawData: Record<string, unknown>;
  }[];
}