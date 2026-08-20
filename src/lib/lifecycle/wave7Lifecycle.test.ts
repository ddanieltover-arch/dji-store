import { describe, expect, it } from 'vitest';
import { INITIAL_CUSTOMERS, INITIAL_CAMPAIGNS, INITIAL_REFERRALS } from '../../data/crmData';
import { DJI_PRODUCTS } from '../../data/products';
import { WAVE7_ONBOARDING_STEPS, WAVE7_OUT_OF_CATALOG_OWNERSHIP } from '../../data/wave7LifecycleData';
import {
  buildOnboardingMessages,
  gateConsent,
  inferLifecycleStage,
  messageFingerprint,
  runWave7Lifecycle,
  scoreChurn,
  LOCALES
} from './wave7Lifecycle';

describe('Wave 7 customer lifecycle', () => {
  const bundle = runWave7Lifecycle(INITIAL_CUSTOMERS, DJI_PRODUCTS, INITIAL_CAMPAIGNS, INITIAL_REFERRALS);

  it('transitions include trigger, evidence, timestamp, and stages', () => {
    expect(bundle.transitions.length).toBe(INITIAL_CUSTOMERS.length);
    expect(
      bundle.transitions.every((t) => t.trigger && t.evidence && t.timestamp && t.currentStage && t.previousStage)
    ).toBe(true);
    const lukas = INITIAL_CUSTOMERS.find((c) => c.id === 'cust-lukas-weber')!;
    expect(['REPEAT_CUSTOMER', 'ACTIVE_CUSTOMER', 'PROFESSIONAL_CUSTOMER', 'VIP_ENTERPRISE', 'AT_RISK']).toContain(
      inferLifecycleStage(lukas)
    );
  });

  it('enforces consent — opted-out customers never queue email/sms/push', () => {
    const opted = { ...INITIAL_CUSTOMERS[0], marketingConsent: false, id: 'cust-opt-out' };
    expect(gateConsent(opted, 'email').allowed).toBe(false);
    const msgs = buildOnboardingMessages(opted, 'prod-mavic-4-pro', 'en', new Set());
    expect(msgs.every((m) => m.status === 'suppressed')).toBe(true);
    expect(bundle.certification.consentViolations).toBe(0);
  });

  it('prevents duplicate campaign fingerprints', () => {
    const fps = bundle.messages.filter((m) => m.status === 'queued' || m.status === 'sent').map((m) => m.fingerprint);
    expect(new Set(fps).size).toBe(fps.length);
    expect(messageFingerprint('a', 'j', 'd0')).toBe('a|j|d0');
  });

  it('covers onboarding days 0/1/3/7/14/30 and all six locales in templates', () => {
    expect(WAVE7_ONBOARDING_STEPS.map((s) => s.day)).toEqual([0, 1, 3, 7, 14, 30]);
    expect(LOCALES).toEqual(['en', 'de', 'fr', 'es', 'it', 'nl']);
    expect(bundle.certification.localizationCoveragePct).toBe(100);
  });

  it('scores churn with explainable signals', () => {
    const dormant = INITIAL_CUSTOMERS.find((c) => c.healthStatus === 'at_risk' || c.healthStatus === 'dormant');
    const score = scoreChurn(dormant ?? INITIAL_CUSTOMERS[0]);
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(score.level);
    expect(score.signals.length).toBeGreaterThanOrEqual(5);
  });

  it('integrates existing loyalty accounts without duplication', () => {
    expect(bundle.loyalty).toHaveLength(INITIAL_CUSTOMERS.length);
    expect(bundle.loyalty.every((l) => l.points === INITIAL_CUSTOMERS.find((c) => c.id === l.customerId)?.loyaltyAccount.pointsBalance)).toBe(
      true
    );
    expect(bundle.certification.loyaltyIntegrationIntegrityPct).toBe(100);
  });

  it('attributes referrals from existing ReferralRecord identities', () => {
    expect(bundle.referrals.length).toBe(INITIAL_REFERRALS.length);
    expect(bundle.referrals[0].referrerCustomerId).toBeTruthy();
  });

  it('maps ownership to DJI_PRODUCTS via aliases; excludes out-of-catalog tokens', () => {
    expect(bundle.ownership.every((o) => DJI_PRODUCTS.some((p) => p.id === o.productId))).toBe(true);
    const inScope = INITIAL_CUSTOMERS.reduce(
      (s, c) => s + c.ownedProducts.filter((t) => !WAVE7_OUT_OF_CATALOG_OWNERSHIP.has(t)).length,
      0
    );
    expect(bundle.ownership.length).toBe(inScope);
    expect(bundle.certification.productOwnershipAccuracyPct).toBeGreaterThanOrEqual(99);
  });

  it('does not claim causal revenue attribution', () => {
    expect(bundle.attribution.causationClaimed).toBe(false);
    expect(bundle.attribution.campaignRevenueEur).toBeGreaterThan(0);
  });

  it('certifies Wave 7 floors', () => {
    expect(bundle.certification.lifecycleTransitionIntegrityPct).toBeGreaterThanOrEqual(99);
    expect(bundle.certification.consentViolations).toBe(0);
    expect(bundle.certification.duplicateCampaignSends).toBe(0);
    expect(bundle.certification.localizationCoveragePct).toBe(100);
    expect(bundle.certification.loyaltyIntegrationIntegrityPct).toBe(100);
    expect(bundle.certification.revenueAttributionIntegrityPct).toBeGreaterThanOrEqual(95);
    expect(bundle.certification.certified).toBe(true);
    expect(bundle.ai.every((a) => a.confidence >= 0.85 && a.dataSources.length && a.proposedAction)).toBe(true);
  });
});
