export interface MakeCreditDecisionCommand {
  eventId: string;
  eventType: 'riskAssesmentCompleted';
  aggregateId: string;
  decisionId: string;
  applicationId: string;
  applicantId: string;
  riskAssessmentId: string;
  riskLevel: {
    probabilityOfDefaultUpperLimit: number;
    description: string;
  };
  riskAnalysisResult: Record<string, unknown>;
  requestedAmount?: number;
  policy?: {
    maxProbabilityOfDefaultForApproval: number;
    manualApprovalRequired: boolean;
    baseInterestRate: number;
  };
  idempotencyKey: string;
  correlationId: string;
  occurredAt: string;
}
