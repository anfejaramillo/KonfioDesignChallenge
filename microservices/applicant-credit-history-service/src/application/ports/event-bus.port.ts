import { BureauDataFetchedEvent } from '../../domain/events/bureau-data-fetched.event';

/** Dependency-injection token for event bus adapters. */
export const EVENT_BUS_PORT = Symbol('EVENT_BUS_PORT');

/**
 * Application port used to publish domain/integration events.
 */
export interface EventBusPort {
  /** Publishes the bureau-data-fetched event to the integration bus. */
  publishBureauDataFetched(event: BureauDataFetchedEvent): Promise<void>;
}