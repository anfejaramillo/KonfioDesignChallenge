export interface FetchApplicantCreditHistoryHttpDto {
  eventId: string;
  eventType: 'loanApplicationCreated';
  aggregateId: string;
  applicationId: string;
  applicantId: string;
  idempotencyKey: string;
  correlationId: string;
  occurredAt: string;
  bureauResponses?: {
    providerName: string;
    providerMinScore: number;
    providerMaxScore: number;
    providerScore: number;
    rawData: Record<string, unknown>;
  }[];
}
