/**
 * Integration event emitted after a credit decision is computed and persisted.
 */
export interface CreditDecisionMadeEvent {
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
  riskAssessmentId: string;
  occurredAt: string;
}
