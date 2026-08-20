import { describe, expect, it } from 'vitest';
import { isLaunchAuthorized, launchReadinessScore } from './goNoGo';
import { LAUNCH_SIGNOFFS } from '../../data/launchOperationsData';

describe('go / no-go', () => {
  it('authorizes when all functions GO and score ≥ 95', () => {
    expect(launchReadinessScore(LAUNCH_SIGNOFFS)).toBeGreaterThanOrEqual(95);
    expect(isLaunchAuthorized(LAUNCH_SIGNOFFS)).toBe(true);
  });

  it('blocks a no-go', () => {
    expect(isLaunchAuthorized([{ ...LAUNCH_SIGNOFFS[0], decision: 'no-go' }])).toBe(false);
  });
});
