import React from 'react';
import { ShieldCheck, Truck, CreditCard, RefreshCw, Mail, ExternalLink, Award } from 'lucide-react';
import { BrandLogo } from './brand/BrandLogo';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setViewMode, navigateToPlp } = useStore();

  return (
    <footer className="bg-[#111113] text-gray-400 text-sm border-t border-gray-800">
      {/* Top Value Proposition Row */}
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
                  Full statutory 24-month European warranty with certified DJI authorized technicians.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-gray-800 text-blue-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">24h-48h DHL Express</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Fast dispatched from our Frankfurt and Amsterdam central European logistics hubs.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-gray-800 text-amber-400 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Official SEPA & Crypto</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  German corporate bank wire (Deutsche Bank AG) and instant zero-fee Web3 crypto settlement.
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
                  100% compliant with EU Regulation 2019/947 and 2019/945 for Class C0, C1 and C2 flight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo variant="light" className="h-8" />
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Official European commercial distribution portal for DJI consumer, professional cinema, and enterprise aerial systems. All products feature factory OEM serial numbers and European CE certifications.
            </p>
            <div className="pt-2 text-xs text-gray-500 space-y-1">
              <p>🏢 Distribution Hub: Frankfurt CargoCity Süd, 60549 Frankfurt am Main, Germany</p>
              <p>🏛️ European VAT Reg: DE349882109 • EORI: DE884210992</p>
            </div>
          </div>

          {/* Col 2: Products */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Drone Systems
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateToPlp('camera-drones')}
                  className="hover:text-white transition-colors"
                >
                  DJI Mavic 4 Pro (8K Flagship)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPlp('camera-drones')}
                  className="hover:text-white transition-colors"
                >
                  DJI Air 3S (Dual 1-Inch)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPlp('camera-drones')}
                  className="hover:text-white transition-colors"
                >
                  DJI Mini 4 Pro (&lt;249g C0)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPlp('camera-drones')}
                  className="hover:text-white transition-colors"
                >
                  DJI Avata 2 (FPV Motion)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPlp('professional')}
                  className="hover:text-white transition-colors"
                >
                  DJI Inspire 3 (8K Cinema RAW)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Handheld & Accessories */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Gimbals & Power
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateToPlp('handheld')}
                  className="hover:text-white transition-colors"
                >
                  DJI Osmo Pocket 3
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPlp('handheld')}
                  className="hover:text-white transition-colors"
                >
                  DJI Osmo Action 5 Pro
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPlp('accessories')}
                  className="hover:text-white transition-colors"
                >
                  Intelligent Flight Batteries
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPlp('accessories')}
                  className="hover:text-white transition-colors"
                >
                  DJI RC 2 Display Remote
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPlp('accessories')}
                  className="hover:text-white transition-colors"
                >
                  DJI Care Refresh Protection
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: European Support & Tools */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Customer & Operations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setViewMode('account')}
                  className="hover:text-white text-blue-400 font-medium transition-colors"
                >
                  👤 Customer Account & Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('account')}
                  className="hover:text-white transition-colors"
                >
                  🛡️ Warranty & Care Claims
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('account')}
                  className="hover:text-white transition-colors"
                >
                  🔄 14-Day Returns & RMA
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('track-order')}
                  className="hover:text-white transition-colors"
                >
                  📦 Live DHL Shipment Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('easa-guide')}
                  className="hover:text-white text-emerald-400 font-medium transition-colors"
                >
                  🇪🇺 EASA Flight Class Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('compare')}
                  className="hover:text-white transition-colors"
                >
                  ⚖️ Side-by-Side Model Compare
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('admin')}
                  className="hover:text-white text-[#E30613] font-medium transition-colors"
                >
                  ⚙️ Admin Operations Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('ai-operations')}
                  className="hover:text-white text-purple-400 font-semibold transition-colors flex items-center gap-1"
                >
                  ✨ AI Operations & Command Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('security-ops')}
                  className="hover:text-white text-emerald-400 font-semibold transition-colors"
                >
                  🛡 Security, GDPR & Disaster Recovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('sre-ops')}
                  className="hover:text-white text-cyan-400 font-semibold transition-colors"
                >
                  ⚡ SRE, Performance & Edge Reliability
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('qa-ops')}
                  className="hover:text-white text-orange-400 font-semibold transition-colors"
                >
                  🧪 QA, Testing & Release Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('launch-ops')}
                  className="hover:text-white text-rose-400 font-semibold transition-colors"
                >
                  🚀 Go-Live, Cutover & Hypercare
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('blueprint-ops')}
                  className="hover:text-white text-amber-400 font-semibold transition-colors"
                >
                  📜 Master Blueprint & Certification
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewMode('pim-ops')}
                  className="hover:text-white text-sky-400 font-semibold transition-colors"
                >
                  📦 PIM, Catalog Sync & Product Intelligence
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Payment Badges */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            © 2026 DJI Store EU (djii.eu). All rights reserved. Authorized European Distribution Network.
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center space-x-3 text-gray-400 text-[11px]">
            <span className="bg-gray-800 px-2 py-1 rounded text-white font-semibold">SEPA Direct Wire</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-emerald-400 font-semibold">USDT (TRC20 / ERC20)</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-amber-400 font-semibold">Bitcoin (BTC)</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-blue-400 font-semibold">Ethereum (ETH)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
