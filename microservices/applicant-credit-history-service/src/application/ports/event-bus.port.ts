import { BureauDataFetchedEvent } from '../../domain/events/bureau-data-fetched.event';

export const EVENT_BUS_PORT = Symbol('EVENT_BUS_PORT');

export interface EventBusPort {
  publishBureauDataFetched(event: BureauDataFetchedEvent): Promise<void>;
}