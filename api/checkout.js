const { createDb, ensureOrdersTable } = require('./_lib/db');
const { sendOrderEmails } = require('./_lib/email');
const { readBody, send, wrap } = require('./_lib/auth');

function isManualSettlementMethod(method) {
  const value = String(method || '');
  return (
    value === 'sepa_bank_wire' ||
    value === 'revolut_bank' ||
    value === 'bank_transfer_sepa' ||
    value.startsWith('crypto_')
  );
}

function checkoutIdempotencyKey(customerId, cartFingerprint) {
  return `checkout:${customerId}:${cartFingerprint}`;
}

module.exports = wrap(async function checkout(req, res) {
  if ((req.method || '') !== 'POST') return send(res, { error: 'method_not_allowed' }, 405);

  const body = readBody(req);
  const customerId = String(body.customerId || '');
  const cartFingerprint = String(body.cartFingerprint || '');
  const customerEmail = String(body.customerEmail || body.email || '').trim();
  const idempotencyKey = String(
    body.idempotencyKey || checkoutIdempotencyKey(customerId, cartFingerprint)
  );

  if (!customerId || !cartFingerprint || !customerEmail) {
    return send(res, { error: 'missing_fields' }, 400);
  }

  await ensureOrdersTable();
  const sql = createDb();

  const existingRows = await sql`
    SELECT id, payment_intent_id, idempotency_key
    FROM orders
    WHERE idempotency_key = ${idempotencyKey}
    LIMIT 1
  `;
  const existing = existingRows[0];
  if (existing) {
    return send(res, { status: 'duplicate_replay', orderId: existing.id }, 200);
  }

  const paymentMethod = String(body.paymentMethod || 'card');
  const orderStatus = isManualSettlementMethod(paymentMethod) ? 'pending_payment' : 'confirmed';
  const emailStatus = orderStatus === 'pending_payment' ? 'payment_pending' : 'confirmed';

  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  const inserted = await sql`
    INSERT INTO orders (customer_id, idempotency_key, status, payload)
    VALUES (${customerId}, ${idempotencyKey}, ${orderStatus}, ${payload}::jsonb)
    RETURNING id
  `;
  const orderId = String(inserted[0].id);

  try {
    await sendOrderEmails({
      body: { ...body, orderNumber: body.orderNumber || orderId },
      status: emailStatus
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'email_failed';
    return send(
      res,
      {
        status: 'committed',
        orderId,
        emailError: message
      },
      201
    );
  }

  return send(res, { status: 'committed', orderId }, 201);
});
