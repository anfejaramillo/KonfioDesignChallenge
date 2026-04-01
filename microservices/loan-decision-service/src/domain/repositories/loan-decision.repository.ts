import { CreditDecision } from '../entities/credit-decision.entity';
import { RiskAssessment } from '../entities/risk-assessment.entity';

export const LOAN_DECISION_REPOSITORY = Symbol('LOAN_DECISION_REPOSITORY');

/**
 * Repository contract for risk assessments and credit decisions persistence.
 */
export interface LoanDecisionRepository {
  /**
   * Persists risk assessment aggregate.
   */
  saveRiskAssessment(assessment: RiskAssessment): Promise<void>;

  /**
   * Persists credit decision aggregate.
   */
  saveCreditDecision(decision: CreditDecision): Promise<void>;

  /**
   * Retrieves decision by loan application id.
   */
  findDecisionByApplicationId(applicationId: string): Promise<CreditDecision | null>;

  /**
   * Retrieves risk assessment by id.
   */
  findRiskAssessmentById(riskAssessmentId: string): Promise<RiskAssessment | null>;

  /**
   * Lists decisions optionally filtered by applicant id and decision status.
   */
  findDecisions(filters?: {
    applicantId?: string;
    decision?: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  }): Promise<CreditDecision[]>;
}
