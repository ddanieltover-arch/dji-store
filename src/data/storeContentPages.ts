export type ContentPageCtaAction =
  | 'plp'
  | 'account'
  | 'track'
  | 'contact'
  | 'easa'
  | 'refurbished'
  | 'compare'
  | 'home';

export interface ContentPageSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface ContentPageDefinition {
  slug: string;
  path: string;
  title: string;
  eyebrow?: string;
  summary: string;
  sections: ContentPageSection[];
  cta?: { label: string; action: ContentPageCtaAction; target?: string };
}

/** Legacy slugs that redirect to a canonical page. */
export const CONTENT_SLUG_ALIASES: Record<string, string> = {
  'shipping-delivery': 'shipping-fees'
};

export const CONTENT_PATH_ALIASES: Record<string, string> = {
  '/help/shipping-delivery': '/help/shipping-fees'
};

const SUPPORT_EMAIL = 'sales@djii.eu';

export { SUPPORT_EMAIL };

export const STORE_CONTENT_PAGES: ContentPageDefinition[] = [
  {
    slug: 'payment-methods',
    path: '/help/payment-methods',
    title: 'Payment Methods',
    eyebrow: 'Help & Support',
    summary:
      'DJI Store EU supports official European bank settlement, Revolut banking, and Web3 cryptocurrency with an automatic 5% discount on crypto checkout.',
    sections: [
      {
        heading: 'SEPA Bank Wire',
        body: 'Pay via official European SEPA bank settlement. Banking instructions are provided by our admin team after you place your order — include your order reference when requesting details.',
        bullets: ['EUR settlement only', 'Corporate invoice available', '1-hour dispatch after payment verification']
      },
      {
        heading: 'Revolut Banking',
        body: 'Pay from your Revolut account to our official Revolut business account. Transfer details are provided by our admin team after you place your order — include your order reference when requesting details.',
        bullets: ['EUR settlement', 'Instant Revolut-to-Revolut transfers', '1-hour dispatch after payment verification']
      },
      {
        heading: 'Web3 Cryptocurrency (5% off)',
        body: 'Settle in USDT, BTC, or ETH with zero platform fees and an automatic 5% checkout discount. Wallet instructions are shared securely after order placement.',
        bullets: ['USDT (TRC-20 / ERC-20)', 'Bitcoin (BTC)', 'Ethereum (ETH)']
      },
      {
        heading: 'Payment security',
        body: 'All checkout sessions use 256-bit SSL encryption. We never store private wallet keys or full bank credentials on our servers.'
      }
    ],
    cta: { label: 'Go to Checkout', action: 'plp', target: 'camera-drones' }
  },
  {
    slug: 'order-information',
    path: '/help/order-information',
    title: 'Order Information',
    eyebrow: 'Help & Support',
    summary: 'How orders are registered, confirmed, and allocated from our Frankfurt European distribution hub.',
    sections: [
      {
        heading: 'Order confirmation',
        body: 'After checkout you receive an EU order reference (e.g. DJI-EU-XXXXX) and confirmation email. Orders remain in payment verification until SEPA, Revolut, or crypto settlement is matched.',
        bullets: ['Guest checkout — no account required', 'B2B company invoicing on request', 'Order history in Customer Account']
      },
      {
        heading: 'Allocation & serial numbers',
        body: 'Every aircraft and battery ships with factory OEM serial numbers eligible for DJI firmware activation and Care Refresh registration in the EU.',
        bullets: ['Frankfurt WMS allocation', 'CE conformity documentation included', 'Pre-flight activation guide in box']
      },
      {
        heading: 'Modify or cancel',
        body: 'Contact us within 2 hours of placement if you need to change the delivery address or cancel before dispatch. Once DHL collects the parcel, standard return policies apply.'
      }
    ],
    cta: { label: 'Track an Order', action: 'track' }
  },
  {
    slug: 'shipping-time',
    path: '/help/shipping-time',
    title: 'Shipping Time',
    eyebrow: 'Help & Support',
    summary: 'When your order leaves our European distribution hubs and how transit times are calculated.',
    sections: [
      {
        heading: 'Dispatch hubs',
        body: 'Inventory ships from Frankfurt CargoCity Süd and Amsterdam Schiphol Logistics for optimal EU transit times.',
        bullets: ['24–48h dispatch after payment clearance', 'Business-day handling Mon–Fri', 'SMS updates via DHL Express']
      },
      {
        heading: 'Shipping time and rules',
        body: 'Standard Shipping is selected at checkout. Once payment is verified, your order enters the warehouse queue. Most EU destinations receive tracking within 24–48 hours of dispatch.',
        bullets: [
          'Cut-off for same-day allocation: 14:00 CET on business days',
          'Remote and island postcodes may add 1–3 business days',
          'Enterprise bulk orders may ship in multiple parcels'
        ]
      },
      {
        heading: 'Peak season',
        body: 'During major product launches or holiday periods, dispatch may extend by one business day. We email proactively if your order is affected.'
      }
    ],
    cta: { label: 'View Shipping at Checkout', action: 'home' }
  },
  {
    slug: 'shipping-fees',
    path: '/help/shipping-fees',
    title: 'Delivery and Shipping Fee',
    eyebrow: 'Help & Support',
    summary: 'Standard European shipping via DHL, FedEx, DPD, GLS and regional partners — free express on qualifying orders.',
    sections: [
      {
        heading: 'Standard Shipping',
        body: 'All checkout orders use Standard Shipping with tracked door-to-door delivery. Carriers include DHL, FedEx, DPD, GLS, PostNL, and Hermes depending on destination and parcel size.',
        bullets: ['Carrier shown at checkout (Step 3)', 'Signature required on aircraft kits', 'Insurance included on orders above €500']
      },
      {
        heading: 'Free shipping threshold',
        body: 'Orders above the cart free-shipping threshold qualify for complimentary Standard Shipping across all EU member states, EFTA, and UK.',
        bullets: ['Threshold shown in cart summary', 'Applies to standard parcel weight bands', 'Oversized cinema kits quoted separately']
      },
      {
        heading: 'Remote area surcharges',
        body: 'Some Alpine, Nordic, and non-contiguous EU regions incur a small logistics surcharge calculated at checkout. “Any other country” destinations receive a custom quote before dispatch.'
      }
    ],
    cta: { label: 'View Shipping at Checkout', action: 'home' }
  },
  {
    slug: 'order-tracking',
    path: '/help/order-tracking',
    title: 'Order and Logistics Tracking',
    eyebrow: 'Help & Support',
    summary: 'Track your DJI Store EU shipment from warehouse allocation through final delivery.',
    sections: [
      {
        heading: 'When tracking activates',
        body: 'You receive a tracking number by email once DHL or your assigned carrier scans the parcel at our hub. Guest orders can track using order reference + email on our Track Order page.',
        bullets: ['Tracking link in shipment confirmation email', 'Live map on DHL Express where available', 'Customer Account shows full timeline']
      },
      {
        heading: 'Status updates',
        body: 'Typical milestones: Payment verified → Allocated → Picked & packed → Handed to carrier → In transit → Out for delivery → Delivered.',
        bullets: ['SMS alerts for DHL Express (where enabled)', 'Failed delivery: carrier leaves notice card', 'Contact us if tracking stalls 48h+']
      },
      {
        heading: 'Multiple parcels',
        body: 'Large orders (e.g. Inspire kits, enterprise bundles) may ship in separate boxes. Each parcel has its own tracking ID — check your email for all labels.'
      }
    ],
    cta: { label: 'Track an Order', action: 'track' }
  },
  {
    slug: 'delivery-inspection',
    path: '/help/delivery-inspection',
    title: 'Inspection and Sign',
    eyebrow: 'Help & Support',
    summary: 'What to check when your DJI hardware arrives and how carrier signature rules apply in Europe.',
    sections: [
      {
        heading: 'On delivery',
        body: 'Inspect the outer carton for crushing or tampering before signing. If damage is visible, note it on the carrier’s handheld device or delivery slip and photograph the packaging.',
        bullets: ['Do not refuse delivery without contacting us first', 'Keep all original packaging for 14-day returns', 'Report concealed damage within 48 hours']
      },
      {
        heading: 'Signature requirements',
        body: 'Aircraft kits, batteries, and orders above €500 require an adult signature in most EU countries. Carriers may leave parcels at pickup points if you authorise release in their app.',
        bullets: ['Business addresses: reception sign-off accepted', 'PO boxes not supported for lithium shipments', 'ID check in some markets for high-value goods']
      },
      {
        heading: 'Serial number check',
        body: 'Verify the OEM serial on the aircraft or battery matches your packing slip. Activate Care Refresh within 48 hours of first power-on where applicable.'
      }
    ],
    cta: { label: 'Contact Support', action: 'contact' }
  },
  {
    slug: 'shipping-faq',
    path: '/help/shipping-faq',
    title: 'Logistics and Order FAQ',
    eyebrow: 'Help & Support',
    summary: 'Common questions about European delivery, customs, and order changes.',
    sections: [
      {
        heading: 'Customs & import',
        body: 'Intra-EU shipments include all statutory duties in the invoice price. For Switzerland, Norway, and “Any other country” destinations our team confirms landed cost before dispatch.',
        bullets: ['EU/EEA: no import VAT at doorstep for B2C', 'UK: IOSS where applicable', 'CH/NO: quoted DAP or DDP on request']
      },
      {
        heading: 'Change delivery address',
        body: 'Contact us within 2 hours of order placement if the address is wrong. After dispatch, redirect via the carrier portal (fees may apply) or hold at depot.',
        bullets: ['Email sales@djii.eu with order reference', 'Address changes blocked after label print', 'Re-delivery fees charged by carrier']
      },
      {
        heading: 'Lost or delayed parcels',
        body: 'If tracking shows no movement for 48 hours after the expected scan, open a case via Customer Account or email. We lodge carrier investigations and arrange reshipment for confirmed losses.'
      }
    ],
    cta: { label: 'Track an Order', action: 'track' }
  },
  {
    slug: 'return-policy',
    path: '/help/return-policy',
    title: 'Return Policy',
    eyebrow: 'Help & Support',
    summary: '14-day EU statutory right of withdrawal for distance sales, plus factory warranty for hardware defects.',
    sections: [
      {
        heading: '14-day withdrawal (B2C)',
        body: 'European consumers may withdraw from a distance contract within 14 days of receipt without giving reasons. Products must be unused, in original OEM sealing where applicable, and include all accessories.',
        bullets: ['Return initiation via Customer Account', 'Prepaid DHL return label where eligible', 'Refund within 14 days of goods receipt']
      },
      {
        heading: 'Non-returnable items',
        body: 'Activated Care Refresh plans, downloaded digital licenses, and opened consumables (propellers installed for flight) may be excluded per EU consumer exceptions.',
        bullets: ['Factory-sealed drones: full refund', 'Defective on arrival: priority swap', 'B2B contracts: separate terms']
      },
      {
        heading: 'How to start a return',
        body: 'Open Customer Account → Orders → Request Return, or email our support team with your order reference and serial number photos.'
      }
    ],
    cta: { label: 'Open Customer Account', action: 'account' }
  },
  {
    slug: 'technical-support',
    path: '/help/technical-support',
    title: 'Technical Support',
    eyebrow: 'Help & Support',
    summary: 'Firmware, activation, flight app setup, and European regulatory guidance from certified support engineers.',
    sections: [
      {
        heading: 'Before you contact us',
        body: 'Check aircraft battery level, latest DJI Fly / DJI Pilot app version, and remote controller link status. Note your OEM serial number (inside battery bay or gimbal card).',
        bullets: ['DJI Fly for consumer drones', 'DJI Pilot for enterprise', 'Ronin app for gimbals']
      },
      {
        heading: 'What we cover',
        body: 'Store EU support handles activation errors, RTH failures, gimbal calibration, Care Refresh enrollment, and EASA registration questions for EU operators.',
        bullets: ['Live chat & email Mon–Sat', 'Remote diagnostic logs (with consent)', 'Escalation to DJI Europe R&D when required']
      },
      {
        heading: 'Response times',
        body: 'Critical flight-safety issues: within 4 business hours. General setup: within 1 business day. Enterprise fleet SLAs available for B2B accounts.'
      }
    ],
    cta: { label: 'Contact Support', action: 'contact' }
  },
  {
    slug: 'repair-services',
    path: '/help/repair-services',
    title: 'Repair Services',
    eyebrow: 'Help & Support',
    summary: 'Authorized European repair pipeline with genuine parts, traceable RMA, and Care Refresh express lanes.',
    sections: [
      {
        heading: 'Repair intake',
        body: 'Submit an RMA from Customer Account with fault description and crash telemetry (if available). We issue a prepaid DHL Express return waybill for EU addresses.',
        bullets: ['OEM parts only — no grey imports', 'Water damage assessment within 48h', 'Loaner units for enterprise (where stock permits)']
      },
      {
        heading: 'Care Refresh express',
        body: 'Active Care Refresh policies receive priority bench time, express return shipping, and flyaway replacement options per plan terms.',
        bullets: ['Express repair lane', 'Replacement unit dispatch', 'Coverage verification via serial']
      },
      {
        heading: 'Out-of-warranty',
        body: 'Fixed-price repair quotes are emailed before work begins. Payment via SEPA, Revolut, or crypto using the same rails as storefront checkout.'
      }
    ],
    cta: { label: 'Start an RMA', action: 'account' }
  },
  {
    slug: 'after-sales-policies',
    path: '/help/after-sales-policies',
    title: 'After-Sales Service Policies',
    eyebrow: 'Help & Support',
    summary: 'Warranty, Care Refresh, data privacy, and service level commitments for DJI Store EU customers.',
    sections: [
      {
        heading: '2-year EU statutory warranty',
        body: 'Hardware sold through djii.eu carries a minimum 24-month conformity guarantee under EU consumer law. Commercial operators receive parallel B2B warranty schedules on invoice.',
        bullets: ['Manufacturing defects covered', 'Normal wear excluded', 'Battery cycle limits per DJI spec']
      },
      {
        heading: 'Care Refresh',
        body: 'Optional accident protection bound to OEM serial. Must be activated within 48 hours of first power-on unless bundled at purchase.',
        bullets: ['1-year and 2-year plans', 'Flyaway coverage tiers', 'Transferable on resale (conditions apply)']
      },
      {
        heading: 'Data & telemetry',
        body: 'Flight logs submitted for RMA are processed under GDPR Article 6(1)(b) for contract performance and deleted after case closure unless you opt in to retention.'
      }
    ],
    cta: { label: 'Browse Care Plans', action: 'plp', target: 'power-care' }
  },
  {
    slug: 'store-credit',
    path: '/programs/store-credit',
    title: 'Store EU Credit',
    eyebrow: 'Programs',
    summary: 'Earn and redeem Store EU Credit on accessories, Care plans, and upgrade bundles across the European catalog.',
    sections: [
      {
        heading: 'How you earn',
        body: 'Flight Club members earn credit on every fulfilled order, referral activations, and seasonal campaigns. Credit posts after the statutory return window closes.',
        bullets: ['1 credit point ≈ €1 redeemable value', 'Bonus multipliers on handheld launches', 'B2B volume rebates stack separately']
      },
      {
        heading: 'Redemption',
        body: 'Apply credit at checkout on eligible SKUs (accessories, batteries, ND filters, Care Refresh). Credit cannot offset shipping surcharges or third-party bundles.',
        bullets: ['12-month expiry from issue date', 'Non-transferable between accounts', 'Shown in Customer Account wallet']
      }
    ],
    cta: { label: 'Open Customer Account', action: 'account' }
  },
  {
    slug: 'store-app',
    path: '/programs/store-app',
    title: 'DJI Store EU App',
    eyebrow: 'Programs',
    summary: 'Mobile companion for order tracking, Care enrollment, and personalized catalog alerts — PWA-ready for iOS and Android.',
    sections: [
      {
        heading: 'Features',
        body: 'Track DHL shipments live, save wishlists, receive restock push notifications, and scan serial numbers for instant warranty lookup.',
        bullets: ['Install from browser (Add to Home Screen)', 'Biometric login optional', 'Offline order history cache']
      },
      {
        heading: 'Availability',
        body: 'Progressive Web App rolling out across EU locales (EN, DE, FR, ES, IT, NL). Native App Store listing planned for Q4 2026.'
      }
    ],
    cta: { label: 'Browse on Mobile', action: 'home' }
  },
  {
    slug: 'pilot-gallery',
    path: '/explore/pilot-gallery',
    title: 'Pilot Gallery',
    eyebrow: 'Explore',
    summary: 'Curated aerial cinema, FPV, and mapping work from European DJI pilots — submit your flights to be featured.',
    sections: [
      {
        heading: 'Featured categories',
        body: 'Mountain FPV, coastal mapping, wedding cinema, and infrastructure inspection reels from creators in Germany, France, Italy, and the Nordics.',
        bullets: ['4K/8K ProRes showcases', 'Monthly editor picks', 'Creator gear lists linked to catalog']
      },
      {
        heading: 'Submit content',
        body: `Email ${SUPPORT_EMAIL} with flight location (country), aircraft model, and a download link. By submitting you grant DJI Store EU a non-exclusive web display license.`
      }
    ],
    cta: { label: 'Shop Creator Kits', action: 'plp', target: 'camera-drones' }
  },
  {
    slug: 'community',
    path: '/explore/community',
    title: 'Community Forum',
    eyebrow: 'Explore',
    summary: 'Connect with European pilots, share LUTs, discuss EASA airspace changes, and get peer advice on cinematic setups.',
    sections: [
      {
        heading: 'Discussion channels',
        body: 'Moderated channels for Mini & Mavic owners, FPV builders, Ronin operators, and enterprise survey teams.',
        bullets: ['English & German primary languages', 'No spam / affiliate links', 'Official moderators on weekdays']
      },
      {
        heading: 'Join',
        body: 'Community access is included with any fulfilled Store EU order. Register using the same email as checkout to unlock verified-pilot badges.'
      }
    ],
    cta: { label: 'Create Account', action: 'account' }
  },
  {
    slug: 'buying-guides',
    path: '/explore/buying-guides',
    title: 'Buying Guides',
    eyebrow: 'Explore',
    summary: 'Choose the right drone, gimbal, or power station for travel, cinema, inspection, and content creation in Europe.',
    sections: [
      {
        heading: 'Drone selector',
        body: 'Under 249g travel (Mini), dual-camera pro (Air), flagship triple-camera (Mavic), immersive FPV (Avata), or 8K cinema (Inspire).',
        bullets: ['Compare up to 4 models side-by-side', 'EASA class labels explained', 'Accessory bundles pre-matched']
      },
      {
        heading: 'Handheld & power',
        body: 'Pocket 3 for vlogging, Action 5 Pro for adventure POV, RS gimbals for mirrorless, Power 1000 for location charging.'
      }
    ],
    cta: { label: 'Compare Models', action: 'compare' }
  },
  {
    slug: 'fly-safe',
    path: '/explore/fly-safe',
    title: 'Fly Safe',
    eyebrow: 'Explore',
    summary: 'European operational safety: geofencing, Remote ID, weather limits, and pre-flight checklists for DJI aircraft.',
    sections: [
      {
        heading: 'Regulatory basics',
        body: 'Operate within EASA Open, Specific, or Certified categories. Register as UAS operator in your member state before first camera flight where required.',
        bullets: ['120m AGL default limit', 'No flight over assemblies of people', 'Night ops need Specific category approval']
      },
      {
        heading: 'DJI safety tools',
        body: 'Use AirSense ADS-B alerts, APAS obstacle avoidance, and Return-to-Home with adequate battery reserve. Keep firmware current for geofence databases.',
        bullets: ['Pre-flight checklist in DJI Fly', 'GEO zone unlock for authorized ops', 'Insurance recommended in DE/FR/AT']
      }
    ],
    cta: { label: 'Read EASA Class Guide', action: 'easa' }
  },
  {
    slug: 'flying-tips',
    path: '/explore/flying-tips',
    title: 'Flying Tips',
    eyebrow: 'Explore',
    summary: 'Cinematic movement, battery care, ND filter selection, and European seasonal flying advice from our pilot team.',
    sections: [
      {
        heading: 'Cinematic moves',
        body: 'Master tripod mode, course lock, and point-of-interest orbits. Shoot D-Log or 10-bit when grading in DaVinci Resolve or Premiere.',
        bullets: ['180° shutter rule for natural motion', 'ND8–ND64 for sunny EU summers', 'Hyperlapse for city tourism reels']
      },
      {
        heading: 'Battery & storage',
        body: 'Store Intelligent Flight Batteries at 50–60% charge for transit. Allow warm-up in sub-zero Alpine or Nordic conditions before aggressive maneuvers.',
        bullets: ['Cycle batteries every 90 days in storage', 'Use official charging hubs', 'Never ship in checked luggage (IATA SP A123)']
      }
    ],
    cta: { label: 'Shop ND Filters', action: 'plp', target: 'accessories' }
  },
  {
    slug: 'who-we-are',
    path: '/company/who-we-are',
    title: 'Who We Are',
    eyebrow: 'Company',
    summary:
      'DJI Store EU (djii.eu) is the authorized European distribution portal for DJI consumer, prosumer, and enterprise aerial systems.',
    sections: [
      {
        heading: 'Our mission',
        body: 'Deliver factory-sealed European inventory with genuine serial numbers, CE documentation, and localized support — from first unboxing to fleet scale.',
        bullets: ['Frankfurt headquarters & WMS', 'Amsterdam secondary hub', 'Enterprise cinema & survey verticals']
      },
      {
        heading: 'Authorisation',
        body: 'We operate as an independent authorized distributor within the European DJI commercial network. Products are sourced through official supply channels only — no grey imports.'
      }
    ],
    cta: { label: 'Browse Catalog', action: 'plp', target: 'all' }
  },
  {
    slug: 'contact',
    path: '/company/contact',
    title: 'Contact Us',
    eyebrow: 'Company',
    summary: 'Sales, payment instructions, technical support, and B2B fleet enquiries for the European market.',
    sections: [
      {
        heading: 'General & sales',
        body: `Email ${SUPPORT_EMAIL} for product availability, payment instructions, and order amendments. Include your order reference when applicable.`,
        bullets: ['Mon–Sat 09:00–18:00 CET', 'English, German, French support', 'B2B fleet quotes within 24h']
      },
      {
        heading: 'Visit our hub',
        body: 'DJI Store EU Distribution — Frankfurt CargoCity Süd, 60549 Frankfurt am Main, Germany. Visits by appointment for enterprise clients and press.',
        bullets: ['EORI: DE884210992', 'DHL Express pickup daily', 'No walk-in retail at logistics hub']
      },
      {
        heading: 'Privacy',
        body: 'Data protection enquiries: privacy@djii.eu — EU representative for GDPR requests under Article 27.'
      }
    ],
    cta: { label: 'Email Sales', action: 'contact' }
  },
  {
    slug: 'careers',
    path: '/company/careers',
    title: 'Careers',
    eyebrow: 'Company',
    summary: 'Join our European ecommerce, logistics, and aerial solutions team based in Frankfurt and remote across the EU.',
    sections: [
      {
        heading: 'Open disciplines',
        body: 'We hire for commerce engineering, warehouse operations, enterprise sales, content production, and customer support — drone experience a plus, not always required.',
        bullets: ['Hybrid Frankfurt / remote EU', 'English working language', 'Employee drone discount program']
      },
      {
        heading: 'Apply',
        body: `Send CV and portfolio (if applicable) to ${SUPPORT_EMAIL} with subject line “Careers — [Role]”. We respond to shortlisted candidates within two weeks.`
      }
    ],
    cta: { label: 'Contact HR', action: 'contact' }
  },
  {
    slug: 'flagship-stores',
    path: '/company/flagship-stores',
    title: 'Flagship Stores',
    eyebrow: 'Company',
    summary: 'Experience DJI products in person at partner flagship locations across Europe — hands-on flight sims and pro demos.',
    sections: [
      {
        heading: 'Partner locations',
        body: 'Official DJI branded experiences in select European capitals. Store EU online orders can be collected where partner click-and-collect is enabled.',
        bullets: ['Frankfurt partner lounge (by appointment)', 'Paris Champs-Élysées partner zone', 'Amsterdam Schiphol transit pop-up (seasonal)']
      },
      {
        heading: 'Online-first',
        body: 'djii.eu remains our primary storefront for full catalog depth, crypto discount, and EU-wide DHL delivery. Flagship partners may not stock every SKU — check online availability first.'
      }
    ],
    cta: { label: 'Shop Online', action: 'home' }
  }
];

export const CONTENT_PAGE_BY_SLUG: Record<string, ContentPageDefinition> = Object.fromEntries(
  STORE_CONTENT_PAGES.map((page) => [page.slug, page])
);

export const CONTENT_PAGE_BY_PATH: Record<string, ContentPageDefinition> = Object.fromEntries(
  STORE_CONTENT_PAGES.map((page) => [page.path, page])
);

export function resolveContentSlug(slug: string): string {
  return CONTENT_SLUG_ALIASES[slug] ?? slug;
}

export function resolveContentPath(path: string): string {
  const normalized = path.replace(/\/+$/, '') || '/';
  return CONTENT_PATH_ALIASES[normalized] ?? normalized;
}

export function getContentPageBySlug(slug: string): ContentPageDefinition | undefined {
  return CONTENT_PAGE_BY_SLUG[resolveContentSlug(slug)];
}

export function getContentPageByPath(path: string): ContentPageDefinition | undefined {
  const normalized = resolveContentPath(path.replace(/\/+$/, '') || '/');
  return CONTENT_PAGE_BY_PATH[normalized];
}
