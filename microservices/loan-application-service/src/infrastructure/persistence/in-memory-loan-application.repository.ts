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

  /**
   * Seeds in-memory storage with a default applicant and product for local testing.
   */
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

  /**
   * Persists an applicant by id.
   */
  async saveApplicant(applicant: Applicant): Promise<void> {
    // Upsert applicant into in-memory map.
    this.applicants.set(applicant.id, applicant);
  }

  /**
   * Persists a loan product by id.
   */
  async saveLoanProduct(product: LoanProduct): Promise<void> {
    // Upsert product into in-memory map.
    this.products.set(product.id, product);
  }

  /**
   * Persists a loan application by id.
   */
  async saveLoanApplication(application: LoanApplication): Promise<void> {
    // Upsert application into in-memory map.
    this.applications.set(application.id, application);
  }

  /**
   * Retrieves an applicant by id.
   */
  async findApplicantById(id: string): Promise<Applicant | null> {
    // Return null when applicant is absent.
    return this.applicants.get(id) ?? null;
  }

  /**
   * Retrieves a loan product by id.
   */
  async findLoanProductById(id: string): Promise<LoanProduct | null> {
    // Return null when product is absent.
    return this.products.get(id) ?? null;
  }

  /**
   * Retrieves a loan application by id.
   */
  async findApplicationById(id: string): Promise<LoanApplication | null> {
    // Return null when application is absent.
    return this.applications.get(id) ?? null;
  }

  /**
   * Lists applications matching optional applicant and status filters.
   */
  async findApplications(filters?: {
    applicantId?: string;
    status?: LoanApplication['status'];
  }): Promise<LoanApplication[]> {
    // Filter current in-memory applications set.
    return [...this.applications.values()].filter((application) => {
      const matchApplicant = !filters?.applicantId || application.applicantId === filters.applicantId;
      const matchStatus = !filters?.status || application.status === filters.status;
      return matchApplicant && matchStatus;
    });
  }

  /**
   * Lists all persisted applicants.
   */
  async findApplicants(): Promise<Applicant[]> {
    // Return a snapshot array from the map values.
    return [...this.applicants.values()];
  }

  /**
   * Lists all persisted loan products.
   */
  async findLoanProducts(): Promise<LoanProduct[]> {
    // Return a snapshot array from the map values.
    return [...this.products.values()];
  }
}
