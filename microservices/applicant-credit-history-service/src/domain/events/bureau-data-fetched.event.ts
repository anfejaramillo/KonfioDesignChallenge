export interface BureauDataFetchedEvent {
  eventId: string;
  eventType: 'bureauDataFetched';
  aggregateId: string;
  idempotencyKey: string;
  correlationId: string;
  applicationId: string;
  applicantId: string;
  providersProcessed: string[];
  reportsStored: number;
  scoresUpdated: number;
  occurredAt: string;
}
