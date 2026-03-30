import { EVENT_BUS_PORT } from '../../application/ports/event-bus.port';
import { IDEMPOTENCY_STORE_PORT } from '../../application/ports/idempotency-store.port';
import { LOAN_APPLICATION_REPOSITORY } from '../../domain/repositories/loan-application.repository';
import { InMemoryIdempotencyStoreAdapter } from '../idempotency/in-memory-idempotency-store.adapter';
import { EventBridgeEventBusAdapter } from '../messaging/eventbridge-event-bus.adapter';
import { InMemoryLoanApplicationRepository } from '../persistence/in-memory-loan-application.repository';

export const providers = [
  {
    provide: LOAN_APPLICATION_REPOSITORY,
    useClass: InMemoryLoanApplicationRepository,
  },
  {
    provide: EVENT_BUS_PORT,
    useClass: EventBridgeEventBusAdapter,
  },
  {
    provide: IDEMPOTENCY_STORE_PORT,
    useClass: InMemoryIdempotencyStoreAdapter,
  },
];
