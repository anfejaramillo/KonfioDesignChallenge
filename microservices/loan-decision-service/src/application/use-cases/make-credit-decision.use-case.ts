import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { MakeCreditDecisionCommand } from '../commands/make-credit-decision.command';
import { MakeCreditDecisionResult } from '../dto/make-credit-decision.result';
import { EVENT_BUS_PORT, EventBusPort } from '../ports/event-bus.port';
import { IDEMPOTENCY_STORE_PORT, IdempotencyStorePort } from '../ports/idempotency-store.port';
import {
  LOAN_APPLICATION_CONTEXT_PORT,
  LoanApplicationContextPort,
} from '../ports/loan-application-context.port';
import {
  LOAN_DECISION_REPOSITORY,
  LoanDecisionRepository,
} from '../../domain/repositories/loan-decision.repository';
import { CreditDecision } from '../../domain/entities/credit-decision.entity';
import { RiskAssessment } from '../../domain/entities/risk-assessment.entity';
import { RiskLevel } from '../../domain/value-objects/risk-level.vo';
import { LoanDecisionDomainService } from '../../domain/services/loan-decision-domain.service';

@Injectable()
export class MakeCreditDecisionUseCase {
  constructor(
    @Inject(LOAN_DECISION_REPOSITORY)
    private readonly repository: LoanDecisionRepository,
    @Inject(EVENT_BUS_PORT)
    private readonly eventBus: EventBusPort,
    @Inject(IDEMPOTENCY_STORE_PORT)
    private readonly idempotencyStore: IdempotencyStorePort,
    @Inject(LOAN_APPLICATION_CONTEXT_PORT)
    private readonly loanApplicationContext: LoanApplicationContextPort,
    private readonly domainService: LoanDecisionDomainService,
  ) {}

  /**
   * Processes a completed risk assessment into a credit decision in an idempotent way.
   */
  async execute(command: MakeCreditDecisionCommand): Promise<MakeCreditDecisionResult> {
    this.assertValidOccurredAt(command.occurredAt);

    const alreadyProcessed = await this.idempotencyStore.exists(command.idempotencyKey);
    if (alreadyProcessed) {
      return {
        decisionId: command.decisionId,
        applicationId: command.applicationId,
        decision: 'UNDER_REVIEW',
        status: 'DUPLICATE_IGNORED',
      };
    }

    // Resolve policy context either from payload override or ACL lookup.
    const decisionContext = await this.resolveDecisionContext(command);
    const assessment = this.buildRiskAssessment(command);

    await this.repository.saveRiskAssessment(assessment);

    const decision = new CreditDecision(
      command.decisionId,
      command.applicationId,
      command.applicantId,
      'UNDER_REVIEW',
      null,
      null,
      command.riskAssessmentId,
      new Date(),
    );

    const outcome = this.domainService.decide(
      assessment,
      decisionContext.requestedAmount,
      decisionContext.policy,
    );

    // Apply domain outcome to the aggregate state and persist it.
    this.domainService.applyOutcome(decision, outcome);

    await this.repository.saveCreditDecision(decision);

    await this.eventBus.publishCreditDecisionMade({
      eventId: randomUUID(),
      eventType: 'creditDecisionMade',
      aggregateId: command.applicationId,
      idempotencyKey: command.idempotencyKey,
      correlationId: command.correlationId,
      applicationId: command.applicationId,
      applicantId: command.applicantId,
      decision: decision.status,
      approvedAmount: decision.approvedAmount ?? undefined,
      interestRate: decision.assignedInterestRate ?? undefined,
      riskAssessmentId: command.riskAssessmentId,
      occurredAt: new Date().toISOString(),
    });

    await this.idempotencyStore.save(command.idempotencyKey, 60 * 60 * 24 * 7);

    return {
      decisionId: decision.id,
      applicationId: decision.applicationId,
      decision: decision.status,
      status: 'PROCESSED',
    };
  }

  /**
   * Resolves decision context from command payload or ACL port.
   */
  private async resolveDecisionContext(command: MakeCreditDecisionCommand): Promise<{
    requestedAmount: number;
    policy: {
      maxProbabilityOfDefaultForApproval: number;
      manualApprovalRequired: boolean;
      baseInterestRate: number;
    };
  }> {
    if (command.requestedAmount !== undefined && command.policy) {
      return {
        requestedAmount: command.requestedAmount,
        policy: command.policy,
      };
    }

    return this.loanApplicationContext.findDecisionContextByApplicationId(
      command.applicationId,
      command.correlationId,
    );
  }

  /**
   * Creates a `RiskAssessment` aggregate from the incoming command payload.
   */
  private buildRiskAssessment(command: MakeCreditDecisionCommand): RiskAssessment {
    return new RiskAssessment(
      command.riskAssessmentId,
      command.applicationId,
      command.applicantId,
      new RiskLevel(
        command.riskLevel.probabilityOfDefaultUpperLimit,
        command.riskLevel.description,
      ),
      command.riskAnalysisResult,
      new Date(command.occurredAt),
    );
  }

  /**
   * Validates that `occurredAt` is a parseable ISO datetime string.
   */
  private assertValidOccurredAt(occurredAt: string): void {
    if (Number.isNaN(new Date(occurredAt).getTime())) {
      throw new Error('occurredAt must be a valid ISO date string');
    }
  }
}
