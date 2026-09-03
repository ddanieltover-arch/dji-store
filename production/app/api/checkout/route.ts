import { checkoutIdempotencyKey, resolveCheckoutAttempt } from '@shared/lib/performance/checkoutIdempotency';
import { isManualSettlementMethod } from '@shared/lib/payments/checkoutTotals';
import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { createDb } from '@/lib/db/client';
import { sendOrderEmails } from '@/lib/email/orderEmails';
import { linkSupportAttachment } from '@/lib/storage/assets';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const customerId = String(body.customerId ?? '');
  const cartFingerprint = String(body.cartFingerprint ?? '');
  const idempotencyKey = String(body.idempotencyKey ?? checkoutIdempotencyKey(customerId, cartFingerprint));

  const missing = requireFields(body, ['customerId', 'cartFingerprint', 'customerEmail']);
  if (missing) return badRequest(`missing_${missing}`);

  const sql = createDb();
  const existingRows = await sql`
    SELECT id, payment_intent_id, idempotency_key
    FROM orders
    WHERE idempotency_key = ${idempotencyKey}
    LIMIT 1
  `;
  const existing = existingRows[0] ?? null;

  const attempt = resolveCheckoutAttempt(
    existing?.payment_intent_id ?? null,
    idempotencyKey,
    existing?.idempotency_key ?? idempotencyKey
  );

  if (attempt === 'duplicate_replay') {
    return NextResponse.json({ status: 'duplicate_replay', orderId: existing?.id }, { status: 200 });
  }

  const paymentMethod = String(body.paymentMethod ?? 'card');
  const orderStatus = isManualSettlementMethod(paymentMethod) ? 'pending_payment' : 'confirmed';

  try {
    const inserted = await sql`
      INSERT INTO orders (customer_id, idempotency_key, status, payload)
      VALUES (${customerId}, ${idempotencyKey}, ${orderStatus}, ${JSON.stringify(body)}::jsonb)
      RETURNING id
    `;
    const orderId = String(inserted[0].id);
    const locale = getLocale(body, req);

    const receiptAssetId = String(body.receiptAssetId ?? body.paymentDetails?.receiptAssetId ?? '').trim();
    if (receiptAssetId) {
      await linkSupportAttachment({
        ownerType: 'order',
        ownerId: orderId,
        assetId: receiptAssetId,
        fileName: String(body.paymentDetails?.receiptFileName ?? 'transfer_receipt.pdf'),
        mimeType: String(body.receiptMimeType ?? 'application/pdf')
      });
    }

    await sendOrderEmails({
      locale,
      body: { ...body, orderNumber: body.orderNumber ?? orderId },
      orderId,
      status: orderStatus === 'pending_payment' ? 'payment_pending' : 'confirmed'
    });

    return NextResponse.json({ status: 'committed', orderId }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'order_insert_failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
