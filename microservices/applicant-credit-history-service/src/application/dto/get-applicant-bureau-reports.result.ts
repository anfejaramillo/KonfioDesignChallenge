export interface ApplicantBureauReportView {
  reportId: string;
  applicantId: string;
  providerName: string;
  rawData: Record<string, unknown>;
  fetchedAt: string;
}

export interface ApplicantBureauReportsResult {
  applicantId: string;
  reports: ApplicantBureauReportView[];
}
