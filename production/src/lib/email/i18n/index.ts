import type { EmailCopy, EmailLocale, TemplateId } from '../events';
import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import it from './it.json';
import nl from './nl.json';

const catalogs: Record<EmailLocale, Record<string, EmailCopy>> = {
  en: en as Record<string, EmailCopy>,
  de: de as Record<string, EmailCopy>,
  fr: fr as Record<string, EmailCopy>,
  es: es as Record<string, EmailCopy>,
  it: it as Record<string, EmailCopy>,
  nl: nl as Record<string, EmailCopy>
};

export function resolveLocale(raw?: string): EmailLocale {
  const v = (raw ?? 'en').toLowerCase();
  if (v in catalogs) return v as EmailLocale;
  return 'en';
}

export function getEmailCopy(templateId: TemplateId, locale: EmailLocale): EmailCopy {
  const resolved = resolveLocale(locale);
  const copy = catalogs[resolved][templateId] ?? catalogs.en[templateId];
  if (!copy) {
    throw new Error(`Missing email copy for template: ${templateId}`);
  }
  return copy;
}

export function interpolate(template: string, payload: Record<string, unknown> = {}): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = payload[key];
    return value === undefined || value === null ? '' : String(value);
  });
}

export function renderSubject(templateId: TemplateId, locale: EmailLocale, payload: Record<string, unknown>): string {
  return interpolate(getEmailCopy(templateId, locale).subject, payload);
}

export function renderPreview(templateId: TemplateId, locale: EmailLocale, payload: Record<string, unknown>): string {
  return interpolate(getEmailCopy(templateId, locale).preview, payload);
}

export const ORDER_LABELS: Record<EmailLocale, { items: string; total: string }> = {
  en: { items: 'Order items', total: 'Total' },
  de: { items: 'Bestellpositionen', total: 'Gesamt' },
  fr: { items: 'Articles', total: 'Total' },
  es: { items: 'Artículos', total: 'Total' },
  it: { items: 'Articoli', total: 'Totale' },
  nl: { items: 'Bestelregels', total: 'Totaal' }
};

export const ADMIN_BANNER: Record<EmailLocale, { title: string; subtitle: string }> = {
  en: { title: 'Admin notification', subtitle: 'Internal action may be required' },
  de: { title: 'Admin-Benachrichtigung', subtitle: 'Interne Aktion erforderlich' },
  fr: { title: 'Notification admin', subtitle: 'Action interne requise' },
  es: { title: 'Notificación admin', subtitle: 'Acción interna requerida' },
  it: { title: 'Notifica admin', subtitle: 'Azione interna richiesta' },
  nl: { title: 'Admin-melding', subtitle: 'Interne actie vereist' }
};
