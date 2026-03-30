import { Currency } from '../value-objects/currency.vo';

export type LoanApplicationStatus = 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export class LoanApplication {
  constructor(
    public readonly id: string,
    public readonly applicantId: string,
    public readonly loanProductId: string,
    public readonly requestedAmount: number,
    public readonly currency: Currency,
    public status: LoanApplicationStatus,
    public readonly requestedAt: Date,
  ) {}

  approve(): void {
    this.status = 'APPROVED';
  }

  reject(): void {
    this.status = 'REJECTED';
  }
}
