export class BureauReport {
  constructor(
    public readonly id: string,
    public readonly applicantId: string,
    public readonly scoreProviderName: string,
    public readonly rawData: Record<string, unknown>,
    public readonly fetchedAt: Date,
  ) {}
}