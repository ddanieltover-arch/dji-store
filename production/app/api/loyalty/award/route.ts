import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { getAdminEmail } from '@/lib/email/config';
import { dispatchEmail, siteUrl } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['customerEmail', 'points', 'reason']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const email = String(body.customerEmail);
  const payload = {
    customerEmail: email,
    points: String(body.points),
    reason: String(body.reason)
  };

  await Promise.all([
    dispatchEmail({
      templateId: 'loyalty.points_awarded',
      audience: 'user',
      locale,
      to: email,
      payload,
      ctaUrl: siteUrl(`/${locale}/account`)
    }),
    dispatchEmail({
      templateId: 'admin.loyalty.awarded',
      audience: 'admin',
      locale: 'en',
      to: getAdminEmail(),
      payload,
      ctaUrl: siteUrl('/admin')
    })
  ]);

  return NextResponse.json({ ok: true });
}
