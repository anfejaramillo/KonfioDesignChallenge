import { CreditDecision } from '../entities/credit-decision.entity';
import { RiskAssessment } from '../entities/risk-assessment.entity';

export const LOAN_DECISION_REPOSITORY = Symbol('LOAN_DECISION_REPOSITORY');

export interface LoanDecisionRepository {
  saveRiskAssessment(assessment: RiskAssessment): Promise<void>;
  saveCreditDecision(decision: CreditDecision): Promise<void>;
  findDecisionByApplicationId(applicationId: string): Promise<CreditDecision | null>;
  findRiskAssessmentById(riskAssessmentId: string): Promise<RiskAssessment | null>;
  findDecisions(filters?: {
    applicantId?: string;
    decision?: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  }): Promise<CreditDecision[]>;
}
