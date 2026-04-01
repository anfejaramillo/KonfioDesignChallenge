/**
 * Applicant entity used as reference data for loan applications.
 */
export class Applicant {
  /**
   * Creates an immutable applicant entity.
   */
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly dni: string,
    public readonly incomeOrigin: string,
    public readonly monthlyIncome: number,
    public readonly mobile: string,
    public readonly email: string,
  ) {}
}
