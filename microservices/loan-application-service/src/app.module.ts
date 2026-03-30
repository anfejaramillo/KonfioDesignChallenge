import { Module } from '@nestjs/common';
import { GetLoanApplicationUseCase } from './application/use-cases/get-loan-application.use-case';
import { ListLoanApplicationsUseCase } from './application/use-cases/list-loan-applications.use-case';
import { ProcessCreditDecisionUseCase } from './application/use-cases/process-credit-decision.use-case';
import { LoanApplicationController } from './interfaces/http/loan-application.controller';
import { CreditDecisionMadeHandler } from './interfaces/event-handlers/credit-decision-made.handler';
import { CreateLoanApplicationUseCase } from './application/use-cases/create-loan-application.use-case';
import { RegisterApplicantUseCase } from './application/use-cases/register-applicant.use-case';
import { RegisterLoanProductUseCase } from './application/use-cases/register-loan-product.use-case';
import { LoanApplicationDomainService } from './domain/services/loan-application-domain.service';
import { providers } from './infrastructure/wiring/providers';

@Module({
  controllers: [LoanApplicationController],
  providers: [
    ...providers,
    CreditDecisionMadeHandler,
    CreateLoanApplicationUseCase,
    GetLoanApplicationUseCase,
    ListLoanApplicationsUseCase,
    LoanApplicationDomainService,
    ProcessCreditDecisionUseCase,
    RegisterApplicantUseCase,
    RegisterLoanProductUseCase,
  ],
})
export class AppModule {}
