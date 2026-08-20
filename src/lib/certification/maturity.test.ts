import { describe, expect, it } from 'vitest';
import { CERTIFICATION_SCORES } from '../../data/enterpriseBlueprintData';
import { compositeCertificationScore, programClosed } from './maturity';

describe('Phase 15 certification', () => {
  it('closes the program at 100% with composite ≥ 90', () => {
    expect(CERTIFICATION_SCORES.completionPct).toBe(100);
    expect(compositeCertificationScore(CERTIFICATION_SCORES)).toBeGreaterThanOrEqual(90);
    expect(programClosed(CERTIFICATION_SCORES)).toBe(true);
  });
});
