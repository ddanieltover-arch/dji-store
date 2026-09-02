import { describe, expect, it } from 'vitest';
import { ALL_TEMPLATE_IDS, templateRegistry } from './templates';
import { EMAIL_LOCALES, MARKETING_TEMPLATES } from './events';
import { getEmailCopy, interpolate, resolveLocale } from './i18n';
import { renderEmailHtml } from './render';
import { checkEmailConsent } from './consent';

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

describe('email render snapshots', () => {
  const samplePayload = {
    orderNumber: 'ORD-TEST-1',
    customerName: 'Test Pilot',
    customerEmail: 'test@example.com',
    productName: 'DJI Mini 5 Pro'
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
