import { describe, expect, it } from 'vitest';
import { DJI_PRODUCTS } from '../../data/products';
import {
  WAVE8_APPROVAL_THRESHOLDS,
  WAVE8_MEMBERSHIPS,
  WAVE8_ORGANIZATIONS,
  WAVE8_VOLUME_TIERS
} from '../../data/wave8EnterpriseData';
import {
  approveQuote,
  availableUnitsForVariant,
  buildFleet,
  calculateQuote,
  canAccessOrganization,
  convertQuoteToOrder,
  preferDepotForLocation,
  priceLine,
  requiredApprovalLevel,
  runWave8Enterprise,
  toLegacyB2bQuote,
  validateVies,
  volumeDiscountPct
} from './wave8Enterprise';

describe('Wave 8 B2B & enterprise commerce', () => {
  const org = WAVE8_ORGANIZATIONS[0];
  const frOrg = WAVE8_ORGANIZATIONS[1];
  const bundle = runWave8Enterprise(DJI_PRODUCTS);

  it('validates EU VAT via VIES rules and never assumes exemption', () => {
    const ok = validateVies('DE389201948', 'DE');
    expect(ok.status).toBe('valid');
    expect(ok.neverAssumeExemption).toBe(true);
    expect(ok.validatedAt).toBeTruthy();

    const bad = validateVies('XX1', 'DE');
    expect(bad.status).not.toBe('valid');
    expect(bad.reverseChargeEligible).toBe(false);

    const fr = validateVies(frOrg.vatId, 'FR');
    expect(fr.status).toBe('valid');
    expect(fr.reverseChargeEligible).toBe(true);
  });

  it('applies volume tiers 1–4 / 5–9 / 10–24 / 25+', () => {
    expect(volumeDiscountPct(3, WAVE8_VOLUME_TIERS)).toBe(0);
    expect(volumeDiscountPct(5, WAVE8_VOLUME_TIERS)).toBe(5);
    expect(volumeDiscountPct(12, WAVE8_VOLUME_TIERS)).toBe(10);
    expect(volumeDiscountPct(30, WAVE8_VOLUME_TIERS)).toBe(15);
  });

  it('calculates quote lines with BASE→TIER→CONTRACT→VOLUME→VAT and inventory check', () => {
    const line = priceLine(DJI_PRODUCTS, org, 'prod-mavic-4-pro', 5);
    expect(line.layers).toEqual(['BASE', 'CUSTOMER_TIER', 'CONTRACT', 'VOLUME', 'PROMOTION', 'VAT']);
    expect(line.volumeDiscountPct).toBe(5);
    expect(line.lineGrossEur).toBeCloseTo(line.lineNetEur + line.vatEur, 2);
    expect(line.availableUnits).toBeGreaterThanOrEqual(0);
    expect(typeof line.inventoryOk).toBe('boolean');
  });

  it('applies reverse charge VAT only when eligible + VIES valid', () => {
    const de = priceLine(DJI_PRODUCTS, org, 'prod-mavic-4-pro', 2);
    expect(de.vatRatePct).toBe(19);
    const fr = priceLine(DJI_PRODUCTS, frOrg, 'prod-mavic-4-pro', 2);
    expect(fr.vatRatePct).toBe(0);
  });

  it('enforces organization role permissions (isolation)', () => {
    expect(canAccessOrganization(WAVE8_MEMBERSHIPS, 'user-owner-1', org.id, 'approve_quote')).toBe(true);
    expect(canAccessOrganization(WAVE8_MEMBERSHIPS, 'user-viewer-1', org.id, 'approve_quote')).toBe(false);
    expect(canAccessOrganization(WAVE8_MEMBERSHIPS, 'user-outsider', org.id, 'view_quotes')).toBe(false);
    expect(canAccessOrganization(WAVE8_MEMBERSHIPS, 'user-viewer-1', frOrg.id, 'view_quotes')).toBe(false);
  });

  it('requires configurable approval thresholds', () => {
    expect(requiredApprovalLevel(9_999)).toBe('none');
    expect(requiredApprovalLevel(WAVE8_APPROVAL_THRESHOLDS.managerEur)).toBe('manager');
    expect(requiredApprovalLevel(WAVE8_APPROVAL_THRESHOLDS.financeExecutiveEur)).toBe('finance_executive');
  });

  it('runs quote workflow and PO conversion with inventory gate', () => {
    let quote = calculateQuote(DJI_PRODUCTS, org, [{ productId: 'prod-mavic-4-pro', quantity: 2 }], {
      customerPoNumber: 'PO-TEST-1'
    });
    expect(['request', 'sales_review', 'pricing_approval', 'issued']).toContain(quote.workflowStatus);
    for (const a of quote.approvals) quote = approveQuote(quote, a.role);
    quote = { ...quote, workflowStatus: 'accepted' };
    const conv = convertQuoteToOrder(quote);
    if (quote.items.every((i) => i.inventoryOk)) {
      expect(conv.ok).toBe(true);
      expect(conv.orderDraftId).toMatch(/^ord-b2b-/);
    } else {
      expect(conv.ok).toBe(false);
    }
    const legacy = toLegacyB2bQuote(quote, DJI_PRODUCTS, org);
    expect(legacy.companyName).toBe(org.companyName);
    expect(legacy.items[0].product.id).toBe('prod-mavic-4-pro');
  });

  it('builds enterprise fleets from DJI_PRODUCTS with depot preference', () => {
    const fleet = buildFleet(DJI_PRODUCTS, frOrg, {
      organizationId: frOrg.id,
      aircraftProductId: 'prod-matrice-4t',
      aircraftQty: 2,
      batteriesPerAircraft: 2,
      hubs: 1,
      controllers: 2,
      cases: 0,
      carePlans: 2,
      deliveryLocationId: frOrg.shippingLocations[0].id
    });
    expect(fleet.lines[0].productId).toBe('prod-matrice-4t');
    expect(fleet.equipmentCount).toBeGreaterThanOrEqual(2);
    expect(fleet.quote.items.every((i) => DJI_PRODUCTS.some((p) => p.id === i.productId))).toBe(true);
    expect(preferDepotForLocation('FR')).toMatch(/^CDG/);
    expect(preferDepotForLocation('NL')).toMatch(/^AMS/);
    expect(preferDepotForLocation('DE')).toMatch(/^FRA/);
  });

  it('validates inventory availability against catalog depots', () => {
    const product = DJI_PRODUCTS.find((p) => p.id === 'prod-mavic-4-pro')!;
    const units = availableUnitsForVariant(DJI_PRODUCTS, product.variants[0].id);
    expect(units).toBeGreaterThan(0);
  });

  it('certifies Wave 8 floors', () => {
    expect(bundle.organizations.every((o) => o.crmCustomerId)).toBe(true);
    expect(bundle.certification.organizationIsolationPct).toBe(100);
    expect(bundle.certification.pricingAccuracyPct).toBe(100);
    expect(bundle.certification.vatValidationIntegrityPct).toBe(100);
    expect(bundle.certification.quoteCalculationAccuracyPct).toBe(100);
    expect(bundle.certification.inventoryValidationPct).toBe(100);
    expect(bundle.certification.approvalCoveragePct).toBe(100);
    expect(bundle.certification.unauthorizedAccessAttempts).toBe(0);
    expect(bundle.certification.certified).toBe(true);
    expect(bundle.ai.every((a) => a.dataSources.length && a.confidence > 0 && a.proposedAction)).toBe(true);
  });
});
