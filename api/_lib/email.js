const COLORS = {
  background: '#f4f4f5',
  card: '#ffffff',
  text: '#18181b',
  muted: '#71717a',
  accent: '#0066ff',
  border: '#e4e4e7',
  adminBanner: '#fef3c7',
  adminBannerText: '#92400e'
};

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";

const COPY = {
  'order.confirmed': {
    subject: 'Your DJI Store EU order {{orderNumber}} is confirmed',
    preview: 'Thank you for your order',
    headline: 'Order confirmed',
    body: 'Hi {{customerName}}, thank you for your order. {{productName}} has been allocated at an EU depot and is being prepared for dispatch.',
    cta: 'Track your order',
    badge: 'Confirmed'
  },
  'order.payment_pending': {
    subject: 'Complete payment for order {{orderNumber}}',
    preview: 'Payment instructions inside',
    headline: 'Payment required',
    body: 'Your order {{orderNumber}} is reserved. Please complete payment via {{paymentMethod}} to confirm allocation.',
    cta: 'View payment details',
    badge: 'Action required'
  },
  'admin.order.new': {
    subject: '[Admin] New order {{orderNumber}}',
    preview: 'New order requires processing',
    headline: 'New order received',
    body: 'Customer {{customerName}} ({{customerEmail}}) placed order {{orderNumber}} for {{productName}}. Total: €{{totalEur}}.',
    cta: 'Open admin',
    badge: 'New order'
  },
  'admin.order.payment_pending': {
    subject: '[Admin] Payment verification — {{orderNumber}}',
    preview: 'SEPA/crypto payment pending',
    headline: 'Verify payment',
    body: 'Order {{orderNumber}} from {{customerEmail}} requires payment verification via {{paymentMethod}}.',
    cta: 'Verify payment',
    badge: 'Payment queue'
  }
};

function emailFrom() {
  return process.env.EMAIL_FROM || 'DJI Store <sales@djii.eu>';
}

function adminEmail() {
  return (process.env.ADMIN_EMAIL || 'sales@djii.eu').trim();
}

function siteUrl(path = '/') {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.djii.eu').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function interpolate(template, payload) {
  return String(template || '').replace(/\{\{(\w+)\}\}/g, (_, key) => String(payload[key] ?? ''));
}

function paymentMethodDisplayName(method) {
  switch (String(method || '')) {
    case 'sepa_bank_wire':
    case 'bank_transfer_sepa':
      return 'SEPA Bank Wire';
    case 'revolut_bank':
      return 'Revolut Banking';
    case 'crypto_usdt':
    case 'crypto_btc':
    case 'crypto_eth':
      return 'Web3 Cryptocurrency';
    case 'card':
      return 'Card';
    default:
      return String(method || 'Payment');
  }
}

function formatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value ?? '');
  return num.toFixed(2);
}

function buildPayload(body) {
  const lineItems = Array.isArray(body.lineItems) ? body.lineItems : [];
  const productName = String(body.productName || lineItems[0]?.name || 'DJI products');
  return {
    orderNumber: String(body.orderNumber || ''),
    customerName: String(body.customerName || `${body.firstName || ''} ${body.lastName || ''}`.trim()),
    customerEmail: String(body.customerEmail || body.email || ''),
    productName,
    paymentMethod: paymentMethodDisplayName(body.paymentMethod || 'card'),
    totalEur: formatMoney(body.totalEur ?? ''),
    trackingNumber: String(body.trackingNumber || body.trackingToken || ''),
    lineItems
  };
}

function orderSummaryHtml(lineItems, totalEur) {
  if (!lineItems.length) return '';
  const rows = lineItems
    .map((item) => {
      const qty = Number(item.quantity || 1);
      const price = formatMoney(item.priceEur ?? 0);
      const sku = item.sku ? ` (${escapeHtml(item.sku)})` : '';
      return `<p style="color:${COLORS.text};font-family:${FONT};font-size:14px;margin:0 0 6px;">${escapeHtml(qty)}× ${escapeHtml(item.name || item.sku)}${sku} — €${escapeHtml(price)}</p>`;
    })
    .join('');

  return `
    <div style="margin:24px 0;">
      <p style="color:${COLORS.text};font-family:${FONT};font-size:14px;font-weight:600;margin:0 0 12px;">Items</p>
      ${rows}
      <hr style="border:none;border-top:1px solid ${COLORS.border};margin:12px 0;" />
      <p style="color:${COLORS.text};font-family:${FONT};font-size:15px;font-weight:700;margin:0;">Total: €${escapeHtml(totalEur)}</p>
    </div>
  `;
}

function detailTableHtml(rows) {
  if (!rows.length) return '';
  const body = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="color:${COLORS.muted};font-family:${FONT};font-size:13px;padding:8px 0;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="color:${COLORS.text};font-family:${FONT};font-size:13px;padding:8px 0;font-weight:600;">${escapeHtml(value)}</td>
      </tr>`
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;">${body}</table>`;
}

