import { BureauReport } from '../entities/bureau-report.entity';
import { CreditScore } from '../entities/credit-score.entity';

/** Dependency-injection token for applicant-credit-history repository implementations. */
export const APPLICANT_CREDIT_HISTORY_REPOSITORY = Symbol('APPLICANT_CREDIT_HISTORY_REPOSITORY');

/**
 * Domain repository contract used by application use cases.
 */
export interface ApplicantCreditHistoryRepository {
  /** Persists one bureau report entity. */
  saveBureauReport(report: BureauReport): Promise<void>;
  /** Persists one normalized credit score entity. */
  saveCreditScore(score: CreditScore): Promise<void>;
  /** Returns latest score for one applicant and one provider, or null when absent. */
  findLatestCreditScoreByApplicantAndProvider(
    applicantId: string,
    providerName: string,
  ): Promise<CreditScore | null>;
  /** Returns latest score per provider for one applicant. */
  findLatestCreditScoresByApplicantId(applicantId: string): Promise<CreditScore[]>;
  /** Returns all bureau reports for one applicant. */
  findBureauReportsByApplicantId(applicantId: string): Promise<BureauReport[]>;
}