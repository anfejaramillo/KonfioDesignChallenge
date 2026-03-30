export interface RegisterApplicantHttpDto {
  id: string;
  name: string;
  dni: string;
  incomeOrigin: string;
  monthlyIncome: number;
  mobile: string;
  email: string;
  idempotencyKey: string;
}
