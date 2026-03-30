import { Inject, Injectable } from '@nestjs/common';
import { LoanProduct } from '../../domain/entities/loan-product.entity';
import {
  LOAN_APPLICATION_REPOSITORY,
  LoanApplicationRepository,
} from '../../domain/repositories/loan-application.repository';
import { Currency } from '../../domain/value-objects/currency.vo';
import { LoanTerms } from '../../domain/value-objects/loan-terms.vo';
import {
  IDEMPOTENCY_STORE_PORT,
  IdempotencyStorePort,
} from '../ports/idempotency-store.port';
import { RegisterLoanProductCommand } from '../commands/register-loan-product.command';
import { RegisterLoanProductResult } from '../dto/register-loan-product.result';

@Injectable()
export class RegisterLoanProductUseCase {
  constructor(
    @Inject(LOAN_APPLICATION_REPOSITORY)
    private readonly repository: LoanApplicationRepository,
    @Inject(IDEMPOTENCY_STORE_PORT)
    private readonly idempotencyStore: IdempotencyStorePort,
  ) {}

  async execute(command: RegisterLoanProductCommand): Promise<RegisterLoanProductResult> {
    const alreadyProcessed = await this.idempotencyStore.exists(command.idempotencyKey);
    if (alreadyProcessed) {
      return { loanProductId: command.id };
    }

    const product = new LoanProduct(
      command.id,
      command.name,
      new LoanTerms(command.term, command.timePeriodType),
      command.interestRate,
      new Currency(command.currencyCode, command.currencyName),
      command.minAmount,
      command.maxAmount,
    );

    await this.repository.saveLoanProduct(product);
    await this.idempotencyStore.save(command.idempotencyKey, 60 * 60 * 24 * 7);

    return { loanProductId: product.id };
  }
}
