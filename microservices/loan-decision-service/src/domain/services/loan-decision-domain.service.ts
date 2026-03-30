import { Injectable } from '@nestjs/common';
import { CreditDecision, CreditDecisionStatus } from '../entities/credit-decision.entity';
import { RiskAssessment } from '../entities/risk-assessment.entity';

export interface DecisionPolicyInput {
  maxProbabilityOfDefaultForApproval: number;
  manualApprovalRequired: boolean;
  baseInterestRate: number;
}

export interface DecisionOutcome {
  status: CreditDecisionStatus;
  approvedAmount: number | null;
  assignedInterestRate: number | null;
}

@Injectable()
export class LoanDecisionDomainService {
  decide(
    assessment: RiskAssessment,
    requestedAmount: number,
    policy: DecisionPolicyInput,
  ): DecisionOutcome {
    if (policy.manualApprovalRequired) {
      return {
        status: 'UNDER_REVIEW',
        approvedAmount: null,
        assignedInterestRate: null,
      };
    }

    if (assessment.riskLevel.probabilityOfDefaultUpperLimit <= policy.maxProbabilityOfDefaultForApproval) {
      return {
        status: 'APPROVED',
        approvedAmount: requestedAmount,
        assignedInterestRate: this.calculateInterest(
          policy.baseInterestRate,
          assessment.riskLevel.probabilityOfDefaultUpperLimit,
        ),
      };
    }

    return {
      status: 'REJECTED',
      approvedAmount: null,
      assignedInterestRate: null,
    };
  }

  private calculateInterest(baseRate: number, riskProbability: number): number {
    return Number((baseRate + riskProbability).toFixed(4));
  }

  applyOutcome(decision: CreditDecision, outcome: DecisionOutcome): void {
    if (outcome.status === 'APPROVED') {
      decision.approve(outcome.approvedAmount ?? 0, outcome.assignedInterestRate ?? 0);
      return;
    }

    if (outcome.status === 'UNDER_REVIEW') {
      decision.markUnderReview();
      return;
    }

    decision.reject();
  }
}