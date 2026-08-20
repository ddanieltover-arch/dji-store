import { describe, expect, it } from 'vitest';
import { checkoutIdempotencyKey, resolveCheckoutAttempt } from './checkoutIdempotency';
import { errorBudgetBurnAlert } from './slo';
import { cacheControlHeader, searchCacheKey } from './cacheTopology';
import { SloDefinition } from '../../types/performanceReliability';

const slo = (over: Partial<SloDefinition>): SloDefinition => ({
  name: 't',
  sli: 'x',
  slo: 'y',
  current: 'z',
  errorBudgetRemainingPct: 50,
  status: 'healthy',
  ...over
});

describe('checkout idempotency', () => {
  it('replays the same PaymentIntent', () => {
    const key = checkoutIdempotencyKey('c1', 'bag');
    expect(resolveCheckoutAttempt('pi_1', key, key)).toBe('duplicate_replay');
  });

  it('commits first attempt', () => {
    const key = checkoutIdempotencyKey('c1', 'bag');
    expect(resolveCheckoutAttempt(null, key, key)).toBe('committed');
  });
});

describe('SRE burn alerts', () => {
  it('pages on breach', () => {
    expect(errorBudgetBurnAlert(slo({ status: 'breached' }))).toBe('page');
    expect(errorBudgetBurnAlert(slo({ errorBudgetRemainingPct: 8 }))).toBe('page');
    expect(errorBudgetBurnAlert(slo({ status: 'at_risk', errorBudgetRemainingPct: 20 }))).toBe('ticket');
    expect(errorBudgetBurnAlert(slo({}))).toBe('none');
  });
});

describe('cache topology', () => {
  it('emits SWR cache-control', () => {
    expect(cacheControlHeader({ ttlSeconds: 60, staleWhileRevalidateSeconds: 300 })).toContain('s-maxage=60');
    expect(searchCacheKey(' Mini ', 'de')).toBe('search:v3:de:mini');
  });
});
