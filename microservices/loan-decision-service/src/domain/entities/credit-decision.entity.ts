export type CreditDecisionStatus = 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';

/**
 * Aggregate root representing the decision made for a loan application.
 */
export class CreditDecision {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly applicantId: string,
    public status: CreditDecisionStatus,
    public approvedAmount: number | null,
    public assignedInterestRate: number | null,
    public readonly riskAssessmentId: string,
    public readonly calculatedAt: Date,
  ) {}

  /**
   * Marks the decision as approved and stores approved amount and interest rate.
   */
  approve(approvedAmount: number, assignedInterestRate: number): void {
    if (approvedAmount <= 0) {
      throw new Error('approvedAmount must be greater than 0');
    }

    if (assignedInterestRate < 0) {
      throw new Error('assignedInterestRate cannot be negative');
    }

    this.status = 'APPROVED';
    this.approvedAmount = approvedAmount;
    this.assignedInterestRate = assignedInterestRate;
  }

  /**
   * Marks the decision as rejected and clears financial outputs.
   */
  reject(): void {
    this.status = 'REJECTED';
    this.approvedAmount = null;
    this.assignedInterestRate = null;
  }

  /**
   * Marks the decision for manual review and clears financial outputs.
   */
  markUnderReview(): void {
    this.status = 'UNDER_REVIEW';
    this.approvedAmount = null;
    this.assignedInterestRate = null;
  }
}
