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

  async execute(command: FetchApplicantCreditHistoryCommand): Promise<FetchApplicantCreditHistoryResult> {
    const alreadyProcessed = await this.idempotencyStore.exists(command.idempotencyKey);
    if (alreadyProcessed) {
      return {
        applicantId: command.applicantId,
        reportsStored: 0,
        scoresUpdated: 0,
        status: 'DUPLICATE_IGNORED',
      };
    }

    const bureauResponses =
      command.bureauResponses ??
      (await this.creditBureauAcl.fetchByApplicantId(command.applicantId, command.correlationId));

    let reportsStored = 0;
    let scoresUpdated = 0;

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

    await this.idempotencyStore.save(command.idempotencyKey, 60 * 60 * 24 * 7);

    return {
      applicantId: command.applicantId,
      reportsStored,
      scoresUpdated,
      status: 'PROCESSED',
    };
  }
}
