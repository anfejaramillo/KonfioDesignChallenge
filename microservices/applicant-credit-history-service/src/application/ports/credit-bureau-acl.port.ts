export interface CreditBureauRawResponse {
  providerName: string;
  providerMinScore: number;
  providerMaxScore: number;
  providerScore: number;
  rawData: Record<string, unknown>;
}

export const CREDIT_BUREAU_ACL_PORT = Symbol('CREDIT_BUREAU_ACL_PORT');

export interface CreditBureauAclPort {
  fetchByApplicantId(
    applicantId: string,
    correlationId: string,
  ): Promise<CreditBureauRawResponse[]>;
}
