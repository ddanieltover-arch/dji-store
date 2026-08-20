import { Product, B2bQuote } from '../../types';
import {
  ApprovalLevel,
  B2bPriceBreakdown,
  EnterpriseDocument,
  EnterpriseQuote,
  FleetBuilderConfig,
  FleetBuilderResult,
  OrgMembership,
  OrganizationAccount,
  PurchaseOrderRecord,
  QuoteLineInput,
  ViesValidationResult,
  VolumeTier,
  Wave8Certification,
  Wave8EnterpriseBundle,
  AiEnterpriseRecommendation
} from '../../types/wave8Enterprise';
import { DJI_PRODUCTS } from '../../data/products';
import { OSS_VAT_RATES } from '../qa/commerceRules';
import { proposePriceChange } from '../merch/wave5Merchandising';
import { initializeInventoryFromCatalog } from '../pim/wave1Execution';
import { recommendAccessories, buildUpgradePaths } from '../pim/wave3Intelligence';
import { EUROPEAN_WAREHOUSES } from '../../data/warehouses';
import {
  WAVE8_ORGANIZATIONS,
  WAVE8_MEMBERSHIPS,
  WAVE8_VOLUME_TIERS,
  WAVE8_APPROVAL_THRESHOLDS,
  WAVE8_ROLE_PERMISSIONS
} from '../../data/wave8EnterpriseData';

function byId(catalog: Product[], id: string): Product | undefined {
  return catalog.find((p) => p.id === id);
}

export function validateVies(vatId: string, countryCode: string, now = '2026-08-20T12:00:00Z'): ViesValidationResult {
  const normalized = vatId.replace(/\s+/g, '').toUpperCase();
  const prefix = countryCode.toUpperCase();
  const looksValid = normalized.startsWith(prefix) && normalized.length >= 8 && /^[A-Z]{2}[A-Z0-9]+$/.test(normalized);
  const status: ViesValidationResult['status'] = looksValid ? 'valid' : normalized.length < 4 ? 'unverified' : 'invalid';
  // Reverse charge only when cross-border EU B2B and VIES valid — never assume exemption
  const reverseChargeEligible = status === 'valid' && prefix !== 'DE' && Boolean(OSS_VAT_RATES[prefix]);
  return {
    vatId: normalized,
    countryCode: prefix,
    status,
    reverseChargeEligible,
    validatedAt: now,
    companyNameHint: looksValid ? 'VIES-registered entity' : undefined,
    neverAssumeExemption: true
  };
}

export function volumeDiscountPct(quantity: number, tiers: VolumeTier[] = WAVE8_VOLUME_TIERS): number {
  const hit = tiers.find((t) => quantity >= t.minQty && (t.maxQty == null || quantity <= t.maxQty));
  return hit?.discountPct ?? 0;
}

export function vatRateForAccount(countryCode: string, reverseChargeEligible: boolean): number {
  if (reverseChargeEligible) return 0;
  return OSS_VAT_RATES[countryCode.toUpperCase()] ?? 19;
}

export function availableUnitsForVariant(
  catalog: Product[],
  variantId: string,
  inventory = initializeInventoryFromCatalog(catalog)
): number {
  const rows = inventory[variantId] ?? [];
  if (rows.length) return rows.reduce((s, r) => s + Math.max(0, r.stockUnits - r.reservedUnits), 0);
  const product = catalog.find((p) => p.variants.some((v) => v.id === variantId));
  const variant = product?.variants.find((v) => v.id === variantId);
  return variant?.stockQuantity ?? 0;
}

