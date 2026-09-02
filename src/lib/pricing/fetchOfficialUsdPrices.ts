export interface OfficialComboUsd {
  title: string;
  usd: number;
}

export interface OfficialUsdPriceEntry {
  slug: string;
  status: number;
  combos: OfficialComboUsd[];
  fetchedAt: string;
}

/** Parse combo/list USD prices embedded in store.dji.com PDP HTML. */
export function parseOfficialUsdPricesFromHtml(html: string, slug: string): OfficialComboUsd[] {
  const combos: OfficialComboUsd[] = [];
  const seen = new Set<string>();

  for (const m of html.matchAll(/"originalPrice"\s*:\s*([0-9.]+)/g)) {
    const idx = m.index ?? 0;
    const ctx = html.slice(Math.max(0, idx - 700), idx + 700);
    const titleCandidates = [...ctx.matchAll(/"title"\s*:\s*"((?:\\.|[^"\\])*)"/g)]
      .map((hit) => hit[1].replace(/\\u002F/g, '/').replace(/\\"/g, '"').trim())
      .filter((t) => t.length > 2);
    const title =
      titleCandidates.find((t) => /dji|osmo|zenmuse|ronin|mic/i.test(t)) ??
      titleCandidates.at(-1);
    if (!title) continue;
    const usd = Number(m[1]);
    const key = `${title}|${usd}`;
    if (seen.has(key)) continue;
    seen.add(key);

    combos.push({ title, usd });
  }

  if (!combos.length) return combos;

  const slugNorm = slug.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const filtered = combos.filter((c) => {
    const t = c.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (t.includes(slugNorm) || slugNorm.includes(t)) return true;
    const core = slug.replace(/^dji-/, '').replace(/^osmo-/, 'osmo ').split('-')[0];
    return t.includes(core);
  });

  return filtered.length ? filtered : combos.slice(0, 12);
}

export async function fetchOfficialUsdPrices(slug: string): Promise<OfficialUsdPriceEntry> {
  const url = `https://store.dji.com/product/${slug}`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'DJI-Store-EU-Pricing/1.0', Accept: 'text/html' }
  });
  const html = await r.text();
  const combos = r.status === 200 ? parseOfficialUsdPricesFromHtml(html, slug) : [];

  return {
    slug,
    status: r.status,
    combos,
    fetchedAt: new Date().toISOString()
  };
}
