import { Currency } from '../value-objects/currency.vo';
import { LoanTerms } from '../value-objects/loan-terms.vo';

/**
 * Loan product aggregate root.
 */
export class LoanProduct {
  /**
   * Creates an immutable loan product definition.
   */
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly term: LoanTerms,
    public readonly interestRate: number,
    public readonly currency: Currency,
    public readonly minAmount: number,
    public readonly maxAmount: number,
  ) {}

  /**
   * Verifies whether a requested amount is inside product limits.
   */
  allowsAmount(amount: number): boolean {
    // Validate lower and upper amount bounds.
    return amount >= this.minAmount && amount <= this.maxAmount;
  }
}
