import type { EmailPayload } from './events';

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as AnyRecord) : null;
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
}

function formatAddressLine(parts: Array<string | undefined>): string {
  return parts.filter((part) => Boolean(part && String(part).trim())).join(', ');
}

/**
 * Normalize complete client / contact details from checkout or form bodies
 * into a flat email payload. Nested `customer`, `shippingAddress`, and
 * `placedOrder` shapes from the storefront are supported.
 */
export function extractClientDetails(body: AnyRecord = {}): EmailPayload {
  const customer = asRecord(body.customer) ?? asRecord(asRecord(body.placedOrder)?.customer) ?? {};
  const shipping =
    asRecord(body.shippingAddress) ??
    asRecord(asRecord(body.placedOrder)?.shippingAddress) ??
    asRecord(body.address) ??
    {};
  const billing = asRecord(body.billingAddress) ?? {};

  const firstName = pickString(body.firstName, customer.firstName);
  const lastName = pickString(body.lastName, customer.lastName);
  const customerName = pickString(
    body.customerName,
    body.fullName,
    body.name,
    `${firstName} ${lastName}`.trim(),
    customer.name
  );
  const customerEmail = pickString(body.customerEmail, body.email, customer.email);
  const customerPhone = pickString(body.phone, body.customerPhone, customer.phone, body.mobile);
  const companyName = pickString(body.companyName, body.company, customer.company);

  const street = pickString(shipping.street, shipping.line1, body.street, billing.street, billing.line1);
  const postalCode = pickString(shipping.postalCode, shipping.zip, body.postalCode, billing.postalCode);
  const city = pickString(shipping.city, body.city, billing.city);
  const countryCode = pickString(shipping.countryCode, body.countryCode, billing.countryCode);
  const countryName = pickString(shipping.countryName, shipping.country, body.countryName, body.country, billing.countryName);
  const shippingAddress = pickString(
    body.shippingAddressFormatted,
    formatAddressLine([street, postalCode, city, countryName || countryCode])
  );

  const vatId = pickString(body.vatId, body.vatNumber, customer.vatId);
  const notes = pickString(body.notes, body.message, body.description, body.comment);

  return {
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(customerName ? { customerName } : {}),
    ...(customerEmail ? { customerEmail } : {}),
    ...(customerPhone ? { customerPhone } : {}),
    ...(companyName ? { companyName } : {}),
    ...(street ? { shippingStreet: street } : {}),
    ...(postalCode ? { shippingPostalCode: postalCode } : {}),
    ...(city ? { shippingCity: city } : {}),
    ...(countryCode ? { shippingCountryCode: countryCode } : {}),
    ...(countryName ? { shippingCountry: countryName } : {}),
    ...(shippingAddress ? { shippingAddress } : {}),
    ...(vatId ? { vatId } : {}),
    ...(notes ? { notes } : {})
  };
}

/** Flat detail rows for email templates (user + admin). */
export function clientDetailRows(payload: Record<string, unknown>): Array<{ label: string; value: string }> {
  const fields: Array<[string, string]> = [
    ['Name', 'customerName'],
    ['Email', 'customerEmail'],
    ['Phone', 'customerPhone'],
    ['Company', 'companyName'],
    ['Shipping address', 'shippingAddress'],
    ['Street', 'shippingStreet'],
    ['Postal code', 'shippingPostalCode'],
    ['City', 'shippingCity'],
    ['Country', 'shippingCountry'],
    ['Country code', 'shippingCountryCode'],
    ['VAT ID', 'vatId'],
    ['Notes', 'notes']
  ];

  const rows = fields
    .filter(([, key]) => payload[key] !== undefined && payload[key] !== null && String(payload[key]).trim() !== '')
    .map(([label, key]) => ({ label, value: String(payload[key]) }));

  // Prefer the combined shipping address over fragmented lines when both exist.
  if (payload.shippingAddress) {
    return rows.filter(
      (row) => !['Street', 'Postal code', 'City', 'Country', 'Country code'].includes(row.label)
    );
  }
  return rows;
}
