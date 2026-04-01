import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreditDecisionMadeEvent } from '../../domain/events/credit-decision-made.event';
import { ProcessCreditDecisionUseCase } from '../../application/use-cases/process-credit-decision.use-case';

@Injectable()
export class CreditDecisionMadeHandler {
  private readonly logger = new Logger(CreditDecisionMadeHandler.name);

  /**
   * Builds the event handler with the decision processing use case.
   */
  constructor(private readonly processCreditDecisionUseCase: ProcessCreditDecisionUseCase) {}

  /**
   * Handles `creditDecisionMade` events with graceful behavior for missing applications.
   */
  async handle(event: CreditDecisionMadeEvent): Promise<void> {
    try {
      // Delegate event handling to the application layer.
      await this.processCreditDecisionUseCase.execute(event);
    } catch (error) {
      // Ignore not found events to keep consumer resilient to ordering issues.
      if (error instanceof NotFoundException) {
        this.logger.warn(error.message);
        return;
      }

      // Propagate unexpected errors for retry/dead-letter workflows.
      throw error;
    }
  }
}
