import { GenericAdminEmail } from '../../emails/templates/admin/GenericAdminEmail';
import { GenericUserEmail } from '../../emails/templates/user/GenericUserEmail';
import type { EmailAudience, TemplateId } from './events';
import type { ComponentType } from 'react';
import type { EmailTemplateProps } from './events';

export const templateRegistry: Record<
  TemplateId,
  { audience: EmailAudience; component: ComponentType<EmailTemplateProps> }
> = {} as Record<TemplateId, { audience: EmailAudience; component: ComponentType<EmailTemplateProps> }>;

function register(id: TemplateId, audience: EmailAudience, component: ComponentType<EmailTemplateProps>) {
  templateRegistry[id] = { audience, component };
}

const userIds: TemplateId[] = [
  'order.confirmed',
  'order.payment_pending',
  'order.payment_confirmed',
  'order.shipped',
  'order.delivered',
  'order.status_updated',
  'warranty.registered',
  'rma.submitted',
  'rma.approved',
  'care.claim_submitted',
  'review.submitted',
  'review.published',
  'b2b.quote_created',
  'b2b.vat_validated',
  'newsletter.welcome',
  'referral.invite',
  'referral.reward_earned',
  'loyalty.points_awarded',
  'alert.restock',
  'alert.price_drop',
  'gdpr.export_ready',
  'gdpr.erasure_received',
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
  'lifecycle.accessory_reco'
];

const adminIds: TemplateId[] = [
  'admin.order.new',
  'admin.order.payment_pending',
  'admin.order.payment_confirmed',
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

for (const id of userIds) register(id, 'user', GenericUserEmail);
for (const id of adminIds) register(id, 'admin', GenericAdminEmail);

export function getTemplateComponent(templateId: TemplateId): ComponentType<EmailTemplateProps> {
  const entry = templateRegistry[templateId];
  if (!entry) throw new Error(`Unknown template: ${templateId}`);
  return entry.component;
}

export const ALL_TEMPLATE_IDS = [...userIds, ...adminIds] as TemplateId[];
