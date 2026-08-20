import { Locale } from '../types';
import { OnboardingStep } from '../types/wave7Lifecycle';
import { Wave1RolloutStep } from '../types/wave1Execution';

export const WAVE7_OWNERSHIP_ALIASES: Record<string, string> = {
  'dji-care-m4p-2y': 'acc-care-m4p',
  'dji-ronin-4d-8k': 'prod-ronin-4d'
};

/** CRM tokens not present in DJI_PRODUCTS — excluded from ownership accuracy (no fabricated SKUs). */
export const WAVE7_OUT_OF_CATALOG_OWNERSHIP = new Set(['dji-matrice-350-rtk', 'dji-zenmuse-p1']);

export const WAVE7_ONBOARDING_STEPS: OnboardingStep[] = [
  { day: 0, key: 'order_confirmation', title: 'Order confirmation — {{product}}', templateKey: 'order_confirmation' },
  { day: 1, key: 'getting_started', title: 'Getting started with {{product}}', templateKey: 'getting_started' },
  { day: 3, key: 'setup_guidance', title: 'Setup guidance for {{product}}', templateKey: 'setup_guidance' },
  { day: 7, key: 'compatibility_edu', title: 'Compatible accessories for {{product}}', templateKey: 'compatibility_edu' },
  { day: 14, key: 'review_invite', title: 'How is your {{product}} flying?', templateKey: 'review_invite' },
  { day: 30, key: 'accessory_reco', title: 'Personalized accessories for {{product}}', templateKey: 'accessory_reco' }
];

export const WAVE7_MESSAGE_TEMPLATES: Record<string, Partial<Record<Locale, { subject: string; body: string }>>> = {
  order_confirmation: {
    en: { subject: 'Your DJI Store EU order is confirmed', body: 'Thank you — {{product}} is allocated at an EU depot.' },
    de: { subject: 'Ihre Bestellung im DJI Store EU ist bestätigt', body: 'Danke — {{product}} wurde einem EU-Lager zugewiesen.' },
    fr: { subject: 'Votre commande DJI Store EU est confirmée', body: 'Merci — {{product}} est alloué à un dépôt UE.' },
    es: { subject: 'Tu pedido en DJI Store EU está confirmado', body: 'Gracias — {{product}} está asignado a un depósito UE.' },
    it: { subject: 'Il tuo ordine DJI Store EU è confermato', body: 'Grazie — {{product}} è allocato in un deposito UE.' },
    nl: { subject: 'Je DJI Store EU-bestelling is bevestigd', body: 'Bedankt — {{product}} is toegewezen aan een EU-depot.' }
  },
  getting_started: {
    en: { subject: 'Getting started with {{product}}', body: 'Official getting-started tips from the certified catalog.' },
    de: { subject: 'Erste Schritte mit {{product}}', body: 'Offizielle Tipps aus dem zertifizierten Katalog.' },
    fr: { subject: 'Premiers pas avec {{product}}', body: 'Conseils officiels issus du catalogue certifié.' },
    es: { subject: 'Primeros pasos con {{product}}', body: 'Consejos oficiales del catálogo certificado.' },
    it: { subject: 'Primi passi con {{product}}', body: 'Suggerimenti ufficiali dal catalogo certificato.' },
    nl: { subject: 'Aan de slag met {{product}}', body: 'Officiële tips uit de gecertificeerde catalogus.' }
  },
  setup_guidance: {
    en: { subject: 'Setup guidance for {{product}}', body: 'Use official manuals and EASA-aware setup from product intelligence.' },
    de: { subject: 'Einrichtung von {{product}}', body: 'Offizielle Handbücher und EASA-Hinweise.' },
    fr: { subject: 'Configuration de {{product}}', body: 'Manuels officiels et conseils EASA.' },
    es: { subject: 'Configuración de {{product}}', body: 'Manuales oficiales y orientación EASA.' },
    it: { subject: 'Configurazione di {{product}}', body: 'Manuali ufficiali e guida EASA.' },
    nl: { subject: 'Installatie van {{product}}', body: 'Officiële handleidingen en EASA-richtlijnen.' }
  },
  compatibility_edu: {
    en: { subject: 'Compatible gear for {{product}}', body: 'Accessories from Wave 3 relationships on DJI_PRODUCTS.' },
    de: { subject: 'Kompatibles Zubehör für {{product}}', body: 'Zubehör aus Wave-3-Beziehungen.' },
    fr: { subject: 'Accessoires compatibles pour {{product}}', body: 'Accessoires issus des relations Wave 3.' },
    es: { subject: 'Accesorios compatibles para {{product}}', body: 'Accesorios de relaciones Wave 3.' },
    it: { subject: 'Accessori compatibili per {{product}}', body: 'Accessori dalle relazioni Wave 3.' },
    nl: { subject: 'Compatibele accessoires voor {{product}}', body: 'Accessoires uit Wave 3-relaties.' }
  },
  review_invite: {
    en: { subject: 'Share your {{product}} experience', body: 'Invite to review — non-deceptive, optional.' },
    de: { subject: 'Bewerten Sie {{product}}', body: 'Optionale Bewertungsbitte.' },
    fr: { subject: 'Donnez votre avis sur {{product}}', body: 'Invitation optionnelle à un avis.' },
    es: { subject: 'Opina sobre {{product}}', body: 'Invitación opcional a reseñar.' },
    it: { subject: 'Recensisci {{product}}', body: 'Invito opzionale alla recensione.' },
    nl: { subject: 'Beoordeel {{product}}', body: 'Optionele beoordelingsuitnodiging.' }
  },
  accessory_reco: {
    en: { subject: 'Accessories for your {{product}}', body: 'Personalized Day-30 recommendations from ownership + Wave 3.' },
    de: { subject: 'Zubehör für Ihr {{product}}', body: 'Personalisierte Empfehlungen aus Ownership + Wave 3.' },
    fr: { subject: 'Accessoires pour votre {{product}}', body: 'Recommandations J+30 personnalisées.' },
    es: { subject: 'Accesorios para tu {{product}}', body: 'Recomendaciones personalizadas día 30.' },
    it: { subject: 'Accessori per il tuo {{product}}', body: 'Consigli personalizzati giorno 30.' },
    nl: { subject: 'Accessoires voor je {{product}}', body: 'Gepersonaliseerde dag-30-aanbevelingen.' }
  }
};

