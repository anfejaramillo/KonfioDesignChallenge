import { Applicant } from '../entities/applicant.entity';
import { LoanApplication } from '../entities/loan-application.entity';
import { LoanProduct } from '../entities/loan-product.entity';
import { LoanApplicationStatus } from '../entities/loan-application.entity';

export const LOAN_APPLICATION_REPOSITORY = Symbol('LOAN_APPLICATION_REPOSITORY');

/**
 * Repository contract for loan application bounded context persistence.
 */
export interface LoanApplicationRepository {
  /**
   * Saves an applicant entity.
   */
  saveApplicant(applicant: Applicant): Promise<void>;
  /**
   * Saves a loan product entity.
   */
  saveLoanProduct(product: LoanProduct): Promise<void>;
  /**
   * Saves a loan application aggregate.
   */
  saveLoanApplication(application: LoanApplication): Promise<void>;
  /**
   * Finds an applicant by id.
   */
  findApplicantById(id: string): Promise<Applicant | null>;
  /**
   * Finds a loan product by id.
   */
  findLoanProductById(id: string): Promise<LoanProduct | null>;
  /**
   * Finds a loan application by id.
   */
  findApplicationById(id: string): Promise<LoanApplication | null>;
  /**
   * Lists loan applications by optional filters.
   */
  findApplications(filters?: { applicantId?: string; status?: LoanApplicationStatus }): Promise<LoanApplication[]>;
  /**
   * Lists all applicants.
   */
  findApplicants(): Promise<Applicant[]>;
  /**
   * Lists all loan products.
   */
  findLoanProducts(): Promise<LoanProduct[]>;
}
