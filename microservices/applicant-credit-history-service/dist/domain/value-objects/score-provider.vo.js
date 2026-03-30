"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreProvider = void 0;
class ScoreProvider {
    constructor(name, minScore, maxScore) {
        this.name = name;
        this.minScore = minScore;
        this.maxScore = maxScore;
        if (!name) {
            throw new Error('Score provider name is required');
        }
        if (maxScore <= minScore) {
            throw new Error('Score provider range is invalid');
        }
    }
    normalizeToKonfioScale(score) {
        if (score < this.minScore || score > this.maxScore) {
            throw new Error('Provider score is outside supported range');
        }
        const normalized = ((score - this.minScore) / (this.maxScore - this.minScore)) * 1000;
        return Math.round(normalized);
    }
}
exports.ScoreProvider = ScoreProvider;
