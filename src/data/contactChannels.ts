/** Shared storefront contact channels (USA & Canada voice / WhatsApp). */

/** Digits-only E.164 for tel: and wa.me (no + or spaces). */
export const US_CA_PHONE_E164 = '14809605245';

/** Human-readable display. */
export const US_CA_PHONE_DISPLAY = '+1 (480) 960-5245';

export const US_CA_PHONE_LABEL =
  'Text or call for USA & Canada clients';

export const US_CA_TEL_HREF = `tel:+${US_CA_PHONE_E164}`;
export const US_CA_WHATSAPP_HREF = `https://wa.me/${US_CA_PHONE_E164}`;

/** One-line blurb for footers and content pages. */
export const US_CA_CONTACT_BLURB = `${US_CA_PHONE_DISPLAY} — ${US_CA_PHONE_LABEL} (WhatsApp or phone)`;
