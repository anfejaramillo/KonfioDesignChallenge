import { Inject, Injectable } from '@nestjs/common';
import {
  APPLICANT_CREDIT_HISTORY_REPOSITORY,
  ApplicantCreditHistoryRepository,
} from '../../domain/repositories/applicant-credit-history.repository';
import { LatestCreditScoresResult } from '../dto/get-latest-credit-scores.result';

@Injectable()
export class GetLatestCreditScoresUseCase {
  constructor(
    @Inject(APPLICANT_CREDIT_HISTORY_REPOSITORY)
    private readonly repository: ApplicantCreditHistoryRepository,
  ) {}

  async execute(applicantId: string, providerName?: string): Promise<LatestCreditScoresResult> {
    if (providerName) {
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
