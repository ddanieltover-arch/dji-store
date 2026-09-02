import { getAdminEmail } from './config';
import { checkEmailConsent } from './consent';
import type { EmailEvent, EmailLocale, EmailPayload, TemplateId } from './events';
import { resolveLocale } from './i18n';
import { logEmailOutbox } from './outbox';
import { renderEmailHtml } from './render';
import { sendEmail } from './resend';

export async function dispatchEmail(event: EmailEvent): Promise<{ ok: boolean; skipped?: boolean; id?: string; error?: string }> {
  const consent = await checkEmailConsent(event);
  if (!consent.allowed) {
    const { subject } = await renderEmailHtml(event);
    await logEmailOutbox({ event, subject, status: 'skipped_consent', error: consent.reason });
    return { ok: false, skipped: true, error: consent.reason };
  }

  try {
    const { html, text, subject } = await renderEmailHtml(event);
    const result = await sendEmail({ to: event.to, subject, html, text });
    await logEmailOutbox({ event, subject, status: 'sent', resendId: result.id });
    return { ok: true, id: result.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'send_failed';
    try {
      const { subject } = await renderEmailHtml(event);
      await logEmailOutbox({ event, subject, status: 'failed', error: message });
    } catch {
      /* ignore render failure on error path */
    }
    return { ok: false, error: message };
  }
}

export async function dispatchDualEmail(args: {
  userTemplateId: TemplateId;
  adminTemplateId: TemplateId;
  locale: EmailLocale;
  userEmail: string;
  payload: EmailPayload;
  userCtaUrl?: string;
  adminCtaUrl?: string;
}): Promise<{ user: Awaited<ReturnType<typeof dispatchEmail>>; admin: Awaited<ReturnType<typeof dispatchEmail>> }> {
  const [user, admin] = await Promise.all([
    dispatchEmail({
      templateId: args.userTemplateId,
      audience: 'user',
      locale: resolveLocale(args.locale),
      to: args.userEmail,
      payload: args.payload,
      ctaUrl: args.userCtaUrl
    }),
    dispatchEmail({
      templateId: args.adminTemplateId,
      audience: 'admin',
      locale: 'en',
      to: getAdminEmail(),
      payload: args.payload,
      ctaUrl: args.adminCtaUrl
    })
  ]);
  return { user, admin };
}

export function siteUrl(path = ''): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://djii.eu').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
