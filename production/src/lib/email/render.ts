import type { EmailEvent, EmailPayload, EmailTemplateProps, OrderLineItem, TemplateId } from './events';
import { ADMIN_BANNER, getEmailCopy, interpolate, ORDER_LABELS, renderPreview, resolveLocale } from './i18n';
import { getTemplateComponent } from './templates';
import { render } from '@react-email/render';
import { createElement } from 'react';

export async function renderEmailHtml(event: EmailEvent): Promise<{ html: string; text: string; subject: string; preview: string }> {
  const locale = event.audience === 'admin' ? resolveLocale('en') : resolveLocale(event.locale);
  const payload = event.payload ?? {};
  const copy = getEmailCopy(event.templateId, locale);
  const Component = getTemplateComponent(event.templateId);
  const lineItems = Array.isArray(payload.lineItems) ? (payload.lineItems as OrderLineItem[]) : parseLineItems(payload);

  const element = createElement(Component, {
    templateId: event.templateId,
    locale,
    payload,
    ctaUrl: event.ctaUrl,
    lineItems
  });

  const html = await render(element);
  const text = buildPlainText(copy, payload, event.ctaUrl, lineItems, locale);
  const subject = interpolate(copy.subject, payload);
  const preview = renderPreview(event.templateId, locale, payload);

  return { html, text, subject, preview };
}

function parseLineItems(payload: EmailPayload): OrderLineItem[] {
  if (!payload.lineItemsJson || typeof payload.lineItemsJson !== 'string') return [];
  try {
    return JSON.parse(payload.lineItemsJson) as OrderLineItem[];
  } catch {
    return [];
  }
}

function buildPlainText(
  copy: ReturnType<typeof getEmailCopy>,
  payload: EmailPayload,
  ctaUrl: string | undefined,
  lineItems: OrderLineItem[],
  locale: ReturnType<typeof resolveLocale>
): string {
  const labels = ORDER_LABELS[locale];
  const lines = [
    interpolate(copy.headline, payload),
    '',
    interpolate(copy.body, payload),
    ''
  ];

  if (lineItems.length) {
    lines.push(labels.items + ':');
    for (const item of lineItems) {
      lines.push(`- ${item.quantity}x ${item.name} — EUR ${item.priceEur.toFixed(2)}`);
    }
    if (payload.totalEur) lines.push(`${labels.total}: EUR ${payload.totalEur}`);
    lines.push('');
  }

  if (copy.cta && ctaUrl) {
    lines.push(`${interpolate(copy.cta, payload)}: ${ctaUrl}`);
    lines.push('');
  }

  if (copy.footer) lines.push(interpolate(copy.footer, payload));

  if (eventIsAdmin(copy)) {
    lines.unshift(ADMIN_BANNER.en.title, ADMIN_BANNER.en.subtitle, '');
  }

  return lines.join('\n');
}

function eventIsAdmin(copy: ReturnType<typeof getEmailCopy>): boolean {
  return copy.subject.startsWith('[Admin]');
}

export { ADMIN_BANNER, ORDER_LABELS, getEmailCopy, interpolate };
