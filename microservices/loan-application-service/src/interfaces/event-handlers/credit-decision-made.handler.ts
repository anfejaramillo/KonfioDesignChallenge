import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreditDecisionMadeEvent } from '../../domain/events/credit-decision-made.event';
import { ProcessCreditDecisionUseCase } from '../../application/use-cases/process-credit-decision.use-case';

@Injectable()
export class CreditDecisionMadeHandler {
  private readonly logger = new Logger(CreditDecisionMadeHandler.name);

  constructor(private readonly processCreditDecisionUseCase: ProcessCreditDecisionUseCase) {}

  async handle(event: CreditDecisionMadeEvent): Promise<void> {
    try {
      await this.processCreditDecisionUseCase.execute(event);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(error.message);
        return;
      }

      throw error;
    }
  }
}
