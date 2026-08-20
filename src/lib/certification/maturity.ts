import { CertificationScores } from '../../types/enterpriseBlueprint';

export function compositeCertificationScore(s: CertificationScores): number {
  return Math.round(
    (s.architectureMaturity +
      s.operationalReadiness +
      s.securityMaturity +
      s.reliabilityMaturity +
      s.launchReadiness) /
      5
  );
}

export function programClosed(s: CertificationScores): boolean {
  return s.completionPct === 100 && s.launchReadiness >= 95 && compositeCertificationScore(s) >= 90;
}
