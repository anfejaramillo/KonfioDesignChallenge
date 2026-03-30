"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Applicant = void 0;
class Applicant {
    constructor(id, name, dni, incomeOrigin, monthlyIncome, mobile, email) {
        this.id = id;
        this.name = name;
        this.dni = dni;
        this.incomeOrigin = incomeOrigin;
        this.monthlyIncome = monthlyIncome;
        this.mobile = mobile;
        this.email = email;
    }
}
exports.Applicant = Applicant;
