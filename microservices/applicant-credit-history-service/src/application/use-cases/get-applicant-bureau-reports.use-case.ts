import { Inject, Injectable } from '@nestjs/common';
import {
  APPLICANT_CREDIT_HISTORY_REPOSITORY,
  ApplicantCreditHistoryRepository,
} from '../../domain/repositories/applicant-credit-history.repository';
import { ApplicantBureauReportsResult } from '../dto/get-applicant-bureau-reports.result';

@Injectable()
export class GetApplicantBureauReportsUseCase {
  constructor(
    @Inject(APPLICANT_CREDIT_HISTORY_REPOSITORY)
    private readonly repository: ApplicantCreditHistoryRepository,
  ) {}

  async execute(applicantId: string): Promise<ApplicantBureauReportsResult> {
    const reports = await this.repository.findBureauReportsByApplicantId(applicantId);

    return {
      applicantId,
      reports: reports.map((report) => ({
        reportId: report.id,
        applicantId: report.applicantId,
        providerName: report.scoreProviderName,
        rawData: report.rawData,
        fetchedAt: report.fetchedAt.toISOString(),
      })),
    };
  }
}
