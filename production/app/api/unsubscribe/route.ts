import { NextRequest, NextResponse } from 'next/server';
import { createDb } from '@/lib/db/client';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'missing_email' }, { status: 400 });
  }

  const sql = createDb();
  await sql`
    INSERT INTO notification_preferences (customer_email, marketing_consent, product_restocks, price_drop_alerts)
    VALUES (${email}, FALSE, FALSE, FALSE)
    ON CONFLICT (customer_email) DO UPDATE SET
      marketing_consent = FALSE,
      product_restocks = FALSE,
      price_drop_alerts = FALSE,
      updated_at = now()
  `;

  return NextResponse.json({ ok: true, message: 'unsubscribed' });
}
