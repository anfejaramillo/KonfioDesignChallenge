export class CreditScore {
  constructor(
    public readonly id: string,
    public readonly applicantId: string,
    public readonly scoreProviderName: string,
    public readonly score: number,
    public readonly updatedAt: Date,
  ) {}
}