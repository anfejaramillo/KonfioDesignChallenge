import { Module } from '@nestjs/common';
import { GetCreditDecisionUseCase } from './application/use-cases/get-credit-decision.use-case';
import { GetRiskAssessmentUseCase } from './application/use-cases/get-risk-assessment.use-case';
import { ListCreditDecisionsUseCase } from './application/use-cases/list-credit-decisions.use-case';
import { MakeCreditDecisionUseCase } from './application/use-cases/make-credit-decision.use-case';
import { LoanDecisionDomainService } from './domain/services/loan-decision-domain.service';
import { RiskAssessmentCompletedHandler } from './interfaces/event-handlers/risk-assessment-completed.handler';
import { LoanDecisionController } from './interfaces/http/loan-decision.controller';
import { providers } from './infrastructure/wiring/providers';

@Module({
  controllers: [LoanDecisionController],
  providers: [
    ...providers,
    MakeCreditDecisionUseCase,
    GetCreditDecisionUseCase,
    GetRiskAssessmentUseCase,
    ListCreditDecisionsUseCase,
    LoanDecisionDomainService,
    RiskAssessmentCompletedHandler,
  ],
})
export class AppModule {}
