export type CreditDecisionStatus = 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';

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

  approve(approvedAmount: number, assignedInterestRate: number): void {
    this.status = 'APPROVED';
    this.approvedAmount = approvedAmount;
    this.assignedInterestRate = assignedInterestRate;
  }

  reject(): void {
    this.status = 'REJECTED';
    this.approvedAmount = null;
    this.assignedInterestRate = null;
  }

  markUnderReview(): void {
    this.status = 'UNDER_REVIEW';
    this.approvedAmount = null;
    this.assignedInterestRate = null;
  }
}