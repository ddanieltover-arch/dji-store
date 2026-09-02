import { createDb } from '../db/client';
import type { EmailEvent } from './events';

export async function logEmailOutbox(args: {
  event: EmailEvent;
  subject: string;
  status: 'sent' | 'failed' | 'skipped_consent';
  resendId?: string;
  error?: string;
}): Promise<void> {
  try {
    const sql = createDb();
    await sql`
      INSERT INTO email_outbox (template_id, audience, locale, recipient, subject, resend_id, status, payload, error)
      VALUES (
        ${args.event.templateId},
        ${args.event.audience},
        ${args.event.locale},
        ${args.event.to},
        ${args.subject},
        ${args.resendId ?? null},
        ${args.status},
        ${JSON.stringify(args.event.payload ?? {})}::jsonb,
        ${args.error ?? null}
      )
    `;
  } catch {
    // Outbox logging must not block sends; table may not exist in migration mode
  }
}
