/**
 * Integration event emitted once bureau data has been fetched and persisted.
 */
export interface BureauDataFetchedEvent {
  /** Event unique id. */
  eventId: string;
  /** Event type discriminator. */
  eventType: 'bureauDataFetched';
  /** Aggregate id associated with the event. */
  aggregateId: string;
  /** Idempotency key inherited from source flow. */
  idempotencyKey: string;
  /** Correlation id for distributed tracing. */
  correlationId: string;
  /** Loan application identifier. */
  applicationId: string;
  /** Applicant identifier. */
  applicantId: string;
  /** Providers that were processed in this run. */
  providersProcessed: string[];
  /** Number of reports persisted in this run. */
  reportsStored: number;
  /** Number of scores persisted in this run. */
  scoresUpdated: number;
  /** Emission timestamp in ISO-8601 format. */
  occurredAt: string;
}