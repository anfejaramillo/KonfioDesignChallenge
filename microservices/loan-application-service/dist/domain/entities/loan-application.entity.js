"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanApplication = void 0;
class LoanApplication {
    constructor(id, applicantId, loanProductId, requestedAmount, currency, status, requestedAt) {
        this.id = id;
        this.applicantId = applicantId;
        this.loanProductId = loanProductId;
        this.requestedAmount = requestedAmount;
        this.currency = currency;
        this.status = status;
        this.requestedAt = requestedAt;
    }
    approve() {
        this.status = 'APPROVED';
    }
    reject() {
        this.status = 'REJECTED';
    }
}
exports.LoanApplication = LoanApplication;
