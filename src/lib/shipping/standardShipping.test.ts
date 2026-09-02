import { describe, expect, it } from 'vitest';
import { CHECKOUT_CARRIERS, estimateStandardShippingDates } from './standardShipping';

describe('standardShipping', () => {
  it('lists six European carriers without UPS', () => {
    expect(CHECKOUT_CARRIERS).toHaveLength(6);
    expect(CHECKOUT_CARRIERS.map((c) => c.id)).toEqual(
      expect.arrayContaining(['dhl', 'fedex', 'dpd', 'gls', 'postnl', 'hermes'])
    );
    expect(CHECKOUT_CARRIERS.map((c) => c.id)).not.toContain('ups');
  });

  it('estimates ship and arrival dates', () => {
    const monday = new Date('2026-09-07T12:00:00');
    const dates = estimateStandardShippingDates(monday);
    expect(dates.shipLabel).toMatch(/Sep/);
    expect(dates.arrivalLabel).toMatch(/Sep/);
  });
});
