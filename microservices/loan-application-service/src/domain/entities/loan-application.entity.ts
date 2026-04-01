import { Currency } from '../value-objects/currency.vo';

export type LoanApplicationStatus = 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

/**
 * Loan application aggregate root.
 */
export class LoanApplication {
  /**
   * Creates a loan application in a given lifecycle status.
   */
  constructor(
    public readonly id: string,
    public readonly applicantId: string,
    public readonly loanProductId: string,
    public readonly requestedAmount: number,
    public readonly currency: Currency,
    public status: LoanApplicationStatus,
    public readonly requestedAt: Date,
  ) {}

  /**
   * Marks the application as approved.
   */
  approve(): void {
    // Apply state transition to approved.
    this.status = 'APPROVED';
  }

  /**
   * Marks the application as rejected.
   */
  reject(): void {
    // Apply state transition to rejected.
    this.status = 'REJECTED';
  }
}