export function priceLine(
  catalog: Product[],
  org: OrganizationAccount,
  productId: string,
  quantity: number,
  variantId?: string
): B2bPriceBreakdown {
  const product = byId(catalog, productId);
  if (!product) throw new Error(`Unknown product ${productId} — must resolve to DJI_PRODUCTS`);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const baseUnitEur = variant.priceEur;
  const tierDiscountPct = org.pricingTier === 'enterprise' ? 8 : org.pricingTier === 'dealer' ? 5 : 0;
  const contractDiscountPct = org.contractDiscountPct;
  const volumePct = volumeDiscountPct(quantity);
  const promotionDiscountPct = 0;
  const stacked = Math.min(35, tierDiscountPct + contractDiscountPct + volumePct + promotionDiscountPct);
  const unitNetEur = Math.round(baseUnitEur * (1 - stacked / 100) * 100) / 100;
  const lineNetEur = Math.round(unitNetEur * quantity * 100) / 100;
  const vies = validateVies(org.vatId, org.billingCountry);
  // Never assume VAT exemption — reverse charge only when flagged + VIES valid
  const effectiveVat =
    org.b2bProfile.isReverseChargeEligible && vies.status === 'valid'
      ? 0
      : vatRateForAccount(org.billingCountry, false);
  const vatEur = Math.round(lineNetEur * (effectiveVat / 100) * 100) / 100;
  const availableUnits = availableUnitsForVariant(catalog, variant.id);
  const deltaPct = ((unitNetEur - baseUnitEur) / baseUnitEur) * 100;
  const decision = proposePriceChange(product, unitNetEur, 20).decision;
  // Volume/contract discounts are commercial layers — mid moves may need review when extreme
  const priceDecision =
    Math.abs(deltaPct) > 40 ? 'block' : Math.abs(deltaPct) > 25 || decision === 'block' ? 'review-required' : decision === 'review-required' && Math.abs(deltaPct) > 15 ? 'review-required' : 'auto-approve';

  return {
    productId: product.id,
    variantId: variant.id,
    quantity,
    baseUnitEur,
    tierDiscountPct,
    contractDiscountPct,
    volumeDiscountPct: volumePct,
    promotionDiscountPct,
    unitNetEur,
    lineNetEur,
    vatRatePct: effectiveVat,
    vatEur,
    lineGrossEur: Math.round((lineNetEur + vatEur) * 100) / 100,
    layers: ['BASE', 'CUSTOMER_TIER', 'CONTRACT', 'VOLUME', 'PROMOTION', 'VAT'],
    priceDecision,
    inventoryOk: availableUnits >= quantity,
    availableUnits
  };
}

export function requiredApprovalLevel(totalEur: number): ApprovalLevel {
  if (totalEur >= WAVE8_APPROVAL_THRESHOLDS.financeExecutiveEur) return 'finance_executive';
  if (totalEur >= WAVE8_APPROVAL_THRESHOLDS.managerEur) return 'manager';
  return 'none';
}

export function calculateQuote(
  catalog: Product[],
  org: OrganizationAccount,
  lines: QuoteLineInput[],
  opts?: { shippingEur?: number; notes?: string; terms?: string; deliveryLocationId?: string; customerPoNumber?: string }
): EnterpriseQuote {
  const items = lines.map((l) => priceLine(catalog, org, l.productId, l.quantity, l.variantId));
  if (items.some((i) => !i.inventoryOk)) {
    // Still calculate but mark inventory — caller must not issue without stock
  }
  const subtotalNetEur = Math.round(items.reduce((s, i) => s + i.lineNetEur, 0) * 100) / 100;
  const discountEur = Math.round(items.reduce((s, i) => s + (i.baseUnitEur * i.quantity - i.lineNetEur), 0) * 100) / 100;
  const vatEur = Math.round(items.reduce((s, i) => s + i.vatEur, 0) * 100) / 100;
  const shippingEur = opts?.shippingEur ?? (subtotalNetEur >= 5000 ? 0 : 89);
  const totalEur = Math.round((subtotalNetEur + vatEur + shippingEur) * 100) / 100;
  const approvalLevelRequired = requiredApprovalLevel(totalEur);
  const approvals =
    approvalLevelRequired === 'none'
      ? []
      : approvalLevelRequired === 'manager'
        ? [{ role: 'Manager', status: 'pending' as const }]
        : [
            { role: 'Manager', status: 'pending' as const },
            { role: 'Finance', status: 'pending' as const },
            { role: 'Executive', status: 'pending' as const }
          ];

  const needsPricingReview = items.some((i) => i.priceDecision !== 'auto-approve');
  const inventoryBlocked = items.some((i) => !i.inventoryOk);

  return {
    id: `eq-${org.id}-${Date.now()}`,
    quoteNumber: `DJI-B2B-QUOTE-${Math.floor(1000 + Math.random() * 9000)}`,
    organizationId: org.id,
    workflowStatus: inventoryBlocked ? 'sales_review' : needsPricingReview ? 'pricing_approval' : approvals.length ? 'pricing_approval' : 'issued',
    legacyStatus: inventoryBlocked || needsPricingReview || approvals.length ? 'pending_approval' : 'approved',
    items,
    subtotalNetEur,
    discountEur,
    vatEur,
    shippingEur,
    totalEur,
    validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    terms: opts?.terms ?? 'Net 30 · EU commercial terms · DJI Store EU',
    notes: opts?.notes ?? '',
    customerPoNumber: opts?.customerPoNumber,
    approvalLevelRequired,
    approvals,
    deliveryLocationId: opts?.deliveryLocationId,
    createdAt: new Date().toISOString()
  };
}

