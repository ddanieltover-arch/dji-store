/** Canonical site contact — only verified sender for Resend. */
export const SITE_EMAIL = 'sales@djii.eu';

export const SITE_EMAIL_FROM = `DJI Store <${SITE_EMAIL}>`;

export function getSiteEmail(): string {
  return process.env.ADMIN_EMAIL ?? process.env.EMAIL_REPLY_TO ?? SITE_EMAIL;
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM ?? SITE_EMAIL_FROM;
}

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL ?? getSiteEmail();
}
