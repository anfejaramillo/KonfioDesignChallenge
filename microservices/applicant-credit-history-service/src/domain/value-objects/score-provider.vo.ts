/**
 * Value object that encapsulates provider score range validation
 * and normalization to Konfio scale.
 */
export class ScoreProvider {
  constructor(
    /** Provider source name. */
    public readonly name: string,
    /** Minimum supported score in provider scale. */
    public readonly minScore: number,
    /** Maximum supported score in provider scale. */
    public readonly maxScore: number,
  ) {
    if (!name) {
      throw new Error('Score provider name is required');
    }

    if (maxScore <= minScore) {
      throw new Error('Score provider range is invalid');
    }
  }

  /**
   * Normalizes provider score to a 0-1000 Konfio scale.
   */
  normalizeToKonfioScale(score: number): number {
    if (score < this.minScore || score > this.maxScore) {
      throw new Error('Provider score is outside supported range');
    }

    // Applies linear interpolation into Konfio 0..1000 range.
    const normalized = ((score - this.minScore) / (this.maxScore - this.minScore)) * 1000;
    return Math.round(normalized);
  }
}