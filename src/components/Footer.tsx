import React from 'react';
import { ShieldCheck, Truck, CreditCard, Award } from 'lucide-react';
import { BrandLogo } from './brand/BrandLogo';
import { useStore } from '../context/StoreContext';
import { hrefFromStoreLink, type StoreLinkHref } from '../lib/routing';

type FooterLink = StoreLinkHref & { label: string };

const PRODUCT_LINKS: FooterLink[] = [
  { label: 'Camera Drones', kind: 'plp', category: 'camera-drones' },
  { label: 'Handheld', kind: 'plp', category: 'handheld' },
  { label: 'Education & Industry', kind: 'plp', category: 'professional' },
  { label: 'Service', kind: 'view', mode: 'account' },
  { label: 'Accessories', kind: 'plp', category: 'accessories' }
];

const SUPPORT_LINKS: FooterLink[] = [
  { label: 'Payment Methods', kind: 'content', slug: 'payment-methods' },
  { label: 'Order Information', kind: 'content', slug: 'order-information' },
  { label: 'Shipping & Delivery', kind: 'content', slug: 'shipping-fees' },
  { label: 'Return Policy', kind: 'content', slug: 'return-policy' },
  { label: 'Technical Support', kind: 'content', slug: 'technical-support' },
  { label: 'Repair Services', kind: 'content', slug: 'repair-services' },
  { label: 'After-Sales Service Policies', kind: 'content', slug: 'after-sales-policies' }
];

const PROGRAM_LINKS: FooterLink[] = [
  { label: 'Store EU Credit', kind: 'content', slug: 'store-credit' },
  { label: 'Official Refurbished', kind: 'refurbished' },
  { label: 'Store EU App', kind: 'content', slug: 'store-app' }
];

const EXPLORE_LINKS: FooterLink[] = [
  { label: 'Pilot Gallery', kind: 'content', slug: 'pilot-gallery' },
  { label: 'Community Forum', kind: 'content', slug: 'community' },
  { label: 'Buying Guides', kind: 'content', slug: 'buying-guides' },
  { label: 'Fly Safe', kind: 'content', slug: 'fly-safe' },
  { label: 'Flying Tips', kind: 'content', slug: 'flying-tips' }
];

const COMPANY_LINKS: FooterLink[] = [
  { label: 'Who We Are', kind: 'content', slug: 'who-we-are' },
  { label: 'Contact Us', kind: 'content', slug: 'contact' },
  { label: 'Careers', kind: 'content', slug: 'careers' },
  { label: 'Flagship Stores', kind: 'content', slug: 'flagship-stores' }
];

function FooterLinkList({ title, links }: { title: string; links: FooterLink[] }) {
  const { navigateToContent, navigateToPlp, setViewMode, setAccountActiveTab } = useStore();

  const handleClick = (link: FooterLink, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    switch (link.kind) {
      case 'content':
        navigateToContent(link.slug);
        break;
      case 'plp':
        navigateToPlp(link.category, link.series);
        break;
      case 'refurbished':
        navigateToPlp('refurbished');
        break;
      case 'view':
        if (link.mode === 'account') setAccountActiveTab('dashboard');
        setViewMode(link.mode);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">{title}</h4>
      <ul className="space-y-2 text-xs">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={hrefFromStoreLink(link)}
              onClick={(event) => handleClick(link, event)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Footer: React.FC = () => {
  const { navigateToContent } = useStore();

  return (
    <footer className="bg-[#111113] text-gray-400 text-sm border-t border-gray-800">
      <div className="border-b border-gray-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-gray-800 text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">2-Year Official EU Warranty</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Full statutory 24-month European warranty with certified authorized technicians.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-gray-800 text-blue-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">24h–48h European Express</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Dispatched from Frankfurt and Amsterdam via DHL, FedEx, DPD, GLS & partners.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-gray-800 text-amber-400 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">SEPA & Web3 Crypto</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Official bank wire settlement plus 5% off cryptocurrency checkout.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-gray-800 text-rose-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">EASA European Compliance</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  CE-certified aircraft aligned with EU Regulations 2019/947 and 2019/945.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <FooterLinkList title="Products" links={PRODUCT_LINKS} />
          <FooterLinkList title="Help & Support" links={SUPPORT_LINKS} />
          <FooterLinkList title="Programs" links={PROGRAM_LINKS} />
          <FooterLinkList title="Explore" links={EXPLORE_LINKS} />
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-wrap">
            <BrandLogo variant="light" className="h-7" />
            {COMPANY_LINKS.map((link) => (
              <a
                key={link.label}
                href={hrefFromStoreLink(link)}
                onClick={(event) => {
                  event.preventDefault();
                  if (link.kind === 'content') navigateToContent(link.slug);
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
            <span className="bg-gray-800 px-2 py-1 rounded text-gray-300 font-semibold">SEPA Wire</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-emerald-400 font-semibold">USDT · BTC · ETH</span>
          </div>
        </div>

        <div className="mt-6 text-[11px] text-gray-500 space-y-1">
          <p>🏢 Frankfurt CargoCity Süd, 60549 Frankfurt am Main, Germany · EORI: DE884210992</p>
          <p>© 2026 DJI Store EU (djii.eu). Authorized European Distribution Network.</p>
        </div>
      </div>
    </footer>
  );
};
