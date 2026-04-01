/**
 * Input contract for registering an applicant profile.
 */
export interface RegisterApplicantCommand {
  id: string;
  name: string;
  dni: string;
  incomeOrigin: string;
  monthlyIncome: number;
  mobile: string;
  email: string;
  idempotencyKey: string;
}