/** Only include officialIntervalDays when we treat it as known merchandising guidance — not fabricated OEM intervals. */
export const WAVE7_REPLENISHMENT_HINTS: {
  match: RegExp;
  reason: string;
  officialIntervalDays?: number;
}[] = [
  { match: /bat|battery/i, reason: 'Spare intelligent battery commonly purchased with aircraft (no fabricated OEM interval)' },
  { match: /prop/i, reason: 'Propellers are wear items — remind only when previously purchased; interval unknown officially' },
  { match: /nd|filter/i, reason: 'ND filters for lighting conditions — recommendation only' },
  { match: /care/i, reason: 'Care Refresh eligibility from ownership tags' }
];

export const WAVE7_TRIGGERS = [
  'order_delivered',
  'product_registered',
  'review_submitted',
  'firmware_released',
  'warranty_nearing_expiry',
  'care_nearing_expiry',
  'cart_abandoned',
  'product_viewed_repeatedly',
  'loyalty_tier_achieved',
  'referral_completed',
  'customer_reactivated'
] as const;

export const WAVE7_ROLLOUT: Wave1RolloutStep[] = [
  {
    id: 'W7-R0',
    window: 'T-48h',
    action: 'Apply supabase/wave7_lifecycle.sql; map CRM customers to lifecycle stages',
    owner: 'Platform',
    gate: 'SQL migrate green'
  },
  {
    id: 'W7-R1',
    window: 'T-36h',
    action: 'Wire consent gates to Phase 11 marketingConsent + suppression list',
    owner: 'Privacy',
    gate: 'consentViolations = 0'
  },
  {
    id: 'W7-R2',
    window: 'T-24h',
    action: 'Activate first-purchase onboarding (D0–D30) using purchased SKU + Wave 3',
    owner: 'CRM',
    gate: 'duplicate sends = 0'
  },
  {
    id: 'W7-R3',
    window: 'T-16h',
    action: 'Ownership journeys + care/warranty/firmware events (localized EN–NL)',
    owner: 'Retention',
    gate: 'localizationCoverage = 100%'
  },
  {
    id: 'W7-R4',
    window: 'T-10h',
    action: 'Churn scoring + re-engagement using Wave 6 personalization inputs',
    owner: 'Growth',
    gate: 'explainable churn signals'
  },
  {
    id: 'W7-R5',
    window: 'T-4h',
    action: 'Loyalty progress + referral attribution on existing Phase 9 accounts',
    owner: 'Loyalty',
    gate: 'loyaltyIntegration = 100%'
  },
  {
    id: 'W7-R6',
    window: 'T0',
    action: 'Certify Wave 7; publish Ops → Lifecycle workstation (async only)',
    owner: 'Launch Commander',
    gate: 'all Wave 7 floors green'
  }
];
