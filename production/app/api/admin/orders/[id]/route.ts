import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { requireAdmin } from '@/lib/auth/guards';
import { createDb } from '@/lib/db/client';
import { sendOrderStatusEmail } from '@/lib/email/orderEmails';
import { dispatchEmail, siteUrl } from '@/lib/email/send';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(_req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const sql = createDb();
  const rows = await sql`
    SELECT id, customer_id, status, payload, created_at
    FROM orders
    WHERE id = ${id}
    LIMIT 1
  `;
  if (!rows.length) return badRequest('order_not_found');
  return NextResponse.json({ order: rows[0] });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const body = await req.json();
  const sql = createDb();

  const rows = await sql`SELECT id, status, payload FROM orders WHERE id = ${id} LIMIT 1`;
  if (!rows.length) return badRequest('order_not_found');

  const currentPayload = (rows[0].payload ?? {}) as Record<string, unknown>;
  const nextPayload = {
    ...currentPayload,
    ...(body.payload && typeof body.payload === 'object' ? body.payload : {}),
    ...(body.customerEmail ? { customerEmail: String(body.customerEmail) } : {}),
    ...(body.orderNumber ? { orderNumber: String(body.orderNumber) } : {})
  };

  const nextStatus = body.status ? String(body.status) : String(rows[0].status);

  await sql`
    UPDATE orders
    SET status = ${nextStatus}, payload = ${JSON.stringify(nextPayload)}::jsonb
    WHERE id = ${id}
  `;

  return NextResponse.json({ ok: true, id, status: nextStatus, payload: nextPayload });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const sql = createDb();

  const rows = await sql`SELECT id FROM orders WHERE id = ${id} LIMIT 1`;
  if (!rows.length) return badRequest('order_not_found');

  await sql`DELETE FROM orders WHERE id = ${id}`;
  return NextResponse.json({ ok: true, deleted: id });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const body = await req.json();
  const status = String(body.status ?? '');
  const allowed = ['payment_confirmed', 'shipped', 'delivered', 'rma_approved', 'review_published'];
  if (!allowed.includes(status)) return badRequest('invalid_status');

  const locale = getLocale(body, req);
  const sql = createDb();

  if (status.startsWith('payment') || status === 'shipped' || status === 'delivered') {
    const rows = await sql`SELECT payload FROM orders WHERE id = ${id} LIMIT 1`;
    if (!rows.length) return badRequest('order_not_found');
    const payload = rows[0].payload as Record<string, unknown>;
    await sql`UPDATE orders SET status = ${status.replace('_', ' ')} WHERE id = ${id}`;
    await sendOrderStatusEmail({
      locale,
      body: { ...payload, orderNumber: id },
      status: status as 'payment_confirmed' | 'shipped' | 'delivered'
    });
    return NextResponse.json({ ok: true });
  }

  if (status === 'rma_approved') {
    const missing = requireFields(body, ['customerEmail', 'rmaNumber', 'productName']);
    if (missing) return badRequest(`missing_${missing}`);
    await sql`UPDATE rma_requests SET status = 'approved' WHERE rma_number = ${String(body.rmaNumber)}`;
    await dispatchEmail({
      templateId: 'rma.approved',
      audience: 'user',
      locale,
      to: String(body.customerEmail),
      payload: {
        rmaNumber: String(body.rmaNumber),
        productName: String(body.productName)
      },
      ctaUrl: siteUrl(`/${locale}/account/service`)
    });
    return NextResponse.json({ ok: true });
  }

  if (status === 'review_published') {
    const missing = requireFields(body, ['customerEmail', 'productName', 'reviewId']);
    if (missing) return badRequest(`missing_${missing}`);
    await sql`UPDATE product_reviews SET status = 'published' WHERE id = ${String(body.reviewId)}`;
    await dispatchEmail({
      templateId: 'review.published',
      audience: 'user',
      locale,
      to: String(body.customerEmail),
      payload: { productName: String(body.productName) },
      ctaUrl: siteUrl(`/${locale}/products/${body.productSlug ?? ''}`)
    });
    return NextResponse.json({ ok: true });
  }

  return badRequest('unsupported_status');
}