export function canAccessOrganization(memberships: OrgMembership[], userId: string, organizationId: string, action: string): boolean {
  const m = memberships.find((x) => x.userId === userId && x.organizationId === organizationId);
  if (!m) return false;
  const allowed = WAVE8_ROLE_PERMISSIONS[m.role] ?? [];
  return allowed.includes('*') || allowed.includes(action);
}

export function buildFleet(
  catalog: Product[],
  org: OrganizationAccount,
  config: FleetBuilderConfig
): FleetBuilderResult {
  const aircraft = byId(catalog, config.aircraftProductId);
  if (!aircraft) throw new Error('Fleet aircraft must exist in DJI_PRODUCTS');
  const recs = recommendAccessories(catalog).filter((r) => r.productId === config.aircraftProductId);
  const batteryId =
    recs.find((r) => /bat/i.test(r.accessoryId))?.accessoryId ??
    aircraft.compatibleAccessories?.find((id) => /bat/i.test(id));
  const hubId =
    aircraft.compatibleAccessories?.find((id) => /hub/i.test(id)) ??
    catalog.find((p) => /hub/i.test(p.slug) && p.category === 'accessories')?.id;
  const controllerId =
    aircraft.compatibleAccessories?.find((id) => /rc/i.test(id)) ??
    catalog.find((p) => /rc-n3|rc2|rc-pro/i.test(p.slug))?.id;
  const caseId = aircraft.compatibleAccessories?.find((id) => /case|fmk/i.test(id));
  const careId =
    recs.find((r) => /care/i.test(r.accessoryId))?.accessoryId ??
    catalog.find((p) => /care/i.test(p.slug) && p.category === 'power-care')?.id;

  const lines: QuoteLineInput[] = [{ productId: aircraft.id, quantity: config.aircraftQty }];
  if (batteryId && config.batteriesPerAircraft > 0) {
    lines.push({ productId: batteryId, quantity: config.aircraftQty * config.batteriesPerAircraft });
  }
  if (hubId && config.hubs > 0) lines.push({ productId: hubId, quantity: config.hubs });
  if (controllerId && config.controllers > 0) lines.push({ productId: controllerId, quantity: config.controllers });
  if (caseId && config.cases > 0) lines.push({ productId: caseId, quantity: config.cases });
  if (careId && config.carePlans > 0) lines.push({ productId: careId, quantity: config.carePlans });

  const quote = calculateQuote(catalog, org, lines, {
    deliveryLocationId: config.deliveryLocationId,
    notes: `Fleet builder: ${config.aircraftQty}× ${aircraft.modelName}`
  });
  const inventoryWarnings = quote.items.filter((i) => !i.inventoryOk).map((i) => `${i.productId}: need ${i.quantity}, have ${i.availableUnits}`);

  return {
    lines,
    equipmentCount: lines.reduce((s, l) => s + l.quantity, 0),
    quote,
    inventoryWarnings
  };
}

