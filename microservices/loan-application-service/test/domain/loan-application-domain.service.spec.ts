import { LoanApplicationDomainService } from '../../src/domain/services/loan-application-domain.service';
import { LoanApplication } from '../../src/domain/entities/loan-application.entity';
import { LoanProduct } from '../../src/domain/entities/loan-product.entity';
import { Currency } from '../../src/domain/value-objects/currency.vo';
import { LoanTerms } from '../../src/domain/value-objects/loan-terms.vo';

describe('LoanApplicationDomainService', () => {
  // Shared domain service and product fixture for all test cases.
  const service = new LoanApplicationDomainService();
  const product = new LoanProduct(
    'product-1',
    'Capital',
    new LoanTerms(12, 'MONTHLY'),
    0.2,
    new Currency('MXN', 'Mexican Peso'),
    5000,
    50000,
  );

  it('accepts a valid amount and currency', () => {
    // Arrange application that matches product constraints.
    const application = new LoanApplication(
      'app-1',
      'applicant-1',
      'product-1',
      10000,
      new Currency('MXN', 'Mexican Peso'),
      'UNDER_REVIEW',
      new Date(),
    );

    // Act + Assert: validation should not throw.
    expect(() => service.validateCreation(application, product)).not.toThrow();
  });

  it('rejects an amount outside product limits', () => {
    // Arrange application with amount below product minimum.
    const application = new LoanApplication(
      'app-2',
      'applicant-1',
      'product-1',
      1000,
      new Currency('MXN', 'Mexican Peso'),
      'UNDER_REVIEW',
      new Date(),
    );

    // Act + Assert: validation should fail on amount rules.
    expect(() => service.validateCreation(application, product)).toThrow(
      'Requested amount is outside product limits',
    );
  });

  it('rejects currency mismatch', () => {
    // Arrange application with different currency than product.
    const application = new LoanApplication(
      'app-3',
      'applicant-1',
      'product-1',
      10000,
      new Currency('COP', 'Colombian Peso'),
      'UNDER_REVIEW',
      new Date(),
    );

    // Act + Assert: validation should fail on currency mismatch.
    expect(() => service.validateCreation(application, product)).toThrow(
      'Currency mismatch between application and product',
    );
  });
});
