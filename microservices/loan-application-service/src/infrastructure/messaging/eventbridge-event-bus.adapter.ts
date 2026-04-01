import { Injectable, Logger } from '@nestjs/common';
import { EventBusPort } from '../../application/ports/event-bus.port';
import { LoanApplicationCreatedEvent } from '../../domain/events/loan-application-created.event';

@Injectable()
export class EventBridgeEventBusAdapter implements EventBusPort {
  private readonly logger = new Logger(EventBridgeEventBusAdapter.name);

  /**
   * Publishes a loan application created event to the messaging infrastructure.
   */
  async publishLoanApplicationCreated(event: LoanApplicationCreatedEvent): Promise<void> {
    // Log payload as placeholder for real EventBridge integration.
    this.logger.log(JSON.stringify({
      message: 'Publishing loanApplicationCreated event',
      event,
    }));
  }
}
