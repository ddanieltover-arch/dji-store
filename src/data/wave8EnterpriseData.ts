import { INITIAL_B2B_PROFILE } from './orderOperations';
import {
  OrgMembership,
  OrganizationAccount,
  OrgRole,
  VolumeTier
} from '../types/wave8Enterprise';

export const WAVE8_VOLUME_TIERS: VolumeTier[] = [
  { minQty: 1, maxQty: 4, discountPct: 0, label: 'standard' },
  { minQty: 5, maxQty: 9, discountPct: 5, label: 'Tier 1' },
  { minQty: 10, maxQty: 24, discountPct: 10, label: 'Tier 2' },
  { minQty: 25, maxQty: null, discountPct: 15, label: 'Enterprise' }
];

/** Configurable approval thresholds (EUR total) */
export const WAVE8_APPROVAL_THRESHOLDS = {
  managerEur: 10_000,
  financeExecutiveEur: 50_000
};

export const WAVE8_ROLE_PERMISSIONS: Record<OrgRole, string[]> = {
  OWNER: ['*'],
  ADMIN: [
    'view_quotes',
    'view_orders',
    'view_docs',
    'create_quote',
    'approve_quote',
    'manage_users',
    'upload_po',
    'view_pricing'
  ],
  PROCUREMENT: ['view_quotes', 'view_orders', 'create_quote', 'upload_po', 'view_docs'],
  FINANCE: ['view_quotes', 'view_orders', 'view_docs', 'approve_quote', 'view_pricing'],
  OPERATOR: ['view_quotes', 'view_orders', 'view_docs'],
  VIEWER: ['view_quotes', 'view_orders', 'view_docs']
};

export const WAVE8_ORGANIZATIONS: OrganizationAccount[] = [
  {
    id: 'org-keller-aerial',
    crmCustomerId: 'cust-lukas-weber',
    companyName: 'Keller Aerial Cinema GmbH',
    legalEntity: 'Keller Aerial Cinema GmbH',
    vatId: 'DE389201948',
    registrationNumber: 'HRB 892019',
    billingCountry: 'DE',
    billingAddress: 'Sonnenstraße 12, 80331 München, Germany',
    shippingLocations: [
      {
        id: 'loc-hq-muc',
        label: 'Headquarters',
        countryCode: 'DE',
        city: 'Munich',
        preferredDepotCode: 'FRA-01'
      },
      {
        id: 'loc-wh-fra',
        label: 'Warehouse',
        countryCode: 'DE',
        city: 'Frankfurt',
        preferredDepotCode: 'FRA-01'
      },
      {
        id: 'loc-site-ams',
        label: 'Project site',
        countryCode: 'NL',
        city: 'Amsterdam',
        preferredDepotCode: 'AMS-02'
      }
    ],
    primaryContact: 'Lukas Keller',
    financeContact: 'finance@cinematography-eu.de',
    procurementContact: 'procurement@cinematography-eu.de',
    accountManager: 'Elena Vogt',
    pricingTier: 'enterprise',
    contractDiscountPct: 3,
    b2bProfile: { ...INITIAL_B2B_PROFILE }
  },
  {
    id: 'org-euro-inspect',
    crmCustomerId: 'cust-lukas-weber',
    companyName: 'EuroInspect SAS',
    legalEntity: 'EuroInspect SAS',
    vatId: 'FR89320194801',
    registrationNumber: 'SIRET 893 201 948 00012',
    billingCountry: 'FR',
    billingAddress: '14 Rue de la Paix, 75002 Paris, France',
    shippingLocations: [
      {
        id: 'loc-hq-cdg',
        label: 'Headquarters',
        countryCode: 'FR',
        city: 'Paris',
        preferredDepotCode: 'CDG-03'
      },
      {
        id: 'loc-branch-lyon',
        label: 'Regional branch',
        countryCode: 'FR',
        city: 'Lyon',
        preferredDepotCode: 'CDG-03'
      }
    ],
    primaryContact: 'Camille Dupont',
    financeContact: 'finance@euroinspect.fr',
    procurementContact: 'achats@euroinspect.fr',
    accountManager: 'Marc Lefèvre',
    pricingTier: 'dealer',
    contractDiscountPct: 2,
    b2bProfile: {
      companyName: 'EuroInspect SAS',
      vatId: 'FR89320194801',
      viesStatus: 'valid',
      countryCode: 'FR',
      isReverseChargeEligible: true,
      contactPerson: 'Camille Dupont',
      billingEmail: 'billing@euroinspect.fr',
      phone: '+33 1 42 00 00 00'
    }
  }
];

export const WAVE8_MEMBERSHIPS: OrgMembership[] = [
  { organizationId: 'org-keller-aerial', userId: 'user-owner-1', role: 'OWNER' },
  { organizationId: 'org-keller-aerial', userId: 'user-admin-1', role: 'ADMIN' },
  { organizationId: 'org-keller-aerial', userId: 'user-finance-1', role: 'FINANCE' },
  { organizationId: 'org-keller-aerial', userId: 'user-viewer-1', role: 'VIEWER' },
  { organizationId: 'org-euro-inspect', userId: 'user-owner-fr', role: 'OWNER' },
  { organizationId: 'org-euro-inspect', userId: 'user-proc-fr', role: 'PROCUREMENT' }
];

export const WAVE8_PIPELINE_STAGES = [
  'prospect',
  'qualified',
  'quote_request',
  'negotiation',
  'verbal_commit',
  'closed_won',
  'closed_lost'
] as const;

export const WAVE8_ROLLOUT = [
  { id: 'R1', action: 'Org accounts + CRM link', owner: 'Commerce', gate: 'identity' },
  { id: 'R2', action: 'VIES + reverse charge', owner: 'Tax', gate: 'compliance' },
  { id: 'R3', action: 'Quote + volume pricing', owner: 'Sales', gate: 'pricing' },
  { id: 'R4', action: 'Fleet + multi-depot', owner: 'Ops', gate: 'inventory' },
  { id: 'R5', action: 'Approvals + documents', owner: 'Finance', gate: 'governance' }
];
