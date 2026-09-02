import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { getAdminEmail } from '@/lib/email/config';
import { dispatchDualEmail, dispatchEmail, siteUrl } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['customerEmail', 'refereeEmail', 'refereeName']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const referrerEmail = String(body.customerEmail);
  const refereeEmail = String(body.refereeEmail);
  const referralCode = String(body.referralCode ?? `REF-${Date.now()}`);

  const payload = {
    customerEmail: referrerEmail,
    referrerName: String(body.referrerName ?? body.customerName ?? 'A Flight Club member'),
    refereeName: String(body.refereeName),
    refereeEmail,
    productName: String(body.productName ?? 'DJI Store EU'),
    referralCode
  };

  await Promise.all([
    dispatchEmail({
      templateId: 'referral.invite',
      audience: 'user',
      locale,
      to: refereeEmail,
      payload,
      ctaUrl: siteUrl(`/${locale}?ref=${referralCode}`)
    }),
    dispatchEmail({
      templateId: 'admin.referral.sent',
      audience: 'admin',
      locale: 'en',
      to: getAdminEmail(),
      payload,
      ctaUrl: siteUrl('/admin')
    })
  ]);

  return NextResponse.json({ ok: true, referralCode });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['customerEmail', 'refereeName', 'points']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);

  await dispatchEmail({
    templateId: 'referral.reward_earned',
    audience: 'user',
    locale,
    to: String(body.customerEmail),
    payload: {
      refereeName: String(body.refereeName),
      points: String(body.points)
    },
    ctaUrl: siteUrl(`/${locale}/account`)
  });

  return NextResponse.json({ ok: true });
}
