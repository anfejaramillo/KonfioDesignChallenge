/**
 * DTO returned when a credit decision is queried by application id.
 */
export interface GetCreditDecisionResult {
  decisionId: string;
  applicationId: string;
  applicantId: string;
  decision: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  approvedAmount: number | null;
  assignedInterestRate: number | null;
  riskAssessmentId: string;
  calculatedAt: string;
}
