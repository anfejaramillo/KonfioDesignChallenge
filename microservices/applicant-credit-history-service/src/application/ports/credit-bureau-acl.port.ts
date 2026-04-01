/**
 * Raw response contract returned by an external credit bureau provider.
 */
export interface CreditBureauRawResponse {
  /** Provider name used in domain projections. */
  providerName: string;
  /** Minimum score in provider-native range. */
  providerMinScore: number;
  /** Maximum score in provider-native range. */
  providerMaxScore: number;
  /** Score value in provider-native range. */
  providerScore: number;
  /** Original payload returned by the provider. */
  rawData: Record<string, unknown>;
}

/** Dependency-injection token for credit bureau ACL implementations. */
export const CREDIT_BUREAU_ACL_PORT = Symbol('CREDIT_BUREAU_ACL_PORT');

/**
 * Application port to fetch bureau data through an anti-corruption layer.
 */
export interface CreditBureauAclPort {
  /**
   * Fetches bureau responses for a single applicant while propagating trace context.
   */
  fetchByApplicantId(
    applicantId: string,
    correlationId: string,
  ): Promise<CreditBureauRawResponse[]>;
}