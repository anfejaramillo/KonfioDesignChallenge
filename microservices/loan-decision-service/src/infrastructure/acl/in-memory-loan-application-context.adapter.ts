import { Injectable } from '@nestjs/common';
import {
  DecisionContext,
  LoanApplicationContextPort,
} from '../../application/ports/loan-application-context.port';

@Injectable()
export class InMemoryLoanApplicationContextAdapter implements LoanApplicationContextPort {
  /**
   * Returns deterministic in-memory context values for local development.
   */
  async findDecisionContextByApplicationId(
    applicationId: string,
    correlationId: string,
  ): Promise<DecisionContext> {
    // Keep parameters explicitly referenced to avoid lint errors in this adapter stub.
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
