import { describe, expect, it } from 'vitest';
import { renderForceRlsCatalog, renderRlsPolicySql } from './rlsPolicySql';
import { SUPABASE_RLS_POLICIES } from '../../data/securityComplianceData';
import { verifyWebhookSignature } from './edgeSecurity';

describe('RLS policy SQL', () => {
  it('forces RLS on orders', () => {
    const sql = renderRlsPolicySql(SUPABASE_RLS_POLICIES[0]);
    expect(sql).toContain('FORCE ROW LEVEL SECURITY');
    expect(sql).toContain('orders');
  });

  it('catalogs unique tables', () => {
    const catalog = renderForceRlsCatalog(SUPABASE_RLS_POLICIES);
    expect(catalog).toContain('public.payments');
  });
});

describe('webhook replay window', () => {
  it('rejects stale timestamps', async () => {
    const ok = await verifyWebhookSignature('secret', '{}', 'deadbeef', Math.floor(Date.now() / 1000) - 10_000);
    expect(ok).toBe(false);
  });
});
