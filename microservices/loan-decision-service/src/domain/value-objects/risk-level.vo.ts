/**
 * Value object that captures probability of default and human-readable risk label.
 */
export class RiskLevel {
  constructor(
    public readonly probabilityOfDefaultUpperLimit: number,
    public readonly description: string,
  ) {
    if (probabilityOfDefaultUpperLimit < 0 || probabilityOfDefaultUpperLimit > 1) {
      throw new Error('Risk level probability must be between 0 and 1');
    }

    if (!description || description.trim().length === 0) {
      throw new Error('Risk level description is required');
    }
  }
}
