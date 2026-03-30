import { MakeCreditDecisionUseCase } from '../../src/application/use-cases/make-credit-decision.use-case';
import { GetCreditDecisionUseCase } from '../../src/application/use-cases/get-credit-decision.use-case';
import { GetRiskAssessmentUseCase } from '../../src/application/use-cases/get-risk-assessment.use-case';
import { ListCreditDecisionsUseCase } from '../../src/application/use-cases/list-credit-decisions.use-case';
import { LoanDecisionDomainService } from '../../src/domain/services/loan-decision-domain.service';
import { InMemoryLoanDecisionRepository } from '../../src/infrastructure/persistence/in-memory-loan-decision.repository';
import { InMemoryIdempotencyStoreAdapter } from '../../src/infrastructure/idempotency/in-memory-idempotency-store.adapter';

class EventBusStub {
  public published = 0;

  async publishCreditDecisionMade(_: unknown): Promise<void> {
    this.published += 1;
  }
}

class LoanApplicationContextStub {
  async findDecisionContextByApplicationId(): Promise<{
    requestedAmount: number;
    policy: {
      maxProbabilityOfDefaultForApproval: number;
      manualApprovalRequired: boolean;
      baseInterestRate: number;
    };
  }> {
    return {
      requestedAmount: 12000,
      policy: {
        maxProbabilityOfDefaultForApproval: 0.35,
        manualApprovalRequired: false,
        baseInterestRate: 0.2,
      },
    };
  }
}

describe('MakeCreditDecisionUseCase', () => {
  it('ignores duplicates using idempotency key', async () => {
    const repository = new InMemoryLoanDecisionRepository();
    const idempotencyStore = new InMemoryIdempotencyStoreAdapter();
    const eventBus = new EventBusStub();

    const useCase = new MakeCreditDecisionUseCase(
      repository,
      eventBus,
      idempotencyStore,
      new LoanApplicationContextStub(),
      new LoanDecisionDomainService(),
    );

    const command = {
      eventId: 'evt-risk-1',
      eventType: 'riskAssesmentCompleted' as const,
      aggregateId: 'application-1',
      decisionId: 'decision-1',
      applicationId: 'application-1',
      applicantId: 'applicant-1',
      riskAssessmentId: 'risk-1',
      riskLevel: {
        probabilityOfDefaultUpperLimit: 0.2,
        description: 'LOW',
      },
      riskAnalysisResult: { score: 720 },
      idempotencyKey: 'idem-decision-1',
      correlationId: 'corr-decision-1',
      occurredAt: '2026-03-30T12:00:00.000Z',
    };

    const first = await useCase.execute(command);
    const second = await useCase.execute(command);

    expect(first.status).toBe('PROCESSED');
    expect(first.decision).toBe('APPROVED');
    expect(second.status).toBe('DUPLICATE_IGNORED');
    expect(eventBus.published).toBe(1);
  });

  it('exposes persisted decision and assessment through query use cases', async () => {
    const repository = new InMemoryLoanDecisionRepository();
    const idempotencyStore = new InMemoryIdempotencyStoreAdapter();
    const eventBus = new EventBusStub();

    const useCase = new MakeCreditDecisionUseCase(
      repository,
      eventBus,
      idempotencyStore,
      new LoanApplicationContextStub(),
      new LoanDecisionDomainService(),
    );

    await useCase.execute({
      eventId: 'evt-risk-2',
      eventType: 'riskAssesmentCompleted',
      aggregateId: 'application-2',
      decisionId: 'decision-2',
      applicationId: 'application-2',
      applicantId: 'applicant-2',
      riskAssessmentId: 'risk-2',
      riskLevel: {
        probabilityOfDefaultUpperLimit: 0.18,
        description: 'LOW',
      },
      riskAnalysisResult: { score: 745 },
      idempotencyKey: 'idem-decision-2',
      correlationId: 'corr-decision-2',
      occurredAt: '2026-03-30T12:00:00.000Z',
    });

    const decision = await new GetCreditDecisionUseCase(repository).execute('application-2');
    const assessment = await new GetRiskAssessmentUseCase(repository).execute('risk-2');
    const decisions = await new ListCreditDecisionsUseCase(repository).execute({
      applicantId: 'applicant-2',
      decision: 'APPROVED',
    });

    expect(decision.applicationId).toBe('application-2');
    expect(assessment.riskAssessmentId).toBe('risk-2');
    expect(decisions).toHaveLength(1);
  });
});
