import { Inject, Injectable } from '@nestjs/common';
import {
  LOAN_DECISION_REPOSITORY,
  LoanDecisionRepository,
} from '../../domain/repositories/loan-decision.repository';
import { GetCreditDecisionResult } from '../dto/get-credit-decision.result';

@Injectable()
export class ListCreditDecisionsUseCase {
  constructor(
    @Inject(LOAN_DECISION_REPOSITORY)
    private readonly repository: LoanDecisionRepository,
  ) {}

  /**
   * Lists credit decisions optionally filtered by applicant and/or status.
   */
  async execute(filters?: {
    applicantId?: string;
    decision?: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  }): Promise<GetCreditDecisionResult[]> {
    const decisions = await this.repository.findDecisions(filters);

    // Translate domain entities to query DTOs.
    return decisions.map((item) => ({
      decisionId: item.id,
      applicationId: item.applicationId,
      applicantId: item.applicantId,
      decision: item.status,
      approvedAmount: item.approvedAmount,
      assignedInterestRate: item.assignedInterestRate,
      riskAssessmentId: item.riskAssessmentId,
      calculatedAt: item.calculatedAt.toISOString(),
    }));
  }
}