function renderBrandedEmail({ audience, templateId, payload, ctaUrl }) {
  const copy = COPY[templateId];
  if (!copy) throw new Error(`Unknown template: ${templateId}`);

  const subject = interpolate(copy.subject, payload);
  const preview = interpolate(copy.preview, payload);
  const headline = interpolate(copy.headline, payload);
  const body = interpolate(copy.body, payload);
  const badge = copy.badge ? interpolate(copy.badge, payload) : '';
  const cta = copy.cta ? interpolate(copy.cta, payload) : '';

  const adminBanner =
    audience === 'admin'
      ? `
      <div style="background:${COLORS.adminBanner};border-radius:8px;padding:12px 14px;margin:0 0 20px;">
        <p style="color:${COLORS.adminBannerText};font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 4px;">Admin alert</p>
        <p style="color:${COLORS.adminBannerText};font-family:${FONT};font-size:13px;margin:0;">Internal operations notification — do not forward to customers.</p>
      </div>`
      : '';

  const detailRows =
    audience === 'admin'
      ? [
          ['Customer', payload.customerName],
          ['Email', payload.customerEmail],
          ['Order', payload.orderNumber],
          ['Product', payload.productName],
          ['Total EUR', payload.totalEur],
          ['Payment', payload.paymentMethod]
        ].filter(([, v]) => v)
      : [
          ['Order', payload.orderNumber],
          ['Product', payload.productName],
          ['Payment', payload.paymentMethod],
          ['Tracking', payload.trackingNumber]
        ].filter(([, v]) => v);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:24px 0;background:${COLORS.background};font-family:${FONT};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.card};border-radius:8px;padding:32px;">
          <tr>
            <td>
              ${adminBanner}
              <p style="color:${COLORS.muted};font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">DJI Store EU</p>
              ${
                badge
                  ? `<span style="display:inline-block;background:${COLORS.background};color:${COLORS.accent};border-radius:999px;font-size:12px;font-weight:600;padding:4px 10px;margin:0 0 12px;">${escapeHtml(badge)}</span>`
                  : ''
              }
              <h1 style="color:${COLORS.text};font-family:${FONT};font-size:24px;font-weight:700;line-height:1.3;margin:0 0 16px;">${escapeHtml(headline)}</h1>
              <p style="color:${COLORS.text};font-family:${FONT};font-size:15px;line-height:1.6;margin:0 0 8px;">${escapeHtml(body)}</p>
              ${orderSummaryHtml(payload.lineItems, payload.totalEur)}
              ${detailTableHtml(detailRows)}
              ${
                cta && ctaUrl
                  ? `<div style="margin-top:24px;"><a href="${escapeHtml(ctaUrl)}" style="background:${COLORS.accent};border-radius:6px;color:#ffffff;display:inline-block;font-family:${FONT};font-size:14px;font-weight:600;line-height:100%;padding:12px 24px;text-decoration:none;">${escapeHtml(cta)}</a></div>`
                  : ''
              }
              <hr style="border:none;border-top:1px solid ${COLORS.border};margin:32px 0 24px;" />
              <p style="color:${COLORS.muted};font-family:${FONT};font-size:12px;line-height:1.6;margin:0 0 8px;">Questions? Contact us at ${escapeHtml(adminEmail())}</p>
              <p style="color:${COLORS.muted};font-family:${FONT};font-size:12px;line-height:1.6;margin:0 0 8px;">DJI Store EU · Certified European Distribution</p>
              <p style="margin:0;">
                <a href="${escapeHtml(siteUrl('/'))}" style="color:${COLORS.accent};font-size:12px;margin-right:12px;text-decoration:none;">Visit store</a>
                <a href="${escapeHtml(siteUrl('/privacy'))}" style="color:${COLORS.accent};font-size:12px;text-decoration:none;">Privacy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    audience === 'admin' ? 'Admin alert — internal notification' : '',
    headline,
    '',
    body,
    '',
    ...payload.lineItems.map(
      (item) => `- ${item.quantity}x ${item.name || item.sku} — EUR ${formatMoney(item.priceEur ?? 0)}`
    ),
    payload.totalEur ? `Total: EUR ${payload.totalEur}` : '',
    cta && ctaUrl ? `${cta}: ${ctaUrl}` : ''
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, html, text };
}

async function sendResendEmail({ to, subject, html, text }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Missing RESEND_API_KEY');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: emailFrom(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      reply_to: process.env.EMAIL_REPLY_TO || adminEmail()
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || `resend_http_${response.status}`);
  }
  return data;
}

async function sendOrderEmails({ body, status }) {
  const payload = buildPayload(body);
  if (!payload.customerEmail) throw new Error('no_customer_email');

  const pending = status === 'payment_pending';
  const userTemplateId = pending ? 'order.payment_pending' : 'order.confirmed';
  const adminTemplateId = pending ? 'admin.order.payment_pending' : 'admin.order.new';

  const userEmail = renderBrandedEmail({
    audience: 'user',
    templateId: userTemplateId,
    payload,
    ctaUrl: siteUrl('/track-order')
  });

  const adminMail = renderBrandedEmail({
    audience: 'admin',
    templateId: adminTemplateId,
    payload,
    ctaUrl: siteUrl('/admin')
  });

  const [customer, admin] = await Promise.all([
    sendResendEmail({
      to: payload.customerEmail,
      subject: userEmail.subject,
      html: userEmail.html,
      text: userEmail.text
    }),
    sendResendEmail({
      to: adminEmail(),
      subject: adminMail.subject,
      html: adminMail.html,
      text: adminMail.text
    })
  ]);

  return { customer, admin };
}

module.exports = { sendOrderEmails, adminEmail, siteUrl, renderBrandedEmail, buildPayload };
