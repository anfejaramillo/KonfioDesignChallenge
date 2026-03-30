import { Applicant } from '../entities/applicant.entity';
import { LoanApplication } from '../entities/loan-application.entity';
import { LoanProduct } from '../entities/loan-product.entity';
import { LoanApplicationStatus } from '../entities/loan-application.entity';

export const LOAN_APPLICATION_REPOSITORY = Symbol('LOAN_APPLICATION_REPOSITORY');

export interface LoanApplicationRepository {
  saveApplicant(applicant: Applicant): Promise<void>;
  saveLoanProduct(product: LoanProduct): Promise<void>;
  saveLoanApplication(application: LoanApplication): Promise<void>;
  findApplicantById(id: string): Promise<Applicant | null>;
  findLoanProductById(id: string): Promise<LoanProduct | null>;
  findApplicationById(id: string): Promise<LoanApplication | null>;
  findApplications(filters?: { applicantId?: string; status?: LoanApplicationStatus }): Promise<LoanApplication[]>;
  findApplicants(): Promise<Applicant[]>;
  findLoanProducts(): Promise<LoanProduct[]>;
}
