export interface LatestCreditScoreView {
  scoreId: string;
  applicantId: string;
  providerName: string;
  score: number;
  updatedAt: string;
}

export interface LatestCreditScoresResult {
  applicantId: string;
  scores: LatestCreditScoreView[];
}
