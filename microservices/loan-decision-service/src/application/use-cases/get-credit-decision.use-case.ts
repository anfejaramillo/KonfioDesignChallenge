import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  LOAN_DECISION_REPOSITORY,
  LoanDecisionRepository,
} from '../../domain/repositories/loan-decision.repository';
import { GetCreditDecisionResult } from '../dto/get-credit-decision.result';

@Injectable()
export class GetCreditDecisionUseCase {
  constructor(
    @Inject(LOAN_DECISION_REPOSITORY)
    private readonly repository: LoanDecisionRepository,
  ) {}

  async execute(applicationId: string): Promise<GetCreditDecisionResult> {
    const decision = await this.repository.findDecisionByApplicationId(applicationId);
    if (!decision) {
      throw new NotFoundException(`Credit decision not found for applicationId ${applicationId}`);
    }

    return {
      decisionId: decision.id,
      applicationId: decision.applicationId,
      applicantId: decision.applicantId,
      decision: decision.status,
      approvedAmount: decision.approvedAmount,
      assignedInterestRate: decision.assignedInterestRate,
      riskAssessmentId: decision.riskAssessmentId,
      calculatedAt: decision.calculatedAt.toISOString(),
    };
  }
}
