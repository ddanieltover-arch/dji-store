import { LaunchSignoff } from '../../types/launchOperations';

export function launchReadinessScore(signoffs: LaunchSignoff[]): number {
  if (signoffs.length === 0) return 0;
  return Math.round(signoffs.reduce((s, x) => s + x.scorePct, 0) / signoffs.length);
}

export function isLaunchAuthorized(signoffs: LaunchSignoff[]): boolean {
  return signoffs.every((s) => s.decision === 'go') && launchReadinessScore(signoffs) >= 95;
}
