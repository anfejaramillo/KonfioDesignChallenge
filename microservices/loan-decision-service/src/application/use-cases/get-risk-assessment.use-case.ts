import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  LOAN_DECISION_REPOSITORY,
  LoanDecisionRepository,
} from '../../domain/repositories/loan-decision.repository';
import { GetRiskAssessmentResult } from '../dto/get-risk-assessment.result';

@Injectable()
export class GetRiskAssessmentUseCase {
  constructor(
    @Inject(LOAN_DECISION_REPOSITORY)
    private readonly repository: LoanDecisionRepository,
  ) {}

  /**
   * Retrieves a persisted risk assessment by id.
   */
  async execute(riskAssessmentId: string): Promise<GetRiskAssessmentResult> {
    const assessment = await this.repository.findRiskAssessmentById(riskAssessmentId);
    if (!assessment) {
      throw new NotFoundException(`Risk assessment not found for id ${riskAssessmentId}`);
    }

    // Translate domain entity to query DTO.
    return {
      riskAssessmentId: assessment.id,
      applicationId: assessment.applicationId,
      applicantId: assessment.applicantId,
      riskLevel: {
        probabilityOfDefaultUpperLimit: assessment.riskLevel.probabilityOfDefaultUpperLimit,
        description: assessment.riskLevel.description,
      },
      riskAnalysisResult: assessment.riskAnalysisResult,
      calculatedAt: assessment.calculatedAt.toISOString(),
    };
  }
}
