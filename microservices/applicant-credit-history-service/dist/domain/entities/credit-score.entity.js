"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditScore = void 0;
class CreditScore {
    constructor(id, applicantId, scoreProviderName, score, updatedAt) {
        this.id = id;
        this.applicantId = applicantId;
        this.scoreProviderName = scoreProviderName;
        this.score = score;
        this.updatedAt = updatedAt;
    }
}
exports.CreditScore = CreditScore;
