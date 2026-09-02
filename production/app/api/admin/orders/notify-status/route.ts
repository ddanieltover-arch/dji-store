import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, parseBody, requireFields } from '@/lib/api/helpers';
import { requireAdmin } from '@/lib/auth/guards';
import { sendOrderStatusChangeEmails } from '@/lib/email/orderEmails';

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = await parseBody<Record<string, unknown>>(req);
  const missing = requireFields(body, ['orderNumber', 'customerEmail', 'orderStatus', 'paymentStatus']);
  if (missing) return badRequest(`missing_${missing}`);

  const locale = getLocale(body, req);
  const result = await sendOrderStatusChangeEmails({ locale, body });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error ?? 'email_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
