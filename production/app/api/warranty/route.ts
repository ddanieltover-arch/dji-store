import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { createDb } from '@/lib/db/client';
import { dispatchDualEmail, siteUrl } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['customerEmail', 'productId', 'serialNumber']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const email = String(body.customerEmail);
  const productId = String(body.productId);
  const serialNumber = String(body.serialNumber);

  const sql = createDb();
  const id = `wr-${Date.now()}`;
  await sql`
    INSERT INTO warranty_registrations (id, customer_email, product_id, serial_number, remote_serial)
    VALUES (${id}, ${email}, ${productId}, ${serialNumber}, ${body.remoteSerial ? String(body.remoteSerial) : null})
  `;

  const payload = {
    customerEmail: email,
    productName: String(body.productName ?? productId),
    serialNumber
  };

  await dispatchDualEmail({
    userTemplateId: 'warranty.registered',
    adminTemplateId: 'admin.warranty.registered',
    locale,
    userEmail: email,
    payload,
    userCtaUrl: siteUrl(`/${locale}/account/products`),
    adminCtaUrl: siteUrl('/admin')
  });

  return NextResponse.json({ ok: true, id });
}
