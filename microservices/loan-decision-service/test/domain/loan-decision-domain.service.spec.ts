import { LoanDecisionDomainService } from '../../src/domain/services/loan-decision-domain.service';
import { RiskAssessment } from '../../src/domain/entities/risk-assessment.entity';
import { RiskLevel } from '../../src/domain/value-objects/risk-level.vo';

describe('LoanDecisionDomainService', () => {
  const service = new LoanDecisionDomainService();

  it('approves when risk is inside policy threshold', () => {
    const assessment = new RiskAssessment(
      'risk-1',
      'application-1',
      'applicant-1',
      new RiskLevel(0.2, 'LOW'),
      {},
      new Date(),
    );

    const outcome = service.decide(assessment, 15000, {
      maxProbabilityOfDefaultForApproval: 0.35,
      manualApprovalRequired: false,
      baseInterestRate: 0.2,
    });

    // Approved decision returns requested amount plus risk-adjusted rate.
    expect(outcome.status).toBe('APPROVED');
    expect(outcome.approvedAmount).toBe(15000);
    expect(outcome.assignedInterestRate).toBe(0.4);
  });

  it('marks under review when policy requires manual approval', () => {
    const assessment = new RiskAssessment(
      'risk-2',
      'application-2',
      'applicant-2',
      new RiskLevel(0.1, 'LOW'),
      {},
      new Date(),
    );

    const outcome = service.decide(assessment, 8000, {
      maxProbabilityOfDefaultForApproval: 0.35,
      manualApprovalRequired: true,
      baseInterestRate: 0.2,
    });

    // Manual policy prevents auto-approval/rejection.
    expect(outcome.status).toBe('UNDER_REVIEW');
    expect(outcome.approvedAmount).toBeNull();
    expect(outcome.assignedInterestRate).toBeNull();
  });
});
