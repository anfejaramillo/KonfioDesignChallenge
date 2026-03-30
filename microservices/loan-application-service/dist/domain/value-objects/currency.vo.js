"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = void 0;
class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
        if (!code || code.length < 3) {
            throw new Error('Currency code is invalid');
        }
    }
}
exports.Currency = Currency;
