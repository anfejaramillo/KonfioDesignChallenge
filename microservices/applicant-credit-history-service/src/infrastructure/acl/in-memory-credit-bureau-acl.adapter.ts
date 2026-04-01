import { Injectable } from '@nestjs/common';
import {
  CreditBureauAclPort,
  CreditBureauRawResponse,
} from '../../application/ports/credit-bureau-acl.port';

/**
 * In-memory ACL adapter that returns deterministic bureau responses.
 * Useful for local development and tests without external dependencies.
 */
@Injectable()
export class InMemoryCreditBureauAclAdapter implements CreditBureauAclPort {
  /**
   * Returns static provider payloads while preserving method contract.
   */
  async fetchByApplicantId(
    applicantId: string,
    correlationId: string,
  ): Promise<CreditBureauRawResponse[]> {
    // Parameters are part of the port contract and intentionally unused in stub.
    void applicantId;
    void correlationId;

    return [
      {
        providerName: 'BuroDeCredito',
        providerMinScore: 300,
        providerMaxScore: 850,
        providerScore: 680,
        rawData: {
          providerReference: 'stub-buro-reference',
          status: 'OK',
          debtRatio: 0.32,
        },
      },
      {
        providerName: 'CirculoDeCredito',
        providerMinScore: 400,
        providerMaxScore: 950,
        providerScore: 790,
        rawData: {
          providerReference: 'stub-circulo-reference',
          status: 'OK',
          debtRatio: 0.28,
        },
      },
    ];
  }
}