import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { FetchApplicantCreditHistoryCommand } from '../commands/fetch-applicant-credit-history.command';
import { FetchApplicantCreditHistoryResult } from '../dto/fetch-applicant-credit-history.result';
import { CREDIT_BUREAU_ACL_PORT, CreditBureauAclPort } from '../ports/credit-bureau-acl.port';
import { EVENT_BUS_PORT, EventBusPort } from '../ports/event-bus.port';
import { IDEMPOTENCY_STORE_PORT, IdempotencyStorePort } from '../ports/idempotency-store.port';
import {
  APPLICANT_CREDIT_HISTORY_REPOSITORY,
  ApplicantCreditHistoryRepository,
} from '../../domain/repositories/applicant-credit-history.repository';
import { ApplicantCreditHistoryDomainService } from '../../domain/services/applicant-credit-history-domain.service';

/** Idempotency retention: 7 days. */
const IDEMPOTENCY_TTL_SECONDS = 60 * 60 * 24 * 7;

/**
 * Orchestrates applicant credit-history enrichment when a loan application is created.
 */
@Injectable()
export class FetchApplicantCreditHistoryUseCase {
  constructor(
    @Inject(APPLICANT_CREDIT_HISTORY_REPOSITORY)
    private readonly repository: ApplicantCreditHistoryRepository,
    @Inject(EVENT_BUS_PORT)
    private readonly eventBus: EventBusPort,
    @Inject(IDEMPOTENCY_STORE_PORT)
    private readonly idempotencyStore: IdempotencyStorePort,
    @Inject(CREDIT_BUREAU_ACL_PORT)
    private readonly creditBureauAcl: CreditBureauAclPort,
    private readonly domainService: ApplicantCreditHistoryDomainService,
  ) {}

  /**
   * Executes the full flow: idempotency check, bureau fetch, persistence,
   * integration event publication, and idempotency key registration.
   */
  async execute(command: FetchApplicantCreditHistoryCommand): Promise<FetchApplicantCreditHistoryResult> {
    // Short-circuit duplicate events to guarantee idempotent processing.
    const alreadyProcessed = await this.idempotencyStore.exists(command.idempotencyKey);
    if (alreadyProcessed) {
      return {
        applicantId: command.applicantId,
        reportsStored: 0,
        scoresUpdated: 0,
        status: 'DUPLICATE_IGNORED',
      };
    }

    // Uses provided responses (tests/replays) or fetches from the ACL.
    const bureauResponses =
      command.bureauResponses ??
      (await this.creditBureauAcl.fetchByApplicantId(command.applicantId, command.correlationId));

    let reportsStored = 0;
    let scoresUpdated = 0;

    // Persists bureau reports and their normalized scores per provider.
    for (const response of bureauResponses) {
      const report = this.domainService.createBureauReport(command.applicantId, response);
      await this.repository.saveBureauReport(report);
      reportsStored += 1;

      const normalizedScore = this.domainService.createNormalizedCreditScore(
        command.applicantId,
        response,
      );
      await this.repository.saveCreditScore(normalizedScore);
      scoresUpdated += 1;
    }

    // Publishes integration event after successful persistence.
    await this.eventBus.publishBureauDataFetched({
      eventId: randomUUID(),
      eventType: 'bureauDataFetched',
      aggregateId: command.applicationId,
      idempotencyKey: command.idempotencyKey,
      correlationId: command.correlationId,
      applicationId: command.applicationId,
      applicantId: command.applicantId,
      providersProcessed: bureauResponses.map((response) => response.providerName),
      reportsStored,
      scoresUpdated,
      occurredAt: new Date().toISOString(),
    });

    // Marks command as processed to prevent duplicated side effects.
    await this.idempotencyStore.save(command.idempotencyKey, IDEMPOTENCY_TTL_SECONDS);

    return {
      applicantId: command.applicantId,
      reportsStored,
      scoresUpdated,
      status: 'PROCESSED',
    };
  }
}