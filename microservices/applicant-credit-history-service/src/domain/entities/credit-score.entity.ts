/**
 * Immutable domain entity for normalized credit score values.
 */
export class CreditScore {
  constructor(
    /** Unique score identifier. */
    public readonly id: string,
    /** Applicant owner of the score. */
    public readonly applicantId: string,
    /** Provider source name. */
    public readonly scoreProviderName: string,
    /** Score normalized to Konfio's 0-1000 scale. */
    public readonly score: number,
    /** Timestamp when the score was updated. */
    public readonly updatedAt: Date,
  ) {}
}