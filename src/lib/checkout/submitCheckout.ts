import { checkoutIdempotencyKey } from '../performance/checkoutIdempotency';
import type { Locale, PlacedOrder } from '../../types';

export function buildCartFingerprint(items: PlacedOrder['items']): string {
  return items
    .map((item) => `${item.sku}:${item.quantity}`)
    .sort()
    .join('|');
}

export async function submitCheckoutOrder(args: {
  order: PlacedOrder;
  customerId: string;
  locale: Locale;
}): Promise<{ ok: boolean; orderId?: string; error?: string }> {
  const { order, customerId, locale } = args;
  const cartFingerprint = buildCartFingerprint(order.items);

  const body = {
    customerId,
    cartFingerprint,
    idempotencyKey: checkoutIdempotencyKey(customerId, cartFingerprint),
    customerEmail: order.customer.email,
    customerName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
    firstName: order.customer.firstName,
    lastName: order.customer.lastName,
    orderNumber: order.orderNumber,
    paymentMethod: order.paymentMethod,
    totalEur: order.totalEur,
    subtotalEur: order.subtotalEur,
    shippingEur: order.shippingEur,
    discountEur: order.discountEur,
    lineItems: order.items.map((item) => ({
      name: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      priceEur: item.priceEur
    })),
    locale,
    shippingAddress: order.shippingAddress,
    phone: order.customer.phone
  };

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-locale': locale
      },
      body: JSON.stringify(body)
    });

    const data = (await res.json()) as { orderId?: string; error?: string; status?: string };
    if (!res.ok) {
      return { ok: false, error: data.error ?? `checkout_http_${res.status}` };
    }
    return { ok: true, orderId: data.orderId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network_error' };
  }
}