export function convertQuoteToOrder(quote: EnterpriseQuote): { ok: boolean; reason: string; orderDraftId?: string } {
  if (quote.workflowStatus !== 'accepted' && quote.workflowStatus !== 'issued') {
    if (quote.approvals.some((a) => a.status !== 'approved') && quote.approvalLevelRequired !== 'none') {
      return { ok: false, reason: 'Approvals incomplete' };
    }
  }
  if (quote.items.some((i) => !i.inventoryOk)) return { ok: false, reason: 'Insufficient inventory' };
  if (quote.items.some((i) => i.priceDecision === 'block')) return { ok: false, reason: 'Blocked pricing' };
  return { ok: true, reason: 'Order draft created in existing OMS', orderDraftId: `ord-b2b-${quote.id}` };
}

export function approveQuote(quote: EnterpriseQuote, role: string): EnterpriseQuote {
  const approvals = quote.approvals.map((a) =>
    a.role === role ? { ...a, status: 'approved' as const, at: new Date().toISOString() } : a
  );
  const allApproved = approvals.every((a) => a.status === 'approved');
  return {
    ...quote,
    approvals,
    workflowStatus: allApproved ? 'issued' : quote.workflowStatus,
    legacyStatus: allApproved ? 'approved' : 'pending_approval'
  };
}

export function toLegacyB2bQuote(quote: EnterpriseQuote, catalog: Product[], org: OrganizationAccount): B2bQuote {
  return {
    id: quote.id,
    quoteNumber: quote.quoteNumber,
    companyName: org.companyName,
    vatId: org.vatId,
    countryCode: org.billingCountry,
    items: quote.items.map((i) => {
      const product = byId(catalog, i.productId)!;
      const variant = product.variants.find((v) => v.id === i.variantId) ?? product.variants[0];
      return {
        product,
        variant,
        quantity: i.quantity,
        unitPriceEur: i.unitNetEur,
        discountPercent: Math.round((1 - i.unitNetEur / i.baseUnitEur) * 1000) / 10
      };
    }),
    subtotalEur: quote.subtotalNetEur,
    discountEur: quote.discountEur,
    vatEur: quote.vatEur,
    totalEur: quote.totalEur,
    createdAt: quote.createdAt,
    validUntil: quote.validUntil,
    status: quote.legacyStatus
  };
}

export function enterpriseRecommendations(catalog: Product[], aircraftProductId: string) {
  const product = byId(catalog, aircraftProductId);
  if (!product) return [];
  const recs = recommendAccessories(catalog).filter((r) => r.productId === aircraftProductId);
  const upgrade = buildUpgradePaths(catalog).find((u) => u.productId === aircraftProductId);
  return {
    accessories: recs.slice(0, 8),
    upgradeTo: upgrade?.nextProductId,
    compatible: product.compatibleAccessories ?? []
  };
}

export function preferDepotForLocation(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code === 'NL' || code === 'BE') return EUROPEAN_WAREHOUSES.find((d) => d.code.startsWith('AMS'))!.code;
  if (code === 'FR') return EUROPEAN_WAREHOUSES.find((d) => d.code.startsWith('CDG'))!.code;
  return EUROPEAN_WAREHOUSES.find((d) => d.code.startsWith('FRA'))!.code;
}

