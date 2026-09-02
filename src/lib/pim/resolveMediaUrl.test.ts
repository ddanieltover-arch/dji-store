import { describe, expect, it } from 'vitest';
import { resolveMediaUrl } from './resolveMediaUrl';

describe('resolveMediaUrl', () => {
  it('maps database asset ids to static files when manifest entry exists', () => {
    expect(
      resolveMediaUrl('/api/assets/6cbb3b97-f976-4860-aeb2-627d67d5b3c3')
    ).toBe('/media/assets/6cbb3b97-f976-4860-aeb2-627d67d5b3c3.jpeg');
  });

  it('passes through local product paths', () => {
    expect(resolveMediaUrl('/products/prod-osmo-action-5-pro-cutout.png')).toBe(
      '/products/prod-osmo-action-5-pro-cutout.png'
    );
  });
});
