import { Injectable } from '@nestjs/common';
import { BureauReport } from '../../domain/entities/bureau-report.entity';
import { CreditScore } from '../../domain/entities/credit-score.entity';
import { ApplicantCreditHistoryRepository } from '../../domain/repositories/applicant-credit-history.repository';

@Injectable()
export class InMemoryApplicantCreditHistoryRepository implements ApplicantCreditHistoryRepository {
  private readonly reportsByApplicant = new Map<string, BureauReport[]>();
  private readonly scoresByApplicant = new Map<string, CreditScore[]>();

  async saveBureauReport(report: BureauReport): Promise<void> {
    const current = this.reportsByApplicant.get(report.applicantId) ?? [];
    this.reportsByApplicant.set(report.applicantId, [...current, report]);
  }

  async saveCreditScore(score: CreditScore): Promise<void> {
    const current = this.scoresByApplicant.get(score.applicantId) ?? [];
    this.scoresByApplicant.set(score.applicantId, [...current, score]);
  }

  async findLatestCreditScoreByApplicantAndProvider(
    applicantId: string,
    providerName: string,
  ): Promise<CreditScore | null> {
    const scores = this.scoresByApplicant.get(applicantId) ?? [];
    const filtered = scores
      .filter((score) => score.scoreProviderName === providerName)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return filtered[0] ?? null;
  }

  async findLatestCreditScoresByApplicantId(applicantId: string): Promise<CreditScore[]> {
    const scores = this.scoresByApplicant.get(applicantId) ?? [];
    const latestByProvider = new Map<string, CreditScore>();

    for (const score of scores) {
      const current = latestByProvider.get(score.scoreProviderName);
      if (!current || score.updatedAt.getTime() > current.updatedAt.getTime()) {
        latestByProvider.set(score.scoreProviderName, score);
      }
    }

    return Array.from(latestByProvider.values()).sort((a, b) =>
      a.scoreProviderName.localeCompare(b.scoreProviderName),
    );
  }

  async findBureauReportsByApplicantId(applicantId: string): Promise<BureauReport[]> {
    return (this.reportsByApplicant.get(applicantId) ?? []).sort(
      (a, b) => b.fetchedAt.getTime() - a.fetchedAt.getTime(),
    );
  }
}
