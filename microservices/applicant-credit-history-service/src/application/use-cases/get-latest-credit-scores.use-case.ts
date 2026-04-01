import { Inject, Injectable } from '@nestjs/common';
import {
  APPLICANT_CREDIT_HISTORY_REPOSITORY,
  ApplicantCreditHistoryRepository,
} from '../../domain/repositories/applicant-credit-history.repository';
import { LatestCreditScoresResult } from '../dto/get-latest-credit-scores.result';

/**
 * Query use case that returns latest normalized scores for an applicant.
 */
@Injectable()
export class GetLatestCreditScoresUseCase {
  constructor(
    @Inject(APPLICANT_CREDIT_HISTORY_REPOSITORY)
    private readonly repository: ApplicantCreditHistoryRepository,
  ) {}

  /**
   * Returns one provider score when filtered, otherwise latest score per provider.
   */
  async execute(applicantId: string, providerName?: string): Promise<LatestCreditScoresResult> {
    if (providerName) {
      // Optimized path when consumer requests one specific provider.
      const score = await this.repository.findLatestCreditScoreByApplicantAndProvider(
        applicantId,
        providerName,
      );

      return {
        applicantId,
        scores: score
          ? [
              {
                scoreId: score.id,
                applicantId: score.applicantId,
                providerName: score.scoreProviderName,
                score: score.score,
                updatedAt: score.updatedAt.toISOString(),
              },
            ]
          : [],
      };
    }

    // Default path: get one latest score per provider for the applicant.
    const latestScores = await this.repository.findLatestCreditScoresByApplicantId(applicantId);

    return {
      applicantId,
      scores: latestScores.map((score) => ({
        scoreId: score.id,
        applicantId: score.applicantId,
        providerName: score.scoreProviderName,
        score: score.score,
        updatedAt: score.updatedAt.toISOString(),
      })),
    };
  }
}