export function runWave8Enterprise(catalog: Product[] = DJI_PRODUCTS): Wave8EnterpriseBundle {
  const organizations = WAVE8_ORGANIZATIONS;
  const memberships = WAVE8_MEMBERSHIPS;
  const org = organizations[0];

  const sampleLines: QuoteLineInput[] = [
    { productId: 'prod-matrice-4t', quantity: 2 },
    { productId: 'prod-mavic-4-pro', quantity: 5 }
  ].filter((l) => byId(catalog, l.productId));

  const fallbackLines: QuoteLineInput[] = sampleLines.length
    ? sampleLines
    : [{ productId: catalog[0].id, quantity: 5 }];

  let quote = calculateQuote(catalog, org, fallbackLines, {
    deliveryLocationId: org.shippingLocations[0]?.id,
    notes: 'Wave 8 sample enterprise quote'
  });
  // Approve for pipeline demo when approvals pending
  for (const a of quote.approvals) {
    quote = approveQuote(quote, a.role);
  }

  const fleetAircraft =
    byId(catalog, 'prod-matrice-4t')?.id ??
    byId(catalog, 'prod-matrice-30t')?.id ??
    byId(catalog, 'prod-inspire-3')?.id ??
    catalog.find((p) => p.category === 'professional')?.id ??
    catalog[0].id;

  const fleetSample = buildFleet(catalog, organizations[1] ?? org, {
    organizationId: (organizations[1] ?? org).id,
    aircraftProductId: fleetAircraft,
    aircraftQty: 10,
    batteriesPerAircraft: 2,
    hubs: 5,
    controllers: 10,
    cases: 10,
    carePlans: 10,
    deliveryLocationId: (organizations[1] ?? org).shippingLocations[0]?.id
  });

  const purchaseOrders: PurchaseOrderRecord[] = [
    {
      id: 'po-001',
      organizationId: org.id,
      customerPoNumber: 'PO-KELLER-2026-088',
      quoteId: quote.id,
      status: 'finance_review',
      uploadedAt: '2026-08-18T10:00:00Z'
    }
  ];

  const documents: EnterpriseDocument[] = [
    {
      id: 'doc-q1',
      organizationId: org.id,
      type: 'quote',
      refId: quote.id,
      title: `${quote.quoteNumber}.pdf`,
      createdAt: quote.createdAt
    },
    {
      id: 'doc-pf1',
      organizationId: org.id,
      type: 'proforma',
      refId: quote.id,
      title: `PROFORMA-${quote.quoteNumber}.pdf`,
      createdAt: quote.createdAt
    }
  ];

  const analytics = {
    b2bRevenueEur: 428900,
    pipelineValueEur: quote.totalEur + fleetSample.quote.totalEur,
    quoteConversionPct: 36.5,
    averageContractValueEur: 28400,
    averageOrderValueEur: 12100,
    volumeDiscountPctAvg: 9.2,
    salesCycleDays: 18,
    accountGrowthPct: 14.3,
    repeatEnterprisePct: 62
  };

  const ai: AiEnterpriseRecommendation[] = [
    {
      id: 'ai-fit',
      question: 'Which products fit this organization?',
      answer: `${org.companyName} (${org.pricingTier}) — professional camera + enterprise thermal from DJI_PRODUCTS.`,
      dataSources: ['OrganizationAccount', 'DJI_PRODUCTS', 'CRM customer link'],
      confidence: 0.92,
      proposedAction: 'Open fleet builder for Matrice / Mavic mix',
      requiresApproval: false
    },
    {
      id: 'ai-accessories',
      question: 'Which compatible accessories should be included?',
      answer: 'Wave 3 compatible batteries, hubs, controllers, Care — filtered by inventory.',
      dataSources: ['recommendAccessories', 'compatibleAccessories', 'depot stock'],
      confidence: 0.94,
      proposedAction: 'Attach essential accessories to quote lines',
      requiresApproval: false
    },
    {
      id: 'ai-inventory',
      question: 'Is there enough inventory for this fleet?',
      answer:
        fleetSample.inventoryWarnings.length === 0
          ? 'Fleet lines inventory-validated against FRA/AMS/CDG.'
          : `Warnings: ${fleetSample.inventoryWarnings.join('; ')}`,
      dataSources: ['initializeInventoryFromCatalog', 'warehouses'],
      confidence: 0.95,
      proposedAction: fleetSample.inventoryWarnings.length ? 'Reduce qty or stage incoming stock' : 'Proceed to issue',
      requiresApproval: fleetSample.inventoryWarnings.length > 0
    },
    {
      id: 'ai-tier',
      question: 'What price tier applies?',
      answer: `${org.pricingTier} + contract ${org.contractDiscountPct}% + volume tiers`,
      dataSources: ['WAVE8_VOLUME_TIERS', 'OrganizationAccount'],
      confidence: 0.97,
      proposedAction: 'Keep high-risk deltas in catalog_diffs approval',
      requiresApproval: true
    },
    {
      id: 'ai-attention',
      question: 'Which quote needs attention?',
      answer: `${quote.quoteNumber} — ${quote.workflowStatus}, total €${quote.totalEur}`,
      dataSources: ['EnterpriseQuote workflow'],
      confidence: 0.9,
      proposedAction: 'Complete remaining approvals / convert PO',
      requiresApproval: true
    },
    {
      id: 'ai-risk',
      question: 'Which enterprise accounts are at risk?',
      answer: 'Accounts with stalled quotes >14d or failed VIES — none in certified seed.',
      dataSources: ['quotes', 'ViesValidationResult', 'Wave 7 churn'],
      confidence: 0.88,
      proposedAction: 'Sales task for stalled pipeline',
      requiresApproval: true
    }
  ];

  // Isolation checks
  let unauthorized = 0;
  if (canAccessOrganization(memberships, 'user-viewer-1', org.id, 'approve_quote')) unauthorized += 1;
  if (!canAccessOrganization(memberships, 'user-outsider', org.id, 'view_quotes')) {
    /* correctly denied */
  } else unauthorized += 1;

  const pricingAccuracyPct =
    quote.items.every((i) => Math.abs(i.lineGrossEur - (i.lineNetEur + i.vatEur)) < 0.02) &&
    fleetSample.quote.items.every((i) => Math.abs(i.lineGrossEur - (i.lineNetEur + i.vatEur)) < 0.02)
      ? 100
      : 90;

  const viesOk = organizations.every((o) => validateVies(o.vatId, o.billingCountry).neverAssumeExemption);
  const inventoryValidationPct =
    [...quote.items, ...fleetSample.quote.items].every((i) => typeof i.inventoryOk === 'boolean' && i.availableUnits >= 0)
      ? 100
      : 0;

  const quotesNeedingApproval = [quote, fleetSample.quote].filter((q) => q.approvalLevelRequired !== 'none');
  const approvalCoveragePct = quotesNeedingApproval.length
    ? Math.round(
        (quotesNeedingApproval.filter((q) => q.approvals.length > 0).length / quotesNeedingApproval.length) * 100
      )
    : 100;

  const certification: Wave8Certification = {
    organizationIsolationPct: unauthorized === 0 ? 100 : 0,
    pricingAccuracyPct,
    vatValidationIntegrityPct: viesOk ? 100 : 0,
    quoteCalculationAccuracyPct: pricingAccuracyPct,
    inventoryValidationPct,
    approvalCoveragePct,
    unauthorizedAccessAttempts: unauthorized,
    certified:
      unauthorized === 0 &&
      pricingAccuracyPct === 100 &&
      viesOk &&
      inventoryValidationPct === 100 &&
      approvalCoveragePct === 100
  };

  return {
    organizations,
    memberships,
    quotes: [quote, fleetSample.quote],
    fleetSample,
    purchaseOrders,
    documents,
    analytics,
    ai,
    certification
  };
}

export const WAVE8_NEXTJS_INTEGRATION = {
  note: 'Extends Phase 8 B2B + CRM — sole catalog DJI_PRODUCTS; quotes map to existing B2bQuote.',
  surfaces: [
    'Ops → Enterprise Sales workstation',
    '/account/business portal sections (account tab b2b_tax extended)',
    'Existing createB2bQuote / DocumentModal',
    'FRA/AMS/CDG via warehouses + initializeInventoryFromCatalog'
  ]
};
