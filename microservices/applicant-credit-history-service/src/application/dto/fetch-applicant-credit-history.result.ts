/**
 * Result returned after processing credit-history fetch for one applicant.
 */
export interface FetchApplicantCreditHistoryResult {
  /** Applicant processed by the command. */
  applicantId: string;
  /** Number of bureau reports persisted. */
  reportsStored: number;
  /** Number of normalized scores persisted. */
  scoresUpdated: number;
  /** Processing status, including idempotent duplicate handling. */
  status: 'PROCESSED' | 'DUPLICATE_IGNORED';
}