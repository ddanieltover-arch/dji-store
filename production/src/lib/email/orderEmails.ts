import type { EmailLocale, EmailPayload, OrderLineItem, TemplateId } from './events';
import { getAdminEmail } from './config';
import { dispatchDualEmail, dispatchEmail, siteUrl } from '../email/send';

function formatStatusLabel(value: string): string {
  return value.replace(/_/g, ' ').trim() || 'updated';
}

export function resolveStatusEmailTemplates(args: {
  orderStatus: string;
  paymentStatus: string;
  previousOrderStatus?: string;
  previousPaymentStatus?: string;
}): { user: TemplateId; admin: TemplateId } {
  const orderChanged = Boolean(args.previousOrderStatus && args.orderStatus !== args.previousOrderStatus);
  const paymentChanged = Boolean(args.previousPaymentStatus && args.paymentStatus !== args.previousPaymentStatus);

  if (orderChanged && args.orderStatus === 'shipped') {
    return { user: 'order.shipped', admin: 'admin.order.status_updated' };
  }
  if (orderChanged && args.orderStatus === 'delivered') {
    return { user: 'order.delivered', admin: 'admin.order.status_updated' };
  }
  if (paymentChanged && args.paymentStatus === 'confirmed') {
    return { user: 'order.payment_confirmed', admin: 'admin.order.payment_confirmed' };
  }
  if (paymentChanged && args.paymentStatus === 'verifying') {
    return { user: 'order.payment_pending', admin: 'admin.order.payment_pending' };
  }
  if (paymentChanged && args.paymentStatus === 'dispatched') {
    return { user: 'order.shipped', admin: 'admin.order.status_updated' };
  }
  if (paymentChanged && args.paymentStatus === 'delivered') {
    return { user: 'order.delivered', admin: 'admin.order.status_updated' };
  }
  if (orderChanged && args.orderStatus === 'confirmed') {
    return { user: 'order.confirmed', admin: 'admin.order.status_updated' };
  }
  if (orderChanged && (args.orderStatus === 'pending_payment' || args.orderStatus === 'payment_under_review')) {
    return { user: 'order.payment_pending', admin: 'admin.order.payment_pending' };
  }

  return { user: 'order.status_updated', admin: 'admin.order.status_updated' };
}

export function buildOrderPayload(body: Record<string, unknown>): EmailPayload {
  const lineItems = Array.isArray(body.lineItems) ? (body.lineItems as OrderLineItem[]) : [];
  const orderStatus = String(body.orderStatus ?? body.status ?? '');
  const paymentStatus = String(body.paymentStatus ?? '');
  return {
    orderNumber: String(body.orderNumber ?? body.orderId ?? ''),
    customerName: String(body.customerName ?? `${body.firstName ?? ''} ${body.lastName ?? ''}`.trim()),
    customerEmail: String(body.customerEmail ?? body.email ?? ''),
    productName: String(body.productName ?? lineItems[0]?.name ?? 'DJI products'),
    paymentMethod: String(body.paymentMethod ?? 'card'),
    totalEur: String(body.totalEur ?? ''),
    trackingNumber: String(body.trackingNumber ?? ''),
    statusLabel: formatStatusLabel(orderStatus),
    paymentStatusLabel: formatStatusLabel(paymentStatus),
    previousStatusLabel: formatStatusLabel(String(body.previousOrderStatus ?? '')),
    previousPaymentStatusLabel: formatStatusLabel(String(body.previousPaymentStatus ?? '')),
    lineItemsJson: lineItems.length ? JSON.stringify(lineItems) : undefined
  };
}

export async function sendOrderStatusChangeEmails(args: {
  locale: EmailLocale;
  body: Record<string, unknown>;
}): Promise<{ ok: boolean; error?: string }> {
  const payload = buildOrderPayload(args.body);
  const email = String(payload.customerEmail ?? '');
  if (!email) return { ok: false, error: 'no_email' };

  const templates = resolveStatusEmailTemplates({
    orderStatus: String(args.body.orderStatus ?? args.body.status ?? ''),
    paymentStatus: String(args.body.paymentStatus ?? ''),
    previousOrderStatus: args.body.previousOrderStatus ? String(args.body.previousOrderStatus) : undefined,
    previousPaymentStatus: args.body.previousPaymentStatus ? String(args.body.previousPaymentStatus) : undefined
  });

  const [userResult, adminResult] = await Promise.all([
    dispatchEmail({
      templateId: templates.user,
      audience: 'user',
      locale: args.locale,
      to: email,
      payload,
      ctaUrl: siteUrl(`/${args.locale}/track-order`)
    }),
    dispatchEmail({
      templateId: templates.admin,
      audience: 'admin',
      locale: 'en',
      to: getAdminEmail(),
      payload,
      ctaUrl: siteUrl('/admin')
    })
  ]);

  if (!userResult.ok || !adminResult.ok) {
    return { ok: false, error: userResult.error ?? adminResult.error ?? 'send_failed' };
  }
  return { ok: true };
}

export async function sendOrderEmails(args: {
  locale: EmailLocale;
  body: Record<string, unknown>;
  orderId: string;
  status: 'confirmed' | 'payment_pending';
}) {
  const payload = buildOrderPayload({ ...args.body, orderNumber: args.body.orderNumber ?? args.orderId });
  const email = String(payload.customerEmail ?? '');
  if (!email) return;

  const userTemplate = args.status === 'payment_pending' ? 'order.payment_pending' : 'order.confirmed';
  const adminTemplate = args.status === 'payment_pending' ? 'admin.order.payment_pending' : 'admin.order.new';

  await dispatchDualEmail({
    userTemplateId: userTemplate,
    adminTemplateId: adminTemplate,
    locale: args.locale,
    userEmail: email,
    payload,
    userCtaUrl: siteUrl(`/${args.locale}/track-order`),
    adminCtaUrl: siteUrl('/admin')
  });
}

export async function sendOrderStatusEmail(args: {
  locale: EmailLocale;
  body: Record<string, unknown>;
  status: 'payment_confirmed' | 'shipped' | 'delivered';
}) {
  const payload = buildOrderPayload(args.body);
  const email = String(payload.customerEmail ?? '');
  if (!email) return;

  const map = {
    payment_confirmed: 'order.payment_confirmed',
    shipped: 'order.shipped',
    delivered: 'order.delivered'
  } as const;

  await dispatchEmail({
    templateId: map[args.status],
    audience: 'user',
    locale: args.locale,
    to: email,
    payload,
    ctaUrl: siteUrl(`/${args.locale}/track-order`)
  });

  if (args.status === 'payment_confirmed') {
    await dispatchEmail({
      templateId: 'admin.order.payment_confirmed',
      audience: 'admin',
      locale: 'en',
      to: getAdminEmail(),
      payload,
      ctaUrl: siteUrl('/admin')
    });
  }
}
