import { Injectable, Logger } from '@nestjs/common';
import { EventBusPort } from '../../application/ports/event-bus.port';
import { LoanApplicationCreatedEvent } from '../../domain/events/loan-application-created.event';

@Injectable()
export class EventBridgeEventBusAdapter implements EventBusPort {
  private readonly logger = new Logger(EventBridgeEventBusAdapter.name);

  async publishLoanApplicationCreated(event: LoanApplicationCreatedEvent): Promise<void> {
    this.logger.log(JSON.stringify({
      message: 'Publishing loanApplicationCreated event',
      event,
    }));
  }
}
