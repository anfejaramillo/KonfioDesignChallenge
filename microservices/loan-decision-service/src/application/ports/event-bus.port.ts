import { CreditDecisionMadeEvent } from '../../domain/events/credit-decision-made.event';

export const EVENT_BUS_PORT = Symbol('EVENT_BUS_PORT');

export interface EventBusPort {
  publishCreditDecisionMade(event: CreditDecisionMadeEvent): Promise<void>;
}