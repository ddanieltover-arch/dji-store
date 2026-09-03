import type { PlacedOrder } from '../../types';

export async function fetchRemoteOrders(): Promise<PlacedOrder[]> {
  try {
    const res = await fetch('/api/admin/orders', { credentials: 'include' });
    if (!res.ok) return [];
    const data = (await res.json()) as { orders?: PlacedOrder[] };
    return Array.isArray(data.orders) ? data.orders : [];
  } catch {
    return [];
  }
}

export function mergeOrderLists(remote: PlacedOrder[], local: PlacedOrder[]): PlacedOrder[] {
  const byNumber = new Map<string, PlacedOrder>();
  for (const order of [...remote, ...local]) {
    if (!order?.orderNumber) continue;
    if (!byNumber.has(order.orderNumber)) {
      byNumber.set(order.orderNumber, order);
    }
  }
  return [...byNumber.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
