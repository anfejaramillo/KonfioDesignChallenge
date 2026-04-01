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
  /**
   * Applies decision policy over a risk assessment and requested amount.
   */
  decide(
    assessment: RiskAssessment,
    requestedAmount: number,
    policy: DecisionPolicyInput,
  ): DecisionOutcome {
    if (requestedAmount <= 0) {
      throw new Error('requestedAmount must be greater than 0');
    }

    if (policy.baseInterestRate < 0) {
      throw new Error('baseInterestRate cannot be negative');
    }

    // Manual approval bypasses automatic approval/rejection.
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

    // Risk above threshold is automatically rejected.
    return {
      status: 'REJECTED',
      approvedAmount: null,
      assignedInterestRate: null,
    };
  }

  /**
   * Calculates assigned interest rate as base rate plus risk premium.
   */
  private calculateInterest(baseRate: number, riskProbability: number): number {
    return Number((baseRate + riskProbability).toFixed(4));
  }

  /**
   * Mutates the decision aggregate according to the computed outcome.
   */
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
