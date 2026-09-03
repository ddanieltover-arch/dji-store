import type { PlacedOrder } from '../../types';

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

/** Ensure remote/local orders always have the fields AdminDashboard expects. */
export function normalizePlacedOrder(input: unknown): PlacedOrder | null {
  const raw = asRecord(input);
  const orderNumber = String(raw.orderNumber ?? raw.dbId ?? '').trim();
  if (!orderNumber) return null;

  const customer = asRecord(raw.customer);
  const shipping = asRecord(raw.shippingAddress);
  const items = Array.isArray(raw.items)
    ? raw.items.map((item) => {
        const row = asRecord(item);
        return {
          sku: String(row.sku ?? ''),
          productName: String(row.productName ?? row.name ?? row.sku ?? 'Item'),
          quantity: Number(row.quantity ?? 1) || 1,
          priceEur: Number(row.priceEur ?? 0) || 0,
          productId: String(row.productId ?? ''),
          variantId: String(row.variantId ?? '')
        };
      })
    : [];

  const paymentStatusRaw = String(raw.paymentStatus ?? '');
  const paymentStatus =
    paymentStatusRaw === 'payment_verifying' || paymentStatusRaw === 'verifying'
      ? 'verifying'
      : paymentStatusRaw === 'confirmed' ||
          paymentStatusRaw === 'processing' ||
          paymentStatusRaw === 'dispatched' ||
          paymentStatusRaw === 'delivered'
        ? (paymentStatusRaw as PlacedOrder['paymentStatus'])
        : String(raw.status ?? '') === 'pending_payment'
          ? 'verifying'
          : 'confirmed';

  return {
    ...(raw as Partial<PlacedOrder>),
    orderNumber,
    trackingToken: String(raw.trackingToken ?? ''),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    customer: {
      firstName: String(customer.firstName ?? raw.firstName ?? ''),
      lastName: String(customer.lastName ?? raw.lastName ?? ''),
      email: String(customer.email ?? raw.customerEmail ?? ''),
      phone: String(customer.phone ?? raw.phone ?? '')
    },
    shippingAddress: {
      street: String(shipping.street ?? ''),
      postalCode: String(shipping.postalCode ?? ''),
      city: String(shipping.city ?? ''),
      countryCode: String(shipping.countryCode ?? ''),
      countryName: String(shipping.countryName ?? shipping.countryCode ?? '')
    },
    items,
    subtotalEur: Number(raw.subtotalEur ?? 0) || 0,
    shippingEur: Number(raw.shippingEur ?? 0) || 0,
    discountEur: Number(raw.discountEur ?? 0) || 0,
    totalEur: Number(raw.totalEur ?? 0) || 0,
    paymentMethod: String(raw.paymentMethod ?? 'card'),
    paymentStatus,
    status: (raw.status as PlacedOrder['status']) || undefined,
    serverSynced: Boolean(raw.serverSynced ?? raw.dbId)
  };
}

export async function fetchRemoteOrders(): Promise<PlacedOrder[]> {
  try {
    const res = await fetch('/api/admin/orders', { credentials: 'include' });
    if (!res.ok) return [];
    const data = (await res.json()) as { orders?: unknown[] };
    if (!Array.isArray(data.orders)) return [];
    return data.orders
      .map((order) => normalizePlacedOrder(order))
      .filter((order): order is PlacedOrder => Boolean(order));
  } catch {
    return [];
  }
}

export function mergeOrderLists(remote: PlacedOrder[], local: PlacedOrder[]): PlacedOrder[] {
  const byNumber = new Map<string, PlacedOrder>();
  for (const order of [...remote, ...local]) {
    const normalized = normalizePlacedOrder(order);
    if (!normalized) continue;
    if (!byNumber.has(normalized.orderNumber)) {
      byNumber.set(normalized.orderNumber, normalized);
    }
  }
  return [...byNumber.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
