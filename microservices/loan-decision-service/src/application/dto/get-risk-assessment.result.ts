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
