import { describe, expect, it } from 'vitest';
import { ANY_OTHER_COUNTRY, CHECKOUT_COUNTRIES, EUROPEAN_COUNTRIES } from './europeanCountries';

describe('europeanCountries', () => {
  it('lists every European destination plus any other country last', () => {
    expect(EUROPEAN_COUNTRIES.length).toBeGreaterThanOrEqual(50);
    expect(CHECKOUT_COUNTRIES.at(-1)).toEqual(ANY_OTHER_COUNTRY);
    expect(CHECKOUT_COUNTRIES).toHaveLength(EUROPEAN_COUNTRIES.length + 1);
  });

  it('includes core EU markets and UK', () => {
    const codes = EUROPEAN_COUNTRIES.map((c) => c.code);
    expect(codes).toEqual(expect.arrayContaining(['DE', 'FR', 'NL', 'IT', 'ES', 'PL', 'GB']));
  });
});
