import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { createDb } from '@/lib/db/client';
import { dispatchDualEmail, siteUrl } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const missing = requireFields(body, ['customerEmail', 'productId', 'rating', 'title', 'content']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const email = String(body.customerEmail);

  const sql = createDb();
  const id = `rev-${Date.now()}`;
  await sql`
    INSERT INTO product_reviews (id, customer_email, product_id, rating, title, content, status)
    VALUES (${id}, ${email}, ${String(body.productId)}, ${Number(body.rating)}, ${String(body.title)}, ${String(body.content)}, 'pending')
  `;

  const payload = {
    customerEmail: email,
    productName: String(body.productName ?? body.productId),
    rating: String(body.rating)
  };

  await dispatchDualEmail({
    userTemplateId: 'review.submitted',
    adminTemplateId: 'admin.review.submitted',
    locale,
    userEmail: email,
    payload,
    userCtaUrl: siteUrl(`/${locale}/products/${body.productSlug ?? body.productId}`),
    adminCtaUrl: siteUrl('/admin')
  });

  return NextResponse.json({ ok: true, id });
}
