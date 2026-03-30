import { Injectable } from '@nestjs/common';
import { Applicant } from '../../domain/entities/applicant.entity';
import { LoanApplication } from '../../domain/entities/loan-application.entity';
import { LoanProduct } from '../../domain/entities/loan-product.entity';
import { Currency } from '../../domain/value-objects/currency.vo';
import { LoanTerms } from '../../domain/value-objects/loan-terms.vo';
import { LoanApplicationRepository } from '../../domain/repositories/loan-application.repository';

@Injectable()
export class InMemoryLoanApplicationRepository implements LoanApplicationRepository {
  private readonly applicants = new Map<string, Applicant>();
  private readonly products = new Map<string, LoanProduct>();
  private readonly applications = new Map<string, LoanApplication>();

  constructor() {
    const seedApplicant = new Applicant(
      'applicant-seed-1',
      'Juan Perez',
      '12345678',
      'SERVICES',
      4500,
      '+573001112233',
      'juan.perez@example.com',
    );

    const seedProduct = new LoanProduct(
      'loan-product-seed-1',
      'Capital de Trabajo',
      new LoanTerms(12, 'MONTHLY'),
      0.22,
      new Currency('MXN', 'Mexican Peso'),
      5000,
      300000,
    );

    this.applicants.set(seedApplicant.id, seedApplicant);
    this.products.set(seedProduct.id, seedProduct);
  }

  async saveApplicant(applicant: Applicant): Promise<void> {
    this.applicants.set(applicant.id, applicant);
  }

  async saveLoanProduct(product: LoanProduct): Promise<void> {
    this.products.set(product.id, product);
  }

  async saveLoanApplication(application: LoanApplication): Promise<void> {
    this.applications.set(application.id, application);
  }

  async findApplicantById(id: string): Promise<Applicant | null> {
    return this.applicants.get(id) ?? null;
  }

  async findLoanProductById(id: string): Promise<LoanProduct | null> {
    return this.products.get(id) ?? null;
  }

  async findApplicationById(id: string): Promise<LoanApplication | null> {
    return this.applications.get(id) ?? null;
  }

  async findApplications(filters?: {
    applicantId?: string;
    status?: LoanApplication['status'];
  }): Promise<LoanApplication[]> {
    return [...this.applications.values()].filter((application) => {
      const matchApplicant = !filters?.applicantId || application.applicantId === filters.applicantId;
      const matchStatus = !filters?.status || application.status === filters.status;
      return matchApplicant && matchStatus;
    });
  }

  async findApplicants(): Promise<Applicant[]> {
    return [...this.applicants.values()];
  }

  async findLoanProducts(): Promise<LoanProduct[]> {
    return [...this.products.values()];
  }
}
