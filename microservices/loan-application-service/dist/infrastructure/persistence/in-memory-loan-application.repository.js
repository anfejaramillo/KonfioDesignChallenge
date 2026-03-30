"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryLoanApplicationRepository = void 0;
const common_1 = require("@nestjs/common");
const applicant_entity_1 = require("../../domain/entities/applicant.entity");
const loan_product_entity_1 = require("../../domain/entities/loan-product.entity");
const currency_vo_1 = require("../../domain/value-objects/currency.vo");
const loan_terms_vo_1 = require("../../domain/value-objects/loan-terms.vo");
let InMemoryLoanApplicationRepository = class InMemoryLoanApplicationRepository {
    constructor() {
        this.applicants = new Map();
        this.products = new Map();
        this.applications = new Map();
        const seedApplicant = new applicant_entity_1.Applicant('applicant-seed-1', 'Juan Perez', '12345678', 'SERVICES', 4500, '+573001112233', 'juan.perez@example.com');
        const seedProduct = new loan_product_entity_1.LoanProduct('loan-product-seed-1', 'Capital de Trabajo', new loan_terms_vo_1.LoanTerms(12, 'MONTHLY'), 0.22, new currency_vo_1.Currency('MXN', 'Mexican Peso'), 5000, 300000);
        this.applicants.set(seedApplicant.id, seedApplicant);
        this.products.set(seedProduct.id, seedProduct);
    }
    async saveApplicant(applicant) {
        this.applicants.set(applicant.id, applicant);
    }
    async saveLoanProduct(product) {
        this.products.set(product.id, product);
    }
    async saveLoanApplication(application) {
        this.applications.set(application.id, application);
    }
    async findApplicantById(id) {
        return this.applicants.get(id) ?? null;
    }
    async findLoanProductById(id) {
        return this.products.get(id) ?? null;
    }
    async findApplicationById(id) {
        return this.applications.get(id) ?? null;
    }
    async findApplications(filters) {
        return [...this.applications.values()].filter((application) => {
            const matchApplicant = !filters?.applicantId || application.applicantId === filters.applicantId;
            const matchStatus = !filters?.status || application.status === filters.status;
            return matchApplicant && matchStatus;
        });
    }
    async findApplicants() {
        return [...this.applicants.values()];
    }
    async findLoanProducts() {
        return [...this.products.values()];
    }
};
exports.InMemoryLoanApplicationRepository = InMemoryLoanApplicationRepository;
exports.InMemoryLoanApplicationRepository = InMemoryLoanApplicationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], InMemoryLoanApplicationRepository);
