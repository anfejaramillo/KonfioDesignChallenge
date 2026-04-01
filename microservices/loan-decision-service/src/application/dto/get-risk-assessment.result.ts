/**
 * DTO returned when a stored risk assessment is queried by id.
 */
export interface GetRiskAssessmentResult {
  riskAssessmentId: string;
  applicationId: string;
  applicantId: string;
  riskLevel: {
    probabilityOfDefaultUpperLimit: number;
    description: string;
  };
  riskAnalysisResult: Record<string, unknown>;
  calculatedAt: string;
}
