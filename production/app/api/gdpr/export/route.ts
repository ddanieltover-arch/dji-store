import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { createDb } from '@/lib/db/client';
import { dispatchDualEmail, siteUrl } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['customerEmail']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const email = String(body.customerEmail);
  const requestId = String(body.requestId ?? `EXP-${Date.now()}`);

  const sql = createDb();
  await sql`
    INSERT INTO gdpr_requests (request_id, customer_email, type, status)
    VALUES (${requestId}, ${email}, 'export', 'ready')
  `;

  const payload = { customerEmail: email, requestId };

  await dispatchDualEmail({
    userTemplateId: 'gdpr.export_ready',
    adminTemplateId: 'admin.gdpr.export',
    locale,
    userEmail: email,
    payload,
    userCtaUrl: siteUrl(`/${locale}/account`),
    adminCtaUrl: siteUrl('/admin')
  });

  return NextResponse.json({ ok: true, requestId });
}
