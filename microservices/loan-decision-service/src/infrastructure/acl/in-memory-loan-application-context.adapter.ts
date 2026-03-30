import { Injectable } from '@nestjs/common';
import {
  DecisionContext,
  LoanApplicationContextPort,
} from '../../application/ports/loan-application-context.port';

@Injectable()
export class InMemoryLoanApplicationContextAdapter implements LoanApplicationContextPort {
  async findDecisionContextByApplicationId(
    applicationId: string,
    correlationId: string,
  ): Promise<DecisionContext> {
    void applicationId;
    void correlationId;

    return {
      requestedAmount: 10000,
      policy: {
        maxProbabilityOfDefaultForApproval: 0.35,
        manualApprovalRequired: false,
        baseInterestRate: 0.2,
      },
    };
  }
}
