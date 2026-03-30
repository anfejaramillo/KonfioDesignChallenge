import { LoanApplicationCreatedEvent } from '../../domain/events/loan-application-created.event';

export const EVENT_BUS_PORT = Symbol('EVENT_BUS_PORT');

export interface EventBusPort {
  publishLoanApplicationCreated(event: LoanApplicationCreatedEvent): Promise<void>;
}
