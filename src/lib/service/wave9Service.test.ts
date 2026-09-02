import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import { INITIAL_CUSTOMERS } from '../../data/crmData';
import { INITIAL_WARRANTIES } from '../../data/orderOperations';
import { WAVE9_LOCALES, WAVE9_SLA_HOURS } from '../../data/wave9ServiceData';
import {
  advanceRmaStatus,
  buildOwnershipRegistry,
  canPerformServiceAction,
  createRepairCase,
  createSupportTicket,
  evaluateWarranty,
  firmwareForOwnership,
  localizeKnowledge,
  maskSerial,
  registerOwnership,
  runWave9Service,
  verifySerial,
  viewCarePlan
} from './wave9Service';

describe('Wave 9 warranty, RMA & service intelligence', () => {
  const ownership = buildOwnershipRegistry();
  const bundle = runWave9Service(DJI_PRODUCTS, INITIAL_CUSTOMERS);

  it('registers ownership linked to CRM customer and DJI_PRODUCTS', () => {
    expect(ownership.length).toBeGreaterThanOrEqual(INITIAL_WARRANTIES.length);
    expect(ownership.every((o) => DJI_PRODUCTS.some((p) => p.id === o.productId))).toBe(true);
    expect(ownership.every((o) => !o.customerId || INITIAL_CUSTOMERS.some((c) => c.id === o.customerId))).toBe(
      true
    );
  });

  it('verifies serials through format → order → product → ownership', () => {
    const known = ownership[0];
    const already = verifySerial({
      serial: known.serialNumber,
      ownership,
      customerId: known.customerId
    });
    expect(already.outcome).toBe('already_registered');
    expect(already.serialMasked).toBe(maskSerial(known.serialNumber));
    expect(already.serialMasked.includes(known.serialNumber)).toBe(false);

    const bad = verifySerial({ serial: 'xx', ownership });
    expect(bad.outcome).toBe('invalid');

    const mismatch = verifySerial({
      serial: 'NEWSERIAL9999DE',
      orderId: 'DJI-EU-100239',
      productId: 'prod-inspire-3',
      ownership
    });
    expect(mismatch.outcome).toBe('order_mismatch');

    const ok = registerOwnership({
      customerId: 'cust-lukas-weber',
      productId: 'prod-mavic-4-pro',
      serialNumber: 'NEWSERIAL9999DE',
      orderId: 'DJI-EU-100239',
      purchaseDate: '2026-08-13',
      ownership
    });
    expect(ok.verification.outcome).toBe('verified');
    expect(ok.ok).toBe(true);
    expect(ok.ownership?.warrantyEnd).toMatch(/^2028-/);
  });

  it('calculates warranty with explanation and 100% accuracy sources', () => {
    const e = evaluateWarranty(ownership[0]);
    expect(['active', 'expiring_soon', 'expired', 'pending_verification', 'not_eligible']).toContain(e.status);
    expect(e.reason.length).toBeGreaterThan(10);
    expect(e.sourceRecords.length).toBeGreaterThan(0);
    expect(e.warrantyEnd).toBe(ownership[0].warrantyEnd);
  });

  it('integrates Care from verified plans only', () => {
    const withCare = ownership.find((o) => o.carePlanId);
    expect(withCare).toBeTruthy();
    const view = viewCarePlan(
      bundle.careViews.find((c) => c.plan.id === withCare!.carePlanId)?.plan,
      withCare!
    );
    expect(view.reason.includes('invent') || view.eligible || view.renewalStatus === 'not_enrolled').toBeTruthy();
    const none = viewCarePlan(undefined, ownership[0]);
    expect(none.eligible).toBe(false);
    expect(none.reason).toMatch(/do not invent/i);
  });

  it('creates tickets against CRM + catalog and enforces permissions', () => {
    const t = createSupportTicket({
      customerId: 'cust-lukas-weber',
      productId: 'prod-mavic-4-pro',
      category: 'firmware_issue',
      priority: 'critical',
      subject: 'FW question',
      description: 'test'
    });
    expect(t.firstResponseDueAt).toBeTruthy();
    const created = new Date(t.createdAt).getTime();
    const due = new Date(t.firstResponseDueAt).getTime();
    expect(due - created).toBe(WAVE9_SLA_HOURS.critical * 3600 * 1000);

    expect(canPerformServiceAction('agent-support-1', 'view_tickets')).toBe(true);
    expect(canPerformServiceAction('agent-support-1', 'approve_warranty_rma')).toBe(false);
    expect(canPerformServiceAction('outsider', 'view_tickets')).toBe(false);
  });

  it('advances RMA lifecycle with valid states', () => {
    const c = createRepairCase({
      ownership: ownership[0],
      category: 'warranty_repair'
    });
    expect(c.status).toBe('requested');
    expect(advanceRmaStatus('requested')).toBe('eligibility_review');
    expect(advanceRmaStatus('completed')).toBeNull();
    expect(advanceRmaStatus('rejected')).toBeNull();
  });

  it('keeps repair parts on FRA/AMS/CDG inventory', () => {
    expect(bundle.parts.length).toBeGreaterThan(0);
    expect(
      bundle.parts.every((p) => ['FRA-01', 'AMS-02', 'CDG-03'].includes(p.warehouseCode) && p.quantityAvailable >= 0)
    ).toBe(true);
  });

  it('supports enterprise fleet ownership by organization', () => {
    const fleet = bundle.fleetByOrg['org-keller-aerial'] ?? [];
    expect(fleet.length).toBeGreaterThanOrEqual(2);
    expect(fleet.every((o) => o.productId === 'prod-matrice-4t')).toBe(true);
  });

  it('marks firmware unknown without claiming outdated', () => {
    const fw = firmwareForOwnership(ownership[0]);
    expect(fw.installedVersion).toBe('unknown');
    expect(fw.outdatedClaimed).toBe(false);
  });

  it('localizes knowledge with EN fallback and covers six locales', () => {
    expect(WAVE9_LOCALES).toEqual(['en', 'de', 'fr', 'es', 'it', 'nl']);
    const de = localizeKnowledge('de', 'kb-warr-01');
    expect(de.article).toBeTruthy();
    const missing = localizeKnowledge('de', 'kb-pair-01');
    expect(missing.fallback).toBe(true);
    expect(missing.article?.locale).toBe('en');
  });

  it('enforces AI sources and GDPR consent on service-to-sales', () => {
    expect(bundle.ai.every((a) => a.sourceDocuments.length > 0 && a.unsupportedClaimRate === 0)).toBe(true);
    expect(bundle.serviceToSales.every((h) => h.consentRequired && (h.allowed ? h.marketingConsent : true))).toBe(
      true
    );
    expect(bundle.qualitySignals.every((s) => s.altersOfficialSpecs === false)).toBe(true);
  });

  it('certifies Wave 9 gates', () => {
    const c = bundle.certification;
    expect(c.ownershipAccuracyPct).toBeGreaterThanOrEqual(99);
    expect(c.warrantyCalculationAccuracyPct).toBe(100);
    expect(c.unauthorizedServiceDataAccess).toBe(0);
    expect(c.rmaStateIntegrityPct).toBe(100);
    expect(c.inventoryPartConsistencyPct).toBe(100);
    expect(c.supportSlaTrackingAccuracyPct).toBeGreaterThanOrEqual(99);
    expect(c.aiUnsupportedClaimRate).toBe(0);
    expect(c.localizationCoveragePct).toBe(100);
    expect(c.consentViolations).toBe(0);
    expect(c.certified).toBe(true);
  });
});
