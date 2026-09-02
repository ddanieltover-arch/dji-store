import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { dispatchDualEmail, dispatchEmail, siteUrl } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['customerEmail', 'productId', 'quantity']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const email = String(body.customerEmail);
  const quoteNumber = String(body.quoteNumber ?? `Q-${Date.now()}`);

  const payload = {
    customerEmail: email,
    companyName: String(body.companyName ?? 'Enterprise customer'),
    productName: String(body.productName ?? body.productId),
    quantity: String(body.quantity),
    quoteNumber
  };

  await dispatchDualEmail({
    userTemplateId: 'b2b.quote_created',
    adminTemplateId: 'admin.b2b.quote_created',
    locale,
    userEmail: email,
    payload,
    userCtaUrl: siteUrl(`/${locale}/account/business`),
    adminCtaUrl: siteUrl('/admin')
  });

  return NextResponse.json({ ok: true, quoteNumber });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['customerEmail', 'vatId', 'validationStatus']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const email = String(body.customerEmail);

  await dispatchEmail({
    templateId: 'b2b.vat_validated',
    audience: 'user',
    locale,
    to: email,
    payload: {
      vatId: String(body.vatId),
      validationStatus: String(body.validationStatus)
    },
    ctaUrl: siteUrl(`/${locale}/account/business`)
  });

  return NextResponse.json({ ok: true });
}
