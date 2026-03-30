export class Applicant {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly dni: string,
    public readonly incomeOrigin: string,
    public readonly monthlyIncome: number,
    public readonly mobile: string,
    public readonly email: string,
  ) {}
}
