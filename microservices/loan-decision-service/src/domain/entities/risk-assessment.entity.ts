import { RiskLevel } from '../value-objects/risk-level.vo';

/**
 * Aggregate representing the risk analysis produced for a loan application.
 */
export class RiskAssessment {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly applicantId: string,
    public readonly riskLevel: RiskLevel,
    public readonly riskAnalysisResult: Record<string, unknown>,
    public readonly calculatedAt: Date,
  ) {}
}
