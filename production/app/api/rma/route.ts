import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { createDb } from '@/lib/db/client';
import { dispatchDualEmail, siteUrl } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['customerEmail', 'productId', 'reason']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const email = String(body.customerEmail);
  const rmaNumber = String(body.rmaNumber ?? `RMA-${Date.now()}`);

  const sql = createDb();
  const id = `rma-${Date.now()}`;
  await sql`
    INSERT INTO rma_requests (id, rma_number, customer_email, product_id, reason, description, status)
    VALUES (
      ${id},
      ${rmaNumber},
      ${email},
      ${String(body.productId)},
      ${String(body.reason)},
      ${body.description ? String(body.description) : null},
      'submitted'
    )
  `;

  const payload = {
    customerEmail: email,
    productName: String(body.productName ?? body.productId),
    rmaNumber,
    reason: String(body.reason)
  };

  await dispatchDualEmail({
    userTemplateId: 'rma.submitted',
    adminTemplateId: 'admin.rma.submitted',
    locale,
    userEmail: email,
    payload,
    userCtaUrl: siteUrl(`/${locale}/account/service`),
    adminCtaUrl: siteUrl('/admin')
  });

  return NextResponse.json({ ok: true, id, rmaNumber });
}
