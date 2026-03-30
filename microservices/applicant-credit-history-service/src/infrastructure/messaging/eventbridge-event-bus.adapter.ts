import { Injectable, Logger } from '@nestjs/common';
import { EventBusPort } from '../../application/ports/event-bus.port';
import { BureauDataFetchedEvent } from '../../domain/events/bureau-data-fetched.event';

@Injectable()
export class EventBridgeEventBusAdapter implements EventBusPort {
  private readonly logger = new Logger(EventBridgeEventBusAdapter.name);

  async publishBureauDataFetched(event: BureauDataFetchedEvent): Promise<void> {
    this.logger.log(
      JSON.stringify({
        message: 'Publishing bureauDataFetched event',
        event,
      }),
    );
  }
}