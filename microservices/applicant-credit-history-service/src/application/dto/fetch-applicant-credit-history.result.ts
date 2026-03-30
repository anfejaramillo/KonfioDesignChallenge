export interface FetchApplicantCreditHistoryResult {
  applicantId: string;
  reportsStored: number;
  scoresUpdated: number;
  status: 'PROCESSED' | 'DUPLICATE_IGNORED';
}