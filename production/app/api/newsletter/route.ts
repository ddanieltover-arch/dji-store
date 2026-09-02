import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { createDb } from '@/lib/db/client';
import { dispatchDualEmail, siteUrl } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['email']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const email = String(body.email);

  const sql = createDb();
  await sql`
    INSERT INTO newsletter_subscribers (email, locale, marketing_consent)
    VALUES (${email}, ${locale}, TRUE)
    ON CONFLICT (email) DO UPDATE SET locale = EXCLUDED.locale, marketing_consent = TRUE
  `;
  await sql`
    INSERT INTO notification_preferences (customer_email, marketing_consent, product_restocks, price_drop_alerts)
    VALUES (${email}, TRUE, TRUE, TRUE)
    ON CONFLICT (customer_email) DO UPDATE SET marketing_consent = TRUE, product_restocks = TRUE, updated_at = now()
  `;

  const payload = { customerEmail: email };

  await dispatchDualEmail({
    userTemplateId: 'newsletter.welcome',
    adminTemplateId: 'admin.newsletter.subscriber',
    locale,
    userEmail: email,
    payload,
    userCtaUrl: siteUrl(`/${locale}`),
    adminCtaUrl: siteUrl('/admin')
  });

  return NextResponse.json({ ok: true });
}
