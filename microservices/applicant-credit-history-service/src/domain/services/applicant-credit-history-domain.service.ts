import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BureauReport } from '../entities/bureau-report.entity';
import { CreditScore } from '../entities/credit-score.entity';
import { ScoreProvider } from '../value-objects/score-provider.vo';

/** Input payload required to produce report and score domain entities. */
export interface ProviderBureauInput {
  /** Provider source name. */
  providerName: string;
  /** Minimum score in provider range. */
  providerMinScore: number;
  /** Maximum score in provider range. */
  providerMaxScore: number;
  /** Raw provider score value. */
  providerScore: number;
  /** Original provider payload. */
  rawData: Record<string, unknown>;
}

/**
 * Domain service with business rules to transform provider data
 * into immutable domain entities.
 */
@Injectable()
export class ApplicantCreditHistoryDomainService {
  /**
   * Creates a bureau report snapshot tied to one applicant.
   */
  createBureauReport(applicantId: string, input: ProviderBureauInput): BureauReport {
    return new BureauReport(randomUUID(), applicantId, input.providerName, input.rawData, new Date());
  }

  /**
   * Converts provider score scale into Konfio score scale and returns entity.
   */
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