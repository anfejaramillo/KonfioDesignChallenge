export interface RiskAssessmentCompletedEvent {
  eventId: string;
  eventType: 'riskAssesmentCompleted';
  aggregateId: string;
  idempotencyKey: string;
  correlationId: string;
  applicationId: string;
  applicantId: string;
  riskAssessmentId: string;
  riskLevel: {
    probabilityOfDefaultUpperLimit: number;
    description: string;
  };
  riskAnalysisResult: Record<string, unknown>;
  occurredAt: string;
}
