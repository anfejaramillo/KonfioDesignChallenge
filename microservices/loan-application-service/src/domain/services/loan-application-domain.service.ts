import { Injectable } from '@nestjs/common';
import { LoanApplication } from '../entities/loan-application.entity';
import { LoanProduct } from '../entities/loan-product.entity';

@Injectable()
export class LoanApplicationDomainService {
  /**
   * Validates business rules before creating a loan application.
   */
  validateCreation(application: LoanApplication, product: LoanProduct): void {
    // Ensure requested amount is allowed by the selected product.
    if (!product.allowsAmount(application.requestedAmount)) {
      throw new Error('Requested amount is outside product limits');
    }

    // Ensure both aggregates operate on the same currency.
    if (application.currency.code !== product.currency.code) {
      throw new Error('Currency mismatch between application and product');
    }
  }
}
