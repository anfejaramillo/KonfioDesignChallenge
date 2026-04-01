/**
 * Immutable domain entity representing a bureau report snapshot.
 */
export class BureauReport {
  constructor(
    /** Unique report identifier. */
    public readonly id: string,
    /** Applicant owner of the report. */
    public readonly applicantId: string,
    /** Provider source name. */
    public readonly scoreProviderName: string,
    /** Original provider payload. */
    public readonly rawData: Record<string, unknown>,
    /** Timestamp when the report was fetched and persisted. */
    public readonly fetchedAt: Date,
  ) {}
}