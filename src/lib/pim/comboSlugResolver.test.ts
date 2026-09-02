import { describe, expect, it } from 'vitest';
import { resolveComboMediaSlug } from './comboSlugResolver';

const knownSlugs = [
  'osmo-action-5-pro',
  'osmo-action-5-pro-surfing-combo',
  'osmo-action-5-pro-street-photography-combo',
  'osmo-action-5-pro-vlog-combo-dji-mic-mini',
  'dji-rs-4-mini',
  'dji-rs-4-mini-combo',
  'dji-rs-4-mini-creator-combo'
];

describe('resolveComboMediaSlug', () => {
  it('maps surfing combo to child slug', () => {
    expect(
      resolveComboMediaSlug('osmo-action-5-pro', 'Osmo Action 5 Pro Surfing Combo', knownSlugs)
    ).toBe('osmo-action-5-pro-surfing-combo');
  });

  it('maps creator combo to child slug', () => {
    expect(
      resolveComboMediaSlug('dji-rs-4-mini', 'RS 4 Mini Creator Combo (DJI Mic 3, 1 TX + 1 RX)', knownSlugs)
    ).toBe('dji-rs-4-mini-creator-combo');
  });

  it('maps standard combo bundle to combo slug', () => {
    expect(resolveComboMediaSlug('dji-rs-4-mini', 'RS 4 Mini Combo', knownSlugs)).toBe(
      'dji-rs-4-mini-combo'
    );
  });
});
