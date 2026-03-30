export interface CreditDecisionMadeHttpDto {
  eventId: string;
  eventType: 'creditDecisionMade';
  aggregateId: string;
  idempotencyKey: string;
  correlationId: string;
  applicationId: string;
  applicantId: string;
  decision: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  approvedAmount?: number;
  interestRate?: number;
  occurredAt: string;
}
