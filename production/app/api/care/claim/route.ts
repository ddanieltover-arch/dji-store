import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { dispatchDualEmail, siteUrl } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['customerEmail', 'productId', 'claimType']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const email = String(body.customerEmail);
  const claimId = String(body.claimId ?? `CLM-${Date.now()}`);

  const payload = {
    customerEmail: email,
    productName: String(body.productName ?? body.productId),
    claimId
  };

  await dispatchDualEmail({
    userTemplateId: 'care.claim_submitted',
    adminTemplateId: 'admin.care.claim_submitted',
    locale,
    userEmail: email,
    payload,
    userCtaUrl: siteUrl(`/${locale}/account/warranty`),
    adminCtaUrl: siteUrl('/admin')
  });

  return NextResponse.json({ ok: true, claimId });
}
