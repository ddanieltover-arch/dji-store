const { createDb, ensureOrdersTable } = require('../_lib/db');
const { getUserFromToken, readToken, readBody, send, wrap } = require('../_lib/auth');

function mapRowToPlacedOrder(row) {
  const payload = row.payload && typeof row.payload === 'object' ? row.payload : {};
  if (payload.placedOrder && typeof payload.placedOrder === 'object') {
    return {
      ...payload.placedOrder,
      dbId: row.id,
      status: payload.placedOrder.status || row.status
    };
  }

  const shipping = payload.shippingAddress || {};
  return {
    orderNumber: String(payload.orderNumber || row.id),
    trackingToken: String(payload.trackingToken || ''),
    createdAt: row.created_at,
    customer: {
      firstName: String(payload.firstName || ''),
      lastName: String(payload.lastName || ''),
      email: String(payload.customerEmail || ''),
      phone: String(payload.phone || '')
    },
    shippingAddress: {
      street: String(shipping.street || ''),
      postalCode: String(shipping.postalCode || ''),
      city: String(shipping.city || ''),
      countryCode: String(shipping.countryCode || ''),
      countryName: String(shipping.countryName || shipping.countryCode || '')
    },
    items: Array.isArray(payload.lineItems)
      ? payload.lineItems.map((item) => ({
          sku: String(item.sku || ''),
          productName: String(item.name || item.sku || ''),
          quantity: Number(item.quantity || 1),
          priceEur: Number(item.priceEur || 0),
          productId: String(item.productId || ''),
          variantId: String(item.variantId || '')
        }))
      : [],
    subtotalEur: Number(payload.subtotalEur || 0),
    shippingEur: Number(payload.shippingEur || 0),
    discountEur: Number(payload.discountEur || 0),
    totalEur: Number(payload.totalEur || 0),
    paymentMethod: String(payload.paymentMethod || 'card'),
    paymentStatus: row.status === 'pending_payment' ? 'verifying' : 'confirmed',
    status: row.status,
    dbId: row.id
  };
}

module.exports = wrap(async function adminOrders(req, res) {
  const user = await getUserFromToken(readToken(req));
  if (!user || user.role !== 'admin') {
    return send(res, { error: 'unauthorized' }, 401);
  }

  await ensureOrdersTable();
  const sql = createDb();

  if ((req.method || '') === 'GET') {
    const rows = await sql`
      SELECT id, customer_id, status, payload, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 200
    `;
    const orders = rows.map(mapRowToPlacedOrder);
    return send(res, { orders });
  }

  if ((req.method || '') === 'DELETE') {
    const body = readBody(req);
    const orderId = String(body.id || body.orderId || '');
    const orderNumber = String(body.orderNumber || '');
    if (!orderId && !orderNumber) return send(res, { error: 'missing_id' }, 400);

    if (orderId) {
      await sql`DELETE FROM orders WHERE id = ${orderId}`;
    } else {
      await sql`DELETE FROM orders WHERE payload->>'orderNumber' = ${orderNumber}`;
    }
    return send(res, { ok: true });
  }

  return send(res, { error: 'method_not_allowed' }, 405);
});
