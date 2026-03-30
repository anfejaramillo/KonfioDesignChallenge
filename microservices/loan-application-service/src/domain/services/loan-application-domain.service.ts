import { Injectable } from '@nestjs/common';
import { LoanApplication } from '../entities/loan-application.entity';
import { LoanProduct } from '../entities/loan-product.entity';

@Injectable()
export class LoanApplicationDomainService {
  validateCreation(application: LoanApplication, product: LoanProduct): void {
    if (!product.allowsAmount(application.requestedAmount)) {
      throw new Error('Requested amount is outside product limits');
    }

    if (application.currency.code !== product.currency.code) {
      throw new Error('Currency mismatch between application and product');
    }
  }
}
