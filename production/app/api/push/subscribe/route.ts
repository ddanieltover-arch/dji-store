import { NextRequest, NextResponse } from 'next/server';
import { createDb } from '@/lib/db/client';

/** Push subscribe — stores endpoint hash server-side only. */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const customerId = String(body.customerId ?? '');
  const endpointHash = String(body.endpointHash ?? '');
  if (!customerId || !endpointHash) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (body.pushPrivateKey || body.vapidPrivateKey) {
    return NextResponse.json({ error: 'private_key_not_accepted' }, { status: 400 });
  }
  const sql = createDb();
  try {
    await sql`
      INSERT INTO push_subscriptions (id, customer_id, endpoint_hash, user_agent_class, active, token_server_side_only)
      VALUES (
        ${`sub-${endpointHash.slice(0, 12)}`},
        ${customerId},
        ${endpointHash},
        ${body.userAgentClass ?? 'mobile'},
        TRUE,
        TRUE
      )
      ON CONFLICT (endpoint_hash) DO UPDATE SET
        customer_id = EXCLUDED.customer_id,
        user_agent_class = EXCLUDED.user_agent_class,
        active = TRUE
    `;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'push_subscribe_failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
