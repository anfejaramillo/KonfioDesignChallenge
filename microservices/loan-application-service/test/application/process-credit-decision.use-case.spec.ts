import { ProcessCreditDecisionUseCase } from '../../src/application/use-cases/process-credit-decision.use-case';
import { InMemoryIdempotencyStoreAdapter } from '../../src/infrastructure/idempotency/in-memory-idempotency-store.adapter';
import { InMemoryLoanApplicationRepository } from '../../src/infrastructure/persistence/in-memory-loan-application.repository';
import { CreateLoanApplicationUseCase } from '../../src/application/use-cases/create-loan-application.use-case';
import { LoanApplicationDomainService } from '../../src/domain/services/loan-application-domain.service';

class EventBusStub {
  /**
   * No-op publisher used by tests that do not assert event side effects.
   */
  async publishLoanApplicationCreated(_: unknown): Promise<void> {}
}

describe('ProcessCreditDecisionUseCase', () => {
  it('updates loan application status to APPROVED', async () => {
    // Arrange baseline repository state and create an application first.
    const repository = new InMemoryLoanApplicationRepository();
    const idempotencyStore = new InMemoryIdempotencyStoreAdapter();

    const createUseCase = new CreateLoanApplicationUseCase(
      repository,
      new EventBusStub(),
      idempotencyStore,
      new LoanApplicationDomainService(),
    );

    await createUseCase.execute({
      applicationId: 'app-201',
      applicantId: 'applicant-seed-1',
      loanProductId: 'loan-product-seed-1',
      requestedAmount: 10000,
      currencyCode: 'MXN',
      currencyName: 'Mexican Peso',
      idempotencyKey: 'idem-create-201',
      correlationId: 'corr-create-201',
    });

    const useCase = new ProcessCreditDecisionUseCase(repository, idempotencyStore);

    // Act by processing an approval decision event.
    const result = await useCase.execute({
      eventId: 'evt-201',
      eventType: 'creditDecisionMade',
      aggregateId: 'app-201',
      idempotencyKey: 'idem-event-201',
      correlationId: 'corr-event-201',
      applicationId: 'app-201',
      applicantId: 'applicant-seed-1',
      decision: 'APPROVED',
      approvedAmount: 9000,
      interestRate: 0.2,
      occurredAt: new Date().toISOString(),
    });

    // Assert resulting aggregate status.
    expect(result.status).toBe('APPROVED');
  });

  it('is idempotent for duplicate events', async () => {
    // Arrange baseline repository state and create an application first.
    const repository = new InMemoryLoanApplicationRepository();
    const idempotencyStore = new InMemoryIdempotencyStoreAdapter();

    const createUseCase = new CreateLoanApplicationUseCase(
      repository,
      new EventBusStub(),
      idempotencyStore,
      new LoanApplicationDomainService(),
    );

    await createUseCase.execute({
      applicationId: 'app-202',
      applicantId: 'applicant-seed-1',
      loanProductId: 'loan-product-seed-1',
      requestedAmount: 10000,
      currencyCode: 'MXN',
      currencyName: 'Mexican Peso',
      idempotencyKey: 'idem-create-202',
      correlationId: 'corr-create-202',
    });

    const useCase = new ProcessCreditDecisionUseCase(repository, idempotencyStore);
    const command = {
      eventId: 'evt-202',
      eventType: 'creditDecisionMade' as const,
      aggregateId: 'app-202',
      idempotencyKey: 'idem-event-202',
      correlationId: 'corr-event-202',
      applicationId: 'app-202',
      applicantId: 'applicant-seed-1',
      decision: 'REJECTED' as const,
      occurredAt: new Date().toISOString(),
    };

    // Act twice using the same event idempotency key.
    await useCase.execute(command);
    const duplicateResult = await useCase.execute(command);

    // Assert duplicate processing preserves final state.
    expect(duplicateResult.status).toBe('REJECTED');
  });
});
