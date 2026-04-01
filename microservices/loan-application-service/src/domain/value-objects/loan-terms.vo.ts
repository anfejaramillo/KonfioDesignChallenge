/**
 * Loan terms value object.
 */
export class LoanTerms {
  /**
   * Creates and validates loan term configuration.
   */
  constructor(
    public readonly term: number,
    public readonly timePeriodType: 'DAILY' | 'WEEKLY' | 'MONTHLY',
  ) {
    // Term must be strictly positive.
    if (term <= 0) {
      throw new Error('Loan term must be greater than zero');
    }
  }
}
