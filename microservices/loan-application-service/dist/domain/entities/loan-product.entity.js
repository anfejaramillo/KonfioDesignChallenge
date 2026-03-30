"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanProduct = void 0;
class LoanProduct {
    constructor(id, name, term, interestRate, currency, minAmount, maxAmount) {
        this.id = id;
        this.name = name;
        this.term = term;
        this.interestRate = interestRate;
        this.currency = currency;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
    }
    allowsAmount(amount) {
        return amount >= this.minAmount && amount <= this.maxAmount;
    }
}
exports.LoanProduct = LoanProduct;
