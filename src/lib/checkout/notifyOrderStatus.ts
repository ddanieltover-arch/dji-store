import type { Locale, PlacedOrder } from '../../types';

function formatLineItems(order: PlacedOrder) {
  return order.items.map((item) => ({
    name: item.productName,
    sku: item.sku,
    quantity: item.quantity,
    priceEur: item.priceEur
  }));
}

export function orderToStatusEmailBody(order: PlacedOrder, locale: Locale, previous?: PlacedOrder) {
  return {
    orderNumber: order.orderNumber,
    customerEmail: order.customer.email,
    customerName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
    productName: order.items[0]?.productName ?? 'DJI products',
    totalEur: order.totalEur,
    trackingNumber: order.tracking?.trackingNumber ?? order.trackingToken,
    paymentMethod: order.paymentMethod,
    orderStatus: order.status ?? 'pending_payment',
    paymentStatus: order.paymentStatus,
    previousOrderStatus: previous?.status,
    previousPaymentStatus: previous?.paymentStatus,
    lineItems: formatLineItems(order),
    locale
  };
}

export async function notifyOrderStatusChange(args: {
  order: PlacedOrder;
  previousOrder?: PlacedOrder;
  locale: Locale;
}): Promise<{ ok: boolean; error?: string }> {
  const body = orderToStatusEmailBody(args.order, args.locale, args.previousOrder);

  try {
    const res = await fetch('/api/admin/orders/notify-status', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-locale': args.locale
      },
      body: JSON.stringify(body)
    });

    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error ?? `notify_http_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network_error' };
  }
}
