"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCreditBureauAclAdapter = void 0;
const common_1 = require("@nestjs/common");
let InMemoryCreditBureauAclAdapter = class InMemoryCreditBureauAclAdapter {
    async fetchByApplicantId(applicantId, correlationId) {
        void applicantId;
        void correlationId;
        return [
            {
                providerName: 'BuroDeCredito',
                providerMinScore: 300,
                providerMaxScore: 850,
                providerScore: 680,
                rawData: {
                    providerReference: 'stub-buro-reference',
                    status: 'OK',
                    debtRatio: 0.32,
                },
            },
            {
                providerName: 'CirculoDeCredito',
                providerMinScore: 400,
                providerMaxScore: 950,
                providerScore: 790,
                rawData: {
                    providerReference: 'stub-circulo-reference',
                    status: 'OK',
                    debtRatio: 0.28,
                },
            },
        ];
    }
};
exports.InMemoryCreditBureauAclAdapter = InMemoryCreditBureauAclAdapter;
exports.InMemoryCreditBureauAclAdapter = InMemoryCreditBureauAclAdapter = __decorate([
    (0, common_1.Injectable)()
], InMemoryCreditBureauAclAdapter);
