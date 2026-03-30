import { Module } from '@nestjs/common';
import { FetchApplicantCreditHistoryUseCase } from './application/use-cases/fetch-applicant-credit-history.use-case';
import { GetApplicantBureauReportsUseCase } from './application/use-cases/get-applicant-bureau-reports.use-case';
import { GetLatestCreditScoresUseCase } from './application/use-cases/get-latest-credit-scores.use-case';
import { ApplicantCreditHistoryDomainService } from './domain/services/applicant-credit-history-domain.service';
import { LoanApplicationCreatedHandler } from './interfaces/event-handlers/loan-application-created.handler';
import { ApplicantCreditHistoryController } from './interfaces/http/applicant-credit-history.controller';
import { providers } from './infrastructure/wiring/providers';

@Module({
  controllers: [ApplicantCreditHistoryController],
  providers: [
    ...providers,
    FetchApplicantCreditHistoryUseCase,
    GetApplicantBureauReportsUseCase,
    GetLatestCreditScoresUseCase,
    ApplicantCreditHistoryDomainService,
    LoanApplicationCreatedHandler,
  ],
})
export class AppModule {}
