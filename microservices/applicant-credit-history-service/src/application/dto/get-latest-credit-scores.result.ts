/**
 * Query projection for one normalized credit score.
 */
export interface LatestCreditScoreView {
  /** Score identifier. */
  scoreId: string;
  /** Applicant owner of the score. */
  applicantId: string;
  /** Provider used to produce the normalized score. */
  providerName: string;
  /** Score normalized to Konfio scale. */
  score: number;
  /** Last update timestamp in ISO-8601 format. */
  updatedAt: string;
}

/**
 * Query result that groups latest scores for an applicant.
 */
export interface LatestCreditScoresResult {
  /** Requested applicant identifier. */
  applicantId: string;
  /** Latest score per provider (or one filtered provider). */
  scores: LatestCreditScoreView[];
}