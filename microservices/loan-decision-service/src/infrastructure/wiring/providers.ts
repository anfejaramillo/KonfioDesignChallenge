import { LOAN_APPLICATION_CONTEXT_PORT } from '../../application/ports/loan-application-context.port';
import { EVENT_BUS_PORT } from '../../application/ports/event-bus.port';
import { IDEMPOTENCY_STORE_PORT } from '../../application/ports/idempotency-store.port';
import { LOAN_DECISION_REPOSITORY } from '../../domain/repositories/loan-decision.repository';
import { InMemoryLoanApplicationContextAdapter } from '../acl/in-memory-loan-application-context.adapter';
import { InMemoryIdempotencyStoreAdapter } from '../idempotency/in-memory-idempotency-store.adapter';
import { EventBridgeEventBusAdapter } from '../messaging/eventbridge-event-bus.adapter';
import { InMemoryLoanDecisionRepository } from '../persistence/in-memory-loan-decision.repository';

/**
 * Infrastructure bindings for application and domain ports.
 */
export const providers = [
  {
    provide: LOAN_DECISION_REPOSITORY,
    useClass: InMemoryLoanDecisionRepository,
  },
  {
    provide: EVENT_BUS_PORT,
    useClass: EventBridgeEventBusAdapter,
  },
  {
    provide: IDEMPOTENCY_STORE_PORT,
    useClass: InMemoryIdempotencyStoreAdapter,
  },
  {
    provide: LOAN_APPLICATION_CONTEXT_PORT,
    useClass: InMemoryLoanApplicationContextAdapter,
  },
];
