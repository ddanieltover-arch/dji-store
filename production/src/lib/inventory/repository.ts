import { depotCodes, inventoryStatus } from '../../../../src/lib/migration/wave12Production';
import { createDb } from '../db/client';

export async function fetchVariantAvailability(variantId: string) {
  const sql = createDb();
  const data = await sql`
    SELECT depot_id, stock_units, reserved_units, incoming_units
    FROM inventory_depot_stock
    WHERE variant_id = ${variantId}
  `;

  const depots = depotCodes();
  const rows = data.map((row) => ({
    ...row,
    status: inventoryStatus(row.stock_units, row.reserved_units, row.incoming_units),
    // Never treat cached/stale rows as live without fetch timestamp
    live: true as const,
    fetchedAt: new Date().toISOString()
  }));

  return { depots, rows };
}
