import { FetchApplicantCreditHistoryUseCase } from '../../src/application/use-cases/fetch-applicant-credit-history.use-case';
import { ApplicantCreditHistoryDomainService } from '../../src/domain/services/applicant-credit-history-domain.service';
import { InMemoryApplicantCreditHistoryRepository } from '../../src/infrastructure/persistence/in-memory-applicant-credit-history.repository';
import { InMemoryIdempotencyStoreAdapter } from '../../src/infrastructure/idempotency/in-memory-idempotency-store.adapter';
import { GetApplicantBureauReportsUseCase } from '../../src/application/use-cases/get-applicant-bureau-reports.use-case';
import { GetLatestCreditScoresUseCase } from '../../src/application/use-cases/get-latest-credit-scores.use-case';

class EventBusStub {
  public published = 0;

  async publishBureauDataFetched(_: unknown): Promise<void> {
    this.published += 1;
  }
}

class CreditBureauAclStub {
  async fetchByApplicantId(): Promise<
    {
      providerName: string;
      providerMinScore: number;
      providerMaxScore: number;
      providerScore: number;
      rawData: Record<string, unknown>;
    }[]
  > {
    return [
      {
        providerName: 'BuroDeCredito',
        providerMinScore: 300,
        providerMaxScore: 850,
        providerScore: 700,
        rawData: { riskFlag: false },
      },
      {
        providerName: 'CirculoDeCredito',
        providerMinScore: 400,
        providerMaxScore: 950,
        providerScore: 790,
        rawData: { riskFlag: true },
      },
    ];
  }
}

describe('FetchApplicantCreditHistoryUseCase', () => {
  it('returns duplicate status for repeated idempotency key', async () => {
    const repository = new InMemoryApplicantCreditHistoryRepository();
    const idempotencyStore = new InMemoryIdempotencyStoreAdapter();
    const eventBus = new EventBusStub();

    const useCase = new FetchApplicantCreditHistoryUseCase(
      repository,
      eventBus,
      idempotencyStore,
      new CreditBureauAclStub(),
      new ApplicantCreditHistoryDomainService(),
    );

    const command = {
      eventId: 'evt-1',
      eventType: 'loanApplicationCreated' as const,
      aggregateId: 'application-1',
      applicationId: 'application-1',
      applicantId: 'applicant-1',
      idempotencyKey: 'idem-history-1',
      correlationId: 'corr-history-1',
      occurredAt: '2026-03-30T00:00:00.000Z',
    };

    const first = await useCase.execute(command);
    const second = await useCase.execute(command);

    expect(first.status).toBe('PROCESSED');
    expect(first.reportsStored).toBe(2);
    expect(first.scoresUpdated).toBe(2);
    expect(second.status).toBe('DUPLICATE_IGNORED');
    expect(eventBus.published).toBe(1);
  });

  it('exposes persisted reports and latest scores through query use cases', async () => {
    const repository = new InMemoryApplicantCreditHistoryRepository();
    const idempotencyStore = new InMemoryIdempotencyStoreAdapter();
    const eventBus = new EventBusStub();

    const useCase = new FetchApplicantCreditHistoryUseCase(
      repository,
      eventBus,
      idempotencyStore,
      new CreditBureauAclStub(),
      new ApplicantCreditHistoryDomainService(),
    );

    await useCase.execute({
      eventId: 'evt-2',
      eventType: 'loanApplicationCreated',
      aggregateId: 'application-2',
      applicationId: 'application-2',
      applicantId: 'applicant-2',
      idempotencyKey: 'idem-history-2',
      correlationId: 'corr-history-2',
      occurredAt: '2026-03-30T00:00:00.000Z',
    });

    const reportsResult = await new GetApplicantBureauReportsUseCase(repository).execute('applicant-2');
    const latestScores = await new GetLatestCreditScoresUseCase(repository).execute('applicant-2');

    expect(reportsResult.reports).toHaveLength(2);
    expect(latestScores.scores).toHaveLength(2);
    expect(latestScores.scores.map((score) => score.providerName).sort()).toEqual([
      'BuroDeCredito',
      'CirculoDeCredito',
    ]);
  });
});
