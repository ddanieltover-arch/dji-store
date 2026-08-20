import React from 'react';
import {
  Award,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ExternalLink,
  ChevronRight,
  Plane
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const EasaGuidePage: React.FC = () => {
  const { navigateToPlp } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#111113] text-white rounded-3xl p-8 sm:p-12 border border-gray-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" /> Official European Aviation Safety Agency (EASA) Standard
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          European Drone Regulation & Class Guide (2026)
        </h1>
        <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
          All drones sold on <strong>DJI Store EU (djii.eu)</strong> are 100% compliant with EU Regulations 2019/947 and 2019/945. Review this reference guide to understand flight category rights, certification labels, and registration duties across all 27 EU member states.
        </p>
      </div>

      {/* Class Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Class C0 */}
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 shadow-sm space-y-4 relative">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
              Class C0 (&lt;249g)
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">No Pilot Exam</span>
          </div>

          <h3 className="text-xl font-black text-gray-900">DJI Mini Series</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            The simplest way to fly in Europe. Requires no remote pilot certificate exam (A1/A3 test not mandatory for flight, only basic operator registration if equipped with a camera).
          </p>

          <div className="space-y-2 text-xs text-gray-700 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Fly in Open Category A1</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>May overfly uninvolved people (no crowds)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Max Altitude: 120m (400ft) AGL</span>
            </div>
          </div>

          <button
            onClick={() => navigateToPlp('camera-drones')}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
          >
            Shop Mini 4 Pro (&lt;249g) →
          </button>
        </div>

        {/* Class C1 */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase">
              Class C1 (&lt;900g)
            </span>
            <span className="text-[11px] text-blue-600 font-bold">Online A1/A3 Exam</span>
          </div>

          <h3 className="text-xl font-black text-gray-900">Mavic 4 Pro & Air 3S</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Professional triple-camera aircraft. Requires completing a free online A1/A3 proof of competency exam via your national aviation authority (LBA, DGAC, etc.).
          </p>

          <div className="space-y-2 text-xs text-gray-700 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Fly in Open Subcategory A1</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Active Remote ID (DRI) built-in</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Do not deliberately fly over crowds</span>
            </div>
          </div>

          <button
            onClick={() => navigateToPlp('camera-drones')}
            className="w-full py-2.5 rounded-xl bg-[#1D1D1F] hover:bg-black text-white font-bold text-xs transition-colors"
          >
            Shop Mavic 4 Pro (C1) →
          </button>
        </div>

        {/* Class C2 & Pro */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase">
              Class C2 / Open A2
            </span>
            <span className="text-[11px] text-amber-600 font-bold">A2 Certificate</span>
          </div>

          <h3 className="text-xl font-black text-gray-900">Inspire 3 & Cinema</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Full-frame 8K cinema gear. Designed for commercial production and aerial filming within 30 meters of uninvolved bystanders.
          </p>

          <div className="space-y-2 text-xs text-gray-700 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Fly in Open A2 (30m standoff)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Low-speed mode (3m standoff)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Requires Remote Pilot A2 license</span>
            </div>
          </div>

          <button
            onClick={() => navigateToPlp('professional')}
            className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors"
          >
            Explore Cinema Systems →
          </button>
        </div>
      </div>

      {/* 4 European Golden Rules */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-gray-900">
          The 4 Golden Rules for Flying in Europe
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900">1. Maximum Altitude: 120m (400ft)</h4>
            <p className="text-gray-500">
              Never exceed 120 meters above ground level (AGL) unless you have special operational authorization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900">2. Visual Line of Sight (VLOS)</h4>
            <p className="text-gray-500">
              Keep the aircraft in unaided visual contact at all times. FPV pilots must fly with a visual observer standing beside them.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900">3. Operator Registration (e-ID)</h4>
            <p className="text-gray-500">
              Register yourself on your national aviation portal (e.g. Luftfahrt-Bundesamt in Germany) and broadcast your e-ID number in the DJI Fly app.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900">4. Third-Party Drone Insurance</h4>
            <p className="text-gray-500">
              Third-party liability insurance is mandatory in most EU states (e.g. Germany, Austria, France).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
