import { Injectable, Logger } from '@nestjs/common';
import { EventBusPort } from '../../application/ports/event-bus.port';
import { CreditDecisionMadeEvent } from '../../domain/events/credit-decision-made.event';

@Injectable()
export class EventBridgeEventBusAdapter implements EventBusPort {
  private readonly logger = new Logger(EventBridgeEventBusAdapter.name);

  /**
   * Publishes integration event to the bus.
   * This implementation only logs payloads for local development.
   */
  async publishCreditDecisionMade(event: CreditDecisionMadeEvent): Promise<void> {
    this.logger.log(
      JSON.stringify({
        message: 'Publishing creditDecisionMade event',
        event,
      }),
    );
  }
}
