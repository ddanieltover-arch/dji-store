import { describe, expect, it } from 'vitest';
import { ALL_TEMPLATE_IDS, templateRegistry } from './templates';
import { EMAIL_LOCALES, MARKETING_TEMPLATES } from './events';
import { getEmailCopy, interpolate, resolveLocale } from './i18n';
import { renderEmailHtml } from './render';
import { checkEmailConsent } from './consent';
import { clientDetailRows, extractClientDetails } from './clientDetails';
import { buildOrderPayload } from './orderEmails';

describe('email i18n', () => {
  it('resolves locale with en fallback', () => {
    expect(resolveLocale('de')).toBe('de');
    expect(resolveLocale('xx')).toBe('en');
  });

  it('interpolates tokens', () => {
    expect(interpolate('Hello {{name}}', { name: 'Alex' })).toBe('Hello Alex');
  });

  it('has copy for every template in all locales', () => {
    for (const id of ALL_TEMPLATE_IDS) {
      for (const locale of EMAIL_LOCALES) {
        const copy = getEmailCopy(id, locale);
        expect(copy.subject.length).toBeGreaterThan(3);
        expect(copy.body.length).toBeGreaterThan(3);
      }
    }
  });
});

describe('email template registry', () => {
  it('registers all template ids', () => {
    expect(Object.keys(templateRegistry).length).toBe(ALL_TEMPLATE_IDS.length);
    for (const id of ALL_TEMPLATE_IDS) {
      expect(templateRegistry[id]?.component).toBeTruthy();
    }
  });
});

describe('client details for notifications', () => {
  it('extracts nested checkout customer and shipping fields', () => {
    const details = extractClientDetails({
      firstName: 'Alex',
      lastName: 'Pilot',
      customerEmail: 'pilot@example.com',
      phone: '+49 170 554 9812',
      companyName: 'Aerial Films GmbH',
      shippingAddress: {
        street: 'Musterstraße 12',
        postalCode: '10115',
        city: 'Berlin',
        countryCode: 'DE',
        countryName: 'Germany'
      },
      vatId: 'DE123456789'
    });

    expect(details.customerName).toBe('Alex Pilot');
    expect(details.customerEmail).toBe('pilot@example.com');
    expect(details.customerPhone).toBe('+49 170 554 9812');
    expect(details.companyName).toBe('Aerial Films GmbH');
    expect(details.shippingAddress).toBe('Musterstraße 12, 10115, Berlin, Germany');
    expect(details.vatId).toBe('DE123456789');
  });

  it('builds order payload with full client block', () => {
    const payload = buildOrderPayload({
      orderNumber: 'ORD-1',
      customerEmail: 'a@b.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      phone: '+31 10 000 0000',
      paymentMethod: 'sepa_bank_wire',
      totalEur: 199,
      shippingAddress: {
        street: 'Damrak 1',
        postalCode: '1012 LG',
        city: 'Amsterdam',
        countryName: 'Netherlands'
      },
      lineItems: [{ name: 'DJI Neo', quantity: 1, priceEur: 199 }]
    });

    expect(payload.customerName).toBe('Ada Lovelace');
    expect(payload.customerPhone).toBe('+31 10 000 0000');
    expect(payload.paymentMethod).toBe('SEPA Bank Wire');
    expect(payload.shippingAddress).toContain('Amsterdam');
    expect(clientDetailRows(payload).map((row) => row.label)).toEqual(
      expect.arrayContaining(['Name', 'Email', 'Phone', 'Shipping address'])
    );
  });
});

describe('email render snapshots', () => {
  const samplePayload = {
    orderNumber: 'ORD-TEST-1',
    customerName: 'Test Pilot',
    customerEmail: 'test@example.com',
    customerPhone: '+49 170 000 0000',
    companyName: 'Sky Films GmbH',
    shippingAddress: 'Berliner Str. 1, 10115 Berlin, Germany',
    productName: 'DJI Mini 5 Pro',
    paymentMethod: 'SEPA Bank Wire',
    totalEur: '899.00'
  };

  for (const locale of EMAIL_LOCALES) {
    it(`renders order.confirmed for ${locale}`, async () => {
      const { html, subject } = await renderEmailHtml({
        templateId: 'order.confirmed',
        audience: 'user',
        locale,
        to: 'test@example.com',
        payload: samplePayload,
        ctaUrl: 'https://djii.eu/track-order'
      });
      expect(subject).toContain('ORD-TEST-1');
      expect(html).toContain('DJI Store EU');
      expect(html).toContain('Test Pilot');
      expect(html).toContain('test@example.com');
      expect(html).toContain('+49 170 000 0000');
      expect(html).toContain('Berliner Str. 1, 10115 Berlin, Germany');
    });
  }

  it('renders admin order template in English', async () => {
    const { html, subject } = await renderEmailHtml({
      templateId: 'admin.order.new',
      audience: 'admin',
      locale: 'en',
      to: 'sales@djii.eu',
      payload: samplePayload,
      ctaUrl: 'https://djii.eu/admin'
    });
    expect(subject).toContain('[Admin]');
    expect(html).toContain('Admin notification');
    expect(html).toContain('Test Pilot');
    expect(html).toContain('Sky Films GmbH');
    expect(html).toContain('Berliner Str. 1, 10115 Berlin, Germany');
  });
});

describe('email consent', () => {
  it('allows transactional templates without db', async () => {
    const result = await checkEmailConsent({
      templateId: 'order.confirmed',
      audience: 'user',
      locale: 'en',
      to: 'test@example.com'
    });
    expect(result.allowed).toBe(true);
  });

  it('identifies marketing templates', () => {
    expect(MARKETING_TEMPLATES).toContain('marketing.cart_abandoned_1h');
    expect(MARKETING_TEMPLATES).toContain('lifecycle.getting_started');
  });
});
