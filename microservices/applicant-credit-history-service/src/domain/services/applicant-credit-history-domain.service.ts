import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BureauReport } from '../entities/bureau-report.entity';
import { CreditScore } from '../entities/credit-score.entity';
import { ScoreProvider } from '../value-objects/score-provider.vo';

export interface ProviderBureauInput {
  providerName: string;
  providerMinScore: number;
  providerMaxScore: number;
  providerScore: number;
  rawData: Record<string, unknown>;
}

@Injectable()
export class ApplicantCreditHistoryDomainService {
  createBureauReport(applicantId: string, input: ProviderBureauInput): BureauReport {
    return new BureauReport(randomUUID(), applicantId, input.providerName, input.rawData, new Date());
  }

  createNormalizedCreditScore(applicantId: string, input: ProviderBureauInput): CreditScore {
    const provider = new ScoreProvider(
      input.providerName,
      input.providerMinScore,
      input.providerMaxScore,
    );

    return new CreditScore(
      randomUUID(),
      applicantId,
      input.providerName,
      provider.normalizeToKonfioScale(input.providerScore),
      new Date(),
    );
  }
}