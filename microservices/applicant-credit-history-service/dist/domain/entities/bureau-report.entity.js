"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BureauReport = void 0;
class BureauReport {
    constructor(id, applicantId, scoreProviderName, rawData, fetchedAt) {
        this.id = id;
        this.applicantId = applicantId;
        this.scoreProviderName = scoreProviderName;
        this.rawData = rawData;
        this.fetchedAt = fetchedAt;
    }
}
exports.BureauReport = BureauReport;
