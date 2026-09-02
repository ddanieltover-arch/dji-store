export const EMAIL_LOCALES = ['en', 'de', 'fr', 'es', 'it', 'nl'] as const;
export type EmailLocale = (typeof EMAIL_LOCALES)[number];
export type EmailAudience = 'user' | 'admin';

export type EmailCopy = {
  subject: string;
  preview: string;
  headline: string;
  body: string;
  cta?: string;
  footer?: string;
  badge?: string;
};

export type TemplateId =
  | 'order.confirmed'
  | 'order.payment_pending'
  | 'order.payment_confirmed'
  | 'order.shipped'
  | 'order.delivered'
  | 'order.status_updated'
  | 'warranty.registered'
  | 'rma.submitted'
  | 'rma.approved'
  | 'care.claim_submitted'
  | 'review.submitted'
  | 'review.published'
  | 'b2b.quote_created'
  | 'b2b.vat_validated'
  | 'newsletter.welcome'
  | 'referral.invite'
  | 'referral.reward_earned'
  | 'loyalty.points_awarded'
  | 'alert.restock'
  | 'alert.price_drop'
  | 'gdpr.export_ready'
  | 'gdpr.erasure_received'
  | 'marketing.cart_abandoned_1h'
  | 'marketing.cart_abandoned_24h'
  | 'marketing.cart_abandoned_72h'
  | 'marketing.browse_abandonment_48h'
  | 'marketing.post_purchase_14d'
  | 'marketing.post_purchase_30d'
  | 'marketing.care_upsell_90d'
  | 'marketing.warranty_renewal_300d'
  | 'lifecycle.getting_started'
  | 'lifecycle.setup_guidance'
  | 'lifecycle.compatibility_edu'
  | 'lifecycle.review_invite'
  | 'lifecycle.accessory_reco'
  | 'admin.order.new'
  | 'admin.order.payment_pending'
  | 'admin.order.payment_confirmed'
  | 'admin.order.status_updated'
  | 'admin.warranty.registered'
  | 'admin.rma.submitted'
  | 'admin.care.claim_submitted'
  | 'admin.review.submitted'
  | 'admin.b2b.quote_created'
  | 'admin.newsletter.subscriber'
  | 'admin.referral.sent'
  | 'admin.gdpr.export'
  | 'admin.gdpr.erasure'
  | 'admin.loyalty.awarded';

export const MARKETING_TEMPLATES: TemplateId[] = [
  'marketing.cart_abandoned_1h',
  'marketing.cart_abandoned_24h',
  'marketing.cart_abandoned_72h',
  'marketing.browse_abandonment_48h',
  'marketing.post_purchase_14d',
  'marketing.post_purchase_30d',
  'marketing.care_upsell_90d',
  'marketing.warranty_renewal_300d',
  'lifecycle.getting_started',
  'lifecycle.setup_guidance',
  'lifecycle.compatibility_edu',
  'lifecycle.review_invite',
  'lifecycle.accessory_reco',
  'alert.restock',
  'alert.price_drop',
  'newsletter.welcome',
  'referral.invite'
];

export const ADMIN_TEMPLATES: TemplateId[] = [
  'admin.order.new',
  'admin.order.payment_pending',
  'admin.order.payment_confirmed',
  'admin.order.status_updated',
  'admin.warranty.registered',
  'admin.rma.submitted',
  'admin.care.claim_submitted',
  'admin.review.submitted',
  'admin.b2b.quote_created',
  'admin.newsletter.subscriber',
  'admin.referral.sent',
  'admin.gdpr.export',
  'admin.gdpr.erasure',
  'admin.loyalty.awarded'
];

export type EmailPayload = Record<string, string | number | boolean | undefined | null>;

export type EmailEvent = {
  templateId: TemplateId;
  audience: EmailAudience;
  locale: EmailLocale;
  to: string;
  payload?: EmailPayload;
  ctaUrl?: string;
};

export type EmailTemplateProps = {
  templateId: TemplateId;
  locale: EmailLocale;
  payload: EmailPayload;
  ctaUrl?: string;
  lineItems?: OrderLineItem[];
};

export type OrderLineItem = {
  name: string;
  sku?: string;
  quantity: number;
  priceEur: number;
};

export type OrderEmailPayload = EmailPayload & {
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  productName?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  totalEur?: string;
  lineItems?: OrderLineItem[];
};
