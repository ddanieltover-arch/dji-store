import { createDb } from '../db/client';
import { MARKETING_TEMPLATES, type EmailEvent, type TemplateId } from './events';

export async function checkEmailConsent(event: EmailEvent): Promise<{ allowed: boolean; reason?: string }> {
  if (!MARKETING_TEMPLATES.includes(event.templateId)) {
    return { allowed: true };
  }

  const email = event.audience === 'user' ? event.to : undefined;
  if (!email) return { allowed: true };

  try {
    const sql = createDb();
    const rows = await sql`
      SELECT marketing_consent, order_updates, product_restocks, price_drop_alerts
      FROM notification_preferences
      WHERE customer_email = ${email}
      LIMIT 1
    `;

    if (!rows.length) {
      // No prefs row — allow transactional-style alerts; block pure marketing
      if (isStrictMarketing(event.templateId)) {
        return { allowed: false, reason: 'no_marketing_consent' };
      }
      return { allowed: true };
    }

    const prefs = rows[0];
    if (event.templateId.startsWith('marketing.') && !prefs.marketing_consent) {
      return { allowed: false, reason: 'marketing_opt_out' };
    }
    if (event.templateId === 'alert.restock' && prefs.product_restocks === false) {
      return { allowed: false, reason: 'restock_opt_out' };
    }
    if (event.templateId === 'alert.price_drop' && prefs.price_drop_alerts === false) {
      return { allowed: false, reason: 'price_opt_out' };
    }
    if (event.templateId === 'newsletter.welcome' && !prefs.marketing_consent) {
      return { allowed: false, reason: 'newsletter_opt_out' };
    }

    return { allowed: true };
  } catch {
    // Table may not exist yet — allow send in migration mode
    return { allowed: true };
  }
}

function isStrictMarketing(templateId: TemplateId): boolean {
  return templateId.startsWith('marketing.') || templateId.startsWith('lifecycle.');
}
