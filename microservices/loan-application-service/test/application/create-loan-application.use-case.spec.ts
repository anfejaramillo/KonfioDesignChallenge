import { CreateLoanApplicationUseCase } from '../../src/application/use-cases/create-loan-application.use-case';
import { LoanApplicationDomainService } from '../../src/domain/services/loan-application-domain.service';
import { InMemoryLoanApplicationRepository } from '../../src/infrastructure/persistence/in-memory-loan-application.repository';
import { InMemoryIdempotencyStoreAdapter } from '../../src/infrastructure/idempotency/in-memory-idempotency-store.adapter';

class EventBusStub {
  public published = 0;

  /**
   * Tracks how many events would have been published.
   */
  async publishLoanApplicationCreated(_: unknown): Promise<void> {
    // Increment publication counter for assertions.
    this.published += 1;
  }
}

describe('CreateLoanApplicationUseCase', () => {
  it('returns same status for duplicated idempotency key', async () => {
    // Arrange an isolated in-memory environment.
    const repository = new InMemoryLoanApplicationRepository();
    const idempotencyStore = new InMemoryIdempotencyStoreAdapter();
    const eventBus = new EventBusStub();

    const useCase = new CreateLoanApplicationUseCase(
      repository,
      eventBus,
      idempotencyStore,
      new LoanApplicationDomainService(),
    );

    const command = {
      applicationId: 'app-101',
      applicantId: 'applicant-seed-1',
      loanProductId: 'loan-product-seed-1',
      requestedAmount: 12000,
      currencyCode: 'MXN',
      currencyName: 'Mexican Peso',
      idempotencyKey: 'idem-101',
      correlationId: 'corr-101',
    };

    // Act twice with the same idempotency key.
    const first = await useCase.execute(command);
    const second = await useCase.execute(command);

    // Assert same status and single event publication.
    expect(first.status).toBe('UNDER_REVIEW');
    expect(second.status).toBe('UNDER_REVIEW');
    expect(eventBus.published).toBe(1);
  });
});
