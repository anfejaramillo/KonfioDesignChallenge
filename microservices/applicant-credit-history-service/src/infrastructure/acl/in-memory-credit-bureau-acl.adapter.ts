import { Injectable } from '@nestjs/common';
import {
  CreditBureauAclPort,
  CreditBureauRawResponse,
} from '../../application/ports/credit-bureau-acl.port';

@Injectable()
export class InMemoryCreditBureauAclAdapter implements CreditBureauAclPort {
  async fetchByApplicantId(
    applicantId: string,
    correlationId: string,
  ): Promise<CreditBureauRawResponse[]> {
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

