/**
 * Query projection for a bureau report exposed by HTTP/API interfaces.
 */
export interface ApplicantBureauReportView {
  /** Report identifier. */
  reportId: string;
  /** Applicant owner of the report. */
  applicantId: string;
  /** Bureau provider name. */
  providerName: string;
  /** Original provider payload. */
  rawData: Record<string, unknown>;
  /** Report fetch timestamp in ISO-8601 format. */
  fetchedAt: string;
}

/**
 * Query result for all bureau reports associated with an applicant.
 */
export interface ApplicantBureauReportsResult {
  /** Requested applicant identifier. */
  applicantId: string;
  /** Ordered list of bureau reports. */
  reports: ApplicantBureauReportView[];
}