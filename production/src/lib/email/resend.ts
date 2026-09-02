import { Resend } from 'resend';
import { getEmailFrom, getSiteEmail } from './config';

let client: Resend | null = null;

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('Missing RESEND_API_KEY');
  }
  client ??= new Resend(key);
  return client;
}

export type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

/** Send transactional email via Resend. Server-only. */
export async function sendEmail(args: SendEmailArgs): Promise<{ id: string }> {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: getEmailFrom(),
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
    replyTo: args.replyTo ?? getSiteEmail()
  });
  if (error) {
    throw new Error(error.message);
  }
  if (!data?.id) {
    throw new Error('Resend returned no message id');
  }
  return { id: data.id };
}
