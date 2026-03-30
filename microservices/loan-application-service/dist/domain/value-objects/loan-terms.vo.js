"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanTerms = void 0;
class LoanTerms {
    constructor(term, timePeriodType) {
        this.term = term;
        this.timePeriodType = timePeriodType;
        if (term <= 0) {
            throw new Error('Loan term must be greater than zero');
        }
    }
}
exports.LoanTerms = LoanTerms;
