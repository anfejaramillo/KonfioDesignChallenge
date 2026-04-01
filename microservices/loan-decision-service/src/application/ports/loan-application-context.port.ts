/**
 * Decision inputs required to run policy evaluation.
 */
export interface DecisionContext {
  requestedAmount: number;
  policy: {
    maxProbabilityOfDefaultForApproval: number;
    manualApprovalRequired: boolean;
    baseInterestRate: number;
  };
}

export const LOAN_APPLICATION_CONTEXT_PORT = Symbol('LOAN_APPLICATION_CONTEXT_PORT');

/**
 * Contract for obtaining context from the Loan Application bounded context.
 */
export interface LoanApplicationContextPort {
  /**
   * Resolves decision context for an application and correlation id.
   */
  findDecisionContextByApplicationId(
    applicationId: string,
    correlationId: string,
  ): Promise<DecisionContext>;
}
