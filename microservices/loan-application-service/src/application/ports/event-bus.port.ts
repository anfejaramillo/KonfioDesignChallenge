import { LoanApplicationCreatedEvent } from '../../domain/events/loan-application-created.event';

export const EVENT_BUS_PORT = Symbol('EVENT_BUS_PORT');

/**
 * Application port for publishing integration events.
 */
export interface EventBusPort {
  /**
   * Publishes a `loanApplicationCreated` event to the configured transport.
   */
  publishLoanApplicationCreated(event: LoanApplicationCreatedEvent): Promise<void>;
}
