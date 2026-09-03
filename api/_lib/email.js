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

function lineItemsHtml(lineItems) {
  if (!Array.isArray(lineItems) || !lineItems.length) return '<p>No line items</p>';
  return `<ul>${lineItems
    .map(
      (item) =>
        `<li>${escapeHtml(item.quantity)}× ${escapeHtml(item.name || item.sku)} — €${escapeHtml(item.priceEur)}</li>`
    )
    .join('')}</ul>`;
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
      text: text || html.replace(/<[^>]+>/g, ' '),
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
  const orderNumber = String(body.orderNumber || '');
  const customerEmail = String(body.customerEmail || body.email || '');
  const customerName = String(body.customerName || `${body.firstName || ''} ${body.lastName || ''}`.trim());
  const totalEur = String(body.totalEur ?? '');
  const paymentMethod = String(body.paymentMethod || 'card');
  const lineItems = Array.isArray(body.lineItems) ? body.lineItems : [];
  const pending = status === 'payment_pending';

  if (!customerEmail) throw new Error('no_customer_email');

  const customerSubject = pending
    ? `Payment pending — Order #${orderNumber}`
    : `Order confirmed — #${orderNumber}`;
  const adminSubject = pending
    ? `Admin: payment pending — #${orderNumber}`
    : `Admin: new order — #${orderNumber}`;

  const details = `
    <p><strong>Order:</strong> ${escapeHtml(orderNumber)}</p>
    <p><strong>Customer:</strong> ${escapeHtml(customerName)} &lt;${escapeHtml(customerEmail)}&gt;</p>
    <p><strong>Payment:</strong> ${escapeHtml(paymentMethod)}</p>
    <p><strong>Total:</strong> €${escapeHtml(totalEur)}</p>
    ${lineItemsHtml(lineItems)}
    <p><a href="${siteUrl('/admin')}">Open admin console</a></p>
  `;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2>${pending ? 'We received your order' : 'Thank you for your order'}</h2>
      <p>Hi ${escapeHtml(customerName || 'there')},</p>
      <p>${
        pending
          ? 'Your order is registered and awaiting payment verification.'
          : 'Your DJI Store EU order is confirmed.'
      }</p>
      ${details}
      <p><a href="${siteUrl('/track-order')}">Track your order</a></p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2>${pending ? 'Payment pending' : 'New order'}</h2>
      ${details}
    </div>
  `;

  const [customer, admin] = await Promise.all([
    sendResendEmail({ to: customerEmail, subject: customerSubject, html: customerHtml }),
    sendResendEmail({ to: adminEmail(), subject: adminSubject, html: adminHtml })
  ]);

  return { customer, admin };
}

module.exports = { sendOrderEmails, adminEmail, siteUrl };
