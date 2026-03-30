export interface RegisterLoanProductHttpDto {
  id: string;
  name: string;
  term: number;
  timePeriodType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  interestRate: number;
  currencyCode: string;
  currencyName: string;
  minAmount: number;
  maxAmount: number;
  idempotencyKey: string;
}
