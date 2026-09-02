import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { createDb } from '@/lib/db/client';
import { dispatchEmail, siteUrl } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const type = String(body.type ?? 'restock');
  const missing = requireFields(body, ['customerEmail', 'productId']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const email = String(body.customerEmail);
  const productId = String(body.productId);
  const sql = createDb();

  if (type === 'restock') {
    await sql`
      INSERT INTO restock_alert_subscriptions (id, customer_email, product_id, locale, active)
      VALUES (${`rsa-${Date.now()}`}, ${email}, ${productId}, ${locale}, TRUE)
      ON CONFLICT (customer_email, product_id) DO UPDATE SET active = TRUE, locale = EXCLUDED.locale
    `;
    await sql`
      INSERT INTO notification_preferences (customer_email, product_restocks, marketing_consent)
      VALUES (${email}, TRUE, TRUE)
      ON CONFLICT (customer_email) DO UPDATE SET product_restocks = TRUE, updated_at = now()
    `;
    return NextResponse.json({ ok: true, subscribed: 'restock' });
  }

  if (type === 'price') {
    await sql`
      INSERT INTO price_alert_subscriptions (id, customer_email, product_id, locale, price_threshold_eur, active)
      VALUES (
        ${`pa-${Date.now()}`},
        ${email},
        ${productId},
        ${locale},
        ${body.priceThresholdEur ? Number(body.priceThresholdEur) : null},
        TRUE
      )
      ON CONFLICT (customer_email, product_id) DO UPDATE SET active = TRUE, locale = EXCLUDED.locale
    `;
    await sql`
      INSERT INTO notification_preferences (customer_email, price_drop_alerts, marketing_consent)
      VALUES (${email}, TRUE, TRUE)
      ON CONFLICT (customer_email) DO UPDATE SET price_drop_alerts = TRUE, updated_at = now()
    `;
    return NextResponse.json({ ok: true, subscribed: 'price' });
  }

  return badRequest('invalid_type');
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const type = String(body.type ?? 'restock');
  const missing = requireFields(body, ['customerEmail', 'productId', 'productName']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const templateId = type === 'price' ? 'alert.price_drop' : 'alert.restock';

  const result = await dispatchEmail({
    templateId,
    audience: 'user',
    locale,
    to: String(body.customerEmail),
    payload: {
      productName: String(body.productName),
      newPrice: body.newPrice ? String(body.newPrice) : undefined,
      oldPrice: body.oldPrice ? String(body.oldPrice) : undefined,
      unsubscribeUrl: siteUrl(`/api/unsubscribe?email=${encodeURIComponent(String(body.customerEmail))}`)
    },
    ctaUrl: siteUrl(`/${locale}/products/${body.productSlug ?? body.productId}`)
  });

  return NextResponse.json({ ok: result.ok, skipped: result.skipped });
}
