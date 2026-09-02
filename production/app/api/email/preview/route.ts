import { NextRequest, NextResponse } from 'next/server';
import type { EmailEvent, TemplateId } from '@/lib/email/events';
import { EMAIL_LOCALES } from '@/lib/email/events';
import { renderEmailHtml } from '@/lib/email/render';
import { ALL_TEMPLATE_IDS } from '@/lib/email/templates';

const SAMPLE_PAYLOAD = {
  orderNumber: 'ORD-2026-001',
  customerName: 'Alex Pilot',
  customerEmail: 'pilot@example.com',
  productName: 'DJI Mavic 4 Pro',
  paymentMethod: 'SEPA bank wire',
  totalEur: '1,899.00',
  trackingNumber: 'DHL-EU-123456',
  serialNumber: '1581F6XBC2304910',
  rmaNumber: 'RMA-2026-0042',
  claimId: 'CLM-2026-001',
  quoteNumber: 'Q-2026-100',
  companyName: 'Aerial Films GmbH',
  quantity: '5',
  rating: '5',
  points: '500',
  reason: 'Manual award — community contribution',
  referralCode: 'FLY-EU-42',
  referrerName: 'SkyLukas',
  refereeName: 'Marie',
  refereeEmail: 'marie@example.com',
  voucherCode: 'CART25-EU',
  requestId: 'GDPR-2026-001',
  vatId: 'DE123456789',
  validationStatus: 'valid',
  newPrice: '1,749.00',
  oldPrice: '1,899.00',
  expiryDate: '2027-03-01'
};

/** Dev/staging preview — render template HTML without sending. */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production' && !process.env.EMAIL_PREVIEW_ENABLED) {
    return NextResponse.json({ error: 'disabled' }, { status: 403 });
  }

  const templateId = (req.nextUrl.searchParams.get('template') ?? 'order.confirmed') as TemplateId;
  const locale = (req.nextUrl.searchParams.get('locale') ?? 'en') as EmailEvent['locale'];
  const audience = (req.nextUrl.searchParams.get('audience') ?? 'user') as EmailEvent['audience'];

  if (!ALL_TEMPLATE_IDS.includes(templateId)) {
    return NextResponse.json({ error: 'unknown_template', templates: ALL_TEMPLATE_IDS }, { status: 400 });
  }
  if (!EMAIL_LOCALES.includes(locale)) {
    return NextResponse.json({ error: 'unknown_locale', locales: EMAIL_LOCALES }, { status: 400 });
  }

  const event: EmailEvent = {
    templateId,
    audience,
    locale: audience === 'admin' ? 'en' : locale,
    to: 'preview@example.com',
    payload: SAMPLE_PAYLOAD,
    ctaUrl: 'https://djii.eu/en/track-order'
  };

  const { html, subject, preview } = await renderEmailHtml(event);
  const accept = req.headers.get('accept') ?? '';
  if (accept.includes('text/html')) {
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
  return NextResponse.json({ templateId, locale, audience, subject, preview, htmlLength: html.length });
}
