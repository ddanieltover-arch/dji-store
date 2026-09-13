/**
 * Stable buyer-intent titles and description leads for PDP (Netherlands focus).
 * Cart, emails, and breadcrumbs keep the plain modelName.
 */

export type BuyerTitlePrefixId =
  | 'buy'
  | 'where-to-buy'
  | 'how-to-buy'
  | 'shop'
  | 'order'
  | 'buy-in-netherlands';

type BuyerTitlePrefix = {
  id: BuyerTitlePrefixId;
  buildTitle: (modelName: string) => string;
  buildLead: (modelName: string) => string;
};

const BUYER_TITLE_PREFIXES: BuyerTitlePrefix[] = [
  {
    id: 'buy',
    buildTitle: (n) => `Buy ${n}`,
    buildLead: (n) =>
      `How to buy ${n} in the Netherlands: choose your package below, add Care Refresh if needed, then checkout in euros with dispatch from Amsterdam.`
  },
  {
    id: 'where-to-buy',
    buildTitle: (n) => `Where to Buy ${n}`,
    buildLead: (n) =>
      `Where to buy ${n} in the Netherlands: order on DJI Store EU for factory-sealed Netherlands stock, genuine serials, and 2-year EU warranty.`
  },
  {
    id: 'how-to-buy',
    buildTitle: (n) => `How to Buy ${n}`,
    buildLead: (n) =>
      `How to buy ${n} in the Netherlands: pick a combo, confirm euro pricing, and complete checkout — tracked delivery from our Amsterdam hub.`
  },
  {
    id: 'shop',
    buildTitle: (n) => `Shop ${n}`,
    buildLead: (n) =>
      `Shop ${n} in the Netherlands on DJI Store EU. Where to buy matters: we ship official inventory with CE documentation and local support.`
  },
  {
    id: 'order',
    buildTitle: (n) => `Order ${n}`,
    buildLead: (n) =>
      `Order ${n} in the Netherlands online: select your configuration below for live euro pricing and free shipping on qualifying carts over €500.`
  },
  {
    id: 'buy-in-netherlands',
    buildTitle: (n) => `Buy ${n} in Netherlands`,
    buildLead: (n) =>
      `Buy ${n} in the Netherlands from DJI Store EU. How to buy: configure your kit below; where to buy: djii.eu with Amsterdam dispatch.`
  }
];

/** Stable 0..n-1 index from product id (same product always gets the same prefix). */
export function stablePrefixIndex(productId: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < productId.length; i += 1) {
    hash = (hash * 31 + productId.charCodeAt(i)) >>> 0;
  }
  return modulo > 0 ? hash % modulo : 0;
}

export function getBuyerTitlePrefix(productId: string): BuyerTitlePrefix {
  const index = stablePrefixIndex(productId, BUYER_TITLE_PREFIXES.length);
  return BUYER_TITLE_PREFIXES[index]!;
}

/** Visible PDP H1 / document title. */
export function productBuyerTitle(productId: string, modelName: string): string {
  return getBuyerTitlePrefix(productId).buildTitle(modelName);
}

/** PDP description with buyer-intent lead + original product copy. */
export function productBuyerDescription(
  productId: string,
  modelName: string,
  description: string
): string {
  const lead = getBuyerTitlePrefix(productId).buildLead(modelName);
  const body = description.trim();
  if (!body) return lead;
  // Avoid doubling if description already starts with the same intent phrase
  if (/^(how to buy|where to buy|buy |shop |order )/i.test(body)) {
    return body;
  }
  return `${lead} ${body}`;
}

export { BUYER_TITLE_PREFIXES };
