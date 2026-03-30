export class LoanTerms {
  constructor(
    public readonly term: number,
    public readonly timePeriodType: 'DAILY' | 'WEEKLY' | 'MONTHLY',
  ) {
    if (term <= 0) {
      throw new Error('Loan term must be greater than zero');
    }
  }
}
