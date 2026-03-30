import { BureauReport } from '../entities/bureau-report.entity';
import { CreditScore } from '../entities/credit-score.entity';

export const APPLICANT_CREDIT_HISTORY_REPOSITORY = Symbol('APPLICANT_CREDIT_HISTORY_REPOSITORY');

export interface ApplicantCreditHistoryRepository {
  saveBureauReport(report: BureauReport): Promise<void>;
  saveCreditScore(score: CreditScore): Promise<void>;
  findLatestCreditScoreByApplicantAndProvider(
    applicantId: string,
    providerName: string,
  ): Promise<CreditScore | null>;
  findLatestCreditScoresByApplicantId(applicantId: string): Promise<CreditScore[]>;
  findBureauReportsByApplicantId(applicantId: string): Promise<BureauReport[]>;
}
