import { CREDIT_BUREAU_ACL_PORT } from '../../application/ports/credit-bureau-acl.port';
import { EVENT_BUS_PORT } from '../../application/ports/event-bus.port';
import { IDEMPOTENCY_STORE_PORT } from '../../application/ports/idempotency-store.port';
import { APPLICANT_CREDIT_HISTORY_REPOSITORY } from '../../domain/repositories/applicant-credit-history.repository';
import { InMemoryCreditBureauAclAdapter } from '../acl/in-memory-credit-bureau-acl.adapter';
import { InMemoryIdempotencyStoreAdapter } from '../idempotency/in-memory-idempotency-store.adapter';
import { EventBridgeEventBusAdapter } from '../messaging/eventbridge-event-bus.adapter';
import { InMemoryApplicantCreditHistoryRepository } from '../persistence/in-memory-applicant-credit-history.repository';

/**
 * Default provider bindings for local execution.
 */
export const providers = [
  {
    provide: APPLICANT_CREDIT_HISTORY_REPOSITORY,
    useClass: InMemoryApplicantCreditHistoryRepository,
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
    provide: CREDIT_BUREAU_ACL_PORT,
    useClass: InMemoryCreditBureauAclAdapter,
  },
];