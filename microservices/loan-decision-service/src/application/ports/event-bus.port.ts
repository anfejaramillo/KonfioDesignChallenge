import { CreditDecisionMadeEvent } from '../../domain/events/credit-decision-made.event';

export const EVENT_BUS_PORT = Symbol('EVENT_BUS_PORT');

/**
 * Contract for publishing integration events.
 */
export interface EventBusPort {
  /**
   * Publishes a `creditDecisionMade` event after the decision is persisted.
   */
  publishCreditDecisionMade(event: CreditDecisionMadeEvent): Promise<void>;
}
