export interface DecisionContext {
  requestedAmount: number;
  policy: {
    maxProbabilityOfDefaultForApproval: number;
    manualApprovalRequired: boolean;
    baseInterestRate: number;
  };
}

export const LOAN_APPLICATION_CONTEXT_PORT = Symbol('LOAN_APPLICATION_CONTEXT_PORT');

export interface LoanApplicationContextPort {
  findDecisionContextByApplicationId(
    applicationId: string,
    correlationId: string,
  ): Promise<DecisionContext>;
}
