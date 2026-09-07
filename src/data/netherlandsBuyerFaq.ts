export type NetherlandsBuyerFaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Optional content-page or PLP deep link hint for CTAs */
  link?: { type: 'content'; slug: string } | { type: 'plp'; category: string };
};

/**
 * Netherlands buyer-intent Q&A used on the homepage and related help/explore pages.
 * Phrasing targets “how to buy / where can I buy / how much for … in Netherlands” searches.
 */
export const HOME_NETHERLANDS_BUYER_FAQS: NetherlandsBuyerFaqItem[] = [
  {
    id: 'how-to-buy-drone',
    question: 'How to buy a DJI drone in the Netherlands?',
    answer:
      'Shop on DJI Store EU (djii.eu): choose your model, pick a combo, add Care Refresh if needed, then checkout with SEPA, card, or Revolut. Orders ship from our Amsterdam Schiphol hub with tracked EU delivery and a 2-year statutory warranty.',
    link: { type: 'plp', category: 'camera-drones' }
  },
  {
    id: 'where-buy-dji',
    question: 'Where can I buy DJI products in the Netherlands?',
    answer:
      'Buy online at djii.eu for the full catalog, genuine serials, and Netherlands stock. For hands-on demos, check our Flagship Stores partners in Amsterdam and Rotterdam — then complete purchase online when the SKU you need is in stock.',
    link: { type: 'content', slug: 'flagship-stores' }
  },
  {
    id: 'how-much-mini',
    question: 'How much for a DJI Mini in the Netherlands?',
    answer:
      'Mini series pricing starts from the live catalog on our Camera Drones page. EU store prices are shown in euros with clear “from” pricing for combos. Free shipping unlocks on qualifying orders over €500.',
    link: { type: 'plp', category: 'camera-drones' }
  },
  {
    id: 'how-to-buy-gimbal',
    question: 'How to buy a DJI Ronin or RS gimbal in the Netherlands?',
    answer:
      'Open Handheld on djii.eu, compare RS Mini / RS Pro / Ronin Cinema options in Buying Guides, then order the combo that matches your camera. We dispatch factory-sealed kits from Amsterdam with Care Refresh available at checkout.',
    link: { type: 'content', slug: 'buying-guides' }
  },
  {
    id: 'where-buy-action',
    question: 'Where can I buy Osmo Action or Pocket in the Netherlands?',
    answer:
      'Osmo Action, Pocket, Mobile, Mic, and Power are available on djii.eu under Handheld and Power. Netherlands inventory ships quickly via DHL/PostNL partners — no grey imports.',
    link: { type: 'plp', category: 'handheld' }
  },
  {
    id: 'how-much-mavic',
    question: 'How much for DJI Mavic or Air in the Netherlands?',
    answer:
      'Flagship Mavic and Air prices are listed in euros on each product page, including combo upgrades (extra batteries, RC with screen). Compare models side-by-side or use our 30-second Drone Matcher on the homepage.',
    link: { type: 'plp', category: 'camera-drones' }
  },
  {
    id: 'delivery-time',
    question: 'How long does DJI delivery take in the Netherlands?',
    answer:
      'Most in-stock consumer orders dispatch within 24–48 hours from Amsterdam. Dutch mainland delivery is typically 1–2 business days after dispatch; EU destinations follow the shipping-time matrix at checkout.',
    link: { type: 'content', slug: 'shipping-time' }
  },
  {
    id: 'warranty-returns',
    question: 'What warranty and returns apply when I buy DJI in the Netherlands?',
    answer:
      'Every consumer purchase includes the EU 2-year statutory warranty. Distance sales also include a 14-day withdrawal window for unused goods. Up to 30-day returns may apply on eligible promotions — see Return Policy for details.',
    link: { type: 'content', slug: 'return-policy' }
  },
  {
    id: 'how-to-buy-enterprise',
    question: 'How to buy DJI Enterprise gear in the Netherlands?',
    answer:
      'Enterprise and cinema kits (Matrice, Zenmuse, Inspire, Ronin 4D) can be ordered online or via B2B enquiry. Dutch VAT invoices, SEPA transfer, and fleet Care options are supported for registered businesses.',
    link: { type: 'content', slug: 'contact' }
  },
  {
    id: 'easa-licence',
    question: 'Do I need a licence to buy and fly a DJI drone in the Netherlands?',
    answer:
      'Buying is open to adults; flying depends on EASA class and weight. Sub-249g Mini models are popular for Open category A1 travel flying. Always check RDW/ILT rules and Fly Safe guidance before your first flight.',
    link: { type: 'content', slug: 'fly-safe' }
  }
];

/** Short trust line for PLP headers */
export function netherlandsPlpIntro(categoryLabel: string): string {
  return `Where can I buy ${categoryLabel} in the Netherlands? Official stock on DJI Store EU with euro pricing, 2-year EU warranty, and dispatch from Amsterdam.`;
}
