import { ApplicantCreditHistoryDomainService } from '../../src/domain/services/applicant-credit-history-domain.service';

describe('ApplicantCreditHistoryDomainService', () => {
  const service = new ApplicantCreditHistoryDomainService();

  it('normalizes provider score into Konfio scale', () => {
    const score = service.createNormalizedCreditScore('applicant-1', {
      providerName: 'BuroDeCredito',
      providerMinScore: 300,
      providerMaxScore: 850,
      providerScore: 575,
      rawData: {},
    });

    expect(score.score).toBe(500);
  });

  it('throws when provider score is out of range', () => {
    expect(() =>
      service.createNormalizedCreditScore('applicant-1', {
        providerName: 'BuroDeCredito',
        providerMinScore: 300,
        providerMaxScore: 850,
        providerScore: 900,
        rawData: {},
      }),
    ).toThrow('Provider score is outside supported range');
  });
});
