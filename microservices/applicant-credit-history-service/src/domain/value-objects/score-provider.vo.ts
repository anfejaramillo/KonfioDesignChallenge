export class ScoreProvider {
  constructor(
    public readonly name: string,
    public readonly minScore: number,
    public readonly maxScore: number,
  ) {
    if (!name) {
      throw new Error('Score provider name is required');
    }

    if (maxScore <= minScore) {
      throw new Error('Score provider range is invalid');
    }
  }

  normalizeToKonfioScale(score: number): number {
    if (score < this.minScore || score > this.maxScore) {
      throw new Error('Provider score is outside supported range');
    }

    const normalized = ((score - this.minScore) / (this.maxScore - this.minScore)) * 1000;
    return Math.round(normalized);
  }
}