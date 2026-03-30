export interface MakeCreditDecisionResult {
  decisionId: string;
  applicationId: string;
  decision: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  status: 'PROCESSED' | 'DUPLICATE_IGNORED';
}