import { NextRequest, NextResponse } from 'next/server';
import { badRequest, getLocale, requireFields } from '@/lib/api/helpers';
import { createDb } from '@/lib/db/client';
import type { TemplateId } from '@/lib/email/events';
import { dispatchEmail, siteUrl } from '@/lib/email/send';

const CRON_SECRET = process.env.CRON_SECRET ?? process.env.WEBHOOK_SIGNING_SECRET ?? '';

const MARKETING_JOBS: { templateId: TemplateId; field: string }[] = [
  { templateId: 'marketing.cart_abandoned_1h', field: 'cart1h' },
  { templateId: 'marketing.cart_abandoned_24h', field: 'cart24h' },
  { templateId: 'marketing.cart_abandoned_72h', field: 'cart72h' },
  { templateId: 'marketing.browse_abandonment_48h', field: 'browse48h' },
  { templateId: 'marketing.post_purchase_14d', field: 'post14d' },
  { templateId: 'marketing.post_purchase_30d', field: 'post30d' },
  { templateId: 'marketing.care_upsell_90d', field: 'care90d' },
  { templateId: 'marketing.warranty_renewal_300d', field: 'renew300d' },
  { templateId: 'lifecycle.getting_started', field: 'life1' },
  { templateId: 'lifecycle.setup_guidance', field: 'life3' },
  { templateId: 'lifecycle.compatibility_edu', field: 'life7' },
  { templateId: 'lifecycle.review_invite', field: 'life14' },
  { templateId: 'lifecycle.accessory_reco', field: 'life30' }
];

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const batch = Array.isArray(body.jobs) ? body.jobs : [];

  const results: { templateId: string; ok: boolean; skipped?: boolean }[] = [];

  for (const job of batch) {
    const missing = requireFields(job, ['customerEmail', 'productName', 'templateId']);
    if (missing) continue;

    const locale = getLocale(job, req);
    const result = await dispatchEmail({
      templateId: job.templateId as TemplateId,
      audience: 'user',
      locale,
      to: String(job.customerEmail),
      payload: {
        customerEmail: String(job.customerEmail),
        productName: String(job.productName),
        voucherCode: job.voucherCode ? String(job.voucherCode) : undefined,
        expiryDate: job.expiryDate ? String(job.expiryDate) : undefined,
        unsubscribeUrl: siteUrl(`/api/unsubscribe?email=${encodeURIComponent(String(job.customerEmail))}`)
      },
      ctaUrl: job.ctaUrl ? String(job.ctaUrl) : siteUrl(`/${locale}/products/${job.productSlug ?? ''}`)
    });
    results.push({ templateId: String(job.templateId), ok: result.ok, skipped: result.skipped });
  }

  return NextResponse.json({ ok: true, processed: results.length, results, supportedJobs: MARKETING_JOBS });
}

export async function GET() {
  return NextResponse.json({ jobs: MARKETING_JOBS.map((j) => j.templateId) });
}
