import { Currency } from '../value-objects/currency.vo';
import { LoanTerms } from '../value-objects/loan-terms.vo';

export class LoanProduct {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly term: LoanTerms,
    public readonly interestRate: number,
    public readonly currency: Currency,
    public readonly minAmount: number,
    public readonly maxAmount: number,
  ) {}

  allowsAmount(amount: number): boolean {
    return amount >= this.minAmount && amount <= this.maxAmount;
  }
}
