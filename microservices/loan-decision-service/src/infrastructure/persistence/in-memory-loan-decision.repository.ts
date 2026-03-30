import { Injectable } from '@nestjs/common';
import { CreditDecision } from '../../domain/entities/credit-decision.entity';
import { RiskAssessment } from '../../domain/entities/risk-assessment.entity';
import { LoanDecisionRepository } from '../../domain/repositories/loan-decision.repository';

@Injectable()
export class InMemoryLoanDecisionRepository implements LoanDecisionRepository {
  private readonly decisionsByApplication = new Map<string, CreditDecision>();
  private readonly assessmentsById = new Map<string, RiskAssessment>();

  async saveRiskAssessment(assessment: RiskAssessment): Promise<void> {
    this.assessmentsById.set(assessment.id, assessment);
  }

  async saveCreditDecision(decision: CreditDecision): Promise<void> {
    this.decisionsByApplication.set(decision.applicationId, decision);
  }

  async findDecisionByApplicationId(applicationId: string): Promise<CreditDecision | null> {
    return this.decisionsByApplication.get(applicationId) ?? null;
  }

  async findRiskAssessmentById(riskAssessmentId: string): Promise<RiskAssessment | null> {
    return this.assessmentsById.get(riskAssessmentId) ?? null;
  }

  async findDecisions(filters?: {
    applicantId?: string;
    decision?: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  }): Promise<CreditDecision[]> {
    let decisions = Array.from(this.decisionsByApplication.values());

    if (filters?.applicantId) {
      decisions = decisions.filter((item) => item.applicantId === filters.applicantId);
    }

    if (filters?.decision) {
      decisions = decisions.filter((item) => item.status === filters.decision);
    }

    return decisions.sort((a, b) => b.calculatedAt.getTime() - a.calculatedAt.getTime());
  }
}
